<template>
  <div v-loading="getLoading">
    <el-scrollbar>
      <el-card class="mb questionnaire-h">
        <div class="questionnaire-title-edit">
          <el-divider direction="vertical" /><span
            >{{ type ? $t('button.modify') : $t('button.addTo')
            }}{{ $t('table.theQuestionnaire') }}</span
          >
        </div>
        <el-form :model="form" :rules="rules" ref="questionnaireForm" label-width="140px">
          <el-form-item required :label="$t('router.questionnaireTemplate')" prop="templateId">
            <!-- 问卷模板 -->
            <el-select
              :placeholder="$t('holder.pleaseSelect') + $t('router.questionnaireTemplate')"
              v-model="form.templateId"
            >
              <el-option
                v-for="item in Menu.templateMenu"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item required :label="$t('table.questionnaireName')" prop="name">
            <!-- 问卷名称 -->
            <div class="iblock">
              <el-input
                :placeholder="$t('holder.pleaseEnter') + $t('table.questionnaireName')"
                class="letter-w"
                v-model="form.name"
              />
            </div>
          </el-form-item>
          <el-form-item required :label="$t('table.questionnaireValidity')" prop="dateTime">
            <!-- 问卷有效期 -->
            <div class="iblock">
              <hyx-date-picker v-model="form.dateTime" />
            </div>
          </el-form-item>
          <el-form-item required :label="$t('table.questionnaireType')" prop="type">
            <el-radio-group v-model="form.type" class="questionnaire-type-radio">
              <el-radio label="PUBLIC">{{ $t('table.publicQuestionnaire') }}</el-radio>
              <el-radio label="INTERNAL">{{ $t('table.privateQuestionnaire') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.type == 'INTERNAL'">
            <el-form-item required :label="$t('table.questionnaireObject')" prop="ids">
              <!-- 问卷对象 -->
              <el-checkbox-group v-model="form.object" style="width: 100%">
                <el-checkbox label="teacher">{{ $t('table.teacher') }}</el-checkbox>
                <el-checkbox label="planner">{{ $t('table.planner') }}</el-checkbox>
                <el-checkbox label="student">{{ $t('table.student') }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
        </el-form>
      </el-card>
      <el-form v-if="form.type == 'INTERNAL'">
        <el-form-item>
          <!-- 教员选择区 -->
          <el-card class="mb" v-show="form.object.includes('teacher')">
            <div class="card-title">
              <h2>
                <el-checkbox
                  :indeterminate="form.teacherChecked.indeterminate"
                  v-model="form.teacherChecked.all"
                  @change="hanlderCheckboxAll('teacher', $event)"
                />
                {{ $t('table.teacher') }}
              </h2>
            </div>
            <el-checkbox-group v-model="form.ids">
              <el-checkbox
                v-for="item in Menu.teachers"
                :key="item.id"
                :label="item.userId"
                @change="hanlderCheckboxItem('teacher')"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-card>
          <!-- 计划员选择区 -->
          <el-card class="mb" v-show="form.object.includes('planner')">
            <div class="card-title">
              <h2>
                <el-checkbox
                  :indeterminate="form.plannerChecked.indeterminate"
                  v-model="form.plannerChecked.all"
                  @change="hanlderCheckboxAll('planner', $event)"
                />
                {{ $t('table.planner') }}
              </h2>
            </div>
            <el-checkbox-group v-model="form.ids">
              <el-checkbox
                v-for="item in Menu.planners"
                :key="item.id"
                :label="item.userId"
                @change="hanlderCheckboxItem('planner')"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-card>
          <!-- 学员选择区 -->
          <el-card class="mb" v-show="form.object.includes('student')">
            <!-- <div class="card-title">
              <h2>
                  <el-checkbox :indeterminate="form.studentChecked.indeterminate" v-model="form.studentChecked.all" @change="hanlderCheckboxAll('student', $event)"></el-checkbox>
                  {{ $t('table.student') }}
              </h2>
          </div>
          <div v-for="(clazz,iclazz) in Menu.studentTree" :key="clazz.id">
              <el-checkbox  :indeterminate="clazz.indeterminate" v-model="clazz.all" @change="handlerCheckedClazz(iclazz, $event)">{{ clazz.name }}</el-checkbox>
              <el-checkbox-group class="ml" v-model="form.ids" @change="handlerChecked(clazz, $event)">
                  <el-checkbox v-for="item in clazz.data" :key="item.id" :label="item.id" @change="hanlderCheckboxItem('student')">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
          </div> -->
            <div class="card-title">
              <h2>{{ $t('table.student') }}</h2>
            </div>
            <el-tree
              v-if="Menu.clazzs.length > 0"
              ref="tree"
              class="custom-tree"
              lazy
              :default-expanded-keys="defaultCourseNumber"
              node-key="courseNumber"
              :show-checkbox="true"
              :props="clazzPosition"
              :load="loadStudent"
              @check-change="triggerTree"
              @node-expand="openTree"
            />
          </el-card>
        </el-form-item>
      </el-form>
    </el-scrollbar>

    <fix-footer @confirm="Save" :loading="loading" />
  </div>
</template>

<script>
  import {
    getTemplate,
    addQuestionnaires,
    infoQuestionnaires,
    getStudents,
    getQuestionnairesInfo,
  } from '/@/api/ftm/teacher/education'
  import { getQualificationClassificationAll } from '/@/api/ftm/teacher/qualification'
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { toISODateTime } from '/@/utils/index'
  import qualicationEnum from '/@/enums/qualification.enum'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import HyxDatePicker from '/@/views/project_ftm/teacher/components/HyxDatePicker/index.vue'
  import to from 'await-to-js'
  export default {
    components: { FixFooter, HyxDatePicker },
    data() {
      // 验证有效期
      const valideValidate = (rule, value, cb) => {
        if (!(value instanceof Array) || !value[0] || !value[1]) {
          cb(new Error(this.$t('holder.pleaseSelectDate')))
        } else {
          cb()
        }
      }
      // 验证数组
      const arrayValidate = (rule, value, cb) => {
        if (value instanceof Array !== true) {
          cb(new Error(this.$t('tip.theFormatDoesNotMeetTheRequirements')))
        } else if (value.length == 0) {
          cb(new Error(this.$t('holder.pleaseSelect') + this.$t('table.questionnaireObject')))
        } else {
          cb()
        }
      }
      return {
        Menu: {
          templateMenu: [],
          studentTree: [],
          teachers: [],
          students: [],
          planners: [],
          clazzs: [],
        },
        form: {
          templateId: undefined, // 模板
          name: '', // 名称
          valide: '', // 有效期
          dateTime: ['', ''], // 有效时间
          type: '', // 类型
          object: [],
          ids: [], // 对象id
          teacherChecked: {}, // 全选
          studentChecked: {},
          plannerChecked: {},
        },
        rules: {
          templateId: [
            {
              required: true,
              message: this.$t('holder.pleaseSelect') + this.$t('router.questionnaireTemplate'),
            },
          ],
          name: [
            {
              required: true,
              message: this.$t('holder.pleaseEnter') + this.$t('table.questionnaireName'),
            },
          ],
          dateTime: [{ validator: valideValidate }],
          ids: [{ validator: arrayValidate }],
          type: [
            {
              required: true,
              message: this.$t('holder.pleaseSelect') + this.$t('table.questionnaireType'),
            },
          ],
        },
        loading: false,
        getLoading: false,
        clazzPosition: {
          label: 'name',
          isLeaf: 'leaf',
          disabled: function (data, node) {
            if (node.isLeaf == false) {
              return node.childNodes instanceof Array && node.childNodes.length == 0
            }
            return false
          },
        },
        defaultCourseNumber: [],
        defaultStudents: [],
        classificationList: [],
      }
    },
    computed: {
      // 类型true: 修改 false: 添加
      type() {
        let { name } = this.$route
        return name == 'InfoQuestionnaire'
      },
      classificationId() {
        return (this.classificationList.find((v) => v.code === qualicationEnum.code.TEACHING) || {})
          .id
      },
    },
    async created() {
      this.getTemplateMenu()
      this.getClassificationAll()
      if (this.type) this.getLoading = true
      this.getIdsMenu(
        this.type
          ? () => {
              this.getLoading = false
              this.getData()
            }
          : undefined,
      )
    },
    methods: {
      // 获取内容
      async getData() {
        let { q_id } = this.$route.query
        let [err, res] = await to(getQuestionnairesInfo({ id: q_id }))
        if (!err) {
          let data = res.data
          this.form.dateTime = [new Date(data.startTime), new Date(data.endTime)]
          this.form.name = data.name
          this.form.templateId = data.template.id
          this.form.ids = data.userIds
          this.form.type = data.type
          // this.form.object = ['teacher','planner','student']
          this.$nextTick(() => {
            if (this.Menu.teachers.some((v) => data.userIds.includes(v.userId))) {
              this.form.object.push('teacher')
            }
            if (this.Menu.planners.some((v) => data.userIds.includes(v.userId))) {
              this.form.object.push('planner')
            }
            // if(this.Menu.students.some(v => data.userIds.includes(v.userId))){
            //     this.form.object.push('student')
            // }
            if (data.users.some((item) => item.courseNumber)) {
              this.form.object.push('student')
              this.defaultCourseNumber = data.users.map((v) => v.courseNumber)
              this.defaultStudents = data.users.map((item) => `${item.userId}`)
            }
            // data.users.forEach(v => {
            // })
          })
        }
      },
      // 下拉列表获取模板对应id
      async getClassificationAll() {
        const [err, res] = await to(getQualificationClassificationAll({ builtIn: true }))
        if (!err && res.status == 200) {
          this.classificationList = res.data
        }
      },
      // 模板列表菜单
      async getTemplateMenu() {
        let params = {
          page: 1,
          size: 1000,
        }
        let [err, res] = await to(getTemplate(params))
        if (!err) {
          let { data } = res
          this.Menu['templateMenu'] = data.content
        }
      },
      // 选择对象
      async getIdsMenu(callback) {
        var [err, tres] = await to(
          getEmployees({ size: 1000, builtinRole: 'THEORY_TEACHER,FLIGHT_TEACHER' }),
        )
        if (!err) {
          this.Menu.teachers = tres.data.content
        } else {
          this.getLoading = false
        }
        var [err, pres] = await to(getEmployees({ size: 1000, builtinRole: 'PLANNER' }))
        if (!err) {
          this.Menu.planners = pres.data.content
        } else {
          this.getLoading = false
        }
        var [err, cres] = await to(
          getClazzs({ size: 1000, statusIN: 'NOT_STARTED,TRAINING', type: 'WET_LEASE' }),
        )
        if (!err) {
          // let list = sres.data.content
          // let clazz = []
          // for(let i = 0; i < list.length; i++){
          //     let item = list[i]
          //     if(clazz.map( v => v.id ).includes(item.clazz.id)){
          //         let index = clazz.map(v => v.id).indexOf(item.clazz.id)
          //         clazz[index].data.push({
          //             id: item.userId,
          //             name: item.name
          //         })
          //     }else{
          //         clazz.push({
          //             id: item.clazz.id,
          //             name: item.clazz.courseNumber,
          //             indeterminate: false,
          //             all: false,
          //             data: [{
          //                 id: item.userId,
          //                 name: item.name
          //             }]
          //         })
          //     }
          // }
          // this.Menu.studentTree = clazz
          // this.Menu.students = sres.data.content
          this.Menu.clazzs = cres.data.content.map((item) => ({
            ...item,
            name: `${this.$t('table.classNumber')}: ${item.courseNumber}`,
          }))
          callback && callback()
        } else {
          this.getLoading = false
        }
      },
      //全选
      hanlderCheckboxAll(name, status) {
        this.form[`${name}Checked`].indeterminate = false
        this.Menu[`${name}s`].forEach((v) => {
          if (status && !this.form.ids.includes(v.userId)) {
            this.form.ids.push(v.userId)
          } else if (!status && this.form.ids.includes(v.userId)) {
            let index = this.form.ids.indexOf(v.userId)
            this.form.ids.splice(index, 1)
          }
        })
        if (name == 'student') {
          this.Menu.studentTree.forEach((clazz) => {
            clazz.all = status
            clazz.indeterminate = false
          })
        }
      },
      // 单选
      hanlderCheckboxItem(name) {
        let list = this.Menu[`${name}s`].map((v) => v.userId)
        let checkedNum = 0
        list.forEach((item) => {
          checkedNum += this.form.ids.includes(item) ? 1 : 0
        })
        this.form[`${name}Checked`].indeterminate =
          !list.every((id) => this.form.ids.includes(id)) && checkedNum > 0
        this.form[`${name}Checked`].all = checkedNum == list.length ? true : false
      },
      // 全选学员班级
      handlerCheckedClazz(index, val) {
        let clazz = this.Menu.studentTree[index]
        let ids = this.form.ids
        clazz.indeterminate = false
        clazz.data.forEach((v) => {
          let i = ids.indexOf(v.id)
          if (val) {
            i < 0 && this.form.ids.push(v.id)
          } else {
            i > -1 && this.form.ids.splice(i, 1)
          }
        })

        let students = this.Menu.students.map((v) => v.userId)
        this.form.studentChecked.all = students.every((v) => this.form.ids.includes(v))
        this.form.studentChecked.indeterminate =
          students.some((v) => this.form.ids.includes(v)) && !this.form.studentChecked.all
      },
      // 单选学员
      handlerChecked() {
        this.Menu.studentTree.forEach((clazz) => {
          let studentID = clazz.data.map((v) => v.id)
          clazz.all = studentID.every((v) => this.form.ids.includes(v))
          clazz.indeterminate = studentID.some((v) => this.form.ids.includes(v)) && !clazz.all
        })
      },
      Back() {
        this.$router.back()
      },
      Save() {
        this.$refs.questionnaireForm.validate((bool) => {
          if (bool) {
            this.submitForm()
          }
        })
      },
      // 提交问卷
      async submitForm() {
        this.loading = true
        let startDate = this.form.dateTime[0]
        startDate.setHours(0)
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        let endDate = this.form.dateTime[1]
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
        let params = {
          id: this.type ? this.$route.query.q_id : undefined,
          name: this.form.name,
          startTime: toISODateTime(startDate),
          endTime: toISODateTime(endDate),
          templateId: this.form.templateId,
          type: this.form.type,
          userIds:
            this.form.type.toLocaleLowerCase() == 'public'
              ? [0]
              : this.form.ids.filter((id) => id != 0),
          classificationId: this.classificationId,
          maxSize: 5000,
        }
        let [err] = this.type
          ? await to(infoQuestionnaires(params))
          : await to(addQuestionnaires(params))
        this.loading = false
        if (!err) {
          let msg = this.type ? this.$t('tip.editSuccessTip') : this.$t('tip.addsuccessTip')
          this.$message.success(msg)
          this.Back()
        }
      },
      // 懒加载学员
      loadStudent(node, resolve) {
        if (node.level == 0) {
          resolve(this.Menu.clazzs)
        } else {
          let clazzId = node.data.id
          getStudents({
            id: clazzId,
            statusIN: 'NOT_STARTED,NOT_GRADUATED',
          })
            .then((res) => {
              if (res.status == 200) {
                let index = this.Menu.clazzs.findIndex((item) => item.id == clazzId)
                this.Menu.clazzs[index].students = res.data
                if (this.type == true) {
                  res.data.forEach((item) => {
                    if (this.defaultStudents.some((userId) => item.userId == userId)) {
                      setTimeout(() => {
                        this.$refs.tree.setChecked(`${item.userId}`, true)
                      }, 100)
                    }
                  })
                }
                resolve(
                  res.data.map((item) => ({
                    ...item,
                    courseNumber: `${item.userId}`,
                    leaf: true,
                  })),
                )
              } else {
                resolve([])
              }
            })
            .catch(() => {
              resolve([])
            })
        }
      },
      // 选中/不选学员
      triggerTree(row, checked) {
        if (row.leaf) {
          // 点击学员
          if (checked == true) {
            this.form.ids.includes(row.userId) == false && this.form.ids.push(row.userId)
          } else {
            let index_form = this.form.ids.indexOf(row.userId)
            this.form.ids.splice(index_form, 1)
          }
        } else if (row.studens instanceof Array && row.studens.length > 0) {
          // 点击班级
          if (checked == true) {
            row.students.forEach((userId) => {
              this.form.ids.includes(userId) == false && this.form.ids.push(userId)
            })
          } else {
            this.form.ids = this.form.ids.filter((userId) => {
              return !row.students.some((userid) => userid == userId)
            })
          }
        }
      },
      // 展开班级
      openTree(data, node, self) {
        console.log(data, node, self, '展开')
      },
    },
  }
</script>

<style scoped lang="scss">
  .letter-w {
    min-width: 472px;
    max-width: 100%;
  }
  .iblock {
    display: inline-block;
  }
</style>

<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .mb {
    margin-bottom: 20px;
  }
  .ml {
    margin-left: 40px;
  }
  .card-title {
    margin-bottom: 10px;
    h2 {
      margin: 0;
      font-size: 18px;
      color: #666;
      line-height: 24px;
    }
  }
  .questionnaire-title-edit {
    width: 100%;
    height: 54px;
    background: #fafafa;
    line-height: 54px;
    padding-left: 20px;
    font-size: 14px;
    background: $textBg;
    color: $elButtonBg;
    padding-left: 10px;
    font-size: 14px;
    margin-bottom: 5px;
    font-weight: 700;
    .el-divider--vertical {
      width: 2px;
      height: 12px;
      vertical-align: unset;
      background: $elButtonBg;
    }
  }
  .questionnaire-type-radio {
    width: 100%;
    white-space: nowrap;
  }
  .questionnaire-h {
    .el-card__body {
      padding: 0;
    }
    .el-form {
      padding: 16px;
    }
  }
</style>
