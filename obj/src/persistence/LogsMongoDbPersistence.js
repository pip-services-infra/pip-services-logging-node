"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const LogsMongoDbSchema_1 = require("./LogsMongoDbSchema");
class LogsMongoDbPersistence extends pip_services_data_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('logs', LogsMongoDbSchema_1.LogsMongoDbSchema());
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
        let errorsOnly = filter.getAsBooleanWithDefault("errors_only", false);
        let errorLevel = pip_services_commons_node_2.LogLevel.Error;
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
        // this.create(correlationId, message, (err: any, message: LogMessageV1) => {
        //     callback(err, message);
        // });
    }
    // let id: string;
    // async.series([
    //     (callback) => {
    //         });
    //     },
    //     (callback) => {
    //         // Add to error separately
    //         if (message.level <= LogLevel.Error) {
    //             // Assign id
    //             let newMessage = _.omit(message, 'id');
    //             newMessage._id = id;
    //             this._errorModel.create(newMessage, (err, newMessage) => {
    //                 if (!err)
    //                     this._logger.trace(correlationId, "Created in %s with id = %s", this._errorCollection, newMessage._id);
    //                 newMessage = this.convertToPublic(newMessage);
    //                 callback(err, newMessage);
    //             });
    //         }
    //         else {
    //             callback();
    //         }
    //     }
    // ], (err: any, result: LogMessageV1[]) => {
    //     callback(err, result[0]);
    // });
    // }
    // create(correlationId: string, message: LogMessageV1,
    //     callback?: (err: any, message: LogMessageV1) => void): void {
    //     super.create(correlationId, message, callback);
    // }
    addBatch(correlationId, messages, callback) {
        if (messages == null || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let batch = this._model.collection.initializeUnorderedBulkOp();
        for (let item of messages) {
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
        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Created %d data in %s", messages.length, this._collection);
        });
        if (callback)
            callback(null);
    }
    deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback) {
        this.deleteByFilter(correlationId, pip_services_commons_node_1.FilterParams.fromTuples("to_time", expireLogsTime), null);
        if (callback)
            callback(null);
    }
}
exports.LogsMongoDbPersistence = LogsMongoDbPersistence;
//# sourceMappingURL=LogsMongoDbPersistence.js.map