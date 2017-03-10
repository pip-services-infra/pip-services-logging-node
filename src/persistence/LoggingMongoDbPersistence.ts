let _ = require('lodash');
let async = require('async');
let os = require('os');

import { Category } from 'pip-services-runtime-node';
import { ComponentDescriptor } from 'pip-services-runtime-node';
import { FilterParams } from 'pip-services-runtime-node';
import { PagingParams } from 'pip-services-runtime-node';
import { DataPage } from 'pip-services-runtime-node';
import { Converter } from 'pip-services-runtime-node';
import { MongoDbPersistence } from 'pip-services-runtime-node';
import { ILoggingPersistence } from './ILoggingPersistence';

export class LoggingMongoDbPersistence extends MongoDbPersistence implements ILoggingPersistence {
	/**
	 * Unique descriptor for the ConsoleLogger component
	 */
	public static Descriptor: ComponentDescriptor = new ComponentDescriptor(
		Category.Persistence, "pip-services-logging", "mongodb", "*"
	);
        
    constructor() {
        super(LoggingMongoDbPersistence.Descriptor, require('./LogEntryModel'));
    }
    
    private validateLogEntry(entry) {
        entry = _.pick(entry, 'id', 'time', 'server', 'level', 'component', 'correlation_id', 'message');                
        return entry;
    }
    
    public readPersistedLog(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, data: DataPage) => void): void {

        let criteria = _.pick(filter, 'server', 'level');

        let start = filter.getNullableDate('start');
        let end = filter.getNullableDate('end');
        if (start != null && end != null) {
            criteria.$and = criteria.$and || [];
            criteria.$and.push({ time: { $gte: start} });
            criteria.$and.push({ time: { $lt: end} });
        } else if (start != null) {
            criteria.time = { $gte: start };   
        } else if (end != null) {
            criteria.time = { $lt: end };
        }

        this.getPage(criteria, paging, '-time', null, callback);
    }

    public writePersistedLog(correlationId: string, entries: any[], callback: (err: any, items: any[]) => void): void {
        let entities: any = [];

        async.each(
            entries, 
            (entry, callback) => {
                entry = this.validateLogEntry(entry);
                entry._id = entry.id || this.createUuid();
                // entry.server = entry.server || os.hostname();
                entry.time = entry.time || new Date();

                this.create(entry, (err, item) => {
                    entities.push(item);
                    callback();
                });
            },
            (err) => {
                callback(err, entities);
            }
        );
    }

}
