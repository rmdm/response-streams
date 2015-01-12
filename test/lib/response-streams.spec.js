describe('response-stream module', function () {

  var stream = require('../../lib/response-streams');
  var through = require('through2');
  var str;
  var dest, s1, s2;
  
  beforeEach(function () {
    s1 = through.obj();
    s2 = through();
    str = '';
    dest = through(function (chunk, enc, cb) {
      str += chunk;
      cb();
    });
  });

  it('represents functions which takes a destination stream and object to write into it that could contain or represent a stream', function () {
    expect(stream.length).toBe(2);
  });
  
  it('works with top level stream object', function () {    
    runs(function () {
      stream(dest, s2);
      s2.write('a');
      s2.write('b');
      s2.write('c');
      s2.end();
    });
    
    waitsFor(function () {
      return str === '"abc"';
    }, 'should construct proper string', 500);
  });
  
  it('works with top level stream object', function () {    
    runs(function () {
      stream(dest, s1);
      s1.write({a: 'b'});
      s1.write({c: 'd'});
      s1.end();
    });
    
    waitsFor(function () {
      return str === '[{"a":"b"},{"c":"d"}]';
    }, 'should construct proper string', 500);
  });
  
  it('works well even with deep stream placement', function () {
    var obj = {
      arr: [
        [], [2,3,4], [[s2]] //stream
      ],
      subobj: {
        k: {
          l: s1 //stream
        }
      },
      primitive: 5
    };
    runs(function () {
      s1.write({k: 'v'});
      s1.write({l: 'w'});
      s2.write('x');
      s2.write('y');
      s2.write('z');
      s2.end();
      s1.end();
      stream(dest, obj);      
    });
    
    waitsFor(function () {
      return str === '{"arr":[[],[2,3,4],[["xyz"]]],"subobj":{"k":{"l":[{"k":"v"},{"l":"w"}]}},"primitive":5}';
    }, 'should construct proper string', 500);
  });
  
  it('also works with primitives', function () {
    stream(dest, 5);
    expect(str).toBe('5');
  });
  
  it('returns passed stream', function () {
    expect(stream(dest, 'whatever')).toBe(dest);
  });
  
  it('returns passing through stream that stream passed argument', function () {
    runs(function () {
      stream({some: 'object'}).pipe(dest);
    });
    
    waitsFor(function () {
      return str === '{"some":"object"}';
    }, 'should end up with some object', 100);
  });
  
});
