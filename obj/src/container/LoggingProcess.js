"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const LoggingServiceFactory_1 = require("../build/LoggingServiceFactory");
class LoggingProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory_1.LoggingServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.LoggingProcess = LoggingProcess;
//# sourceMappingURL=LoggingProcess.js.map