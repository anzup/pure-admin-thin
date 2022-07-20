<template>
  <el-dialog v-model="diaLogShow" :width="fileType == '.pdf' ? '1000px' : '500px'" center>
    <div v-if="fileType == '.pdf'">
      <iframe
        ref="offceIframe"
        id="iframescorm"
        scrolling="no"
        allowfullscreen
        webkitallowfullscreen
        :src="officeUrl"
      />
    </div>
    <div class="iframe-container" v-else>
      <el-image
        v-if="isload"
        style="width: 100%; height: 100%"
        :src="imgUrl"
        :preview-src-list="[imgUrl]"
      />
    </div>
  </el-dialog>
</template>

<script>
  import { getEmployeeQualificationsId } from '/@/api/ftm/teacher/education'
  import { getfileInfo } from '/@/api/ftm/teacher/personCenter'
  export default {
    name: 'fileViewDialog',
    props: {
      aaa: Boolean,
      rowData: Object,
      detailId: [Number, String],
    },
    model: {
      prop: 'aaa',
      event: 'change',
    },
    data() {
      return {
        fileList: [],
        officeUrl: '',
        fileType: undefined,
        imgUrl: undefined,
        isload: false,
      }
    },
    computed: {
      diaLogShow: {
        get() {
          return this.aaa
        },
        set(val) {
          this.$emit('change', val)
        },
      },
    },
    created() {
      let { status } = this.rowData
      this.status = status
      if (status !== 'add') {
        this.getEmployeeQualificationsId()
      }
    },
    methods: {
      getEmployeeQualificationsId() {
        getEmployeeQualificationsId({ id: this.detailId }).then(async (res) => {
          if (res.status == 200) {
            try {
              const { data } = await getfileInfo(res.data.fileUUID)
              this.fileType = data.suffix
              // console.log(data);
              let url = `${import.meta.env.VITE_BASE_API_PUB}/open/${data.uuid}/inline`
              this.imgUrl = url
              this.isload = true
              this.officeUrl = `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
            } catch (error) {
              console.log(error)
            }
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  #iframescorm {
    width: 100%;
    height: 60vh;
  }
</style>
