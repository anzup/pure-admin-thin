<template>
  <div id="itemRef" style="dispaly: none">
    <Page
      v-for="(detailData, index) in detailDataList"
      :key="index"
      :detailData="detailData"
      :ref="setPageRef"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, reactive, ref, toRefs, onBeforeUpdate, onUpdated } from 'vue'
  import { getBillsDetailList } from '/@/api/opm/contract'
  import Page from './page.vue'
  import VxeTable from 'vxe-table'
  export default defineComponent({
    components: {
      Page,
    },

    setup() {
      const typeList = ref(['WET_LEASE', 'DRY_LEASE'])

      const state = reactive({
        detailDataList: [
          {
            wetTrainingItems: [],
            wetOtherItems: [],
            dryTrainingItems: [],
            dryPresentItems: [],
            wetAmount: [],
            dryAmount: [],
            startDate: '',
            endDate: '',
            wetItems: [],
            dryItems: [],
          },
        ],
      })

      const getDetail = async (ids: number[]) => {
        const { data } = await getBillsDetailList({
          value: ids.join(),
        })
        state.detailDataList = data
      }

      let pageRef = []
      const setPageRef = (el) => {
        pageRef.push(el)
      }
      onBeforeUpdate(() => {
        pageRef = []
      })
      onUpdated(async () => {
        let content = ''
        for (let index = 0; index < pageRef.length; index++) {
          const element = pageRef[index]
          content += await element.getContent()?.replace(/<colgroup>[\S\s]*<\/colgroup>/g, '')
        }

        nextTick(async () => {
          VxeTable.print({
            content: content.replace(/<colgroup>[\S\s]*<\/colgroup>/g, ''),
            style: `
                     h3 {
                            text-align: center;
                            page-break-before: always;
                        }
                    .autograph {
                        margin-top: 50px;
                        padding: 20px;
                        line-height: 40px;
                        page-break-after: always;
                    }
                    .customer_con {
                        display: flex;
                    }
                    
                    .department_con {
                        margin-top: 50px;
                    }
                    
                    .autograph_item {
                        display: flex;
                        flex-wrap: nowrap;
                    }
                    .title {
                        width: 130px;
                        text-align: right;
                    }
                    .tip {
                        margin-top: 20px;
                            font-size: 14px;
                            padding: 20px;
                            border: 1px solid #333;
                        

                        }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        border-spacing: 0;
                    }
                        td,
                        th {
                        border: 1px solid #333;
                        padding: 2px;
                        border: 1px solid #333;
                        font-size: 14px;
                        line-height: 1.5;
                        text-align: center;
                        }
                        th {
                        background-color: #f8f8f9;
                        }
                    .flex{
                        flex: 1;
                    }
                    .cell{
                        width: 200px;
                    }
                    .line{
                        padding-right: 150px;
                    }
                    .vxe-cell{
                        padding-left:0px;
                        padding-right:0px;
                    }
                    .vxe-body--column{
                        padding-top:0px;
                        padding-buttom:0px;
                    }
                     `,
            // .vxe-cell--label{

            // }
          })
        })
        // return Promise.resolve(conten+res)
      })
      return {
        typeList,
        ...toRefs(state),
        getDetail,
        pageRef,
        setPageRef,
      }
    },
  })
</script>

<style scoped lang="scss"></style>
