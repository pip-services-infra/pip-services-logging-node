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
var LoggingCommandSet = (function (_super) {
    __extends(LoggingCommandSet, _super);
    function LoggingCommandSet(logic) {
        _super.call(this);
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeReadLogCommand());
        this.addCommand(this.makeWriteLogCommand());
    }
    LoggingCommandSet.prototype.makeReadLogCommand = function () {
        var _this = this;
        return new pip_services_runtime_node_2.Command(this._logic, "read_logs", new pip_services_runtime_node_3.Schema()
            .withOptionalProperty("filter", "FilterParams")
            .withOptionalProperty("paging", "PagingParams"), function (correlationId, args, callback) {
            var filter = pip_services_runtime_node_4.FilterParams.fromValue(args.get("filter"));
            var paging = pip_services_runtime_node_5.PagingParams.fromValue(args.get("paging"));
            _this._logic.readPersistedLog(correlationId, filter, paging, callback);
        });
    };
    LoggingCommandSet.prototype.makeWriteLogCommand = function () {
        var _this = this;
        return new pip_services_runtime_node_2.Command(this._logic, "write_logs", new pip_services_runtime_node_3.Schema()
            .withProperty("entries", "any[]"), function (correlationId, args, callback) {
            var entries = args.get("entries");
            _this._logic.writePersistedLog(correlationId, entries, callback);
        });
    };
    return LoggingCommandSet;
})(pip_services_runtime_node_1.CommandSet);
exports.LoggingCommandSet = LoggingCommandSet;
