<template>
  <section class="warp-content-table">
    <p class="remark"><em class="tag-danger">*</em>{{ $t('tip.fillTableTip') }}</p>
    <VxeTable
      ref="xTable"
      :height="null"
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :edit-config="{ trigger: 'manual', mode: 'cell' }"
    >
      <template #pager />
      <template #bottom>
        <div class="table-footer" v-if="isEdit">
          <span class="add-btn" @click="addDataEvent">
            <svg-icon iconClass="add" class="ico" />
            <span>{{ $t('button.add') }}</span>
          </span>
        </div>
      </template>
      <template #custom="{ row, column }">
        <template v-if="column.editRender && isEdit">
          <template v-if="column.editRender.name == 'input'">
            <vxe-input size="medium" v-model="row[column.property]" />
          </template>
        </template>
        <template v-else-if="!isEdit">{{
          column.formatter && typeof column.formatter === 'function'
            ? column.formatter(row[column.property])
            : row[column.property]
        }}</template>
      </template>
      <template #daterange="{ row }">
        <template v-if="isEdit">
          <div class="flex-cell">
            <vxe-input
              :transfer="true"
              size="medium"
              type="date"
              clearable
              label-format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="$t('table.startTime')"
              :disabled-method="(e) => startDateMethod(e, row['endTime'])"
              v-model="row['startTime']"
            />
            <span>{{ $t('common.to') }}</span>
            <vxe-input
              :transfer="true"
              size="medium"
              type="date"
              clearable
              label-format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="$t('table.endTime')"
              :disabled-method="(e) => endDateMethod(e, row['startTime'])"
              v-model="row['endTime']"
            />
          </div>
        </template>
        <template v-else>{{ formatDateRange(row['startTime'], row['endTime']) }}</template>
      </template>
    </VxeTable>
    <div class="foot">
      <template v-if="isEdit">
        <el-button size="medium" type="primary" plain key="cancel" @click="cancelEvent">{{
          $t('button.cancel')
        }}</el-button>
        <el-button size="medium" type="primary" key="save" @click="saveEvent">{{
          $t('button.save')
        }}</el-button>
      </template>
      <template v-else>
        <el-button size="medium" type="primary" @click="isEdit = true">{{
          $t('button.modify')
        }}</el-button>
      </template>
    </div>
  </section>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import {
    getPilotTrainingRecord,
    postPilotTrainingRecordsAddUpdate,
  } from '/@/api/ftm/teacher/pilotLicenses'
  import moment from 'moment'
  import to from 'await-to-js'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableColumns: [
          {
            title: this.$t('table.theStartTime'),
            field: 'startTime',
            formatter: this.formatDate,
            minWidth: 300,
            editRender: { name: 'picker' },
            slots: { default: 'daterange' },
          }, // 起步时间
          {
            title: this.$t('table.project'),
            field: 'projectName',
            minWidth: 160,
            editRender: { name: 'input' },
            slots: { default: 'custom' },
          }, // 项目
          {
            title: `${this.$t('table.institutions')}/${this.$t('table.place')}`,
            field: 'institutionalLocation',
            minWidth: 160,
            editRender: { name: 'input' },
            slots: { default: 'custom' },
          }, // 机构/地点
          {
            title: this.$t('table.content'),
            field: 'content',
            minWidth: 200,
            editRender: { name: 'input' },
            slots: { default: 'custom' },
          }, // 内容
        ],
        tableData: [],
        isEdit: false,
        loading: false,
      }
    },
    props: ['userId'],
    computed: {
      $xTable() {
        try {
          return this.$refs.xTable.$refs.xTable
        } catch (e) {
          return {}
        }
      },
    },
    watch: {
      isEdit(val) {
        if (val) {
          this.tableData.forEach((row) => {
            this.tableColumns.forEach((column) => {
              this.$xTable.setActiveCell(row, column.filed)
            })
          })
        } else {
          this.$xTable.clearActived()
        }
      },
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.loading = true
        const params = {
          page: 1,
          size: 1000,
          userId: this.userId,
        }
        const [err, res] = await to(getPilotTrainingRecord(params))
        this.loading = false
        if (!err && res.status === 200) {
          this.tableData = res.data.content
        }
      },
      cancelEvent() {
        this.isEdit = false
      },
      async saveEvent() {
        const data = {
          userId: this.userId,
          records: this.tableData,
        }
        const [err, res] = await to(postPilotTrainingRecordsAddUpdate(data))
        if (!err && res.status === 200) {
          this.$message.success(this.$t('tip.saveSuccessTip'))
          this.isEdit = false
          this.getData()
        }
      },
      addDataEvent() {
        this.tableData.push({
          startTime: '',
          projectName: '',
          institutionalLocation: '',
          content: '',
        })
      },
      startDateMethod({ date }, end) {
        return end
          ? new Date(moment(date).format('YYYY/MM/DD')) > new Date(moment(end).format('YYYY/MM/DD'))
          : false
      },
      endDateMethod({ date }, start) {
        return start
          ? new Date(moment(date).format('YYYY/MM/DD')) <
              new Date(moment(start).format('YYYY/MM/DD'))
          : false
      },
      formatDate(val) {
        return val ? moment(val).format('YYYY-MM-DD') : ''
      },
      formatDateRange(start, end) {
        return start && end
          ? moment(start).format('YYYY-MM-DD') + ',' + moment(end).format('YYYY-MM-DD')
          : start
          ? moment(start).format('YYYY-MM-DD')
          : end
          ? moment(end).format('YYYY-MM-DD')
          : ''
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.vxe-table--render-default.size--medium .vxe-body--column:not(.col--ellipsis)) {
    padding: 5px 0 !important;
  }
  .flex-cell {
    display: flex;
    align-items: center;
    span {
      padding: 0 4px;
      white-space: nowrap;
    }
  }
  .remark {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
    text-align: right;
  }
  .foot {
    margin-top: 170px;
    text-align: center;
  }
  .tag-danger {
    padding: 0 4px;
    color: #d65555;
  }
  .table-footer {
    width: 100%;
    min-height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e8eaec;
    border-top: 0;
  }
  .add-btn {
    font-size: 14px;
    color: #215ebe;
    cursor: pointer;
  }
  :deep(.vxe-input--panel) {
    z-index: 3000 !important;
  }
</style>
