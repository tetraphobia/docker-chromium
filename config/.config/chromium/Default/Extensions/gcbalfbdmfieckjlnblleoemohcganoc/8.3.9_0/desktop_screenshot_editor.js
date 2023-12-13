/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 10431:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Box = exports.getAnchorRects = exports.genGetAnchorRects = exports.diagonalPoint = exports.diagonalPos = exports.pointAtPos = exports.calcRectAndAnchor = exports.fitSquarePoint = exports.BOX_ANCHOR_POS = undefined;

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(99663);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(22600);

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

var _sign = __webpack_require__(39730);

var _sign2 = _interopRequireDefault(_sign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BOX_ANCHOR_POS = exports.BOX_ANCHOR_POS = {
  TOP_LEFT: 1,
  TOP_RIGHT: 2,
  BOTTOM_RIGHT: 3,
  BOTTOM_LEFT: 4
};

var fitSquarePoint = exports.fitSquarePoint = function fitSquarePoint(movingPoint, fixedPoint) {
  var mp = movingPoint;
  var fp = fixedPoint;
  var xlen = Math.abs(mp.x - fp.x);
  var ylen = Math.abs(mp.y - fp.y);
  var len = Math.min(xlen, ylen);

  return {
    x: fp.x + (0, _sign2.default)(mp.x - fp.x) * len,
    y: fp.y + (0, _sign2.default)(mp.y - fp.y) * len
  };
};

var calcRectAndAnchor = exports.calcRectAndAnchor = function calcRectAndAnchor(movingPoint, fixedPoint) {
  var mp = movingPoint;
  var fp = fixedPoint;
  var pos = null;
  var tlp = null;

  if (mp.x <= fp.x && mp.y <= fp.y) {
    pos = BOX_ANCHOR_POS.TOP_LEFT;
    tlp = mp;
  } else if (mp.x > fp.x && mp.y > fp.y) {
    pos = BOX_ANCHOR_POS.BOTTOM_RIGHT;
    tlp = fp;
  } else if (mp.x > fp.x) {
    pos = BOX_ANCHOR_POS.TOP_RIGHT;
    tlp = { x: fp.x, y: mp.y };
  } else if (mp.y > fp.y) {
    pos = BOX_ANCHOR_POS.BOTTOM_LEFT;
    tlp = { x: mp.x, y: fp.y };
  }

  return {
    rect: {
      x: tlp.x,
      y: tlp.y,
      width: Math.abs(mp.x - fp.x),
      height: Math.abs(mp.y - fp.y)
    },
    anchorPos: pos
  };
};

var pointAtPos = exports.pointAtPos = function pointAtPos(rect, pos) {
  switch (pos) {
    case BOX_ANCHOR_POS.TOP_LEFT:
      return {
        x: rect.x,
        y: rect.y
      };
    case BOX_ANCHOR_POS.TOP_RIGHT:
      return {
        x: rect.x + rect.width,
        y: rect.y
      };
    case BOX_ANCHOR_POS.BOTTOM_RIGHT:
      return {
        x: rect.x + rect.width,
        y: rect.y + rect.height
      };
    case BOX_ANCHOR_POS.BOTTOM_LEFT:
      return {
        x: rect.x,
        y: rect.y + rect.height
      };
  }
};

var diagonalPos = exports.diagonalPos = function diagonalPos(pos) {
  switch (pos) {
    case BOX_ANCHOR_POS.TOP_LEFT:
      return BOX_ANCHOR_POS.BOTTOM_RIGHT;

    case BOX_ANCHOR_POS.TOP_RIGHT:
      return BOX_ANCHOR_POS.BOTTOM_LEFT;

    case BOX_ANCHOR_POS.BOTTOM_RIGHT:
      return BOX_ANCHOR_POS.TOP_LEFT;

    case BOX_ANCHOR_POS.BOTTOM_LEFT:
      return BOX_ANCHOR_POS.TOP_RIGHT;
  }
};

var diagonalPoint = exports.diagonalPoint = function diagonalPoint(rect, anchorPos) {
  return pointAtPos(rect, diagonalPos(anchorPos));
};

var genGetAnchorRects = exports.genGetAnchorRects = function genGetAnchorRects(ANCHOR_POS, pointAtPos) {
  return function (_ref) {
    var rect = _ref.rect,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 5 : _ref$size;

    var values = function values(obj) {
      return (0, _keys2.default)(obj).map(function (key) {
        return obj[key];
      });
    };
    var createRect = function createRect(point, size) {
      return {
        x: point.x - size,
        y: point.y - size,
        width: size * 2,
        height: size * 2
      };
    };

    return values(ANCHOR_POS).map(function (pos) {
      return {
        anchorPos: pos,
        rect: createRect(pointAtPos(rect, pos), size)
      };
    });
  };
};

var getAnchorRects = exports.getAnchorRects = genGetAnchorRects(BOX_ANCHOR_POS, pointAtPos);

var Box = exports.Box = function () {
  function Box(options) {
    (0, _classCallCheck3.default)(this, Box);
    this.state = {
      type: 'box',
      data: null,
      style: {},
      rect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    };
    this.local = {};

    var opts = (0, _extends3.default)({
      firstSilence: true,
      transform: function transform(x) {
        return x;
      },
      onStateChange: function onStateChange() {}
    }, options);

    this.transform = opts.transform;
    this.onStateChange = opts.onStateChange;
    this.normalizeRect = opts.normalizeRect || function (x) {
      return x;
    };

    this.__setState({
      id: opts.id,
      data: opts.data,
      type: this.getType(),
      style: this.getDefaultStyle(),
      category: this.getCategory(),
      rect: {
        x: opts.x,
        y: opts.y,
        width: opts.width || 0,
        height: opts.height || 0
      }
    }, { silent: opts.firstSilence });
  }
  // Note: possible settings


  (0, _createClass3.default)(Box, [{
    key: 'getType',
    value: function getType() {
      return 'box';
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return Box.category;
    }
  }, {
    key: 'getDefaultAnchorPos',
    value: function getDefaultAnchorPos() {
      return BOX_ANCHOR_POS.BOTTOM_RIGHT;
    }
  }, {
    key: 'getDefaultStyle',
    value: function getDefaultStyle() {
      return {};
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.state.id;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.transform(this.state);
    }
  }, {
    key: 'processIncomingStyle',
    value: function processIncomingStyle(style) {
      return style;
    }
  }, {
    key: 'setStyle',
    value: function setStyle(obj) {
      this.__setState({
        style: (0, _extends3.default)({}, this.state.style, this.processIncomingStyle(obj))
      });
    }
  }, {
    key: 'setData',
    value: function setData(data) {
      this.__setState({ data: data });
    }
  }, {
    key: 'moveAnchorStart',
    value: function moveAnchorStart(_ref2) {
      var anchorPos = _ref2.anchorPos;

      this.__setLocal({
        oldPoint: pointAtPos(this.state.rect, anchorPos),
        oldAnchorPos: anchorPos,
        anchorPos: anchorPos
      });
    }
  }, {
    key: 'moveAnchor',
    value: function moveAnchor(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;

      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          fit = _ref4.fit;

      var old = this.state.rect;
      var pos = this.local.anchorPos;
      var fixed = diagonalPoint(old, pos);
      var moving = !fit ? { x: x, y: y } : fitSquarePoint({ x: x, y: y }, fixed);
      var res = calcRectAndAnchor(moving, fixed);

      this.__setLocal({ anchorPos: res.anchorPos });
      this.__setState({ rect: this.normalizeRect(res.rect, 'moveAnchor') });
    }
  }, {
    key: 'moveAnchorEnd',
    value: function moveAnchorEnd() {
      this.__setLocal({
        oldPoint: null,
        oldAnchorPos: null,
        anchorPos: null
      });
    }
  }, {
    key: 'moveBoxStart',
    value: function moveBoxStart() {
      this.__setLocal({
        oldRect: (0, _extends3.default)({}, this.state.rect)
      });
    }
  }, {
    key: 'moveBox',
    value: function moveBox(_ref5) {
      var dx = _ref5.dx,
          dy = _ref5.dy;

      var old = this.local.oldRect;
      var upd = (0, _extends3.default)({}, old, {
        x: old.x + dx,
        y: old.y + dy
      });

      this.__setState({ rect: this.normalizeRect(upd, 'moveBox') });
    }
  }, {
    key: 'moveBoxEnd',
    value: function moveBoxEnd() {
      this.__setLocal({
        oldRect: null
      });
    }
  }, {
    key: '__setState',
    value: function __setState(obj) {
      var _this = this;

      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var last = this.getState();

      this.state = (0, _extends3.default)({}, this.state, obj);

      if (opts.silent) return;

      var fn = function fn() {
        return _this.onStateChange(_this.getState(), last);
      };
      var invoke = opts.nextTick ? function (fn) {
        return setTimeout(fn, 0);
      } : function (fn) {
        return fn();
      };

      invoke(fn);
    }
  }, {
    key: '__setLocal',
    value: function __setLocal(obj) {
      this.local = (0, _extends3.default)({}, this.local, obj);
    }
  }]);
  return Box;
}();

Box.settings = [];
Box.category = 'rect';
Box.defaultAnchorPos = BOX_ANCHOR_POS.BOTTOM_RIGHT;

/***/ }),

