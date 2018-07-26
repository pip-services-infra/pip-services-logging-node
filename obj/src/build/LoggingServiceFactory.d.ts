import { Factory } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
export declare class LoggingServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static LoggingMessagesMemoryPersistenceDescriptor: Descriptor;
    static LoggingErrorsMemoryPersistenceDescriptor: Descriptor;
    static LoggingMessagesMongoDbPersistenceDescriptor: Descriptor;
    static LoggingErrorsMongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static SenecaServiceDescriptor: Descriptor;
    static HttpServiceDescriptor: Descriptor;
    constructor();
}
