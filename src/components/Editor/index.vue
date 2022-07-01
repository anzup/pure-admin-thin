<template>
  <div :id="id" :ref="refName"></div>
</template>

<script>
  import { storageLocal } from '/@/utils/storage'
  import E from 'wangeditor'
  import { getStyle } from '/@/utils'

  export default {
    props: {
      /* 编辑器的内容 */
      content: {
        type: String,
        default: '',
      },
      autosize: {
        type: [Boolean, Object],
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      foucs: {
        type: Function,
        default: () => new Function(),
      },
      blur: {
        type: Function,
        default: () => new Function(),
      },
    },
    data() {
      return {
        editor: null,
      }
    },
    computed: {
      randId() {
        return parseInt(Math.random() * 1000)
      },
      id() {
        return 'Editor_' + this.randId
      },
      refName() {
        return 'Editor_' + this.randId
      },
    },
    watch: {
      disabled(bool) {
        this.triggerDisable(bool)
      },
      // content(html) {
      //   this.setHtml(html);
      // }
    },
    mounted() {
      let _this = this
      const editor = new E(`#${this.id}`)
      editor.config.onchange = (newHtml) => {
        this.$emit('input', newHtml)
      }
      editor.config.onblur = (newHtml) => {
        this.blur(newHtml)
      }
      editor.config.onfocus = (newHtml) => {
        this.foucs(newHtml)
      }
      editor.config.placeholder = this.$t('tip.pleaseEnter')
      editor.config.showFullScreen = false
      editor.config.focus = false
      // editor.config.uploadImgHeaders = {
      //   'Authorization': 'Bearer '+ window.sessionStorage.getItem("access_token"),
      //   'Accept-Language': storageLocal.getItem('-locale')?.locale || 'zh-CN'
      // };
      // editor.config.uploadImgShowBase64 = true;
      editor.config.uploadImgServer = `${import.meta.env.VITE_BASE_URL}/pub/api/files/upload`
      editor.config.uploadFileName = 'file'
      editor.config.uploadImgMaxSize = 999 * 1024 * 1024 // 2M
      editor.config.uploadImgHeaders = {
        Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token'),
        'Accept-Language': storageLocal.getItem('-locale')?.locale || 'zh-CN',
      }
      editor.config.uploadImgHooks = {
        customInsert: function (insertImgFn, result) {
          // result 即服务端返回的接口
          console.log('customInsert', result)
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          if (
            typeof result == 'object' &&
            result != null &&
            result != undefined &&
            result.hasOwnProperty('uuid')
          ) {
            insertImgFn(_this.previewURL(result.uuid))
          }
        },
      }

      editor.create()
      this.editor = editor
      this.content && this.setHtml(this.content)
      this.$nextTick(() => {
        this.triggerDisable(this.disabled)
        if (typeof this.autosize == 'boolean' && this.autosize === true) {
          this.$refs[this.refName].querySelector('.w-e-text-container').style.height = 'auto'
        } else if (
          typeof this.autosize == 'object' &&
          this.autosize !== null &&
          this.autosize !== undefined
        ) {
          this.$refs[this.refName].querySelector('.w-e-text-container').style.height = 'auto'
          if (this.autosize.hasOwnProperty('minRows')) {
            let lineHeight = parseInt(
              getStyle(
                this.$refs[this.refName].querySelector('.w-e-text-container'),
                'line-height',
              ) || 0,
            )
            let minRows = parseInt(this.autosize.minRows)
            this.$refs[this.refName].querySelector('.w-e-text').style.minHeight =
              lineHeight * minRows + 'px'
          }
        }
      })
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy()
      this.editor = null
    },
    methods: {
      previewURL(uuid) {
        return `${import.meta.env.VITE_BASE_URL}/pub/api/open/${uuid}/inline`
      },
      getHtml() {
        return this.editor.txt.html()
      },
      setHtml(html) {
        this.editor.txt.html(html)
      },
      getText() {
        return this.editor.txt.text()
      },
      clear() {
        this.editor.txt.clear()
      },
      triggerDisable(bool) {
        if (bool) {
          this.editor.disable()
        } else {
          this.editor.enable()
        }
      },
    },
  }
</script>

<style lang="scss">
  .w-e-toolbar {
    z-index: 11 !important;
  }

  .w-e-text-container {
    z-index: 10 !important;
  }
</style>
