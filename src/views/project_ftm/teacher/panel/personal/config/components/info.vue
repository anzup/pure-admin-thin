<template>
  <div>
    <div class="table_container">
      <el-form ref="form" :model="form">
        <table width="100%">
          <tr>
            <td colspan="6">
              <h2 class="table_title">飞行学员登记表</h2>
            </td>
          </tr>
          <tbody>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'姓名（中文）'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" disabled />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'航空公司'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td rowspan="8" class="img_con">
                <el-image style="width: 100%; height: 300px" :src="url" fit="cover" />
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'姓名（汉语拼音）'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'性别'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'出生日期'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'政治面貌'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'出生地（省）'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'身份证号'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'签发地点（省）'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'身份证有效期'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'课程号'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'组别'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'课程类型'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'课程开始时间'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'入住酒店'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title title_width">
                <el-form-item :label="'联系电话'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <!-- 下半部分 -->
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'毕业院校'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title">
                <el-form-item :label="'培养方式'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'毕业前专业'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title">
                <el-form-item :label="'执照类型'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'发照机关'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title">
                <el-form-item :label="'执照号码'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'曾飞机型'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title">
                <el-form-item :label="'总飞行小时'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'改装前机型'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
              <td class="form_title">
                <el-form-item :label="'飞行小时数'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width" colspan="3">
                <el-form-item :label="'是否参加过ELT培训'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-input v-model="form.name" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="form_title title_width">
                <el-form-item :label="'学员签名'" />
              </td>
              <td class="form_content" colspan="2">
                <el-form-item>
                  <el-image style="width: 300px; height: 100px" :src="url" fit="cover" />
                </el-form-item>
              </td>
              <td class="form_title">
                <el-form-item :label="'飞行训练部负责人签名'" />
              </td>
              <td class="form_content">
                <el-form-item>
                  <el-image style="width: 300px; height: 100px" :src="url" fit="cover" />
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: 'adhasdhlasdnnLhasdl',
        },
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      }
    },
  }
</script>

<style lang="scss" scoped>
  .table_container {
    margin: 0 auto;
    width: 1200px;
    // background-color: aquamarine;
    min-height: 200px;
    margin-bottom: 50px;
    table,
    th,
    td {
      border-collapse: collapse;
      border: 1px solid #a5a5a5;
    }
    .table_title {
      text-align: center;
    }
    tbody {
      .title_width {
        width: 170px;
      }
      .form_title {
        // width: 170px;
        padding-left: 20px;
        :deep(.el-form-item) {
          margin-bottom: 0;
          // width: 100px;
          :deep(.el-form-item__content) {
            display: none;
          }
        }
      }
      .form_content {
        :deep(.el-form-item) {
          margin-bottom: 0;
        }
      }
      .img_con {
        width: 300px;
        padding: 20px;
      }
    }
    :deep(.el-form-item) {
      margin-bottom: 0 !important;
    }
    :deep(.el-input__inner) {
      border: 0 !important;
      border-radius: 0px;
    }
  }
</style>
