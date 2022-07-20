<template>
  <el-dialog
    :title="$t('table.assessmentItemMaintain')"
    v-model="isShow"
    :before-close="cancel"
    center
    width="400px"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item
        :label="$t('table.checkItems') + ':'"
        prop="evaluationIds"
        :rules="[
          { required: true, message: `${$t('holder.pleaseSelect')}${$t('table.checkItems')}` },
        ]"
      >
        <ul>
          <li>
            <input type="checkbox" :checked="allChecked" @change="changeAllChecked" />
            <span>{{ $t('common.all') }}</span>
          </li>
          <li v-for="(item, index) in evaluationsAll" :key="index">
            <input type="checkbox" @click="fnClick(item, item.checkval)" :checked="item.checkval" />
            <span>{{ item.name }}</span>
            <span class="preference">{{ item.preference }}</span>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getEvaluationsAll, putSyllabusItemsId } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['evaluationIdDialog', 'evaluationId', 'evaluations'],
    data() {
      return {
        isShow: false,
        ruleForm: {
          evaluationIds: [],
        },
        evaluationsAll: [],
        handleArr: [], // 选中的数组
        handleNum: 0, // 选中的顺序
      }
    },
    computed: {
      allChecked() {
        let evaluations = this.evaluationsAll.map((v) => v.id)
        return evaluations.length > 0
          ? evaluations.every((id) => this.ruleForm.evaluationIds.includes(id))
          : false
      },
    },
    created() {
      this.isShow = this.evaluationIdDialog
    },
    watch: {
      evaluationIdDialog(val) {
        this.isShow = val
        this.ruleForm.id = this.evaluationId
        if (val) {
          this.getEvaluationsAll()
        }
      },
    },
    methods: {
      cancel() {
        this.handleNum = 0
        this.handleArr = []
        this.evaluationsAll = []
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancelDialog')
      },
      handleSave() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            putSyllabusItemsId(this.ruleForm).then((res) => {
              if (res.status == 200) {
                this.$message.success(this.$t('tip.editSuccessTip'))
                this.$emit('getData')
                this.cancel()
              }
            })
          }
        })
      },
      getEvaluationsAll() {
        getEvaluationsAll().then((res) => {
          if (res.status == 200) {
            this.evaluationsAll = res.data
            this.ruleForm.evaluationIds = this.evaluations.map((v) => v.id)
            this.handleNum = this.evaluations.length
            this.handleArr = [].concat(this.evaluations)
            this.$nextTick(() => {
              this.evaluationsAll.forEach((v) => {
                v.preference = ''
                if (this.evaluations.find((k) => k.id == v.id)) {
                  let index = this.evaluations.findIndex((k) => k.id == v.id)
                  v.preference = ++index
                  v.checkval = true
                } else {
                  v.checkval = false
                }
                // this.evaluations.forEach((k,ki)=> {
                //   if (k.id == v.id) {
                //     this.fnClick(v, false)
                //   }
                // })
              })
            })
          }
        })
      },
      fnClick(val, status) {
        val.checkval = !status
        if (val.checkval) {
          this.handleArr.push(val)
          val.preference =
            this.handleNum <= this.handleArr.length
              ? (this.handleNum += 1)
              : (this.handleNum = this.handleArr.length)
        } else {
          this.handleArr.splice(
            this.handleArr.findIndex((v) => v.id == val.id),
            1,
          )
          for (let item in this.evaluationsAll) {
            if (
              this.evaluationsAll[item].preference > 0 &&
              this.evaluationsAll[item].preference > val.preference
            ) {
              this.evaluationsAll[item].preference--
              this.handleNum--
            }
          }
          this.handleNum = this.handleArr.length
          val.preference = ''
        }
        this.ruleForm.evaluationIds = this.handleArr.map((v) => v.id)
      },
      // 全选/全不选
      changeAllChecked(e) {
        let bool = e.target.checked
        if (bool) {
          this.evaluationsAll.forEach((evaluation) => {
            if (!evaluation.checkval) {
              this.fnClick(evaluation, evaluation.checkval)
            }
          })
        } else {
          this.ruleForm.evaluationIds = []
          this.handleArr = []
          this.evaluationsAll.forEach((evaluation) => {
            evaluation.preference = ''
            evaluation.checkval = bool
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-dialog__footer {
    margin: 0 30px;
    border-top: 1px solid #e8e8e8;
    padding-right: 0;
  }
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
    input {
      margin-right: 8px;
    }
  }
  .preference {
    color: #d44949;
    display: inline-block;
    margin-left: 5px;
    font-weight: 500;
  }
</style>