/***/ 19455:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.selectAreaPromise = exports.selectArea = exports.createRect = exports.createEl = exports.commonStyle = undefined;

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = __webpack_require__(88106);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

var _dom_utils = __webpack_require__(24874);

var _box = __webpack_require__(10431);

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonStyle = exports.commonStyle = {
  boxSizing: 'border-box',
  fontFamily: 'Arial'
};

var createEl = exports.createEl = function createEl(_ref) {
  var _ref$tag = _ref.tag,
      tag = _ref$tag === undefined ? 'div' : _ref$tag,
      _ref$attrs = _ref.attrs,
      attrs = _ref$attrs === undefined ? {} : _ref$attrs,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      text = _ref.text;

  var $el = document.createElement(tag);

  (0, _keys2.default)(attrs).forEach(function (key) {
    $el.setAttribute(key, attrs[key]);
  });

  if (text && text.length) {
    $el.innerText = text;
  }

  (0, _dom_utils.setStyle)($el, style);
  return $el;
};

var createRect = exports.createRect = function createRect(opts) {
  var containerStyle = (0, _extends3.default)({}, commonStyle, {
    position: 'absolute',
    zIndex: 100000,
    top: (0, _dom_utils.pixel)(opts.top),
    left: (0, _dom_utils.pixel)(opts.left),
    width: (0, _dom_utils.pixel)(opts.width),
    height: (0, _dom_utils.pixel)(opts.height)
  }, opts.containerStyle || {});
  var rectStyle = (0, _extends3.default)({}, commonStyle, {
    width: '100%',
    height: '100%',
    border: opts.rectBorderWidth + 'px solid rgb(239, 93, 143)',
    cursor: 'move',
    background: 'transparent'
  }, opts.rectStyle || {});

  var circleStyle = (0, _extends3.default)({}, commonStyle, {
    width: '8px',
    height: '8px',
    border: opts.rectBorderWidth + 'px solid rgb(239, 93, 143)',
    cursor: 'pointer',
    background: 'red',
    position: 'absolute',
    'border-radius': '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }, opts.rectStyle || {});

  var $container = createEl({ style: containerStyle });
  var $rectangle = createEl({ style: rectStyle });
  var $circlePointer = createEl({ style: circleStyle });

  $container.appendChild($rectangle);
  $container.appendChild($circlePointer);
  document.documentElement.appendChild($container);

  return {
    $container: $container,
    $rectangle: $rectangle,
    destroy: function destroy() {
      $container.remove();
    },
    hide: function hide() {
      (0, _dom_utils.setStyle)($container, { display: 'none' });
    },
    show: function show() {
      (0, _dom_utils.setStyle)($container, { display: 'block' });
    }
  };
};

var createOverlay = function createOverlay(extraStyles) {
  var $overlay = createEl({
    style: (0, _extends3.default)({
      position: 'fixed',
      zIndex: 9000,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'transparent',
      cursor: 'crosshair'
    }, extraStyles)
  });

  document.documentElement.appendChild($overlay);

  return {
    $overlay: $overlay,
    destroy: function destroy() {
      return $overlay.remove();
    }
  };
};

var selectArea = exports.selectArea = function selectArea(_ref2) {
  var done = _ref2.done,
      _ref2$onDestroy = _ref2.onDestroy,
      onDestroy = _ref2$onDestroy === undefined ? function () {} : _ref2$onDestroy,
      _ref2$allowCursor = _ref2.allowCursor,
      allowCursor = _ref2$allowCursor === undefined ? function (e) {
    return true;
  } : _ref2$allowCursor,
      _ref2$overlayStyles = _ref2.overlayStyles,
      overlayStyles = _ref2$overlayStyles === undefined ? {} : _ref2$overlayStyles,
      _ref2$clickToDestroy = _ref2.clickToDestroy,
      clickToDestroy = _ref2$clickToDestroy === undefined ? true : _ref2$clickToDestroy,
      _ref2$preventGlobalCl = _ref2.preventGlobalClick,
      preventGlobalClick = _ref2$preventGlobalCl === undefined ? true : _ref2$preventGlobalCl;

  var go = function go(done) {
    var state = {
      box: null,
      activated: false,
      startPos: null,
      rect: null
    };
    var resetBodyStyle = function () {
      var userSelectKey = _web_extension2.default.isFirefox() ? '-moz-user-select' : 'user-select';
      var style = window.getComputedStyle(document.body);
      var oldCursor = style.cursor;
      var oldUserSelect = style[userSelectKey];

      (0, _dom_utils.setStyle)(document.body, (0, _defineProperty3.default)({
        cursor: 'crosshair'
      }, userSelectKey, 'none'));
      return function () {
        return (0, _dom_utils.setStyle)(document.body, (0, _defineProperty3.default)({ cursor: oldCursor }, userSelectKey, oldUserSelect));
      };
    }();

    var overlayApi = createOverlay(overlayStyles);
    var unbindDrag = (0, _dom_utils.bindDrag)({
      preventGlobalClick: preventGlobalClick,
      $el: overlayApi.$overlay,
      onDragStart: function onDragStart(e) {
        e.preventDefault();
        if (!allowCursor(e)) return;

        state.activated = true;
        state.startPos = {
          x: e.pageX,
          y: e.pageY
        };
      },
      onDragEnd: function onDragEnd(e) {
        e.preventDefault();

        state.activated = false;

        if (state.box) {
          state.box.moveAnchorEnd();

          var boundingRect = rectObj.$container.getBoundingClientRect();
          API.hide();

          // Note: API.hide() takes some time to have effect
          setTimeout(function () {
            state.box = null;

            return _promise2.default.resolve(done(state.rect, boundingRect)).catch(function (e) {}).then(function () {
              return API.destroy();
            });
          }, 100);
        }
      },
      onDrag: function onDrag(e, _ref3) {
        var dx = _ref3.dx,
            dy = _ref3.dy;

        e.preventDefault();

        if (!allowCursor(e)) return;
        if (!state.activated) return;

        if (!state.box) {
          var rect = {
            x: state.startPos.x,
            y: state.startPos.y,
            width: dx,
            height: dy
          };
          state.rect = rect;
          state.box = new _box.Box((0, _extends3.default)({}, rect, {
            onStateChange: function onStateChange(_ref4) {
              var rect = _ref4.rect;

              state.rect = rect;
              API.show();
              API.updatePos(rect);
            }
          }));

          state.box.moveAnchorStart({
            anchorPos: _box.BOX_ANCHOR_POS.BOTTOM_RIGHT
          });
        }

        state.box.moveAnchor({
          x: e.pageX,
          y: e.pageY
        });
      }
    });

    var rectObj = createRect({
      top: -999,
      left: -999,
      width: 0,
      height: 0,
      rectStyle: {
        border: '1px solid #ff0000',
        background: 'rgba(255, 0, 0, 0.1)'
      }
    });
    var API = {
      updatePos: function updatePos(rect) {
        (0, _dom_utils.setStyle)(rectObj.$container, {
          top: (0, _dom_utils.pixel)(rect.y),
          left: (0, _dom_utils.pixel)(rect.x),
          width: (0, _dom_utils.pixel)(rect.width),
          height: (0, _dom_utils.pixel)(rect.height)
        });
      },
      destroy: function destroy() {
        resetBodyStyle();
        unbindDrag();
        overlayApi.destroy();
        rectObj.destroy();

        setTimeout(function () {
          document.removeEventListener('click', onClick, true);
          document.removeEventListener('keydown', onKeyDown, true);
        }, 0);

        onDestroy();
      },
      hide: function hide() {
        rectObj.hide();
      },
      show: function show() {
        rectObj.show();
      }
    };

    var onClick = function onClick(e) {
      // If drag starts, we should ignore click event
      if (state.box) return;

      e.preventDefault();
      e.stopPropagation();
      API.destroy();
    };
    var onKeyDown = function onKeyDown(e) {
      return e.keyCode === 27 && API.destroy();
    };

    document.addEventListener('keydown', onKeyDown, true);

    if (clickToDestroy) {
      document.addEventListener('click', onClick, true);
    }

    API.hide();
    return API;
  };

  return go(done);
};

var selectAreaPromise = exports.selectAreaPromise = function selectAreaPromise(opts) {
  return new _promise2.default(function (resolve, reject) {
    var wrappedDone = function wrappedDone() {
      resolve(opts.done.apply(opts, arguments));
    };
    var wrappedOnDestroy = function wrappedOnDestroy() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      try {
        if (opts.onDestroy) opts.onDestroy(args);
      } catch (e) {}

      resolve();
    };

    selectArea((0, _extends3.default)({}, opts, {
      done: wrappedDone,
      onDestroy: wrappedOnDestroy
    }));
  });
};

/***/ }),

