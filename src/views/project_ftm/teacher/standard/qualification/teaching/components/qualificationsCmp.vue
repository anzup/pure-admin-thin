<template>
  <VxeTable :toolbar-config="tableToolbar" :loading="tableLoading" v-bind="gridOptions">
    <template #form v-if="!allAuth">
      <el-form :model="form" size="medium" inline class="componentsForm">
        <!-- 教员分类 -->
        <el-form-item :label="$t('table.teacherType')">
          <el-select v-model="form.roleId" :placeholder="$t('common.all')" clearable>
            <el-option
              v-for="(item, index) in formFilter.teacherList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 教员来源 -->
        <el-form-item :label="$t('table.teacherSource')">
          <el-select v-model="form.employeeSource" :placeholder="$t('common.all')" clearable>
            <el-option
              v-for="(item, index) in teacherSourceConfigs"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="searchInput"
            size="medium"
            :placeholder="$t('holder.PleaseEnterYourSearchKeyword')"
            v-model="form.searchKey"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="searchEvent">{{
            $t('button.query')
          }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <el-button type="primary" v-if="airplaneAlone == false" @click="showExpireDialogEvent">{{
        $t('table.expireList')
      }}</el-button>

      <template v-if="airplaneAlone">
        <el-button @click="cancelEditEvent" size="small" v-if="canEdit">{{
          $t('button.cancelEdit')
        }}</el-button>
        <el-button type="primary" size="small" @click="startEditEvent" v-else>{{
          $t('button.edit')
        }}</el-button>
      </template>
    </template>
    <template #license="item">
      <div class="img_con" @click="clickIconEvent(item)">
        <QuestionnaireIcon
          v-if="licenseRow(item).isOwn"
          class="img"
          :class="{
            warning: licenseRow(item).proPeriod,
            error: licenseRow(item).overdue,
          }"
        />
      </div>
    </template>
    <template #archives="{ row }">
      <vxe-button type="text" status="primary" @click="showArchivesEvent(row)">{{
        $t('table.archives')
      }}</vxe-button>
    </template>
    <template #pager />
  </VxeTable>

  <expireListDialog v-model:show="expireDialogVisible" v-bind="expireDialogProps" />
  <archivesDialog
    v-model="archivesVisible"
    v-bind="archivesProps"
    v-if="archivesProps.show"
    @closed="archivesProps.show = false"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import QuestionnaireIcon from '/@/assets/ftm/svg/qualification-icon.svg'
  import { Search } from '@element-plus/icons-vue'
  import expireListDialog from './qualificationsExpireDialog.vue'
  import archivesDialog from './archivesDialog.vue'
  import { getEmployeeQualificationsLicenses } from '/@/api/ftm/teacher/education'
  import {
    getQualificationRoles,
    postQualificationProvideSingle,
  } from '/@/api/ftm/teacher/qualification'
  import { getStyle } from '/@/utils/index'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { EmployeeEnum } from '/@/enums/employeeEnum'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  const settingsStore = useFtmSettingsStore()
  export default {
    name: 'QuaCmp',
    components: { expireListDialog, archivesDialog, VxeTable, QuestionnaireIcon, Search },
    props: {
      type: String,
      allAuth: [String, Boolean],
    },
    data() {
      return {
        menuName: 'QUALIFICATIONS_MANAGEMENT',
        form: {
          roleId: undefined,
          employeeSource: undefined,
          searchKey: '',
        },
        total: 0,
        formFilter: {
          teacherList: [],
          source: [],
        },
        gridOptions: {
          resizable: true,
          autoResize: true,
          columns: [
            { title: this.$t('table.teacherClassify'), minWidth: 120 }, // 教员分类
            { title: this.$t('table.teacherLastName'), minWidth: 120 }, // 教员姓名
            { title: this.$t('table.courseName'), minWidth: 120, field: 'course' }, // 教员来源
            { title: this.$t('table.teacherLevel'), minWidth: 120 }, // 教员等级
            { title: this.$t('table.operateCompany'), minWidth: 120 }, // 运行公司
            // { title: this.$t('table.teacherArchives'), width: 120, slots: { default: 'archives' } }, // 教员档案
            // { title: this.$t('table.tableEdit'), width: 150, slots: { default: 'editor' } },
          ],
          data: [],
        },
        tableHeight: 'unset',
        tableLoading: false,
        licenceDialog: false,
        rowData: {},
        detailId: undefined,
        canEdit: false,
        originData: [],
        tableToolbar: {
          perfect: true,
          slots: {
            tools: 'right_tools',
            // buttons: 'left_tools'
          },
        },
        expireDialogVisible: false,
        expireDialogProps: {},
        archivesVisible: false,
        archivesProps: {},
      }
    },
    computed: {
      windowHeight() {
        return window.innerHeight
      },
      configs() {
        return settingsStore.configs
      },
      permissionName() {
        return this.allAuth ? 'auth' : this.menuName + ':EDIT'
      },
      airplaneAlone() {
        try {
          return this.configs.find((item) => item.name == EmployeeEnum.airplaneType).value
        } catch (e) {
          return true
        }
      },
      tableHeadColumns() {
        return [
          { title: this.$t('common.serialNumber'), width: 60, type: 'seq' },
          {
            title: this.$t('table.teacherClassify'),
            minWidth: 120,
            field: 'roleId',
            formatter: this.formatRole,
          }, // 教员分类
          { title: this.$t('table.teacherLastName'), minWidth: 120, field: 'employee' }, // 教员姓名
          !this.airplaneAlone && {
            title: this.$t('table.teacherSource'),
            minWidth: 120,
            field: 'employeeSource',
          }, // 教员来源
          !this.airplaneAlone && {
            title: this.$t('table.teacherLevel'),
            minWidth: 120,
            field: 'employeeLevel',
          }, // 教员等级
          !this.airplaneAlone && {
            title: this.$t('table.operateCompany'),
            minWidth: 120,
            field: 'operatingCompany',
          }, // 运行公司
        ].filter((v) => !!v)
      },
      tableFootColumns() {
        return [
          !this.airplaneAlone && {
            title: this.$t('table.teacherArchives'),
            width: 120,
            slots: { default: 'archives' },
          }, // 教员档案
          // { title: this.$t('table.tableEdit'), width: 150, slots: { default: 'editor' } },
        ].filter((v) => !!v)
      },
      teacherSourceConfigs() {
        try {
          return this.configs.find((item) => item.name == EmployeeEnum.source).value || []
        } catch (e) {
          return []
        }
      },
    },
    watch: {
      windowHeight: {
        immediate: true,
        handler(value) {
          value > 0 && this.setTableHeight()
        },
      },
      airplaneAlone(newVal, oldVal) {
        if (newVal != oldVal) this.canEdit = false
        this.form.roleId = undefined
        this.form.employeeSource = undefined
        this.form.searchKey = ''
        this.getEmployeeQualificationsLicense()
      },
    },
    async created() {
      this.setTableHeight()
      await this.getRolesAll()
      this.getEmployeeQualificationsLicense()
    },
    updated() {
      this.setTableHeight()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 获取资质列表
      async getEmployeeQualificationsLicense() {
        this.tableLoading = true
        const [err, res] = await to(getEmployeeQualificationsLicenses(this.form))
        // getEmployeeQualificationsLicense({ builtinRole: this.form.builtinRole })
        this.tableLoading = false
        if (!err && res.status == 200) {
          const headColumns = this.tableHeadColumns
          const footColumns = this.tableFootColumns
          this.gridOptions.columns = [
            ...headColumns,
            ...(res.data instanceof Array && res.data.length > 0
              ? this.airplaneAlone
                ? res.data[0].qualifications.map((v, index) => ({
                    // 单机型表头
                    title: v.course,
                    minWidth: 200,
                    params: { qualificationIndex: index },
                    slots: { default: 'license' },
                  }))
                : res.data[0].qualifications.map((v, index) => ({
                    // 多机型表头
                    title: v.course,
                    children: v.airplaneTypes.map((n, i) => ({
                      title: n.airplaneType,
                      params: {
                        qualificationIndex: index,
                        airplaneTypeIndex: i,
                      },
                      minWidth: 150,
                      slots: { default: 'license' },
                    })),
                  }))
              : []),
            ...footColumns,
          ]
          this.gridOptions.data = res.data
        }
      },
      // 获取职位下拉列表
      async getRolesAll() {
        const [err, res] = await to(getQualificationRoles())
        if (!err && res.status == 200) {
          this.formFilter.teacherList = res.data
        }
      },
      searchEvent() {
        this.canEdit = false
        this.getEmployeeQualificationsLicense()
      },
      // 开始编辑 保存当前数据
      startEditEvent() {
        this.canEdit = true
        // this.originData = XEUtils.clone(this.gridOptions.data, true)
      },
      // 取消编辑 还原原数据
      cancelEditEvent() {
        this.canEdit = false
        // this.gridOptions.data = XEUtils.clone(this.originData, true)
      },
      // 显示到期列表
      showExpireDialogEvent() {
        let expireList = []
        for (let employee of this.gridOptions.data) {
          for (let qualification of employee.qualifications) {
            for (let airplane of qualification.airplaneTypes) {
              if (airplane.isOwn && airplane.overdue) {
                expireList = expireList.concat(
                  airplane.expireQualifications.map((item) => ({
                    employeeName: employee.employee,
                    employeeType: this.formatRole({ cellValue: employee.roleId }),
                    employeeSource: this.formatSource({ cellValue: employee.employeeSource }),
                    content: item.typeName,
                    courseName: qualification.course,
                    airplaneType: airplane.airplaneType,
                    expireTime: item.expireTime,
                  })),
                )
              }
            }
          }
        }
        this.expireDialogProps = {
          data: expireList,
        }
        this.expireDialogVisible = true
      },
      // 获取资质对象
      licenseRow({ row, column }) {
        try {
          const { qualificationIndex, airplaneTypeIndex } = column.params
          if (this.airplaneAlone) {
            // 单机型
            return row.qualifications[qualificationIndex].airplaneTypes[0] || {}
          } else {
            // 多机型
            return row.qualifications[qualificationIndex].airplaneTypes[airplaneTypeIndex] || {}
          }
        } catch (e) {
          return {}
        }
      },
      setTableHeight() {
        this.$nextTick(() => {
          let componentDOM = this.$refs.Content
          if (componentDOM && componentDOM.offsetHeight) {
            this.tableHeight =
              componentDOM.offsetHeight -
              parseInt(getStyle(componentDOM, 'paddingTop')) -
              parseInt(getStyle(componentDOM, 'paddingBottom'))
          }
        })
      },
      // 点击资质图标事件 (多机型才能点击跳转/单机型点击添加取消资质)
      async clickIconEvent(item) {
        const airplane = this.licenseRow(item)
        if (this.airplaneAlone == false && airplane.isOwn) {
          this.routerGo(`teaching/detail/${airplane.id}`)
        } else if (this.airplaneAlone == true && this.canEdit) {
          const { row, column } = item
          const { qualificationIndex } = column.params
          const params = {
            builtinRole: row.roleId,
            courseId: row.qualifications[qualificationIndex].courseId,
            userId: row.userId,
            newOrDelete: !airplane.isOwn,
          }
          this.tableLoading = true
          const [err, res] = await to(postQualificationProvideSingle(params))
          this.tableLoading = false
          if (!err && res.status == 200) {
            airplane.isOwn = !airplane.isOwn
          }
        }
      },
      // 预览档案
      showArchivesEvent(row) {
        this.archivesVisible = true

        this.archivesProps = {
          show: true,
          id: row.employeeId,
          userId: row.userId,
        }
      },
      // 格式化匹配教员分类
      formatRole({ cellValue }) {
        return (this.formFilter.teacherList.find((item) => item.id == cellValue) || {}).name || ''
      },
      // 格式化匹配教员来源
      formatSource({ cellValue }) {
        return cellValue
          ? (this.teacherSourceConfigs.find((v) => v.id == cellValue) || {}).name
          : cellValue
      },
    },
  }
</script>
<style lang="scss" scoped>
  :deep(.vxe-cell) {
    max-height: 60px !important;
  }
  .img_con {
    display: flex;
    width: 100%;
    height: 45px;
    align-items: center;
    justify-content: center;
    .img {
      width: 24px;
      height: auto;
      fill: #215ebe;
      cursor: pointer;
      &.error {
        fill: #d81e06;
      }
      &.warning {
        fill: #f4ea2a;
      }
    }
  }
  .footerBtn {
    padding-right: 30px;
  }
  .componentsHeader {
    margin-bottom: 10px;
  }
</style>
