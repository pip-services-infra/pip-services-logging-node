import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';

export interface ILoggingPersistence extends ICleanable {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void;

    addOne(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void;

    addBatch(correlationId: string, messages: LogMessageV1[],
        callback: (err: any) => void): void;

    clear(correlationId: string, callback?: (err: any) => void): void;

    deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void;
}
