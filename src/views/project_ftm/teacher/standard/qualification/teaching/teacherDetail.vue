<template>
  <div>
    <VxeTable
      class="xTable"
      :data="tableData"
      :columns="tableColumns"
      :loading="tableLoading"
      :span-method="mergeRowsMethod"
    >
      <template #form>
        <div class="detail-navbar">
          <span>{{ detail.courseName }}</span>
          <span>{{ detail.airplaneType }}</span>
        </div>
      </template>
      <template #pager />

      <template #files="{ row }">
        <ul class="detail-files">
          <li v-for="(item, index) in row.fileVOS" :key="index">
            <a
              :class="{ warning: row.timeStatus == 'EXPIRE', error: row.timeStatus == 'OVERDUE' }"
              @click="previewEvent(row)"
              >{{ item.name + item.suffix }}</a
            >
          </li>
        </ul>
      </template>
    </VxeTable>

    <viewDialog v-model:show="viewDialogVisible" v-bind="viewDialogProps" />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQualificationProvideDetail } from '/@/api/ftm/teacher/qualification'
  import viewDialog from './components/qualificationViewDialog.vue'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { title: this.$t('table.teacherLastName'), minWidth: 120, field: 'userName' }, // 教员姓名
          { title: this.$t('table.qualificationContent'), minWidth: 200, field: 'type.name' }, // 资质内容
          { title: this.$t('table.qualificationFile'), minWidth: 200, slots: { default: 'files' } }, // 资质文件
          {
            title: this.$t('table.updateTime'),
            minWidth: 120,
            formatter: 'formatDate',
            field: 'lastModifiedDate',
          }, // 更新时间
          {
            title: this.$t('table.expirationTime'),
            minWidth: 120,
            formatter: 'formatDate',
            field: 'expireTime',
            className: this.statusRowClassMethod,
          }, // 到期时间
        ],
        tableLoading: false,
        detail: {},
        viewDialogVisible: false,
        viewDialogProps: {},
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
    },
    components: { viewDialog, VxeTable },
    created() {
      this.getDetail()
    },
    methods: {
      async getDetail() {
        this.tableLoading = true
        const [err, res] = await to(getQualificationProvideDetail({ id: this.id }))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.detail = res.data
          this.tableData = (res.data.qualifications || []).map((v) => ({
            ...v,
            userName: res.data.userName,
          }))
        }
      },
      previewEvent(row) {
        this.viewDialogProps = {
          title: row.type.name,
          list: row.fileVOS,
        }
        this.viewDialogVisible = true
      },
      mergeRowsMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['userName']
        const cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          let prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },
      statusRowClassMethod({ column, row }) {
        let className
        if (row['timeStatus'] == 'EXPIRE') {
          className = 'warning-cell'
        } else if (row['timeStatus'] == 'OVERDUE') {
          className = 'error-cell'
        }
        return className
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .detail-navbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    font-size: 16px;
  }
  .detail-files {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      text-align: left;
      a {
        color: $elButtonBg;
        &.warning {
          color: $elButtonWarning;
        }
        &.error {
          color: $elButtonDanger;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .xTable {
    :deep(.warning-cell) {
      color: $elButtonWarning;
    }
    :deep(.error-cell) {
      color: $elButtonDanger;
    }
  }
</style>
