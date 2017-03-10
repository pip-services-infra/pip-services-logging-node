import { CommandSet } from 'pip-services-runtime-node';
import { ICommand } from 'pip-services-runtime-node';
import { Command } from 'pip-services-runtime-node';
import { Schema } from 'pip-services-runtime-node';
import { DynamicMap } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

import { ILoggingBusinessLogic } from './ILoggingBusinessLogic';

export class LoggingCommandSet extends CommandSet {
    private _logic: ILoggingBusinessLogic;

    constructor(logic: ILoggingBusinessLogic) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeReadLogCommand());
		this.addCommand(this.makeWriteLogCommand());
    }

	private makeReadLogCommand(): ICommand {
		return new Command(
			this._logic,
			"read_logs",
			new Schema()
				.withOptionalProperty("filter", "FilterParams")
				.withOptionalProperty("paging", "PagingParams")
			,
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.readPersistedLog(correlationId, filter, paging, callback);
            }
		);
	}

	private makeWriteLogCommand(): ICommand {
		return new Command(
			this._logic,
			"write_logs",
			new Schema()
				.withProperty("entries", "any[]"),
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let entries = args.get("entries");
                this._logic.writePersistedLog(correlationId, entries, callback);
            }
		);
	}

}