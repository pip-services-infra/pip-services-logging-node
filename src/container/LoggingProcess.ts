import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';
import { DefaultNetFactory } from 'pip-services-net-node';
import { DefaultOssFactory } from 'pip-services-oss-node';

import { LoggingServiceFactory } from '../build/LoggingServiceFactory';

export class LoggingProcess extends ProcessContainer {

    public constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingServiceFactory);
        this._factories.add(new DefaultNetFactory);
        this._factories.add(new DefaultOssFactory);
    }

}
