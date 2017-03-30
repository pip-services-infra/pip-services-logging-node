"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_container_node_1 = require("pip-services-container-node");
const LoggingFactory_1 = require("../build/LoggingFactory");
class LoggingProcess extends pip_services_container_node_1.ProcessContainer {
    initReferences(references) {
        super.initReferences(references);
        // Factory to statically resolve Logging components
        references.put(LoggingFactory_1.LoggingFactory.Descriptor, new LoggingFactory_1.LoggingFactory());
    }
    runWithArguments(args) {
        return this.runWithArgumentsOrConfigFile("Logging", args, "./config/config.yaml");
    }
}
exports.LoggingProcess = LoggingProcess;
//# sourceMappingURL=LoggingProcess.js.map