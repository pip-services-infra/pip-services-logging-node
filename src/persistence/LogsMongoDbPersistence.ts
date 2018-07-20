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
import { LogsMongoDbSchema } from './LogsMongoDbSchema';
import { callbackify } from 'util';

export class LogsMongoDbPersistence extends IdentifiableMongoDbPersistence<LogMessageV1, string> implements ILoggingPersistence {

    constructor() {
        super('logs', LogsMongoDbSchema());

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

    addOne(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void {

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

    public addBatch(correlationId: string, messages: LogMessageV1[],
        callback: (err: any) => void): void {

        if (messages == null || messages.length == 0) {
            if (callback) callback(null);
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

    public deleteExpired(correlationId: string, expireLogsTime: Date, expireErrorsTime: Date,
        callback: (err: any) => void): void {
        this.deleteByFilter(correlationId, FilterParams.fromTuples("to_time", expireLogsTime), null);
        
        if (callback)
            callback(null);
    }

}