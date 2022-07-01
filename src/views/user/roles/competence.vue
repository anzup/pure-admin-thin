<template>
  <div class="h-full">
    <vxe-grid v-bind="gridOptions">
      <template #radio="{ row }">
        <el-radio-group v-model="row.authorized">
          <el-radio :label="true">{{ t('state.display') }}</el-radio>
          <el-radio :label="false">{{ t('state.hide') }}</el-radio>
        </el-radio-group>
      </template>
      <template #auth="{ row }">
        <template v-if="row.children">
          <el-checkbox
            v-for="item in row.children"
            v-model="item.authorized"
            :disabled="!row.authorized"
            >{{ item.name }}
          </el-checkbox>
        </template>
      </template>
      <template #bottom>
        <div class="w-full py-4 text-center">
          <el-button @click="$router.back()">
            {{ t('button.back') }}
          </el-button>
          <el-button type="primary" @click="confirm">
            {{ t('button.save') }}
          </el-button>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { VxeGridProps, VxeTablePropTypes } from 'vxe-table'
  import XEUtils from 'xe-utils'
  import { getRolesAuthConfigs, postRolesAuthConfigs, RolesAuth } from '/@/api/roles'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from '/@/hooks/useI18n'

  const { t } = useI18n()

  interface RolesAuthTree extends RolesAuth {
    children: RolesAuthTree[]
  }

  // 通用行合并函数（将相同多列数据合并为一行）
  const rowspanMethod: VxeTablePropTypes.SpanMethod = ({ row, _rowIndex, column, visibleData }) => {
    const fields = ['name0', 'name1', 'name2']
    const cellValue = row[column.field]
    if (cellValue && fields.includes(column.field)) {
      const prevRow = visibleData[_rowIndex - 1]
      let nextRow = visibleData[_rowIndex + 1]
      if (prevRow && prevRow[column.field] === cellValue) {
        return { rowspan: 0, colspan: 0 }
      } else {
        let countRowspan = 1
        while (nextRow && nextRow[column.field] === cellValue) {
          nextRow = visibleData[++countRowspan + _rowIndex]
        }
        if (countRowspan > 1) {
          return { rowspan: countRowspan, colspan: 1 }
        }
      }
    }
  }

  const gridOptions = reactive<VxeGridProps>({
    height: 'auto',
    columns: [
      {
        title: t('state.firstLevelAuthority'),
        field: 'name0',
        width: 150,
      },
      {
        title: t('state.secondaryAuthority'),
        field: 'name1',
        width: 150,
      },
      {
        title: t('state.thirdLevelAuthority'),
        field: 'name2',
        width: 150,
      },
      {
        title: t('state.functionalPermissions'),
        field: 'authorized',
        width: 200,

        slots: {
          default: 'radio',
        },
      },
      {
        title: t('state.operationAuthority'),
        field: 'name3',
        slots: {
          default: 'auth',
        },
        minWidth: 200,
      },
    ],
    spanMethod: rowspanMethod,
  })

  // 将普通树结构转换为横向树列表
  const toColTreeData = (treeData: RolesAuthTree[]) => {
    const options = { children: 'children' }
    const list: any[] = []
    const keyMap: any = {}
    XEUtils.eachTree<RolesAuthTree>(
      treeData,
      (item, index, result, paths, parent, nodes) => {
        keyMap[item.authCode] = item
        item.keys = parent ? parent.keys.concat([item.authCode]) : [item.authCode]
        //判断为树节点的最后一层或者无子权限的层级
        if (
          item?.children?.[0]?.authCode.includes(':') ||
          (!item.children && !item.authCode.includes(':'))
        ) {
          const row: any = {}
          item.keys.forEach((key: any, index: number) => {
            const obj = keyMap[key]
            //最后一级且有子元素
            if (index === item.keys.length - 1 && item?.children)
              row.children = item.children.map((v) => ({
                ...v,
                name: v.name.replace(/.*?:/, ''),
              }))
            row[`authCode${index}`] = obj.authCode
            row[`name${index}`] = obj.name as string
            row.authorized = (item.keys as string[]).every((v) => keyMap[v]?.authorized)
            //一级权限字段
            !row.rootAuthCode && (row.rootAuthCode = key)
            row.lastIndex = index
          })

          list.push(row)
        }
      },
      options,
    )
    gridOptions.data = list
  }
  const route = useRoute(),
    router = useRouter()
  const confirm = () => {
    const map = new Map<string, any>()
    gridOptions.data.forEach((item: RolesAuth & { lastIndex: number; children?: RolesAuth[] }) => {
      for (let i = 0; i <= item.lastIndex; i++) {
        if (map.has(item['authCode' + i])) {
          const obj = map.get(item['authCode' + i])
          !obj.authorized && (obj.authorized = item.authorized)
        } else {
          map.set(item['authCode' + i], {
            authCode: item['authCode' + i],
            authorized: item.authorized,
          })
        }
      }
      item.children &&
        item.children.forEach((v: RolesAuth) => {
          if (map.has(v.authCode)) return
          map.set(v.authCode, {
            authCode: v.authCode,
            authorized: v.authorized,
          })
        })
    })
    postRolesAuthConfigs(route.query.id as unknown as number, [...map.values()]).then((res) => {
      router.back()
    })
  }

  onMounted(() => {
    getRolesAuthConfigs(route.query.id as unknown as number).then((res) => {
      //  把列表转为树
      const treeData: RolesAuthTree[] = XEUtils.toArrayTree<RolesAuthTree>(res.data as any, {
        key: 'authCode',
        parentKey: 'superiorAuthCode',
        strict: true,
      })
      //  把树拉平
      toColTreeData(treeData)
    })
  })
</script>

<style scoped></style>
