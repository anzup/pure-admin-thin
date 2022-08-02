<template>
  <div class="educations-form">
    <el-scrollbar>
      <div class="content-box">
        <div class="content-header">
          <el-divider direction="vertical" />
          {{ $t('table.messageContent') }}
        </div>
        <div class="content">
          <el-form :model="form" :rules="formRules" ref="noticeForm" label-width="120px">
            <!-- <el-form-item required :label="$t('table.messageType')" prop="type">
                <el-select v-model="form.type">
                    <el-option
                        v-for="item in form.typeArr" :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item> -->
            <el-form-item required :label="$t('table.messageTitle')" prop="title">
              <el-input
                :placeholder="$t('holder.pleaseEnterTaskTitle')"
                maxlength="30"
                v-model="form.title"
              />
            </el-form-item>

            <div>
              <el-form-item :label="$t('table.messageTag')">
                <el-input
                  :placeholder="
                    $t('holder.pleaseEnter') + $t('table.messageTag') + $t('table.noMoreThanWords')
                  "
                  maxlength="4"
                  v-model="form.tags[0]"
                />
              </el-form-item>
              <el-form-item required :label="$t('table.messageContent')" prop="content">
                <el-input
                  type="textarea"
                  :placeholder="$t('holder.pleaseEnter') + $t('table.messageContent')"
                  v-model="form.content"
                />
              </el-form-item>
              <el-form-item :label="$t('table.messageAttachment')">
                <el-upload
                  action="#"
                  style="display: inline-block"
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
      <div class="content-box">
        <div class="content-header">
          <el-divider direction="vertical" />
          {{ $t('table.sendTo') }}
        </div>
        <div class="content">
          <el-tabs class="tabs-box" type="border-card" v-model="form.activeTab">
            <el-tab-pane :label="$t('table.student')" name="teacher">
              <!-- <div
                v-for="(item, index) in studentFilterArr"
                :key="index"
                class="user-group-container"
            >
                <el-checkbox
                    :indeterminate="item.isIndeterminate"
                    v-model="item.checkAll"
                    @change="
                        (val) => handleCheckAllChange(val, item)
                    "
                    >{{item.name}}</el-checkbox
                >
                <el-checkbox-group
                    v-model="item.select"
                    @change="
                        (val) => handleCheckedChange(val, item)
                    "
                >
                    <el-checkbox
                        v-for="user in item.data"
                        :label="user.id"
                        :key="user.id"
                        >{{ user.name }}</el-checkbox
                    >
                </el-checkbox-group>
            </div> -->

              <!-- 学员选择区 -->
              <el-card class="mb">
                <div class="card-title">
                  <h2>{{ $t('table.student') }}</h2>
                </div>
                <el-tree
                  v-if="clazzs.length > 0"
                  ref="tree"
                  class="custom-tree"
                  lazy
                  :default-expanded-keys="defaultCourseNumber"
                  node-key="courseNumber"
                  :show-checkbox="true"
                  :props="clazzPosition"
                  :load="loadStudent"
                  @check-change="triggerTree"
                />
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-scrollbar>
    <fix-footer @cancel="hanlderCancel" @confirm="hanlderConfirm" :loading="loading" />
  </div>
</template>

