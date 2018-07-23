"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
class LoggingErrorsMemoryPersistence {
    constructor() {
        this._maxPageSize = 100;
        this._maxErrorSize = 1000;
        this._errors = [];
    }
    configure(config) {
        this._maxPageSize = config.getAsIntegerWithDefault('options.max_page_size', this._maxPageSize);
        this._maxErrorSize = config.getAsIntegerWithDefault('options.max_error_size', this._maxErrorSize);
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    messageContains(message, search) {
        search = search.toLowerCase();
        if (this.matchString(message.message, search))
            return true;
        if (this.matchString(message.correlation_id, search))
            return true;
        if (message.error != null) {
            if (this.matchString(message.error.message, search))
                return true;
            if (this.matchString(message.error.stack_trace, search))
                return true;
            if (this.matchString(message.error.code, search))
                return true;
        }
        return false;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
        let search = filter.getAsNullableString("search");
        let level = filter.getAsNullableInteger("level");
        let maxLevel = filter.getAsNullableInteger("max_level");
        let fromTime = filter.getAsNullableDateTime("from_time");
        let toTime = filter.getAsNullableDateTime("to_time");
        paging = paging || new pip_services_commons_node_2.PagingParams();
        let skip = paging.getSkip(0);
        let take = paging.getTake(this._maxPageSize);
        let data = [];
        let messages = this._errors;
        for (let index = 0; index < messages.length; index++) {
            let message = messages[index];
            if (search != null && !this.messageContains(message, search))
                continue;
            if (level != null && level != message.level)
                continue;
            if (maxLevel != null && maxLevel < message.level)
                continue;
            if (fromTime != null && fromTime > message.time)
                continue;
            if (toTime != null && toTime <= message.time)
                continue;
            skip--;
            if (skip >= 0)
                continue;
            data.push(message);
            take--;
            if (take <= 0)
                break;
        }
        let total = data.length;
        let page = new pip_services_commons_node_3.DataPage(data, total);
        callback(null, page);
    }
    truncateMessages(messages, maxSize) {
        // Remove messages from the end
        if (messages.length > maxSize)
            messages.splice(maxSize - 1, messages.length - maxSize);
    }
    insertMessage(message, messages) {
        let index = 0;
        // Find index to keep messages sorted by time
        while (index < messages.length) {
            if (message.time >= messages[index].time)
                break;
            index++;
        }
        if (index < messages.length)
            messages.splice(index, 0, message);
        else
            messages.push(message);
    }
    addOne(correlationId, message, callback) {
        // Add to errors separately
        if (message.level <= pip_services_commons_node_4.LogLevel.Error) {
            this.truncateMessages(this._errors, this._maxErrorSize);
            this.insertMessage(message, this._errors);
        }
        if (callback)
            callback(null, message);
    }
    addBatch(correlationId, data, callback) {
        async.each(data, (d, callback) => {
            this.addOne(correlationId, d, callback);
        }, callback);
    }
    clear(correlationId, callback) {
        this._errors = [];
        if (callback)
            callback(null);
    }
    deleteExpired(correlationId, expireTime, callback) {
        this._errors = _.filter(this._errors, d => d.time.getTime() > expireTime.getTime());
        if (callback)
            callback(null);
    }
}
exports.LoggingErrorsMemoryPersistence = LoggingErrorsMemoryPersistence;
//# sourceMappingURL=LoggingErrorsMemoryPersistence.js.map