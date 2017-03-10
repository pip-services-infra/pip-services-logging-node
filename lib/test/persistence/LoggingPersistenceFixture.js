var async = require('async');
var testFw = require('pip-services-test-node');
var assert = testFw.assert;
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var LOG_ENTRY1 = {
    server: 'localhost',
    level: 10,
    component: 'Logging Test',
    message: 'Message 1'
};
var LOG_ENTRY2 = {
    server: 'localhost',
    level: 10,
    component: 'Logging Test',
    message: 'Message 2'
};
var LOG_ENTRY3 = {
    server: 'localhost',
    level: 10,
    component: 'Logging Test',
    message: 'Message 3'
};
var LoggingPersistenceFixture = (function () {
    function LoggingPersistenceFixture(db) {
        assert.isNotNull(db);
        this._db = db;
    }
    LoggingPersistenceFixture.prototype.testCrudOperations = function (done) {
        var _this = this;
        async.series([
            // Create one Log Entry
            // Create one Log Entry
            function (callback) {
                _this._db.writePersistedLog(null, [LOG_ENTRY1, LOG_ENTRY2], function (err, entries) {
                    assert.lengthOf(entries, 2);
                    assert.result(err, entries[0]);
                    assert.result(err, entries[1]);
                    callback();
                });
            },
            // Create another Log Entry
            // Create another Log Entry
            function (callback) {
                _this._db.writePersistedLog(null, [LOG_ENTRY3], function (err, entries) {
                    assert.lengthOf(entries, 1);
                    assert.result(err, entries[0]);
                    var entry = entries[0];
                    assert.equal(entry.server, LOG_ENTRY3.server);
                    assert.equal(entry.level, LOG_ENTRY3.level);
                    assert.equal(entry.component, LOG_ENTRY3.component);
                    assert.equal(entry.message, LOG_ENTRY3.message);
                    callback();
                });
            },
            // Get all dummies
            // Get all dummies
            function (callback) {
                _this._db.readPersistedLog(null, new pip_services_runtime_node_1.FilterParams(), new pip_services_runtime_node_2.PagingParams(), function (err, entries) {
                    assert.result(err, entries);
                    assert.lengthOf(entries.data, 3);
                    callback();
                });
            }
        ], done);
    };
    return LoggingPersistenceFixture;
})();
exports.LoggingPersistenceFixture = LoggingPersistenceFixture;
