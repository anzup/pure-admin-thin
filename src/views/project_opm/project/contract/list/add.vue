<template>
  <div class="detail-main-container">
    <el-form :model="form" :disabled="isDetail" :rules="rules" ref="formRef" label-width="120px">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('text.essential_information') }}</span>
          </div>
        </template>
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('text.contract_no')" prop="contractNo">
              <el-input v-model="form.contractNo" :placeholder="$t('text.please_enter')" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('text.customer_name')" prop="customerId">
              <el-select v-model="form.customerId" :placeholder="$t('text.please_select')">
                <el-option
                  v-for="item in customerAllList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('text.contract_start_time')" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                :placeholder="$t('text.select_date')"
                :disabled-date="disabledStartDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('text.contract_expiration_time')" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                :placeholder="$t('text.select_date')"
                :disabled-date="disabledEndDate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('text.automatic_renewal_upon_expiration')" prop="autoRenew">
              <el-select v-model="form.autoRenew" :placeholder="$t('text.please_select')">
                <el-option :label="$t('text.yes')" :value="true" />
                <el-option :label="$t('text.no')" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item :label="$t('text.settlement_currency')" prop="currency">
              <el-select v-model="form.currency" :placeholder="$t('text.please_select')">
                <el-option
                  v-for="(item, index) in currencyList"
                  :key="index"
                  :value="item.id"
                  :label="item.id"
                >
                  <span style="float: left">
                    {{ item.id }}
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.flag }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-divider />
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('text.contract_terms') }}</span>
          </div>
        </template>

        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('text.course_item_price')" name="project">
            <el-form-item prop="contractCourses" label-width="0px">
              <Project v-model:oldData="form.contractCourses" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('text.training_resource_price')" name="resources">
            <el-form-item prop="contractResources" label-width="0px">
              <Resources v-model:oldData="form.contractResources" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-divider />
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ $t('text.remarks') }}</span>
          </div>
        </template>
        <el-form-item prop="remark" label-width="0px">
          <el-input
            type="textarea"
            :placeholder="$t('text.please_enter')"
            v-model="form.remark"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </el-form-item>
      </el-card>
    </el-form>
    <div class="footer-container">
      <el-button type="primary" plain @click="goBack">{{ $t('message.hscancel') }}</el-button>
      <el-button type="primary" v-show="!isDetail" @click="confirm">{{
        $t('message.hssave')
      }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, ref, computed, provide, Ref } from 'vue'
  import Project from './components/project/project.vue'
  import Resources from './components/resources/resources.vue'
  import useCustomers from '/@/commonTs/customer'
  import {
    getCurrencyAll,
    getContractsDetail,
    postContracts,
    putContractsId,
  } from '/@/api/opm/contract'
  import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs'
  import useAirplaneTypes from '/@/commonTs/airplaneTypes'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    components: {
      Project,
      Resources,
    },
    setup() {
      const { t } = useI18n()
      const route = useRoute(),
        router = useRouter()

      const formRef = ref()
      const state = reactive({
        form: {
          contractCourses: [],
          contractResources: [],
          remark: undefined,
          startDate: undefined,
          customerId: undefined,
          endDate: undefined,
          currency: undefined,
          autoRenew: undefined,
          contractNo: undefined,
        },
        rules: {
          contractCourses: [
            {
              required: true,
              message: t('text.please_select'),
              type: 'array',
              trigger: 'change',
            },
          ],
          contractResources: [
            {
              required: true,
              message: t('text.please_select'),
              type: 'array',
              trigger: 'change',
            },
          ],

          startDate: [
            {
              required: true,
              message: t('text.please_select'),
              type: 'date',
              trigger: 'change',
            },
          ],
          customerId: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          endDate: [
            {
              required: true,
              message: t('text.please_select'),
              type: 'date',
              trigger: 'change',
            },
          ],
          currency: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          autoRenew: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          contractNo: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
        } as ElFormInstance['rules'],
        activeName: 'project',
        currencyList: [],
        disabledStartDate: (time: Date) => {
          if (state.form.endDate) {
            return dayjs(time).valueOf() > dayjs(state.form.endDate).valueOf()
          }
        },
        disabledEndDate: (time: Date) => {
          if (state.form.startDate) {
            return dayjs(time).valueOf() < dayjs(state.form.startDate).valueOf()
          }
        },
      })
      const isDetail = computed(() => route.params.type == 'detail')

      provide('isDetail', isDetail)
      const goBack = () => {
        router.go(-1)
      }
      const confirm = () => {
        formRef.value.validate((valid) => {
          if (valid) {
            const api =
              route.params.id && route.params.type !== 'supplement' ? putContractsId : postContracts
            api(state.form).then((res) => {
              ElMessage.success(
                `${
                  route.params.id && route.params.type !== 'supplement'
                    ? t('message.modify')
                    : t('message.hsadd')
                }` + t('text.success'),
              )
              goBack()
            })
          }
        })
      }
      const { getCustomersAllList, customerAllList } = useCustomers()
      const { airplaneTypesAllList, getAirplaneTypesAllList } = useAirplaneTypes()
      provide<Ref>('airplaneTypesAllList', airplaneTypesAllList)
      onMounted(async () => {
        getCustomersAllList()
        await getAirplaneTypesAllList()
        getCurrencyAll().then((res) => {
          state.currencyList = res.data.map((v) => {
            v.flag = v.name
            v.name = v.id
            return v
          })
        })
        if (route.params.id) {
          getContractsDetail(route.params.id).then((res) => {
            const { data } = res
            if (route.params.type == 'supplement') {
              data.contractNo = undefined
            }
            data.customerId = data.customer?.id
            delete data.customer
            data.contractCourses.forEach((element) => {
              element.code = element.course.code
              element.name = element.course.name
              element.courseId = element.course.id
              delete element.course
            })
            data.contractResources.forEach((element) => {
              element.name = element.resource.name
              // element.airplaneType = element.resource.airplaneType;
              element.unit = element.resource.unit
              element.resourceId = element.resource.id
            })
            state.form = data
          })
        }
      })

      return {
        ...toRefs(state),
        confirm,
        formRef,
        isDetail,
        goBack,
        customerAllList,
      }
    },
    beforeRouteEnter(to, from) {
      if (to.params.type == 'edit') {
        to.matched[to.matched.length - 1].meta.title = 'message.modify'
      } else if (to.params.type == 'detail') {
        to.matched[to.matched.length - 1].meta.title = 'message.hsDetail'
      } else if (to.params.type == 'supplement') {
        to.matched[to.matched.length - 1].meta.title = 'text.supplementary_provisions'
      }
    },
  })
</script>

<style scoped lang="scss">
  :deep(.el-input.is-disabled),
  :deep(.el-textarea.is-disabled) {
    .el-input__inner,
    .el-textarea__inner {
      background-color: #fff;
      color: #606266;
      cursor: pointer;
    }
  }
</style>
