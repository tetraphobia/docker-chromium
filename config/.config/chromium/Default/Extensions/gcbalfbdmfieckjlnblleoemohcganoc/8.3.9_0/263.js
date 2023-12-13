(self["webpackChunkui_vision_web_extension"] = self["webpackChunkui_vision_web_extension"] || []).push([[263],{

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

/***/ 46700:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./af": 42786,
	"./af.js": 42786,
	"./ar": 30867,
	"./ar-dz": 14130,
	"./ar-dz.js": 14130,
	"./ar-kw": 96135,
	"./ar-kw.js": 96135,
	"./ar-ly": 56440,
	"./ar-ly.js": 56440,
	"./ar-ma": 47702,
	"./ar-ma.js": 47702,
	"./ar-sa": 16040,
	"./ar-sa.js": 16040,
	"./ar-tn": 37100,
	"./ar-tn.js": 37100,
	"./ar.js": 30867,
	"./az": 31083,
	"./az.js": 31083,
	"./be": 9808,
	"./be.js": 9808,
	"./bg": 68338,
	"./bg.js": 68338,
	"./bm": 67438,
	"./bm.js": 67438,
	"./bn": 8905,
	"./bn-bd": 76225,
	"./bn-bd.js": 76225,
	"./bn.js": 8905,
	"./bo": 11560,
	"./bo.js": 11560,
	"./br": 1278,
	"./br.js": 1278,
	"./bs": 80622,
	"./bs.js": 80622,
	"./ca": 2468,
	"./ca.js": 2468,
	"./cs": 5822,
	"./cs.js": 5822,
	"./cv": 50877,
	"./cv.js": 50877,
	"./cy": 47373,
	"./cy.js": 47373,
	"./da": 24780,
	"./da.js": 24780,
	"./de": 59740,
	"./de-at": 60217,
	"./de-at.js": 60217,
	"./de-ch": 60894,
	"./de-ch.js": 60894,
	"./de.js": 59740,
	"./dv": 5300,
	"./dv.js": 5300,
	"./el": 50837,
	"./el.js": 50837,
	"./en-au": 78348,
	"./en-au.js": 78348,
	"./en-ca": 77925,
	"./en-ca.js": 77925,
	"./en-gb": 22243,
	"./en-gb.js": 22243,
	"./en-ie": 46436,
	"./en-ie.js": 46436,
	"./en-il": 47207,
	"./en-il.js": 47207,
	"./en-in": 44175,
	"./en-in.js": 44175,
	"./en-nz": 76319,
	"./en-nz.js": 76319,
	"./en-sg": 31662,
	"./en-sg.js": 31662,
	"./eo": 92915,
	"./eo.js": 92915,
	"./es": 55655,
	"./es-do": 55251,
	"./es-do.js": 55251,
	"./es-mx": 96112,
	"./es-mx.js": 96112,
	"./es-us": 71146,
	"./es-us.js": 71146,
	"./es.js": 55655,
	"./et": 5603,
	"./et.js": 5603,
	"./eu": 77763,
	"./eu.js": 77763,
	"./fa": 76959,
	"./fa.js": 76959,
	"./fi": 11897,
	"./fi.js": 11897,
	"./fil": 42549,
	"./fil.js": 42549,
	"./fo": 94694,
	"./fo.js": 94694,
	"./fr": 94470,
	"./fr-ca": 63049,
	"./fr-ca.js": 63049,
	"./fr-ch": 52330,
	"./fr-ch.js": 52330,
	"./fr.js": 94470,
	"./fy": 5044,
	"./fy.js": 5044,
	"./ga": 29295,
	"./ga.js": 29295,
	"./gd": 2101,
	"./gd.js": 2101,
	"./gl": 38794,
	"./gl.js": 38794,
	"./gom-deva": 27884,
	"./gom-deva.js": 27884,
	"./gom-latn": 23168,
	"./gom-latn.js": 23168,
	"./gu": 95349,
	"./gu.js": 95349,
	"./he": 24206,
	"./he.js": 24206,
	"./hi": 30094,
	"./hi.js": 30094,
	"./hr": 30316,
	"./hr.js": 30316,
	"./hu": 22138,
	"./hu.js": 22138,
	"./hy-am": 11423,
	"./hy-am.js": 11423,
	"./id": 29218,
	"./id.js": 29218,
	"./is": 90135,
	"./is.js": 90135,
	"./it": 90626,
	"./it-ch": 10150,
	"./it-ch.js": 10150,
	"./it.js": 90626,
	"./ja": 39183,
	"./ja.js": 39183,
	"./jv": 24286,
	"./jv.js": 24286,
	"./ka": 12105,
	"./ka.js": 12105,
	"./kk": 47772,
	"./kk.js": 47772,
	"./km": 18758,
	"./km.js": 18758,
	"./kn": 79282,
	"./kn.js": 79282,
	"./ko": 33730,
	"./ko.js": 33730,
	"./ku": 1408,
	"./ku.js": 1408,
	"./ky": 33291,
	"./ky.js": 33291,
	"./lb": 36841,
	"./lb.js": 36841,
	"./lo": 55466,
	"./lo.js": 55466,
	"./lt": 57010,
	"./lt.js": 57010,
	"./lv": 37595,
	"./lv.js": 37595,
	"./me": 39861,
	"./me.js": 39861,
	"./mi": 35493,
	"./mi.js": 35493,
	"./mk": 95966,
	"./mk.js": 95966,
	"./ml": 87341,
	"./ml.js": 87341,
	"./mn": 5115,
	"./mn.js": 5115,
	"./mr": 10370,
	"./mr.js": 10370,
	"./ms": 9847,
	"./ms-my": 41237,
	"./ms-my.js": 41237,
	"./ms.js": 9847,
	"./mt": 72126,
	"./mt.js": 72126,
	"./my": 56165,
	"./my.js": 56165,
	"./nb": 64924,
	"./nb.js": 64924,
	"./ne": 16744,
	"./ne.js": 16744,
	"./nl": 93901,
	"./nl-be": 59814,
	"./nl-be.js": 59814,
	"./nl.js": 93901,
	"./nn": 83877,
	"./nn.js": 83877,
	"./oc-lnc": 92135,
	"./oc-lnc.js": 92135,
	"./pa-in": 15858,
	"./pa-in.js": 15858,
	"./pl": 64495,
	"./pl.js": 64495,
	"./pt": 89520,
	"./pt-br": 57971,
	"./pt-br.js": 57971,
	"./pt.js": 89520,
	"./ro": 96459,
	"./ro.js": 96459,
	"./ru": 21793,
	"./ru.js": 21793,
	"./sd": 40950,
	"./sd.js": 40950,
	"./se": 10490,
	"./se.js": 10490,
	"./si": 90124,
	"./si.js": 90124,
	"./sk": 64249,
	"./sk.js": 64249,
	"./sl": 14985,
	"./sl.js": 14985,
	"./sq": 51104,
	"./sq.js": 51104,
	"./sr": 49131,
	"./sr-cyrl": 79915,
	"./sr-cyrl.js": 79915,
	"./sr.js": 49131,
	"./ss": 85893,
	"./ss.js": 85893,
	"./sv": 98760,
	"./sv.js": 98760,
	"./sw": 91172,
	"./sw.js": 91172,
	"./ta": 27333,
	"./ta.js": 27333,
	"./te": 23110,
	"./te.js": 23110,
	"./tet": 52095,
	"./tet.js": 52095,
	"./tg": 27321,
	"./tg.js": 27321,
	"./th": 9041,
	"./th.js": 9041,
	"./tk": 19005,
	"./tk.js": 19005,
	"./tl-ph": 75768,
	"./tl-ph.js": 75768,
	"./tlh": 89444,
	"./tlh.js": 89444,
	"./tr": 72397,
	"./tr.js": 72397,
	"./tzl": 28254,
	"./tzl.js": 28254,
	"./tzm": 51106,
	"./tzm-latn": 30699,
	"./tzm-latn.js": 30699,
	"./tzm.js": 51106,
	"./ug-cn": 9288,
	"./ug-cn.js": 9288,
	"./uk": 67691,
	"./uk.js": 67691,
	"./ur": 13795,
	"./ur.js": 13795,
	"./uz": 6791,
	"./uz-latn": 60588,
	"./uz-latn.js": 60588,
	"./uz.js": 6791,
	"./vi": 65666,
	"./vi.js": 65666,
	"./x-pseudo": 14378,
	"./x-pseudo.js": 14378,
	"./yo": 75805,
	"./yo.js": 75805,
	"./zh-cn": 83839,
	"./zh-cn.js": 83839,
	"./zh-hk": 55726,
	"./zh-hk.js": 55726,
	"./zh-mo": 99807,
	"./zh-mo.js": 99807,
	"./zh-tw": 74152,
	"./zh-tw.js": 74152
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 46700;

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

/***/ 28411:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.polyfillTimeoutFunctions = void 0;
const log_1 = __importDefault(__webpack_require__(77242));
const oldSetTimeout = window.setTimeout;
const oldClearTimeout = window.clearTimeout;
const oldSetInterval = window.setInterval;
const oldClearInterval = window.clearInterval;
function uid() {
    return Math.floor(Math.random() * 1e8);
}
function polyfillTimeoutFunctions(csIpc) {
    const timeoutRecords = {};
    function createSetTimeoutViaBackground(identity) {
        const id = identity !== null && identity !== void 0 ? identity : uid();
        return function setTimeoutViaBackground(fn, timeout = 0, ...args) {
            timeoutRecords[id] = true;
            csIpc.ask('TIMEOUT', { id, timeout }).then((identity) => {
                if (!timeoutRecords[identity]) {
                    return;
                }
                fn(...args);
            })
                .catch((e) => {
                log_1.default.error('Error in setTimeout', e.stack);
            });
            return id;
        };
    }
    function clearTimeoutViaBackground(id) {
        delete timeoutRecords[id];
    }
    // Call both native setTimeout and setTimeoutViaBackground
    // and take the first one resolved
    function smartSetTimeout(fn, timeout = 0, ...args) {
        let done = false;
        const wrappedFn = (...args) => {
            if (done) {
                return null;
            }
            done = true;
            return fn(...args);
        };
        const id = oldSetTimeout(wrappedFn, timeout, ...args);
        createSetTimeoutViaBackground(id)(wrappedFn, timeout, ...args);
        return id;
    }
    const intervalRecords = {};
    function smartSetInterval(fn, timeout = 0, ...args) {
        const id = uid();
        const wrappedFn = () => {
            if (!intervalRecords[id]) {
                return;
            }
            smartSetTimeout(wrappedFn, timeout);
            fn(...args);
        };
        intervalRecords[id] = true;
        smartSetTimeout(wrappedFn, timeout);
        return id;
    }
    function clearIntervalViaBackground(id) {
        delete intervalRecords[id];
    }
    const runBoth = (f1, f2) => {
        return (...args) => {
            f1(...args);
            f2(...args);
        };
    };
    window.setTimeout = smartSetTimeout;
    window.clearTimeout = runBoth(clearTimeoutViaBackground, oldClearTimeout);
    window.setInterval = smartSetInterval;
    window.clearInterval = clearIntervalViaBackground;
}
exports.polyfillTimeoutFunctions = polyfillTimeoutFunctions;


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


/***/ })

}]);