<template>
  <!-- Subsystem 子系统 -->
  <div>
    <vxe-grid class="vex_tabel_con" :data="data" :columns="tableColumn" :max-height="600" border="">
      <template #pager />
    </vxe-grid>
  </div>
</template>
<script>
  export default {
    name: 'Subsystem',

    props: {
      isDetail: Boolean,
      id: [String, Number],
      data: {
        type: Array,
        default: () => {
          return []
        },
      },
    },
    data() {
      return {
        tableColumn: [
          { type: 'seq', width: 60, title: this.$t('text.seq') },
          {
            field: 'subsystemName',
            title: this.$t('text.subsystem_name'),
            // sortable: true,
          },
          {
            field: 'supplierName',
            title: this.$t('text.supplier'),
            // sortable: true,
          },
          {
            field: 'model',
            title: this.$t('text.model_number'),
            // sortable: true,
          },
        ],
      }
    },
  }
</script>
<style lang="scss" scoped>
  .header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .footer {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
