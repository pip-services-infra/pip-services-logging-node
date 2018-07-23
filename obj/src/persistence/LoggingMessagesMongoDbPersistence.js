"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingMongoDbPersistence_1 = require("./LoggingMongoDbPersistence");
class LoggingMessagesMongoDbPersistence extends LoggingMongoDbPersistence_1.LoggingMongoDbPersistence {
    constructor() {
        super('messages');
        this._collection = 'messages';
    }
}
exports.LoggingMessagesMongoDbPersistence = LoggingMessagesMongoDbPersistence;
//# sourceMappingURL=LoggingMessagesMongoDbPersistence.js.map