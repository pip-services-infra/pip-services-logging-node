let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ErrorDescription } from 'pip-services-commons-node';
import { ErrorDescriptionFactory } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-components-node';

import { LogMessageV1 } from '../../src/data/version1/LogMessageV1';
import { ILoggingPersistence } from '../../src/persistence/ILoggingPersistence';

export class LoggingPersistenceFixture {
    private _persistence: ILoggingPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    public testCreateMessages(done) {
        async.series([
            (callback) => {
                this._persistence.addOne(
                    null, 
                    new LogMessageV1(LogLevel.Info, null, "123", null, "AAA"), 
                    (err, message) => {
                        assert.isNull(err);
                        assert.isObject(message);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.addOne(
                    null, 
                    new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB"), 
                    (err, message) => {
                        assert.isNull(err);
                        assert.isObject(message);
                        callback(err);
                    }
                );
            },
            (callback) => {
                let message = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
                message.time = new Date(1975, 1, 1, 0, 0, 0, 0);

                this._persistence.addOne(
                    null, 
                    message, 
                    (err, message) => {
                        assert.isNull(err);
                        assert.isObject(message);
                        callback(err);
                    }
                );
            }
        ], done);
    }

    public testReadWrite(done) {
        let fromTime = new Date();

        async.series([
            (callback) => {
                this.testCreateMessages(callback);
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null, 
                    FilterParams.fromTuples("search", "AA"), 
                    null,
                    (err, page) => {
                        assert.lengthOf(page.data, 2);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null, 
                    FilterParams.fromTuples("max_level", LogLevel.Info), 
                    null,
                    (err, page) => {
                        assert.lengthOf(page.data, 2);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null, 
                    FilterParams.fromTuples("from_time", fromTime), 
                    null,
                    (err, page) => {
                        assert.lengthOf(page.data, 2);
                        callback(err);
                    }
                );
            }
        ], done);
    }

    public testSearch(done) {
        async.series([
            (callback) => {
                this.testCreateMessages(callback);
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null, 
                    FilterParams.fromTuples("search", "AA"), 
                    null,
                    (err, page) => {
                        assert.lengthOf(page.data, 2);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null, 
                    FilterParams.fromTuples("search", "23"), 
                    null,
                    (err, page) => {
                        assert.lengthOf(page.data, 3);
                        callback(err);
                    }
                );
            },
            (callback) => {
                this._persistence.getPageByFilter(
                    null, 
                    FilterParams.fromTuples("search", "rror"), 
                    null,
                    (err, page) => {
                        assert.lengthOf(page.data, 1);
                        callback(err);
                    }
                );
            }
        ], done);

    }
}
