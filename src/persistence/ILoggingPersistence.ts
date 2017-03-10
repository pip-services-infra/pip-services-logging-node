
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';
import { DataPage } from 'pip-services-runtime-node';
import { IPersistence } from 'pip-services-runtime-node';

export interface ILoggingPersistence extends IPersistence {
    readPersistedLog(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, data: DataPage) => void): void;
    writePersistedLog(correlationId: string, entries: any[], callback: (err: any, items: any[]) => void): void;
}
