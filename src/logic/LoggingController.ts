import { Category } from 'pip-services-runtime-node';
import { ComponentDescriptor } from 'pip-services-runtime-node';
import { ComponentSet } from 'pip-services-runtime-node';
import { AbstractController } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

import { ILoggingPersistence } from '../persistence/ILoggingPersistence';
import { ILoggingBusinessLogic } from './ILoggingBusinessLogic';
import { LoggingCommandSet } from './LoggingCommandSet';

export class LoggingController extends AbstractController implements ILoggingBusinessLogic {
	/**
	 * Unique descriptor for the LoggingController component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Controllers, "pip-services-logging", "*", "*"
	);
    
	private _db: ILoggingPersistence;
    
    constructor() {
        super(LoggingController.Descriptor);
    }
    
    public link(components: ComponentSet): void {
        // Locate reference to logging persistence component
        this._db = <ILoggingPersistence>components.getOneRequired(
        	new ComponentDescriptor(Category.Persistence, "pip-services-logging", '*', '*')
    	);
        
        super.link(components);

        // Add commands
        let commands = new LoggingCommandSet(this);
        this.addCommandSet(commands);
    }
        
    public readPersistedLog(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, data: any) => void) {
        callback = this.instrument(correlationId, 'logs.read_logs', callback);
        this._db.readPersistedLog(correlationId, filter, paging, callback);        
	}

    public writePersistedLog(correlationId: string, entries: any[],  callback: (err: any, items: any[]) => void) {
        callback = this.instrument(correlationId, 'logs.write_logs', callback);
        this._db.writePersistedLog(correlationId, entries, callback);        
	}
    
}
