let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { DependencyResolver } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-commons-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from '../persistence/ILoggingPersistence';
import { ILoggingController } from './ILoggingController';
import { LoggingCommandSet } from './LoggingCommandSet';

export class LoggingController
    implements ILoggingController, ICommandable, IConfigurable, IReferenceable {

    private _dependencyResolver: DependencyResolver;
    private _readPersistence: ILoggingPersistence;
    private _writePersistence: ILoggingPersistence[];
    private _commandSet: LoggingCommandSet;
    private _expireCleanupTimeout: number = 1; // 1 day
    private _expireLogsTimeout: number = 3; // 3 days
    private _expireErrorsTimeout: number = 30; // 30 days

    constructor() {
        this._dependencyResolver = new DependencyResolver();
        this._dependencyResolver.put('read_persistence', new Descriptor('pip-services-logging', 'persistence', '*', '*', '*'));
        this._dependencyResolver.put('write_persistence', new Descriptor('pip-services-logging', 'persistence', '*', '*', '*'));
        this.deleteExpired("logs", null);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void) {
        setTimeout(() => {
            let now = new Date().getTime();
            let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
            let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);

            async.each(this._writePersistence, (p, callback) => {
                p.deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback);
            }, (err) => {
                if (callback) callback(err);
            });

            console.log('Expired logs and errors cleared');
            this.deleteExpired(correlationId, callback);
        }, 1000 * 60 * 60 * 24 * this._expireCleanupTimeout); // ms
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet(this);
        return this._commandSet;
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired<ILoggingPersistence>('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional<ILoggingPersistence>('write_persistence');
    }

    public writeMessage(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void {
        message.level = message.level || LogLevel.Trace;
        message.time = message.time || new Date();
        async.each(this._writePersistence, (p, callback) => {
            p.addOne(correlationId, message, callback);
        }, (err) => {
            if (callback) callback(err, message);
        });
    }

    public writeMessages(correlationId: string, messages: LogMessageV1[],
        callback?: (err: any) => void): void {

        if (messages == null || messages.length == 0) {
            if (callback) callback(null);
            return;
        }

        _.each(messages, (message) => {
            message.level = message.level || LogLevel.Trace;
            message.time = message.time || new Date();
        });

        async.each(this._writePersistence, (p, callback) => {
            p.addBatch(correlationId, messages, callback);
        }, (err) => {
            if (callback) callback(err);
        });
    }

    public readMessages(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void {
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public readErrors(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void {
        filter = filter || new FilterParams();
        filter.setAsObject('errors_only', true);
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public clear(correlationId: string, callback?: (err: any) => void): void {
        async.each(this._writePersistence, (p, callback) => {
            p.clear(correlationId, callback);
        }, (err) => {
            if (callback) callback(err);
        });
    }

}