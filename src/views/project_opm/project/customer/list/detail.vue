<template>
  <div class="detail-main-container">
    <div class="info-table">
      <table>
        <tr>
          <th>{{ $t('text.customer_name') }}</th>
          <td>{{ form.name }}</td>
          <th>{{ $t('text.customer_abbreviation') }}</th>
          <td>{{ form.shortName }}</td>
          <th>{{ $t('text.customer_code') }}</th>
          <td>{{ form.code }}</td>
        </tr>
        <tr>
          <th>{{ $t('text.customer_classification') }}</th>
          <td>{{ form.customerType?.name }}</td>
          <th>{{ $t('text.customer_contact_') }}</th>
          <td>{{ form.contactPersonName }}</td>
          <th>{{ $t('text.contact_mobile_phone') }}</th>
          <td>{{ form.contactPersonPhone }}</td>
        </tr>
      </table>
    </div>
    <el-divider />
    <div class="info-table">
      <table>
        <tr>
          <td>{{ $t('text.training_contract') }}</td>
          <td class="btn_con">
            <el-button type="text" @click="goPage('contract')">{{ $t('text.see') }}</el-button>
          </td>
        </tr>
        <tr>
          <td>{{ $t('text.training_bill') }}</td>
          <td class="btn_con">
            <el-button type="text" @click="goPage('bill')">{{ $t('text.see') }}</el-button>
          </td>
        </tr>

        <tr>
          <td>{{ $t('text.lecturee_info') }}</td>
          <td class="btn_con">
            <el-button type="text" @click="goPage('student')">{{ $t('text.see') }}</el-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getCustomersDetail } from '/@/api/opm/customer'

  const route = useRoute()
  const router = useRouter()
  const detailId = route.params.id
  const form = reactive({
    customerType: undefined,
    name: undefined,
    shortName: undefined,
    code: undefined,
    contactPersonName: undefined,
    contactPersonPhone: undefined,
  })
  const getCustomer = () => {
    getCustomersDetail(detailId).then((res) => {
      Object.assign(form, res.data)
    })
  }
  getCustomer()

  const goPage = (type: string) => {
    if (type == 'contract') {
      router.push({
        path: '/contract/contract/index',
        query: {
          id: detailId,
        },
      })
    } else if (type == 'bill') {
      router.push({
        path: '/contract/bill/index',
        query: {
          id: detailId,
        },
      })
    } else if (type == 'student') {
      router.push({
        path: '/user/participants/index',
        query: {
          id: detailId,
        },
      })
    }
  }
</script>

<style scoped lang="scss">
  td,
  td {
    min-width: 200px;
    &.btn_con {
      width: 60px;
      min-width: 60px;
      padding: 0 20px;
    }
  }
  .info-table {
    td {
      text-align: center;
    }
  }
</style>
