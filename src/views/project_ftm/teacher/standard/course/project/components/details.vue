<template>
  <el-dialog
    :title="$t('button.details')"
    v-model="dialogVisible"
    :before-close="cancel"
    center
    width="500px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('table.courseName') + ':'" prop="name">
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item :label="$t('table.courseNumber') + ':'" prop="code">
        {{ ruleForm.code }}
      </el-form-item>
      <el-form-item :label="$t('table.trainingModel') + ':'" prop="airplaneTypes">
        <el-select
          v-model="ruleForm.airplaneTypes"
          :placeholder="$t('holder.pleaseSelect')"
          style="width: 90%"
          filterable
          multiple
          disabled
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in airplaneTypesAll"
            :key="item.index"
          />
        </el-select>
        <!-- <el-checkbox-group v-model="ruleForm.airplaneTypes">
              <el-checkbox :label="item" v-for="item in airplaneTypesAll" :key="item.index"></el-checkbox>
            </el-checkbox-group> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getAirplaneTypesAll, getCoursesId } from '/@/api/ftm/teacher/trainingPlan'
  export default {
    props: ['dialogVisible', 'id'],
    data() {
      return {
        airplaneTypesAll: [],
        ruleForm: {
          name: '',
          code: '',
          airplaneTypes: [],
        },
        rules: {},
      }
    },
    watch: {
      id() {
        this.getCoursesId()
      },
    },
    created() {
      this.getAirplaneTypesAll()
      if (this.id) {
        this.getCoursesId()
      }
    },
    methods: {
      getAirplaneTypesAll() {
        getAirplaneTypesAll().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancel')
      },
      getCoursesId() {
        getCoursesId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.name = res.data.name
            this.ruleForm.code = res.data.code
            this.ruleForm.airplaneTypes = res.data.airplaneTypes
          }
        })
      },
    },
  }
</script>
