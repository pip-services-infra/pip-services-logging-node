var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var pip_services_runtime_node_4 = require('pip-services-runtime-node');
var pip_services_runtime_node_5 = require('pip-services-runtime-node');
var LoggingSenecaClient_1 = require('../clients/version1/LoggingSenecaClient');
var _ = require('lodash');
var SenecaClientLogger = (function (_super) {
    __extends(SenecaClientLogger, _super);
    function SenecaClientLogger() {
        _super.call(this, SenecaClientLogger.Descriptor);
    }
    SenecaClientLogger.prototype.link = function (components) {
        // Get client for logging service
        var loggingClient = components.getOneRequired(LoggingSenecaClient_1.LoggingSenecaClient.Descriptor);
        // Set client reference    
        this._client = loggingClient;
        _super.prototype.link.call(this, components);
    };
    SenecaClientLogger.prototype.log = function (level, component, correlationId, messages) {
        if (this.getLevel() < level)
            return;
        if (correlationId != null)
            messages.push(", correlated to " + correlationId);
        var stringOutput = pip_services_runtime_node_4.LogFormatter.formatMessage(messages);
        var outputMessage = {
            level: level,
            component: component,
            message: stringOutput
        };
        var objectOutput = [outputMessage];
        if (this._client != null && this._client.getState() == pip_services_runtime_node_5.State.Ready) {
            this._client.writePersistedLog(correlationId, objectOutput, function () {
            });
        }
        else {
            console.log(stringOutput);
        }
    };
    /**
     * Unique descriptor for the ConsoleLogger component
     */
    SenecaClientLogger.Descriptor = new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Logs, "pip-services-runtime-log", "service", "*");
    return SenecaClientLogger;
})(pip_services_runtime_node_3.AbstractLogger);
exports.SenecaClientLogger = SenecaClientLogger;
