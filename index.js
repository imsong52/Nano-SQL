(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var typescript_map_1 = __webpack_require__(2);
	var typescript_promise_1 = __webpack_require__(3);
	var memory_db_ts_1 = __webpack_require__(4);
	var someSQL_Instance = (function () {
	    function someSQL_Instance() {
	        var t = this;
	        t._actions = new typescript_map_1.tsMap();
	        t._views = new typescript_map_1.tsMap();
	        t._models = new typescript_map_1.tsMap();
	        t._query = [];
	        t._events = ['change', 'delete', 'upsert', 'drop', 'select', 'error'];
	        t._callbacks = new typescript_map_1.tsMap();
	        t._callbacks.set("*", new typescript_map_1.tsMap());
	        t._events.forEach(function (e) {
	            t._callbacks.get("*").set(e, []);
	        });
	        t._filters = new typescript_map_1.tsMap();
	        t._permanentFilters = [];
	    }
	    someSQL_Instance.prototype.init = function (table) {
	        if (table)
	            this._selectedTable = table;
	        return this;
	    };
	    someSQL_Instance.prototype.connect = function (backend) {
	        var t = this;
	        t._backend = backend || new memory_db_ts_1.someSQL_MemDB();
	        return new someSQL_Promise(t, function (res, rej) {
	            t._backend.connect(t._models, t._actions, t._views, t._filters, res, rej);
	        });
	    };
	    someSQL_Instance.prototype.on = function (actions, callBack) {
	        var t = this;
	        var l = t._selectedTable;
	        if (!t._callbacks.get(l)) {
	            t._events.forEach(function (v) {
	                t._callbacks.get(l).set(v, []);
	            });
	        }
	        actions.split(' ').forEach(function (a) {
	            if (t._events.indexOf(a) != -1) {
	                t._callbacks.get(l).get(a).push(callBack);
	            }
	        });
	        return t;
	    };
	    someSQL_Instance.prototype.off = function (callBack) {
	        this._callbacks.forEach(function (tables) {
	            tables.forEach(function (actions) {
	                actions.filter(function (cBs) {
	                    return cBs != callBack;
	                });
	            });
	        });
	        return this;
	    };
	    someSQL_Instance.prototype.alwaysApplyFilter = function (filterName) {
	        if (this._permanentFilters.indexOf(filterName) == -1) {
	            this._permanentFilters.push(filterName);
	        }
	        return this;
	    };
	    someSQL_Instance.prototype.model = function (dataModel) {
	        var t = this;
	        var l = t._selectedTable;
	        t._callbacks.set(l, new typescript_map_1.tsMap());
	        t._callbacks.get(l).set("*", []);
	        t._events.forEach(function (e) {
	            t._callbacks.get(l).set(e, []);
	        });
	        t._models.set(l, dataModel);
	        t._views.set(l, []);
	        t._actions.set(l, []);
	        return this;
	    };
	    someSQL_Instance.prototype.views = function (viewArray) {
	        this._views.set(this._selectedTable, viewArray);
	        return this;
	    };
	    someSQL_Instance.prototype.getView = function (viewName, viewArgs) {
	        var t = this;
	        var l = t._selectedTable;
	        var selView;
	        t._views.get(l).forEach(function (view) {
	            if (view.name == viewName) {
	                selView = view;
	            }
	        });
	        if (!selView)
	            throw Error('View does not exist');
	        t._activeActionOrView = viewName;
	        return selView.call.apply(t, [t._cleanArgs(selView.args, viewArgs)]);
	    };
	    someSQL_Instance.prototype._cleanArgs = function (argDeclarations, args) {
	        var t = this;
	        var l = t._selectedTable;
	        var a = {};
	        argDeclarations.forEach(function (k) {
	            var k2 = k.split(':');
	            if (k2.length > 1) {
	                a[k2[0]] = t._cast(k2[1], args[k2[0]]);
	            }
	            else {
	                a[k2[0]] = args[k2[0]];
	            }
	        });
	        return a;
	    };
	    someSQL_Instance.prototype._cast = function (type, val) {
	        switch (['string', 'int', 'float', 'array', 'map', 'bool'].indexOf(type)) {
	            case 0: return String(val);
	            case 1: return parseInt(val);
	            case 2: return parseFloat(val);
	            case 3:
	            case 4: return JSON.parse(JSON.stringify(val));
	            case 5: return val == true;
	            default: return "";
	        }
	    };
	    someSQL_Instance.prototype.actions = function (actionArray) {
	        this._actions.set(this._selectedTable, actionArray);
	        return this;
	    };
	    someSQL_Instance.prototype.doAction = function (actionName, actionArgs) {
	        var t = this;
	        var l = t._selectedTable;
	        var selAction = t._actions.get(l).reduce(function (prev, cur) {
	            if (prev != undefined)
	                return prev;
	            return cur.name == actionName ? cur : undefined;
	        });
	        if (!selAction)
	            throw Error('Action does not exist');
	        t._activeActionOrView = actionName;
	        return selAction.call.apply(t, [t._cleanArgs(selAction.args, actionArgs)]);
	    };
	    someSQL_Instance.prototype.addFilter = function (filterName, filterFunction) {
	        this._filters.set(filterName, filterFunction);
	        return this;
	    };
	    someSQL_Instance.prototype.query = function (action, args) {
	        this._query = [];
	        var a = action.toLowerCase();
	        if (['select', 'upsert', 'delete', 'drop'].indexOf(a) != -1) {
	            this._query.push(new typescript_map_1.tsMap([['type', a], ['args', args]]));
	        }
	        return this;
	    };
	    someSQL_Instance.prototype.where = function (args) {
	        return this._addCmd('where', args);
	    };
	    someSQL_Instance.prototype.orderBy = function (args) {
	        return this._addCmd('orderby', args);
	    };
	    someSQL_Instance.prototype.limit = function (args) {
	        return this._addCmd('limit', args);
	    };
	    someSQL_Instance.prototype.offset = function (args) {
	        return this._addCmd('offset', args);
	    };
	    someSQL_Instance.prototype.filter = function (name, args) {
	        return this._addCmd('filter-' + name, args);
	    };
	    someSQL_Instance.prototype._addCmd = function (type, args) {
	        this._query.push(new typescript_map_1.tsMap([['type', type], ['args', args]]));
	        return this;
	    };
	    someSQL_Instance.prototype.exec = function () {
	        var t = this;
	        var _t = t._selectedTable;
	        t._triggerEvents = t._query.map(function (q) {
	            switch (q.get('type')) {
	                case "select": return [q.get('type')];
	                case "delete":
	                case "upsert":
	                case "drop": return [q.get('type'), 'change'];
	                default: return [];
	            }
	        }).reduce(function (a, b) { return a.concat(b); });
	        var triggerEvents = function (eventData) {
	            t._triggerEvents.forEach(function (e) {
	                t._callbacks.get(_t).get(e).concat(t._callbacks.get(_t).get("*")).forEach(function (cb) {
	                    eventData['name'] = e;
	                    eventData['actionOrView'] = t._activeActionOrView;
	                    cb.apply(t, [eventData]);
	                });
	            });
	            t._activeActionOrView = undefined;
	        };
	        return new someSQL_Promise(t, function (res, rej) {
	            var _tEvent = function (data, callBack, isError) {
	                if (t._permanentFilters.length && isError != true) {
	                    data = t._permanentFilters.reduce(function (prev, cur, i) {
	                        return t._filters.get(t._permanentFilters[i]).apply(t, [data]);
	                    }, data);
	                }
	                triggerEvents({
	                    table: _t,
	                    query: t._query.map(function (q) { return q.toJSON(); }),
	                    time: new Date().getTime(),
	                    result: data
	                });
	                callBack(data);
	            };
	            t._backend.exec(_t, t._query, t._activeActionOrView, function (rows) {
	                _tEvent(rows, res, false);
	            }, function (err) {
	                t._triggerEvents = ['error'];
	                _tEvent(err, rej, true);
	            });
	        });
	    };
	    someSQL_Instance.prototype.custom = function (argType, args) {
	        var t = this;
	        return new someSQL_Promise(t, function (res, rej) {
	            if (t._backend.custom) {
	                t._backend.custom.apply(t, [argType, args, res, rej]);
	            }
	            else {
	                res();
	            }
	        });
	    };
	    someSQL_Instance.prototype.loadJS = function (rows) {
	        var t = this;
	        return typescript_promise_1.tsPromise.all(rows.map(function (row) {
	            return t.init(t._selectedTable).query('upsert', row).exec();
	        }));
	    };
	    someSQL_Instance.prototype.loadCSV = function (csv) {
	        var t = this;
	        var fields = [];
	        return new someSQL_Promise(t, function (res, rej) {
	            typescript_promise_1.tsPromise.all(csv.split('\n').map(function (v, k) {
	                return new someSQL_Promise(t, function (resolve, reject) {
	                    if (k == 0) {
	                        fields = v.split(',');
	                        resolve();
	                    }
	                    else {
	                        var record_1 = {};
	                        var row_1 = v.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(function (str) { return str.replace(/^"(.+(?="$))"$/, '$1'); });
	                        fields.forEach(function (f, i) {
	                            if (row_1[i].indexOf('{') == 0 || row_1[i].indexOf('[') == 0) {
	                                row_1[i] = JSON.parse(row_1[i].replace(/'/g, '"'));
	                            }
	                            record_1[f] = row_1[i];
	                        });
	                        t.init(t._selectedTable).query('upsert', row_1).exec().then(function () {
	                            resolve();
	                        });
	                    }
	                });
	            })).then(function () {
	                res();
	            });
	        });
	    };
	    someSQL_Instance.prototype.toCSV = function (headers) {
	        var t = this;
	        return new someSQL_Promise(t, function (res, rej) {
	            t.exec().then(function (json) {
	                var header = t._query.filter(function (q) {
	                    return q.get('type') == 'select';
	                }).map(function (q) {
	                    return q.get('args') ? q.get('args').map(function (m) {
	                        return t._models.get(t._selectedTable).filter(function (f) { return f['key'] == m; })[0];
	                    }) : t._models.get(t._selectedTable);
	                })[0];
	                if (headers) {
	                    json.unshift(header.map(function (h) {
	                        return h['key'];
	                    }));
	                }
	                res(json.map(function (row, i) {
	                    if (headers && i == 0)
	                        return row;
	                    return header.filter(function (column) {
	                        return row[column['key']] ? true : false;
	                    }).map(function (column) {
	                        switch (column['type']) {
	                            case "map": return '"' + JSON.stringify(row[column['key']]).replace(/"/g, "'") + '"';
	                            case "array": return '"' + JSON.stringify(row[column['key']]).replace(/"/g, "'") + '"';
	                            default: return JSON.stringify(row[column['key']]);
	                        }
	                    }).join(',');
	                }).join('\n'));
	            });
	        });
	    };
	    someSQL_Instance.uuid = function (inputUUID) {
	        return inputUUID ? inputUUID : (function () {
	            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	                return v.toString(16);
	            });
	        })();
	    };
	    someSQL_Instance.hash = function (str) {
	        var hash = 5381;
	        for (var i = 0; i < str.length; i++) {
	            var char = str.charCodeAt(i);
	            hash = ((hash << 5) + hash) + char;
	        }
	        return String(hash);
	    };
	    return someSQL_Instance;
	}());
	exports.someSQL_Instance = someSQL_Instance;
	var someSQL_Promise = (function (_super) {
	    __extends(someSQL_Promise, _super);
	    function someSQL_Promise(scope, callBackFunc) {
	        var _this = _super.call(this, callBackFunc) || this;
	        _this.scope = scope;
	        return _this;
	    }
	    someSQL_Promise.prototype.then = function (onSuccess, onFail) {
	        var t = this;
	        return new someSQL_Promise(t.scope, function (resolve, reject) {
	            t.done(function (value) {
	                if (typeof onSuccess === 'function') {
	                    try {
	                        value = onSuccess.apply(t.scope, [value]);
	                    }
	                    catch (e) {
	                        reject(e);
	                        return;
	                    }
	                }
	                resolve(value);
	            }, function (value) {
	                if (typeof onFail === 'function') {
	                    try {
	                        value = onFail.apply(t.scope, [value]);
	                    }
	                    catch (e) {
	                        reject(e);
	                        return;
	                    }
	                    resolve(value);
	                }
	                else {
	                    reject(value);
	                }
	            });
	        });
	    };
	    return someSQL_Promise;
	}(typescript_promise_1.tsPromise));
	var staticSQL = new someSQL_Instance();
	function someSQL(table) {
	    return staticSQL.init(table);
	}
	exports.someSQL = someSQL;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var tsMap = (function () {
	    function tsMap(inputMap) {
	        var t = this;
	        t._items = [];
	        t._keys = [];
	        t._values = [];
	        t.length = 0;
	        if (inputMap) {
	            inputMap.forEach(function (v, k) {
	                t.set(v[0], v[1]);
	            });
	        }
	    }
	    tsMap.prototype.fromJSON = function (jsonObject) {
	        for (var property in jsonObject) {
	            if (jsonObject.hasOwnProperty(property)) {
	                this.set(property, jsonObject[property]);
	            }
	        }
	    };
	    tsMap.prototype.toJSON = function () {
	        var obj = {};
	        var t = this;
	        t.keys().forEach(function (k) {
	            obj[String(k)] = t.get(k);
	        });
	        return obj;
	    };
	    tsMap.prototype.entries = function () {
	        return [].slice.call(this._items);
	    };
	    tsMap.prototype.keys = function () {
	        return [].slice.call(this._keys);
	    };
	    tsMap.prototype.values = function () {
	        return [].slice.call(this._values);
	    };
	    tsMap.prototype.has = function (key) {
	        return this._keys.indexOf(key) > -1;
	    };
	    tsMap.prototype.get = function (key) {
	        var i = this._keys.indexOf(key);
	        return i > -1 ? this._values[i] : undefined;
	    };
	    tsMap.prototype.set = function (key, value) {
	        var t = this;
	        var i = this._keys.indexOf(key);
	        if (i > -1) {
	            t._items[i][1] = value;
	            t._values[i] = value;
	        }
	        else {
	            t._items.push([key, value]);
	            t._keys.push(key);
	            t._values.push(value);
	        }
	        t.length = t.size();
	    };
	    tsMap.prototype.size = function () {
	        return this._items.length;
	    };
	    tsMap.prototype.clear = function () {
	        var t = this;
	        t._keys.length = t._values.length = t._items.length = 0;
	        t.length = t.size();
	    };
	    tsMap.prototype.delete = function (key) {
	        var t = this;
	        var i = t._keys.indexOf(key);
	        if (i > -1) {
	            t._keys.splice(i, 1);
	            t._values.splice(i, 1);
	            t._items.splice(i, 1);
	            t.length = t.size();
	            return true;
	        }
	        return false;
	    };
	    tsMap.prototype.forEach = function (callbackfn) {
	        var t = this;
	        t._keys.forEach(function (v) {
	            callbackfn(t.get(v), v);
	        });
	    };
	    tsMap.prototype.map = function (callbackfn) {
	        var t = this;
	        return this._keys.map(function (itemKey) {
	            return callbackfn(t.get(itemKey), itemKey);
	        });
	    };
	    tsMap.prototype.filter = function (callbackfn) {
	        var t = this;
	        t._keys.forEach(function (v) {
	            if (callbackfn(t.get(v), v) == false)
	                t.delete(v);
	        });
	        return this;
	    };
	    tsMap.prototype.clone = function () {
	        return new tsMap(JSON.parse(JSON.stringify(this._items)));
	    };
	    return tsMap;
	}());
	exports.tsMap = tsMap;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var tsPromise = (function () {
	    function tsPromise(callFunc) {
	        this._callbacks = [];
	        this._failed = false;
	        this._resolved = false;
	        this._settled = false;
	        callFunc(this._resolve.bind(this), this._reject.bind(this));
	    }
	    tsPromise.resolve = function (value) {
	        return new tsPromise(function (resolve) { resolve(value); });
	    };
	    tsPromise.reject = function (error) {
	        return new tsPromise(function (resolve, reject) { reject(error); });
	    };
	    tsPromise.race = function (promises) {
	        var complete = false;
	        return new tsPromise(function (resolve, reject) {
	            promises.forEach(function (p) {
	                p.then(function (res) {
	                    if (!complete)
	                        resolve(res), complete = true;
	                }).catch(function (error) {
	                    reject(error);
	                    complete = true;
	                });
	            });
	        });
	    };
	    tsPromise.chain = function (promises) {
	        var index = 0;
	        var resolve;
	        var results = [];
	        var nextPromise = function (promise) {
	            if (index == promises.length) {
	                resolve(results);
	            }
	            else {
	                promise.then(function (result) {
	                    results.push(result);
	                    index++;
	                    nextPromise(promises[index]);
	                });
	            }
	        };
	        return new tsPromise(function (res) {
	            resolve = res;
	            nextPromise(promises[index]);
	        });
	    };
	    tsPromise.all = function (promises) {
	        return new tsPromise(function (resolve, reject) {
	            var count = promises.length;
	            var results = [];
	            var complete = false;
	            promises.forEach(function (p, i) {
	                p.then(function (res) {
	                    if (!complete) {
	                        count--;
	                        results[i] = res;
	                        if (count == 0)
	                            resolve(results);
	                    }
	                }).catch(function (error) {
	                    reject(error);
	                    complete = true;
	                });
	            });
	        });
	    };
	    tsPromise.prototype.done = function (onSuccess, onFail) {
	        if (this._settled) {
	            setTimeout(this._release.bind(this, onSuccess, onFail), 0);
	        }
	        else {
	            this._callbacks.push({ onSuccess: onSuccess, onFail: onFail });
	        }
	    };
	    tsPromise.prototype.then = function (onSuccess, onFail) {
	        var parent = this;
	        return new tsPromise(function (resolve, reject) {
	            parent.done(function (value) {
	                if (typeof onSuccess === 'function') {
	                    try {
	                        value = onSuccess(value);
	                    }
	                    catch (e) {
	                        reject(e);
	                        return;
	                    }
	                }
	                resolve(value);
	            }, function (value) {
	                if (typeof onFail === 'function') {
	                    try {
	                        value = onFail(value);
	                    }
	                    catch (e) {
	                        reject(e);
	                        return;
	                    }
	                    resolve(value);
	                }
	                else {
	                    reject(value);
	                }
	            });
	        });
	    };
	    tsPromise.prototype.catch = function (onFail) {
	        return this.then(null, onFail);
	    };
	    tsPromise.prototype._release = function (onSuccess, onFail) {
	        if (this._failed) {
	            onFail(this._value);
	        }
	        else {
	            onSuccess(this._value);
	        }
	    };
	    tsPromise.prototype._resolve = function (value) {
	        if (this._resolved)
	            return;
	        this._resolved = true;
	        if (value instanceof tsPromise) {
	            value.done(this._settle.bind(this), function (error) {
	                this._failed = true;
	                this._settle(error);
	            }.bind(this));
	        }
	        else {
	            this._settle(value);
	        }
	    };
	    tsPromise.prototype._reject = function (value) {
	        if (this._resolved)
	            return;
	        this._resolved = true;
	        this._failed = true;
	        this._settle(value);
	    };
	    tsPromise.prototype._settle = function (value) {
	        this._settled = true;
	        this._value = value;
	        setTimeout(this._callbacks.forEach.bind(this._callbacks, function (data) {
	            this._release(data.onSuccess, data.onFail);
	        }, this), 0);
	    };
	    return tsPromise;
	}());
	exports.tsPromise = tsPromise;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var index_ts_1 = __webpack_require__(1);
	var typescript_promise_1 = __webpack_require__(3);
	var typescript_map_1 = __webpack_require__(2);
	var someSQL_MemDB = (function () {
	    function someSQL_MemDB() {
	        var t = this;
	        t._filters = new typescript_map_1.tsMap();
	        t._tables = new typescript_map_1.tsMap();
	        t._cacheIndex = new typescript_map_1.tsMap();
	        t._cache = new typescript_map_1.tsMap();
	        t._cacheQueryIndex = new typescript_map_1.tsMap();
	        t._initFilters();
	    }
	    someSQL_MemDB.prototype.connect = function (models, actions, views, filters, callback) {
	        var t = this;
	        models.forEach(function (model, table) {
	            t._newModel(table, model);
	        });
	        filters.forEach(function (func, name) {
	            t._filters.set(name, func);
	        });
	        callback();
	    };
	    someSQL_MemDB.prototype._newModel = function (table, args) {
	        this._cache.set(table, new typescript_map_1.tsMap());
	        this._cacheIndex.set(table, new typescript_map_1.tsMap());
	        this._tables.set(table, new _memDB_Table(args));
	    };
	    someSQL_MemDB.prototype.exec = function (table, query, viewOrAction, onSuccess, onFail) {
	        var t = this;
	        t._selectedTable = table;
	        t._mod = [];
	        t._act = null;
	        t._cacheKey = index_ts_1.someSQL_Instance.hash(JSON.stringify(query));
	        t._cacheQueryIndex.set(t._cacheKey, query);
	        typescript_promise_1.tsPromise.all(query.map(function (q) {
	            return new typescript_promise_1.tsPromise(function (resolve, reject) {
	                t._query(q, resolve);
	            });
	        })).then(function () {
	            t._exec(onSuccess);
	        });
	    };
	    someSQL_MemDB.prototype._query = function (queryArg, resolve) {
	        if (['upsert', 'select', 'delete', 'drop'].indexOf(queryArg.get("type")) != -1) {
	            this._act = queryArg;
	        }
	        else {
	            this._mod.push(queryArg);
	        }
	        resolve();
	    };
	    someSQL_MemDB.prototype._initFilters = function () {
	        var t = this;
	        var f = t._filters;
	        f.set('sum', function (rows) {
	            return rows.map(function (r) { return r[t._act.get('args')[0]]; }).reduce(function (a, b) { return a + b; }, 0);
	        });
	        f.set('first', function (rows) {
	            return rows[0];
	        });
	        f.set('last', function (rows) {
	            return rows.pop();
	        });
	        f.set('min', function (rows) {
	            return rows.map(function (r) { return r[t._act.get('args')[0]]; }).sort(function (a, b) { return a < b ? -1 : 1; })[0];
	        });
	        f.set('max', function (rows) {
	            return rows.map(function (r) { return r[t._act.get('args')[0]]; }).sort(function (a, b) { return a > b ? -1 : 1; })[0];
	        });
	        f.set('average', function (rows) {
	            return t._doFilter('sum', rows) / rows.length;
	        });
	        f.set('count', function (rows) {
	            return rows.length;
	        });
	    };
	    someSQL_MemDB.prototype._doFilter = function (filterName, rows, filterArgs) {
	        return this._filters.get(filterName).apply(this, [rows, filterArgs]);
	    };
	    someSQL_MemDB.prototype._runFilters = function (dbRows) {
	        var t = this;
	        var filters = t._mod.filter(function (m) { return m.get('type').indexOf('filter-') == 0; });
	        return filters.length ? filters.reduce(function (prev, cur, i) {
	            return t._doFilter(filters[i].get('type').replace('filter-', ''), prev, filters[i].get('args'));
	        }, dbRows) : dbRows;
	    };
	    someSQL_MemDB.prototype._removeCacheFromKeys = function (affectedKeys) {
	        var t = this;
	        affectedKeys.forEach(function (key) {
	            t._cacheIndex.get(t._selectedTable).forEach(function (queryIndex, key) {
	                if (queryIndex.indexOf(key) != -1) {
	                    t._cacheIndex.get(t._selectedTable).delete(key);
	                    t._cache.get(t._selectedTable).delete(key);
	                }
	            });
	        });
	    };
	    someSQL_MemDB.prototype._exec = function (callBack) {
	        var t = this;
	        var _hasWhere = t._mod.filter(function (v) {
	            return v.get('type') == 'where';
	        });
	        var _whereStatement = _hasWhere.length ? _hasWhere[0].get('args') : undefined;
	        var qArgs = t._act.get('args');
	        var ta = t._tables.get(t._selectedTable);
	        var msg = 0;
	        var whereTable;
	        switch (t._act.get('type')) {
	            case "upsert":
	                if (_whereStatement) {
	                    whereTable = t._newWhere(ta, _whereStatement);
	                    var affectedKeys_1 = [];
	                    whereTable._forEach(function (v, k) {
	                        for (var key in qArgs) {
	                            ta._get(k)[key] = qArgs[key];
	                        }
	                        affectedKeys_1.push(k);
	                        msg++;
	                    });
	                    t._removeCacheFromKeys(affectedKeys_1);
	                }
	                else {
	                    ta._add(qArgs);
	                    msg++;
	                    t._cache.set(t._selectedTable, new typescript_map_1.tsMap());
	                    t._cacheIndex.set(t._selectedTable, new typescript_map_1.tsMap());
	                }
	                callBack(msg + " row(s) upserted");
	                break;
	            case "select":
	                if (t._cache.get(t._selectedTable).has(t._cacheKey)) {
	                    callBack(t._cache.get(t._selectedTable).get(t._cacheKey));
	                    return;
	                }
	                if (_whereStatement) {
	                    whereTable = t._newWhere(ta, _whereStatement);
	                }
	                else {
	                    whereTable = ta._clone();
	                }
	                var mods_1 = ['ordr', 'ofs', 'lmt', 'clms'];
	                var getMod_1 = function (name) {
	                    return t._mod.filter(function (v) { return v.get('type') == name; }).pop();
	                };
	                var result = mods_1.reduce(function (prev, cur, i) {
	                    switch (mods_1[i]) {
	                        case "ordr":
	                            if (getMod_1('orderby')) {
	                                var orderBy_1 = new typescript_map_1.tsMap();
	                                orderBy_1.fromJSON(getMod_1('orderby').get('args'));
	                                return prev.sort(function (a, b) {
	                                    return orderBy_1.keys().reduce(function (prev, cur, i) {
	                                        var column = orderBy_1.keys()[i];
	                                        if (a[column] == b[column]) {
	                                            return 0 + prev;
	                                        }
	                                        else {
	                                            return ((a[column] > b[column] ? 1 : -1) * (orderBy_1.get(column) == 'asc' ? 1 : -1)) + prev;
	                                        }
	                                    }, 0);
	                                });
	                            }
	                        case "ofs":
	                            if (getMod_1('offset')) {
	                                var offset_1 = getMod_1('offset').get('args');
	                                return prev.filter(function (row, index) {
	                                    return index >= offset_1;
	                                });
	                            }
	                        case "lmt":
	                            if (getMod_1('limit')) {
	                                var limit_1 = getMod_1('limit').get('args');
	                                return prev.filter(function (row, index) {
	                                    return index < limit_1;
	                                });
	                            }
	                        case "clms":
	                            if (qArgs) {
	                                var columns_1 = ta._model.map(function (model) {
	                                    return model['key'];
	                                }).filter(function (col) {
	                                    return qArgs.indexOf(col) == -1;
	                                });
	                                return prev.map(function (row) {
	                                    columns_1.forEach(function (col) { return delete row[col]; });
	                                    return row;
	                                });
	                            }
	                        default: return prev;
	                    }
	                }, whereTable._table);
	                var filterEffect = t._runFilters(result);
	                t._cache.get(t._selectedTable).set(t._cacheKey, filterEffect);
	                t._cacheIndex.get(t._selectedTable).set(t._cacheKey, result.map(function (row) {
	                    return row[whereTable._primaryKey];
	                }));
	                callBack(filterEffect);
	                break;
	            case "delete":
	                if (_whereStatement) {
	                    var affectedKeys_2 = [];
	                    var whereTable_1 = t._newWhere(ta, _whereStatement);
	                    whereTable_1._forEach(function (value, index) {
	                        ta._remove(index);
	                        affectedKeys_2.push(index);
	                    });
	                    t._removeCacheFromKeys(affectedKeys_2);
	                    callBack(whereTable_1.length + " row(s) deleted");
	                }
	                else {
	                    t._newModel(t._selectedTable, t._tables.get(t._selectedTable)._model);
	                    callBack('Table dropped.');
	                }
	                break;
	            case "drop":
	                t._newModel(t._selectedTable, t._tables.get(t._selectedTable)._model);
	                callBack('Table dropped.');
	                break;
	        }
	    };
	    someSQL_MemDB.prototype._newWhere = function (table, whereStatement) {
	        var t = this;
	        if (whereStatement && whereStatement.length) {
	            if (typeof (whereStatement[0]) == "string") {
	                return t._singleWhereResolve(table._clone(), whereStatement);
	            }
	            else {
	                var ptr_1 = 0;
	                var compare_1 = null;
	                return whereStatement.map(function (statement) {
	                    return t._singleWhereResolve(table._clone(), statement);
	                }).reduce(function (prev, cur, i) {
	                    if (i == 0)
	                        return cur;
	                    if (ptr_1 == 0)
	                        return compare_1 = whereStatement[i], ptr_1 = 1, prev;
	                    if (ptr_1 == 1) {
	                        ptr_1 = 0;
	                        switch (compare_1) {
	                            case "and": return prev._join('inner', cur);
	                            case "or": return prev._join('outer', cur);
	                            default: return prev;
	                        }
	                    }
	                });
	            }
	        }
	        else {
	            return table._clone();
	        }
	    };
	    someSQL_MemDB.prototype._singleWhereResolve = function (table, whereStatement) {
	        var t = this;
	        var left = whereStatement[0];
	        var operator = whereStatement[1];
	        var right = whereStatement[2];
	        return table._filter(function (row) {
	            return t._compare(right, operator, row[left]) == 0;
	        });
	    };
	    someSQL_MemDB.prototype._compare = function (val1, compare, val2) {
	        switch (compare) {
	            case "=": return val2 == val1 ? 0 : 1;
	            case ">": return val2 > val1 ? 0 : 1;
	            case "<": return val2 < val1 ? 0 : 1;
	            case "<=": return val2 <= val1 ? 0 : 1;
	            case ">=": return val2 >= val1 ? 0 : 1;
	            case "IN": return val1.indexOf(val2) == -1 ? 1 : 0;
	            case "NOT IN": return val1.indexOf(val2) == -1 ? 0 : 1;
	            case "REGEX":
	            case "LIKE": return val2.search(val1) == -1 ? 1 : 0;
	            default: return 0;
	        }
	    };
	    return someSQL_MemDB;
	}());
	exports.someSQL_MemDB = someSQL_MemDB;
	var _memDB_Table = (function () {
	    function _memDB_Table(model, index, table) {
	        var t = this;
	        t._model = model;
	        t._index = index || [];
	        t._table = table || [];
	        t._incriment = 1;
	        t.length = 0;
	        t._primaryKey = t._model.reduce(function (prev, cur) {
	            if (cur['props'] && cur['props'].indexOf('pk') != -1) {
	                t._pkType = cur['type'];
	                return cur['key'];
	            }
	            else {
	                return prev;
	            }
	        }, "");
	    }
	    _memDB_Table._detach = function (input) {
	        return JSON.parse(JSON.stringify(input));
	    };
	    _memDB_Table.prototype._get = function (index) {
	        return this._table[this._index.indexOf(index)];
	    };
	    _memDB_Table.prototype._set = function (index, value) {
	        this._table[this._index.indexOf(index)] = value;
	    };
	    _memDB_Table.prototype._add = function (data) {
	        var t = this;
	        if (!data[t._primaryKey]) {
	            switch (t._pkType) {
	                case "int":
	                    data[t._primaryKey] = t._incriment;
	                    t._incriment++;
	                    break;
	                case "uuid":
	                    data[t._primaryKey] = index_ts_1.someSQL_Instance.uuid();
	                    break;
	            }
	            t._index.push(data[t._primaryKey]);
	            t._table.push(data);
	            t.length = t._index.length;
	        }
	        else {
	            t._set(data[t._primaryKey], data);
	        }
	    };
	    _memDB_Table.prototype._filter = function (func) {
	        var t = this;
	        t._index.forEach(function (idx) {
	            if (!func.apply(t, [t._get(idx), idx]))
	                t._remove(idx);
	        });
	        t.length = t._index.length;
	        return this;
	    };
	    _memDB_Table.prototype._forEach = function (func) {
	        var t = this;
	        t._index.forEach(function (idx) {
	            func.apply(t, [t._get(idx), idx]);
	        });
	        return t;
	    };
	    _memDB_Table.prototype._sort = function (func) {
	        var t = this;
	        var r = [];
	        var i = -1;
	        t._index.sort(function (a, b) {
	            var result = func.apply(t, [t._get(a), t._get(b)]);
	            r.push(result);
	            return result;
	        });
	        t._table.sort(function (a, b) {
	            i++;
	            return r[i];
	        });
	        return t;
	    };
	    _memDB_Table.prototype._join = function (type, table, joinKeys, mergeRowData) {
	        var t = this;
	        var joinKs = [];
	        if (!joinKeys) {
	            joinKs = [t._primaryKey, table._primaryKey];
	        }
	        else {
	            joinKs = joinKeys;
	        }
	        var tables = [this, table];
	        if (type == 'inner') {
	            tables.sort(function (a, b) {
	                return a.length > b.length ? -1 : 1;
	            });
	        }
	        tables[0]._forEach(function (row, idx) {
	            var found;
	            tables[1]._forEach(function (row2, idx2) {
	                if (found == undefined) {
	                    if (row[joinKs[0]] == row2[joinKs[1]])
	                        found = row2;
	                }
	            });
	            if (found == undefined) {
	                switch (type) {
	                    case "inner":
	                        tables[0]._remove(idx);
	                        break;
	                    case "outer":
	                        tables[1]._add(found);
	                        break;
	                }
	            }
	        });
	        if (type == 'outer') {
	            tables[0]._sort(function (a, b) {
	                return a[tables[0]._primaryKey] > b[tables[0]._primaryKey] ? 1 : -1;
	            });
	        }
	        return tables[0];
	    };
	    _memDB_Table.prototype._remove = function (index) {
	        var t = this;
	        var f = t._index.indexOf(index);
	        t._index.splice(f, 1);
	        t._table.splice(f, 1);
	        t.length = t._index.length;
	    };
	    _memDB_Table.prototype._clone = function () {
	        var ta = new _memDB_Table(this._model, _memDB_Table._detach(this._index), _memDB_Table._detach(this._table));
	        ta._incriment = this._incriment;
	        ta.length = this.length;
	        return ta;
	    };
	    return _memDB_Table;
	}());


/***/ }
/******/ ])
});
;