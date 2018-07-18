"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_data_node_1 = require("pip-services-data-node");
const LoggingMongoDbSchema_1 = require("./LoggingMongoDbSchema");
class LoggingMongoDbPersistence extends pip_services_data_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('logs', LoggingMongoDbSchema_1.LoggingMongoDbSchema());
        this._errorCollection = "errors";
        this._schemaError = LoggingMongoDbSchema_1.LoggingMongoDbSchema(this._errorCollection);
        this._schemaError.set('collection', this._errorCollection);
        this._modelError = this._connection.model(this._errorCollection, this._schemaError);
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
    create(correlationId, message, callback) {
        let id;
        async.series([
            (callback) => {
                this.createLogs(correlationId, message, (err, message) => {
                    if (!err)
                        id = message.id;
                    callback(err, message);
                });
            },
            (callback) => {
                // Add to error separately
                if (message.level <= pip_services_commons_node_2.LogLevel.Error) {
                    // Assign id
                    let newMessage = _.omit(message, 'id');
                    newMessage._id = id;
                    this._modelError.create(newMessage, (err, newMessage) => {
                        if (!err)
                            this._logger.trace(correlationId, "Created in %s with id = %s", this._errorCollection, newMessage._id);
                        newMessage = this.convertToPublic(newMessage);
                        callback(err, newMessage);
                    });
                }
                else {
                    callback();
                }
            }
        ], (err, result) => {
            callback(err, result[0]);
        });
    }
    createLogs(correlationId, message, callback) {
        super.create(correlationId, message, callback);
    }
    deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback) {
        this.deleteByFilter(correlationId, pip_services_commons_node_1.FilterParams.fromTuples("to_time", expireLogsTime), null);
        //  delete errors from errors collection
    }
}
exports.LoggingMongoDbPersistence = LoggingMongoDbPersistence;
//# sourceMappingURL=LoggingMongoDbPersistence.js.map