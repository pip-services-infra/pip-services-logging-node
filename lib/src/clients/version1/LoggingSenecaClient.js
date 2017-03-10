var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var pip_services_runtime_node_4 = require('pip-services-runtime-node');
var LoggingSenecaClient = (function (_super) {
    __extends(LoggingSenecaClient, _super);
    function LoggingSenecaClient() {
        _super.call(this, LoggingSenecaClient.Descriptor);
    }
    LoggingSenecaClient.prototype.link = function (components) {
        this.checkNewStateAllowed(pip_services_runtime_node_1.State.Linked);
        // Get global seneca wrapper        
        var senecaAddon = components.getOneRequired(pip_services_runtime_node_4.SenecaAddon.Descriptor);
        // Set seneca reference    
        this._seneca = senecaAddon.getSeneca();
        // Get reference to discovery component
        this._discovery = components.getOneOptional(new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Discovery, '*', '*', '*'));
        // Get reference to counters component
        this._counters = components.getOneOptional(new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Counters, '*', '*', '*'));
        this._state = pip_services_runtime_node_1.State.Linked;
    };
    LoggingSenecaClient.prototype.readPersistedLog = function (correlationId, filter, paging, callback) {
        callback = this.instrument(correlationId, 'logs.read_logs', callback);
        this.call('logs', 'read_logs', {
            correlation_id: correlationId,
            filter: filter ? filter.toObject() : null,
            paging: paging ? paging.toObject() : null
        }, callback);
    };
    LoggingSenecaClient.prototype.writePersistedLog = function (correlationId, entries, callback) {
        callback = this.instrument(correlationId, 'logs.write_logs', callback);
        this.call('logs', 'write_logs', {
            correlation_id: correlationId,
            entries: entries
        }, callback);
    };
    /**
     * Unique descriptor for the LoggingSenecaClient component
     */
    LoggingSenecaClient.Descriptor = new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Clients, "pip-services-logging", "seneca", "1.0");
    return LoggingSenecaClient;
})(pip_services_runtime_node_3.SenecaClient);
exports.LoggingSenecaClient = LoggingSenecaClient;
