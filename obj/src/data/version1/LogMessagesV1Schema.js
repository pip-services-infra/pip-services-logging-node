"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const LogMessageV1Schema_1 = require("./LogMessageV1Schema");
class LogMessagesV1Schema extends pip_services_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services_commons_node_3.TypeCode.String);
        this.withRequiredProperty('level', pip_services_commons_node_3.TypeCode.Long);
        this.withRequiredProperty('start_time', null); // TypeCode.Date);
        this.withRequiredProperty('end_time', null); // TypeCode.Date);
        this.withRequiredProperty('last_time', null); // TypeCode.Date);
        this.withOptionalProperty('count', pip_services_commons_node_3.TypeCode.Integer);
        this.withOptionalProperty('logs', new pip_services_commons_node_2.ArraySchema(LogMessageV1Schema_1.LogMessageV1Schema));
    }
}
exports.LogMessagesV1Schema = LogMessagesV1Schema;
//# sourceMappingURL=LogMessagesV1Schema.js.map