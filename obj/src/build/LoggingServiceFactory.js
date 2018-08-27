"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
const LoggingMemoryPersistence_1 = require("../persistence/LoggingMemoryPersistence");
const LoggingMessagesMongoDbPersistence_1 = require("../persistence/LoggingMessagesMongoDbPersistence");
const LoggingErrorsMongoDbPersistence_1 = require("../persistence/LoggingErrorsMongoDbPersistence");
const LoggingController_1 = require("../logic/LoggingController");
const LoggingHttpServiceV1_1 = require("../services/version1/LoggingHttpServiceV1");
const LoggingSenecaServiceV1_1 = require("../services/version1/LoggingSenecaServiceV1");
class LoggingServiceFactory extends pip_services_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(LoggingServiceFactory.LoggingMessagesMemoryPersistenceDescriptor, LoggingMemoryPersistence_1.LoggingMemoryPersistence);
        this.registerAsType(LoggingServiceFactory.LoggingErrorsMemoryPersistenceDescriptor, LoggingMemoryPersistence_1.LoggingMemoryPersistence);
        this.registerAsType(LoggingServiceFactory.LoggingMessagesMongoDbPersistenceDescriptor, LoggingMessagesMongoDbPersistence_1.LoggingMessagesMongoDbPersistence);
        this.registerAsType(LoggingServiceFactory.LoggingErrorsMongoDbPersistenceDescriptor, LoggingErrorsMongoDbPersistence_1.LoggingErrorsMongoDbPersistence);
        this.registerAsType(LoggingServiceFactory.ControllerDescriptor, LoggingController_1.LoggingController);
        this.registerAsType(LoggingServiceFactory.SenecaServiceDescriptor, LoggingSenecaServiceV1_1.LoggingSenecaServiceV1);
        this.registerAsType(LoggingServiceFactory.HttpServiceDescriptor, LoggingHttpServiceV1_1.LoggingHttpServiceV1);
    }
}
LoggingServiceFactory.Descriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "factory", "default", "default", "1.0");
LoggingServiceFactory.LoggingMessagesMemoryPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "persistence-messages", "memory", "*", "1.0");
LoggingServiceFactory.LoggingErrorsMemoryPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "persistence-errors", "memory", "*", "1.0");
LoggingServiceFactory.LoggingMessagesMongoDbPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "persistence-messages", "mongodb", "*", "1.0");
LoggingServiceFactory.LoggingErrorsMongoDbPersistenceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "persistence-errors", "mongodb", "*", "1.0");
LoggingServiceFactory.ControllerDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "controller", "default", "*", "1.0");
LoggingServiceFactory.SenecaServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "service", "seneca", "*", "1.0");
LoggingServiceFactory.HttpServiceDescriptor = new pip_services_commons_node_1.Descriptor("pip-services-logging", "service", "http", "*", "1.0");
exports.LoggingServiceFactory = LoggingServiceFactory;
//# sourceMappingURL=LoggingServiceFactory.js.map