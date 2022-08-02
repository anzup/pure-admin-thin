<template>
  <el-scrollbar>
    <div class="user-con">
      <div class="student-con item-con">
        <el-card class="box-card" :header="$t('text.students_to_be_grouped')">
          <div class="components-con">
            <el-scrollbar>
              <div class="main-con">
                <div v-for="item in form.unselectedStudents" :key="item.id">
                  <el-button
                    v-show-tips="item.name"
                    class="info unselectedStudents infoBkg"
                    :data-id="item.id"
                    :data-name="item.name"
                    :data-customer-id="item.customerId"
                    type="primary"
                    >{{ unselectedStudentName(item.name) }}</el-button
                  >
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </div>
      <div class="teacher-con item-con">
        <el-card class="box-card" style="width: 500px" :header="$t('text.faculty_to_be_selected')">
          <div class="components-con">
            <el-scrollbar>
              <div class="main-con">
                <div v-for="item in form.unselectedTeachers || []" :key="item.id">
                  <el-button
                    v-show-tips="item.name"
                    :type="item.selectedByOtherClazz ? 'danger' : 'success'"
                    :class="['info', 'unselectedTeachers']"
                    :data-id="item.id"
                    :data-name="item.name"
                    :data-customerId="item.customerId"
                  >
                    {{ unselectedStudentName(item.name) }}
                  </el-button>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </div>
    </div>
    <div class="user-con">
      <div class="item-con">
        <el-card class="box-card" :header="$t('text.grouping')">
          <el-row class>
            <el-col :span="8" v-for="(item, index) in form.groupings || []" :key="index">
              <el-card :header="item.name" class="item">
                <div class="box" @dragover="dragoverTd" @drop="dropTd($event, index, item)">
                  <el-scrollbar>
                    <div class="main-con teacher-con">
                      <div
                        v-for="(teacherId, teacherIndex) in item.teachers || []"
                        :key="teacherIndex"
                      >
                        <el-button
                          type="success"
                          class="info grouping-button"
                          v-show-tips="teacherId.name"
                        >
                          <div class="text-con">
                            <span>
                              {{ unselectedStudentName(teacherId.name) }}
                            </span>
                            <i
                              class="close-info el-icon-close"
                              @click="removeDropTd(item.teachers, teacherId, 'teachers')"
                            />
                          </div>
                        </el-button>
                      </div>
                    </div>
                    <div class="main-con">
                      <div
                        v-for="(studentId, studentIndex) in item.students || []"
                        :key="studentIndex"
                        v-show-tips="studentId.name"
                      >
                        <el-button type="primary" class="info grouping-button infoBkg">
                          <div class="text-con">
                            <span>
                              {{ unselectedStudentName(studentId.name) }}
                            </span>
                            <i
                              class="close-info el-icon-close"
                              @click="removeDropTd(item.students, studentId, 'students')"
                            />
                          </div>
                        </el-button>
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
    <div class="footer-container">
      <el-button type="primary" @click="confirm">{{ $t('message.hssave') }}</el-button>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { getBytesLength, sliceBytesLength } from '/@/utils/utils'
  import { inject, onMounted, reactive, toRefs, nextTick } from 'vue'
  import { getGroupingsOperateList, postGroupingsOperate } from '/@/api/opm/train'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const clazzId = inject<string>('clazzId')
  const state = reactive({
    form: {
      clazz: [],
      groupings: [],
      unselectedStudents: [],
      unselectedTeachers: [],
    },
  })
  const { form } = toRefs(state)
  const getList = async () => {
    await getGroupingsOperateList(clazzId).then((res) => {
      state.form.clazz = res.data.clazz
      state.form.groupings = res.data.groupings
      state.form.unselectedStudents = res.data.unselectedStudents
      state.form.unselectedTeachers = res.data.unselectedTeachers
    })
  }

  // 编辑删除
  function removeDropTd(list, item, type) {
    let _index = list.findIndex((v) => v.id == item.id)
    list.splice(_index, 1)
    // 区分学员/教员  将删除的元素添加到对应列表
    let typeName = (type == 'students' && 'unselectedStudents') || 'unselectedTeachers'

    state.form[typeName].push(item)
    bindDrop()
  }
  // 绑定拖拽事件
  function bindDrop() {
    nextTick(() => {
      const studentSpan = document.querySelectorAll(
        '.unselectedStudents',
      ) as NodeListOf<HTMLElement>
      const teacherSpan = document.querySelectorAll(
        '.unselectedTeachers',
      ) as NodeListOf<HTMLElement>
      studentSpan.forEach((item) => {
        item.draggable = true
        item.addEventListener('dragstart', dragstartStudentSpan)
        item.addEventListener('dragend', dragendStudentSpan)
      })
      teacherSpan.forEach((item) => {
        item.draggable = true
        item.addEventListener('dragstart', dragstartTeacherSpan)
        item.addEventListener('dragend', dragendTeacherSpan)
      })
    })
  }
  function dragstartStudentSpan(event) {
    // 源元素 拖动开始
    event.target.style.opacity = 0.5
    const dataset = event.target.dataset
    const data = {
      id: dataset.id,
      name: dataset.name,
      customerId: dataset.customerId,
      type: 'student',
    }
    event.dataTransfer.setData('data', JSON.stringify(data))
  }
  function dragendStudentSpan(event) {
    // 源元素 拖动结束
    event.target.style.opacity = 1
  }
  function dragstartTeacherSpan(event) {
    event.target.style.opacity = 0.5
    const dataset = event.target.dataset
    const data = {
      id: dataset.id,
      name: dataset.name,
      type: 'teacher',
    }
    event.dataTransfer.setData('data', JSON.stringify(data))
  }
  function dragendTeacherSpan(event) {
    event.target.style.opacity = 1
  }
  // 底部分组接收拖动元素
  function dropTd(
    event,
    i: number,
    item: {
      num: number
      students: any[]
      name: string
      teachers: any[]
      customerId: number
    },
  ) {
    const data = JSON.parse(event.dataTransfer.getData('data'))

    // 1.区分到底是学员 or 教员  2.原数组要删除当前元素
    if (data.type == 'student') {
      if (item.students.length >= item.num) {
        return ElMessage.warning(
          `${t('text.groups') + item.name}${t('text.the_number_of_people_is_limited_to')}${
            item.num
          }`,
        )
      }
      // 如果当前分组里面的人数不为空，则判断当前拖动的学员跟已有学员是否是同一个
      if (
        state.form.groupings[i].students.length > 0 &&
        state.form.groupings[i].students[0].customerId !== data.customerId
      )
        return ElMessage.warning(t('tip.customers_with_the_same_group'))

      state.form.groupings[i].students.push(data)
      const _index = state.form.unselectedStudents.findIndex((x) => x.id == data.id)
      state.form.unselectedStudents.splice(_index, 1)
    } else {
      if (item.teachers.length >= 1) {
        return ElMessage.warning(
          `${t('text.groups') + item.name}${t('text.the_number_of_teachers_is_limited_to')}${1}`,
        )
      }
      state.form.groupings[i].teachers.push({
        id: data.id,
        name: data.name,
      })
      const _index = state.form.unselectedTeachers.findIndex((x) => x.id == data.id)
      state.form.unselectedTeachers.splice(_index, 1)
    }
  }

  function dragoverTd(event) {
    // 可拖动元素正在拖动到放置目标元素时触发
    event.dataTransfer.dropEffect = 'link'
    event.preventDefault()
  }
  // 保存
  function confirm() {
    postGroupingsOperate({
      clazzId,
      groupings: state.form.groupings.map((v) => {
        const { id, name, num, students, teachers } = v
        return {
          id,
          name,
          num,
          studentIds: students.map((i) => i.id),
          teacherIds: teachers.map((i) => i.id),
        }
      }),
    }).then(() => {
      ElMessage.success(t('message.save_succeeded'))
    })
  }
  function unselectedStudentName(name: string) {
    const length = getBytesLength(name)
    // 最多4个汉字
    if (length > 8) {
      return sliceBytesLength(name, 8)
    } else {
      return name
    }
  }

  onMounted(async () => {
    await getList()
    bindDrop()
  })
