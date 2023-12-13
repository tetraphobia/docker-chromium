/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 36832:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.toHtml = exports.toBookmarkData = exports.validateTestSuiteText = exports.parseTestSuite = exports.stringifyTestSuite = undefined;

var _stringify = __webpack_require__(63239);

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

__webpack_require__(58010);

var _parseJson = __webpack_require__(46097);

var _parseJson2 = _interopRequireDefault(_parseJson);

var _utils = __webpack_require__(63370);

var _storage = __webpack_require__(16058);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringifyTestSuite = exports.stringifyTestSuite = function stringifyTestSuite(testSuite) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var obj = (0, _extends3.default)({
    creationDate: (0, _utils.formatDate)(new Date()),
    name: testSuite.name,
    macros: testSuite.cases.map(function (item) {
      var loops = parseInt(item.loops, 10);

      return {
        macro: item.testCaseId,
        loops: loops
      };
    })
  }, opts.withFold ? { fold: !!testSuite.fold } : {}, opts.withId && testSuite.id ? { id: testSuite.id } : {}, opts.withPlayStatus && testSuite.playStatus ? { playStatus: testSuite.playStatus } : {});

  return (0, _stringify2.default)(obj, null, 2);
};

var parseTestSuite = exports.parseTestSuite = function parseTestSuite(text) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Note: Exported JSON from older version Kantu (via 'export to json')
  // has an invisible charactor (char code65279, known as BOM). It breaks JSON parser.
  // So it's safer to filter it out here
  var obj = (0, _parseJson2.default)(text.replace(/^\s*/, ''));

  if (typeof obj.name !== 'string' || obj.name.length === 0) {
    throw new Error('name must be a string');
  }

  if (!Array.isArray(obj.macros)) {
    throw new Error('macros must be an array');
  }

  var cases = obj.macros.map(function (item) {
    if (typeof item.loops !== 'number' || item.loops < 1) {
      item.loops = 1;
    }

    return {
      testCaseId: item.macro,
      loops: item.loops
    };
  });

  var ts = (0, _extends3.default)({
    cases: cases,
    name: opts.fileName ? opts.fileName.replace(/\.json$/i, '') : obj.name
  }, opts.withFold ? { fold: obj.fold === undefined ? true : obj.fold } : {}, opts.withId && obj.id ? { id: obj.id } : {}, opts.withPlayStatus && obj.playStatus ? { playStatus: obj.playStatus } : {});

  return ts;
};

var validateTestSuiteText = exports.validateTestSuiteText = parseTestSuite;

var toBookmarkData = exports.toBookmarkData = function toBookmarkData(obj) {
  var name = obj.name,
      bookmarkTitle = obj.bookmarkTitle;


  if (!name) throw new Error('name is required to generate bookmark for test suite');
  if (!bookmarkTitle) throw new Error('bookmarkTitle is required to generate bookmark for test suite');

  return {
    title: bookmarkTitle,
    url: ('javascript:\n      (function() {\n        try {\n          var evt = new CustomEvent(\'kantuRunTestSuite\', {\n            detail: {\n              name: \'' + name + '\',\n              from: \'bookmark\',\n              storageMode: \'' + (0, _storage.getStorageManager)().getCurrentStrategyType() + '\',\n              closeRPA: 1\n            }\n          });\n          window.dispatchEvent(evt);\n        } catch (e) {\n          alert(\'UI.Vision RPA Bookmarklet error: \' + e.toString());\n        }\n      })();\n    ').replace(/\n\s*/g, '')
  };
};

var toHtml = exports.toHtml = function toHtml(_ref) {
  var name = _ref.name;

  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n<title>' + name + '</title>\n</head>\n<body>\n<h1>' + name + '</h1>\n<script>\n(function() {\n  var isExtensionLoaded = function () {\n    const $root = document.documentElement\n    return !!$root && !!$root.getAttribute(\'data-kantu\')\n  }\n  var increaseCountInUrl = function (max) {\n    var url   = new URL(window.location.href)\n    var count = 1 + (url.searchParams.get(\'reload\') || 0)\n\n    url.searchParams.set(\'reload\', count)\n    var nextUrl = url.toString()\n\n    var shouldStop = count > max\n    return [shouldStop, !shouldStop ? nextUrl : null]\n  }\n  var run = function () {\n    try {\n      var evt = new CustomEvent(\'kantuRunTestSuite\', { detail: { name: \'' + name + '\', from: \'html\', storageMode: \'' + (0, _storage.getStorageManager)().getCurrentStrategyType() + '\' } })\n\n      window.dispatchEvent(evt)\n      var intervalTimer = setInterval(() => window.dispatchEvent(evt), 1000);\n\n      if (window.location.protocol === \'file:\') {\n        var onInvokeSuccess = function () {\n          clearTimeout(timer)\n          clearTimeout(reloadTimer)\n          clearInterval(intervalTimer)\n          window.removeEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n        }\n        var timer = setTimeout(function () {\n          alert(\'Error #201: It seems you need to turn on *Allow access to file URLs* for Kantu in your browser extension settings.\')\n        }, 8000)\n\n        window.addEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n      }\n    } catch (e) {\n      alert(\'UI.Vision RPA Bookmarklet error: \' + e.toString());\n    }\n  }\n  var main = function () {\n    if (isExtensionLoaded())  return run()\n\n    var MAX_TRY   = 3\n    var INTERVAL  = 1000\n    var tuple     = increaseCountInUrl(MAX_TRY)\n\n    if (tuple[0]) {\n      return alert(\'Error #202: It seems UI.Vision RPA is not installed yet, *or* you need to turn on *Allow access to file URLs* for UI.Vision RPA.\')\n    } else {\n      setTimeout(function () {\n        window.location.href = tuple[1]\n      }, INTERVAL)\n    }\n  }\n\n  main()\n})();\n</script>\n</body>\n</html>\n  ';
};

/***/ }),

/***/ 61169:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _stringify = __webpack_require__(63239);

var _stringify2 = _interopRequireDefault(_stringify);

var _from = __webpack_require__(24043);

var _from2 = _interopRequireDefault(_from);

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

exports.toHtml = toHtml;
exports.generateEmptyHtml = generateEmptyHtml;
exports.toHtmlDataUri = toHtmlDataUri;
exports.fromHtml = fromHtml;
exports.fromJSONString = fromJSONString;
exports.toJSONString = toJSONString;
exports.toJSONDataUri = toJSONDataUri;
exports.toBookmarkData = toBookmarkData;
exports.generateMacroEntryHtml = generateMacroEntryHtml;

__webpack_require__(58010);

var _parseJson = __webpack_require__(46097);

var _parseJson2 = _interopRequireDefault(_parseJson);

var _urlParse = __webpack_require__(84564);

var _urlParse2 = _interopRequireDefault(_urlParse);

var _command = __webpack_require__(69396);

var _storage = __webpack_require__(16058);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joinUrl = function joinUrl(base, url) {
  var urlObj = new _urlParse2.default(url, base);
  return urlObj.toString();
};

// HTML template from test case
function genHtml(_ref) {
  var name = _ref.name,
      baseUrl = _ref.baseUrl,
      commandTrs = _ref.commandTrs,
      noImport = _ref.noImport;

  var tableHtml = noImport ? '<h3>Starting Browser and UI.Vision...</h3>' : '\n    <table cellpadding="1" cellspacing="1" border="1">\n    <thead>\n    <tr><td rowspan="1" colspan="3">' + name + '</td></tr>\n    </thead><tbody>\n    ' + commandTrs.join('\n') + '\n    </tbody></table>\n  ';
  var baseLink = noImport ? '' : '<link rel="selenium.base" href="' + baseUrl + '" />';

  return '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n<head profile="http://selenium-ide.openqa.org/profiles/test-case">\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n' + baseLink + '\n<title>' + name + '</title>\n</head>\n<body>\n' + tableHtml + '\n<script>\n(function() {\n  var isExtensionLoaded = function () {\n    const $root = document.documentElement\n    return !!$root && !!$root.getAttribute(\'data-kantu\')\n  }\n  var increaseCountInUrl = function (max) {\n    var url   = new URL(window.location.href)\n    var count = 1 + (parseInt(url.searchParams.get(\'reload\') || 0))\n\n    url.searchParams.set(\'reload\', count)\n    var nextUrl = url.toString()\n\n    var shouldStop = count > max\n    return [shouldStop, !shouldStop ? nextUrl : null]\n  }\n  var run = function () {\n    try {\n      var evt = new CustomEvent(\'kantuSaveAndRunMacro\', {\n        detail: {\n          html: document.documentElement.outerHTML,\n          noImport: ' + (noImport || 'false') + ',\n          storageMode: \'' + (0, _storage.getStorageManager)().getCurrentStrategyType() + '\'\n        }\n      })\n\n      window.dispatchEvent(evt)\n      var intervalTimer = setInterval(() => window.dispatchEvent(evt), 1000);\n\n      if (window.location.protocol === \'file:\') {\n        var onInvokeSuccess = function () {\n          clearTimeout(timer)\n          clearTimeout(reloadTimer)\n          clearInterval(intervalTimer)\n          window.removeEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n        }\n        var timer = setTimeout(function () {\n          alert(\'Error #203: It seems you need to turn on *Allow access to file URLs* for Kantu in your browser extension settings.\')\n        }, 8000)\n\n        window.addEventListener(\'kantuInvokeSuccess\', onInvokeSuccess)\n      }\n    } catch (e) {\n      alert(\'Kantu Bookmarklet error: \' + e.toString());\n    }\n  }\n  var reloadTimer = null\n  var main = function () {\n    if (isExtensionLoaded())  return run()\n\n    var MAX_TRY   = 3\n    var INTERVAL  = 1000\n    var tuple     = increaseCountInUrl(MAX_TRY)\n\n    if (tuple[0]) {\n      return alert(\'Error #204: It seems UI.Vision RPA is not installed yet - or you need to turn on *Allow access to file URLs* for UI.Vision RPA in your browser extension settings.\')\n    } else {\n      reloadTimer = setTimeout(function () {\n        window.location.href = tuple[1]\n      }, INTERVAL)\n    }\n  }\n\n  setTimeout(main, 500)\n})();\n</script>\n</body>\n</html>\n  ';
}

// generate data uri from html
function htmlDataUri(html) {
  return 'data:text/html;base64,' + window.btoa(unescape(encodeURIComponent(html)));
}

// generate data uri from json
function jsonDataUri(str) {
  return 'data:text/json;base64,' + window.btoa(unescape(encodeURIComponent(str)));
}

// generate html from a test case
function toHtml(_ref2) {
  var name = _ref2.name,
      commands = _ref2.commands;

  var copyCommands = commands.map(function (c) {
    return (0, _extends3.default)({}, c);
  });
  var openTc = copyCommands.find(function (tc) {
    return tc.cmd === 'open';
  });

  // Note: Aug 10, 2018, no baseUrl when exported to html
  // so that `${variable}` could be used in open command, and won't be prefixed with baseUrl
  var origin = null;
  var replacePath = function replacePath(path) {
    return path;
  };
  // const url         = openTc && new URL(openTc.target)
  // const origin      = url && url.origin
  // const replacePath = (path) => {
  //   if (path.indexOf(origin) !== 0) return path
  //   const result = path.replace(origin, '')
  //   return result.length === 0 ? '/' : result
  // }

  if (openTc) {
    openTc.target = replacePath(openTc.target);
  }

  var commandTrs = copyCommands.map(function (c) {
    if (c.cmd === 'open') {
      // Note: remove origin if it's the same as the first open command
      c.target = replacePath(c.target);
    }

    return '\n      <tr>\n        <td>' + (c.cmd || '') + '</td>\n        <td>' + (c.target || '') + '</td>\n        <td>' + (c.value || '') + '</td>\n      </tr>\n    ';
  });

  return genHtml({
    name: name,
    commandTrs: commandTrs,
    baseUrl: origin || ''
  });
}

function generateEmptyHtml() {
  return genHtml({
    name: 'UI.Vision Autostart Page',
    commandTrs: [],
    baseUrl: '',
    noImport: true
  });
}

// generate data uri of html from a test case
function toHtmlDataUri(obj) {
  return htmlDataUri(toHtml(obj));
}

// parse html to test case
function fromHtml(html) {
  var $root = document.createElement('div');
  $root.innerHTML = html;

  var $base = $root.querySelector('link');
  var $title = $root.querySelector('title');
  var $trs = $root.querySelectorAll('tbody > tr');

  var baseUrl = $base && $base.getAttribute('href');
  var name = $title.innerText;

  if (!name || !name.length) {
    throw new Error('fromHtml: missing title');
  }

  var commands = [].slice.call($trs).map(function (tr) {
    var trHtml = tr.outerHtml;

    // Note: remove any datalist option in katalon-like html file
    (0, _from2.default)(tr.querySelectorAll('datalist')).forEach(function ($item) {
      $item.remove();
    });

    var children = tr.children;
    var $cmd = children[0];
    var $tgt = children[1];
    var $val = children[2];
    var cmd = (0, _command.normalizeCommandName)($cmd && $cmd.innerText);
    var value = $val && $val.innerText;
    var target = $tgt && $tgt.innerText;

    if (!cmd || !cmd.length) {
      throw new Error('missing cmd in ' + trHtml);
    }

    if (cmd === 'open') {
      // Note: with or without baseUrl
      target = baseUrl && baseUrl.length && !/:\/\//.test(target) ? joinUrl(baseUrl, target) : target;
    }

    return { cmd: cmd, target: target, value: value };
  });

  return { name: name, data: { commands: commands } };
}

// parse json to test case
// the current json structure doesn't provide fileName,
// so must provide a file name as the second parameter
function fromJSONString(str, fileName) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Note: Exported JSON from older version Kantu (via 'export to json')
  // has an invisible charactor (char code65279, known as BOM). It breaks JSON parser.
  // So it's safer to filter it out here
  var obj = (0, _parseJson2.default)(str.replace(/^\s*/, ''));
  var name = fileName ? fileName.replace(/\.json$/i, '') : obj.Name || '__imported__';

  if (obj.macros) {
    throw new Error('This is a test suite, not a macro');
  }

  if (!Array.isArray(obj.Commands)) {
    throw new Error('\'Commands\' field must be an array');
  }

  var commands = obj.Commands.map(function (c) {
    var obj = {
      cmd: (0, _command.normalizeCommandName)(c.Command),
      target: c.Target,
      value: c.Value,
      description: c.Description || ''
    };

    if (Array.isArray(c.Targets)) {
      obj.targetOptions = c.Targets;
    }

    return obj;
  });

  return (0, _extends3.default)({
    name: name,
    data: { commands: commands }
  }, opts.withStatus && obj.status ? { status: obj.status } : {}, opts.withId && obj.id ? { id: obj.id } : {});
}

// generate json from a test case
function toJSONString(obj) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var getToday = function getToday() {
    var d = new Date();
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
  };
  var data = (0, _extends3.default)({
    Name: obj.name,
    CreationDate: getToday(),
    Commands: obj.commands.map(function (c) {
      return {
        Command: c.cmd,
        Target: c.target || '',
        Value: c.value || '',
        Targets: opts.ignoreTargetOptions ? c.targetOptions : undefined,
        Description: c.description || ''
      };
    })
  }, opts.withStatus && obj.status ? { status: obj.status } : {}, opts.withId && obj.id ? { id: obj.id } : {});

  return (0, _stringify2.default)(data, null, 2);
}

// generate data uri of json from a test case
function toJSONDataUri(obj) {
  return jsonDataUri(toJSONString(obj));
}

function toBookmarkData(obj) {
  var path = obj.path,
      bookmarkTitle = obj.bookmarkTitle;


  if (!path) throw new Error('path is required to generate bookmark for macro');
  if (!bookmarkTitle) throw new Error('bookmarkTitle is required to generate bookmark for macro');

  // Note: for backward compatibility, still use `name` field (which makes sense in flat fs mode) to store `path`
  // after we migrate to standard folder mode
  //
  // Use `JSON.stringify(path)` so that it could escape "\" in win32 paths
  return {
    title: bookmarkTitle,
    url: ('javascript:\n      (function() {\n        try {\n          var evt = new CustomEvent(\'kantuRunMacro\', {\n            detail: {\n              name: ' + (0, _stringify2.default)(path.replace(/\.json$/i, '')) + ',\n              from: \'bookmark\',\n              storageMode: \'' + (0, _storage.getStorageManager)().getCurrentStrategyType() + '\',\n              closeRPA: 1\n            }\n          });\n          window.dispatchEvent(evt);\n        } catch (e) {\n          alert(\'UI.Vision RPA Bookmarklet error: \' + e.toString());\n        }\n      })();\n    ').replace(/\n\s*/g, '')
  };
}

// It's a macro.html file that tries to open ui.vision.html which will be exported together
// with this entry html
function generateMacroEntryHtml(macroRelativePath) {
  return '<!doctype html>\n<html lang="en">\n  <head>\n    <title>UI.Vision Shortcut Page</title>\n  </head>\n  <body>\n    <h3>Command line:</h3>\n    <a id="run" href="ui.vision.html?direct=1&savelog=log.txt&macro=' + macroRelativePath + '">Click here</a>\n    <br>\n    <br>\n    <!-- To start another macro just edit this HTML file and change the macro name in the command line above^. -->\n    <!-- For more command line parameters see https://ui.vision/rpa/docs#cmd -->\n    <script>\n      window.location.href = document.getElementById("run").getAttribute("href");\n    </script>\n  </body>\n</html>\n';
}

/***/ }),

/***/ 79362:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.setFileInputFiles = exports.withDebugger = undefined;

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

var _utils = __webpack_require__(63370);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PROTOCOL_VERSION = '1.2';
var ClEANUP_TIMEOUT = 0;

var withDebugger = exports.withDebugger = function () {
  var state = {
    connected: null,
    cleanupTimer: null
  };

  var setState = function setState(obj) {
    (0, _extends3.default)(state, obj);
  };

  var cancelCleanup = function cancelCleanup() {
    if (state.cleanupTimer) clearTimeout(state.cleanupTimer);
    setState({ cleanupTimer: null });
  };

  var isSameDebuggee = function isSameDebuggee(a, b) {
    return a && b && a.tabId && b.tabId && a.tabId === b.tabId;
  };

  return function (debuggee, fn) {
    var attach = function attach(debuggee) {
      if (isSameDebuggee(state.connected, debuggee)) {
        cancelCleanup();
        return _promise2.default.resolve();
      }

      return detach(state.connected).then(function () {
        return _web_extension2.default.debugger.attach(debuggee, PROTOCOL_VERSION);
      }).then(function () {
        return setState({ connected: debuggee });
      });
    };
    var detach = function detach(debuggee) {
      if (!debuggee) return _promise2.default.resolve();

      return _web_extension2.default.debugger.detach(debuggee).then(function () {
        if (state.cleanupTimer) clearTimeout(state.cleanupTimer);

        setState({
          connected: null,
          cleanupTimer: null
        });
      }, function (e) {
        return console.error('error in detach', e.stack);
      });
    };
    var scheduleDetach = function scheduleDetach() {
      var timer = setTimeout(function () {
        return detach(debuggee);
      }, ClEANUP_TIMEOUT);
      setState({ cleanupTimer: timer });
    };
    var sendCommand = function sendCommand(cmd, params) {
      return _web_extension2.default.debugger.sendCommand(debuggee, cmd, params);
    };
    var onEvent = function onEvent(callback) {
      _web_extension2.default.debugger.onEvent.addListener(callback);
    };
    var onDetach = function onDetach(callback) {
      _web_extension2.default.debugger.onDetach.addListener(callback);
    };

    return new _promise2.default(function (resolve, reject) {
      var done = function done(error, result) {
        scheduleDetach();

        if (error) return reject(error);else return resolve(result);
      };

      return attach(debuggee).then(function () {
        fn({ sendCommand: sendCommand, onEvent: onEvent, onDetach: onDetach, done: done });
      }, function (e) {
        return reject(e);
      });
    });
  };
}();

var __getDocument = function __getDocument(_ref) {
  var sendCommand = _ref.sendCommand,
      done = _ref.done;
  return function () {
    return sendCommand('DOM.getDocument').then(function (obj) {
      return obj.root;
    });
  };
};

var __querySelector = function __querySelector(_ref2) {
  var sendCommand = _ref2.sendCommand,
      done = _ref2.done;
  return (0, _utils.partial)(function (selector, nodeId) {
    return sendCommand('DOM.querySelector', { nodeId: nodeId, selector: selector }).then(function (res) {
      return res && res.nodeId;
    });
  });
};

var __setFileInputFiles = function __setFileInputFiles(_ref3) {
  var sendCommand = _ref3.sendCommand,
      done = _ref3.done;
  return (0, _utils.partial)(function (files, nodeId) {
    return sendCommand('DOM.setFileInputFiles', { nodeId: nodeId, files: files }).then(function () {
      return true;
    });
  });
};

var setFileInputFiles = exports.setFileInputFiles = function setFileInputFiles(_ref4) {
  var tabId = _ref4.tabId,
      selector = _ref4.selector,
      files = _ref4.files;

  return withDebugger({ tabId: tabId }, function (api) {
    var go = (0, _utils.composePromiseFn)(__setFileInputFiles(api)(files), __querySelector(api)(selector), function (node) {
      return node.nodeId;
    }, __getDocument(api));

    return go().then(function (res) {
      return api.done(null, res);
    });
  });
};

/***/ }),

/***/ 89412:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getDownloadMan = exports.DownloadMan = undefined;

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = __webpack_require__(12424);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(99663);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(22600);

var _createClass3 = _interopRequireDefault(_createClass2);

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

var _log = __webpack_require__(77242);

var _log2 = _interopRequireDefault(_log);

var _utils = __webpack_require__(63370);

var _ts_utils = __webpack_require__(55452);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DownloadMan = exports.DownloadMan = function () {
  function DownloadMan() {
    var _this = this;

    (0, _classCallCheck3.default)(this, DownloadMan);
    this.activeDownloads = [];
    this.eventsBound = false;

    this.filterActiveDownloads = function (predicate) {
      _this.activeDownloads = _this.activeDownloads.filter(predicate);

      if (_this.activeDownloads.length === 0) {
        _this.unbindEvents();
      }
    };

    this.createdListener = function (downloadItem) {
      if (!_this.isActive()) return;
      (0, _log2.default)('download on created', downloadItem);

      var item = _this.activeDownloads.find(function (item) {
        return !item.id;
      });
      if (!item) return;

      // Note: 3 things to do on download created
      // 1. record download id
      // 2. Start timer for timeout
      // 3. Start interval timer for count down message
      (0, _extends3.default)(item, (0, _extends3.default)({
        id: downloadItem.id
      }, !item.wait && item.timeout > 0 ? {} : {
        timeoutTimer: setTimeout(function () {
          item.reject(new Error('download timeout ' + item.timeout / 1000 + 's'));
          _this.filterActiveDownloads(function (d) {
            return item.uid !== d.uid;
          });
        }, item.timeout),

        countDownTimer: setInterval(function () {
          if (!_this.countDownHandler) return;

          var _item$past = item.past,
              past = _item$past === undefined ? 0 : _item$past;

          var newPast = past + 1000;

          _this.countDownHandler({
            total: item.timeout,
            past: newPast
          });
          (0, _extends3.default)(item, { past: newPast });
        }, 1000)
      }));
    };

    this.changedListener = function (downloadDelta) {
      if (!_this.isActive()) return;
      (0, _log2.default)('download on changed', downloadDelta);

      var item = _this.findById(downloadDelta.id);
      if (!item) return;

      if (downloadDelta.state) {
        var fn = function fn() {};
        var done = false;

        switch (downloadDelta.state.current) {
          case 'complete':
            fn = function fn() {
              return item.resolve(true);
            };
            done = true;

            if (_this.completeHandler) {
              _web_extension2.default.downloads.search({ id: item.id }).then(function (_ref) {
                var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
                    downloadItem = _ref2[0];

                if (downloadItem) {
                  _this.completeHandler(downloadItem);
                }
              });
            }
            break;

          case 'interrupted':
            fn = function fn() {
              return item.reject(new Error('download interrupted'));
            };
            done = true;
            break;
        }

        // Remove this download item from our todo list if it's done
        if (done) {
          clearTimeout(item.timeoutTimer);
          clearInterval(item.countDownTimer);
          _this.filterActiveDownloads(function (item) {
            return item.id !== downloadDelta.id;
          });
        }

        // resolve or reject that promise object
        fn();
      }
    };

    this.determineFileNameListener = function (downloadItem, suggest) {
      if (!_this.isActive()) return;

      (0, _log2.default)('download on determine', downloadItem);

      var item = _this.findById(downloadItem.id);
      if (!item) return;

      var tmpName = item.fileName.trim();
      var fileName = tmpName === '' || tmpName === '*' ? null : tmpName;

      if (fileName) {
        return suggest({
          filename: fileName,
          conflictAction: 'uniquify'
        });
      }
    };
  }

  (0, _createClass3.default)(DownloadMan, [{
    key: 'isActive',


    /*
     * Private methods
     */

    value: function isActive() {
      return this.activeDownloads.length > 0;
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      return this.activeDownloads.find(function (item) {
        return item.id === id;
      });
    }
  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      if (this.eventsBound) return;

      _web_extension2.default.downloads.onCreated.addListener(this.createdListener);
      _web_extension2.default.downloads.onChanged.addListener(this.changedListener);

      // Note: only chrome supports api `chrome.downloads.onDeterminingFilename`
      if (_web_extension2.default.downloads.onDeterminingFilename) {
        _web_extension2.default.downloads.onDeterminingFilename.addListener(this.determineFileNameListener);
      }

      this.eventsBound = true;
    }
  }, {
    key: 'unbindEvents',
    value: function unbindEvents() {
      if (!this.eventsBound) return;

      if (_web_extension2.default.downloads.onCreated.removeListener) {
        _web_extension2.default.downloads.onCreated.removeListener(this.createdListener);
      }

      if (_web_extension2.default.downloads.onChanged.removeListener) {
        _web_extension2.default.downloads.onChanged.removeListener(this.changedListener);
      }

      if (_web_extension2.default.downloads.onDeterminingFilename && _web_extension2.default.downloads.onDeterminingFilename.removeListener) {
        _web_extension2.default.downloads.onDeterminingFilename.removeListener(this.determineFileNameListener);
      }

      this.eventsBound = false;
    }

    /*
     * Public methods
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.activeDownloads.forEach(function (item) {
        if (item.timeoutTimer) clearTimeout(item.timeoutTimer);
        if (item.countDownTimer) clearInterval(item.countDownTimer);
      });
      this.activeDownloads = [];
      this.unbindEvents();
    }
  }, {
    key: 'prepareDownload',
    value: function prepareDownload(fileName) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var downloadToCreate = this.activeDownloads.find(function (item) {
        return !item.id;
      });
      if (downloadToCreate) throw new Error('only one not-created download allowed at a time');

      this.bindEvents();

      var opts = (0, _extends3.default)({
        timeoutForStart: 10000,
        timeout: 60000,
        wait: false
      }, options);

      var promise = new _promise2.default(function (resolve, reject) {
        var uid = Math.floor(Math.random() * 1000) + new Date() * 1;

        // Note: we need to cache promise object, so have to wait for next tick
        setTimeout(function () {
          _this2.activeDownloads.push({
            uid: uid,
            resolve: resolve,
            reject: reject,
            fileName: fileName,
            promise: promise,
            timeoutForStart: opts.timeoutForStart,
            timeout: opts.timeout,
            wait: opts.wait
          });
        }, 0);
      });

      return promise;
    }
  }, {
    key: 'waitForDownloadIfAny',
    value: function waitForDownloadIfAny() {
      var _this3 = this;

      var downloadToCreate = this.activeDownloads.find(function (item) {
        return !item.id;
      });
      if (downloadToCreate) {
        return (0, _utils.until)('download start', function () {
          return {
            pass: !!downloadToCreate.id,
            result: true
          };
        }, 50, downloadToCreate.timeoutForStart).then(function () {
          return _this3.waitForDownloadIfAny();
        });
      }

      // Note: check if id exists, because it means this download item is created
      var downloadToComplete = this.activeDownloads.find(function (item) {
        return item.wait && item.id;
      });

      // A short delay after download is complete, so that background has time to send DOWNLOAD_COMPLETE event before it unblocks next command
      if (!downloadToComplete) return (0, _ts_utils.delay)(function () {
        return true;
      }, 500);
      return downloadToComplete.promise.then(function () {
        return _this3.waitForDownloadIfAny();
      });
    }
  }, {
    key: 'onCountDown',
    value: function onCountDown(fn) {
      this.countDownHandler = fn;
    }
  }, {
    key: 'onDownloadComplete',
    value: function onDownloadComplete(fn) {
      this.completeHandler = fn;
    }
  }, {
    key: 'hasPendingDownload',
    value: function hasPendingDownload() {
      var downloadToCreate = this.activeDownloads.find(function (item) {
        return !item.id;
      });
      return !!downloadToCreate;
    }
  }]);
  return DownloadMan;
}();

var getDownloadMan = exports.getDownloadMan = function () {
  var instance = void 0;

  return function () {
    if (!instance) {
      instance = new DownloadMan();
    }

    return instance;
  };
}();

/***/ }),

/***/ 90942:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _slicedToArray2 = __webpack_require__(12424);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _from = __webpack_require__(24043);

var _from2 = _interopRequireDefault(_from);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'idb.filesystem.js'

var fs = function () {
  var requestFileSystem = self.requestFileSystem || self.webkitRequestFileSystem;

  if (!requestFileSystem) {
    console.warn('requestFileSystem not supported');
    return undefined;
  }

  var dumbSize = 1024 * 1024;
  var maxSize = 5 * 1024 * 1024;
  var getFS = function getFS(size) {
    size = size || maxSize;

    return new _promise2.default(function (resolve, reject) {
      requestFileSystem(window.TEMPORARY, size, resolve, reject);
    });
  };

  var getDirectory = function getDirectory(dir, shouldCreate, fs) {
    var parts = (Array.isArray(dir) ? dir : dir.split('/')).filter(function (p) {
      return p && p.length;
    });
    var getDir = function getDir(parts, directoryEntry) {
      if (!parts || !parts.length) return _promise2.default.resolve(directoryEntry);

      return new _promise2.default(function (resolve, reject) {
        directoryEntry.getDirectory(parts[0], { create: !!shouldCreate }, function (dirEntry) {
          return resolve(dirEntry);
        }, function (e) {
          return reject(e);
        });
      }).then(function (entry) {
        return getDir(parts.slice(1), entry);
      });
    };

    var pFS = fs ? _promise2.default.resolve(fs) : getFS(dumbSize);
    return pFS.then(function (fs) {
      return getDir(parts, fs.root);
    });
  };

  var ensureDirectory = function ensureDirectory(dir, fs) {
    return getDirectory(dir, true, fs);
  };

  var rmdir = function rmdir(dir, fs) {
    return getDirectory(dir, false, fs).then(function (directoryEntry) {
      return new _promise2.default(function (resolve, reject) {
        directoryEntry.remove(resolve, reject);
      });
    });
  };

  var rmdirR = function rmdirR(dir, fs) {
    return getDirectory(dir, false, fs).then(function (directoryEntry) {
      return new _promise2.default(function (resolve, reject) {
        return directoryEntry.removeRecursively(resolve, reject);
      });
    });
  };

  // @return a Promise of [FileSystemEntries]
  var list = function list() {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    return getFS(dumbSize).then(function (fs) {
      return new _promise2.default(function (resolve, reject) {
        getDirectory(dir).then(function (dirEntry) {
          var result = [];
          var dirReader = dirEntry.createReader();
          var read = function read() {
            dirReader.readEntries(function (entries) {
              if (entries.length === 0) {
                resolve(result.sort());
              } else {
                result = result.concat((0, _from2.default)(entries));
                read();
              }
            }, reject);
          };

          read();
        }).catch(reject);
      });
    }).catch(function (e) {
      console.warn('list', e.code, e.name, e.message);
      throw e;
    });
  };

  var fileLocator = function fileLocator(filePath, fs) {
    var parts = filePath.split('/');
    return getDirectory(parts.slice(0, -1), false, fs).then(function (directoryEntry) {
      return {
        directoryEntry: directoryEntry,
        fileName: parts.slice(-1)[0]
      };
    });
  };

  var readFile = function readFile(filePath, type) {
    if (['ArrayBuffer', 'BinaryString', 'DataURL', 'Text'].indexOf(type) === -1) {
      throw new Error('invalid readFile type, \'' + type + '\'');
    }

    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref) {
        var directoryEntry = _ref.directoryEntry,
            fileName = _ref.fileName;

        return new _promise2.default(function (resolve, reject) {
          directoryEntry.getFile(fileName, {}, function (fileEntry) {
            fileEntry.file(function (file) {
              var reader = new FileReader();

              reader.onerror = reject;
              reader.onloadend = function () {
                resolve(this.result);
              };

              switch (type) {
                case 'ArrayBuffer':
                  return reader.readAsArrayBuffer(file);
                case 'BinaryString':
                  return reader.readAsBinaryString(file);
                case 'DataURL':
                  return reader.readAsDataURL(file);
                case 'Text':
                  return reader.readAsText(file);
                default:
                  throw new Error('unsupported data type, \'' + type);
              }
            }, reject);
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn('readFile', e.code, e.name, e.message);
      throw e;
    });
  };

  var writeFile = function writeFile(filePath, blob, size) {
    return getFS(size).then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref2) {
        var directoryEntry = _ref2.directoryEntry,
            fileName = _ref2.fileName;

        return new _promise2.default(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                return resolve(fileEntry.toURL());
              };
              fileWriter.onerror = reject;

              fileWriter.write(blob);
            });
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn(e.code, e.name, e.message);
      throw e;
    });
  };

  var removeFile = function removeFile(filePath) {
    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref3) {
        var directoryEntry = _ref3.directoryEntry,
            fileName = _ref3.fileName;

        return new _promise2.default(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.remove(resolve, reject);
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn('removeFile', e.code, e.name, e.message);
      throw e;
    });
  };

  var moveFile = function moveFile(srcPath, targetPath) {
    return getFS().then(function (fs) {
      return _promise2.default.all([fileLocator(srcPath, fs), fileLocator(targetPath, fs)]).then(function (tuple) {
        var srcDirEntry = tuple[0].directoryEntry;
        var srcFileName = tuple[0].fileName;
        var tgtDirEntry = tuple[1].directoryEntry;
        var tgtFileName = tuple[1].fileName;

        return new _promise2.default(function (resolve, reject) {
          srcDirEntry.getFile(srcFileName, {}, function (fileEntry) {
            try {
              fileEntry.moveTo(tgtDirEntry, tgtFileName, resolve, reject);
            } catch (e) {
              // Note: For firefox, we use `idb.filesystem.js`, but it hasn't implemented `moveTo` method
              // so we have to mock it with read / write / remove
              readFile(srcPath, 'ArrayBuffer').then(function (arrayBuffer) {
                return writeFile(targetPath, new Blob([new Uint8Array(arrayBuffer)]));
              }).then(function () {
                return removeFile(srcPath);
              }).then(resolve, reject);
            }
          }, reject);
        });
      });
    });
  };

  var copyFile = function copyFile(srcPath, targetPath) {
    return getFS().then(function (fs) {
      return _promise2.default.all([fileLocator(srcPath, fs), fileLocator(targetPath, fs)]).then(function (tuple) {
        var srcDirEntry = tuple[0].directoryEntry;
        var srcFileName = tuple[0].fileName;
        var tgtDirEntry = tuple[1].directoryEntry;
        var tgtFileName = tuple[1].fileName;

        return new _promise2.default(function (resolve, reject) {
          srcDirEntry.getFile(srcFileName, {}, function (fileEntry) {
            try {
              fileEntry.copyTo(tgtDirEntry, tgtFileName, resolve, reject);
            } catch (e) {
              // Note: For firefox, we use `idb.filesystem.js`, but it hasn't implemented `copyTo` method
              // so we have to mock it with read / write
              readFile(srcPath, 'ArrayBuffer').then(function (arrayBuffer) {
                return writeFile(targetPath, new Blob([new Uint8Array(arrayBuffer)]));
              }).then(resolve, reject);
            }
          }, reject);
        });
      });
    }).catch(function (e) {
      console.warn('copyFile', e.code, e.name, e.message);
      throw e;
    });
  };

  var getMetadata = function getMetadata(filePath) {
    var isDirectory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return getFS().then(function (fs) {
      if (filePath.getMetadata) {
        return new _promise2.default(function (resolve, reject) {
          return filePath.getMetadata(resolve);
        });
      }

      return fileLocator(filePath, fs).then(function (_ref4) {
        var directoryEntry = _ref4.directoryEntry,
            fileName = _ref4.fileName;

        return new _promise2.default(function (resolve, reject) {
          var args = [fileName, { create: false }, function (entry) {
            entry.getMetadata(resolve);
          }, reject];

          if (isDirectory) {
            directoryEntry.getDirectory.apply(directoryEntry, args);
          } else {
            directoryEntry.getFile.apply(directoryEntry, args);
          }
        });
      });
    }).catch(function (e) {
      console.warn('getMetadata', e.code, e.name, e.message);
      throw e;
    });
  };

  var existsStat = function existsStat(entryPath) {
    return getFS().then(function (fs) {
      return fileLocator(entryPath, fs).then(function (_ref5) {
        var directoryEntry = _ref5.directoryEntry,
            fileName = _ref5.fileName;

        var isSomeEntry = function isSomeEntry(getMethodName) {
          return new _promise2.default(function (resolve) {
            directoryEntry[getMethodName](fileName, { create: false }, function (data) {
              resolve(true);
            }, function () {
              return resolve(false);
            });
          });
        };

        var pIsFile = isSomeEntry('getFile');
        var pIsDir = isSomeEntry('getDirectory');

        return _promise2.default.all([pIsFile, pIsDir]).then(function (_ref6) {
          var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
              isFile = _ref7[0],
              isDirectory = _ref7[1];

          return {
            isFile: isFile,
            isDirectory: isDirectory
          };
        });
      });
    }).catch(function (e) {
      // DOMException.NOT_FOUND_ERR === 8
      if (e && e.code === 8) {
        return {
          isFile: false,
          isDirectory: false
        };
      }

      console.warn('fs.exists', e.code, e.name, e.message);
      throw e;
    });
  };

  var exists = function exists(entryPath) {
    var _ref8 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref8.type;

    return existsStat(entryPath).then(function (stat) {
      switch (type) {
        case 'file':
          return stat.isFile;

        case 'directory':
          return stat.isDirectory;

        default:
          return stat.isFile || stat.isDirectory;
      }
    });
  };

  return {
    list: list,
    readFile: readFile,
    writeFile: writeFile,
    removeFile: removeFile,
    moveFile: moveFile,
    copyFile: copyFile,
    getDirectory: getDirectory,
    getMetadata: getMetadata,
    ensureDirectory: ensureDirectory,
    exists: exists,
    existsStat: existsStat,
    rmdir: rmdir,
    rmdirR: rmdirR
  };
}();

// For test only
self.fs = fs;

exports["default"] = fs;

/***/ }),

/***/ 64341:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.globMatch = globMatch;

var _kdGlobToRegexp = __webpack_require__(33733);

var _kdGlobToRegexp2 = _interopRequireDefault(_kdGlobToRegexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function globMatch(pattern, text, opts) {
  var reg = (0, _kdGlobToRegexp2.default)(pattern, opts || {});
  var res = reg.test(text);
  return res;
}

/***/ }),

/***/ 5116:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.onMessage = exports.postMessage = undefined;

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE = 'SELENIUM_IDE_CS_MSG';

var postMessage = exports.postMessage = function postMessage(targetWin, myWin, payload) {
  var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '*';
  var timeout = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 60000;

  return new _promise2.default(function (resolve, reject) {
    if (!targetWin || !targetWin.postMessage) {
      throw new Error('E350: csPostMessage: targetWin is not a window');
    }

    if (!myWin || !myWin.addEventListener || !myWin.removeEventListener) {
      throw new Error('E351: csPostMessage: myWin is not a window', myWin);
    }

    var secret = Math.random();
    var type = TYPE;

    // Note: create a listener with a corresponding secret every time
    var onMsg = function onMsg(e) {
      if (e.data && e.data.type === TYPE && !e.data.isRequest && e.data.secret === secret) {
        myWin.removeEventListener('message', onMsg);
        var _e$data = e.data,
            _payload = _e$data.payload,
            error = _e$data.error;


        if (error) return reject(new Error(error));
        if (_payload !== undefined) return resolve(_payload);

        reject(new Error('E352: csPostMessage: No payload nor error found'));
      }
    };

    myWin.addEventListener('message', onMsg);

    // Note:
    // * `type` to make sure we check our own msg only
    // * `secret` is for 1 to 1 relationship between a msg and a listener
    // * `payload` is the real data you want to send
    // * `isRequest` is to mark that it's not an answer to some previous request

    targetWin.postMessage({
      type: type,
      secret: secret,
      payload: payload,
      isRequest: true
    }, target);

    setTimeout(function () {
      reject(new Error('E353: csPostMessage: timeout ' + timeout + ' ms')); //Why 5000?
    }, timeout);
  });
};

var onMessage = exports.onMessage = function onMessage(win, fn) {
  if (!win || !win.addEventListener || !win.removeEventListener) {
    throw new Error('csOnMessage: not a window', win);
  }

  var onMsg = function onMsg(e) {
    // Note: only respond to msg with `isRequest` as true
    if (e && e.data && e.data.type === TYPE && e.data.isRequest && e.data.secret) {
      var tpl = {
        type: TYPE,
        secret: e.data.secret

        // Note: wrapped with a new Promise to catch any exception during the execution of fn
      };new _promise2.default(function (resolve, reject) {
        var ret = void 0;

        try {
          ret = fn(e.data.payload, {
            source: e.source
          });
        } catch (err) {
          reject(err);
        }

        // Note: only resolve if returned value is not undefined. With this, we can have multiple
        // listeners added to onMessage, and each one takes care of what it really cares
        if (ret !== undefined) {
          resolve(ret);
        }
      }).then(function (res) {
        e.source.postMessage((0, _extends3.default)({}, tpl, {
          payload: res
        }), '*');
      }, function (err) {
        e.source.postMessage((0, _extends3.default)({}, tpl, {
          error: err.message
        }), '*');
      });
    }
  };

  win.addEventListener('message', onMsg);
  return function () {
    return win.removeEventListener('message', onMsg);
  };
};

/***/ }),

/***/ 31745:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bgInit = exports.csInit = exports.openBgWithCs = undefined;

var _regenerator = __webpack_require__(94942);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(36803);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = __webpack_require__(72444);

var _typeof3 = _interopRequireDefault(_typeof2);

var _ipc_promise = __webpack_require__(93671);

var _ipc_promise2 = _interopRequireDefault(_ipc_promise);

var _ipc_cache = __webpack_require__(54105);

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

var _log = __webpack_require__(77242);

var _log2 = _interopRequireDefault(_log);

var _utils = __webpack_require__(63370);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIMEOUT = -1;

// Note: `cuid` is a kind of unique id so that you can create multiple
// ipc promise instances between the same two end points
var openBgWithCs = exports.openBgWithCs = function openBgWithCs(cuid) {
  var wrap = function wrap(str) {
    return str + '_' + cuid;
  };

  // factory function to generate ipc promise instance for background
  // `tabId` is needed to identify which tab to send messages to
  var ipcBg = function ipcBg(tabId) {
    var bgListeners = [];

    // `sender` contains tab info. Background may need this to store the corresponding
    // relationship between tabId and ipc instance
    var addSender = function addSender(obj, sender) {
      if (!obj || (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') return obj;

      obj.sender = sender;
      return obj;
    };

    _web_extension2.default.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      if (req.type === wrap('CS_ANSWER_BG') || req.type === wrap('CS_ASK_BG')) {
        sendResponse(true);
      }

      bgListeners.forEach(function (listener) {
        return listener(req, sender);
      });
      return true;
    });

    return (0, _ipc_promise2.default)({
      timeout: TIMEOUT,
      ask: function ask(uid, cmd, args) {
        return _web_extension2.default.tabs.sendMessage(tabId, {
          type: wrap('BG_ASK_CS'),
          uid: uid,
          cmd: cmd,
          args: args
        });
      },
      onAnswer: function onAnswer(fn) {
        bgListeners.push(function (req, sender) {
          if (req.type !== wrap('CS_ANSWER_BG')) return;
          fn(req.uid, req.err, addSender(req.data, sender));
        });
      },
      onAsk: function onAsk(fn) {
        bgListeners.push(function (req, sender) {
          if (req.type !== wrap('CS_ASK_BG')) return;
          fn(req.uid, req.cmd, addSender(req.args, sender));
        });
      },
      answer: function answer(uid, err, data) {
        return _web_extension2.default.tabs.sendMessage(tabId, {
          type: wrap('BG_ANSWER_CS'),
          uid: uid,
          err: err,
          data: data
        });
      },
      destroy: function destroy() {
        bgListeners = [];
      }
    });
  };

  // factory function to generate ipc promise for content scripts
  var ipcCs = function ipcCs(checkReady) {
    var csListeners = [];

    _web_extension2.default.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      if (req.type === wrap('BG_ANSWER_CS') || req.type === wrap('BG_ASK_CS')) {
        sendResponse(true);
      }

      csListeners.forEach(function (listener) {
        return listener(req, sender);
      });
      return true;
    });

    return (0, _ipc_promise2.default)({
      timeout: TIMEOUT,
      checkReady: checkReady,
      ask: function ask(uid, cmd, args) {
        // log('cs ask', uid, cmd, args)
        return _web_extension2.default.runtime.sendMessage({
          type: wrap('CS_ASK_BG'),
          uid: uid,
          cmd: cmd,
          args: args
        });
      },
      onAnswer: function onAnswer(fn) {
        csListeners.push(function (req, sender) {
          if (req.type !== wrap('BG_ANSWER_CS')) return;
          fn(req.uid, req.err, req.data);
        });
      },
      onAsk: function onAsk(fn) {
        csListeners.push(function (req, sender) {
          if (req.type !== wrap('BG_ASK_CS')) return;
          fn(req.uid, req.cmd, req.args);
        });
      },
      answer: function answer(uid, err, data) {
        return _web_extension2.default.runtime.sendMessage({
          type: wrap('CS_ANSWER_BG'),
          uid: uid,
          err: err,
          data: data
        });
      },
      destroy: function destroy() {
        csListeners = [];
      }
    });
  };

  return {
    ipcCs: ipcCs,
    ipcBg: ipcBg
  };
};

// Helper function to init ipc promise instance for content scripts
// The idea here is to send CONNECT message to background when initializing
var csInit = exports.csInit = function csInit() {
  var noRecover = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var cuid = '' + Math.floor(Math.random() * 10000);

  if (noRecover) {
    _web_extension2.default.runtime.sendMessage({
      type: 'CONNECT',
      cuid: cuid
    });
    return openBgWithCs(cuid).ipcCs();
  }

  (0, _log2.default)('sending Connect...');

  // Note: Ext.runtime.getURL is available in content script, but not injected js
  // We use it here to detect whether it is loaded by content script or injected
  // Calling runtime.sendMessage in injected js will cause an uncatchable exception
  if (!_web_extension2.default.runtime.getURL) return;

  // try this process in case we're in none-src frame
  try {
    // let connected     = false
    // const checkReady  = () => {
    //   if (connected)  return Promise.resolve(true)
    //   return Promise.reject(new Error('cs not connected with bg yet'))
    // }
    var reconnect = function reconnect() {
      return (0, _utils.withTimeout)(500, function () {
        return _web_extension2.default.runtime.sendMessage({
          type: 'RECONNECT'
        }).then(function (cuid) {
          (0, _log2.default)('got existing cuid', cuid);
          if (cuid) return openBgWithCs(cuid).ipcCs();
          throw new Error('failed to reconnect');
        });
      });
    };
    var connectBg = function connectBg() {
      return (0, _utils.withTimeout)(1000, function () {
        return _web_extension2.default.runtime.sendMessage({
          type: 'CONNECT',
          cuid: cuid
        }).then(function (done) {
          if (done) return openBgWithCs(cuid).ipcCs();
          throw new Error('not done');
        });
      });
    };
    var tryConnect = (0, _utils.retry)(connectBg, {
      shouldRetry: function shouldRetry() {
        return true;
      },
      retryInterval: 0,
      timeout: 5000
    });

    // Note: Strategy here
    // 1. Try to recover connection with background (get the existing cuid)
    // 2. If cuid not found, try to create new connection (cuid) with background
    // 3. Both of these two steps above are async, but this api itself is synchronous,
    //    so we have to create a mock API and return it first
    var enhancedConnect = function enhancedConnect() {
      return reconnect().catch(function () {
        return tryConnect();
      }).catch(function (e) {
        _log2.default.error('Failed to create cs ipc');
        throw e;
      });
    };

    return (0, _utils.mockAPIWith)(enhancedConnect, {
      ask: function ask() {
        return _promise2.default.reject(new Error('mock ask'));
      },
      onAsk: function onAsk() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _log2.default.apply(undefined, ['mock onAsk'].concat(args));
      },
      destroy: function destroy() {},
      secret: cuid
    }, ['ask']);
  } catch (e) {
    _log2.default.error(e.stack);
  }
};

// Helper function to init ipc promise instance for background
// it accepts a `fn` function to handle CONNECT message from content scripts
var bgInit = exports.bgInit = function bgInit(fn) {
  _web_extension2.default.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    switch (req.type) {
      case 'CONNECT':
        {
          if (req.cuid) {
            fn(sender.tab.id, req.cuid, openBgWithCs(req.cuid).ipcBg(sender.tab.id));
            sendResponse(true);
          }
          break;
        }

      case 'RECONNECT':
        {
          (0, _ipc_cache.getIpcCache)().getCuid(sender.tab.id).then(function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(cuid) {
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (!cuid) {
                        _context.next = 3;
                        break;
                      }

                      _context.next = 3;
                      return (0, _ipc_cache.getIpcCache)().enable(sender.tab.id);

                    case 3:

                      sendResponse(cuid || null);

                    case 4:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, undefined);
            }));

            return function (_x2) {
              return _ref.apply(this, arguments);
            };
          }());

          break;
        }
    }

    return true;
  });
};

/***/ }),

/***/ 41471:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _ipc_bg_cs = __webpack_require__(31745);

var throwNotTop = function throwNotTop() {
  throw new Error('You are not a top window, not allowed to initialize/use csIpc');
};

// Note: csIpc is only available to top window
var ipc = typeof window !== 'undefined' && window.top === window ? (0, _ipc_bg_cs.csInit)() : {
  ask: throwNotTop,
  send: throwNotTop,
  onAsk: throwNotTop,
  destroy: throwNotTop

  // Note: one ipc singleton per content script
};exports["default"] = ipc;

/***/ }),

/***/ 93671:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _stringify = __webpack_require__(63239);

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = __webpack_require__(26378);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = __webpack_require__(63370),
    retry = _require.retry;

var TO_BE_REMOVED = false;

var log = function log(msg) {
  if (console && console.log) console.log(msg);
};

var transformError = function transformError(err) {
  console.error(err);

  if (err instanceof Error) {
    return {
      isError: true,
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  return err;
};

// Note: The whole idea of ipc promise is about transforming the callback style
// ipc communication API to a Promise style
//
// eg. Orignial:    `chrome.runtime.sendMessage({}, () => {})`
//     ipcPromise:  `ipc.ask({}).then(() => {})`
//
// The benifit is
// 1. You can chain this promise with others
// 2. Create kind of connected channels between two ipc ends
//
// This is a generic interface to define a ipc promise utility
// All you need to declare is 4 functions
//
// e.g.
// ```
// ipcPromise({
//   ask: function (uid, cmd, args) { ... },
//   answer: function (uid, err, data) { ... },
//   onAsk: function (fn) { ... },
//   onAnswer: function (fn) { ... },
// })
// ```
function ipcPromise(options) {
  var ask = options.ask;
  var answer = options.answer;
  var timeout = options.timeout;
  var onAnswer = options.onAnswer;
  var onAsk = options.onAsk;
  var userDestroy = options.destroy;
  var checkReady = options.checkReady || function () {
    return _promise2.default.resolve(true);
  };

  var nid = 0;
  var askCache = {};
  var unhandledAsk = [];
  var markUnhandled = function markUnhandled(uid, cmd, args) {
    unhandledAsk.push({ uid: uid, cmd: cmd, args: args });
  };
  var handler = markUnhandled;

  var getNextNid = function getNextNid() {
    nid = (nid + 1) % 100000;
    return nid;
  };

  var runHandlers = function runHandlers(handlers, cmd, args, resolve, reject) {
    for (var i = 0, len = handlers.length; i < len; i++) {
      var res;

      try {
        res = handlers[i](cmd, args);
      } catch (e) {
        return reject(e);
      }

      if (res !== undefined) {
        return resolve(res);
      }
    }
    // Note: DO NOT resolve anything if all handlers return undefined
  };

  // both for ask and unhandledAsk
  timeout = timeout || -1;

  onAnswer(function (uid, err, data) {
    if (uid && askCache[uid] === TO_BE_REMOVED) {
      delete askCache[uid];
      return;
    }

    if (!uid || !askCache[uid]) {
      // log('ipcPromise: response uid invalid: ' + uid);
      return;
    }

    var resolve = askCache[uid][0];
    var reject = askCache[uid][1];

    delete askCache[uid];

    if (err) {
      reject(transformError(err));
    } else {
      resolve(data);
    }
  });

  onAsk(function (uid, cmd, args) {
    if (timeout > 0) {
      setTimeout(function () {
        var found = unhandledAsk && unhandledAsk.find(function (item) {
          return item.uid === uid;
        });

        if (!found) return;

        answer(uid, new Error('ipcPromise: answer timeout ' + timeout + ' for cmd "' + cmd + '", args "' + args + '"'));
      }, timeout);
    }

    if (handler === markUnhandled) {
      markUnhandled(uid, cmd, args);
      return;
    }

    return new _promise2.default(function (resolve, reject) {
      runHandlers(handler, cmd, args, resolve, reject);
    }).then(function (data) {
      // note: handler doens't handle the cmd => return undefined, should wait for timeout
      if (data === undefined) return markUnhandled(uid, cmd, args);
      answer(uid, null, data);
    }, function (err) {
      answer(uid, transformError(err), null);
    });
  });

  var wrapAsk = function wrapAsk(cmd, args, timeoutToOverride) {
    var uid = 'ipcp_' + new Date() * 1 + '_' + getNextNid();
    var finalTimeout = timeoutToOverride || timeout;
    var timer;

    // Note: make it possible to disable timeout
    if (finalTimeout > 0) {
      timer = setTimeout(function () {
        var reject;

        if (askCache && askCache[uid]) {
          reject = askCache[uid][1];
          askCache[uid] = TO_BE_REMOVED;
          reject(new Error('ipcPromise: onAsk timeout ' + finalTimeout + ' for cmd "' + cmd + '", args ' + stringify(args)));
        }
      }, finalTimeout);
    }

    return new _promise2.default(function (resolve, reject) {
      askCache[uid] = [resolve, reject];

      _promise2.default.resolve(ask(uid, cmd, args || [])).catch(function (e) {
        reject(e);
      });
    }).then(function (data) {
      if (timer) {
        clearTimeout(timer);
      }
      return data;
    }, function (e) {
      if (timer) {
        clearTimeout(timer);
      }
      throw e;
    });
  };

  var wrapOnAsk = function wrapOnAsk(fn) {
    if (Array.isArray(handler)) {
      handler.push(fn);
    } else {
      handler = [fn];
    }

    var ps = unhandledAsk.map(function (task) {
      return new _promise2.default(function (resolve, reject) {
        runHandlers(handler, task.cmd, task.args, resolve, reject);
      }).then(function (data) {
        // note: handler doens't handle the cmd => return undefined, should wait for timeout
        if (data === undefined) return;
        answer(task.uid, null, data);
        return task.uid;
      }, function (err) {
        answer(task.uid, err, null);
        return task.uid;
      });
    });

    _promise2.default.all(ps).then(function (uids) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(uids), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var uid = _step.value;

          if (uid === undefined) continue;

          var index = unhandledAsk.findIndex(function (item) {
            return item.uid === uid;
          });

          unhandledAsk.splice(index, 1);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  };

  var destroy = function destroy(noReject) {
    userDestroy && userDestroy();

    ask = null;
    answer = null;
    onAnswer = null;
    onAsk = null;
    unhandledAsk = null;

    if (!noReject) {
      (0, _keys2.default)(askCache).forEach(function (uid) {
        var tuple = askCache[uid];
        var reject = tuple[1];
        reject && reject(new Error('IPC Promise has been Destroyed.'));
        delete askCache[uid];
      });
    }
  };

  var waitForReady = function waitForReady(checkReady, fn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var makeSureReady = retry(checkReady, {
        shouldRetry: function shouldRetry() {
          return true;
        },
        retryInterval: 100,
        timeout: 5000
      });

      return makeSureReady().then(function () {
        return fn.apply(undefined, args);
      });
    };
  };

  return {
    ask: waitForReady(checkReady, wrapAsk),
    onAsk: wrapOnAsk,
    destroy: destroy
  };
}

ipcPromise.serialize = function (obj) {
  return {
    ask: function ask(cmd, args, timeout) {
      return obj.ask(cmd, (0, _stringify2.default)(args), timeout);
    },

    onAsk: function onAsk(fn) {
      return obj.onAsk(function (cmd, args) {
        return fn(cmd, JSON.parse(args));
      });
    },

    destroy: obj.destroy
  };
};

function stringify(v) {
  return v === undefined ? 'undefined' : (0, _stringify2.default)(v);
}

module.exports = ipcPromise;

/***/ }),

/***/ 84037:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.posix = exports.win32 = undefined;

var _path = __webpack_require__(62520);

var isWindows = /windows/i.test(self.navigator.userAgent);
var path = isWindows ? _path.win32 : _path.posix;

exports["default"] = path;
exports.win32 = _path.win32;
exports.posix = _path.posix;

/***/ }),

/***/ 79210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.resizeWindow = resizeWindow;
exports.resizeViewport = resizeViewport;
exports.resizeViewportOfTab = resizeViewportOfTab;
exports.getWindowSize = getWindowSize;
exports.getFocusedWindowSize = getFocusedWindowSize;

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

var _utils = __webpack_require__(63370);

var _log = __webpack_require__(77242);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var calcOffset = function calcOffset(screenTotal, screenOffset, oldOffset, oldSize, newSize) {
  var preferStart = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

  var isCloserToStart = preferStart || oldOffset < screenTotal - oldOffset - oldSize;

  (0, _log2.default)('calcOffset', screenTotal, oldOffset, oldSize, newSize, preferStart);

  if (isCloserToStart) {
    return oldOffset;

    // Note: comment out a smarter position for now
    // if (newSize < oldSize) {
    //   return oldOffset
    // }

    // if (newSize < oldSize + oldOffset - screenOffset) {
    //   return oldSize + oldOffset - newSize
    // }

    // return screenOffset
  }

  if (!isCloserToStart) {
    var oldEndOffset = screenOffset + screenTotal - oldOffset - oldSize;

    return oldSize + oldOffset - newSize;

    // Note: comment out a smarter position for now
    // if (newSize < oldSize) {
    //   return oldSize + oldOffset - newSize
    // }

    // if (newSize < oldSize + oldEndOffset) {
    //   return oldOffset
    // }

    // return screenOffset + screenTotal - newSize
  }
};

// winSize.width
// winSize.height
function resizeWindow(winId, winSize, screenAvailableRect) {
  var sw = screenAvailableRect.width;
  var sh = screenAvailableRect.height;
  var sx = screenAvailableRect.x;
  var sy = screenAvailableRect.y;

  return _web_extension2.default.windows.get(winId).then(function (win) {
    var lastLeft = win.left;
    var lastTop = win.top;
    var lastWidth = win.width;
    var lastHeight = win.height;

    return _web_extension2.default.windows.update(winId, winSize).then(function (win) {
      var left = calcOffset(sw, sx, lastLeft, lastWidth, win.width);
      var top = calcOffset(sh, sy, lastTop, lastHeight, win.height, true);

      _web_extension2.default.windows.update(winId, { left: left, top: top });

      var actual = {
        width: win.width,
        height: win.height
      };

      return {
        actual: actual,
        desired: winSize,
        diff: ['width', 'height'].filter(function (key) {
          return actual[key] !== winSize[key];
        })
      };
    });
  });
}

// pureViewportSize.width
// pureViewportSize.height
// referenceViewportWindowSize.window.width
// referenceViewportWindowSize.window.height
// referenceViewportWindowSize.viewport.width
// referenceViewportWindowSize.viewport.height
function resizeViewport(winId, pureViewportSize, screenAvailableRect) {
  var count = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  var maxRetry = 2;
  (0, _log2.default)('resizeViewport, ROUND', count);

  return getWindowSize(winId).then(function (currentSize) {
    logWindowSize(currentSize);

    var dx = currentSize.window.width - currentSize.viewport.width;
    var dy = currentSize.window.height - currentSize.viewport.height;

    var newWinSize = {
      width: dx + pureViewportSize.width,
      height: dy + pureViewportSize.height
    };

    (0, _log2.default)('size set to', newWinSize);
    return resizeWindow(winId, newWinSize, screenAvailableRect).then(function () {
      return getWindowSize(winId);
    }).then(function (newSize) {
      logWindowSize(newSize);

      var data = {
        actual: newSize.viewport,
        desired: pureViewportSize,
        diff: ['width', 'height'].filter(function (key) {
          return newSize.viewport[key] !== pureViewportSize[key];
        })
      };

      if (data.diff.length === 0 || count >= maxRetry) {
        return data;
      }

      return (0, _utils.delay)(function () {}, 0).then(function () {
        return resizeViewport(winId, pureViewportSize, screenAvailableRect, count + 1);
      });
    });
  });
}

function resizeViewportOfTab(tabId, pureViewportSize, screenAvailableRect) {
  return _web_extension2.default.tabs.get(tabId).then(function (tab) {
    return resizeViewport(tab.windowId, pureViewportSize, screenAvailableRect);
  });
}

// size.window.width
// size.window.height
// size.window.left
// size.window.top
// size.viewport.wdith
// size.viewport.height
function getWindowSize(winId) {
  return _web_extension2.default.windows.get(winId, { populate: true }).then(function (win) {
    var tab = win.tabs.find(function (tab) {
      return tab.active;
    });

    return {
      window: {
        width: win.width,
        height: win.height,
        left: win.left,
        top: win.top
      },
      viewport: {
        width: tab.width,
        height: tab.height
      }
    };
  });
}

function getFocusedWindowSize() {
  return _web_extension2.default.windows.getLastFocused().then(function (win) {
    return getWindowSize(win.id);
  });
}

function logWindowSize(winSize) {
  (0, _log2.default)(winSize.window, winSize.viewport);
  (0, _log2.default)('dx = ', winSize.window.width - winSize.viewport.width);
  (0, _log2.default)('dy = ', winSize.window.height - winSize.viewport.height);
}

/***/ }),

/***/ 20326:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = __webpack_require__(88106);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var local = _web_extension2.default.storage.local;

exports["default"] = {
  get: function get(key) {
    return local.get(key).then(function (obj) {
      return obj[key];
    });
  },

  set: function set(key, value) {
    return local.set((0, _defineProperty3.default)({}, key, value)).then(function () {
      return true;
    });
  },

  remove: function remove(key) {
    return local.remove(key).then(function () {
      return true;
    });
  },

  clear: function clear() {
    return local.clear().then(function () {
      return true;
    });
  },

  addListener: function addListener(fn) {
    _web_extension2.default.storage.onChanged.addListener(function (changes, areaName) {
      var list = (0, _keys2.default)(changes).map(function (key) {
        return (0, _extends3.default)({}, changes[key], { key: key });
      });
      fn(list);
    });
  }
};

/***/ }),

/***/ 67585:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _ext_storage = __webpack_require__(20326);

var _ext_storage2 = _interopRequireDefault(_ext_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = _ext_storage2.default;

/***/ }),

/***/ 63370:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.bind = exports.bindOnce = exports.mockAPIWith = exports.dpiFromFileName = exports.getPageDpi = exports.sanitizeFileName = exports.validateStandardName = exports.ensureExtName = exports.loadImage = exports.loadCsv = exports.and = exports.uniqueName = exports.withFileExtension = exports.randomName = exports.retry = exports.withTimeout = exports.insertScript = exports.toRegExp = exports.parseQuery = exports.composePromiseFn = exports.nameFactory = exports.splitKeep = exports.formatDate = exports.objMap = exports.cn = exports.splitIntoTwo = exports.flatten = exports.uid = exports.pick = exports.getIn = exports.setIn = exports.updateIn = exports.on = exports.map = exports.compose = exports.reduceRight = exports.partial = exports.range = exports.until = exports.delay = undefined;

var _typeof2 = __webpack_require__(72444);

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = __webpack_require__(88106);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = __webpack_require__(88239);

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = __webpack_require__(85315);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

exports.dataURItoArrayBuffer = dataURItoArrayBuffer;
exports.dataURItoBlob = dataURItoBlob;
exports.blobToDataURL = blobToDataURL;
exports.blobToText = blobToText;
exports.arrayBufferToString = arrayBufferToString;
exports.stringToArrayBuffer = stringToArrayBuffer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// delay the call of a function and return a promise
var delay = exports.delay = function delay(fn, timeout) {
  return new _promise2.default(function (resolve, reject) {
    setTimeout(function () {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, timeout);
  });
};

// Poll on whatever you want to check, and will time out after a specific duration
// `check` should return `{ pass: Boolean, result: Any }`
// `name` is for a meaningful error message
var until = exports.until = function until(name, check) {
  var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var expire = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;
  var errorMsg = arguments[4];

  var start = new Date();
  var go = function go() {
    if (expire && new Date() - start >= expire) {
      var msg = errorMsg || 'until: ' + name + ' expired!';
      throw new Error(msg);
    }

    var _check = check(),
        pass = _check.pass,
        result = _check.result;

    if (pass) return _promise2.default.resolve(result);
    return delay(go, interval);
  };

  return new _promise2.default(function (resolve, reject) {
    try {
      resolve(go());
    } catch (e) {
      reject(e);
    }
  });
};

var range = exports.range = function range(start, end) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var ret = [];

  for (var i = start; i < end; i += step) {
    ret.push(i);
  }

  return ret;
};

// create a curry version of the passed in function
var partial = exports.partial = function partial(fn) {
  var len = fn.length;
  var _arbitary = void 0;

  _arbitary = function arbitary(curArgs, leftArgCnt) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length >= leftArgCnt) {
        return fn.apply(null, curArgs.concat(args));
      }

      return _arbitary(curArgs.concat(args), leftArgCnt - args.length);
    };
  };

  return _arbitary([], len);
};

var reduceRight = exports.reduceRight = function reduceRight(fn, initial, list) {
  var ret = initial;

  for (var i = list.length - 1; i >= 0; i--) {
    ret = fn(list[i], ret);
  }

  return ret;
};

// compose functions into one
var compose = exports.compose = function compose() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return reduceRight(function (cur, prev) {
    return function (x) {
      return cur(prev(x));
    };
  }, function (x) {
    return x;
  }, args);
};

var map = exports.map = partial(function (fn, list) {
  var result = [];

  for (var i = 0, len = list.length; i < len; i++) {
    result.push(fn(list[i]));
  }

  return result;
});

var on = exports.on = partial(function (key, fn, dict) {
  if (Array.isArray(dict)) {
    return [].concat((0, _toConsumableArray3.default)(dict.slice(0, key)), [fn(dict[key])], (0, _toConsumableArray3.default)(dict.slice(key + 1)));
  }

  return (0, _extends4.default)({}, dict, (0, _defineProperty3.default)({}, key, fn(dict[key])));
});

// immutably update any part in an object
var updateIn = exports.updateIn = partial(function (keys, fn, obj) {
  var updater = compose.apply(null, keys.map(function (key) {
    return key === '[]' ? map : on(key);
  }));
  return updater(fn)(obj);
});

// immutably set any part in an object
// a restricted version of updateIn
var setIn = exports.setIn = partial(function (keys, value, obj) {
  var updater = compose.apply(null, keys.map(function (key) {
    return key === '[]' ? map : on(key);
  }));
  return updater(function () {
    return value;
  })(obj);
});

// return part of the object with a few keys deep inside
var getIn = exports.getIn = partial(function (keys, obj) {
  return keys.reduce(function (prev, key) {
    if (!prev) return prev;
    return prev[key];
  }, obj);
});

// return the passed in object with only certains keys
var pick = exports.pick = function pick(keys, obj) {
  return keys.reduce(function (prev, key) {
    if (obj[key] !== undefined) {
      prev[key] = obj[key];
    }
    return prev;
  }, {});
};

var uid = exports.uid = function uid() {
  return '' + new Date() * 1 + '.' + Math.floor(Math.random() * 10000000).toString(16);
};

var flatten = exports.flatten = function flatten(list) {
  return [].concat.apply([], list);
};

var splitIntoTwo = exports.splitIntoTwo = function splitIntoTwo(pattern, str) {
  var index = str.indexOf(pattern);
  if (index === -1) return [str];

  return [str.substr(0, index), str.substr(index + 1)];
};

var cn = exports.cn = function cn() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return args.reduce(function (prev, cur) {
    if (typeof cur === 'string') {
      prev.push(cur);
    } else {
      (0, _keys2.default)(cur).forEach(function (key) {
        if (cur[key]) {
          prev.push(key);
        }
      });
    }

    return prev;
  }, []).join(' ');
};

var objMap = exports.objMap = function objMap(fn, obj) {
  return (0, _keys2.default)(obj).reduce(function (prev, key, i) {
    prev[key] = fn(obj[key], key, i);
    return prev;
  }, {});
};

var formatDate = exports.formatDate = function formatDate(d) {
  var pad = function pad(n) {
    return n >= 10 ? '' + n : '0' + n;
  };
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(pad).join('-');
};

var splitKeep = exports.splitKeep = function splitKeep(pattern, str) {
  var result = [];
  var startIndex = 0;
  var reg = void 0,
      match = void 0,
      lastMatchIndex = void 0;

  if (pattern instanceof RegExp) {
    reg = new RegExp(pattern, pattern.flags.indexOf('g') !== -1 ? pattern.flags : pattern.flags + 'g');
  } else if (typeof pattern === 'string') {
    reg = new RegExp(pattern, 'g');
  }

  // eslint-disable-next-line no-cond-assign
  while (match = reg.exec(str)) {
    if (lastMatchIndex === match.index) {
      break;
    }

    if (match.index > startIndex) {
      result.push(str.substring(startIndex, match.index));
    }

    result.push(match[0]);
    startIndex = match.index + match[0].length;
    lastMatchIndex = match.index;
  }

  if (startIndex < str.length) {
    result.push(str.substr(startIndex));
  }

  return result;
};

var nameFactory = exports.nameFactory = function nameFactory() {
  var all = {};

  return function (str) {
    if (!all[str]) {
      all[str] = true;
      return str;
    }

    var n = 2;
    while (all[str + '-' + n]) {
      n++;
    }

    all[str + '-' + n] = true;
    return str + '-' + n;
  };
};

var composePromiseFn = exports.composePromiseFn = function composePromiseFn() {
  for (var _len4 = arguments.length, list = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    list[_key4] = arguments[_key4];
  }

  return reduceRight(function (cur, prev) {
    return function (x) {
      return prev(x).then(cur);
    };
  }, function (x) {
    return _promise2.default.resolve(x);
  }, list);
};

var parseQuery = exports.parseQuery = function parseQuery(query) {
  return query.slice(1).split('&').reduce(function (prev, cur) {
    var index = cur.indexOf('=');
    var key = cur.substring(0, index);
    var val = cur.substring(index + 1);

    prev[key] = decodeURIComponent(val);
    return prev;
  }, {});
};

var toRegExp = exports.toRegExp = function toRegExp(str) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$needEncode = _ref.needEncode,
      needEncode = _ref$needEncode === undefined ? false : _ref$needEncode,
      _ref$flag = _ref.flag,
      flag = _ref$flag === undefined ? '' : _ref$flag;

  return new RegExp(needEncode ? str.replace(/[[\](){}^$.*+?|]/g, '\\$&') : str, flag);
};

var insertScript = exports.insertScript = function insertScript(file) {
  var s = document.constructor.prototype.createElement.call(document, 'script');

  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);

  document.documentElement.appendChild(s);
  s.parentNode.removeChild(s);
};

var withTimeout = exports.withTimeout = function withTimeout(timeout, fn) {
  return new _promise2.default(function (resolve, reject) {
    var cancel = function cancel() {
      return clearTimeout(timer);
    };
    var timer = setTimeout(function () {
      reject(new Error('timeout'));
    }, timeout);

    _promise2.default.resolve(fn(cancel)).then(function (data) {
      cancel();
      resolve(data);
    }, function (e) {
      cancel();
      reject(e);
    });
  });
};

var retry = exports.retry = function retry(fn, options) {
  return function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var _timeout$retryInterva = (0, _extends4.default)({
      timeout: 5000,
      retryInterval: 1000,
      onFirstFail: function onFirstFail() {},
      onFinal: function onFinal() {},
      shouldRetry: function shouldRetry() {
        return false;
      }
    }, options),
        timeout = _timeout$retryInterva.timeout,
        onFirstFail = _timeout$retryInterva.onFirstFail,
        onFinal = _timeout$retryInterva.onFinal,
        shouldRetry = _timeout$retryInterva.shouldRetry,
        retryInterval = _timeout$retryInterva.retryInterval;

    var retryCount = 0;
    var lastError = null;
    var timerToClear = null;
    var done = false;

    var wrappedOnFinal = function wrappedOnFinal() {
      done = true;

      if (timerToClear) {
        clearTimeout(timerToClear);
      }

      return onFinal.apply(undefined, arguments);
    };

    var intervalMan = function () {
      var lastInterval = null;
      var intervalFactory = function () {
        switch (typeof retryInterval === 'undefined' ? 'undefined' : (0, _typeof3.default)(retryInterval)) {
          case 'function':
            return retryInterval;

          case 'number':
            return function () {
              return retryInterval;
            };

          default:
            throw new Error('retryInterval must be either a number or a function');
        }
      }();

      return {
        getLastInterval: function getLastInterval() {
          return lastInterval;
        },
        getInterval: function getInterval() {
          var interval = intervalFactory(retryCount, lastInterval);
          lastInterval = interval;
          return interval;
        }
      };
    }();

    var onError = function onError(e, reject) {
      if (!shouldRetry(e, retryCount)) {
        wrappedOnFinal(e);

        if (reject) return reject(e);else throw e;
      }
      lastError = e;

      return new _promise2.default(function (resolve, reject) {
        if (retryCount++ === 0) {
          onFirstFail(e);
          timerToClear = setTimeout(function () {
            wrappedOnFinal(lastError);
            reject(lastError);
          }, timeout);
        }

        if (done) return;

        delay(run, intervalMan.getInterval()).then(resolve, function (e) {
          return onError(e, reject);
        });
      });
    };

    var run = function run() {
      return new _promise2.default(function (resolve) {
        resolve(fn.apply(undefined, args.concat([{
          retryCount: retryCount,
          retryInterval: intervalMan.getLastInterval()
        }])));
      }).catch(onError);
    };

    return run().then(function (result) {
      wrappedOnFinal(null, result);
      return result;
    });
  };
};

// refer to https://stackoverflow.com/questions/12168909/blob-from-dataurl
function dataURItoArrayBuffer(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(/^data:/.test(dataURI) ? dataURI.split(',')[1] : dataURI);

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return ab;
}

function dataURItoBlob(dataURI) {
  var ab = dataURItoArrayBuffer(dataURI);
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

function blobToDataURL(blob) {
  var withBase64Prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return new _promise2.default(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function (e) {
      var str = reader.result;
      if (withBase64Prefix) return resolve(str);

      var b64 = 'base64,';
      var i = str.indexOf(b64);
      var ret = str.substr(i + b64.length);

      resolve(ret);
    };
    reader.readAsDataURL(blob);
  });
}

function blobToText(blob) {
  return new _promise2.default(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function (e) {
      var str = reader.result;
      resolve(str);
    };
    reader.readAsText(blob);
  });
}

function arrayBufferToString(buf) {
  var decoder = new TextDecoder('utf-8');
  return decoder.decode(new Uint8Array(buf));
  // return String.fromCharCode.apply(null, new Uint16Array(buf))
}

function stringToArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

var randomName = exports.randomName = function randomName() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

  if (length <= 0 || length > 100) throw new Error('randomName, length must be between 1 and 100');

  var randomChar = function randomChar() {
    var n = Math.floor(62 * Math.random());
    var code = void 0;

    if (n <= 9) {
      code = 48 + n;
    } else if (n <= 35) {
      code = 65 + n - 10;
    } else {
      code = 97 + n - 36;
    }

    return String.fromCharCode(code);
  };

  return range(0, length).map(randomChar).join('').toLowerCase();
};

var withFileExtension = exports.withFileExtension = function withFileExtension(origName, fn) {
  var reg = /\.\w+$/;
  var m = origName.match(reg);

  var extName = m ? m[0] : '';
  var baseName = m ? origName.replace(reg, '') : origName;
  var result = fn(baseName, function (name) {
    return name + extName;
  });

  if (!result) {
    throw new Error('withFileExtension: should not return null/undefined');
  }

  if (typeof result.then === 'function') {
    return result.then(function (name) {
      return name + extName;
    });
  }

  return result + extName;
};

var uniqueName = exports.uniqueName = function uniqueName(name, options) {
  var opts = (0, _extends4.default)({
    generate: function generate(old) {
      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var reg = /_\((\d+)\)$/;
      var m = old.match(reg);

      if (!m) return old + '_(' + step + ')';
      return old.replace(reg, function (_, n) {
        return '_(' + (parseInt(n, 10) + step) + ')';
      });
    },
    check: function check() {
      return _promise2.default.resolve(true);
    }
  }, options || {});
  var generate = opts.generate,
      check = opts.check;


  return withFileExtension(name, function (baseName, getFullName) {
    var go = function go(fileName, step) {
      return check(getFullName(fileName)).then(function (pass) {
        if (pass) return fileName;
        return go(generate(fileName, step), step);
      });
    };

    return go(baseName, 1);
  });
};

var and = exports.and = function and() {
  for (var _len6 = arguments.length, list = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    list[_key6] = arguments[_key6];
  }

  return list.reduce(function (prev, cur) {
    return prev && cur;
  }, true);
};

var loadCsv = exports.loadCsv = function loadCsv(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('failed to load csv - ' + url);
    return res.text();
  });
};

var loadImage = exports.loadImage = function loadImage(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('failed to load image - ' + url);
    return res.blob();
  });
};

var ensureExtName = exports.ensureExtName = function ensureExtName(ext, name) {
  var extName = ext.indexOf('.') === 0 ? ext : '.' + ext;
  if (name.lastIndexOf(extName) + extName.length === name.length) return name;
  return name + extName;
};

var validateStandardName = exports.validateStandardName = function validateStandardName(name, isFileName) {
  if (!isFileName && !/^_|[a-zA-Z]/.test(name)) {
    throw new Error('must start with a letter or the underscore character.');
  }

  if (isFileName && !/^_|[a-zA-Z0-9]/.test(name)) {
    throw new Error('must start with alpha-numeric or the underscore character.');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error('can only contain alpha-numeric characters and underscores (A-z, 0-9, and _ )');
  }
};

var sanitizeFileName = exports.sanitizeFileName = function sanitizeFileName(fileName) {
  return withFileExtension(fileName, function (baseName) {
    return baseName.replace(/[\\/:*?<>|]/g, '_');
  });
};

var getPageDpi = exports.getPageDpi = function getPageDpi() {
  var DEFAULT_DPI = 96;
  var matchDpi = function matchDpi(dpi) {
    return window.matchMedia('(max-resolution: ' + dpi + 'dpi)').matches === true;
  };

  // We iteratively scan all possible media query matches.
  // We can't use binary search, because there are "many" correct answer in
  // problem space and we need the very first match.
  // To speed up computation we divide problem space into buckets.
  // We test each bucket's first element and if we found a match,
  // we make a full scan for previous bucket with including first match.
  // Still, we could use "divide-and-conquer" for such problems.
  // Due to common DPI values, it's not worth to implement such algorithm.

  var bucketSize = 24; // common divisor for 72, 96, 120, 144 etc.

  for (var i = bucketSize; i < 3000; i += bucketSize) {
    if (matchDpi(i)) {
      var start = i - bucketSize;
      var end = i;

      for (var k = start; k <= end; ++k) {
        if (matchDpi(k)) {
          return k;
        }
      }
    }
  }

  return DEFAULT_DPI; // default fallback
};

var dpiFromFileName = exports.dpiFromFileName = function dpiFromFileName(fileName) {
  var reg = /_dpi_(\d+)/i;
  var m = fileName.match(reg);
  return m ? parseInt(m[1], 10) : 0;
};

var mockAPIWith = exports.mockAPIWith = function mockAPIWith(factory, mock) {
  var promiseFunctionKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var real = mock;
  var exported = objMap(function (val, key) {
    if (typeof val === 'function') {
      if (promiseFunctionKeys.indexOf(key) !== -1) {
        return function () {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return p.then(function () {
            var _real;

            return (_real = real)[key].apply(_real, args);
          });
        };
      } else {
        return function () {
          var _real3;

          for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
          }

          p.then(function () {
            var _real2;

            return (_real2 = real)[key].apply(_real2, args);
          });
          return (_real3 = real)[key].apply(_real3, args);
        };
      }
    } else {
      return val;
    }
  }, mock);

  var p = _promise2.default.resolve(factory()).then(function (api) {
    real = api;
  });

  return exported;
};

var bindOnce = exports.bindOnce = function bindOnce(target, eventName, fn) {
  for (var _len9 = arguments.length, rest = Array(_len9 > 3 ? _len9 - 3 : 0), _key9 = 3; _key9 < _len9; _key9++) {
    rest[_key9 - 3] = arguments[_key9];
  }

  var wrapped = function wrapped() {
    try {
      target.removeEventListener.apply(target, [eventName, wrapped].concat(rest));
    } catch (e) {}

    return fn.apply(undefined, arguments);
  };

  target.addEventListener.apply(target, [eventName, wrapped].concat(rest));
};

var bind = exports.bind = function bind(target, eventName, fn) {
  for (var _len10 = arguments.length, rest = Array(_len10 > 3 ? _len10 - 3 : 0), _key10 = 3; _key10 < _len10; _key10++) {
    rest[_key10 - 3] = arguments[_key10];
  }

  target.addEventListener.apply(target, [eventName, fn].concat(rest));
};

/***/ }),

/***/ 61171:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = __webpack_require__(63239);

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = __webpack_require__(12424);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global chrome browser */

// Note: it's an adapter for both chrome and web extension API
// chrome and web extension API have almost the same API signatures
// except that chrome accepts callback while web extension returns promises
//
// The whole idea here is to make sure all callback style API of chrome
// also return promises
//
// Important: You need to specify whatever API you need to use in `UsedAPI` below

(function () {
  var adaptChrome = function adaptChrome(obj, chrome) {
    var adapt = function adapt(src, ret, obj, fn) {
      return (0, _keys2.default)(obj).reduce(function (prev, key) {
        var keyParts = key.split('.');

        var _keyParts$reduce = keyParts.reduce(function (tuple, subkey) {
          var tar = tuple[0];
          var src = tuple[1];

          tar[subkey] = tar[subkey] || {};
          return [tar[subkey], src && src[subkey]];
        }, [prev, src]),
            _keyParts$reduce2 = (0, _slicedToArray3.default)(_keyParts$reduce, 2),
            target = _keyParts$reduce2[0],
            source = _keyParts$reduce2[1];

        obj[key].forEach(function (method) {
          fn(method, source, target);
        });

        return prev;
      }, ret);
    };

    var promisify = function promisify(method, source, target) {
      if (!source) return;
      var reg = /The message port closed before a res?ponse was received/;

      target[method] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new _promise2.default(function (resolve, reject) {
          var callback = function callback(result) {
            // Note: The message port closed before a reponse was received.
            // Ignore this message
            if (chrome.runtime.lastError && !reg.test(chrome.runtime.lastError.message)) {
              console.error(chrome.runtime.lastError.message + ', ' + method + ', ' + (0, _stringify2.default)(args));
              return reject(chrome.runtime.lastError);
            }
            resolve(result);
          };

          source[method].apply(source, args.concat(callback));
        });
      };
    };

    var copy = function copy(method, source, target) {
      if (!source) return;
      target[method] = source[method];
    };

    return [[obj.toPromisify, promisify], [obj.toCopy, copy]].reduce(function (prev, tuple) {
      return adapt(chrome, prev, tuple[0], tuple[1]);
    }, {});
  };

  var UsedAPI = {
    toPromisify: {
      tabs: ['create', 'sendMessage', 'get', 'update', 'query', 'captureVisibleTab', 'remove', 'getZoom'],
      windows: ['update', 'getLastFocused', 'getCurrent', 'getAll', 'remove', 'create', 'get'],
      runtime: ['sendMessage', 'setUninstallURL'],
      cookies: ['get', 'getAll', 'set', 'remove'],
      notifications: ['create', 'clear'],
      action: ['getBadgeText', 'setIcon'],
      bookmarks: ['create', 'getTree'],
      debugger: ['attach', 'detach', 'sendCommand', 'getTargets'],
      downloads: ['search'],
      extension: ['isAllowedFileSchemeAccess'],
      contextMenus: ['create', 'update', 'remove', 'removeAll'],
      'storage.local': ['get', 'set']
    },
    toCopy: {
      tabs: ['onActivated', 'onUpdated', 'onRemoved'],
      windows: ['onFocusChanged'],
      runtime: ['onMessage', 'onInstalled', 'getManifest', 'getURL'],
      storage: ['onChanged'],
      action: ['setBadgeText', 'setBadgeBackgroundColor', 'onClicked'],
      contextMenus: ['onClicked'],
      extension: ['getURL'],
      debugger: ['onEvent', 'onDetach'],
      downloads: ['onCreated', 'onChanged', 'onDeterminingFilename', 'setShelfEnabled'],
      webRequest: ['onAuthRequired']
    }
  };

  var Ext = typeof chrome !== 'undefined' ? adaptChrome(UsedAPI, chrome) : browser;

  (0, _extends3.default)(Ext, {
    isFirefox: function isFirefox() {
      return (/Firefox/.test(self.navigator.userAgent)
      );
    }
  });

  if (true) {
    module.exports = Ext;
  } else {}
})();

/***/ }),

/***/ 24043:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(47185), __esModule: true };

/***/ }),

/***/ 26378:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(3597), __esModule: true };

/***/ }),

/***/ 40863:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(21035), __esModule: true };

/***/ }),

/***/ 63239:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(92742), __esModule: true };

/***/ }),

/***/ 52945:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(56981), __esModule: true };

/***/ }),

/***/ 32242:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(33391), __esModule: true };

/***/ }),

/***/ 88902:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(98613), __esModule: true };

/***/ }),

/***/ 46593:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(80112), __esModule: true };

/***/ }),

/***/ 93516:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(80025), __esModule: true };

/***/ }),

/***/ 64275:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(52392), __esModule: true };

/***/ }),

/***/ 36803:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),

/***/ 99663:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.__esModule = true;

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ 22600:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(32242);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ 88106:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(32242);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),

/***/ 88239:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(52945);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 12424:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(40863);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(26378);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/***/ }),

/***/ 85315:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(24043);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),

/***/ 72444:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(64275);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(93516);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),

/***/ 52548:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(58544);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 58544:
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = "object" === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ 94942:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(52548);


/***/ }),

/***/ 82894:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

(__webpack_require__(43567).check)("es5");

/***/ }),

/***/ 43567:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(89677);
module.exports = __webpack_require__(1100);


/***/ }),

/***/ 96085:
/***/ ((module) => {

var CapabilityDetector = function () {
    this.tests = {};
    this.cache = {};
};
CapabilityDetector.prototype = {
    constructor: CapabilityDetector,
    define: function (name, test) {
        if (typeof (name) != "string" || !(test instanceof Function))
            throw new Error("Invalid capability definition.");
        if (this.tests[name])
            throw new Error('Duplicated capability definition by "' + name + '".');
        this.tests[name] = test;
    },
    check: function (name) {
        if (!this.test(name))
            throw new Error('The current environment does not support "' + name + '", therefore we cannot continue.');
    },
    test: function (name) {
        if (this.cache[name] !== undefined)
            return this.cache[name];
        if (!this.tests[name])
            throw new Error('Unknown capability with name "' + name + '".');
        var test = this.tests[name];
        this.cache[name] = !!test();
        return this.cache[name];
    }
};

module.exports = CapabilityDetector;

/***/ }),

/***/ 89677:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var capability = __webpack_require__(1100),
    define = capability.define,
    test = capability.test;

define("strict mode", function () {
    return (this === undefined);
});

define("arguments.callee.caller", function () {
    try {
        return (function () {
                return arguments.callee.caller;
            })() === arguments.callee;
    } catch (strictModeIsEnforced) {
        return false;
    }
});

define("es5", function () {
    return test("Array.prototype.forEach") &&
        test("Array.prototype.map") &&
        test("Function.prototype.bind") &&
        test("Object.create") &&
        test("Object.defineProperties") &&
        test("Object.defineProperty") &&
        test("Object.prototype.hasOwnProperty");
});

define("Array.prototype.forEach", function () {
    return Array.prototype.forEach;
});

define("Array.prototype.map", function () {
    return Array.prototype.map;
});

define("Function.prototype.bind", function () {
    return Function.prototype.bind;
});

define("Object.create", function () {
    return Object.create;
});

define("Object.defineProperties", function () {
    return Object.defineProperties;
});

define("Object.defineProperty", function () {
    return Object.defineProperty;
});

define("Object.prototype.hasOwnProperty", function () {
    return Object.prototype.hasOwnProperty;
});

define("Error.captureStackTrace", function () {
    return Error.captureStackTrace;
});

define("Error.prototype.stack", function () {
    try {
        throw new Error();
    }
    catch (e) {
        return e.stack || e.stacktrace;
    }
});

/***/ }),

/***/ 1100:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var CapabilityDetector = __webpack_require__(96085);

var detector = new CapabilityDetector();

var capability = function (name) {
    return detector.test(name);
};
capability.define = function (name, test) {
    detector.define(name, test);
};
capability.check = function (name) {
    detector.check(name);
};
capability.test = capability;

module.exports = capability;

/***/ }),

/***/ 47185:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(91867);
__webpack_require__(2586);
module.exports = __webpack_require__(34579).Array.from;


/***/ }),

/***/ 3597:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(73871);
__webpack_require__(91867);
module.exports = __webpack_require__(46459);


/***/ }),

/***/ 21035:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(73871);
__webpack_require__(91867);
module.exports = __webpack_require__(89553);


/***/ }),

/***/ 92742:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var core = __webpack_require__(34579);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),

/***/ 56981:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(72699);
module.exports = __webpack_require__(34579).Object.assign;


/***/ }),

/***/ 33391:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(31477);
var $Object = (__webpack_require__(34579).Object);
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ 98613:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(40961);
module.exports = __webpack_require__(34579).Object.keys;


/***/ }),

/***/ 80112:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(94058);
__webpack_require__(91867);
__webpack_require__(73871);
__webpack_require__(32878);
__webpack_require__(95971);
__webpack_require__(22526);
module.exports = __webpack_require__(34579).Promise;


/***/ }),

/***/ 80025:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(46840);
__webpack_require__(94058);
__webpack_require__(8174);
__webpack_require__(36461);
module.exports = __webpack_require__(34579).Symbol;


/***/ }),

/***/ 52392:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(91867);
__webpack_require__(73871);
module.exports = (__webpack_require__(25103).f)('iterator');


/***/ }),

/***/ 85663:
/***/ ((module) => {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 79003:
/***/ ((module) => {

module.exports = function () { /* empty */ };


/***/ }),

/***/ 29142:
/***/ ((module) => {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ 12159:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(36727);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 57428:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(7932);
var toLength = __webpack_require__(78728);
var toAbsoluteIndex = __webpack_require__(16531);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 14677:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(32894);
var TAG = __webpack_require__(22939)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ 32894:
/***/ ((module) => {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 34579:
/***/ ((module) => {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 52445:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $defineProperty = __webpack_require__(4743);
var createDesc = __webpack_require__(83101);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ 19216:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// optional / simple context binding
var aFunction = __webpack_require__(85663);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 8333:
/***/ ((module) => {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 89666:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(7929)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 97467:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(36727);
var document = (__webpack_require__(33938).document);
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 73338:
/***/ ((module) => {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ 70337:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(46162);
var gOPS = __webpack_require__(48195);
var pIE = __webpack_require__(86274);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),

/***/ 83856:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(33938);
var core = __webpack_require__(34579);
var ctx = __webpack_require__(19216);
var hide = __webpack_require__(41818);
var has = __webpack_require__(27069);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 7929:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 45576:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ctx = __webpack_require__(19216);
var call = __webpack_require__(95602);
var isArrayIter = __webpack_require__(45991);
var anObject = __webpack_require__(12159);
var toLength = __webpack_require__(78728);
var getIterFn = __webpack_require__(83728);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ 33938:
/***/ ((module) => {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 27069:
/***/ ((module) => {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 41818:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dP = __webpack_require__(4743);
var createDesc = __webpack_require__(83101);
module.exports = __webpack_require__(89666) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 54881:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var document = (__webpack_require__(33938).document);
module.exports = document && document.documentElement;


/***/ }),

/***/ 33758:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = !__webpack_require__(89666) && !__webpack_require__(7929)(function () {
  return Object.defineProperty(__webpack_require__(97467)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 46778:
/***/ ((module) => {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ 50799:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(32894);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 45991:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// check on default Array iterator
var Iterators = __webpack_require__(15449);
var ITERATOR = __webpack_require__(22939)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ 71421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(32894);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ 36727:
/***/ ((module) => {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 95602:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(12159);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ 33945:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var create = __webpack_require__(98989);
var descriptor = __webpack_require__(83101);
var setToStringTag = __webpack_require__(25378);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(41818)(IteratorPrototype, __webpack_require__(22939)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ 45700:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var LIBRARY = __webpack_require__(16227);
var $export = __webpack_require__(83856);
var redefine = __webpack_require__(57470);
var hide = __webpack_require__(41818);
var Iterators = __webpack_require__(15449);
var $iterCreate = __webpack_require__(33945);
var setToStringTag = __webpack_require__(25378);
var getPrototypeOf = __webpack_require__(95089);
var ITERATOR = __webpack_require__(22939)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ 96630:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ITERATOR = __webpack_require__(22939)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ 85084:
/***/ ((module) => {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ 15449:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 16227:
/***/ ((module) => {

module.exports = true;


/***/ }),

/***/ 77177:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var META = __webpack_require__(65730)('meta');
var isObject = __webpack_require__(36727);
var has = __webpack_require__(27069);
var setDesc = (__webpack_require__(4743).f);
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(7929)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ 81601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(33938);
var macrotask = (__webpack_require__(62569).set);
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(32894)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ 59304:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(85663);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ 88082:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__(89666);
var getKeys = __webpack_require__(46162);
var gOPS = __webpack_require__(48195);
var pIE = __webpack_require__(86274);
var toObject = __webpack_require__(66530);
var IObject = __webpack_require__(50799);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(7929)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ 98989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(12159);
var dPs = __webpack_require__(57856);
var enumBugKeys = __webpack_require__(73338);
var IE_PROTO = __webpack_require__(58989)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(97467)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  (__webpack_require__(54881).appendChild)(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ 4743:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var anObject = __webpack_require__(12159);
var IE8_DOM_DEFINE = __webpack_require__(33758);
var toPrimitive = __webpack_require__(33206);
var dP = Object.defineProperty;

exports.f = __webpack_require__(89666) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 57856:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dP = __webpack_require__(4743);
var anObject = __webpack_require__(12159);
var getKeys = __webpack_require__(46162);

module.exports = __webpack_require__(89666) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ 76183:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var pIE = __webpack_require__(86274);
var createDesc = __webpack_require__(83101);
var toIObject = __webpack_require__(7932);
var toPrimitive = __webpack_require__(33206);
var has = __webpack_require__(27069);
var IE8_DOM_DEFINE = __webpack_require__(33758);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(89666) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ 94368:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(7932);
var gOPN = (__webpack_require__(33230).f);
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),

/***/ 33230:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(12963);
var hiddenKeys = (__webpack_require__(73338).concat)('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ 48195:
/***/ ((__unused_webpack_module, exports) => {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 95089:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(27069);
var toObject = __webpack_require__(66530);
var IE_PROTO = __webpack_require__(58989)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ 12963:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var has = __webpack_require__(27069);
var toIObject = __webpack_require__(7932);
var arrayIndexOf = __webpack_require__(57428)(false);
var IE_PROTO = __webpack_require__(58989)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 46162:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(12963);
var enumBugKeys = __webpack_require__(73338);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ 86274:
/***/ ((__unused_webpack_module, exports) => {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ 12584:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(83856);
var core = __webpack_require__(34579);
var fails = __webpack_require__(7929);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ 10931:
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ 87790:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(12159);
var isObject = __webpack_require__(36727);
var newPromiseCapability = __webpack_require__(59304);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ 83101:
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 48144:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hide = __webpack_require__(41818);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),

/***/ 57470:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(41818);


/***/ }),

/***/ 39967:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(33938);
var core = __webpack_require__(34579);
var dP = __webpack_require__(4743);
var DESCRIPTORS = __webpack_require__(89666);
var SPECIES = __webpack_require__(22939)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ 25378:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var def = (__webpack_require__(4743).f);
var has = __webpack_require__(27069);
var TAG = __webpack_require__(22939)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ 58989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(20250)('keys');
var uid = __webpack_require__(65730);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ 20250:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var core = __webpack_require__(34579);
var global = __webpack_require__(33938);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(16227) ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ 32707:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(12159);
var aFunction = __webpack_require__(85663);
var SPECIES = __webpack_require__(22939)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ 90510:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(11052);
var defined = __webpack_require__(8333);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ 62569:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ctx = __webpack_require__(19216);
var invoke = __webpack_require__(46778);
var html = __webpack_require__(54881);
var cel = __webpack_require__(97467);
var global = __webpack_require__(33938);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(32894)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ 16531:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(11052);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 11052:
/***/ ((module) => {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 7932:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(50799);
var defined = __webpack_require__(8333);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 78728:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.15 ToLength
var toInteger = __webpack_require__(11052);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 66530:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(8333);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ 33206:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(36727);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 65730:
/***/ ((module) => {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 26640:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(33938);
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ 76347:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(33938);
var core = __webpack_require__(34579);
var LIBRARY = __webpack_require__(16227);
var wksExt = __webpack_require__(25103);
var defineProperty = (__webpack_require__(4743).f);
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),

/***/ 25103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.f = __webpack_require__(22939);


/***/ }),

/***/ 22939:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var store = __webpack_require__(20250)('wks');
var uid = __webpack_require__(65730);
var Symbol = (__webpack_require__(33938).Symbol);
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ 83728:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(14677);
var ITERATOR = __webpack_require__(22939)('iterator');
var Iterators = __webpack_require__(15449);
module.exports = (__webpack_require__(34579).getIteratorMethod) = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 46459:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(12159);
var get = __webpack_require__(83728);
module.exports = (__webpack_require__(34579).getIterator) = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};


/***/ }),

/***/ 89553:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(14677);
var ITERATOR = __webpack_require__(22939)('iterator');
var Iterators = __webpack_require__(15449);
module.exports = (__webpack_require__(34579).isIterable) = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};


/***/ }),

/***/ 2586:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var ctx = __webpack_require__(19216);
var $export = __webpack_require__(83856);
var toObject = __webpack_require__(66530);
var call = __webpack_require__(95602);
var isArrayIter = __webpack_require__(45991);
var toLength = __webpack_require__(78728);
var createProperty = __webpack_require__(52445);
var getIterFn = __webpack_require__(83728);

$export($export.S + $export.F * !__webpack_require__(96630)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ 3882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var addToUnscopables = __webpack_require__(79003);
var step = __webpack_require__(85084);
var Iterators = __webpack_require__(15449);
var toIObject = __webpack_require__(7932);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(45700)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ 72699:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(83856);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(88082) });


/***/ }),

/***/ 31477:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $export = __webpack_require__(83856);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(89666), 'Object', { defineProperty: (__webpack_require__(4743).f) });


/***/ }),

/***/ 40961:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(66530);
var $keys = __webpack_require__(46162);

__webpack_require__(12584)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ 94058:
/***/ (() => {



/***/ }),

/***/ 32878:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var LIBRARY = __webpack_require__(16227);
var global = __webpack_require__(33938);
var ctx = __webpack_require__(19216);
var classof = __webpack_require__(14677);
var $export = __webpack_require__(83856);
var isObject = __webpack_require__(36727);
var aFunction = __webpack_require__(85663);
var anInstance = __webpack_require__(29142);
var forOf = __webpack_require__(45576);
var speciesConstructor = __webpack_require__(32707);
var task = (__webpack_require__(62569).set);
var microtask = __webpack_require__(81601)();
var newPromiseCapabilityModule = __webpack_require__(59304);
var perform = __webpack_require__(10931);
var userAgent = __webpack_require__(26640);
var promiseResolve = __webpack_require__(87790);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(22939)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(48144)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(25378)($Promise, PROMISE);
__webpack_require__(39967)(PROMISE);
Wrapper = __webpack_require__(34579)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(96630)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ 91867:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $at = __webpack_require__(90510)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(45700)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ 46840:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(33938);
var has = __webpack_require__(27069);
var DESCRIPTORS = __webpack_require__(89666);
var $export = __webpack_require__(83856);
var redefine = __webpack_require__(57470);
var META = (__webpack_require__(77177).KEY);
var $fails = __webpack_require__(7929);
var shared = __webpack_require__(20250);
var setToStringTag = __webpack_require__(25378);
var uid = __webpack_require__(65730);
var wks = __webpack_require__(22939);
var wksExt = __webpack_require__(25103);
var wksDefine = __webpack_require__(76347);
var enumKeys = __webpack_require__(70337);
var isArray = __webpack_require__(71421);
var anObject = __webpack_require__(12159);
var isObject = __webpack_require__(36727);
var toObject = __webpack_require__(66530);
var toIObject = __webpack_require__(7932);
var toPrimitive = __webpack_require__(33206);
var createDesc = __webpack_require__(83101);
var _create = __webpack_require__(98989);
var gOPNExt = __webpack_require__(94368);
var $GOPD = __webpack_require__(76183);
var $GOPS = __webpack_require__(48195);
var $DP = __webpack_require__(4743);
var $keys = __webpack_require__(46162);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  (__webpack_require__(33230).f) = gOPNExt.f = $getOwnPropertyNames;
  (__webpack_require__(86274).f) = $propertyIsEnumerable;
  $GOPS.f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(16227)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return $GOPS.f(toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(41818)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),

/***/ 95971:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(83856);
var core = __webpack_require__(34579);
var global = __webpack_require__(33938);
var speciesConstructor = __webpack_require__(32707);
var promiseResolve = __webpack_require__(87790);

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ 22526:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(83856);
var newPromiseCapability = __webpack_require__(59304);
var perform = __webpack_require__(10931);

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),

/***/ 8174:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(76347)('asyncIterator');


/***/ }),

/***/ 36461:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(76347)('observable');


/***/ }),

/***/ 73871:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(3882);
var global = __webpack_require__(33938);
var hide = __webpack_require__(41818);
var Iterators = __webpack_require__(15449);
var TO_STRING_TAG = __webpack_require__(22939)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),

/***/ 95864:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var util = __webpack_require__(89539);
var isArrayish = __webpack_require__(35171);

var errorEx = function errorEx(name, properties) {
	if (!name || name.constructor !== String) {
		properties = name || {};
		name = Error.name;
	}

	var errorExError = function ErrorEXError(message) {
		if (!this) {
			return new ErrorEXError(message);
		}

		message = message instanceof Error
			? message.message
			: (message || this.message);

		Error.call(this, message);
		Error.captureStackTrace(this, errorExError);

		this.name = name;

		Object.defineProperty(this, 'message', {
			configurable: true,
			enumerable: false,
			get: function () {
				var newMessage = message.split(/\r?\n/g);

				for (var key in properties) {
					if (!properties.hasOwnProperty(key)) {
						continue;
					}

					var modifier = properties[key];

					if ('message' in modifier) {
						newMessage = modifier.message(this[key], newMessage) || newMessage;
						if (!isArrayish(newMessage)) {
							newMessage = [newMessage];
						}
					}
				}

				return newMessage.join('\n');
			},
			set: function (v) {
				message = v;
			}
		});

		var overwrittenStack = null;

		var stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');
		var stackGetter = stackDescriptor.get;
		var stackValue = stackDescriptor.value;
		delete stackDescriptor.value;
		delete stackDescriptor.writable;

		stackDescriptor.set = function (newstack) {
			overwrittenStack = newstack;
		};

		stackDescriptor.get = function () {
			var stack = (overwrittenStack || ((stackGetter)
				? stackGetter.call(this)
				: stackValue)).split(/\r?\n+/g);

			// starting in Node 7, the stack builder caches the message.
			// just replace it.
			if (!overwrittenStack) {
				stack[0] = this.name + ': ' + this.message;
			}

			var lineCount = 1;
			for (var key in properties) {
				if (!properties.hasOwnProperty(key)) {
					continue;
				}

				var modifier = properties[key];

				if ('line' in modifier) {
					var line = modifier.line(this[key]);
					if (line) {
						stack.splice(lineCount++, 0, '    ' + line);
					}
				}

				if ('stack' in modifier) {
					modifier.stack(this[key], stack);
				}
			}

			return stack.join('\n');
		};

		Object.defineProperty(this, 'stack', stackDescriptor);
	};

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(errorExError.prototype, Error.prototype);
		Object.setPrototypeOf(errorExError, Error);
	} else {
		util.inherits(errorExError, Error);
	}

	return errorExError;
};

errorEx.append = function (str, def) {
	return {
		message: function (v, message) {
			v = v || def;

			if (v) {
				message[0] += ' ' + str.replace('%s', v.toString());
			}

			return message;
		}
	};
};

errorEx.line = function (str, def) {
	return {
		line: function (v) {
			v = v || def;

			if (v) {
				return str.replace('%s', v.toString());
			}

			return null;
		}
	};
};

module.exports = errorEx;


/***/ }),

/***/ 58010:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(87643);

/***/ }),

/***/ 87643:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(82894);

var capability = __webpack_require__(43567);

var polyfill;
if (capability("Error.captureStackTrace"))
    polyfill = __webpack_require__(84649);
else if (capability("Error.prototype.stack"))
    polyfill = __webpack_require__(77862);
else
    polyfill = __webpack_require__(86688);

module.exports = polyfill();

/***/ }),

/***/ 21036:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Class = (__webpack_require__(61589).Class),
    abstractMethod = (__webpack_require__(61589).abstractMethod);

var Frame = Class(Object, {
    prototype: {
        init: Class.prototype.merge,
        frameString: undefined,
        toString: function () {
            return this.frameString;
        },
        functionValue: undefined,
        getThis: abstractMethod,
        getTypeName: abstractMethod,
        getFunction: function () {
            return this.functionValue;
        },
        getFunctionName: abstractMethod,
        getMethodName: abstractMethod,
        getFileName: abstractMethod,
        getLineNumber: abstractMethod,
        getColumnNumber: abstractMethod,
        getEvalOrigin: abstractMethod,
        isTopLevel: abstractMethod,
        isEval: abstractMethod,
        isNative: abstractMethod,
        isConstructor: abstractMethod
    }
});

module.exports = Frame;

/***/ }),

/***/ 59134:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Class = (__webpack_require__(61589).Class),
    Frame = __webpack_require__(21036),
    cache = (__webpack_require__(17514).cache);

var FrameStringParser = Class(Object, {
    prototype: {
        stackParser: null,
        frameParser: null,
        locationParsers: null,
        constructor: function (options) {
            Class.prototype.merge.call(this, options);
        },
        getFrames: function (frameStrings, functionValues) {
            var frames = [];
            for (var index = 0, length = frameStrings.length; index < length; ++index)
                frames[index] = this.getFrame(frameStrings[index], functionValues[index]);
            return frames;
        },
        getFrame: function (frameString, functionValue) {
            var config = {
                frameString: frameString,
                functionValue: functionValue
            };
            return new Frame(config);
        }
    }
});

module.exports = {
    getClass: cache(function () {
        return FrameStringParser;
    }),
    getInstance: cache(function () {
        var FrameStringParser = this.getClass();
        var instance = new FrameStringParser();
        return instance;
    })
};

/***/ }),

/***/ 50452:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Class = (__webpack_require__(61589).Class),
    abstractMethod = (__webpack_require__(61589).abstractMethod),
    eachCombination = (__webpack_require__(17514).eachCombination),
    cache = (__webpack_require__(17514).cache),
    capability = __webpack_require__(43567);

var AbstractFrameStringSource = Class(Object, {
    prototype: {
        captureFrameStrings: function (frameShifts) {
            var error = this.createError();
            frameShifts.unshift(this.captureFrameStrings);
            frameShifts.unshift(this.createError);
            var capturedFrameStrings = this.getFrameStrings(error);

            var frameStrings = capturedFrameStrings.slice(frameShifts.length),
                functionValues = [];

            if (capability("arguments.callee.caller")) {
                var capturedFunctionValues = [
                    this.createError,
                    this.captureFrameStrings
                ];
                try {
                    var aCaller = arguments.callee;
                    while (aCaller = aCaller.caller)
                        capturedFunctionValues.push(aCaller);
                }
                catch (useStrictError) {
                }
                functionValues = capturedFunctionValues.slice(frameShifts.length);
            }
            return {
                frameStrings: frameStrings,
                functionValues: functionValues
            };
        },
        getFrameStrings: function (error) {
            var message = error.message || "";
            var name = error.name || "";
            var stackString = this.getStackString(error);
            if (stackString === undefined)
                return;
            var stackStringChunks = stackString.split("\n");
            var fromPosition = 0;
            var toPosition = stackStringChunks.length;
            if (this.hasHeader)
                fromPosition += name.split("\n").length + message.split("\n").length - 1;
            if (this.hasFooter)
                toPosition -= 1;
            return stackStringChunks.slice(fromPosition, toPosition);
        },
        createError: abstractMethod,
        getStackString: abstractMethod,
        hasHeader: undefined,
        hasFooter: undefined
    }
});

var FrameStringSourceCalibrator = Class(Object, {
    prototype: {
        calibrateClass: function (FrameStringSource) {
            return this.calibrateMethods(FrameStringSource) && this.calibrateEnvelope(FrameStringSource);
        },
        calibrateMethods: function (FrameStringSource) {
            try {
                eachCombination([[
                    function (message) {
                        return new Error(message);
                    },
                    function (message) {
                        try {
                            throw new Error(message);
                        }
                        catch (error) {
                            return error;
                        }
                    }
                ], [
                    function (error) {
                        return error.stack;
                    },
                    function (error) {
                        return error.stacktrace;
                    }
                ]], function (createError, getStackString) {
                    if (getStackString(createError()))
                        throw {
                            getStackString: getStackString,
                            createError: createError
                        };
                });
            } catch (workingImplementation) {
                Class.merge.call(FrameStringSource, {
                    prototype: workingImplementation
                });
                return true;
            }
            return false;
        },
        calibrateEnvelope: function (FrameStringSource) {
            var getStackString = FrameStringSource.prototype.getStackString;
            var createError = FrameStringSource.prototype.createError;
            var calibratorStackString = getStackString(createError("marker"));
            var calibratorFrameStrings = calibratorStackString.split("\n");
            Class.merge.call(FrameStringSource, {
                prototype: {
                    hasHeader: /marker/.test(calibratorFrameStrings[0]),
                    hasFooter: calibratorFrameStrings[calibratorFrameStrings.length - 1] === ""
                }
            });
            return true;
        }
    }
});


module.exports = {
    getClass: cache(function () {
        var FrameStringSource;
        if (FrameStringSource)
            return FrameStringSource;
        FrameStringSource = Class(AbstractFrameStringSource, {});
        var calibrator = new FrameStringSourceCalibrator();
        if (!calibrator.calibrateClass(FrameStringSource))
            throw new Error("Cannot read Error.prototype.stack in this environment.");
        return FrameStringSource;
    }),
    getInstance: cache(function () {
        var FrameStringSource = this.getClass();
        var instance = new FrameStringSource();
        return instance;
    })
};

/***/ }),

/***/ 77862:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var FrameStringSource = __webpack_require__(50452),
    FrameStringParser = __webpack_require__(59134),
    cache = (__webpack_require__(17514).cache),
    prepareStackTrace = __webpack_require__(79831);

module.exports = function () {

    Error.captureStackTrace = function captureStackTrace(throwable, terminator) {
        var warnings;
        var frameShifts = [
            captureStackTrace
        ];
        if (terminator) {
            // additional frames can come here if arguments.callee.caller is supported
            // otherwise it is hard to identify the terminator
            frameShifts.push(terminator);
        }
        var captured = FrameStringSource.getInstance().captureFrameStrings(frameShifts);
        Object.defineProperties(throwable, {
            stack: {
                configurable: true,
                get: cache(function () {
                    var frames = FrameStringParser.getInstance().getFrames(captured.frameStrings, captured.functionValues);
                    return (Error.prepareStackTrace || prepareStackTrace)(throwable, frames, warnings);
                })
            },
            cachedStack: {
                configurable: true,
                writable: true,
                enumerable: false,
                value: true
            }
        });
    };

    Error.getStackTrace = function (throwable) {
        if (throwable.cachedStack)
            return throwable.stack;
        var frameStrings = FrameStringSource.getInstance().getFrameStrings(throwable),
            frames = [],
            warnings;
        if (frameStrings)
            frames = FrameStringParser.getInstance().getFrames(frameStrings, []);
        else
            warnings = [
                "The stack is not readable by unthrown errors in this environment."
            ];
        var stack = (Error.prepareStackTrace || prepareStackTrace)(throwable, frames, warnings);
        if (frameStrings)
            try {
                Object.defineProperties(throwable, {
                    stack: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: stack
                    },
                    cachedStack: {
                        configurable: true,
                        writable: true,
                        enumerable: false,
                        value: true
                    }
                });
            } catch (nonConfigurableError) {
            }
        return stack;
    };

    return {
        prepareStackTrace: prepareStackTrace
    };
};

/***/ }),

/***/ 79831:
/***/ ((module) => {

var prepareStackTrace = function (throwable, frames, warnings) {
    var string = "";
    string += throwable.name || "Error";
    string += ": " + (throwable.message || "");
    if (warnings instanceof Array)
        for (var warningIndex in warnings) {
            var warning = warnings[warningIndex];
            string += "\n   # " + warning;
        }
    for (var frameIndex in frames) {
        var frame = frames[frameIndex];
        string += "\n   at " + frame.toString();
    }
    return string;
};

module.exports = prepareStackTrace;

/***/ }),

/***/ 86688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cache = (__webpack_require__(17514).cache),
    prepareStackTrace = __webpack_require__(79831);

module.exports = function () {

    Error.captureStackTrace = function (throwable, terminator) {
        Object.defineProperties(throwable, {
            stack: {
                configurable: true,
                get: cache(function () {
                    return (Error.prepareStackTrace || prepareStackTrace)(throwable, []);
                })
            },
            cachedStack: {
                configurable: true,
                writable: true,
                enumerable: false,
                value: true
            }
        });
    };

    Error.getStackTrace = function (throwable) {
        if (throwable.cachedStack)
            return throwable.stack;
        var stack = (Error.prepareStackTrace || prepareStackTrace)(throwable, []);
        try {
            Object.defineProperties(throwable, {
                stack: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: stack
                },
                cachedStack: {
                    configurable: true,
                    writable: true,
                    enumerable: false,
                    value: true
                }
            });
        } catch (nonConfigurableError) {
        }
        return stack;
    };

    return {
        prepareStackTrace: prepareStackTrace
    };
};

/***/ }),

/***/ 84649:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var prepareStackTrace = __webpack_require__(79831);

module.exports = function () {
    Error.getStackTrace = function (throwable) {
        return throwable.stack;
    };

    return {
        prepareStackTrace: prepareStackTrace
    };
};

/***/ }),

/***/ 26729:
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 35171:
/***/ ((module) => {

"use strict";


module.exports = function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && obj.splice instanceof Function);
};


/***/ }),

/***/ 33733:
/***/ ((module) => {

module.exports = function (glob, opts) {
  if (typeof glob !== 'string') {
    throw new TypeError('Expected a string');
  }

  var str = String(glob);

  // The regexp we are building, as a string.
  var reStr = "";

  // Whether we are matching so called "extended" globs (like bash) and should
  // support single character matching, matching ranges of characters, group
  // matching, etc.
  var extended = opts ? !!opts.extended : false;

  // Whether or not to capture those stars, it means wrapping them with parentheses
  // It's not necessary if globstart is turned on
  var capture = opts ? !!opts.capture : false;

  var nonGreedy = opts ? !!opts.nonGreedy : false;

  // When globstar is _false_ (default), '/foo/*' is translated a regexp like
  // '^\/foo\/.*$' which will match any string beginning with '/foo/'
  // When globstar is _true_, '/foo/*' is translated to regexp like
  // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
  // which does not have a '/' to the right of it.
  // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
  // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
  // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
  // globstar is _false_
  var globstar = opts ? !!opts.globstar : false;

  // If we are doing extended matching, this boolean is true when we are inside
  // a group (eg {*.html,*.js}), and false otherwise.
  var inGroup = false;

  // RegExp flags (eg "i" ) to pass in to RegExp constructor.
  var flags = opts && typeof( opts.flags ) === "string" ? opts.flags : "";

  var c;
  for (var i = 0, len = str.length; i < len; i++) {
    c = str[i];

    switch (c) {
    case "/":
    case "$":
    case "^":
    case "+":
    case ".":
    case "(":
    case ")":
    case "=":
    case "!":
    case "|":
      reStr += "\\" + c;
      break;

    case "?":
      if (extended) {
        reStr += ".";
	    break;
      }

    case "[":
    case "]":
      if (extended) {
        reStr += c;
	    break;
      }

    case "{":
      if (extended) {
        inGroup = true;
	    reStr += "(";
	    break;
      }

    case "}":
      if (extended) {
        inGroup = false;
	    reStr += ")";
	    break;
      }

    case ",":
      if (inGroup) {
        reStr += "|";
	    break;
      }
      reStr += "\\" + c;
      break;

    case "*":
      // Move over all consecutive "*"'s.
      // Also store the previous and next characters
      var prevChar = str[i - 1];
      var starCount = 1;
      while(str[i + 1] === "*") {
        starCount++;
        i++;
      }
      var nextChar = str[i + 1];

      if (!globstar) {
        // globstar is disabled, so treat any number of "*" as one
        var s = nonGreedy ? ".*?" : ".*";

        if (capture) {
          s = "(" + s + ")";
        }

        reStr += s;
      } else {
        // globstar is enabled, so determine if this is a globstar segment
        var isGlobstar = starCount > 1                      // multiple "*"'s
          && (prevChar === "/" || prevChar === undefined)   // from the start of the segment
          && (nextChar === "/" || nextChar === undefined)   // to the end of the segment

        if (isGlobstar) {
          // it's a globstar, so match zero or more path segments
          reStr += "((?:[^/]*(?:\/|$))*)";
          i++; // move over the "/"
        } else {
          // it's not a globstar, so only match one path segment
          reStr += "([^/]*)";
        }
      }
      break;

    default:
      reStr += c;
    }
  }

  // When regexp 'g' flag is specified don't
  // constrain the regular expression with ^ & $
  if (!flags || !~flags.indexOf('g')) {
    reStr = "^" + reStr + "$";
  }

  return new RegExp(reStr, flags);
};


/***/ }),

/***/ 91296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;


/***/ }),

/***/ 61589:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(82894);

module.exports = __webpack_require__(71510);

/***/ }),

/***/ 32285:
/***/ ((module) => {

var Class = function () {
    var options = Object.create({
        Source: Object,
        config: {},
        buildArgs: []
    });

    function checkOption(option) {
        var key = "config";
        if (option instanceof Function)
            key = "Source";
        else if (option instanceof Array)
            key = "buildArgs";
        else if (option instanceof Object)
            key = "config";
        else
            throw new Error("Invalid configuration option.");
        if (options.hasOwnProperty(key))
            throw new Error("Duplicated configuration option: " + key + ".");
        options[key] = option;
    }

    for (var index = 0, length = arguments.length; index < length; ++index)
        checkOption(arguments[index]);

    var Source = options.Source,
        config = options.config,
        buildArgs = options.buildArgs;

    return (Source.extend || Class.extend).call(Source, config, buildArgs);
};

Class.factory = function () {
    var Source = this;
    return function () {
        var instance = this;
        if (instance.build instanceof Function)
            instance.build.apply(instance, arguments);
        if (instance.init instanceof Function)
            instance.init.apply(instance, arguments);
    };
};

Class.extend = function (config, buildArgs) {
    var Source = this;
    if (!config)
        config = {};
    var Subject;
    if ((config.prototype instanceof Object) && config.prototype.constructor !== Object)
        Subject = config.prototype.constructor;
    else if (config.factory instanceof Function)
        Subject = config.factory.call(Source);
    Subject = (Source.clone || Class.clone).call(Source, Subject, buildArgs);
    (Subject.merge || Class.merge).call(Subject, config);
    return Subject;
};

Class.prototype.extend = function (config, buildArgs) {
    var subject = this;
    var instance = (subject.clone || Class.prototype.clone).apply(subject, buildArgs);
    (instance.merge || Class.prototype.merge).call(instance, config);
    return instance;
};

Class.clone = function (Subject, buildArgs) {
    var Source = this;
    if (!(Subject instanceof Function))
        Subject = (Source.factory || Class.factory).call(Source);
    Subject.prototype = (Source.prototype.clone || Class.prototype.clone).apply(Source.prototype, buildArgs || []);
    Subject.prototype.constructor = Subject;
    for (var staticProperty in Source)
        if (staticProperty !== "prototype")
            Subject[staticProperty] = Source[staticProperty];
    return Subject;
};

Class.prototype.clone = function () {
    var subject = this;
    var instance = Object.create(subject);
    if (instance.build instanceof Function)
        instance.build.apply(instance, arguments);
    return instance;
};

Class.merge = function (config) {
    var Subject = this;
    for (var staticProperty in config)
        if (staticProperty !== "prototype")
            Subject[staticProperty] = config[staticProperty];
    if (config.prototype instanceof Object)
        (Subject.prototype.merge || Class.prototype.merge).call(Subject.prototype, config.prototype);
    return Subject;
};

Class.prototype.merge = function (config) {
    var subject = this;
    for (var property in config)
        if (property !== "constructor")
            subject[property] = config[property];
    return subject;
};

Class.absorb = function (config) {
    var Subject = this;
    for (var staticProperty in config)
        if (staticProperty !== "prototype" && (Subject[staticProperty] === undefined || Subject[staticProperty] === Function.prototype[staticProperty]))
            Subject[staticProperty] = config[staticProperty];
    if (config.prototype instanceof Object)
        (Subject.prototype.absorb || Class.prototype.absorb).call(Subject.prototype, config.prototype);
    return Subject;
};

Class.prototype.absorb = function (config) {
    var subject = this;
    for (var property in config)
        if (property !== "constructor" && (subject[property] === undefined || subject[property] === Object.prototype[property]))
            subject[property] = config[property];
    return subject;
};

Class.getAncestor = function () {
    var Source = this;
    if (Source !== Source.prototype.constructor)
        return Source.prototype.constructor;
};

Class.newInstance = function () {
    var Subject = this;
    var instance = Object.create(this.prototype);
    Subject.apply(instance, arguments);
    return instance;
};

module.exports = Class;

/***/ }),

/***/ 68503:
/***/ ((module) => {

module.exports = function () {
    throw new Error("Not implemented.");
};

/***/ }),

/***/ 71510:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
    Class: __webpack_require__(32285),
    abstractMethod: __webpack_require__(68503)
};

/***/ }),

/***/ 46097:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var errorEx = __webpack_require__(95864);
var fallback = __webpack_require__(86755);

var JSONError = errorEx('JSONError', {
	fileName: errorEx.append('in %s')
});

module.exports = function (x, reviver, filename) {
	if (typeof reviver === 'string') {
		filename = reviver;
		reviver = null;
	}

	try {
		try {
			return JSON.parse(x, reviver);
		} catch (err) {
			fallback.parse(x, {
				mode: 'json',
				reviver: reviver
			});

			throw err;
		}
	} catch (err) {
		var jsonErr = new JSONError(err);

		if (filename) {
			jsonErr.fileName = filename;
		}

		throw jsonErr;
	}
};


/***/ }),

/***/ 86755:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
 * Author: Alex Kocharin <alex@kocharin.ru>
 * GIT: https://github.com/rlidwka/jju
 * License: WTFPL, grab your copy here: http://www.wtfpl.net/txt/copying/
 */

// RTFM: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf

var Uni = __webpack_require__(93244)

function isHexDigit(x) {
  return (x >= '0' && x <= '9')
      || (x >= 'A' && x <= 'F')
      || (x >= 'a' && x <= 'f')
}

function isOctDigit(x) {
  return x >= '0' && x <= '7'
}

function isDecDigit(x) {
  return x >= '0' && x <= '9'
}

var unescapeMap = {
  '\'': '\'',
  '"' : '"',
  '\\': '\\',
  'b' : '\b',
  'f' : '\f',
  'n' : '\n',
  'r' : '\r',
  't' : '\t',
  'v' : '\v',
  '/' : '/',
}

function formatError(input, msg, position, lineno, column, json5) {
  var result = msg + ' at ' + (lineno + 1) + ':' + (column + 1)
    , tmppos = position - column - 1
    , srcline = ''
    , underline = ''

  var isLineTerminator = json5 ? Uni.isLineTerminator : Uni.isLineTerminatorJSON

  // output no more than 70 characters before the wrong ones
  if (tmppos < position - 70) {
    tmppos = position - 70
  }

  while (1) {
    var chr = input[++tmppos]

    if (isLineTerminator(chr) || tmppos === input.length) {
      if (position >= tmppos) {
        // ending line error, so show it after the last char
        underline += '^'
      }
      break
    }
    srcline += chr

    if (position === tmppos) {
      underline += '^'
    } else if (position > tmppos) {
      underline += input[tmppos] === '\t' ? '\t' : ' '
    }

    // output no more than 78 characters on the string
    if (srcline.length > 78) break
  }

  return result + '\n' + srcline + '\n' + underline
}

function parse(input, options) {
  // parse as a standard JSON mode
  var json5 = !(options.mode === 'json' || options.legacy)
  var isLineTerminator = json5 ? Uni.isLineTerminator : Uni.isLineTerminatorJSON
  var isWhiteSpace = json5 ? Uni.isWhiteSpace : Uni.isWhiteSpaceJSON

  var length = input.length
    , lineno = 0
    , linestart = 0
    , position = 0
    , stack = []

  var tokenStart = function() {}
  var tokenEnd = function(v) {return v}

  /* tokenize({
       raw: '...',
       type: 'whitespace'|'comment'|'key'|'literal'|'separator'|'newline',
       value: 'number'|'string'|'whatever',
       path: [...],
     })
  */
  if (options._tokenize) {
    ;(function() {
      var start = null
      tokenStart = function() {
        if (start !== null) throw Error('internal error, token overlap')
        start = position
      }

      tokenEnd = function(v, type) {
        if (start != position) {
          var hash = {
            raw: input.substr(start, position-start),
            type: type,
            stack: stack.slice(0),
          }
          if (v !== undefined) hash.value = v
          options._tokenize.call(null, hash)
        }
        start = null
        return v
      }
    })()
  }

  function fail(msg) {
    var column = position - linestart

    if (!msg) {
      if (position < length) {
        var token = '\'' +
          JSON
            .stringify(input[position])
            .replace(/^"|"$/g, '')
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"')
          + '\''

        if (!msg) msg = 'Unexpected token ' + token
      } else {
        if (!msg) msg = 'Unexpected end of input'
      }
    }

    var error = SyntaxError(formatError(input, msg, position, lineno, column, json5))
    error.row = lineno + 1
    error.column = column + 1
    throw error
  }

  function newline(chr) {
    // account for <cr><lf>
    if (chr === '\r' && input[position] === '\n') position++
    linestart = position
    lineno++
  }

  function parseGeneric() {
    var result

    while (position < length) {
      tokenStart()
      var chr = input[position++]

      if (chr === '"' || (chr === '\'' && json5)) {
        return tokenEnd(parseString(chr), 'literal')

      } else if (chr === '{') {
        tokenEnd(undefined, 'separator')
        return parseObject()

      } else if (chr === '[') {
        tokenEnd(undefined, 'separator')
        return parseArray()

      } else if (chr === '-'
             ||  chr === '.'
             ||  isDecDigit(chr)
                 //           + number       Infinity          NaN
             ||  (json5 && (chr === '+' || chr === 'I' || chr === 'N'))
      ) {
        return tokenEnd(parseNumber(), 'literal')

      } else if (chr === 'n') {
        parseKeyword('null')
        return tokenEnd(null, 'literal')

      } else if (chr === 't') {
        parseKeyword('true')
        return tokenEnd(true, 'literal')

      } else if (chr === 'f') {
        parseKeyword('false')
        return tokenEnd(false, 'literal')

      } else {
        position--
        return tokenEnd(undefined)
      }
    }
  }

  function parseKey() {
    var result

    while (position < length) {
      tokenStart()
      var chr = input[position++]

      if (chr === '"' || (chr === '\'' && json5)) {
        return tokenEnd(parseString(chr), 'key')

      } else if (chr === '{') {
        tokenEnd(undefined, 'separator')
        return parseObject()

      } else if (chr === '[') {
        tokenEnd(undefined, 'separator')
        return parseArray()

      } else if (chr === '.'
             ||  isDecDigit(chr)
      ) {
        return tokenEnd(parseNumber(true), 'key')

      } else if (json5
             &&  Uni.isIdentifierStart(chr) || (chr === '\\' && input[position] === 'u')) {
        // unicode char or a unicode sequence
        var rollback = position - 1
        var result = parseIdentifier()

        if (result === undefined) {
          position = rollback
          return tokenEnd(undefined)
        } else {
          return tokenEnd(result, 'key')
        }

      } else {
        position--
        return tokenEnd(undefined)
      }
    }
  }

  function skipWhiteSpace() {
    tokenStart()
    while (position < length) {
      var chr = input[position++]

      if (isLineTerminator(chr)) {
        position--
        tokenEnd(undefined, 'whitespace')
        tokenStart()
        position++
        newline(chr)
        tokenEnd(undefined, 'newline')
        tokenStart()

      } else if (isWhiteSpace(chr)) {
        // nothing

      } else if (chr === '/'
             && json5
             && (input[position] === '/' || input[position] === '*')
      ) {
        position--
        tokenEnd(undefined, 'whitespace')
        tokenStart()
        position++
        skipComment(input[position++] === '*')
        tokenEnd(undefined, 'comment')
        tokenStart()

      } else {
        position--
        break
      }
    }
    return tokenEnd(undefined, 'whitespace')
  }

  function skipComment(multi) {
    while (position < length) {
      var chr = input[position++]

      if (isLineTerminator(chr)) {
        // LineTerminator is an end of singleline comment
        if (!multi) {
          // let parent function deal with newline
          position--
          return
        }

        newline(chr)

      } else if (chr === '*' && multi) {
        // end of multiline comment
        if (input[position] === '/') {
          position++
          return
        }

      } else {
        // nothing
      }
    }

    if (multi) {
      fail('Unclosed multiline comment')
    }
  }

  function parseKeyword(keyword) {
    // keyword[0] is not checked because it should've checked earlier
    var _pos = position
    var len = keyword.length
    for (var i=1; i<len; i++) {
      if (position >= length || keyword[i] != input[position]) {
        position = _pos-1
        fail()
      }
      position++
    }
  }

  function parseObject() {
    var result = options.null_prototype ? Object.create(null) : {}
      , empty_object = {}
      , is_non_empty = false

    while (position < length) {
      skipWhiteSpace()
      var item1 = parseKey()
      skipWhiteSpace()
      tokenStart()
      var chr = input[position++]
      tokenEnd(undefined, 'separator')

      if (chr === '}' && item1 === undefined) {
        if (!json5 && is_non_empty) {
          position--
          fail('Trailing comma in object')
        }
        return result

      } else if (chr === ':' && item1 !== undefined) {
        skipWhiteSpace()
        stack.push(item1)
        var item2 = parseGeneric()
        stack.pop()

        if (item2 === undefined) fail('No value found for key ' + item1)
        if (typeof(item1) !== 'string') {
          if (!json5 || typeof(item1) !== 'number') {
            fail('Wrong key type: ' + item1)
          }
        }

        if ((item1 in empty_object || empty_object[item1] != null) && options.reserved_keys !== 'replace') {
          if (options.reserved_keys === 'throw') {
            fail('Reserved key: ' + item1)
          } else {
            // silently ignore it
          }
        } else {
          if (typeof(options.reviver) === 'function') {
            item2 = options.reviver.call(null, item1, item2)
          }

          if (item2 !== undefined) {
            is_non_empty = true
            Object.defineProperty(result, item1, {
              value: item2,
              enumerable: true,
              configurable: true,
              writable: true,
            })
          }
        }

        skipWhiteSpace()

        tokenStart()
        var chr = input[position++]
        tokenEnd(undefined, 'separator')

        if (chr === ',') {
          continue

        } else if (chr === '}') {
          return result

        } else {
          fail()
        }

      } else {
        position--
        fail()
      }
    }

    fail()
  }

  function parseArray() {
    var result = []

    while (position < length) {
      skipWhiteSpace()
      stack.push(result.length)
      var item = parseGeneric()
      stack.pop()
      skipWhiteSpace()
      tokenStart()
      var chr = input[position++]
      tokenEnd(undefined, 'separator')

      if (item !== undefined) {
        if (typeof(options.reviver) === 'function') {
          item = options.reviver.call(null, String(result.length), item)
        }
        if (item === undefined) {
          result.length++
          item = true // hack for check below, not included into result
        } else {
          result.push(item)
        }
      }

      if (chr === ',') {
        if (item === undefined) {
          fail('Elisions are not supported')
        }

      } else if (chr === ']') {
        if (!json5 && item === undefined && result.length) {
          position--
          fail('Trailing comma in array')
        }
        return result

      } else {
        position--
        fail()
      }
    }
  }

  function parseNumber() {
    // rewind because we don't know first char
    position--

    var start = position
      , chr = input[position++]
      , t

    var to_num = function(is_octal) {
      var str = input.substr(start, position - start)

      if (is_octal) {
        var result = parseInt(str.replace(/^0o?/, ''), 8)
      } else {
        var result = Number(str)
      }

      if (Number.isNaN(result)) {
        position--
        fail('Bad numeric literal - "' + input.substr(start, position - start + 1) + '"')
      } else if (!json5 && !str.match(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?(e[+-]?[0-9]+)?$/i)) {
        // additional restrictions imposed by json
        position--
        fail('Non-json numeric literal - "' + input.substr(start, position - start + 1) + '"')
      } else {
        return result
      }
    }

    // ex: -5982475.249875e+29384
    //     ^ skipping this
    if (chr === '-' || (chr === '+' && json5)) chr = input[position++]

    if (chr === 'N' && json5) {
      parseKeyword('NaN')
      return NaN
    }

    if (chr === 'I' && json5) {
      parseKeyword('Infinity')

      // returning +inf or -inf
      return to_num()
    }

    if (chr >= '1' && chr <= '9') {
      // ex: -5982475.249875e+29384
      //        ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    // special case for leading zero: 0.123456
    if (chr === '0') {
      chr = input[position++]

      //             new syntax, "0o777"           old syntax, "0777"
      var is_octal = chr === 'o' || chr === 'O' || isOctDigit(chr)
      var is_hex = chr === 'x' || chr === 'X'

      if (json5 && (is_octal || is_hex)) {
        while (position < length
           &&  (is_hex ? isHexDigit : isOctDigit)( input[position] )
        ) position++

        var sign = 1
        if (input[start] === '-') {
          sign = -1
          start++
        } else if (input[start] === '+') {
          start++
        }

        return sign * to_num(is_octal)
      }
    }

    if (chr === '.') {
      // ex: -5982475.249875e+29384
      //                ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    if (chr === 'e' || chr === 'E') {
      chr = input[position++]
      if (chr === '-' || chr === '+') position++
      // ex: -5982475.249875e+29384
      //                       ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    // we have char in the buffer, so count for it
    position--
    return to_num()
  }

  function parseIdentifier() {
    // rewind because we don't know first char
    position--

    var result = ''

    while (position < length) {
      var chr = input[position++]

      if (chr === '\\'
      &&  input[position] === 'u'
      &&  isHexDigit(input[position+1])
      &&  isHexDigit(input[position+2])
      &&  isHexDigit(input[position+3])
      &&  isHexDigit(input[position+4])
      ) {
        // UnicodeEscapeSequence
        chr = String.fromCharCode(parseInt(input.substr(position+1, 4), 16))
        position += 5
      }

      if (result.length) {
        // identifier started
        if (Uni.isIdentifierPart(chr)) {
          result += chr
        } else {
          position--
          return result
        }

      } else {
        if (Uni.isIdentifierStart(chr)) {
          result += chr
        } else {
          return undefined
        }
      }
    }

    fail()
  }

  function parseString(endChar) {
    // 7.8.4 of ES262 spec
    var result = ''

    while (position < length) {
      var chr = input[position++]

      if (chr === endChar) {
        return result

      } else if (chr === '\\') {
        if (position >= length) fail()
        chr = input[position++]

        if (unescapeMap[chr] && (json5 || (chr != 'v' && chr != "'"))) {
          result += unescapeMap[chr]

        } else if (json5 && isLineTerminator(chr)) {
          // line continuation
          newline(chr)

        } else if (chr === 'u' || (chr === 'x' && json5)) {
          // unicode/character escape sequence
          var off = chr === 'u' ? 4 : 2

          // validation for \uXXXX
          for (var i=0; i<off; i++) {
            if (position >= length) fail()
            if (!isHexDigit(input[position])) fail('Bad escape sequence')
            position++
          }

          result += String.fromCharCode(parseInt(input.substr(position-off, off), 16))
        } else if (json5 && isOctDigit(chr)) {
          if (chr < '4' && isOctDigit(input[position]) && isOctDigit(input[position+1])) {
            // three-digit octal
            var digits = 3
          } else if (isOctDigit(input[position])) {
            // two-digit octal
            var digits = 2
          } else {
            var digits = 1
          }
          position += digits - 1
          result += String.fromCharCode(parseInt(input.substr(position-digits, digits), 8))
          /*if (!isOctDigit(input[position])) {
            // \0 is allowed still
            result += '\0'
          } else {
            fail('Octal literals are not supported')
          }*/

        } else if (json5) {
          // \X -> x
          result += chr

        } else {
          position--
          fail()
        }

      } else if (isLineTerminator(chr)) {
        fail()

      } else {
        if (!json5 && chr.charCodeAt(0) < 32) {
          position--
          fail('Unexpected control character')
        }

        // SourceCharacter but not one of " or \ or LineTerminator
        result += chr
      }
    }

    fail()
  }

  skipWhiteSpace()
  var return_value = parseGeneric()
  if (return_value !== undefined || position < length) {
    skipWhiteSpace()

    if (position >= length) {
      if (typeof(options.reviver) === 'function') {
        return_value = options.reviver.call(null, '', return_value)
      }
      return return_value
    } else {
      fail()
    }

  } else {
    if (position) {
      fail('No data, only a whitespace')
    } else {
      fail('No data, empty input')
    }
  }
}

/*
 * parse(text, options)
 * or
 * parse(text, reviver)
 *
 * where:
 * text - string
 * options - object
 * reviver - function
 */
module.exports.parse = function parseJSON(input, options) {
  // support legacy functions
  if (typeof(options) === 'function') {
    options = {
      reviver: options
    }
  }

  if (input === undefined) {
    // parse(stringify(x)) should be equal x
    // with JSON functions it is not 'cause of undefined
    // so we're fixing it
    return undefined
  }

  // JSON.parse compat
  if (typeof(input) !== 'string') input = String(input)
  if (options == null) options = {}
  if (options.reserved_keys == null) options.reserved_keys = 'ignore'

  if (options.reserved_keys === 'throw' || options.reserved_keys === 'ignore') {
    if (options.null_prototype == null) {
      options.null_prototype = true
    }
  }

  try {
    return parse(input, options)
  } catch(err) {
    // jju is a recursive parser, so JSON.parse("{{{{{{{") could blow up the stack
    //
    // this catch is used to skip all those internal calls
    if (err instanceof SyntaxError && err.row != null && err.column != null) {
      var old_err = err
      err = SyntaxError(old_err.message)
      err.column = old_err.column
      err.row = old_err.row
    }
    throw err
  }
}

module.exports.tokenize = function tokenizeJSON(input, options) {
  if (options == null) options = {}

  options._tokenize = function(smth) {
    if (options._addstack) smth.stack.unshift.apply(smth.stack, options._addstack)
    tokens.push(smth)
  }

  var tokens = []
  tokens.data = module.exports.parse(input, options)
  return tokens
}



/***/ }),

/***/ 93244:
/***/ ((module) => {


// This is autogenerated with esprima tools, see:
// https://github.com/ariya/esprima/blob/master/esprima.js
//
// PS: oh God, I hate Unicode

// ECMAScript 5.1/Unicode v6.3.0 NonAsciiIdentifierStart:

var Uni = module.exports

module.exports.isWhiteSpace = function isWhiteSpace(x) {
  // section 7.2, table 2
  return x === '\u0020'
      || x === '\u00A0'
      || x === '\uFEFF' // <-- this is not a Unicode WS, only a JS one
      || (x >= '\u0009' && x <= '\u000D') // 9 A B C D

      // + whitespace characters from unicode, category Zs
      || x === '\u1680'
      || x === '\u180E'
      || (x >= '\u2000' && x <= '\u200A') // 0 1 2 3 4 5 6 7 8 9 A
      || x === '\u2028'
      || x === '\u2029'
      || x === '\u202F'
      || x === '\u205F'
      || x === '\u3000'
}

module.exports.isWhiteSpaceJSON = function isWhiteSpaceJSON(x) {
  return x === '\u0020'
      || x === '\u0009'
      || x === '\u000A'
      || x === '\u000D'
}

module.exports.isLineTerminator = function isLineTerminator(x) {
  // ok, here is the part when JSON is wrong
  // section 7.3, table 3
  return x === '\u000A'
      || x === '\u000D'
      || x === '\u2028'
      || x === '\u2029'
}

module.exports.isLineTerminatorJSON = function isLineTerminatorJSON(x) {
  return x === '\u000A'
      || x === '\u000D'
}

module.exports.isIdentifierStart = function isIdentifierStart(x) {
  return x === '$'
      || x === '_'
      || (x >= 'A' && x <= 'Z')
      || (x >= 'a' && x <= 'z')
      || (x >= '\u0080' && Uni.NonAsciiIdentifierStart.test(x))
}

module.exports.isIdentifierPart = function isIdentifierPart(x) {
  return x === '$'
      || x === '_'
      || (x >= 'A' && x <= 'Z')
      || (x >= 'a' && x <= 'z')
      || (x >= '0' && x <= '9') // <-- addition to Start
      || (x >= '\u0080' && Uni.NonAsciiIdentifierPart.test(x))
}

module.exports.NonAsciiIdentifierStart = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/

// ECMAScript 5.1/Unicode v6.3.0 NonAsciiIdentifierPart:

module.exports.NonAsciiIdentifierPart = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/


/***/ }),

/***/ 62520:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(70046);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.




var isWindows = process.platform === 'win32';
var util = __webpack_require__(89539);


// resolves . and .. elements in a path array with directory names there
// must be no slashes or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  var res = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];

    // ignore empty parts
    if (!p || p === '.')
      continue;

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}

// returns an array with empty elements removed from either end of the input
// array or the original array if no elements need to be removed
function trimArray(arr) {
  var lastIndex = arr.length - 1;
  var start = 0;
  for (; start <= lastIndex; start++) {
    if (arr[start])
      break;
  }

  var end = lastIndex;
  for (; end >= 0; end--) {
    if (arr[end])
      break;
  }

  if (start === 0 && end === lastIndex)
    return arr;
  if (start > end)
    return [];
  return arr.slice(start, end + 1);
}

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

function win32StatPath(path) {
  var result = splitDeviceRe.exec(path),
      device = result[1] || '',
      isUnc = !!device && device[1] !== ':';
  return {
    device: device,
    isUnc: isUnc,
    isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
    tail: result[3]
  };
}

function normalizeUNCRoot(device) {
  return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
}

// path.resolve([from ...], to)
win32.resolve = function() {
  var resolvedDevice = '',
      resolvedTail = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1; i--) {
    var path;
    if (i >= 0) {
      path = arguments[i];
    } else if (!resolvedDevice) {
      path = process.cwd();
    } else {
      // Windows has the concept of drive-specific current working
      // directories. If we've resolved a drive letter but not yet an
      // absolute path, get cwd for that drive. We're sure the device is not
      // an unc path at this points, because unc paths are always absolute.
      path = ({"NODE_ENV":"production"})['=' + resolvedDevice];
      // Verify that a drive-local cwd was found and that it actually points
      // to our drive. If not, default to the drive's root.
      if (!path || path.substr(0, 3).toLowerCase() !==
          resolvedDevice.toLowerCase() + '\\') {
        path = resolvedDevice + '\\';
      }
    }

    // Skip empty and invalid entries
    if (!util.isString(path)) {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    var result = win32StatPath(path),
        device = result.device,
        isUnc = result.isUnc,
        isAbsolute = result.isAbsolute,
        tail = result.tail;

    if (device &&
        resolvedDevice &&
        device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      // This path points to another device so it is not applicable
      continue;
    }

    if (!resolvedDevice) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = tail + '\\' + resolvedTail;
      resolvedAbsolute = isAbsolute;
    }

    if (resolvedDevice && resolvedAbsolute) {
      break;
    }
  }

  // Convert slashes to backslashes when `resolvedDevice` points to an UNC
  // root. Also squash multiple slashes into a single one where appropriate.
  if (isUnc) {
    resolvedDevice = normalizeUNCRoot(resolvedDevice);
  }

  // At this point the path should be resolved to a full absolute path,
  // but handle relative paths to be safe (might happen when process.cwd()
  // fails)

  // Normalize the tail path
  resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/),
                                !resolvedAbsolute).join('\\');

  return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
         '.';
};


win32.normalize = function(path) {
  var result = win32StatPath(path),
      device = result.device,
      isUnc = result.isUnc,
      isAbsolute = result.isAbsolute,
      tail = result.tail,
      trailingSlash = /[\\\/]$/.test(tail);

  // Normalize the tail path
  tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');

  if (!tail && !isAbsolute) {
    tail = '.';
  }
  if (tail && trailingSlash) {
    tail += '\\';
  }

  // Convert slashes to backslashes when `device` points to an UNC root.
  // Also squash multiple slashes into a single one where appropriate.
  if (isUnc) {
    device = normalizeUNCRoot(device);
  }

  return device + (isAbsolute ? '\\' : '') + tail;
};


win32.isAbsolute = function(path) {
  return win32StatPath(path).isAbsolute;
};

win32.join = function() {
  var paths = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!util.isString(arg)) {
      throw new TypeError('Arguments to path.join must be strings');
    }
    if (arg) {
      paths.push(arg);
    }
  }

  var joined = paths.join('\\');

  // Make sure that the joined path doesn't start with two slashes, because
  // normalize() will mistake it for an UNC path then.
  //
  // This step is skipped when it is very clear that the user actually
  // intended to point at an UNC path. This is assumed when the first
  // non-empty string arguments starts with exactly two slashes followed by
  // at least one more non-slash character.
  //
  // Note that for normalize() to treat a path as an UNC path it needs to
  // have at least 2 components, so we don't filter for that here.
  // This means that the user can use join to construct UNC paths from
  // a server name and a share name; for example:
  //   path.join('//server', 'share') -> '\\\\server\\share\')
  if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
    joined = joined.replace(/^[\\\/]{2,}/, '\\');
  }

  return win32.normalize(joined);
};


// path.relative(from, to)
// it will solve the relative path from 'from' to 'to', for instance:
// from = 'C:\\orandea\\test\\aaa'
// to = 'C:\\orandea\\impl\\bbb'
// The output of the function should be: '..\\..\\impl\\bbb'
win32.relative = function(from, to) {
  from = win32.resolve(from);
  to = win32.resolve(to);

  // windows is not case sensitive
  var lowerFrom = from.toLowerCase();
  var lowerTo = to.toLowerCase();

  var toParts = trimArray(to.split('\\'));

  var lowerFromParts = trimArray(lowerFrom.split('\\'));
  var lowerToParts = trimArray(lowerTo.split('\\'));

  var length = Math.min(lowerFromParts.length, lowerToParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (lowerFromParts[i] !== lowerToParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  if (samePartsLength == 0) {
    return to;
  }

  var outputParts = [];
  for (var i = samePartsLength; i < lowerFromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('\\');
};


win32._makeLong = function(path) {
  // Note: this will *probably* throw somewhere.
  if (!util.isString(path))
    return path;

  if (!path) {
    return '';
  }

  var resolvedPath = win32.resolve(path);

  if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
    // path is local filesystem path, which needs to be converted
    // to long UNC path.
    return '\\\\?\\' + resolvedPath;
  } else if (/^\\\\[^?.]/.test(resolvedPath)) {
    // path is network UNC path, which needs to be converted
    // to long UNC path.
    return '\\\\?\\UNC\\' + resolvedPath.substring(2);
  }

  return path;
};


win32.dirname = function(path) {
  var result = win32SplitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


win32.basename = function(path, ext) {
  var f = win32SplitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


win32.extname = function(path) {
  return win32SplitPath(path)[3];
};


win32.format = function(pathObject) {
  if (!util.isObject(pathObject)) {
    throw new TypeError(
        "Parameter 'pathObject' must be an object, not " + typeof pathObject
    );
  }

  var root = pathObject.root || '';

  if (!util.isString(root)) {
    throw new TypeError(
        "'pathObject.root' must be a string or undefined, not " +
        typeof pathObject.root
    );
  }

  var dir = pathObject.dir;
  var base = pathObject.base || '';
  if (!dir) {
    return base;
  }
  if (dir[dir.length - 1] === win32.sep) {
    return dir + base;
  }
  return dir + win32.sep + base;
};


win32.parse = function(pathString) {
  if (!util.isString(pathString)) {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


win32.sep = '\\';
win32.delimiter = ';';


// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


// path.resolve([from ...], to)
// posix version
posix.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (!util.isString(path)) {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path[0] === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/'),
                                !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
posix.normalize = function(path) {
  var isAbsolute = posix.isAbsolute(path),
      trailingSlash = path && path[path.length - 1] === '/';

  // Normalize the path
  path = normalizeArray(path.split('/'), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
posix.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
posix.join = function() {
  var path = '';
  for (var i = 0; i < arguments.length; i++) {
    var segment = arguments[i];
    if (!util.isString(segment)) {
      throw new TypeError('Arguments to path.join must be strings');
    }
    if (segment) {
      if (!path) {
        path += segment;
      } else {
        path += '/' + segment;
      }
    }
  }
  return posix.normalize(path);
};


// path.relative(from, to)
// posix version
posix.relative = function(from, to) {
  from = posix.resolve(from).substr(1);
  to = posix.resolve(to).substr(1);

  var fromParts = trimArray(from.split('/'));
  var toParts = trimArray(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};


posix._makeLong = function(path) {
  return path;
};


posix.dirname = function(path) {
  var result = posixSplitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


posix.basename = function(path, ext) {
  var f = posixSplitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


posix.extname = function(path) {
  return posixSplitPath(path)[3];
};


posix.format = function(pathObject) {
  if (!util.isObject(pathObject)) {
    throw new TypeError(
        "Parameter 'pathObject' must be an object, not " + typeof pathObject
    );
  }

  var root = pathObject.root || '';

  if (!util.isString(root)) {
    throw new TypeError(
        "'pathObject.root' must be a string or undefined, not " +
        typeof pathObject.root
    );
  }

  var dir = pathObject.dir ? pathObject.dir + posix.sep : '';
  var base = pathObject.base || '';
  return dir + base;
};


posix.parse = function(pathString) {
  if (!util.isString(pathString)) {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


posix.sep = '/';
posix.delimiter = ':';


if (isWindows)
  module.exports = win32;
else /* posix */
  module.exports = posix;

module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 70046:
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 57129:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;


/***/ }),

/***/ 47418:
/***/ ((module) => {

"use strict";


/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};


/***/ }),

/***/ 36625:
/***/ ((module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(70046);
exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    ({"NODE_ENV":"production"}) &&
    ({"NODE_ENV":"production"}).NODE_DEBUG &&
    /\bsemver\b/i.test(({"NODE_ENV":"production"}).NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var t = exports.tokens = {}
var R = 0

function tok (n) {
  t[n] = R++
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

tok('NUMERICIDENTIFIER')
src[t.NUMERICIDENTIFIER] = '0|[1-9]\\d*'
tok('NUMERICIDENTIFIERLOOSE')
src[t.NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

tok('NONNUMERICIDENTIFIER')
src[t.NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

tok('MAINVERSION')
src[t.MAINVERSION] = '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[t.NUMERICIDENTIFIER] + ')'

tok('MAINVERSIONLOOSE')
src[t.MAINVERSIONLOOSE] = '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[t.NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

tok('PRERELEASEIDENTIFIER')
src[t.PRERELEASEIDENTIFIER] = '(?:' + src[t.NUMERICIDENTIFIER] +
                            '|' + src[t.NONNUMERICIDENTIFIER] + ')'

tok('PRERELEASEIDENTIFIERLOOSE')
src[t.PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[t.NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[t.NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

tok('PRERELEASE')
src[t.PRERELEASE] = '(?:-(' + src[t.PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[t.PRERELEASEIDENTIFIER] + ')*))'

tok('PRERELEASELOOSE')
src[t.PRERELEASELOOSE] = '(?:-?(' + src[t.PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[t.PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

tok('BUILDIDENTIFIER')
src[t.BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

tok('BUILD')
src[t.BUILD] = '(?:\\+(' + src[t.BUILDIDENTIFIER] +
             '(?:\\.' + src[t.BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

tok('FULL')
tok('FULLPLAIN')
src[t.FULLPLAIN] = 'v?' + src[t.MAINVERSION] +
                  src[t.PRERELEASE] + '?' +
                  src[t.BUILD] + '?'

src[t.FULL] = '^' + src[t.FULLPLAIN] + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
tok('LOOSEPLAIN')
src[t.LOOSEPLAIN] = '[v=\\s]*' + src[t.MAINVERSIONLOOSE] +
                  src[t.PRERELEASELOOSE] + '?' +
                  src[t.BUILD] + '?'

tok('LOOSE')
src[t.LOOSE] = '^' + src[t.LOOSEPLAIN] + '$'

tok('GTLT')
src[t.GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
tok('XRANGEIDENTIFIERLOOSE')
src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
tok('XRANGEIDENTIFIER')
src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + '|x|X|\\*'

tok('XRANGEPLAIN')
src[t.XRANGEPLAIN] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[t.XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[t.PRERELEASE] + ')?' +
                   src[t.BUILD] + '?' +
                   ')?)?'

tok('XRANGEPLAINLOOSE')
src[t.XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[t.XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[t.PRERELEASELOOSE] + ')?' +
                        src[t.BUILD] + '?' +
                        ')?)?'

tok('XRANGE')
src[t.XRANGE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAIN] + '$'
tok('XRANGELOOSE')
src[t.XRANGELOOSE] = '^' + src[t.GTLT] + '\\s*' + src[t.XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
tok('COERCE')
src[t.COERCE] = '(^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'
tok('COERCERTL')
re[t.COERCERTL] = new RegExp(src[t.COERCE], 'g')

// Tilde ranges.
// Meaning is "reasonably at or greater than"
tok('LONETILDE')
src[t.LONETILDE] = '(?:~>?)'

tok('TILDETRIM')
src[t.TILDETRIM] = '(\\s*)' + src[t.LONETILDE] + '\\s+'
re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

tok('TILDE')
src[t.TILDE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAIN] + '$'
tok('TILDELOOSE')
src[t.TILDELOOSE] = '^' + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
tok('LONECARET')
src[t.LONECARET] = '(?:\\^)'

tok('CARETTRIM')
src[t.CARETTRIM] = '(\\s*)' + src[t.LONECARET] + '\\s+'
re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], 'g')
var caretTrimReplace = '$1^'

tok('CARET')
src[t.CARET] = '^' + src[t.LONECARET] + src[t.XRANGEPLAIN] + '$'
tok('CARETLOOSE')
src[t.CARETLOOSE] = '^' + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
tok('COMPARATORLOOSE')
src[t.COMPARATORLOOSE] = '^' + src[t.GTLT] + '\\s*(' + src[t.LOOSEPLAIN] + ')$|^$'
tok('COMPARATOR')
src[t.COMPARATOR] = '^' + src[t.GTLT] + '\\s*(' + src[t.FULLPLAIN] + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
tok('COMPARATORTRIM')
src[t.COMPARATORTRIM] = '(\\s*)' + src[t.GTLT] +
                      '\\s*(' + src[t.LOOSEPLAIN] + '|' + src[t.XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
tok('HYPHENRANGE')
src[t.HYPHENRANGE] = '^\\s*(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[t.XRANGEPLAIN] + ')' +
                   '\\s*$'

tok('HYPHENRANGELOOSE')
src[t.HYPHENRANGELOOSE] = '^\\s*(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[t.XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
tok('STAR')
src[t.STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[t.LOOSE] : re[t.FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

SemVer.prototype.compareBuild = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  var i = 0
  do {
    var a = this.build[i]
    var b = other.build[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.compareBuild = compareBuild
function compareBuild (a, b, loose) {
  var versionA = new SemVer(a, loose)
  var versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compareBuild(b, a, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1] !== undefined ? m[1] : ''
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY || version === ANY) {
    return true
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    if (this.value === '') {
      return true
    }
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    if (comp.value === '') {
      return true
    }
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[t.COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[t.CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return (
      isSatisfiable(thisComparators, options) &&
      range.set.some(function (rangeComparators) {
        return (
          isSatisfiable(rangeComparators, options) &&
          thisComparators.every(function (thisComparator) {
            return rangeComparators.every(function (rangeComparator) {
              return thisComparator.intersects(rangeComparator, options)
            })
          })
        )
      })
    )
  })
}

// take a set of comparators and determine whether there
// exists a version which can satisfy it
function isSatisfiable (comparators, options) {
  var result = true
  var remainingComparators = comparators.slice()
  var testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every(function (otherComparator) {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p + pr
    } else if (xm) {
      ret = '>=' + M + '.0.0' + pr + ' <' + (+M + 1) + '.0.0' + pr
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0' + pr +
        ' <' + M + '.' + (+m + 1) + '.0' + pr
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[t.STAR], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    try {
      version = new SemVer(version, this.options)
    } catch (er) {
      return false
    }
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version, options) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  var match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    var next
    while ((next = re[t.COERCERTL].exec(version)) &&
      (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
          next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(match[2] +
    '.' + (match[3] || '0') +
    '.' + (match[4] || '0'), options)
}


/***/ }),

/***/ 43745:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.base64 = void 0;
var base64;
(function (base64) {
    // prettier-ignore
    const encodingTable = new Uint8Array([
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47
    ]);
    // prettier-ignore
    const decodingTable = new Uint8Array([
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    ]);
    const paddingChar = 61;
    function calculateEncodedLength(length) {
        let result = Math.trunc(length / 3) * 4;
        result += length % 3 != 0 ? 4 : 0;
        return result;
    }
    function readWord(input, i, maxLength) {
        if (maxLength > 4) {
            throw new Error("maxLength should be in range [0, 4].");
        }
        const t = new Uint8Array(4);
        for (let k = 0; k < maxLength; ++k) {
            const c = input.charCodeAt(i + k);
            const b = decodingTable[c];
            if (b === 0xff) {
                return undefined;
            }
            t[k] = b;
        }
        return ((t[0] << (3 * 6)) +
            (t[1] << (2 * 6)) +
            (t[2] << (1 * 6)) +
            (t[3] << (0 * 6)));
    }
    function writeWord(output, i, triple) {
        output[i + 0] = (triple >> 16) & 0xff;
        output[i + 1] = (triple >> 8) & 0xff;
        output[i + 2] = triple & 0xff;
    }
    function encode(input) {
        const inLen = input.length;
        const outLen = calculateEncodedLength(inLen);
        const lengthMod3 = inLen % 3;
        const calcLength = inLen - lengthMod3;
        const output = new Uint8Array(outLen);
        let i;
        let j = 0;
        for (i = 0; i < calcLength; i += 3) {
            output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
            output[j + 1] =
                encodingTable[((input[i] & 0x03) << 4) | ((input[i + 1] & 0xf0) >> 4)];
            output[j + 2] =
                encodingTable[((input[i + 1] & 0x0f) << 2) | ((input[i + 2] & 0xc0) >> 6)];
            output[j + 3] = encodingTable[input[i + 2] & 0x3f];
            j += 4;
        }
        i = calcLength;
        switch (lengthMod3) {
            case 2: // One character padding needed
                output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
                output[j + 1] =
                    encodingTable[((input[i] & 0x03) << 4) | ((input[i + 1] & 0xf0) >> 4)];
                output[j + 2] = encodingTable[(input[i + 1] & 0x0f) << 2];
                output[j + 3] = paddingChar;
                j += 4;
                break;
            case 1: // Two character padding needed
                output[j + 0] = encodingTable[(input[i] & 0xfc) >> 2];
                output[j + 1] = encodingTable[(input[i] & 0x03) << 4];
                output[j + 2] = paddingChar;
                output[j + 3] = paddingChar;
                j += 4;
                break;
        }
        const decoder = new TextDecoder("ascii");
        return decoder.decode(output);
    }
    base64.encode = encode;
    function decode(input) {
        const inLen = input.length;
        if (inLen % 4 != 0) {
            return undefined;
        }
        let padding = 0;
        if (inLen > 0 && input.charCodeAt(inLen - 1) == paddingChar) {
            ++padding;
            if (inLen > 1 && input.charCodeAt(inLen - 2) == paddingChar) {
                ++padding;
            }
        }
        const encodedLen = inLen - padding;
        const completeLen = encodedLen & ~3;
        const outLen = (6 * inLen) / 8 - padding;
        const output = new Uint8Array(outLen);
        let triple;
        let i = 0;
        let j = 0;
        while (i < completeLen) {
            triple = readWord(input, i, 4);
            if (typeof triple === "undefined") {
                return undefined;
            }
            writeWord(output, j, triple);
            i += 4;
            j += 3;
        }
        if (padding > 0) {
            triple = readWord(input, i, 4 - padding);
            if (typeof triple === "undefined") {
                return undefined;
            }
            switch (padding) {
                case 1:
                    output[j + 0] = (triple >> 16) & 0xff;
                    output[j + 1] = (triple >> 8) & 0xff;
                    break;
                case 2:
                    output[j + 0] = (triple >> 16) & 0xff;
                    break;
            }
        }
        return output;
    }
    base64.decode = decode;
})(base64 = exports.base64 || (exports.base64 = {}));


/***/ }),

/***/ 41191:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function setStyle($dom, obj) {
    Object.keys(obj).forEach((key) => {
        $dom.style[key] = obj[key];
    });
}
function createTextarea() {
    // [legacy code] Used to use textarea for copy/paste
    //
    // const $input = document.createElement('textarea')
    // // Note: Firefox requires 'contenteditable' attribute, even on textarea element
    // // without it, execCommand('paste') won't work in Firefox
    // // reference: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard#Browser-specific_considerations_2
    // $input.setAttribute('contenteditable', true)
    // $input.id = 'clipboard_textarea'
    // Note: 2018-09-01, Firefox 61.0.2: Only able to paste clipboard into textarea for one time.
    // Switching to contenteditable div works fine
    const $input = document.createElement('div');
    $input.setAttribute('contenteditable', 'true');
    $input.id = 'clipboard_textarea';
    setStyle($input, {
        position: 'aboslute',
        top: '-9999px',
        left: '-9999px'
    });
    (document.body || document.documentElement).appendChild($input);
    return $input;
}
function getTextArea() {
    const $el = document.getElementById('clipboard_textarea');
    if ($el)
        return $el;
    return createTextarea();
}
function withInput(fn) {
    const $input = getTextArea();
    let ret;
    try {
        ret = fn($input);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        $input.innerHTML = '';
    }
    return ret;
}
const api = {
    set: (text) => {
        withInput($input => {
            $input.innerText = text;
            $input.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('copy');
        });
    },
    get: () => {
        return withInput($input => {
            $input.blur();
            $input.focus();
            const res = document.execCommand('paste');
            if (res) {
                return $input.innerText;
            }
            return 'no luck';
        });
    }
};
exports["default"] = api;


/***/ }),

/***/ 69396:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseImageTarget = exports.indentCreatedByCommand = exports.isCommandAvailableForDesktop = exports.canCommandSelect = exports.canCommandFind = exports.doesCommandSupportTargetOptions = exports.canCommandRunMacro = exports.canCommandReadCsv = exports.canCommandReadImage = exports.isExtensionResourceOnlyCommand = exports.isValidCmd = exports.commandText = exports.normalizeCommandName = exports.availableCommandsForDesktop = exports.availableCommands = exports.commandScopes = exports.CommandScope = void 0;
var CommandScope;
(function (CommandScope) {
    CommandScope[CommandScope["All"] = 1] = "All";
    CommandScope[CommandScope["WebOnly"] = 2] = "WebOnly";
    CommandScope[CommandScope["DesktopOnly"] = 3] = "DesktopOnly";
})(CommandScope = exports.CommandScope || (exports.CommandScope = {}));
exports.commandScopes = {
    'open': CommandScope.WebOnly,
    'openBrowser': CommandScope.WebOnly,
    'click': CommandScope.WebOnly,
    'clickAndWait': CommandScope.WebOnly,
    'saveItem': CommandScope.WebOnly,
    'select': CommandScope.WebOnly,
    'selectAndWait': CommandScope.WebOnly,
    'addSelection': CommandScope.WebOnly,
    'removeSelection': CommandScope.WebOnly,
    'type': CommandScope.WebOnly,
    'pause': CommandScope.All,
    'waitForPageToLoad': CommandScope.WebOnly,
    'selectFrame': CommandScope.WebOnly,
    'assertAlert': CommandScope.WebOnly,
    'assertConfirmation': CommandScope.WebOnly,
    'assertPrompt': CommandScope.WebOnly,
    'answerOnNextPrompt': CommandScope.WebOnly,
    'store': CommandScope.All,
    'storeText': CommandScope.WebOnly,
    'storeTitle': CommandScope.WebOnly,
    'storeAttribute': CommandScope.WebOnly,
    'storeXpathCount': CommandScope.WebOnly,
    'assertText': CommandScope.WebOnly,
    'assertTitle': CommandScope.WebOnly,
    'clickAt': CommandScope.WebOnly,
    'echo': CommandScope.All,
    'mouseOver': CommandScope.WebOnly,
    // 'storeEval',
    'verifyText': CommandScope.WebOnly,
    'verifyTitle': CommandScope.WebOnly,
    'sendKeys': CommandScope.WebOnly,
    'dragAndDropToObject': CommandScope.WebOnly,
    'selectWindow': CommandScope.WebOnly,
    'captureScreenshot': CommandScope.WebOnly,
    'captureDesktopScreenshot': CommandScope.DesktopOnly,
    'refresh': CommandScope.WebOnly,
    'assert': CommandScope.All,
    'assertElementPresent': CommandScope.WebOnly,
    'assertElementNotPresent': CommandScope.WebOnly,
    'assertEditable': CommandScope.WebOnly,
    'assertNotEditable': CommandScope.WebOnly,
    'verify': CommandScope.All,
    'verifyElementPresent': CommandScope.WebOnly,
    'verifyElementNotPresent': CommandScope.WebOnly,
    'verifyEditable': CommandScope.WebOnly,
    'verifyNotEditable': CommandScope.WebOnly,
    'deleteAllCookies': CommandScope.WebOnly,
    'label': CommandScope.All,
    'gotoLabel': CommandScope.All,
    //'gotoIf',
    'csvRead': CommandScope.All,
    'csvReadArray': CommandScope.All,
    'csvSave': CommandScope.All,
    'csvSaveArray': CommandScope.All,
    'storeValue': CommandScope.WebOnly,
    'assertValue': CommandScope.WebOnly,
    'verifyValue': CommandScope.WebOnly,
    'storeChecked': CommandScope.WebOnly,
    'captureEntirePageScreenshot': CommandScope.WebOnly,
    'onDownload': CommandScope.WebOnly,
    // 'assertError',
    // 'verifyError',
    'throwError': CommandScope.All,
    'comment': CommandScope.All,
    // 'waitForVisible',
    'waitForElementVisible': CommandScope.WebOnly,
    'waitForElementNotVisible': CommandScope.WebOnly,
    'waitForElementPresent': CommandScope.WebOnly,
    'waitForElementNotPresent': CommandScope.WebOnly,
    'onError': CommandScope.All,
    'sourceSearch': CommandScope.WebOnly,
    'sourceExtract': CommandScope.WebOnly,
    'storeImage': CommandScope.WebOnly,
    'localStorageExport': CommandScope.All,
    // 'visionFind',
    'visionLimitSearchArea': CommandScope.All,
    'visionLimitSearchAreaRelative': CommandScope.All,
    'visualSearch': CommandScope.All,
    'visualVerify': CommandScope.All,
    'visualAssert': CommandScope.All,
    'visualGetPixelColor': CommandScope.All,
    'editContent': CommandScope.WebOnly,
    'bringBrowserToForeground': CommandScope.All,
    'bringIDEandBrowserToBackground': CommandScope.All,
    //'resize',
    'setWindowSize': CommandScope.All,
    'prompt': CommandScope.WebOnly,
    'XRun': CommandScope.All,
    'XRunAndWait': CommandScope.All,
    'XClick': CommandScope.All,
    'XClickRelative': CommandScope.All,
    'XClickTextRelative': CommandScope.All,
    'XClickText': CommandScope.All,
    'XMoveText': CommandScope.All,
    'XMoveTextRelative': CommandScope.All,
    'XType': CommandScope.All,
    'XMove': CommandScope.All,
    'XMoveRelative': CommandScope.All,
    'XMouseWheel': CommandScope.All,
    'XDesktopAutomation': CommandScope.All,
    'OCRSearch': CommandScope.All,
    'OCRExtract': CommandScope.All,
    'OCRExtractRelative': CommandScope.All,
    'OCRExtractbyTextRelative': CommandScope.All,
    'setProxy': CommandScope.All,
    'run': CommandScope.All,
    'executeScript': CommandScope.All,
    'executeScript_Sandbox': CommandScope.All,
    //  'executeAsyncScript',
    //  'executeAsyncScript_Sandbox',
    'check': CommandScope.WebOnly,
    'uncheck': CommandScope.WebOnly,
    'assertChecked': CommandScope.WebOnly,
    'assertNotChecked': CommandScope.WebOnly,
    'verifyChecked': CommandScope.WebOnly,
    'verifyNotChecked': CommandScope.WebOnly,
    //'while',
    // 'endWhile',
    'do': CommandScope.All,
    'repeatIf': CommandScope.All,
    //'if',
    'else': CommandScope.All,
    'elseif': CommandScope.All,
    // 'endif',
    'end': CommandScope.All,
    'if': CommandScope.All,
    'while': CommandScope.All,
    'gotoIf': CommandScope.All,
    'times': CommandScope.All,
    'forEach': CommandScope.All,
    'break': CommandScope.All,
    'continue': CommandScope.All
};
exports.availableCommands = (() => {
    const list = Object.keys(exports.commandScopes);
    list.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    return list;
})();
exports.availableCommandsForDesktop = exports.availableCommands.filter(isCommandAvailableForDesktop);
function normalizeCommandName(str) {
    if (!str) {
        return '';
    }
    const lower = str.toLowerCase();
    const lowerCommands = exports.availableCommands.map(str => str.toLowerCase());
    const index = lowerCommands.findIndex(cmd => cmd === lower);
    return index === -1 ? str : exports.availableCommands[index];
}
exports.normalizeCommandName = normalizeCommandName;
function commandText(cmd) {
    switch (cmd) {
        case 'ifxxx': //war _v1
        case 'whilexxx':
        case 'gotoIfxxx':
            return cmd + '_v1_deprecated';
        case 'storeEval':
        case 'endif':
        case 'endwhile':
        case 'resize':
            return cmd + '_deprecated';
        default:
            return cmd;
    }
}
exports.commandText = commandText;
function isValidCmd(str) {
    return exports.availableCommands.indexOf(str) !== -1;
}
exports.isValidCmd = isValidCmd;
function isExtensionResourceOnlyCommand(str) {
    switch (str) {
        case 'if':
        case 'while':
        case 'gotoIf':
        case 'if_v2':
        case 'while_v2':
        case 'gotoIf_v2':
        case 'executeScript_Sandbox':
        case 'run':
        case 'store':
        case 'echo':
        case 'prompt':
        case 'throwError':
        case 'pause':
        case 'localStorageExport':
            return true;
        default:
            return false;
    }
}
exports.isExtensionResourceOnlyCommand = isExtensionResourceOnlyCommand;
function canCommandReadImage(str) {
    switch (str) {
        case 'visualSearch':
        case 'visualVerify':
        case 'visualAssert':
        case 'XClick':
        case 'XClickText':
        case 'XClickTextRelative':
        case 'XClickRelative':
        case 'XMove':
        case 'XMoveText':
        case 'XMoveTextRelative':
        case 'XMoveRelative':
        case 'OCRExtract':
        case 'OCRExtractRelative':
            return true;
        default:
            return false;
    }
}
exports.canCommandReadImage = canCommandReadImage;
function canCommandReadCsv(str) {
    switch (str) {
        case 'csvRead':
        case 'csvReadArray':
            return true;
        default:
            return false;
    }
}
exports.canCommandReadCsv = canCommandReadCsv;
function canCommandRunMacro(str) {
    switch (str) {
        case 'run':
            return true;
        default:
            return false;
    }
}
exports.canCommandRunMacro = canCommandRunMacro;
function doesCommandSupportTargetOptions(str) {
    switch (str) {
        case 'click':
        case 'saveItem':
        case 'clickAndWait':
        case 'select':
        case 'selectAndWait':
        case 'type':
        case 'mouseOver':
        case 'verifyText':
        case 'sendKeys':
        case 'dragAndDropToObject':
        case 'assertElementPresent':
        case 'assertEditable':
        case 'assertNotEditable':
        case 'verifyElementPresent':
        case 'verifyEditable':
        case 'verifyNotEditable':
        case 'storeValue':
        case 'assertValue':
        case 'verifyValue':
        case 'storeChecked':
        case 'waitForElementVisible':
        case 'waitForElementPresent':
        case 'XClick':
        case 'XClickRelative':
        case 'XClickTextRelative':
        case 'XClickText':
        case 'XMoveText':
        case 'XMoveTextRelative':
        case 'XMove':
        case 'XMoveRelative':
        case 'check':
        case 'uncheck':
        case 'assertChecked':
        case 'assertNotChecked':
        case 'verifyChecked':
        case 'verifyNotChecked':
            return true;
        default:
            return false;
    }
}
exports.doesCommandSupportTargetOptions = doesCommandSupportTargetOptions;
function canCommandFind(str) {
    switch (str) {
        case 'echo':
        case 'open':
        case 'openBrowser':
        case 'pause':
        case 'waitForPageToLoad':
        case 'assertAlert':
        case 'assertConfirmation':
        case 'assertPrompt':
        case 'answerOnNextPrompt':
        case 'store':
        case 'storeTitle':
        case 'assertTitle':
        case 'verifyTitle':
        case 'selectWindow':
        case 'captureScreenshot':
        case 'captureDesktopScreenshot':
        case 'refresh':
        case 'deleteAllCookies':
        case 'label':
        case 'gotoLabel':
        case 'csvRead':
        case 'csvReadArray':
        case 'csvSave':
        case 'csvSaveArray':
        case 'captureEntirePageScreenshot':
        case 'onDownload':
        case 'throwError':
        case 'comment':
        case 'onError':
        case 'sourceSearch':
        case 'sourceExtract':
        case 'localStorageExport':
        case 'visionLimitSearchArea':
        case 'visionLimitSearchAreaRelative':
        case 'visualGetPixelColor':
        case 'bringBrowserToForeground':
        case 'bringIDEandBrowserToBackground':
        case 'setWindowSize':
        case 'prompt':
        case 'XRun':
        case 'XRunAndWait':
        case 'XDesktopAutomation':
        case 'setProxy':
        case 'run':
        case 'executeScript':
        case 'executeScript_Sandbox':
        case 'do':
        case 'repeatIf':
        case 'else':
        case 'elseif':
        case 'end':
        case 'if_v2':
        case 'while_v2':
        case 'gotoIf_v2':
        case 'times':
        case 'forEach':
            return false;
        default:
            return true;
    }
}
exports.canCommandFind = canCommandFind;
function canCommandSelect(str) {
    const canFind = canCommandFind(str);
    if (canFind) {
        return canFind;
    }
    switch (str) {
        case 'visualGetPixelColor':
            return true;
        default:
            return false;
    }
}
exports.canCommandSelect = canCommandSelect;
function isCommandAvailableForDesktop(command) {
    const scope = exports.commandScopes[command];
    if (!scope) {
        return false;
    }
    return scope === CommandScope.All || scope === CommandScope.DesktopOnly;
}
exports.isCommandAvailableForDesktop = isCommandAvailableForDesktop;
function indentCreatedByCommand(str) {
    switch (str) {
        case 'if':
        case 'if_v2':
        case 'while':
        case 'while_v2':
        case 'do':
        case 'times':
        case 'forEach':
            return {
                selfIndent: 0,
                nextIndent: 1
            };
        case 'else':
        case 'elseif':
            return {
                selfIndent: -1,
                nextIndent: 1
            };
        case 'end':
        case 'endif':
        case 'endwhile':
        case 'repeatIf':
            return {
                selfIndent: -1,
                nextIndent: 0
            };
        default:
            return {
                selfIndent: 0,
                nextIndent: 0
            };
    }
}
exports.indentCreatedByCommand = indentCreatedByCommand;
function parseImageTarget(target) {
    if (!target || !target.length) {
        return null;
    }
    const reg = /^([^@#]+?\.png)(?:@([\d.]+))?(?:#(\d+))?(?:\[([^\]]+)\])?$/;
    const m = target.match(reg);
    if (!m) {
        return null;
    }
    // throw new Error(`Target should be like 'abc.png@0.8#1'`)
    const fileName = m[1];
    const confidence = m[2] ? parseFloat(m[2]) : undefined;
    const index = m[3] ? (parseInt(m[3]) - 1) : undefined;
    const imageUrl = m[4];
    return { fileName, confidence, index, imageUrl };
}
exports.parseImageTarget = parseImageTarget;


/***/ }),

/***/ 18463:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.withConsecutive = exports.consecutive = void 0;
function consecutive(c) {
    if (typeof c === 'boolean') {
        return {
            interval: 0,
            count: c ? 1 : 0
        };
    }
    return c;
}
exports.consecutive = consecutive;
const timeout = (duration) => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};
function withConsecutive(c, fn) {
    const { interval, count } = consecutive(c);
    let counter = count;
    const next = (pass) => {
        if (!pass)
            throw new Error('failed to run consecutive');
        if (counter-- <= 0)
            return Promise.resolve(true);
        return timeout(interval).then(fn).then(next);
    };
    return fn()
        .then(next);
}
exports.withConsecutive = withConsecutive;


/***/ }),

/***/ 43232:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.STATE_STORAGE_KEY = exports.CS_IPC_TIMEOUT = exports.SCREENSHOT_DELAY = exports.UNTITLED_ID = exports.LAST_DESKTOP_SCREENSHOT_FILE_NAME = exports.LAST_SCREENSHOT_FILE_NAME = exports.TEST_CASE_STATUS = exports.CONTENT_SCRIPT_STATUS = exports.PLAYER_MODE = exports.PLAYER_STATUS = exports.RECORDER_STATUS = exports.INSPECTOR_STATUS = exports.APP_STATUS = void 0;
const mk = (list) => list.reduce((prev, key) => {
    prev[key] = key;
    return prev;
}, {});
exports.APP_STATUS = mk([
    'NORMAL',
    'INSPECTOR',
    'RECORDER',
    'PLAYER'
]);
exports.INSPECTOR_STATUS = mk([
    'PENDING',
    'INSPECTING',
    'STOPPED'
]);
exports.RECORDER_STATUS = mk([
    'PENDING',
    'RECORDING',
    'STOPPED'
]);
exports.PLAYER_STATUS = mk([
    'PLAYING',
    'PAUSED',
    'STOPPED'
]);
exports.PLAYER_MODE = mk([
    'TEST_CASE',
    'TEST_SUITE'
]);
exports.CONTENT_SCRIPT_STATUS = mk([
    'NORMAL',
    'RECORDING',
    'INSPECTING',
    'PLAYING'
]);
exports.TEST_CASE_STATUS = mk([
    'NORMAL',
    'SUCCESS',
    'ERROR',
    'ERROR_IN_SUB'
]);
exports.LAST_SCREENSHOT_FILE_NAME = '__lastscreenshot';
exports.LAST_DESKTOP_SCREENSHOT_FILE_NAME = '__last_desktop_screenshot';
exports.UNTITLED_ID = '__untitled__';
// Note: in Ubuntu, you have to take some delay after activating some tab, otherwise there are chances
// Chrome still think the panel is the window you want to take screenshot, and weird enough in Ubuntu,
// You can't take screenshot of tabs with 'chrome-extension://' schema, even if it's your own extension
exports.SCREENSHOT_DELAY = /Linux/i.test(self.navigator.userAgent) ? 200 : 0;
exports.CS_IPC_TIMEOUT = 3000;
exports.STATE_STORAGE_KEY = 'background_state';


/***/ }),

/***/ 24874:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.elementByElementFromPoint = exports.viewportCoordinateByElementFromPoint = exports.isElementFromPoint = exports.getElementByLocator = exports.isLocator = exports.assertLocator = exports.getElementByXPath = exports.getElementsByXPath = exports.getAncestor = exports.hasAncestor = exports.isEditable = exports.scaleRect = exports.getPixel = exports.rgbToHex = exports.subImage = exports.imageDataFromUrl = exports.imageBlobFromSVG = exports.canvasFromSVG = exports.svgToBase64 = exports.svgNodetoString = exports.isFirefox = exports.preloadImage = exports.accurateOffset = exports.offset = exports.isPositionFixed = exports.cssSelector = exports.isVisible = exports.domText = exports.scrollTop = exports.scrollLeft = exports.bindContentEditableChange = exports.bindDrag = exports.pixel = exports.setStyle = exports.getStyle = void 0;
const glob_1 = __webpack_require__(64341);
const utils_1 = __webpack_require__(63370);
exports.getStyle = function (dom) {
    if (!dom)
        throw new Error('getStyle: dom does not exist');
    return getComputedStyle(dom);
};
exports.setStyle = function (dom, style) {
    if (!dom)
        throw new Error('setStyle: dom does not exist');
    for (var i = 0, keys = Object.keys(style), len = keys.length; i < len; i++) {
        dom.style[keys[i]] = style[keys[i]];
    }
    return dom;
};
exports.pixel = function (num) {
    if ((num + '').indexOf('px') !== -1)
        return num;
    return (num || 0) + 'px';
};
exports.bindDrag = (options) => {
    const { onDragStart, onDragEnd, onDrag, $el, preventGlobalClick = true, doc = document } = options;
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    const onMouseDown = (e) => {
        isDragging = true;
        startPos = { x: e.screenX, y: e.screenY };
        onDragStart(e);
    };
    const onMouseUp = (e) => {
        if (!isDragging)
            return;
        isDragging = false;
        const dx = e.screenX - startPos.x;
        const dy = e.screenY - startPos.y;
        onDragEnd(e, { dx, dy });
    };
    const onMouseMove = (e) => {
        if (!isDragging)
            return;
        const dx = e.screenX - startPos.x;
        const dy = e.screenY - startPos.y;
        onDrag(e, { dx, dy });
        e.preventDefault();
        e.stopPropagation();
    };
    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    if (preventGlobalClick) {
        doc.addEventListener('click', onClick, true);
    }
    doc.addEventListener('mousemove', onMouseMove, true);
    doc.addEventListener('mouseup', onMouseUp, true);
    $el.addEventListener('mousedown', onMouseDown, true);
    return () => {
        doc.removeEventListener('click', onClick, true);
        doc.removeEventListener('mousemove', onMouseMove, true);
        doc.removeEventListener('mouseup', onMouseUp, true);
        $el.removeEventListener('mousedown', onMouseDown, true);
    };
};
exports.bindContentEditableChange = (options) => {
    const { onChange, doc = document } = options;
    let currentCE = null;
    let oldContent = null;
    const onFocus = (e) => {
        if (!e.target || e.target.contentEditable !== 'true')
            return;
        currentCE = e.target;
        oldContent = currentCE.innerHTML;
    };
    const onBlur = (e) => {
        if (e.target !== currentCE) {
            // Do nothing
        }
        else if (currentCE && currentCE.innerHTML !== oldContent) {
            onChange(e);
        }
        currentCE = null;
        oldContent = null;
    };
    doc.addEventListener('focus', onFocus, true);
    doc.addEventListener('blur', onBlur, true);
    return () => {
        doc.removeEventListener('focus', onFocus, true);
        doc.removeEventListener('blur', onBlur, true);
    };
};
exports.scrollLeft = function (document) {
    return document.documentElement.scrollLeft;
};
exports.scrollTop = function (document) {
    return document.documentElement.scrollTop;
};
exports.domText = ($dom) => {
    const it = $dom.innerText ? $dom.innerText.trim() : '';
    const tc = $dom.textContent;
    const pos = tc.toUpperCase().indexOf(it.toUpperCase());
    return pos === -1 ? it : tc.substr(pos, it.length);
};
exports.isVisible = function (el) {
    if (el === window.document)
        return true;
    if (!el)
        return true;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.opacity === '0' || style.visibility === 'hidden')
        return false;
    return exports.isVisible(el.parentNode);
};
exports.cssSelector = function (dom) {
    if (!dom)
        return '';
    if (dom.nodeType !== 1)
        return '';
    if (dom.tagName === 'BODY')
        return 'body';
    if (dom.id)
        return '#' + dom.id;
    var classes = dom.className.split(/\s+/g)
        .filter(function (item) {
        return item && item.length;
    });
    var children = Array.from(dom.parentNode ? dom.parentNode.childNodes : [])
        .filter(function ($el) {
        return $el.nodeType === 1;
    });
    var sameTag = children.filter(function ($el) {
        return $el.tagName === dom.tagName;
    });
    var sameClass = children.filter(function ($el) {
        var cs = $el.className.split(/\s+/g);
        return utils_1.and(...classes.map(function (c) {
            return cs.indexOf(c) !== -1;
        }));
    });
    var extra = '';
    if (sameTag.length === 1) {
        extra = '';
    }
    else if (classes.length && sameClass.length === 1) {
        extra = '.' + classes.join('.');
    }
    else {
        extra = ':nth-child(' + (1 + children.findIndex(function (item) { return item === dom; })) + ')';
    }
    var me = dom.tagName.toLowerCase() + extra;
    // Note: browser will add an extra 'tbody' when tr directly in table, which will cause an wrong selector,
    // so the hack is to remove all tbody here
    var ret = exports.cssSelector(dom.parentNode) + ' > ' + me;
    return ret;
    // return ret.replace(/\s*>\s*tbody\s*>?/g, ' ')
};
exports.isPositionFixed = ($dom) => {
    if (!$dom || $dom === document.documentElement || $dom === document.body)
        return false;
    return getComputedStyle($dom)['position'] === 'fixed' || exports.isPositionFixed($dom.parentNode);
};
exports.offset = function (dom) {
    if (!dom)
        return { left: 0, top: 0 };
    var rect = dom.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
};
function accurateOffset(dom) {
    if (!dom)
        return { left: 0, top: 0 };
    const doc = dom.ownerDocument;
    if (!doc || dom === doc.documentElement)
        return { left: 0, top: 0 };
    const parentOffset = accurateOffset(dom.offsetParent);
    return {
        left: parentOffset.left + dom.offsetLeft,
        top: parentOffset.top + dom.offsetTop
    };
}
exports.accurateOffset = accurateOffset;
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const $img = new Image();
        $img.onload = () => {
            resolve({
                $img,
                width: $img.width,
                height: $img.height
            });
        };
        $img.onerror = (e) => {
            reject(e);
        };
        $img.src = url;
    });
}
exports.preloadImage = preloadImage;
function isFirefox() {
    return /Firefox/.test(window.navigator.userAgent);
}
exports.isFirefox = isFirefox;
function svgNodetoString(svgNode) {
    return svgNode.outerHTML;
}
exports.svgNodetoString = svgNodetoString;
function svgToBase64(str) {
    return 'data:image/svg+xml;base64,' + window.btoa(str);
}
exports.svgToBase64 = svgToBase64;
function canvasFromSVG(str) {
    return new Promise((resolve, reject) => {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        const img = document.createElement('img');
        const b64 = svgToBase64(str);
        const mw = str.match(/<svg[\s\S]*?width="(.*?)"/m);
        const mh = str.match(/<svg[\s\S]*?height="(.*?)"/m);
        const w = parseInt(mw[1], 10);
        const h = parseInt(mh[1], 10);
        img.src = b64;
        img.onload = function () {
            c.width = w;
            c.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            resolve(c);
        };
        img.onerror = function (e) {
            reject(e);
        };
    });
}
exports.canvasFromSVG = canvasFromSVG;
function imageBlobFromSVG(str, mimeType = 'image/png', quality) {
    return canvasFromSVG(str)
        .then(canvas => {
        const p = new Promise((resolve, reject) => {
            try {
                canvas.toBlob(resolve, mimeType, quality);
            }
            catch (e) {
                reject(e);
            }
        });
        return p;
    });
}
exports.imageBlobFromSVG = imageBlobFromSVG;
function imageDataFromUrl(url) {
    return preloadImage(url)
        .then(({ $img, width, height }) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage($img, 0, 0, width, height);
        return context.getImageData(0, 0, width, height);
    });
}
exports.imageDataFromUrl = imageDataFromUrl;
function subImage(imageUrl, rect) {
    return new Promise((resolve, reject) => {
        const $img = new Image();
        $img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = rect.width;
            canvas.height = rect.height;
            const context = canvas.getContext('2d');
            context.drawImage($img, 0, 0, $img.width, $img.height, -1 * rect.x, -1 * rect.y, $img.width, $img.height);
            resolve(canvas.toDataURL());
        };
        $img.src = imageUrl;
    });
}
exports.subImage = subImage;
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
        throw 'Invalid color component';
    }
    return ((r << 16) | (g << 8) | b).toString(16);
}
exports.rgbToHex = rgbToHex;
function getPixel(params) {
    const { x, y, dataUrl } = params;
    return new Promise((resolve, reject) => {
        const $img = new Image();
        $img.onload = () => {
            const imgWidth = $img.width;
            const imgHeight = $img.height;
            if (x < 0 || y < 0 || x > imgWidth || y > imgHeight) {
                return reject(new Error(`${x}, ${y} is out of screenshot bound 0, 0 ~ ${imgWidth}, ${imgHeight}`));
            }
            const canvas = document.createElement('canvas');
            canvas.width = x + 5;
            canvas.height = y + 5;
            const context = canvas.getContext('2d');
            context.drawImage($img, 0, 0, x + 5, y + 5, 0, 0, x + 5, y + 5);
            let hex;
            try {
                const p = context.getImageData(x, y, 1, 1).data;
                hex = '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6);
                resolve(hex);
            }
            catch (err) {
                const e = err;
                reject(new Error(`Failed to get pixel color` + ((e === null || e === void 0 ? void 0 : e.message) ? `: ${e.message}.` : '.')));
            }
        };
        $img.src = dataUrl;
    });
}
exports.getPixel = getPixel;
function scaleRect(rect, scale) {
    return {
        x: scale * rect.x,
        y: scale * rect.y,
        width: scale * rect.width,
        height: scale * rect.height,
    };
}
exports.scaleRect = scaleRect;
function isEditable(el) {
    if (el.contentEditable === 'true') {
        return true;
    }
    const tag = (el.tagName || '').toLowerCase();
    if (['input', 'textarea'].indexOf(tag) === -1) {
        return false;
    }
    const disabled = el.disabled;
    const readOnly = el.readOnly;
    return !disabled && !readOnly;
}
exports.isEditable = isEditable;
function hasAncestor(el, checkAncestor) {
    let node = el;
    while (node) {
        if (checkAncestor(node)) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
exports.hasAncestor = hasAncestor;
function getAncestor(el, checkAncestor) {
    let node = el;
    while (node) {
        if (checkAncestor(node)) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}
exports.getAncestor = getAncestor;
function getElementsByXPath(xpath) {
    const snapshot = document.evaluate(xpath, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const list = [];
    for (let i = 0, len = snapshot.snapshotLength; i < len; i++) {
        list.push(snapshot.snapshotItem(i));
    }
    return list;
}
exports.getElementsByXPath = getElementsByXPath;
function getElementByXPath(xpath) {
    return getElementsByXPath(xpath)[0];
}
exports.getElementByXPath = getElementByXPath;
function assertLocator(str) {
    const i = str.indexOf('=');
    // xpath
    if ((/^\//.test(str)))
        return true;
    // efp
    if (/^#elementfrompoint/i.test(str))
        return true;
    // Above is all locators that doesn't require '='
    if (i === -1)
        throw new Error('invalid locator, ' + str);
    const method = str.substr(0, i);
    const value = str.substr(i + 1);
    if (!value || !value.length)
        throw new Error('invalid locator, ' + str);
    switch (method && method.toLowerCase()) {
        case 'id':
        case 'name':
        case 'identifier':
        case 'link':
        case 'linktext':
        case 'partiallinktext':
        case 'css':
        case 'xpath':
            return true;
        default:
            throw new Error('invalid locator, ' + str);
    }
}
exports.assertLocator = assertLocator;
function isLocator(str) {
    try {
        assertLocator(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isLocator = isLocator;
// Note: parse the locator and return the element found accordingly
function getElementByLocator(str, shouldWaitForVisible) {
    const i = str.indexOf('=');
    let el;
    if ((/^\//.test(str))) {
        el = getElementByXPath(str);
    }
    else if (/^#elementfrompoint/i.test(str.trim())) {
        el = elementByElementFromPoint(str);
    }
    else if (i === -1) {
        throw new Error('getElementByLocator: invalid locator, ' + str);
    }
    else {
        const method = str.substr(0, i);
        const value = str.substr(i + 1);
        const lowerMethod = method && method.toLowerCase();
        switch (lowerMethod) {
            case 'id':
                el = document.getElementById(value);
                break;
            case 'name':
                el = document.getElementsByName(value)[0];
                break;
            case 'identifier':
                el = document.getElementById(value) || document.getElementsByName(value)[0];
                break;
            case 'link-notused': {
                const links = [].slice.call(document.getElementsByTagName('a'));
                // Note: there are cases such as 'link=exact:xxx'
                let realVal = value.replace(/^exact:/, '');
                // Note: position support. eg. link=Download@POS=3
                let match = realVal.match(/^(.+)@POS=(\d+)$/i);
                let index = 0;
                if (match) {
                    realVal = match[1];
                    index = parseInt(match[2]) - 1;
                }
                // Note: use textContent instead of innerText to avoid influence from text-transform
                const candidates = links.filter(a => glob_1.globMatch(realVal, exports.domText(a)));
                el = candidates[index];
                break;
            }
            case 'link':
            case 'linktext':
            case 'partiallinktext': {
                const links = [].slice.call(document.getElementsByTagName('a'));
                // Note: position support. eg. link=Download@POS=3
                let match = value.match(/^(.+)@POS=(\d+)$/i);
                let realVal = value;
                let index = 0;
                if (match) {
                    realVal = match[1];
                    index = parseInt(match[2]) - 1;
                }
                const pattern = lowerMethod === 'partiallinktext' ? `*${realVal}*` : realVal;
                const candidates = links.filter(link => glob_1.globMatch(pattern, exports.domText(link), { flags: 'im' }));
                el = candidates[index];
                break;
            }
            case 'css':
                el = document.querySelector(value);
                break;
            case 'xpath':
                el = getElementByXPath(value);
                break;
            default:
                throw new Error('getElementByLocator: unsupported locator method, ' + method);
        }
    }
    if (!el) {
        throw new Error('getElementByLocator: fail to find element based on the locator, ' + str);
    }
    if (shouldWaitForVisible && !exports.isVisible(el)) {
        throw new Error('getElementByLocator: element is found but not visible yet');
    }
    return el;
}
exports.getElementByLocator = getElementByLocator;
function isElementFromPoint(str) {
    return /^#elementfrompoint/i.test(str.trim());
}
exports.isElementFromPoint = isElementFromPoint;
function viewportCoordinateByElementFromPoint(str) {
    const reg = /^#elementfrompoint\s*\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/i;
    const m = str.trim().match(reg);
    if (!m) {
        throw new Error(`Invalid '#elementfrompoint' expression`);
    }
    const viewportX = parseFloat(m[1]);
    const viewportY = parseFloat(m[2]);
    if (viewportX <= 0 || viewportY <= 0) {
        throw new Error(`'#elementfrompoint' only accepts positive numbers`);
    }
    return [viewportX, viewportY];
}
exports.viewportCoordinateByElementFromPoint = viewportCoordinateByElementFromPoint;
function elementByElementFromPoint(str) {
    const [x, y] = viewportCoordinateByElementFromPoint(str);
    const el = document.elementFromPoint(x, y);
    return el;
}
exports.elementByElementFromPoint = elementByElementFromPoint;


/***/ }),

/***/ 54105:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIpcCache = exports.IpcCache = void 0;
const ts_utils_1 = __webpack_require__(55452);
const consecutive_1 = __webpack_require__(18463);
const storage_1 = __importDefault(__webpack_require__(67585));
const ipc_bg_cs_1 = __webpack_require__(31745);
var IpcStatus;
(function (IpcStatus) {
    IpcStatus[IpcStatus["Off"] = 0] = "Off";
    IpcStatus[IpcStatus["On"] = 1] = "On";
})(IpcStatus || (IpcStatus = {}));
const ipcCacheStorageKey = 'ipc_cache';
class IpcCache {
    constructor() {
        this.cuidIpcMap = {};
    }
    fetch() {
        return storage_1.default.get(ipcCacheStorageKey).then(cache => cache || {});
    }
    has(tabId, cuid) {
        return this.fetch().then(cache => {
            const item = cache[tabId];
            return !!item && (!cuid || item.cuid == cuid);
        });
    }
    get(tabId, timeout = 2000, before = Infinity) {
        return ts_utils_1.until('ipc by tab id', () => {
            return this.fetch().then((cache) => {
                const ipcObj = cache[tabId];
                const enabled = ipcObj && ipcObj.status === IpcStatus.On;
                const valid = enabled && (before === Infinity || before > ipcObj.timestamp);
                if (!valid) {
                    return {
                        pass: false,
                        result: null
                    };
                }
                return {
                    pass: true,
                    result: this.getCachedIpc(`${ipcObj.cuid}`, tabId),
                };
            });
        }, 100, timeout);
    }
    domReadyGet(tabId, timeout = 60 * 1000, c = true) {
        return ts_utils_1.retry(() => {
            return this.get(tabId)
                .then(ipc => {
                // Note: must respond to DOM READY for multiple times in line,
                // before we can be sure that it's ready
                return consecutive_1.withConsecutive(c, () => {
                    return ipc.ask('DOM_READY', {}, 1000)
                        .then(() => true, () => false);
                })
                    .then(() => ipc);
            });
        }, {
            timeout,
            retryInterval: 1000,
            shouldRetry: (e) => true
        })();
    }
    set(tabId, ipc, cuid) {
        return this.fetch().then(cache => {
            cache[tabId] = {
                ipc,
                cuid,
                status: 1,
                timestamp: new Date().getTime()
            };
            return storage_1.default.set(ipcCacheStorageKey, cache).then(() => { });
        });
    }
    setStatus(tabId, status, updateTimestamp = false) {
        return this.fetch().then(cache => {
            const found = cache[tabId];
            if (!found)
                return false;
            found.status = status;
            if (updateTimestamp) {
                found.timestamp = new Date().getTime();
            }
            return storage_1.default.set(ipcCacheStorageKey, cache);
        });
    }
    enable(tabId) {
        return this.setStatus(tabId, IpcStatus.On, true);
    }
    disable(tabId) {
        return this.setStatus(tabId, IpcStatus.Off);
    }
    getCuid(tabId) {
        return this.fetch().then(cache => {
            const found = cache[tabId];
            if (!found)
                return null;
            return found.cuid;
        });
    }
    del(tabId) {
        return this.fetch().then(cache => {
            delete cache[tabId];
            return storage_1.default.set(ipcCacheStorageKey, cache).then(() => { });
        });
    }
    cleanup(tabIdDict) {
        return this.fetch().then(cache => {
            Object.keys(cache).forEach(tabId => {
                if (!tabIdDict[tabId]) {
                    delete cache[tabId];
                }
            });
            return storage_1.default.set(ipcCacheStorageKey, cache).then(() => cache);
        });
    }
    getCachedIpc(cuid, tabId) {
        if (!this.cuidIpcMap[cuid]) {
            this.cuidIpcMap[cuid] = ipc_bg_cs_1.openBgWithCs(cuid).ipcBg(tabId);
        }
        return this.cuidIpcMap[cuid];
    }
}
exports.IpcCache = IpcCache;
exports.getIpcCache = ts_utils_1.singletonGetter(() => new IpcCache);


/***/ }),

/***/ 25343:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createIframe = exports.ipcForIframe = void 0;
const cs_postmessage_1 = __webpack_require__(5116);
const registry_1 = __webpack_require__(55290);
const consecutive_1 = __webpack_require__(18463);
const ts_utils_1 = __webpack_require__(55452);
const postMsg = cs_postmessage_1.postMessage;
exports.ipcForIframe = ({ targetWindow = window.top, timeout = 60000 } = {}) => {
    const registry = registry_1.createListenerRegistry();
    const listener = ({ cmd, args }) => registry.fire('call', { cmd, args });
    const removeOnMsg = cs_postmessage_1.onMessage(window, listener);
    return {
        ask: (cmd, args) => {
            return postMsg(targetWindow, window, { cmd, args }, '*', timeout);
        },
        onAsk: (fn) => {
            registry.add('call', ({ cmd, args }) => fn(cmd, args));
        },
        destroy: () => {
            removeOnMsg();
        }
    };
};
exports.createIframe = (options) => {
    const { url, width, height, onLoad, domReady, ipcTimeout = 60000 } = options;
    const $iframe = document.createElement('iframe');
    const pLoad = new Promise((resolve, reject) => {
        if (width)
            $iframe.width = '' + width;
        if (height)
            $iframe.height = '' + height;
        $iframe.addEventListener('load', () => {
            if (typeof onLoad === 'function') {
                try {
                    onLoad();
                }
                catch (e) { }
            }
            resolve();
        });
        $iframe.src = url;
        document.body.appendChild($iframe);
    });
    const waitDomReady = (domReady) => {
        return ts_utils_1.retry(() => {
            return consecutive_1.withConsecutive(domReady, () => {
                return postMsg($iframe.contentWindow, window, { cmd: 'DOM_READY', args: {} }, '*', 1000)
                    .then(() => true, () => false);
            })
                .then(() => undefined);
        }, {
            timeout: ipcTimeout,
            shouldRetry: (e) => true,
            retryInterval: 1000
        })();
    };
    const pReady = domReady ? pLoad.then(() => waitDomReady(domReady)) : pLoad;
    const removeOnMsg = cs_postmessage_1.onMessage(window, ({ cmd, args }) => {
        return wrappedOnAsk(cmd, args);
    });
    const wrappedOnAsk = (cmd, args) => {
        return registry.fire('call', { cmd, args });
    };
    const registry = registry_1.createListenerRegistry();
    return {
        $iframe,
        destroy: () => {
            if ($iframe)
                $iframe.remove();
            removeOnMsg();
        },
        ask: (cmd, args) => {
            return pReady.then(() => {
                return postMsg($iframe.contentWindow, window, { cmd, args }, '*', ipcTimeout);
            });
        },
        onAsk: (fn) => {
            registry.add('call', ({ cmd, args }) => fn(cmd, args));
        }
    };
};


/***/ }),

/***/ 22491:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.askPageWithFixedTab = exports.askPageWithTab = exports.openPageInTab = exports.askPageWithIframe = exports.openPageInIframe = void 0;
const ipc_iframe_1 = __webpack_require__(25343);
const web_extension_1 = __importDefault(__webpack_require__(61171));
const ipc_cache_1 = __webpack_require__(54105);
const tab_utils_1 = __webpack_require__(96836);
exports.openPageInIframe = ipc_iframe_1.createIframe;
exports.askPageWithIframe = (options) => {
    const iframeIpc = exports.openPageInIframe({
        url: options.url,
        width: options.width,
        height: options.height,
        ipcTimeout: options.ipcTimeout,
        domReady: options.domReady,
        onLoad: options.onLoad
    });
    return iframeIpc.ask(options.cmd, options.args)
        .then((data) => {
        setTimeout(() => iframeIpc.destroy());
        return data;
    });
};
exports.openPageInTab = (options) => {
    const isValidTab = (tabId) => {
        return web_extension_1.default.tabs.get(tabId)
            .then((tab) => {
            return !!tab;
        })
            .catch((e) => false);
    };
    const updateExistingTabToUrl = (tabId, url) => {
        return isValidTab(tabId)
            .then(isValid => {
            return isValid ? web_extension_1.default.tabs.update(tabId, { url }) : createNewTabWithUrl(url);
        });
    };
    const createNewTabWithUrl = (url) => {
        if (options.popup) {
            return web_extension_1.default.windows.create({
                type: 'popup',
                url: url,
                width: Math.round(options.width || screen.availWidth),
                height: Math.round(options.height || screen.availHeight),
                left: Math.round(options.left || 0),
                top: Math.round(options.top || 0),
            })
                .then((win) => win.tabs[0]);
        }
        return web_extension_1.default.tabs.create({ url });
    };
    const { url, tabId, domReady } = options;
    const pTab = options.tabId ? updateExistingTabToUrl(tabId, url) : createNewTabWithUrl(url);
    const pIpc = pTab.then(tab => {
        const ipcStore = ipc_cache_1.getIpcCache();
        const pGetTab = domReady ? ipcStore.domReadyGet(tab.id, 20 * 1000, domReady) : ipcStore.get(tab.id, 20 * 1000);
        return (options.focus ? tab_utils_1.activateTab(tab.id, true) : Promise.resolve())
            .then(() => pGetTab)
            .then(ipc => (Object.assign(Object.assign({}, ipc), { getTabId: () => tab.id, getTab: () => web_extension_1.default.tabs.get(tab.id), destroy: () => {
                ipc.destroy();
                if (!options.tabId && !options.keep) {
                    web_extension_1.default.tabs.remove(tab.id);
                }
            } })));
    });
    return {
        destroy: () => {
            pIpc.then(ipc => ipc.destroy());
        },
        ask: (...args) => {
            return pIpc.then(ipc => ipc.ask(...args));
        },
        onAsk: (...args) => {
            pIpc.then(ipc => ipc.onAsk(...args));
        },
        getTab: () => {
            return pIpc.then(ipc => ipc.getTab());
        },
        getTabId: () => {
            return pIpc.then(ipc => ipc.getTabId());
        }
    };
};
exports.askPageWithTab = (options) => {
    const tabAPI = exports.openPageInTab({
        url: options.url,
        tabId: options.tabId,
        ipcTimeout: options.ipcTimeout,
        domReady: options.domReady
    });
    return tabAPI.ask(options.cmd, options.args)
        .then((data) => {
        setTimeout(() => tabAPI.destroy(), 0);
        return data;
    });
};
exports.askPageWithFixedTab = (() => {
    let curTabId = undefined;
    return (options) => {
        const tabAPI = exports.openPageInTab({
            url: options.url,
            tabId: options.tabId || curTabId,
            keep: true,
            ipcTimeout: options.ipcTimeout,
            domReady: options.domReady
        });
        return tabAPI.getTabId()
            .then((tabId) => {
            curTabId = tabId;
            return tabAPI.ask(options.cmd, options.args)
                .then((data) => {
                setTimeout(() => tabAPI.destroy(), 0);
                return data;
            });
        });
    };
})();


/***/ }),

/***/ 77242:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Log factory is quite simple, just a wrapper on console.log
// so that you can use the same API, at the same, achieve following features
// 1. Hide all logs in production
// 2. Extend it to save logs in local storage / or send it back to you backend (for debug or analysis)
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logFactory = void 0;
function logFactory(enabled) {
    let isEnabled = !!enabled;
    const obj = ['log', 'info', 'warn', 'error'].reduce((prev, method) => {
        prev[method] = (...args) => {
            if (!isEnabled)
                return;
            console[method]((new Date()).toISOString(), ' - ', ...args);
        };
        return prev;
    }, {});
    return Object.assign(obj.log, obj, {
        enable: () => { isEnabled = true; },
        disable: () => { isEnabled = false; }
    });
}
exports.logFactory = logFactory;
const logger = logFactory("production" !== 'production');
exports["default"] = logger;


/***/ }),

/***/ 29319:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = {
    proxy: {
        notControllable: 'The proxy settings are controlled by other app(s) or extension(s). Please disable or uninstall the apps or extensions in conflict'
    },
    contentHidden: 'Content is hidden during replay'
};


/***/ }),

/***/ 55290:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createListenerRegistry = exports.Registry = void 0;
class Registry {
    constructor({ process, onZero, onOne }) {
        this.cache = {};
        this.process = process;
        this.onZero = onZero || (() => { });
        this.onOne = onOne || (() => { });
    }
    add(id, obj) {
        this.cache[id] = this.cache[id] || [];
        this.cache[id].push(obj);
        if (this.cache[id].length === 1) {
            try {
                this.onOne(id);
            }
            catch (e) {
                // tslint:disable-next-line
                console.error('in onOne, ' + e.message);
            }
        }
        return true;
    }
    remove(id, obj) {
        if (!this.cache[id]) {
            return false;
        }
        this.cache[id] = this.cache[id].filter((item) => item !== obj);
        if (this.cache[id].length === 0) {
            try {
                this.onZero(id);
            }
            catch (e) {
                // tslint:disable-next-line
                console.error('in onZero, ' + e.message);
            }
        }
        return true;
    }
    removeAllWithData(obj) {
        Object.keys(this.cache).forEach((id) => {
            for (let i = this.cache[id].length - 1; i >= 0; i--) {
                if (this.cache[id][i] === obj) {
                    this.remove(id, this.cache[id][i]);
                }
            }
        });
    }
    fire(id, data) {
        if (!this.cache[id]) {
            return false;
        }
        this.cache[id].forEach((item) => {
            try {
                this.process(item, data, id);
            }
            catch (e) {
                // tslint:disable-next-line
                console.error('in process, ' + e.message);
            }
        });
        return true;
    }
    has(id) {
        return this.cache[id] && this.cache[id].length > 0;
    }
    keys() {
        return Object.keys(this.cache).filter((key) => this.cache[key] && this.cache[key].length > 0);
    }
    destroy() {
        Object.keys(this.cache).forEach((id) => {
            try {
                this.onZero(id);
            }
            catch (e) {
                // tslint:disable-next-line
                console.error('in onZero, ' + e.message);
            }
        });
        this.cache = {};
    }
}
exports.Registry = Registry;
function createListenerRegistry() {
    return new Registry({
        process: (fn, data, id) => {
            fn(data);
        }
    });
}
exports.createListenerRegistry = createListenerRegistry;


/***/ }),

/***/ 96836:
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
exports.getAllTabs = exports.getAllTabsInWindow = exports.getAllWindows = exports.updateUrlForTab = exports.getCurrentTab = exports.getTab = exports.activateTab = exports.createTab = void 0;
const ts_utils_1 = __webpack_require__(55452);
const web_extension_1 = __importDefault(__webpack_require__(61171));
const global_state_1 = __webpack_require__(13426);
exports.createTab = (url) => {
    return web_extension_1.default.tabs.create({ url, active: true });
};
exports.activateTab = (tabId, focusWindow = false) => {
    return web_extension_1.default.tabs.get(tabId)
        .then((tab) => {
        const p = focusWindow ? web_extension_1.default.windows.update(tab.windowId, { focused: true })
            : Promise.resolve();
        return p.then(() => web_extension_1.default.tabs.update(tab.id, { active: true }))
            .then(() => tab);
    });
};
exports.getTab = (tabId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return web_extension_1.default.tabs.get(tabId);
    }
    catch (_a) {
        return web_extension_1.default.tabs.query({ active: true });
    }
});
exports.getCurrentTab = (winId) => {
    const pWin = winId ? web_extension_1.default.windows.get(winId) : web_extension_1.default.windows.getLastFocused();
    return pWin.then((win) => {
        return web_extension_1.default.tabs.query({ active: true, windowId: win.id })
            .then((tabs) => tabs[0]);
    });
};
function updateUrlForTab(tabId, url, cmd) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const tab = typeof tabId === "number" ? (yield web_extension_1.default.tabs.get(tabId)) : tabId;
        const tabUrl = new URL(tab.url);
        const newUrl = new URL(url);
        const isSamePath = tabUrl.origin + tabUrl.pathname === newUrl.origin + tabUrl.pathname;
        // Browsers won't reload the page if the new url is only different in hash
        const noReload = isSamePath && !!((_a = newUrl.hash) === null || _a === void 0 ? void 0 : _a.length);
        const state = yield global_state_1.getState();
        let bwindowId = state.tabIds.bwindowId;
        let doFlag = [];
        let wTabs = yield web_extension_1.default.windows.getAll();
        for (var i = wTabs.length - 1; i >= 0; i--) {
            if (wTabs[i].id === bwindowId) {
                doFlag = wTabs[i];
                break;
            }
        }
        //let bwindowId = state.tabIds.bwindowId ? state.tabIds.bwindowId : '';
        if (cmd == "openBrowser" && doFlag.length == 0) {
            yield web_extension_1.default.windows.create({ url: url });
            const winTab = yield exports.getCurrentTab();
            bwindowId = winTab.windowId;
            yield global_state_1.updateState(state => (Object.assign(Object.assign({}, state), { tabIds: Object.assign(Object.assign({}, state.tabIds), { lastPlay: state.tabIds.toPlay, toPlay: winTab.id, firstPlay: winTab.id, bwindowId: winTab.windowId }) })));
            return yield exports.getTab(winTab.id);
        }
        else {
            const wTab = doFlag.length != 0 ? yield exports.getCurrentTab(doFlag.id) : '';
            //const targetTabId = wTab !="" && cmd == "openBrowser" ? wTab.id : tab.id;
            const targetTabId = tab.id;
            if (noReload) {
                yield web_extension_1.default.tabs.update(targetTabId, { url: "about:blank" });
                yield ts_utils_1.delay(() => { }, 100);
            }
            yield web_extension_1.default.tabs.update(targetTabId, { url });
            return yield exports.getTab(targetTabId);
        }
    });
}
exports.updateUrlForTab = updateUrlForTab;
function getAllWindows() {
    return web_extension_1.default.windows.getAll();
}
exports.getAllWindows = getAllWindows;
function getAllTabsInWindow(windowId) {
    return web_extension_1.default.windows.get(windowId, { populate: true }).then((win) => { var _a; return (_a = win === null || win === void 0 ? void 0 : win.tabs) !== null && _a !== void 0 ? _a : []; });
}
exports.getAllTabsInWindow = getAllTabsInWindow;
function getAllTabs() {
    return __awaiter(this, void 0, void 0, function* () {
        const wins = yield getAllWindows();
        const list = yield Promise.all(wins.map((win) => getAllTabsInWindow(win.id)));
        return [].concat(...list);
    });
}
exports.getAllTabs = getAllTabs;


/***/ }),

/***/ 55452:
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
exports.throttlePromiseFunc = exports.urlWithQueries = exports.withCountDown = exports.countDown = exports.resolvePath = exports.isMac = exports.repeatStr = exports.pad2digits = exports.assertExhausted = exports.readFileAsText = exports.withConsecutive = exports.consecutive = exports.uniqueStrings = exports.unique = exports.normalizeHtmlId = exports.addInBetween = exports.pointToFitRect = exports.nodeByOffset = exports.toArray = exports.findNodeInForest = exports.findNodeInTree = exports.flatternTree = exports.flattenTreeWithPaths = exports.ancestorsInNodesList = exports.pathsInNodeList = exports.ancestorsInNode = exports.pathsInNode = exports.traverseTree = exports.TraverseTreeResult = exports.nodeCount = exports.isForestEqual = exports.isTreeEqual = exports.forestSlice = exports.treeSlice = exports.treeFilter = exports.treeMap = exports.errorClassFactory = exports.concurrent = exports.milliSecondsToStringInSecond = exports.objMap = exports.clone = exports.withPromise = exports.concatUint8Array = exports.sum = exports.strictParseBoolLike = exports.parseBoolLike = exports.guardVoidPromise = exports.flow = exports.retryWithCount = exports.retry = exports.throttle = exports.objFilter = exports.uniqueName = exports.getExtName = exports.withFileExtension = exports.withPostfix = exports.or = exports.and = exports.zipWith = exports.flatten = exports.uid = exports.without = exports.pickIfExist = exports.pick = exports.safeSetIn = exports.safeUpdateIn = exports.safeOn = exports.safeMap = exports.getIn = exports.setIn = exports.updateIn = exports.on = exports.map = exports.compose = exports.reduceRight = exports.partial = exports.range = exports.until = exports.delay = exports.snakeToCamel = exports.capitalInitial = exports.id = exports.singletonGetterByKey = exports.singletonGetter = void 0;
const log_1 = __importDefault(__webpack_require__(77242));
function singletonGetter(factoryFn) {
    let instance = null;
    return (...args) => {
        if (instance)
            return instance;
        instance = factoryFn(...args);
        return instance;
    };
}
exports.singletonGetter = singletonGetter;
function singletonGetterByKey(getKey, factoryFn) {
    let cache = {};
    return (...args) => {
        const key = getKey(...args);
        if (cache[key])
            return cache[key];
        cache[key] = factoryFn(...args);
        return cache[key];
    };
}
exports.singletonGetterByKey = singletonGetterByKey;
function id(x) {
    return x;
}
exports.id = id;
function capitalInitial(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
exports.capitalInitial = capitalInitial;
function snakeToCamel(kebabStr) {
    const list = kebabStr.split('_');
    return list[0] + list.slice(1).map(capitalInitial).join('');
}
exports.snakeToCamel = snakeToCamel;
exports.delay = (fn, timeout) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(fn());
            }
            catch (e) {
                reject(e);
            }
        }, timeout);
    });
};
exports.until = (name, check, interval = 1000, expire = 10000) => {
    const start = new Date().getTime();
    const go = () => __awaiter(void 0, void 0, void 0, function* () {
        if (expire && new Date().getTime() - start >= expire) {
            throw new Error(`until: ${name} expired!`);
        }
        const { pass, result } = yield Promise.resolve(check());
        if (pass)
            return Promise.resolve(result);
        return exports.delay(go, interval);
    });
    return new Promise((resolve, reject) => {
        try {
            resolve(go());
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.range = (start, end, step = 1) => {
    const ret = [];
    for (let i = start; i < end; i += step) {
        ret.push(i);
    }
    return ret;
};
exports.partial = (fn) => {
    const len = fn.length;
    let arbitary;
    arbitary = (curArgs, leftArgCnt) => (...args) => {
        if (args.length >= leftArgCnt) {
            return fn.apply(null, curArgs.concat(args));
        }
        return arbitary(curArgs.concat(args), leftArgCnt - args.length);
    };
    return arbitary([], len);
};
exports.reduceRight = (fn, initial, list) => {
    let ret = initial;
    for (let i = list.length - 1; i >= 0; i--) {
        ret = fn(list[i], ret);
    }
    return ret;
};
exports.compose = (...args) => {
    return exports.reduceRight((cur, prev) => {
        return (x) => cur(prev(x));
    }, (x) => x, args);
};
exports.map = exports.partial((fn, list) => {
    const result = [];
    for (let i = 0, len = list.length; i < len; i++) {
        result.push(fn(list[i]));
    }
    return result;
});
exports.on = exports.partial((key, fn, dict) => {
    if (Array.isArray(dict)) {
        return [
            ...dict.slice(0, key),
            fn(dict[key]),
            ...dict.slice(key + 1)
        ];
    }
    return Object.assign({}, dict, {
        [key]: fn(dict[key])
    });
});
exports.updateIn = exports.partial((keys, fn, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.map : exports.on(key)));
    return updater(fn)(obj);
});
exports.setIn = exports.partial((keys, value, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.map : exports.on(key)));
    return updater(() => value)(obj);
});
exports.getIn = exports.partial((keys, obj) => {
    return keys.reduce((prev, key) => {
        if (!prev)
            return prev;
        return prev[key];
    }, obj);
});
exports.safeMap = exports.partial((fn, list) => {
    const result = [];
    const safeList = list || [];
    for (let i = 0, len = safeList.length; i < len; i++) {
        result.push(fn(safeList[i]));
    }
    return result;
});
exports.safeOn = exports.partial((key, fn, dict) => {
    if (Array.isArray(dict)) {
        return [
            ...dict.slice(0, key),
            fn(dict[key]),
            ...dict.slice(key + 1)
        ];
    }
    return Object.assign({}, dict, {
        [key]: fn((dict || {})[key])
    });
});
exports.safeUpdateIn = exports.partial((keys, fn, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.safeMap : exports.safeOn(key)));
    return updater(fn)(obj);
});
exports.safeSetIn = exports.partial((keys, value, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.safeMap : exports.safeOn(key)));
    return updater(() => value)(obj);
});
exports.pick = (keys, obj) => {
    return keys.reduce((prev, key) => {
        prev[key] = obj[key];
        return prev;
    }, {});
};
exports.pickIfExist = (keys, obj) => {
    return keys.reduce((prev, key) => {
        if (obj[key] !== undefined) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
};
exports.without = (keys, obj) => {
    return Object.keys(obj).reduce((prev, key) => {
        if (keys.indexOf(key) === -1) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
};
exports.uid = () => {
    return '' + (new Date().getTime()) + '.' +
        Math.floor(Math.random() * 10000000).toString(16);
};
exports.flatten = (list) => {
    return [].concat.apply([], list);
};
exports.zipWith = (fn, ...listOfList) => {
    const len = Math.min(...listOfList.map(list => list.length));
    const res = [];
    for (let i = 0; i < len; i++) {
        res.push(fn(...listOfList.map(list => list[i])));
    }
    return res;
};
exports.and = (...list) => list.reduce((prev, cur) => prev && cur, true);
exports.or = (...list) => list.reduce((prev, cur) => prev || cur, false);
exports.withPostfix = (options) => {
    const { reg, str, fn } = options;
    const m = str.match(reg);
    const extName = m ? m[0] : '';
    const baseName = m ? str.replace(reg, '') : str;
    const result = fn(baseName, (name) => name + extName);
    if (result === null || result === undefined) {
        throw new Error('withPostfix: should not return null/undefined');
    }
    if (typeof result.then === 'function') {
        return result.then((name) => name + extName);
    }
    return result + extName;
};
exports.withFileExtension = (origName, fn) => {
    return exports.withPostfix({
        fn,
        str: origName,
        reg: /\.\w+$/
    });
};
function getExtName(fileName) {
    return exports.withFileExtension(fileName, () => '');
}
exports.getExtName = getExtName;
exports.uniqueName = (name, options) => {
    const opts = Object.assign({ generate: (old, step = 1) => {
            const reg = /_(\d+)$/;
            const m = old.match(reg);
            if (!m)
                return `${old}_${step}`;
            return old.replace(reg, (_, n) => `_${parseInt(n, 10) + step}`);
        }, check: () => Promise.resolve(true), postfixReg: /\.\w+$/ }, (options || {}));
    const { generate, check, postfixReg } = opts;
    return exports.withPostfix({
        str: name,
        reg: postfixReg,
        fn: (baseName, getFullName) => {
            const go = (fileName, step) => {
                return Promise.resolve(check(getFullName(fileName)))
                    .then(pass => {
                    if (pass)
                        return fileName;
                    return go(generate(fileName, step), step);
                });
            };
            return go(baseName, 1);
        }
    });
};
exports.objFilter = (filter, obj) => {
    return Object.keys(obj).reduce((prev, key, i) => {
        if (filter(obj[key], key, i)) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
};
function throttle(fn, timeout) {
    let lastTime = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastTime < timeout)
            return;
        lastTime = now;
        return fn(...args);
    };
}
exports.throttle = throttle;
exports.retry = (fn, options) => (...args) => {
    const { timeout, onFirstFail, onFinal, shouldRetry, retryInterval } = Object.assign({ timeout: 5000, retryInterval: 1000, onFirstFail: (() => { }), onFinal: (() => { }), shouldRetry: (e) => false }, options);
    let retryCount = 0;
    let lastError;
    let timerToClear;
    let done = false;
    const wrappedOnFinal = (...args) => {
        done = true;
        if (timerToClear) {
            clearTimeout(timerToClear);
        }
        return onFinal(...args);
    };
    const intervalMan = (function () {
        let lastInterval;
        const intervalFactory = (function () {
            switch (typeof retryInterval) {
                case 'function':
                    return retryInterval;
                case 'number':
                    return ((retryCount, lastInterval) => retryInterval);
                default:
                    throw new Error('retryInterval must be either a number or a function');
            }
        })();
        return {
            getLastInterval: () => lastInterval,
            getInterval: () => {
                const interval = intervalFactory(retryCount, lastInterval);
                lastInterval = interval;
                return interval;
            }
        };
    })();
    const onError = (e, _throwErr) => {
        const throwErr = _throwErr || ((e) => Promise.reject(e));
        if (retryCount === 0) {
            onFirstFail(e);
        }
        return new Promise(resolve => {
            resolve(shouldRetry(e));
        })
            .then((should) => {
            if (!should) {
                wrappedOnFinal(e);
                return throwErr(e);
            }
            lastError = e;
            const p = new Promise((resolve, reject) => {
                if (retryCount++ === 0) {
                    timerToClear = setTimeout(() => {
                        wrappedOnFinal(lastError);
                        reject(lastError);
                    }, timeout);
                }
                if (done)
                    return;
                exports.delay(run, intervalMan.getInterval())
                    .then(resolve, (e) => resolve(onError(e, (err) => reject(e))));
            });
            return p;
        });
    };
    const run = () => {
        return new Promise((resolve, reject) => {
            try {
                const res = fn(...args, {
                    retryCount,
                    retryInterval: intervalMan.getLastInterval()
                });
                resolve(res);
            }
            catch (e) {
                reject(e);
            }
        })
            .catch(onError);
    };
    return run()
        .then((result) => {
        wrappedOnFinal(null, result);
        return result;
    });
};
function retryWithCount(options, fn) {
    let n = 0;
    return exports.retry(fn, {
        timeout: 99999,
        retryInterval: options.interval,
        shouldRetry: () => ++n <= options.count
    });
}
exports.retryWithCount = retryWithCount;
function flow(...fns) {
    const result = new Array(fns.length);
    const finalPromise = fns.reduce((prev, fn, i) => {
        return prev.then((res) => {
            if (i > 0) {
                result[i - 1] = res;
            }
            return fn(res);
        });
    }, Promise.resolve());
    return finalPromise.then((res) => {
        result[fns.length - 1] = res;
        return result;
    });
}
exports.flow = flow;
function guardVoidPromise(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            try {
                resolve(fn(...args));
            }
            catch (e) {
                reject(e);
            }
        })
            .then(() => { }, (e) => {
            log_1.default.error(e);
        });
    };
}
exports.guardVoidPromise = guardVoidPromise;
function parseBoolLike(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return !!value;
    }
    if (value === undefined) {
        return fallback;
    }
    try {
        const val = JSON.parse(value.toLowerCase());
        return !!val;
    }
    catch (e) {
        return fallback;
    }
}
exports.parseBoolLike = parseBoolLike;
function strictParseBoolLike(value) {
    if (typeof value === 'boolean') {
        return value;
    }
    const result = JSON.parse(value.toLowerCase());
    if (typeof result !== 'boolean') {
        throw new Error('Not a boolean');
    }
    return result;
}
exports.strictParseBoolLike = strictParseBoolLike;
function sum(...list) {
    return list.reduce((x, y) => x + y, 0);
}
exports.sum = sum;
function concatUint8Array(...arrays) {
    const totalLength = sum(...arrays.map(arr => arr.length));
    const result = new Uint8Array(totalLength);
    for (let i = 0, offset = 0, len = arrays.length; i < len; i += 1) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }
    return result;
}
exports.concatUint8Array = concatUint8Array;
function withPromise(factory) {
    return new Promise((resolve) => {
        resolve(factory());
    });
}
exports.withPromise = withPromise;
function clone(data) {
    if (data === undefined)
        return undefined;
    return JSON.parse(JSON.stringify(data));
}
exports.clone = clone;
exports.objMap = (fn, obj) => {
    const keys = typeof obj === 'object' ? Object.keys(obj) : [];
    return keys.reduce((prev, key, i) => {
        prev[key] = fn(obj[key], key, i, obj);
        return prev;
    }, {});
};
function milliSecondsToStringInSecond(ms) {
    return (ms / 1000).toFixed(2) + 's';
}
exports.milliSecondsToStringInSecond = milliSecondsToStringInSecond;
exports.concurrent = function (max) {
    var queue = [];
    var running = 0;
    var free = function () {
        running--;
        check();
    };
    const check = function () {
        if (running >= max || queue.length <= 0)
            return;
        var tuple = queue.shift();
        var resolve = tuple.resolve;
        running++;
        resolve(free);
    };
    const wait = function () {
        return new Promise(function (resolve, reject) {
            queue.push({ resolve, reject });
            check();
        });
    };
    const wrap = function (fn, context) {
        return function () {
            const args = [].slice.apply(arguments);
            return wait()
                .then(function (done) {
                return fn.apply(context, args)
                    .then(function (ret) {
                    done();
                    return ret;
                }, function (error) {
                    done();
                    throw error;
                });
            });
        };
    };
    return wrap;
};
function errorClassFactory(name) {
    return class extends Error {
        constructor(...args) {
            super(...args);
            this.code = name;
            if (this.message) {
                this.message = name + ': ' + this.message;
            }
            else {
                this.message = name;
            }
        }
    };
}
exports.errorClassFactory = errorClassFactory;
function treeMap(mapper, tree, paths = []) {
    return Object.assign(Object.assign({}, mapper(tree, paths)), { children: tree.children.map((subnode, i) => {
            return treeMap(mapper, subnode, [...paths, i]);
        }) });
}
exports.treeMap = treeMap;
function treeFilter(predicate, tree, paths = []) {
    if (predicate(tree, paths)) {
        return tree;
    }
    const children = tree.children.map((subnode, i) => {
        return treeFilter(predicate, subnode, [...paths, i]);
    });
    const validChildren = children.filter((item) => item);
    return validChildren.length === 0 ? null : Object.assign(Object.assign({}, tree), { children: validChildren });
}
exports.treeFilter = treeFilter;
function treeSlice(max, tree) {
    let root = null;
    let count = 0;
    traverseTree((data, paths) => {
        if (++count > max) {
            return TraverseTreeResult.Stop;
        }
        if (paths.length === 0) {
            root = Object.assign(Object.assign({}, data), { children: [] });
        }
        else {
            const finalIndex = paths[paths.length - 1];
            const parent = paths.slice(0, -1).reduce((node, index) => {
                return node.children[index];
            }, root);
            parent.children[finalIndex] = Object.assign(Object.assign({}, data), { children: [] });
        }
        return TraverseTreeResult.Normal;
    }, tree);
    return root;
}
exports.treeSlice = treeSlice;
function forestSlice(max, forest) {
    const newTree = { children: forest };
    const result = treeSlice(max + 1, newTree);
    return result ? result.children : [];
}
exports.forestSlice = forestSlice;
function isTreeEqual(isNodeEqual, a, b) {
    const aChildren = a.children || [];
    const bChildren = b.children || [];
    const alen = aChildren.length;
    const blen = bChildren.length;
    if (alen !== blen) {
        return false;
    }
    if (!isNodeEqual(a, b)) {
        return false;
    }
    for (let i = 0; i < alen; i++) {
        if (!isTreeEqual(isNodeEqual, a.children[i], b.children[i])) {
            return false;
        }
    }
    return true;
}
exports.isTreeEqual = isTreeEqual;
function isForestEqual(isNodeEqual, a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0, len = a.length; i < len; i++) {
        if (!isTreeEqual(isNodeEqual, a[i], b[i])) {
            return false;
        }
    }
    return true;
}
exports.isForestEqual = isForestEqual;
function nodeCount(tree) {
    let count = 0;
    traverseTree(() => {
        count++;
        return TraverseTreeResult.Normal;
    }, tree);
    return count;
}
exports.nodeCount = nodeCount;
var TraverseTreeResult;
(function (TraverseTreeResult) {
    TraverseTreeResult[TraverseTreeResult["Normal"] = 0] = "Normal";
    TraverseTreeResult[TraverseTreeResult["Skip"] = 1] = "Skip";
    TraverseTreeResult[TraverseTreeResult["Stop"] = 2] = "Stop";
})(TraverseTreeResult = exports.TraverseTreeResult || (exports.TraverseTreeResult = {}));
function traverseTree(fn, node, paths = []) {
    const intent = fn(node, paths);
    if (intent !== TraverseTreeResult.Normal) {
        return intent;
    }
    const childCount = node.children ? node.children.length : 0;
    const children = node.children || [];
    for (let i = 0; i < childCount; i++) {
        if (traverseTree(fn, children[i], [...paths, i]) === TraverseTreeResult.Stop) {
            return TraverseTreeResult.Stop;
        }
    }
    return TraverseTreeResult.Normal;
}
exports.traverseTree = traverseTree;
function pathsInNode(predicate, root) {
    let result = null;
    traverseTree((node, paths) => {
        if (predicate(node, paths)) {
            result = paths;
            return TraverseTreeResult.Stop;
        }
        return TraverseTreeResult.Normal;
    }, root);
    return result ? result : null;
}
exports.pathsInNode = pathsInNode;
function ancestorsInNode(predicate, root) {
    const paths = pathsInNode(predicate, root);
    if (paths === null) {
        return null;
    }
    const ancestorPaths = paths.slice(0, -1);
    const keys = addInBetween('children', ancestorPaths);
    return ancestorPaths.map((_, index) => {
        const subKeys = keys.slice(0, index * 2 + 1);
        return exports.getIn(subKeys, root.children);
    });
}
exports.ancestorsInNode = ancestorsInNode;
function pathsInNodeList(predicate, nodes) {
    for (let i = 0, len = nodes.length; i < len; i++) {
        const paths = pathsInNode(predicate, nodes[i]);
        if (paths !== null) {
            return [i, ...paths];
        }
    }
    return null;
}
exports.pathsInNodeList = pathsInNodeList;
function ancestorsInNodesList(predicate, nodes) {
    for (let i = 0, len = nodes.length; i < len; i++) {
        const ancestors = ancestorsInNode(predicate, nodes[i]);
        if (ancestors !== null) {
            return [nodes[i], ...ancestors];
        }
    }
    return null;
}
exports.ancestorsInNodesList = ancestorsInNodesList;
function flattenTreeWithPaths(tree) {
    const result = [];
    traverseTree((node, paths) => {
        result.push({
            paths,
            node: exports.without(['children'], node),
        });
        return TraverseTreeResult.Normal;
    }, tree);
    return result;
}
exports.flattenTreeWithPaths = flattenTreeWithPaths;
function flatternTree(tree) {
    return flattenTreeWithPaths(tree).map(item => item.node);
}
exports.flatternTree = flatternTree;
function findNodeInTree(predicate, tree) {
    let result = null;
    traverseTree((node, paths) => {
        if (predicate(node, paths)) {
            result = node;
            return TraverseTreeResult.Stop;
        }
        return TraverseTreeResult.Normal;
    }, tree);
    return result;
}
exports.findNodeInTree = findNodeInTree;
function findNodeInForest(predicate, forest) {
    for (let i = 0, len = forest.length; i < len; i++) {
        const result = findNodeInTree(predicate, forest[i]);
        if (result) {
            return result;
        }
    }
    return null;
}
exports.findNodeInForest = findNodeInForest;
function toArray(list) {
    return Array.isArray(list) ? list : [list];
}
exports.toArray = toArray;
function nodeByOffset(params) {
    const { tree, isTargetQualified, isCandidateQualified, offset } = params;
    if (Math.floor(offset) !== offset) {
        throw new Error(`offset must be integer. It's now ${offset}`);
    }
    let ret = null;
    const trees = toArray(tree);
    const cache = [];
    const maxCache = 1 + Math.ceil(Math.abs(offset));
    // Note: if offset is negative, which means you're looking for some item ahead,
    // we can get it from cache. Otherwise, use offsetLeft as counter until we reach the item.
    // So `found` could only be tree if `offset` is a positive integer
    let offsetLeft = Math.max(0, offset);
    let found = false;
    for (let i = 0, len = trees.length; i < len; i++) {
        const traverseResult = traverseTree((node, paths) => {
            const qualified = isCandidateQualified(node, paths);
            if (!qualified) {
                return TraverseTreeResult.Normal;
            }
            if (offset < 0) {
                cache.push(node);
                if (cache.length > maxCache) {
                    cache.shift();
                }
            }
            if (offset > 0 && found) {
                offsetLeft -= 1;
                if (offsetLeft === 0) {
                    ret = node;
                    return TraverseTreeResult.Stop;
                }
            }
            if (isTargetQualified(node, paths)) {
                if (offset <= 0) {
                    const index = cache.length - 1 + offset;
                    ret = index >= 0 ? cache[index] : null;
                    return TraverseTreeResult.Stop;
                }
                else {
                    found = true;
                }
            }
            return TraverseTreeResult.Normal;
        }, trees[i]);
        if (traverseResult === TraverseTreeResult.Stop) {
            break;
        }
    }
    return ret;
}
exports.nodeByOffset = nodeByOffset;
function pointToFitRect(data) {
    const { bound, size, point } = data;
    const lBorder = bound.x;
    const rBorder = bound.x + bound.width;
    const tBorder = bound.y;
    const bBorder = bound.y + bound.height;
    const x = (() => {
        if (point.x + size.width <= rBorder) {
            return point.x;
        }
        if (point.x - size.width >= lBorder) {
            return point.x - size.width;
        }
        return rBorder - size.width;
    })();
    const y = (() => {
        if (point.y + size.height <= bBorder) {
            return point.y;
        }
        if (point.y - size.height >= tBorder) {
            return point.y - size.height;
        }
        return bBorder - size.height;
    })();
    return { x, y };
}
exports.pointToFitRect = pointToFitRect;
function addInBetween(item, list) {
    const result = [];
    for (let i = 0, len = list.length; i < len; i++) {
        if (i !== 0) {
            result.push(item);
        }
        result.push(list[i]);
    }
    return result;
}
exports.addInBetween = addInBetween;
function normalizeHtmlId(str) {
    return str.replace(/[^A-Za-z0-9_-]/g, '_');
}
exports.normalizeHtmlId = normalizeHtmlId;
exports.unique = (list, getKey) => {
    let cache = {};
    const result = list.reduce((prev, cur) => {
        const key = getKey(cur);
        if (!cache[key]) {
            cache[key] = true;
            prev.push(cur);
        }
        return prev;
    }, []);
    return result;
};
exports.uniqueStrings = (...list) => {
    return exports.unique(list, x => x);
};
function consecutive(c) {
    if (typeof c === 'boolean') {
        return {
            interval: 0,
            count: c ? 1 : 0
        };
    }
    return c;
}
exports.consecutive = consecutive;
const timeout = (duration) => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};
function withConsecutive(c, fn) {
    const { interval, count } = consecutive(c);
    let counter = count;
    const next = (pass) => {
        if (!pass)
            throw new Error('failed to run consecutive');
        if (counter-- <= 0)
            return Promise.resolve(true);
        return timeout(interval || 0).then(fn).then(next);
    };
    return fn()
        .then(next);
}
exports.withConsecutive = withConsecutive;
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            try {
                const text = readerEvent.target.result;
                resolve(text);
            }
            catch (e) {
                reject(e);
            }
        };
        reader.readAsText(file);
    });
}
exports.readFileAsText = readFileAsText;
function assertExhausted(_, msg) {
    throw new Error('switch case not exhausted' + (msg ? (': ' + msg) : ''));
}
exports.assertExhausted = assertExhausted;
function pad2digits(n) {
    if (n >= 0 && n < 10) {
        return '0' + n;
    }
    return '' + n;
}
exports.pad2digits = pad2digits;
function repeatStr(n, str) {
    let s = '';
    for (let i = 0; i < n; i++) {
        s += str;
    }
    return s;
}
exports.repeatStr = repeatStr;
function isMac() {
    const userAgent = window.navigator.userAgent;
    return !!/macintosh/i.test(userAgent) || (/mac os x/i.test(userAgent) && !/like mac os x/i.test(userAgent));
}
exports.isMac = isMac;
function resolvePath(path, basePath, relativePath) {
    const dirPath = path.dirname(basePath);
    relativePath = relativePath.replace(/\\/g, '/');
    if (relativePath.indexOf('/') === 0) {
        return path.normalize(relativePath).replace(/^(\/|\\)/, '');
    }
    else {
        return path.join(dirPath, relativePath);
    }
}
exports.resolvePath = resolvePath;
function countDown(options) {
    const { interval, timeout, onTick, onTimeout } = options;
    let past = 0;
    const timer = setInterval(() => {
        past += interval;
        try {
            onTick({ past, total: timeout });
        }
        catch (e) {
            console.warn(e);
        }
        if (past >= timeout) {
            clearInterval(timer);
            if (typeof onTimeout === 'function') {
                try {
                    onTimeout({ past, total: timeout });
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }, options.interval);
    return () => clearInterval(timer);
}
exports.countDown = countDown;
exports.withCountDown = (options) => {
    const { interval, timeout, onTick } = options;
    let past = 0;
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            past += interval;
            try {
                onTick({ cancel, past, total: timeout });
            }
            catch (e) {
                console.error(e);
            }
            if (past >= timeout)
                clearInterval(timer);
        }, interval);
        const cancel = () => clearInterval(timer);
        const p = exports.delay(() => { }, timeout)
            .then(() => clearInterval(timer));
        resolve(p);
    });
};
function urlWithQueries(url, queries = {}) {
    const hasQuery = Object.keys(queries).length > 0;
    if (!hasQuery) {
        return url;
    }
    const queryStr = Object.keys(queries).map(key => { var _a; return `${encodeURIComponent(key)}=${encodeURIComponent((_a = queries[key]) === null || _a === void 0 ? void 0 : _a.toString())}`; }).join('&');
    return `${url}?${queryStr}`;
}
exports.urlWithQueries = urlWithQueries;
function throttlePromiseFunc(fn, interval) {
    if (interval <= 0) {
        throw new Error("Interval must be positive number");
    }
    let p = Promise.resolve();
    const generatedFunc = (...args) => {
        const ret = p.then(() => {
            console.log("in generatedFunc...", args);
            return fn(...args);
        });
        p = ret.then(() => exports.delay(() => { }, interval), () => exports.delay(() => { }, interval));
        return ret;
    };
    return generatedFunc;
}
exports.throttlePromiseFunc = throttlePromiseFunc;


/***/ }),

/***/ 39048:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Adapted from: http://www.json.org/JSON_checker/utf8_decode.c
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.utf8 = void 0;
class Utf8Decoder {
    constructor(input) {
        this.input = input;
        this.position = 0;
    }
    /**
     * Gets the next byte.
     * @returns UTF8_END if there are no more bytes, next byte otherwise.
     */
    getNextByte() {
        if (this.position >= this.input.length) {
            return Utf8Decoder.END;
        }
        const c = this.input[this.position] & 0xff;
        ++this.position;
        return c;
    }
    /**
     *  Gets the 6-bit payload of the next continuation byte.
     * @returns Contination byte if it's valid, UTF8_ERROR otherwise.
     */
    getNextContinuationByte() {
        const c = this.getNextByte();
        return (c & 0xc0) == 0x80 ? c & 0x3f : Utf8Decoder.ERROR;
    }
    /**
     * Decodes next codepoint.
     * @returns `Utf8Decoder.END` for end of stream, next codepoint if it's valid, `Utf8Decoder.ERROR` otherwise.
     */
    decodeNext() {
        if (this.position >= this.input.length) {
            return this.position === this.input.length
                ? Utf8Decoder.END
                : Utf8Decoder.ERROR;
        }
        const c = this.getNextByte();
        // Zero continuation (0 to 127)
        if ((c & 0x80) == 0) {
            return c;
        }
        // One continuation (128 to 2047)
        if ((c & 0xe0) == 0xc0) {
            const c1 = this.getNextContinuationByte();
            if (c1 >= 0) {
                const r = ((c & 0x1f) << 6) | c1;
                if (r >= 128) {
                    return r;
                }
            }
            // Two continuations (2048 to 55295 and 57344 to 65535)
        }
        else if ((c & 0xf0) == 0xe0) {
            const c1 = this.getNextContinuationByte();
            const c2 = this.getNextContinuationByte();
            if ((c1 | c2) >= 0) {
                const r = ((c & 0x0f) << 12) | (c1 << 6) | c2;
                if (r >= 2048 && (r < 55296 || r > 57343)) {
                    return r;
                }
            }
            // Three continuations (65536 to 1114111)
        }
        else if ((c & 0xf8) == 0xf0) {
            const c1 = this.getNextContinuationByte();
            const c2 = this.getNextContinuationByte();
            const c3 = this.getNextContinuationByte();
            if ((c1 | c2 | c3) >= 0) {
                const r = ((c & 0x07) << 18) | (c1 << 12) | (c2 << 6) | c3;
                if (r >= 65536 && r <= 1114111) {
                    return r;
                }
            }
        }
        return Utf8Decoder.ERROR;
    }
}
Utf8Decoder.REPLACEMENT_CHARACTER = "\uFFFD";
Utf8Decoder.END = -1;
Utf8Decoder.ERROR = -2;
var utf8;
(function (utf8) {
    function isValid(input) {
        const decoder = new Utf8Decoder(input);
        while (true) {
            const cp = decoder.decodeNext();
            switch (cp) {
                case Utf8Decoder.END:
                    return true;
                case Utf8Decoder.ERROR:
                    return false;
                default:
                // ignore
            }
        }
    }
    utf8.isValid = isValid;
    function decode(input) {
        const decoder = new Utf8Decoder(input);
        let output = "";
        while (true) {
            const cp = decoder.decodeNext();
            if (cp === Utf8Decoder.END) {
                break;
            }
            output +=
                cp !== Utf8Decoder.ERROR
                    ? String.fromCodePoint(cp)
                    : Utf8Decoder.REPLACEMENT_CHARACTER;
        }
        return output;
    }
    utf8.decode = decode;
})(utf8 = exports.utf8 || (exports.utf8 = {}));


/***/ }),

/***/ 62275:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const web_extension_1 = __importDefault(__webpack_require__(61171));
const platform = web_extension_1.default.isFirefox() ? 'firefox' : 'chrome';
exports["default"] = {
    preinstall: {
        version: '5.8.8',
        macroFolder: '/Demo'
    },
    nativeMessaging: {
        idleTimeBeforeDisconnect: 1e4 // 10 seconds
    },
    urlAfterUpgrade: 'https://ui.vision/x/idehelp?help=k_update',
    urlAfterInstall: 'https://ui.vision/x/idehelp?help=k_welcome',
    urlAfterUninstall: 'https://ui.vision/x/idehelp?help=k_why',
    performanceLimit: {
        fileCount: Infinity
    },
    xmodulesLimit: {
        unregistered: {
            ocrCommandCount: 100,
            xCommandCount: 25,
            xFileMacroCount: 10,
            proxyExecCount: 5,
            upgradeUrl: 'https://ui.vision/x/idehelp?help=k_xupgrade'
        },
        free: {
            ocrCommandCount: 250,
            xCommandCount: Infinity,
            xFileMacroCount: 20,
            proxyExecCount: 10,
            upgradeUrl: 'https://ui.vision/x/idehelp?help=k_xupgradepro'
        },
        pro: {
            ocrCommandCount: 500,
            xCommandCount: Infinity,
            xFileMacroCount: Infinity,
            proxyExecCount: Infinity,
            upgradeUrl: 'https://ui.vision/x/idehelp?help=k_xupgrade_contactsupport'
        }
    },
    xfile: {
        minVersionToReadBigFile: '1.0.10'
    },
    ocr: {
        apiList: [
            {
                "id": "1",
                "key": "kantu_only_53b8",
                "url": "https://apipro1.ocr.space/parse/image"
            },
            {
                "id": "2",
                "key": "kantu_only_53b8",
                "url": "https://apipro2.ocr.space/parse/image"
            },
            {
                "id": "3",
                "key": "kantu_only_53b8",
                "url": "https://apipro3.ocr.space/parse/image"
            }
        ],
        apiTimeout: 60 * 1000,
        singleApiTimeout: 30 * 1000,
        apiHealthyResponseTime: 20 * 1000,
        resetTime: 24 * 3600 * 1000
    },
    license: {
        api: {
            url: 'https://license1.ocr.space/api/status'
        }
    },
    icons: {
        normal: 'logo38.png',
        inverted: 'inverted_logo_38.png'
    },
    forceMigrationRemedy: false,
    iframePostMessageTimeout: 500,
    ui: {
        commandItemHeight: 35
    },
    commandRunner: {
        sendKeysMaxCharCount: 1000
    }
};


/***/ }),

/***/ 76572:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runInDesktopScreenshotEditor = exports.openDesktopScreenshotWindow = void 0;
const web_extension_1 = __importDefault(__webpack_require__(61171));
const tab_utils_1 = __webpack_require__(96836);
const open_page_1 = __webpack_require__(22491);
const DESKTOP_SCREENSHOT_PAGE_URL = web_extension_1.default.runtime.getURL('desktop_screenshot_editor.html');
exports.openDesktopScreenshotWindow = (() => {
    let lastTabId = 0;
    return (screenAvailableSize) => {
        return web_extension_1.default.tabs.get(lastTabId)
            .catch((e) => null)
            .then((tab) => {
            const api = open_page_1.openPageInTab({
                url: DESKTOP_SCREENSHOT_PAGE_URL,
                tabId: tab && tab.id,
                keep: true,
                popup: true,
                domReady: true,
                focus: true,
                width: screenAvailableSize.width / 2 + 50,
                height: screenAvailableSize.height / 2 + 100,
                left: screenAvailableSize.width / 4 - 25,
                top: screenAvailableSize.height / 4 - 50,
            });
            api.getTabId()
                .then((tabId) => {
                lastTabId = tabId;
                return tab_utils_1.activateTab(tabId);
            });
            return api;
        });
    };
})();
function runInDesktopScreenshotEditor(screenAvailableSize, req) {
    return exports.openDesktopScreenshotWindow(screenAvailableSize)
        .then(api => api.ask(req.type, req.data));
}
exports.runInDesktopScreenshotEditor = runInDesktopScreenshotEditor;


/***/ }),

/***/ 34322:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DesktopScreenshot = void 0;
var DesktopScreenshot;
(function (DesktopScreenshot) {
    let RequestType;
    (function (RequestType) {
        RequestType["DisplayVisualResult"] = "display_visual_result";
        RequestType["DisplayOcrResult"] = "display_ocr_result";
        RequestType["Capture"] = "capture";
    })(RequestType = DesktopScreenshot.RequestType || (DesktopScreenshot.RequestType = {}));
    let ImageSource;
    (function (ImageSource) {
        ImageSource[ImageSource["Storage"] = 0] = "Storage";
        ImageSource[ImageSource["HardDrive"] = 1] = "HardDrive";
        ImageSource[ImageSource["CV"] = 2] = "CV";
        ImageSource[ImageSource["DataUrl"] = 3] = "DataUrl";
    })(ImageSource = DesktopScreenshot.ImageSource || (DesktopScreenshot.ImageSource = {}));
    let RectType;
    (function (RectType) {
        RectType[RectType["Match"] = 0] = "Match";
        RectType[RectType["Reference"] = 1] = "Reference";
        RectType[RectType["BestMatch"] = 2] = "BestMatch";
        RectType[RectType["ReferenceOfBestMatch"] = 3] = "ReferenceOfBestMatch";
    })(RectType = DesktopScreenshot.RectType || (DesktopScreenshot.RectType = {}));
})(DesktopScreenshot = exports.DesktopScreenshot || (exports.DesktopScreenshot = {}));


/***/ }),

/***/ 13426:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateState = exports.getState = void 0;
const storage_1 = __importDefault(__webpack_require__(67585));
const C = __importStar(__webpack_require__(43232));
const defaultState = {
    status: C.APP_STATUS.NORMAL,
    tabIds: {
        lastActivated: [],
        lastInspect: null,
        lastRecord: null,
        toInspect: null,
        firstRecord: null,
        toRecord: null,
        lastPlay: null,
        firstPlay: null,
        toPlay: null,
        panel: null
    },
    pullback: false,
    // Note: heartBeatSecret = -1, means no heart beat available, and panel should not retry on heart beat lost
    heartBeatSecret: 0,
    // Note: disableHeartBeat = true, `checkHeartBeat` will stop working, it's useful for cases like close current tab
    disableHeartBeat: false,
    // Note: pendingPlayingTab = true, tells `getPlayTab` to wait until the current tab is closed and another tab is focused on
    pendingPlayingTab: false,
    xClickNeedCalibrationInfo: null,
    lastCsIpcSecret: null,
    closingAllWindows: false
};
function getState(optionalKey) {
    return storage_1.default.get(C.STATE_STORAGE_KEY).then(state => {
        const st = state || defaultState;
        if (typeof optionalKey === 'string') {
            return st[optionalKey];
        }
        return st;
    });
}
exports.getState = getState;
function updateState(updateFunc) {
    const fn = typeof updateFunc === 'function' ? updateFunc : (state) => (Object.assign(Object.assign({}, state), updateFunc));
    return getState().then((state) => {
        const result = fn(state);
        return storage_1.default.set(C.STATE_STORAGE_KEY, result).then(() => { });
    });
}
exports.updateState = updateState;


/***/ }),

/***/ 65277:
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
exports.getPlayTabOpenB = exports.getPlayTab = exports.withPanelIpc = exports.showPanelWindow = exports.getPanelTabIpc = exports.getInspectTabIpc = exports.getPlayTabIpc = exports.getRecordTabIpc = exports.genGetTabIpc = void 0;
const web_extension_1 = __importDefault(__webpack_require__(61171));
const ts_utils_1 = __webpack_require__(55452);
const ipc_cache_1 = __webpack_require__(54105);
const global_state_1 = __webpack_require__(13426);
const tab_utils_1 = __webpack_require__(96836);
const storage_1 = __importDefault(__webpack_require__(67585));
// Generate function to get ipc based on tabIdName and some error message
function genGetTabIpc(tabIdName, purpose) {
    return (timeout = 100, before = Infinity) => {
        return ts_utils_1.retry(() => __awaiter(this, void 0, void 0, function* () {
            const state = yield global_state_1.getState();
            const tabId = state.tabIds[tabIdName];
            if (!tabId) {
                return Promise.reject(new Error(`Error #150: No tab for ${purpose} yet`));
            }
            return web_extension_1.default.tabs.get(tabId);
        }), {
            timeout,
            retryInterval: 100,
            shouldRetry: () => true
        })()
            .then(tab => {
            if (!tab) {
                throw new Error(`Error #160: The ${purpose} tab seems to be closed`);
            }
            return ipc_cache_1.getIpcCache().get(tab.id, timeout, before)
                .catch(e => {
                throw new Error(`Error #170: No ipc available for the ${purpose} tab`);
            });
        });
    };
}
exports.genGetTabIpc = genGetTabIpc;
exports.getRecordTabIpc = genGetTabIpc('toRecord', 'recording');
exports.getPlayTabIpc = genGetTabIpc('toPlay', 'playing commands');
exports.getInspectTabIpc = genGetTabIpc('toInspect', 'inspect');
exports.getPanelTabIpc = genGetTabIpc('panel', 'dashboard');
function showPanelWindow({ params } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = yield global_state_1.getState();
        return tab_utils_1.activateTab(state.tabIds.panel, true)
            .then(() => false, () => {
            return storage_1.default.get('config')
                .then(config => {
                config = config || {};
                return (config.size || {})[config.showSidebar ? 'with_sidebar' : 'standard'];
            })
                .then((size) => __awaiter(this, void 0, void 0, function* () {
                size = size || {
                    width: 850,
                    height: 775
                };
                const urlQuery = Object.keys(params || {})
                    .map(key => {
                    return `${key}=${params[key]}`;
                })
                    .join('&');
                const base = web_extension_1.default.runtime.getURL('popup.html');
                const url = urlQuery.length > 0 ? `${base}?${urlQuery}` : base;
                yield global_state_1.updateState({ closingAllWindows: false });
                return web_extension_1.default.windows.create({
                    url,
                    type: 'popup',
                    width: size.width,
                    height: size.height
                })
                    .then((win) => {
                    if (!web_extension_1.default.isFirefox())
                        return;
                    // Refer to https://bugzilla.mozilla.org/show_bug.cgi?id=1425829
                    // Firefox New popup window appears blank until right-click
                    return ts_utils_1.delay(() => {
                        return web_extension_1.default.windows.update(win.id, {
                            width: size.width + 1,
                            height: size.height + 1
                        });
                    }, 1000);
                })
                    .then(() => ts_utils_1.delay(() => true, 2000));
            }));
        });
    });
}
exports.showPanelWindow = showPanelWindow;
function withPanelIpc(options) {
    return showPanelWindow(options)
        .then(() => exports.getPanelTabIpc(6 * 1000));
}
exports.withPanelIpc = withPanelIpc;
// Get the current tab for play, if url provided, it will be loaded in the tab
function getPlayTab(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Note: update error message to be more user friendly. But the original message is kept as comment
        // const theError  = new Error('Either a played tab or a url must be provided to start playing')
        const theError = new Error('Error #180: No connection to browser tab');
        const createOne = (url) => __awaiter(this, void 0, void 0, function* () {
            if (!url)
                throw theError;
            const tab = yield tab_utils_1.createTab(url);
            yield global_state_1.updateState(state => (Object.assign(Object.assign({}, state), { tabIds: Object.assign(Object.assign({}, state.tabIds), { lastPlay: state.tabIds.toPlay, toPlay: tab.id, firstPlay: tab.id }) })));
            return tab;
        });
        const runRealLogic = (state) => {
            if (!state.tabIds.toPlay && !url) {
                throw theError;
            }
            if (!state.tabIds.toPlay) {
                return createOne(url);
            }
            return tab_utils_1.getTab(state.tabIds.toPlay)
                .then((tab) => {
                if (!url) {
                    return tab;
                }
                // Note: must disable ipcCache manually here, so that further messages
                // won't be sent the old ipc
                ipc_cache_1.getIpcCache().disable(tab.id);
                const finalUrl = (() => {
                    try {
                        const u = new URL(url, tab.url);
                        return u.toString();
                    }
                    catch (e) {
                        return url;
                    }
                })();
                return tab_utils_1.updateUrlForTab(tab, finalUrl, 'open');
            }, () => createOne(url));
        };
        const state = yield global_state_1.getState();
        if (state.pendingPlayingTab) {
            yield ts_utils_1.until('pendingPlayingTab reset', () => {
                return {
                    pass: !state.pendingPlayingTab,
                    result: true
                };
            }, 100, 5000);
        }
        return runRealLogic(state);
    });
}
exports.getPlayTab = getPlayTab;
// Get the current tab for play, if url provided, it will be loaded in the tab
function getPlayTabOpenB(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Note: update error message to be more user friendly. But the original message is kept as comment
        // const theError  = new Error('Either a played tab or a url must be provided to start playing')
        const theError = new Error('Error #180: No connection to browser tab');
        const createOne = (url) => __awaiter(this, void 0, void 0, function* () {
            if (!url)
                throw theError;
            const tab = yield tab_utils_1.createTab(url);
            yield global_state_1.updateState(state => (Object.assign(Object.assign({}, state), { tabIds: Object.assign(Object.assign({}, state.tabIds), { lastPlay: state.tabIds.toPlay, toPlay: tab.id, firstPlay: tab.id }) })));
            return tab;
        });
        const runRealLogic = (state) => {
            if (!state.tabIds.toPlay && !url) {
                throw theError;
            }
            if (!state.tabIds.toPlay) {
                return createOne(url);
            }
            return tab_utils_1.getTab(state.tabIds.toPlay)
                .then((tab) => {
                if (!url) {
                    return tab;
                }
                // Note: must disable ipcCache manually here, so that further messages
                // won't be sent the old ipc
                ipc_cache_1.getIpcCache().disable(tab.id);
                const finalUrl = (() => {
                    try {
                        const u = new URL(url, tab.url);
                        return u.toString();
                    }
                    catch (e) {
                        return url;
                    }
                })();
                return tab_utils_1.updateUrlForTab(tab, finalUrl, 'openBrowser');
            }, () => createOne(url));
        };
        const state = yield global_state_1.getState();
        if (state.pendingPlayingTab) {
            yield ts_utils_1.until('pendingPlayingTab reset', () => {
                return {
                    pass: !state.pendingPlayingTab,
                    result: true
                };
            }, 100, 5000);
        }
        return runRealLogic(state);
    });
}
exports.getPlayTabOpenB = getPlayTabOpenB;


/***/ }),

/***/ 37584:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContextMenuService = exports.ContextMenuService = void 0;
const ts_utils_1 = __webpack_require__(55452);
const web_extension_1 = __importDefault(__webpack_require__(61171));
class ContextMenuService {
    constructor() {
        this.menuInfos = [];
        this.bound = false;
    }
    createMenus(menuInfos) {
        this.menuInfos = menuInfos;
        this.bindOnClick();
        return ts_utils_1.flow(...menuInfos.map(info => () => {
            const copy = Object.assign({}, info);
            delete copy.onclick;
            return web_extension_1.default.contextMenus.create(copy);
        }))
            .then(() => { });
    }
    destroyMenus() {
        this.menuInfos = [];
        return web_extension_1.default.contextMenus.removeAll();
    }
    bindOnClick() {
        if (this.bound) {
            return;
        }
        this.bound = true;
        web_extension_1.default.contextMenus.onClicked.addListener((info, tab) => {
            var _a, _b;
            const id = info.menuItemId;
            for (let i = 0, len = this.menuInfos.length; i < len; i++) {
                if (this.menuInfos[i].id === id) {
                    (_b = (_a = this.menuInfos[i]).onclick) === null || _b === void 0 ? void 0 : _b.call(_a, info);
                    break;
                }
            }
        });
    }
}
exports.ContextMenuService = ContextMenuService;
exports.getContextMenuService = ts_utils_1.singletonGetter(() => new ContextMenuService());


/***/ }),

/***/ 49356:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MethodTypeInvocationNames = exports.MethodTypeFriendlyNames = exports.PublicMethodTypes = void 0;
/**
 * Non-external method types which the user can use via UI.
 */
exports.PublicMethodTypes = [
    1 /* GetFileSystemEntries */,
    2 /* GetDirectories */,
    3 /* GetFiles */,
    4 /* DirectoryExists */,
    5 /* FileExists */,
    8 /* CreateDirectory */,
    9 /* RemoveDirectory */,
    10 /* CopyFile */,
    11 /* MoveFile */,
    12 /* DeleteFile */,
    13 /* ReadAllText */,
    14 /* WriteAllText */,
    15 /* AppendAllText */,
    16 /* ReadAllBytes */,
    17 /* WriteAllBytes */,
    18 /* AppendAllBytes */
];
exports.MethodTypeFriendlyNames = [
    "GetVersion",
    "GetFileSystemEntries",
    "GetDirectories",
    "GetFiles",
    "GetFileSystemEntryInfo",
    "GetSpecialFolderPath",
    "DirectoryExists",
    "FileExists",
    "CreateDirectory",
    "RemoveDirectory",
    "CopyFile",
    "MoveFile",
    "DeleteFile",
    "ReadAllText",
    "WriteAllText",
    "AppendAllText",
    "ReadAllBytes",
    "WriteAllBytes",
    "AppendAllBytes",
    "GetMaxFileRange",
    "GetFileSize",
    "ReadFileRange",
    "RunProcess"
];
exports.MethodTypeInvocationNames = [
    "get_version",
    "get_file_system_entries",
    "get_directories",
    "get_files",
    "get_file_system_entry_info",
    "get_special_folder_path",
    "directory_exists",
    "file_exists",
    "create_directory",
    "remove_directory",
    "copy_file",
    "move_file",
    "delete_file",
    "read_all_text",
    "write_all_text",
    "append_all_text",
    "read_all_bytes",
    "write_all_bytes",
    "append_all_bytes",
    "get_max_file_range",
    "get_file_size",
    "read_file_range",
    "run_process"
];


/***/ }),

/***/ 65065:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNativeFileSystemAPI = exports.SpecialFolder = void 0;
const constants_1 = __webpack_require__(49356);
const kantu_file_access_host_1 = __webpack_require__(39668);
const ts_utils_1 = __webpack_require__(55452);
const log_1 = __importDefault(__webpack_require__(77242));
const path_1 = __importDefault(__webpack_require__(84037));
const utf8_1 = __webpack_require__(39048);
const base64_1 = __webpack_require__(43745);
const utils_1 = __webpack_require__(63370);
const semver_1 = __importDefault(__webpack_require__(36625));
const config_1 = __importDefault(__webpack_require__(62275));
var SpecialFolder;
(function (SpecialFolder) {
    SpecialFolder[SpecialFolder["UserProfile"] = 0] = "UserProfile";
    SpecialFolder[SpecialFolder["UserDesktop"] = 1] = "UserDesktop";
})(SpecialFolder = exports.SpecialFolder || (exports.SpecialFolder = {}));
exports.getNativeFileSystemAPI = ts_utils_1.singletonGetter(() => {
    const nativeHost = new kantu_file_access_host_1.KantuFileAccessHost();
    let pReady = nativeHost.connectAsync().catch(e => {
        log_1.default.warn('pReady - error', e);
        throw e;
    });
    let pendingRequestCount = 0;
    const api = constants_1.MethodTypeInvocationNames.reduce((prev, method) => {
        const camel = ts_utils_1.snakeToCamel(method);
        if (prev[camel]) {
            return prev;
        }
        prev[camel] = (() => {
            const fn = (params) => pReady.then(() => {
                pendingRequestCount += 1;
                return nativeHost.invokeAsync(method, params);
            })
                .then((data) => {
                pendingRequestCount -= 1;
                return data;
            }, e => {
                //pendingRequestCount -= 1 // caused ~10s delay if no xmodule installed
                pendingRequestCount = 0;
                // Note: Looks like for now whenever there is an error, you have to reconnect native host
                // otherwise, all commands return "Disconnected" afterwards
                const typeSafeAPI = api;
                typeSafeAPI.reconnect().catch(() => { });
                throw e;
            });
            return fn;
        })();
        return prev;
    }, {
        reconnect: () => {
            return ts_utils_1.until('pendingRequestCount === 0', () => {
                return {
                    pass: pendingRequestCount === 0,
                    result: true
                };
            })
                .then(() => {
                log_1.default(`FileSystem - reconnect`, new Error().stack);
                nativeHost.disconnect();
                pReady = nativeHost.connectAsync();
                return pReady.then(() => api);
            });
        },
        getEntries: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.getFileSystemEntries(params)
                .then(res => {
                const { errorCode, entries } = res;
                if (params.brief) {
                    return Promise.resolve({
                        errorCode,
                        entries: entries.map((name) => ({
                            name,
                            length: 0,
                            isDirectory: false,
                            lastWriteTime: 0
                        }))
                    });
                }
                return Promise.all(entries.map((name) => {
                    const entryPath = path_1.default.join(params.path, name);
                    return typeSafeAPI.getFileSystemEntryInfo({ path: entryPath })
                        .then(info => ({
                        name,
                        length: info.length,
                        isDirectory: info.isDirectory,
                        lastWriteTime: info.lastWriteTime
                    }));
                }))
                    .then(entryInfos => ({
                    errorCode,
                    entries: entryInfos
                }));
            });
        },
        ensureDir: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.directoryExists({
                path: params.path
            })
                .then(exists => {
                if (exists)
                    return true;
                return typeSafeAPI.ensureDir({ path: path_1.default.dirname(params.path) })
                    .then(done => {
                    if (!done)
                        return false;
                    return typeSafeAPI.createDirectory({ path: params.path });
                });
            })
                .catch(e => false);
        },
        readBigFile: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.getFileSize(params)
                .then((fileSize) => {
                if (fileSize === 0) {
                    return new Uint8Array(0);
                }
                const content = [];
                const go = (pos) => {
                    return typeSafeAPI.readFileRange({
                        path: params.path,
                        rangeStart: pos
                    })
                        .then(result => {
                        const data = base64_1.base64.decode(result.buffer);
                        if (data) {
                            for (let i = 0; i < data.length; i++) {
                                content.push(data[i]);
                            }
                        }
                        if (result.rangeEnd <= pos || result.rangeEnd >= fileSize) {
                            return new Uint8Array(content);
                        }
                        return go(result.rangeEnd);
                    });
                };
                return go(0);
            });
        },
        isReadBigFileSupported: () => {
            const typeSafeAPI = api;
            return typeSafeAPI.getVersion()
                .then(version => {
                return !semver_1.default.lt(version, config_1.default.xfile.minVersionToReadBigFile);
            });
        },
        readAllTextCompat: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.isReadBigFileSupported()
                .then(supported => {
                if (!supported) {
                    return typeSafeAPI.readAllText(params);
                }
                return typeSafeAPI.readBigFile(params)
                    .then(content => {
                    const text = utf8_1.utf8.decode(content);
                    return {
                        errorCode: 0,
                        content: text
                    };
                });
            });
        },
        readAllBytesCompat: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.isReadBigFileSupported()
                .then(supported => {
                if (!supported) {
                    return typeSafeAPI.readAllBytes(params);
                }
                return typeSafeAPI.readBigFile(params)
                    .then(content => {
                    return utils_1.blobToDataURL(new Blob([content]))
                        .then(dataUrl => ({
                        errorCode: 0,
                        content: dataUrl
                    }));
                });
            });
        },
    });
    return api;
});


/***/ }),

/***/ 39668:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KantuFileAccessHost = void 0;
const native_host_1 = __webpack_require__(35705);
class KantuFileAccessHost extends native_host_1.NativeMessagingHost {
    constructor() {
        super(KantuFileAccessHost.HOST_NAME);
    }
}
exports.KantuFileAccessHost = KantuFileAccessHost;
KantuFileAccessHost.HOST_NAME = "com.a9t9.kantu.file_access";


/***/ }),

/***/ 30399:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLogService = exports.LogService = void 0;
const filesystem_1 = __webpack_require__(65065);
const xfile_1 = __webpack_require__(1577);
const path_1 = __importDefault(__webpack_require__(84037));
const log_1 = __importDefault(__webpack_require__(77242));
const ts_utils_1 = __webpack_require__(55452);
const storage_1 = __webpack_require__(16058);
class LogService {
    constructor(params = {}) {
        this.pDirReady = Promise.resolve(false);
        this.logsDir = '';
        this.fileName = 'log.txt';
        this.waitForStorageManager = () => Promise.resolve(storage_1.getStorageManager());
        this.check();
        this.updateLogFileName();
        if (params.waitForStorageManager) {
            this.waitForStorageManager = params.waitForStorageManager;
        }
    }
    updateLogFileName() {
        const now = new Date();
        const dateStr = `${now.getFullYear()}${ts_utils_1.pad2digits(now.getMonth() + 1)}${ts_utils_1.pad2digits(now.getDate())}`;
        const timeStr = [now.getHours(), now.getMinutes(), now.getSeconds()].map(n => ts_utils_1.pad2digits(n)).join('');
        this.fileName = `log-${dateStr}-${timeStr}.txt`;
    }
    check() {
        this.pDirReady = xfile_1.getXFile().sanityCheck(true).then(isSane => {
            if (!isSane) {
                return false;
            }
            const { rootDir } = xfile_1.getXFile().getCachedConfig();
            if (!rootDir) {
                return false;
            }
            this.logsDir = path_1.default.join(rootDir, 'logs');
            return filesystem_1.getNativeFileSystemAPI().ensureDir({
                path: this.logsDir
            });
        });
        return this.pDirReady;
    }
    log(str) {
        return this.waitForStorageManager()
            .then(storageManager => {
            if (!storageManager.isXFileMode()) {
                return false;
            }
            return xfile_1.getXFile().sanityCheck(true)
                .then(() => this.pDirReady)
                .then((ready) => {
                if (!ready) {
                    return false;
                }
                return filesystem_1.getNativeFileSystemAPI().appendAllText({
                    path: path_1.default.join(this.logsDir, this.fileName),
                    content: ensureLineBreak(str)
                });
            }, (e) => {
                log_1.default.warn('Failed to log: ', e.message);
                return false;
            });
        });
    }
    logWithTime(str) {
        return this.log(`${new Date().toISOString()} - ${str}`);
    }
    logTo(filePath, str) {
        return this.waitForStorageManager()
            .then(storageManager => {
            if (!storageManager.isXFileMode()) {
                return false;
            }
            return xfile_1.getXFile().sanityCheck(true)
                .then((ready) => {
                if (!ready) {
                    return false;
                }
                const dirPath = path_1.default.dirname(filePath);
                return filesystem_1.getNativeFileSystemAPI().ensureDir({ path: dirPath })
                    .then((dirReady) => {
                    if (!dirReady) {
                        return false;
                    }
                    return filesystem_1.getNativeFileSystemAPI().appendAllText({
                        path: filePath,
                        content: ensureLineBreak(str)
                    });
                });
            }, (e) => {
                log_1.default.warn('Failed to log: ', e.message);
                return false;
            });
        });
    }
}
exports.LogService = LogService;
exports.getLogService = ts_utils_1.singletonGetter(() => new LogService());
function ensureLineBreak(str) {
    if (str.length === 0) {
        return str;
    }
    if (str.charAt(str.length - 1) !== '\n') {
        return str + '\n';
    }
    return str;
}


/***/ }),

/***/ 35705:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/// <reference types="chrome"/>
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
exports.NativeMessagingHost = void 0;
const config_1 = __importDefault(__webpack_require__(62275));
const lodash_debounce_1 = __importDefault(__webpack_require__(91296));
class InvocationQueueItem {
    constructor(id, method, params, callback) {
        this.requestObject = {
            id,
            method,
            params
        };
        this.callback = callback;
    }
    get request() {
        return this.requestObject;
    }
}
class NativeMessagingHost {
    constructor(hostName) {
        this.ongoingInvocationCount = 0;
        this.debouncedDisconnectOnIdle = lodash_debounce_1.default(() => {
            if (this.ongoingInvocationCount === 0) {
                this.disconnect();
            }
            else {
                this.debouncedDisconnectOnIdle();
            }
        }, config_1.default.nativeMessaging.idleTimeBeforeDisconnect);
        this.internalHostName = hostName;
        this.nextInvocationId = 1;
        this.queue = new Array();
        this.handleMessage = this.handleMessage.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
    }
    processResponse(id, result, error) {
        let callback = undefined;
        for (let i = 0; i < this.queue.length; ++i) {
            const entry = this.queue[i];
            if (entry.request.id === id) {
                callback = entry.callback;
                this.queue.splice(i, 1);
                break;
            }
        }
        if (callback) {
            callback(result, error);
        }
    }
    handleMessage(message) {
        const response = message;
        if (typeof response.id !== "number") {
            return;
        }
        this.ongoingInvocationCount = Math.max(0, this.ongoingInvocationCount - 1);
        this.processResponse(response.id, response.result, response.error);
        if (response.error) {
            this.disconnect();
        }
    }
    handleDisconnect() {
        this.disconnect();
    }
    get hostName() {
        return this.internalHostName;
    }
    connectAsync() {
        // Commented out the following line to keep the connection to native messaging
        // to keep the service worker always alive
        // note that it only applies to Chrome 100+
        // reference: https://github.com/teamdocs/selenium-ide-chrome-light-2017/issues/884#issuecomment-1088739538
        //
        // this.debouncedDisconnectOnIdle();
        if (this.port) {
            return this.invokeAsync("get_version", undefined);
        }
        this.port = chrome.runtime.connectNative(this.hostName);
        this.port.onMessage.addListener(this.handleMessage);
        this.port.onDisconnect.addListener(this.handleDisconnect);
        this.ongoingInvocationCount = 0;
        return this.invokeAsync("get_version", undefined);
    }
    disconnect() {
        const message = chrome.runtime.lastError && chrome.runtime.lastError.message || "Disconnected";
        if (this.port) {
            this.port.disconnect();
            this.port = undefined;
        }
        // Discard all queued invocations
        const invocationIdArray = this.queue.map(x => x.request.id);
        for (const id of invocationIdArray) {
            this.processResponse(id, undefined, { message });
        }
        this.queue = new Array();
    }
    invoke(method, params, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.port) {
                yield this.connectAsync();
            }
            const id = this.nextInvocationId++;
            const item = new InvocationQueueItem(id, method, params, callback);
            this.ongoingInvocationCount++;
            this.queue.push(item);
            this.port.postMessage(item.request);
            // "Chrome 100: native messaging port keeps service worker alive"
            // reference: https://developer.chrome.com/docs/extensions/whatsnew/#m100-native-msg-lifetime
            //
            // Commented out the following line to keep the connection to native messaging
            // to keep the service worker always alive
            // note that it only applies to Chrome 100+
            // reference: https://github.com/teamdocs/selenium-ide-chrome-light-2017/issues/884#issuecomment-1088739538
            //
            // this.debouncedDisconnectOnIdle();
        });
    }
    invokeAsync(method, params) {
        return new Promise((resolve, reject) => {
            this.invoke(method, params, (result, error) => {
                if (chrome.runtime.lastError) {
                    error = new Error(chrome.runtime.lastError.message);
                }
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.NativeMessagingHost = NativeMessagingHost;


/***/ }),

/***/ 21560:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseProxyManager = void 0;
const registry_1 = __webpack_require__(55290);
class BaseProxyManager {
    constructor() {
        this.proxy = null;
        this.registry = registry_1.createListenerRegistry();
    }
    getProxy() {
        return Promise.resolve(this.proxy);
    }
    getAuth(host, port) {
        if (!this.proxy || !this.proxy.username) {
            return null;
        }
        // port could be number, so must convert it to string before compare
        if (this.proxy.host === host && this.proxy.port === '' + port) {
            return {
                username: this.proxy.username,
                password: this.proxy.password
            };
        }
        return null;
    }
    onChange(listener) {
        this.registry.add('change', listener);
        return () => { this.registry.remove('change', listener); };
    }
}
exports.BaseProxyManager = BaseProxyManager;


/***/ }),

/***/ 22078:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProxyHttpAuth = void 0;
const web_extension_1 = __importDefault(__webpack_require__(61171));
class ProxyHttpAuth {
    constructor(params) {
        this.unbindListener = () => { };
        this.bound = false;
        this.getAuth = params.getAuth;
    }
    bind() {
        if (this.bound) {
            return;
        }
        this.bound = true;
        const listener = this.onAuthRequired.bind(this);
        web_extension_1.default.webRequest.onAuthRequired.addListener(listener, { urls: ['<all_urls>'] }, ['blocking']);
        this.unbindListener = () => web_extension_1.default.webRequest.onAuthRequired.removeListener(listener);
    }
    unbind() {
        if (!this.bound) {
            return;
        }
        this.unbindListener();
        this.bound = false;
    }
    onAuthRequired(details) {
        if (!details.isProxy) {
            return {};
        }
        const auth = this.getAuth(details.challenger.host, '' + details.challenger.port);
        return auth ? { authCredentials: auth } : {};
    }
}
exports.ProxyHttpAuth = ProxyHttpAuth;


/***/ }),

/***/ 51829:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseProxyUrl = exports.setProxy = exports.getProxyManager = void 0;
const types_1 = __webpack_require__(41559);
const listener_api_proxy_1 = __webpack_require__(4465);
const settings_api_proxy_1 = __webpack_require__(60131);
const pac_api_proxy_1 = __webpack_require__(60446);
const http_auth_1 = __webpack_require__(22078);
const messages_1 = __importDefault(__webpack_require__(29319));
const allAvailableProxyManagers = [
    new listener_api_proxy_1.ProxyManagerViaListenerAPI(),
    new pac_api_proxy_1.ProxyManagerViaPacAPI(),
    new settings_api_proxy_1.ProxyManagerViaSettingsAPI()
];
const proxyHttpAuth = new http_auth_1.ProxyHttpAuth({
    getAuth: (host, port) => {
        return getProxyManager().getAuth(host, port);
    }
});
function getProxyManager() {
    for (let i = 0, len = allAvailableProxyManagers.length; i < len; i++) {
        if (allAvailableProxyManagers[i].isSupported()) {
            return allAvailableProxyManagers[i];
        }
    }
    throw new Error('Unable to use proxy');
}
exports.getProxyManager = getProxyManager;
function setProxy(proxy) {
    return new Promise((resolve, reject) => {
        const proxyManager = getProxyManager();
        // Default to not incognito mode
        proxyManager.isControllable(false)
            .then((controllable) => {
            if (!controllable) {
                throw new Error(messages_1.default.proxy.notControllable);
            }
            proxyHttpAuth.bind();
            if (!proxy) {
                return proxyManager.reset();
            }
            return proxyManager.setProxy(proxy);
        })
            .then(resolve, reject);
    });
}
exports.setProxy = setProxy;
function parseProxyUrl(proxyUrl, usernameAndPassword) {
    const url = new URL(proxyUrl);
    // URL has problem parsing non-standard url like socks4://0.0.0.0
    // hostname will be empty string, so we have to replace protocol with http
    const httpUrl = new URL(proxyUrl.replace(/\s*socks[45]/i, 'http'));
    const host = httpUrl.hostname;
    const type = (() => {
        switch (url.protocol) {
            case 'http:':
                return types_1.ProxyScheme.Http;
            case 'https:':
                return types_1.ProxyScheme.Https;
            case 'socks4:':
                return types_1.ProxyScheme.Socks4;
            case 'socks5:':
                return types_1.ProxyScheme.Socks5;
            default:
                throw new Error('Invalid proxy protocol');
        }
    })();
    const port = (() => {
        if (httpUrl.port) {
            return httpUrl.port;
        }
        switch (type) {
            case types_1.ProxyScheme.Http:
                return '80';
            case types_1.ProxyScheme.Https:
                return '443';
            case types_1.ProxyScheme.Socks4:
            case types_1.ProxyScheme.Socks5:
                return '1080';
        }
    })();
    if (!host || !host.length) {
        throw new Error('No host found in proxy');
    }
    if (!port || isNaN(parseInt(port, 10))) {
        throw new Error('No valid port found in proxy');
    }
    const { username, password } = (() => {
        if (!usernameAndPassword || !usernameAndPassword.length) {
            return {};
        }
        const index = usernameAndPassword.indexOf(',');
        if (index === -1) {
            return { username: usernameAndPassword };
        }
        return {
            username: usernameAndPassword.substr(0, index),
            password: usernameAndPassword.substr(index + 1)
        };
    })();
    return {
        type,
        host,
        port,
        username,
        password
    };
}
exports.parseProxyUrl = parseProxyUrl;


/***/ }),

/***/ 4465:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProxyManagerViaListenerAPI = exports.convertToFirefoxProxyInfo = void 0;
const types_1 = __webpack_require__(41559);
const base_1 = __webpack_require__(21560);
function convertToFirefoxProxyInfo(proxy) {
    return Object.assign(Object.assign({}, proxy), { type: (proxy.type === types_1.ProxyScheme.Socks5 ? types_1.FirefoxProxyType.Socks5 : proxy.type) });
}
exports.convertToFirefoxProxyInfo = convertToFirefoxProxyInfo;
class ProxyManagerViaListenerAPI extends base_1.BaseProxyManager {
    constructor() {
        super();
        this.unbind = () => { };
        this.isBound = false;
    }
    isSupported() {
        return typeof browser !== 'undefined' && browser.proxy && browser.proxy.onRequest;
    }
    isControllable(incognito) {
        return Promise.resolve(true);
    }
    setProxy(proxy) {
        this.bind();
        this.proxy = proxy;
        this.notifyProxyChange();
        return Promise.resolve();
    }
    reset() {
        this.proxy = null;
        this.notifyProxyChange();
        return Promise.resolve();
    }
    notifyProxyChange() {
        setTimeout(() => {
            this.registry.fire('change', this.proxy);
        }, 10);
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const listener = this.onProxyRequest.bind(this);
        browser.proxy.onRequest.addListener(listener, { urls: ['<all_urls>'] });
        this.unbind = () => browser.proxy.onRequest.removeListener(listener);
    }
    onProxyRequest(requestInfo) {
        return this.proxy ? convertToFirefoxProxyInfo(this.proxy) : { type: types_1.FirefoxProxyType.Direct };
    }
}
exports.ProxyManagerViaListenerAPI = ProxyManagerViaListenerAPI;


/***/ }),

/***/ 60446:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProxyManagerViaPacAPI = void 0;
const base_1 = __webpack_require__(21560);
const listener_api_proxy_1 = __webpack_require__(4465);
const ipc_cs_1 = __importDefault(__webpack_require__(41471));
const log_1 = __importDefault(__webpack_require__(77242));
const ts_utils_1 = __webpack_require__(55452);
class ProxyManagerViaPacAPI extends base_1.BaseProxyManager {
    constructor() {
        super();
        this.unbind = () => { };
        this.isBound = false;
    }
    isSupported() {
        return typeof browser !== 'undefined' && browser.proxy && browser.proxy.register;
    }
    isControllable() {
        return Promise.resolve(true);
    }
    setProxy(proxy) {
        this.bind();
        this.proxy = proxy;
        this.notifyProxyChange();
        // Not sure if 1s delay could be omitted. Just keep it here in case legacy pac api
        // takes time before proxy takes effect
        return browser.runtime.sendMessage({
            cmd: 'SET_PROXY',
            data: proxy ? listener_api_proxy_1.convertToFirefoxProxyInfo(proxy) : null
        }, { toProxyScript: true })
            .then(() => ts_utils_1.delay(() => { }, 1000));
    }
    reset() {
        this.proxy = null;
        this.notifyProxyChange();
        return ipc_cs_1.default.ask('PANEL_SET_PROXY_FOR_PAC', { proxy: null })
            .then(() => ts_utils_1.delay(() => { }, 1000));
    }
    getAuth(host, port) {
        if (!this.proxy || !this.proxy.username) {
            return null;
        }
        if (this.proxy.host === host && this.proxy.port === port) {
            return {
                username: this.proxy.username,
                password: this.proxy.password
            };
        }
        return null;
    }
    notifyProxyChange() {
        setTimeout(() => {
            this.registry.fire('change', this.proxy);
        }, 10);
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const pacListener = (data) => {
            if (data.type === 'PROXY_LOG') {
                log_1.default('PROXY_LOG', data);
            }
        };
        browser.proxy.register('firefox_pac.js');
        browser.runtime.onMessage.addListener(pacListener);
        this.unbind = () => {
            browser.proxy.unregister();
            browser.runtime.onMessage.removeListener(pacListener);
        };
    }
}
exports.ProxyManagerViaPacAPI = ProxyManagerViaPacAPI;


/***/ }),

/***/ 60131:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProxyManagerViaSettingsAPI = void 0;
const base_1 = __webpack_require__(21560);
class ProxyManagerViaSettingsAPI extends base_1.BaseProxyManager {
    constructor() {
        super();
        this.isBound = false;
    }
    isSupported() {
        return typeof chrome !== 'undefined' && chrome.proxy && chrome.proxy.settings && chrome.proxy.settings.onChange;
    }
    isControllable(incognito) {
        return new Promise((resolve, reject) => {
            chrome.proxy.settings.get({ incognito: !!incognito }, (details) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                const { levelOfControl } = details;
                const inControl = ['controllable_by_this_extension', 'controlled_by_this_extension'].indexOf(levelOfControl) !== -1;
                resolve(inControl);
            });
        });
    }
    setProxy(proxy) {
        this.bindProxyChange();
        this.proxy = proxy;
        return new Promise((resolve, reject) => {
            chrome.proxy.settings.set({
                value: {
                    mode: 'fixed_servers',
                    rules: {
                        singleProxy: {
                            scheme: proxy.type,
                            host: proxy.host,
                            port: parseInt(proxy.port, 10)
                        }
                    }
                }
            }, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    }
    reset() {
        return new Promise((resolve, reject) => {
            chrome.proxy.settings.set({
                value: {
                    mode: 'direct'
                }
            }, () => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    }
    bindProxyChange() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        chrome.proxy.settings.onChange.addListener((details) => {
            const proxyData = this.fromChromeDetails(details);
            // Proxy data returned by fromChromeDetails doesn't contain username/password
            // so must avoid it overwrites the one with auth info
            this.setLocalProxyIfIsNew(proxyData);
            this.registry.fire('change', proxyData);
        });
    }
    fetchProxyFromSettings() {
        return new Promise((resolve, reject) => {
            chrome.proxy.settings.get({ incognito: false }, (details) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                const proxyData = this.fromChromeDetails(details);
                this.setLocalProxyIfIsNew(proxyData);
                this.registry.fire('change', proxyData);
                resolve();
            });
        });
    }
    fromChromeDetails(details) {
        if (details.value.mode !== 'fixed_servers' || !details.value.rules || !details.value.rules.singleProxy) {
            return null;
        }
        const singleProxy = details.value.rules.singleProxy;
        return {
            host: singleProxy.host,
            port: '' + singleProxy.port,
            type: singleProxy.scheme
        };
    }
    setLocalProxyIfIsNew(proxyData) {
        var _a, _b;
        if ((proxyData === null || proxyData === void 0 ? void 0 : proxyData.host) !== ((_a = this.proxy) === null || _a === void 0 ? void 0 : _a.host) ||
            (proxyData === null || proxyData === void 0 ? void 0 : proxyData.port) !== ((_b = this.proxy) === null || _b === void 0 ? void 0 : _b.port)) {
            this.proxy = proxyData;
        }
    }
}
exports.ProxyManagerViaSettingsAPI = ProxyManagerViaSettingsAPI;


/***/ }),

/***/ 41559:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirefoxProxyType = exports.ProxyScheme = void 0;
var ProxyScheme;
(function (ProxyScheme) {
    ProxyScheme["Http"] = "http";
    ProxyScheme["Https"] = "https";
    ProxyScheme["Socks4"] = "socks4";
    ProxyScheme["Socks5"] = "socks5";
})(ProxyScheme = exports.ProxyScheme || (exports.ProxyScheme = {}));
var FirefoxProxyType;
(function (FirefoxProxyType) {
    FirefoxProxyType["Direct"] = "direct";
    FirefoxProxyType["Http"] = "http";
    FirefoxProxyType["Https"] = "https";
    FirefoxProxyType["Socks4"] = "socks4";
    FirefoxProxyType["Socks5"] = "socks";
})(FirefoxProxyType = exports.FirefoxProxyType || (exports.FirefoxProxyType = {}));


/***/ }),

/***/ 52152:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleDelegatedBrowserFileSystemAPI = exports.delegateBrowserFileSystemAPI = exports.getBrowserFileSystem = void 0;
const filesystem_1 = __importDefault(__webpack_require__(90942));
const FS_API = 'fs_api';
const fsFuncs = [
    'list',
    'readFile',
    'writeFile',
    'removeFile',
    'moveFile',
    'copyFile',
    'getDirectory',
    'getMetadata',
    'exists',
    'existsStat',
    'ensureDirectory',
    'rmdir',
    'rmdirR',
];
function getBrowserFileSystem() {
    return filesystem_1.default !== null && filesystem_1.default !== void 0 ? filesystem_1.default : delegateBrowserFileSystemAPI();
}
exports.getBrowserFileSystem = getBrowserFileSystem;
function delegateBrowserFileSystemAPI() {
    return fsFuncs.reduce((api, funcName) => {
        api[funcName] = (...args) => {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    type: FS_API,
                    method: funcName,
                    args: JSON.stringify(args)
                }, (response) => {
                    if (response.error.length > 0) {
                        return reject(new Error(response.error));
                    }
                    if (response.result === "undefined") {
                        return resolve(undefined);
                    }
                    try {
                        resolve(JSON.parse(response.result));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            });
        };
        return api;
    }, {});
}
exports.delegateBrowserFileSystemAPI = delegateBrowserFileSystemAPI;
function handleDelegatedBrowserFileSystemAPI() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if ((message === null || message === void 0 ? void 0 : message.type) != FS_API) {
            return;
        }
        if (!filesystem_1.default) {
            sendResponse({
                result: "",
                error: "fs is not available on handler side",
            });
            return true;
        }
        const method = message.method;
        if (!fsFuncs.includes(method)) {
            sendResponse({
                result: "",
                error: `unknown fs method: ${method}`,
            });
            return true;
        }
        let args;
        try {
            args = JSON.parse(message.args);
        }
        catch (e) {
            sendResponse({
                result: "",
                error: e.message
            });
            return true;
        }
        const fn = filesystem_1.default[method];
        fn(...args).then((data) => {
            sendResponse({
                result: data === undefined ? "undefined" : JSON.stringify(data),
                error: "",
            });
        }, (e) => {
            sendResponse({
                result: "",
                error: e.message
            });
        });
        return true;
    });
}
exports.handleDelegatedBrowserFileSystemAPI = handleDelegatedBrowserFileSystemAPI;


/***/ }),

/***/ 66500:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ENOTEMPTY = exports.ENOTDIR = exports.ENOENT = exports.EMFILE = exports.EISDIR = exports.EEXIST = exports.EACCES = void 0;
const ts_utils_1 = __webpack_require__(55452);
// reference: https://nodejs.org/api/errors.html#errors_common_system_errors
exports.EACCES = ts_utils_1.errorClassFactory('EACCES');
exports.EEXIST = ts_utils_1.errorClassFactory('EEXIST');
exports.EISDIR = ts_utils_1.errorClassFactory('EISDIR');
exports.EMFILE = ts_utils_1.errorClassFactory('EMFILE');
exports.ENOENT = ts_utils_1.errorClassFactory('ENOENT');
exports.ENOTDIR = ts_utils_1.errorClassFactory('ENOTDIR');
exports.ENOTEMPTY = ts_utils_1.errorClassFactory('ENOTEMPTY');


/***/ }),

/***/ 62976:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getErrorMessageForCode = exports.ErrorWithCode = exports.getNativeFileSystemFlatStorage = exports.NativeFileSystemFlatStorage = void 0;
const storage_1 = __webpack_require__(92687);
const filesystem_1 = __webpack_require__(65065);
const path_1 = __importDefault(__webpack_require__(84037));
const utils_1 = __webpack_require__(63370);
const ts_utils_1 = __webpack_require__(55452);
class NativeFileSystemFlatStorage extends storage_1.FlatStorage {
    constructor(opts) {
        super({
            encode: opts.encode,
            decode: opts.decode
        });
        this.listFilter = (list) => list;
        this.displayedCount = 0;
        this.totalCount = 0;
        const { baseDir, rootDir, extensions, shouldKeepExt = false, listFilter } = opts;
        if (!baseDir || baseDir === '/') {
            throw new Error(`Invalid baseDir, ${baseDir}`);
        }
        this.rootDir = rootDir;
        this.baseDir = baseDir;
        this.extensions = extensions;
        this.shouldKeepExt = shouldKeepExt;
        if (listFilter) {
            this.listFilter = listFilter;
        }
        this.fs = filesystem_1.getNativeFileSystemAPI();
    }
    getDisplayCount() {
        return this.displayedCount;
    }
    getTotalCount() {
        return this.totalCount;
    }
    readAll(readFileType = 'Text', onErrorFiles) {
        return this.list()
            .then(items => {
            return Promise.all(items.map(item => {
                return this.read(item.fileName, readFileType)
                    .then(content => ({
                    content,
                    fileName: item.fileName
                }))
                    // Note: Whenever there is error in reading file,
                    // return null
                    .catch(e => ({
                    fileName: item.fileName,
                    fullFilePath: this.filePath(item.fileName),
                    error: new Error(`Error in parsing ${this.filePath(item.fileName)}:\n${e.message}`)
                }));
            }))
                .then(list => {
                const errorFiles = list.filter(item => item.error);
                if (onErrorFiles)
                    onErrorFiles(errorFiles);
                return list.filter((item) => item.content);
            });
        });
    }
    getLink(fileName) {
        return this.read(fileName, 'DataURL');
    }
    __list() {
        return this.ensureDir()
            .then(() => {
            return this.fs.getEntries({
                path: path_1.default.join(this.rootDir, this.baseDir),
                extensions: this.extensions
            })
                .then(data => {
                const entries = data.entries;
                const errorCode = data.errorCode;
                if (errorCode !== 0 /* Succeeded */) {
                    throw new ErrorWithCode(getErrorMessageForCode(errorCode), errorCode);
                }
                const convertName = (entryName) => this.shouldKeepExt ? entryName : this.removeExt(entryName);
                const convert = (entry) => {
                    return {
                        dir: this.baseDir,
                        fileName: convertName(entry.name),
                        lastModified: new Date(entry.lastWriteTime),
                        size: storage_1.readableSize(entry.length)
                    };
                };
                const allList = entries.map(convert);
                return Promise.resolve(this.listFilter(allList))
                    .then(displayList => {
                    this.totalCount = allList.length;
                    this.displayedCount = displayList.length;
                    return displayList;
                });
            });
        });
    }
    exists(fileName) {
        return this.fs.fileExists({
            path: this.filePath(fileName)
        });
    }
    read(fileName, type) {
        const onResolve = (res) => {
            if (res.errorCode !== 0 /* Succeeded */) {
                throw new ErrorWithCode(`${fileName}: ` + getErrorMessageForCode(res.errorCode), res.errorCode);
            }
            const rawContent = res.content;
            const intermediate = (() => {
                switch (type) {
                    case 'Text':
                    case 'DataURL':
                        return rawContent;
                    case 'ArrayBuffer':
                        return utils_1.dataURItoArrayBuffer(rawContent);
                    case 'BinaryString':
                        return utils_1.arrayBufferToString(utils_1.dataURItoArrayBuffer(rawContent));
                }
            })();
            return this.decode(intermediate, fileName);
        };
        switch (type) {
            case 'Text':
                return this.fs.readAllTextCompat({
                    path: this.filePath(fileName)
                })
                    .then(onResolve);
            default:
                return this.fs.readAllBytesCompat({
                    path: this.filePath(fileName)
                })
                    .then(onResolve);
        }
    }
    __write(fileName, content) {
        return this.ensureDir()
            .then(() => this.encode(content, fileName))
            .then(encodedContent => {
            return this.fs.writeAllBytes({
                content: encodedContent,
                path: this.filePath(fileName, true),
            })
                .then(result => {
                if (!result) {
                    throw new Error(`Failed to write to '${fileName}'`);
                }
            });
        });
    }
    __overwrite(fileName, content) {
        return this.remove(fileName)
            .catch(() => { })
            .then(() => this.write(fileName, content));
    }
    __clear() {
        return this.list()
            .then(list => {
            const ps = list.map(file => {
                return this.remove(file.fileName);
            });
            return Promise.all(ps);
        })
            .then(() => { });
    }
    __remove(fileName) {
        return this.ensureDir()
            .then(() => {
            return this.fs.deleteFile({
                path: this.filePath(fileName)
            })
                .then(() => { });
        });
    }
    __rename(fileName, newName) {
        return this.ensureDir()
            .then(() => {
            return this.fs.moveFile({
                sourcePath: this.filePath(fileName),
                targetPath: this.filePath(newName, true)
            })
                .then(() => { });
        });
    }
    __copy(fileName, newName) {
        return this.ensureDir()
            .then(() => {
            return this.fs.copyFile({
                sourcePath: this.filePath(fileName),
                targetPath: this.filePath(newName, true)
            })
                .then(() => { });
        });
    }
    filePath(fileName, shouldSanitize = false) {
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(fileName) : fileName;
        const existingExt = path_1.default.extname(fileName);
        const ext = this.extensions[0];
        const finalFileName = existingExt && existingExt.substr(1).toLowerCase() === ext.toLowerCase() ? sanitized : (sanitized + '.' + ext);
        return path_1.default.join(this.rootDir, this.baseDir, finalFileName);
    }
    removeExt(fileNameWithExt) {
        const name = path_1.default.basename(fileNameWithExt);
        const ext = path_1.default.extname(fileNameWithExt);
        const i = name.lastIndexOf(ext);
        return name.substring(0, i);
    }
    ensureDir() {
        const fs = this.fs;
        const dir = path_1.default.join(this.rootDir, this.baseDir);
        return fs.directoryExists({
            path: dir
        })
            .then(existed => {
            if (existed)
                return existed;
            return fs.createDirectory({
                path: dir
            });
        })
            .then(() => { });
    }
}
exports.NativeFileSystemFlatStorage = NativeFileSystemFlatStorage;
exports.getNativeFileSystemFlatStorage = ts_utils_1.singletonGetterByKey((opts) => {
    return path_1.default.join(opts.rootDir, opts.baseDir);
}, (opts) => {
    return new NativeFileSystemFlatStorage(opts);
});
class ErrorWithCode extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ErrorWithCode';
        this.code = code;
        // Note: better to keep stack trace
        // reference: https://stackoverflow.com/a/32749533/1755633
        let captured = true;
        if (typeof Error.captureStackTrace === 'function') {
            try {
                Error.captureStackTrace(this, this.constructor);
            }
            catch (e) {
                captured = false;
            }
        }
        if (!captured) {
            this.stack = (new Error(message)).stack;
        }
    }
}
exports.ErrorWithCode = ErrorWithCode;
function getErrorMessageForCode(code) {
    switch (code) {
        case 0 /* Succeeded */:
            return 'Success';
        case 1 /* Failed */:
            return 'Failed to load';
        case 2 /* Truncated */:
            return 'File too large to load';
        default:
            return `Unknown error code: ${code}`;
    }
}
exports.getErrorMessageForCode = getErrorMessageForCode;


/***/ }),

/***/ 92687:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkFileName = exports.readableSize = exports.FlatStorage = exports.FlatStorageEvent = void 0;
const eventemitter3_1 = __importDefault(__webpack_require__(26729));
const debounce = __webpack_require__(91296);
const utils_1 = __webpack_require__(63370);
const ts_utils_1 = __webpack_require__(55452);
var FlatStorageEvent;
(function (FlatStorageEvent) {
    FlatStorageEvent["ListChanged"] = "list_changed";
    FlatStorageEvent["FilesChanged"] = "files_changed";
})(FlatStorageEvent = exports.FlatStorageEvent || (exports.FlatStorageEvent = {}));
class FlatStorage extends eventemitter3_1.default {
    constructor(options = {}) {
        super();
        this.encode = (x, fileName) => x;
        this.decode = (x, fileName) => x;
        // Q: Why do we need debounce for followingemitXXX?
        // A: So that there could be more than 1 invocation of emitXXX in one operation
        //    And it will just emit once. For downstream like React / Vue, it won't trigger
        //    unnecessary render
        // Note: list changed event is for move (rename) / remove / clear / write a new file
        this.emitListChanged = debounce(() => {
            this.list()
                .then(fileInfos => {
                this.emit(FlatStorageEvent.ListChanged, fileInfos);
            });
        }, 100);
        this.changedFileNames = [];
        this.__emitFilesChanged = debounce(() => {
            const fileNames = this.changedFileNames;
            // Note: clear changedFileNames right after this method is called,
            // instead of waiting till promise resolved
            // so that new file changes won't be blocked or affect current emit
            this.changedFileNames = [];
            return Promise.all(fileNames.map(fileName => {
                return this.read(fileName, 'Text')
                    .catch(() => null);
            }))
                .then(contents => {
                if (contents.length === 0)
                    return;
                // Note: in case some files don't exist any more, filter by content
                const changedFiles = contents.map((content, i) => ({
                    content,
                    fileName: fileNames[i]
                }))
                    .filter(item => !!item.content);
                this.emit(FlatStorageEvent.FilesChanged, changedFiles);
            });
        }, 100);
        if (options.decode) {
            this.decode = options.decode;
        }
        if (options.encode) {
            this.encode = options.encode;
        }
    }
    list() {
        return this.__list()
            .then(items => {
            items.sort((a, b) => {
                const aFileName = a.fileName.toLowerCase();
                const bFileName = b.fileName.toLowerCase();
                if (aFileName < bFileName)
                    return -1;
                if (aFileName > bFileName)
                    return 1;
                return 0;
            });
            return items;
        });
    }
    readAll(readFileType = 'Text', onErrorFiles) {
        return this.list()
            .then(items => {
            return Promise.all(items.map(item => {
                return this.read(item.fileName, readFileType)
                    .then(content => ({
                    content,
                    fileName: item.fileName
                }));
            }));
        });
    }
    bulkWrite(list) {
        return Promise.all(list.map(item => this.write(item.fileName, item.content)))
            .then(() => { });
    }
    write(fileName, content) {
        return this.exists(fileName)
            .then(isExist => {
            const next = () => {
                if (!isExist)
                    this.emitListChanged();
                this.emitFilesChanged([fileName]);
            };
            return this.__write(fileName, content)
                .then(next);
        });
    }
    overwrite(fileName, content) {
        return this.__overwrite(fileName, content)
            .then(() => {
            this.emitFilesChanged([fileName]);
        });
    }
    clear() {
        return this.__clear()
            .then(() => {
            this.emitListChanged();
        });
    }
    remove(fileName) {
        return this.__remove(fileName)
            .then(() => {
            this.emitListChanged();
        });
    }
    rename(fileName, newName) {
        return this.__rename(fileName, newName)
            .then(() => {
            this.emitListChanged();
            this.emitFilesChanged([newName]);
        });
    }
    copy(fileName, newName) {
        const pName = newName && newName.length
            ? Promise.resolve(newName)
            : ts_utils_1.uniqueName(fileName, {
                generate: (old, step = 1) => {
                    const reg = /-(\d+)$/;
                    const m = old.match(reg);
                    if (!m)
                        return `${old}-${step}`;
                    return old.replace(reg, (_, n) => `-${parseInt(n, 10) + step}`);
                },
                check: (fileName) => {
                    return this.exists(fileName).then(exists => !exists);
                },
                postfixReg: /(_relative)?\.\w+$/
            });
        return pName.then(name => {
            return this.__copy(fileName, name)
                .then(() => {
                this.emitListChanged();
                this.emitFilesChanged([name]);
            });
        });
    }
    // Note: files changed event is for write file only  (rename excluded)
    emitFilesChanged(fileNames) {
        this.changedFileNames = fileNames.reduce((prev, fileName) => {
            if (prev.indexOf(fileName) === -1)
                prev.push(fileName);
            return prev;
        }, this.changedFileNames);
        this.__emitFilesChanged();
    }
}
exports.FlatStorage = FlatStorage;
exports.readableSize = (byteSize) => {
    const kb = 1024;
    const mb = kb * kb;
    if (byteSize < kb) {
        return byteSize + ' byte';
    }
    if (byteSize < mb) {
        return (byteSize / kb).toFixed(1) + ' KB';
    }
    return (byteSize / mb).toFixed(1) + ' MB';
};
function checkFileName(fileName) {
    utils_1.withFileExtension(fileName, (baseName) => {
        try {
            utils_1.validateStandardName(baseName, true);
        }
        catch (e) {
            throw new Error(`Invalid file name '${fileName}'. File name ` + e.message);
        }
        return baseName;
    });
}
exports.checkFileName = checkFileName;


/***/ }),

/***/ 16058:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStorageManager = exports.StorageManager = exports.StorageManagerEvent = exports.StorageTarget = exports.StorageStrategyType = void 0;
const eventemitter3_1 = __importDefault(__webpack_require__(26729));
const browser_filesystem_storage_1 = __webpack_require__(984);
const native_filesystem_storage_1 = __webpack_require__(69492);
const ts_utils_1 = __webpack_require__(55452);
const xfile_1 = __webpack_require__(1577);
const convert_utils_1 = __webpack_require__(61169);
const convert_suite_utils_1 = __webpack_require__(36832);
const utils_1 = __webpack_require__(63370);
const path_1 = __importDefault(__webpack_require__(84037));
var StorageStrategyType;
(function (StorageStrategyType) {
    StorageStrategyType["Browser"] = "browser";
    StorageStrategyType["XFile"] = "xfile";
    StorageStrategyType["Nil"] = "nil";
})(StorageStrategyType = exports.StorageStrategyType || (exports.StorageStrategyType = {}));
var StorageTarget;
(function (StorageTarget) {
    StorageTarget[StorageTarget["Macro"] = 0] = "Macro";
    StorageTarget[StorageTarget["TestSuite"] = 1] = "TestSuite";
    StorageTarget[StorageTarget["CSV"] = 2] = "CSV";
    StorageTarget[StorageTarget["Screenshot"] = 3] = "Screenshot";
    StorageTarget[StorageTarget["Vision"] = 4] = "Vision";
})(StorageTarget = exports.StorageTarget || (exports.StorageTarget = {}));
var StorageManagerEvent;
(function (StorageManagerEvent) {
    StorageManagerEvent["StrategyTypeChanged"] = "StrategyTypeChanged";
    StorageManagerEvent["RootDirChanged"] = "RootDirChanged";
    StorageManagerEvent["ForceReload"] = "ForceReload";
})(StorageManagerEvent = exports.StorageManagerEvent || (exports.StorageManagerEvent = {}));
class StorageManager extends eventemitter3_1.default {
    constructor(strategyType, extraOptions) {
        super();
        this.strategyType = StorageStrategyType.Nil;
        this.getMacros = () => [];
        this.getMaxMacroCount = (s) => Promise.resolve(Infinity);
        this.setCurrentStrategyType(strategyType);
        if (extraOptions && extraOptions.getMacros) {
            this.getMacros = extraOptions.getMacros;
        }
        if (extraOptions && extraOptions.getMaxMacroCount) {
            this.getMaxMacroCount = extraOptions.getMaxMacroCount;
        }
        this.getConfig = extraOptions === null || extraOptions === void 0 ? void 0 : extraOptions.getConfig;
    }
    isXFileMode() {
        return this.strategyType === StorageStrategyType.XFile;
    }
    isBrowserMode() {
        return this.strategyType === StorageStrategyType.Browser;
    }
    getCurrentStrategyType() {
        return this.strategyType;
    }
    setCurrentStrategyType(type) {
        const needChange = type !== this.strategyType;
        if (needChange) {
            setTimeout(() => {
                this.emit(StorageManagerEvent.StrategyTypeChanged, type);
            }, 0);
            this.strategyType = type;
        }
        return needChange;
    }
    isStrategyTypeAvailable(type) {
        switch (type) {
            case StorageStrategyType.Browser:
                return Promise.resolve(true);
            case StorageStrategyType.XFile:
                return xfile_1.getXFile().sanityCheck();
            default:
                throw new Error(`type '${type}' is not supported`);
        }
    }
    getStorageForTarget(target, forceStrategytype) {
        switch (forceStrategytype || this.strategyType) {
            case StorageStrategyType.Browser: {
                switch (target) {
                    case StorageTarget.Macro: {
                        const storage = browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'macros',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            decode: (text, filePath) => {
                                const obj = convert_utils_1.fromJSONString(text, path_1.default.basename(filePath), { withStatus: true });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (data, fileName) => {
                                var _a, _b;
                                const str = convert_utils_1.toJSONString(Object.assign(Object.assign({}, data), { commands: data.data.commands }), {
                                    withStatus: true,
                                    ignoreTargetOptions: !!((_b = (_a = this.getConfig) === null || _a === void 0 ? void 0 : _a.call(this)) === null || _b === void 0 ? void 0 : _b.saveAlternativeLocators)
                                });
                                // Note: BrowserFileSystemStorage only supports writing file with Blob
                                // so have to convert it here in `encode`
                                return new Blob([str]);
                            }
                        });
                        window.newMacroStorage = storage;
                        return storage;
                    }
                    case StorageTarget.TestSuite: {
                        const storage = browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'testsuites',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            decode: (text, filePath) => {
                                console.log('test suite raw content', filePath, text, this.getMacros());
                                const obj = convert_suite_utils_1.parseTestSuite(text, { fileName: path_1.default.basename(filePath) });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (suite, fileName) => {
                                const str = convert_suite_utils_1.stringifyTestSuite(suite);
                                return new Blob([str]);
                            }
                        });
                        window.newTestSuiteStorage = storage;
                        return storage;
                    }
                    case StorageTarget.CSV:
                        return browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'spreadsheets',
                            extensions: ['csv'],
                            shouldKeepExt: true,
                            transformFileName: (path) => {
                                return path.toLowerCase();
                            }
                        });
                    case StorageTarget.Screenshot:
                        return browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'screenshots',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            transformFileName: (path) => {
                                return path.toLowerCase();
                            }
                        });
                    case StorageTarget.Vision:
                        return browser_filesystem_storage_1.getBrowserFileSystemStandardStorage({
                            baseDir: 'visions',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            transformFileName: (path) => {
                                return path.toLowerCase();
                            }
                        });
                }
            }
            case StorageStrategyType.XFile: {
                const { rootDir } = xfile_1.getXFile().getCachedConfig();
                switch (target) {
                    case StorageTarget.Macro: {
                        const storage = native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'macros',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            listFilter: (entryNodes) => {
                                return this.getMaxMacroCount(this.strategyType)
                                    .then(maxCount => {
                                    return ts_utils_1.forestSlice(maxCount, entryNodes);
                                });
                            },
                            decode: (text, filePath) => {
                                const obj = convert_utils_1.fromJSONString(text, path_1.default.basename(filePath), { withStatus: true });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (data, fileName) => {
                                const str = convert_utils_1.toJSONString(Object.assign(Object.assign({}, data), { commands: data.data.commands }), { withStatus: true, ignoreTargetOptions: true });
                                // Note: NativeFileSystemStorage only supports writing file with DataURL
                                // so have to convert it here in `encode`
                                return utils_1.blobToDataURL(new Blob([str]));
                            }
                        });
                        return storage;
                    }
                    case StorageTarget.TestSuite: {
                        const storage = native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'testsuites',
                            extensions: ['json'],
                            shouldKeepExt: false,
                            decode: (text, filePath) => {
                                const obj = convert_suite_utils_1.parseTestSuite(text, { fileName: path_1.default.basename(filePath) });
                                // Note: use filePath as id
                                return Object.assign(Object.assign({}, obj), { id: storage.filePath(filePath), path: storage.relativePath(filePath) });
                            },
                            encode: (suite, fileName) => {
                                const str = convert_suite_utils_1.stringifyTestSuite(suite);
                                return utils_1.blobToDataURL(new Blob([str]));
                            }
                        });
                        return storage;
                    }
                    case StorageTarget.CSV:
                        return native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'datasources',
                            extensions: ['csv'],
                            shouldKeepExt: true,
                            allowAbsoluteFilePath: true,
                            encode: ((text, fileName) => {
                                return utils_1.blobToDataURL(new Blob([text]));
                            })
                        });
                    case StorageTarget.Vision:
                        return native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'images',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            decode: xFileDecodeImage,
                            encode: ((imageBlob, fileName) => {
                                return utils_1.blobToDataURL(imageBlob);
                            })
                        });
                    case StorageTarget.Screenshot:
                        return native_filesystem_storage_1.getNativeFileSystemStandardStorage({
                            rootDir,
                            baseDir: 'screenshots',
                            extensions: ['png'],
                            shouldKeepExt: true,
                            decode: xFileDecodeImage,
                            encode: ((imageBlob, fileName) => {
                                return utils_1.blobToDataURL(imageBlob);
                            })
                        });
                }
            }
            default:
                throw new Error(`Unsupported strategy type: '${this.strategyType}'`);
        }
    }
    getMacroStorage() {
        return this.getStorageForTarget(StorageTarget.Macro);
    }
    getTestSuiteStorage() {
        return this.getStorageForTarget(StorageTarget.TestSuite);
    }
    getCSVStorage() {
        return this.getStorageForTarget(StorageTarget.CSV);
    }
    getVisionStorage() {
        return this.getStorageForTarget(StorageTarget.Vision);
    }
    getScreenshotStorage() {
        return this.getStorageForTarget(StorageTarget.Screenshot);
    }
}
exports.StorageManager = StorageManager;
function xFileDecodeImage(data, fileName, readFileType) {
    if (readFileType !== 'DataURL') {
        return data;
    }
    if (data.substr(0, 11) === 'data:image') {
        return data;
    }
    return 'data:image/png;base64,' + data;
}
// Note: in panel window (`src/index.js`), `getStorageManager` is provided with `getMacros` in `extraOptions`
// While in `bg.js` or `csv_edtior.js`, `vision_editor.js`, `extraOptions` is omitted with no harm,
// because they don't read/write test suites
exports.getStorageManager = ts_utils_1.singletonGetter((strategyType, extraOptions) => {
    return new StorageManager(strategyType || StorageStrategyType.XFile, extraOptions);
});


/***/ }),

/***/ 984:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrowserFileSystemStandardStorage = exports.BrowserFileSystemStandardStorage = void 0;
const standard_storage_1 = __webpack_require__(24145);
const path_1 = __webpack_require__(84037);
const utils_1 = __webpack_require__(63370);
const dom_utils_1 = __webpack_require__(24874);
const web_extension_1 = __importDefault(__webpack_require__(61171));
const ts_utils_1 = __webpack_require__(55452);
const delegate_1 = __webpack_require__(52152);
class BrowserFileSystemStandardStorage extends standard_storage_1.StandardStorage {
    constructor(opts) {
        super({
            encode: opts.encode,
            decode: opts.decode
        });
        this.transformFileName = (path) => path;
        const { extensions, shouldKeepExt, transformFileName, baseDir = 'share' } = opts;
        if (!baseDir || baseDir === '/') {
            throw new Error(`Invalid baseDir, ${baseDir}`);
        }
        if (transformFileName) {
            this.transformFileName = transformFileName;
        }
        this.fs = delegate_1.getBrowserFileSystem();
        this.baseDir = baseDir;
        this.extensions = extensions;
        this.shouldKeepExt = shouldKeepExt;
        // Note: create the folder in which we will store files
        this.fs.getDirectory(baseDir, true);
    }
    getLink(filePath) {
        if (!dom_utils_1.isFirefox()) {
            const tmp = web_extension_1.default.runtime.getURL('temporary');
            const link = `filesystem:${tmp}/${this.filePath(filePath)}`;
            return Promise.resolve(link + '?' + new Date().getTime());
        }
        else {
            // Note: Except for Chrome, the filesystem API we use is a polyfill from idb.filesystem.js
            // idb.filesystem.js works great but the only problem is that you can't use 'filesystem:' schema to retrieve that file
            // so here, we have to convert the file to data url
            return this.read(filePath, 'DataURL');
        }
    }
    read(filePath, type) {
        const fullPath = this.filePath(filePath);
        const relativePath = path_1.posix.relative(this.dirPath('/'), fullPath);
        return this.fs.readFile(fullPath, type)
            .then(intermediate => this.decode(intermediate, relativePath, type), error => {
            if (error.message.indexOf("A requested file or directory could not be found") !== -1) {
                throw new Error(`Error #301: File not found (file names are case-sensitive): ${filePath}`);
            }
            return Promise.reject(error);
        });
    }
    stat(entryPath, isDir) {
        const name = path_1.posix.basename(entryPath);
        const dir = path_1.posix.dirname(entryPath);
        const fullPath = isDir ? this.dirPath(entryPath) : this.filePath(entryPath);
        const relativePath = path_1.posix.relative(this.dirPath('/'), fullPath);
        return this.fs.existsStat(fullPath)
            .then(({ isFile, isDirectory }) => {
            // Note: idb.filesystem.js (we use it as polyfill for firefox) doesn't support getMetadata on folder yet
            // so we simply set size/lastModified to empty value for now.
            if (!isFile) {
                return {
                    dir,
                    name,
                    fullPath,
                    relativePath,
                    isFile,
                    isDirectory,
                    size: 0,
                    lastModified: new Date(0)
                };
            }
            return this.fs.getMetadata(fullPath, isDirectory)
                .then((meta) => {
                return {
                    dir,
                    name,
                    fullPath,
                    relativePath,
                    isFile,
                    isDirectory,
                    size: meta.size,
                    lastModified: meta.modificationTime
                };
            });
        });
    }
    __list(directoryPath = '/', brief = false) {
        // TODO: Ignore brief param for browser fs for now
        const convertName = (entryName, isDirectory) => {
            return this.shouldKeepExt || isDirectory ? entryName : this.removeExt(entryName);
        };
        return this.ensureBaseDir()
            .then(() => this.fs.list(this.dirPath(directoryPath)))
            .then(fileEntries => {
            const ps = fileEntries.map(fileEntry => {
                return this.stat(fileEntry.fullPath, fileEntry.isDirectory)
                    .then((stat) => (Object.assign(Object.assign({}, stat), { name: this.transformFileName(convertName(stat.name, fileEntry.isDirectory)) })));
            });
            return Promise.all(ps)
                .then(list => {
                list.sort((a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                });
                this.totalCount = list.length;
                this.displayedCount = list.length;
                return list;
            });
        });
    }
    __write(filePath, content) {
        return this.ensureBaseDir()
            .then(() => this.remove(filePath))
            .catch(() => { })
            .then(() => this.encode(content, filePath))
            .then((encodedContent) => this.fs.writeFile(this.filePath(filePath, true), encodedContent))
            .then(() => { });
    }
    __overwrite(filePath, content) {
        return this.__write(filePath, content);
    }
    __removeFile(filePath) {
        return this.fs.removeFile(this.filePath(filePath));
    }
    __removeEmptyDirectory(directoryPath) {
        return this.fs.rmdir(this.dirPath(directoryPath));
    }
    __moveFile(filePath, newPath) {
        return this.fs.moveFile(this.filePath(filePath), this.filePath(newPath, true))
            .then(() => { });
    }
    __copyFile(filePath, newPath) {
        return this.fs.copyFile(this.filePath(filePath), this.filePath(newPath, true))
            .then(() => { });
    }
    __createDirectory(directoryPath) {
        return this.fs.getDirectory(this.dirPath(directoryPath, true), true)
            .then(() => { });
    }
    dirPath(dir, shouldSanitize = false) {
        const path = this.getPathLib();
        const absPath = (() => {
            if (this.isStartWithBaseDir(dir)) {
                return dir;
            }
            else {
                return path.join('/', this.baseDir, dir);
            }
        })();
        const dirName = path.dirname(absPath);
        const baseName = path.basename(absPath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        return path.join(dirName, sanitized);
    }
    isWin32Path() {
        return false;
    }
    filePath(filePath, shouldSanitize = false) {
        const dirName = path_1.posix.dirname(filePath);
        const baseName = path_1.posix.basename(filePath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        const existingExt = path_1.posix.extname(baseName);
        const ext = this.extensions[0];
        const finalFileName = existingExt && existingExt.substr(1).toLowerCase() === ext.toLowerCase() ? sanitized : (sanitized + '.' + ext);
        if (this.isStartWithBaseDir(dirName)) {
            return path_1.posix.join(dirName, this.transformFileName(finalFileName));
        }
        else {
            return path_1.posix.join('/', this.baseDir, dirName, this.transformFileName(finalFileName));
        }
    }
    isStartWithBaseDir(str) {
        return str.indexOf('/' + this.baseDir) === 0;
    }
    ensureBaseDir() {
        return this.fs.ensureDirectory(this.baseDir)
            .then(() => { });
    }
    removeExt(fileNameWithExt) {
        const name = path_1.posix.basename(fileNameWithExt);
        const ext = path_1.posix.extname(fileNameWithExt);
        const i = name.lastIndexOf(ext);
        return name.substring(0, i);
    }
}
exports.BrowserFileSystemStandardStorage = BrowserFileSystemStandardStorage;
exports.getBrowserFileSystemStandardStorage = ts_utils_1.singletonGetterByKey((opts) => {
    return (opts && opts.baseDir) || 'share';
}, (opts) => {
    return new BrowserFileSystemStandardStorage(opts);
});


/***/ }),

/***/ 69492:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNativeFileSystemStandardStorage = exports.NativeFileSystemStandardStorage = void 0;
const path_1 = __importDefault(__webpack_require__(84037));
const standard_storage_1 = __webpack_require__(24145);
const utils_1 = __webpack_require__(63370);
const filesystem_1 = __webpack_require__(65065);
const native_filesystem_storage_1 = __webpack_require__(62976);
const ts_utils_1 = __webpack_require__(55452);
class NativeFileSystemStandardStorage extends standard_storage_1.StandardStorage {
    constructor(opts) {
        super({
            encode: opts.encode,
            decode: opts.decode,
            listFilter: opts.listFilter
        });
        const { baseDir, rootDir, extensions, shouldKeepExt = false, allowAbsoluteFilePath = false } = opts;
        if (!baseDir || baseDir === '/') {
            throw new Error(`Invalid baseDir, ${baseDir}`);
        }
        this.rootDir = rootDir;
        this.baseDir = baseDir;
        this.extensions = extensions;
        this.shouldKeepExt = shouldKeepExt;
        this.allowAbsoluteFilePath = allowAbsoluteFilePath;
        this.fs = filesystem_1.getNativeFileSystemAPI();
    }
    getLink(fileName) {
        return this.read(fileName, 'DataURL');
    }
    read(filePath, type) {
        const fullPath = this.filePath(filePath);
        const relativePath = path_1.default.relative(this.dirPath('/'), fullPath);
        const onResolve = (res) => {
            if (res.errorCode !== 0 /* Succeeded */) {
                throw new native_filesystem_storage_1.ErrorWithCode(`${filePath}: ` + native_filesystem_storage_1.getErrorMessageForCode(res.errorCode), res.errorCode);
            }
            const rawContent = res.content;
            const intermediate = (() => {
                switch (type) {
                    case 'Text':
                    case 'DataURL':
                        return rawContent;
                    case 'ArrayBuffer':
                        return utils_1.dataURItoArrayBuffer(rawContent);
                    case 'BinaryString':
                        return utils_1.arrayBufferToString(utils_1.dataURItoArrayBuffer(rawContent));
                }
            })();
            return this.decode(intermediate, relativePath, type);
        };
        const onError = (err) => {
            if (/File size cannot be determined/.test(err.message)) {
                throw new Error(`Error #301: File not found (file names are case-sensitive): ${filePath}`);
            }
            return Promise.reject(err);
        };
        switch (type) {
            case 'Text':
                return this.fs.readAllTextCompat({
                    path: fullPath
                })
                    .then(onResolve, onError);
            default:
                return this.fs.readAllBytesCompat({
                    path: fullPath
                })
                    .then(onResolve, onError);
        }
    }
    stat(entryPath, isDirectory) {
        const dir = path_1.default.dirname(entryPath);
        const name = path_1.default.basename(entryPath);
        const fullPath = isDirectory ? this.dirPath(entryPath) : this.filePath(entryPath);
        const relativePath = path_1.default.relative(this.dirPath('/'), fullPath);
        const noEntry = {
            dir,
            name,
            fullPath,
            relativePath,
            isFile: false,
            isDirectory: false,
            lastModified: new Date(0),
            size: 0
        };
        const pExists = isDirectory ? this.fs.directoryExists({ path: fullPath })
            : this.fs.fileExists({ path: fullPath });
        return pExists.then(exists => {
            if (!exists) {
                return noEntry;
            }
            return this.fs.getFileSystemEntryInfo({ path: fullPath })
                .then((info) => {
                return {
                    dir,
                    name,
                    fullPath,
                    relativePath,
                    isFile: !info.isDirectory,
                    isDirectory: info.isDirectory,
                    lastModified: new Date(info.lastWriteTime),
                    size: info.length
                };
            }, (e) => {
                return noEntry;
            });
        });
    }
    __list(directoryPath = '/', brief = false) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.getEntries({
                brief,
                path: this.dirPath(directoryPath),
                extensions: this.extensions,
            })
                .then(data => {
                const entries = data.entries;
                const errorCode = data.errorCode;
                if (errorCode !== 0 /* Succeeded */) {
                    throw new native_filesystem_storage_1.ErrorWithCode(native_filesystem_storage_1.getErrorMessageForCode(errorCode) + `: ${directoryPath}`, errorCode);
                }
                const convertName = (entryName, isDirectory) => {
                    return this.shouldKeepExt || isDirectory ? entryName : this.removeExt(entryName);
                };
                const convert = (entry) => {
                    const dir = this.dirPath(directoryPath);
                    const name = convertName(entry.name, entry.isDirectory);
                    const fullPath = path_1.default.join(dir, entry.name);
                    const relativePath = path_1.default.relative(this.dirPath('/'), fullPath);
                    return {
                        dir,
                        name,
                        fullPath,
                        relativePath,
                        isFile: !entry.isDirectory,
                        isDirectory: entry.isDirectory,
                        lastModified: new Date(entry.lastWriteTime),
                        size: entry.length
                    };
                };
                return entries.map(convert);
            });
        });
    }
    __write(filePath, content) {
        return this.ensureBaseDir()
            .then(() => this.encode(content, filePath))
            .then(encodedContent => {
            return this.fs.writeAllBytes({
                content: encodedContent,
                path: this.filePath(filePath, true),
            })
                .then(result => {
                if (!result) {
                    throw new Error(`Failed to write to '${filePath}'`);
                }
            });
        });
    }
    __overwrite(filePath, content) {
        return this.write(filePath, content);
    }
    __removeFile(filePath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.deleteFile({
                path: this.filePath(filePath)
            })
                .then(() => { });
        });
    }
    __removeEmptyDirectory(directoryPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.removeDirectory({ path: this.dirPath(directoryPath) })
                .then(() => { });
        });
    }
    __moveFile(filePath, newPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.moveFile({
                sourcePath: this.filePath(filePath),
                targetPath: this.filePath(newPath, true)
            })
                .then(() => { });
        });
    }
    __copyFile(filePath, newPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.copyFile({
                sourcePath: this.filePath(filePath),
                targetPath: this.filePath(newPath, true)
            })
                .then(() => { });
        });
    }
    __createDirectory(directoryPath) {
        return this.ensureBaseDir()
            .then(() => {
            return this.fs.createDirectory({
                path: this.dirPath(directoryPath, true)
            })
                .then(() => { });
        });
    }
    dirPath(dir, shouldSanitize = false) {
        const path = this.getPathLib();
        const absPath = (() => {
            if (this.isStartWithBaseDir(dir)) {
                return path.normalize(dir);
            }
            else {
                return path.normalize(path.join(this.rootDir, this.baseDir, dir));
            }
        })();
        const dirName = path.dirname(absPath);
        const baseName = path.basename(absPath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        return path.join(dirName, sanitized);
    }
    filePath(filePath, shouldSanitize = false) {
        const dirName = path_1.default.dirname(filePath);
        const baseName = path_1.default.basename(filePath);
        const sanitized = shouldSanitize ? utils_1.sanitizeFileName(baseName) : baseName;
        const existingExt = path_1.default.extname(baseName);
        const ext = this.extensions[0];
        const finalFileName = existingExt && existingExt.substr(1).toLowerCase() === ext.toLowerCase() ? sanitized : (sanitized + '.' + ext);
        if (this.isStartWithBaseDir(dirName)) {
            return path_1.default.normalize(path_1.default.join(dirName, finalFileName));
        }
        else if (this.allowAbsoluteFilePath && this.isAbsoluteUrl(filePath)) {
            return path_1.default.normalize(path_1.default.join(dirName, finalFileName));
        }
        else {
            return path_1.default.normalize(path_1.default.join(this.rootDir, this.baseDir, dirName, finalFileName));
        }
    }
    isWin32Path() {
        return /^([A-Z]:\\|\/\/|\\\\)/i.test(this.rootDir);
    }
    isAbsoluteUrl(str) {
        const path = this.getPathLib();
        return path.isAbsolute(str);
    }
    isStartWithBaseDir(str) {
        return str.indexOf(this.rootDir) === 0;
    }
    removeExt(fileNameWithExt) {
        const name = path_1.default.basename(fileNameWithExt);
        const ext = path_1.default.extname(fileNameWithExt);
        const i = name.lastIndexOf(ext);
        return name.substring(0, i);
    }
    ensureBaseDir() {
        const fs = this.fs;
        const dir = path_1.default.normalize(path_1.default.join(this.rootDir, this.baseDir));
        return fs.directoryExists({
            path: dir
        })
            .then(existed => {
            if (existed)
                return existed;
            return fs.createDirectory({
                path: dir
            });
        })
            .then(() => { });
    }
}
exports.NativeFileSystemStandardStorage = NativeFileSystemStandardStorage;
exports.getNativeFileSystemStandardStorage = ts_utils_1.singletonGetterByKey((opts) => {
    return path_1.default.join(opts.rootDir, opts.baseDir);
}, (opts) => {
    return new NativeFileSystemStandardStorage(opts);
});


/***/ }),

/***/ 24145:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StandardStorage = exports.EntryStatus = exports.StorageEvent = void 0;
const eventemitter3_1 = __importDefault(__webpack_require__(26729));
const debounce = __webpack_require__(91296);
const ts_utils_1 = __webpack_require__(55452);
const path_1 = __webpack_require__(84037);
const error_1 = __webpack_require__(66500);
var StorageEvent;
(function (StorageEvent) {
    StorageEvent["ListChanged"] = "list_changed";
    StorageEvent["FilesChanged"] = "files_changed";
})(StorageEvent = exports.StorageEvent || (exports.StorageEvent = {}));
var EntryStatus;
(function (EntryStatus) {
    EntryStatus[EntryStatus["Unknown"] = 0] = "Unknown";
    EntryStatus[EntryStatus["NonExistent"] = 1] = "NonExistent";
    EntryStatus[EntryStatus["File"] = 2] = "File";
    EntryStatus[EntryStatus["Directory"] = 3] = "Directory";
})(EntryStatus = exports.EntryStatus || (exports.EntryStatus = {}));
class StandardStorage extends eventemitter3_1.default {
    constructor(options = {}) {
        super();
        this.encode = (x, fileName) => x;
        this.decode = (x, fileName) => x;
        this.displayedCount = 0;
        this.totalCount = 0;
        this.listFilter = (list) => list;
        // Q: Why do we need debounce for followingemitXXX?
        // A: So that there could be more than 1 invocation of emitXXX in one operation
        //    And it will just emit once. For downstream like React / Vue, it won't trigger
        //    unnecessary render
        // Note: list changed event is for move (rename) / remove / clear / write a new file
        this.emitListChanged = debounce(() => {
            // FIXME:
            this.list('/')
                .then(fileInfos => {
                this.emit(StorageEvent.ListChanged, fileInfos);
            });
        }, 100);
        this.changedFileNames = [];
        this.__emitFilesChanged = debounce(() => {
            const fileNames = this.changedFileNames;
            // Note: clear changedFileNames right after this method is called,
            // instead of waiting till promise resolved
            // so that new file changes won't be blocked or affect current emit
            this.changedFileNames = [];
            return Promise.all(fileNames.map(fileName => {
                return this.read(fileName, 'Text')
                    .catch(() => null);
            }))
                .then(contents => {
                if (contents.length === 0)
                    return;
                // Note: in case some files don't exist any more, filter by content
                const changedFiles = contents.map((content, i) => ({
                    content,
                    fileName: fileNames[i]
                }))
                    .filter(item => !!item.content);
                this.emit(StorageEvent.FilesChanged, changedFiles);
            });
        }, 100);
        if (options.decode) {
            this.decode = options.decode;
        }
        if (options.encode) {
            this.encode = options.encode;
        }
        if (options.listFilter) {
            this.listFilter = options.listFilter;
        }
    }
    getPathLib() {
        // Note: only subclass knows whether it should use win32/posix style path
        return this.isWin32Path() ? path_1.win32 : path_1.posix;
    }
    relativePath(entryPath, isDirectory) {
        const absPath = isDirectory ? this.dirPath(entryPath) : this.filePath(entryPath);
        const rootPath = this.dirPath('/');
        return this.getPathLib().relative(rootPath, absPath);
    }
    entryPath(entryPath, isDirectory) {
        return isDirectory ? this.dirPath(entryPath) : this.filePath(entryPath);
    }
    list(directoryPath = '/', brief = false) {
        return this.__list(directoryPath, brief)
            .then((items) => {
            return this.sortEntries(items);
        });
    }
    listR(directoryPath = '/') {
        const listDir = (dir) => {
            return this.list(dir, false)
                .then((entries) => {
                return Promise.all(entries.map((entry) => {
                    if (entry.isDirectory) {
                        return listDir(entry.fullPath);
                    }
                    return Promise.resolve(null);
                }))
                    .then((listOfEntries) => {
                    return this.sortEntries(entries.map((entry, i) => (Object.assign(Object.assign({}, entry), { children: listOfEntries[i] || [] }))));
                });
            });
        };
        return listDir(directoryPath)
            .then((entryNodes) => {
            if (directoryPath !== '/') {
                return entryNodes;
            }
            return Promise.resolve(this.listFilter(entryNodes))
                .then(displayEntryNodes => {
                this.totalCount = ts_utils_1.sum(...entryNodes.map(ts_utils_1.nodeCount));
                this.displayedCount = ts_utils_1.sum(...displayEntryNodes.map(ts_utils_1.nodeCount));
                return displayEntryNodes;
            });
        });
    }
    getDisplayCount() {
        return this.displayedCount;
    }
    getTotalCount() {
        return this.totalCount;
    }
    exists(path) {
        return this.stat(path)
            .then(({ isFile, isDirectory }) => isFile || isDirectory, () => false);
    }
    fileExists(path) {
        return this.stat(path)
            .then((entry) => entry.isFile, () => false);
    }
    directoryExists(path) {
        return this.stat(path, true)
            .then((entry) => {
            return entry.isDirectory;
        }, () => false);
    }
    readR(directoryPath, readFileType = 'Text', onErrorFiles) {
        return this.listR(directoryPath)
            .then((entryNodes) => {
            return Promise.all(entryNodes.map((node) => {
                if (node.isFile) {
                    return this.read(node.fullPath, readFileType)
                        .then((content) => [{
                            content: content,
                            filePath: node.fullPath
                        }]);
                }
                if (node.isDirectory) {
                    return this.readR(node.fullPath, readFileType);
                }
                throw new Error('Not file or directory');
            }))
                .then((result) => {
                return ts_utils_1.flatten(result);
            });
        });
    }
    write(fileName, content) {
        return this.exists(fileName)
            .then(isExist => {
            const next = () => {
                if (!isExist)
                    this.emitListChanged();
                this.emitFilesChanged([fileName]);
            };
            return this.__write(fileName, content)
                .then(next);
        });
    }
    overwrite(fileName, content) {
        return this.__overwrite(fileName, content)
            .then(() => {
            this.emitFilesChanged([fileName]);
        });
    }
    bulkWrite(list) {
        return Promise.all(list.map(item => this.write(item.filePath, item.content)))
            .then(() => { });
    }
    removeFile(filePath) {
        return this.__removeFile(filePath)
            .then(() => {
            this.emitListChanged();
        });
    }
    removeEmptyDirectory(directoryPath) {
        return this.__removeEmptyDirectory(directoryPath)
            .then(() => {
            this.emitListChanged();
        });
    }
    removeDirectory(directoryPath) {
        return this.remove(directoryPath, true);
    }
    remove(path, isDirectory) {
        return this.stat(path, isDirectory)
            .then((entry) => {
            if (entry.isFile) {
                return this.removeFile(entry.fullPath);
            }
            if (entry.isDirectory) {
                return this.list(entry.fullPath)
                    .then((entries) => {
                    return Promise.all(entries.map((item) => this.remove(item.fullPath, item.isDirectory)))
                        .then(() => this.removeEmptyDirectory(entry.fullPath));
                });
            }
            throw new Error('Not file or directory');
        });
    }
    clear() {
        return this.list('/')
            .then((entries) => {
            return Promise.all(entries.map((entry) => this.remove(entry.fullPath)))
                .then(() => { });
        });
    }
    moveFile(filePath, newPath) {
        return this.__moveFile(filePath, newPath)
            .then(() => {
            this.emitListChanged();
        });
    }
    copyFile(filePath, newPath) {
        return this.__copyFile(filePath, newPath)
            .then(() => {
            this.emitListChanged();
        });
    }
    moveDirectory(directoryPath, newPath) {
        return this.move(directoryPath, newPath, true, true);
    }
    copyDirectory(directoryPath, newPath) {
        return this.copy(directoryPath, newPath, true, true);
    }
    move(src, dst, isSourceDirectory, isTargetDirectory) {
        const absSrc = this.entryPath(src, isSourceDirectory);
        const absDst = this.entryPath(dst, isTargetDirectory);
        if (absSrc === absDst) {
            throw new Error('move: src should not be the same as dst');
        }
        if (this.getPathLib().dirname(absSrc) === absDst) {
            throw new Error('move: cannot move to original dir');
        }
        if (isSourceDirectory && isTargetDirectory && this.isTargetInSourceDirectory(dst, src)) {
            throw new Error('Cannot move a directory into its sub directory');
        }
        // It's slow to copy then remove. Subclass should definitely
        // override this method if it has native support for move operation
        return this.copy(src, dst, isSourceDirectory, isTargetDirectory)
            .then(() => this.remove(src, isSourceDirectory));
    }
    copy(src, dst, isSourceDirectory, isTargetDirectory) {
        const srcDir = this.getPathLib().dirname(src);
        const dstDir = this.getPathLib().dirname(dst);
        const isSameDir = srcDir === dstDir;
        if (src === dst) {
            throw new Error('copy: dst should not be the same as src');
        }
        return Promise.all([
            this.getEntryStatus(src, isSourceDirectory),
            this.getEntryStatus(dst, isTargetDirectory),
            isSameDir ? Promise.resolve(EntryStatus.Directory) : this.getEntryStatus(this.getPathLib().dirname(dst), true)
        ])
            .then((triple) => {
            const [srcStatus, dstStatus, dstDirStatus] = triple;
            if (dstDirStatus !== EntryStatus.Directory) {
                throw new error_1.ENOTDIR(this.getPathLib().dirname(dst));
            }
            switch (srcStatus) {
                case EntryStatus.NonExistent:
                    throw new error_1.ENOENT(src);
                case EntryStatus.Unknown:
                    throw new Error(`source (${src}) exists but is neither a file nor a directory`);
                case EntryStatus.File: {
                    switch (dstStatus) {
                        case EntryStatus.File:
                            throw new error_1.EEXIST(dst);
                        case EntryStatus.Unknown:
                            throw new Error(`dst '${dst}' is neither a file nor directory`);
                        case EntryStatus.Directory: {
                            const dstFilePath = this.getPathLib().resolve(dst, this.getPathLib().basename(src));
                            return this.copyFile(src, dstFilePath);
                        }
                        case EntryStatus.NonExistent: {
                            return this.copyFile(src, dst);
                        }
                    }
                }
                case EntryStatus.Directory: {
                    switch (dstStatus) {
                        case EntryStatus.File:
                            throw new Error(`dst '${dst}' is an existing file, but src '${src}' is a directory`);
                        case EntryStatus.Unknown:
                            throw new Error(`dst '${dst}' is neither a file nor directory`);
                        case EntryStatus.Directory: {
                            if (this.isTargetInSourceDirectory(dst, src)) {
                                throw new Error('Cannot copy a directory into its sub directory');
                            }
                            const dstDir = this.getPathLib().resolve(dst, this.getPathLib().basename(src));
                            return this.ensureDirectory(dstDir)
                                .then(() => this.copyAllInDirectory(src, dstDir));
                        }
                        case EntryStatus.NonExistent: {
                            return this.ensureDirectory(dst)
                                .then(() => this.copyAllInDirectory(src, dst));
                        }
                    }
                }
            }
        });
    }
    createDirectory(directoryPath) {
        return this.mkdir(directoryPath, false);
    }
    ensureDirectory(directoryPath) {
        return this.getEntryStatus(directoryPath, true)
            .then((status) => {
            switch (status) {
                case EntryStatus.File:
                case EntryStatus.Unknown:
                    throw new error_1.EEXIST();
                case EntryStatus.Directory:
                    return;
                case EntryStatus.NonExistent:
                    return this.mkdir(directoryPath, true);
            }
        });
    }
    ensureDir() {
        return this.ensureDirectory('/');
    }
    rename(filePath, newPath) {
        return this.move(filePath, newPath);
    }
    readAll(readFileType = 'Text', onErrorFiles) {
        return this.list('/')
            .then((items) => {
            return Promise.all(items
                .filter(item => item.isFile)
                .map(item => {
                return this.read(item.fullPath, readFileType)
                    .then(content => ({
                    content,
                    fileName: item.name
                }))
                    // Note: Whenever there is error in reading file,
                    // return null
                    .catch(e => {
                    return {
                        fileName: item.name,
                        fullFilePath: item.fullPath,
                        error: new Error(`Error in parsing ${item.fullPath}:\n${e.message}`)
                    };
                });
            }))
                .then(list => {
                const errorFiles = list.filter(item => item.error);
                if (onErrorFiles)
                    onErrorFiles(errorFiles);
                return list.filter((item) => item.content);
            });
        });
    }
    isTargetInSourceDirectory(targetPath, sourcePath) {
        const dstPath = this.dirPath(targetPath);
        const srcPath = this.dirPath(sourcePath);
        const sep = this.getPathLib().sep;
        const relativePath = this.getPathLib().relative(srcPath, dstPath);
        const parts = relativePath.split(sep);
        return parts.indexOf('..') === -1;
    }
    sortEntries(entries) {
        // Sort entries in this order
        // 1. Directories come before files
        // 2. Inside directories or files, sort it alphabetically a-z (ignore case)
        const items = [...entries];
        items.sort((a, b) => {
            if (a.isDirectory && b.isFile) {
                return -1;
            }
            if (a.isFile && b.isDirectory) {
                return 1;
            }
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName < bName)
                return -1;
            if (aName > bName)
                return 1;
            return 0;
        });
        return items;
    }
    copyAllInDirectory(srcDir, dstDir) {
        return this.list(srcDir)
            .then((entries) => {
            return Promise.all(entries.map((entry) => {
                if (entry.isFile) {
                    return this.copyFile(entry.fullPath, this.getPathLib().resolve(dstDir, entry.name));
                }
                if (entry.isDirectory) {
                    const dstSubDir = this.getPathLib().resolve(dstDir, entry.name);
                    return this.ensureDirectory(dstSubDir)
                        .then(() => this.copyAllInDirectory(entry.fullPath, dstSubDir));
                }
                return Promise.resolve();
            }))
                .then(() => { });
        });
    }
    mkdir(dir, sureAboutNonExistent = false) {
        const makeSureNonExistent = () => {
            if (sureAboutNonExistent) {
                return Promise.resolve();
            }
            return this.getEntryStatus(dir, true)
                .then((status) => {
                if (status !== EntryStatus.NonExistent) {
                    throw new error_1.EEXIST(dir);
                }
            });
        };
        return makeSureNonExistent()
            .then(() => {
            const parentDir = this.getPathLib().dirname(dir);
            if (parentDir === '/') {
                return this.__createDirectory(dir);
            }
            return this.getEntryStatus(parentDir, true)
                .then((status) => {
                switch (status) {
                    case EntryStatus.File:
                    case EntryStatus.Unknown:
                        throw new error_1.EEXIST(parentDir);
                    case EntryStatus.Directory:
                        return this.__createDirectory(dir);
                    case EntryStatus.NonExistent:
                        return this.mkdir(parentDir, true)
                            .then(() => this.__createDirectory(dir));
                }
            });
        })
            .then(() => {
            this.emitListChanged();
        });
    }
    getEntryStatus(path, isDirectory) {
        return this.stat(path, isDirectory)
            .then((entry) => {
            if (entry.isFile)
                return EntryStatus.File;
            if (entry.isDirectory)
                return EntryStatus.Directory;
            return EntryStatus.NonExistent;
        }, (e) => {
            return EntryStatus.NonExistent;
        });
    }
    // Note: files changed event is for write file only  (rename excluded)
    emitFilesChanged(fileNames) {
        this.changedFileNames = fileNames.reduce((prev, fileName) => {
            if (prev.indexOf(fileName) === -1)
                prev.push(fileName);
            return prev;
        }, this.changedFileNames);
        this.__emitFilesChanged();
    }
}
exports.StandardStorage = StandardStorage;


/***/ }),

/***/ 75346:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XModule = exports.XModuleTypes = void 0;
const storage_1 = __importDefault(__webpack_require__(67585));
var XModuleTypes;
(function (XModuleTypes) {
    XModuleTypes["XFile"] = "xFile";
    XModuleTypes["XLocal"] = "xLocal";
    XModuleTypes["XUserIO"] = "xClick";
    XModuleTypes["XDesktop"] = "xDesktop";
    XModuleTypes["XScreenCapture"] = "xScreenCapture";
})(XModuleTypes = exports.XModuleTypes || (exports.XModuleTypes = {}));
class XModule {
    constructor() {
        this.cachedConfig = {};
        this.initConfig();
    }
    getVersion() {
        return this.getAPI()
            .reconnect()
            .catch(e => {
            throw new Error(`${this.getName()} is not installed yet`);
        })
            .then(api => {
            return api.getVersion()
                .then(version => ({
                version,
                installed: true
            }));
        })
            .catch(e => ({
            installed: false
        }));
    }
    setConfig(config) {
        this.cachedConfig = Object.assign(Object.assign({}, this.cachedConfig), config);
        return this.getConfig()
            .then(oldConfig => {
            const nextConfig = Object.assign(Object.assign({}, oldConfig), config);
            return storage_1.default.set(this.getStoreKey(), nextConfig)
                .then(success => {
                if (success) {
                    this.cachedConfig = nextConfig;
                }
                return success;
            });
        });
    }
    getConfig() {
        return storage_1.default.get(this.getStoreKey())
            .then(data => {
            this.cachedConfig = data || {};
            return this.cachedConfig;
        });
    }
    getCachedConfig() {
        return this.cachedConfig;
    }
    getStoreKey() {
        return this.getName().toLowerCase();
    }
}
exports.XModule = XModule;


/***/ }),

/***/ 1577:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getXFile = exports.XFile = void 0;
const common_1 = __webpack_require__(75346);
const filesystem_1 = __webpack_require__(65065);
const ts_utils_1 = __webpack_require__(55452);
const path_1 = __importDefault(__webpack_require__(84037));
class XFile extends common_1.XModule {
    getName() {
        return common_1.XModuleTypes.XFile;
    }
    getAPI() {
        return filesystem_1.getNativeFileSystemAPI();
    }
    getLangs(osType) {
        return this.getConfig()
            .then(config => {
            const { rootDir } = exports.getXFile().getCachedConfig();
            const fsAPI = filesystem_1.getNativeFileSystemAPI();
            return fsAPI.getSpecialFolderPath({ folder: filesystem_1.SpecialFolder.UserProfile })
                .then(profilePath => {
                const uivision = osType == "mac" ? '/Library/uivision-xmodules/2.2.2/xmodules/' : path_1.default.join(profilePath, '\\AppData\\Roaming\\UI.Vision\\XModules\\ocr');
                return fsAPI.ensureDir({ path: uivision })
                    .then(Opath => {
                    let path = uivision;
                    let outputpath = rootDir;
                    let filepath = '', Arguments = '';
                    let ocrOutputJson = '';
                    if (osType == "mac") {
                        filepath = path + '/ocr3';
                        Arguments = " --in get-installed-lng --out " + outputpath + "/logs/ocrlang.json";
                        ocrOutputJson = outputpath + "/logs/ocrlang.json";
                    }
                    else {
                        filepath = path + '\\ocrexe\\ocrcl1.exe';
                        Arguments = "get-installed-lng " + outputpath + "\\logs\\ocrlang.json";
                        ocrOutputJson = outputpath + "\\logs\\ocrlang.json";
                    }
                    let params = {
                        fileName: filepath,
                        arguments: Arguments,
                        waitForExit: true
                    };
                    return fsAPI.runProcess(params).
                        then(res => {
                        if (res != undefined && res.exitCode != null && res.exitCode >= 0) {
                            let params = {
                                path: ocrOutputJson,
                                waitForExit: true
                            };
                            return fsAPI.readAllBytes(params);
                        }
                        else {
                            return;
                        }
                    }).
                        then(json => {
                        if (json) {
                            if (json.errorCode == 0) {
                                console.log(json.content);
                                return json.content;
                            }
                            else {
                                return false;
                            }
                        }
                    }).
                        catch(() => console.log({ result: false }));
                });
            })
                .catch(e => {
                // Ignore host not found error, `initConfig` is supposed to be called on start
                // But we can't guarantee that native fs module is already installed
                if (!/Specified native messaging host not found/.test(e)) {
                    throw e;
                }
            });
        });
    }
    initConfig() {
        return this.getConfig()
            .then(config => {
            if (!config.rootDir) {
                const fsAPI = filesystem_1.getNativeFileSystemAPI();
                return fsAPI.getSpecialFolderPath({ folder: filesystem_1.SpecialFolder.UserDesktop })
                    .then(profilePath => {
                    const kantuDir = path_1.default.join(profilePath, 'uivision');
                    return fsAPI.ensureDir({ path: kantuDir })
                        .then(done => {
                        this.setConfig({
                            rootDir: done ? kantuDir : profilePath
                        });
                    });
                })
                    .catch(e => {
                    // Ignore host not found error, `initConfig` is supposed to be called on start
                    // But we can't guarantee that native fs module is already installed
                    if (!/Specified native messaging host not found/.test(e)) {
                        throw e;
                    }
                });
            }
        });
    }
    sanityCheck(simple) {
        return Promise.all([
            this.getConfig(),
            this.getAPI().getVersion()
                .then(() => this.getAPI(), () => this.getAPI().reconnect())
                .catch(e => {
                throw new Error('xFile is not installed yet');
            })
        ])
            .then(([config, api]) => {
            if (simple) {
                return true;
            }
            if (!config.rootDir) {
                throw new Error('rootDir is not set');
            }
            const checkDirectoryExists = () => {
                return api.directoryExists({ path: config.rootDir })
                    .then((existed) => {
                    if (!existed)
                        throw new Error(`Directory '${config.rootDir}' doesn't exist`);
                    return true;
                });
            };
            const checkDirectoryWritable = () => {
                const testDir = path_1.default.join(config.rootDir, '__kantu__' + Math.round(Math.random() * 100));
                return api.createDirectory({ path: testDir })
                    .then((created) => {
                    if (!created)
                        throw new Error();
                    return api.removeDirectory({ path: testDir });
                })
                    .then((deleted) => {
                    if (!deleted)
                        throw new Error();
                    return true;
                })
                    .catch((e) => {
                    throw new Error(`Directory '${config.rootDir}' is not writable`);
                });
            };
            return checkDirectoryExists()
                .then(checkDirectoryWritable);
        });
    }
    checkUpdate() {
        return Promise.reject(new Error('checkUpdate is not implemented yet'));
    }
    checkUpdateLink(modVersion, extVersion) {
        return `https://ui.vision/x/idehelp?help=xfileaccess_updatecheck&xversion=${modVersion}&kantuversion=${extVersion}`;
    }
    downloadLink() {
        return 'https://ui.vision/x/idehelp?help=xfileaccess_download';
    }
    infoLink() {
        return 'https://ui.vision/x/idehelp?help=xfileaccess';
    }
}
exports.XFile = XFile;
exports.getXFile = ts_utils_1.singletonGetter(() => {
    return new XFile();
});


/***/ }),

/***/ 17514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(8612);

/***/ }),

/***/ 23880:
/***/ ((module) => {

var cache = function (fn) {
    var called = false,
        store;

    if (!(fn instanceof Function)) {
        called = true;
        store = fn;
        fn = null;
    }

    return function () {
        if (!called) {
            called = true;
            store = fn.apply(this, arguments);
            fn = null;
        }
        return store;
    };
};

module.exports = cache;

/***/ }),

/***/ 73148:
/***/ ((module) => {

module.exports = function eachCombination(alternativesByDimension, callback, combination) {
    if (!combination)
        combination = [];
    if (combination.length < alternativesByDimension.length) {
        var alternatives = alternativesByDimension[combination.length];
        for (var index in alternatives) {
            combination[combination.length] = alternatives[index];
            eachCombination(alternativesByDimension, callback, combination);
            --combination.length;
        }
    }
    else
        callback.apply(null, combination);
};

/***/ }),

/***/ 8612:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
    cache: __webpack_require__(23880),
    eachCombination: __webpack_require__(73148)
};

/***/ }),

/***/ 84564:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var required = __webpack_require__(47418)
  , qs = __webpack_require__(57129)
  , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
  , CRHTLF = /[\n\r\t]/g
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , port = /:\d+$/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/;

/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof __webpack_require__.g !== 'undefined') globalVar = __webpack_require__.g;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      index = parse === '@'
        ? address.lastIndexOf(parse)
        : address.indexOf(parse);

      if (~index) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';

  if (url.auth) {
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));

      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password))
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (port.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username +':'+ url.password : url.username;

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , host = url.host
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result =
    protocol +
    ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  } else if (url.password) {
    result += ':'+ url.password;
    result += '@';
  } else if (
    url.protocol !== 'file:' &&
    isSpecial(url.protocol) &&
    !host &&
    url.pathname !== '/'
  ) {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  }

  //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //
  if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
    host += ':';
  }

  result += host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;


/***/ }),

/***/ 91496:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ 20384:
/***/ ((module) => {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ 89539:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(70046);
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(__webpack_require__.g.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = ({"NODE_ENV":"production"}).NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(20384);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(91496);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* provided dependency */ var process = __webpack_require__(70046);


var _keys = __webpack_require__(88902);

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = __webpack_require__(85315);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _slicedToArray2 = __webpack_require__(12424);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = __webpack_require__(88239);

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = __webpack_require__(94942);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = __webpack_require__(46593);

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = __webpack_require__(36803);

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _web_extension = __webpack_require__(61171);

var _web_extension2 = _interopRequireDefault(_web_extension);

var _utils = __webpack_require__(63370);

var _ipc_bg_cs = __webpack_require__(31745);

var _constant = __webpack_require__(43232);

var C = _interopRequireWildcard(_constant);

var _log = __webpack_require__(77242);

var _log2 = _interopRequireDefault(_log);

var _clipboard = __webpack_require__(41191);

var _clipboard2 = _interopRequireDefault(_clipboard);

var _storage = __webpack_require__(67585);

var _storage2 = _interopRequireDefault(_storage);

var _debugger = __webpack_require__(79362);

var _download_man = __webpack_require__(89412);

var _config = __webpack_require__(62275);

var _config2 = _interopRequireDefault(_config);

var _storage3 = __webpack_require__(16058);

var _xfile = __webpack_require__(1577);

var _resize_window = __webpack_require__(79210);

var _ipc_cache = __webpack_require__(54105);

var _tab_utils = __webpack_require__(96836);

var _service = __webpack_require__(76572);

var _types = __webpack_require__(34322);

var _ts_utils = __webpack_require__(55452);

var _proxy = __webpack_require__(51829);

var _log3 = __webpack_require__(30399);

var _contextMenu = __webpack_require__(37584);

var _global_state = __webpack_require__(13426);

var _tab = __webpack_require__(65277);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global browser */

var downloadMan = new _download_man.DownloadMan();

// Generate function to get ipc based on tabIdName and some error message
var genGetTabIpc = function genGetTabIpc(tabIdName, purpose) {
  return function () {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;

    return (0, _utils.retry)((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var state, tabId;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _global_state.getState)();

            case 2:
              state = _context.sent;
              tabId = state.tabIds[tabIdName];

              if (tabId) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return', _promise2.default.reject(new Error('Error #150: No tab for ' + purpose + ' yet')));

            case 6:
              return _context.abrupt('return', _web_extension2.default.tabs.get(tabId));

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })), {
      timeout: timeout,
      retryInterval: 100,
      shouldRetry: function shouldRetry() {
        return true;
      }
    })().then(function (tab) {
      if (!tab) {
        throw new Error('Error #160: The ' + purpose + ' tab seems to be closed');
      }

      return (0, _ipc_cache.getIpcCache)().get(tab.id, timeout, before).catch(function (e) {
        throw new Error('Error #170: No ipc available for the ' + purpose + ' tab');
      });
    });
  };
};

var checkTaIsPresent = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(idexId, wid) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', new _promise2.default(function (resolve, reject) {
              chrome.tabs.query({ windowId: wid }, function (tabs) {
                var doFlag = "";
                for (var i = tabs.length - 1; i >= 0; i--) {
                  if (tabs[i].index === idexId) {
                    doFlag = tabs[i];
                    break;
                  }
                }
                resolve(doFlag);
              });
            }));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function checkTaIsPresent(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var checkWindowisOpen = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(toplayId) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', new _promise2.default(function (resolve, reject) {
              chrome.tabs.query({}, function (tabs) {
                var doFlag = [];
                for (var i = tabs.length - 1; i >= 0; i--) {
                  if (tabs[i].id === toplayId) {
                    doFlag = tabs[i];
                    break;
                  }
                }
                resolve(doFlag);
              });
            }));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function checkWindowisOpen(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var getToplayTabId = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', new _promise2.default(function (resolve, reject) {
              return _web_extension2.default.tabs.query({ active: true }).then(function () {
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(tabs) {
                  return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          resolve(tabs[0]);

                        case 1:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, undefined);
                }));

                return function (_x6) {
                  return _ref5.apply(this, arguments);
                };
              }());
            }));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getToplayTabId() {
    return _ref4.apply(this, arguments);
  };
}();
var getRecordTabIpc = genGetTabIpc('toRecord', 'recording');

var getPlayTabIpc = genGetTabIpc('toPlay', 'playing commands');

var getInspectTabIpc = genGetTabIpc('toInspect', 'inspect');

var getPanelTabIpc = genGetTabIpc('panel', 'dashboard');

var showBadge = function showBadge(options) {
  var _clear$text$color$bli = (0, _extends3.default)({
    clear: false,
    text: '',
    color: '#ff0000',
    blink: 0
  }, options || {}),
      clear = _clear$text$color$bli.clear,
      text = _clear$text$color$bli.text,
      color = _clear$text$color$bli.color,
      blink = _clear$text$color$bli.blink;

  if (clear) {
    return _web_extension2.default.action.setBadgeText({ text: '' });
  }

  _web_extension2.default.action.setBadgeBackgroundColor({ color: color });
  _web_extension2.default.action.setBadgeText({ text: text });

  if (blink) {
    setTimeout(function () {
      _web_extension2.default.action.getBadgeText({}).then(function (curText) {
        if (curText !== text) return false;
        return _web_extension2.default.action.setBadgeText({ text: '' });
      });
    }, blink);
  }

  return true;
};

var toggleRecordingBadge = function toggleRecordingBadge(isRecording, options) {
  return showBadge((0, _extends3.default)({
    color: '#ff0000',
    text: 'R'
  }, options || {}, {
    clear: !isRecording
  }));
};

var toggleInspectingBadge = function toggleInspectingBadge(isInspecting, options) {
  return showBadge((0, _extends3.default)({
    color: '#ffa800',
    text: 'S'
  }, options || {}, {
    clear: !isInspecting
  }));
};

var togglePlayingBadge = function togglePlayingBadge(isPlaying, options) {
  return showBadge((0, _extends3.default)({
    color: '#14c756',
    text: 'P'
  }, options || {}, {
    clear: !isPlaying
  }));
};

var isUpgradeViewed = function isUpgradeViewed() {
  return _web_extension2.default.storage.local.get('upgrade_not_viewed').then(function (obj) {
    return obj['upgrade_not_viewed'] !== 'not_viewed';
  });
};

var notifyRecordCommand = function notifyRecordCommand(command) {
  var notifId = (0, _utils.uid)();

  _web_extension2.default.notifications.create(notifId, {
    type: 'basic',
    iconUrl: './logo.png',
    title: 'Record command!',
    message: function () {
      var list = [];

      list.push('command: ' + command.cmd);
      if (command.target) list.push('target: ' + command.target);
      if (command.value) list.push('value: ' + command.value);

      return list.join('\n');
    }()
  });

  // Note: close record notifications right away, so that notifications won't be stacked
  setTimeout(function () {
    _web_extension2.default.notifications.clear(notifId).catch(function (e) {
      return _log2.default.error(e);
    });
  }, 2000);
};

var notifyAutoPause = function notifyAutoPause() {
  _web_extension2.default.notifications.create({
    type: 'basic',
    iconUrl: './logo.png',
    title: 'Replay paused!',
    message: 'Auto paused by command'
  });
};

var notifyBreakpoint = function notifyBreakpoint() {
  _web_extension2.default.notifications.create({
    type: 'basic',
    iconUrl: './logo.png',
    title: 'Replay paused!',
    message: 'Auto paused by breakpoint'
  });
};

var notifyEcho = function notifyEcho(text) {
  _web_extension2.default.notifications.create({
    type: 'basic',
    iconUrl: './logo.png',
    title: 'Echo',
    message: text
  });
};

var closeAllWindows = function closeAllWindows() {
  return _web_extension2.default.windows.getAll().then(function (wins) {
    return _promise2.default.all(wins.map(function (win) {
      return _web_extension2.default.windows.remove(win.id);
    }));
  });
};

var isTimeToBackup = function isTimeToBackup() {
  return _storage2.default.get('config').then(function (config) {
    var enableAutoBackup = config.enableAutoBackup,
        lastBackupActionTime = config.lastBackupActionTime,
        autoBackupInterval = config.autoBackupInterval;


    if (!enableAutoBackup) {
      return {
        timeout: false,
        remain: -1
      };
    }

    var diff = new Date() * 1 - (lastBackupActionTime || 0);
    return {
      timeout: diff > autoBackupInterval * 24 * 3600000,
      remain: diff
    };
  });
};

var notifyPanelAboutActiveTab = function notifyPanelAboutActiveTab(activeTabId) {
  _promise2.default.all([_web_extension2.default.tabs.get(activeTabId), getPanelTabIpc().catch(function () {
    return null;
  })]).then(function (tuple) {
    var _tuple = (0, _slicedToArray3.default)(tuple, 2),
        tab = _tuple[0],
        panelIpc = _tuple[1];

    if (!panelIpc) return;
    if (tab.url.indexOf(_web_extension2.default.runtime.getURL('')) !== -1) return;

    if (!tab.title || tab.title.trim().length === 0) {
      return (0, _utils.delay)(function () {
        return notifyPanelAboutActiveTab(activeTabId);
      }, 200);
    }

    return panelIpc.ask('UPDATE_ACTIVE_TAB', {
      url: tab.url,
      title: tab.title
    });
  });
};

var isTabActiveAndFocused = function isTabActiveAndFocused(tabId) {
  return _promise2.default.all([_web_extension2.default.tabs.get(tabId), (0, _global_state.getState)()]).then(function (_ref6) {
    var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
        tab = _ref7[0],
        state = _ref7[1];

    if (!tab.active) return false;

    switch (state.status) {
      case C.APP_STATUS.NORMAL:
        return _web_extension2.default.windows.get(tab.windowId).then(function (win) {
          return win.focused;
        });

      case C.APP_STATUS.PLAYER:
        return tabId === state.tabIds.toPlay;

      case C.APP_STATUS.RECORDER:
        return tabId === state.tabIds.toRecord;

      default:
        throw new Error('isTabActiveAndFocused: unknown app status, \'' + state.status + '\'');
    }
  }).catch(function (e) {
    return false;
  });
};

var getStorageManagerForBg = (0, _ts_utils.singletonGetterByKey)(function (mode) {
  return mode;
}, function (mode, extraOptions) {
  return new _storage3.StorageManager(mode, extraOptions);
});

var getCurrentStorageManager = function getCurrentStorageManager() {
  var restoreConfig = function restoreConfig() {
    return _storage2.default.get('config');
  };

  return _promise2.default.all([restoreConfig(), (0, _xfile.getXFile)().getConfig()]).then(function (_ref8) {
    var _ref9 = (0, _slicedToArray3.default)(_ref8, 2),
        config = _ref9[0],
        xFileConfig = _ref9[1];

    return getStorageManagerForBg(config.storageMode);
  });
};

var getLogServiceForBg = (0, _ts_utils.singletonGetter)(function () {
  return new _log3.LogService({
    waitForStorageManager: getCurrentStorageManager
  });
});

function logKantuClosing() {
  return getLogServiceForBg().logWithTime('UI.Vision RPA closing');
}

var bindEvents = function bindEvents() {
  _web_extension2.default.action.onClicked.addListener(function () {
    isUpgradeViewed().then(function (isViewed) {
      if (isViewed) {
        return (0, _tab.showPanelWindow)().then(function (isWindowCreated) {
          if (isWindowCreated) {
            getLogServiceForBg().updateLogFileName();
            getLogServiceForBg().logWithTime('UI.Vision RPA started');
          }
        });
      } else {
        _web_extension2.default.action.setBadgeText({ text: '' });
        _web_extension2.default.storage.local.set({
          upgrade_not_viewed: ''
        });
        return _web_extension2.default.tabs.create({
          url: _config2.default.urlAfterUpgrade
        });
      }
    });
  });

  _web_extension2.default.tabs.onRemoved.addListener(function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(tabId, removeInfo) {
      var state;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _global_state.getState)();

            case 2:
              state = _context6.sent;

              if (!(state.status === C.APP_STATUS.PLAYER && tabId === state.tabIds.toPlay)) {
                _context6.next = 7;
                break;
              }

              if (!state.pendingPlayingTab) {
                _context6.next = 6;
                break;
              }

              return _context6.abrupt('return');

            case 6:
              return _context6.abrupt('return', _web_extension2.default.windows.get(removeInfo.windowId, { populate: true }).then(function (win) {
                var pActiveTab = !win ? (0, _tab_utils.getCurrentTab)().then(function (tab) {
                  if (!tab) return null;
                  // Do nothing if window is also closed and Kantu window is focused
                  if (tab.id === state.tabIds.panel) return null;
                  return tab;
                }) : _promise2.default.resolve(win.tabs.find(function (tab) {
                  return tab.active;
                }));

                return pActiveTab.then(function (tab) {
                  if (tab && tab.id) {
                    // This is the main purpose for this callback: Update tabIds.toPlay to new active tab
                    (0, _global_state.updateState)((0, _utils.setIn)(['tabIds', 'toPlay'], tab.id));
                  }
                });
              }));

            case 7:
              if (tabId === state.tabIds.panel && !state.closingAllWindows) {
                logKantuClosing();
              }

            case 8:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    return function (_x7, _x8) {
      return _ref10.apply(this, arguments);
    };
  }());

  _web_extension2.default.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!tab.active) return;

    isTabActiveAndFocused(tabId).then(function (isFocused) {
      if (!isFocused) return;
      return notifyPanelAboutActiveTab(tabId);
    });
  });

  _web_extension2.default.windows.onFocusChanged.addListener(function (windowId) {
    _web_extension2.default.tabs.query({ windowId: windowId, active: true }).then(function (tabs) {
      if (tabs.length === 0) return;

      (0, _ipc_cache.getIpcCache)().get(tabs[0].id, 100).then(function (ipc) {
        return ipc.ask('TAB_ACTIVATED', {});
      }, function (e) {
        return 'Comment: ingore this error';
      });
    });
  });

  // Note: set the activated tab as the one to play
  _web_extension2.default.tabs.onActivated.addListener(function () {
    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(activeInfo) {
      var _ref12, _ref13, state, tab, updateTabIds;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _promise2.default.all([(0, _global_state.getState)(), _web_extension2.default.tabs.get(activeInfo.tabId)]);

            case 2:
              _ref12 = _context8.sent;
              _ref13 = (0, _slicedToArray3.default)(_ref12, 2);
              state = _ref13[0];
              tab = _ref13[1];

              if (!(activeInfo.tabId === state.tabIds.panel || tab.url.indexOf(_web_extension2.default.runtime.getURL('')) !== -1)) {
                _context8.next = 8;
                break;
              }

              return _context8.abrupt('return');

            case 8:
              _context8.next = 10;
              return (0, _global_state.updateState)(function (state) {
                return (0, _extends3.default)({}, state, {
                  tabIds: (0, _extends3.default)({}, state.tabIds, {
                    lastActivated: state.tabIds.lastActivated.concat(activeInfo.tabId).filter(function (tabId) {
                      return tabId !== state.tabIds.panel;
                    }).slice(-2)
                  })
                });
              });

            case 10:

              (0, _ipc_cache.getIpcCache)().get(activeInfo.tabId, 100).then(function (ipc) {
                return ipc.ask('TAB_ACTIVATED', {});
              }, function (e) {
                return 'Comment: ingore this error';
              });

              notifyPanelAboutActiveTab(activeInfo.tabId);

              _context8.t0 = state.status;
              _context8.next = _context8.t0 === C.APP_STATUS.NORMAL ? 15 : _context8.t0 === C.APP_STATUS.RECORDER ? 20 : 22;
              break;

            case 15:
              if (!(activeInfo.tabId === state.tabIds.panel)) {
                _context8.next = 17;
                break;
              }

              return _context8.abrupt('return');

            case 17:
              updateTabIds = function updateTabIds() {
                _web_extension2.default.tabs.get(activeInfo.tabId).then(function (tab) {
                  if (tab.url.indexOf(_web_extension2.default.runtime.getURL('')) !== -1) return;
                  if (activeInfo.tabId === state.tabIds.panel) return;

                  (0, _log2.default)('in tab activated, set toPlay to ', activeInfo);

                  return (0, _global_state.updateState)(function (state) {
                    return (0, _extends3.default)({}, state, {
                      tabIds: (0, _extends3.default)({}, state.tabIds, {
                        lastPlay: state.tabIds.toPlay,
                        toPlay: activeInfo.tabId,
                        firstPlay: activeInfo.tabId
                      })
                    });
                  });
                });
              };

              // Note: In Firefox, without this delay of 100ms, `tab.url` will still be 'about:config'
              // so have to wait for the url to take effect


              if (_web_extension2.default.isFirefox()) {
                setTimeout(updateTabIds, 100);
              } else {
                updateTabIds();
              }

              return _context8.abrupt('break', 22);

            case 20:
              // Note: three things to do when switch tab in recording
              // 1. set the new tab to RECORDING status,
              // 2. and the original one back to NORMAL status
              // 3. commit a `selectWindow` command
              //
              // Have to wait for the new tab establish connection with background
              (0, _ipc_cache.getIpcCache)().get(activeInfo.tabId, 5000)
              // Note: wait for 2 seconds, expecting commands from original page to be committed
              .then(function (ipc) {
                return (0, _utils.delay)(function () {
                  return ipc;
                }, 2000);
              }).then(function (ipc) {
                return ipc.ask('SET_STATUS', {
                  status: C.CONTENT_SCRIPT_STATUS.RECORDING
                });
              }).then(function () {
                // Note: set the original tab to NORMAL status
                // only if the new tab is set to RECORDING status
                return getRecordTabIpc().then(function (ipc) {
                  ipc.ask('SET_STATUS', {
                    status: C.CONTENT_SCRIPT_STATUS.NORMAL
                  });
                });
              }).then(function () {
                return (0, _global_state.getState)();
              }).then(function (state) {
                // Note: get window locator & update recording tab
                var oldTabId = state.tabIds.firstRecord;
                var newTabId = activeInfo.tabId;

                return _promise2.default.all([_web_extension2.default.tabs.get(oldTabId), _web_extension2.default.tabs.get(newTabId)]).then(function () {
                  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(_ref15) {
                    var _ref16 = (0, _slicedToArray3.default)(_ref15, 2),
                        oldTab = _ref16[0],
                        newTab = _ref16[1];

                    var result;
                    return _regenerator2.default.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            result = [];

                            // update recording tab

                            _context7.next = 3;
                            return (0, _global_state.updateState)((0, _utils.setIn)(['tabIds', 'toRecord'], activeInfo.tabId));

                          case 3:

                            if (oldTab.windowId === newTab.windowId) {
                              result.push('tab=' + (newTab.index - oldTab.index));
                            }

                            result.push('title=' + newTab.title);

                            return _context7.abrupt('return', {
                              target: result[0],
                              targetOptions: result
                            });

                          case 6:
                          case 'end':
                            return _context7.stop();
                        }
                      }
                    }, _callee7, undefined);
                  }));

                  return function (_x10) {
                    return _ref14.apply(this, arguments);
                  };
                }());
              }).then(function (data) {
                // Note: commit the `selectWindow` command
                var command = (0, _extends3.default)({
                  cmd: 'selectWindow'
                }, data);

                return getPanelTabIpc().then(function (panelIpc) {
                  return panelIpc.ask('RECORD_ADD_COMMAND', command);
                }).then(function (shouldNotify) {
                  if (shouldNotify) {
                    notifyRecordCommand(command);
                  }
                });
              }).catch(function (e) {
                _log2.default.error(e.stack);
              });

              return _context8.abrupt('break', 22);

            case 22:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    }));

    return function (_x9) {
      return _ref11.apply(this, arguments);
    };
  }());

  // Ext.downloads.onDeterminingFilename.addListener(async(downloadItem, suggest) => {
  //   const downloadId = downloadItem.id; // Store the downloadItem.id in a separate variable
  //   await delay(() => {}, 5000)
  //  console.log("Proposed filename: " + downloadItem);
  //   var downloadItem={filename:downloadItem.filename}

  //   const item = downloadMan.findById(downloadId)
  //   if (!item){
  //     getPanelTabIpc().then(panelIpc => {
  //       panelIpc.ask('DOWNLOAD_COMPLETE', downloadItem) 
  //     })
  //     return
  //   } 

  //   const tmpName   = item.fileName.trim()
  //   const fileName  = tmpName === '' || tmpName === '*' ? null : tmpName

  //   var downloadItem={filename:fileName}

  //   getPanelTabIpc().then(panelIpc => {
  //     panelIpc.ask('DOWNLOAD_COMPLETE', downloadItem) 
  //   })

  //   if (fileName) {
  //     return suggest({
  //       filename: fileName,
  //       conflictAction: 'uniquify'
  //     })
  //   }


  // });

  // Ext.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest) {
  //   console.log("Proposed filename: " + downloadItem);
  //   var downloadItem={filename:downloadItem.filename}

  //   const item = this.findById(downloadItem.id)
  //   if (!item)  return

  //   const tmpName   = item.fileName.trim()
  //   const fileName  = tmpName === '' || tmpName === '*' ? null : tmpName

  //   if (fileName) {
  //     return suggest({
  //       filename: fileName,
  //       conflictAction: 'uniquify'
  //     })
  //   }

  //   getPanelTabIpc().then(panelIpc => {
  //     panelIpc.ask('DOWNLOAD_COMPLETE', downloadItem) 
  //   })
  // });

  _web_extension2.default.downloads.onChanged.addListener(function (e) {
    var _this = this;

    var downloadDelta = e;
    getPanelTabIpc().then(function (panelIpc) {
      if (typeof downloadDelta.state !== "undefined") {
        if (downloadDelta.state.current === "complete") {
          chrome.downloads.search({ id: downloadDelta.id }, function (downloadItems) {
            if (downloadItems && downloadItems.length > 0) {
              console.log("Downloaded file name111: " + downloadItems[0].filename);
              var downloadItem = { filename: downloadItems[0].filename };
              panelIpc.ask('DOWNLOAD_COMPLETE', downloadItem);
            }
          });
          _storage2.default.get('config').then(function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
              var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
              var state;
              return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.next = 2;
                      return (0, _global_state.getState)();

                    case 2:
                      state = _context9.sent;

                      if (config.cvScope === "browser" && state.status == "PLAYER") {
                        setTimeout(function () {
                          chrome.downloads.erase({ state: "complete" });
                        }, 2000);
                      }

                    case 4:
                    case 'end':
                      return _context9.stop();
                  }
                }
              }, _callee9, _this);
            }));

            return function () {
              return _ref17.apply(this, arguments);
            };
          }());
        }
      }
    });
  });
};

// usage:
// 1. set tabId for inspector:  `setInspectorTabId(someTabId)`
// 2. clear tabId for inspector: `setInspectorTabId(null, true)`
var setInspectorTabId = function () {
  var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(tabId, shouldRemove, noNotify) {
    var state, lastInspect;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return (0, _global_state.getState)();

          case 2:
            state = _context10.sent;
            lastInspect = state.tabIds.toInspect;
            _context10.next = 6;
            return (0, _global_state.updateState)(function (state) {
              return (0, _extends3.default)({}, state, {
                tabIds: (0, _extends3.default)({}, state.tabIds, {
                  lastInspect: lastInspect,
                  toInspect: tabId
                })
              });
            });

          case 6:
            if (!shouldRemove) {
              _context10.next = 12;
              break;
            }

            if (!lastInspect) {
              _context10.next = 11;
              break;
            }

            if (!noNotify) {
              _context10.next = 10;
              break;
            }

            return _context10.abrupt('return', _promise2.default.resolve(true));

          case 10:
            return _context10.abrupt('return', (0, _ipc_cache.getIpcCache)().get(lastInspect).then(function (ipc) {
              return ipc.ask('STOP_INSPECTING');
            }).catch(function (e) {
              return (0, _log2.default)(e.stack);
            }));

          case 11:
            return _context10.abrupt('return', _promise2.default.resolve(true));

          case 12:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function setInspectorTabId(_x12, _x13, _x14) {
    return _ref18.apply(this, arguments);
  };
}();

var startSendingTimeoutStatus = function startSendingTimeoutStatus(timeout) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'wait';

  var timer = void 0;

  var p = (0, _global_state.getState)().then(function (state) {
    var past = 0;

    if (state.timer) clearInterval(state.timer);

    timer = setInterval(function () {
      past += 1000;

      getPanelTabIpc().then(function (panelIpc) {
        panelIpc.ask('TIMEOUT_STATUS', {
          type: type,
          past: past,
          total: timeout
        });
      });

      if (past >= timeout) {
        clearInterval(timer);
      }
    }, 1000);

    return (0, _global_state.updateState)({ timer: timer });
  });

  return function () {
    return p.then(function () {
      return clearInterval(timer);
    });
  };
};

var pacListener = function pacListener(data) {
  if (data.type === 'PROXY_LOG') {
    (0, _log2.default)('PROXY_LOG', data);
  }
};

// Processor for all message background could receive
// All messages from panel starts with 'PANEL_'
// All messages from content script starts with 'CS_'
var onRequest = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20(cmd, args) {
    var state, ipcTimeout, ipcNoLaterThan, payload, tabId, timeout, menuInfos, list, lastActivatedTabId, dict, fn, pPanelTab, pAllWindows, last, getWindowInfo, isWindowInfoEqual, _tabId, url, _cmd, rect, devicePixelRatio, fileName, _tabId2, _rect, _devicePixelRatio, _tabId3, _tabId4, pullbackTimeout, isFirst, _tabId5, _tabId6, closeTabAndGetNextTabOnWindow, withKantuWindowMinimized, closeAndGetNextTab, runWithTab, oldTablId, _splitIntoTwo, _splitIntoTwo2, type, locator, pGetTabs, offset, _url, p, from;

    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return (0, _global_state.getState)();

          case 2:
            state = _context20.sent;


            if (cmd !== 'CS_ACTIVATE_ME') {
              (0, _log2.default)('onAsk', cmd, args);
            }

            _context20.t0 = cmd;
            _context20.next = _context20.t0 === 'I_AM_PANEL' ? 7 : _context20.t0 === 'PANEL_CAPTURE_VISIBLE_TAB' ? 16 : _context20.t0 === 'PANEL_SET_PROXY' ? 17 : _context20.t0 === 'PANEL_GET_PROXY' ? 18 : _context20.t0 === 'PANEL_TIME_FOR_BACKUP' ? 19 : _context20.t0 === 'PANEL_LOG' ? 20 : _context20.t0 === 'PANEL_CALL_PLAY_TAB' ? 21 : _context20.t0 === 'PANEL_CS_IPC_READY' ? 23 : _context20.t0 === 'PANEL_HAS_PENDING_DOWNLOAD' ? 25 : _context20.t0 === 'PANEL_WAIT_FOR_ANY_DOWNLOAD' ? 26 : _context20.t0 === 'PANEL_START_RECORDING' ? 27 : _context20.t0 === 'PANEL_STOP_RECORDING' ? 38 : _context20.t0 === 'PANEL_TRY_TO_RECORD_OPEN_COMMAND' ? 45 : _context20.t0 === 'PANEL_START_INSPECTING' ? 48 : _context20.t0 === 'PANEL_STOP_INSPECTING' ? 54 : _context20.t0 === 'PANEL_START_PLAYING' ? 59 : _context20.t0 === 'PANEL_HEART_BEAT' ? 69 : _context20.t0 === 'PANEL_STOP_PLAYING' ? 70 : _context20.t0 === 'PANEL_HIGHLIGHT_DOM' ? 77 : _context20.t0 === 'PANEL_HIGHLIGHT_RECT' ? 78 : _context20.t0 === 'PANEL_HIGHLIGHT_RECTS' ? 79 : _context20.t0 === 'PANEL_HIGHLIGHT_DESKTOP_RECTS' ? 80 : _context20.t0 === 'PANEL_HIGHLIGHT_OCR_MATCHES' ? 81 : _context20.t0 === 'PANEL_CLEAR_OCR_MATCHES_ON_PLAYING_PAGE' ? 86 : _context20.t0 === 'PANEL_RESIZE_WINDOW' ? 87 : _context20.t0 === 'PANEL_UPDATE_BADGE' ? 90 : _context20.t0 === 'PANEL_NOTIFY_AUTO_PAUSE' ? 95 : _context20.t0 === 'PANEL_NOTIFY_BREAKPOINT' ? 97 : _context20.t0 === 'PANEL_NOTIFY_ECHO' ? 99 : _context20.t0 === 'PANEL_CLOSE_ALL_WINDOWS' ? 101 : _context20.t0 === 'PANEL_CURRENT_PLAY_TAB_INFO' ? 104 : _context20.t0 === 'PANEL_MINIMIZE_ALL_WINDOWS_BUT_PANEL' ? 105 : _context20.t0 === 'PANEL_MINIMIZE_ALL_WINDOWS' ? 108 : _context20.t0 === 'PANEL_BRING_PANEL_TO_FOREGROUND' ? 109 : _context20.t0 === 'PANEL_BRING_PLAYING_WINDOW_TO_FOREGROUND' ? 110 : _context20.t0 === 'PANEL_RESIZE_PLAY_TAB' ? 111 : _context20.t0 === 'PANEL_SELECT_AREA_ON_CURRENT_PAGE' ? 112 : _context20.t0 === 'PANEL_CLEAR_VISION_RECTS_ON_PLAYING_PAGE' ? 113 : _context20.t0 === 'PANEL_HIDE_VISION_HIGHLIGHT' ? 114 : _context20.t0 === 'PANEL_SHOW_VISION_HIGHLIGHT' ? 115 : _context20.t0 === 'PANEL_SCREENSHOT_PAGE_INFO' ? 116 : _context20.t0 === 'PANEL_TOGGLE_HIGHLIGHT_VIEWPORT' ? 117 : _context20.t0 === 'PANEL_DISABLE_DOWNLOAD_BAR' ? 118 : _context20.t0 === 'PANEL_ENABLE_DOWNLOAD_BAR' ? 120 : _context20.t0 === 'PANEL_GET_VIEWPORT_RECT_IN_SCREEN' ? 122 : _context20.t0 === 'PANEL_XCLICK_NEED_CALIBRATION' ? 123 : _context20.t0 === 'PANEL_CLOSE_CURRENT_TAB_AND_SWITCH_TO_LAST_PLAYED' ? 127 : _context20.t0 === 'CS_LOAD_URL' ? 128 : _context20.t0 === 'CS_STORE_SCREENSHOT_IN_SELECTION' ? 132 : _context20.t0 === 'CS_SCREEN_AREA_SELECTED' ? 135 : _context20.t0 === 'CS_DONE_INSPECTING' ? 139 : _context20.t0 === 'CS_ACTIVATE_ME' ? 146 : _context20.t0 === 'CS_RECORD_ADD_COMMAND' ? 157 : _context20.t0 === 'PANEL_CLOSE_OTHER_TABS' ? 173 : _context20.t0 === 'PANEL_CLOSE_CURRENT_TAB' ? 175 : _context20.t0 === 'PANEL_SELECT_WINDOW' ? 183 : _context20.t0 === 'CS_TIMEOUT_STATUS' ? 204 : _context20.t0 === 'CS_DELETE_ALL_COOKIES' ? 205 : _context20.t0 === 'CS_SET_FILE_INPUT_FILES' ? 207 : _context20.t0 === 'CS_ON_DOWNLOAD' ? 208 : _context20.t0 === 'CS_INVOKE' ? 210 : _context20.t0 === 'CS_IMPORT_AND_INVOKE' ? 211 : _context20.t0 === 'CS_ADD_LOG' ? 213 : _context20.t0 === 'CS_OPEN_PANEL_SETTINGS' ? 214 : _context20.t0 === 'DESKTOP_EDITOR_ADD_VISION_IMAGE' ? 216 : _context20.t0 === 'TIMEOUT' ? 217 : 219;
            break;

          case 7:
            _context20.next = 9;
            return (0, _utils.delay)(function () {}, 500);

          case 9:
            _context20.next = 11;
            return (0, _global_state.updateState)((0, _utils.setIn)(['tabIds', 'panel'], args.sender.tab.id));

          case 11:

            (0, _contextMenu.getContextMenuService)().destroyMenus();

            // Note: when the panel first open first, it could be marked as the tab to play
            // That's something we don't want to happen

            if (!(state.tabIds.toPlay === args.sender.tab.id)) {
              _context20.next = 15;
              break;
            }

            _context20.next = 15;
            return (0, _global_state.updateState)(function (state) {
              return (0, _extends3.default)({}, state, {
                tabIds: (0, _extends3.default)({}, state.tabIds, {
                  toPlay: state.tabIds.lastPlay,
                  firstPlay: state.tabIds.lastPlay,
                  lastActivated: state.tabIds.lastActivated.filter(function (id) {
                    return id !== args.sender.tab.id;
                  })
                })
              });
            });

          case 15:
            return _context20.abrupt('return', true);

          case 16:
            return _context20.abrupt('return', _web_extension2.default.tabs.captureVisibleTab(args.windowId, args.options));

          case 17:
            return _context20.abrupt('return', (0, _proxy.setProxy)(args.proxy).then(function () {
              return true;
            }));

          case 18:
            return _context20.abrupt('return', (0, _proxy.getProxyManager)().getProxy());

          case 19:
            return _context20.abrupt('return', isTimeToBackup().then(function (obj) {
              return obj.timeout;
            }));

          case 20:
            return _context20.abrupt('return', getLogServiceForBg().log(args.log));

          case 21:
            ipcTimeout = args.ipcTimeout, ipcNoLaterThan = args.ipcNoLaterThan, payload = args.payload;
            return _context20.abrupt('return', getPlayTabIpc(ipcTimeout, ipcNoLaterThan).then(function (ipc) {
              return ipc.ask(payload.command, payload.args);
            }));

          case 23:
            tabId = args.tabId, timeout = args.timeout;
            return _context20.abrupt('return', (0, _ipc_cache.getIpcCache)().get(tabId, timeout).then(function () {
              return true;
            }));

          case 25:
            return _context20.abrupt('return', (0, _download_man.getDownloadMan)().hasPendingDownload());

          case 26:
            return _context20.abrupt('return', (0, _download_man.getDownloadMan)().waitForDownloadIfAny().then(function () {
              return true;
            }));

          case 27:
            (0, _log2.default)('Start to record...');
            _context20.next = 30;
            return (0, _global_state.updateState)({ status: C.APP_STATUS.RECORDER });

          case 30:

            setInspectorTabId(null, true);
            toggleRecordingBadge(true);

            menuInfos = [{
              id: 'verifyText',
              title: 'Verify Text',
              contexts: ['page', 'selection']
            }, {
              id: 'verifyTitle',
              title: 'Verify Title',
              contexts: ['page', 'selection']
            }, {
              id: 'assertText',
              title: 'Assert Text',
              contexts: ['page', 'selection']
            }, {
              id: 'assertTitle',
              title: 'Assert Title',
              contexts: ['page', 'selection']
            }].map(function (item) {
              return (0, _extends3.default)({}, item, {
                onclick: function onclick() {
                  getRecordTabIpc().then(function (ipc) {
                    return ipc.ask('CONTEXT_MENU_IN_RECORDING', { command: item.id });
                  });
                }
              });
            });


            (0, _contextMenu.getContextMenuService)().createMenus(menuInfos);

            list = state.tabIds.lastActivated.filter(function (id) {
              return id !== state.tabIds.panel;
            });
            lastActivatedTabId = list[list.length - 1];


            if (lastActivatedTabId) {
              (0, _tab_utils.activateTab)(lastActivatedTabId, true).catch(function (e) {
                _log2.default.warn('Failed to activate current tab: ' + e.message);
              });
            }

            return _context20.abrupt('return', true);

          case 38:
            (0, _log2.default)('Stop recording...');

            (0, _contextMenu.getContextMenuService)().destroyMenus();
            getRecordTabIpc().then(function (ipc) {
              ipc.ask('SET_STATUS', {
                status: C.CONTENT_SCRIPT_STATUS.NORMAL
              });
            });

            _context20.next = 43;
            return (0, _global_state.updateState)(function (state) {
              return (0, _extends3.default)({}, state, {
                status: C.APP_STATUS.NORMAL,
                tabIds: (0, _extends3.default)({}, state.tabIds, {
                  toRecord: null,
                  firstRecord: null,
                  lastRecord: state.tabIds.toRecord
                })
              });
            });

          case 43:

            toggleRecordingBadge(false);
            return _context20.abrupt('return', true);

          case 45:
            if (!(state.status !== C.APP_STATUS.RECORDER)) {
              _context20.next = 47;
              break;
            }

            throw new Error('Not in recorder mode');

          case 47:
            return _context20.abrupt('return', (0, _tab.getPlayTab)().then(function () {
              var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(tab) {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        (0, _log2.default)('PANEL_TRY_TO_RECORD_OPEN_COMMAND', tab);

                        if (/^(https?:|file:)/.test(tab.url)) {
                          _context11.next = 3;
                          break;
                        }

                        throw new Error('Not a valid url to record as open command');

                      case 3:
                        _context11.next = 5;
                        return (0, _global_state.updateState)(function (state) {
                          return (0, _extends3.default)({}, state, {
                            tabIds: (0, _extends3.default)({}, state.tabIds, {
                              toRecord: tab.id,
                              firstRecord: tab.id
                            })
                          });
                        });

                      case 5:

                        getPanelTabIpc().then(function (panelIpc) {
                          var command = {
                            cmd: 'open',
                            target: tab.url
                          };

                          panelIpc.ask('RECORD_ADD_COMMAND', command);
                          notifyRecordCommand(command);
                        });

                        return _context11.abrupt('return', true);

                      case 7:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, _callee11, undefined);
              }));

              return function (_x18) {
                return _ref20.apply(this, arguments);
              };
            }()));

          case 48:
            (0, _log2.default)('start to inspect...');
            toggleInspectingBadge(true);

            if (state.tabIds.toPlay) {
              (0, _tab_utils.activateTab)(state.tabIds.toPlay, true);
            }

            _context20.next = 53;
            return (0, _global_state.updateState)({ status: C.APP_STATUS.INSPECTOR });

          case 53:
            return _context20.abrupt('return', true);

          case 54:
            (0, _log2.default)('start to inspect...');
            _context20.next = 57;
            return (0, _global_state.updateState)({ status: C.APP_STATUS.NORMAL });

          case 57:

            toggleInspectingBadge(false);
            return _context20.abrupt('return', setInspectorTabId(null, true));

          case 59:
            (0, _log2.default)('start to play...');
            _context20.next = 62;
            return (0, _global_state.updateState)({
              status: C.APP_STATUS.PLAYER,
              pendingPlayingTab: false,
              xClickNeedCalibrationInfo: null
            });

          case 62:

            _storage2.default.get('config').then(function () {
              var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
                var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var state;
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return (0, _global_state.getState)();

                      case 2:
                        state = _context12.sent;

                        if (config.cvScope === "browser" && state.status == "PLAYER") {
                          setTimeout(function () {
                            chrome.downloads.erase({ state: "complete" });
                          }, 2000);
                        }

                      case 4:
                      case 'end':
                        return _context12.stop();
                    }
                  }
                }, _callee12, undefined);
              }));

              return function () {
                return _ref21.apply(this, arguments);
              };
            }());

            setInspectorTabId(null, true);
            togglePlayingBadge(true);
            // Note: reset download manager to clear any previous downloads
            (0, _download_man.getDownloadMan)().reset();
            // Re-check log service to see if xfile is ready to write log
            getLogServiceForBg().check();

            if (state.timer) clearInterval(state.timer);

            return _context20.abrupt('return', true);

          case 69:
            return _context20.abrupt('return', (0, _global_state.getState)('heartBeatSecret').then(function () {
              var secret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
              return secret;
            }));

          case 70:
            _context20.next = 72;
            return (0, _global_state.updateState)(function (state) {
              return (0, _extends3.default)({}, state, {
                status: C.APP_STATUS.NORMAL,
                tabIds: (0, _extends3.default)({}, state.tabIds, {
                  // Note: reset firstPlay to current toPlay when stopped playing
                  // userful for playing loop (reset firstPlay after each loop)
                  firstPlay: state.tabIds.toPlay,
                  // reset lastPlay here is useful for ContinueInLastUsedTab
                  lastPlay: state.tabIds.toPlay
                })
              });
            });

          case 72:

            // Note: let cs know that it should exit playing mode
            (0, _ipc_cache.getIpcCache)().get(state.tabIds.toPlay).then(function (ipc) {
              return ipc.ask('SET_STATUS', { status: C.CONTENT_SCRIPT_STATUS.NORMAL }, C.CS_IPC_TIMEOUT);
            });

            togglePlayingBadge(false);

            // Note: reset download manager to clear any previous downloads
            (0, _download_man.getDownloadMan)().reset();

            if (state.timer) clearInterval(state.timer);

            return _context20.abrupt('return', true);

          case 77:
            return _context20.abrupt('return', _promise2.default.all([getRecordTabIpc().then(function (ipc) {
              return { ipc: ipc, type: 'record' };
            }).catch(function () {
              return null;
            }), getPlayTabIpc().then(function (ipc) {
              return { ipc: ipc, type: 'play' };
            }).catch(function () {
              return null;
            })]).then(function (tuple) {
              if (!tuple[0] && !tuple[1]) {
                throw new Error('No where to look for the dom');
              }

              return tuple.filter(function (x) {
                return !!x;
              });
            }).then(function (list) {
              return _promise2.default.all(list.map(function (_ref22) {
                var ipc = _ref22.ipc,
                    type = _ref22.type;

                return ipc.ask('FIND_DOM', { locator: args.locator }).then(function (result) {
                  return { result: result, type: type, ipc: ipc };
                });
              }));
            }).then(function () {
              var _ref23 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(list) {
                var foundedList, item, state, tabId;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        foundedList = list.filter(function (x) {
                          return x.result;
                        });

                        if (!(foundedList.length === 0)) {
                          _context13.next = 3;
                          break;
                        }

                        throw new Error('DOM not found');

                      case 3:
                        item = foundedList.length === 2 ? foundedList.find(function (item) {
                          return item.type === args.lastOperation;
                        }) : foundedList[0];
                        _context13.next = 6;
                        return (0, _global_state.getState)();

                      case 6:
                        state = _context13.sent;
                        tabId = state.tabIds[item.type === 'record' ? 'lastRecord' : 'toPlay'];
                        return _context13.abrupt('return', (0, _tab_utils.activateTab)(tabId, true).then(function () {
                          return item.ipc.ask('HIGHLIGHT_DOM', { locator: args.locator, cmd: args.cmd });
                        }));

                      case 9:
                      case 'end':
                        return _context13.stop();
                    }
                  }
                }, _callee13, undefined);
              }));

              return function (_x21) {
                return _ref23.apply(this, arguments);
              };
            }()));

          case 78:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('HIGHLIGHT_RECT', args, C.CS_IPC_TIMEOUT);
            }));

          case 79:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('HIGHLIGHT_RECTS', args, C.CS_IPC_TIMEOUT);
            }));

          case 80:
            return _context20.abrupt('return', (0, _service.runInDesktopScreenshotEditor)(args.screenAvailableSize, {
              type: _types.DesktopScreenshot.RequestType.DisplayVisualResult,
              data: {
                rects: args.scoredRects,
                image: args.imageInfo
              }
            }));

          case 81:
            if (!args.isDesktop) {
              _context20.next = 85;
              break;
            }

            return _context20.abrupt('return', getCurrentStorageManager().then(function (storageManager) {
              var source = storageManager.getCurrentStrategyType() === _storage3.StorageStrategyType.XFile ? _types.DesktopScreenshot.ImageSource.HardDrive : _types.DesktopScreenshot.ImageSource.Storage;

              return (0, _service.runInDesktopScreenshotEditor)(args.screenAvailableSize, {
                type: _types.DesktopScreenshot.RequestType.DisplayOcrResult,
                data: {
                  ocrMatches: args.ocrMatches,
                  image: {
                    source: source,
                    path: (0, _utils.ensureExtName)('.png', C.LAST_DESKTOP_SCREENSHOT_FILE_NAME)
                  }
                }
              });
            }));

          case 85:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('HIGHLIGHT_OCR_MATCHES', args, C.CS_IPC_TIMEOUT);
            }));

          case 86:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return _promise2.default.all([ipc.ask('CLEAR_VISION_RECTS', {}, C.CS_IPC_TIMEOUT), ipc.ask('CLEAR_OCR_MATCHES', {}, C.CS_IPC_TIMEOUT)]);
            }));

          case 87:
            if (state.tabIds.panel) {
              _context20.next = 89;
              break;
            }

            throw new Error('Panel not available');

          case 89:
            return _context20.abrupt('return', _web_extension2.default.tabs.get(state.tabIds.panel).then(function (tab) {
              return _web_extension2.default.windows.update(tab.windowId, (0, _utils.pick)(['width', 'height'], (0, _extends3.default)({}, args.size, {
                width: args.size.width,
                height: args.size.height
              })));
            }));

          case 90:
            dict = {
              play: togglePlayingBadge,
              record: toggleRecordingBadge,
              inspect: toggleInspectingBadge
            };
            fn = dict[args.type];

            if (fn) {
              _context20.next = 94;
              break;
            }

            throw new Error('unknown type for updating badge, \'' + args.type + '\'');

          case 94:
            return _context20.abrupt('return', fn(!args.clear, args));

          case 95:
            notifyAutoPause();
            return _context20.abrupt('return', true);

          case 97:
            notifyBreakpoint();
            return _context20.abrupt('return', true);

          case 99:
            notifyEcho(args.text);
            return _context20.abrupt('return', true);

          case 101:
            _context20.next = 103;
            return (0, _global_state.updateState)({ closingAllWindows: true });

          case 103:
            return _context20.abrupt('return', logKantuClosing().catch(function (e) {
              _log2.default.warn('Error in log => RPA closing: ', e.message);
            }).then(function () {
              closeAllWindows();
              return true;
            }));

          case 104:
            return _context20.abrupt('return', (0, _tab.getPlayTab)().then(function (tab) {
              return {
                url: tab.url,
                title: tab.title
              };
            }));

          case 105:
            pPanelTab = !state.tabIds.panel ? _promise2.default.resolve() : _web_extension2.default.tabs.get(state.tabIds.panel);
            pAllWindows = _web_extension2.default.windows.getAll();
            return _context20.abrupt('return', _promise2.default.all([pPanelTab, pAllWindows]).then(function (_ref24) {
              var _ref25 = (0, _slicedToArray3.default)(_ref24, 2),
                  tab = _ref25[0],
                  wins = _ref25[1];

              var list = !tab ? wins : wins.filter(function (win) {
                return win.id !== tab.windowId;
              });
              return _promise2.default.all(list.map(function (win) {
                return _web_extension2.default.windows.update(win.id, { state: 'minimized' });
              }));
            }).then(function () {
              return (0, _utils.delay)(function () {
                return true;
              }, 500);
            }));

          case 108:
            return _context20.abrupt('return', _web_extension2.default.windows.getAll().then(function (wins) {
              return _promise2.default.all(wins.map(function (win) {
                return _web_extension2.default.windows.update(win.id, { state: 'minimized' });
              })).then(function () {
                return (0, _utils.delay)(function () {
                  return true;
                }, 500);
              });
            }));

          case 109:
            return _context20.abrupt('return', (0, _tab.showPanelWindow)().then(function () {
              return true;
            }));

          case 110:
            return _context20.abrupt('return', (0, _tab.getPlayTab)().then(function (tab) {
              return (0, _tab_utils.activateTab)(tab.id, true);
            }).catch(function (e) {
              return (0, _tab.showPanelWindow)();
            }).then(function () {
              return true;
            }));

          case 111:
            return _context20.abrupt('return', (0, _tab.getPlayTab)().then(function (tab) {
              return (0, _resize_window.resizeViewportOfTab)(tab.id, args.viewportSize, args.screenAvailableRect);
            }));

          case 112:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              (0, _tab_utils.activateTab)(state.tabIds.toPlay, true);
              return ipc.ask('SELECT_SCREEN_AREA');
            }).catch(function (e) {
              _log2.default.error(e.stack);
              throw new Error('Not able to take screenshot on the current tab');
            }));

          case 113:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return _promise2.default.all([ipc.ask('CLEAR_VISION_RECTS', {}, C.CS_IPC_TIMEOUT), ipc.ask('CLEAR_OCR_MATCHES', {}, C.CS_IPC_TIMEOUT)]);
            }));

          case 114:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('HIDE_VISION_RECTS', {}, C.CS_IPC_TIMEOUT);
            }));

          case 115:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('SHOW_VISION_RECTS', {}, C.CS_IPC_TIMEOUT);
            }));

          case 116:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('SCREENSHOT_PAGE_INFO', {}, C.CS_IPC_TIMEOUT);
            }));

          case 117:
            return _context20.abrupt('return', getPlayTabIpc().then(function (ipc) {
              return ipc.ask('TOGGLE_HIGHLIGHT_VIEWPORT', args, C.CS_IPC_TIMEOUT);
            }));

          case 118:
            _web_extension2.default.downloads.setShelfEnabled(false);
            return _context20.abrupt('return', (0, _utils.delay)(function () {
              return true;
            }, 1000));

          case 120:
            _web_extension2.default.downloads.setShelfEnabled(true);
            return _context20.abrupt('return', (0, _utils.delay)(function () {
              return true;
            }, 1000));

          case 122:
            return _context20.abrupt('return', _promise2.default.all([getPlayTabIpc(), (0, _tab.getPlayTab)().then(function (tab) {
              return _web_extension2.default.tabs.getZoom(tab.id);
            })]).then(function (_ref26) {
              var _ref27 = (0, _slicedToArray3.default)(_ref26, 2),
                  ipc = _ref27[0],
                  zoom = _ref27[1];

              return getPlayTabIpc().then(function (ipc) {
                return ipc.ask('GET_VIEWPORT_RECT_IN_SCREEN', { zoom: zoom });
              });
            }));

          case 123:
            last = state.xClickNeedCalibrationInfo;

            getWindowInfo = function getWindowInfo(win, tabId) {
              return {
                id: win.id,
                top: win.top,
                left: win.left,
                width: win.width,
                height: win.height,
                activeTabId: tabId
              };
            };

            isWindowInfoEqual = function isWindowInfoEqual(a, b) {
              return _utils.and.apply(undefined, (0, _toConsumableArray3.default)('id, top, left, width, height, activeTabId'.split(/,\s*/g).map(function (key) {
                return a[key] === b[key];
              })));
            };
            // Note: we take every request as it will do calibration
            // and next request should get `false` (no need for more calibration, unless there are window change or window resize)


            return _context20.abrupt('return', (0, _tab.getPlayTab)().then(function (tab) {
              if (!tab) throw new Error('no play tab found for calibration');

              return _web_extension2.default.windows.get(tab.windowId).then(function () {
                var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(win) {
                  var winInfo;
                  return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                      switch (_context14.prev = _context14.next) {
                        case 0:
                          winInfo = getWindowInfo(win, tab.id);


                          (0, _log2.default)('CALIBRATION NEED???', last, winInfo);

                          // Note: cache last value
                          _context14.next = 4;
                          return (0, _global_state.updateState)({ xClickNeedCalibrationInfo: winInfo });

                        case 4:
                          return _context14.abrupt('return', !isWindowInfoEqual(winInfo, last || {}));

                        case 5:
                        case 'end':
                          return _context14.stop();
                      }
                    }
                  }, _callee14, undefined);
                }));

                return function (_x22) {
                  return _ref28.apply(this, arguments);
                };
              }());
            }));

          case 127:
            return _context20.abrupt('return', (0, _tab.getPlayTab)().then(function (currentTab) {
              return _web_extension2.default.windows.get(currentTab.windowId, { populate: true }).then(function () {
                var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(win) {
                  var index, prevIndex, prevTab, state, pNextTab;
                  return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                      switch (_context15.prev = _context15.next) {
                        case 0:
                          if (!(win.tabs.length < 2)) {
                            _context15.next = 2;
                            break;
                          }

                          return _context15.abrupt('return', true);

                        case 2:
                          index = win.tabs.findIndex(function (tab) {
                            return tab.id === currentTab.id;
                          });
                          prevIndex = (index - 1 + win.tabs.length) % win.tabs.length;
                          prevTab = win.tabs[prevIndex];
                          _context15.next = 7;
                          return (0, _global_state.getState)();

                        case 7:
                          state = _context15.sent;

                          pNextTab = function () {
                            if (state.tabIds.lastPlay) {
                              return _web_extension2.default.tabs.get(state.tabIds.lastPlay).catch(function () {
                                return prevTab;
                              });
                            } else {
                              return _promise2.default.resolve(prevTab);
                            }
                          }();

                          if (!(currentTab.id == state.tabIds.lastPlay)) {
                            _context15.next = 13;
                            break;
                          }

                          return _context15.abrupt('return', _web_extension2.default.tabs.get(currentTab.id).then(function () {
                            return pNextTab;
                          }).then(function (nextTab) {
                            return (0, _tab_utils.activateTab)(nextTab.id);
                          }).then(function () {
                            return (0, _utils.delay)(function () {}, 500);
                          }).then(function () {
                            return true;
                          }));

                        case 13:
                          return _context15.abrupt('return', _web_extension2.default.tabs.remove(currentTab.id).then(function () {
                            return pNextTab;
                          }).then(function (nextTab) {
                            return (0, _tab_utils.activateTab)(nextTab.id);
                          })
                          // Note: add this delay to avoid Error #101
                          // looks like when the pc is quick enough, there are chances
                          // that next macro run fails to find the tab for replay
                          .then(function () {
                            return (0, _utils.delay)(function () {}, 500);
                          }).then(function () {
                            return true;
                          }));

                        case 14:
                        case 'end':
                          return _context15.stop();
                      }
                    }
                  }, _callee15, undefined);
                }));

                return function (_x23) {
                  return _ref29.apply(this, arguments);
                };
              }());
            }));

          case 128:
            _tabId = args.sender.tab.id;
            url = args.url;
            _cmd = args.cmd;
            return _context20.abrupt('return', (0, _tab_utils.getTab)(_tabId).then(function (tab) {
              var finalUrl = function () {
                try {
                  var u = new URL(url, tab.url);
                  return u.toString();
                } catch (e) {
                  return url;
                }
              }();

              return (0, _tab_utils.updateUrlForTab)(_tabId, finalUrl, _cmd).then(function () {
                return true;
              });
            }));

          case 132:
            rect = args.rect, devicePixelRatio = args.devicePixelRatio, fileName = args.fileName;
            _tabId2 = args.sender.tab.id;
            return _context20.abrupt('return', getPanelTabIpc().then(function (ipc) {
              return ipc.ask('STORE_SCREENSHOT_IN_SELECTION', {
                rect: rect,
                tabId: _tabId2,
                fileName: fileName,
                devicePixelRatio: devicePixelRatio
              });
            }));

          case 135:
            _rect = args.rect, _devicePixelRatio = args.devicePixelRatio;
            _tabId3 = args.sender.tab.id;


            (0, _log2.default)('CS_SCREEN_AREA_SELECTED', _rect, _devicePixelRatio, _tabId3);

            return _context20.abrupt('return', getPanelTabIpc().then(function (ipc) {
              return ipc.ask('SCREEN_AREA_SELECTED', {
                rect: _rect,
                tabId: _tabId3,
                devicePixelRatio: _devicePixelRatio
              }).then(function (data) {
                return (0, _tab.withPanelIpc)().then(function () {
                  return data;
                });
              });
            }));

          case 139:
            (0, _log2.default)('done inspecting...');

            _context20.next = 142;
            return (0, _global_state.updateState)({ status: C.APP_STATUS.NORMAL });

          case 142:

            toggleInspectingBadge(false);
            setInspectorTabId(null, true, true);
            (0, _tab_utils.activateTab)(state.tabIds.panel, true);

            return _context20.abrupt('return', getPanelTabIpc().then(function (panelIpc) {
              return panelIpc.ask('INSPECT_RESULT', args);
            }));

          case 146:
            _context20.t1 = state.status;
            _context20.next = _context20.t1 === C.APP_STATUS.INSPECTOR ? 149 : 156;
            break;

          case 149:
            if (state.tabIds.toInspect) {
              _context20.next = 155;
              break;
            }

            _tabId4 = args.sender.tab.id;
            _context20.next = 153;
            return (0, _global_state.updateState)((0, _utils.setIn)(['tabIds', 'toInspect'], _tabId4));

          case 153:

            setTimeout(function () {
              (0, _ipc_cache.getIpcCache)().get(_tabId4).then(function (ipc) {
                return ipc.ask('SET_STATUS', {
                  status: C.CONTENT_SCRIPT_STATUS.INSPECTING
                });
              });
            }, 0);

            return _context20.abrupt('return', true);

          case 155:
            return _context20.abrupt('break', 156);

          case 156:
            return _context20.abrupt('return', false);

          case 157:
            pullbackTimeout = 1000;
            isFirst = false;

            if (!(state.status !== C.APP_STATUS.RECORDER)) {
              _context20.next = 161;
              break;
            }

            return _context20.abrupt('return', false);

          case 161:
            if (state.tabIds.toRecord) {
              _context20.next = 165;
              break;
            }

            isFirst = true;

            _context20.next = 165;
            return (0, _global_state.updateState)(function (state) {
              return (0, _extends3.default)({}, state, {
                tabIds: (0, _extends3.default)({}, state.tabIds, {
                  toRecord: args.sender.tab.id,
                  firstRecord: args.sender.tab.id
                })
              });
            });

          case 165:
            if (!(state.tabIds.toRecord !== args.sender.tab.id)) {
              _context20.next = 167;
              break;
            }

            return _context20.abrupt('return', false);

          case 167:
            if (!(args.cmd === 'pullback')) {
              _context20.next = 171;
              break;
            }

            (0, _global_state.updateState)({ pullback: true });
            setTimeout(function () {
              return (0, _global_state.updateState)({ pullback: false });
            }, pullbackTimeout * 2);
            return _context20.abrupt('return', false);

          case 171:

            setTimeout(function () {
              (0, _ipc_cache.getIpcCache)().get(state.tabIds.toRecord).then(function (ipc) {
                return ipc.ask('SET_STATUS', {
                  status: C.CONTENT_SCRIPT_STATUS.RECORDING
                });
              });
            }, 0);

            return _context20.abrupt('return', (0, _utils.delay)(function () {}, pullbackTimeout).then(function () {
              return getPanelTabIpc();
            }).then(function () {
              var _ref30 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(panelIpc) {
                var state;
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        if (isFirst) {
                          panelIpc.ask('RECORD_ADD_COMMAND', {
                            cmd: 'open',
                            target: args.url
                          });
                        }

                        // Note: remove AndWait from commands if we got a pullback
                        _context16.next = 3;
                        return (0, _global_state.getState)();

                      case 3:
                        state = _context16.sent;

                        if (!state.pullback) {
                          _context16.next = 8;
                          break;
                        }

                        args.cmd = args.cmd.replace('AndWait', '');
                        _context16.next = 8;
                        return (0, _global_state.updateState)({ pullback: false });

                      case 8:
                        return _context16.abrupt('return', panelIpc.ask('RECORD_ADD_COMMAND', args));

                      case 9:
                      case 'end':
                        return _context16.stop();
                    }
                  }
                }, _callee16, undefined);
              }));

              return function (_x24) {
                return _ref30.apply(this, arguments);
              };
            }()).then(function () {
              return _promise2.default.all([_storage2.default.get('config'), (0, _global_state.getState)()]);
            }).then(function (_ref31) {
              var _ref32 = (0, _slicedToArray3.default)(_ref31, 2),
                  config = _ref32[0],
                  state = _ref32[1];

              if (config.recordNotification && state.status === C.APP_STATUS.RECORDER) {
                notifyRecordCommand(args);
              }
            }).then(function () {
              return true;
            }));

          case 173:
            _tabId5 = state.tabIds.toPlay;
            return _context20.abrupt('return', _web_extension2.default.tabs.get(_tabId5).then(function (tab) {
              return _web_extension2.default.tabs.query({ windowId: tab.windowId }).then(function (tabs) {
                return tabs.filter(function (t) {
                  return t.id !== _tabId5;
                });
              }).then(function (tabs) {
                return _web_extension2.default.tabs.remove(tabs.map(function (t) {
                  return t.id;
                }));
              });
            }).then(function () {
              return true;
            }));

          case 175:
            _tabId6 = state.tabIds.toPlay;

            // Note: must disable heart beat check here, since the heart beat of current tab is destined to be lost
            // The following two states are dedicated to this close tab task

            _context20.next = 178;
            return (0, _global_state.updateState)({
              disableHeartBeat: true,
              pendingPlayingTab: true
            });

          case 178:
            closeTabAndGetNextTabOnWindow = function closeTabAndGetNextTabOnWindow(winId) {
              return _web_extension2.default.tabs.remove(_tabId6).then(function () {
                return (0, _utils.delay)(function () {
                  return (0, _tab_utils.getCurrentTab)(winId);
                }, 1000);
              });
            };

            withKantuWindowMinimized = function withKantuWindowMinimized(fn) {
              var getPanelWinId = function getPanelWinId() {
                return _web_extension2.default.tabs.get(state.tabIds.panel).then(function (tab) {
                  return tab.windowId;
                });
              };
              var minimize = function minimize() {
                return getPanelWinId().then(function (winId) {
                  return _web_extension2.default.windows.update(winId, { state: 'minimized' });
                });
              };
              var restore = function restore() {
                return getPanelWinId().then(function (winId) {
                  return _web_extension2.default.windows.update(winId, { state: 'normal' });
                });
              };

              return minimize().then(function () {
                return (0, _utils.delay)(function () {}, 1000);
              }).then(fn).then(function (data) {
                restore();
                return data;
              }, function (e) {
                restore();
                throw e;
              });
            };

            closeAndGetNextTab = function closeAndGetNextTab() {
              return _web_extension2.default.tabs.get(_tabId6).then(function (tab) {
                // Note: If the current tab is the only tab in its window, we won't know which one is the next focused window,
                // if Kantu window happens to be on the top. In this case, we need to focus on the tab
                // that is going to be closed first
                return _web_extension2.default.windows.get(tab.windowId, { populate: true }).then(function (win) {
                  if (win.tabs.length !== 1) {
                    return closeTabAndGetNextTabOnWindow(tab.windowId);
                  }

                  // If Kantu window is now on top, try to pick the next one (by minimize Kantu window)
                  // Otherwise pick the current tab will be fine
                  return (0, _tab_utils.getCurrentTab)().then(function (tab) {
                    if (tab && tab.id !== state.tabIds.panel) {
                      return closeTabAndGetNextTabOnWindow().then(function (tab) {
                        if (tab && tab.id === state.tabIds.panel) {
                          return withKantuWindowMinimized(_tab_utils.getCurrentTab);
                        }
                        return tab;
                      });
                    }

                    return withKantuWindowMinimized(closeTabAndGetNextTabOnWindow);
                  });
                });
              }).catch(function (e) {
                _log2.default.error(e);
              });
            };

            runWithTab = function runWithTab(pTab) {
              return pTab.then(function (tab) {
                (0, _log2.default)('getCurrentTab - ', tab);

                var isValidTab = !!tab && !!tab.id;
                var isPanelTab = isValidTab && tab.id === state.tabIds.panel;

                return (0, _global_state.updateState)((0, _utils.setIn)(['tabIds', 'toPlay'], isValidTab && !isPanelTab ? tab.id : null));
              }).catch(function () {}).then(function () {
                // Note: should always reset pendingPlayingTab, no matter there is an error or not
                (0, _log2.default)('resetting pendingPlayingTab');
                return (0, _global_state.updateState)({ pendingPlayingTab: false });
              });
            };

            return _context20.abrupt('return', runWithTab(closeAndGetNextTab()).then(function () {
              return true;
            }));

          case 183:
            oldTablId = state.tabIds.toPlay;
            _splitIntoTwo = (0, _utils.splitIntoTwo)('=', args.target), _splitIntoTwo2 = (0, _slicedToArray3.default)(_splitIntoTwo, 2), type = _splitIntoTwo2[0], locator = _splitIntoTwo2[1];

            if (locator) {
              _context20.next = 187;
              break;
            }

            throw new Error('invalid window locator, \'' + args.target + '\'');

          case 187:
            pGetTabs = void 0;
            _context20.t2 = type.toLowerCase();
            _context20.next = _context20.t2 === 'title' ? 191 : _context20.t2 === 'tab' ? 193 : 202;
            break;

          case 191:
            pGetTabs = _web_extension2.default.tabs.query({ title: locator });
            return _context20.abrupt('break', 203);

          case 193:
            if (!/^\s*open\s*$/i.test(locator)) {
              _context20.next = 197;
              break;
            }

            pGetTabs = _web_extension2.default.tabs.get(state.tabIds.toPlay).then(function (tab) {
              return _web_extension2.default.tabs.create({ url: args.value, windowId: tab.windowId });
            }).then(function (tab) {
              return [tab];
            });
            _context20.next = 201;
            break;

          case 197:
            offset = parseInt(locator, 10);

            if (!isNaN(offset)) {
              _context20.next = 200;
              break;
            }

            throw new Error('invalid tab offset, \'' + locator + '\'');

          case 200:

            pGetTabs = _web_extension2.default.tabs.get(state.tabIds.firstPlay).then(function (tab) {
              return _web_extension2.default.tabs.query({
                windowId: tab.windowId,
                index: tab.index + offset
              });
            });

          case 201:
            return _context20.abrupt('break', 203);

          case 202:
            throw new Error('window locator type \'' + type + '\' not supported');

          case 203:
            return _context20.abrupt('return', pGetTabs.then(function (tabs) {
              if (tabs.length === 0) {
                throw new Error('failed to find the tab with locator \'' + args.target + '\'');
              }
              return tabs[0];
            }).then(function (tab) {
              (0, _log2.default)('selectWindow, got tab', tab);

              return (0, _ipc_cache.getIpcCache)().get(tab.id, 30000).catch(function (e) {
                if (/tab=\s*open\s*/i.test(args.target)) {
                  throw new Error('To open a new tab, a valid URL is needed');
                }
                throw e;
              }).then(function (ipc) {
                (0, _log2.default)('selectWindow, got ipc', ipc);

                return ipc.ask('DOM_READY', {}).then(function () {
                  ipc.ask('SET_STATUS', {
                    status: C.CONTENT_SCRIPT_STATUS.PLAYING
                  });

                  return true;
                });
              }).then(function () {
                // Note: set the original tab to NORMAL status
                // only if the new tab is set to PLAYING status
                (0, _log2.default)('selectWindow, set orignial to normal');

                (0, _ipc_cache.getIpcCache)().get(oldTablId).then(function (ipc) {
                  return ipc.ask('SET_STATUS', {
                    status: C.CONTENT_SCRIPT_STATUS.NORMAL
                  });
                });
              }).then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        _context17.next = 2;
                        return (0, _global_state.updateState)(function (state) {
                          return (0, _extends3.default)({}, state, {
                            tabIds: (0, _extends3.default)({}, state.tabIds, {
                              lastPlay: state.tabIds.toPlay,
                              toPlay: tab.id
                            })
                          });
                        });

                      case 2:
                        return _context17.abrupt('return', (0, _tab_utils.activateTab)(tab.id));

                      case 3:
                      case 'end':
                        return _context17.stop();
                    }
                  }
                }, _callee17, undefined);
              })));
            }).catch(function (e) {
              //new Error(`failed to find the tab with locator '${args.target}'`)
              /*IN case when index 0 tab not found*/
              return _promise2.default.all([_web_extension2.default.windows.getCurrent()]).then(function (window) {
                return _web_extension2.default.tabs.query({ active: true, windowId: window.id }).then(function () {
                  var _ref34 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(tabs) {
                    var ctab, offset, wt, tab;
                    return _regenerator2.default.wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            if (!(!tabs || !tabs.length)) {
                              _context18.next = 2;
                              break;
                            }

                            return _context18.abrupt('return', false);

                          case 2:
                            (0, _log2.default)('in initPlayTab, set toPlay to', tabs[0]);
                            ctab = tabs.filter(function (r) {
                              return r.active === true && r.url.indexOf('chrome-extension://') == -1;
                            });
                            offset = parseInt(locator, 10);
                            _context18.next = 7;
                            return checkTaIsPresent(ctab[0].index + offset, tabs[0].windowId);

                          case 7:
                            wt = _context18.sent;
                            tab = wt == "" ? ctab[0] : wt;

                            if (!(tab.index == 0 && offset == 0 || wt != "")) {
                              _context18.next = 15;
                              break;
                            }

                            _context18.next = 12;
                            return (0, _global_state.updateState)(function (state) {
                              return (0, _extends3.default)({}, state, {
                                tabIds: (0, _extends3.default)({}, state.tabIds, {
                                  lastPlay: state.tabIds.toPlay,
                                  toPlay: tab.id,
                                  firstPlay: ctab[0].id
                                })
                              });
                            });

                          case 12:
                            return _context18.abrupt('return', (0, _tab_utils.activateTab)(tab.id));

                          case 15:
                            throw new Error('failed to find the tab with locator \'' + args.target + '\'');

                          case 16:
                          case 'end':
                            return _context18.stop();
                        }
                      }
                    }, _callee18, undefined);
                  }));

                  return function (_x25) {
                    return _ref34.apply(this, arguments);
                  };
                }()
                //log.error(e.stack)
                //throw e
                );
              });
              //throw new Error(`failed to find the tab with locator '${args.target}'`)
            }));

          case 204:
            return _context20.abrupt('return', getPanelTabIpc().then(function (ipc) {
              return ipc.ask('TIMEOUT_STATUS', args);
            }));

          case 205:
            _url = args.url;
            return _context20.abrupt('return', _web_extension2.default.cookies.getAll({ url: _url }).then(function (cookies) {
              var ps = cookies.map(function (c) {
                return _web_extension2.default.cookies.remove({
                  url: '' + _url + c.path,
                  name: c.name
                });
              });

              return _promise2.default.all(ps);
            }));

          case 207:
            return _context20.abrupt('return', (0, _debugger.setFileInputFiles)({
              tabId: args.sender.tab.id,
              selector: args.selector,
              files: args.files
            }));

          case 208:
            p = (0, _download_man.getDownloadMan)().prepareDownload(args.fileName, {
              wait: !!args.wait,
              timeout: args.timeout,
              timeoutForStart: args.timeoutForStart
            });
            return _context20.abrupt('return', true);

          case 210:
            return _context20.abrupt('return', _storage2.default.get('config').then(function () {
              var _ref35 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
                var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var state, tabId, wTab, tab, isTestCase, isTestSuite, from, isFileSchema, isHttpSchema;
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        _context19.next = 2;
                        return (0, _global_state.getState)();

                      case 2:
                        state = _context19.sent;
                        tabId = state.tabIds.toPlay;

                        if (!(tabId != "")) {
                          _context19.next = 10;
                          break;
                        }

                        _context19.next = 7;
                        return checkWindowisOpen(tabId);

                      case 7:
                        _context19.t0 = _context19.sent;
                        _context19.next = 11;
                        break;

                      case 10:
                        _context19.t0 = '';

                      case 11:
                        wTab = _context19.t0;

                        if (!(wTab != "")) {
                          _context19.next = 16;
                          break;
                        }

                        _context19.t1 = wTab;
                        _context19.next = 19;
                        break;

                      case 16:
                        _context19.next = 18;
                        return getToplayTabId();

                      case 18:
                        _context19.t1 = _context19.sent;

                      case 19:
                        tab = _context19.t1;
                        _context19.next = 22;
                        return (0, _global_state.updateState)(function (state) {
                          return (0, _extends3.default)({}, state, {
                            tabIds: (0, _extends3.default)({}, state.tabIds, {
                              lastPlay: state.tabIds.lastPlay,
                              toPlay: tab.id,
                              firstPlay: tab.id
                            })
                          });
                        });

                      case 22:
                        isTestCase = !!args.testCase;
                        isTestSuite = !!args.testSuite;
                        from = args.testCase && args.testCase.from || args.testSuite && args.testSuite.from;
                        _context19.t2 = from;
                        _context19.next = _context19.t2 === 'bookmark' ? 28 : _context19.t2 === 'html' ? 31 : 38;
                        break;

                      case 28:
                        if (config.allowRunFromBookmark) {
                          _context19.next = 30;
                          break;
                        }

                        throw new Error('[Message from RPA] Error #102: To run a macro or a test suite from bookmarks, you need to allow it in the UI.Vision RPA settings first');

                      case 30:
                        return _context19.abrupt('break', 39);

                      case 31:
                        isFileSchema = /^file:\/\//.test(args.sender.url);
                        isHttpSchema = /^https?:\/\//.test(args.sender.url);

                        if (!(isFileSchema && !config.allowRunFromFileSchema)) {
                          _context19.next = 35;
                          break;
                        }

                        throw new Error('Error #103: To run test suite from local file, enable it in UI.Vision RPA settings first');

                      case 35:
                        if (!(isHttpSchema && !config.allowRunFromHttpSchema)) {
                          _context19.next = 37;
                          break;
                        }

                        throw new Error('Error #104: To run test suite from public website, enable it in UI.Vision RPA settings first');

                      case 37:
                        return _context19.abrupt('break', 39);

                      case 38:
                        throw new Error('unknown source not allowed');

                      case 39:
                        return _context19.abrupt('return', (0, _tab.withPanelIpc)({
                          params: { from: from }
                        }).then(function (panelIpc) {
                          if (args.testCase) {
                            return panelIpc.ask('RUN_TEST_CASE', {
                              testCase: args.testCase,
                              options: args.options
                            });
                          }

                          if (args.testSuite) {
                            return panelIpc.ask('RUN_TEST_SUITE', {
                              testSuite: args.testSuite,
                              options: args.options
                            });
                          }

                          return true;
                        }));

                      case 40:
                      case 'end':
                        return _context19.stop();
                    }
                  }
                }, _callee19, undefined);
              }));

              return function () {
                return _ref35.apply(this, arguments);
              };
            }()));

          case 211:
            from = args.from;
            return _context20.abrupt('return', _storage2.default.get('config').then(function () {
              var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

              var isFileSchema = /^file:\/\//.test(args.sender.url);
              var isHttpSchema = /^https?:\/\//.test(args.sender.url);

              if (isFileSchema && !config.allowRunFromFileSchema) {
                throw new Error('Error #105: To run macro from local file, enable it in RPA settings first');
              }

              if (isHttpSchema && !config.allowRunFromHttpSchema) {
                throw new Error('Error #105: To run macro from public website, enable it in the RPA settings first');
              }

              return (0, _tab.withPanelIpc)({ params: { from: from } }).then(function (panelIpc) {
                return panelIpc.ask('IMPORT_AND_RUN', args);
              });
            }));

          case 213:
            return _context20.abrupt('return', getPanelTabIpc().then(function (ipc) {
              return ipc.ask('ADD_LOG', args);
            }));

          case 214:
            (0, _tab.withPanelIpc)({
              params: { settings: true }
            }).then(function (ipc) {
              return ipc.ask('OPEN_SETTINGS');
            }).catch(function (e) {
              console.error(e);
            });
            return _context20.abrupt('return', true);

          case 216:
            return _context20.abrupt('return', (0, _tab.withPanelIpc)().then(function (ipc) {
              return ipc.ask('ADD_VISION_IMAGE', {
                dataUrl: args.dataUrl,
                requireRename: true
              });
            }));

          case 217:
            (0, _log2.default)('TIMEOUT', args.timeout, args.id);
            return _context20.abrupt('return', (0, _utils.delay)(function () {
              return args.id;
            }, args.timeout));

          case 219:
            return _context20.abrupt('return', 'unknown');

          case 220:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  }));

  return function onRequest(_x16, _x17) {
    return _ref19.apply(this, arguments);
  };
}();

var initIPC = function () {
  var _ref36 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
    var tabs, tabIdDict, remainingTabIdDict;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return (0, _tab_utils.getAllTabs)();

          case 2:
            tabs = _context22.sent;
            tabIdDict = tabs.reduce(function (prev, cur) {
              prev[cur.id] = true;
              return prev;
            }, {});
            _context22.next = 6;
            return (0, _ipc_cache.getIpcCache)().cleanup(tabIdDict);

          case 6:
            remainingTabIdDict = _context22.sent;


            // Restore connection with existing pages, it's for cases when background turns inactive and then active again
            (0, _keys2.default)(remainingTabIdDict).forEach(function (tabIdStr) {
              var tabId = parseInt(tabIdStr);

              (0, _ipc_cache.getIpcCache)().get(tabId).then(function (ipc) {
                ipc.onAsk(onRequest);
              });
            });

            (0, _ipc_bg_cs.bgInit)(function () {
              var _ref37 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21(tabId, cuid, ipc) {
                return _regenerator2.default.wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        _context21.next = 2;
                        return (0, _ipc_cache.getIpcCache)().has(tabId, cuid);

                      case 2:
                        if (_context21.sent) {
                          _context21.next = 6;
                          break;
                        }

                        (0, _log2.default)('connect cs ipc', tabId, cuid, ipc);
                        (0, _ipc_cache.getIpcCache)().set(tabId, ipc, cuid);
                        ipc.onAsk(onRequest);

                      case 6:
                      case 'end':
                        return _context21.stop();
                    }
                  }
                }, _callee21, undefined);
              }));

              return function (_x28, _x29, _x30) {
                return _ref37.apply(this, arguments);
              };
            }());

          case 9:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  }));

  return function initIPC() {
    return _ref36.apply(this, arguments);
  };
}();

var initOnInstalled = function initOnInstalled() {
  if (typeof process !== 'undefined' && "production" === 'production') {
    _web_extension2.default.runtime.setUninstallURL(_config2.default.urlAfterUninstall);

    _web_extension2.default.runtime.onInstalled.addListener(function (_ref38) {
      var reason = _ref38.reason,
          previousVersion = _ref38.previousVersion;

      switch (reason) {
        case 'install':
          {
            _storage2.default.get('config').then(function (config) {
              return _storage2.default.set('config', (0, _extends3.default)({}, config, {
                showTestCaseTab: false
              }));
            });

            return _web_extension2.default.tabs.create({
              url: _config2.default.urlAfterInstall
            });
          }

        case 'update':
          _web_extension2.default.action.setBadgeText({ text: 'NEW' });
          _web_extension2.default.action.setBadgeBackgroundColor({ color: '#4444FF' });
          return _web_extension2.default.storage.local.set({
            upgrade_not_viewed: 'not_viewed'
          });
      }
    });
  }
};

// With service worker, this method could be called multiple times as background,
// must make sure that it only set those tabIds when it's in normal mode
// (not playing/recording/inspecting)
var initPlayTab = function initPlayTab() {
  return _promise2.default.all([_web_extension2.default.windows.getCurrent(), (0, _global_state.getState)()]).then(function (state, window) {
    if (state.status !== C.APP_STATUS.NORMAL) {
      return false;
    }

    return _web_extension2.default.tabs.query({ active: true, windowId: window.id }).then(function () {
      var _ref39 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23(tabs) {
        return _regenerator2.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                if (!(!tabs || !tabs.length)) {
                  _context23.next = 2;
                  break;
                }

                return _context23.abrupt('return', false);

              case 2:
                if (!(tabs[0].id === state.tabIds.panel)) {
                  _context23.next = 4;
                  break;
                }

                return _context23.abrupt('return', false);

              case 4:

                (0, _log2.default)('in initPlayTab, set toPlay to', tabs[0]);

                _context23.next = 7;
                return (0, _global_state.updateState)(function (state) {
                  return (0, _extends3.default)({}, state, {
                    tabIds: (0, _extends3.default)({}, state.tabIds, {
                      lastPlay: state.tabIds.toPlay,
                      toPlay: tabs[0].id,
                      firstPlay: tabs[0].id
                    })
                  });
                });

              case 7:
                return _context23.abrupt('return', true);

              case 8:
              case 'end':
                return _context23.stop();
            }
          }
        }, _callee23, undefined);
      }));

      return function (_x31) {
        return _ref39.apply(this, arguments);
      };
    }());
  });
};

var initDownloadMan = function initDownloadMan() {
  (0, _download_man.getDownloadMan)().onCountDown(function (data) {
    getPanelTabIpc().then(function (panelIpc) {
      panelIpc.ask('TIMEOUT_STATUS', (0, _extends3.default)({}, data, {
        type: 'download'
      }));
    });
  });

  (0, _download_man.getDownloadMan)().onDownloadComplete(function (downloadItem) {
    getPanelTabIpc().then(function (panelIpc) {
      panelIpc.ask('DOWNLOAD_COMPLETE', downloadItem);
    });
  });
};

var initProxyMan = function initProxyMan() {
  var onProxyChange = function () {
    var _ref40 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24(newProxy) {
      var img, state;
      return _regenerator2.default.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              img = newProxy ? _config2.default.icons.inverted : _config2.default.icons.normal;

              _web_extension2.default.action.setIcon({ path: img });

              _context24.next = 4;
              return (0, _global_state.getState)();

            case 4:
              state = _context24.sent;


              if (state.tabIds.panel) {
                getPanelTabIpc().then(function (ipc) {
                  return ipc.ask('PROXY_UPDATE', { proxy: newProxy });
                }).catch(function (e) {
                  return _log2.default.warn(e);
                });
              }

            case 6:
            case 'end':
              return _context24.stop();
          }
        }
      }, _callee24, undefined);
    }));

    return function onProxyChange(_x32) {
      return _ref40.apply(this, arguments);
    };
  }();

  (0, _proxy.getProxyManager)().getProxy().then(onProxyChange);
  (0, _proxy.getProxyManager)().onChange(onProxyChange);
};

bindEvents();
initIPC();
initOnInstalled();
initPlayTab();
initDownloadMan();
initProxyMan();
(0, _contextMenu.getContextMenuService)().destroyMenus();

self.clip = _clipboard2.default;
})();

/******/ })()
;