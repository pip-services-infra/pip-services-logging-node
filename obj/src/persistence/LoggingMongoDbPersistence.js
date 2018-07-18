"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const LoggingMongoDbSchema_1 = require("./LoggingMongoDbSchema");
class LoggingMongoDbPersistence extends pip_services_data_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('logs', LoggingMongoDbSchema_1.LoggingMongoDbSchema());
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
        let criteria = [];
        let search = filter.getAsNullableString("search");
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            // if (this.matchString(message.message, search))
            // return true;
            // if (this.matchString(message.correlation_id, search))
            //     return true;
            // if (message.error != null) {
            //     if (this.matchString(message.error.message, search))
            //         return true;
            //     if (this.matchString(message.error.stack_trace, search))
            //         return true;
            //     if (this.matchString(message.error.code, search))
            //         return true;
            // }
            searchCriteria.push({ message: { $regex: searchRegex } });
            searchCriteria.push({ correlation_id: { $regex: searchRegex } });
            searchCriteria.push({ "error.message": { $regex: searchRegex } });
            searchCriteria.push({ "error.stack_trace": { $regex: searchRegex } });
            searchCriteria.push({ "error.code": { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }
        let level = filter.getAsNullableInteger("level");
        if (level != null)
            criteria.push({ level: level });
        let maxLevel = filter.getAsNullableInteger("max_level");
        if (maxLevel != null)
            criteria.push({ level: { $lte: maxLevel } });
        let fromTime = filter.getAsNullableDateTime("from_time");
        if (fromTime != null)
            criteria.push({ time: { $gte: fromTime } });
        let toTime = filter.getAsNullableDateTime("to_time");
        if (toTime != null)
            criteria.push({ time: { $lt: toTime } });
        let errorsOnly = filter.getAsBooleanWithDefault("errors_only", false);
        let errorLevel = pip_services_commons_node_2.LogLevel.Error;
        // if (errorsOnly != null)
        //     criteria.push({ level: errorLevel });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
        // super.getPageByFilter(correlationId, filter, paging, null, null, callback);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
    deleteExpired(correlationId, expireTime, callback) {
        // let originalSize = this._messages.length;
        // this._messages = _.filter(this._messages, d => d.time.getTime() > expireTime.getTime());
        // let deleted = originalSize - this._messages.length;
        // if (deleted > 0) {
        //     //TODO: log and check
        // } else {
        //     if (callback) callback(null);
        // }
    }
}
exports.LoggingMongoDbPersistence = LoggingMongoDbPersistence;
//# sourceMappingURL=LoggingMongoDbPersistence.js.map