/***/ 5967:
/***/ ((module, exports, __webpack_require__) => {

exports = module.exports = __webpack_require__(9252)(false);
// imports


// module
exports.push([module.id, "body{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}#root{-webkit-box-flex:1;-ms-flex:1;flex:1;min-width:100%;min-height:100%}.desktop-screenshot-editor{-webkit-box-orient:vertical;-ms-flex-direction:column;flex-direction:column;min-height:100%}.desktop-screenshot-editor,.desktop-screenshot-editor .top-bar{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-direction:normal}.desktop-screenshot-editor .top-bar{position:fixed;z-index:2;top:0;left:0;right:0;height:54px;background:#007bff;-webkit-box-orient:horizontal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:default}.desktop-screenshot-editor .top-bar button{margin-left:20px;padding:0 20px;height:40px;line-height:40px;border:1px solid #fff;border-radius:4px;font-size:14px;color:#fff;background:transparent;cursor:pointer;-webkit-transition:all .3s ease;transition:all .3s ease}.desktop-screenshot-editor .top-bar button:hover{background:#fefefe;color:#007bff}.desktop-screenshot-editor .top-bar button[disabled]{background:hsla(0,0%,100%,.5);color:#fff;cursor:not-allowed}.desktop-screenshot-editor .editing-area{-webkit-box-flex:1;-ms-flex:1;flex:1;position:relative;z-index:1;margin-top:54px;width:100%;min-height:calc(100% - 54px);background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABaWlrMzMz////nPAkwAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+IDGRUHMxeV5KYAAAAXSURBVAjXY1i16v9/BiKI//9XrSKCAABNyDUhZP4pqwAAAABJRU5ErkJggg==);background-repeat:repeat}.desktop-screenshot-editor .editing-area img{display:block}.desktop-screenshot-editor .editing-area .highlight-rect{position:absolute;z-index:110001;pointer-events:none;font-size:14px}.desktop-screenshot-editor .editing-area .highlight-rect .score{position:absolute;width:200px}.desktop-screenshot-editor .editing-area .highlight-rect .score.top-left{top:0;left:0;-webkit-transform:translate(-100%,-100%);transform:translate(-100%,-100%);text-align:right}.desktop-screenshot-editor .editing-area .highlight-rect .score.top-right{top:0;right:0;-webkit-transform:translate(100%,-100%);transform:translate(100%,-100%)}.desktop-screenshot-editor .editing-area .highlight-rect .score.bottom-right{bottom:0;right:0;-webkit-transform:translate(100%,100%);transform:translate(100%,100%)}.desktop-screenshot-editor .editing-area .highlight-rect .score.bottom-left{bottom:0;left:0;-webkit-transform:translate(-100%,100%);transform:translate(-100%,100%);text-align:right}", ""]);

// exports


/***/ }),

