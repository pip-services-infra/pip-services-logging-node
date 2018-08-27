import { Factory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

import { LoggingMemoryPersistence } from '../persistence/LoggingMemoryPersistence';
import { LoggingMessagesMongoDbPersistence} from '../persistence/LoggingMessagesMongoDbPersistence';
import { LoggingErrorsMongoDbPersistence} from '../persistence/LoggingErrorsMongoDbPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingHttpServiceV1 } from '../services/version1/LoggingHttpServiceV1';
import { LoggingSenecaServiceV1 } from '../services/version1/LoggingSenecaServiceV1'; 

export class LoggingServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-logging", "factory", "default", "default", "1.0");
	public static LoggingMessagesMemoryPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence-messages", "memory", "*", "1.0");
	public static LoggingErrorsMemoryPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence-errors", "memory", "*", "1.0");
	public static LoggingMessagesMongoDbPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence-messages", "mongodb", "*", "1.0");
	public static LoggingErrorsMongoDbPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence-errors", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-logging", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-logging", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-logging", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(LoggingServiceFactory.LoggingMessagesMemoryPersistenceDescriptor, LoggingMemoryPersistence);
		this.registerAsType(LoggingServiceFactory.LoggingErrorsMemoryPersistenceDescriptor, LoggingMemoryPersistence);
		this.registerAsType(LoggingServiceFactory.LoggingMessagesMongoDbPersistenceDescriptor, LoggingMessagesMongoDbPersistence);
		this.registerAsType(LoggingServiceFactory.LoggingErrorsMongoDbPersistenceDescriptor, LoggingErrorsMongoDbPersistence);
		this.registerAsType(LoggingServiceFactory.ControllerDescriptor, LoggingController);
		this.registerAsType(LoggingServiceFactory.SenecaServiceDescriptor, LoggingSenecaServiceV1);
		this.registerAsType(LoggingServiceFactory.HttpServiceDescriptor, LoggingHttpServiceV1);
	}
	
}
