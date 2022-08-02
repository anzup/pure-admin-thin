<template>
  <table class="wrap-table nopostcss-table">
    <thead>
      <tr>
        <th colspan="6">
          <h1>{{ data.title }}</h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="8" style="padding: 0; border: none">
          <table class="print-wrap-content details-table" style="width: 100%">
            <tr class="average">
              <!-- 学员姓名 -->
              <td class="width33p">
                <span class="details-label">{{ $t('table.studentName') }}：</span>{{ form.student }}
              </td>
              <!-- 带飞教员 -->
              <td class="width33p">
                <span class="details-label">{{ $t('table.filghtTeacher') }}：</span
                >{{ form.teacher }}
              </td>
              <!-- 班级课号 -->
              <td>
                <span class="details-label">{{ $t('table.courseCode') }}：</span
                >{{ form.courseNumber }}
              </td>
            </tr>
            <tr class="average">
              <!-- 训练机型 -->
              <td>
                <span class="details-label">{{ $t('table.trainingModel') }}：</span
                >{{ form.airplaneModel }}
              </td>
              <!-- 课程大纲 -->
              <td>
                <span class="details-label">{{ $t('router.syllabus') }}：</span>{{ form.version }}
              </td>
              <!-- 飞行日期 -->
              <td>
                <span class="details-label">{{ $t('table.trainDate') }}：</span>
                <template>
                  {{ form.flyTime }}
                </template>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="wrap-point" :width="labelWidth">{{ $t('table.sourse') }}</td>
        <!-- 课程 -->
        <td class="wrap-point" width="275px">{{ $t('table.evaluationProject') }}</td>
        <!-- 评估项目 -->
        <td class="wrap-point" colspan="2">{{ $t('table.evaluationCoreCompetence') }}</td>
        <!-- 核心能力评估 -->
        <td class="wrap-point" width="275px">{{ $t('table.behavioralIndicatorsNoPass') }}</td>
        <!-- 行为指标不满足项 -->
      </tr>
      <tr class="c">
        <td :rowspan="form.score.length || 1" class="wrap-point" :width="labelWidth">
          <span class="course-name">{{ data.course }}</span>
        </td>
        <td>{{ form.score[0] ? form.score[0].name : '' }}</td>
        <td colspan="2">
          <el-rate :disabled="type == 'info'" v-if="form.score[0]" v-model="form.score[0].score" />
        </td>
        <td class="center">
          <div class="behavior-line">
            <span v-if="form.score[0] && form.score[0].score <= 3">{{
              getBehavior(form.score[0].behavior)
            }}</span>
            <span v-if="form.score[0] && form.score[0].score > 3">{{
              (form.score[0].behavior = '')
            }}</span>
          </div>
        </td>
      </tr>
      <tr
        class="c"
        v-for="(item, index) in form.score instanceof Array ? form.score.slice(1) : []"
        :key="index"
      >
        <td>{{ item.name }}</td>
        <td colspan="2">
          <el-rate :length="5" :disabled="type == 'info'" v-model="form.score[index + 1].score" />
        </td>
        <td class="center">
          <div class="behavior-line">
            <span v-if="item.score <= 3">{{ getBehavior(item.behavior) }}</span>
            <span v-if="item.score > 3">{{ (item.behavior = '') }}</span>
          </div>
        </td>
      </tr>

      <tr class="r2">
        <td class="wrap-point">{{ $t('table.trainingResults') }}</td>
        <td colspan="5">
          <template v-if="type == 'info'">
            <p class="wrap-con">
              {{ form.trainingResultName ? form.trainingResultName : formatResult(form.result) }}
            </p>
          </template>
          <template v-else>
            <el-radio-group v-model="form.result" style="padding-left: 20px">
              <el-radio v-for="item in resultArr" :key="item.id" :label="item.id">{{
                item.name
              }}</el-radio>
            </el-radio-group>
          </template>
        </td>
      </tr>
      <tr class="r3">
        <td class="wrap-point">{{ $t('table.comment') }}</td>
        <td colspan="5" style="padding: 0">
          <table class="cell-table">
            <tr>
              <td class="cell-td">PF</td>
              <td>
                <template>
                  <p class="wrap-con">{{ data.estimate }}</p>
                </template>
              </td>
            </tr>
            <tr>
              <td class="cell-td">PM</td>
              <td>
                <template>
                  <p class="wrap-con">{{ data.evaluation }}</p>
                </template>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr class="r3">
        <td colspan="6" style="padding: 0">
          <table class="print-wrap-content details-table" style="width: 100%; height: 100%">
            <tr>
              <td class="wrap-point" :width="labelWidth">{{ $t('table.teacherSign') }}</td>
              <td class="c" width="350px">
                <div class="sign-img-box">
                  <img :src="teacherSignURL" alt="" class="sign-img" v-if="form.teacherUUID" />
                </div>
              </td>
              <td class="wrap-point" width="250px">{{ $t('table.studentSign') }}</td>
              <td class="c" width="350px">
                <div class="sign-img-box" v-if="form.studentUUID">
                  <img :src="studentSignURL" alt="" class="sign-img" />
                </div>
                <span class="sign-link" @click="Sign" v-else>{{ $t('table.clickSign') }}</span>
              </td>
              <template v-if="form.auditorUUID">
                <td class="wrap-point" width="250px">{{ $t('table.signerSign') }}</td>
                <td class="c" width="350px">
                  <div class="sign-img-box" v-if="form.auditorUUID">
                    <img :src="auditorSignURL" alt="" class="sign-img" />
                  </div>
                </td>
              </template>
            </tr>
          </table>
        </td>
      </tr>
      <!-- 备注 -->
      <!-- <tr>
        <td class="wrap-point">{{ $t('table.remarks') }}</td>
        <td colspan="5">
            <template>
                {{ form.remark }}
            </template>
        </td>
    </tr> -->
    </tbody>
  </table>
