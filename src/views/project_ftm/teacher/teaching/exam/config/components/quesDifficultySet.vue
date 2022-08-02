<template>
  <el-scrollbar>
    <vxe-table
      border
      size="medium"
      class="mytable-style"
      header-cell-class-name="headerCellClassName"
      row-class-name="rowClassName"
      ref="xTable"
      :loading="loading"
      :data="tableData"
      :edit-config="{ trigger: 'manual', mode: 'row' }"
    >
      <vxe-table-column :title="$t('common.serialNumber')" type="seq" width="60" />
      <vxe-table-column field="difficulty" :title="$t('table.quesDifficulty')" min-width="120">
        <template #default="{ row }">
          <span>{{ formatDifficulty(row.difficulty) }}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="minStatsCount" :title="$t('table.minimumTimesNum')" min-width="120">
        <template #default="{ row }">
          <span v-if="!edit">{{ row.minStatsCount }}</span>
          <vxe-input v-else v-model="row.minStatsCount" type="text" />
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="objCorrectRate"
        :title="$t('table.objectiveAccuracy')"
        min-width="150"
      >
        <template #default="{ row, $rowIndex }">
          <span v-if="!edit">
            <span v-if="$rowIndex == 0">0 - {{ row.objCorrectRate }}</span>
            <span v-if="$rowIndex == 1"
              >{{ tableData[$rowIndex - 1].objCorrectRate }} - {{ row.objCorrectRate }}</span
            >
            <span v-if="$rowIndex == 2"
              >{{ tableData[$rowIndex - 1].objCorrectRate }} -
              {{ tableData[$rowIndex + 1].objCorrectRate }}</span
            >
            <span v-if="$rowIndex == 3"
              >{{ row.objCorrectRate }} - {{ tableData[$rowIndex + 1].objCorrectRate }}</span
            >
            <span v-if="$rowIndex == 4">{{ row.objCorrectRate }} - 1</span>
          </span>
          <div v-else>
            <div v-if="$rowIndex == 0">
              <vxe-input value="0" disabled type="number" class="inline-input" /> -
              <vxe-input v-model="row.objCorrectRate" type="number" class="inline-input" />
            </div>
            <div v-if="$rowIndex == 1">
              <vxe-input
                :value="tableData[$rowIndex - 1].objCorrectRate"
                disabled
                type="number"
                class="inline-input"
              />
              -
              <vxe-input v-model="row.objCorrectRate" type="number" class="inline-input" />
            </div>
            <div v-if="$rowIndex == 2">
              <vxe-input
                :value="tableData[$rowIndex - 1].objCorrectRate"
                disabled
                type="number"
                class="inline-input"
              />
              -
              <vxe-input
                :value="tableData[$rowIndex + 1].objCorrectRate"
                disabled
                type="number"
                class="inline-input"
              />
            </div>
            <div v-if="$rowIndex == 3">
              <vxe-input v-model="row.objCorrectRate" type="number" class="inline-input" />
              -
              <vxe-input
                :value="tableData[$rowIndex + 1].objCorrectRate"
                disabled
                type="number"
                class="inline-input"
              />
            </div>
            <div v-if="$rowIndex == 4">
              <vxe-input v-model="row.objCorrectRate" type="number" class="inline-input" />
              - <vxe-input value="1" disabled type="number" class="inline-input" />
            </div>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="subScoreRate"
        :title="$t('table.subjectiveScorRate')"
        min-width="150"
      >
        <template #default="{ row, $rowIndex }">
          <span v-if="!edit">
            <span v-if="$rowIndex == 0">0 - {{ row.subScoreRate }}</span>
            <span v-if="$rowIndex == 1"
              >{{ tableData[$rowIndex - 1].subScoreRate }} - {{ row.subScoreRate }}</span
            >
            <span v-if="$rowIndex == 2"
              >{{ tableData[$rowIndex - 1].subScoreRate }} -
              {{ tableData[$rowIndex + 1].subScoreRate }}</span
            >
            <span v-if="$rowIndex == 3"
              >{{ row.subScoreRate }} - {{ tableData[$rowIndex + 1].subScoreRate }}</span
            >
            <span v-if="$rowIndex == 4">{{ row.subScoreRate }} - 1</span>
          </span>
          <div v-else>
            <div v-if="$rowIndex == 0">
              <vxe-input value="0" disabled type="number" class="inline-input" /> -
              <vxe-input v-model="row.subScoreRate" type="number" class="inline-input" />
            </div>
            <div v-if="$rowIndex == 1">
              <vxe-input
                :value="tableData[$rowIndex - 1].subScoreRate"
                disabled
                type="number"
                class="inline-input"
              />
              -
              <vxe-input v-model="row.subScoreRate" type="number" class="inline-input" />
            </div>
            <div v-if="$rowIndex == 2">
              <vxe-input
                :value="tableData[$rowIndex - 1].subScoreRate"
                disabled
                type="number"
                class="inline-input"
              />
              -
              <vxe-input
                :value="tableData[$rowIndex + 1].subScoreRate"
                disabled
                type="number"
                class="inline-input"
              />
            </div>
            <div v-if="$rowIndex == 3">
              <vxe-input v-model="row.subScoreRate" type="number" class="inline-input" /> -
              <vxe-input
                :value="tableData[$rowIndex + 1].subScoreRate"
                disabled
                type="number"
                class="inline-input"
              />
            </div>
            <div v-if="$rowIndex == 4">
              <vxe-input v-model="row.subScoreRate" type="number" class="inline-input" /> -
              <vxe-input value="1" disabled type="number" class="inline-input" />
            </div>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div style="display: flex; flex-direction: row-reverse; margin-top: 16px">
      <el-button size="medium" @click="edit = true" type="primary" v-if="!edit">{{
        $t('button.edit')
      }}</el-button>
      <el-button size="medium" @click="save" type="primary" v-else>{{
        $t('button.save')
      }}</el-button>
    </div>
  </el-scrollbar>
