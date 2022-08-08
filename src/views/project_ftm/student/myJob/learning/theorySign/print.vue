<template>
  <div class="table-main">
    <div class="table-row">
      <div class="table-nav">
        <ul class="nav">
          <li>{{ $t('table.classNumber') }}:{{ clazz.courseNumber }}</li>
          <li>{{ $t('table.sourse') }}:{{ clazz.name }}</li>
          <li>{{ $t('table.modelNumber') }}:{{ clazz.airplaneType }}</li>
        </ul>
      </div>
    </div>
    <div class="table-head">
      <div class="table-cell" style="width: 60px">{{ $t('common.serialNumber') }}</div>
      <div class="table-cell" style="width: 150px">{{ $t('table.sourse') }}</div>
      <!-- 课程 -->
      <div class="table-cell" style="width: 200px">{{ $t('table.courseDate') }}</div>
      <!-- 授课日期 -->
      <div class="table-cell" style="max-width: 346px">{{ $t('table.teacherSign') }}</div>
      <!-- 教员签名 -->
      <div class="table-cell" style="width: 140px">{{ $t('table.studentSign') }}</div>
      <!-- 学员签名 -->
      <div class="table-cell">{{ $t('table.comment') }}</div>
      <!-- 评语 -->
    </div>
    <div class="table-row" v-for="(row, index) in data" :key="index">
      <div class="table-cell">{{ index + 1 }}</div>
      <div class="table-cell">{{ row.syllabusName }}</div>
      <div class="table-cell">
        <span class="inline-date"
          >{{ formatDate(row.startTime) }} - {{ formatDate(row.endTime) }}</span
        >
      </div>
      <div class="table-cell">
        <div class="inline-img" v-for="(item, index) in row.signTeachers" :key="index">
          <img class="sign-img" :src="previewURL(item.signature)" alt="" />
        </div>
      </div>
      <div class="table-cell">
        <div class="inline-img">
          <img class="sign-img" :src="previewURL(row.studentSignature)" alt="" />
        </div>
      </div>
      <div class="table-cell">
        <div class="remark" v-for="(item, index) in row.signTeachers || []" :key="index">
          <span v-if="(row.signTeachers || []).length > 1">{{ item.userName }}:</span
          >{{ item.remark }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { previewURL } from '/@/api/ftm/student/personCenter'
  import XEUtils from 'xe-utils'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        previewURL,
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      studentUserid() {
        return this.userInfo.userId
      },
    },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
      clazz: {
        type: Object,
      },
    },
    methods: {
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-main {
    width: 100%;
    display: table;
    font-size: 14px;
    border-collapse: collapse;
    .table-nav {
      display: table-cell;
      padding: 20px 0;
      height: 16px;
      font-weight: 600;
      color: #606266;
      ul.nav {
        position: absolute;
        top: 20px;
        left: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        justify-content: space-between;
      }
    }
    .table-head {
      background-color: #f8f8f9;
      .table-cell {
        font-weight: bold;
      }
    }
    .table-cell {
      display: table-cell;
      padding: 12px 5px;
      line-height: 24px;
      border-collapse: collapse;
      color: #606266;
      text-align: center;
      vertical-align: middle;
      box-sizing: border-box;
      border-left: 1px solid #e8eaec;
      border-top: 1px solid #e8eaec;
      border-bottom: 1px solid #e8eaec;
    }
    .table-head,
    .table-row {
      position: relative;
      display: table-row;
      border-collapse: collapse;
      vertical-align: middle;
      .table-cell:nth-last-child(1) {
        border-right: 1px solid #e8eaec;
      }
    }
  }
  .inline-img {
    display: inline-block;
    overflow: hidden;
    width: 100px;
    height: 100px;
    border: 1px solid #e8eaec;
    margin: 5px;
    text-align: center;
    &::after {
      content: '';
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
    }
    div {
      color: #999;
      padding: 10px;
    }
  }
  .inline-date {
    display: inline-block;
    word-break: break-all;
  }
  .sign-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .remark {
    text-align: left;
  }
</style>
