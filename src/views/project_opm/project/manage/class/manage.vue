<template>
  <div class="detail-main-container">
    <el-descriptions :column="2" border>
      <el-descriptions-item
        :label="$t('text.school_year')"
        label-class-name="my-label"
        width="150px"
        >{{ infoForm.year }}</el-descriptions-item
      >
      <el-descriptions-item
        :label="$t('text.class_number')"
        label-class-name="my-label"
        width="150px"
        >{{ infoForm.courseNumber }}</el-descriptions-item
      >
      <el-descriptions-item
        :label="$t('text.class_name')"
        label-class-name="my-label"
        width="150px"
        >{{ infoForm?.shortName }}</el-descriptions-item
      >
      <el-descriptions-item
        :label="$t('text.course_project_name')"
        label-class-name="my-label"
        width="150px"
        >{{ infoForm.course?.name }}</el-descriptions-item
      >
      <el-descriptions-item
        :label="$t('text.name_of_training_course')"
        label-class-name="my-label"
        width="150px"
        >{{ infoForm.syllabus?.name }}</el-descriptions-item
      >
      <el-descriptions-item
        :label="$t('text.connection')"
        label-class-name="my-label"
        width="150px"
      >
        <span v-for="(item, index) in infoForm?.customers" :key="index">{{ item.name }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <el-tabs class="flex-content tabs-container" v-model="activeName" v-if="!!infoForm.type">
      <el-tab-pane v-for="item in tabList" :key="item.cmp" :label="item.name" :name="item.name">
        <component
          v-if="activeName == item.name"
          :is="item.cmp"
          :type="infoForm.type"
          :functionType="item.functionType"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
  import { provide, defineComponent, onMounted, reactive, toRefs, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import Student from './components/student/student.vue'
  import Subgroup from './components/subgroup/subgroup.vue'
  import Binding from './components/binding/binding.vue'
  import { getClazzsDetail } from '/@/api/opm/train'
  import { useI18n } from 'vue-i18n'
  import useAllResource from '/@/commonTs/allresources'
  import to from 'await-to-js'
  export default defineComponent({
    components: {
      Student,
      Subgroup,
      Binding,
    },
    setup() {
      const { t } = useI18n()
      const route = useRoute()
      const clazzId: string = route.params.id as string
      provide('clazzId', ref(clazzId).value)
      const state = reactive({
        activeName: t('text.student_management'),

        infoForm: {
          contracts: [],
          type: undefined as courseType,
          syllabus: undefined,
        } as any,
      })

      const tabList = computed(() =>
        state.infoForm.type == 'WET_LEASE'
          ? [
              {
                name: t('text.student_management'),
                cmp: 'Student',
              },
              {
                name: t('text.group_management'),
                cmp: 'Subgroup',
              },
              {
                name: t('text.teacher_batch_binding'),
                cmp: 'Binding',
                functionType: 'teacherBinding',
              },
              {
                name: t('text.resource_binding'),
                cmp: 'Binding',
                functionType: 'resourceBinding',
              },
            ]
          : [
              {
                name: t('text.student_management'),
                cmp: 'Student',
              },
            ],
      )

      provide(
        'contracts',
        computed(() => state.infoForm.contracts),
      )
      const { allResouceList, getAllResourcesList } = useAllResource()
      provide('allResources', allResouceList)
      onMounted(async () => {
        const [error, res] = await to(getClazzsDetail(clazzId))
        if (!error) {
          state.infoForm = res.data
          getAllResourcesList()
        }
      })
      return {
        ...toRefs(state),
        tabList,
      }
    },
  })
</script>

<style scoped lang="scss">
  .detail-main-container {
    display: flex;
    flex-direction: column;
    .flex-content {
      flex: 1;
    }
    .tabs-container {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      :deep(.el-tabs__content) {
        flex: 1;
        overflow: hidden;
      }
      :deep(.el-tab-pane) {
        height: 100%;
        overflow: hidden;
      }
    }
  }
</style>
