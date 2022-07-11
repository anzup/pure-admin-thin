<template>
  <div>
    <el-dialog
      :title="$t('text.create_template')"
      v-model="dialogVisible"
      width="1000px"
      @close="close"
      @open="open"
      destroy-on-close
    >
      <!-- custom-class="custom_dialog" -->
      <el-form :model="form" :rules="rules" ref="formRef" class="demo-form" label-width="80px">
        <el-form-item style="width: 400px" :label="$t('text.template_name')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
        </el-form-item>
        <el-form-item style="width: 400px" :label="$t('text.course_classification')">
          <el-select
            v-model="type"
            :placeholder="$t('text.please_select')"
            @change="selectChange"
            :disabled="form.templateItems.length > 0 || itemData?.templateItems.length > 0"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="templateItems"
          :rules="[
            {
              required: !itemData,
              type: 'array',
              message: $t('text.please_select'),
              trigger: 'change',
            },
          ]"
          label-width="0"
        >
          <vxe-grid
            v-bind="(gridOptions as any)"
            @checkbox-change="checkbox"
            @checkbox-all="checkbox"
            ref="gridRef"
          >
            <!-- <template #checkAll>
                            <vxe-checkbox
                                :disabled="!itemData ? (form.templateItems.length == 0 || !currentFacilitiesId) : !currentFacilitiesId"
                                v-model="checkAll"
                                @change="selectAllChangeEvent"
                                :indeterminate="form.templateItems.length > 0"
                            ></vxe-checkbox>
                        </template> -->
          </vxe-grid>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('message.hscancel') }}
          </el-button>
          <el-button type="primary" @click="confirm">
            {{ $t('message.hsdefine') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, toRefs } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { getSyllabusItemsList } from '/@/api/opm/standard'
  import { useRoute } from 'vue-router'
  import { ElForm } from 'element-plus'
  type ElFormInstance = InstanceType<typeof ElForm>

  type SyllabusType = 'FLIGHT_PRACTICE' | 'GROUND_THEORY'
  interface TemplateItems {
    id: number
    period: number
    sortNumber: number
    startTime: string
    syllabusItemId: number
    syllabusItemName: string
    type: SyllabusType
    [_: string]: any
  }
  interface SyllabusTemplate {
    enabled?: boolean
    id?: number
    name: string
    needGroup?: boolean
    type?: SyllabusType
    syllabusId: number
    templateItems: Array<TemplateItems>
  }
  const props = defineProps({
    modelValue: Boolean,
    itemData: Object as PropType<SyllabusTemplate>,
  })
  const emit = defineEmits(['updateData', 'update:modelValue'])

  const { t } = useI18n()

  const type = ref(1)
  const typeList = [
    {
      id: 1,
      name: t('text.theoretical_training_not_grouped'),
    },
    {
      id: 2,
      name: t('text.theoretical_training_group'),
    },
    {
      id: 3,
      name: t('text.flight_training'),
    },
  ]

  const dialogVisible = computed({
    get: (): boolean => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })
  const route = useRoute()
  const state = reactive({
    form: {
      name: undefined,
      templateItems: [],
      type: 'GROUND_THEORY',
      needGroup: false,
      syllabusId: +route.params.id,
    } as Syllabus.SyllabusTemplate,
    rules: {
      name: [
        {
          required: true,
          message: t('text.please_enter'),
          trigger: 'change',
        },
      ],
      templateItems: [
        {
          required: true,
          type: 'array',
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
    } as ElFormInstance['rules'],
  })
  const { form, rules } = toRefs(state)

  const gridOptions = reactive<VxeTableAllProps>({
    columns: [
      {
        type: 'checkbox',
        width: 50,
        // slots: {
        //     header: "checkAll"
        // }
      },
      { type: 'seq', width: 60, title: t('text.seq') },
      {
        field: 'name',
        title: t('text.training_content'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'shortName',
        title: t('text.content_abbreviation'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'period',
        title: t('text.teaching_hours'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'facilities.name',
        title: t('text.teaching_facilities'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'teacher.name',
        title: t('text.instructor'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'needGroup',
        title: t('text.class_mode'),
        // sortable: true,
        minWidth: 100,
        formatter: ({ cellValue }) => (cellValue ? t('text.grouping') : t('text.collective')),
      },
    ],
    height: 400,
    // checkboxConfig: {
    //     range: true
    // },
    data: [],
    loading: false,
    // checkboxConfig: {
    //     range: false,
    //     checkMethod: ({ row }) => {
    //         return currentFacilitiesId.value ? row.facilityId == currentFacilitiesId.value : true
    //     }
    // }
  })

  const selectChange = (val) => {
    if (val == 3) {
      form.value.type = 'FLIGHT_PRACTICE'
      form.value.needGroup = true
    } else {
      form.value.type = 'GROUND_THEORY'
      if (val == 1) {
        form.value.needGroup = false
      } else {
        form.value.needGroup = true
      }
    }
    getList()
  }

  const getList = () => {
    getSyllabusItemsList({
      page: 1,
      size: 999,
      syllabusId: route.params.id,
      type: type.value == 3 ? 'FLIGHT_PRACTICE' : 'GROUND_THEORY',
      level: type.value == 3 ? 0 : 1,
      sort: 'seqNo',
      order: 'asc',
    }).then((res) => {
      // if (!props.itemData) {

      gridOptions.data = res.data.content
        .filter((v) =>
          props.itemData
            ? form.value.needGroup == v.needGroup &&
              !props.itemData.templateItems.some((i) => i.syllabusItemId == v.id)
            : form.value.needGroup == v.needGroup,
        )
        .map((v) => {
          v.facilityId = v?.facilities?.id
          v.syllabusItemName = v.name
          v.syllabusItemId = v.id
          v.startTime = undefined
          v.days = undefined
          return v
        })
      // } else {
      //     gridOptions.data = res.data.content.filter(v => type.value == 1 ? !v.needGroup && !props.currentItemIds.includes(v.id) : type.value == 2 && !props.currentItemIds.includes(v.id) ? v.needGroup : !props.currentItemIds.includes(v.id))

      // }
    })
  }

  const checkbox = ({ records, row }) => {
    // if (!props.itemData && records.length < 1) {
    //     currentFacilitiesId.value = undefined
    // }
    // if (!currentFacilitiesId.value && row.facilityId && records.length > 0) currentFacilitiesId.value = row.facilityId
    form.value.templateItems = records
  }

  const checkAll = ref(false),
    gridRef = ref(undefined)
  // const selectAllChangeEvent = val => {
  //     if (val.value) {
  //         gridRef.value.setAllCheckboxRow(true);
  //         form.value.templateItems = gridRef.value.getCheckboxRecords();
  //     } else {
  //         if (!props.itemData) {
  //             currentFacilitiesId.value = undefined
  //         }
  //         gridRef.value.setAllCheckboxRow(false);
  //         form.value.templateItems = [];
  //     }
  // };

  // 当前的确认的设施类型
  const currentFacilitiesId = ref<number>(undefined)

  const open = () => {
    if (props.itemData) {
      type.value =
        props.itemData.type == 'FLIGHT_PRACTICE'
          ? 3
          : props.itemData.type == 'GROUND_THEORY' && props.itemData.needGroup
          ? 2
          : 1
      // currentFacilitiesId.value = props.itemData.templateItems.find(v => !!v.facilityId)?.facilityId
      form.value.name = props.itemData.name
      return selectChange(type.value)
    } else {
      type.value = 1
      selectChange(1)
    }
  }

  const close = () => {
    form.value = {
      name: undefined,
      templateItems: [],
      type: 'GROUND_THEORY',
      needGroup: false,
      syllabusId: +route.params.id,
    }
    gridOptions.data = []
    // currentFacilitiesId.value = undefined
    // formRef.value.resetFields()
  }
  const formRef = ref<ElFormInstance>()
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        emit('updateData', {
          type: !props.itemData ? 'add' : 'edit',
          data: JSON.parse(JSON.stringify(state.form)),
        })
        dialogVisible.value = false
      } else {
        return false
      }
    })
  }
</script>

<style scoped></style>
