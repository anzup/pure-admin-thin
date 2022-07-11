<template>
  <div class="detail-main-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('text.essential_information') }}</span>
        </div>
      </template>
      <el-form :model="form" ref="formRef" :rules="rules as any" label-width="170px">
        <el-row>
          <el-col :span="11" :offset="1">
            <el-form-item prop="year" :label="$t('text.year')">
              <el-date-picker
                @change="formChange"
                v-model="form.year"
                type="year"
                :placeholder="$t('text.please_select')"
                :clearable="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item
              prop="courseId"
              :label="$t('text.course_project_code') + '【' + $t('text.name') + ']'"
            >
              <el-select
                @change="formChange"
                filterable
                v-model="form.courseId"
                :placeholder="$t('text.please_select')"
              >
                <el-option
                  v-for="item in coursesList"
                  :key="item.id"
                  :label="item.code + `【${item.name}】`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="shortName" :label="$t('text.class_name')">
              <el-input v-model="form.shortName" :placeholder="$t('text.please_enter')" />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="number" :label="$t('text.class_number')">
              <el-row>
                <el-col :span="16">
                  <el-input
                    :readonly="readonly"
                    v-model="courseCode"
                    :placeholder="$t('text.please_enter')"
                  />
                </el-col>

                <el-col :span="8">
                  <el-input
                    :readonly="readonly"
                    v-model="form.number"
                    :placeholder="$t('text.please_enter')"
                  />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="startTime" :label="$t('text.start_training_time')">
              <el-date-picker
                :disabled-date="startDateDisabled"
                v-model="form.startTime"
                type="date"
                :placeholder="$t('text.select_date')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="endTime" :label="$t('text.estimated_training_completion_time')">
              <el-date-picker
                :disabled-date="endDateDisabled"
                v-model="form.endTime"
                type="date"
                :placeholder="$t('text.select_date')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="syllabusId" :label="$t('message.trainingCourses')">
              <el-select
                v-model="form.syllabusId"
                :placeholder="$t('text.please_select')"
                filterable
                :disabled="!form.courseId"
              >
                <el-option
                  v-for="item in syllabusesList"
                  :key="item.id"
                  :label="item.shortName"
                  :value="item.id"
                >
                  <span style="float: left"> {{ item.shortName }}【{{ item.version }}】 </span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                      color: red;
                    "
                    v-show="!item.hasTheory || !item.hasFlight"
                  >
                    {{ $t('text.the_outline_is_not_set') }}
                    <span v-show="!item.hasTheory">
                      {{ $t('text.theory') }}
                    </span>
                    <span v-show="!item.hasFlight">
                      <span v-show="!item.hasTheory">/</span>
                      {{ $t('text.flight') }}
                    </span>
                    {{ $t('text.curriculum') }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col
                        :span="11"
                        :offset="1"
                        v-if="$route.params.type !== 'INTERNAL_TRAINING'"
                    >
                        <el-form-item prop="customers" :label="$t('text.connection')">
                            <el-select
                                v-model="form.customers"
                                :placeholder="$t('text.please_select')"
                                multiple
                                :multiple-limit="
                                    $route.params.type == 'DRY_LEASE' ? 1 : 99
                                "
                            >
                                <el-option
                                    v-for="item in customerAllList"
                                    :label="item.name"
                                    :value="item.id"
                                    :key="item.id"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>-->
          <el-col :span="11" :offset="1" v-if="route.params.type !== 'INTERNAL_TRAINING'">
            <el-form-item prop="contracts" :label="$t('text.related_contract')">
              <el-select
                :disabled="!form.courseId"
                v-model="form.contracts"
                :placeholder="$t('text.please_select')"
                multiple
                :multiple-limit="form.type == 'DRY_LEASE' ? 1 : 0"
                filterable
              >
                <el-option
                  :disabled="canSelect(item)"
                  v-for="item in contractsList"
                  :label="item.contractNo"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col v-if="isBatch" :span="11" :offset="1">
            <el-form-item prop="addNum" :label="$t('text.number_of_new_classes')">
              <el-input-number v-model="form.addNum" :min="1" :label="$t('text.please_enter')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-divider v-if="$route.params.type == 'WET_LEASE'" />
    <el-card class="box-card" v-if="$route.params.type == 'WET_LEASE'">
      <template #header>
        <div class="card-header">
          <span>{{ $t('text.group_management') }}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{ $t('text.total_class_size') }} ：{{ getNum }}</span>
        </div>
      </template>
      <Grouping ref="groupRef" v-model="groupingAddBOS" />
    </el-card>
    <div class="footer-container">
      <el-button @click="$router.go(-1)">{{ $t('message.hscancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('message.hssave') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted, computed } from 'vue'
  import Grouping from './components/grouping.vue'
  import { getCoursesAll, getSyllabusesList } from '/@/api/opm/standard'
  import { getContractsList } from '/@/api/opm/contract'
  import {
    getClazzsNumber,
    postClazzs,
    putClazzsId,
    getClazzsDetail,
    getGroupingsList,
    putGroupingsBatchUpdate,
  } from '/@/api/opm/train'

  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import { useI18n } from 'vue-i18n'
  import useCustomer from '/@/commonTs/customer'
  import to from 'await-to-js'
  import type { ElForm } from 'element-plus'

  type ElFormInstance = InstanceType<typeof ElForm>
  const { t } = useI18n()
  const router = useRouter(),
    route = useRoute()

  const isBatch = computed(() => !!route.params.batch)
  const formRef = ref()
  const groupRef = ref()
  const state = reactive({
    form: {
      shortName: undefined,
      year: dayjs().format(),
      courseId: undefined,
      courseNumber: undefined,
      startTime: undefined,
      endTime: undefined,
      syllabusId: undefined,
      customers: [],
      departmentId: undefined,
      number: undefined,
      type: undefined,
      addNum: 1,
      id: undefined,
      contracts: [],
    },
    groupingAddBOS: [],
    rules: {
      shortName: [
        {
          required: true,
          message: t('text.please_enter'),
          trigger: 'change',
        },
      ],
      year: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      courseId: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      number: [
        {
          required: true,
          message: t('text.please_enter'),
          trigger: 'change',
        },
        {
          validator: (rule, value, callback) => {
            if (!courseCode.value || !value) {
              return callback(new Error(t('text.please_enter')))
            }
            if (!/^[+]{0,1}(\d+)$/.test(value)) {
              return callback(new Error(t('rules.only_positive_integers')))
            }
            callback()
          },
          trigger: 'change',
        },
      ],
      syllabusId: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      departmentId: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'blur',
        },
      ],
      startTime: [
        {
          required: false,
          type: 'date',
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      endTime: [
        {
          required: false,
          type: 'date',
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      contracts: [
        {
          required: route.params.type !== 'INTERNAL_TRAINING',
          type: 'array',
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      addNum: [
        {
          required: true,
          type: 'number',
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
    } as ElFormInstance['rules'],
    coursesList: [],
    syllabusesList: [],
  })
  const contractsList = ref([])

  // 关联合同是否禁用选项
  const canSelect = computed(() => (val) => {
    // 干租判断长度，只能为1
    return state.form.type == 'DRY_LEASE'
      ? state.form.contracts.length == 1 && state.form.contracts[0] !== val.id
      : state.form.contracts.length > 0
      ? !state.form.contracts.includes(val.id) &&
        // 判断当前item是不是已经选择过的客户，如果是则禁用除选中的哪一个之外的全部
        contractsList.value
          .filter((v) => state.form.contracts.includes(v.id))
          .some((v) => v.customerId == val.customerId)
      : false
  })
  const getContracts = () => {
    getContractsList({
      page: 1,
      size: 1000,
      valid: true,
      courseId: route.params.type == 'WET_LEASE' ? state.form.courseId : undefined,
    }).then((res) => {
      contractsList.value = res.data.content
    })
  }

  const { form, groupingAddBOS, rules, coursesList, syllabusesList } = toRefs(state)

  const courseCode = ref<string>(undefined)

  const isGetNumber = computed(() => {
    return state.form.year && state.form.courseId
  })

  // 班级课号是否禁用
  const disabledCouese = computed<boolean>(
    () => !isGetNumber.value || isBatch.value || !!route.params.id,
  )

  // 关联合同是否禁用选项

  // 获取班级总人数
  const getNum = computed(() =>
    state.groupingAddBOS.length > 0
      ? state.groupingAddBOS.map((v) => v.num).reduce((a, b) => a + b)
      : 0,
  )

  async function formChange() {
    if (isGetNumber.value) {
      if (
        !cacheData.number ||
        cacheData.courseId != form.value.courseId ||
        cacheData.year != form.value.year
      ) {
        const [err, res] = await to(
          getClazzsNumber({
            year: dayjs(state.form.year).year(),
            courseId: state.form.courseId,
          }),
        )
        if (err) return
        state.form.number = res.data
        // state.form.courseNumber =
        //     (dayjs(state.form.year).year() + "").slice(2) +
        //     state.coursesList.find(v => v.id == state.form.courseId).code +
        //     res.data;
        state.form.shortName = state.coursesList.find((v) => v.id == state.form.courseId)?.name
      } else {
        form.value.number = cacheData.number
      }
      if (!route.params.id || !courseCode.value) {
        courseCode.value =
          (dayjs(state.form.year).year() + '').slice(2) +
          state.coursesList.find((v) => v.id == state.form.courseId).code
      }
    }
    state.form.syllabusId = undefined
    // state.form.customers = [];
    state.form.contracts = []
    getSyllabuses()
    getContracts()
  }
  function getGroupings() {
    getGroupingsList({
      page: 1,
      size: 100,
      clazzId: route.params.id as string,
      order: 'asc',
    }).then(({ data }) => {
      state.groupingAddBOS = data.content.map((v) => {
        return {
          id: v.id,
          name: v.name,
          num: v.num,
          studentIds: v.students,
          teacherIds: v.teachers,
        }
      })
    })
  }
  function confirm() {
    formRef.value.validate(async (valid: boolean) => {
      if (valid && (route.params.type == 'WET_LEASE' ? await groupRef.value.submitForm() : true)) {
        let api = undefined
        let form = {}
        state.form.courseNumber = courseCode.value + state.form.number
        state.form.customers = contractsList.value
          .filter((v) => state.form.contracts.includes(v.id))
          .map((v) => v.customerId)
        if (!route.params.id) {
          const data = {
            ...state.form,
            year: dayjs(state.form.year).year(),
          }

          form = {
            clazzAddBO: data,
            groupingAddBOS: state.groupingAddBOS,
            id: undefined,
            addNum: state.form.addNum,
          }
          api = postClazzs
        } else {
          /**
           * 修改
           */
          // form.id = route.params.id;
          form = {
            ...state.form,
            id: route.params.id,
            year: dayjs(state.form.year).year(),
          }
          api = putClazzsId
          putGroupingsBatchUpdate({
            clazzId: route.params.id as string,
            data: state.groupingAddBOS.map((v) => {
              const { id, name, num, studentIds = [], teacherIds = [] } = v
              return {
                id,
                name,
                num,
                studentIds: studentIds.map((i) => i.id),
                teacherIds: teacherIds.map((i) => i.id),
              }
            }),
          }).then(() => {
            getGroupings()
          })
        }
        api(form).then((res: any) => {
          const { status } = res
          if (status == 200) {
            ElMessage.success({
              message: !route.params.id
                ? t('message.successfully_added')
                : t('message.modified_successfully'),
              type: 'success',
            })
            router.go(-1)
          }
        })
      }
    })
  }

  const getSyllabuses = () => {
    getSyllabusesList({
      page: 1,
      size: 100,
      courseType: route.params.type as string,
      courseId: state.form.courseId,
      needCheckItems: true,
    }).then((res) => {
      state.syllabusesList = res.data.content
    })
  }
  const { getCustomersAllList, customerAllList } = useCustomer()

  // 修改时缓存当前选择的课程类型的序号
  const cacheData = {
    number: undefined,
    courseId: undefined,
    year: undefined,
  }

  onMounted(() => {
    getCustomersAllList()
    state.form.type = route.params.type
    getCoursesAll().then((res) => {
      state.coursesList = res.data
    })

    if (route.params.id) {
      getClazzsDetail(route.params.id as string).then((res) => {
        const { data } = res
        // 修改时缓存
        cacheData.number = data.number
        cacheData.courseId = data.course.id
        cacheData.year = res.data.year

        state.form.year = dayjs(data.year + '-01-01').format()
        state.form.courseId = data.course.id
        state.form.courseNumber = data.courseNumber
        state.form.startTime = data.startTime
        state.form.endTime = data.endTime
        state.form.syllabusId = data.syllabus.id
        // state.form.departmentId = data.department.id;
        // state.form.customers = data.customers?.map(v => v.id);
        state.form.contracts = data.contracts
        state.form.shortName = data.shortName
        state.form.type = res.data.type
        state.form.number = res.data.number
        courseCode.value = state.form.courseNumber.slice(
          0,
          state.form.courseNumber.length - res.data.number.length,
        )
        getContracts()
        getSyllabuses()
      })
      getGroupings()
    }
  })
  const readonly = computed<boolean>(() => !state.form.year || !state.form.courseId)
  const startDateDisabled = (data) => {
    if (state.form.endTime) {
      return dayjs(data).isAfter(state.form.endTime)
    }
    return false
  }
  const endDateDisabled = (data) => {
    if (state.form.startTime) {
      return dayjs(data).isBefore(state.form.startTime)
    }
    return false
  }
</script>

<style scoped></style>
