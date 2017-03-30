import { IReferences } from 'pip-services-commons-node';
import { ProcessContainer } from 'pip-services-container-node';

import { LoggingFactory } from '../build/LoggingFactory';

export class LoggingProcess extends ProcessContainer {

    protected initReferences(references: IReferences): void {
        super.initReferences(references);

        // Factory to statically resolve Logging components
        references.put(LoggingFactory.Descriptor, new LoggingFactory());
    }

    public runWithArguments(args: string[]): void {
        return this.runWithArgumentsOrConfigFile("Logging", args, "./config/config.yaml");
    }

}
