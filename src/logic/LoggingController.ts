let _ = require('lodash');
let async = require('async');

import { ConfigParams, IOpenable, IdGenerator } from 'pip-services-commons-node';
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
import { LogLevel } from 'pip-services-components-node';
import { ContextInfo } from 'pip-services-components-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from '../persistence/ILoggingPersistence';
import { ILoggingController } from './ILoggingController';
import { LoggingCommandSet } from './LoggingCommandSet';

export class LoggingController
    implements ILoggingController, ICommandable, IConfigurable, IReferenceable, IOpenable {

    private _dependencyResolver: DependencyResolver;
    private _messagesPersistence: ILoggingPersistence;
    private _errorsPersistence: ILoggingPersistence;
    private _commandSet: LoggingCommandSet;
    private _expireCleanupTimeout: number = 60; // 60 min
    private _expireLogsTimeout: number = 3; // 3 days
    private _expireErrorsTimeout: number = 30; // 30 days
    private _interval: any = null;

    constructor() {
        this._dependencyResolver = new DependencyResolver();
        this._dependencyResolver.put('messages_persistence', new Descriptor('pip-services-logging', 'persistence-messages', '*', '*', '*'));
        this._dependencyResolver.put('errors_persistence', new Descriptor('pip-services-logging', 'persistence-errors', '*', '*', '*'));
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet(this);
        return this._commandSet;
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options.expire_logs_timeout', this._expireLogsTimeout);
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options.expire_errors_timeout', this._expireErrorsTimeout);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._messagesPersistence = this._dependencyResolver.getOneRequired<ILoggingPersistence>('messages_persistence');
        this._errorsPersistence = this._dependencyResolver.getOneRequired<ILoggingPersistence>('errors_persistence');
    }

    public isOpen(): boolean {
        return this._interval != null;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        if (this._interval != null) {
            clearInterval(this._interval);
        }

        this._interval = setInterval(() => {
            this.deleteExpired(correlationId, null);
        }, 1000 * 60 * this._expireCleanupTimeout);

        if (callback != null)
            callback(null);
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        if (this._interval != null) {
            clearTimeout(this._interval);
            this._interval = null;
        }

        if (callback != null)
            callback(null);
    }

    public writeMessage(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void {

        message.id = IdGenerator.nextLong();
        message.level = message.level || LogLevel.Trace;
        message.time = message.time || new Date();

        async.parallel([
            (callback) => {
                this._messagesPersistence.addOne(correlationId, message, callback);
            },
            (callback) => {
                if (message.level <= LogLevel.Error) {
                    this._errorsPersistence.addOne(correlationId, message, callback);
                } else {
                    callback();
                }
            }
        ],
            (err, results) => {
                let message = results[0]
                callback(err, message);
            });
    }

    public writeMessages(correlationId: string, messages: LogMessageV1[],
        callback?: (err: any) => void): void {

        if (messages == null || messages.length == 0) {
            if (callback) callback(null);
            return;
        }

        let errors: LogMessageV1[] = [];

        _.each(messages, (message) => {
            message.id = IdGenerator.nextLong();
            message.level = message.level || LogLevel.Trace;
            message.time = message.time || new Date();

            if (message.level <= LogLevel.Error) {
                errors.push(message);
            }
        });


        async.parallel([
            (callback) => {
                this._messagesPersistence.addBatch(correlationId, messages, callback);
            },
            (callback) => {
                if (errors.length > 0) {
                    this._errorsPersistence.addBatch(correlationId, errors, callback);
                } else {
                    callback();
                }
            }
        ],
            (err) => {
                callback(err);
            });
    }

    public readMessages(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void {
        this._messagesPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public readErrors(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void {
        this._errorsPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public clear(correlationId: string, callback?: (err: any) => void): void {
        this._messagesPersistence.clear(correlationId, callback);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void) {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);

        this._messagesPersistence.deleteExpired(correlationId, expireLogsTime, callback);
        this._errorsPersistence.deleteExpired(correlationId, expireErrorsTime, callback);
    }
}