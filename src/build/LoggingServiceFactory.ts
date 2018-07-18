import { Factory } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';

import { LoggingMemoryPersistence } from '../persistence/LoggingMemoryPersistence';
import { LoggingMongoDbPersistence} from '../persistence/LoggingMongoDbPersistence';
import { LoggingController } from '../logic/LoggingController';
import { LoggingHttpServiceV1 } from '../services/version1/LoggingHttpServiceV1';
import { LoggingSenecaServiceV1 } from '../services/version1/LoggingSenecaServiceV1'; 

export class LoggingServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-logging", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence", "memory", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-logging", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-logging", "controller", "default", "*", "1.0");
	public static SenecaServiceDescriptor = new Descriptor("pip-services-logging", "service", "seneca", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-logging", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(LoggingServiceFactory.MemoryPersistenceDescriptor, LoggingMemoryPersistence);
		this.registerAsType(LoggingServiceFactory.MongoDbPersistenceDescriptor, LoggingMongoDbPersistence);
		this.registerAsType(LoggingServiceFactory.ControllerDescriptor, LoggingController);
		this.registerAsType(LoggingServiceFactory.SenecaServiceDescriptor, LoggingSenecaServiceV1);
		this.registerAsType(LoggingServiceFactory.HttpServiceDescriptor, LoggingHttpServiceV1);
	}
	
}
