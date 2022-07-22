<template>
  <el-scroll>
    <vxe-table
      border
      size="medium"
      ref="xTable"
      :loading="loading"
      :data="tableData"
      :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
    >
      <vxe-table-column :title="$t('common.serialNumber')" type="seq" width="60" />
      <vxe-table-column field="type" :title="$t('table.taskType')" min-width="90">
        <template #default="{ row }">
          <span>{{ getTypeName(row.type) }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="responsibilityType"
        :title="$t('table.respPersonType')"
        :edit-render="{}"
        min-width="100"
      >
        <template #default="{ row }">
          <span>{{
            responsibilityType.filter((item) => item.type == row.responsibilityType)[0] &&
            responsibilityType.filter((item) => item.type == row.responsibilityType)[0].name
          }}</span>
        </template>
        <template #edit="{ row }">
          <el-select v-model="row.responsibilityType" size="medium" style="width: 100%">
            <el-option
              v-for="item in responsibilityType"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="responsiblePersons"
        :title="$t('table.taskRespPerson')"
        :edit-render="{}"
        min-width="200"
      >
        <template #default="{ row }">
          <span>{{ row.responsiblePersons.map((ee) => ee.name).join() }}</span>
        </template>
        <template #edit="{ row }">
          <el-select
            v-model="row.responsiblePersonIds"
            multiple
            filterable
            size="medium"
            style="width: 100%"
            v-if="row.responsibilityType == 'SPECIFY_PERSON'"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('table.tableEdit')" width="100" align="center">
        <template #default="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button status="primary" type="text" @click="saveRow(row)">{{
              $t('button.save')
            }}</vxe-button>
          </template>
          <template v-else>
            <vxe-button status="primary" type="text" @click="editRowEvent(row)">{{
              $t('button.edit')
            }}</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </el-scroll>
</template>

<script>
  import {
    teachScheduleSettings,
    getTeachers,
    teachScheduleSettingsPut,
  } from '/@/api/ftm/teacher/education'
  export default {
    data() {
      return {
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        teacherList: [],
        loading: false,
        loadingDialog: false,
        responsibilityType: [
          {
            type: 'SPECIFY_PERSON',
            name: this.$t('table.specifyPerson'),
          },
          {
            type: 'TEACHER',
            name: this.$t('table.teacherAdmin'),
          },
          {
            type: 'TEACHER_ADMIN',
            name: this.$t('table.academicAdministrator'),
          },
          {
            type: 'PLANNER',
            name: this.$t('table.planner'),
          },
        ],
      }
    },
    created() {
      this.getData()
      this.getTeachers()
    },
    methods: {
      getTeachers() {
        getTeachers().then((res) => {
          this.teacherList = res.data.content
        })
      },
      editRowEvent(row) {
        const $table = this.$refs.xTable
        $table.setActiveRow(row)
      },
      saveRow(row) {
        let api = null
        let param = {}
        if (
          row.responsibilityType == 'SPECIFY_PERSON' &&
          (!row.responsiblePersonIds || !row.responsiblePersonIds.length)
        ) {
          this.$message({
            type: 'warning',
            duration: 1500,
            message: this.$t('tip.unfilledAllOptions'),
          })
          return
        }
        param = row
        teachScheduleSettingsPut(param).then((res) => {
          this.$message({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.saveSuccessTip'),
          })
          this.getData()
        })
      },
      getTypeName(val) {
        switch (val) {
          case 'CREATE_CLAZZ':
            return this.$t('table.createClass')
          case 'ADD_STUDENT':
            return this.$t('button.addStudent')
          case 'COMPLETE_INFO':
            return this.$t('table.finishInfo')
          case 'GROUPING':
            return this.$t('table.classGroup')
          case 'CBTA':
            return this.$t('router.flightCBTA') // 电子讲评单
          case 'THEORY_EXAM':
            return this.$t('status.theoryExam')
          case 'THEORY_SCHEDULE':
            return this.$t('router.theorySchedule')
          case 'PUBLISH_CLASS_SCHEDULE':
            return this.$t('table.releaseClassSchedule')
          case 'FLIGHT_EXAM':
            return this.$t('table.flightTest')
          case 'STUDENT_FINAL_EVALUATION':
            return this.$t('table.studentEvaluationForm')
          case 'TRAINING_FILE':
            return this.$t('table.trainingMaterial')
          case 'GRADUATE':
            return this.$t('table.graduateTraining')
            break

          default:
            break
        }
      },
      getData() {
        teachScheduleSettings({
          page: 1,
          size: 1000,
          order: 'asc',
        }).then((res) => {
          if (res.status == 200) {
            let content = res.data.content
            content.forEach((item) => {
              item.responsiblePersonIds = item.responsiblePersons.map((ee) => ee.id) || []
            })
            this.tableData = content
          }
        })
      },
    },
  }
</script>
