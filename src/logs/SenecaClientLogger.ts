import { Category, ComponentSet } from 'pip-services-runtime-node';
import { ComponentDescriptor } from 'pip-services-runtime-node';
import { AbstractLogger } from 'pip-services-runtime-node';
import { LogLevel } from 'pip-services-runtime-node';
import { LogFormatter } from 'pip-services-runtime-node';
import { State } from 'pip-services-runtime-node';

import { ILoggingClient } from '../clients/version1/ILoggingClient';
import { LoggingSenecaClient } from '../clients/version1/LoggingSenecaClient';

var _ = require('lodash');

export class SenecaClientLogger extends AbstractLogger {
    private _client: LoggingSenecaClient;
	/**
	 * Unique descriptor for the ConsoleLogger component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Logs, "pip-services-runtime-log", "service", "*"
	);
    
    constructor() {
        super(SenecaClientLogger.Descriptor);
    }

    public link(components: ComponentSet): void { 
        // Get client for logging service
        let loggingClient = <LoggingSenecaClient>components.getOneRequired(LoggingSenecaClient.Descriptor);
        // Set client reference    
        this._client = loggingClient;

        super.link(components);
    }

    public log(level: number, component: string, correlationId: string, messages: any[]): void {
        if (this.getLevel() < level) return;

        if (correlationId != null)
            messages.push(", correlated to " + correlationId);
        let stringOutput: string = LogFormatter.formatMessage(messages);
        let outputMessage = {
            level: level,
            component: component,
            message: stringOutput
        };
        let objectOutput = [outputMessage];

        if (this._client != null && this._client.getState() == State.Ready) {
            this._client.writePersistedLog(correlationId, objectOutput, () => {
            });
        } else {
            console.log(stringOutput);
        }
    }                
}
