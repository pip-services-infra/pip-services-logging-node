import { Benchmark } from 'pip-benchmark-node';
export declare class AddMongoDbLogMessagesBenchmark extends Benchmark {
    private _initialRecordNumber;
    private _sourceQuantity;
    private _startTime;
    private _interval;
    private _source;
    private _time;
    private _messagesPersistence;
    private _errorsPersistence;
    private _controller;
    constructor();
    setUp(callback: (err: any) => void): void;
    tearDown(callback: (err: any) => void): void;
    private getRandomString(length);
    private getRandomLogLevel();
    private getRandomErrorDescriptor();
    execute(callback: (err: any) => void): void;
}
