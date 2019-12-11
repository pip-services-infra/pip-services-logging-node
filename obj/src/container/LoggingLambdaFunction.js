"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const LoggingServiceFactory_1 = require("../build/LoggingServiceFactory");
class LoggingLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("logging", "Trace logging function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-logging', 'controller', 'default', '*', '*'));
        this._factories.add(new LoggingServiceFactory_1.LoggingServiceFactory());
    }
}
exports.LoggingLambdaFunction = LoggingLambdaFunction;
exports.handler = new LoggingLambdaFunction().getHandler();
//# sourceMappingURL=LoggingLambdaFunction.js.map