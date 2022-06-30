<template>
    <VxeTable v-bind="gridOptions" max-height="500">
        <template #pager></template>
    </VxeTable>
</template>

<script lang="ts">
import VxeTable from "/@/components/Table/index.vue";
import { defineComponent, reactive, toRefs, onMounted } from "vue";
import { VxeGridProps } from "vxe-table";
import { useI18n } from "vue-i18n";
// import { getStudentScheduleHis } from "/@/api/roles";
import { useRoute } from "vue-router";
export default defineComponent({
    name: "History",
    components: {
        VxeTable
    },
    setup() {
        const route = useRoute();
        const { t } = useI18n();
        const state = reactive({
            gridOptions: {
                columns: [
                    // { type: "checkbox", width: 50 },
                    { type: "seq", width: 60, title: t("state.seq") },
                    {
                        field: "clazzVO.courseNumber",
                        title: t("state.training_course_no"),
                        // sortable: true,
                        minWidth: 100
                    },
                    {
                        field: "clazzVO.course.name",
                        title: t("state.training_course"),
                        // sortable: true,
                        minWidth: 100
                    },
                    {
                        field: "clazzVO.type",
                        title: t("state.training_type"),
                        // sortable: true,
                        minWidth: 100,
                        formatter: "formatType"
                    },
                    {
                        field: "groupNames",
                        title: t("state.flight_team"),
                        // sortable: true,
                        minWidth: 100
                    },
                    // {
                    //     field: "",
                    //     title: t('state.connection'),
                    //     // sortable: true,
                    //     minWidth: 100,
                    // },
                    {
                        field: "startTime",
                        title: t("state.training_start_time"),
                        // sortable: true,
                        minWidth: 100,
                        formatter: "formatDateTime"
                    },
                    {
                        field: "endTime",
                        title: t("state.training_end_time"),
                        // sortable: true,
                        minWidth: 100,
                        formatter: "formatDateTime"
                    },
                    {
                        field: "theoryTeachers",
                        title: t("state.theory_teacher"),
                        // sortable: true,
                        minWidth: 100
                    },
                    {
                        field: "flightTeachers",
                        title: t("state.flight_instructor"),
                        // sortable: true,
                        minWidth: 100
                    },
                    {
                        field: "student",
                        title: t("state.Identity"),
                        // sortable: true,
                        minWidth: 100,
                        formatter: ({ cellValue }) =>
                            !cellValue ? t("state.teacher") : t("state.student")
                    }
                ],

                data: []
            } as VxeGridProps
        });
        const getStudentSchedule = () => {
            getStudentScheduleHis(+route.query.id).then(res => {
                state.gridOptions.data = res.data;
            });
        };
        onMounted(() => {
            // getStudentSchedule();
        });
        return {
            ...toRefs(state)
        };
    }
});
</script>

<style scoped></style>
