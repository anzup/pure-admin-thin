<!--
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-26 10:20:00
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-26 14:15:03
 * @FilePath: \crew-web\src\components\FileManage\components\addFolder.vue
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
-->
<template>
  <el-drawer
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="getTitle"
    center
    destroy-on-close
    width="500px"
    @close="close"
    @open="open"
  >
    <el-form ref="formRef" :model="state.form" :rules="state.rules" label-position="top">
      <el-form-item :label="t('state.name')" prop="name">
        <el-input v-model="state.form.name" />
      </el-form-item>
      <el-form-item label="访问者权限(不勾选则所有人可见)" prop="accessControls">
        <el-checkbox-group v-model="state.form.accessControls">
          <el-checkbox v-for="(item, index) in roleAllList" :key="index" :label="item.id"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ t('buttons.hscancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ t('buttons.hsdefine') }}
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
  import { ref, computed, reactive } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { FolderItem, postFolders, PostFolder } from '/@/api/file'
  import { ElMessage } from 'element-plus'
  import useUser from '/@/hooks/user'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
    id?: number
    parentUuid: string
  }

  interface Form extends Partial<Omit<FolderItem, 'accessControls'>> {
    accessControls: string[]
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)
  const getTitle = computed(() => (!props.id ? t('buttons.hsadd') : t('buttons.modify')))
  const state = reactive<{
    form: Form
    // eslint-disable-next-line no-undef
    rules: Partial<Record<keyof Form, FormItemRule>>
  }>({
    form: {
      accessControls: [],
    },
    rules: {},
  })
  // eslint-disable-next-line no-undef
  const formRef = ref<ElFormInstance>()
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        let api: (
          // eslint-disable-next-line no-undef
          data: PostFolder,
        ) => Promise<any> = undefined
        if (!props.id) {
          api = postFolders
        } else {
          // api = ;
        }
        const { name, accessControls, id } = state.form
        // eslint-disable-next-line no-undef
        const data: PostFolder = {
          name,
          id,
          accessControls: accessControls.map((v) => ({ type: v })),
          parentUuid: props.parentUuid,
        }

        api(data).then(() => {
          ElMessage.success({
            message: !props.id
              ? t('message.successfully_added')
              : t('message.modified_successfully'),
            type: 'success',
          })
          emit('updateData')
          dialogVisible.value = false
        })
      }
    })
  }

  const { getRolesList, roleAllList, rolesForm } = useUser()

  const open = async () => {
    rolesForm.fromTrainingCenter = true
    await getRolesList()
    if (props.id) {
      //api(props.id).then(res => {
      //state.form = res.data
      //})
    }
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
