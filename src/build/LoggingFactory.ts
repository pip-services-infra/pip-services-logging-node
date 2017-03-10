import { ComponentFactory, NullLogger, ConsoleLogger, NullCounters, LogCounters, NullCache, MemoryCache, MemcachedCache, FileBootConfig, SenecaAddon } from 'pip-services-runtime-node';

import { LoggingMongoDbPersistence } from '../persistence/LoggingMongoDbPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingSenecaService } from '../services/version1/LoggingSenecaService'; 
import { LoggingSenecaClient } from '../clients/version1/LoggingSenecaClient'; 
import { SenecaClientLogger } from '../logs/SenecaClientLogger'; 

export class LoggingFactory extends ComponentFactory {
	public static Instance: LoggingFactory = new LoggingFactory();
	
	constructor() {
		super();

		this.register(NullLogger.Descriptor, NullLogger);
		this.register(ConsoleLogger.Descriptor, ConsoleLogger);
		this.register(NullCounters.Descriptor, NullCounters);
		this.register(LogCounters.Descriptor, LogCounters);
		this.register(NullCache.Descriptor, NullCache);
		this.register(MemoryCache.Descriptor, MemoryCache);
		this.register(FileBootConfig.Descriptor, FileBootConfig);
		this.register(SenecaAddon.Descriptor, SenecaAddon);

		this.register(LoggingMongoDbPersistence.Descriptor, LoggingMongoDbPersistence);
		this.register(LoggingController.Descriptor, LoggingController);
		this.register(LoggingSenecaService.Descriptor, LoggingSenecaService);
		this.register(LoggingSenecaClient.Descriptor, LoggingSenecaClient);

		this.register(SenecaClientLogger.Descriptor, SenecaClientLogger);
	}
	
}
