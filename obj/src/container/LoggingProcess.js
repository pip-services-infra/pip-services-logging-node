"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_oss_node_1 = require("pip-services-oss-node");
const LoggingServiceFactory_1 = require("../build/LoggingServiceFactory");
class LoggingProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory_1.LoggingServiceFactory);
        this._factories.add(new pip_services_net_node_1.DefaultNetFactory);
        this._factories.add(new pip_services_oss_node_1.DefaultOssFactory);
    }
}
exports.LoggingProcess = LoggingProcess;
//# sourceMappingURL=LoggingProcess.js.map