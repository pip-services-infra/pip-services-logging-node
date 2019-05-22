import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoosePersistence } from 'pip-services3-mongoose-node';
import { LogMessageV1 } from '../data/version1/LogMessageV1';
import { ILoggingPersistence } from './ILoggingPersistence';
export declare abstract class LoggingMongoDbPersistence extends IdentifiableMongoosePersistence<LogMessageV1, string> implements ILoggingPersistence {
    protected abstract _collection: string;
    constructor(collection: string);
    protected composeFilter(filter: any): {
        $and: any[];
    };
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<LogMessageV1>) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
    addOne(correlationId: string, message: LogMessageV1, callback?: (err: any, message: LogMessageV1) => void): void;
    addBatch(correlationId: string, messages: LogMessageV1[], callback: (err: any) => void): void;
    deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void;
}
