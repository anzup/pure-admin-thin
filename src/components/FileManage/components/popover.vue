<template>
  <el-popover
    ref="popoverRef"
    v-model:visible="visible"
    :offset="-20"
    :placement="placement"
    :show-after="500"
    :teleported="false"
    :virtual-ref="virtualRef"
    :width="300"
    trigger="click"
    virtual-triggering
    @show="open"
    @before-leave="close"
  >
    <el-form v-if="visible" ref="formRef" :model="form" :rules="rules">
      <el-form-item prop="name">
        <el-input v-model="form.name" :placeholder="t('tip.please_enter')" />
      </el-form-item>
      <el-form-item v-if="!isFile" prop="type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox v-for="(item, index) in roleAllList" :key="index" :label="item.id"
            >{{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="!text-center">
        <el-button @click="visible = false">
          {{ t('buttons.hscancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ t('buttons.hsdefine') }}
        </el-button>
      </div>
    </el-form>
  </el-popover>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { onClickOutside, useVModel } from '@vueuse/core'
  import {
    FileResources,
    FolderItem,
    putFolders,
    putFileResources,
    PutFolder,
    AccessControls,
  } from '/@/api/file'
  import type { FormInstance } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useUser from '/@/hooks/user'

  const { t } = useI18n()

  interface Props {
    virtualRef: HTMLElement
    modelValue: boolean
    folderOrFile: any
    placement: string
  }

  const props = defineProps<Props>()
  // const eleRef = $computed(() => props.virtualRef)
  const isFile = $computed(() => (props.folderOrFile as FileResources & FolderItem).fileUuid)
  // onClickOutside($$(eleRef), () => {
  //   visible.value = false
  // })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const visible = useVModel(props, 'modelValue', emit)
  const popoverRef = ref()

  const form = reactive<{
    name: string
    type: string[]
  }>({
    name: undefined,
    type: [],
  })
  const rules = reactive<Partial<Record<keyof typeof form, FormItemRule>>>({
    name: {
      required: true,
      message: t('tip.please_enter'),
    },
  })
  const formRef = $ref<FormInstance>()
  const { getRolesList, roleAllList, rolesForm } = useUser()

  // 弹框出现的位置
  const open = async () => {
    rolesForm.fromTrainingCenter = true
    form.name = props.folderOrFile?.name
    if (!isFile) {
      await getRolesList()
      console.log(props.folderOrFile.accessControls)
      form.type = props.folderOrFile.accessControls?.map((v) => +v.type) || []
    }
  }
  const close = () => {
    form.name = undefined
    form.type = []
  }
  const confirm = () => {
    formRef.validate((valid) => {
      if (valid) {
        let api: (e: any) => Promise<any>
        const data: PutFolder = {
          uuid: props.folderOrFile.uuid,
          name: form.name,
          accessControls: form.type.map<AccessControls>((v) => {
            return {
              type: v,
            }
          }),
        }
        data.uuid = props.folderOrFile.uuid
        if (isFile) {
          api = putFileResources
          delete data.accessControls
        } else {
          api = putFolders
        }
        api(data).then(() => {
          visible.value = false
          emit('updateData')
        })
      }
    })
  }
</script>

<script lang="ts">
  export default {
    name: 'popover',
  }
</script>

<style scoped></style>
