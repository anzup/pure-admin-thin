<template>
  <el-scrollbar wrap-class="p-8">
    <el-form ref="formRef" v-loading="loading" :model="state.form">
      <el-form-item
        v-for="(client, index) in state.form.clients"
        :key="index"
        :prop="'clients.' + index + '.name'"
        :rules="{
          required: true,
          message: $t('tip.pleaseEnter'),
          trigger: 'blur',
        }"
      >
        <el-tag
          v-show="client.id && !client.canEdit"
          class="truncate"
          size="small"
          style="width: 300px; margin-right: 10px"
        >
          {{ client.name }}
        </el-tag>
        <el-input
          v-show="!(client.id && !client.canEdit)"
          v-model="client.name"
          clearable
          style="width: 300px; margin-right: 10px"
        ></el-input>

        <el-button
          v-if="client.id && !client.canEdit"
          plain
          type="primary"
          @click.prevent="editClient(client)"
        >
          <el-icon :size="16">
            <edit />
          </el-icon>
        </el-button>
        <el-button
          v-if="client.canEdit"
          plain
          type="primary"
          @click.prevent="saveClient(client, 'clients.' + index + '.name')"
        >
          <el-icon :size="16">
            <check />
          </el-icon>
        </el-button>
        <el-button plain type="danger" @click.prevent="removeDomain(client)">
          <el-icon :size="16">
            <close />
          </el-icon>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="state.form.clients.findIndex((item) => item.canEdit) != -1"
          type="primary"
          @click="addDomain"
        >
          {{ $t('buttons.hsAdd') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import to from 'await-to-js'
import { AxiosPromise } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '/@/hooks/useI18n'

export interface Props {
  api: {
    // eslint-disable-next-line no-undef
    getList: (params?: any) => AxiosPromise<DefaultPagingData>
    postData: (params?: any) => AxiosPromise<any>
    putData: (params?: any) => AxiosPromise<any>
    deleteData: (params?: any) => AxiosPromise<any>
  }
  getForm?: {
    page?: number
    size?: number
    order?: string
    limited?: boolean
  }
}

export interface Item {
  canEdit?: boolean
  id?: number
  name: string
}

const { t } = useI18n()

const props = defineProps<Props>()

const state = reactive<{
  form: {
    clients: Item[]
  }
}>({
  form: {
    clients: [],
  },
})
const formRef = ref(),
  loading = ref(false)
const getList = async () => {
  if (!props.api?.getList) return
  loading.value = true
  const [err, res] = await to(
    props.api.getList(Object.assign({ page: 1, size: 1000, order: 'asc' }, props.getForm)),
  )
  if (err) return
  state.form.clients = res.data.content.map((v) => {
    v.canEdit = false
    return v
  })
  loading.value = false
}

const editClient = (item: any) => {
  item.canEdit = true
}

const saveClient = (item: Item, prop: string) => {
  formRef.value.validateField(prop, (valid) => {
    console.log(valid)

    if (valid) {
      if (!item.id) {
        // 新增
        props.api.postData(item).then(() => {
          ElMessage.success(t('messages.successfully_added'))
          getList()
        })
        return
      }
      // 编辑
      props.api.putData(item).then(() => {
        ElMessage.success(t('message.modified_successfully'))
        getList()
      })
    }
  })
}
const removeDomain = (item) => {
  ElMessageBox.confirm(t('tip.deleteTheSelectedData'), {
    type: 'warning',
  })
    .then(() => {
      var index = state.form.clients.indexOf(item)

      if (index !== -1 && item.id) {
        props.api.deleteData(item.id).then(() => {
          ElMessage.success(t('message.delete_succeeded'))
          state.form.clients.splice(index, 1)
        })
      } else {
        state.form.clients.splice(index, 1)
      }
    })
    .catch((_) => {
    })
}
const addDomain = () => {
  state.form.clients.push({
    id: undefined,
    name: '',
    canEdit: true,
  })
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  .el-form-item__content {
    width: 150px;
    display: flex;
  }
}

:deep(.el-tag) {
  width: 100%;
  height: 100%;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
}
</style>
