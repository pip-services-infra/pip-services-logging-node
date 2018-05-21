let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-commons-node';
import { ErrorDescriptionFactory } from 'pip-services-commons-node';

import { LogMessageV1 } from '../../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../../src/logic/LoggingController';
import { LoggingHttpServiceV1 } from '../../../src/services/version1/LoggingHttpServiceV1';

let restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

suite('LoggingHttpServiceV1', ()=> {
    let service: LoggingHttpServiceV1;

    let rest: any;

    suiteSetup((done) => {
        let persistence = new LoggingMemoryPersistence();
        let controller = new LoggingController();

        service = new LoggingHttpServiceV1();
        service.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-logging', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-logging', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-logging', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                rest.post('/v1/logging/write_message',
                    {
                        message: new LogMessageV1(LogLevel.Info, null, "123", null, "AAA")
                    },
                    (err, req, res, message) => {
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

                rest.post('/v1/logging/write_messages',
                    {
                        messages: [message1, message2]
                    },
                    (err, req, res) => {
                        assert.isNull(err);
                        callback(err);
                    }
                );
            },
            (callback) => {
                rest.post('/v1/logging/read_messages',
                    {
                        filter: FilterParams.fromTuples("search", "AA")
                    }, 
                    (err, req, res, page) => {
                        assert.lengthOf(page.data, 2);
                        callback(err);
                    }
                );
            },
            (callback) => {
                rest.post('/v1/logging/read_errors',
                    { }, 
                    (err, req, res, page) => {
                        assert.lengthOf(page.data, 1);
                        callback(err);
                    }
                );
            }
        ], done);
    });

});