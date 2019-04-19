import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class LoggingHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/logging');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-logging', 'controller', 'default', '*', '1.0'));
    }
}