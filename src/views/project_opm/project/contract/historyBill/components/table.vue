<template>
  <div>
    <div class="info-table">
      <table>
        <tr>
          <th>{{ $t('text.customer_name') }}</th>
          <td colspan="2">{{ customer }}</td>
          <th>{{ $t('text.cost_cycle') }}</th>
          <td colspan="2">{{ cycle }}</td>
        </tr>
        <tr>
          <th class="cell">
            {{ $t('text.pay_service') }}
          </th>
          <th>{{ $t('text.training_model') }}</th>
          <th>{{ $t('text.charging_standard') }}</th>
          <th>{{ $t('text.quantity') }}</th>
          <th>{{ $t('text.settlement_currency') }}</th>
          <th>{{ $t('text.total_expenses') }}</th>
        </tr>
        <template v-if="data.length > 0">
          <tbody v-for="itemdata in data" :key="itemdata.title">
            <tr>
              <th colspan="7">{{ itemdata.title }}</th>
            </tr>
            <template v-if="itemdata?.data && itemdata?.data?.length > 0">
              <tr v-for="(item, index) in itemdata.data" :key="index">
                <td v-for="v in propertyList" :key="v">
                  {{ item[v] }}
                </td>
              </tr>
            </template>
            <template v-if="!itemdata?.data || itemdata?.data?.length == 0">
              <tr>
                <td colspan="6">{{ $t('text.empty') }}</td>
              </tr>
            </template>
          </tbody>
        </template>
        <template v-if="data.length == 0">
          <tr>
            <td colspan="6">{{ $t('text.empty') }}</td>
          </tr>
        </template>
        <tr>
          <th colspan="5">{{ $t('text.total_expenses') }}</th>
          <th>{{ amount?.join() }}</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'

  export default defineComponent({
    props: {
      data: {
        type: Array,
        default: () => [],
      },
      amount: {
        type: Array,
        default: () => [],
      },
      cycle: String,
      customer: String,
    },
    setup() {
      const propertyList = ref([
        'courseName',
        'airplaneType',
        'price',
        'quantity',
        'currency',
        'amount',
      ])
      const data = ref([
        {
          title: '12123123',
          data: [],
        },
        {
          title: '12123123',
          data: [],
        },
      ])
      return {
        propertyList,
        // data,
      }
    },
  })
</script>

<style scoped lang="scss">
  td {
    text-align: center;
  }
  .info-table {
    margin-bottom: 20px;
  }
  .cell {
    width: 200px;
  }
</style>
