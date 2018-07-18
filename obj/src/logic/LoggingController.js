"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const LoggingCommandSet_1 = require("./LoggingCommandSet");
class LoggingController {
    constructor() {
        this._expireCleanupTimeout = 1; // 1 day
        this._expireLogsTimeout = 3; // 3 days
        this._expireErrorsTimeout = 30; // 30 days
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver();
        this._dependencyResolver.put('read_persistence', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'persistence', '*', '*', '*'));
        this._dependencyResolver.put('write_persistence', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'persistence', '*', '*', '*'));
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet_1.LoggingCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional('write_persistence');
    }
    writeMessage(correlationId, message, callback) {
        message.level = message.level || pip_services_commons_node_4.LogLevel.Trace;
        message.time = message.time || new Date();
        async.each(this._writePersistence, (p, callback) => {
            p.create(correlationId, message, callback);
        }, (err) => {
            if (callback)
                callback(err, message);
        });
    }
    writeMessages(correlationId, messages, callback) {
        _.each(messages, (message) => {
            message.level = message.level || pip_services_commons_node_4.LogLevel.Trace;
            message.time = message.time || new Date();
        });
        async.each(this._writePersistence, (p, callback) => {
            async.each(messages, (m, callback) => {
                p.create(correlationId, m, callback);
            }, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
    readMessages(correlationId, filter, paging, callback) {
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    readErrors(correlationId, filter, paging, callback) {
        filter = filter || new pip_services_commons_node_3.FilterParams();
        filter.setAsObject('errors_only', true);
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    clear(correlationId, callback) {
        async.each(this._writePersistence, (p, callback) => {
            p.clear(correlationId, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);
        this._readPersistence.deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback);
    }
}
exports.LoggingController = LoggingController;
//# sourceMappingURL=LoggingController.js.map