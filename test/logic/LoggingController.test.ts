let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-components-node';
import { FilterParams } from 'pip-services-commons-node';
import { ErrorDescriptionFactory } from 'pip-services-commons-node';

import { LogMessageV1 } from '../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../src/logic/LoggingController';

suite('LoggingController', ()=> {
    let controller: LoggingController;

    suiteSetup(() => {
        let messagesPersistence = new LoggingMemoryPersistence();
        let errorsPersistence = new LoggingMemoryPersistence();
        controller = new LoggingController();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-logging', 'persistence-messages', 'memory', 'default', '1.0'), messagesPersistence,
            new Descriptor('pip-services-logging', 'persistence-errors', 'memory', 'default', '1.0'), errorsPersistence,
            new Descriptor('pip-services-logging', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    setup((done) => {
        controller.clear(null, done);
    });
    
    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                controller.writeMessage(
                    null, 
                    new LogMessageV1(LogLevel.Info, null, "123", null, "AAA"), 
                    (err, message) => {
                        assert.isNull(err);
                        assert.isObject(message);
                        callback(err);
                    }
                );
            },
            // (callback) => {
            //     let message1 = new LogMessageV1(LogLevel.Debug, null, "123", null, "BBB");
            //     let message2 = new LogMessageV1(LogLevel.Error, null, "123", ErrorDescriptionFactory.create(new Error()), "AAB");
            //     message2.time = new Date(1975, 1, 1, 0, 0, 0, 0);

            //     controller.writeMessages(
            //         null,
            //         [message1, message2],
            //         (err) => {
            //             assert.isNull(err);
            //             callback(err);
            //         }
            //     );
            // },
            // (callback) => {
            //     controller.readMessages(
            //         null, 
            //         FilterParams.fromTuples("search", "AA"), 
            //         null,
            //         (err, page) => {
            //             assert.lengthOf(page.data, 2);
            //             callback(err);
            //         }
            //     );
            // },
            // (callback) => {
            //     controller.readErrors(
            //         null, 
            //         null, 
            //         null,
            //         (err, page) => {
            //             assert.lengthOf(page.data, 1);
            //             callback(err);
            //         }
            //     );
            // }
        ], done);
    });
});