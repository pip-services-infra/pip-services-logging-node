"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const LoggingMemoryPersistence_1 = require("../persistence/LoggingMemoryPersistence");
const LogsMongoDbPersistence_1 = require("../persistence/LogsMongoDbPersistence");
const ErrorsMongoDbPersistence_1 = require("../persistence/ErrorsMongoDbPersistence");
const LoggingController_1 = require("../logic/LoggingController");
const LoggingHttpServiceV1_1 = require("../services/version1/LoggingHttpServiceV1");
const LoggingSenecaServiceV1_1 = require("../services/version1/LoggingSenecaServiceV1");
class LoggingServiceFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(LoggingServiceFactory.MemoryPersistenceDescriptor, LoggingMemoryPersistence_1.LoggingMemoryPersistence);
        this.registerAsType(LoggingServiceFactory.LogsMongoDbPersistenceDescriptor, LogsMongoDbPersistence_1.LogsMongoDbPersistence);
        this.registerAsType(LoggingServiceFactory.ErrorsMongoDbPersistenceDescriptor, ErrorsMongoDbPersistence_1.ErrorsMongoDbPersistence);
        this.registerAsType(LoggingServiceFactory.ControllerDescriptor, LoggingController_1.LoggingController);
        this.registerAsType(LoggingServiceFactory.SenecaServiceDescriptor, LoggingSenecaServiceV1_1.LoggingSenecaServiceV1);
        this.registerAsType(LoggingServiceFactory.HttpServiceDescriptor, LoggingHttpServiceV1_1.LoggingHttpServiceV1);
    }
}
LoggingServiceFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "factory", "default", "default", "1.0");
LoggingServiceFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "persistence", "memory", "*", "1.0");
LoggingServiceFactory.LogsMongoDbPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "persistence", "mongodb", "logs", "1.0");
LoggingServiceFactory.ErrorsMongoDbPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "persistence", "mongodb", "errors", "1.0");
LoggingServiceFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "controller", "default", "*", "1.0");
LoggingServiceFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "service", "seneca", "*", "1.0");
LoggingServiceFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "service", "http", "*", "1.0");
exports.LoggingServiceFactory = LoggingServiceFactory;
//# sourceMappingURL=LoggingServiceFactory.js.map