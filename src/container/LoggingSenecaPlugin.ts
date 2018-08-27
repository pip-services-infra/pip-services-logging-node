import { References } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { ConfigParams } from 'pip-services-commons-node';
import { ConsoleLogger } from 'pip-services-components-node';
import { ConfigException } from 'pip-services-commons-node';
import { SenecaPlugin } from 'pip-services-seneca-node';
import { SenecaInstance } from 'pip-services-seneca-node';

import { LoggingMemoryPersistence } from '../persistence/LoggingMemoryPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingSenecaServiceV1 } from '../services/version1/LoggingSenecaServiceV1';

export class LoggingSenecaPlugin extends SenecaPlugin {
    public constructor(seneca: any, options: any) {
        super('pip-services-logging', seneca, LoggingSenecaPlugin.createReferences(seneca, options));
    }

    private static createReferences(seneca: any, options: any): References {
        options = options || {};

        let logger = new ConsoleLogger();
        let loggerOptions = options.logger || {};
        logger.configure(ConfigParams.fromValue(loggerOptions));

        let controller = new LoggingController();

        let messagesPersistenceOptions = options.messagesPersistence || {};
        let messagesPersistence = new LoggingMemoryPersistence();
        messagesPersistence.configure(ConfigParams.fromValue(messagesPersistenceOptions));

        let errorsPersistenceOptions = options.errorsPersistence || {};
        let errorsPersistence = new LoggingMemoryPersistence();
        errorsPersistence.configure(ConfigParams.fromValue(errorsPersistenceOptions));

        let senecaInstance = new SenecaInstance(seneca);

        let service = new LoggingSenecaServiceV1();
        let serviceOptions = options.service || {};
        service.configure(ConfigParams.fromValue(serviceOptions));

        return References.fromTuples(
            new Descriptor('pip-services', 'logger', 'console', 'default', '1.0'), logger,
            new Descriptor('pip-services-seneca', 'seneca', 'instance', 'default', '1.0'), senecaInstance,
            new Descriptor('pip-services-logging', 'persistence-messages', 'memory', 'default', '1.0'), messagesPersistence,
            new Descriptor('pip-services-logging', 'persistence-errors', 'memory', 'default', '1.0'), errorsPersistence,
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