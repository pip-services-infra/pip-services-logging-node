let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { References } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { LogLevel } from 'pip-services-commons-node';
import { ErrorDescriptionFactory } from 'pip-services-commons-node';
import { SenecaInstance } from 'pip-services-net-node';

import { LogMessageV1 } from '../../../src/data/version1/LogMessageV1';
import { LoggingMemoryPersistence } from '../../../src/persistence/LoggingMemoryPersistence';
import { LoggingController } from '../../../src/logic/LoggingController';
import { LoggingSenecaServiceV1 } from '../../../src/services/version1/LoggingSenecaServiceV1';


suite('LoggingSenecaServiceV1', ()=> {
    let seneca: any;
    let service: LoggingSenecaServiceV1;
    let messagesPersistence = new LoggingMemoryPersistence();
    let errorsPersistence = new LoggingMemoryPersistence();
    let controller: LoggingController;

    suiteSetup((done) => {
        let messagesPersistence = new LoggingMemoryPersistence();
        let errorsPersistence = new LoggingMemoryPersistence();
        controller = new LoggingController();

        service = new LoggingSenecaServiceV1();
        service.configure(ConfigParams.fromTuples(
            "connection.protocol", "none"
        ));

        let logger = new ConsoleLogger();
        let senecaAddon = new SenecaInstance();

        let references: References = References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaAddon,
            new Descriptor('pip-services-logging', 'persistence-messages', 'memory', 'default', '1.0'), messagesPersistence,
            new Descriptor('pip-services-logging', 'persistence-errors', 'memory', 'default', '1.0'), errorsPersistence,
            new Descriptor('pip-services-logging', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-logging', 'service', 'commandable-seneca', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        seneca = senecaAddon.getInstance();

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });
    
    setup((done) => {
        messagesPersistence.clear(null, done);
        errorsPersistence.clear(null, null);
    });
    
    test('CRUD Operations', (done) => {
         async.series([
            (callback) => {
                seneca.act(
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

                seneca.act(
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
                seneca.act(
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
                seneca.act(
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