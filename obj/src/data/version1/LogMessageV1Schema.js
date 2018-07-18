"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
class LogMessageV1Schema extends pip_services_commons_node_1.ObjectSchema {
    constructor() {
        super();
        let errorSchema = new pip_services_commons_node_1.ObjectSchema()
            .withOptionalProperty('code', pip_services_commons_node_2.TypeCode.String)
            .withOptionalProperty('message', pip_services_commons_node_2.TypeCode.String)
            .withOptionalProperty('stack_trace', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('id', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('time', null); //TypeCode.DateTime);
        this.withOptionalProperty('correlation_id', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('source', pip_services_commons_node_2.TypeCode.String);
        this.withRequiredProperty('level', pip_services_commons_node_2.TypeCode.Long);
        this.withOptionalProperty('message', pip_services_commons_node_2.TypeCode.String);
        this.withOptionalProperty('error', errorSchema);
    }
}
exports.LogMessageV1Schema = LogMessageV1Schema;
//# sourceMappingURL=LogMessageV1Schema.js.map