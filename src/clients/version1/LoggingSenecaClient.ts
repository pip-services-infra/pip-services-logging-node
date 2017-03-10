let _ = require('lodash');

import { Category, State } from 'pip-services-runtime-node';
import { ComponentDescriptor, ComponentSet } from 'pip-services-runtime-node';
import { DynamicMap } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';
import { SenecaClient } from 'pip-services-runtime-node';
import { ILogger, IDiscovery, ICounters } from 'pip-services-runtime-node';
import { LogLevel } from 'pip-services-runtime-node';
import { LogFormatter } from 'pip-services-runtime-node';
import { SenecaAddon } from 'pip-services-runtime-node';

import { ILoggingClient } from './ILoggingClient';

export class LoggingSenecaClient extends SenecaClient implements ILoggingClient {       
	/**
	 * Unique descriptor for the LoggingSenecaClient component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Clients, "pip-services-logging", "seneca", "1.0"
	);

    constructor() {
        super(LoggingSenecaClient.Descriptor);
    }

    public link(components: ComponentSet): void {        
		this.checkNewStateAllowed(State.Linked);
		
        // Get global seneca wrapper        
        let senecaAddon = <SenecaAddon>components.getOneRequired(SenecaAddon.Descriptor);
        // Set seneca reference    
        this._seneca = senecaAddon.getSeneca();

		// Get reference to discovery component
		this._discovery = <IDiscovery>components.getOneOptional(
			new ComponentDescriptor(Category.Discovery, '*', '*', '*')
		);
		
		// Get reference to counters component
		this._counters = <ICounters>components.getOneOptional(
			new ComponentDescriptor(Category.Counters, '*', '*', '*')
		);

		this._state = State.Linked;
    }

    public readPersistedLog(correlationId: string, filter: any, paging: any, callback) {
        callback = this.instrument(correlationId, 'logs.read_logs', callback);
        
        this.call(
            'logs', 'read_logs',
            {
                correlation_id: correlationId,
                filter: filter ? filter.toObject() : null,
                paging: paging ? paging.toObject() : null
            }, 
            callback
        );
    }

    public writePersistedLog(correlationId: string, entries: any, callback: any) {
        callback = this.instrument(correlationId, 'logs.write_logs', callback);
        
        this.call(
            'logs', 'write_logs', 
            {
                correlation_id: correlationId,
                entries: entries
            }, 
            callback
        );
    }
    
}
