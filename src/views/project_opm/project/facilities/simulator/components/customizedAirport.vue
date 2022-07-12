<template>
  <vxe-grid
    border
    resizable
    ref="xGrid"
    class="my-grid66"
    :columns="tableColumn"
    :data="tableData"
    max-height="300"
    align="center"
  />
</template>
<script>
  // const XEUtils = require("xe-utils");
  import XEUtils from 'xe-utils'
  export default {
    name: 'CustomizedAirport',

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
        addcustomized: false,

        tableColumn: [
          { field: 'seq0', width: 60, title: this.$t('text.seq') },
          {
            field: 'name0',
            title: this.$t('text.airport_name'),
            // sortable: true,
          },
          {
            field: 'icaoCode0',
            title: 'ICAO' + this.$t('text.code'),
            // sortable: true,
          },
          {
            field: 'iataCode0',
            title: 'IATA' + this.$t('text.code'),
            // sortable: true,
          },

          { field: 'seq1', width: 60, title: this.$t('text.seq') },
          {
            field: 'name1',
            title: this.$t('text.airport_name'),
            // sortable: true,
          },
          {
            field: 'icaoCode1',
            title: 'ICAO' + this.$t('text.code'),
            // sortable: true,
          },
          {
            field: 'iataCode1',
            title: 'IATA' + this.$t('text.code'),
            // sortable: true,
          },
        ],
        tableData: {},
        dataList: [],
        isModify: false,
        detailId: null,
        importDialogVisible: false,
        rowData: {},
      }
    },
    created() {
      this.dataList = JSON.parse(JSON.stringify(this.data))
    },
    watch: {
      dataList: {
        deep: true,
        immediate: true,
        handler(newValue) {
          this.tableData = this.formatArray(JSON.parse(JSON.stringify(newValue)))
        },
      },
    },
    methods: {
      formatArray(list) {
        let arr = XEUtils.chunk(
          list.map((item, index) => {
            item.seq = index + 1
            return item
          }),
          2,
        )
        let newArr = arr.map((item) => {
          let obj = {}
          item.forEach((v, i) => {
            for (const key in v) {
              if (Object.hasOwnProperty.call(v, key)) {
                const element = v[key]
                obj[key + i] = element
              }
            }
          })
          return obj
        })
        return newArr
      },
    },
  }
</script>
<style lang="scss" scoped>
  .container {
    box-sizing: border-box;
    .con_item {
      flex: 1;
      box-sizing: border-box;
    }
  }
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
