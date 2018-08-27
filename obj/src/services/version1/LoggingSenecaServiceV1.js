"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_seneca_node_1 = require("pip-services-seneca-node");
class LoggingSenecaServiceV1 extends pip_services_seneca_node_1.CommandableSenecaService {
    constructor() {
        super('logging');
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'controller', 'default', '*', '1.0'));
    }
}
exports.LoggingSenecaServiceV1 = LoggingSenecaServiceV1;
//# sourceMappingURL=LoggingSenecaServiceV1.js.map