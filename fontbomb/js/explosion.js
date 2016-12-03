var __bind = require('./__bind')
// var requestAnimationFrame = require('./requestAnimationFrame')
var Particle = require('./particle')
var Bomb = require('./bomb')

function Explosion() {
  this.tick = __bind(this.tick, this);

  this.dropBomb = __bind(this.dropBomb, this);

  var char, confirmation, style, _ref,
    _this = this;
  if (window.FONTBOMB_LOADED) {
    return;
  }
  window.FONTBOMB_LOADED = true;
  if (!window.FONTBOMB_HIDE_CONFIRMATION) {
    confirmation = true;
  }
  this.bombs = [];
  this.body = document.getElementsByTagName("body")[0];
  if ((_ref = this.body) != null) {
    _ref.onclick = function(event) {
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
    if (_this.touchMoveCount < 2) {
      _this.dropBomb(_this.touchEvent);
    }
    return _this.touchMoveCount = 0;
  });
  this.explosifyNodes(this.body.childNodes);
  this.chars = (function() {
    var _i, _len, _ref1, _results;
    _ref1 = document.getElementsByTagName('particle');
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      char = _ref1[_i];
      _results.push(new Particle(char, this.body));
    }
    return _results;
  }).call(this);
  this.tick();
  if (confirmation != null) {
    style = document.createElement('style');
    style.innerHTML = "div#fontBombConfirmation {\n  position: absolute;\n  top: -200px;\n  left: 0px;\n  right: 0px;\n  bottom: none;\n  width: 100%;\n  padding: 18px;\n  margin: 0px;\n  background: #e8e8e8;\n  text-align: center;\n  font-size: 14px;\n  line-height: 14px;\n  font-family: verdana, sans-serif;\n  color: #000;\n  -webkit-transition: all 1s ease-in-out;\n  -moz-transition: all 1s ease-in-out;\n  -o-transition: all 1s ease-in-out;\n  -ms-transition: all 1s ease-in-out;\n  transition: all 1s ease-in-out;\n  -webkit-box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  -moz-box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  box-shadow: 0px 3px 3px rgba(0,0,0,0.20);\n  z-index: 100000002;\n}\ndiv#fontBombConfirmation span,div#fontBombConfirmation a {\n  color: #fe3a1a;\n}\ndiv#fontBombConfirmation.show {\n  top:0px;\n  display:block;\n}";
    document.head.appendChild(style);
    this.confirmation = document.createElement("div");
    this.confirmation.id = 'fontBombConfirmation';
    this.confirmation.innerHTML = "<span style='font-weight:bold;'>fontBomb loaded!</span> Click anywhere to destroy " + (document.title.substring(0, 50));
    this.body.appendChild(this.confirmation);
    setTimeout(function() {
      return _this.confirmation.className = 'show';
    }, 10);
    setTimeout(function() {
      _this.confirmation.className = '';
      return setTimeout(function() {
        _this.confirmation.innerHTML = "If you think fontBomb is a blast, follow me on twitter <a href='http://www.twitter.com/plehoux'>@plehoux</a> for my next experiment!";
        _this.confirmation.className = 'show';
        return setTimeout(function() {
          return _this.confirmation.className = '';
        }, 20000);
      }, 5000);
    }, 5000);
  }
}

Explosion.prototype.explosifyNodes = function(nodes) {
  var node, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = nodes.length; _i < _len; _i++) {
    node = nodes[_i];
    _results.push(this.explosifyNode(node));
  }
  return _results;
};

Explosion.prototype.explosifyNode = function(node) {
  var name, newNode, _i, _len, _ref;
  _ref = ['script', 'style', 'iframe', 'canvas', 'video', 'audio', 'textarea', 'embed', 'object', 'select', 'area', 'map', 'input'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    if (node.nodeName.toLowerCase() === name) {
      return;
    }
  }
  switch (node.nodeType) {
    case 1:
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

Explosion.prototype.explosifyText = function(string) {
  var char, chars, index;
  chars = (function() {
    var _i, _len, _ref, _results;
    _ref = string.split('');
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      char = _ref[index];
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
    var _i, _len, _ref, _results;
    _ref = chars.split('&nbsp;');
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      char = _ref[index];
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
  if (window.FONTBOMB_PREVENT_DEFAULT) {
    return event.preventDefault();
  }
};

Explosion.prototype.tick = function() {
  var bomb, char, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
  _ref = this.bombs;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    bomb = _ref[_i];
    if (bomb.state === 'explose') {
      bomb.exploded();
      this.blast = bomb.pos;
    }
  }
  if (this.blast != null) {
    _ref1 = this.chars;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      char = _ref1[_j];
      char.tick(this.blast);
    }
    this.blast = null;
  } else {
    _ref2 = this.chars;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      char = _ref2[_k];
      char.tick();
    }
  }
  return window.requestAnimationFrame(this.tick);
};
Explosion.name = 'Explosion';
module.exports = Explosion
