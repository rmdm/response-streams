module.exports = {
  stream: checkStreamDucky,
  array: function (v) {
    return Array.isArray(v);
  },  
  object: function (v) {
    return !!v && typeof v === 'object';
  },
  number: function (v) {
    return typeof v === 'number';
  },
  boolean: function (v) {
    return typeof v === 'boolean';
  },
  anything: function () {
    return true;
  }
};

function checkStreamDucky (v) {
  return !!v && typeof v.pipe === 'function' && typeof v.read === 'function' && typeof v.on === 'function' && !!v._readableState;
};
