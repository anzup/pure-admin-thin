<template>
  <div class="detail-main-container">
    <div class="info-table">
      <table>
        <tr>
          <th>{{ $t('text.training_type') }}</th>
          <th>{{ $t('text.settlement_quantity') }}</th>
          <th>{{ $t('text.total_expenses') }}</th>
        </tr>
        <tr>
          <td>{{ $t('text.wet_rent_training') }}</td>
          <td>{{ state.form.wetNum }}</td>
          <td>{{ state.form.wetAmount?.join() }}</td>
        </tr>
        <tr>
          <td>{{ $t('text.dry_rent_training') }}</td>
          <td>{{ state.form.dryNum }}</td>
          <td>{{ state.form.dryAmount?.join() }}</td>
        </tr>
        <tr>
          <td>{{ $t('text.complimentary_training') }}</td>
          <td>{{ state.form.presentNum }}</td>
          <td>{{ state.form.presentAmount?.join() }}</td>
        </tr>
        <tr>
          <td colspan="2">{{ $t('text.total_expenses') }}</td>

          <td>{{ state.form.amount?.join() }}</td>
        </tr>
      </table>
    </div>
    <el-divider />
    <el-tabs type="border-card">
      <el-tab-pane v-for="item in itemList" :key="item.name" :label="item.name">
        <Item :data="state.form[item.property]" @updateData="updateData" />
      </el-tab-pane>
    </el-tabs>
    <div class="footer-container">
      <el-button type="primary" @click="settlement">
        {{ $t('text.settlement') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { getBillsDetail, putBillsSettle } from '/@/api/opm/contract'
  import { useRoute, useRouter } from 'vue-router'
  import Item from './components/item.vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    courseType: String,
    customerId: [Number],
  })
  const router = useRouter(),
    route = useRoute(),
    { t } = useI18n()

  const itemList = ref([
    {
      name: t('text.wet_rent_training'),
      property: 'wetItems',
    },
    {
      name: t('text.dry_rent_training'),
      property: 'dryItems',
    },
    {
      name: t('text.complimentary_training'),
      property: 'presentItems',
    },
  ])

  const state = reactive({
    form: {
      wetNum: undefined,
      wetAmount: undefined,
      dryNum: undefined,
      dryAmount: undefined,
      presentNum: undefined,
      presentAmount: undefined,
      amount: undefined,
    },
  })

  onMounted(() => {
    getDetail()
  })

  const getDetail = () => {
    getBillsDetail(route.params.id).then((res) => {
      const { data } = res
      state.form = data
    })
  }

  const updateData = () => {
    getDetail()
  }
  const settlement = () => {
    putBillsSettle(+route.params.id).then((res) => {
      ElMessage.success(t('message.settlement_succeeded'))
      router.go(-1)
    })
  }
</script>

<style scoped lang="scss">
  :deep(.el-tabs__content) {
    padding: 0;
  }
  td {
    text-align: center;
  }
</style>
