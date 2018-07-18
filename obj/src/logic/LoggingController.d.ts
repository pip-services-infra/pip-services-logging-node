import { ConfigParams } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CommandSet } from 'pip-services-commons-node';
import { ICommandable } from 'pip-services-commons-node';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingController } from './ILoggingController';
export declare class LoggingController implements ILoggingController, ICommandable, IConfigurable, IReferenceable {
    private _dependencyResolver;
    private _readPersistence;
    private _writePersistence;
    private _commandSet;
    private _expireTimeout;
    constructor();
    getCommandSet(): CommandSet;
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    writeMessage(correlationId: string, message: LogMessageV1, callback?: (err: any, message: LogMessageV1) => void): void;
    writeMessages(correlationId: string, messages: LogMessageV1[], callback?: (err: any) => void): void;
    readMessages(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<LogMessageV1>) => void): void;
    readErrors(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<LogMessageV1>) => void): void;
    clear(correlationId: string, callback?: (err: any) => void): void;
    deleteExpired(correlationId: string, callback: (err: any) => void): void;
}
