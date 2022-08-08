<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="pagination"
    :toolbar-config="tableTools"
    :buttons="tableButtons"
    @checkbox="selectAllEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <!-- 问卷类型 -->
        <el-form-item :label="$t('table.questionnaireType')">
          <el-select v-model="form.type" clearable>
            <el-option
              v-for="item in form.types"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item :label="$t('button.status')">
          <el-select v-model="form.status" clearable>
            <el-option
              v-for="item in form.statusArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 关键字 -->
        <el-form-item>
          <el-input v-model="form.searchKey" :placeholder="$t('holder.pleaseEnterQuestionnaire')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <el-button
        v-if="containsPermissions(menuName + ':ADD')"
        size="mini"
        type="primary"
        @click="addQuestionnaire"
        >{{ $t('button.add') }}</el-button
      >
      <el-button
        v-if="containsPermissions(menuName + ':BULK_DELETION')"
        size="mini"
        type="danger"
        @click="DeleteAll"
        >{{ $t('button.batchDeletion') }}</el-button
      >
    </template>

    <template #time="{ row }"
      >{{ XEUtils.toDateString(row.startTime, 'yyyy/MM/dd') }} -
      {{ XEUtils.toDateString(row.endTime, 'yyyy/MM/dd') }}</template
    >
  </VxeTable>

  <qr-dialog v-model:show="qrDialogVisible" :url="qrcodeURL" :name="qrcodeName">
    <template #text>
      {{ $t('table.questionnaireValidity') }}:
      {{ XEUtils.toDateString(qrcodePeriod[0], 'yyyy/MM/dd') }} -
      {{ XEUtils.toDateString(qrcodePeriod[1], 'yyyy/MM/dd') }}
    </template>
  </qr-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import {
    getQuestionnaires,
    delQuestionnaires,
    delQuestionnairesAll,
  } from '/@/api/ftm/teacher/education'
  import qrDialog from './components/qrcodeDialog.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        menuName: 'QUESTIONNAIRE_MANAGEMENT2',
        form: {
          type: undefined,
          types: [
            { id: 'INTERNAL', name: this.$t('table.privateQuestionnaire') },
            { id: 'PUBLIC', name: this.$t('table.publicQuestionnaire') },
          ],
          status: undefined,
          statusArr: [
            { id: 'NOT_STARTED', name: this.$t('status.notStarted') },
            { id: 'INPROGRESS', name: this.$t('status.inProgress') },
            { id: 'FINISHED', name: this.$t('status.examFinished') },
          ],
          searchKey: '',
        },
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        loading: false,
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: 60 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.title'), minWidth: 160 },
          {
            field: 'type',
            title: this.$t('table.questionnaireType'),
            width: 140,
            formatter: this.typeFormat,
          },
          { title: this.$t('table.questionnaireValidity'), width: 200, slots: { default: 'time' } },
          { field: 'filledCount', title: this.$t('table.fillNumber'), width: 100 },
          {
            field: 'status',
            title: this.$t('button.status'),
            width: 100,
            formatter: this.statusFormat,
          },
          { title: this.$t('table.tableEdit'), width: 260, slots: { default: 'operate' } },
        ],
        records: [],
        XEUtils,
        qrDialogVisible: false,
        qrcodeURL: null,
        qrcodeName: '',
        qrcodePeriod: ['', ''],
      }
    },
    computed: {
      rolesId() {
        return this.$route.query.roles_id || 'Management'
      },
      totalAuthorities() {
        return userStore.userInfo.totalAuthorities
      },
    },
    created() {
      this.getData()
    },
    components: { qrDialog, VxeTable },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      async getData() {
        this.records = []
        this.loading = true
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          status: this.form.status,
          searchKey: this.form.searchKey,
          type: this.form.type,
        }
        let [err, res] = await to(getQuestionnaires(params))
        if (!err) {
          let { data } = res
          this.loading = false
          this.tableData = data.content
          this.pagination.total = data.totalElements
        } else {
          this.loading = false
        }
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      selectAllEvent({ records }) {
        this.records = records
      },
      Info(row) {
        this.routerGo(`questionnaire/infoQuestionnaire?q_id=${row.id}&id=${this.rolesId}`)
      },
      Delete(row) {
        this.$confirm(
          this.$t('tip.thisOperationWillPermanentlyDeleteTheData'),
          this.$t('button.delete'),
          { type: 'warning' },
        )
          .then(() => {
            this.delQuestionnaire(row.id)
          })
          .catch()
      },
      DeleteAll() {
        if (this.records.length < 1) return
        this.$confirm(
          this.$t('tip.areYouSureYouWantToDeleteTheSelected'),
          this.$t('button.delete'),
          { type: 'warning' },
        )
          .then(() => {
            this.delQuestionnaire(this.records.map((v) => v.id))
          })
          .catch()
      },
      // 生成二维码
      createQR(row) {
        this.qrDialogVisible = true
        this.qrcodeName = row.name
        this.qrcodePeriod = [row.startTime || '', row.endTime || '']
        if (import.meta.env.MODE === 'development') {
          this.qrcodeURL = `http://localhost:8083/#/pages/questionnaire/questionnaire?valide=1&id=${row.id}&type=${row.type}`
        } else {
          this.qrcodeURL = `${window.location.origin}/ftm/h5/#/pages/questionnaire/questionnaire?valide=1&id=${row.id}&type=${row.type}`
        }
      },
      Details(row) {
        this.routerGo(`questionnaire/questionnaireDetails?q_id=${row.id}&id=${this.rolesId}`)
      },
      // 删除问卷
      async delQuestionnaire(id) {
        let [err] =
          id instanceof Array
            ? await to(delQuestionnairesAll({ ids: id }))
            : await to(delQuestionnaires({ id }))
        if (!err) {
          this.$message.success(this.$t('tip.delsuccessTip'))
          this.getData()
        }
      },
      // 搜索查询
      searchData() {
        this.pagination.page = 1
        this.pagination.total = 0
        this.getData()
      },
      // 格式化问卷类型
      typeFormat({ cellValue }) {
        return cellValue == 'PUBLIC'
          ? this.$t('table.publicQuestionnaire')
          : this.$t('table.privateQuestionnaire')
      },
      // 格式化状态
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'NOT_STARTED':
            return this.$t('status.notStarted')
          case 'INPROGRESS':
            return this.$t('status.inProgress')
          case 'FINISHED':
            return this.$t('status.examFinished')
          default:
            return ''
        }
      },
      addQuestionnaire() {
        this.routerGo(`questionnaire/addQuestionnaire?id=${this.rolesId}`)
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.qrCode'),
            // visible: this.totalAuthorities.includes(this.menuName + ':QR_CODE'),
            event: () => {
              this.createQR(row)
            },
          },
          {
            name: this.$t('button.details'),
            // visible: this.totalAuthorities.includes(this.menuName + ':DETAIL'),
            event: () => {
              this.Details(row)
            },
          },
          {
            name: this.$t('button.modify'),
            // visible: this.totalAuthorities.includes(this.menuName + ':UPDATE'),
            disabled: row.filledCount > 0 || row.status != 'NOT_STARTED',
            event: () => {
              this.Info(row)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            // visible: this.totalAuthorities.includes(this.menuName + ':DELETE'),
            event: () => {
              this.Delete(row)
            },
          },
        ]
      },
    },
  }
</script>
