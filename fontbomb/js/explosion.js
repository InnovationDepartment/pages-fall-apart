var __bind = require('./__bind')
// var requestAnimationFrame = require('./requestAnimationFrame')
var Particle = require('./particle')
var Bomb = require('./bomb')

function Explosion() {
  this.tick = __bind(this.tick, this);
  this.dropBomb = __bind(this.dropBomb, this);
  var char, confirmation, style, _ref2,
    _this = this;
  if (window.FONTBOMB_LOADED) return;
  window.FONTBOMB_LOADED = true;
  if (!window.FONTBOMB_HIDE_CONFIRMATION) confirmation = true;
  this.bombs = [];
  this.body = document.getElementsByTagName("body")[0];
  if ((_ref2 = this.body) != null) {
    _ref2.onclick = function(event) {
      return _this.dropBomb(event);
    };
  }
  this.body.addEventListener("touchstart", function(event) {
    return _this.touchEvent = event;
  });
  this.body.addEventListener("touchmove", function(event) {
    _this.touchMoveCount || (_this.touchMoveCount = 0);
    return _this.touchMoveCount++;
  });
  this.body.addEventListener("touchend", function(event) {
    if (_this.touchMoveCount < 2) _this.dropBomb(_this.touchEvent);
    return _this.touchMoveCount = 0;
  });
  this.explosifyNodes(this.body.childNodes);
  this.chars = (function() {
    var _j, _len2, _ref3, _results;
    _ref3 = document.getElementsByTagName('particle');
    _results = [];
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      char = _ref3[_j];
      _results.push(new Particle(char, this.body));
    }
    return _results;
  }).call(this);
  this.tick();
  if (confirmation != null) {
    style = document.createElement('style');
    style.innerHTML = "div#fontBombConfirmation {\n  position: absolute;\n  top: -200px;\n  left: 0px;\n  right: 0px;\n  bottom: none;\n  width: 100%;\n  padding: 18px;\n  margin: 0px;\n  background: #e8e8e8;\n  text-align: center;\n  font-size: 14px;\n  line-height: 14px;\n  font-family: verdana, sans-serif;\n  color: #000;\n  -webkit-transition: all 1s ease-in-out;\n  -moz-transition: all 1s ease-in-out;\n  -o-transition: all 1s ease-in-out;\n  -ms-transition: all 1s ease-in-out;\n  transition: all 1s ease-in-out;\n  -webkit-box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  -moz-box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  z-index: 100000002;\n}\ndiv#fontBombConfirmation span,div#fontBombConfirmation a {\n  color: #fe3a1a;\n}\ndiv#fontBombConfirmation.show {\n  top:0px;\n  display:block;\n}";
    document.head.appendChild(style);

  }
}

Explosion.prototype.explosifyNodes = function(nodes) {

  var node, _j, _len2, _results;
  _results = [];
  for (_j = 0, _len2 = nodes.length; _j < _len2; _j++) {
    node = nodes[_j];
    _results.push(this.explosifyNode(node));
  }
  return _results;
};

Explosion.prototype.explosifyNode = function(node) {
  var name, newNode, _j, _len2, _ref2;
  _ref2 = ['script', 'style', 'canvas', 'video', 'audio', 'textarea', 'embed', 'object', 'select', 'area', 'map', 'input'];
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    name = _ref2[_j];
    if (node.nodeName.toLowerCase() === name) return;
  }

  switch (node.nodeType) {
    case 1:
      if (node.nodeName.toLowerCase() === "img" || node.nodeName.toLowerCase() === "iframe") {
        newNode = document.createElement("particles");
        newNode.innerHTML = this.explosifyEl(node);
        return node.parentNode.replaceChild(newNode, node);
      }
      return this.explosifyNodes(node.childNodes);
    case 3:
      if (!/^\s*$/.test(node.nodeValue)) {
        if (node.parentNode.childNodes.length === 1) {
          return node.parentNode.innerHTML = this.explosifyText(node.nodeValue);
        } else {
          newNode = document.createElement("particles");
          newNode.innerHTML = this.explosifyText(node.nodeValue);
          return node.parentNode.replaceChild(newNode, node);
        }
      }
  }
};

Explosion.prototype.explosifyEl = function(string) {
  return "<word style='white-space:nowrap'><particle style='display:inline-block;'>" + string.outerHTML + "</particle></word>"
}

Explosion.prototype.explosifyText = function(string) {
  var char, chars, index;
  chars = (function() {
    var _len2, _ref2, _results;
    _ref2 = string.split('');
    _results = [];
    for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
      char = _ref2[index];
      if (!/^\s*$/.test(char)) {
        _results.push("<particle style='display:inline-block;'>" + char + "</particle>");
      } else {
        _results.push('&nbsp;');
      }
    }
    return _results;
  })();
  chars = chars.join('');
  chars = (function() {
    var _len2, _ref2, _results;
    _ref2 = chars.split('&nbsp;');
    _results = [];
    for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
      char = _ref2[index];
      if (!/^\s*$/.test(char)) {
        _results.push("<word style='white-space:nowrap'>" + char + "</word>");
      } else {
        _results.push(char);
      }
    }
    return _results;
  })();
  return chars.join(' ');
};

Explosion.prototype.dropBomb = function(event) {
  var pos;
  pos = window.findClickPos(event);
  this.bombs.push(new Bomb(pos.x, pos.y));
  if (window.FONTBOMB_PREVENT_DEFAULT) return event.preventDefault();
};

Explosion.prototype.tick = function() {
  var bomb, char, _j, _k, _l, _len2, _len3, _len4, _ref2, _ref3, _ref4;
  _ref2 = this.bombs;
  for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
    bomb = _ref2[_j];
    if (bomb.state === 'explose') {
      bomb.exploded();
      this.blast = bomb.pos;
    }
  }
  if (this.blast != null) {
    _ref3 = this.chars;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      char = _ref3[_k];
      char.tick(this.blast);
    }
    this.blast = null;
  } else {
    _ref4 = this.chars;
    for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
      char = _ref4[_l];
      char.tick();
    }
  }
  return window.requestAnimationFrame(this.tick);
};

Explosion.name = 'Explosion';
module.exports = Explosion
