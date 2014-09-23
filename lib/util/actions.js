module.exports = function (dest) {
  
  return {
  
    writeStream: function (stream) {
      stream._readableState.objectMode ? dest.write('[') : dest.write('"');
      dest.addStream(stream);
      stream._readableState.objectMode ? dest.write(']') : dest.write('"');
    },
    
    writeArray: function (arr, check) {
      dest.write('[');
      for (var i = 0; i < arr.length; i++) {
        check(arr[i]);
        if (i < arr.length - 1) {
          dest.write(',');
        }
      }
      dest.write(']');
    },
    
    writeObject: function (obj, check) {
      dest.write('{');
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        dest.write('"' + keys[i] + '":');
        check(obj[keys[i]]);
        if (i < keys.length - 1) {
          dest.write(',');
        }
      }
      dest.write('}');
    },
    
    writeNumber: function (v) {
      dest.write(v.toString());
    },
    
    writeBoolean: function (v) {
      dest.write(v.toString());
    },
    
    writeAnything: function (v) {
      dest.write('"' + v + '"');
    }
    
  };
  
};
