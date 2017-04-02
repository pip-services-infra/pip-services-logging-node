"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const LoggingMemoryPersistence_1 = require("../persistence/LoggingMemoryPersistence");
const LoggingController_1 = require("../logic/LoggingController");
const LoggingHttpServiceV1_1 = require("../services/version1/LoggingHttpServiceV1");
const LoggingSenecaServiceV1_1 = require("../services/version1/LoggingSenecaServiceV1");
class LoggingFactory extends pip_services_commons_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(LoggingFactory.MemoryPersistenceDescriptor, LoggingMemoryPersistence_1.LoggingMemoryPersistence);
        this.registerAsType(LoggingFactory.ControllerDescriptor, LoggingController_1.LoggingController);
        this.registerAsType(LoggingFactory.SenecaServiceDescriptor, LoggingSenecaServiceV1_1.LoggingSenecaServiceV1);
        this.registerAsType(LoggingFactory.HttpServiceDescriptor, LoggingHttpServiceV1_1.LoggingHttpServiceV1);
    }
}
LoggingFactory.Descriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "factory", "default", "default", "1.0");
LoggingFactory.MemoryPersistenceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "persistence", "memory", "*", "1.0");
LoggingFactory.ControllerDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "controller", "default", "*", "1.0");
LoggingFactory.SenecaServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "service", "seneca", "*", "1.0");
LoggingFactory.HttpServiceDescriptor = new pip_services_commons_node_2.Descriptor("pip-services-logging", "service", "http", "*", "1.0");
exports.LoggingFactory = LoggingFactory;
//# sourceMappingURL=LoggingFactory.js.map