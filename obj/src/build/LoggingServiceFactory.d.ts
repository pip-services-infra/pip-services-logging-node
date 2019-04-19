import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
export declare class LoggingServiceFactory extends Factory {
    static Descriptor: Descriptor;
    static LoggingMessagesMemoryPersistenceDescriptor: Descriptor;
    static LoggingErrorsMemoryPersistenceDescriptor: Descriptor;
    static LoggingMessagesMongoDbPersistenceDescriptor: Descriptor;
    static LoggingErrorsMongoDbPersistenceDescriptor: Descriptor;
    static ControllerDescriptor: Descriptor;
    static HttpServiceDescriptor: Descriptor;
    constructor();
}
