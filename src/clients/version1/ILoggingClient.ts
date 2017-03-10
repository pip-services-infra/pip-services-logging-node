import { IClient } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

export interface ILoggingClient extends IClient {
    readPersistedLog(correlationId: string, filter: any, paging: any, callback: any): void;
    writePersistedLog(correlationId: string, entries: any[], callback: any): void;
}