</template>

<script>
  import { questionDifficultiesGet, questionDifficultiesPut } from '/@/api/ftm/teacher/examCenter'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        loading: false,
        form: {
          page: 1,
          size: 10,
          sort: 'startDate',
          order: 'desc',
          year: undefined,
          examTypeId: undefined,
          createdBy: undefined,
        },
        tableData: [],
        edit: false,
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    created() {},
    mounted() {
      this.questionDifficultiesGet()
    },
    methods: {
      save() {
        this.edit = false
        this.tableData[2].objCorrectRate = (
          (Number(this.tableData[1].objCorrectRate) + Number(this.tableData[3].objCorrectRate)) /
          2
        ).toFixed(4)
        this.tableData[2].subScoreRate = (
          (Number(this.tableData[1].subScoreRate) + Number(this.tableData[3].subScoreRate)) /
          2
        ).toFixed(4)
        questionDifficultiesPut({
          settings: this.tableData,
        }).then((res) => {
          if (res.status == 200) {
            this.$message.success('成功')
          }
        })
      },
      questionDifficultiesGet() {
        questionDifficultiesGet().then((res) => {
          this.tableData = res.data.settings
        })
      },
      formatDifficulty(cellValue) {
        // EASIEST, EASY, HARD, HARDEST, NORMAL
        switch (cellValue) {
          case 'EASIEST':
            return this.$t('status.veryEasy')
            break
          case 'EASY':
            return this.$t('status.simple')
            break
          case 'HARD':
            return this.$t('status.hard')
            break
          case 'HARDEST':
            return this.$t('status.hardest')
            break
          case 'NORMAL':
            return this.$t('status.normal')
            break
          default:
            return this.$t('status.normal')
            break
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .date-range {
    word-break: keep-all;
  }
  .inline-input {
    display: inline-block;
    width: calc(50% - 8px);
  }
</style>
