<template>
  <div>
    <vxe-grid v-bind="gridOptions" :data="data" ref="gridRef">
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add">
          {{ $t('text.choice') }}
        </el-button>
      </template>
      <template #elInput="{ row, column }">
        <el-input
          type="number"
          min="0"
          v-model="row[column.property]"
          :placeholder="$t('text.please_enter')"
        />
      </template>
      <template #select="{ row, column }">
        <vxe-checkbox-group v-model="row[column.property]">
          <vxe-checkbox label="BREAKFAST" :content="$t('text.breakfast')" />
          <vxe-checkbox label="LUNCH" :content="$t('text.lunch')" />
          <vxe-checkbox label="DINNER" :content="$t('text.dinner')" />
        </vxe-checkbox-group>
      </template>
      <template #delete="{ row }">
        <vxe-button @click="deleteRow(row)" type="text" status="primary">
          <i class="el-icon-delete" />
        </vxe-button>
      </template>

      <template #pager />
    </vxe-grid>

    <AddProject v-model:isShow="isShow" :oldData="data" @updateData="updateData" />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, toRefs, computed, inject, Ref, nextTick, watch } from 'vue'
  import AddProject from './addProject.vue'
  import { useRoute } from 'vue-router'
  import { ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'project',
    components: {
      VxeTable,
      AddProject,
    },
    props: {
      oldData: {
        default: () => [],
        type: Array,
      },
    },
    emits: ['update:oldData'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const route = useRoute()
      const isDetail: { value: boolean } = inject('isDetail')

      const airplaneTypesAllList = inject<Ref>('airplaneTypesAllList')

      let data = computed<any[]>({
        get() {
          return props.oldData
        },
        set(val) {
          emit('update:oldData', val)
        },
      })
      const formatSelect = ({ cellValue }) => {
        const arr = [
          {
            id: 'BREAKFAST',
            name: t('text.breakfast'),
          },
          {
            id: 'LUNCH',
            name: t('text.lunch'),
          },
          {
            id: 'DINNER',
            name: t('text.dinner'),
          },
        ]
        return arr.filter((c) => cellValue.some((v) => v == c.id)).map((v) => v.name)
      }
      const state = reactive({
        gridOptions: {
          columns: [
            // { type: "checkbox", width: 50 },
            { type: 'seq', width: 60, title: t('text.seq') },
            {
              field: 'code',
              title: t('text.course_project_code'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'name',
              title: t('text.course_project_name'),
              // sortable: true,
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'airplaneType',
              title: t('text.model'),
              // width:300
              minWidth: 100,
              // cellRender: !isDetail.value
              //     ? {
              //           name: "$select",
              //           options: airplaneTypesAllList.value,
              //           props: { placeholder: t('text.please_select'),clearable :true },
              //       }
              //     : undefined,
            },
            {
              // sortable: true,
              field: 'price',
              title: t('text.unit_price_of_training'),
              minWidth: 100,
              // slots:{
              //     default:"elInput"
              // }
              cellRender: !isDetail.value
                ? {
                    name: '$input',
                    props: {
                      type: 'float',
                      digits: 2,
                      min: 0,
                      step: 1,
                      placeholder: t('text.please_enter'),
                    },
                  }
                : undefined,
            },

            {
              field: 'needVehicle',
              title: t('text.vehicle_demand'),
              minWidth: 100,
              // slots:{
              //     default:"select"
              // }
              cellRender: !isDetail.value
                ? {
                    name: '$select',
                    options: [
                      { label: t('text.yes'), value: true },
                      { label: t('text.no'), value: false },
                    ],
                    props: {
                      placeholder: t('text.please_select'),
                    },
                  }
                : undefined,
              formatter: 'formatBool',
            },
            {
              field: 'needDinner',
              title: t('text.meal_demand'),
              minWidth: 200,
              slots: !isDetail.value
                ? {
                    default: 'select',
                  }
                : undefined,

              formatter: formatSelect,
            },
            {
              field: 'needAccommodation',
              title: t('text.accommodation_demand'),
              minWidth: 100,
              // slots: {
              //     default: "select",
              // },
              cellRender: !isDetail.value
                ? {
                    name: '$select',
                    options: [
                      { label: t('text.yes'), value: true },
                      { label: t('text.no'), value: false },
                    ],
                    props: {
                      placeholder: t('text.please_select'),
                    },
                  }
                : undefined,
              formatter: 'formatBool',
            },
            route.params.type !== 'detail' && {
              title: t('text.operation'),
              width: 50,
              slots: { default: 'delete' },
              field: 'operationTypes',
              // fixed:'right'
            },
          ],
          editRules: {
            price: [{ required: true, message: t('text.please_enter') }],
          },
          // data: [],

          toolbarConfig: !isDetail.value
            ? {
                // custom: true,
                size: 'medium',
                perfect: true,
                slots: {
                  tools: 'toolbar_tools',
                },
              }
            : undefined,
        } as VxeGridProps,
        isShow: false,
        gridRef: undefined,
      })
      const methods = reactive({
        add() {
          state.isShow = true
        },
        updateData(val) {
          let arr = JSON.parse(JSON.stringify(data.value))

          data.value = [
            ...arr,
            ...val.map((v) => {
              v.price = 0.0
              v.needVehicle = false
              v.needDinner = []
              v.needAccommodation = false
              v.courseId = v.id
              delete v.id
              return v
            }),
          ]
        },
        deleteRow(row) {
          data.value.splice(
            data.value.findIndex((v) => v.courseId == row.courseId),
            1,
          )
          data.value = [...data.value]
        },
      })
      watch(airplaneTypesAllList, () => {
        const $grid = state.gridRef

        if ($grid) {
          nextTick(() => {
            const column = $grid.getColumnByField('airplaneType')
            if (column && column.cellRender) {
              column.cellRender.options = airplaneTypesAllList.value.map((v) => ({
                label: v,
                value: v,
              }))
            }
          })
        }
      })
      return {
        ...toRefs(state),
        ...toRefs(methods),
        data,
        airplaneTypesAllList,
      }
    },
  })
</script>

<style scoped></style>
