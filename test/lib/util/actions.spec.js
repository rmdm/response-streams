describe('actions module', function () {
  
  var func;
  var str;
  var dumb;
  
  beforeEach(function () {
    var dest = jasmine.createSpyObj('dest', ['write', 'addStream']);
    str = '';
    dest.write.andCallFake(function (chunk) {
      str += chunk;
    });
    dest.addStream.andCallFake(function () {
      dest.write('constructed');
    });
    func = require('../../../lib/util/actions')(dest);
    dumb = function () {
      dest.write('"dumb"');
    };
  });
  
  describe('writeStream function', function () {
    
    it('writes an array in place of object stream, consisting of elements of that stream', function () {
      func.writeStream({_readableState: {objectMode: true}});
      expect(str).toBe('[constructed]');
    });
    
    it('writes a string in place of non-object stream, consisting of chunks of that stream', function () {
      func.writeStream({_readableState: {objectMode: false}});
      expect(str).toBe('"constructed"');
    });
    
  });
  
  describe('writeArray function', function () {
    
    it('writes an array into stream', function () {
      var arr = [1, 2];      
      //real check function would check every array element
      func.writeArray(arr, dumb);
      expect(str).toBe('["dumb","dumb"]');
    });
    
  });
  
  describe('writeObject function', function () {
    
    it('writes objects', function () {
      var obj = {
        k: {
          l: 'v'
        }
      };
      //real check function would traverse object recursively
      func.writeObject(obj, dumb);
      expect(str).toBe('{"k":"dumb"}');
    });
    
  });
  
  describe('writeNumber function', function () {
    
    it('used to write numbers', function () {
      func.writeNumber(0);
      expect(str).toBe('0');
      str = '';
      
      func.writeNumber(1.4);
      expect(str).toBe('1.4');
      str = '';
    });
    
  });
  
  describe('writeBoolean function', function () {
    
    it('used to write bools', function () {
      func.writeBoolean(true);
      expect(str).toBe('true');
      str = '';
      func.writeBoolean(false);
      expect(str).toBe('false');
    });
    
  });
  
  describe('writeAnything function', function () {
    
    it('used to write primitives', function () {
      func.writeAnything(5);
      expect(str).toBe('"5"');
      str = '';
      
      func.writeAnything(null);
      expect(str).toBe('"null"');
      str = '';
      
      func.writeAnything(undefined);
      expect(str).toBe('"undefined"');
      str = '';
    });
    
  });
  
});