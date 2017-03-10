var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var LoggingMongoDbPersistence_1 = require('../../src/persistence/LoggingMongoDbPersistence');
var LoggingPersistenceFixture_1 = require('./LoggingPersistenceFixture');
var options = new pip_services_runtime_node_3.DynamicMap(require('../../../config/config'));
var dbOptions = new pip_services_runtime_node_2.ComponentConfig(null, options.getMap('persistence'));
suite('LoggingMongoDbPersistence', function () {
    // Skip test if mongodb is not configured
    if (dbOptions.getRawContent().getString('descriptor.type') != 'mongodb')
        return;
    var db = new LoggingMongoDbPersistence_1.LoggingMongoDbPersistence();
    db.configure(dbOptions);
    var fixture = new LoggingPersistenceFixture_1.LoggingPersistenceFixture(db);
    suiteSetup(function (done) {
        db.link(new pip_services_runtime_node_1.ComponentSet());
        db.open(done);
    });
    suiteTeardown(function (done) {
        db.close(done);
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        fixture.testCrudOperations(done);
    });
});
