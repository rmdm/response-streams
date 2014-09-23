describe('is module', function () {

  var is = require('../../../lib/util/is');
  var through = require('through2');
  
  describe('stream function', function () {
    
    it('checks if passed arg is a readable stream', function () {
      var objStream = through.obj();
      var stream = through();
      expect(is.stream(stream)).toBe(true);
      expect(is.stream(objStream)).toBe(true);
      expect(is.stream({})).toBe(false);
    });
    
    it('checks ducky', function () {
      var asStream = {
        pipe: function () {},
        read: function () {},
        on: function () {},
        _readableState: {}
      };
      expect(is.stream(asStream)).toBe(true);
      expect(is.stream([])).toBe(false);
    });
    
  });
  
  describe('array function', function () {
    
    it('checks if passed arg is an array', function () {
      expect(is.array([1, 2])).toBe(true);
      expect(is.array({})).toBe(false);
    });
    
  });
  
  describe('object function', function () {
    
    it('checks if passed arg is an object', function () {
      expect(is.object(1)).toBe(false);
      expect(is.object({})).toBe(true);
    });
    
    it('doesn\'t treat null as object', function () {
      expect(is.object(null)).toBe(false);
    });
    
  });
  
  describe('number function', function () {
    
    it('checks if passed arg is number', function () {
      expect(is.number(0)).toBe(true);
      expect(is.number('1')).toBe(false);
      expect(is.number([])).toBe(false);
    });
    
  });
  
  describe('boolean function', function () {
    
    it('checks if passed arg is number', function () {
      expect(is.boolean(0)).toBe(false);
      expect(is.boolean('1')).toBe(false);
      expect(is.boolean(false)).toBe(true);
    });
    
  });
  
  describe('anything function', function () {
    
    it('just returns true always', function () {
      expect(is.anything()).toBe(true);
      expect(is.anything({})).toBe(true);
      expect(is.anything(true)).toBe(true);
      expect(is.anything(false)).toBe(true);
    });
    
  });
  
});
