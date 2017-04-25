import { DataPage } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { ICleanable } from 'pip-services-commons-node';

import { LogMessageV1 } from '../data/version1/LogMessageV1';

export interface ILoggingController extends ICleanable {
    readMessages(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void;

    readErrors(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<LogMessageV1>) => void): void;

    writeMessage(correlationId: string, message: LogMessageV1,
        callback?: (err: any, message: LogMessageV1) => void): void;
    
    writeMessages(correlationId: string, messages: LogMessageV1[],
        callback?: (err: any) => void): void;

    clear(correlationId: string, callback?: (err: any) => void): void;
}
