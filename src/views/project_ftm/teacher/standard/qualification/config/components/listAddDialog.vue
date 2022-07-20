<template>
  <el-dialog
    width="900px"
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    v-loading="loading"
    center
    @closed="freshEvent"
  >
    <el-form ref="form" :model="formData" :rules="formRules" label-suffix=":" label-width="150px">
      <!-- 资质内容 -->
      <el-form-item :label="$t('table.qualificationContent')" prop="name">
        <el-input class="full-width" v-model="formData.name"></el-input>
      </el-form-item>
      <!-- 适应项目 -->
      <el-form-item :label="$t('table.applyProject')" prop="configsType">
        <el-radio-group v-model="formData.configsType">
          <el-radio :label="true">{{ $t('common.all') }}</el-radio>
          <el-radio :label="false">{{ $t('common.custom') }}</el-radio>
        </el-radio-group>
        <el-select
          class="long-select listAdd-ml"
          v-if="formData.configsType === false"
          v-model="formData.configsIds"
          :placeholder="$t('holder.pleaseSelectSyllabus')"
          multiple
          collapse-tags
          @change="selectCourseEvent"
        >
          <el-option
            v-for="item in formFilter.course"
            :key="item.id"
            :label="`${computeCourseKey(item.id, 'name')}(${computeCourseKey(item.id, 'code')})`"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 机型/职务 -->
      <el-form-item
        v-if="formData.configsType === false"
        :label="`${$t('table.modelNumber')}/${$t('table.job')}`"
        prop="configs"
        key="configs"
      >
        <ul
          class="listAdd-airplane"
          v-if="Array.isArray(formData.configs) && formData.configs.length > 0"
        >
          <li v-for="(item, index) in formData.configs" :key="index">
            <label>{{ computeCourseKey(item.courseId, 'code') }}</label>
            <!-- 机型选择 -->
            <el-select
              class="sort-select"
              multiple
              collapse-tags
              :placeholder="$t('holder.pleaseSelectAriModel')"
              v-model="item.airplaneType"
              @change="selectAirplaneEvent"
            >
              <el-option
                v-for="airplane in computeCourseAirplane(item.courseId)"
                :key="airplane"
                :label="airplane"
                :value="airplane"
              ></el-option>
            </el-select>
            <ul
              class="listAdd-airplane inline-block"
              v-if="Array.isArray(item.builtinRole) && item.builtinRole.length > 0"
            >
              <li v-for="(roleItem, roleIndex) in item.builtinRole" :key="roleIndex">
                <strong class="c-label">{{ roleItem.id }}</strong>
                <!-- 职位选择 -->
                <el-select
                  class="long-select"
                  :placeholder="$t('holder.pleaseSelectRole')"
                  v-model="roleItem.value"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="airplane in formFilter.role"
                    :key="airplane.id"
                    :label="airplane.name"
                    :value="airplane.id"
                  ></el-option>
                </el-select>
              </li>
            </ul>
            <span class="c-label" v-else>{{ $t('tip.noSelectedAirplane') }}</span>
          </li>
        </ul>
        <div v-else>{{ $t('tip.noSelectedCourse') }}</div>
      </el-form-item>
      <!-- 终身有效 -->
      <el-form-item :label="$t('table.permanentlyEffective')" prop="lifeLong" key="lifeLong">
        <el-radio-group v-model="formData.lifeLong">
          <el-radio :label="true">{{ $t('common.yes') }}</el-radio>
          <el-radio :label="false">{{ $t('common.no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 提前提醒日 -->
      <el-form-item
        :label="$t('table.advanceRemindDay')"
        v-if="formData.lifeLong === false"
        prop="warningDays"
        key="warningDays"
      >
        <el-input-number
          class="full-width"
          :min="0"
          v-model="formData.warningDays"
        ></el-input-number>
      </el-form-item>
      <!-- 管理依据 -->
      <el-form-item
        :label="$t('table.managementBasis')"
        prop="managementBasis"
        key="managementBasis"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          v-model="formData.managementBasis"
        ></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('table.remarks')" prop="remark" key="remark">
        <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.remark"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="medium" plain @click="visible = false">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" :loading="loading" @click="submitEvent">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import {
    getQualificationRoles,
    getQualificationConfigurationsDetail,
    putQualificationConfigurations,
    postQualificationConfigurations,
  } from '/@/api/ftm/teacher/qualification'
  import { getCourses } from '/@/api/ftm/teacher/trainingPlan'
  import to from 'await-to-js'
  import XEUtils from 'xe-utils'
  const DefaultForm = {
    name: '',
    configsType: '',
    configs: [],
    configsIds: [],
    lifeLong: '',
    warningDays: 0,
    remark: '',
    managementBasis: '',
  }
  export default {
    data() {
      return {
        loading: false,
        formData: XEUtils.clone(DefaultForm, true),
        formRules: {
          name: [{ required: true, message: this.$t('holder.pleaseEnterQualificationContent') }],
          configsType: [{ required: true, validator: this.projectValidate }],
          configs: [{ required: true, validator: this.airplaneValidate }],
          lifeLong: [{ required: true, message: this.$t('holder.pleaseSelectLifelong') }],
        },
        formFilter: {
          role: [],
          course: [],
        },
      }
    },
    props: {
      id: [String, Number],
      show: Boolean,
      isModify: Boolean,
    },
    computed: {
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
      title() {
        return this.isModify ? this.$t('button.modify') : this.$t('button.add')
      },
    },
    watch: {
      visible: {
        immediate: true,
        handler(val) {
          val && this.isModify && this.getDetail()
        },
      },
    },
    created() {
      this.getQualificationRoles()
      this.getCourses()
    },
    methods: {
      // 获取配置详情
      async getDetail() {
        const [err, res] = await to(getQualificationConfigurationsDetail({ id: this.id }))
        if (!err && res.status == 200) {
          this.formData = {
            name: res.data.name,
            configsType: res.data.allCourse,
            configs: res.data.configs.reduce((arr, next) => {
              let currentItem = arr.find((item) => item.courseId == next.courseId)
              let currentIndex = arr.findIndex((item) => item.courseId == next.courseId)
              if (!!currentItem) {
                if (currentItem.airplaneType.includes(next.airplaneType) == false) {
                  currentItem.airplaneType.push(next.airplaneType)
                }
                if (currentItem.builtinRole.includes(next.builtinRole) == false) {
                  let roleItem = currentItem.builtinRole.find((v) => v.id == next.airplaneType)
                  let roleIndex = currentItem.builtinRole.findIndex(
                    (v) => v.id == next.airplaneType,
                  )
                  if (!!roleItem == true) {
                    currentItem.builtinRole[roleIndex].value.push(next.builtinRole)
                  } else {
                    currentItem.builtinRole.push({
                      id: next.airplaneType,
                      value: [next.builtinRole],
                    })
                  }
                }
                arr[currentIndex] = currentItem
                return arr
              } else {
                return arr.concat({
                  ...next,
                  airplaneType: [next.airplaneType],
                  builtinRole: [
                    {
                      id: next.airplaneType,
                      value: [next.builtinRole],
                    },
                  ],
                  courseName: this.computeCourseKey(next.courseId, 'name'),
                  courseCode: this.computeCourseKey(next.courseId, 'code'),
                })
              }
            }, []),
            configsIds: Array.from(new Set(res.data.configs.map((item) => item.courseId))),
            lifeLong: res.data.lifeLong,
            warningDays: res.data.warningDays,
            remark: res.data.remark,
            managementBasis: res.data.managementBasis,
          }
        }
      },
      // 获取职位
      async getQualificationRoles() {
        const [err, res] = await to(getQualificationRoles())
        if (!err && res.status == 200) {
          this.formFilter.role = res.data
        }
      },
      // 获取课程
      async getCourses() {
        const [err, res] = await to(getCourses({ page: 1, size: 1000 }))
        if (!err && res.status == 200) {
          this.formFilter.course = res.data.content
        }
      },
      // 选择课程 添加/删除机型
      selectCourseEvent() {
        this.formData.configs = this.formData.configsIds.map((id) => {
          let configItem = this.formData.configs.find((item) => item.courseId == id)
          if (!!configItem) {
            return configItem
          } else {
            return {
              airplaneType: [],
              builtinRole: [],
              courseId: id,
              courseName: this.computeCourseKey(id, 'name'),
              courseCode: this.computeCourseKey(id, 'code'),
            }
          }
        })
      },
      // 选择机型 添加/删除职位
      selectAirplaneEvent() {
        this.formData.configs = this.formData.configs.map((item) => {
          let hasRole = item.airplaneType.every((code) =>
            item.builtinRole.find((v) => v.id == code),
          )
          if (hasRole && item.airplaneType.length == item.builtinRole.length) {
            // 无变化
            return item
          } else if (hasRole) {
            // 删除职位
            item.builtinRole = item.builtinRole.filter((v) => item.airplaneType.includes(v.id))
            return item
          } else {
            // 添加职位
            item.airplaneType
              .filter((code) => !!item.builtinRole.find((v) => v.id == code) == false)
              .forEach((code) => {
                item.builtinRole.push({
                  id: code,
                  value: [],
                })
              })
            return item
          }
        })
      },
      computeCourseKey(id, keyname) {
        return (this.formFilter.course.find((item) => item.id == id) || {})[keyname]
      },
      computeCourseAirplane(id) {
        return (this.formFilter.course.find((item) => item.id == id) || {}).airplaneTypes || []
      },
      // 使用项目验证
      projectValidate(rule, value, cb) {
        if (value === true) {
          cb()
        } else if (value === false) {
          if (this.formData.configsIds instanceof Array && this.formData.configsIds.length > 0) {
            cb()
          } else {
            cb(new Error(this.$t('holder.pleaseSelectSyllabus')))
          }
        } else {
          cb(new Error(this.$t('holder.pleaseSelectApplyProject')))
        }
      },
      // 验证机型
      airplaneValidate(rule, value, cb) {
        if (value.some((item) => item.airplaneType.length < 1)) {
          cb(new Error(this.$t('holder.pleaseSelectAriModel')))
        } else if (
          value.some(
            (item) =>
              item.builtinRole.length < 1 || item.builtinRole.some((v) => v.value.length < 1),
          )
        ) {
          cb(new Error(this.$t('holder.pleaseSelectRole')))
        } else {
          cb()
        }
      },
      freshEvent() {
        this.formData = XEUtils.clone(DefaultForm, true)
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.resetFields()
        })
      },
      submitEvent() {
        this.$refs.form.validate((validity) => {
          if (!validity) return
          if (this.isModify) {
            this.modifyMethod()
          } else {
            this.addMethod()
          }
        })
      },
      // 处理成可修改/新增的数据格式
      getParams() {
        const params = this.$filterObject(this.formData, [
          'configs',
          'lifeLong',
          'managementBasis',
          'name',
          'remark',
          'warningDays',
        ])
        if (this.formData.configsType === true) {
          delete params.configs
        } else if (this.formData.configsType === false) {
          let list = []
          params.configs.forEach((config) => {
            for (let i = 0; i < config.airplaneType.length; i++) {
              let builtinRole =
                (config.builtinRole.find((v) => v.id == config.airplaneType[i]) || {}).value || []
              for (let j = 0; j < builtinRole.length; j++) {
                list.push({
                  ...config,
                  airplaneType: config.airplaneType[i],
                  builtinRole: builtinRole[j],
                })
              }
            }
          })
          params.configs = list
        }
        if (this.formData.lifeLong === true) {
          params.warningDays = 10000
        }
        params.validDays = params.warningDays
        return params
      },
      // 新增请求
      async addMethod() {
        const params = this.getParams()
        this.loading = true
        const [err, res] = await to(postQualificationConfigurations(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.addsuccessTip'))
          this.visible = false
          this.$emit('complate')
        }
      },
      // 修改请求
      async modifyMethod() {
        const params = {
          id: this.id,
          ...this.getParams(),
        }
        this.loading = true
        const [err, res] = await to(putQualificationConfigurations(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.editSuccessTip'))
          this.visible = false
          this.$emit('complate')
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .listAdd-ml {
    margin-left: 20px;
  }
  .listAdd-airplane {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin-bottom: 10px;
    }
    label {
      display: inline-block;
      width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 5px;
      text-align: right;
      vertical-align: middle;
    }
    .c-label {
      display: inline-block;
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 5px;
      text-align: right;
      vertical-align: middle;
    }
  }
  .sort-select {
    width: 160px;
  }
  .long-select {
    width: 290px;
  }
  .inline-block {
    display: inline-block;
    vertical-align: top;
  }
</style>
