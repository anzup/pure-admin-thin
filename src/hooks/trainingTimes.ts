/**
 * 授课时段
 */
import to from "await-to-js";
import { ref } from "vue";
import { getTrainingTimes } from "/@/api/trainingTimes";

export default function useTrainingTimes() {
  interface TrainingTimes extends DefaultAllListItem {
    startMinute: number;
    endMinute: number;
    canHide: boolean;
  }

  const trainingTimeList = ref<TrainingTimes[]>([]);

  const getTrainingTimeList = async () => {
    const [err, res] = await to(
      getTrainingTimes({
        size: 1000,
        sort: "startMinute",
        order: "asc"
      })
    );
    if (!err) trainingTimeList.value = res.data.content;
  };

  return {
    trainingTimeList,
    getTrainingTimeList
  };
}
