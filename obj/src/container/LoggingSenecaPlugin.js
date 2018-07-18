"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const pip_services_net_node_1 = require("pip-services-net-node");
const pip_services_net_node_2 = require("pip-services-net-node");
const LoggingMemoryPersistence_1 = require("../persistence/LoggingMemoryPersistence");
const LoggingController_1 = require("../logic/LoggingController");
const LoggingSenecaServiceV1_1 = require("../services/version1/LoggingSenecaServiceV1");
class LoggingSenecaPlugin extends pip_services_net_node_1.SenecaPlugin {
    constructor(seneca, options) {
        super('pip-services-logging', seneca, LoggingSenecaPlugin.createReferences(seneca, options));
    }
    static createReferences(seneca, options) {
        options = options || {};
        let logger = new pip_services_commons_node_4.ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(pip_services_commons_node_3.ConfigParams.fromValue(loggerOptions));
        let controller = new LoggingController_1.LoggingController();
        let persistenceOptions = options.persistence || {};
        let persistence = new LoggingMemoryPersistence_1.LoggingMemoryPersistence();
        persistence.configure(pip_services_commons_node_3.ConfigParams.fromValue(persistenceOptions));
        let senecaInstance = new pip_services_net_node_2.SenecaInstance(seneca);
        let service = new LoggingSenecaServiceV1_1.LoggingSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(pip_services_commons_node_3.ConfigParams.fromValue(serviceOptions));
        return pip_services_commons_node_1.References.fromTuples(new pip_services_commons_node_2.Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger, new pip_services_commons_node_2.Descriptor('pip-services-net', 'seneca', 'instance', 'default', '1.0'), senecaInstance, new pip_services_commons_node_2.Descriptor('pip-services-logging', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services_commons_node_2.Descriptor('pip-services-logging', 'controller', 'default', 'default', '1.0'), controller, new pip_services_commons_node_2.Descriptor('pip-services-logging', 'service', 'seneca', 'default', '1.0'), service);
    }
}
exports.LoggingSenecaPlugin = LoggingSenecaPlugin;
module.exports = function (options) {
    let seneca = this;
    let plugin = new LoggingSenecaPlugin(seneca, options);
    return { name: plugin.name };
};
//# sourceMappingURL=LoggingSenecaPlugin.js.map