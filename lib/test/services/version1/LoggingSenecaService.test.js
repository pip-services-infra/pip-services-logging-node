var _ = require('lodash');
var async = require('async');
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var pip_services_runtime_node_4 = require('pip-services-runtime-node');
var pip_services_runtime_node_5 = require('pip-services-runtime-node');
var LoggingMongoDbPersistence_1 = require('../../../src/persistence/LoggingMongoDbPersistence');
var LoggingController_1 = require('../../../src/logic/LoggingController');
var LoggingSenecaService_1 = require('../../../src/services/version1/LoggingSenecaService');
var testFw = require('pip-services-test-node');
var assert = testFw.assert;
var options = new pip_services_runtime_node_4.DynamicMap(require('../../../../config/config'));
var dbOptions = new pip_services_runtime_node_2.ComponentConfig(null, options.getMap('persistence'));
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
suite('LoggingSenecaService', function () {
    var db = new LoggingMongoDbPersistence_1.LoggingMongoDbPersistence();
    db.configure(dbOptions);
    var ctrl = new LoggingController_1.LoggingController();
    ctrl.configure(new pip_services_runtime_node_2.ComponentConfig());
    var service = new LoggingSenecaService_1.LoggingSenecaService();
    service.configure(new pip_services_runtime_node_2.ComponentConfig());
    var seneca = new pip_services_runtime_node_3.SenecaAddon();
    seneca.configure(new pip_services_runtime_node_2.ComponentConfig());
    var components = pip_services_runtime_node_1.ComponentSet.fromComponents(db, ctrl, service, seneca);
    suiteSetup(function (done) {
        pip_services_runtime_node_5.LifeCycleManager.linkAndOpen(components, done);
    });
    suiteTeardown(function (done) {
        seneca.close(function () {
            pip_services_runtime_node_5.LifeCycleManager.close(components, done);
        });
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        async.series([
            // Create two log entries
            // Create two log entries
            function (callback) {
                seneca.getSeneca().act({
                    role: 'logs',
                    cmd: 'write_logs',
                    entries: [LOG_ENTRY1, LOG_ENTRY2]
                }, function (err, entries) {
                    assert.lengthOf(entries, 2);
                    assert.result(err, entries[0]);
                    assert.result(err, entries[1]);
                    callback();
                });
            },
            // Create another log entry
            // Create another log entry
            function (callback) {
                seneca.getSeneca().act({
                    role: 'logs',
                    cmd: 'write_logs',
                    entries: [LOG_ENTRY3]
                }, function (err, entries) {
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
            // Get all log entries
            // Get all log entries
            function (callback) {
                seneca.getSeneca().act({
                    role: 'logs',
                    cmd: 'read_logs',
                }, function (err, entries) {
                    assert.result(err, entries);
                    assert.lengthOf(entries.data, 3);
                    callback();
                });
            }
        ], done);
    });
});
