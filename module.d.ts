declare module 'pip-services-logging' {

	import { IClient } from 'pip-services-runtime-node';
	import { ILogger, AbstractLogger } from 'pip-services-runtime-node';
    import { SenecaClient } from 'pip-services-runtime-node';
    import { ComponentFactory, ComponentDescriptor, ComponentSet } from 'pip-services-runtime-node';

    export interface ILoggingClient extends IClient {
        readPersistedLog(correlationId: string, filter: any, paging: any, callback: any): void;
        writePersistedLog(correlationId: string, entries: any[], callback: any): void;
    }

    export class LoggingSenecaClient extends SenecaClient implements ILoggingClient {       
	    public static Descriptor: any;
        constructor();
        public readPersistedLog(correlationId: string, filter: any, paging: any, callback): void;
        public writePersistedLog(correlationId: string, entries: any, callback: any): void;
    }

	export class LoggingFactory extends ComponentFactory {
	    public static Instance: LoggingFactory;
		constructor();
	}

    export class SenecaClientLogger extends AbstractLogger {
	    public static Descriptor: ComponentDescriptor;
        constructor();
        public link(components: ComponentSet): void;
        public log(level: number, component: string, correlationId: string, message: any[]): void;
    }
}
