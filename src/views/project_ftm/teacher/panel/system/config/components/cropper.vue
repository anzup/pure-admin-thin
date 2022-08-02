<template>
  <div class="cropper-content">
    <template v-if="canEdit">
      <div class="cropper-box" v-show="!option.img">
        <label class="cropper-upload" for="fileInput" ref="selectLabel">
          <el-icon class="cropper-icon"><Plus /></el-icon>
          <span class="cropper-upload-t">{{ $t('common.uploadImg') }}</span>
        </label>
        <input
          id="fileInput"
          style="position: absolute; clip: rect(0 0 0 0)"
          type="file"
          accept="image/*"
          @change="selectImg"
        />
      </div>
      <div class="cropper-box" v-show="option.img">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :fixedBox="option.fixedBox"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :height="option.height"
          :infoTrue="option.infoTrue"
          :maxImgSize="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
        />
        <div class="footer-box">
          <label for="fileInput" class="el-button el-button--primary">{{
            $t('button.selectImg')
          }}</label>
          <el-button type="primary" @click="preview">{{ $t('button.create') }}</el-button>
          <!-- <el-button type="primary" @click="upload">{{ $t('button.uploadImg') }}</el-button> -->
        </div>
      </div>
    </template>
    <template v-else>
      <div class="cropper-preview">
        <img :src="option.img" alt="" />
      </div>
    </template>
  </div>
</template>

<script>
  import 'vue-cropper/dist/index.css'
  import { VueCropper } from 'vue-cropper'
  import { blobToDataURL } from '/@/utils/index'
  import { Plus } from '@element-plus/icons-vue'
  export default {
    data() {
      return {
        option: {
          img: '', //裁剪图片的地址
          outputSize: 1, //裁剪生成图片的质量(可选0.1 - 1)
          outputType: 'png', //裁剪生成图片的格式（jpeg || png || webp）
          info: true, //图片大小信息
          canScale: true, //图片是否允许滚轮缩放
          autoCrop: true, //是否默认生成截图框
          autoCropWidth: 300, //默认生成截图框宽度
          // autoCropHeight: 62,  //默认生成截图框高度
          fixed: true, //是否开启截图框宽高固定比例
          fixedNumber: [3.387, 1], //截图框的宽高比例
          full: false, //false按原比例裁切图片，不失真
          fixedBox: false, //固定截图框大小，不允许改变
          canMove: true, //上传图片是否可以移动
          canMoveBox: true, //截图框能否拖动
          original: true, //上传图片按照原始比例渲染
          centerBox: false, //截图框是否被限制在图片里面
          height: true, //是否按照设备的dpr 输出等比例图片
          infoTrue: false, //true为展示真实输出图片宽高，false展示看到的截图框宽高
          maxImgSize: 3000, //限制图片最大宽度和高度
          enlarge: 1, //图片根据截图框输出比例倍数
          mode: '', //图片默认渲染方式
        },
      }
    },
    props: {
      options: {},
      canEdit: false,
    },
    watch: {
      options: {
        deep: true,
        immediate: true,
        handler(option) {
          this.option = Object.assign(this.option, option)
          console.log(this.option)
        },
      },
    },
    components: { VueCropper, Plus },
    methods: {
      selectImg(e) {
        let file = e.target.files[0]
        if (!file || !file.type) return false
        if (!file.type.includes('image'))
          return this.$message.error(this.$t('tip.uploadImgFormatError'))
        blobToDataURL(file, (url) => {
          this.option.img = url
          this.$emit('preview', url)
        })
      },
      preview() {
        this.$refs.cropper.getCropData((data) => {
          this.$emit('preview', data)
        })
      },
      upload(cb) {
        this.$refs.cropper.getCropData((data) => {
          cb(data)
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .cropper-box {
    position: relative;
    width: 500px;
    height: 200px;
    .cropper-upload {
      display: block;
      width: 100%;
      height: 100%;
      user-select: none;
      text-align: center;
      cursor: pointer;
      color: #bbb;
      text-align: center;
      border: 1px dashed #bbb;
      .cropper-icon {
        position: relative;
        // top: 50%;
        margin-top: 10%;
        font-size: 50px;
      }
      .cropper-upload-t {
        display: block;
        margin: 20px 0;
        font-size: 16px;
      }
    }
    .footer-box {
      position: absolute;
      left: 100%;
      top: 0;
      margin-left: 40px;
      :deep(.el-button) {
        display: block;
        margin: 0 0 15px 0;
      }
    }
  }
  .cropper-preview {
    width: 500px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
