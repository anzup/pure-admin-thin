<template>
  <!-- v-loading="loading" -->
  <div class="w-full h-full">
    <vxe-grid
      v-bind="gridOptions"
      @checkbox-all="selectAllChangeEvent"
      @checkbox-change="selectChangeEvent"
      @checkbox-range-change="checkboxRange"
      ref="gridRef"
      :data="tableData"
    >
      <template #buttons>
        <el-form inline class="header-form" ref="headerFormRef">
          <el-form-item
            :label="
              $t(
                functionType == 'teacherBinding'
                  ? 'text.need_teachers'
                  : 'text.facilities_required',
              )
            "
            prop="needResource"
          >
            <el-select
              v-model="needResource"
              @change="needResourcesChange"
              clearable
              @clear="needResource = undefined"
            >
              <el-option :label="$t('text.yes')" :value="true" />
              <el-option :label="$t('text.no')" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="
              $t(
                functionType == 'teacherBinding'
                  ? 'text.type_of_instructor'
                  : 'text.type_of_teaching_facilities',
              )
            "
          >
            <el-select
              v-model="resourcesType"
              :clearable="!needResource"
              @clear="resourcesType = undefined"
            >
              <el-option
                v-for="(item, index) in cptResourceList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="searchKey">
            <el-input
              style="width: 200px"
              clearable
              v-model="searchKey"
              @change="searchEvent"
              :placeholder="$t('text.please_enter')"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchEvent">{{ $t('message.submit') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <!-- v-if="functionType == 'teacherBinding'" -->
        <el-button :disabled="canSelect" type="primary" @click="clickEvent">{{
          $t(functionType == 'teacherBinding' ? 'text.bind_teacher' : 'text.binding_facilities')
        }}</el-button>
        <el-button type="danger" :disabled="canSelect" @click="cancellation">{{
          $t('text.batch_cancellation')
        }}</el-button>
        <!-- <el-button
                    v-if="functionType !== 'teacherBinding'"
                    :disabled="canSelect"
                    type="primary"
                    @click="isShowFacilities = true"
                >{{ $t("text.binding_facilities") }}</el-button>-->
      </template>
      <template #checkAll>
        <vxe-checkbox
          :disabled="needResource == undefined"
          v-model="checkAll"
          @change="selectAllChangeEvent"
          :indeterminate="selectList.length > 0"
        />
      </template>
    </vxe-grid>
    <DiaLog
      v-model:isShow="isShow"
      :selectList="selectList"
      :clazzId="+clazzId"
      @updateData="updateData"
      :functionType="functionType"
    />
    <BindingTeacher
      v-model:isShow="isShowTeacher"
      :selectList="selectList"
      :clazzId="+clazzId"
      @updateData="updateData"
      :functionType="functionType"
    />
    <!-- <FacilitiesDialog
            v-model:isShow="isShowFacilities"
            :selectList="selectList"
            :clazzId="+clazzId"
            @updateData="updateData"
            :resourceTypeId="resourceTypeId"
        />-->
  </div>
</template>

