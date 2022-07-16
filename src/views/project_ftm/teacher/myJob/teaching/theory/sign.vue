<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      :checkbox-config="{ checkMethod: this.isCanBatchSign }"
      @action="btnClick"
      @checkbox="handleChecked"
    >
      <template #right_tools>
        <el-button
          type="primary"
          size="small"
          :disabled="checkedArr.length == 0"
          @click="handleSignAll"
          >{{ $t('button.batchSignature') }}</el-button
        >
      </template>
      <template #pager />
      <template #teachTime="{ row }">
        <div class="timeRange" v-for="(item, index) in row.signTeachers || []" :key="index">
          <span>{{ item.userName }}:</span>
          <el-tooltip
            class="t"
            effect="dark"
            :content="formatDateTimeRang({ row: item })"
            placement="top"
          >
            <span>{{ formatDateTimeRang({ row: item }) }}</span>
          </el-tooltip>
        </div>
      </template>
      <template #remarks="{ row }">
        <div class="remark" v-for="(item, index) in row.signTeachers || []" :key="index">
          <span>{{ item.userName }}:</span>
          <el-tooltip class="t" effect="dark" :content="item.remark" placement="left">
            <span>{{ item.remark }}</span>
          </el-tooltip>
        </div>
      </template>
      <template #edit="{ row }">
        <div class="button-line">
          <span class="buttonEdit" v-if="isCanSign(row)" @click="handleSignOne(row)">{{
            formatSignBtn(row) ? $t('button.modify') : $t('table.sign')
          }}</span>
          <span class="buttonEdit disabled" v-else>{{
            formatSignBtn(row) ? $t('button.modify') : $t('table.sign')
          }}</span>
        </div>
      </template>
    </VxeTable>
    <!--签名-->
    <SignDialog
      ref="signDialog"
      :title="signEditTitle"
      :type="signEditStatus"
      v-model="showSign"
      @submit="handleSubmit({ ...$event, ids: [signStudentId] })"
    />
    <!-- 批量签名 -->
    <SignDialog
      :title="$t('button.batchSignature')"
      v-model="showBatchSign"
      @submit="handleSubmit({ ...$event, ids: signStudentIds })"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import SignDialog from './components/signDialog.vue'
  import { typeEnum } from './components/signDialog.enum'
  import {
    getSchedulesStudents,
    postSchedulesStudentSign,
    postSchedulesStudentsSign,
    putSchedulesStudentSign,
  } from '/@/api/ftm/teacher/teachingCenter'
  import moment from 'moment'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import to from 'await-to-js'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        loading: false,
        tableData: [],
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { field: 'groupName', title: this.$t('table.team'), minWidth: 100 }, // 小组
          { field: 'studentName', title: this.$t('table.studentName'), minWidth: 100 }, // 学员姓名
          { field: 'airName', title: this.$t('table.airlines'), minWidth: 100 }, // 航空公司
          {
            field: 'startTime',
            title: this.$t('table.teachingHours'),
            minWidth: 240,
            slots: { default: 'teachTime' },
          }, // 授课时间
          {
            field: 'signTeachers',
            title: this.$t('table.teacherSignStatus'),
            minWidth: 120,
            formatter: this.formatTeacherSigned,
          }, // 教员是否已签名
          {
            field: 'studentSignature',
            title: this.$t('table.studentSignStatus'),
            minWidth: 120,
            formatter: this.formatStudentSigned,
          }, // 学员是否已签名
          {
            title: this.$t('tip.currentAccountSignedStatus'),
            minWidth: 150,
            formatter: ({ row }) =>
              this.formatSignBtn(row) ? this.$t('status.signed') : this.$t('status.unsigned'),
          }, // 自己是否签名
          {
            field: 'remark',
            title: this.$t('table.comment'),
            minWidth: 200,
            slots: { default: 'remarks' },
          }, // 评语
          { title: this.$t('table.tableEdit'), minWidth: 100, slots: { default: 'operate' } }, // 操作
        ],
        tableTools: {
          slots: {
            tools: 'right_tools',
          },
        },
        signStudentId: null,
        signStudentIds: [],
        checkedArr: [],
        showSign: false,
        showBatchSign: false,
        signEditStatus: null,
      }
    },
    components: {
      SignDialog,
      VxeTable,
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      id() {
        return this.$route.params.clazzId
      },
      signEditTitle() {
        return this.signEditStatus == typeEnum.add
          ? this.$t('table.sign')
          : this.$t('button.modify')
      },
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.loading = true
        let [err, res] = await to(getSchedulesStudents({ id: this.id }))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data
        }
      },
      // 格式化授课时间
      formatDateTimeRang({ row }) {
        try {
          if (row.startTime && row.endTime) {
            return (
              moment(row.startTime).format('YYYY/MM/DD') +
              ' - ' +
              moment(row.endTime).format('YYYY/MM/DD')
            )
          } else {
            return ''
          }
        } catch (e) {
          return ''
        }
      },
      // 判断是否已签名
      formatStudentSigned({ cellValue }) {
        return cellValue ? this.$t('status.signed') : this.$t('status.unsigned')
      },
      formatTeacherSigned({ cellValue }) {
        return cellValue instanceof Array && cellValue.length > 0
          ? this.$t('status.signed')
          : this.$t('status.unsigned')
      },
      formatSignBtn(row) {
        if (
          row.signTeachers &&
          row.signTeachers instanceof Array &&
          row.signTeachers.findIndex((item) => item.userId == this.userInfo.userId) > -1
        ) {
          return true
        } else {
          return false
        }
      },
      // 判断是否能够签名
      isCanSign(row) {
        // if(!!row.studentSignature && !!row.studentSignTime) {
        //     return false;
        // } else {
        return true
        // }
      },
      isCanBatchSign({ row }) {
        return (
          this.isCanSign(row) &&
          (!!row.signTeachers == false ||
            (row.signTeachers instanceof Array &&
              row.signTeachers.findIndex((item) => item.userId == this.userInfo.userId) < 0))
        )
      },
      handleChecked({ ids }) {
        this.checkedArr = ids
      },
      handleSignAll() {
        this.signStudentIds = this.checkedArr
        this.showBatchSign = true
      },
      handleSignOne(row) {
        this.signStudentId = row.id
        this.showSign = true

        // 修改传入默认表单值
        if (
          row.signTeachers instanceof Array &&
          !!row.signTeachers.find((item) => item.userId == this.userInfo.userId)
        ) {
          const dialog_form = this.$refs.signDialog.form
          dialog_form.remark = row.signTeachers.find(
            (item) => item.userId == this.userInfo.userId,
          ).remark
          this.signEditStatus = typeEnum.modify
        } else {
          this.signEditStatus = typeEnum.add
        }
      },
      async handleSubmit({ ids, pinCode, remark, dateTimeRang }) {
        let Api,
          params,
          msg = this.$t('tip.saveSuccessTip')
        if (this.showBatchSign) {
          // 批量签名
          Api = postSchedulesStudentsSign
          params = {
            startTime: moment(dateTimeRang[0]).format(),
            endTime: moment(dateTimeRang[1]).format(),
            ids: ids,
            remark,
            pinCode,
          }
        } else if (this.showSign && this.signEditStatus == typeEnum.add) {
          // 单个签名 #添加
          Api = postSchedulesStudentSign
          params = {
            id: ids[0],
            startTime: moment(dateTimeRang[0]).format(),
            endTime: moment(dateTimeRang[1]).format(),
            remark,
            pinCode,
          }
        } else if (this.showSign && this.signEditStatus == typeEnum.modify) {
          // 单个签名 #修改
          Api = putSchedulesStudentSign
          params = {
            id: ids[0],
            remark,
          }
          msg = this.$t('tip.modifySuccessTop')
        }
        let [err, res] = await to(Api(params))
        this.showSign = this.showBatchSign = false
        if (!err && res.status == 200) {
          this.$message.success(msg)
          this.getData()
        }
      },
      btnClick() {},
    },
  }
</script>

<style scoped lang="scss">
  .buttonEdit.disabled {
    color: #ccc;
  }
  .remark,
  .timeRange {
    margin: 5px 0;
    white-space: nowrap;
    text-align: left;
    line-height: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
