"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const LoggingFactory_1 = require("../build/LoggingFactory");
class LoggingProcess extends pip_services_container_node_1.ProcessContainer {
    constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingFactory_1.LoggingFactory);
    }
}
exports.LoggingProcess = LoggingProcess;
//# sourceMappingURL=LoggingProcess.js.map