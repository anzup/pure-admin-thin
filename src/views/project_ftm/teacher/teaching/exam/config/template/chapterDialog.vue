<template>
  <el-dialog
    v-model="visible"
    width="30%"
    center
    :title="$t('table.selectChapter')"
    :before-close="handleClose"
  >
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      :default-checked-keys="chapterIds"
      ref="tree"
      default-expand-all
      :props="defaultProps"
    >
    </el-tree>
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
  import { questionChapters } from '/@/api/ftm/teacher/examCenter'
  export default {
    name: 'chapterDialog',
    props: ['dialogVisible', 'chapterIds'],
    data() {
      return {
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
      visible: {
        get() {
          return this.dialogVisible
        },
        set(val) {
          this.$emit('update:dialogVisible', val)
        },
      },
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
        questionChapters({
          page: 1,
          size: 1000,
          sort: undefined,
          order: 'asc',
          superiorId: undefined,
          name: undefined,
          level: 1,
        }).then((res) => {
          this.chapterListCache = res.data.content
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
