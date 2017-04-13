import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { LoggingFactory } from '../build/LoggingFactory';

export class LoggingProcess extends ProcessContainer {

    public constructor() {
        super("logging", "Trace logging microservice");
        this._factories.add(new LoggingFactory);
    }

}
