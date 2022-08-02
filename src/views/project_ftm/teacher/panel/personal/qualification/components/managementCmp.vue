<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    :buttons="operateButtons"
    :span-method="mergeRowsMethod"
    :scroll-y="{ gt: -1 }"
    :highlightHoverRow="false"
    :highlightCurrentRow="false"
    @action="handleOprationEvent"
  >
    <template #pager />
    <template #files="{ row }">
      <ul class="qualification-files-list" v-if="Array.isArray(row.fileVOS)">
        <li
          class="qualification-file-item"
          v-for="(item, index) in row.fileVOS"
          :key="index"
          :class="{ warning: row.timeStatus == 'EXPIRE', error: row.timeStatus == 'OVERDUE' }"
        >
          <a @click="previewEvent(item)">{{ item.name + item.suffix }}</a>
        </li>
      </ul>
    </template>
  </VxeTable>

  <!-- 申请弹框 -->
  <applyDialog v-model:show="applyDialogVisible" v-bind="applayDialogProps" @complate="getData" />
  <!-- 预览pdf文件弹框 -->
  <viewDialog v-model:show="viewDialogVisible" v-bind="viewDialogProps" />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQualificationUser, getQualificationRoles } from '/@/api/ftm/teacher/qualification'
  import applyDialog from './managementApplyDialog.vue'
  import viewDialog from './pdfViewDialog.vue'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { title: this.$t('table.sourse'), minWidth: 150, field: 'courseName' }, // 课程
          { title: this.$t('table.modelNumber'), minWidth: 100, field: 'airplaneType' }, // 机型
          {
            title: this.$t('table.teacherType'),
            minWidth: 120,
            field: 'builtinRole',
            formatter: this.formatTeacher,
          }, // 教员类型
          { title: this.$t('table.content'), minWidth: 200, field: 'name' }, // 内容
          {
            title: this.$t('table.remarks'),
            width: 150,
            field: 'remark',
          },
          { title: this.$t('table.qualificationFile'), minWidth: 200, slots: { default: 'files' } }, // 资质文件
          {
            title: this.$t('table.distanceExpirationDate'),
            minWidth: 120,
            formatter: this.formatExpiration,
          }, // 距过期日期
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 120 },
        ],
        roles: [],
        tableLoading: false,
        applyDialogVisible: false,
        applayDialogProps: {},
        viewDialogVisible: false,
        viewDialogProps: {},
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    components: { VxeTable, applyDialog, viewDialog },
    created() {
      this.getQualificationRoles()
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        const [err, res] = await to(getQualificationUser({ userId: this.userInfo.userId }))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = (res.data || []).map((item) => ({
            ...item,
            airplaneName: `${item.courseId}-${item.airplaneType}`,
            teacherType: `${item.courseId}-${item.airplaneType}-${item.builtinRole}`,
          }))
        }
      },
      // 获取职位下拉列表
      async getQualificationRoles() {
        const [err, res] = await to(getQualificationRoles())
        if (!err && res.status) {
          this.roles = res.data
        }
      },
      operateButtons({ row }) {
        return [
          row.fileVOS.length > 0 && !row.request && { name: this.$t('button.upData'), type: 1 },
          row.fileVOS.length == 0 && !row.request && { name: this.$t('button.apply'), type: 2 },
        ]
      },
      handleOprationEvent({ type, row }) {
        switch (type) {
          case 1:
            this.applayDialogProps = { ...row, isModify: true }
            this.applyDialogVisible = true
            break
          case 2:
            this.applayDialogProps = { ...row }
            this.applyDialogVisible = true
            break
        }
      },
      // 打开预览pdf文件
      previewEvent(item) {
        this.viewDialogProps = {
          title: item.name,
          uuid: item.uuid,
          fileType: item.fileType,
        }
        this.viewDialogVisible = true
      },
      mergeRowsMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['courseName', 'airplaneName', 'teacherType']
        let property
        if (column.property == 'airplaneType') {
          property = 'airplaneName'
        } else if (column.property == 'builtinRole') {
          property = 'teacherType'
        } else {
          property = column.property
        }
        const cellValue = row[property]
        if (cellValue && fields.includes(property)) {
          let prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[property] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[property] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            // if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
            // }
          }
        }
      },
      // 格式化过期日期
      formatExpiration({ row }) {
        return row.lifeLong ? this.$t('table.permanentlyEffective') : row.validDays || 0
      },
      // 格式化教员类型
      formatTeacher({ cellValue }) {
        return (this.roles.find((item) => cellValue == item.id) || {}).name || cellValue
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .qualification-files-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .qualification-file-item {
    text-align: left;
    a {
      color: $elButtonBgActive;
    }
    &.warning a {
      color: $elButtonWarning;
    }
    &.error a {
      color: $elButtonDanger;
    }
    a:hover {
      text-decoration: underline;
    }
  }
</style>
