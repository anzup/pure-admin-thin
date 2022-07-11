<template>
  <div class="detail-main-container">
    <h1 ref="topHtml">四川航空集团有限责任公司培训中心{{ $t('text.monthly_bill_summary') }}</h1>
    <div ref="table1">
      <table>
        <thead>
          <tr>
            <th>{{ $t('text.customer_name') }}</th>
            <th colspan="2">四川航空</th>
            <th>费用周期</th>
            <th colspan="2">2021/04/06--2021/05/06</th>
          </tr>
          <tr>
            <th>收费项目</th>
            <th>训练机型</th>
            <th>计费标准</th>
            <th>数量</th>
            <th>结算周期</th>
            <th>结算周期</th>
          </tr>
        </thead>
        <tbody>
          <tr />
        </tbody>
      </table>
    </div>
    <vxe-grid ref="table" v-bind="gridOptions" />
    <div class="tip">
      <span>
        备注：本月已完成21ACPC001张三、李四、王五、周六湿租训练，按照合同规定赠送100小时干租训练</span
      >
    </div>
    <div class="autograph" ref="autograph">
      <div class="customer_con">
        <div class="autograph_item">
          <div class="title">客户公司确认：</div>
          <div class="line">_______________</div>
        </div>
        <div class="autograph_item">
          <div class="title">签字日期：</div>
          <div class="line">_______________</div>
        </div>
      </div>
      <div class="customer_con department_con">
        <div>
          <div class="autograph_item">
            <div class="title">市场部经理：</div>
            <div class="line">_______________</div>
          </div>
          <div class="autograph_item">
            <div class="title">签字日期：</div>
            <div class="line">_______________</div>
          </div>
        </div>
        <div>
          <div class="autograph_item">
            <div class="title">培训中心总经理：</div>
            <div class="line">_______________</div>
          </div>
          <div class="autograph_item">
            <div class="title">签字日期：</div>
            <div class="line">_______________</div>
          </div>
        </div>
      </div>
    </div>
    <vxe-button content="打印表格" @click="printEvent1" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { VxeGridProps, VxeTablePropTypes } from 'vxe-table'

  export default defineComponent({
    setup() {
      const table = ref()
      const table1 = ref()
      // const topHtml = ref();
      const autograph = ref()
      const gridOptions = reactive({
        border: true,
        stripe: true,
        resizable: true,
        // height: 500,
        columns: [
          // { type: "seq", width: 50 },
          {
            title: '客户',
            children: [{ title: '收费项目', field: 'name' }],
          },
          {
            title: '四川航空',
            children: [
              { field: 'role', title: '训练机型' },
              { field: 'sex', title: '计费标准' },
            ],
          },
          {
            title: '费用周期',
            children: [{ title: '数量', field: 'age' }],
          },
          {
            title: '2021/04/06 — 2021/05/06',
            children: [
              { field: 'nickname', title: '结算周期' },
              { field: 'id', title: '结算周期' },
            ],
          },
        ],
        data: [
          {
            id: 10001,
            name: 'Test1',
            nickname: 'T1',
            role: 'Develop',
            sex: 'Man',
            age: 28,
            address: 'Shenzhen',
          },
          {
            id: 10002,
            name: 'Test2',
            nickname: 'T2',
            role: 'Test',
            sex: 'Women',
            age: 22,
            address: 'Guangzhou',
          },
        ],
        mergeCells: [{ row: 1, col: 0, rowspan: 0, colspan: 6 }],
      } as VxeGridProps)
      // 打印样式
      const printStyle = `
            h1 {
                text-align: center;
                }
            .tip{
                font-size: 14px;
                padding: 20px;
            }
            .autograph{
                margin-top: 50px;
                padding: 20px;
                line-height: 40px;
                color:red;
            }
            .customer_con{
                    display: flex;
            }
            .department_con{
                margin-top: 50px;
            }
            .autograph_item{
                
                display: flex;
                flex-wrap: wrap;
            }
                .title{
                    width: 200px;
                    text-align: right;
                }
                table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}
    td,
    th {
        border: 1px solid #ff4136;
    }
            `
      const printEvent1 = () => {
        const $table = table.value
        $table.print({
          sheetName: '打印出货单据',
          isMerge: true,
          style: printStyle,
          // columns: [
          //   { type: 'seq' },
          //   { field: 'name' },
          //   { field: 'role' },
          //   { field: 'address' }
          // ],
          beforePrintMethod: ({ content }) => {
            // console.log(autograph.value.innerHTML.toString());
            // console.log(table1.value.innerHTML);

            // 拦截打印之前，返回自定义的 html 内容
            return `${table1.value.innerHTML}` + content
          },
        })
      }

      return {
        gridOptions,
        table,
        table1,
        printEvent1,
        autograph,
        // topHtml,
      }
    },
  })
</script>

<style scoped lang="scss">
  h1 {
    text-align: center;
  }
  .tip {
    font-size: 14px;
    padding: 20px;
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
        width: 200px;
        text-align: right;
      }
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    td,
    th {
      border: 1px solid #ff4136;
    }
  }
</style>
