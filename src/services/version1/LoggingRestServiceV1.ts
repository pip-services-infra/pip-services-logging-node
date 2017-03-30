import { Descriptor } from 'pip-services-commons-node';
import { CommandableRestService } from 'pip-services-net-node';

export class LoggingRestServiceV1 extends CommandableRestService {
    public constructor() {
        super('logging');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-logging', 'controller', 'default', '*', '1.0'));
    }
}