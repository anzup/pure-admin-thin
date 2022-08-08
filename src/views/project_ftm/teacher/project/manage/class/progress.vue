<template>
  <div v-loading="loading">
    <el-scrollbar>
      <el-form inline size="medium">
        <el-form-item :label="$t('table.year')">
          <el-date-picker
            v-model="form.year"
            type="year"
            value-format="YYYY"
            :placeholder="$t('holder.pleaseSelect') + $t('table.year')"
            @change=";(form.groupId = ''), getClazzs()"
          />
        </el-form-item>
        <el-form-item :label="$t('table.classNumber')">
          <!-- 班级课号 -->
          <el-select
            v-model="form.groupId"
            :placeholder="$t('holder.pleaseSelect')"
            @change="clazzTeachSchedule"
            filterable
          >
            <el-option
              v-for="(item, index) in form.groupIdArr"
              :key="index"
              :label="item.courseNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="practice-content-wrap">
        <div class="practice-content">
          <div class="practice-box-wrap" @click="goTo(1)">
            <!-- 1 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[0] && progressData[0].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('table.createClass') }}
              </div>
              <div
                class="practice-box-1"
                :class="{
                  'is-noStart': progressData[0] && progressData[0].progress == 0,
                  'is-white': progressData[0] && progressData[0].progress == 1,
                }"
              >
                <svg-icon :iconClass="'A' + getIcon(progressData[0])" class="svg-icon" />
                <span class="class-name">{{
                  progressData[0] && progressData[0].courseNumber
                }}</span>
                <span class="class-time"
                  >{{ progressData[0] && formatDate(progressData[0].startDate) }} -
                  {{ progressData[0] && formatDate(progressData[0].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[0]"
              :title="progressData[0].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[0].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol(progressData[1])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(2)">
            <!-- 2 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[1] && progressData[1].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('button.addStudent') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[1])"
                :class="{
                  'is-noStart': progressData[1] && progressData[1].progress == 0,
                  'is-progress': progressData[1] && progressData[1].progress < 1,
                  'is-white': progressData[1] && progressData[1].progress == 1,
                }"
              >
                <svg-icon :iconClass="'B' + getIcon(progressData[1])" class="svg-icon" />
                <span class="class-fontw500"
                  >{{ $t('table.classStudent') }}：{{
                    progressData[1] && progressData[1].addedStudentCount
                  }}{{ $t('table.people') }}</span
                >
                <span class="class-time"
                  >{{ progressData[1] && formatDate(progressData[1].startDate) }} -
                  {{ progressData[1] && formatDate(progressData[1].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[1]"
              :title="progressData[1].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[1].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol(progressData[2])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(3)">
            <!-- 3 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[2] && progressData[2].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('table.finishInfo') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[2])"
                :class="{
                  'is-noStart': progressData[2] && progressData[2].progress == 0,
                  'is-progress': progressData[2] && progressData[2].progress < 1,
                  'is-white': progressData[2] && progressData[2].progress == 1,
                }"
              >
                <svg-icon :iconClass="'C' + getIcon(progressData[2])" class="svg-icon" />
                <span class="class-fontw500"
                  >{{ $t('table.finishStudent') }}：{{
                    progressData[2] && progressData[2].finshedCount
                  }}{{ $t('table.people') }}</span
                >
                <!-- <span class="class-time">{{progressData[2] && formatDate(progressData[2].startDate)}} - {{progressData[2] && formatDate(progressData[2].endDate)}}</span> -->
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[2]"
              :title="progressData[2].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[2].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol(progressData[3])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(4)">
            <!-- 4 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[3] && progressData[3].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('table.classGroup') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[3])"
                :class="{
                  'is-noStart': progressData[3] && progressData[3].progress == 0,
                  'is-progress': progressData[3] && progressData[3].progress < 1,
                  'is-white': progressData[3] && progressData[3].progress == 1,
                }"
              >
                <svg-icon :iconClass="'D' + getIcon(progressData[3])" class="svg-icon" />
                <div class="flex-around" v-if="progressData[3]">
                  <span
                    class="class-fontw500"
                    v-for="item in progressData[3].groupings"
                    :key="item.id"
                    >{{ item.name + '：' + item.studentCount }}{{ $t('table.people') }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[3] && formatDate(progressData[3].startDate) }} -
                  {{ progressData[3] && formatDate(progressData[3].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[3]"
              :title="progressData[3].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[3].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <div style="text-align: right">
            <svg-icon
              :iconClass="'g-64' + getIconCol3(progressData[4])"
              class="svg-icon svg-column"
            />
          </div>
          <div class="practice-box-wrap" @click="goTo(5)">
            <!-- 5 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[7] && progressData[7].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('router.flightCBTA') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[7])"
                :class="{
                  'is-noStart': progressData[7] && progressData[7].progress == 0,
                  'is-progress': progressData[7] && progressData[7].progress < 1,
                  'is-white': progressData[7] && progressData[7].progress == 1,
                }"
              >
                <svg-icon :iconClass="'E' + getIcon(progressData[7])" class="svg-icon" />
                <div
                  class="flex-around"
                  v-for="item in progressData[7]?.groupTraingingInfos || []"
                  :key="item.id"
                >
                  <span class="class-fontw500">{{ item.name }}：</span>
                  <span class="class-fontw500"
                    >{{ $t('table.trainingSessions') }}：{{ item.totalCount }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.finishSessions') }}：{{ item.finishedCount }}</span
                  >
                </div>
                <!-- <div class="flex-around">
                <span class="class-fontw500">{{ $t('table.teacherSigning') }}：{{progressData[7] && progressData[7].teacherSignedCount}}</span>
                <span class="class-fontw500">{{ $t('table.studentSign') }}：{{progressData[7] && progressData[7].studentSignedCount}}</span>
              </div> -->
                <span class="class-time"
                  >{{ progressData[7] && formatDate(progressData[7].startDate) }} -
                  {{ progressData[7] && formatDate(progressData[7].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[7]"
              :title="progressData[7].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[7].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol2(progressData[7])"
            class="svg-icon svg-margin-position"
          />
          <!-- 644 -->
          <div class="practice-box-wrap" @click="goTo(6)">
            <!-- 6 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[6] && progressData[6].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('status.theoryExam') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[6])"
                :class="{
                  'is-noStart': progressData[6] && progressData[6].progress == 0,
                  'is-progress': progressData[6] && progressData[6].progress < 1,
                  'is-white': progressData[6] && progressData[6].progress == 1,
                }"
              >
                <svg-icon :iconClass="'F' + getIcon(progressData[6])" class="svg-icon" />
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.examTotalCount') }}：{{
                      progressData[6] && progressData[6].totalCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.completeCount') }}：{{
                      progressData[6] && progressData[6].finshedCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.passCount') }}：{{
                      progressData[6] && progressData[6].passCount
                    }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[6] && formatDate(progressData[6].startDate) }} -
                  {{ progressData[6] && formatDate(progressData[6].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[6]"
              :title="progressData[6].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[6].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol2(progressData[6])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(7)">
            <!-- 7 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[5] && progressData[5].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('router.theorySchedule') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[5])"
                :class="{
                  'is-noStart': progressData[5] && progressData[5].progress == 0,
                  'is-progress': progressData[5] && progressData[5].progress < 1,
                  'is-white': progressData[5] && progressData[5].progress == 1,
                }"
              >
                <svg-icon :iconClass="'G' + getIcon(progressData[5])" class="svg-icon" />
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.totalCourse') }}：{{
                      progressData[5] && progressData[5].totalCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.haveCourse') }}：{{
                      progressData[5] && progressData[5].finshedCount
                    }}</span
                  >
                </div>
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.teacherSigning') }}：{{
                      progressData[5] && progressData[5].teacherSignedCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.studentSign') }}：{{
                      progressData[5] && progressData[5].studentSignedCount
                    }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[5] && formatDate(progressData[5].startDate) }} -
                  {{ progressData[5] && formatDate(progressData[5].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[5]"
              :title="progressData[5].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[5].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol2(progressData[5])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(8)">
            <!-- 8 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[4] && progressData[4].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('table.releaseClassSchedule') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[4])"
                :class="{
                  'is-noStart': progressData[4] && progressData[4].progress == 0,
                  'is-progress': progressData[4] && progressData[4].progress < 1,
                  'is-white': progressData[4] && progressData[4].progress == 1,
                }"
              >
                <svg-icon :iconClass="'H' + getIcon(progressData[4])" class="svg-icon" />
                <span class="class-name">{{
                  progressData[4] && progressData[4].progress == 1
                    ? $t('table.isReleaseClassSchedule')
                    : $t('table.isNotReleaseClassSchedule')
                }}</span>
                <span class="class-time"
                  >{{ progressData[4] && formatDate(progressData[4].startDate) }} -
                  {{ progressData[4] && formatDate(progressData[4].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[4]"
              :title="progressData[4].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[4].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <div>
            <svg-icon
              :iconClass="'g-64' + getIconCol3(progressData[8])"
              class="svg-icon svg-column"
            />
          </div>
          <div class="practice-box-wrap" @click="goTo(9)">
            <!-- 9 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[8] && progressData[8].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('table.flightTest') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[8])"
                :class="{
                  'is-noStart': progressData[8] && progressData[8].progress == 0,
                  'is-progress': progressData[8] && progressData[8].progress < 1,
                  'is-white': progressData[8] && progressData[8].progress == 1,
                }"
              >
                <svg-icon :iconClass="'I' + getIcon(progressData[8])" class="svg-icon" />
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.examTotalCount') }}：{{
                      progressData[8] && progressData[8].totalCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.completeCount') }}：{{
                      progressData[8] && progressData[8].finshedCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.passCount') }}：{{
                      progressData[8] && progressData[8].passCount
                    }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[8] && formatDate(progressData[8].startDate) }} -
                  {{ progressData[8] && formatDate(progressData[8].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[8]"
              :title="progressData[8].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[8].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol(progressData[9])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(10)">
            <!-- 10 -->
            <div class="practice-box">
              <div
                class="title"
                :class="progressData[9] && progressData[9].progress == 0 ? 'is-noStart-title' : ''"
              >
                {{ $t('table.studentEvaluationForm') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[9])"
                :class="{
                  'is-noStart': progressData[9] && progressData[9].progress == 0,
                  'is-progress': progressData[9] && progressData[9].progress < 1,
                  'is-white': progressData[9] && progressData[9].progress == 1,
                }"
              >
                <svg-icon :iconClass="'J' + getIcon(progressData[9])" class="svg-icon" />
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.fillNumber') }}：{{
                      progressData[9] && progressData[9].finshedCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.totalCount') }}：{{
                      progressData[9] && progressData[9].totalCount
                    }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[9] && formatDate(progressData[9].startDate) }} -
                  {{ progressData[9] && formatDate(progressData[9].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[9]"
              :title="progressData[9].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[9].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol(progressData[10])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(11)">
            <!-- 11 -->
            <div class="practice-box">
              <div
                class="title"
                :class="
                  progressData[10] && progressData[10].progress == 0 ? 'is-noStart-title' : ''
                "
              >
                {{ $t('table.trainingMaterial') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[10])"
                :class="{
                  'is-noStart': progressData[10] && progressData[10].progress == 0,
                  'is-progress': progressData[10] && progressData[10].progress < 1,
                  'is-white': progressData[10] && progressData[10].progress == 1,
                }"
              >
                <svg-icon :iconClass="'K' + getIcon(progressData[10])" class="svg-icon" />
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.completeCount') }}：{{
                      progressData[10] && progressData[10].finshedCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.totalCount') }}：{{
                      progressData[10] && progressData[10].totalCount
                    }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[10] && formatDate(progressData[10].startDate) }} -
                  {{ progressData[10] && formatDate(progressData[10].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[10]"
              :title="progressData[10].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[10].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
          <svg-icon
            :iconClass="'g-64' + getIconCol(progressData[11])"
            class="svg-icon svg-margin-position"
          />
          <div class="practice-box-wrap" @click="goTo(12)">
            <!-- 12 -->
            <div class="practice-box">
              <div
                class="title"
                :class="
                  progressData[11] && progressData[11].progress == 0 ? 'is-noStart-title' : ''
                "
              >
                {{ $t('table.graduateTraining') }}
              </div>
              <div
                class="practice-box-1"
                :style="getStyle(progressData[11])"
                :class="{
                  'is-noStart': progressData[11] && progressData[11].progress == 0,
                  'is-progress': progressData[11] && progressData[11].progress < 1,
                  'is-white': progressData[11] && progressData[11].progress == 1,
                }"
              >
                <svg-icon :iconClass="'L' + getIcon(progressData[11])" class="svg-icon" />
                <div class="flex-around">
                  <span class="class-fontw500"
                    >{{ $t('table.endTrainingCount') }}：{{
                      progressData[11] && progressData[11].finshedCount
                    }}</span
                  >
                  <span class="class-fontw500"
                    >{{ $t('table.totalCount') }}：{{
                      progressData[11] && progressData[11].totalCount
                    }}</span
                  >
                </div>
                <span class="class-time"
                  >{{ progressData[11] && formatDate(progressData[11].startDate) }} -
                  {{ progressData[11] && formatDate(progressData[11].endDate) }}</span
                >
              </div>
            </div>
            <div
              class="people"
              v-if="progressData[11]"
              :title="progressData[11].responsiblePersons.map((i) => i.name)"
            >
              {{ $t('table.responsiblePerson') }}：<span
                v-for="item in progressData[11].responsiblePersons"
                :key="item.id"
                :class="item.id == userInfo.id ? 'is-me' : ''"
                >{{ item.name }}、</span
              >
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
  import SvgIcon from './components/svgIcon.vue'
  import { getClazzs, getClazzsId, clazzTeachSchedule } from '/@/api/ftm/teacher/teachingPlan'
  import XEUtils from 'xe-utils'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { deleteEmptyParams } from '../../../../../../utils'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    components: { SvgIcon },
    data() {
      return {
        form: {
          year: '',
          groupId: '',
          groupIdArr: [],
        },
        loading: false,
        progressData: [],
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      totalAuthorities() {
        return this.userInfo.totalAuthorities
      },
    },
    mounted() {
      this.form.groupId = Number(this.$route.query.id)
      this.form.year = this.$route.query.year
      this.getClazzs()
      this.clazzTeachSchedule()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      getClazzs() {
        getClazzs({
          page: 1,
          size: 1000,
          statusIN: 'TRAINING',
          type: 'WET_LEASE',
          year: this.form.year,
          // teacherId: this.userInfo.id,
          // teacherUserId: this.userInfo.userId
        }).then((res) => {
          this.form.groupIdArr = res.data.content
        })
      },
      clazzTeachSchedule() {
        this.loading = true
        clazzTeachSchedule({ id: this.form.groupId })
          .then((res) => {
            this.loading = false
            this.progressData = res.data
          })
          .catch(() => {
            this.loading = false
          })
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd')
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
      getIcon(item) {
        let key = item && item.progress
        switch (key) {
          case 0:
            return 3
          case 1:
            return 1
            break
          default:
            return 2
            break
        }
      },
      getIconCol(item) {
        let key = item && item.progress
        switch (key) {
          case 0:
            return 2
          case 1:
            return 1
            break
          default:
            return 3
            break
        }
      },
      getIconCol2(item) {
        let key = item && item.progress
        switch (key) {
          case 0:
            return 4
          case 1:
            return 5
            break
          default:
            return 6
            break
        }
      },
      getIconCol3(item) {
        let key = item && item.progress
        switch (key) {
          case 0:
            return 9
          case 1:
            return 7
            break
          default:
            return 8
            break
        }
      },
      getStyle(item) {
        if (!item) {
          return {}
        }
        return { backgroundPosition: '0% ' + 202 * (1 - item.progress) + 'px' }
      },
      goTo(index) {
        switch (index) {
          case 1:
          case 2:
          case 3:
            this.routerGo(`manage/${this.form.groupId}`)
            break
          case 4:
            {
              this.routerGo(`manage/${this.form.groupId}`)
            }
            break
          case 5:
            if (!this.totalAuthorities.includes('CBTA_FILL')) {
              return
            }
            this.routerGo(`/myJob/teaching/flight`)
            break
          case 6:
            if (!this.totalAuthorities.includes('EXAM')) {
              return
            }
            this.routerGo(`/myJob/exam/release`)
            break
          case 7:
            if (!this.totalAuthorities.includes('THEORETICAL_SCHEDULE')) {
              return
            }
            this.routerGo(`/myJob/teaching/schedule`)
            break
          case 8:
            this.routerGo(`/myJob/teaching/schedule`)
            break
          case 9:
            if (!this.totalAuthorities.includes('CBTA_FILL')) {
              return
            }
            this.routerGo(`/myJob/teaching/flight`)
            break
          case 10:
            if (!this.totalAuthorities.includes('CBTA_FILL')) {
              return
            }
            this.routerGo(`/myJob/teaching/flight`)
            break
          case 11:
            {
              const courseware =
                this.form.groupIdArr
                  .filter((item) => item.id == this.form.groupId)
                  .map((item) => item.courseNumber)
                  .join() || ''
              const year = this.form.year || ''
              if (!this.totalAuthorities.includes('MY_STUDENTS')) {
                return
              }
              this.routerGo(
                `/myJob/teaching/myStudents?id=${this.form.groupId}&courseNumber=${courseware}&year=${year}`,
              )
            }
            break
          case 12:
            {
              let url = '/project/manage/finish?'
              let query = {
                id: this.form.groupId,
                courseNumber: this.form.groupIdArr
                  .filter((item) => item.id == this.form.groupId)
                  .map((item) => item.courseNumber)
                  .join(),
                year: this.form.year,
              }
              query = deleteEmptyParams(query)
              for (let [key, value] of Object.entries(query)) {
                url += `${key}=${value}&`
              }
              url = url.substring(0, url.length - 1)
              this.routerGo(url)
            }
            break
          default:
            break
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .practice-content-wrap {
    width: 100%;
    overflow-x: auto !important;
  }
  .practice-content {
    width: 1608px; // 1648 - 32 - 50
    margin: auto;
  }
  .practice-box-wrap {
    width: 300px;
    display: inline-block;
    cursor: pointer;
    // margin-bottom: 50px;
  }
  .practice-box {
    width: 300px;
    height: 246px;
    background: #f6f6f7;
    border-radius: 4px;
    display: inline-block;
    .title {
      height: 43px;
      line-height: 43px;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      background: #74a9fc;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .is-noStart-title {
      background: #e6e6e6;
      color: #333;
    }
  }
  .people {
    height: 36px;
    line-height: 36px;
    background: #f4f4f5;
    border-radius: 4px;
    padding: 0 10px;
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .svg-icon {
    display: inline-block;
    font-size: 69px;
  }
  .practice-box-1 {
    height: 203px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-image: url('/@/assets/ftm/progress.png');
    background-repeat: no-repeat;
    background-position: 0% 203px;

    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    .class-name {
      font-size: 18px;
      font-weight: 700;
    }
    .class-time {
      font-size: 12px;
    }
    .class-fontw500 {
      font-weight: 500;
    }
    .flex-around {
      width: calc(100% - 40px);
      line-height: 18px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  .is-white {
    color: #fff;
    background: #4282e8;
  }
  .is-progress {
    color: #333;
  }
  .svg-margin-position {
    margin: 0px 24px;
    position: relative;
    top: -111px;
  }
  .svg-column {
    font-size: 32px;
    margin: 10px 0;
    margin-right: 130px; // 300-12 188
    margin-left: 130px; // 300-12 188
  }
  .is-noStart {
    background: #f6f6f7;
  }
  .is-me {
    color: #5088e1;
  }
</style>
