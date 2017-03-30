import { References } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-commons-node';
import { ConfigException } from 'pip-services-commons-node';
import { SenecaPlugin } from 'pip-services-net-node';

import { LoggingMemoryPersistence } from '../persistence/LoggingMemoryPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingSenecaServiceV1 } from '../services/version1/LoggingSenecaServiceV1';

export class LoggingSenecaPlugin extends SenecaPlugin {
    public constructor(seneca: any, options: any) {
        super('pip-services-logging', seneca, LoggingSenecaPlugin.createReferences(options));
    }

    private static createReferences(options: any): References {
        options = options || {};

        let logger = new ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(ConfigParams.fromValue(loggerOptions));

        let controller = new LoggingController();

        let persistenceOptions = options.persistence || {};
        let persistence = new LoggingMemoryPersistence();
        persistence.configure(ConfigParams.fromValue(persistenceOptions));

        let service = new LoggingSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(ConfigParams.fromValue(serviceOptions));

        return References.fromTuples(
            new Descriptor('pip-services-commons', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-logging', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-logging', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-logging', 'service', 'seneca', 'default', '1.0'), service
        );
    }
}

module.exports = function(options: any): any {
    let seneca = this;
    let plugin = new LoggingSenecaPlugin(seneca, options);
    return { name: plugin.name };
}