import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';
export declare class LoggingMemoryPersistence implements IConfigurable, ILoggingPersistence {
    private _maxPageSize;
    private _maxErrorSize;
    private _maxTotalSize;
    private _messages;
    private _errors;
    constructor();
    configure(config: ConfigParams): void;
    private matchString(value, search);
    private messageContains(message, search);
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<LogMessageV1>) => void): void;
    private truncateMessages(messages, maxSize);
    private insertMessage(message, messages);
    create(correlationId: string, message: LogMessageV1, callback?: (err: any, message: LogMessageV1) => void): void;
    clear(correlationId: string, callback?: (err: any) => void): void;
    deleteExpired(correlationId: string, expireLogsTime: Date, expireErrorsTime: Date, callback: (err: any) => void): void;
}