</template>

<script>
  import XEUtils from 'xe-utils'
  import { previewURL } from '/@/api/ftm/student/teachingCenter'
  const Interface = {
    title: '', // 飞行项目
    student: '', // 学员姓名
    teacher: '', // 教员
    airplaneModel: '', // 飞机型号
    flyTime: '', // 飞行时间
    course: '', // 课程
    result: '', // 结果
    estimate: '',
    evaluation: '', // 评语
    score: [], // 项目
    teacherUUID: '', // 教员签名
    studentUUID: '', // 学员签名
    auditorUUID: '',
    remark: '',
    exam: null,
    trainingResultName: '',
  }
  export default {
    data() {
      const tableWidth = 940
      const _form = XEUtils.clone(Interface, true)
      return {
        labelWidth: Number((105 / tableWidth).toFixed(4)) * 100 + '%',
        form: _form, // 本地数据
        resultArr: [
          { id: 'PASS', name: this.$t('button.pass') },
          { id: 'ABORT', name: this.$t('status.adviceAbort') },
          { id: 'ADD_ONE', name: this.$t('status.adviceAddOne') },
          { id: 'ADD_TWO', name: this.$t('status.adviceAddTwo') },
        ],
        studentSignURL: '', // 学生签名图片地址
        teacherSignURL: '', // 教员签名图片地址
        auditorSignURL: '',
      }
    },
    props: {
      type: {
        type: String,
        default: 'info',
      },
      data: {
        type: Object,
        default: () => Interface, // 传递数据
      },
    },
    watch: {
      data: {
        handler(param) {
          // console.log(param,'传递')
          let obj = XEUtils.clone(param, true)
          this.form = obj
          this.studentSignURL = previewURL(obj.studentUUID)
          this.teacherSignURL = previewURL(obj.teacherUUID)
          this.auditorSignURL = previewURL(obj.auditorUUID)
        },
      },
    },
    methods: {
      Sign() {
        this.$emit('signEvent')
      },
      formatResult(str) {
        switch (str) {
          case 'PASS':
            return this.form.exam
              ? this.$t('status.recommendTest')
              : this.$t('table.continueTraining')
          case 'ABORT':
            return this.$t('common.advice') + this.$t('status.abort')
          case 'ADD_ONE':
            return this.$t('common.advice') + this.$t('status.addOne')
          case 'ADD_TWO':
            return this.$t('common.advice') + this.$t('status.addTwo')
          default:
            return ''
        }
      },
      getBehavior(val) {
        if (val) {
          try {
            return JSON.parse(val)
              .map((item) => item.code)
              .join(' , ')
          } catch (error) {
            return ''
          }
        } else {
          return ''
        }
      },
    },
  }
</script>

