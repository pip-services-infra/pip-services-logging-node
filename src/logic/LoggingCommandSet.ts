import { CommandSet } from 'pip-services-commons-node';
import { ICommand } from 'pip-services-commons-node';
import { Command } from 'pip-services-commons-node';
import { Schema } from 'pip-services-commons-node';
import { Parameters } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingBusinessLogic } from './ILoggingBusinessLogic';

export class LoggingCommandSet extends CommandSet {
	private _logic: ILoggingBusinessLogic;

	constructor(logic: ILoggingBusinessLogic) {
		super();

		this._logic = logic;

		this.addCommand(this.makeReadMessagesCommand());
		this.addCommand(this.makeReadErrorsCommand());
		this.addCommand(this.makeWriteMessageCommand());
		this.addCommand(this.makeWriteMessagesCommand());
		this.addCommand(this.makeClearCommand());
	}

	private makeReadMessagesCommand(): ICommand {
		return new Command(
			"read_messages",
			null,
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.readMessages(correlationId, filter, paging, callback);
			}
		);
	}

	private makeReadErrorsCommand(): ICommand {
		return new Command(
			"read_errors",
			null,
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				this._logic.readErrors(correlationId, filter, paging, callback);
			}
		);
	}

	private makeWriteMessageCommand(): ICommand {
		return new Command(
			"write_message",
			null,
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let message = args.get("message");
				this._logic.writeMessage(correlationId, message, callback);
			}
		);
	}

	private makeWriteMessagesCommand(): ICommand {
		return new Command(
			"write_messages",
			null,
			(correlationId: string, args: Parameters, callback: (err: any) => void) => {
				let messages = args.get("messages");
				this._logic.writeMessages(correlationId, messages, callback);
			}
		);
	}

	private makeClearCommand(): ICommand {
		return new Command(
			"clear",
			null,
			(correlationId: string, args: Parameters, callback: (err: any) => void) => {
				this._logic.clear(correlationId, callback);
			}
		);
	}

}