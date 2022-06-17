<template>
  <div class="detail-content">
    <el-space :size="32" direction="vertical">
      <!-- <el-card shadow="never" :header="t('state.essential_information')"> -->
      <el-scrollbar>
        <el-descriptions :column="column" border class="margin-top">
          <el-descriptions-item
            :label="t('state.contractName')"
            label-align="center"
            min-width="150px"
          >
            {{ state.form.contractName }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.contractNo')"
            label-align="center"
            min-width="150px"
          >
            {{ state.form.contractNo }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.connection')"
            label-align="center"
            min-width="150px"
          >
            {{ state.form.customerName }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.start_time')"
            label-align="center"
            min-width="150px"
          >
            {{ tableFormat.formatDate({ cellValue: state.form.startDate }) }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.expiration_time')"
            label-align="center"
            min-width="150px"
          >
            {{ tableFormat.formatDate({ cellValue: state.form.endDate }) }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.settlement_currency')"
            label-align="center"
            min-width="150px"
          >
            {{ state.form.currency }}
          </el-descriptions-item>

          <el-descriptions-item :label="t('state.handler')" label-align="center" min-width="150px">
            {{ state.form.operatorName }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.signatory')"
            label-align="center"
            min-width="150px"
          >
            {{ state.form.signerName }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.autoRenew')"
            label-align="center"
            min-width="150px"
          >
            {{ tableFormat.formatBool({ cellValue: state.form.autoRenew }) }}
          </el-descriptions-item>

          <el-descriptions-item
            :label="t('state.uploadAttachment')"
            label-align="center"
            min-width="150px"
          >
            <UploadFile v-model="state.form.attachmentId" is-detail />
          </el-descriptions-item>
        </el-descriptions>
      </el-scrollbar>
      <!-- </el-card> -->
      <el-card v-if="contractType == 'TRAINING'" :header="t('state.contract_terms')" shadow="never">
        <div class="relative tab-con">
          <el-tabs v-model="currentTab" class="base-tabs">
            <el-tab-pane
              v-for="item in selectedList"
              :key="item.positionId"
              :label="item.positionName"
            >
              <!-- :name="item.positionId" -->
              <Clausetable v-model="item.selected" is-detail />
            </el-tab-pane>
            <el-tab-pane
              v-if="state.form.contractFacilities?.length > 0"
              :label="t('state.type_of_teaching_facilities')"
            >
              <Facility v-model="state.form.contractFacilities" is-detail />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <el-card :header="t('state.remarks')" shadow="never">
        <el-input
          v-model="state.form.remark"
          :autosize="{ minRows: 5 }"
          :placeholder="t('tip.please_enter')"
          readonly
          type="textarea"
        />
      </el-card>
      <div class="text-center">
        <el-button @click="$router.go(-1)">{{ t('buttons.back') }}</el-button>
      </div>
    </el-space>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import {
    ContractItem,
    getContractDetail,
    PostContracts,
    postContracts,
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
  import { ElMessage } from 'element-plus'
  import tableFormat from '/@/plugins/vxe-table/tableFormat'
  import { useAppStoreHook } from '/@/store/modules/app'

  const appStore = useAppStoreHook()
  const column = computed(() => {
    if (appStore.appWidth > 1200) {
      return 4
    } else if (appStore.appWidth >= 768) {
      return 3
    } else {
      return 2
    }
  })
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
    form: Omit<PostContracts, 'contractType'>
    rules: ElFormInstance['rules']
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
    },
    rules: {
      attachmentId: {
        required: false,
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

  const selectedList = ref<Selected[]>([])

  const formRef = ref<ElFormInstance>()
  const router = useRouter()
  const confirm = () => {
    state.form.contractCourses = selectedList.value.map((v) => v.selected).flat()
    let api

    formRef.value.validate((valid) => {
      if (valid) {
        if (props.id) {
          api = putContracts
        } else {
          api = postContracts
        }
        api(state.form).then((res) => {
          ElMessage.success(
            props.id ? t('message.modified_successfully') : t('message.successfully_added'),
          )
          router.back()
        })
      }
    })
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
      })
    }
  })
</script>

<style lang="scss" scoped>
  .detail-content {
    :deep(.el-space) {
      width: 100%;

      .el-space__item {
        width: 100%;
      }
    }
  }

  .upload-demo {
    min-width: 200px;
    max-width: 300px;

    :deep(.el-upload-list) {
      // flex: auto;
      margin-top: 0;

      .el-upload-list__item,
      .el-upload-list__item-info {
        line-height: 20px;
      }

      .el-upload-list__item {
        display: flex;
        align-items: center;

        .el-upload-list__item-status-label,
        .el-icon--close {
          position: unset;
          transform: unset;
        }
      }
    }
  }
</style>
