var targetTime, vendor, w, _i, _len, _ref;
w = window;
_ref = ['ms', 'moz', 'webkit', 'o'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
    break;
  }
  w.requestAnimationFrame = w["#vendorRequestAnimationFrame"];
  w.cancelAnimationFrame = w["#vendorCancelAnimationFrame"] || w["#vendorCancelRequestAnimationFrame"];
}

targetTime = 0;

w.requestAnimationFrame || (w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
    return callback(+(new Date));
  }), targetTime - currentTime);
});

w.cancelAnimationFrame || (w.cancelAnimationFrame = function(id) {
  return clearTimeout(id);
});

w.findClickPos = function(e) {
  var posx, posy;
  posx = 0;
  posy = 0;
  if (!e) {
    e = window.event;
  }
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return {
    x: posx,
    y: posy
  };
};

w.getOffset = function(el) {
  var body, _x, _y;
  body = document.getElementsByTagName("body")[0];
  _x = 0;
  _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return {
    top: _y + body.scrollTop,
    left: _x + body.scrollLeft
  };
};
var Explosion = require('./explosion')
new Explosion()