<script lang="ts" setup>
  import { VxeTableEvents } from 'vxe-table'

  import { reactive, onMounted, toRefs, inject, computed, ref, Ref, watch } from 'vue'

  import DiaLog from './diaLog.vue'
  import BindingTeacher from './bindingTeacher.vue'

  import { getTeacherBinding, getFacilityBinding } from '/@/api/opm/train'
  import { putSchedulesUnbind } from '/@/api/opm/train'

  import { useI18n } from 'vue-i18n'
  // import FacilitiesDialog from './facilities.vue';
  import { debounce } from 'lodash'
  import XEUtils from 'xe-utils'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const props = defineProps({
    functionType: String,
  })

  const allResources = inject<Ref<Array<Scheduler.IResourcesTypeList>>>('allResources')
  const { t } = useI18n()
  const clazzId = inject<string>('clazzId')
  const checkMethod = ({ row }) => {
    return needResource.value != undefined
    // if (state.selectList.length > 0) {
    //     if (props.functionType == "teacherBinding") {
    //         return row?.teacher?.name == state.selectList[0]?.teacher?.name;
    //     } else {
    //         return row?.facilities?.id == state.selectList[0]?.facilities?.id
    //     }
    // } else {
    //     if (props.functionType == "teacherBinding") {
    //         return !!row?.teacher?.name
    //     }
    //     return true
    // }
  }
  const state = reactive({
    gridOptions: {
      height: 'auto',
      columns: [
        {
          align: 'left',
          type: 'checkbox',
          width: 40,
          slots: {
            header: 'checkAll',
          },
        },
        { type: 'seq', width: 50, title: t('text.seq') },
        {
          field: 'syllabusItemFullName',
          title: t('text.course_content'),
          // sortable: true,
          minWidth: 200,
          // formatter: ({ row, cellValue }) =>
          //     row.groupName
          //         ? cellValue + `【${row.groupName}】`
          //         : cellValue,
          type: 'html',
        },
        {
          field: 'syllabusItemName',
          title: t('text.content_abbreviation'),
          // sortable: true,
          minWidth: 100,
          type: 'html',
        },

        {
          field: 'period',
          title: t('text.training_class'),
          // sortable: true,
          width: 100,
        },
        {
          // visible: props.functionType !== "teacherBinding",
          field: 'needResource',
          title: t('text.facilities_required'),
          // sortable: true,
          width: 100,
          formatter: 'formatBool',
        },
        {
          // visible: props.functionType !== "teacherBinding",
          field: 'facilityResourceName',
          title: t('text.facility_type'),
          // sortable: true,
          width: 100,
        },
        {
          // visible: props.functionType !== "teacherBinding",
          field: 'facilityName',
          title: t('text.teaching_facilities'),
          // sortable: true,
          minWidth: 100,
          type: 'html',
        },
        {
          // visible: props.functionType !== "teacherBinding",
          field: 'needTeacher',
          title: t('text.need_teachers'),
          // sortable: true,
          width: 100,
          formatter: 'formatBool',
        },
        {
          // visible: props.functionType == "teacherBinding",
          field: 'teacherResourceName',
          title: t('text.type_of_instructor'),
          // sortable: true,
          width: 150,
          // formatter: "formatTeacherType"
        },
        {
          // visible: props.functionType == "teacherBinding",
          field: 'teacherName',
          title: t('text.instructor'),
          // sortable: true,
          width: 150,
          type: 'html',
        },
      ],
      dataList: [],
      toolbarConfig: {
        // custom: true,
        size: 'medium',
        perfect: true,
        slots: {
          tools: 'toolbar_tools',
          buttons: 'buttons',
        },
      },
      checkboxConfig: {
        checkMethod,
        showHeader: false,
        highlight: true,
        range: true,
        trigger: 'row',
      },
      highlightCurrentRow: true,
    },

    isShow: false,
    loading: false,
    selectList: [],
    checkAll: false,
    gridRef: undefined,
  })
  const isShowTeacher = ref(false)
  const { gridOptions, isShow, selectList, checkAll, gridRef } = toRefs(state)
  const clickEvent = () => {
    props.functionType == 'teacherBinding' ? (isShowTeacher.value = true) : (isShow.value = true)
  }

  const getList = () => {
    state.loading = true
    const api = props.functionType == 'teacherBinding' ? getTeacherBinding : getFacilityBinding
    api(
      clazzId,
      // contracts:contracts
    ).then((res) => {
      state.loading = false
      const { data } = res
      state.gridOptions.dataList = data.map((v) => {
        const facility = allResources.value.find((i) => i.id == v.facilityResourceId)
        v.facilityResourceName = facility?.name
        // v.facilityName = facility?.resources.find(i => i.rid == v.facilityId)?.name
        const teacher = allResources.value.find((i) => i.id == v.teacherResourceId)
        v.teacherResourceName = teacher?.name
        v.teacherName = v.personGroups
          .find((i) => i.personRole == 'MAIN_TEACHER')
          ?.people.filter((i) => i.self)
          .map((i) => i.personName)
          .join()
        v.syllabusItemFullName =
          v.syllabusItemFullName + (v.groupName ? '【' + v.groupName + '】' : '')
        v.syllabusItemName = v.syllabusItemName + (v.groupName ? '【' + v.groupName + '】' : '')
        return v
      })
      searchEvent()
    })
  }
  const add = () => {
    state.isShow = true
  }
  const updateData = async () => {
    getList()
  }

  const canSelect = computed(() => state.selectList.length < 1)

  const selectAllChangeEvent = (val) => {
    if (val.value) {
      state.gridRef.setAllCheckboxRow(true)
      state.selectList = state.gridRef.getCheckboxRecords()
    } else {
      state.gridRef.setAllCheckboxRow(false)
      state.selectList = []
    }
  }

  const resourceTypeId = ref<number>()

  const selectChangeEvent: VxeTableEvents.CheckboxChange = ({ records }: any) => {
    state.selectList = records
    resourceTypeId.value =
      props.functionType !== 'teacherBinding' && records.length > 0
        ? state.selectList[0]?.facilityResourceId
        : undefined
    state.checkAll =
      state.selectList.length > 0 ? state.selectList.length == tableData.value.length : false
  }
  const rangeEvent = debounce(selectChangeEvent, 200)
  const checkboxRange = (data) => {
    rangeEvent(data)
  }

  // 搜索
  const searchKey = ref<string>(),
    list = ref<any[]>([])
  const searchEvent = () => {
    const filterName = XEUtils.toValueString(searchKey.value).trim().toLowerCase()
    if (filterName) {
      const filterRE = new RegExp(filterName, 'gi')
      const searchProps = [
        'syllabusItemFullName',
        'syllabusItemName',
        'teacherName',
        'facilityName',
      ]
      const rest = state.gridOptions.dataList.filter((item) =>
        searchProps.some(
          (key) => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1,
        ),
      )
      list.value = rest.map((row) => {
        const item = Object.assign({}, row)
        searchProps.forEach((key) => {
          item[key] = XEUtils.toValueString(item[key]).replace(
            filterRE,
            (match) => `<span class="keyword-lighten">${match}</span>`,
          )
        })
        return item
      })
    } else {
      list.value = state.gridOptions.dataList
    }
    selectList.value = []
    state.checkAll =
      state.selectList.length > 0 ? state.selectList.length == tableData.value.length : false
  }

  const cptResourceList = computed(() => {
    if (props.functionType == 'teacherBinding') {
      return allResources.value.filter((v) => v.resourceType == 'TEACHER')
    } else {
      return allResources.value.filter((v) => v.resourceType == 'FACILITIES')
    }
  })
  const resourcesType = ref(),
    needResource = ref<boolean>(undefined)

  const tableData = computed(() => {
    if (needResource.value != undefined) {
      if (needResource.value) {
        return list.value.filter(
          (v) =>
            v[
              props.functionType == 'teacherBinding' ? 'teacherResourceId' : 'facilityResourceId'
            ] == resourcesType.value &&
            v[props.functionType == 'teacherBinding' ? 'needTeacher' : 'needResource'],
        )
      } else {
        const resourcesId =
          props.functionType == 'teacherBinding' ? 'teacherResourceId' : 'facilityResourceId'
        const needResources =
          props.functionType == 'teacherBinding' ? 'needTeacher' : 'needResource'
        return list.value.filter((v) =>
          v[resourcesId] && resourcesType.value
            ? (v[resourcesId] == resourcesType.value || !v[resourcesId]) &&
              v[needResources] == needResource.value
            : v[needResources] == needResource.value,
        )
      }
    } else {
      return !resourcesType.value
        ? list.value
        : list.value.filter(
            (v) =>
              v[
                props.functionType == 'teacherBinding' ? 'teacherResourceId' : 'facilityResourceId'
              ] == resourcesType.value &&
              v[props.functionType == 'teacherBinding' ? 'needTeacher' : 'needResource'],
          )
    }
  })
  const needResourcesChange = (val: boolean) => {
    if (val == true && !resourcesType.value) {
      resourcesType.value = cptResourceList.value[0].id
    }
  }

  const cancellation = () => {
    ElMessageBox.confirm(t('tip.this_operation_will_unbind_data'), t('text.tip'), {
      type: 'warning',
    })
      .then(() => {
        putSchedulesUnbind({
          clearTeacher: props.functionType == 'teacherBinding',
          ids: selectList.value.map((v: any) => v.id),
        }).then(() => {
          ElMessage.success(t('message.unbinding_succeeded'))
          getList()
        })
      })
      .catch((_) => {})
  }

  watch(tableData, (val) => {
    gridRef.value.clearCheckboxRow()
    state.selectList = []
  })

  onMounted(() => {
    getList()
  })
</script>

<style scoped lang="scss">
  :deep(.keyword-lighten) {
    color: #000;
    background-color: #ffff00;
  }
  .header-form {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
</style>
