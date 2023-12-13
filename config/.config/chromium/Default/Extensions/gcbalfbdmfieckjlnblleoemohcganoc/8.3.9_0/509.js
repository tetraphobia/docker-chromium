"use strict";
(self["webpackChunkui_vision_web_extension"] = self["webpackChunkui_vision_web_extension"] || []).push([[509],{

/***/ 43232:
/***/ ((__unused_webpack_module, exports) => {


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

/***/ 34322:
/***/ ((__unused_webpack_module, exports) => {


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

/***/ 41265:
/***/ ((__unused_webpack_module, exports) => {


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
        let result = (length / 3) * 4;
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

/***/ 7761:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MethodTypeInvocationNames = void 0;
exports.MethodTypeInvocationNames = [
    'get_version',
    'get_desktop_dpi',
    'get_image_info',
    'capture_desktop',
    'search_image',
    'search_desktop',
    'get_max_file_range',
    'get_file_size',
    'read_file_range'
];


/***/ }),

/***/ 1885:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serializeDataUrl = exports.serializeImageData = exports.convertImageSearchResultForPage = exports.convertImageSearchResultIfAllCoordiatesBasedOnTopLeftScreen = exports.guardSearchResult = exports.getNativeCVAPI = void 0;
const constants_1 = __webpack_require__(7761);
const ts_utils_1 = __webpack_require__(55452);
const kantu_cv_host_1 = __webpack_require__(79633);
const base64_1 = __webpack_require__(41265);
const utils_1 = __webpack_require__(63370);
const dom_utils_1 = __webpack_require__(24874);
const log_1 = __importDefault(__webpack_require__(77242));
const path_1 = __importDefault(__webpack_require__(84037));
exports.getNativeCVAPI = ts_utils_1.singletonGetter(() => {
    const nativeHost = new kantu_cv_host_1.KantuCVHost();
    let pReady = nativeHost.connectAsync().catch(e => {
        log_1.default.warn('pReady - error', e);
        throw e;
    });
    const api = constants_1.MethodTypeInvocationNames.reduce((prev, method) => {
        const camel = ts_utils_1.snakeToCamel(method);
        prev[camel] = (() => {
            const fn = (params) => pReady.then(() => {
                return nativeHost.invokeAsync(method, params)
                    .catch(e => {
                    // Note: Looks like for now whenever there is an error, you have to reconnect native host
                    // otherwise, all commands return "Disconnected" afterwards
                    const typeSafeAPI = api;
                    typeSafeAPI.reconnect().catch(() => { });
                    // Note: For now, native host doesn't provide any useful error message if captureDesktop fails
                    // but for most cases it's due to directory not exist
                    if (camel === 'captureDesktop') {
                        const filePath = params.path;
                        if (filePath && /[\\/]/.test(filePath)) {
                            throw new Error(`Failed to captureDesktop, please confirm directory exists at '${path_1.default.dirname(filePath)}'`);
                        }
                    }
                    throw e;
                });
            });
            return fn;
        })();
        return prev;
    }, {
        reconnect: () => {
            nativeHost.disconnect();
            pReady = nativeHost.connectAsync();
            return pReady.then(() => api);
        },
        searchDesktopWithGuard: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.searchDesktop(params).then(guardSearchResult);
        },
        searchImageWithGuard: (params) => {
            const typeSafeAPI = api;
            return typeSafeAPI.searchImage(params).then(guardSearchResult);
        },
        getImageFromDataUrl: (dataUrl, dpi) => {
            const typeSafeAPI = api;
            const removeBase64Prefix = (str) => {
                const b64 = 'base64,';
                const i = str.indexOf(b64);
                if (i === -1)
                    return str;
                return str.substr(i + b64.length);
            };
            return typeSafeAPI.getImageInfo({ content: removeBase64Prefix(dataUrl) })
                .then(info => {
                const DEFAULT_DPI = 96;
                const dpiX = info.dpiX || dpi || DEFAULT_DPI;
                const dpiY = info.dpiY || dpi || DEFAULT_DPI;
                return serializeDataUrl(dataUrl, dpiX, dpiY);
            });
        },
        readFileAsArrayBuffer: (filePath) => {
            const typeSafeAPI = api;
            const readMore = (filePath, totalSize = Infinity, rangeStart = 0, dataUrls = []) => {
                return typeSafeAPI.readFileRange({
                    rangeStart,
                    path: filePath
                })
                    .then(range => {
                    const result = range.rangeEnd > range.rangeStart ? dataUrls.concat([range.buffer]) : dataUrls;
                    if (range.rangeEnd >= totalSize || range.rangeEnd <= range.rangeStart)
                        return result;
                    return readMore(filePath, totalSize, range.rangeEnd, result);
                });
            };
            return typeSafeAPI.getFileSize({ path: filePath })
                .then(fileSize => readMore(filePath, fileSize, 0, []))
                .then(dataUrls => {
                const arr = ts_utils_1.concatUint8Array(...dataUrls.map(dataUrl => new Uint8Array(utils_1.dataURItoArrayBuffer(dataUrl))));
                return arr.buffer;
            });
        },
        readFileAsBlob: (filePath) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsArrayBuffer(filePath)
                .then(buffer => new Blob([buffer]));
        },
        readFileAsDataURL: (filePath, withBase64Prefix = true) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsBlob(filePath)
                .then(blob => utils_1.blobToDataURL(blob, withBase64Prefix));
        },
        readFileAsText: (filePath) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsBlob(filePath)
                .then(blob => utils_1.blobToText(blob));
        },
        readFileAsBinaryString: (filePath) => {
            const typeSafeAPI = api;
            return typeSafeAPI.readFileAsArrayBuffer(filePath)
                .then(buffer => utils_1.arrayBufferToString(buffer));
        }
    });
    return api;
});
function guardSearchResult(result) {
    switch (result.errorCode) {
        case 0 /* Ok */:
            return result;
        case 2 /* NoGreenPinkBoxes */:
            throw new Error('E601: Cannot find green and/or pink boxes');
        case 3 /* NoPinkBox */:
            throw new Error('E602: Pattern image contains green box but does not contain pink box');
        case 4 /* TooManyGreenBox */:
            throw new Error('E603: Pattern image contains more than one green box');
        case 5 /* TooManyPinkBox */:
            throw new Error('E604: Pattern image contains more than one pink box');
        case 1 /* Fail */:
            throw new Error('E605: Unspecified error has occured');
        default:
            throw new Error(`E606: Unknown error code ${result.errorCode}`);
    }
}
exports.guardSearchResult = guardSearchResult;
function convertImageSearchResultIfAllCoordiatesBasedOnTopLeftScreen(result, scale = 1, searchArea) {
    const { errorCode, containsGreenPinkBoxes, regions } = result;
    const convert = (region) => {
        var _a, _b;
        const searchAreaX = (_a = searchArea === null || searchArea === void 0 ? void 0 : searchArea.x) !== null && _a !== void 0 ? _a : 0;
        const searchAreaY = (_b = searchArea === null || searchArea === void 0 ? void 0 : searchArea.y) !== null && _b !== void 0 ? _b : 0;
        // All x, y in relativeRect and matchedRect are relatve to the whole screen
        if (!region.relativeRect) {
            return {
                matched: {
                    offsetLeft: scale * region.matchedRect.x - scale * searchAreaX,
                    offsetTop: scale * region.matchedRect.y - scale * searchAreaY,
                    viewportLeft: scale * region.matchedRect.x,
                    viewportTop: scale * region.matchedRect.y,
                    pageLeft: scale * region.matchedRect.x,
                    pageTop: scale * region.matchedRect.y,
                    width: scale * region.matchedRect.width,
                    height: scale * region.matchedRect.height,
                    score: region.score
                },
                reference: null
            };
        }
        else {
            return {
                matched: {
                    offsetLeft: scale * region.relativeRect.x - scale * searchAreaX,
                    offsetTop: scale * region.relativeRect.y - scale * searchAreaY,
                    viewportLeft: scale * region.relativeRect.x,
                    viewportTop: scale * region.relativeRect.y,
                    pageLeft: scale * region.relativeRect.x,
                    pageTop: scale * region.relativeRect.y,
                    width: scale * region.relativeRect.width,
                    height: scale * region.relativeRect.height,
                    score: region.score
                },
                reference: {
                    offsetLeft: scale * region.matchedRect.x - scale * searchAreaX,
                    offsetTop: scale * region.matchedRect.y - scale * searchAreaY,
                    viewportLeft: scale * region.matchedRect.x,
                    viewportTop: scale * region.matchedRect.y,
                    pageLeft: scale * region.matchedRect.x,
                    pageTop: scale * region.matchedRect.y,
                    width: scale * region.matchedRect.width,
                    height: scale * region.matchedRect.height,
                    score: region.score
                }
            };
        }
    };
    return regions.map(r => convert(r));
}
exports.convertImageSearchResultIfAllCoordiatesBasedOnTopLeftScreen = convertImageSearchResultIfAllCoordiatesBasedOnTopLeftScreen;
function convertImageSearchResultForPage(result, scale, pageOffset, viewportOffset) {
    const convert = (region) => {
        if (!region.relativeRect) {
            return {
                reference: null,
                matched: {
                    offsetLeft: scale * region.matchedRect.x,
                    offsetTop: scale * region.matchedRect.y,
                    viewportLeft: scale * region.matchedRect.x + viewportOffset.x,
                    viewportTop: scale * region.matchedRect.y + viewportOffset.y,
                    pageLeft: scale * region.matchedRect.x + pageOffset.x,
                    pageTop: scale * region.matchedRect.y + pageOffset.y,
                    width: scale * region.matchedRect.width,
                    height: scale * region.matchedRect.height,
                    score: region.score
                }
            };
        }
        else {
            return {
                reference: {
                    offsetLeft: scale * region.matchedRect.x,
                    offsetTop: scale * region.matchedRect.y,
                    viewportLeft: scale * region.matchedRect.x + viewportOffset.x,
                    viewportTop: scale * region.matchedRect.y + viewportOffset.y,
                    pageLeft: scale * region.matchedRect.x + pageOffset.x,
                    pageTop: scale * region.matchedRect.y + pageOffset.y,
                    width: scale * region.matchedRect.width,
                    height: scale * region.matchedRect.height,
                    score: region.score
                },
                matched: {
                    offsetLeft: scale * region.relativeRect.x,
                    offsetTop: scale * region.relativeRect.y,
                    viewportLeft: scale * region.relativeRect.x + viewportOffset.x,
                    viewportTop: scale * region.relativeRect.y + viewportOffset.y,
                    pageLeft: scale * region.relativeRect.x + pageOffset.x,
                    pageTop: scale * region.relativeRect.y + pageOffset.y,
                    width: scale * region.relativeRect.width,
                    height: scale * region.relativeRect.height,
                    score: region.score
                }
            };
        }
    };
    return result.regions.map(r => convert(r));
}
exports.convertImageSearchResultForPage = convertImageSearchResultForPage;
function serializeImageData(imageData, dpiX, dpiY) {
    // Convert RGBA -> RGB -> Base64
    const w = imageData.width;
    const h = imageData.height;
    const src = imageData.data;
    const rgb = new Uint8Array(w * h * 3);
    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            const base = y * w + x;
            const k = 3 * base;
            const j = 4 * base;
            rgb[k + 0] = src[j + 0];
            rgb[k + 1] = src[j + 1];
            rgb[k + 2] = src[j + 2];
        }
    }
    const data = base64_1.base64.encode(rgb);
    return {
        width: w,
        height: h,
        dpiX,
        dpiY,
        data
    };
}
exports.serializeImageData = serializeImageData;
function serializeDataUrl(dataUrl, dpiX, dpiY) {
    return dom_utils_1.imageDataFromUrl(dataUrl)
        .then(imageData => serializeImageData(imageData, dpiX, dpiY));
}
exports.serializeDataUrl = serializeDataUrl;


/***/ }),

