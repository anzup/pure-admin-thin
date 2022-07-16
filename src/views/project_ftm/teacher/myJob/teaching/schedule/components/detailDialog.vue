<template>
  <el-dialog
    center
    top="0"
    :title="title"
    :close-on-click-modal="false"
    :fullscreen="true"
    v-model="show"
  >
    <div class="warp-content-table" ref="content">
      <div class="left-con">
        <table class="info-table-box">
          <tr>
            <!-- 课程课号 -->
            <td>{{ $t('table.CouseCode') }}</td>
            <td>{{ detail.courseNumber }}</td>
          </tr>
          <tr>
            <!-- 课程名称 -->
            <td>{{ $t('table.courseName') }}</td>
            <td>{{ detail.courseName }}</td>
          </tr>
          <!-- 培训项目 -->
          <!-- <tr>
              <td>{{ $t('table.trainingProject') }}</td>
              <td>{{ detail.projectName }}</td>
          </tr> -->
          <tr>
            <!-- 上课日期 -->
            <td>{{ $t('table.schoolDate') }}</td>
            <td>{{ detail.schoolDate }}</td>
          </tr>
          <tr>
            <!-- 上课时间 -->
            <td>{{ $t('table.schoolTime') }}</td>
            <td>{{ detail.schoolTime }}</td>
          </tr>
          <tr>
            <!-- 课时 -->
            <td>{{ $t('table.classHour') }}</td>
            <td>{{ detail.schoolPeriod }}</td>
          </tr>
          <tr>
            <!-- 教员 -->
            <td>{{ $t('table.teacher') }}</td>
            <td>{{ detail.teacherName }}</td>
          </tr>
          <tr>
            <!-- 训练设备 -->
            <td>{{ $t('table.trainEquipment') }}</td>
            <td>{{ detail.facility }}</td>
          </tr>
          <tr>
            <!-- 备注 -->
            <td>{{ $t('table.remarks') }}</td>
            <td>{{ detail.remark }}</td>
          </tr>
          <!-- 观摩员 -->
          <!-- <tr>
              <td>{{ $t('table.observer') }}</td>
              <td>{{ detail.observerName }}</td>
          </tr> -->
        </table>
      </div>
      <div class="right-con">
        <VxeTable :height="null" :data="tableData" :loading="loading" :columns="tableColumn">
          <template #pager />
        </VxeTable>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getStudentsSchedules } from '/@/api/ftm/teacher/studentTraining'
  export default {
    components: { VxeTable },
    data() {
      return {
        loading: false,
        tableData: [],
        tableHeight: 'unset',
        tableColumn: [
          { title: this.$t('table.studentName'), field: 'name' }, // 学员姓名
          { title: this.$t('table.gender'), field: 'gender', formatter: 'formatGender' }, // 性别
          { title: this.$t('table.cellPhoneNumber'), field: 'phone' }, // 手机号码
          { title: this.$t('table.idNumber'), field: 'idNumber' }, // 身份证号
          { title: this.$t('table.airlines'), field: 'customer.name' }, // 航空公司
        ],
        form: {},
      }
    },
    props: {
      value: {},
      title: String,
      detail: {
        type: Object,
        default: () => ({}),
      },
      data: Array,
    },
    computed: {
      show: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('update:modelValue', val)
        },
      },
    },
    watch: {
      show(val) {
        if (val) {
          this.$nextTick(() => {
            const content = this.$refs.content
            const window_w = document.documentElement.clientWidth
            if (content && window_w >= 768) {
              this.tableHeight = content.offsetHeight
            } else {
              this.tableHeight = 'unset'
            }
          })
        }
      },
      data(arr) {
        if (arr instanceof Array && arr.length > 0) {
          this.tableData = arr
          this.getDetail(arr.map((v) => v.id).join(','))
        }
      },
    },
    methods: {
      async getDetail(ids) {
        console.log(ids)
        let [err, res] = await this.$to(getStudentsSchedules({ ids }))
        if (!err && res.status == 200 && res.data instanceof Array) {
          this.tableData = this.data.map((v, i) => ({
            ...v,
            ...res.data[i],
          }))
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  :deep(.el-dialog__body) {
    height: calc(100% - 54px);
  }
  .info-table-box {
    width: calc(100% - 17px);
    td:nth-of-type(2n + 1) {
      white-space: nowrap;
    }
  }
  @media screen and (min-width: 768px) {
    .warp-content-table {
      display: flex;
      align-items: flex-start;
      height: 100%;
    }
    .left-con {
      width: 25%;
      height: 100%;
      :deep(.el-scrollbar) {
        width: 100%;
        height: 100%;
      }
      :deep(.el-scrollbar__wrap) {
        overflow-x: hidden !important;
        overflow-y: auto;
      }
    }
    .right-con {
      flex: 1;
      margin-left: 16px;
    }
  }
  @media screen and (max-width: 767px) {
    .left-con {
      width: 100%;
      margin-bottom: 20px;
    }
    .right-con {
      width: 100%;
    }
  }
</style>
