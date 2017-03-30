import { CommandSet } from 'pip-services-commons-node';
import { ILoggingBusinessLogic } from './ILoggingBusinessLogic';
export declare class LoggingCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ILoggingBusinessLogic);
    private makeReadMessagesCommand();
    private makeReadErrorsCommand();
    private makeWriteMessageCommand();
    private makeWriteMessagesCommand();
    private makeClearCommand();
}
