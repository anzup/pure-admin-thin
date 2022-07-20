import { defineStore } from 'pinia'
import { store } from '/@/store'
import to from 'await-to-js'
import { getCoursewaresSystemTypes } from '/@/api/ftm/teacher/courseware'

export const useCoursewareStore = defineStore({
  id: 'ftm-courseware',
  state: () => ({
    system: [],
  }),
  getters: {},
  actions: {
    async UPDATE_SYSTEM() {
      if (!this.system.length) {
        const [err, res] = await to(getCoursewaresSystemTypes({}))
        if (!err && res.status === 200) {
          this.system = res.data
        }
      }
      return this.system
    },
  },
})

export function useCoursewareStoreHook() {
  return useCoursewareStore(store)
}
