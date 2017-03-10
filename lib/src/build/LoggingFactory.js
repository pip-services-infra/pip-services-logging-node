var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var LoggingMongoDbPersistence_1 = require('../persistence/LoggingMongoDbPersistence');
var LoggingController_1 = require('../logic/LoggingController');
var LoggingSenecaService_1 = require('../services/version1/LoggingSenecaService');
var LoggingSenecaClient_1 = require('../clients/version1/LoggingSenecaClient');
var SenecaClientLogger_1 = require('../logs/SenecaClientLogger');
var LoggingFactory = (function (_super) {
    __extends(LoggingFactory, _super);
    function LoggingFactory() {
        _super.call(this);
        this.register(pip_services_runtime_node_1.NullLogger.Descriptor, pip_services_runtime_node_1.NullLogger);
        this.register(pip_services_runtime_node_1.ConsoleLogger.Descriptor, pip_services_runtime_node_1.ConsoleLogger);
        this.register(pip_services_runtime_node_1.NullCounters.Descriptor, pip_services_runtime_node_1.NullCounters);
        this.register(pip_services_runtime_node_1.LogCounters.Descriptor, pip_services_runtime_node_1.LogCounters);
        this.register(pip_services_runtime_node_1.NullCache.Descriptor, pip_services_runtime_node_1.NullCache);
        this.register(pip_services_runtime_node_1.MemoryCache.Descriptor, pip_services_runtime_node_1.MemoryCache);
        this.register(pip_services_runtime_node_1.FileBootConfig.Descriptor, pip_services_runtime_node_1.FileBootConfig);
        this.register(pip_services_runtime_node_1.SenecaAddon.Descriptor, pip_services_runtime_node_1.SenecaAddon);
        this.register(LoggingMongoDbPersistence_1.LoggingMongoDbPersistence.Descriptor, LoggingMongoDbPersistence_1.LoggingMongoDbPersistence);
        this.register(LoggingController_1.LoggingController.Descriptor, LoggingController_1.LoggingController);
        this.register(LoggingSenecaService_1.LoggingSenecaService.Descriptor, LoggingSenecaService_1.LoggingSenecaService);
        this.register(LoggingSenecaClient_1.LoggingSenecaClient.Descriptor, LoggingSenecaClient_1.LoggingSenecaClient);
        this.register(SenecaClientLogger_1.SenecaClientLogger.Descriptor, SenecaClientLogger_1.SenecaClientLogger);
    }
    LoggingFactory.Instance = new LoggingFactory();
    return LoggingFactory;
})(pip_services_runtime_node_1.ComponentFactory);
exports.LoggingFactory = LoggingFactory;
