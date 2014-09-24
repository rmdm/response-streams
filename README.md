response-streams
================
Helps to write streams-containing object into non-object stream. The streams packaged with the object will be exhausted.

#Compatibility
Compatible with **Streams2** & **3**. An object treated as Readable stream using duck type checking. That means you can freely use third-party modules such as [*readable-stream*](https://github.com/isaacs/readable-stream).

#Installation
```
npm install response-streams
```

#Usage
Module exposes a function wich takes two args: writable non-object stream and an object to write.
```javascript
var stream = require('response-streams');
...
stream(dest, obj);
```
Passed object could itself be a readable stream, or could contain any number of readable streams at any level of nesting.

#Output
Generated and written into `dest` stream data represents valid JSON except for the following cases:

* instead of an object a primitive was passed;
* non-object stream was passed.

Independently of level at which stream is placed, **object stream turns into array** consisting of objects from that stream whereas **non-object stream turns into string** consisting of its chunks.

#Backpressure
Module respects backpressure.

#Example
Lets say we have writable destination stream and two readable streams: one in object mode and other not:
```javascript
var dest = ...;

var objStream = ...;
var nonObjStream = ...;
```
We also have written some data into them:
```javascript
objStream.write({a: 'b'});
objStream.write({c: 'd'});
objStream.end();

nonObjStream.write('x');
nonObjStream.write('y');
nonObjStream.write('z');
nonObjStream.end();
```
###top-level streams
```javascript
stream(dest, nonObjStream); // '"xyz"' in dest
```
or
```javascript
stream(dest, objStream); // [{"a":"b"},{"c":"d"}] in dest
```
###deep nesting
```javascript
var obj = {
  arr: [[], [1,2,3], [[nonObjStream]]],
  obj: {
    subobj: {
      k: objStream
    }
  },
  num: 5,
  bool: true
};

stream(dest, obj);
```
In `dest` we get:
```javascript
{
  "arr": [[],[1,2,3],[["xyz"]]],
  "obj": {
    "subobj": {
      "k": [{"a":"b"},{"c":"d"}]
    }
  },
  "num": 5,
  "bool": true
}
```
