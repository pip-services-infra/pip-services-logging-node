"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const pip_services_rpc_node_1 = require("pip-services-rpc-node");
const LoggingServiceFactory_1 = require("../build/LoggingServiceFactory");
class LoggingProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory_1.LoggingServiceFactory);
        this._factories.add(new pip_services_rpc_node_1.DefaultRpcFactory);
    }
}
exports.LoggingProcess = LoggingProcess;
//# sourceMappingURL=LoggingProcess.js.map