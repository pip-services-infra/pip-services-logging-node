"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const pip_services3_commons_node_9 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const LogMessageV1Schema_1 = require("../data/version1/LogMessageV1Schema");
class LoggingCommandSet extends pip_services3_commons_node_1.CommandSet {
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
        return new pip_services3_commons_node_2.Command("read_messages", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.readMessages(correlationId, filter, paging, callback);
        });
    }
    makeReadErrorsCommand() {
        return new pip_services3_commons_node_2.Command("read_errors", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.readErrors(correlationId, filter, paging, callback);
        });
    }
    makeWriteMessageCommand() {
        return new pip_services3_commons_node_2.Command("write_message", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('message', new LogMessageV1Schema_1.LogMessageV1Schema()), (correlationId, args, callback) => {
            let message = args.get("message");
            message.level = pip_services3_components_node_1.LogLevelConverter.toLogLevel(message.level);
            message.time = pip_services3_commons_node_9.DateTimeConverter.toNullableDateTime(message.time);
            this._logic.writeMessage(correlationId, message, callback);
        });
    }
    makeWriteMessagesCommand() {
        return new pip_services3_commons_node_2.Command("write_messages", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('messages', new pip_services3_commons_node_6.ArraySchema(new LogMessageV1Schema_1.LogMessageV1Schema())), (correlationId, args, callback) => {
            let messages = args.get("messages");
            _.each(messages, (m) => {
                m.time = pip_services3_commons_node_9.DateTimeConverter.toNullableDateTime(m.time);
            });
            this._logic.writeMessages(correlationId, messages, callback);
        });
    }
    makeClearCommand() {
        return new pip_services3_commons_node_2.Command("clear", null, (correlationId, args, callback) => {
            this._logic.clear(correlationId, callback);
        });
    }
}
exports.LoggingCommandSet = LoggingCommandSet;
//# sourceMappingURL=LoggingCommandSet.js.map