var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var LoggingFactory_1 = require('../build/LoggingFactory');
/**
 * Dummy microservice class.
 *
 * @author Volodymyr Tkachenko
 * @version 1.0
 * @since 2016-06-24
 */
var LoggingMicroservice = (function (_super) {
    __extends(LoggingMicroservice, _super);
    /**
     * Creates instance of dummy microservice.
     */
    function LoggingMicroservice() {
        _super.call(this, "pip-services-logging", LoggingFactory_1.LoggingFactory.Instance);
    }
    return LoggingMicroservice;
})(pip_services_runtime_node_1.Microservice);
exports.LoggingMicroservice = LoggingMicroservice;
