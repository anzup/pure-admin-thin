<template>
  <div>
    <el-scrollbar>
      <div class="questionnaire-box">
        <div class="questionnaire-title">{{ Data.name }}</div>
        <div class="questionnaire-content">
          <section v-for="(clazz, iclazz) in Data.classifications" :key="clazz.id">
            <div class="questionnaire-clazz">{{ toChinaNum(iclazz + 1) }}{{ clazz.name }}</div>
            <fieldset v-for="(question, iquestion) in clazz.questions" :key="iquestion">
              <div class="questionnaire-question">{{ iquestion + 1 }}.{{ question.name }}</div>
              <ul class="questionnaire-answer" v-if="question.type != 'FILL'">
                <li v-for="(option, ioption) in question.options" :key="ioption">
                  <span :class="['bullets', typeFormat(question.type)]" />
                  <label>{{ option.name }}</label>
                </li>
              </ul>
              <div class="questionnaire-textarea" v-else />
            </fieldset>
          </section>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import { getQuestionnairesTemplate } from '/@/api/ftm/teacher/education'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        Data: {},
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        let id = this.$route.query['t_id']
        let [err, res] = await to(getQuestionnairesTemplate({ id }))
        if (!err) {
          let { data } = res
          this.Data = data
        }
      },
      typeFormat(val) {
        switch (val) {
          case 'SINGLE_SELECTION':
            return 'radio-type'
          case 'MULTIPLE_SELECTION':
            return 'checkbox-type'
          default:
            return ''
        }
      },
      toChinaNum(origin) {
        // if(!(getLanguage() + '').includes('zh')) return origin
        const N = [
          this.$t('common.zero'),
          this.$t('common.one'),
          this.$t('common.two'),
          this.$t('common.three'),
          this.$t('common.four'),
          this.$t('common.five'),
          this.$t('common.six'),
          this.$t('common.seven'),
          this.$t('common.eight'),
          this.$t('common.nine'),
        ]
        let number = parseInt(origin)
        let str = ''
        if (Math.floor(number / 100) > 0) {
          str = N[Math.floor(number / 100)] + this.$t('common.hundred')
        }
        number = number % 100
        if (Math.floor(number / 10) > 0) {
          let digit = Math.floor(number / 10)
          str += (digit > 1 ? N[digit] : '') + this.$t('common.ten')
        } else if (number % 100 > 0 && str.length > 0) {
          str += this.$t('common.zero')
        }
        number = number % 10
        if (number > 0) {
          str += N[number]
        }
        return str
      },
    },
  }
</script>

<style scoped lang="scss">
  .questionnaire-box {
    max-width: 1200px;
    margin: 20px auto;
    border: 1px solid #ccc;
    section {
      margin: 20px 0;
    }
    fieldset {
      border: 0;
    }
    .questionnaire {
      &-title {
        padding: 30px 15px 16px 15px;
        font-size: 22px;
        font-weight: bold;
        line-height: 32px;
        text-align: center;
        color: #1ea0fa;
      }
      &-content {
        margin: 0 70px;
        border-top: 1px dashed #ccc;
      }
      &-clazz {
        margin: 10px 0;
        font-size: 19px;
        font-weight: bold;
        line-height: 40px;
        color: #333;
      }
      &-question {
        margin-bottom: 10px;
        font-size: 18px;
        color: #333;
        line-height: 30px;
      }
      &-answer {
        padding-left: 20px;
        list-style: none;
        .bullets {
          position: absolute;
          top: 12px;
          left: -20px;
          width: 12px;
          height: 12px;
          transform: translateY(-50%);
          &.radio-type {
            border-radius: 6px;
            border: 1px solid #333;
          }
          &.checkbox-type {
            border: 1px solid #333;
          }
        }
        li {
          position: relative;
          margin: 10px 0;
        }
        label {
          font-weight: normal;
          font-size: 16px;
          color: #333;
          line-height: 24px;
        }
      }
      &-textarea {
        width: 100%;
        height: 130px;
        border: 1px solid #ccc;
      }
    }
  }
</style>
