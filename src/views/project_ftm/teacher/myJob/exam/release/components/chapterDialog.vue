<template>
  <el-dialog
    :title="$t('table.selectChapter')"
    center
    v-model="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      ref="tree"
      default-expand-all
      :props="defaultProps"
    />
    <!-- <div class="chapter-body">
      <el-checkbox-group v-model="radioParent" @change="radio = ''">
        <el-checkbox :label="item.id" v-for="item in chapterListParent" :key="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-model="radio">
        <el-checkbox :label="item.id" v-for="item in chapterList" :key="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </div> -->
    <template #footer>
      <el-button @click="handleClose" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
  import { questionChapters, getQuestionBanksChapters } from '/@/api/ftm/teacher/examCenter'
  export default {
    name: 'chapterDialog',
    props: ['dialogVisible', 'questionBankIds'],
    data() {
      return {
        isShow: false,
        id: undefined,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'id',
        },
        chapterListParent: [],
        chapterListCache: [],
        radioParent: [],
        radio: [],
      }
    },
    computed: {
      chapterList() {
        return (
          this.chapterListCache.filter((item) =>
            this.radioParent.includes(item.superior.id == this.radioParent),
          ) || []
        )
      },
      treeData() {
        let treeData = this.chapterListParent
        treeData.forEach((element) => {
          element.children =
            this.chapterListCache.filter((item) => {
              item.children = []
              return item.superior.id == element.id
            }) || []
        })
        console.log(treeData)
        treeData = treeData.filter((item) => item.children && item.children.length)
        return treeData
      },
    },
    mounted() {
      this.questionChaptersParent()
      this.questionChapters()
    },
    methods: {
      questionChaptersParent() {
        questionChapters({
          page: 1,
          size: 1000,
          sort: undefined,
          order: 'asc',
          superiorId: undefined,
          name: undefined,
          level: 0,
        }).then((res) => {
          this.chapterListParent = res.data.content
        })
      },
      questionChapters() {
        let api = null
        api = this.questionBankIds.join() ? getQuestionBanksChapters : questionChapters
        api({
          page: 1,
          size: 1000,
          sort: undefined,
          order: 'asc',
          superiorId: undefined,
          name: undefined,
          level: 1,
          bankIds: this.questionBankIds.join(),
        }).then((res) => {
          this.chapterListCache = this.questionBankIds.join() ? res.data : res.data.content
        })
      },
      handleClose() {
        this.$emit('close')
      },
      handleSave() {
        let data = this.$refs.tree.getCheckedNodes(true) || []
        this.$emit('chapterList', data)
        this.$emit('close')
      },
    },
    watch: {
      questionBankIds(val) {
        this.questionChapters()
      },
    },
  }
</script>
<style lang="scss">
  .chapter-body {
    display: flex;
    // .el-checkbox {
    //   width: 100%;
    //   margin: 10px 0;
    // }
    // .el-checkbox-group {
    //   width: 50%;
    //   border: 1px solid #E6E6E6;
    //   padding: 10px;
    //   margin-right: 10px;
    // }
  }
</style>
