<template>
  <div class="outline-container">
    <div class="outlineInfos">
      <span>{{ $t('table.outline') }}: {{ course.version }}</span>
      <span>{{ $t('table.codeOfTrainingCourses') }}: {{ course.code }}</span>
      <span>{{ $t('table.courseTaskName') }}: {{ course.name }}</span>
    </div>

    <div class="tabsContanier outlineBox">
      <div class="tabBox">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            :label="item.name"
            :name="item.id + ''"
            v-for="item in rolesAll"
            :key="item.id"
          />
        </el-tabs>
        <div v-if="activeName != 3">
          <el-button type="primary" @click="add">{{ $t('button.add') }}</el-button>
          <el-button
            type="danger"
            v-if="activeName != 4"
            @click="batchDeletion"
            :disabled="ids.length == 0"
            >{{ $t('button.batchDeletion') }}</el-button
          >
        </div>
      </div>
      <div class="tabTable">
        <template v-for="plane in rolesAll" :key="plane.id">
          <component
            v-if="plane.id == activeName"
            :is="componentName"
            :id="id"
            @selected="getSelected"
            ref="child"
            @getCourse="getCourse"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import checkItems from './components/checkItems.vue'
  import groundTheoryCourse from './components/groundTheoryCourse.vue'
  import simulatorTrain from './components/simulatorTrain.vue'
  import addSyllabusItemsDialog from './components/addSyllabusItemsDialog.vue'
  import { postSyllabusItemsBatchDelete } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    data() {
      return {
        activeName: '1',
        componentName: 'groundTheoryCourse',
        id: undefined,
        syllabusItemsDialog: false,
        rolesAll: [
          {
            id: 1,
            name: this.$t('table.theoreticalTrainingSubjects'),
            component: 'groundTheoryCourse',
          },
          // {id: 4, name: this.$t("table.contentTheoreticalTraining"), component: 'TrainingContent'},
          { id: 2, name: this.$t('table.simulatorTrainCourse'), component: 'simulatorTrain' },
          { id: 3, name: this.$t('table.competencyAssessmentItems'), component: 'checkItems' },
        ],
        ids: [],
        course: {
          version: '',
          code: '',
          name: '',
        },
      }
    },
    components: {
      checkItems,
      groundTheoryCourse,
      simulatorTrain,
      addSyllabusItemsDialog,
    },
    created() {
      this.id = this.$route.query.id
    },
    methods: {
      handleClick(tab, event) {
        let _tab = this.rolesAll[+tab.index]
        this.componentName = _tab.component || this.rolesAll[0].component
        this.activeName = tab.name
        this.ids = []
      },
      add() {
        this.$refs.child[0].showDialog()
      },
      getData() {
        this.$refs.child[0].getSyllabusItems()
      },
      getSelected(val) {
        this.ids = val
      },
      batchDeletion() {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        })
          .then(() => {
            postSyllabusItemsBatchDelete({ ids: this.ids }).then((res) => {
              if (res.status == 200) {
                this.$message.success(this.$t('tip.delsuccessTip'))
                this.getData()
              }
            })
          })
          .catch((_) => {})
      },
      getCourse(val) {
        if (val && val.course) {
          this.course.version = val.version
          this.course.code = val.course.code
          this.course.name = val.course.name
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .outline-container {
    display: flex;
    flex-direction: column;
    .tabsContanier {
      display: flex;
      flex: 1;
      flex-direction: column;
      .tabTable {
        position: relative;
        width: 100%;
        flex: 1;
        :deep(section) {
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .outlineInfos {
    font-size: 14px;
    width: 100%;
    padding-bottom: 17px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 23px;
    span {
      display: inline-block;
      margin-right: 170px;
    }
    span:nth-last-child(1) {
      margin-right: 0;
    }
  }
  .tabBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
</style>
<style>
  .outlineBox .el-tabs__header {
    padding-left: 0 !important;
  }
</style>
