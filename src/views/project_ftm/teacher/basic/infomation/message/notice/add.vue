<template>
  <div class="educations-form">
    <el-scrollbar>
      <div class="content-box">
        <div class="content-header">
          <el-divider direction="vertical" />{{ $t('table.messageContent') }}
        </div>
        <div class="content">
          <el-form :model="form" :rules="formRules" ref="noticeForm">
            <el-form-item required :label="$t('table.messageType')" prop="type">
              <el-select v-model="form.type" v-if="status != 'filestudy'" style="width: 80%">
                <el-option
                  v-for="item in typeArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <span v-else>{{ $t('table.learningDocumentNotification') }}</span>
            </el-form-item>
            <el-form-item required :label="$t('table.messageTitle')" prop="title">
              <el-input
                :placeholder="$t('holder.pleaseEnterTaskTitle')"
                v-model="form.title"
                style="width: 80%"
              />
            </el-form-item>

            <div v-if="form.type && form.type !== 1">
              <el-form-item :label="$t('table.messageTag')">
                <el-input
                  :placeholder="
                    $t('holder.pleaseEnter') + $t('table.messageTag') + $t('table.noMoreThanWords')
                  "
                  maxlength="4"
                  style="width: 80%"
                  v-model="form.tags[0]"
                />
              </el-form-item>
              <el-form-item required :label="$t('table.messageContent')" prop="content">
                <editor
                  ref="Editor"
                  style="width: 80%"
                  :content="form.content"
                  :autosize="{ minRows: 3 }"
                />
              </el-form-item>
              <el-form-item :label="$t('table.readingLimitTime')" prop="expiredDay">
                <el-input type="number" min="0" v-model="form.expiredDay" style="width: 80%">
                  <template v-slot:append>{{ $t('common.day') }}</template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('table.messageAttachment')">
                <el-upload
                  action="#"
                  style="display: inline-block"
                  :file-list="form.uploadFiles"
                  :auto-upload="false"
                  :on-change="addUploadFile"
                  :on-remove="removeUploadFile"
                >
                  <transition name="fade">
                    <span class="buttonEdit" v-if="!form.uploadFile">{{
                      $t('table.uploadAttachment')
                    }}</span>
                  </transition>
                </el-upload>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="content-box" v-if="form.type && form.type !== 1">
        <div class="content-header">
          <el-divider direction="vertical" />{{ $t('table.sendTo') }}
        </div>
        <div class="content">
          <el-tabs class="tabs-box" type="border-card" v-model="form.activeTab">
            <!-- 教员列表 -->
            <el-tab-pane :label="$t('table.teacher')" name="teacher" v-if="!userInfo.teacher">
              <div class="checked-all">
                <el-checkbox
                  v-if="teachers.length"
                  :value="form.teacher.length === teachers.length"
                  :indeterminate="
                    this.form.teacher.length < this.teachers.length && this.form.teacher.length > 0
                  "
                  @change="selectedAllTeachers"
                  >{{ $t('common.all') }}</el-checkbox
                >
              </div>
              <el-checkbox-group v-model="form.teacher">
                <el-checkbox
                  name="teacher"
                  v-for="item in teachers"
                  :key="item.id"
                  :label="item.userId"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </el-tab-pane>
            <!-- 学员列表 -->
            <el-tab-pane
              :label="$t('table.student')"
              name="student"
              v-if="userInfo.builtinRole != 'PLANNER' && userInfo.teacher"
            >
              <!-- 学员选择区 -->
              <section v-loading="studentLoading">
                <!-- <div class="checked-all">
                    <el-checkbox
                        v-if="students.length"
                        :value="form.student.length === students.length"
                        :indeterminate="form.student.length < students.length && form.student.length > 0"
                        @change="selectedAllStudents"
                    >{{ $t('common.all') }}</el-checkbox>
                </div>
                <el-form>
                    <el-form-item v-for="clazz in studentFilterArr" :key="clazz.id" class="custom-label">
                        <el-checkbox-group v-model="form.student">
                            <el-checkbox v-for="student in clazz.data || []" :key="student.id" :label="student.id" name="student">{{ student.name }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form> -->
                <el-tree
                  v-if="clazzs.length > 0"
                  ref="tree"
                  class="custom-tree"
                  lazy
                  node-key="courseNumber"
                  :show-checkbox="true"
                  :props="clazzPosition"
                  :load="loadStudent"
                  @check-change="triggerTree"
                />
              </section>
            </el-tab-pane>
            <!-- 计划员列表 -->
            <el-tab-pane :label="$t('table.planner')" name="planner" v-if="userInfo.teacherAdmin">
              <el-checkbox
                v-if="planners.length"
                :value="form.planner.length == planners.length"
                :indeterminate="form.planner.length < planners.length && form.planner.length > 0"
                @change="selectedPlanner"
                >{{ $t('common.all') }}</el-checkbox
              >
              <el-checkbox-group v-model="form.planner">
                <el-checkbox
                  name="planner"
                  v-for="item in planners"
                  :key="item.id"
                  :label="item.userId"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <fix-footer @confirm="hanlderConfirm" :loading="loading" />
    </el-scrollbar>
  </div>
</template>

<script>
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import { addNotice, getStudents, getEmployees, uploadFile } from '/@/api/ftm/teacher/education'
  import { noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import editor from '/@/components/Editor/index.vue'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { editor, FixFooter },
    data() {
      return {
        form: {
          type: undefined,
          activeTab: 'teacher',
          uploadFiles: [],
          student: [],
          teacher: [],
          planner: [],
          clazz: [],
          tags: [],
          expiredDay: undefined,
          content: '',
        },
        formRules: {
          type: [{ required: true, message: this.$t('holder.pleaseSelectMessageType') }],
          title: [{ required: true, message: this.$t('holder.pleaseEnterTheMessageTitle') }],
          content: [{ required: true, message: this.$t('holder.pleaseEnterTheMessageContent') }],
        },
        loading: false,
        teachers: [],
        students: [],
        planners: [],
        clazzs: [],
        checkedClazz: '',
        status: '',
        studentLoading: false,
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
        defaultStudents: [],
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      studentFilterArr() {
        let course = []
        for (let i = 0; i < this.students.length; i++) {
          let item = this.students[i]
          let clazz = item.clazz
          let index = course.map((v) => v.id).indexOf(item.clazz.id)
          if (index > -1) {
            course[index].data.push({
              id: item.userId,
              name: item.name,
            })
          } else {
            course.push({
              id: clazz.id,
              name: clazz.courseNumber,
              data: [
                {
                  id: item.userId,
                  name: item.name,
                },
              ],
            })
          }
        }
        return course
      },
      typeArr() {
        return [
          this.userInfo.teacher ? null : { id: 1, name: this.$t('table.publicInformation') },
          { id: 2, name: this.$t('table.notificationInformation') },
          // { id: 3, name: this.$t('table.learningDocumentNotification') }
        ].filter((v) => Boolean(v))
      },
    },
    created() {
      let { type, status } = this.$route.query
      type = Number(type)
      !Number.isNaN(type) && (this.form.type = type)
      status && (this.status = status) && status == 'filestudy' && (this.form.type = 3)

      // var timer = setInterval(() => {
      //     if(this.userInfo.id){
      //         clearInterval(timer)
      //     }
      // }, 200);
      let obj = this.userInfo
      if (obj.id && obj.teacherAdmin) {
        // 教务
        getEmployees({ size: 1000, builtinRole: 'PLANNER' }).then((res) => {
          this.planners = res.data.content
        })
        getEmployees({ size: 1000, builtinRole: 'THEORY_TEACHER,FLIGHT_TEACHER' }).then((res) => {
          this.teachers = res.data.content
        })
      } else if (obj.id && obj.teacher) {
        // 教员
        this.form.activeTab = 'student'
        noFinishedClazzs({ teacherUserId: this.userInfo.userId }).then((res) => {
          if (res.status == 200) {
            this.clazzs = res.data.content.map((item) => ({
              ...item,
              name: `${this.$t('table.classNumber')}: ${item.courseNumber}`,
            }))
          }
        })
      } else {
        getEmployees({ size: 1000, builtinRole: 'THEORY_TEACHER,FLIGHT_TEACHER' }).then((res) => {
          this.teachers = res.data.content
        })
      }
    },
    methods: {
      hanlderConfirm() {
        this.form.content = this.$refs.Editor ? this.$refs.Editor.getHtml() : ''
        this.$refs.noticeForm.validate((bool) => {
          if (bool) {
            this.Add()
          }
        })
      },
      // 获取将上传的文件
      addUploadFile(file, files) {
        this.form.uploadFiles = files
        return false
      },
      removeUploadFile(file, files) {
        this.form.uploadFiles = files
      },
      async Add() {
        if (this.form.type != 1 && this.form.student.length == 0 && this.form.teacher.length == 0)
          return this.$message({
            type: 'error',
            duration: 1500,
            message: this.$t('tip.selectSendPerson'),
          })
        this.loading = true
        let uploadFunc = this.form.uploadFiles.map((file) => {
          let uploadData = new FormData()
          uploadData.append('file', file.raw)
          uploadData.append('unzip', file.raw.name.split('.').pop().toLocaleLowerCase() == 'zip')
          return uploadFile(uploadData)
            .then()
            .catch((e) => {
              try {
                this.loading = false
                if (e.response.data.code == 'INVALID_UPLOAD_FILETYPE') {
                  const i = this.form.uploadFiles.findIndex((f) => file.uid == f.uid)
                  this.form.uploadFiles.splice(i, 1)
                } else {
                  throw new Error(e)
                }
              } catch (e) {
                console.log('其他错误')
              }
            })
        })
        let resArr = await Promise.all(uploadFunc)
        let uuid = resArr.map((v) => v.data.uuid)
        let params = {
          attachments: uuid,
          content: this.form.content,
          title: this.form.title,
          type: this.form.type,
          userIds: [].concat(this.form.teacher).concat(this.form.student).concat(this.form.planner),
          clazzIds: this.form.clazz,
          tags: this.form.tags,
          expiredDay: this.form.expiredDay,
        }
        if (this.form.type == 1) {
          delete params.attachments
          delete params.content
          delete params.userIds
          delete params.clazzIds
          delete params.tags
        }
        let [err, res] = await to(addNotice(params))
        this.loading = false
        if (!err) {
          this.$message({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.addsuccessTip'),
          })
          this.$router.back()
        }
      },
      // 按班级获取学员
      async getStudents() {
        let params = {
          // teacherUserId: this.userInfo.userId,
          // clazzStatusIN: 'NOT_STARTED,TRAINING',
          id: this.checkedClazz,
        }
        this.studentLoading = true
        await getStudents(params)
          .then((res) => {
            this.studentLoading = false
            if (res.status == 200) {
              this.students = res.data
            }
          })
          .catch(() => {
            this.studentLoading = false
          })
      },
      // 全选/全不选教员
      selectedAllTeachers(bool) {
        if (!bool) {
          this.form.teacher = []
        } else {
          this.form.teacher = this.teachers.map((v) => v.userId)
        }
      },
      // 全选/全不选学员
      selectedAllStudents(bool) {
        if (!bool) {
          this.form.student = []
        } else {
          this.form.student = this.students.map((v) => v.userId)
        }
      },
      // 全选/全不选班级学员
      selectedAllClazz(bool, list) {
        console.log(bool)
        if (bool) {
          let student = [].concat(this.form.student).concat(list.map((v) => v.id))
          this.form.student = student.reduce((pre, next) => {
            if (pre.includes(next)) {
              return pre
            } else {
              return pre.concat(next)
            }
          }, [])
        } else {
          this.form.student = this.form.student.filter((id) => {
            return !list.map((v) => v.id).includes(id)
          })
        }
      },
      // 全选/全不选计划员
      selectedPlanner(bool) {
        if (!bool) {
          this.form.planner = []
        } else {
          this.form.planner = this.planners.map((v) => v.userId)
        }
      },
      // 懒加载学员
      loadStudent(node, resolve) {
        if (node.level == 0) {
          resolve(this.clazzs)
        } else {
          let clazzId = node.data.id
          getStudents({
            id: clazzId,
            statusIN: 'NOT_STARTED,NOT_GRADUATED',
            teacherId: this.userInfo.id,
          })
            .then((res) => {
              if (res.status == 200) {
                let index = this.clazzs.findIndex((item) => item.id == clazzId)
                this.clazzs[index].students = res.data
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
            this.form.student.includes(row.userId) == false && this.form.student.push(row.userId)
          } else {
            let index_form = this.form.ids.indexOf(row.userId)
            this.form.student.splice(index_form, 1)
          }
        } else if (row.studens instanceof Array && row.studens.length > 0) {
          // 点击班级
          if (checked == true) {
            row.students.forEach((userId) => {
              this.form.student.includes(userId) == false && this.form.student.push(userId)
            })
          } else {
            this.form.student = this.form.student.filter((userId) => {
              return !row.students.some((userid) => userid == userId)
            })
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  $borderStyle: 1px solid #ccc;
  .educations-form {
    .content-box {
      // border: $borderStyle;
      margin-bottom: 20px;
      .content-header {
        padding-left: 12px;
        height: 44px;
        line-height: 44px;
        background: $textBg;
        font-size: 16px;
        font-weight: 700;
        color: $elButtonBg;
        .el-divider--vertical {
          width: 2px;
          height: 15px;
          vertical-align: unset;
          background: $elButtonBg;
        }
      }
      .content {
        padding: 20px;
      }
      .checked-all {
        margin: 10px 0;
      }
      :deep(.el-form-item__label) {
        width: 6em;
        // line-height: 1.5;
        word-break: break-all;
      }
      :deep(.el-form-item__content) {
        margin-left: 6em;
      }
      :deep(.el-checkbox-group) {
        line-height: 30px;
      }
      :deep(.el-upload) {
        display: block;
        text-align: left;
      }

      :deep(.tabs-box) {
        .el-form-item__label {
          width: 10em;
          line-height: 30px;
        }
      }
      .custom-label {
        :deep(.el-form-item__label) {
          position: relative;
          width: unset;
          min-width: 6em;
          z-index: 2;
          text-align: left;
        }
        :deep(.el-form-item__content) {
          margin-left: unset;
        }
      }
    }
  }
</style>
