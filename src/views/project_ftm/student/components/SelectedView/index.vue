<template>
  <div class="selectedConetent">
    <el-icon class="warning">
      <Warning />
    </el-icon>
    <div class="selected">
      {{ $t('common.selected') }}<span class="num">{{ num }}</span
      >{{ $t('common.sum') }}
    </div>
    <div class="clear" @click="clearAll">{{ $t('common.clear') }}</div>
  </div>
</template>

<script>
  import { Warning } from '@element-plus/icons-vue'
  export default {
    name: 'selectedView',
    components: { Warning },
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
      color: #17afff;
      margin-left: 16px;
    }
    .selected {
      margin-left: 8px;
      margin-right: 24px;
      font-size: 18px;
      .num {
        color: #17afff;
        display: inline-block;
        padding: 0 10px;
      }
    }
    .clear {
      color: #17afff;
      cursor: pointer;
      font-size: 18px;
    }
  }
</style>
