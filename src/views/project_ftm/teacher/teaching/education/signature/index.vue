<template>
  <div>
    <VxeTable ref="xTable" :data="tableData" :columns="tableColumns" :buttons="tableButtons">
      <template #currentSignatures="{ row }">
        <div v-if="row.currentSignatures" class="img-wrap-s">
          <img
            class="view-picture"
            :src="previewURL(row.currentSignatures.signatureFileUuid)"
            alt=""
            srcset=""
          />
        </div>
      </template>
      <template #hisSign="{ row }">
        <div class="flex-img">
          <div
            class="inline-img"
            v-for="(item, index) in reverse(row.historySignatures)"
            :key="index"
            v-show="widthSize >= index + 1"
          >
            <img class="view-picture" :src="previewURL(item.signatureFileUuid)" alt="" srcset="" />
            <div>{{ formatDateTime(item.createdDate) }}-{{ formatDateTime(item.endDate) }}</div>
          </div>
        </div>
      </template>
      <template #pager />
    </VxeTable>

    <MoreSign v-model="dialogObj.visible" :dialogObj="dialogObj" @close="closeDia" />
  </div>
</template>
<script>
  import VxeTable from '/@/components/Table/index.vue'
  import MoreSign from './components/MoreSign.vue'
  import { allsignatureHistory } from '/@/api/ftm/teacher/education'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import moment from 'moment'
  export default {
    name: 'signManage',
    components: {
      VxeTable,
      MoreSign,
    },
    data() {
      return {
        dialogObj: {
          visible: false,
          title: this.$t('table.historySign'),
        },
        widthSize: 1,
        tableData: [],
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', minWidth: 120, title: this.$t('table.teacherLastName') },
          {
            field: 'currentSignatures',
            minWidth: 180,
            title: this.$t('table.nowTimeSign'),
            slots: { default: 'currentSignatures' },
          },
          {
            field: 'hisSign',
            title: this.$t('table.hisSign'),
            slots: { default: 'hisSign' },
            width: 1070,
          },
          { title: this.$t('table.tableEdit'), width: 100, slots: { default: 'operate' } },
        ],
      }
    },
    mounted() {
      this.setSize()
      this.getList()
    },
    methods: {
      setSize() {
        let dom = document.getElementsByClassName('app-main')[0]
        let clientWidth = dom.clientWidth
        if (clientWidth >= 1710) {
          this.widthSize = 7
        } else if (clientWidth >= 1312) {
          this.widthSize = 4
        } else if (clientWidth >= 1156) {
          this.widthSize = 3
        } else if (clientWidth >= 970) {
          this.widthSize = 2
        } else {
          this.widthSize = 1
        }
        // console.log(clientWidth, this.widthSize)
      },
      formatDateTime(cellValue) {
        if (!cellValue) {
          return this.$t('common.today')
        }
        return moment(cellValue).format('YYYY/MM/DD')
      },
      previewURL(val) {
        if (!val) {
          return ''
        }
        return previewURL(val)
      },
      getList() {
        allsignatureHistory({ size: 20 }).then((res) => {
          this.tableData = res.data
        })
      },
      lookMore(row) {
        console.log(row, 'www')
        this.dialogObj = {
          ...row,
          visible: true,
          title: this.$t('table.historySign'),
        }
      },
      closeDia() {
        this.dialogObj.visible = false
      },
      reverse(arr) {
        if (Array.isArray(arr)) {
          let list = JSON.parse(JSON.stringify(arr))
          return list.reverse()
        } else {
          return []
        }
      },
      tableButtons({ row }) {
        return [
          {
            disabled: row.historySignatures?.length < this.widthSize,
            name: this.$t('table.more'),
            event: () => {
              this.lookMore(row)
            },
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
  .flex-img {
    text-align: left;
  }
  .img-wrap-s {
    display: inline-block;
    height: 131px;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    background: #fff;
  }
  .inline-img {
    text-align: center;
    display: inline-block;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    margin-right: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    background: #fff;
    div {
      font-size: 12px;
      line-height: 1;
      color: #999;
      padding: 5px 10px;
    }
  }
  .view-picture {
    width: 140px;
    height: 100px;
    object-fit: contain;
  }
</style>
