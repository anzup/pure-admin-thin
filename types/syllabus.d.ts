declare namespace Syllabus {
    // 排课模板
    export type SyllabusType = "FLIGHT_PRACTICE" | "GROUND_THEORY";
    interface TemplateItems {
        id: number;
        period: number;
        sortNumber: number;
        startTime: string;
        syllabusItemId: number;
        syllabusItemName: string;
        type: SyllabusType;
        [_: string]: any;
    }


    interface SyllabusTemplate {
        enabled?: boolean;
        id?: number;
        name: string;
        needGroup?: boolean;
        type?: SyllabusType;
        syllabusId: number;
        facilityId?: number;
        dataType?: "template";
        templateItems: Array<TemplateItems>;
        templateStatus?: 0 | 1 | 2;
        groupName?: string;
        total: number;
        num: number;
        startDate: string;
    }
}
