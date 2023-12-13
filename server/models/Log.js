const mongoose = require("mongoose");
require('../connect')
const LogSchema = mongoose.Schema({
  operation: {
    type: String,
    required: [true, "操作名称不能为空"]
  },
  operationTime: Date,
  handler: String,
  operationType: String
});
const Log = mongoose.model("Operation", LogSchema);

// Log.create({
//     operation:'删除了文章',
//     operationTime:'2021-01-19',
//     handler:'苑帅'
// })

module.exports = Log;
