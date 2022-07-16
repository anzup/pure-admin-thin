<template>
  <el-scrollbar>
    <div class="container">
      <el-form ref="liveForm" label-width="30%" :model="form" :rules="formRules">
        <el-form-item :label="$t('table.liveName')" prop="name">
          <el-input
            class="form-item-width"
            :placeholder="$t('holder.pleaseEnter')"
            v-model="form.name"
          />
        </el-form-item>
        <el-form-item :label="$t('table.liveImage')" prop="file" ref="fileForm">
          <el-upload
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :multiple="false"
            :on-change="uploadPreviewFile"
          >
            <div class="upload-preview" v-if="form.file">
              <img :src="form.file_preview" alt="" />
            </div>
            <div class="upload-preview" v-else-if="form.coverUuid">
              <img :src="previewURL(form.coverUuid)" alt="" />
            </div>
            <div class="no-upload" v-else>{{ $t('button.upload') }}</div>
          </el-upload>
          <p class="no-upload-point">{{ $t('tip.uploadImageSizeTip') }}</p>
        </el-form-item>
        <el-form-item :label="$t('table.liveCouseNumber')" prop="number">
          <el-select
            class="form-item-width"
            :placeholder="$t('holder.pleaseSelect')"
            v-model="form.number"
          >
            <el-option
              v-for="(item, index) in form.clazz"
              :key="index"
              :label="item.courseNumber"
              :value="item.courseNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.liveTime')" prop="time">
          <el-date-picker class="form-item-width" type="datetime" v-model="form.time" />
        </el-form-item>
        <el-form-item :label="$t('table.liveRecord')">
          <el-switch v-model="form.record" />
        </el-form-item>
        <el-form-item :label="$t('table.liveStudent')" prop="student">
          <!-- <div v-for="(clazz,iclazz) in studentTree" :key="clazz.id" class="clazz-item">
              <el-checkbox :indeterminate="clazz.indeterminate" v-model="clazz.all" @change="handlerCheckedClazz(iclazz, $event)">{{ clazz.name }}</el-checkbox>
              <el-checkbox-group class="student-item" v-model="form.student" @change="handlerChecked(clazz, $event)">
                  <el-checkbox v-for="item in clazz.data" :key="item.id" :label="item.id" @change="hanlderCheckboxItem">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
          </div> -->
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
          />
        </el-form-item>
      </el-form>
      <fix-footer :loading="loading" @confirm="handleSave" />
    </div>
  </el-scrollbar>
</template>

