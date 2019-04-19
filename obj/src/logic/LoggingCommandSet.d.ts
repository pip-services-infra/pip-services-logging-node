import { CommandSet } from 'pip-services3-commons-node';
import { ILoggingController } from './ILoggingController';
export declare class LoggingCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ILoggingController);
    private makeReadMessagesCommand;
    private makeReadErrorsCommand;
    private makeWriteMessageCommand;
    private makeWriteMessagesCommand;
    private makeClearCommand;
}
