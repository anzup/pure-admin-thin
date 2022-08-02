<template>
  <el-dialog
    width="600px"
    :title="$t('button.examine')"
    v-model="visible"
    :close-on-click-modal="false"
    center
    v-loading="loading"
    @closed="freshEvent"
  >
    <template v-if="hasDetails">
      <el-form label-suffix=":">
        <!-- 获取时间 -->
        <el-form-item :label="$t('table.acquisitionTime')">
          {{ formatDate(details.getTime) }}
        </el-form-item>
        <!-- 过期时间 -->
        <el-form-item :label="$t('table.expirationTime')">
          {{ formatDate(details.expireTime) }}
        </el-form-item>
        <!-- 附件 -->
        <el-form-item :label="$t('table.attachment')">
          <a class="file-link" v-if="details.type && details.type.name" @click="previewFileEvent">
            <el-icon><Link /></el-icon> {{ details.type.name }}
          </a>
        </el-form-item>
      </el-form>
      <el-divider />
    </template>
    <el-form ref="form" label-suffix=":" :model="formData" :rules="formRules">
      <!-- 审核结果 -->
      <el-form-item :label="$t('table.auditResults')" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio v-for="item in formFilter.audit" :key="item.id" :label="item.id">{{
            item.name
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 驳回理由 -->
      <el-form-item
        :label="$t('table.reasonsForRejection')"
        v-if="formData.status === 'REJECTED'"
        prop="remark"
      >
        <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="medium" plain @click="visible = false">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" :loading="loading" @click="submitEvent">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import to from 'await-to-js'
  import { Link } from '@element-plus/icons-vue'
  export default {
    components: { Link },
    data() {
      return {
        formData: {
          status: '',
          remark: '',
        },
        formRules: {
          status: [{ required: true, message: this.$t('holder.pleaseSelectAuditResult') }],
          remark: [{ required: true, message: this.$t('holder.pleaseEnterRejectReason') }],
        },
        formFilter: {
          audit: [
            { id: 'APPROVED', name: this.$t('common.approve') },
            { id: 'REJECTED', name: this.$t('button.reject') },
          ],
        },
        loading: false,
      }
    },
    props: {
      show: Boolean,
      id: [String, Number],
      hasDetails: Boolean,
    },
    computed: {
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
      details() {
        try {
          const { attachments, getTime, expireTime, type, fileVOS } = this.$attrs.details
          return { attachments, getTime, expireTime, type, fileVOS }
        } catch (e) {
          return { attachments: [], getTime: '', expireTime: '', type: {}, fileVOS: [] }
        }
      },
    },
    methods: {
      freshEvent() {
        this.$refs.form && this.$refs.form.resetFields()
      },
      submitEvent() {
        this.$refs.form.validate(async (validity) => {
          if (!validity) return
          this.loading = true
          let params
          const { api, apiType } = this.$attrs
          switch (apiType) {
            case 1:
              params = {
                ...this.formData,
                ids: [this.id],
              }
              break
            case 2:
              params = {
                ...this.formData,
                id: this.id,
              }
              break
          }
          const [err, res] = await to(api(params))
          this.loading = false
          if (!err && res.status == 200) {
            this.$message.success(this.$t('tip.subSuccessTip'))
            this.visible = false
            this.$emit('complate')
          }
        })
      },
      previewFileEvent() {
        this.$emit('preview', {
          title: this.details.type.name,
          uuid: this.details.attachments[0],
          fileType: this.details.fileVOS[0].fileType,
        })
      },
      formatDate(val) {
        return val ? moment(val).format('YYYY-MM-DD') : val
      },
    },
  }
</script>

<style lang="scss" scoped>
  .file-link {
    color: #409eff;
    &:hover {
      text-decoration: underline;
    }
  }
</style>
