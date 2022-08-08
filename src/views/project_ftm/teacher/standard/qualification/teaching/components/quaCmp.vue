<template>
  <VxeTable
    :data="tableData"
    :columns="columns"
    :loading="tableLoading"
    :buttons="tableButtons"
    v-model:form="form"
    @handlePageChange="handleCurrentChange"
  >
    <template #form v-if="!allAuth">
      <el-form :model="form" inline size="medium">
        <el-form-item :label="$t('table.teacherType')">
          <el-select
            v-model="form.builtinRole"
            :placeholder="$t('common.all')"
            clearable
            @change="teacherTypeChange"
          >
            <el-option
              :label="item.name"
              :value="item.key"
              v-for="item in teacherList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <template #licence="{ row }">
      <div class="licence-list">
        <div
          class="card_con"
          v-for="(item, index) in row.qualifications"
          :key="index"
          @click="cardClick(item, row)"
        >
          <el-card class="box-card" :class="{ isred: getBac(item) }" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="title_con">{{ item.name }}</span>
              <el-icon
                class="icon-close"
                v-show="row.status == 'edit' && row.isEdit"
                style="float: right; padding: 3px 0"
                @click.stop="deleteClick(item)"
                :title="$t('button.delete')"
                ><Close
              /></el-icon>
            </div>
            <div class="text item">{{ formatDate(item) }}</div>
          </el-card>
        </div>
      </div>
    </template>
  </VxeTable>

  <LicenceDialog
    v-model="licenceDialog"
    v-if="licenceDialog"
    :title="$t('table.newLicense')"
    :rowData="rowData"
    :detailId="detailId"
    @updateData="updateData"
  />
  <LicenceDialog
    v-if="licenceEditDialog"
    v-model="licenceEditDialog"
    :title="$t('table.editLicense')"
    :rowData="rowData"
    :detailId="detailId"
    @updateData="updateData"
  />
  <FileView v-model="fileView" v-if="fileView" :rowData="rowData" :detailId="detailId" />
</template>
<script>
  import VxeTable from '/@/components/Table/index.vue'
  import FileView from './fileView.vue'
  import LicenceDialog from './licenceDialog.vue'
  import moment from 'moment'
  import {
    getEmployeeQualifications,
    deleteEmployeeQualifications,
  } from '/@/api/ftm/teacher/education'
  import to from 'await-to-js'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    name: 'QuaCmp',
    components: {
      VxeTable,
      LicenceDialog,
      FileView,
    },
    props: {
      type: String,
      allAuth: [String, Boolean],
    },
    data() {
      return {
        menuName: 'LICENSING_MANAGEMENT',
        form: {
          page: 1,
          size: 10,
          builtinRole: undefined,
        },
        total: 0,
        teacherList: [
          {
            key: 'FLIGHT_TEACHER',
            name: this.$t('table.flightInstructor'),
          },
          {
            key: 'THEORY_TEACHER',
            name: this.$t('table.theoryTeacher'),
          },
        ],
        columns: [
          { type: 'seq', width: 50, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.name'), width: 150 },
          {
            field: 'qualifications',
            title: this.$t('table.certificateDetails'),
            align: 'left',
            slots: { default: 'licence' },
          },
          {
            width: 150,
            field: 'operationTypes',
            title: this.$t('table.tableEdit'),
            showOverflow: true,
            slots: { default: 'operate' },
          },
        ],
        tableData: [],
        tableLoading: false,
        licenceDialog: false,
        licenceEditDialog: false,
        rowData: {},
        detailId: undefined,
        fileView: false,
      }
    },
    computed: {
      permissionName() {
        return this.allAuth ? '' : this.menuName
      },
    },
    created() {
      this.getEmployeeQualifications()
    },
    // activated() {
    //     this.getEmployeeQualifications();
    //     this.$refs.xTable.resetHeight()
    // },
    methods: {
      formatDate(item) {
        return (
          moment(item.validityStartTime).format('YYYY-MM-DD') +
          '—' +
          moment(item.validityEndTime).format('YYYY-MM-DD')
        )
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getEmployeeQualifications()
      },
      teacherTypeChange(val) {
        this.getEmployeeQualifications()
      },
      getStatus(item) {
        if (item.disabled) {
          return
        }
        if (item.status) {
          return item.status
        } else {
          return 'primary'
        }
      },
      btnClick(row, type) {
        row.status = type
        this.rowData = JSON.parse(JSON.stringify(row))
        if (type == 'add') {
          this.licenceDialog = true
        } else {
          row.isEdit = !row.isEdit
        }
      },
      async getEmployeeQualifications() {
        this.tableLoading = true
        let [err, res] = await to(getEmployeeQualifications(this.form))
        this.tableLoading = false
        if (!err) {
          this.tableData = res.data.content.map((v) => {
            v.status = 'detail'
            return v
          })
          this.total = res.data.totalElements
        }
      },
      updateData() {
        this.getEmployeeQualifications()
      },
      cardClick(item, row) {
        this.rowData = row
        this.detailId = item.id
        if (row.isEdit) {
          // 编辑
          row.status = 'edit'
          this.licenceEditDialog = true
        } else {
          // 查看
          row.status = 'detail'
          if (!item.fileUUID) {
            this.$message.closeAll()
            this.$message.error(this.$t('tip.licenseLackUploadAttchment'))
          } else {
            this.fileView = true
          }
        }
      },
      deleteClick(item) {
        this.$confirm(
          this.$t('tip.thisOperationWillPermanentlyDeleteTheData'),
          this.$t('tip.tip'),
          {
            confirmButtonText: this.$t('button.confirm'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning',
          },
        )
          .then((res) => {
            deleteEmployeeQualifications({ id: item.id }).then((res) => {
              if (res.status == 200) {
                this.form.page = this.$judgePage(this.total, this.form)
                this.$message.success(this.$t('tip.delsuccessTip'))
                this.getEmployeeQualifications()
              }
            })
          })
          .catch((_) => {})
      },
      getBac(item) {
        return (
          moment(item.validityEndTime).add(-item.timeOutOfNotify, 'day').valueOf() <
          moment().startOf().valueOf()
        )
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.add'),
            visible: this.permissionName
              ? userStore.ContainsPermissions(this.permissionName + ':ADD')
              : true,
            event: () => {
              this.btnClick(row, 'add')
            },
          },
          {
            name: row.isEdit ? this.$t('button.complete') : this.$t('button.edit'),
            visible: this.permissionName
              ? userStore.ContainsPermissions(this.permissionName + ':EDIT')
              : true,
            event: () => {
              this.btnClick(row, 'edit')
            },
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
  .licence-list {
    text-align: left;
  }
  .card_con {
    display: inline-block;
  }
  :deep(.box-card) {
    width: 187px;
    margin-right: 10px;
    .title_con {
      display: inline-block;
      max-width: 190px;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
      color: #333;
    }
    .item {
      color: #bfbfbf;
      font-size: 12px;
      height: 28px;
      line-height: 28px;
    }
    .clearfix {
      height: 26px;
      line-height: 26px;
    }
  }
  :deep(.el-card__header),
  :deep(.el-card__body) {
    padding: 5px;
    white-space: normal;
  }
  :deep(.isred) {
    background-color: #e27575 !important;
    border: none;
    .title_con,
    .item,
    .icon-close {
      color: #fff !important;
    }
  }
  .componentsHeader {
    margin-bottom: 10px;
  }
</style>
