var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var async = require('async');
var os = require('os');
var pip_services_runtime_node_1 = require('pip-services-runtime-node');
var pip_services_runtime_node_2 = require('pip-services-runtime-node');
var pip_services_runtime_node_3 = require('pip-services-runtime-node');
var LoggingMongoDbPersistence = (function (_super) {
    __extends(LoggingMongoDbPersistence, _super);
    function LoggingMongoDbPersistence() {
        _super.call(this, LoggingMongoDbPersistence.Descriptor, require('./LogEntryModel'));
    }
    LoggingMongoDbPersistence.prototype.validateLogEntry = function (entry) {
        entry = _.pick(entry, 'id', 'time', 'server', 'level', 'component', 'correlation_id', 'message');
        return entry;
    };
    LoggingMongoDbPersistence.prototype.readPersistedLog = function (correlationId, filter, paging, callback) {
        var criteria = _.pick(filter, 'server', 'level');
        var start = filter.getNullableDate('start');
        var end = filter.getNullableDate('end');
        if (start != null && end != null) {
            criteria.$and = criteria.$and || [];
            criteria.$and.push({ time: { $gte: start } });
            criteria.$and.push({ time: { $lt: end } });
        }
        else if (start != null) {
            criteria.time = { $gte: start };
        }
        else if (end != null) {
            criteria.time = { $lt: end };
        }
        this.getPage(criteria, paging, '-time', null, callback);
    };
    LoggingMongoDbPersistence.prototype.writePersistedLog = function (correlationId, entries, callback) {
        var _this = this;
        var entities = [];
        async.each(entries, function (entry, callback) {
            entry = _this.validateLogEntry(entry);
            entry._id = entry.id || _this.createUuid();
            // entry.server = entry.server || os.hostname();
            entry.time = entry.time || new Date();
            _this.create(entry, function (err, item) {
                entities.push(item);
                callback();
            });
        }, function (err) {
            callback(err, entities);
        });
    };
    /**
     * Unique descriptor for the ConsoleLogger component
     */
    LoggingMongoDbPersistence.Descriptor = new pip_services_runtime_node_2.ComponentDescriptor(pip_services_runtime_node_1.Category.Persistence, "pip-services-logging", "mongodb", "*");
    return LoggingMongoDbPersistence;
})(pip_services_runtime_node_3.MongoDbPersistence);
exports.LoggingMongoDbPersistence = LoggingMongoDbPersistence;
