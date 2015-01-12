var Dest = require('./util/Dest');
var check = require('./util/check');
var is = require('./util/is');
var actions = require('./util/actions');
var PassThrough = require('readable-stream').PassThrough;

module.exports = function (stream, obj) {

  if (arguments.length === 1) {
    obj = stream;
    stream = new PassThrough();
  }
  
  var dest = new Dest(stream);
  var action = actions(dest);
  
  var conditions = [
    {
      check: is.stream,
      action: action.writeStream
    },
    {
      check: is.array,
      action: action.writeArray
    },
    {
      check: is.object,
      action: action.writeObject
    },
    {
      check: is.number,
      action: action.writeNumber
    },
    {
      check: is.boolean,
      action: action.writeBoolean
    },
    {
      check: is.anything,
      action: action.writeAnything
    }
  ];
  
  check(obj, conditions);
  
  return stream;
  
};
