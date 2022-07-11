<template>
  <div>
    <vxe-grid v-bind="gridOptions" :data="data" ref="tableRef">
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add">
          {{ $t('text.choice') }}
        </el-button>
      </template>
      <template #elInput="{ row, column }">
        <el-form :model="row">
          <el-form-item
            :prop="column.property"
            :rules="[
              {
                required: true,
                message: `${column.title + $t('text.cannot_be_empty')}`,
                trigger: ['blur', 'change'],
              },
            ]"
          >
            <el-input
              type="number"
              min="0"
              v-model="row[column.property]"
              :placeholder="$t('text.please_enter')"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #elSelect="{ row, column }">
        <el-select
          size="small"
          v-model="row[column.property]"
          :placeholder="$t('text.please_enter')"
          clearable
          @clear="() => (row[column.property] = undefined)"
        >
          <el-option v-for="item in cptList(row)" :key="item" :label="item" :value="item" />
        </el-select>
      </template>
      <template #select="{ row, column }">
        <el-select v-model="row[column.property]" :placeholder="$t('text.please_select')">
          <el-option :label="$t('text.yes')" :value="true" />
          <el-option :label="$t('text.no')" :value="false" />
        </el-select>
      </template>
      <template #delete="{ row }">
        <vxe-button @click="deleteRow(row)" type="text" status="primary">
          <i class="el-icon-delete" />
        </vxe-button>
      </template>
      <template #pager />
    </vxe-grid>
    <AddProject v-model:isShow="isShow" :oldData="data" @updateData="updateData" />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, ref, toRefs, computed, inject, Ref } from 'vue'
  import AddProject from './addResources.vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'project',
    components: {
      VxeTable,
      AddProject,
    },
    props: {
      oldData: {
        default: () => [],
        type: Array,
      },
    },
    emits: ['update:oldData'],
    setup(props, { emit }) {
      const route = useRoute(),
        { t } = useI18n()
      const isDetail: { value: boolean } = inject('isDetail')
      const airplaneTypesAllList = inject<Ref>('airplaneTypesAllList')

      const tableRef = ref()
      let data = computed<any[]>({
        get() {
          return props.oldData
        },
        set(val) {
          emit('update:oldData', val)
        },
      })
      const formatUnit = ({ cellValue }) => cellValue + ' / ' + t('text.hour')
      const state = reactive({
        gridOptions: {
          columns: [
            // { type: "checkbox", width: 50 },
            { type: 'seq', width: 60, title: t('text.seq') },

            {
              field: 'name',
              title: t('text.resource_name'),
              // sortable: true,
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'airplaneType',
              title: t('text.model'),
              // width:300
              minWidth: 100,
              //  cellRender: !isDetail.value
              //     ? {
              //           name: "$select",
              //           options: airplaneTypesAllList.value,
              //           props: { placeholder: t('text.please_select') },
              //       }
              //     : undefined,
              slots: !isDetail.value
                ? {
                    default: 'elSelect',
                  }
                : undefined,
            },

            {
              field: 'price',
              title: t('text.training_unit_price'),
              minWidth: 100,
              // slots: {
              //     default: "elInput",
              // },
              cellRender: !isDetail.value
                ? {
                    name: '$input',
                    props: {
                      type: 'float',
                      digits: 2,
                      min: 0,
                      step: 1,
                      placeholder: t('text.please_enter'),
                    },
                  }
                : undefined,
            },
            {
              // sortable: true,
              field: 'unit',
              title: t('text.settlement_unit'),
              minWidth: 100,
              formatter: formatUnit,
            },
            route.params.type !== 'detail' && {
              title: t('text.operation'),
              width: 50,
              slots: { default: 'delete' },
              field: 'operationTypes',
              // fixed:'right'
            },
          ],
          editRules: {
            price: [{ required: true, message: t('text.please_enter') }],
          },
          // editConfig: {
          //     trigger: "click",
          //     mode: "cell",
          // },
          // data: [],

          toolbarConfig: !isDetail.value
            ? {
                // custom: true,
                size: 'medium',
                perfect: true,
                slots: {
                  tools: 'toolbar_tools',
                },
              }
            : undefined,
        } as VxeGridProps,
        isShow: false,
      })
      const methods = reactive({
        add() {
          state.isShow = true
        },
        async updateData(val) {
          let arr = JSON.parse(JSON.stringify(data.value))
          data.value = [
            ...arr,
            ...val.map((v) => {
              v.price = 0.0
              v.resourceId = v.id
              delete v.id
              return v
            }),
          ]
        },
        deleteRow(row) {
          data.value.splice(
            data.value.findIndex(
              (v) => v.resource?.id == row.resource?.id && v.airplaneType == row.airplaneType,
            ),
            1,
          )
          data.value = [...data.value]
        },
      })

      const selectAir = computed(() =>
        data.value.filter((v) => v.builtinResource == 'SIMULATOR').map((v) => v.airplaneType),
      )
      const cptList = computed(
        () => (value: { airplaneType: string; builtinResource: string }) =>
          value.builtinResource !== 'SIMULATOR'
            ? airplaneTypesAllList.value
            : airplaneTypesAllList.value.filter(
                (v) => !selectAir.value.filter((i) => i !== value.airplaneType).includes(v),
              ),
      )
      return {
        ...toRefs(state),
        ...toRefs(methods),
        data,
        tableRef,
        cptList,
      }
    },
  })
</script>

<style scoped></style>
