<template>
  <div>
    <div style="display: flex; justify-content: flex-end">
      <el-form-item>
        <el-button size="medium" @click="add" type="primary">{{ $t('button.add') }}</el-button>
      </el-form-item>
    </div>
    <vxe-table
      border
      size="medium"
      ref="xTable"
      :loading="loading"
      :data="tableData"
      :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
    >
      <vxe-table-column :title="$t('common.serialNumber')" field="seq" :edit-render="{}" width="90">
        <template #default="{ row }">
          <span>{{ row.seq }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-input v-model="row.seq" type="number" />
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="name"
        :title="$t('table.trainingResults')"
        :edit-render="{}"
        minWidth="120"
      >
        <template #edit="{ row }">
          <vxe-input v-model="row.name" type="text" />
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="attribute"
        :title="$t('table.attribute')"
        :edit-render="{}"
        minWidth="120"
      >
        <template #default="{ row }">
          <span>{{
            attributeList.filter((item) => item.value == row.attribute)[0] &&
            attributeList.filter((item) => item.value == row.attribute)[0].label
          }}</span>
        </template>
        <template #edit="{ row, $rowIndex }">
          <vxe-select
            v-model="row.attribute"
            type="text"
            transfer
            @change="changeEvent(row.attribute, $rowIndex)"
          >
            <vxe-option
              v-for="item in attributeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </vxe-select>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="result"
        :title="$t('table.plannerAuditOptions')"
        :edit-render="{}"
        minWidth="140"
      >
        <template #default="{ row }">
          <span v-if="row.attribute == 'PASS'">{{ $t('status.noCheck') }}</span>
          <el-radio-group v-model="row.result" v-else disabled>
            <el-radio label="ABORT">{{ $t('status.abortTrain') }}</el-radio>
            <el-radio label="ADD_ONE">{{ $t('status.addOne') }}</el-radio>
          </el-radio-group>
        </template>
        <template #edit="{ row }">
          <span v-if="row.attribute == 'PASS'">{{ $t('status.noCheck') }}</span>
          <el-radio-group v-model="row.result" v-else>
            <el-radio label="ABORT">{{ $t('status.abortTrain') }}</el-radio>
            <el-radio label="ADD_ONE">{{ $t('status.addOne') }}</el-radio>
          </el-radio-group>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="applyTypes"
        :title="$t('table.applyTypes')"
        :edit-render="{}"
        minWidth="140"
      >
        <template #default="{ row }">
          <span>{{
            applyTypesList
              .filter((item) => row.applyTypes && row.applyTypes.includes(item.value))
              .map((item) => item.label)
              .join(',')
          }}</span>
        </template>
        <template #edit="{ row }">
          <vxe-select v-model="row.applyTypes" type="text" transfer multiple>
            <vxe-option
              v-for="item in applyTypesList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </vxe-select>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('table.tableEdit')" width="150" align="center">
        <template #default="{ row, $rowIndex }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button status="primary" type="text" @click="saveRow(row)">{{
              $t('button.save')
            }}</vxe-button>
            <vxe-button status="danger" type="text" @click="deleteRow(row, $rowIndex)">{{
              $t('button.delete')
            }}</vxe-button>
          </template>
          <template v-else>
            <vxe-button status="primary" type="text" @click="editRowEvent(row)">{{
              $t('button.edit')
            }}</vxe-button>
            <vxe-button status="danger" type="text" @click="deleteRow(row, $rowIndex)">{{
              $t('button.delete')
            }}</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
  import XEUtils from 'xe-utils'
  import {
    trainingResults,
    trainingResultsPost,
    trainingResultsPut,
    trainingResultsDel,
  } from '/@/api/ftm/teacher/teachingCenter'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
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
        attributeList: [
          { label: this.$t('button.pass'), value: 'PASS' },
          { label: this.$t('button.noPass'), value: 'NOPASS' },
        ],
        applyTypesList: [
          {
            value: 'RECOMMEND_EXAM',
            label: this.$t('status.recommendTest'),
          },
          {
            value: 'TRAINING',
            label: this.$t('status.train'),
          },
        ],
        loading: false,
        pagination: {
          page: 1,
          size: 100,
          total: 1,
        },
        loadingDialog: false,
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    created() {
      this.getData()
    },
    methods: {
      add() {
        this.tableData.push({
          result: '',
          attribute: '',
          applyTypes: [],
        })
        this.$refs.xTable.loadData(this.tableData)
      },
      changeEvent(val, ind) {
        let index = ind
        if (this.tableData[index].attribute == 'PASS') {
          this.tableData[index].result = 'PASS'
        } else {
          this.tableData[index].result = ''
        }
      },
      editRowEvent(row) {
        const $table = this.$refs.xTable
        $table.setActiveRow(row)
      },
      deleteRow(row, index) {
        if (!row.id) {
          this.tableData.splice(index, 1)
          return
        }
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
          type: 'error',
        })
          .then(() => {
            trainingResultsDel({ id: row.id })
              .then((res) => {
                this.$message({
                  type: 'success',
                  duration: 1500,
                  message: this.$t('tip.delsuccessTip'),
                })
                this.getData()
              })
              .catch(() => {})
          })
          .catch(() => {})
      },
      saveRow(row) {
        let api = null
        let param = {}
        if (!row.name || !row.attribute || !row.result) {
          this.$message({
            type: 'warning',
            duration: 1500,
            message: this.$t('tip.unfilledAllOptions'),
          })
          return
        }
        if (!row.id) {
          // 新增
          api = trainingResultsPost
          param = {
            dataOwner: 'ACC',
            name: row.name,
            result: row.result,
            applyTypes: row.applyTypes,
            seq: row.seq,
          }
        } else {
          // 编辑
          api = trainingResultsPut
          param = row
        }
        api(param).then((res) => {
          this.$message({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.saveSuccessTip'),
          })
          this.getData()
        })
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd')
      },
      getData() {
        trainingResults({
          page: 1,
          size: 1000,
        }).then((res) => {
          if (res.status == 200) {
            let content = res.data.content
            content.forEach((item) => {
              item.attribute = item.result == 'PASS' ? 'PASS' : 'NOPASS'
            })
            this.tableData = content
            // this.pagination.total = res.data.totalElements;
          }
        })
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
    },
  }
</script>
