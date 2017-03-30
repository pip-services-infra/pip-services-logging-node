import { LogLevel } from 'pip-services-commons-node';
import { ErrorDescription } from 'pip-services-commons-node';
export declare class LogMessageV1 {
    constructor(level: LogLevel, source: string, correlationId: string, error: ErrorDescription, message: string);
    time: Date;
    source: string;
    level: LogLevel;
    correlation_id: string;
    error: ErrorDescription;
    message: string;
}
