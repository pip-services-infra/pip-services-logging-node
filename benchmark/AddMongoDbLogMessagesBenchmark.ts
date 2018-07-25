let async = require('async');

import { Benchmark } from 'pip-benchmark-node';
import { DateTimeConverter } from 'pip-services-commons-node';

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';

import { ErrorDescription } from 'pip-services-commons-node';
import { LogMessageV1 } from '../src/data/version1/LogMessageV1';
import { LoggingMessagesMongoDbPersistence } from '../src/persistence/LoggingMessagesMongoDbPersistence';
import { LoggingErrorsMongoDbPersistence } from '../src/persistence/LoggingErrorsMongoDbPersistence';
import { LoggingController } from '../src/logic/LoggingController';

export class AddMongoDbLogMessagesBenchmark extends Benchmark {
    private _initialRecordNumber: number;
    private _sourceQuantity: number;
    private _startTime: Date;
    private _interval: number;

    private _source: string;
    private _time: Date;

    private _messagesPersistence: LoggingMessagesMongoDbPersistence;
    private _errorsPersistence: LoggingErrorsMongoDbPersistence;
    private _controller: LoggingController;

    public constructor() {
        super("AddMongoDbLogMessages", "Measures performance of adding LogMessages into MongoDB database");
    }

    public setUp(callback: (err: any) => void): void {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._sourceQuantity = this.context.parameters.SourceQuantity.getAsInteger();
        this._startTime = DateTimeConverter.toDateTime(this.context.parameters.StartTime.getAsString());
        this._interval = this.context.parameters.Interval.getAsInteger();

        this._time = this._startTime;
        this._source = this.getRandomString(10);

        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();

        this._messagesPersistence = new LoggingMessagesMongoDbPersistence();
        this._messagesPersistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDb
        ));

        this._errorsPersistence = new LoggingMessagesMongoDbPersistence();
        this._errorsPersistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDb
        ));

        this._controller = new LoggingController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-logging', 'persistence-messages', 'mongodb', 'default', '1.0'), this._messagesPersistence,
            new Descriptor('pip-services-logging', 'persistence-errors', 'mongodb', 'default', '1.0'), this._errorsPersistence,
            new Descriptor('pip-services-logging', 'controller', 'default', 'default', '1.0'), this._controller
        );
        this._controller.setReferences(references);

        async.parallel([
            (callback) => {
                this._messagesPersistence.open(null, (err) => {
                    if (err == null)
                        this.context.sendMessage('Connected to mongodb database collection messages');
                    callback(err);
                });
            },
            (callback) => {
                this._errorsPersistence.open(null, (err) => {
                    if (err == null)
                        this.context.sendMessage('Connected to mongodb database errors messages');
                    callback(err);
                });
            }
        ],
            (err) => {
                callback(err);
            });
    }

    public tearDown(callback: (err: any) => void): void {

        async.parallel([
            (callback) => {
                this._messagesPersistence.close(null, (err) => {
                    if (this.context)
                        this.context.sendMessage('Disconnected from mongodb database collection messages');
                    callback(err);
                });
            },
            (callback) => {
                this._errorsPersistence.close(null, (err) => {
                    if (this.context)
                        this.context.sendMessage('Disconnected from mongodb database collection errors');
                    callback(err);
                });
            }
        ],
            (err) => {
                this._messagesPersistence = null;
                this._errorsPersistence = null;
                this._controller = null;
                callback(err);
            });
    }

    private getRandomString(length: number): string {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    private getRandomLogLevel(): number {
        return Math.floor(Math.random() * 7);
    }

    private getRandomErrorDescriptor(): ErrorDescription {
        let errorDescription: ErrorDescription = new ErrorDescription();

        errorDescription.category = this.getRandomString(5);
        errorDescription.type = this.getRandomString(5);
        errorDescription.status = this.getRandomLogLevel();
        errorDescription.code = this.getRandomString(5);
        errorDescription.message = this.getRandomString(5);
        errorDescription.details = this.getRandomString(5);
        errorDescription.correlation_id = this.getRandomString(5);
        errorDescription.cause = this.getRandomString(5);
        errorDescription.stack_trace = this.getRandomString(5);

        return errorDescription;
    }

    public execute(callback: (err: any) => void): void {
        let LogMessages: LogMessageV1[] = [];

        for (let sourceNumber = 1; sourceNumber <= this._sourceQuantity; sourceNumber++) {
            LogMessages.push({
                id: this.getRandomString(10),
                time: this._time,
                source: this.getRandomString(10),
                level: this.getRandomLogLevel(),
                correlation_id: this.getRandomString(10),
                error: this.getRandomErrorDescriptor(),
                message: this.getRandomString(50)
            });
        }

        this._time = new Date(this._time.getTime() + this._interval);

        this._controller.writeMessages(null, LogMessages, callback);
    }

}