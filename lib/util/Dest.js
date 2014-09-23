module.exports = Dest;

function Dest (stream) {
  this.dest = stream;  
  this.streamed = true;
  this.streams = [];
  this.plainChunks = [];
  this.chunk = '';
}

Dest.prototype.write = function (chunk) {
  if (this.streamed) {
    this.dest.write(chunk);
  } else {
    this.chunk += chunk;
    this.plainChunks.pop();
    this.plainChunks.push(this.chunk);
  }
};

Dest.prototype.addStream = function (stream) {
  if (this.streamed) {
    this.setupStream(stream);
  } else {
    this.streams.push(stream);
    this.plainChunks.push('');
    this.chunk = '';
  }
  this.streamed = false;
};

Dest.prototype.setupStream = function (stream) {
  if (stream) {
    var first = true;
    var that = this;
    stream._readableState.objectMode && stream.on('readable', function () {
      var obj;
      while (null !== (obj = stream.read())) {
        if (!first) that.dest.write(',');
        that.dest.write(JSON.stringify(obj));
        first = false;
      }
    });
    !stream._readableState.objectMode && stream.on('readable', function () {
      that.dest.write(stream.read());
    });
    stream.on('end', function () {
      that.next();
    });
  } else {
    this.dest.end(this.plainChunks.shift() || '');
  }
};

Dest.prototype.next = function () {
  this.dest.write(this.plainChunks.shift() || '');
  this.setupStream(this.streams.shift());  
};
