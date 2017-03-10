let async = require('async');

let testFw = require('pip-services-test-node');
let assert = testFw.assert;

import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

import { ILoggingPersistence } from '../../src/persistence/ILoggingPersistence';

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

export class LoggingPersistenceFixture {
    private _db: ILoggingPersistence;
    
    constructor(db) {
        assert.isNotNull(db);
        this._db = db;
    }
                
    public testCrudOperations(done) {
        async.series([
        // Create one Log Entry
            (callback) => {
                this._db.writePersistedLog(
                    null,
                    [LOG_ENTRY1, LOG_ENTRY2],
                    (err, entries) => {
                        assert.lengthOf(entries, 2);
                        assert.result(err, entries[0]);
                        assert.result(err, entries[1]);

                        callback();
                    }
                );
            },
        // Create another Log Entry
            (callback) => {
                this._db.writePersistedLog(
                    null,
                    [LOG_ENTRY3],
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
        // Get all dummies
            (callback) => {
                this._db.readPersistedLog(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, entries) => {
                        assert.result(err, entries);
                        assert.lengthOf(entries.data, 3);

                        callback();
                    }
                );
            }
        ], done);
    }
}
