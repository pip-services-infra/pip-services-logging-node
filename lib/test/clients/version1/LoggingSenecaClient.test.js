var _ = require('lodash');
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var pip_services_runtime_node_4 = require('pip-services-runtime-node');
var pip_services_runtime_node_5 = require('pip-services-runtime-node');
var LoggingMongoDbPersistence_1 = require('../../../src/persistence/LoggingMongoDbPersistence');
var LoggingController_1 = require('../../../src/logic/LoggingController');
var LoggingSenecaService_1 = require('../../../src/services/version1/LoggingSenecaService');
var LoggingSenecaClient_1 = require('../../../src/clients/version1/LoggingSenecaClient');
var LoggingClientFixture_1 = require('./LoggingClientFixture');
var options = new pip_services_runtime_node_2.DynamicMap(require('../../../../config/config'));
var dbOptions = new pip_services_runtime_node_3.ComponentConfig(null, options.getMap('persistence'));
suite('LoggingSenecaClient', function () {
    var db = new LoggingMongoDbPersistence_1.LoggingMongoDbPersistence();
    db.configure(dbOptions);
    var ctrl = new LoggingController_1.LoggingController();
    ctrl.configure(new pip_services_runtime_node_3.ComponentConfig());
    var service = new LoggingSenecaService_1.LoggingSenecaService();
    service.configure(new pip_services_runtime_node_3.ComponentConfig());
    var client = new LoggingSenecaClient_1.LoggingSenecaClient();
    client.configure(new pip_services_runtime_node_3.ComponentConfig());
    var seneca = new pip_services_runtime_node_5.SenecaAddon();
    seneca.configure(new pip_services_runtime_node_3.ComponentConfig());
    var components = pip_services_runtime_node_1.ComponentSet.fromComponents(db, ctrl, client, service, seneca);
    var fixture = new LoggingClientFixture_1.LoggingClientFixture(client);
    suiteSetup(function (done) {
        pip_services_runtime_node_4.LifeCycleManager.linkAndOpen(components, done);
    });
    suiteTeardown(function (done) {
        seneca.getSeneca().close(function () {
            pip_services_runtime_node_4.LifeCycleManager.close(components, done);
        });
    });
    setup(function (done) {
        db.clearTestData(done);
    });
    test('CRUD Operations', function (done) {
        fixture.testCrudOperations(done);
    });
});
