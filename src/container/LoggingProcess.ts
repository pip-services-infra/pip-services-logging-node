import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';
import { DefaultRpcFactory } from 'pip-services-rpc-node';

import { LoggingServiceFactory } from '../build/LoggingServiceFactory';

export class LoggingProcess extends ProcessContainer {

    public constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