</script>

<style scoped lang="scss">
  :deep(.el-card__header),
  :deep(.el-card__body) {
    padding: 10px 10px;
  }
  :deep(.el-button) {
    width: 100px;
  }
  .user-con {
    display: flex;
    margin-bottom: 10px;
    .item-con {
      flex-grow: 1;
      &.teacher-con {
        flex-grow: 0;
      }
      &.student-con {
        padding-right: 10px;
      }
      .components-con {
        height: 200px;

        &.grouping-con {
          display: flex;
        }
      }
    }
  }
  .grid-container {
    display: flex;
    outline: 1px solid red;
    min-height: 50px;
  }
  .item {
    :deep(.el-card__body) {
      height: 220px;
      display: flex;
      .box {
        flex: 1;
      }
    }
  }
  .main-con {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    &.teacher-con {
      margin-bottom: 10px;
    }
  }

  .infoBkg1 {
    background: #6dd4cd;
  }
  .infoBkg2 {
    background: #ff3a3a;
  }
  .info {
    padding: 10px;
    &.grouping-button {
      width: 115px;
      .text-con {
        display: flex;
        justify-content: space-between;
        span {
          flex: 1;
        }
      }
    }
    i {
      margin-left: 10px;
      // color: #333;
      // &:hover {
      //     transform: rotate(90);
      // }
    }
  }
</style>
