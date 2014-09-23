describe('Dest class', function () {

  var Dest = require('../../../lib/util/Dest');
  var dest;
  var res;
  
  beforeEach(function () {
    res = jasmine.createSpyObj('res', ['write', 'end']);
    dest = new Dest(res);
    spyOn(dest, 'setupStream').andCallThrough();
  });
  
  describe('write method', function () {
    
    it('writes passed chunk directly into dest stream if streams has not been encountered in object to send yet', function () {
      dest.write('plian chunk');
      expect(res.write).toHaveBeenCalled();
    });
    
    it('writes passed chunk into buffering array if streams has been encountered in object to send already', function () {      
      dest.streamed = false;
      dest.write('plain chunk will be written into stream in future');
      expect(res.write).not.toHaveBeenCalled();
    });
    
  });
  
  describe('addStream method', function () {
    
    it('setups passed stream if it is first passed stream', function () {
      dest.addStream({on: function () {}, _readableState: {}});
      expect(dest.setupStream).toHaveBeenCalled();
    });
    
    it('either adds passed stream into streams queue, and open opportunity to write plain chunks into chunks buffer', function () {
      dest.streamed = false;
      expect(dest.plainChunks.length).toBe(0);
      dest.write('a');
      dest.write('b');
      expect(dest.plainChunks[0]).toEqual('ab');
      dest.addStream({});
      expect(dest.plainChunks[0]).toEqual('ab');
      dest.write('c');
      dest.write('d');
      dest.addStream({});
      expect(dest.plainChunks[0]).toEqual('ab');
      expect(dest.plainChunks[1]).toEqual('cd');
    });
    
  });
  
  describe('setupStream method', function () {
    
    it('registers listeners on "readable" and "end" events', function () {
      var stream = {
        _readableState: {},
        on: function () {}
      };
      spyOn(stream, 'on');
      dest.setupStream(stream);
      expect(stream.on).toHaveBeenCalledWith('readable', jasmine.any(Function));
      expect(stream.on).toHaveBeenCalledWith('end', jasmine.any(Function));
    });
    
    it('just writes elements from plain chunks buffer, when no stream is passed', function () {
      dest.plainChunks = ['a', 'b'];
      dest.setupStream();
      expect(res.end).toHaveBeenCalled();
    });
    
  });
  
  describe('next method', function () {
    
    it('setups next stream from streams queue and writes elements from plain chunks buffer', function () {
      dest.streamed = false;
      dest.plainChunks = ['a', 'b'];
      dest.addStream({_readableState: {}, on: function () {}});      
      expect(dest.setupStream).not.toHaveBeenCalled();
      expect(dest.streams.length).toBe(1);
      dest.next();
      expect(dest.setupStream).toHaveBeenCalled();
      expect(dest.streams.length).toBe(0);
      expect(res.write).toHaveBeenCalled();      
    });
    
  });
  
});