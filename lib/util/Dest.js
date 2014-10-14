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
    stream._readableState.objectMode && stream.on('readable', this.writeObjects.bind(this, stream));
    !stream._readableState.objectMode && stream.pipe(this.dest, {end: false});
    stream.on('end', this.next.bind(this));
  } else {
    var data = this.plainChunks.shift() || '';
    if (this.dest !== process.stdout && this.dest !== process.stderr) {
      this.dest.end(data);
    } else {
      this.dest.write(data);
    }
  }
};

Dest.prototype.writeObjects = function writeObjects (stream) {
  if (stream._first_object === undefined) {
    stream._first_object = true;
  }
  var ok = true;
  var obj;
  while (ok && null !== (obj = stream.read())) {
    if (!stream._first_object) this.dest.write(',');
    ok = this.dest.write(JSON.stringify(obj));
    stream._first_object = false;
  }
  if (!ok) {
    var that = this;
    this.dest.once('drain', function () {
      writeObjects.call(that, stream);
    });
  }
};

Dest.prototype.next = function () {
  this.dest.write(this.plainChunks.shift() || '');
  this.setupStream(this.streams.shift());  
};
