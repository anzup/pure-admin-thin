<template>
  <el-dialog :title="dialogObj.title" v-model="visible" width="65%" @close="handleCancel" center>
    <div>
      <div class="inline-img" v-for="(item, index) in hisTableData" :key="index">
        <img :src="previewURL(item.signatureFileUuid)" width="140px" alt="" srcset="" />
        <div>{{ formatDateTime(item.createdDate) }}-{{ formatDateTime(item.endDate) }}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import { signatureHistory } from '/@/api/ftm/teacher/education'
  import moment from 'moment'
  export default {
    props: {
      modelValue: {},
      dialogObj: {
        type: Object,
        default: {
          visible: false,
          title: '',
        },
      },
    },
    computed: {
      visible: {
        get() {
          return this.modelValue
        },
        set(val) {
          this.$emit('update:modelValue', val)
        },
      },
    },
    data() {
      return {
        hisTableData: [],
      }
    },
    watch: {
      modelValue(val) {
        if (val) {
          this.getList()
        }
      },
    },
    methods: {
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
        signatureHistory({ userId: this.dialogObj.userId })
          .then((res) => {
            this.hisTableData = res.data
          })
          .catch((err) => {})
      },
      handleCancel() {
        this.$emit('close')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .inline-img {
    text-align: center;
    display: inline-block;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    div {
      font-size: 12px;
      color: #999;
      padding: 5px 10px;
    }
    img {
      width: 140px;
      height: 100px;
      object-fit: contain;
    }
  }
</style>
