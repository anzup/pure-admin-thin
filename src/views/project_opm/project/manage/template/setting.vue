<template>
  <div style="height: 100%">
    <div class="btn_con" v-show="templateSyllabusesList.length == 0">
      <el-button type="primary" @click="creatTemplate">{{ $t('text.create_template') }}</el-button>
    </div>
    <el-tabs
      type="border-card"
      v-if="templateSyllabusesList.length > 0"
      closable
      class="one-leve-tab is-header"
      v-model="tabIndex"
      @tab-remove="removeTab"
      tab-position="left"
    >
      <div class="header title_con">
        <span>{{ getTitle }}</span>
        <el-button type="primary" @click="creatTemplate">{{
          $t('text.create_template')
        }}</el-button>
      </div>
      <el-tab-pane
        :label="item.name"
        v-for="(item, index) in templateSyllabusesList"
        :key="index"
        :name="index + ''"
      >
        <template #label>
          <div class="label">{{ item.name }}</div>
        </template>
        <TemplateTable v-model="item.templateItems" :template-index="index" @updateData="modify" />
      </el-tab-pane>
    </el-tabs>
    <DiaLog v-model="isShow" @updateData="updateData" :itemData="currentIitemData" />
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import TemplateTable from './components/templateTable.vue'
  import DiaLog from './components/dialog/diaLog.vue'
  import {
    postTemplates,
    getTemplatesSyllabusId,
    putTemplates,
    deleteTemplates,
  } from '/@/api/opm/standard'
  import { useRoute } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'

  import { useI18n } from 'vue-i18n'
  import dayjs from 'dayjs'
  const { t } = useI18n()
  const route = useRoute()

  const templateSyllabusesList = ref<Array<Syllabus.SyllabusTemplate>>([
    // {
    //     name: 'qeqew',
    //     templateItems: [
    //         {
    //             id: 1,
    //             period: 1,
    //             sortNumber: 1,
    //             startTime: '',
    //             syllabusItemName: 'asda',
    //             syllabusItemId: 1,
    //             type: "GROUND_THEORY "
    //         },
    //         {
    //             id: 2,
    //             period: 12,
    //             sortNumber: 12,
    //             startTime: '',
    //             syllabusItemName: 'as阿萨德电饭锅da',
    //             syllabusItemId: 12,
    //             type: "GROUND_THEORY "
    //         },
    //     ]
    // }
  ])

  const tabIndex = ref('0')
  const updateData = ({ type, data }) => {
    if (type == 'add') {
      templateSyllabusesList.value.push(data)
      tabIndex.value = templateSyllabusesList.value.length - 1 + ''
    } else {
      const item = templateSyllabusesList.value[currentIndex.value]
      const arr = JSON.parse(JSON.stringify([...item.templateItems, ...data.templateItems]))
      Object.assign(templateSyllabusesList.value[currentIndex.value], data)

      item.templateItems = arr
    }
  }

  const currentIitemData = ref<Syllabus.SyllabusTemplate>(undefined),
    currentIndex = ref<number>(undefined)
  const modify = ({ type, data }) => {
    currentIndex.value = data
    currentIitemData.value = JSON.parse(JSON.stringify(templateSyllabusesList.value[data]))
    if (type == 'edit') {
      isShow.value = true
    } else {
      const data: Syllabus.SyllabusTemplate = JSON.parse(JSON.stringify(currentIitemData.value))
      data.templateItems.map((v, index) => {
        v.sortNumber = index
        v.startTime = dayjs(v.startTime).format('HH:mm')
        return v
      })
      data.syllabusId = +route.params.id
      if (currentIitemData.value.id) {
        putTemplates(data).then((res) => {
          ElMessage.success(t('message.modified_successfully'))
          // getList()
        })
      } else {
        postTemplates(data).then((res) => {
          ElMessage.success(t('message.successfully_added'))
          // getList()
        })
      }
    }
  }
  const creatTemplate = () => {
    currentIitemData.value = undefined
    isShow.value = true
  }
  const isShow = ref<boolean>(false)

  const getList = () => {
    getTemplatesSyllabusId(+route.params.id).then((res) => {
      templateSyllabusesList.value = res.data.map((v) => {
        v.templateItems.forEach((item) => {
          item.startTime = item.startTime
            ? dayjs('2021-12-3 ' + item.startTime).toString()
            : undefined
        })
        return v
      })
    })
  }
  const removeTab = (val) => {
    ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), t('text.tip'), {
      type: 'warning',
    })
      .then(() => {
        if (templateSyllabusesList.value[+val].id) {
          deleteTemplates(templateSyllabusesList.value[+val].id).then((res) => {
            ElMessage.success(t('message.delete_succeeded'))
            templateSyllabusesList.value.splice(+val, 1)
          })
        } else {
          ElMessage.success(t('message.delete_succeeded'))
          templateSyllabusesList.value.splice(+val, 1)
        }
        tabIndex.value = +tabIndex.value > 0 ? +tabIndex.value - 1 + '' : 0 + ''
      })
      .catch(() => {})
  }

  const getTitle = computed(() => templateSyllabusesList.value[tabIndex.value]?.name)

  onMounted(() => {
    getList()
  })
</script>
<style lang="scss" scoped>
  .btn_con {
    text-align: right;
    padding: $defaultMarginWidth;
  }
  .title_con {
    text-align: left !important;
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    & > span {
      font-size: 15px;
      font-weight: 700;
    }
  }
</style>
