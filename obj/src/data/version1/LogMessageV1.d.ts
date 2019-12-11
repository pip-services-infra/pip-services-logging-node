import { LogLevel } from 'pip-services3-components-node';
import { ErrorDescription } from 'pip-services3-commons-node';
export declare class LogMessageV1 {
    constructor(level: LogLevel, source: string, correlationId: string, error: ErrorDescription, message: string);
    id: string;
    time: Date;
    source: string;
    level: LogLevel;
    correlation_id?: string;
    error?: ErrorDescription;
    message: string;
}