/***/ 19806:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5967);
if(typeof content === 'string') content = [[module.id, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(76723)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ 91328:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(67294));
const react_dom_1 = __importDefault(__webpack_require__(73935));
const antd_1 = __webpack_require__(56318);
const en_US_1 = __importDefault(__webpack_require__(64868));
const select_area_1 = __webpack_require__(19455);
const types_1 = __webpack_require__(34322);
const desktop_1 = __webpack_require__(1885);
const ipc_bg_cs_1 = __webpack_require__(31745);
const storage_1 = __importDefault(__webpack_require__(67585));
const dom_utils_1 = __webpack_require__(24874);
const storage_2 = __webpack_require__(16058);
const xfile_1 = __webpack_require__(1577);
const ts_utils_1 = __webpack_require__(55452);
const utils_1 = __webpack_require__(63370);
const types_2 = __webpack_require__(37161);
const ocr_1 = __webpack_require__(13549);
const cs_timeout_1 = __webpack_require__(28411);
const global_state_1 = __webpack_require__(13426);
__webpack_require__(11067);
__webpack_require__(19806);
const csIpc = ipc_bg_cs_1.csInit(true);
let allState = {};
init();
cs_timeout_1.polyfillTimeoutFunctions(csIpc);
function init() {
    return Promise.all([
        restoreConfig(),
        xfile_1.getXFile().getConfig()
    ])
        .then(([config, xFileConfig]) => __awaiter(this, void 0, void 0, function* () {
        allState = yield global_state_1.getState();
        storage_2.getStorageManager(config.storageMode);
        render();
    }), render);
}
function restoreConfig() {
    return storage_1.default.get('config')
        .then((config = {}) => {
        return Object.assign({ storageMode: storage_2.StorageStrategyType.Browser }, config);
    });
}
function render() {
    const rootEl = document.getElementById('root');
    return react_dom_1.default.render(react_1.default.createElement(antd_1.LocaleProvider, { locale: en_US_1.default },
        react_1.default.createElement(App, null)), rootEl);
}
class App extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult,
            rects: [],
            ocrMatches: [],
            imageUrl: '',
            scale: 0.5,
            imagePageRect: { x: 0, y: 0, width: 0, height: 0 },
            imageSize: { width: 0, height: 0 }
        };
    }
    componentDidMount() {
        csIpc.onAsk((type, data) => {
            switch (type) {
                case 'DOM_READY':
                    return true;
                case types_1.DesktopScreenshot.RequestType.DisplayVisualResult: {
                    const d = data;
                    this.setState({
                        mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult,
                        rects: d.rects
                    });
                    return this.consumeImageInfo(d.image)
                        .then(() => true);
                }
                case types_1.DesktopScreenshot.RequestType.DisplayOcrResult: {
                    const d = data;
                    this.setState({
                        mode: types_1.DesktopScreenshot.RequestType.DisplayOcrResult,
                        ocrMatches: d.ocrMatches
                    });
                    return this.consumeImageInfo(d.image)
                        .then(() => true);
                }
                case types_1.DesktopScreenshot.RequestType.Capture: {
                    const d = data;
                    this.setState({
                        mode: types_1.DesktopScreenshot.RequestType.Capture
                    });
                    return this.consumeImageInfo(d.image)
                        .then(() => ts_utils_1.delay(() => { }, 1000))
                        .then(() => this.selectAreaOnImage());
                }
            }
        });
    }
    resetToMode(mode) {
        return new Promise(resolve => {
            this.setState({
                mode,
                rects: [],
                ocrMatches: []
            }, () => resolve());
        });
    }
    updateImagePageRect() {
        const $image = this.$image;
        if (!$image)
            return;
        const offset = dom_utils_1.accurateOffset($image);
        this.setState({
            imagePageRect: {
                x: offset.left,
                y: offset.top,
                width: $image.offsetWidth,
                height: $image.offsetHeight
            }
        });
    }
    getImagePageRect() {
        return this.state.imagePageRect;
    }
    selectAreaOnImage() {
        return new Promise((resolve, reject) => {
            select_area_1.selectArea({
                preventGlobalClick: false,
                clickToDestroy: false,
                overlayStyles: {
                    top: this.state.imagePageRect.y + 'px'
                },
                onDestroy: () => {
                    resolve();
                },
                done: (rect, boundingRect) => {
                    const areaPageRect = rect;
                    const imagePageRect = this.getImagePageRect();
                    const relativeRect = {
                        x: areaPageRect.x - imagePageRect.x,
                        y: areaPageRect.y - imagePageRect.y,
                        width: areaPageRect.width,
                        height: areaPageRect.height,
                    };
                    const finalScale = (1 / this.state.scale) * (this.state.imageSize.width / screen.width);
                    const finalRect = {
                        x: relativeRect.x * finalScale,
                        y: relativeRect.y * finalScale,
                        width: relativeRect.width * finalScale,
                        height: relativeRect.height * finalScale,
                    };
                    return dom_utils_1.subImage(this.state.imageUrl, finalRect)
                        .then(resolve, reject);
                },
                allowCursor: (e) => {
                    const imagePageRect = this.getImagePageRect();
                    const x = e.pageX;
                    const y = e.pageY;
                    return x > imagePageRect.x &&
                        y > imagePageRect.y &&
                        x < imagePageRect.x + imagePageRect.width &&
                        y < imagePageRect.y + imagePageRect.height;
                }
            });
        })
            .then(result => {
            this.setState({ mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult });
            return result;
        })
            .catch(e => {
            this.setState({ mode: types_1.DesktopScreenshot.RequestType.DisplayVisualResult });
            throw e;
        });
    }
    consumeImageInfo(image) {
        const pImageDataUrl = (() => {
            switch (image.source) {
                case types_1.DesktopScreenshot.ImageSource.HardDrive:
                case types_1.DesktopScreenshot.ImageSource.Storage:
                    return storage_2.getStorageManager().getScreenshotStorage().read(image.path, 'DataURL');
                case types_1.DesktopScreenshot.ImageSource.CV:
                    return desktop_1.getNativeCVAPI().readFileAsDataURL(image.path, true);
                case types_1.DesktopScreenshot.ImageSource.DataUrl:
                    return Promise.resolve(image.path);
            }
        })();
        return pImageDataUrl.then((dataUrl) => {
            this.setState({
                imageUrl: dataUrl
            });
            dom_utils_1.preloadImage(dataUrl)
                .then(result => {
                this.setState({
                    imageSize: {
                        width: result.width,
                        height: result.height
                    }
                });
            });
            setTimeout(() => {
                this.updateImagePageRect();
            }, 1000);
        });
    }
    cornerPosition(rect) {
        const required = {
            width: 50,
            height: 20
        };
        const horizon = rect.x < required.width ? 'right' : 'left';
        const vertical = rect.y < required.height ? 'bottom' : 'top';
        return vertical + '-' + horizon;
    }
    ocrMatchStyle(pw, match) {
        const { scale } = this.state;
        const styleByType = (() => {
            switch (match.highlight) {
                case types_2.OcrHighlightType.Identified:
                    return {
                        color: 'rgba(255, 0, 0, 1)',
                        backgroundColor: 'rgba(200, 200, 200, 0.75)'
                    };
                case types_2.OcrHighlightType.Matched:
                    return {
                        color: '#f00',
                        backgroundColor: 'rgba(255, 215, 15, 0.5)'
                    };
                case types_2.OcrHighlightType.TopMatched:
                    return {
                        color: '#fe1492',
                        backgroundColor: 'rgba(255, 215, 15, 0.5)'
                    };
            }
        })();
        return Object.assign({ boxSizing: 'border-box', position: 'absolute', left: `${scale * pw.word.Left}px`, top: `${scale * pw.word.Top}px`, width: `${scale * pw.word.Width}px`, height: `${scale * pw.word.Height}px`, lineHeight: `${scale * pw.word.Height}px`, fontSize: `${scale * pw.word.Height * 0.8}px`, fontWeight: 'bold', textAlign: 'center', pointerEvents: 'none' }, styleByType);
    }
    renderRectForOcrMatch(match, allState) {
        const { scale } = this.state;
        const rect = ocr_1.ocrMatchRect(match);
        const styles = {
            boxSizing: 'border-box',
            position: 'absolute',
            left: `${scale * rect.x}px`,
            top: `${scale * rect.y}px`,
            width: `${scale * rect.width}px`,
            height: `${scale * rect.height}px`,
            border: `2px solid #fe1492`,
            background: `transparent`,
            pointerEvents: 'none',
        };
        if ((allState['curent_cmd'] == "XClickTextRelative") || (!!localStorage.getItem('curent_cmd') && localStorage.getItem('curent_cmd') == "XClickTextRelative")) {
            let markerDiv = "";
            var stylesY = {};
            var stylesX = {};
            var stylesBox = {};
            let xD = 0, yD = 0;
            let isLeft = false;
            let isTopY = false;
            let isXavilable = false;
            if ((allState['curent_cmd'] == "XClickTextRelative" || allState['curent-cmd'] == "XClickTextRelative") || (!!localStorage.getItem('curent_cmd') && localStorage.getItem('curent_cmd') == "XClickTextRelative")) {
                function getTickCounter(str) {
                    function getNumberSet(num, type) {
                        if (parseInt(num) > 0 && type == 'X') {
                            return ['>', parseInt(num)];
                        }
                        else if (parseInt(num) < 0 && type == 'X') {
                            return ['<', parseInt(num.replace('-', ''))];
                        }
                        else if (parseInt(num) > 0 && type == 'Y') {
                            return ['^', parseInt(num)];
                        }
                        else {
                            return ['v', parseInt(num.replace('-', ''))];
                        }
                    }
                    function getAllNumbersWithSign(str) {
                        const matches = str.match(/-?\d+/g);
                        if (matches) {
                            return matches;
                        }
                        return null;
                    }
                    if (str.indexOf('#R') !== -1) { //ABC #R-6,3
                        const parts = str.split("#R");
                        const nums = getAllNumbersWithSign(parts[1]);
                        const [x1, y1] = getNumberSet(nums[0], 'X');
                        let [x2, y2] = getNumberSet(nums[1], 'Y');
                        ; // 3
                        let valueObj = {};
                        valueObj[x1] = y1;
                        valueObj[x2] = y2;
                        return valueObj;
                    }
                    // return str.split('').reduce((total, letter) => {
                    //   total[letter] ? total[letter]++ : total[letter] = 1;
                    //   return total;
                    // }, {});
                }
                ;
                const cal_tragte = !!localStorage.getItem('caliber_trget') ? localStorage.getItem('caliber_trget') : '';
                //const caliberTick = cal_tragte.split('#R')[1];
                const caliberTick = cal_tragte;
                const countCalObj = getTickCounter(caliberTick);
                //const ocrCalibration:any = !!localStorage.getItem('ocrCalibration') ? localStorage.getItem('ocrCalibration'):6;
                const ocrCalibration = 7;
                for (var x in countCalObj) {
                    if (x == 'v' || x == 'v') {
                        yD += rect['y'] + ocrCalibration * countCalObj[x]; //down (add in y offset)
                    }
                    if (x == '>') {
                        xD += rect['x'] + ocrCalibration * countCalObj[x]; //right (add in x offset)
                    }
                    if (x == '<') {
                        xD += rect['x'] - ocrCalibration * countCalObj[x]; //left (minus in x offset)
                        isLeft = true;
                    }
                    if (x == '^') {
                        yD += rect['y'] - ocrCalibration * countCalObj[x]; //up (minus in y offset)
                        isTopY = true;
                    }
                }
                if (yD != 0) {
                    var stylesY = {
                        position: 'absolute',
                        left: `${scale * (rect.x + rect.width / 2)}px`,
                        top: `${scale * rect.y}px`,
                        height: `${(scale * Math.abs(rect.y - yD))}px`,
                        borderLeft: `2px solid red`
                    };
                    if (isTopY) {
                        let yHeight = stylesY['height'];
                        let yTop = stylesY['top'];
                        stylesY['top'] = (Math.abs((parseFloat(yTop) - parseInt(yHeight))));
                    }
                }
                else {
                    yD = rect.y;
                }
                if (xD != 0) {
                    var stylesX = {
                        position: 'absolute',
                        left: `${scale * (rect.x + rect.width / 2)}px`,
                        top: `${scale * yD}px`,
                        width: `${(scale * Math.abs(rect.x - xD))}px`,
                        borderBottom: `2px solid red`
                    };
                    if (isLeft) {
                        stylesX['left'] = (scale * Math.abs((rect.x + (rect.width / 2)) - Math.abs(rect.x - xD)));
                    }
                    isXavilable = true;
                }
                if (isXavilable) {
                    let xWidth = stylesX['width'];
                    let xLeft = stylesX['left'];
                    let leftNewX = isLeft ? (parseFloat(xLeft) - ((scale * 20))) : (parseFloat(xLeft) + (parseFloat(xWidth)));
                    var stylesBox = {
                        position: 'absolute',
                        left: `${leftNewX}px`,
                        top: `${(scale * yD) - ((scale * 20 / 2))}px`,
                        width: `${(scale * 20)}px`,
                        height: `${(scale * 20)}px`,
                        border: `2px solid green`
                    };
                }
                else {
                    let yLeft = stylesY['left'];
                    let yHeight = stylesY['height'];
                    let leftNewY = parseFloat(yLeft);
                    let yTop = stylesY['top'];
                    let toptNewY = isTopY ? (parseFloat(yTop) - ((scale * 20))) : (parseFloat(yTop) + (parseFloat(yHeight)));
                    var stylesBox = {
                        position: 'absolute',
                        left: `${leftNewY - ((scale * 20 / 2))}px`,
                        top: `${toptNewY}px`,
                        width: `${(scale * 20)}px`,
                        height: `${(scale * 20)}px`,
                        border: `2px solid green`
                    };
                }
            }
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("div", { style: styles }),
                react_1.default.createElement("div", { style: stylesY }),
                react_1.default.createElement("div", { style: stylesX }),
                react_1.default.createElement("div", { style: stylesBox })));
        }
        else if ((allState['curent_cmd'] == "OCRExtractbyTextRelative") || (!!localStorage.getItem('curent_cmd') && localStorage.getItem('curent_cmd') == "OCRExtractbyTextRelative")) {
            const $rectBox = document.createElement('div');
            $rectBox.setAttribute('id', 'rect-ocr-box');
            const styles = {
                boxSizing: 'border-box',
                position: 'absolute',
                left: `${scale * rect.x}px`,
                top: `${scale * rect.y}px`,
                width: `${scale * rect.width}px`,
                height: `${scale * rect.height}px`,
                border: `2px solid #fe1492`,
                background: `transparent`,
                pointerEvents: 'none',
            };
            let markerDiv = "";
            var stylesY = {};
            var stylesX = {};
            var stylesBox = {};
            let xD = 0, yD = 0;
            let isLeft = false;
            let isTopY = false;
            let isXavilable = false;
            function getCoordinates(str) {
                //var regex = /TL(-?\d+),(-?\d+)BR(-?\d+),(-?\d+)/;
                var regex = /R(-?\d+),(-?\d+)W(-?\d+)H(-?\d+)/;
                var matches = str.match(regex);
                var x = parseInt(matches[1]);
                var y = parseInt(matches[2]);
                var W = parseInt(matches[3]);
                var H = parseInt(matches[4]);
                return [x, y, W, H];
            }
            const cal_tragte = !!localStorage.getItem('caliber_trget') ? localStorage.getItem('caliber_trget') : '';
            let caliberTick = cal_tragte;
            if (caliberTick.indexOf('W') == -1 || caliberTick.indexOf('H') == -1) {
                caliberTick = caliberTick + 'W30H10';
            }
            function getTickCounter(str) {
                function getNumberSet(num, type) {
                    if (parseInt(num) > 0 && type == 'X') {
                        return ['>', parseInt(num)];
                    }
                    else if (parseInt(num) < 0 && type == 'X') {
                        return ['<', parseInt(String(num).replace('-', ''))];
                    }
                    else if (parseInt(num) > 0 && type == 'Y') {
                        return ['^', parseInt(num)];
                    }
                    else {
                        return ['v', parseInt(String(num).replace('-', ''))];
                    }
                }
                const nums = getCoordinates(str);
                const [x1, y1] = getNumberSet(nums[0], 'X');
                let [x2, y2] = getNumberSet(nums[1], 'Y');
                ;
                let valueObj = {};
                valueObj[x1] = y1;
                valueObj[x2] = y2;
                return valueObj;
            }
            ;
            const countCalObj = getTickCounter(caliberTick);
            //let ocrCalibration:any = !!localStorage.getItem('ocrCalibration') ? localStorage.getItem('ocrCalibration') : 7;
            const ocrCalibration = 7;
            for (var x in countCalObj) {
                if (x == 'v' || x == 'v') {
                    yD += rect['y'] + ocrCalibration * countCalObj[x]; //down (add in y offset)
                }
                if (x == '>') {
                    xD += rect['x'] + ocrCalibration * countCalObj[x]; //right (add in x offset)
                }
                if (x == '<') {
                    xD += rect['x'] - ocrCalibration * countCalObj[x]; //left (minus in x offset)
                    isLeft = true;
                }
                if (x == '^') {
                    yD += rect['y'] - ocrCalibration * countCalObj[x]; //up (minus in y offset)
                    isTopY = true;
                }
            }
            const all_nums = getCoordinates(caliberTick);
            const rectTop = yD;
            const rectLeft = xD;
            const rectWidth = ocrCalibration * all_nums[2];
            const rectHeight = ocrCalibration * all_nums[3];
            var stylesBox = {
                position: 'absolute',
                left: `${scale * (rectLeft)}px`,
                top: `${scale * (rectTop)}px`,
                width: `${scale * (rectWidth)}px`,
                height: `${scale * (rectHeight)}px`,
                border: `2px solid green`,
            };
            if (yD != 0) {
                var stylesY = {
                    position: 'absolute',
                    left: `${scale * (rectLeft)}px`,
                    top: `${scale * rect.y}px`,
                    height: `${(scale * Math.abs(rect.y - yD))}px`,
                    borderLeft: `2px solid red`
                };
                if (isTopY) {
                    let yHeight = stylesY['height'];
                    let yTop = stylesY['top'];
                    stylesY['top'] = (Math.abs((parseFloat(yTop) - parseInt(yHeight))));
                }
            }
            else {
                yD = rect.y;
            }
            if (yD)
                if (xD != 0) {
                    var stylesX = {
                        position: 'absolute',
                        left: `${scale * (rect.x)}px`,
                        top: `${scale * (rect.y)}px`,
                        width: `${(scale * Math.abs(rect.x - xD))}px`,
                        borderBottom: `2px solid red`
                    };
                    if (isLeft) {
                        stylesX['left'] = (scale * Math.abs((rect.x) - Math.abs(rect.x - xD)));
                        stylesY['left'] = (scale * Math.abs((rect.x) - Math.abs(rect.x - xD)));
                    }
                }
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("div", { style: styles }),
                react_1.default.createElement("div", { style: stylesY }),
                react_1.default.createElement("div", { style: stylesX }),
                react_1.default.createElement("div", { style: stylesBox })));
        }
        else {
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("div", { style: styles })));
        }
    }
    colorForRectType(rectType) {
        switch (rectType) {
            case types_1.DesktopScreenshot.RectType.Match:
                return 'orange';
            case types_1.DesktopScreenshot.RectType.BestMatch:
                return '#ff0000';
            case types_1.DesktopScreenshot.RectType.Reference:
            case types_1.DesktopScreenshot.RectType.ReferenceOfBestMatch:
                return '#00ff00';
        }
    }
    render() {
        return (react_1.default.createElement("div", { className: "desktop-screenshot-editor" },
            react_1.default.createElement("div", { className: "top-bar" },
                react_1.default.createElement("button", { onClick: () => {
                        this.setState({
                            scale: this.state.scale < 1 ? 1 : 0.5
                        }, () => {
                            setTimeout(() => {
                                this.updateImagePageRect();
                            }, 1000);
                        });
                    } }, this.state.scale < 1 ? 'Show Original Size' : 'Show 50%'),
                react_1.default.createElement("button", { disabled: this.state.mode === types_1.DesktopScreenshot.RequestType.Capture, onClick: () => {
                        this.resetToMode(types_1.DesktopScreenshot.RequestType.Capture)
                            .then(() => this.selectAreaOnImage())
                            .then(dataUrl => {
                            if (dataUrl)
                                return csIpc.ask('DESKTOP_EDITOR_ADD_VISION_IMAGE', { dataUrl });
                        });
                    } }, this.state.mode === types_1.DesktopScreenshot.RequestType.Capture ? 'Selecting...' : 'Select Image')),
            react_1.default.createElement("div", { className: "editing-area" },
                this.state.imageUrl.length > 0 ? (react_1.default.createElement("img", { ref: (ref) => { this.$image = ref; }, style: {
                        width: screen.width * this.state.scale + 'px',
                        height: screen.height * this.state.scale + 'px',
                    }, src: this.state.imageUrl })) : null,
                react_1.default.createElement("div", { className: "highlight-rect-list" }, this.state.rects.map((rect, i) => (react_1.default.createElement("div", { key: i, style: {
                        top: (rect.y * this.state.scale) + 'px',
                        left: (rect.x * this.state.scale) + 'px',
                        width: (rect.width * this.state.scale) + 'px',
                        height: (rect.height * this.state.scale) + 'px',
                        border: `1px solid ${this.colorForRectType(rect.type)}`,
                        color: this.colorForRectType(rect.type)
                    }, className: "highlight-rect" },
                    react_1.default.createElement("div", { className: utils_1.cn('score', this.cornerPosition(rect)) }, rect.text
                        ? (rect.text + (this.state.rects.length > 1 ? `#${rect.index + 1}` : ''))
                        : ((rect.score !== undefined ? rect.score.toFixed(2) : '') + `#${rect.index + 1}`)))))),
                react_1.default.createElement("div", { className: "ocr-match-list" }, this.state.ocrMatches.map((match, i) => (react_1.default.createElement("div", { key: i },
                    match.words.map((pw, j) => (react_1.default.createElement("div", { key: j, style: this.ocrMatchStyle(pw, match), className: "ocr-match" }, pw.word.WordText))),
                    match.highlight === types_2.OcrHighlightType.TopMatched ? (
                    //const allState= await getState();
                    this.renderRectForOcrMatch(match, allState)) : null)))))));
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/runtimeId */
/******/ 	(() => {
/******/ 		__webpack_require__.j = 550;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			550: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkui_vision_web_extension"] = self["webpackChunkui_vision_web_extension"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [736,105,263,509], () => (__webpack_require__(91328)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;