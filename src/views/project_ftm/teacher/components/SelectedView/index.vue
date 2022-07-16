<template>
  <div class="selectedConetent">
    <i class="el-icon-warning warning" />
    <div class="selected">
      {{ $t('common.selected') }}<span class="num">{{ num }}</span
      >{{ $t('common.sum') }}
    </div>
    <div class="clear" @click="clearAll">{{ $t('common.clear') }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      num: [Number, String],
    },
    methods: {
      clearAll() {
        this.$emit('clearAll')
      },
    },
  }
</script>

<style scoped lang="scss">
  .selectedConetent {
    height: 40px;
    line-height: 40px;
    background: #e6f7ff;
    display: flex;
    align-items: center;
    .warning {
      font-size: 24px;
      color: #215ebe;
      margin-left: 16px;
    }
    .selected {
      margin-left: 8px;
      margin-right: 24px;
      font-size: 14px;
      .num {
        color: #215ebe;
        display: inline-block;
        padding: 0 10px;
      }
    }
    .clear {
      color: #215ebe;
      cursor: pointer;
      font-size: 14px;
    }
  }
</style>