<style lang="scss" scope>
  $ticketBorderColor: #666;
  $pointBackground: #fafafa;
  $tdHeight: 38px;
  .wrap-table {
    max-width: 1180px;
    margin: 0 auto;
    border-collapse: collapse;

    td,
    th {
      background-image: linear-gradient($ticketBorderColor, $ticketBorderColor),
        linear-gradient($ticketBorderColor, $ticketBorderColor);
      background-position: 0 0, 0 100%;
      background-size: 1px 100%, 100% 1px;
      background-repeat: no-repeat;
    }

    thead {
      text-align: center;
      // color: #fff;
      background-color: #fafafa;
      h1 {
        margin: 0;
        height: 50px;
        font-size: 18px;
        line-height: 50px;
      }
      h2 {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }
      tr:first-child {
        background-image: linear-gradient($ticketBorderColor, $ticketBorderColor),
          linear-gradient($ticketBorderColor, $ticketBorderColor);
        background-position: 100% 0, 0 0;
        background-size: 1px 100%, 100% 1px;
        background-repeat: no-repeat;
      }
    }

    tbody {
      tr,
      td {
        padding: 0 5px;
        font-size: 13px;
        height: $tdHeight;
      }
      tr td:last-child {
        background-image: linear-gradient($ticketBorderColor, $ticketBorderColor),
          linear-gradient($ticketBorderColor, $ticketBorderColor),
          linear-gradient($ticketBorderColor, $ticketBorderColor);
        background-position: 0 0, 0 100%, 100% 0;
        background-size: 1px 100%, 100% 1px, 1px 100%;
        background-repeat: no-repeat;
      }
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      td,
      th {
        font-size: 12px;
        padding: 0 12px;
        box-sizing: border-box;
        word-break: break-all;
        line-height: 1.5;
      }
      .details-label {
        display: inline-block;
        text-align: right;
        white-space: nowrap;
      }
      tr {
        height: 40px;
      }
      .details-title {
        height: 46px;
        background: $pointBackground;
        td {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
      }
      .h1 {
        height: 80px;
      }
      .h2 {
        height: 120px;
      }

      .center {
        text-align: center;
      }
      .average td {
        width: 33%;
      }
      .c1 {
        width: 12%;
      }
      .c2 {
        width: 20%;
      }

      .cell-input {
        margin: 10px 0;
      }
      .pt {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .vm-rate-icon-custome:before {
        content: '\E904';
      }
    }

    .left {
      display: inline-block;
      vertical-align: middle;
    }
    .right {
      display: inline-block;
      vertical-align: middle;
    }

    .inline {
      display: inline-block;
      margin: 0 10px;
    }

    .c {
      text-align: center;
    }

    .wrap-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }

    .wrap-head {
      padding-top: 12px;
      color: #666;
      font-size: 12px;
    }

    .wrap-point {
      font-weight: bold;
      text-align: center;
      background-color: #fafafa;
    }

    .wrap-con {
      padding-left: 2em;
      letter-spacing: 1px;
      line-height: 1.5;
    }

    .placeholder {
      color: #7f7f7f;
    }

    .r2 {
      height: 2 * $tdHeight;
    }
    .r3 {
      height: 3 * $tdHeight;
    }

    .wrap-textarea {
      width: 100%;
      min-height: 100%;
      textarea {
        margin: 5px 0;
        min-height: 140px !important;
      }
    }

    .sign-link {
      color: #215ebe;
      cursor: pointer;
    }

    .sign-img-box {
      width: 100%;
      height: 100px;
      margin: 5px;
      overflow: hidden;
    }
    .sign-img {
      max-width: 100%;
      max-height: 100px;
    }

    .vm-rate__icon {
      margin-right: 12px;
      font-size: 15px !important;
    }
    .course-name {
      max-width: 12em;
      word-break: break-word;
      line-height: 1.5;
    }

    .icon-edit {
      margin-left: 8px;
      color: rgb(23, 175, 255);
      font-size: 18px;
    }

    .cell-table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      .cell-td {
        width: 70px;
        height: 150px;
        text-align: center;
      }
    }
  }
  .behavior-indicators-dialog {
    .el-checkbox {
      width: 100%;
      margin: 6px 0;
    }
    .el-dialog__header {
      position: relative;
      padding: 15px 20px;
      text-align: center;
      background: #215ebe;
      .el-dialog__title {
        color: #fff;
        font-weight: bold;
      }
      .el-dialog__headerbtn {
        top: 50%;
        font-size: 28px;
        transform: translateY(-50%);
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-checkbox__label {
      display: inline-grid;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
  .behavior-checkbox {
    padding: 10px 20px;
    border: 1px solid #e8e8e8;
    line-height: 2;
  }
  .behavior-line {
    display: inline-block;
    padding: 5px 0;
    max-width: 20rem;
    min-width: 2rem;
    line-height: 1.5;
  }
</style>
