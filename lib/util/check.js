module.exports = function check (obj, conditions) {
  var l = conditions.length;
  for (var i = 0; i < l; i++) {
    if (conditions[i].check(obj)) {
      conditions[i].action(obj, function (subobj) {
        check(subobj, conditions);
      });
      break;
    }
  }
};
