
import { IBusinessLogic } from 'pip-services-runtime-node';
import { DataPage } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';

export interface ILoggingBusinessLogic extends IBusinessLogic {
    readPersistedLog(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, data: DataPage) => void): void;
    writePersistedLog(correlationId: string, entries: any[], callback: (err: any, items: any[]) => void): void;
}
