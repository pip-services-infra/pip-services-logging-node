let _ = require('lodash');
let async = require('async');

import { ComponentSet } from 'pip-services-runtime-node';
import { ComponentConfig } from 'pip-services-runtime-node';
import { SenecaAddon } from 'pip-services-runtime-node';
import { DynamicMap } from 'pip-services-runtime-node';
import { LifeCycleManager } from 'pip-services-runtime-node';

import { LoggingMongoDbPersistence} from '../../../src/persistence/LoggingMongoDbPersistence';
import { LoggingController } from '../../../src/logic/LoggingController';
import { LoggingSenecaService } from '../../../src/services/version1/LoggingSenecaService';

let testFw = require('pip-services-test-node');
let assert = testFw.assert;

let options = new DynamicMap(require('../../../../config/config'));
let dbOptions = new ComponentConfig(null, options.getMap('persistence'));

let LOG_ENTRY1 = {
    server: 'localhost',
    level: 10,
    component: 'Logging Test',
    message: 'Message 1'
};
let LOG_ENTRY2 = {
    server: 'localhost',
    level: 10,
    component: 'Logging Test',
    message: 'Message 2'
};
let LOG_ENTRY3 = {
    server: 'localhost',
    level: 10,
    component: 'Logging Test',
    message: 'Message 3'
};

suite('LoggingSenecaService', ()=> {        
    let db = new LoggingMongoDbPersistence();
    db.configure(dbOptions);

    let ctrl = new LoggingController();
    ctrl.configure(new ComponentConfig());

    let service = new LoggingSenecaService();
    service.configure(new ComponentConfig());

    let seneca = new SenecaAddon();
    seneca.configure(new ComponentConfig());

    let components = ComponentSet.fromComponents(db, ctrl, service, seneca);

    suiteSetup((done) => {
        LifeCycleManager.linkAndOpen(components, done);
    });
    
    suiteTeardown((done) => {
        seneca.close(() => {
            LifeCycleManager.close(components, done);
        });
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        async.series([
        // Create two log entries
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'logs',
                        cmd: 'write_logs',
                        entries: [LOG_ENTRY1, LOG_ENTRY2]
                    },
                    (err, entries) => {
                        assert.lengthOf(entries, 2);
                        assert.result(err, entries[0]);
                        assert.result(err, entries[1]);


                        callback();
                    }
                );
            },
        // Create another log entry
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'logs',
                        cmd: 'write_logs',
                        entries: [LOG_ENTRY3]
                    },
                    (err, entries) => {
                        assert.lengthOf(entries, 1);
                        assert.result(err, entries[0]);

                        let entry = entries[0];

                        assert.equal(entry.server, LOG_ENTRY3.server);
                        assert.equal(entry.level, LOG_ENTRY3.level);
                        assert.equal(entry.component, LOG_ENTRY3.component);
                        assert.equal(entry.message, LOG_ENTRY3.message);

                        callback();
                    }
                );
            },
        // Get all log entries
            (callback) => {
                seneca.getSeneca().act(
                    {
                        role: 'logs',
                        cmd: 'read_logs',
                    },
                    (err, entries) => {
                        assert.result(err, entries);
                        assert.lengthOf(entries.data, 3);

                        callback();
                    }
                );
            }
        ], done);
    });
});