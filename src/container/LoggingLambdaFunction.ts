import { Descriptor } from 'pip-services-commons-node';
import { CommandableLambdaFunction } from 'pip-services-aws-node';
import { LoggingServiceFactory } from '../build/LoggingServiceFactory';

export class LoggingLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("logging", "Trace logging function");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-logging', 'controller', 'default', '*', '*'));
        this._factories.add(new LoggingServiceFactory());
    }
}

export const handler = new LoggingLambdaFunction().getHandler();