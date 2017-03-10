let _ = require('lodash');
let async = require('async');

let testFw = require('pip-services-test-node');
let assert = testFw.assert;

import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

import { ILoggingClient } from '../../../src/clients/version1/ILoggingClient';

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

export class LoggingClientFixture {
    private _client: ILoggingClient;
    
    constructor(client: ILoggingClient) {
        this._client = client;
    }
        
    testCrudOperations(done) {
        async.series([
        // Create two logging entries
            (callback) => {
                this._client.writePersistedLog(
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
        // Create another logging entry
            (callback) => {
                this._client.writePersistedLog(
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
        // Get all logging entries
            (callback) => {
                this._client.readPersistedLog(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, entries) => {
                        assert.result(err, entries);
                       
                        assert.isTrue(entries.data.length >= 3);

                        callback();
                    }
                );
            }
        ], done);
    }
}
