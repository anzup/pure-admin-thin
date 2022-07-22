<template>
  <div class="department">
    <el-row :gutter="22">
      <el-col :span="12">
        <div class="departmentBox">
          <ul class="departmentContent">
            <li class="classification">
              <div><el-divider direction="vertical" />{{ $t('table.primaryClassification') }}</div>
            </li>
            <li class="info" v-for="(item, index) in departments" :key="index">
              <span
                v-if="!item.type"
                :class="[item.checked ? 'checkedTitle' : 'defuTitle', 'title']"
                @click="childrenView(item.id)"
                >{{ item.name }}</span
              >
              <el-input
                v-else
                class="titleText"
                :placeholder="$t('holder.pleaseEnterAName')"
                v-model="item.name"
                clearable
              />
              <el-icon
                v-if="!item.type"
                class="edit"
                @click="putCoursewarePropertiesIdEvent(index)"
              >
                <Edit />
              </el-icon>
              <el-icon v-else class="edit" @click="postCoursewarePropertiesEvent(item)">
                <CircleCheck />
              </el-icon>
              <el-icon
                class="delete"
                @click="deleteCoursewarePropertiesIdEvent(item.id, index, 'parent')"
              >
                <Delete />
              </el-icon>
            </li>
          </ul>
          <div class="addBtnBox">
            <el-button type="primary" class="addBtn" @click="addTo" :disabled="addFlag">
              <template #icon>
                <el-icon><CirclePlus /></el-icon>
              </template>
              {{ $t('button.addTo') }}
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="departmentBox">
          <ul class="departmentContent">
            <li class="classification">
              <div>
                <el-divider direction="vertical" />{{ childrenName }}&nbsp;&nbsp;{{
                  $t('table.subcategory')
                }}
              </div>
            </li>
            <li class="info" v-for="(item, index) in childrenData" :key="index">
              <span v-if="item && !item.type">
                <span class="title defuTitle">{{ item.name }}</span>
                <el-icon class="edit" @click="childrenModify(index)">
                  <Edit />
                </el-icon>
              </span>
              <span v-if="item && item.type">
                <el-input
                  class="titleText"
                  :placeholder="$t('holder.pleaseEnterAName')"
                  v-model="item.name"
                  clearable
                />
                <el-icon class="edit" @click="postDepartmentschildren(item)">
                  <CircleCheck />
                </el-icon>
              </span>
              <el-icon
                class="delete"
                @click="deleteCoursewarePropertiesIdEvent(item.id, index, 'children')"
              >
                <Delete />
              </el-icon>
            </li>
          </ul>
          <div class="addBtnBox">
            <el-button
              type="primary"
              class="addBtn"
              @click="childrenAddTo"
              :disabled="addChildrenFlag"
            >
              <template #icon>
                <el-icon><CirclePlus /></el-icon>
              </template>
              {{ $t('button.addTo') }}
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getCoursewareProperties,
    postCoursewareProperties,
    putCoursewarePropertiesId,
    deleteCoursewarePropertiesId,
  } from '/@/api/ftm/teacher/courseware'
  import XEUtils from 'xe-utils'
  import { CirclePlus, Delete, Edit, CircleCheck } from '@element-plus/icons-vue'
  export default {
    name: 'Department',
    components: {
      CirclePlus,
      Delete,
      Edit,
      CircleCheck,
    },
    data() {
      return {
        form: {
          page: 1,
          size: 1000,
          sort: undefined,
          order: 'asc',
          superiorId: undefined,
          name: undefined,
          level: 0,
        },
        departments: [],
        childrenData: [],
        superiorId: undefined,
        addFlag: false, // 一级分类添加标识
        addChildrenFlag: false, //二级分类添加标识
      }
    },
    computed: {
      childrenName() {
        return this.departments.filter((v) => v.checked).length !== 0
          ? this.departments.filter((v) => v.checked)[0].name
          : ''
      },
    },
    created() {
      this.getCoursewarePropertiesEvent()
    },
    methods: {
      getCoursewarePropertiesEvent(id) {
        this.addFlag = false
        getCoursewareProperties(this.form).then((res) => {
          if (res.status == 200) {
            this.departments = res.data.content
            this.$nextTick(() => {
              this.departments.forEach((v, i) => {
                v.checked = false
                if (id) {
                  this.childrenView(id, true)
                } else {
                  if (i == 0) {
                    this.childrenView(v.id, true)
                  }
                }
              })
            })
          }
        })
      },
      deleteCoursewarePropertiesIdEvent(id, index, type) {
        if (!id) {
          if (type == 'children') {
            this.childrenData.splice(index, 1)
            this.addChildrenFlag = false
          } else {
            this.departments.splice(index, 1)
            this.addFlag = false
          }
          return false
        }
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursewarePropertiesId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (this.superiorId == id) {
                this.getCoursewarePropertiesEvent() // 如果删除自身 默认选中
              } else {
                this.getCoursewarePropertiesEvent(this.superiorId)
              }

              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      postCoursewarePropertiesEvent(row) {
        if (XEUtils.isEmpty(row.name)) {
          this.$message.warning(this.$t('holder.pleaseEnterDepartmentName'))
          return false
        }
        let promies = null
        let data = {
          superiorId: undefined,
          name: row.name,
          id: undefined,
        }
        if (row.type == 'add') {
          promies = postCoursewareProperties
        } else {
          promies = putCoursewarePropertiesId
          data.id = row.id
        }
        promies(data).then((res) => {
          if (res.status == 200) {
            this.$message.success(
              row.type == 'add' ? this.$t('tip.addsuccessTip') : this.$t('tip.editSuccessTip'),
            )
            if (row.type !== 'add') {
              this.getCoursewarePropertiesEvent(data.id)
            } else {
              this.getCoursewarePropertiesEvent()
            }
          }
        })
      },
      postDepartmentschildren(row) {
        if (XEUtils.isEmpty(row.name)) {
          this.$message.warning(this.$t('holder.pleaseEnterDepartmentName'))
          return false
        }
        let promies = null
        let data = {
          superiorId: undefined,
          name: row.name,
          id: undefined,
        }
        if (row.type == 'add') {
          promies = postCoursewareProperties
          data.superiorId = this.superiorId
        } else {
          promies = putCoursewarePropertiesId
          data.id = row.id
        }
        promies(data).then((res) => {
          if (res.status == 200) {
            this.$message.success(
              row.type == 'add' ? this.$t('tip.addsuccessTip') : this.$t('tip.editSuccessTip'),
            )
            this.childrenView(this.superiorId, true)
            this.addChildrenFlag = false
          }
        })
      },
      putCoursewarePropertiesIdEvent(index) {
        this.departments[index].type = 'modify'
      },
      childrenModify(index) {
        this.childrenData[index].type = 'modify'
      },
      addTo() {
        this.departments.push({
          name: '',
          type: 'add',
          checked: false,
        })
        this.addFlag = true
      },
      childrenView(id, checked) {
        this.departments.forEach((v) => {
          if (id == v.id) {
            this.superiorId = id
            if (!checked) {
              v.checked = !v.checked
            } else {
              v.checked = checked
            }
          } else {
            v.checked = false
          }
        })

        if (this.superiorId) {
          getCoursewareProperties({ superiorId: id }).then((res) => {
            if (res.status == 200) {
              this.childrenData = res.data.content
            }
          })
        } else {
          this.childrenData = []
        }
      },
      childrenAddTo() {
        this.childrenData.push({
          name: '',
          type: 'add',
        })
        this.addChildrenFlag = true
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .department {
    ul,
    li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .departmentBox {
      position: relative;
      background: #fff;
      height: calc(100vh - 132px);
      padding: 16px;
      .departmentContent {
        width: 100%;
        overflow: auto;
        height: 90%;
        scrollbar-width: none;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        .classification {
          > div {
            font-size: 14px;
            height: 44px;
            line-height: 44px;
            background: #fafafa;
            background: $textBg;
            color: $elButtonBg;
            font-weight: 700;
            padding-left: 10px;
            .el-divider--vertical {
              width: 2px;
              height: 12px;
              vertical-align: unset;
              background: $elButtonBg;
            }
          }
        }
        .info {
          margin: 16px;
          line-height: 36px;
          .title {
            width: calc(100% - 150px);
            height: 36px;
            line-height: 36px;
            border: 1px solid #215ebe;
            display: inline-block;
            text-align: left;
            padding: 0 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            // padding: 0 40px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: top;
          }
          .checkedTitle {
            background: #215ebe;
            color: #fff;
          }
          .defuTitle {
            color: #215ebe;
            background: #fff;
          }
          .titleText {
            width: calc(100% - 150px);
            :deep(.el-input__inner) {
              height: 36px;
              line-height: 36px;
            }
          }
          .edit {
            color: #215ebe;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            margin-left: 16px;
            margin-right: 16px;
          }
          .delete {
            color: #d44949;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
          }
        }
        .title:active {
          background: #215ebe;
          color: #fafafa;
        }
      }
      .addBtnBox {
        height: 54px;
        position: absolute;
        left: 0;
        bottom: 0;
        .addBtn {
          margin-left: 36px;
        }
      }
    }
    .departmentContent::-webkit-scrollbar {
      display: none;
    }
  }
</style>