/***/ 79633:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KantuCVHost = void 0;
const native_host_1 = __webpack_require__(35705);
class KantuCVHost extends native_host_1.NativeMessagingHost {
    constructor() {
        super(KantuCVHost.HOST_NAME);
    }
}
exports.KantuCVHost = KantuCVHost;
KantuCVHost.HOST_NAME = "com.a9t9.kantu.cv";


/***/ }),

/***/ 13549:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.scaleOcrTextSearchMatch = exports.scaleOcrResponseCoordinates = exports.scaleOcrParseResultWord = exports.ocrMatchCenter = exports.ocrMatchRect = exports.allWordsWithPosition = exports.isWordPositionEqual = exports.hasWordMatch = exports.WordMatchType = exports.isWordEqual = exports.searchTextInOCRResponse = exports.iterateThroughParseResults = exports.wordIteratorFromParseResults = exports.guardOCRResponse = exports.runOCR = exports.runOCRLcal = exports.runDownloadLog = void 0;
const superagent_1 = __importDefault(__webpack_require__(80569));
const types_1 = __webpack_require__(37161);
const utils_1 = __webpack_require__(63370);
const ts_utils_1 = __webpack_require__(55452);
const filesystem_1 = __webpack_require__(65065);
const xfile_1 = __webpack_require__(1577);
const path_1 = __importDefault(__webpack_require__(84037));
function runDownloadLog(base64result, targetP, osType) {
    const fsAPI = filesystem_1.getNativeFileSystemAPI();
    return fsAPI.getSpecialFolderPath({ folder: filesystem_1.SpecialFolder.UserProfile })
        .then(profilePath => {
        const uivision = osType == "mac" ? '/Library/uivision-xmodules/2.2.2/xmodules/' : path_1.default.join(profilePath, '\\AppData\\Roaming\\UI.Vision\\XModules\\ocr');
        return fsAPI.ensureDir({ path: uivision })
            .then(Opath => {
            const { rootDir } = xfile_1.getXFile().getCachedConfig();
            let path = uivision;
            let outputpath = rootDir;
            let filepath = '', targetpath = targetP;
            if (osType == "mac") {
                filepath = path + '/ocr3';
                //targetpath = outputpath+'/images/image.png';
            }
            else {
                filepath = path + '\\ocrexe\\ocrcl1.exe';
                //targetpath = outputpath+'\\images\\image.png';
            }
            let params = {
                fileName: filepath,
                path: targetpath,
                content: base64result,
                waitForExit: true
            };
            return fsAPI.writeAllText(params).
                then(res => {
                if (res != undefined) {
                    return res;
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
}
exports.runDownloadLog = runDownloadLog;
function runOCRLcal(options) {
    const language = options.language;
    const base64result = options.image;
    const osType = options.os;
    const fsAPI = filesystem_1.getNativeFileSystemAPI();
    return fsAPI.getSpecialFolderPath({ folder: filesystem_1.SpecialFolder.UserProfile })
        .then(profilePath => {
        const uivision = osType == "mac" ? '/Library/uivision-xmodules/2.2.2/xmodules/' : path_1.default.join(profilePath, '\\AppData\\Roaming\\UI.Vision\\XModules\\ocr');
        return fsAPI.ensureDir({ path: uivision })
            .then(Opath => {
            const { rootDir } = xfile_1.getXFile().getCachedConfig();
            let path = uivision;
            let outputpath = rootDir;
            let filepath = '', targetpath = '';
            if (osType == "mac") {
                filepath = path + '/ocr3';
                //targetpath = outputpath+'/images/image.png';
                targetpath = outputpath + '/image.png';
            }
            else {
                filepath = path + '\\ocrexe\\ocrcl1.exe';
                //targetpath = outputpath+'\\images\\image.png';
                targetpath = outputpath + '/image.png';
            }
            let params = {
                fileName: filepath,
                path: targetpath,
                content: base64result,
                waitForExit: true
            };
            return fsAPI.writeAllBytes(params).
                then(res => {
                if (res != undefined) {
                    let filepath = '';
                    let params = {};
                    if (osType == "mac") {
                        filepath = path + '/ocr3';
                        params = {
                            arguments: '--in ' + outputpath + "/image.png" + " --out " + outputpath + "/ocr_output.json --lang " + language,
                            //arguments: '--in '+outputpath+"/image.png"+" --out "+outputpath+"/ocr_output.json --lang "+language,
                            fileName: filepath,
                            waitForExit: true
                        };
                    }
                    else {
                        filepath = path + '\\ocrexe\\ocrcl1.exe';
                        params = {
                            arguments: outputpath + "\\image.png" + " " + outputpath + "\\ocr_output.json " + language,
                            //arguments: outputpath+"\\images\\image.png"+" "+outputpath+"\\logs\\ocr_output.json "+language,
                            fileName: filepath,
                            waitForExit: true
                        };
                    }
                    return fsAPI.runProcess(params);
                }
                else {
                    console.log({ result: false });
                }
            }).
                then(res => {
                if (res != undefined && res.exitCode != null && res.exitCode >= 0) {
                    let filepath = '';
                    let params = {};
                    if (osType == "mac") {
                        params = {
                            path: outputpath + "/ocr_output.json",
                            //path: outputpath+"/logs/ocr_output.json",
                            waitForExit: true
                        };
                    }
                    else {
                        params = {
                            path: outputpath + "\\ocr_output.json",
                            //path: outputpath+"\\logs\\ocr_output.json",
                            waitForExit: true
                        };
                    }
                    return fsAPI.readAllBytes(params);
                }
            }).then(json => {
                if (json) {
                    if (json.errorCode == 0) {
                        //console.log(json.content);
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
}
exports.runOCRLcal = runOCRLcal;
function runOCR(options) {
    const scaleStr = (options.scale + '').toLowerCase();
    const scale = ['true', 'false'].indexOf(scaleStr) !== -1 ? scaleStr : 'true';
    const engine = [1, 2].indexOf(options.engine || 0) !== -1 ? options.engine : 1;
    const singleRun = () => {
        return options.getApiUrlAndApiKey()
            .then(server => {
            const { url, key } = server;
            const f = new FormData();
            f.append('apikey', key);
            f.append('language', options.language);
            f.append('scale', scale);
            f.append('OCREngine', '' + engine);
            f.append('isOverlayRequired', '' + options.isOverlayRequired);
            if (options.isTable !== undefined) {
                f.append('isTable', '' + options.isTable);
            }
            if (typeof options.image === 'string') {
                f.append('file', utils_1.dataURItoBlob(options.image), 'unknown.png');
            }
            else {
                f.append('file', options.image.blob, options.image.name);
            }
            const startTime = new Date().getTime();
            if (options.willSendRequest) {
                options.willSendRequest({ server, startTime });
            }
            return utils_1.withTimeout(options.singleApiTimeout, () => {
                return superagent_1.default.post(url)
                    .send(f);
            })
                .then((res) => {
                if (options.didGetResponse) {
                    return options.didGetResponse({
                        server,
                        startTime,
                        endTime: new Date().getTime(),
                        response: res.body,
                        error: null
                    })
                        .then(() => res, () => res);
                }
                return res;
            }, (e) => {
                const err = getApiError(e);
                if (options.didGetResponse) {
                    return options.didGetResponse({
                        server,
                        startTime,
                        endTime: new Date().getTime(),
                        response: null,
                        error: err
                    })
                        .then(() => { throw err; }, () => { throw err; });
                }
                throw e;
            })
                .then(onApiReturn, onApiError)
                .catch(e => {
                if (/timeout/i.test(e.message)) {
                    throw new Error(`OCR request timeout ${(options.singleApiTimeout / 1000).toFixed(1)}s`);
                }
                else {
                    throw e;
                }
            });
        });
    };
    const run = ts_utils_1.retry(singleRun, {
        // We don't want timeout mechanism from retry, so just make it big enough
        timeout: options.singleApiTimeout * 10,
        retryInterval: 0,
        shouldRetry: options.shouldRetry || (() => false)
    });
    return utils_1.withTimeout(options.totalTimeout, run)
        .catch(e => {
        if (/timeout/i.test(e.message)) {
            throw new Error('OCR timeout');
        }
        else {
            throw e;
        }
    });
}
exports.runOCR = runOCR;
function getApiError(e) {
    if (e.response && typeof e.response.body === 'string') {
        return new Error(e.response.body);
    }
    return e;
}
function onApiError(e) {
    console.error(e);
    throw getApiError(e);
}
function onApiReturn(res) {
    guardOCRResponse(res.body);
    return res.body;
}
function guardOCRResponse(data) {
    switch (data.OCRExitCode) {
        case types_1.OCRExitCode.AllParsed:
            return;
        case types_1.OCRExitCode.PartiallyParsed:
            throw new Error([
                'Parsed Partially (Only few pages out of all the pages parsed successfully)',
                data.ErrorMessage || '',
                data.ErrorDetails || '',
            ]
                .filter(s => s.length > 0)
                .join('; '));
        case types_1.OCRExitCode.Failed:
            throw new Error([
                'OCR engine fails to parse an image',
                data.ErrorMessage || '',
                data.ErrorDetails || '',
            ]
                .filter(s => s.length > 0)
                .join('; '));
        case types_1.OCRExitCode.Fatal:
            throw new Error([
                'Fatal error occurs during parsing',
                data.ErrorMessage || '',
                data.ErrorDetails || '',
            ]
                .filter(s => s.length > 0)
                .join('; '));
    }
}
exports.guardOCRResponse = guardOCRResponse;
function wordIteratorFromParseResults(parseResults) {
    let pageIndex = 0;
    let lineIndex = 0;
    let wordIndex = 0;
    const next = () => {
        const page = parseResults[pageIndex];
        const currentLines = page ? page.TextOverlay.Lines : [];
        const line = page ? page.TextOverlay.Lines[lineIndex] : null;
        const currentWords = line ? line.Words : [];
        const word = line ? line.Words[wordIndex] : null;
        if (!word) {
            return {
                done: true,
                value: null
            };
        }
        const value = {
            word,
            position: {
                pageIndex,
                lineIndex,
                wordIndex
            }
        };
        [pageIndex, lineIndex, wordIndex] = (() => {
            let nextWordIndex = wordIndex + 1;
            let nextLineIndex = lineIndex;
            let nextPageIndex = pageIndex;
            if (nextWordIndex >= currentWords.length) {
                nextWordIndex = 0;
                nextLineIndex += 1;
            }
            if (nextLineIndex >= currentLines.length) {
                nextLineIndex = 0;
                nextPageIndex += 1;
            }
            if (nextPageIndex >= parseResults.length) {
                return [-1, -1, -1];
            }
            return [nextPageIndex, nextLineIndex, nextWordIndex];
        })();
        return {
            value,
            done: false
        };
    };
    return { next };
}
exports.wordIteratorFromParseResults = wordIteratorFromParseResults;
function iterateThroughParseResults(parseResults, fn) {
    const iterator = wordIteratorFromParseResults(parseResults);
    while (true) {
        const { done, value } = iterator.next();
        if (done)
            break;
        const shouldContinue = fn(value);
        if (!shouldContinue)
            break;
    }
}
exports.iterateThroughParseResults = iterateThroughParseResults;
function searchTextInOCRResponse(data) {
    const { text, index, parsedResults, exhaust } = data;
    const isExactMatch = /^\[.*\]$/.test(text);
    const realText = isExactMatch ? text.slice(1, -1) : text;
    const words = realText.split(/\s+/g).map(s => s.trim()).filter(s => s.length > 0);
    if (index < 0 || Math.round(index) !== index) {
        throw new Error('index must be positive integer');
    }
    let found = [];
    let wordIndex = 0;
    let matchIndex = 0;
    iterateThroughParseResults(parsedResults, (wordWithPos) => {
        const matchType = (() => {
            if (isExactMatch)
                return WordMatchType.Full;
            if (words.length === 1)
                return WordMatchType.AnyPart;
            if (wordIndex === 0)
                return WordMatchType.Postfix;
            if (wordIndex === words.length - 1)
                return WordMatchType.Prefix;
            return WordMatchType.Full;
        })();
        if (!hasWordMatch(words[wordIndex], wordWithPos.word.WordText, matchType)) {
            found[matchIndex] = [];
            wordIndex = 0;
            return true;
        }
        found[matchIndex] = found[matchIndex] || [];
        found[matchIndex].push(wordWithPos);
        wordIndex += 1;
        // Whether it's the last word
        if (wordIndex >= words.length) {
            matchIndex += 1;
            wordIndex = 0;
            const shouldContinue = exhaust || matchIndex <= index;
            return shouldContinue;
        }
        return true;
    });
    const all = found.filter(pWords => pWords.length === words.length)
        .map(pWords => ({
        words: pWords,
        // Note: similarity is useless in current implementation
        similarity: 1
    }));
    const hit = all[index] || null;
    return {
        hit,
        all,
        exhaust
    };
}
exports.searchTextInOCRResponse = searchTextInOCRResponse;
function isWordEqual(a, b) {
    if (!a || !b)
        return false;
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}
exports.isWordEqual = isWordEqual;
var WordMatchType;
(function (WordMatchType) {
    WordMatchType[WordMatchType["Full"] = 0] = "Full";
    WordMatchType[WordMatchType["Prefix"] = 1] = "Prefix";
    WordMatchType[WordMatchType["Postfix"] = 2] = "Postfix";
    WordMatchType[WordMatchType["AnyPart"] = 3] = "AnyPart";
})(WordMatchType = exports.WordMatchType || (exports.WordMatchType = {}));
function hasWordMatch(pattern, target, matchType) {
    if (!pattern || !target)
        return false;
    const lowerPattern = pattern.trim().toLowerCase();
    const lowerTarget = target.trim().toLowerCase();
    switch (matchType) {
        case WordMatchType.Full: {
            return lowerPattern === lowerTarget;
        }
        case WordMatchType.Prefix: {
            return lowerTarget.indexOf(lowerPattern) === 0;
        }
        case WordMatchType.Postfix: {
            const index = lowerTarget.indexOf(lowerPattern);
            return index !== -1 && index === lowerTarget.length - lowerPattern.length;
        }
        case WordMatchType.AnyPart: {
            return lowerTarget.indexOf(lowerPattern) !== -1;
        }
    }
}
exports.hasWordMatch = hasWordMatch;
function isWordPositionEqual(a, b) {
    return a.pageIndex === b.pageIndex &&
        a.lineIndex === b.lineIndex &&
        a.wordIndex === b.wordIndex;
}
exports.isWordPositionEqual = isWordPositionEqual;
function allWordsWithPosition(parseResults, excludePositions) {
    const result = [];
    const isAtKnownPosition = (wordWithPos) => {
        return excludePositions.reduce((prev, pos) => {
            if (prev)
                return true;
            return isWordPositionEqual(pos, wordWithPos.position);
        }, false);
    };
    iterateThroughParseResults(parseResults, (wordWithPos) => {
        if (!isAtKnownPosition(wordWithPos)) {
            result.push(wordWithPos);
        }
        return true;
    });
    return result;
}
exports.allWordsWithPosition = allWordsWithPosition;
function ocrMatchRect(match) {
    const rectsByLine = match.words.reduce((prev, cur) => {
        const key = `${cur.position.pageIndex}_${cur.position.lineIndex}`;
        if (!prev[key]) {
            prev[key] = {
                x: cur.word.Left,
                y: cur.word.Top,
                width: cur.word.Width,
                height: cur.word.Height
            };
        }
        else {
            prev[key] = Object.assign(Object.assign({}, prev[key]), { width: Math.max(prev[key].width, cur.word.Left + cur.word.Width - prev[key].x), height: Math.max(prev[key].height, cur.word.Top + cur.word.Height - prev[key].y) });
        }
        return prev;
    }, {});
    const widestRect = Object.keys(rectsByLine).reduce((prev, key) => {
        return prev.width < rectsByLine[key].width ? rectsByLine[key] : prev;
    }, { x: 0, y: 0, width: 0, height: 0 });
    return widestRect;
}
exports.ocrMatchRect = ocrMatchRect;
function ocrMatchCenter(match) {
    const rect = ocrMatchRect(match);
    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        width: rect.width,
        height: rect.height
    };
}
exports.ocrMatchCenter = ocrMatchCenter;
function scaleOcrParseResultWord(word, scale) {
    return Object.assign(Object.assign({}, word), { Width: scale * word.Width, Height: scale * word.Height, Left: scale * word.Left, Top: scale * word.Top });
}
exports.scaleOcrParseResultWord = scaleOcrParseResultWord;
// export function scaleOcrParseResultWord (word: OcrParseResultWord, scale: number): OcrParseResultWord {  const scaledWord = {
//     ...word,
//     Width: scale * word.Width,
//     Height: scale * word.Height,
//     Left: scale * word.Left,
//     Top: scale * word.Top
//   };
//   // Adjust positions based on scaling factor
//   scaledWord.Left /= scale;
//   scaledWord.Top /= scale;
//   return scaledWord;
// }
function scaleOcrResponseCoordinates(res, scale) {
    const data = ts_utils_1.safeUpdateIn(['ParsedResults', '[]', 'TextOverlay', 'Lines', '[]', 'Words', '[]'], (word) => scaleOcrParseResultWord(word, scale), res);
    return data;
}
exports.scaleOcrResponseCoordinates = scaleOcrResponseCoordinates;
function scaleOcrTextSearchMatch(match, scale) {
    const data = ts_utils_1.safeUpdateIn(['words', '[]', 'word'], (word) => scaleOcrParseResultWord(word, scale), match);
    return data;
}
exports.scaleOcrTextSearchMatch = scaleOcrTextSearchMatch;


/***/ }),

/***/ 37161:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OcrHighlightType = exports.FileParseExitCode = exports.OCRExitCode = void 0;
var OCRExitCode;
(function (OCRExitCode) {
    OCRExitCode[OCRExitCode["AllParsed"] = 1] = "AllParsed";
    OCRExitCode[OCRExitCode["PartiallyParsed"] = 2] = "PartiallyParsed";
    OCRExitCode[OCRExitCode["Failed"] = 3] = "Failed";
    OCRExitCode[OCRExitCode["Fatal"] = 4] = "Fatal";
})(OCRExitCode = exports.OCRExitCode || (exports.OCRExitCode = {}));
var FileParseExitCode;
(function (FileParseExitCode) {
    FileParseExitCode[FileParseExitCode["FileNotFound"] = 0] = "FileNotFound";
    FileParseExitCode[FileParseExitCode["Success"] = 1] = "Success";
    FileParseExitCode[FileParseExitCode["ParseError"] = -10] = "ParseError";
    FileParseExitCode[FileParseExitCode["Timeout"] = -20] = "Timeout";
    FileParseExitCode[FileParseExitCode["ValidationError"] = -30] = "ValidationError";
    FileParseExitCode[FileParseExitCode["UnknownError"] = -99] = "UnknownError";
})(FileParseExitCode = exports.FileParseExitCode || (exports.FileParseExitCode = {}));
var OcrHighlightType;
(function (OcrHighlightType) {
    OcrHighlightType[OcrHighlightType["Identified"] = 0] = "Identified";
    OcrHighlightType[OcrHighlightType["Matched"] = 1] = "Matched";
    OcrHighlightType[OcrHighlightType["TopMatched"] = 2] = "TopMatched";
})(OcrHighlightType = exports.OcrHighlightType || (exports.OcrHighlightType = {}));


/***/ })

}]);