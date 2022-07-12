<template>
  <!-- trainingAbility 训练能力 -->
  <div>
    <vxe-grid
      class="vex_tabel_con"
      :data="tableData"
      :columns="tableColumn"
      ref="xTable"
      :max-height="600"
    />
  </div>
</template>
<script lang="ts">
  // import SelectSystem from "./components/selectSystem";

  export default {
    name: 'TrainingAbility',
    components: {
      // SelectSystem,
    },
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
            field: 'name',
            title: this.$t('text.name'),
            align: 'left',
            headerAlign: 'center',
          },
        ],
        tableData: [],
        selectList: [],
      }
    },
    created() {
      this.getTrainingabilityAll()
    },
    methods: {
      // 训练能力下拉
      getTrainingabilityAll() {
        this.tableData = this.data
      },
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
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
