<template>
  <div class="w-72">
    <el-progress v-for="(item, index) in waitUploadFils" :key="index" :percentage="item.progress" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import request from '/@/utils/request'
  import axios from 'axios'
  import to from 'await-to-js'

  interface ResponseFileType {
    id: number
    name: string
    size: number
    suffix: string
    url: string
    uuid: string
    playFilePath: string
    fileType: string
  }

  interface Props {
    files: File[]
    // 上传成功后的回调事件
    onSuccess?: (data: ResponseFileType[]) => void
    // 上传成功后的回调事件
    onError?: (data: any) => void
    // 上传成功后的回调事件
    onFinallY?: (data: ResponseFileType[]) => void
  }

  interface FileType {
    file: File
    cancel: any
    progress: number
  }

  const props = defineProps<Props>()
  const waitUploadFils = $ref<FileType[]>(
    props.files.map((v) => ({ file: v, cancel: undefined, progress: 0 })),
  )

  const uploadFile = async (val: FileType): Promise<any> => {
    const data = new FormData()
    data.append('file', val.file)
    const [err, res] = await to(
      request<ResponseFileType>({
        method: 'post',
        url: (import.meta.env.VITE_BASE_API_PUB as string) + '/files/upload',
        headers: { 'Content-Type': 'multipart/form-data' },
        P_repeatRequestCancel: false,
        cancelToken: new axios.CancelToken(function (c) {
          val.cancel = c
        }),
        onUploadProgress: function (e) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            var rate = Math.round(Number(((e.loaded / e.total) * 100).toFixed(2))) //已上传的比例
            if (rate < 100) {
              //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
              //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
              //等响应回来时，再将进度设为100%
              val.progress = rate
            } else {
              val.progress = 99
            }
          }
        },
        data,
      }),
    )
    if (err) {
      return Promise.reject(err)
    }
    val.progress = 100
    return Promise.resolve(res.data)
  }
  onMounted(() => {
    if (waitUploadFils.length > 0) {
      Promise.allSettled(
        waitUploadFils.map((item) => {
          return uploadFile(item)
        }),
      ).then((res) => {
        const fileInfos = res.filter((v) => v.status === 'fulfilled').map((v: any) => v!.value)
        if (fileInfos.length === waitUploadFils.length && props.onSuccess)
          props.onSuccess(fileInfos)
        else if (fileInfos.length === 0 && props.onError) props.onError(res)
        props.onFinallY(fileInfos)
      })
    }
  })
</script>

<style scoped></style>
