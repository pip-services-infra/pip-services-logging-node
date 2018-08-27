let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';
import { FilterParams } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-components-node';
import { ErrorDescriptionFactory } from 'pip-services-commons-node';

import { LogMessageV1 } from '../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../src/logic/LoggingController';
import { LoggingLambdaFunction } from '../../src/container/LoggingLambdaFunction';


suite('LoggingLambdaFunction', ()=> {
    let lambda: LoggingLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'pip-services-logging:persistence-messages:memory:default:1.0',
            'persistence.descriptor', 'pip-services-logging:persistence-errors:memory:default:1.0',
            'controller.descriptor', 'pip-services-logging:controller:default:default:1.0'
        );

        lambda = new LoggingLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                lambda.act(
                    {
                        role: 'logging',
                        cmd: 'write_message',
                        message: new LogMessageV1(LogLevel.Info, null, "123", null, "AAA")
                    },
                    (err, message) => {
                        assert.isNull(err);
                        assert.isObject(message);
                        callback(err);
                    }
                );
            },
            (callback) => {
                let message1 = new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB");
                let message2 = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
                message2.time = new Date(1975, 1, 1, 0, 0, 0, 0);

                lambda.act(
                    {
                        role: 'logging',
                        cmd: 'write_messages',
                        messages: [message1, message2]
                    },
                    (err) => {
                        assert.isNull(err);
                        callback(err);
                    }
                );
            },
            (callback) => {
                lambda.act(
                    {
                        role: 'logging',
                        cmd: 'read_messages',
                        filter: FilterParams.fromTuples("search", "AA")
                    }, 
                    (err, page) => {
                        assert.lengthOf(page.data, 2);
                        callback(err);
                    }
                );
            },
            (callback) => {
                lambda.act(
                    {
                        role: 'logging',
                        cmd: 'read_errors'
                    }, 
                    (err, page) => {
                        assert.lengthOf(page.data, 1);
                        callback(err);
                    }
                );
            }
        ], done);
    });
});