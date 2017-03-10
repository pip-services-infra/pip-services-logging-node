var _ = require('lodash');
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
var LoggingClientFixture = (function () {
    function LoggingClientFixture(client) {
        this._client = client;
    }
    LoggingClientFixture.prototype.testCrudOperations = function (done) {
        var _this = this;
        async.series([
            // Create two logging entries
            // Create two logging entries
            function (callback) {
                _this._client.writePersistedLog(null, [LOG_ENTRY1, LOG_ENTRY2], function (err, entries) {
                    assert.lengthOf(entries, 2);
                    assert.result(err, entries[0]);
                    assert.result(err, entries[1]);
                    callback();
                });
            },
            // Create another logging entry
            // Create another logging entry
            function (callback) {
                _this._client.writePersistedLog(null, [LOG_ENTRY3], function (err, entries) {
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
            // Get all logging entries
            // Get all logging entries
            function (callback) {
                _this._client.readPersistedLog(null, new pip_services_runtime_node_1.FilterParams(), new pip_services_runtime_node_2.PagingParams(), function (err, entries) {
                    assert.result(err, entries);
                    assert.isTrue(entries.data.length >= 3);
                    callback();
                });
            }
        ], done);
    };
    return LoggingClientFixture;
})();
exports.LoggingClientFixture = LoggingClientFixture;
