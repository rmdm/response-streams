describe('check function', function () {
  
  var check = require('../../../lib/util/check');
  var val;
  
  it('traverses array of conditions till find truthy and takes corresponding action', function () {
    var conditions = [
      {
        check: function (v) {return v === 1;},
        action: function () {
          val = 10;
        }
      },
      {
        check: function (v) {return v === 2;},
        action: function () {
          val = 20;
        }
      },
      {
        check: function (v) {return v === 3;},
        action: function () {
          val = 30;
        }
      }
    ];
    check(3, conditions);
    expect(val).toBe(30);
  });
  
});
