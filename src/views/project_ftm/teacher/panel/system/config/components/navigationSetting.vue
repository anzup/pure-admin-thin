<template>
  <!-- navigationSetting -->
  <div>
    <el-form
      :inline="true"
      :disabled="!canEdit"
      :model="form"
      :rules="rules"
      ref="form"
      class="demo-form-inline"
    >
      <el-form-item :label="$t('table.systemName')" prop="systemName">
        <el-input
          @change="updateData"
          v-model="form.systemName"
          :placeholder="$t('table.systemName')"
          type="textarea"
          autosize
        />
      </el-form-item>
      <el-form-item :label="$t('table.fontColor')" prop="fontColor">
        <el-color-picker v-model="form.fontColor" @change="updateData" />
      </el-form-item>
      <el-form-item :label="$t('table.navigationBarBackgroundColor')" prop="backgroundColor">
        <el-color-picker v-model="form.backgroundColor" @change="updateData" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'navigationSetting',
    props: {
      detailData: Object,
      canEdit: Boolean,
    },
    watch: {
      detailData: {
        immediate: true,
        deep: true,
        handler(val) {
          Object.assign(this.form, val)
        },
      },
    },
    data() {
      return {
        form: {
          systemName: null,
          fontColor: null,
          backgroundColor: null,
        },
        rules: {
          systemName: [
            {
              required: true,
              message: this.$t('holder.pleaseEnterTheSystemName'),
              trigger: 'blur',
            },
          ],
          fontColor: [
            { required: true, message: this.$t('holder.pleaseSelectFontColor'), trigger: 'blur' },
          ],
          backgroundColor: [
            {
              required: true,
              message: this.$t('holder.pleaseSelectTheBackgroundColor'),
              trigger: 'blur',
            },
          ],
        },
      }
    },
    mounted() {
      this.$emit('updateData', [this.form, this.$refs.form])
    },
    methods: {
      updateData() {
        this.$emit('updateData', [this.form, this.$refs.form])
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.el-textarea) {
    width: 300px;
  }
  :deep(.el-form-item) {
    margin-right: 50px;
  }
  :deep(.el-form-item__content) {
    width: 300px;
  }
</style>