<script>
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import { addNotice, getStudents, uploadFile } from '/@/api/ftm/teacher/education'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { FixFooter },
    data() {
      return {
        form: {
          type: 4,
          // typeArr: [
          //     { id: 1, name: this.$t('table.publicInformation') },
          //     { id: 2, name: this.$t('table.notificationInformation') },
          //     { id: 3, name: this.$t('table.learningDocumentNotification') }
          // ],
          activeTab: 'teacher',
          uploadFiles: [],
          student: [],
          teacher: [],
          clazz: [],
          tags: [],
          groupIds: [],
        },
        formRules: {
          type: [
            {
              required: true,
              message: this.$t('holder.pleaseSelectMessageType'),
            },
          ],
          title: [
            {
              required: true,
              message: this.$t('holder.pleaseEnterTheMessageTitle'),
            },
          ],
          content: [
            {
              required: true,
              message: this.$t('holder.pleaseEnterTheMessageContent'),
            },
          ],
        },
        loading: false,
        teachers: [],
        students: [],
        clazzs: [],
        studentFilterArr: [],
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
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    created() {
      // getTeachers().then(res => { this.teachers = res.data.content })
      this.getClazzs()
    },
    // watch: {
    //     userInfo: {
    //         deep: true,
    //         immediate: true,
    //         handler(obj){
    //             if(obj.id && obj.teacherAdmin){ // 教务
    //                 getClazz().then(res => { this.clazzs = res.data.content })
    //             }else if(obj.id && obj.teacher){ // 教员
    //                 this.form.activeTab = 'student'
    //                 getStudents({ teacherUserId: this.userInfo.userId }).then(res => { this.students = res.data.content })
    //             }
    //         }
    //     }
    // },
    methods: {
      async getClazzs() {
        let params = {
          statusIN: 'NOT_STARTED,TRAINING',
          type: 'WET_LEASE',
          size: 1000,
          teacherUserId: this.userInfo.userId,
        }
        let [err, res] = await to(getClazzs(params))
        if (res.status == 200) {
          this.clazzs = res.data.content.map((item) => ({
            ...item,
            name: `${this.$t('table.classNumber')}: ${item.courseNumber}`,
          }))
        }
      },
      handleCheckAllChange(val, item) {
        // console.log(val, item);
        item.select = val ? item.data.map((v) => v.id) : []
        item.isIndeterminate = false
      },
      handleCheckedChange(val, item) {
        // console.log(val, item);
        let checkedCount = val.length
        item.checkAll = checkedCount === item.data.length
        item.isIndeterminate = checkedCount > 0 && checkedCount < item.data.length
      },
      hanlderCancel() {
        this.$router.back()
      },
      hanlderConfirm() {
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
        if (this.form.student.length == 0 && this.form.teacher.length == 0)
          return this.$message({
            type: 'error',
            duration: 1500,
            message: this.$t('tip.selectSendPerson'),
          })
        this.loading = true
        let uploadFunc = this.form.uploadFiles.map((file) => {
          let uploadData = new FormData()
          let isZIP = file.name.split('.').pop().toLocaleLowerCase() == 'zip'
          uploadData.append('file', file.raw)
          isZIP && uploadData.append('unzip', true)
          return uploadFile(uploadData)
        })
        let resArr = await Promise.all(uploadFunc)
        let uuid = resArr.map((v) => v.data.uuid)
        let params = {
          attachments: uuid,
          content: this.form.content,
          title: this.form.title,
          type: this.form.type,
          userIds: [].concat(this.form.teacher).concat(this.form.student),
          groupIds: this.form.groupIds,
          tags: this.form.tags,
          userCourseNumbers: this.form.userCourseNumbers,
        }
        await addNotice(params).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.$message({
          type: 'success',
          duration: 1500,
          message: this.$t('tip.addsuccessTip'),
        })
        this.$router.back()
      },
      // 懒加载学员
      loadStudent(node, resolve) {
        if (node.level == 0) {
          resolve(this.clazzs)
        } else {
          let clazzId = node.data.id
          getStudents({
            id: clazzId,
            size: 1000,
            statusIN: 'NOT_STARTED,NOT_GRADUATED',
            teacherId: this.userInfo.id,
          })
            .then((res) => {
              if (res.status == 200) {
                let index = this.clazzs.findIndex((item) => item.id == clazzId)
                this.clazzs[index].students = res.data
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
                    groupId: clazzId,
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
            this.form.student.includes(row.userId) == false &&
              this.form.student.push(row.userId) &&
              this.form.groupIds.indexOf(row.groupId) < 0 &&
              this.form.groupIds.push(row.groupId)
          } else {
            let index_form = this.form.student.indexOf(row.userId)
            this.form.student.splice(index_form, 1)
            let index_group = this.form.groupIds.indexOf(row.groupId)
            this.form.groupIds.splice(index_group, 1)
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

      .el-form-item__label {
        width: 6em;
        // line-height: 1.5;
        word-break: break-all;
      }

      .el-form-item__content {
        margin-left: 6em;
      }

      .el-checkbox-group {
        line-height: 30px;
      }

      .el-upload {
        display: block;
        text-align: left;
      }

      .tabs-box {
        .el-form-item__label {
          width: 10em;
          line-height: 30px;
        }
      }
    }
  }

  .user-group-container {
    display: flex;
    // margin-bottom: 10px;
    & > .el-checkbox {
      margin-right: 20px;
      min-width: 150px;
    }
  }
</style>
