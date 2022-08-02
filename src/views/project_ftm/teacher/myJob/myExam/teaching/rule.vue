<template>
  <div>
    <div class="rule_container">
      <Frame :title="$t('table.examRules')">
        <el-form disabled label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('table.examType')">{{ form.examType }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('table.examName')">{{ form.name }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('table.examPeriod')"
                >{{ dateFormat(form.dateTime[0]) }}&nbsp;{{ $t('common.to') }}&nbsp;{{
                  dateFormat(form.dateTime[1])
                }}</el-form-item
              >
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('table.examDuration')">{{ form.duration }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('table.examRules')">
                <div class="rules-txt w-e-text" v-html="form.regulation" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="footer">
          <el-button @click="$router.go(-1)">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" :loading="loadingConfirm" @click="confirm">{{
            $t('button.confirm')
          }}</el-button>
        </div>
      </Frame>
    </div>
  </div>
</template>

<script>
  import { getExamRecordsId, putExamRecordsId } from '/@/api/ftm/teacher/exam'
  import Frame from '/@/views/project_ftm/teacher/components/Frame/index.vue'
  import XEUtils from 'xe-utils'
  import examStatus from '/@/enums/exam.enum'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { deleteEmptyParams } from '../../../../../../utils'
  export default {
    components: {
      Frame,
    },
    data() {
      return {
        form: {
          type: undefined,
          dateTime: [null, null],
          duration: undefined,
          examType: undefined,
          name: undefined,
          regulation: undefined,
        },
        loadingConfirm: false,
        examStatus: null,
      }
    },
    created() {
      this.id = this.$route.query.id
      this.duration = Number(this.$route.query.duration)
      this.examName = this.$route.query.examName
      this.getExamRecordsId()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      getExamRecordsId() {
        getExamRecordsId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            const { data } = res
            const { exam } = data
            this.form.dateTime = [exam.startDate, exam.endDate]
            this.form.duration = exam.duration + this.$t('common.minutes')
            this.form.examType = exam.examType.name
            this.form.name = exam.name
            this.form.regulation = exam.regulation
            this.examStatus = data.status
            // console.log(this.form,85);
          }
        })
      },
      toExamPage() {
        let url = 'exam?'
        let query = this.$route.query
        query = deleteEmptyParams(query)
        for (let [key, value] of Object.entries(query)) {
          url += `${key}=${value}&`
        }
        url = url.substring(0, url.length - 1)
        this.routerGo(url)
      },
      async confirm() {
        // 考试未开始
        if (this.examStatus == examStatus.status[0]) {
          this.loadingConfirm = true
          let [err, res] = await to(putExamRecordsId({ id: this.id, status: examStatus.status[1] }))
          this.loadingConfirm = false
          if (!err && res.status == 200) {
            this.toExamPage()
          } else if (res.status != 200) {
            this.$message.error(res.data.msg)
          }
        } else {
          // 考试已开始
          this.toExamPage()
        }
      },
      // 格式化时间
      dateFormat(date) {
        return XEUtils.toDateString(date, 'yyyy-MM-dd HH:mm:ss')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .rule_container {
    max-width: 1000px;
    margin: 0 auto;
  }
  .el-input.is-disabled :deep(.el-input__inner),
  :deep(.el-range-editor.is-disabled),
  .el-range-editor.is-disabled :deep(input) {
    background-color: #fff;
    border: none;
    color: #333;
  }
  .footer {
    width: 100%;
    padding: 20px;
    text-align: center;
  }
  .rules-txt :deep(p) {
    margin: 0;
  }
</style>
