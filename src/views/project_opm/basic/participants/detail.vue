<template>
  <div class="detail-page-container">
    <!-- <vxe-grid :cell-class-name="cellClassName" v-bind="gridOptions">
        </vxe-grid>-->
    <el-descriptions class="margin-top" :column="2" border>
      <el-descriptions-item label-class-name="label" :label="$t('text.full_name')">{{
        info.name
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('text.gender')">{{
        info.gender == 'M' ? $t('text.male') : $t('text.female')
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('text.identification_number')">{{
        info.idNumber
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('text.contact_number')">{{
        info.phone
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('text.connection')">{{
        info.customer?.name
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('text.personnel_class')">{{
        info.typeName
      }}</el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('text.training_history') }}</span>
        </div>
      </template>
      <History />
    </el-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, toRefs } from 'vue'
  import { useRoute } from 'vue-router'
  import { getStudentsDetail } from '/@/api/opm/roles'

  import History from './components/history.vue'

  export default defineComponent({
    name: 'FacultyDetail',
    components: {
      History,
    },
    setup() {
      const state = reactive({
        id: useRoute().params.id,
        info: {
          name: undefined,
          gender: undefined,
          idNumber: undefined,
          phone: undefined,
          customer: undefined,
          typeName: undefined,
        },
      })

      const methods = reactive({
        getDetail: () => {
          getStudentsDetail(state.id).then((res) => {
            state.info = res.data
          })
        },
      })

      onMounted(() => {
        methods.getDetail()
      })
      return {
        ...toRefs(state),
      }
    },
  })
</script>

<style scoped lang="scss">
  :deep(.label) {
    width: 200px;
  }
</style>
