import { Descriptor } from 'pip-services-commons-node';
import { CommandableSenecaService } from 'pip-services-net-node';

export class LoggingSenecaServiceV1 extends CommandableSenecaService {
    public constructor() {
        super('logging');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-logging', 'controller', 'default', '*', '1.0'));
    }
}