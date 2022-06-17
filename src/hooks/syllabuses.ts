/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-05 10:28:44
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-18 15:16:05
 * @FilePath: \crew-web\src\hooks\syllabuses.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { SyllabusSelfstudyPeriod } from "/@/api/syllabuss";

export default function usesyllabuses() {
  const { t } = useI18n();
  // 课程完成时间的配置列表
  const configList = ref([
    {
      id: "BEFORE_CLAZZ_START",
      name: t("state.beforeShift")
    },
    {
      id: "BEFORE_LAST_EXAM",
      name: t("state.beforeTheExam")
    },
    {
      id: "BEFORE_CLAZZ_END",
      name: t("state.beforeTraining")
    }
  ]);
  const studyPeriodMap: Record<SyllabusSelfstudyPeriod, string> = {
    BEFORE_CLAZZ_START: t("state.beforeClass"),
    BEFORE_CLAZZ_END: t("state.beforeTraining"),
    BEFORE_CERTAIN_COURSE: t("state.beforeAClass"),
    BEFORE_LAST_THEORY_EXAM: t("state.beforeTheTheoryTest")
  };
  return {
    // configList,
    studyPeriodMap
  };
}
