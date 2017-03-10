var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var LoggingMicroservice_1 = require('./LoggingMicroservice');
/**
 * Logging process runner
 *
 * @author Volodymyr Tkachenko
 * @version 1.0
 * @since 2016-06-24
 */
var LoggingProcessRunner = (function (_super) {
    __extends(LoggingProcessRunner, _super);
    /**
     * Creates instance of logging process runner
     */
    function LoggingProcessRunner() {
        _super.call(this, new LoggingMicroservice_1.LoggingMicroservice());
    }
    return LoggingProcessRunner;
})(pip_services_runtime_node_1.ProcessRunner);
exports.LoggingProcessRunner = LoggingProcessRunner;
