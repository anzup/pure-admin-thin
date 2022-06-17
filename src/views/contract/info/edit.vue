<template>
  <div class="detail-content">
    <el-form ref="formRef" :model="state.form" :rules="state.rules" class="form" label-width="90px">
      <el-space :size="32" direction="vertical" fill>
        <el-card :header="t('state.essential_information')" shadow="never">
          <el-row class="p-4">
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.contractName')" prop="contractName">
                <el-input v-model="state.form.contractName" :placeholder="t('tip.please_enter')" />
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.contractNo')" prop="contractNo">
                <el-input v-model="state.form.contractNo" :placeholder="t('tip.please_enter')" />
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.connection')" prop="customerId">
                <el-select
                  v-model="state.form.customerId"
                  :placeholder="t('tip.please_select_a_customer')"
                  @change="customerChange"
                >
                  <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.start_time')" prop="startDate">
                <el-date-picker
                  v-model="state.form.startDate"
                  :disabled-date="disabledStartDate"
                  :placeholder="t('tip.please_select')"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.expiration_time')" prop="endDate">
                <el-date-picker
                  v-model="state.form.endDate"
                  :disabled-date="disabledEndDate"
                  :placeholder="t('tip.please_select')"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.settlement_currency')" prop="currency">
                <el-select v-model="state.form.currency" :placeholder="t('tip.please_select')">
                  <el-option
                    v-for="item in currencyList"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id"
                  >
                    <span style="float: left">{{ item.id }}</span>
                    <span
                      style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
                    >
                      {{ item.name }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.handler')" prop="operatorId">
                <el-select
                  v-model="state.form.operatorId"
                  :loading="selectLoading"
                  :placeholder="t('tip.please_select')"
                  :remote-method="(val) => remoteMethod(val, 'operator')"
                  filterable
                  remote
                >
                  <el-option
                    v-for="item in operatorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.signatory')" prop="signerId">
                <el-select
                  v-model="state.form.signerId"
                  :loading="selectLoading"
                  :placeholder="t('tip.please_select')"
                  :remote-method="(val) => remoteMethod(val, 'signer')"
                  filterable
                  remote
                >
                  <el-option
                    v-for="item in signerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.autoRenew')" prop="autoRenew">
                <el-select v-model="state.form.autoRenew" :placeholder="t('tip.please_select')">
                  <el-option
                    v-for="(item, index) in booleanList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item :label="t('state.uploadAttachment')" prop="attachmentId">
                <UploadFile v-model="state.form.attachmentId" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card
          v-if="contractType === 'TRAINING'"
          :header="t('state.contract_terms')"
          shadow="never"
        >
          <div class="relative tab-con">
            <el-tabs v-model="currentTab" class="base-tabs">
              <el-tab-pane
                v-for="item in selectedList"
                :key="item.positionId"
                :label="item.positionName"
              >
                <!-- :name="item.positionId" -->
                <Clausetable ref="panel" v-model="item.selected" />
              </el-tab-pane>
              <el-tab-pane
                v-if="state.form.contractFacilities?.length > 0"
                :label="t('state.type_of_teaching_facilities')"
              >
                <Facility ref="facilitiesRef" v-model="state.form.contractFacilities" />
              </el-tab-pane>
            </el-tabs>
            <div class="absolute top-1 right-4">
              <el-button :disabled="!state.form.customerId" type="primary" @click="showDialog">
                {{ t('buttons.choice') }}
              </el-button>
            </div>
          </div>
        </el-card>
        <el-card :header="t('state.remarks')" shadow="never">
          <el-form-item label-width="0" style="margin-bottom: 0">
            <el-input
              v-model="state.form.remark"
              :autosize="{ minRows: 5 }"
              :maxlength="255"
              :placeholder="t('tip.please_enter')"
              type="textarea"
            />
          </el-form-item>
        </el-card>
        <div class="text-center">
          <el-button @click="$router.go(-1)">{{ t('buttons.hscancel') }}</el-button>
          <el-button type="primary" @click="confirm">{{ t('buttons.hsdefine') }}</el-button>
        </div>
      </el-space>
    </el-form>

    <PositionDialog
      v-if="contractType === 'TRAINING'"
      v-model="isShow"
      :allConfigList="allConfigList"
      :configs="configs"
      :contractFacilities="state.form.contractFacilities"
      :facilityList="facilityTypeList"
      :selectedList="selectedList"
      @facilitySelect="facilitySelect"
      @update-data="updateData"
    />
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import {
    ContractItem,
    getContractConfigs,
    getContractDetail,
    postContracts,
    PostContracts,
    putContracts,
  } from '/@/api/contaract'
  import useCustomer from '/@/hooks/customer'
  import useCommon from '/@/hooks/useCommon'
  import useFacilitys from '/@/hooks/facilitys'
  import useCurrency from '/@/hooks/currency'
  import useUser from '/@/hooks/user'
  import UploadFile from '/@/components/UploadFile/index.vue'
  import Clausetable from './components/Clause/clausetable.vue'
  import Facility from './components/Clause/facility.vue'
  import PositionDialog from './components/Dialog/index.vue'
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs'

  const { t } = useI18n()

  interface Props {
    id: number
    contractType: 'TRAINING' | 'OTHER'
  }

  interface SelectedItem extends ContractItem {
    trainingItemId: number
    trainingItemName: string
    trainingCategoryName: string
    trainingCategoryId: number
    trainingTypeConfigId: number
    trainingTypeConfigName: string
    trainingItemCode: string
    positionId: number
    positionName: string
  }

  interface Selected {
    positionId: number
    positionName: string
    selected: SelectedItem[]
  }

  const currentTab = ref('0')

  const props = withDefaults(defineProps<Props>(), {})
  const state = reactive<{
    form: PostContracts
    // eslint-disable-next-line no-undef
    rules: Partial<Record<keyof PostContracts, FormItemRule>>
  }>({
    form: {
      attachmentId: undefined,
      autoRenew: true,
      contractCourses: [],
      contractFacilities: [],
      contractName: undefined,
      contractNo: undefined,
      currency: 'RMB',
      customerId: undefined,
      endDate: undefined,
      operatorId: undefined,
      remark: undefined,
      signerId: undefined,
      startDate: undefined,
      contractType: props.contractType,
    },
    rules: {
      attachmentId: {
        required: true,
        message: t('tip.please_select'),
      },
      autoRenew: {
        required: false,
        message: t('tip.please_enter'),
      },
      contractCourses: {
        required: true,
        message: t('tip.please_enter'),
      },
      contractFacilities: {
        required: true,
        message: t('tip.please_select'),
      },
      contractName: {
        required: true,
        message: t('tip.please_enter'),
      },
      contractNo: {
        required: true,
        message: t('tip.please_enter'),
      },
      currency: {
        required: false,
        message: t('tip.please_select'),
      },
      customerId: {
        required: true,
        message: t('tip.please_select'),
      },
      endDate: {
        required: true,
        message: t('tip.please_select'),
      },
      operatorId: {
        required: true,
        message: t('tip.please_select'),
      },
      remark: {
        required: false,
        message: t('tip.please_enter'),
      },
      signerId: {
        required: true,
        message: t('tip.please_select'),
      },
      startDate: {
        required: true,
        message: t('tip.please_select'),
      },
    },
  })

  const { getCustomers, customerList } = useCustomer()
  const { booleanList } = useCommon()
  const { getCurrencyList, currencyList } = useCurrency()
  const { getFacilityTypeList, facilityTypeList } = useFacilitys()

  // 经办人
  const {
    getUsersList: getOperatorList,
    userForm: operatorForm,
    userList: operatorList,
  } = useUser()
  const { getUsersList: getSignerList, userList: signerList, userForm: signerForm } = useUser()

  const selectLoading = ref(false)
  const remoteMethod = async (val: string, type: 'operator' | 'signer') => {
    // 经办人
    if (type == 'operator') {
      operatorForm.builtinRoles = 'ADMIN,PLANNER,TEACHER'
      operatorForm.searchKey = val
      selectLoading.value = true
      await getOperatorList()
      selectLoading.value = false
      return operatorList.value
    } else {
      signerForm.builtinRoles = 'ADMIN,PLANNER,TEACHER'
      signerForm.searchKey = val
      selectLoading.value = true
      await getSignerList()
      selectLoading.value = false
      return signerList.value
    }
  }

  const isShow = ref(false)
  const showDialog = () => {
    isShow.value = true
  }

  const allConfigList = ref([])
  // 弹窗所有的下拉列表
  const configs = reactive({
    positions: [],
    trainingCategories: [],
    trainingItems: [],
    trainingTypeConfigs: [],
    trainingTypes: [],
  })

  const customerChange = () => {
    selectedList.value = []
    getConfigsList()
  }

  const getConfigsList = () => {
    getContractConfigs(state.form.customerId).then((res) => {
      const { positions, trainingItems, trainingTypeConfigs } = res.data
      // 循环岗位
      allConfigList.value = positions.map((item) => {
        const list = []
        const trainingTypeConfigList = trainingTypeConfigs.filter((v) => v.position.id == item.id)
        const { id: positionId, name: positionName } = item
        // 循环项目
        for (let i = 0; i < trainingItems.length; i++) {
          const {
            id: trainingItemId,
            name: trainingItemName,
            trainingCategory: { name: trainingCategoryName, id: trainingCategoryId },
            trainingCode: trainingItemCode,
            limited: itemLimited,
          } = trainingItems[i]
          // 循环培训类型
          for (let v = 0; v < trainingTypeConfigList.length; v++) {
            const {
              id: trainingTypeConfigId,
              name: trainingTypeConfigName,
              limited: configLimited,
            } = trainingTypeConfigList[v]
            if (itemLimited === configLimited) {
              list.push({
                trainingItemId,
                trainingItemName,
                trainingCategoryName,
                trainingCategoryId,
                trainingTypeConfigId,
                trainingTypeConfigName,
                trainingItemCode,
                positionId,
                positionName,
                composeId: `${positionId}_${trainingItemId}_${trainingTypeConfigId}`,
              })
            }
          }
        }
        item.list = list
        return item
      })
      Object.assign(configs, res.data)
    })
  }

  const selectedList = ref<Selected[]>([])

  const updateData = (params: Selected[]) => {
    const data = params.map((item) => {
      item.selected = item.selected.map((v) => {
        v.dinners = []
        return v
      })
      return item
    }) //JSON.parse(JSON.stringify(params))
    if (data?.length < 1) return
    if (selectedList.value.length < 1) return (selectedList.value = data)
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const element = selectedList.value.find((v) => v.positionId == item.positionId)
      if (element) {
        element.selected = [...element.selected, ...item.selected]
      } else {
        selectedList.value.push(item)
      }
    }
  }

  const facilitySelect = (val: any[]) => {
    state.form.contractFacilities = [
      ...state.form.contractFacilities,
      ...val.map((v) => ({ ...v, dinners: [] })),
    ]
  }

  // eslint-disable-next-line no-undef
  const formRef = ref<ElFormInstance>()
  const router = useRouter()
  const instance = getCurrentInstance()
  const facilitiesRef = ref()
  const confirm = async () => {
    const panel: any[] = instance.refs.panel as any
    let err
    if (panel && panel.length > 0) {
      for (let i = 0; i < panel.length; i++) {
        const element = panel[i]
        err = await element.vxTable.xTable.validate(true)
        if (err) return ElMessage.error(t('tip.required_information_is_not_filled_in'))
      }
    }
    if (facilitiesRef.value) {
      err = await facilitiesRef.value.vxTable.xTable.validate(true)

      if (err) return ElMessage.error(t('tip.required_information_is_not_filled_in'))
    }

    state.form.contractCourses = selectedList.value.map((v) => v.selected).flat()
    let api

    formRef.value.validate((valid) => {
      if (valid) {
        if (props.id) {
          api = putContracts
        } else {
          api = postContracts
        }
        api(state.form).then(() => {
          ElMessage.success(
            props.id ? t('message.modified_successfully') : t('message.successfully_added'),
          )
          router.back()
        })
      }
    })
  }

  const disabledStartDate = (time: Date) => {
    if (!state.form.endDate) {
      return false
    } else {
      return dayjs(time).isAfter(state.form.endDate, 'date')
    }
  }
  const disabledEndDate = (time: Date) => {
    if (!state.form.startDate) {
      return false
    } else {
      return dayjs(time).isBefore(state.form.startDate, 'date')
    }
  }

  onMounted(async () => {
    await getFacilityTypeList()
    facilityTypeList.value = facilityTypeList.value.map((v) => {
      v.facilityId = v.id
      v.facilityName = v.name
      delete v.id
      delete v.name
      return v
    })

    getCustomers()
    getCurrencyList()
    if (props.id) {
      getContractDetail(props.id).then((res) => {
        signerList.value = [
          {
            id: res.data.signerId,
            name: res.data.signerName,
          },
        ]
        operatorList.value = [
          {
            id: res.data.operatorId,
            name: res.data.operatorName,
          },
        ]
        for (let i = 0; i < res.data.contractCourses.length; i++) {
          const element = res.data.contractCourses[i]
          const index = selectedList.value.findIndex((v) => v.positionId == element.positionId)
          if (index < 0) {
            selectedList.value.push({
              positionId: element.positionId,
              positionName: element.positionName,
              selected: [
                {
                  composeId: `${element.positionId}_${element.trainingItemId}_${element.trainingTypeConfigId}`,
                  ...(element as any),
                },
              ],
            })
          } else {
            selectedList.value[index].selected.push({
              composeId: `${element.positionId}_${element.trainingItemId}_${element.trainingTypeConfigId}`,
              ...(element as any),
            })
          }
        }

        state.form = res.data
        getConfigsList()
      })
    }
  })
</script>

<style lang="scss" scoped>
  // .form {
  //   padding: $padding16;
  // }
  .tab-con {
    min-height: 440px;
  }

  .detail-content {
    :deep(.el-space) {
      width: 100%;

      .el-space__item {
        width: 100%;
      }
    }
  }

  :deep(.el-form-item__content) {
    padding-right: 16px;
  }

  .upload-demo {
    width: 100%;

    :deep(.el-upload-list) {
      flex: auto;
      margin-top: 0;

      .el-upload-list__item,
      .el-upload-list__item-info {
        line-height: 20px;
      }
    }
  }
</style>
