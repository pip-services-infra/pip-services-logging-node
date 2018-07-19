import { DataPage } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ICleanable } from 'pip-services-commons-node';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
export interface ILoggingPersistence extends ICleanable {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<LogMessageV1>) => void): void;
    addOne(correlationId: string, message: LogMessageV1, callback?: (err: any, message: LogMessageV1) => void): void;
    clear(correlationId: string, callback?: (err: any) => void): void;
    deleteExpired(correlationId: string, expireLogsTime: Date, expireErrorsTime: Date, callback: (err: any) => void): void;
}
