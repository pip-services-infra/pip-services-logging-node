let _ = require('lodash');
let async = require('async');

import { ConfigParams, IdGenerator } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services-data-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';
import { LoggingMongoDbSchema } from './LoggingMongoDbSchema';
import { callbackify } from 'util';

export class LoggingMongoDbPersistence extends IdentifiableMongoDbPersistence<LogMessageV1, string> implements ILoggingPersistence {

    private _errorCollection: string;
    private _schemaError: any;
    private _modelError: any;


    constructor() {
        super('logs', LoggingMongoDbSchema());
        this._errorCollection = "errors";
        this._schemaError = LoggingMongoDbSchema(this._errorCollection);
        this._schemaError.set('collection', this._errorCollection);
        this._modelError = this._connection.model(this._errorCollection, this._schemaError);

        this._maxPageSize = 1000;
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

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
        let errorLevel = LogLevel.Error
        if (errorsOnly)
            criteria.push({ level: errorLevel });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter),
            paging, null, null, callback);
    }

    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

    create(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void {
            let id: string;
        async.series([
            (callback) => {
                this.createLogs(correlationId, message, (err: any, message: LogMessageV1) => {
                    if (!err)
                        id = message.id
                    callback(err, message);
                });
            },
            (callback) => {
                // Add to error separately
                if (message.level <= LogLevel.Error) {
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
        ], (err: any, result: LogMessageV1[]) => {
            callback(err, result[0]);
        });

    }

    createLogs(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void {
        super.create(correlationId, message, callback);
    }

    public deleteExpired(correlationId: string, expireLogsTime: Date, expireErrorsTime: Date,
        callback: (err: any) => void): void {
        this.deleteByFilter(correlationId, FilterParams.fromTuples("to_time", expireLogsTime), null);
        //  delete errors from errors collection
    }

}