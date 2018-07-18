import { IStringIdentifiable } from 'pip-services-commons-node';
import { LogMessageV1 } from './LogMessageV1';
export declare class LogMessagesV1 implements IStringIdentifiable {
    id: string;
    level: number;
    source: string;
    start_time: Date;
    end_time: Date;
    last_time: Date;
    count: number;
    logs: LogMessageV1[];
}
