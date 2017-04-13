"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_aws_node_1 = require("pip-services-aws-node");
const LoggingFactory_1 = require("../build/LoggingFactory");
class LoggingLambdaFunction extends pip_services_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("logging", "Trace logging function");
        this._dependencyResolver.put('controller', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'controller', 'default', '*', '*'));
        this._factories.add(new LoggingFactory_1.LoggingFactory());
    }
}
exports.LoggingLambdaFunction = LoggingLambdaFunction;
exports.handler = new LoggingLambdaFunction().getHandler();
//# sourceMappingURL=LoggingLambdaFunction.js.map