<template>
  <!-- engine 发动机 -->
  <div>
    <vxe-grid
      border
      show-overflow
      highlight-hover-row
      class="reverse-table"
      :show-header="false"
      :columns="tableColumn"
      :data="tableData"
      ref="xTable"
    />
  </div>
</template>
<script lang="ts">
  export default {
    name: 'Engine',
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
          // { type: "checkbox", width: 50, align: "center" },
          {
            type: 'seq',
            width: 60,
            title: this.$t('text.seq'),
            align: 'center',
          },
          {
            align: 'center',

            field: 'deviceModel',

            // sortable: true,
            // width: 200,
          },
        ],
        tableData: [],
      }
    },
    mounted() {
      this.formatData()
    },
    methods: {
      formatData() {
        this.tableData = JSON.parse(JSON.stringify(this.data))
        let arr = []
        this.tableData.forEach((item) => {
          if (item.engines.length > 0 && item.engine.length == item.engines.length) {
            arr.push(item)
          }
        })
        this.$refs.xTable.setCheckboxRow(arr, true)
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
