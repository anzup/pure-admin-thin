<template>
  <!-- authenticationCertificate 证书 -->
  <div>
    <vxe-grid
      border
      resizable
      ref="xGrid"
      class="my-grid66"
      :columns="tableColumn"
      :data="data"
      max-height="300"
      align="center"
      :cell-style="cellStyle"
    >
      <template v-slot:preview="{ row, column }">
        <vxe-button
          v-if="row[column.property]"
          status="primary"
          type="text"
          @click="preview(row, column)"
          >{{ $t('text.see') }}</vxe-button
        >
      </template>
    </vxe-grid>
    <!-- <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
        <VexTabel
            class="vex_tabel_con"
            :tableData="historyTable"
            :tableColumn="historyTableColumn"
            :buttons="historyButtons"
            @action="historyTableClick"
            :tablePage="historyForm"
            :maxHeight="300"
            @handlePageChange="handlePageChange"
        >
        </VexTabel> -->

    <!-- <el-dialog v-model="imgView"  :append-to-body="true">
            <img width="100%" height="200px" :src="getImg()" alt="" />
        </el-dialog> -->
    <el-image-viewer v-if="imgView" @close="closeViewer" :url-list="showBigImgList" />
    <PreviewPdf v-if="PreviewPdf" v-model:viewDialogVisible="PreviewPdf" :preViewObj="rowData" />
  </div>
</template>
<script lang="ts">
  import PreviewPdf from './previewPdf.vue'
  import { getCertificationInvalid } from '/@/api/opm/device'
  import dayjs from 'dayjs'

  export default {
    name: 'AuthenticationCertificate',
    components: {
      PreviewPdf,
    },
    props: {
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
            field: 'serialNumber',
            title: this.$t('text.certificate_no'),
            // sortable: true,
          },
          {
            field: 'identifyOrganization',
            title: this.$t('text.appraisal_unit'),
            // sortable: true,
          },
          {
            field: 'startDate',
            title: this.$t('text.certificate_validity'),
            // sortable: true,
            formatter: this.dormatDate,
          },
          {
            field: 'timeOfNotifyInAdvance',
            title: this.$t('text.reminder_time_before_expiration'),
            // sortable: true,
          },
          {
            field: 'qrcodeFile',
            title: this.$t('text.caac_qr_code'),
            // sortable: true,
            slots: { default: 'preview' },
          },
          {
            field: 'identificationFile',
            title: this.$t('text.identification_certificate'),
            // sortable: true,
            slots: { default: 'preview' },
          },
          {
            field: 'probationReport',
            title: this.$t('text.appraisal_report'),
            // sortable: true,
            slots: { default: 'preview' },
          },
        ],
        isShow: false,
        rowData: {},
        showuploadCertificate: false,
        PreviewPdf: false,
        imgView: false,
        fileId: null,
        historyTableColumn: [
          { type: 'seq', width: 60, title: this.$t('text.seq') },
          {
            field: 'serialNumber',
            title: this.$t('text.certificate_no'),
            // sortable: true,
          },
          {
            field: 'identifyOrganization',
            title: this.$t('text.appraisal_unit'),
            // sortable: true,
          },
          {
            field: 'startDate',
            title: this.$t('text.identification_certificate'),
            // sortable: true,
            formatter: this.dormatDate,
          },
          {
            title: this.$t('text.operation'),
            width: 200,
            slots: { default: 'operate' },
          },
        ],
        historyButtons: [
          {
            label: this.$t('text.see'),
            type: 1,
            // disabled: true,
            // status: "danger",
          },
        ],
        historyTable: [],
        historyForm: {
          page: 1,
          size: 10,
          simulatorId: this.id,
          total: null,
        },
        showBigImgList: [],
      }
    },
    created() {
      // this.getCertificationInvalid();
    },
    watch: {},
    methods: {
      closeViewer() {
        this.imgView = false
      },
      handlePageChange({ pageSize }) {
        this.historyForm.size = pageSize
        this.historyForm.page = this.$setPage(this.historyForm.total, this.historyForm)
        // this.getCertificationInvalid();
      },

      cellStyle({ row, column }) {
        if (column.property === 'startDate') {
          if (row.isTimeOfNotifyInAdvance) {
            return {
              color: '#d32f2f',
            }
          }
        }
      },
      historyTableClick({ row }) {
        if (!row.identificationFile) {
          this.$message({
            message: this.$t('text.cannot_view'),
            type: 'error',
          })
          return
        }
        this.PreviewPdf = true
        this.rowData = {
          id: row.identificationFile.id,
          url: `/public/file/${row.identificationFile.id}/inlineFile`,
        }
      },
      goback() {
        this.$router.push({
          path: '/device/simulator',
        })
      },
      handleSizeChange(val) {
        this.historyForm.size = val
        this.getCertificationInvalid()
      },
      handleCurrentChange(val) {
        this.historyForm.page = val
        this.getCertificationInvalid()
      },
      getCertificationInvalid() {
        getCertificationInvalid(this.historyForm).then((res) => {
          if (res.status == 200) {
            this.historyTable = res.data.content
            this.historyForm.total = res.data.totalElements
          }
        })
      },
      formatCheckAuth({ cellValue }) {
        return cellValue ? this.$t('text.open') : this.$t('text.close')
      },
      dormatDate({ row }) {
        return (
          dayjs(row.startDate).format('YYYY-MM-DD') +
          ' — ' +
          dayjs(row.endDate).format('YYYY-MM-DD')
        )
      },

      preview(row, column) {
        // console.log(row.identificationFile, 260);
        if (column.property == 'identificationFile' || column.property == 'probationReport') {
          this.PreviewPdf = true
          this.rowData = {
            id: row[column.property].id,
            url: `/public/file/${row.identificationFile.id}/inlineFile`,
          }
        } else {
          this.imgView = true
          this.fileId = row.qrcodeFile.id
          this.showBigImgList = [this.getImg()]
        }
      },
      updateData() {
        this.$emit('updateData')
      },

      getImg() {
        return (
          (import.meta.env.VITE_BASE_URL as string) +
          import.meta.env.VITE_BASE_API_DMM +
          `/public/file/${this.fileId}/inlineFile`
        )
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
