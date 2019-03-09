/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _whatsnext_time_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./whatsnext/time.ts */ \"./whatsnext/time.ts\");\n/* harmony import */ var _whatsnext_generator_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./whatsnext/generator.ts */ \"./whatsnext/generator.ts\");\n\n//import Period from \"./whatsnext/period.js\"\n\nvar now = _whatsnext_time_ts__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fromDate(new Date)\nvar now2 = new _whatsnext_time_ts__WEBPACK_IMPORTED_MODULE_0__[\"default\"](14, 25)\nconsole.log(now.toString(), now.toDate(), now.toCompare())\nconsole.log(now2.toString(), now2.toDate(), now2.toCompare())\n\nconsole.log(_whatsnext_generator_ts__WEBPACK_IMPORTED_MODULE_1__[\"default\"])\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./node_modules/ky/index.js":
/*!**********************************!*\
  !*** ./node_modules/ky/index.js ***!
  \**********************************/
/*! exports provided: default, HTTPError, TimeoutError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HTTPError\", function() { return HTTPError; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TimeoutError\", function() { return TimeoutError; });\n/*! MIT License © Sindre Sorhus */\n\nconst getGlobal = property => {\n\t/* istanbul ignore next */\n\tif (typeof self !== 'undefined' && self && property in self) {\n\t\treturn self[property];\n\t}\n\n\t/* istanbul ignore next */\n\tif (typeof window !== 'undefined' && window && property in window) {\n\t\treturn window[property];\n\t}\n\n\tif (typeof global !== 'undefined' && global && property in global) {\n\t\treturn global[property];\n\t}\n\n\t/* istanbul ignore next */\n\tif (typeof globalThis !== 'undefined' && globalThis) {\n\t\treturn globalThis[property];\n\t}\n};\n\nconst document = getGlobal('document');\nconst Headers = getGlobal('Headers');\nconst Response = getGlobal('Response');\nconst fetch = getGlobal('fetch');\nconst AbortController = getGlobal('AbortController');\n\nconst isObject = value => value !== null && typeof value === 'object';\nconst supportsAbortController = typeof getGlobal('AbortController') === 'function';\n\nconst deepMerge = (...sources) => {\n\tlet returnValue = {};\n\n\tfor (const source of sources) {\n\t\tif (Array.isArray(source)) {\n\t\t\tif (!(Array.isArray(returnValue))) {\n\t\t\t\treturnValue = [];\n\t\t\t}\n\n\t\t\treturnValue = [...returnValue, ...source];\n\t\t} else if (isObject(source)) {\n\t\t\tfor (let [key, value] of Object.entries(source)) {\n\t\t\t\tif (isObject(value) && Reflect.has(returnValue, key)) {\n\t\t\t\t\tvalue = deepMerge(returnValue[key], value);\n\t\t\t\t}\n\n\t\t\t\treturnValue = {...returnValue, [key]: value};\n\t\t\t}\n\t\t}\n\t}\n\n\treturn returnValue;\n};\n\nconst requestMethods = [\n\t'get',\n\t'post',\n\t'put',\n\t'patch',\n\t'head',\n\t'delete'\n];\n\nconst responseTypes = [\n\t'json',\n\t'text',\n\t'formData',\n\t'arrayBuffer',\n\t'blob'\n];\n\nconst retryMethods = new Set([\n\t'get',\n\t'put',\n\t'head',\n\t'delete',\n\t'options',\n\t'trace'\n]);\n\nconst retryStatusCodes = new Set([\n\t408,\n\t413,\n\t429,\n\t500,\n\t502,\n\t503,\n\t504\n]);\n\nconst retryAfterStatusCodes = new Set([\n\t413,\n\t429,\n\t503\n]);\n\nclass HTTPError extends Error {\n\tconstructor(response) {\n\t\tsuper(response.statusText);\n\t\tthis.name = 'HTTPError';\n\t\tthis.response = response;\n\t}\n}\n\nclass TimeoutError extends Error {\n\tconstructor() {\n\t\tsuper('Request timed out');\n\t\tthis.name = 'TimeoutError';\n\t}\n}\n\nconst delay = ms => new Promise(resolve => setTimeout(resolve, ms));\n\nconst timeout = (promise, ms, abortController) => Promise.race([\n\tpromise,\n\t(async () => {\n\t\tawait delay(ms);\n\t\tif (abortController) {\n\t\t\t// Throw TimeoutError first\n\t\t\tsetTimeout(() => abortController.abort(), 1);\n\t\t}\n\n\t\tthrow new TimeoutError();\n\t})()\n]);\n\nconst normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;\n\nclass Ky {\n\tconstructor(input, {\n\t\ttimeout = 10000,\n\t\thooks,\n\t\tthrowHttpErrors = true,\n\t\tsearchParams,\n\t\tjson,\n\t\t...otherOptions\n\t}) {\n\t\tthis._retryCount = 0;\n\n\t\tthis._options = {\n\t\t\tmethod: 'get',\n\t\t\tcredentials: 'same-origin', // TODO: This can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208\n\t\t\tretry: 2,\n\t\t\t...otherOptions\n\t\t};\n\n\t\tif (supportsAbortController) {\n\t\t\tthis.abortController = new AbortController();\n\t\t\tif (this._options.signal) {\n\t\t\t\tthis._options.signal.addEventListener('abort', () => {\n\t\t\t\t\tthis.abortController.abort();\n\t\t\t\t});\n\t\t\t}\n\n\t\t\tthis._options.signal = this.abortController.signal;\n\t\t}\n\n\t\tthis._options.method = normalizeRequestMethod(this._options.method);\n\t\tthis._options.prefixUrl = String(this._options.prefixUrl || '');\n\t\tthis._input = String(input || '');\n\n\t\tif (this._options.prefixUrl && this._input.startsWith('/')) {\n\t\t\tthrow new Error('`input` must not begin with a slash when using `prefixUrl`');\n\t\t}\n\n\t\tif (this._options.prefixUrl && !this._options.prefixUrl.endsWith('/')) {\n\t\t\tthis._options.prefixUrl += '/';\n\t\t}\n\n\t\tthis._input = this._options.prefixUrl + this._input;\n\n\t\tif (searchParams) {\n\t\t\tconst url = new URL(this._input, document && document.baseURI);\n\t\t\tif (typeof searchParams === 'string' || (URLSearchParams && searchParams instanceof URLSearchParams)) {\n\t\t\t\turl.search = searchParams;\n\t\t\t} else if (Object.values(searchParams).every(param => typeof param === 'number' || typeof param === 'string')) {\n\t\t\t\turl.search = new URLSearchParams(searchParams).toString();\n\t\t\t} else {\n\t\t\t\tthrow new Error('The `searchParams` option must be either a string, `URLSearchParams` instance or an object with string and number values');\n\t\t\t}\n\n\t\t\tthis._input = url.toString();\n\t\t}\n\n\t\tthis._timeout = timeout;\n\t\tthis._hooks = deepMerge({\n\t\t\tbeforeRequest: [],\n\t\t\tafterResponse: []\n\t\t}, hooks);\n\t\tthis._throwHttpErrors = throwHttpErrors;\n\n\t\tconst headers = new Headers(this._options.headers || {});\n\n\t\tif (json) {\n\t\t\tif (this._options.body) {\n\t\t\t\tthrow new Error('The `json` option cannot be used with the `body` option');\n\t\t\t}\n\n\t\t\theaders.set('content-type', 'application/json');\n\t\t\tthis._options.body = JSON.stringify(json);\n\t\t}\n\n\t\tthis._options.headers = headers;\n\n\t\tconst fn = async () => {\n\t\t\tlet response = await this._fetch();\n\n\t\t\tfor (const hook of this._hooks.afterResponse) {\n\t\t\t\t// eslint-disable-next-line no-await-in-loop\n\t\t\t\tconst modifiedResponse = await hook(response.clone());\n\n\t\t\t\tif (modifiedResponse instanceof Response) {\n\t\t\t\t\tresponse = modifiedResponse;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (!response.ok && this._throwHttpErrors) {\n\t\t\t\tthrow new HTTPError(response);\n\t\t\t}\n\n\t\t\treturn response;\n\t\t};\n\n\t\tconst isRetriableMethod = retryMethods.has(this._options.method.toLowerCase());\n\t\tconst result = isRetriableMethod ? this._retry(fn) : fn();\n\n\t\tfor (const type of responseTypes) {\n\t\t\tresult[type] = async () => {\n\t\t\t\treturn (await result).clone()[type]();\n\t\t\t};\n\t\t}\n\n\t\treturn result;\n\t}\n\n\t_calculateRetryDelay(error) {\n\t\tthis._retryCount++;\n\n\t\tif (this._retryCount < this._options.retry && !(error instanceof TimeoutError)) {\n\t\t\tif (error instanceof HTTPError) {\n\t\t\t\tif (!retryStatusCodes.has(error.response.status)) {\n\t\t\t\t\treturn 0;\n\t\t\t\t}\n\n\t\t\t\tconst retryAfter = error.response.headers.get('Retry-After');\n\t\t\t\tif (retryAfter && retryAfterStatusCodes.has(error.response.status)) {\n\t\t\t\t\tlet after = Number(retryAfter);\n\t\t\t\t\tif (Number.isNaN(after)) {\n\t\t\t\t\t\tafter = Date.parse(retryAfter) - Date.now();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tafter *= 1000;\n\t\t\t\t\t}\n\n\t\t\t\t\treturn after;\n\t\t\t\t}\n\n\t\t\t\tif (error.response.status === 413) {\n\t\t\t\t\treturn 0;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tconst BACKOFF_FACTOR = 0.3;\n\t\t\treturn BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;\n\t\t}\n\n\t\treturn 0;\n\t}\n\n\tasync _retry(fn) {\n\t\ttry {\n\t\t\treturn await fn();\n\t\t} catch (error) {\n\t\t\tconst ms = this._calculateRetryDelay(error);\n\t\t\tif (ms !== 0 && this._retryCount > 0) {\n\t\t\t\tawait delay(ms);\n\t\t\t\treturn this._retry(fn);\n\t\t\t}\n\n\t\t\tif (this._throwHttpErrors) {\n\t\t\t\tthrow error;\n\t\t\t}\n\t\t}\n\t}\n\n\tasync _fetch() {\n\t\tfor (const hook of this._hooks.beforeRequest) {\n\t\t\t// eslint-disable-next-line no-await-in-loop\n\t\t\tawait hook(this._options);\n\t\t}\n\n\t\treturn timeout(fetch(this._input, this._options), this._timeout, this.abortController);\n\t}\n}\n\nconst createInstance = (defaults = {}) => {\n\tif (!isObject(defaults) || Array.isArray(defaults)) {\n\t\tthrow new TypeError('The `defaultOptions` argument must be an object');\n\t}\n\n\tconst ky = (input, options) => new Ky(input, deepMerge({}, defaults, options));\n\n\tfor (const method of requestMethods) {\n\t\tky[method] = (input, options) => new Ky(input, deepMerge({}, defaults, options, {method}));\n\t}\n\n\tky.extend = defaults => createInstance(defaults);\n\n\treturn ky;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (createInstance());\n\n\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ \"./node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./node_modules/ky/index.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var g;\n\n// This works in non-strict mode\ng = (function() {\n\treturn this;\n})();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || new Function(\"return this\")();\n} catch (e) {\n\t// This works if the window reference is available\n\tif (typeof window === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./whatsnext/generator.ts":
/*!********************************!*\
  !*** ./whatsnext/generator.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _time_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time.ts */ \"./whatsnext/time.ts\");\n/* harmony import */ var ky__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ky */ \"./node_modules/ky/index.js\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\nlet schedule_base = {};\n(() => __awaiter(undefined, void 0, void 0, function* () {\n    var response = yield Object(ky__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\"schedule2018-19.json\").json();\n    console.log(response);\n}))();\nconsole.log(_time_ts__WEBPACK_IMPORTED_MODULE_0__[\"default\"].fromDate(new Date()));\n/* harmony default export */ __webpack_exports__[\"default\"] = (schedule_base);\n\n\n//# sourceURL=webpack:///./whatsnext/generator.ts?");

/***/ }),

/***/ "./whatsnext/time.ts":
/*!***************************!*\
  !*** ./whatsnext/time.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// A simple time of day class Ravago Jones 3/7/19 V1.1\nclass Time {\n    constructor(hour, minute) {\n        // assign to public variables\n        this.hour = hour;\n        this.minute = minute;\n        //console.log(`${hour}:${minute}`)\n    }\n    static fromDate(date) {\n        let hour;\n        let minute;\n        // parse date\n        if (date.getHours != undefined && date.getMinutes != undefined) {\n            hour = date.getHours();\n            minute = date.getMinutes();\n            return new Time(hour, minute);\n        }\n    }\n    static fromTs(ts) {\n        return new Time(ts.hour, ts.minute);\n    }\n    toDate() {\n        // get new date, set hour, then sed minute\n        return new Date(new Date((new Date()).setHours(this.hour)).setMinutes(this.minute));\n    }\n    toString() {\n        let hour = (this.hour > 12 ? this.hour - 12 : this.hour); // make 12-hour\n        return `${hour}:${this.minute}`;\n    }\n    toCompare() {\n        return (this.hour * 100) + this.minute; // concatenate & add zero if neccecary\n    }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (Time);\n\n\n//# sourceURL=webpack:///./whatsnext/time.ts?");

/***/ })

/******/ });