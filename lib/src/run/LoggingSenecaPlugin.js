var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var LoggingMicroservice_1 = require('./LoggingMicroservice');
var LoggingSenecaPlugin = (function (_super) {
    __extends(LoggingSenecaPlugin, _super);
    function LoggingSenecaPlugin() {
        _super.call(this, 'logs', new LoggingMicroservice_1.LoggingMicroservice());
    }
    return LoggingSenecaPlugin;
})(pip_services_runtime_node_1.SenecaPlugin);
exports.LoggingSenecaPlugin = LoggingSenecaPlugin;
