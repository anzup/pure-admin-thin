<template>
  <div class="main-view">
    <section class="info-con">
      <div class="mian_con">
        <el-row class="basicInfos">
          <!-- 设备名称 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.equipment_name') }}:</span
            ><span class="value">{{ detailObj.name }}</span>
          </el-col>
          <!-- 模拟机型 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.analog_model') }}:</span
            ><span class="value">
              {{ formatModel(detailObj.simulatorAbilityVOS) }}
            </span>
          </el-col>
          <!-- 模拟机状态 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.simulator_status') }}:</span
            ><span class="value">
              {{ detailObj.status }}
            </span>
          </el-col>
        </el-row>
        <el-row class="basicInfos">
          <!-- 生产厂家 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.manufacturer') }}:</span
            ><span class="value">{{ detailObj.manufacturer }}</span>
          </el-col>
          <!-- 设备型号 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.equipment_model') }}:</span
            ><span class="value">{{ detailObj.model }}</span>
          </el-col>
          <!-- 工程号/序列号 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.serial_number') }}:</span
            ><span class="value">{{ detailObj.serialNumber }}</span>
          </el-col>
        </el-row>
        <el-row class="basicInfos">
          <!-- 设备类型 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.facilities_type') }}:</span
            ><span class="value">
              {{ detailObj.deviceType }}
            </span>
          </el-col>
          <!-- 设备等级 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.equipment_level') }}:</span
            ><span class="value">{{ detailObj.level }}</span>
          </el-col>

          <!-- 交付时间 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.delivery_time') }}:</span
            ><span class="value">{{ formatDate(detailObj.deliveryDate) }}</span>
          </el-col>
        </el-row>
        <el-row class="basicInfos">
          <!-- 质保期 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.warranty_period') }}:</span
            ><span class="value">{{ detailObj.warrantyPeriod }}</span>
          </el-col>
          <!-- 负责人 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.person_in_charge') }}:</span
            ><span class="value">{{ detailObj.principalName }}</span>
          </el-col>
          <!-- 联系电话 -->
          <el-col :span="8" class="basicinfo">
            <span class="name">{{ $t('text.contact_number') }}:</span
            ><span class="value">{{ detailObj.contactPhoneNumber }}</span>
          </el-col>
        </el-row>
      </div>
    </section>
    <el-tabs v-if="loaded" v-model="params.tab" type="border-card">
      <el-tab-pane
        :label="item.name"
        :name="item.label"
        v-for="(item, index) in tabList"
        :key="index"
      >
        <!-- <keep-alive> -->
        <component v-if="params.tab == item.label" :key="index" :is="item.cmp" :data="item.data" />
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, onMounted } from 'vue'
  import { getSimutatorDetail } from '/@/api/opm/device'
  import { useRoute } from 'vue-router'
  import AuthenticationCertificate from './components/authenticationCertificate.vue'
  import Subsystem from './components/subsystem.vue'
  import Engine from './components/engine.vue'
  import TrainingAbility from './components/trainingAbility.vue'
  import CustomizedAirport from './components/customizedAirport.vue'
  import dayjs from 'dayjs'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    components: {
      AuthenticationCertificate,
      Subsystem,
      Engine,
      TrainingAbility,
      CustomizedAirport,
    },
    setup() {
      const { t } = useI18n()
      const route = useRoute()
      const detailObj = reactive({
        certifications: [],
        supplierSubsystems: [],
        simulatorAbilityVOS: [],
        trainingAbilitys: [],
        customizedAirports: [],
      })
      let loaded = ref(false)
      const params = reactive({
        tab: '5',
      })
      const tabList = ref([])
      onMounted(() => {
        getData()
      })
      function getData() {
        getSimutatorDetail(route.params.id).then((res) => {
          if (res.data.status == 'OPERATIONAL') {
            res.data.status = t('text.available')
          } else if (res.data.status == 'AOG') {
            res.data.status = t('text.not_available')
          } else {
            res.data.status = t('text.deactivate')
          }
          res.data.simulatorAbilityVOS.forEach((item: any) => {
            item.engine = item.engine ? item.engine.split(',') : []
            item.engines = item.engines ? item.engines.split(',') : []
          })
          Object.assign(detailObj, res.data)
          loaded.value = true
          tabList.value = [
            {
              name: t('text.identification_certificate'),
              label: '5',
              code: 'appraisalCertificate',
              cmp: 'AuthenticationCertificate',
              data: detailObj.certifications,
            },
            {
              name: t('text.subsystem'),
              label: '1',
              code: 'subsystem',
              cmp: 'Subsystem',
              data: detailObj.supplierSubsystems,
            },
            {
              name: t('text.engine'),
              label: '2',
              code: 'engine',
              cmp: 'Engine',
              data: detailObj.simulatorAbilityVOS,
            },
            {
              name: t('text.other_capabilities'),
              label: '3',
              code: 'simulatorTrainingCapability',
              cmp: 'TrainingAbility',
              data: detailObj.trainingAbilitys,
            },
            {
              name: t('text.customized_airport'),
              label: '4',
              code: 'customizedAirport',
              cmp: 'CustomizedAirport',
              data: detailObj.customizedAirports,
            },
          ]
        })
      }
      function formatModel(data: any[] = []) {
        let arr = []
        arr = data.map((v) => v.deviceModel)
        return arr.join()
      }
      function formatDate(value: number | string): string {
        return value ? dayjs(value).format('YYYY-MM-DD') : ''
      }
      return {
        detailObj,
        formatModel,
        formatDate,
        params,
        tabList,
        loaded,
      }
    },
  })
</script>

<style scoped lang="scss">
  .main-view {
    padding: 10px;
    .info-con {
    }
  }

  .btnContanier {
    overflow: hidden;
    .addbtn {
      float: right;
    }
  }
  .info-con {
    * {
      box-sizing: border-box;
    }
    display: flex;
    flex-direction: column;
    border: 1px solid #bdbfc0;
    min-height: 50px;
    margin-bottom: 50px;
    .title {
      line-height: 40px;
      // text-align: center;
      padding-left: 20px;
      flex-shrink: 0;
      background: #dbdfe2;
      // display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid #bdbfc0;
    }
    .mian_con {
      // border: 1px solid red;
      flex: 1;
      padding: 10px;
    }
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .basicInfos {
    // outline: 1px solid red;
    // display: flex;
    .basicinfo {
      flex: 1;
      line-height: 30px;
      display: flex;
      font-size: 13px;
      .name {
        width: 100px;
        text-align: right;
        margin-right: 10px;
        font-weight: 700;
        color: #333;
      }
      .value {
        color: gray;
      }
    }
  }
  .footer {
    padding-top: 100px;
    .btnContanier {
      margin: 0 auto;
      // width: 400px;
      display: flex;
      justify-content: center;
    }
  }
</style>