<script>
  import { getStudents } from '/@/api/ftm/teacher/education'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { getpLives, putLives, postLives } from '/@/api/ftm/teacher/teachingCenter'
  import { postUpload } from '/@/api/ftm/teacher/file'
  import { blobToDataURL, dataURLtoFile } from '/@/utils/index'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()

  export default {
    components: { FixFooter },
    data() {
      const studentValide = (rule, val, cb) => {
        if (!val || val.length == 0) {
          cb(new Error(this.$t('holder.pleaseSelectLiveStudent')))
        } else {
          cb()
        }
      }
      return {
        previewURL,
        Menu: {
          student: [],
          clazzs: [],
        },
        form: {
          name: '',
          file: undefined,
          file_preview: '',
          number: '',
          time: '',
          student: [],
          clazz: [],
          record: false,
        },
        formRules: {
          name: [{ required: true, message: this.$t('holder.pleaseEnterLiveName') }],
          number: [{ required: true, message: this.$t('holder.pleaseEnterLiveCoureNumber') }],
          time: [{ required: true, message: this.$t('holder.pleaseSelectLiveTime') }],
          student: [{ required: true, validator: studentValide }],
        },
        studentTree: [],
        studentChecked: {
          indeterminate: false,
          all: false,
        },
        loading: false,
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
      // 操作直播类型 1:创建 2:修改
      type() {
        return this.$route.name == 'MyJobTeachingLiveEdit' ? 2 : 1
      },
      id() {
        return this.$route.query.id
      },
    },
    async created() {
      if (this.type == 2) {
        await this.getLiveInfo()
      }
      this.getClazzs()
    },
    methods: {
      // 获取班级课号
      async getClazzs() {
        let params = {
          teacherUserId: this.userInfo.userId,
          size: 1000,
          type: 'WET_LEASE',
          statusIN: 'NOT_STARTED,TRAINING',
        }
        let [err, res] = await to(getClazzs(params))
        if (!err) {
          this.form.clazz = res.data.content
          this.Menu.clazzs = res.data.content.map((item) => ({
            ...item,
            name: `${this.$t('table.classNumber')}: ${item.courseNumber}`,
          }))
        }
      },
      // 获取直播信息
      async getLiveInfo() {
        let [err, res] = await to(getpLives({ id: this.id }))
        if (!err) {
          this.form.student = res.data.audienceUserIds
          this.form.number = res.data.courseNumber
          this.form.name = res.data.name
          this.form.record = Boolean(res.data.record)
          this.form.time = res.data.startTime
          this.form.coverUuid = res.data.coverUuid

          this.defaultCourseNumber = res.data.audienceUserDetails.map((v) => v.courseNumber)
          this.defaultStudents = res.data.audienceUserDetails.map((item) => `${item.userId}`)
        }
      },
      // 全选/全不选学员
      hanlderCheckboxAll(status) {
        this.studentChecked.indeterminate = false
        this.studentTree.forEach((clazz) => {
          clazz.all = status
          clazz.indeterminate = false
        })
        if (status) {
          this.form.student = this.Menu.student.map((v) => v.userId)
        } else {
          this.form.student = []
        }
      },
      // 全选学员班级
      handlerCheckedClazz(index, val) {
        let clazz = this.studentTree[index]
        let ids = this.form.student
        clazz.indeterminate = false
        clazz.data.forEach((v) => {
          let i = ids.indexOf(v.id)
          if (val) {
            i < 0 && this.form.student.push(v.id)
          } else {
            i > -1 && this.form.student.splice(i, 1)
          }
        })

        let students = this.Menu.student.map((v) => v.userId)
        this.studentChecked.all = students.every((v) => this.form.student.includes(v))
        this.studentChecked.indeterminate =
          students.some((v) => this.form.student.includes(v)) && !this.studentChecked.all
      },
      // 单选学员
      handlerChecked() {
        this.studentTree.forEach((clazz) => {
          let studentID = clazz.data.map((v) => v.id)
          clazz.all = studentID.every((v) => this.form.student.includes(v))
          clazz.indeterminate = studentID.some((v) => this.form.student.includes(v)) && !clazz.all
        })
      },
      // 单选
      hanlderCheckboxItem() {
        let list = this.Menu.student.map((v) => v.userId)
        let checkedNum = 0
        list.forEach((item) => {
          checkedNum += this.form.student.includes(item) ? 1 : 0
        })
        this.studentChecked.indeterminate =
          !list.every((id) => this.form.student.includes(id)) && checkedNum > 0
        this.studentChecked.all = checkedNum == list.length ? true : false
      },
      // 选择图片事件
      uploadPreviewFile(file) {
        let that = this
        this.valideCover(file, (bool) => {
          if (bool) {
            that.form.file = file.raw
            that.$refs.fileForm.clearValidate()
            blobToDataURL(file.raw, (baseUrl) => {
              that.form.file_preview = baseUrl
            })
          }
        })
      },
      // 验证图片文件
      valideCover(file, cb) {
        let { size = 0, type } = file.raw
        if (type != 'image/jpeg' && type != 'image/png') {
          return this.$message.error(this.$t('tip.uploadImageFormatError'))
        }
        if (size > 1024 * 1024 * 2) {
          return this.$message.error(this.$t('tip.uploadImageSizeLimit'))
        }
        cb && cb(true)
      },
      // 提交
      async handleSave() {
        this.$refs.liveForm.validate(async (bool) => {
          if (bool) {
            let params = {
              id: this.id,
              audienceUserIds: this.form.student,
              courseNumber: this.form.number,
              coverUuid: this.form.coverUuid,
              name: this.form.name,
              record: this.form.record, // 是否录播
              startTime: this.form.time,
              userId: this.userInfo.userId,
            }
            let that = this
            this.loading = true
            // 上传直播封面
            await to(
              (function () {
                return new Promise(function (reslove, reject) {
                  if (that.form.file_preview) {
                    let formData = new FormData()
                    formData.append(
                      'file',
                      dataURLtoFile(that.form.file_preview, 'live_preview.jpg'),
                    )
                    postUpload(formData)
                      .then((res) => {
                        params.coverUuid = res.data.uuid
                        reslove()
                      })
                      .catch(() => {
                        reject()
                      })
                  } else {
                    reslove()
                  }
                })
              })(),
            )
            // 提交创建直播
            let [err, res] = await to(this.type == 2 ? putLives(params) : postLives(params))
            this.loading = false
            if (!err) {
              this.$message.success(this.$t('tip.saveSuccessTip'))
              this.$router.back()
            }
          }
        })
      },
      // 懒加载学员
      loadStudent(node, resolve) {
        if (node.level == 0) {
          resolve(this.Menu.clazzs)
        } else {
          let clazzId = node.data.id
          getStudents({
            id: clazzId,
            teacherId: this.userInfo.id,
            statusIN: 'NOT_GRADUATED',
          })
            .then((res) => {
              if (res.status == 200) {
                let index = this.Menu.clazzs.findIndex((item) => item.id == clazzId)
                this.Menu.clazzs[index].students = res.data
                if (this.type == 2) {
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
            this.form.student.includes(row.userId) == false && this.form.student.push(row.userId)
          } else {
            let index_form = this.form.student.indexOf(row.userId)
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

<style scoped lang="scss">
  .container {
    $upload-height: (400px / 4 * 3);
    .no-upload {
      width: 400px;
      height: $upload-height;
      line-height: $upload-height;
      font-size: 14px;
      text-align: center;
      background: #f1f1f1;
    }
    .upload-preview {
      width: 400px;
      height: $upload-height;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .no-upload-point {
      margin: 15px 0 5px;
      line-height: 1;
      color: #999;
    }
    .form-item-width {
      width: 400px;
    }
    .clazz-item {
      padding-left: 20px;
    }
    .student-item {
      padding-left: 20px;
    }
  }
</style>
