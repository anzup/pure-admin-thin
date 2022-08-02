<template>
  <div class="itemBankConfiguration">
    <div class="department">
      <el-row>
        <el-col :span="24">
          <div class="departmentBox">
            <ul class="departmentContent">
              <li class="classification">
                <div>
                  <el-divider direction="vertical" />{{ $t('router.itemBankConfiguration') }}
                </div>
              </li>
              <li class="info" v-for="(item, index) in tableData" :key="index">
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
                <el-icon class="edit" v-if="!item.type" @click="editData(index)">
                  <Edit />
                </el-icon>
                <el-icon v-else class="edit" @click="postData(item)">
                  <CircleCheck />
                </el-icon>
                <el-icon class="delete" @click="deleteItem(item, index)">
                  <Delete />
                </el-icon>
              </li>
            </ul>
            <div class="addBtnBox">
              <el-button type="primary" class="addBtn" @click="addTo" :disabled="addFlag">
                <template #icon>
                  <Plus />
                </template>
                {{ $t('button.addTo') }}
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {
    getQuestionBankProperties,
    postQuestionBankProperties,
    putQuestionBankPropertiesId,
    deleteQuestionBankPropertiesId,
  } from '/@/api/ftm/teacher/examCenter'
  import XEUtils from 'xe-utils'
  import { Edit, CircleCheck, Delete, Plus } from '@element-plus/icons-vue'
  export default {
    name: 'itemBankConfiguration',
    components: {
      Edit,
      CircleCheck,
      Delete,
      Plus,
    },
    data() {
      return {
        form: {
          page: 1,
          size: 100,
          sort: undefined,
          order: 'asc',
          searchKey: undefined,
        },
        tableData: [],
        addFlag: false,
      }
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.getQuestionBankProperties()
    },
    methods: {
      getQuestionBankProperties() {
        getQuestionBankProperties(this.form).then((res) => {
          if (res.status == 200) {
            this.tableData = res.data.content
            this.addFlag = false
          }
        })
      },
      editData(index) {
        this.tableData[index].type = 'modify'
      },
      postData(row) {
        if (XEUtils.isEmpty(row.name)) {
          this.$message.warning(this.$t('holder.pleaseEnterAName'))
          return false
        }
        let promies = null
        let data = {
          name: row.name,
          id: undefined,
        }
        if (row.type == 'add') {
          promies = postQuestionBankProperties
        } else {
          promies = putQuestionBankPropertiesId
          data.id = row.id
        }
        promies(data).then((res) => {
          if (res.status == 200) {
            this.$message.success(
              row.type == 'add' ? this.$t('tip.addsuccessTip') : this.$t('tip.editSuccessTip'),
            )
            this.getQuestionBankProperties()
          }
        })
      },
      deleteItem(row, index) {
        if (!row.id) {
          this.tableData.splice(index, 1)
          this.addFlag = false
          return false
        }
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteQuestionBankPropertiesId({ id: row.id }).then((res) => {
            if (res.status == 200) {
              this.getQuestionBankProperties()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      childrenView(id) {
        this.tableData.forEach((v) => {
          if (id == v.id) {
            v.checked = true
          } else {
            v.checked = false
          }
        })
      },
      addTo() {
        this.tableData.push({
          name: '',
          type: 'add',
          checked: false,
        })
        this.addFlag = true
      },
    },
  }
</script>
<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .itemBankConfiguration,
  .department {
    height: 100%;
    .el-row,
    .el-col,
    .departmentBox {
      height: 100%;
    }
  }
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
      height: 100%;
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
            width: calc(60%);
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
            width: calc(60%);
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
