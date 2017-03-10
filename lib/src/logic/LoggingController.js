var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var LoggingCommandSet_1 = require('./LoggingCommandSet');
var LoggingController = (function (_super) {
    __extends(LoggingController, _super);
    function LoggingController() {
        _super.call(this, LoggingController.Descriptor);
    }
    LoggingController.prototype.link = function (components) {
        // Locate reference to logging persistence component
        this._db = components.getOneRequired(new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Persistence, "pip-services-logging", '*', '*'));
        _super.prototype.link.call(this, components);
        // Add commands
        var commands = new LoggingCommandSet_1.LoggingCommandSet(this);
        this.addCommandSet(commands);
    };
    LoggingController.prototype.readPersistedLog = function (correlationId, filter, paging, callback) {
        callback = this.instrument(correlationId, 'logs.read_logs', callback);
        this._db.readPersistedLog(correlationId, filter, paging, callback);
    };
    LoggingController.prototype.writePersistedLog = function (correlationId, entries, callback) {
        callback = this.instrument(correlationId, 'logs.write_logs', callback);
        this._db.writePersistedLog(correlationId, entries, callback);
    };
    /**
     * Unique descriptor for the LoggingController component
     */
    LoggingController.Descriptor = new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Controllers, "pip-services-logging", "*", "*");
    return LoggingController;
})(pip_services_runtime_node_3.AbstractController);
exports.LoggingController = LoggingController;
