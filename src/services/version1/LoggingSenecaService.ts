let _ = require('lodash');

import { Category } from 'pip-services-runtime-node';
import { ComponentDescriptor } from 'pip-services-runtime-node';
import { ComponentSet } from 'pip-services-runtime-node';
import { DynamicMap } from 'pip-services-runtime-node';
import { SenecaService } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

import { LoggingController } from '../../logic/LoggingController';
import { ILoggingBusinessLogic } from '../../logic/ILoggingBusinessLogic';

export class LoggingSenecaService extends SenecaService {       
	/**
	 * Unique descriptor for the DummySenecaService component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Services, "pip-services-logging", "seneca", "1.0"
	);

    private _logic: ILoggingBusinessLogic;

    constructor() {
        super(LoggingSenecaService.Descriptor);
    }
    
	public link(components: ComponentSet): void {
		this._logic = <ILoggingBusinessLogic>components.getOnePrior(
			this, new ComponentDescriptor(Category.BusinessLogic, "pip-services-logging", "*", "*")
		);

		super.link(components);		

        this.registerCommands('logs', this._logic.getCommands());
	}

}
