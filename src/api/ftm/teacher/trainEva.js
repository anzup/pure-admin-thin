import http from "@/utils/http"
const baseURL = process.env.VUE_APP_BASE_API_PUB

function _params(sw = {}) {
    const searchWhere = {
        size: 10,
        page: 1,
        sort: 'id',
        order: 'asc',
        keyWord: undefined
    }
    const Interface = {
        page: searchWhere.page,
        size: searchWhere.size,
        sort: searchWhere.sort,
        order: searchWhere.order,
        searchKey: searchWhere.keyWord
    }
    return Object.assign(Interface, sw)
}

function _export(d = {}) {
    const Interface = {
        studentId: '',
        clazzId: ''
    }
    return Object.assign(Interface, d)
}

const ApiNames = {
    // 飞行训练评价
    flyTrainEva: '/flightTrainingEvaluationRecords',
    //  学员培训记录
    trainHistory: '/studentTrainingRecords',
    // 飞行考试列表
    flyExam: '/flightExamRecords',
    // 飞行考试（详情）
    flyExamDetails: '/flightExamRecords/{id}',
    // 飞行考试（修改）
    setflyExamDetails: '/flightExamRecords/{id}',
    // 飞行考试（签名）
    flyExamSign: '/flightExamRecords/{id}/sign',
    // 学员总评
    studentRecordsAll: '/studentFinalEvaluationRecords',
    // 学员总评 （详情）
    studentRecordsDetails: '/studentFinalEvaluationRecords/{id}',
    // 学员总评（修改）
    setStudentRecords: '/studentFinalEvaluationRecords/{id}',
    // 学员总评教员签字
    studentRecordsSign: '/studentFinalEvaluationRecords/{id}/sign',
    // 飞行训练评价 （详情）
    flyTrainDetails: '/flightTrainingEvaluationRecords/{id}',
    // 飞行训练评价 （签名）
    flyTrainSign: '/flightTrainingEvaluationRecords/{id}/sign',
    // 飞行训练评价 （修改）
    setFlyTrainDetails: '/flightTrainingEvaluationRecords/{id}',
    // 行为指标统计
    evaluationStatistics: '/flightTrainingEvaluationRecords/evaluationStatistics',
    flyReadTask: '/flightTrainingEvaluationRecords/{id}/readTask',
    // 导出CBTA列表
    cbtaExport: '/studentTrainingRecords/cbtaExport',
    // 导出不及格考试
    failExamExport: '/studentTrainingRecords/failExamExport',
    // 导出考试记录
    examExport: '/studentTrainingRecords/examExport',
    // 训练评价，实践考试记录
    evaluationRecords: '/studentTrainingRecords/evaluationRecords',
    // 飞行考试-签办
    flyTrainAudit: '/flightExamRecords/{id}/audit'
}

const Api = {
    /**
     * 获取培训记录
     * 用于渲染飞行训练评价中的列表
     */
    getTrainHistory(d) {
        return http(ApiNames.trainHistory, _params(d), 'get')
    },
    /**
     * 飞行训练评价
     */
    async flyTrainEva(param) {
        return http(ApiNames.flyTrainEva, _params(param), 'get')
        // let content = rs.data
        // let value = {
        //     Data:[]
        // }
        // for (let i of content) {
        //     value.Data.push({
        //         flyName:i.name,

        //     })
        // }
    },
    flyExam(param) {
        return http(ApiNames.flyExam, _params(param), 'get')
    },
    getFlyExamDetails(param) {
        return http(ApiNames.flyExamDetails, param, 'get_p')
    },
    setFlyExamDetails(param) {
        return http(ApiNames.setflyExamDetails, param, 'put')
    },
    setFlyExamSign(param) {
        return http(ApiNames.flyExamSign, param, 'post')
    },
    studentAll(param) {
        return http(ApiNames.studentRecordsAll, _params(param), 'get')
    },
    studentDetails(param) {
        return http(ApiNames.studentRecordsDetails, param, 'get_p')
    },
    setStudentDetails(param) {
        return http(ApiNames.setStudentRecords, param, 'put')
    },
    studentRecordsSign(params){
        return http(ApiNames.studentRecordsSign, params, 'post')
    },
    getFlyTrainDetails(param) {
        return http(ApiNames.flyTrainDetails, param, 'get_p')
    },
    setFlyTrainSign(param) {
        return http(ApiNames.flyTrainSign, param, 'post')
    },
    setflyTrainAudit(param) {
        return http(ApiNames.flyTrainAudit, param, 'post')
    },
    setFlyTrainDetails(param) {
        return http(ApiNames.setFlyTrainDetails, param, 'put')
    },
    evaluationStatistics(param) {
        return http(ApiNames.evaluationStatistics, _params(param), 'get')
    },
    /**
     * 获取签名图片地址（返回url）
     */
    getSignURL(uuid) {
        return `${baseURL}/open/${uuid}/inline`
    },
    cbtaExport(params) {
        return http(ApiNames.cbtaExport, _export(params), 'get', 'json', 1)
    },
    failExamExport(params) {
        return http(ApiNames.failExamExport, _export(params), 'get', 'json', 1)
    },
    examExport(params) {
        return http(ApiNames.examExport, _export(params), 'get', 'json', 1)
    },
    // 训练评价，实践考试记录
    evaluationRecords(params) {
        return http(ApiNames.evaluationRecords, params, 'get')
    },
    getFlyTrainReadTask(params){
        return http(ApiNames.flyReadTask, params, 'get_p')
    }
}

export default Api