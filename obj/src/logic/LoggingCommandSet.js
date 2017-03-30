"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
class LoggingCommandSet extends pip_services_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeReadMessagesCommand());
        this.addCommand(this.makeReadErrorsCommand());
        this.addCommand(this.makeWriteMessageCommand());
        this.addCommand(this.makeWriteMessagesCommand());
        this.addCommand(this.makeClearCommand());
    }
    makeReadMessagesCommand() {
        return new pip_services_commons_node_2.Command("read_messages", null, (correlationId, args, callback) => {
            let filter = pip_services_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.readMessages(correlationId, filter, paging, callback);
        });
    }
    makeReadErrorsCommand() {
        return new pip_services_commons_node_2.Command("read_errors", null, (correlationId, args, callback) => {
            let filter = pip_services_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.readErrors(correlationId, filter, paging, callback);
        });
    }
    makeWriteMessageCommand() {
        return new pip_services_commons_node_2.Command("write_message", null, (correlationId, args, callback) => {
            let message = args.get("message");
            this._logic.writeMessage(correlationId, message, callback);
        });
    }
    makeWriteMessagesCommand() {
        return new pip_services_commons_node_2.Command("write_messages", null, (correlationId, args, callback) => {
            let messages = args.get("messages");
            this._logic.writeMessages(correlationId, messages, callback);
        });
    }
    makeClearCommand() {
        return new pip_services_commons_node_2.Command("clear", null, (correlationId, args, callback) => {
            this._logic.clear(correlationId, callback);
        });
    }
}
exports.LoggingCommandSet = LoggingCommandSet;
//# sourceMappingURL=LoggingCommandSet.js.map