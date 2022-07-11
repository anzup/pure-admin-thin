<template>
  <div>
    <el-form :model="form" ref="formRef" class="demo-dynamic" inline>
      <el-form-item>
        <el-button type="primary" @click="addDomain">{{ $t('text.new_group') }}</el-button>
        <!-- <el-button @click="resetForm('form')">重置</el-button> -->
      </el-form-item>

      <el-row>
        <el-col :span="12" v-for="(domain, index) in form.groupingAddBOS" :key="domain.key">
          <el-form-item
            :label="$t('text.group_name')"
            :prop="'groupingAddBOS.' + index + '.name'"
            :rules="{
              required: true,
              message: $t('text.name_cannot_be_empty'),
              trigger: 'blur',
            }"
          >
            <el-input v-model="domain.name" />
          </el-form-item>
          <el-form-item
            :label="$t('text.number_of_teams')"
            :prop="'groupingAddBOS.' + index + '.num'"
            :rules="{
              required: true,
              message: $t('text.group_number_cannot_be_empty'),
              trigger: 'blur',
            }"
          >
            <el-input-number v-model="domain.num" :min="1" />
          </el-form-item>
          <el-form-item>
            <el-button @click.prevent="removeDomain(domain)">{{
              $t('message.hsdelete')
            }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue'

  export default defineComponent({
    name: 'Grouping',
    props: {
      modelValue: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const list = computed<any[]>({
        get() {
          return props.modelValue
        },
        set(val) {
          emit('update:modelValue', val)
        },
      })
      watch(list, (val) => {
        state.form.groupingAddBOS = val
      })
      const formRef = ref()
      const state = reactive({
        form: {
          groupingAddBOS: list.value,
        },
        rules: {},
      })
      const methods = reactive({
        async submitForm() {
          return await formRef.value.validate()
        },
        resetForm() {
          // state.$refs[formName].resetFields();
        },
        removeDomain(item) {
          var index = state.form.groupingAddBOS.indexOf(item)
          if (index !== -1) {
            state.form.groupingAddBOS.splice(index, 1)
          }
        },
        addDomain() {
          const name =
            state.form.groupingAddBOS.length > 0
              ? state.form.groupingAddBOS[state.form.groupingAddBOS.length - 1].name
              : ''
          state.form.groupingAddBOS.push({
            num: 1,
            key: Date.now(),
            name:
              state.form.groupingAddBOS.length == 0
                ? String.fromCharCode(65 + state.form.groupingAddBOS.length)
                : String.fromCharCode(name[name.length - 1].charCodeAt(0) + 1),
          })
        },
      })
      return {
        formRef,
        ...toRefs(state),
        ...toRefs(methods),
      }
    },
  })
</script>

<style scoped></style>
