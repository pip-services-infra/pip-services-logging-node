"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_mongodb_node_1 = require("pip-services-mongodb-node");
const LoggingMongoDbSchema_1 = require("./LoggingMongoDbSchema");
class LoggingMongoDbPersistence extends pip_services_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor(collection) {
        super(collection, LoggingMongoDbSchema_1.LoggingMongoDbSchema());
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
        let criteria = [];
        let search = filter.getAsNullableString("search");
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
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
        let source = filter.getAsNullableString("source");
        if (source != null)
            criteria.push({ source: source });
        let errorsOnly = filter.getAsBooleanWithDefault("errors_only", false);
        let errorLevel = pip_services_components_node_1.LogLevel.Error;
        if (errorsOnly)
            criteria.push({ level: errorLevel });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
    addOne(correlationId, message, callback) {
        super.create(correlationId, message, callback);
    }
    addBatch(correlationId, messages, callback) {
        if (messages == null || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let batch = this._model.collection.initializeUnorderedBulkOp();
        //batch can be undefined if try to write log before connected to mongodb
        for (let item of messages) {
            if (batch)
                batch.insert({
                    _id: item.id,
                    time: item.time,
                    source: item.source,
                    level: item.level,
                    correlation_id: item.correlation_id,
                    error: item.error,
                    message: item.message
                });
        }
        if (batch)
            batch.execute((err) => {
                // if (!err)
                //     this._logger.trace(correlationId, "Created %d data in %s", messages.length, this._collection);
            });
        if (callback)
            callback(null);
    }
    deleteExpired(correlationId, expireTime, callback) {
        this.deleteByFilter(correlationId, pip_services_commons_node_1.FilterParams.fromTuples("to_time", expireTime), callback);
    }
}
exports.LoggingMongoDbPersistence = LoggingMongoDbPersistence;
//# sourceMappingURL=LoggingMongoDbPersistence.js.map