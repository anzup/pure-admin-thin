import { InjectionKey, Ref } from 'vue'

export const setFlagInject: InjectionKey<(val: boolean) => void> = Symbol()
export const setInject: InjectionKey<(val: any) => void> = Symbol()
export const setPlayerInject: InjectionKey<(val: any) => void> = Symbol()
export const setObjInject: InjectionKey<Ref<any>> = Symbol()
