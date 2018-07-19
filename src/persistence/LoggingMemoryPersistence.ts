let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-commons-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';

export class LoggingMemoryPersistence implements IConfigurable, ILoggingPersistence {
    private _maxPageSize: number = 100;
    private _maxErrorSize: number = 1000;
    private _maxTotalSize: number = 10000;

    private _messages: LogMessageV1[] = [];
    private _errors: LogMessageV1[] = [];

    public constructor() { }

    public configure(config: ConfigParams) : void {
        this._maxPageSize = config.getAsIntegerWithDefault('options.max_page_size', this._maxPageSize);
        this._maxErrorSize = config.getAsIntegerWithDefault('options.max_error_size', this._maxErrorSize);
        this._maxTotalSize = config.getAsIntegerWithDefault('options.max_total_size', this._maxTotalSize);
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private messageContains(message: LogMessageV1, search: string): boolean {
        search = search.toLowerCase();

        if (this.matchString(message.message, search))
            return true;
        if (this.matchString(message.correlation_id, search))
            return true;

        if (message.error != null) {
            if (this.matchString(message.error.message, search))
                return true;
            if (this.matchString(message.error.stack_trace, search))
                return true;
            if (this.matchString(message.error.code, search))
                return true;
        }

        return false;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void {

        filter = filter || new FilterParams();
        let search = filter.getAsNullableString("search");
        let level = filter.getAsNullableInteger("level");
        let maxLevel = filter.getAsNullableInteger("max_level");
        let fromTime = filter.getAsNullableDateTime("from_time");
        let toTime = filter.getAsNullableDateTime("to_time");
        let errorsOnly = filter.getAsBooleanWithDefault("errors_only", false);

        paging = paging || new PagingParams();
        let skip = paging.getSkip(0);
        let take = paging.getTake(this._maxPageSize);
        let data: LogMessageV1[] = [];

        let messages = errorsOnly ? this._errors : this._messages;
        for (let index = 0; index < messages.length; index++) {
            let message = messages[index];
            if (search != null && !this.messageContains(message, search))
                continue;
            if (level != null && level != message.level)
                continue;
            if (maxLevel != null && maxLevel < message.level)
                continue;
            if (fromTime != null && fromTime > message.time)
                continue;
            if (toTime != null && toTime <= message.time)
                continue;

            skip--;
            if (skip >= 0) continue;

            data.push(message);

            take--;
            if (take <= 0) break;
        }

        let total = data.length;
        let page = new DataPage<LogMessageV1>(data, total);

        callback(null, page);
    }

    private truncateMessages(messages: LogMessageV1[], maxSize: number): void {
        // Remove messages from the end
        if (messages.length > maxSize)
            messages.splice(maxSize - 1, messages.length - maxSize);
    }

    private insertMessage(message: LogMessageV1, messages: LogMessageV1[]): void {
        let index = 0;
        // Find index to keep messages sorted by time
        while (index < messages.length) {
            if (message.time >= messages[index].time)
                break;
            index++;
        }
        if (index < messages.length)
            messages.splice(index, 0, message);
        else
            messages.push(message);
    }

    public addOne(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void {

        // Add to all messages
        this.truncateMessages(this._messages, this._maxTotalSize);
        this.insertMessage(message, this._messages);

        // Add to errors separately
        if (message.level <= LogLevel.Error) {
            this.truncateMessages(this._errors, this._maxErrorSize);
            this.insertMessage(message, this._errors);
        }

        if (callback) callback(null, message);
    }

    public addBatch(correlationId: string, data: LogMessageV1[],
        callback: (err: any) => void): void {

        async.each(data, (d, callback) => {
            this.addOne(correlationId, d, callback);
        }, callback);
    }

    public clear(correlationId: string, callback?: (err: any) => void): void {
        this._messages = [];
        this._errors = [];

        if (callback) callback(null);
    }

    public deleteExpired(correlationId: string, expireLogsTime: Date, expireErrorsTime: Date,
        callback: (err: any) => void): void {

        let originalLogsSize = this._messages.length;
        let originalErrorsSize = this._messages.length;
        this._messages = _.filter(this._messages, d => d.time.getTime() > expireLogsTime.getTime());
        this._errors = _.filter(this._messages, d => d.time.getTime() > expireErrorsTime.getTime());
        let deletedLogs = originalLogsSize - this._messages.length;
        let deletedErrors = originalErrorsSize - this._errors.length;

        if (deletedLogs > 0) {
            //TODO: log and check
            
        } else {
            if (callback) callback(null);
        }
    }

}