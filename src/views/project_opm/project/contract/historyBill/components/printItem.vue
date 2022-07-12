<template>
  <div ref="title">
    <h3>{{ detailData.customerName }} {{ $t('text.monthly_bill') }}</h3>
  </div>
  <Table
    ref="info"
    :data="data"
    :amount="amount"
    :cycle="cycle"
    :customer="detailData.customerName"
  />
  <div ref="sign" class="sign">
    <div class="tip">
      <span> {{ $t('text.remarks') }}：{{ detailData.remark }}</span>
    </div>
    <div class="autograph">
      <div class="customer_con">
        <div class="autograph_item flex">
          <div class="title">{{ $t('text.customer_company_confirmation') }}：</div>
          <div class="line">_______________</div>
        </div>
        <div class="autograph_item">
          <div class="title">{{ $t('text.date_of_signature') }}：</div>
          <div class="line">_______________</div>
        </div>
      </div>
      <div class="customer_con department_con">
        <div class="flex">
          <div class="autograph_item">
            <div class="title">{{ $t('text.marketing_manager') }}：</div>
            <div class="line">_______________</div>
          </div>
          <div class="autograph_item">
            <div class="title">{{ $t('text.date_of_signature') }}：</div>
            <div class="line">_______________</div>
          </div>
        </div>
        <div>
          <div class="autograph_item">
            <div class="title">{{ $t('text.general_manager_of_training_center') }}：</div>
            <div class="line">_______________</div>
          </div>
          <div class="autograph_item">
            <div class="title">{{ $t('text.date_of_signature') }}：</div>
            <div class="line">_______________</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <vxe-grid v-bind="gridOptions" :data="tableData" :columns="columns" ref="table" class="grid" />
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref } from 'vue'
  import Table from './table.vue'
  import { VxeGridProps } from 'vxe-table'
  import dayjs from 'dayjs'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    components: {
      Table,
    },
    props: {
      type: String,
      detailData: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const { t } = useI18n()
      const data = computed<any[]>(() => {
        return props.type == 'WET_LEASE'
          ? [
              {
                title: t('text.wet_rent_training_program'),
                data: props.detailData.wetTrainingItems,
              },
              {
                title: t('text.wet_lease_other_items'),
                data: props.detailData.wetOtherItems,
              },
            ]
          : [
              {
                title: t('text.dry_rent_training_program'),
                data: props.detailData.dryTrainingItems,
              },

              {
                title: t('text.dry_rent_gift_items'),
                data: props.detailData.dryPresentItems,
              },
            ]
      })

      const amount = computed<any[]>(() =>
        props.type == 'WET_LEASE' ? props.detailData.wetAmount : props.detailData.dryAmount,
      )

      const cycle = computed<string>(
        () =>
          dayjs(props.detailData.startDate).format('YYYY/MM/DD') +
          '-' +
          dayjs(props.detailData.endDate).format('YYYY/MM/DD'),
      )

      const gridOptions = reactive<VxeGridProps>({
        border: true,
        resizable: true,

        align: 'center',
      })

      const tableData = computed<any[]>(() =>
        props.type == 'WET_LEASE' ? props.detailData.wetItems : props.detailData.dryItems,
      )

      const columns = computed<any[]>(() =>
        props.type == 'WET_LEASE'
          ? [
              { type: 'seq', width: 60, title: t('text.seq') },
              { field: 'studentNames', title: t('text.student_name') },
              {
                field: 'courseNumber',
                title: t('text.training_course_no'),
              },
              {
                field: 'courseName',
                title: t('text.training_program'),
              },
              {
                field: 'startDate',
                title: t('text.training_start_time'),
                formatter: 'formatDateTime',
              },
              {
                field: 'endDate',
                title: t('text.training_end_time'),
                formatter: 'formatDateTime',
              },
              {
                field: 'currency',
                title: t('text.settlement_currency'),
              },
              { field: 'amount', title: t('text.cost') },
            ]
          : [
              { type: 'seq', width: 60, title: t('text.seq') },
              {
                field: 'courseNumber',
                title: t('text.training_course_no'),
              },
              {
                field: 'person',
                title: t('text.number_of_students'),
                formatter: ({ row }) => row.studentNames?.length,
              },
              { field: 'studentNames', title: t('text.student_name') },
              { field: 'courseName', title: t('text.pay_service') },
              {
                field: 'startDate',
                title: t('text.training_start_time'),
                formatter: 'formatDateTime',
              },
              {
                field: 'endDate',
                title: t('text.training_end_time'),
                formatter: 'formatDateTime',
              },
              { field: 'price', title: t('text.charging_standard') },
              { field: 'quantity', title: t('text.quantity') },
              { field: 'currency', title: t('text.company') },
              { field: 'amount', title: t('text.cost') },
            ],
      )

      const title = ref(),
        info = ref(),
        sign = ref(),
        table = ref()

      const getContent = async () => {
        let html = ''
        await table.value.print({
          beforePrintMethod: ({ content }) => {
            html =
              title.value.innerHTML +
              info.value.$el.innerHTML +
              sign.value.innerHTML +
              `<h3>${props.detailData.customerName} ${t('text.monthly_bill')}</h3>` +
              content
            // 拦截打印之前，返回自定义的 html 内容
            return false
          },
        })
        return html
      }

      return {
        data,
        amount,
        gridOptions,
        tableData,
        columns,
        cycle,
        title,
        info,
        sign,
        table,
        getContent,
      }
    },
  })
</script>

<style scoped lang="scss">
  h3 {
    text-align: center;
  }
  .tip {
    font-size: 14px;
    padding: 20px;
    border: 1px solid #eee;
  }
  .autograph {
    margin-top: 50px;
    padding: 20px;
    line-height: 40px;
    .customer_con {
      display: flex;
    }
    .department_con {
      margin-top: 50px;
    }
    .autograph_item {
      // width: 300px;
      display: flex;
      flex-wrap: wrap;
      .title {
        width: 130px;
        text-align: right;
      }
    }
    .flex {
      flex: 1;
    }
  }
</style>
