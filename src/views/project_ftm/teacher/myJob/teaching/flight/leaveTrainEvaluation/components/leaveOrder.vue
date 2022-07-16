<template>
  <!-- 预览表 -->
  <div class="leave-evaluation-container" v-if="type == OrderStatus.view" v-loading="loading">
    <table class="leave-evaluation-table">
      <tr class="high-light">
        <td :colspan="itemsCount + 1">
          <h2 class="leave-evaluation-title">{{ $t('router.leaveTrainEvaluation') }}</h2>

          <div class="leave-evaluation-printbtn">
            <el-button type="primary" @click="handleDownload">{{ $t('button.download') }}</el-button
            ><!-- 下载 -->
            <el-button type="primary" @click="handlePrint">{{ $t('button.print') }}</el-button
            ><!-- 打印 -->
          </div>
        </td>
      </tr>
      <tr>
        <td :colspan="itemsCount + 1" class="t-left">
          <div class="leave-evaluation-info">
            <span>{{ $t('table.name') }}: {{ student.name }}</span>
            <span>{{ $t('table.gender') }}: {{ formatGender(student.gender) }}</span>
            <span>{{ $t('table.idNumber') }}: {{ student.idNumber }}</span>
          </div>
        </td>
      </tr>
      <tr class="high-light">
        <td class="oblique">
          <sub>{{ $t('table.evaluateTo') }}</sub>
          <sup>{{ $t('table.project') }}</sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke-width="1" />
          </svg>
        </td>
        <td>{{ $t('table.aviationCopilotcourse') }}</td>
        <td>{{ $t('table.IRC_SimulatorTraining') }}</td>
        <td>{{ $t('table.thisTraining') }}</td>
      </tr>
      <tr>
        <!-- 操作能力 -->
        <td class="high-light">{{ $t('table.operationAbility') }}</td>
        <td v-for="(item, index) in ItemList" :key="index">{{ form[item.id].maneuverability }}</td>
      </tr>
      <tr>
        <!-- 理论知识 -->
        <td class="high-light">{{ $t('table.theoreticalKnowledge') }}</td>
        <td v-for="(item, index) in ItemList" :key="index">{{ form[item.id].theory }}</td>
      </tr>
      <tr>
        <!-- 训练作风 -->
        <td class="high-light">{{ $t('table.trainingStyle') }}</td>
        <td v-for="(item, index) in ItemList" :key="index">{{ form[item.id].trainingStyle }}</td>
      </tr>
      <tr>
        <!-- 备注 -->
        <td class="high-light">{{ $t('table.remarks') }}</td>
        <td class="vertical-top" v-for="(item, index) in ItemList" :key="index">
          <div class="text t-left" v-html="form[item.id].remark"></div>
        </td>
      </tr>
      <tr>
        <!-- 签名 -->
        <td class="high-light">{{ $t('table.teacherSigning') }}</td>
        <td v-for="(item, index) in ItemList" :key="index" class="sign-area">
          <img
            :src="previewImg(form[item.id].signature)"
            alt=""
            class="sign-img"
            v-if="form[item.id].signature"
          />
        </td>
      </tr>
      <tr>
        <!-- 教员执照号 -->
        <td class="high-light">{{ $t('table.teacherLicenseNumber') }}</td>
        <td v-for="(item, index) in ItemList" :key="index">{{ form[item.id].teacherNumber }}</td>
      </tr>
      <tr>
        <!-- 签名日期 -->
        <td class="high-light">{{ $t('table.signedDate') }}</td>
        <td v-for="(item, index) in ItemList" :key="index">
          {{ formatDate(form[item.id].signTime) }}
        </td>
      </tr>
      <tr>
        <!-- 填写说明 -->
        <td class="high-light">{{ $t('table.fillRemark') }}</td>
        <td :colspan="itemsCount" class="text t-left">{{ $t('supplement.leaveTrainFormTips') }}</td>
      </tr>
    </table>
  </div>
  <!-- 填写表 -->
  <div class="leave-evaluation-container" v-else-if="type == OrderStatus.modify">
    <table class="leave-evaluation-table">
      <tr class="high-light">
        <td :colspan="itemsCount + 1">
          <h2 class="leave-evaluation-title">{{ $t('router.leaveTrainEvaluation') }}</h2>
        </td>
      </tr>
      <tr>
        <td :colspan="itemsCount + 1" class="t-left">
          <div class="leave-evaluation-info">
            <span>{{ $t('table.name') }}: {{ student.name }}</span>
            <span>{{ $t('table.gender') }}: {{ formatGender(student.gender) }}</span>
            <span>{{ $t('table.idNumber') }}: {{ student.idNumber }}</span>
          </div>
        </td>
      </tr>
      <tr class="high-light">
        <td class="oblique">
          <sub>{{ $t('table.evaluateTo') }}</sub>
          <sup>{{ $t('table.project') }}</sup>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke-width="1" />
          </svg>
        </td>
        <td v-for="(item, index) in ItemList" :key="index">{{ item.title }}</td>
      </tr>
      <tr>
        <!-- 操作能力 -->
        <td class="high-light">{{ $t('table.operationAbility') }} <i class="el-icon-edit"></i></td>
        <td v-for="(item, index) in ItemList" :key="index">
          <el-input size="mini" v-model="form[item.id].maneuverability"></el-input>
        </td>
      </tr>
      <tr>
        <!-- 理论知识 -->
        <td class="high-light">
          {{ $t('table.theoreticalKnowledge') }} <i class="el-icon-edit"></i>
        </td>
        <td v-for="(item, index) in ItemList" :key="index">
          <el-input size="mini" v-model="form[item.id].theory"></el-input>
        </td>
      </tr>
      <tr>
        <!-- 训练作风 -->
        <td class="high-light">{{ $t('table.trainingStyle') }} <i class="el-icon-edit"></i></td>
        <td v-for="(item, index) in ItemList" :key="index">
          <el-input size="mini" v-model="form[item.id].trainingStyle"></el-input>
        </td>
      </tr>
      <tr>
        <!-- 备注 -->
        <td class="high-light">{{ $t('table.remarks') }} <i class="el-icon-edit"></i></td>
        <td class="vertical-top" v-for="(item, index) in ItemList" :key="index">
          <el-input
            size="mini"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 3 }"
            v-model="form[item.id].remark"
          ></el-input>
        </td>
      </tr>
      <tr>
        <!-- 签名 -->
        <td class="high-light">{{ $t('table.teacherSigning') }} <i class="el-icon-edit"></i></td>
        <td v-for="(item, index) in ItemList" :key="index" class="sign-area">
          <img
            :src="previewImg(form[item.id].signature)"
            alt=""
            class="sign-img"
            v-if="form[item.id].signature"
          />
          <span
            class="link-normal"
            v-else-if="OrderSignItems.includes(item.id)"
            @click="handleSign(item.id)"
            >{{ $t('table.clickSign') }}</span
          >
        </td>
      </tr>
      <tr>
        <!-- 教员执照号 -->
        <td class="high-light">
          {{ $t('table.teacherLicenseNumber') }} <i class="el-icon-edit"></i>
        </td>
        <td v-for="(item, index) in ItemList" :key="index">
          <el-input size="mini" v-model="form[item.id].teacherNumber"></el-input>
        </td>
      </tr>
      <tr>
        <!-- 签名日期 -->
        <td class="high-light">{{ $t('table.signedDate') }}</td>
        <td v-for="(item, index) in ItemList" :key="index">
          {{ formatDate(form[item.id].signTime) }}
        </td>
      </tr>
      <tr>
        <!-- 填写说明 -->
        <td class="high-light">{{ $t('table.fillRemark') }}</td>
        <td :colspan="itemsCount" class="text t-left">{{ $t('supplement.leaveTrainFormTips') }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import moment from 'moment'
  import { OrderStatus, OrderType, OrderSignItems } from './leaveOrder.enum'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import { downloadStudentOutTrainRecords } from '/@/api/ftm/teacher/teachingCenter'
  import XEUtils from 'xe-utils'
  const DetailData = {
    id: null,
    student: {},
  }

  export default {
    props: {
      type: Number,
      data: {
        type: Object,
      },
    },
    data() {
      return {
        OrderStatus,
        OrderType,
        OrderSignItems,
        loading: false,
        ItemList: [],
        form: XEUtils.clone(DetailData, true),
        Items: [
          { title: this.$t('table.aviationCopilotcourse'), id: OrderType.course }, //课程
          { title: this.$t('table.IRC_SimulatorTraining'), id: OrderType.train }, // 训练
          { title: this.$t('table.thisTraining'), id: OrderType.thisTrain }, // 本次训练
        ],
      }
    },
    mounted() {
      this.Items.forEach((item) => {
        DetailData[item.id] = {}
      })
      this.ItemList = this.Items
    },
    computed: {
      student() {
        return this.data.student || {}
      },
      itemsCount() {
        return this.Items.length
      },
    },
    watch: {
      data(data) {
        this.form = XEUtils.clone(data, true)
      },
    },
    methods: {
      handleSign(type) {
        this.$emit('sign', type)
      },
      async handleDownload() {
        this.loading = true
        await this.$to(
          downloadStudentOutTrainRecords({
            ids: [this.form.id],
            templateHtml: null,
            download: true,
          }),
        )
        this.loading = false
      },
      async handlePrint() {
        this.loading = true
        await this.$to(downloadStudentOutTrainRecords({ ids: [this.form.id], templateHtml: null }))
        this.loading = false
      },
      formatGender(value) {
        switch (value) {
          case 'M':
            return this.$t('common.male')
          case 'F':
            return this.$t('common.female')
          default:
            return ''
        }
      },
      formatDate(val) {
        return val ? moment(val).format('YYYY-MM-DD') : ''
      },
      previewImg(uuid) {
        return previewURL(uuid)
      },
    },
  }
</script>

<style scoped lang="scss">
  .leave-evaluation-container {
    max-width: 1200px;
    padding: 0 30px;
    margin: 0 auto 20px;
    text-align: center;
  }
  .leave-evaluation-table {
    width: 100%;
    border-collapse: collapse;
    td {
      position: relative;
      height: 36px;
      padding: 14px;
      font-size: 12px;
      line-height: 1;
      border: 1px solid #666;
    }
    .vertical-top {
      vertical-align: top;
    }
    .high-light {
      background-color: #fafafa;
      font-weight: bold;
      white-space: nowrap;
    }
    .text {
      white-space: pre-line;
      line-height: 1.5;
    }
    .t-left {
      text-align: left;
    }
    .link-normal {
      color: #215ebe;
      cursor: pointer;
    }
    .link-error {
      color: red;
    }
    .oblique {
      position: relative;
      padding: 0;
      sub {
        position: absolute;
        bottom: 12px;
        left: 12px;
        font-size: 12px;
      }
      sup {
        position: absolute;
        top: 12px;
        right: 12px;
        font-size: 12px;
      }
      svg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        stroke: #666;
      }
    }
    .sign-area {
      padding: 0;
      .sign-img {
        max-width: 200px;
        max-height: 90px;
        object-fit: cover;
      }
    }
  }
  .leave-evaluation-title {
    height: 30px;
    font-size: 20px;
    line-height: 30px;
    margin: 0;
  }
  .leave-evaluation-printbtn {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
  .leave-evaluation-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    span {
      min-width: 100px;
    }
  }
</style>
