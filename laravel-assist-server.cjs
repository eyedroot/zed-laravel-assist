#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/vscode-languageserver/lib/common/utils/is.js
var require_is = __commonJS({
  "node_modules/vscode-languageserver/lib/common/utils/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.thenable = exports2.typedArray = exports2.stringArray = exports2.array = exports2.func = exports2.error = exports2.number = exports2.string = exports2.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports2.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports2.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports2.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports2.typedArray = typedArray;
    function thenable(value) {
      return value && func(value.then);
    }
    exports2.thenable = thenable;
  }
});

// node_modules/vscode-jsonrpc/lib/common/is.js
var require_is2 = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringArray = exports2.array = exports2.func = exports2.error = exports2.number = exports2.string = exports2.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports2.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports2.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports2.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messages.js
var require_messages = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Message = exports2.NotificationType9 = exports2.NotificationType8 = exports2.NotificationType7 = exports2.NotificationType6 = exports2.NotificationType5 = exports2.NotificationType4 = exports2.NotificationType3 = exports2.NotificationType2 = exports2.NotificationType1 = exports2.NotificationType0 = exports2.NotificationType = exports2.RequestType9 = exports2.RequestType8 = exports2.RequestType7 = exports2.RequestType6 = exports2.RequestType5 = exports2.RequestType4 = exports2.RequestType3 = exports2.RequestType2 = exports2.RequestType1 = exports2.RequestType = exports2.RequestType0 = exports2.AbstractMessageSignature = exports2.ParameterStructures = exports2.ResponseError = exports2.ErrorCodes = void 0;
    var is = require_is2();
    var ErrorCodes;
    (function(ErrorCodes2) {
      ErrorCodes2.ParseError = -32700;
      ErrorCodes2.InvalidRequest = -32600;
      ErrorCodes2.MethodNotFound = -32601;
      ErrorCodes2.InvalidParams = -32602;
      ErrorCodes2.InternalError = -32603;
      ErrorCodes2.jsonrpcReservedErrorRangeStart = -32099;
      ErrorCodes2.serverErrorStart = -32099;
      ErrorCodes2.MessageWriteError = -32099;
      ErrorCodes2.MessageReadError = -32098;
      ErrorCodes2.PendingResponseRejected = -32097;
      ErrorCodes2.ConnectionInactive = -32096;
      ErrorCodes2.ServerNotInitialized = -32002;
      ErrorCodes2.UnknownErrorCode = -32001;
      ErrorCodes2.jsonrpcReservedErrorRangeEnd = -32e3;
      ErrorCodes2.serverErrorEnd = -32e3;
    })(ErrorCodes || (exports2.ErrorCodes = ErrorCodes = {}));
    var ResponseError = class _ResponseError extends Error {
      constructor(code, message, data) {
        super(message);
        this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
        this.data = data;
        Object.setPrototypeOf(this, _ResponseError.prototype);
      }
      toJson() {
        const result = {
          code: this.code,
          message: this.message
        };
        if (this.data !== void 0) {
          result.data = this.data;
        }
        return result;
      }
    };
    exports2.ResponseError = ResponseError;
    var ParameterStructures = class _ParameterStructures {
      constructor(kind) {
        this.kind = kind;
      }
      static is(value) {
        return value === _ParameterStructures.auto || value === _ParameterStructures.byName || value === _ParameterStructures.byPosition;
      }
      toString() {
        return this.kind;
      }
    };
    exports2.ParameterStructures = ParameterStructures;
    ParameterStructures.auto = new ParameterStructures("auto");
    ParameterStructures.byPosition = new ParameterStructures("byPosition");
    ParameterStructures.byName = new ParameterStructures("byName");
    var AbstractMessageSignature = class {
      constructor(method, numberOfParams) {
        this.method = method;
        this.numberOfParams = numberOfParams;
      }
      get parameterStructures() {
        return ParameterStructures.auto;
      }
    };
    exports2.AbstractMessageSignature = AbstractMessageSignature;
    var RequestType0 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 0);
      }
    };
    exports2.RequestType0 = RequestType0;
    var RequestType = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.RequestType = RequestType;
    var RequestType1 = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.RequestType1 = RequestType1;
    var RequestType2 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 2);
      }
    };
    exports2.RequestType2 = RequestType2;
    var RequestType3 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 3);
      }
    };
    exports2.RequestType3 = RequestType3;
    var RequestType4 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 4);
      }
    };
    exports2.RequestType4 = RequestType4;
    var RequestType5 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 5);
      }
    };
    exports2.RequestType5 = RequestType5;
    var RequestType6 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 6);
      }
    };
    exports2.RequestType6 = RequestType6;
    var RequestType7 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 7);
      }
    };
    exports2.RequestType7 = RequestType7;
    var RequestType8 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 8);
      }
    };
    exports2.RequestType8 = RequestType8;
    var RequestType9 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 9);
      }
    };
    exports2.RequestType9 = RequestType9;
    var NotificationType = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.NotificationType = NotificationType;
    var NotificationType0 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 0);
      }
    };
    exports2.NotificationType0 = NotificationType0;
    var NotificationType1 = class extends AbstractMessageSignature {
      constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
      }
      get parameterStructures() {
        return this._parameterStructures;
      }
    };
    exports2.NotificationType1 = NotificationType1;
    var NotificationType2 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 2);
      }
    };
    exports2.NotificationType2 = NotificationType2;
    var NotificationType3 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 3);
      }
    };
    exports2.NotificationType3 = NotificationType3;
    var NotificationType4 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 4);
      }
    };
    exports2.NotificationType4 = NotificationType4;
    var NotificationType5 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 5);
      }
    };
    exports2.NotificationType5 = NotificationType5;
    var NotificationType6 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 6);
      }
    };
    exports2.NotificationType6 = NotificationType6;
    var NotificationType7 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 7);
      }
    };
    exports2.NotificationType7 = NotificationType7;
    var NotificationType8 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 8);
      }
    };
    exports2.NotificationType8 = NotificationType8;
    var NotificationType9 = class extends AbstractMessageSignature {
      constructor(method) {
        super(method, 9);
      }
    };
    exports2.NotificationType9 = NotificationType9;
    var Message;
    (function(Message2) {
      function isRequest(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
      }
      Message2.isRequest = isRequest;
      function isNotification(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && message.id === void 0;
      }
      Message2.isNotification = isNotification;
      function isResponse(message) {
        const candidate = message;
        return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
      }
      Message2.isResponse = isResponse;
    })(Message || (exports2.Message = Message = {}));
  }
});

// node_modules/vscode-jsonrpc/lib/common/linkedMap.js
var require_linkedMap = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/linkedMap.js"(exports2) {
    "use strict";
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LRUCache = exports2.LinkedMap = exports2.Touch = void 0;
    var Touch;
    (function(Touch2) {
      Touch2.None = 0;
      Touch2.First = 1;
      Touch2.AsOld = Touch2.First;
      Touch2.Last = 2;
      Touch2.AsNew = Touch2.Last;
    })(Touch || (exports2.Touch = Touch = {}));
    var LinkedMap = class {
      constructor() {
        this[_a] = "LinkedMap";
        this._map = /* @__PURE__ */ new Map();
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
        this._state = 0;
      }
      clear() {
        this._map.clear();
        this._head = void 0;
        this._tail = void 0;
        this._size = 0;
        this._state++;
      }
      isEmpty() {
        return !this._head && !this._tail;
      }
      get size() {
        return this._size;
      }
      get first() {
        return this._head?.value;
      }
      get last() {
        return this._tail?.value;
      }
      has(key) {
        return this._map.has(key);
      }
      get(key, touch = Touch.None) {
        const item = this._map.get(key);
        if (!item) {
          return void 0;
        }
        if (touch !== Touch.None) {
          this.touch(item, touch);
        }
        return item.value;
      }
      set(key, value, touch = Touch.None) {
        let item = this._map.get(key);
        if (item) {
          item.value = value;
          if (touch !== Touch.None) {
            this.touch(item, touch);
          }
        } else {
          item = { key, value, next: void 0, previous: void 0 };
          switch (touch) {
            case Touch.None:
              this.addItemLast(item);
              break;
            case Touch.First:
              this.addItemFirst(item);
              break;
            case Touch.Last:
              this.addItemLast(item);
              break;
            default:
              this.addItemLast(item);
              break;
          }
          this._map.set(key, item);
          this._size++;
        }
        return this;
      }
      delete(key) {
        return !!this.remove(key);
      }
      remove(key) {
        const item = this._map.get(key);
        if (!item) {
          return void 0;
        }
        this._map.delete(key);
        this.removeItem(item);
        this._size--;
        return item.value;
      }
      shift() {
        if (!this._head && !this._tail) {
          return void 0;
        }
        if (!this._head || !this._tail) {
          throw new Error("Invalid list");
        }
        const item = this._head;
        this._map.delete(item.key);
        this.removeItem(item);
        this._size--;
        return item.value;
      }
      forEach(callbackfn, thisArg) {
        const state = this._state;
        let current = this._head;
        while (current) {
          if (thisArg) {
            callbackfn.bind(thisArg)(current.value, current.key, this);
          } else {
            callbackfn(current.value, current.key, this);
          }
          if (this._state !== state) {
            throw new Error(`LinkedMap got modified during iteration.`);
          }
          current = current.next;
        }
      }
      keys() {
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]: () => {
            return iterator;
          },
          next: () => {
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: current.key, done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      values() {
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]: () => {
            return iterator;
          },
          next: () => {
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: current.value, done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      entries() {
        const state = this._state;
        let current = this._head;
        const iterator = {
          [Symbol.iterator]: () => {
            return iterator;
          },
          next: () => {
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            if (current) {
              const result = { value: [current.key, current.value], done: false };
              current = current.next;
              return result;
            } else {
              return { value: void 0, done: true };
            }
          }
        };
        return iterator;
      }
      [(_a = Symbol.toStringTag, Symbol.iterator)]() {
        return this.entries();
      }
      trimOld(newSize) {
        if (newSize >= this.size) {
          return;
        }
        if (newSize === 0) {
          this.clear();
          return;
        }
        let current = this._head;
        let currentSize = this.size;
        while (current && currentSize > newSize) {
          this._map.delete(current.key);
          current = current.next;
          currentSize--;
        }
        this._head = current;
        this._size = currentSize;
        if (current) {
          current.previous = void 0;
        }
        this._state++;
      }
      addItemFirst(item) {
        if (!this._head && !this._tail) {
          this._tail = item;
        } else if (!this._head) {
          throw new Error("Invalid list");
        } else {
          item.next = this._head;
          this._head.previous = item;
        }
        this._head = item;
        this._state++;
      }
      addItemLast(item) {
        if (!this._head && !this._tail) {
          this._head = item;
        } else if (!this._tail) {
          throw new Error("Invalid list");
        } else {
          item.previous = this._tail;
          this._tail.next = item;
        }
        this._tail = item;
        this._state++;
      }
      removeItem(item) {
        if (item === this._head && item === this._tail) {
          this._head = void 0;
          this._tail = void 0;
        } else if (item === this._head) {
          if (!item.next) {
            throw new Error("Invalid list");
          }
          item.next.previous = void 0;
          this._head = item.next;
        } else if (item === this._tail) {
          if (!item.previous) {
            throw new Error("Invalid list");
          }
          item.previous.next = void 0;
          this._tail = item.previous;
        } else {
          const next = item.next;
          const previous = item.previous;
          if (!next || !previous) {
            throw new Error("Invalid list");
          }
          next.previous = previous;
          previous.next = next;
        }
        item.next = void 0;
        item.previous = void 0;
        this._state++;
      }
      touch(item, touch) {
        if (!this._head || !this._tail) {
          throw new Error("Invalid list");
        }
        if (touch !== Touch.First && touch !== Touch.Last) {
          return;
        }
        if (touch === Touch.First) {
          if (item === this._head) {
            return;
          }
          const next = item.next;
          const previous = item.previous;
          if (item === this._tail) {
            previous.next = void 0;
            this._tail = previous;
          } else {
            next.previous = previous;
            previous.next = next;
          }
          item.previous = void 0;
          item.next = this._head;
          this._head.previous = item;
          this._head = item;
          this._state++;
        } else if (touch === Touch.Last) {
          if (item === this._tail) {
            return;
          }
          const next = item.next;
          const previous = item.previous;
          if (item === this._head) {
            next.previous = void 0;
            this._head = next;
          } else {
            next.previous = previous;
            previous.next = next;
          }
          item.next = void 0;
          item.previous = this._tail;
          this._tail.next = item;
          this._tail = item;
          this._state++;
        }
      }
      toJSON() {
        const data = [];
        this.forEach((value, key) => {
          data.push([key, value]);
        });
        return data;
      }
      fromJSON(data) {
        this.clear();
        for (const [key, value] of data) {
          this.set(key, value);
        }
      }
    };
    exports2.LinkedMap = LinkedMap;
    var LRUCache = class extends LinkedMap {
      constructor(limit, ratio = 1) {
        super();
        this._limit = limit;
        this._ratio = Math.min(Math.max(0, ratio), 1);
      }
      get limit() {
        return this._limit;
      }
      set limit(limit) {
        this._limit = limit;
        this.checkTrim();
      }
      get ratio() {
        return this._ratio;
      }
      set ratio(ratio) {
        this._ratio = Math.min(Math.max(0, ratio), 1);
        this.checkTrim();
      }
      get(key, touch = Touch.AsNew) {
        return super.get(key, touch);
      }
      peek(key) {
        return super.get(key, Touch.None);
      }
      set(key, value) {
        super.set(key, value, Touch.Last);
        this.checkTrim();
        return this;
      }
      checkTrim() {
        if (this.size > this._limit) {
          this.trimOld(Math.round(this._limit * this._ratio));
        }
      }
    };
    exports2.LRUCache = LRUCache;
  }
});

// node_modules/vscode-jsonrpc/lib/common/disposable.js
var require_disposable = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/disposable.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Disposable = void 0;
    var Disposable;
    (function(Disposable2) {
      function create(func) {
        return {
          dispose: func
        };
      }
      Disposable2.create = create;
    })(Disposable || (exports2.Disposable = Disposable = {}));
  }
});

// node_modules/vscode-jsonrpc/lib/common/ral.js
var require_ral = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/ral.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var _ral;
    function RAL() {
      if (_ral === void 0) {
        throw new Error(`No runtime abstraction layer installed`);
      }
      return _ral;
    }
    (function(RAL2) {
      function install(ral) {
        if (ral === void 0) {
          throw new Error(`No runtime abstraction layer provided`);
        }
        _ral = ral;
      }
      RAL2.install = install;
    })(RAL || (RAL = {}));
    exports2.default = RAL;
  }
});

// node_modules/vscode-jsonrpc/lib/common/events.js
var require_events = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/events.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Emitter = exports2.Event = void 0;
    var ral_1 = require_ral();
    var Event;
    (function(Event2) {
      const _disposable = { dispose() {
      } };
      Event2.None = function() {
        return _disposable;
      };
    })(Event || (exports2.Event = Event = {}));
    var CallbackList = class {
      add(callback, context = null, bucket) {
        if (!this._callbacks) {
          this._callbacks = [];
          this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
          bucket.push({ dispose: () => this.remove(callback, context) });
        }
      }
      remove(callback, context = null) {
        if (!this._callbacks) {
          return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0, len = this._callbacks.length; i < len; i++) {
          if (this._callbacks[i] === callback) {
            if (this._contexts[i] === context) {
              this._callbacks.splice(i, 1);
              this._contexts.splice(i, 1);
              return;
            } else {
              foundCallbackWithDifferentContext = true;
            }
          }
        }
        if (foundCallbackWithDifferentContext) {
          throw new Error("When adding a listener with a context, you should remove it with the same context");
        }
      }
      invoke(...args) {
        if (!this._callbacks) {
          return [];
        }
        const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
        for (let i = 0, len = callbacks.length; i < len; i++) {
          try {
            ret.push(callbacks[i].apply(contexts[i], args));
          } catch (e) {
            (0, ral_1.default)().console.error(e);
          }
        }
        return ret;
      }
      isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
      }
      dispose() {
        this._callbacks = void 0;
        this._contexts = void 0;
      }
    };
    var Emitter = class _Emitter {
      constructor(_options) {
        this._options = _options;
      }
      /**
       * For the public to allow to subscribe
       * to events from this Emitter
       */
      get event() {
        if (!this._event) {
          this._event = (listener, thisArgs, disposables) => {
            if (!this._callbacks) {
              this._callbacks = new CallbackList();
            }
            if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
              this._options.onFirstListenerAdd(this);
            }
            this._callbacks.add(listener, thisArgs);
            const result = {
              dispose: () => {
                if (!this._callbacks) {
                  return;
                }
                this._callbacks.remove(listener, thisArgs);
                result.dispose = _Emitter._noop;
                if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                  this._options.onLastListenerRemove(this);
                }
              }
            };
            if (Array.isArray(disposables)) {
              disposables.push(result);
            }
            return result;
          };
        }
        return this._event;
      }
      /**
       * To be kept private to fire an event to
       * subscribers
       */
      fire(event) {
        if (this._callbacks) {
          this._callbacks.invoke.call(this._callbacks, event);
        }
      }
      dispose() {
        if (this._callbacks) {
          this._callbacks.dispose();
          this._callbacks = void 0;
        }
      }
    };
    exports2.Emitter = Emitter;
    Emitter._noop = function() {
    };
  }
});

// node_modules/vscode-jsonrpc/lib/common/cancellation.js
var require_cancellation = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/cancellation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CancellationTokenSource = exports2.CancellationToken = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var events_1 = require_events();
    var CancellationToken;
    (function(CancellationToken2) {
      CancellationToken2.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events_1.Event.None
      });
      CancellationToken2.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events_1.Event.None
      });
      function is(value) {
        const candidate = value;
        return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
      }
      CancellationToken2.is = is;
    })(CancellationToken || (exports2.CancellationToken = CancellationToken = {}));
    var shortcutEvent = Object.freeze(function(callback, context) {
      const handle = (0, ral_1.default)().timer.setTimeout(callback.bind(context), 0);
      return { dispose() {
        handle.dispose();
      } };
    });
    var MutableToken = class {
      constructor() {
        this._isCancelled = false;
      }
      cancel() {
        if (!this._isCancelled) {
          this._isCancelled = true;
          if (this._emitter) {
            this._emitter.fire(void 0);
            this.dispose();
          }
        }
      }
      get isCancellationRequested() {
        return this._isCancelled;
      }
      get onCancellationRequested() {
        if (this._isCancelled) {
          return shortcutEvent;
        }
        if (!this._emitter) {
          this._emitter = new events_1.Emitter();
        }
        return this._emitter.event;
      }
      dispose() {
        if (this._emitter) {
          this._emitter.dispose();
          this._emitter = void 0;
        }
      }
    };
    var CancellationTokenSource = class {
      get token() {
        if (!this._token) {
          this._token = new MutableToken();
        }
        return this._token;
      }
      cancel() {
        if (!this._token) {
          this._token = CancellationToken.Cancelled;
        } else {
          this._token.cancel();
        }
      }
      dispose() {
        if (!this._token) {
          this._token = CancellationToken.None;
        } else if (this._token instanceof MutableToken) {
          this._token.dispose();
        }
      }
    };
    exports2.CancellationTokenSource = CancellationTokenSource;
  }
});

// node_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.js
var require_sharedArrayCancellation = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/sharedArrayCancellation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SharedArrayReceiverStrategy = exports2.SharedArraySenderStrategy = void 0;
    var cancellation_1 = require_cancellation();
    var CancellationState;
    (function(CancellationState2) {
      CancellationState2.Continue = 0;
      CancellationState2.Cancelled = 1;
    })(CancellationState || (CancellationState = {}));
    var SharedArraySenderStrategy = class {
      constructor() {
        this.buffers = /* @__PURE__ */ new Map();
      }
      enableCancellation(request) {
        if (request.id === null) {
          return;
        }
        const buffer = new SharedArrayBuffer(4);
        const data = new Int32Array(buffer, 0, 1);
        data[0] = CancellationState.Continue;
        this.buffers.set(request.id, buffer);
        request.$cancellationData = buffer;
      }
      async sendCancellation(_conn, id) {
        const buffer = this.buffers.get(id);
        if (buffer === void 0) {
          return;
        }
        const data = new Int32Array(buffer, 0, 1);
        Atomics.store(data, 0, CancellationState.Cancelled);
      }
      cleanup(id) {
        this.buffers.delete(id);
      }
      dispose() {
        this.buffers.clear();
      }
    };
    exports2.SharedArraySenderStrategy = SharedArraySenderStrategy;
    var SharedArrayBufferCancellationToken = class {
      constructor(buffer) {
        this.data = new Int32Array(buffer, 0, 1);
      }
      get isCancellationRequested() {
        return Atomics.load(this.data, 0) === CancellationState.Cancelled;
      }
      get onCancellationRequested() {
        throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`);
      }
    };
    var SharedArrayBufferCancellationTokenSource = class {
      constructor(buffer) {
        this.token = new SharedArrayBufferCancellationToken(buffer);
      }
      cancel() {
      }
      dispose() {
      }
    };
    var SharedArrayReceiverStrategy = class {
      constructor() {
        this.kind = "request";
      }
      createCancellationTokenSource(request) {
        const buffer = request.$cancellationData;
        if (buffer === void 0) {
          return new cancellation_1.CancellationTokenSource();
        }
        return new SharedArrayBufferCancellationTokenSource(buffer);
      }
    };
    exports2.SharedArrayReceiverStrategy = SharedArrayReceiverStrategy;
  }
});

// node_modules/vscode-jsonrpc/lib/common/semaphore.js
var require_semaphore = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/semaphore.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Semaphore = void 0;
    var ral_1 = require_ral();
    var Semaphore = class {
      constructor(capacity = 1) {
        if (capacity <= 0) {
          throw new Error("Capacity must be greater than 0");
        }
        this._capacity = capacity;
        this._active = 0;
        this._waiting = [];
      }
      lock(thunk) {
        return new Promise((resolve, reject) => {
          this._waiting.push({ thunk, resolve, reject });
          this.runNext();
        });
      }
      get active() {
        return this._active;
      }
      runNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
          return;
        }
        (0, ral_1.default)().timer.setImmediate(() => this.doRunNext());
      }
      doRunNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
          return;
        }
        const next = this._waiting.shift();
        this._active++;
        if (this._active > this._capacity) {
          throw new Error(`To many thunks active`);
        }
        try {
          const result = next.thunk();
          if (result instanceof Promise) {
            result.then((value) => {
              this._active--;
              next.resolve(value);
              this.runNext();
            }, (err) => {
              this._active--;
              next.reject(err);
              this.runNext();
            });
          } else {
            this._active--;
            next.resolve(result);
            this.runNext();
          }
        } catch (err) {
          this._active--;
          next.reject(err);
          this.runNext();
        }
      }
    };
    exports2.Semaphore = Semaphore;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messageReader.js
var require_messageReader = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messageReader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ReadableStreamMessageReader = exports2.AbstractMessageReader = exports2.MessageReader = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var events_1 = require_events();
    var semaphore_1 = require_semaphore();
    var MessageReader;
    (function(MessageReader2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
      }
      MessageReader2.is = is;
    })(MessageReader || (exports2.MessageReader = MessageReader = {}));
    var AbstractMessageReader = class {
      constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
        this.partialMessageEmitter = new events_1.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(error) {
        this.errorEmitter.fire(this.asError(error));
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      get onPartialMessage() {
        return this.partialMessageEmitter.event;
      }
      firePartialMessage(info) {
        this.partialMessageEmitter.fire(info);
      }
      asError(error) {
        if (error instanceof Error) {
          return error;
        } else {
          return new Error(`Reader received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
        }
      }
    };
    exports2.AbstractMessageReader = AbstractMessageReader;
    var ResolvedMessageReaderOptions;
    (function(ResolvedMessageReaderOptions2) {
      function fromOptions(options) {
        let charset;
        let result;
        let contentDecoder;
        const contentDecoders = /* @__PURE__ */ new Map();
        let contentTypeDecoder;
        const contentTypeDecoders = /* @__PURE__ */ new Map();
        if (options === void 0 || typeof options === "string") {
          charset = options ?? "utf-8";
        } else {
          charset = options.charset ?? "utf-8";
          if (options.contentDecoder !== void 0) {
            contentDecoder = options.contentDecoder;
            contentDecoders.set(contentDecoder.name, contentDecoder);
          }
          if (options.contentDecoders !== void 0) {
            for (const decoder of options.contentDecoders) {
              contentDecoders.set(decoder.name, decoder);
            }
          }
          if (options.contentTypeDecoder !== void 0) {
            contentTypeDecoder = options.contentTypeDecoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
          }
          if (options.contentTypeDecoders !== void 0) {
            for (const decoder of options.contentTypeDecoders) {
              contentTypeDecoders.set(decoder.name, decoder);
            }
          }
        }
        if (contentTypeDecoder === void 0) {
          contentTypeDecoder = (0, ral_1.default)().applicationJson.decoder;
          contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
        }
        return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
      }
      ResolvedMessageReaderOptions2.fromOptions = fromOptions;
    })(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
    var ReadableStreamMessageReader = class extends AbstractMessageReader {
      constructor(readable, options) {
        super();
        this.readable = readable;
        this.options = ResolvedMessageReaderOptions.fromOptions(options);
        this.buffer = (0, ral_1.default)().messageBuffer.create(this.options.charset);
        this._partialMessageTimeout = 1e4;
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.readSemaphore = new semaphore_1.Semaphore(1);
      }
      set partialMessageTimeout(timeout) {
        this._partialMessageTimeout = timeout;
      }
      get partialMessageTimeout() {
        return this._partialMessageTimeout;
      }
      listen(callback) {
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.partialMessageTimer = void 0;
        this.callback = callback;
        const result = this.readable.onData((data) => {
          this.onData(data);
        });
        this.readable.onError((error) => this.fireError(error));
        this.readable.onClose(() => this.fireClose());
        return result;
      }
      onData(data) {
        try {
          this.buffer.append(data);
          while (true) {
            if (this.nextMessageLength === -1) {
              const headers = this.buffer.tryReadHeaders(true);
              if (!headers) {
                return;
              }
              const contentLength = headers.get("content-length");
              if (!contentLength) {
                this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(headers))}`));
                return;
              }
              const length = parseInt(contentLength);
              if (isNaN(length)) {
                this.fireError(new Error(`Content-Length value must be a number. Got ${contentLength}`));
                return;
              }
              this.nextMessageLength = length;
            }
            const body = this.buffer.tryReadBody(this.nextMessageLength);
            if (body === void 0) {
              this.setPartialMessageTimer();
              return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            this.readSemaphore.lock(async () => {
              const bytes = this.options.contentDecoder !== void 0 ? await this.options.contentDecoder.decode(body) : body;
              const message = await this.options.contentTypeDecoder.decode(bytes, this.options);
              this.callback(message);
            }).catch((error) => {
              this.fireError(error);
            });
          }
        } catch (error) {
          this.fireError(error);
        }
      }
      clearPartialMessageTimer() {
        if (this.partialMessageTimer) {
          this.partialMessageTimer.dispose();
          this.partialMessageTimer = void 0;
        }
      }
      setPartialMessageTimer() {
        this.clearPartialMessageTimer();
        if (this._partialMessageTimeout <= 0) {
          return;
        }
        this.partialMessageTimer = (0, ral_1.default)().timer.setTimeout((token, timeout) => {
          this.partialMessageTimer = void 0;
          if (token === this.messageToken) {
            this.firePartialMessage({ messageToken: token, waitingTime: timeout });
            this.setPartialMessageTimer();
          }
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
      }
    };
    exports2.ReadableStreamMessageReader = ReadableStreamMessageReader;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messageWriter.js
var require_messageWriter = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messageWriter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WriteableStreamMessageWriter = exports2.AbstractMessageWriter = exports2.MessageWriter = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var semaphore_1 = require_semaphore();
    var events_1 = require_events();
    var ContentLength = "Content-Length: ";
    var CRLF = "\r\n";
    var MessageWriter;
    (function(MessageWriter2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
      }
      MessageWriter2.is = is;
    })(MessageWriter || (exports2.MessageWriter = MessageWriter = {}));
    var AbstractMessageWriter = class {
      constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
      }
      dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
      }
      get onError() {
        return this.errorEmitter.event;
      }
      fireError(error, message, count) {
        this.errorEmitter.fire([this.asError(error), message, count]);
      }
      get onClose() {
        return this.closeEmitter.event;
      }
      fireClose() {
        this.closeEmitter.fire(void 0);
      }
      asError(error) {
        if (error instanceof Error) {
          return error;
        } else {
          return new Error(`Writer received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
        }
      }
    };
    exports2.AbstractMessageWriter = AbstractMessageWriter;
    var ResolvedMessageWriterOptions;
    (function(ResolvedMessageWriterOptions2) {
      function fromOptions(options) {
        if (options === void 0 || typeof options === "string") {
          return { charset: options ?? "utf-8", contentTypeEncoder: (0, ral_1.default)().applicationJson.encoder };
        } else {
          return { charset: options.charset ?? "utf-8", contentEncoder: options.contentEncoder, contentTypeEncoder: options.contentTypeEncoder ?? (0, ral_1.default)().applicationJson.encoder };
        }
      }
      ResolvedMessageWriterOptions2.fromOptions = fromOptions;
    })(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
    var WriteableStreamMessageWriter = class extends AbstractMessageWriter {
      constructor(writable, options) {
        super();
        this.writable = writable;
        this.options = ResolvedMessageWriterOptions.fromOptions(options);
        this.errorCount = 0;
        this.writeSemaphore = new semaphore_1.Semaphore(1);
        this.writable.onError((error) => this.fireError(error));
        this.writable.onClose(() => this.fireClose());
      }
      async write(msg) {
        return this.writeSemaphore.lock(async () => {
          const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
            if (this.options.contentEncoder !== void 0) {
              return this.options.contentEncoder.encode(buffer);
            } else {
              return buffer;
            }
          });
          return payload.then((buffer) => {
            const headers = [];
            headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
            headers.push(CRLF);
            return this.doWrite(msg, headers, buffer);
          }, (error) => {
            this.fireError(error);
            throw error;
          });
        });
      }
      async doWrite(msg, headers, data) {
        try {
          await this.writable.write(headers.join(""), "ascii");
          return this.writable.write(data);
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
        this.writable.end();
      }
    };
    exports2.WriteableStreamMessageWriter = WriteableStreamMessageWriter;
  }
});

// node_modules/vscode-jsonrpc/lib/common/messageBuffer.js
var require_messageBuffer = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/messageBuffer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AbstractMessageBuffer = void 0;
    var CR = 13;
    var LF = 10;
    var CRLF = "\r\n";
    var AbstractMessageBuffer = class {
      constructor(encoding = "utf-8") {
        this._encoding = encoding;
        this._chunks = [];
        this._totalLength = 0;
      }
      get encoding() {
        return this._encoding;
      }
      append(chunk) {
        const toAppend = typeof chunk === "string" ? this.fromString(chunk, this._encoding) : chunk;
        this._chunks.push(toAppend);
        this._totalLength += toAppend.byteLength;
      }
      tryReadHeaders(lowerCaseKeys = false) {
        if (this._chunks.length === 0) {
          return void 0;
        }
        let state = 0;
        let chunkIndex = 0;
        let offset = 0;
        let chunkBytesRead = 0;
        row: while (chunkIndex < this._chunks.length) {
          const chunk = this._chunks[chunkIndex];
          offset = 0;
          column: while (offset < chunk.length) {
            const value = chunk[offset];
            switch (value) {
              case CR:
                switch (state) {
                  case 0:
                    state = 1;
                    break;
                  case 2:
                    state = 3;
                    break;
                  default:
                    state = 0;
                }
                break;
              case LF:
                switch (state) {
                  case 1:
                    state = 2;
                    break;
                  case 3:
                    state = 4;
                    offset++;
                    break row;
                  default:
                    state = 0;
                }
                break;
              default:
                state = 0;
            }
            offset++;
          }
          chunkBytesRead += chunk.byteLength;
          chunkIndex++;
        }
        if (state !== 4) {
          return void 0;
        }
        const buffer = this._read(chunkBytesRead + offset);
        const result = /* @__PURE__ */ new Map();
        const headers = this.toString(buffer, "ascii").split(CRLF);
        if (headers.length < 2) {
          return result;
        }
        for (let i = 0; i < headers.length - 2; i++) {
          const header = headers[i];
          const index2 = header.indexOf(":");
          if (index2 === -1) {
            throw new Error(`Message header must separate key and value using ':'
${header}`);
          }
          const key = header.substr(0, index2);
          const value = header.substr(index2 + 1).trim();
          result.set(lowerCaseKeys ? key.toLowerCase() : key, value);
        }
        return result;
      }
      tryReadBody(length) {
        if (this._totalLength < length) {
          return void 0;
        }
        return this._read(length);
      }
      get numberOfBytes() {
        return this._totalLength;
      }
      _read(byteCount) {
        if (byteCount === 0) {
          return this.emptyBuffer();
        }
        if (byteCount > this._totalLength) {
          throw new Error(`Cannot read so many bytes!`);
        }
        if (this._chunks[0].byteLength === byteCount) {
          const chunk = this._chunks[0];
          this._chunks.shift();
          this._totalLength -= byteCount;
          return this.asNative(chunk);
        }
        if (this._chunks[0].byteLength > byteCount) {
          const chunk = this._chunks[0];
          const result2 = this.asNative(chunk, byteCount);
          this._chunks[0] = chunk.slice(byteCount);
          this._totalLength -= byteCount;
          return result2;
        }
        const result = this.allocNative(byteCount);
        let resultOffset = 0;
        let chunkIndex = 0;
        while (byteCount > 0) {
          const chunk = this._chunks[chunkIndex];
          if (chunk.byteLength > byteCount) {
            const chunkPart = chunk.slice(0, byteCount);
            result.set(chunkPart, resultOffset);
            resultOffset += byteCount;
            this._chunks[chunkIndex] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            byteCount -= byteCount;
          } else {
            result.set(chunk, resultOffset);
            resultOffset += chunk.byteLength;
            this._chunks.shift();
            this._totalLength -= chunk.byteLength;
            byteCount -= chunk.byteLength;
          }
        }
        return result;
      }
    };
    exports2.AbstractMessageBuffer = AbstractMessageBuffer;
  }
});

// node_modules/vscode-jsonrpc/lib/common/connection.js
var require_connection = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/connection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createMessageConnection = exports2.ConnectionOptions = exports2.MessageStrategy = exports2.CancellationStrategy = exports2.CancellationSenderStrategy = exports2.CancellationReceiverStrategy = exports2.RequestCancellationReceiverStrategy = exports2.IdCancellationReceiverStrategy = exports2.ConnectionStrategy = exports2.ConnectionError = exports2.ConnectionErrors = exports2.LogTraceNotification = exports2.SetTraceNotification = exports2.TraceFormat = exports2.TraceValues = exports2.Trace = exports2.NullLogger = exports2.ProgressType = exports2.ProgressToken = void 0;
    var ral_1 = require_ral();
    var Is = require_is2();
    var messages_1 = require_messages();
    var linkedMap_1 = require_linkedMap();
    var events_1 = require_events();
    var cancellation_1 = require_cancellation();
    var CancelNotification;
    (function(CancelNotification2) {
      CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
    })(CancelNotification || (CancelNotification = {}));
    var ProgressToken;
    (function(ProgressToken2) {
      function is(value) {
        return typeof value === "string" || typeof value === "number";
      }
      ProgressToken2.is = is;
    })(ProgressToken || (exports2.ProgressToken = ProgressToken = {}));
    var ProgressNotification;
    (function(ProgressNotification2) {
      ProgressNotification2.type = new messages_1.NotificationType("$/progress");
    })(ProgressNotification || (ProgressNotification = {}));
    var ProgressType = class {
      constructor() {
      }
    };
    exports2.ProgressType = ProgressType;
    var StarRequestHandler;
    (function(StarRequestHandler2) {
      function is(value) {
        return Is.func(value);
      }
      StarRequestHandler2.is = is;
    })(StarRequestHandler || (StarRequestHandler = {}));
    exports2.NullLogger = Object.freeze({
      error: () => {
      },
      warn: () => {
      },
      info: () => {
      },
      log: () => {
      }
    });
    var Trace;
    (function(Trace2) {
      Trace2[Trace2["Off"] = 0] = "Off";
      Trace2[Trace2["Messages"] = 1] = "Messages";
      Trace2[Trace2["Compact"] = 2] = "Compact";
      Trace2[Trace2["Verbose"] = 3] = "Verbose";
    })(Trace || (exports2.Trace = Trace = {}));
    var TraceValues;
    (function(TraceValues2) {
      TraceValues2.Off = "off";
      TraceValues2.Messages = "messages";
      TraceValues2.Compact = "compact";
      TraceValues2.Verbose = "verbose";
    })(TraceValues || (exports2.TraceValues = TraceValues = {}));
    (function(Trace2) {
      function fromString(value) {
        if (!Is.string(value)) {
          return Trace2.Off;
        }
        value = value.toLowerCase();
        switch (value) {
          case "off":
            return Trace2.Off;
          case "messages":
            return Trace2.Messages;
          case "compact":
            return Trace2.Compact;
          case "verbose":
            return Trace2.Verbose;
          default:
            return Trace2.Off;
        }
      }
      Trace2.fromString = fromString;
      function toString(value) {
        switch (value) {
          case Trace2.Off:
            return "off";
          case Trace2.Messages:
            return "messages";
          case Trace2.Compact:
            return "compact";
          case Trace2.Verbose:
            return "verbose";
          default:
            return "off";
        }
      }
      Trace2.toString = toString;
    })(Trace || (exports2.Trace = Trace = {}));
    var TraceFormat;
    (function(TraceFormat2) {
      TraceFormat2["Text"] = "text";
      TraceFormat2["JSON"] = "json";
    })(TraceFormat || (exports2.TraceFormat = TraceFormat = {}));
    (function(TraceFormat2) {
      function fromString(value) {
        if (!Is.string(value)) {
          return TraceFormat2.Text;
        }
        value = value.toLowerCase();
        if (value === "json") {
          return TraceFormat2.JSON;
        } else {
          return TraceFormat2.Text;
        }
      }
      TraceFormat2.fromString = fromString;
    })(TraceFormat || (exports2.TraceFormat = TraceFormat = {}));
    var SetTraceNotification;
    (function(SetTraceNotification2) {
      SetTraceNotification2.type = new messages_1.NotificationType("$/setTrace");
    })(SetTraceNotification || (exports2.SetTraceNotification = SetTraceNotification = {}));
    var LogTraceNotification;
    (function(LogTraceNotification2) {
      LogTraceNotification2.type = new messages_1.NotificationType("$/logTrace");
    })(LogTraceNotification || (exports2.LogTraceNotification = LogTraceNotification = {}));
    var ConnectionErrors;
    (function(ConnectionErrors2) {
      ConnectionErrors2[ConnectionErrors2["Closed"] = 1] = "Closed";
      ConnectionErrors2[ConnectionErrors2["Disposed"] = 2] = "Disposed";
      ConnectionErrors2[ConnectionErrors2["AlreadyListening"] = 3] = "AlreadyListening";
    })(ConnectionErrors || (exports2.ConnectionErrors = ConnectionErrors = {}));
    var ConnectionError = class _ConnectionError extends Error {
      constructor(code, message) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, _ConnectionError.prototype);
      }
    };
    exports2.ConnectionError = ConnectionError;
    var ConnectionStrategy;
    (function(ConnectionStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.cancelUndispatched);
      }
      ConnectionStrategy2.is = is;
    })(ConnectionStrategy || (exports2.ConnectionStrategy = ConnectionStrategy = {}));
    var IdCancellationReceiverStrategy;
    (function(IdCancellationReceiverStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && (candidate.kind === void 0 || candidate.kind === "id") && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === void 0 || Is.func(candidate.dispose));
      }
      IdCancellationReceiverStrategy2.is = is;
    })(IdCancellationReceiverStrategy || (exports2.IdCancellationReceiverStrategy = IdCancellationReceiverStrategy = {}));
    var RequestCancellationReceiverStrategy;
    (function(RequestCancellationReceiverStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && candidate.kind === "request" && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === void 0 || Is.func(candidate.dispose));
      }
      RequestCancellationReceiverStrategy2.is = is;
    })(RequestCancellationReceiverStrategy || (exports2.RequestCancellationReceiverStrategy = RequestCancellationReceiverStrategy = {}));
    var CancellationReceiverStrategy;
    (function(CancellationReceiverStrategy2) {
      CancellationReceiverStrategy2.Message = Object.freeze({
        createCancellationTokenSource(_) {
          return new cancellation_1.CancellationTokenSource();
        }
      });
      function is(value) {
        return IdCancellationReceiverStrategy.is(value) || RequestCancellationReceiverStrategy.is(value);
      }
      CancellationReceiverStrategy2.is = is;
    })(CancellationReceiverStrategy || (exports2.CancellationReceiverStrategy = CancellationReceiverStrategy = {}));
    var CancellationSenderStrategy;
    (function(CancellationSenderStrategy2) {
      CancellationSenderStrategy2.Message = Object.freeze({
        sendCancellation(conn, id) {
          return conn.sendNotification(CancelNotification.type, { id });
        },
        cleanup(_) {
        }
      });
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
      }
      CancellationSenderStrategy2.is = is;
    })(CancellationSenderStrategy || (exports2.CancellationSenderStrategy = CancellationSenderStrategy = {}));
    var CancellationStrategy;
    (function(CancellationStrategy2) {
      CancellationStrategy2.Message = Object.freeze({
        receiver: CancellationReceiverStrategy.Message,
        sender: CancellationSenderStrategy.Message
      });
      function is(value) {
        const candidate = value;
        return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
      }
      CancellationStrategy2.is = is;
    })(CancellationStrategy || (exports2.CancellationStrategy = CancellationStrategy = {}));
    var MessageStrategy;
    (function(MessageStrategy2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.handleMessage);
      }
      MessageStrategy2.is = is;
    })(MessageStrategy || (exports2.MessageStrategy = MessageStrategy = {}));
    var ConnectionOptions;
    (function(ConnectionOptions2) {
      function is(value) {
        const candidate = value;
        return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy) || MessageStrategy.is(candidate.messageStrategy));
      }
      ConnectionOptions2.is = is;
    })(ConnectionOptions || (exports2.ConnectionOptions = ConnectionOptions = {}));
    var ConnectionState;
    (function(ConnectionState2) {
      ConnectionState2[ConnectionState2["New"] = 1] = "New";
      ConnectionState2[ConnectionState2["Listening"] = 2] = "Listening";
      ConnectionState2[ConnectionState2["Closed"] = 3] = "Closed";
      ConnectionState2[ConnectionState2["Disposed"] = 4] = "Disposed";
    })(ConnectionState || (ConnectionState = {}));
    function createMessageConnection(messageReader, messageWriter, _logger, options) {
      const logger = _logger !== void 0 ? _logger : exports2.NullLogger;
      let sequenceNumber = 0;
      let notificationSequenceNumber = 0;
      let unknownResponseSequenceNumber = 0;
      const version = "2.0";
      let starRequestHandler = void 0;
      const requestHandlers = /* @__PURE__ */ new Map();
      let starNotificationHandler = void 0;
      const notificationHandlers = /* @__PURE__ */ new Map();
      const progressHandlers = /* @__PURE__ */ new Map();
      let timer;
      let messageQueue = new linkedMap_1.LinkedMap();
      let responsePromises = /* @__PURE__ */ new Map();
      let knownCanceledRequests = /* @__PURE__ */ new Set();
      let requestTokens = /* @__PURE__ */ new Map();
      let trace = Trace.Off;
      let traceFormat = TraceFormat.Text;
      let tracer;
      let state = ConnectionState.New;
      const errorEmitter = new events_1.Emitter();
      const closeEmitter = new events_1.Emitter();
      const unhandledNotificationEmitter = new events_1.Emitter();
      const unhandledProgressEmitter = new events_1.Emitter();
      const disposeEmitter = new events_1.Emitter();
      const cancellationStrategy = options && options.cancellationStrategy ? options.cancellationStrategy : CancellationStrategy.Message;
      function createRequestQueueKey(id) {
        if (id === null) {
          throw new Error(`Can't send requests with id null since the response can't be correlated.`);
        }
        return "req-" + id.toString();
      }
      function createResponseQueueKey(id) {
        if (id === null) {
          return "res-unknown-" + (++unknownResponseSequenceNumber).toString();
        } else {
          return "res-" + id.toString();
        }
      }
      function createNotificationQueueKey() {
        return "not-" + (++notificationSequenceNumber).toString();
      }
      function addMessageToQueue(queue, message) {
        if (messages_1.Message.isRequest(message)) {
          queue.set(createRequestQueueKey(message.id), message);
        } else if (messages_1.Message.isResponse(message)) {
          queue.set(createResponseQueueKey(message.id), message);
        } else {
          queue.set(createNotificationQueueKey(), message);
        }
      }
      function cancelUndispatched(_message) {
        return void 0;
      }
      function isListening() {
        return state === ConnectionState.Listening;
      }
      function isClosed() {
        return state === ConnectionState.Closed;
      }
      function isDisposed() {
        return state === ConnectionState.Disposed;
      }
      function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
          state = ConnectionState.Closed;
          closeEmitter.fire(void 0);
        }
      }
      function readErrorHandler(error) {
        errorEmitter.fire([error, void 0, void 0]);
      }
      function writeErrorHandler(data) {
        errorEmitter.fire(data);
      }
      messageReader.onClose(closeHandler);
      messageReader.onError(readErrorHandler);
      messageWriter.onClose(closeHandler);
      messageWriter.onError(writeErrorHandler);
      function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
          return;
        }
        timer = (0, ral_1.default)().timer.setImmediate(() => {
          timer = void 0;
          processMessageQueue();
        });
      }
      function handleMessage(message) {
        if (messages_1.Message.isRequest(message)) {
          handleRequest(message);
        } else if (messages_1.Message.isNotification(message)) {
          handleNotification(message);
        } else if (messages_1.Message.isResponse(message)) {
          handleResponse(message);
        } else {
          handleInvalidMessage(message);
        }
      }
      function processMessageQueue() {
        if (messageQueue.size === 0) {
          return;
        }
        const message = messageQueue.shift();
        try {
          const messageStrategy = options?.messageStrategy;
          if (MessageStrategy.is(messageStrategy)) {
            messageStrategy.handleMessage(message, handleMessage);
          } else {
            handleMessage(message);
          }
        } finally {
          triggerMessageQueue();
        }
      }
      const callback = (message) => {
        try {
          if (messages_1.Message.isNotification(message) && message.method === CancelNotification.type.method) {
            const cancelId = message.params.id;
            const key = createRequestQueueKey(cancelId);
            const toCancel = messageQueue.get(key);
            if (messages_1.Message.isRequest(toCancel)) {
              const strategy = options?.connectionStrategy;
              const response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
              if (response && (response.error !== void 0 || response.result !== void 0)) {
                messageQueue.delete(key);
                requestTokens.delete(cancelId);
                response.id = toCancel.id;
                traceSendingResponse(response, message.method, Date.now());
                messageWriter.write(response).catch(() => logger.error(`Sending response for canceled message failed.`));
                return;
              }
            }
            const cancellationToken = requestTokens.get(cancelId);
            if (cancellationToken !== void 0) {
              cancellationToken.cancel();
              traceReceivedNotification(message);
              return;
            } else {
              knownCanceledRequests.add(cancelId);
            }
          }
          addMessageToQueue(messageQueue, message);
        } finally {
          triggerMessageQueue();
        }
      };
      function handleRequest(requestMessage) {
        if (isDisposed()) {
          return;
        }
        function reply(resultOrError, method, startTime2) {
          const message = {
            jsonrpc: version,
            id: requestMessage.id
          };
          if (resultOrError instanceof messages_1.ResponseError) {
            message.error = resultOrError.toJson();
          } else {
            message.result = resultOrError === void 0 ? null : resultOrError;
          }
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        function replyError(error, method, startTime2) {
          const message = {
            jsonrpc: version,
            id: requestMessage.id,
            error: error.toJson()
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        function replySuccess(result, method, startTime2) {
          if (result === void 0) {
            result = null;
          }
          const message = {
            jsonrpc: version,
            id: requestMessage.id,
            result
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        traceReceivedRequest(requestMessage);
        const element = requestHandlers.get(requestMessage.method);
        let type;
        let requestHandler;
        if (element) {
          type = element.type;
          requestHandler = element.handler;
        }
        const startTime = Date.now();
        if (requestHandler || starRequestHandler) {
          const tokenKey = requestMessage.id ?? String(Date.now());
          const cancellationSource = IdCancellationReceiverStrategy.is(cancellationStrategy.receiver) ? cancellationStrategy.receiver.createCancellationTokenSource(tokenKey) : cancellationStrategy.receiver.createCancellationTokenSource(requestMessage);
          if (requestMessage.id !== null && knownCanceledRequests.has(requestMessage.id)) {
            cancellationSource.cancel();
          }
          if (requestMessage.id !== null) {
            requestTokens.set(tokenKey, cancellationSource);
          }
          try {
            let handlerResult;
            if (requestHandler) {
              if (requestMessage.params === void 0) {
                if (type !== void 0 && type.numberOfParams !== 0) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but received none.`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(cancellationSource.token);
              } else if (Array.isArray(requestMessage.params)) {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byName) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
              } else {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                  return;
                }
                handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
              }
            } else if (starRequestHandler) {
              handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
            }
            const promise = handlerResult;
            if (!handlerResult) {
              requestTokens.delete(tokenKey);
              replySuccess(handlerResult, requestMessage.method, startTime);
            } else if (promise.then) {
              promise.then((resultOrError) => {
                requestTokens.delete(tokenKey);
                reply(resultOrError, requestMessage.method, startTime);
              }, (error) => {
                requestTokens.delete(tokenKey);
                if (error instanceof messages_1.ResponseError) {
                  replyError(error, requestMessage.method, startTime);
                } else if (error && Is.string(error.message)) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                } else {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                }
              });
            } else {
              requestTokens.delete(tokenKey);
              reply(handlerResult, requestMessage.method, startTime);
            }
          } catch (error) {
            requestTokens.delete(tokenKey);
            if (error instanceof messages_1.ResponseError) {
              reply(error, requestMessage.method, startTime);
            } else if (error && Is.string(error.message)) {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
            } else {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
            }
          }
        } else {
          replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
        }
      }
      function handleResponse(responseMessage) {
        if (isDisposed()) {
          return;
        }
        if (responseMessage.id === null) {
          if (responseMessage.error) {
            logger.error(`Received response message without id: Error is: 
${JSON.stringify(responseMessage.error, void 0, 4)}`);
          } else {
            logger.error(`Received response message without id. No further error information provided.`);
          }
        } else {
          const key = responseMessage.id;
          const responsePromise = responsePromises.get(key);
          traceReceivedResponse(responseMessage, responsePromise);
          if (responsePromise !== void 0) {
            responsePromises.delete(key);
            try {
              if (responseMessage.error) {
                const error = responseMessage.error;
                responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
              } else if (responseMessage.result !== void 0) {
                responsePromise.resolve(responseMessage.result);
              } else {
                throw new Error("Should never happen.");
              }
            } catch (error) {
              if (error.message) {
                logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
              } else {
                logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
              }
            }
          }
        }
      }
      function handleNotification(message) {
        if (isDisposed()) {
          return;
        }
        let type = void 0;
        let notificationHandler;
        if (message.method === CancelNotification.type.method) {
          const cancelId = message.params.id;
          knownCanceledRequests.delete(cancelId);
          traceReceivedNotification(message);
          return;
        } else {
          const element = notificationHandlers.get(message.method);
          if (element) {
            notificationHandler = element.handler;
            type = element.type;
          }
        }
        if (notificationHandler || starNotificationHandler) {
          try {
            traceReceivedNotification(message);
            if (notificationHandler) {
              if (message.params === void 0) {
                if (type !== void 0) {
                  if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName) {
                    logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received none.`);
                  }
                }
                notificationHandler();
              } else if (Array.isArray(message.params)) {
                const params = message.params;
                if (message.method === ProgressNotification.type.method && params.length === 2 && ProgressToken.is(params[0])) {
                  notificationHandler({ token: params[0], value: params[1] });
                } else {
                  if (type !== void 0) {
                    if (type.parameterStructures === messages_1.ParameterStructures.byName) {
                      logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                    }
                    if (type.numberOfParams !== message.params.length) {
                      logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${params.length} arguments`);
                    }
                  }
                  notificationHandler(...params);
                }
              } else {
                if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                  logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                }
                notificationHandler(message.params);
              }
            } else if (starNotificationHandler) {
              starNotificationHandler(message.method, message.params);
            }
          } catch (error) {
            if (error.message) {
              logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
            } else {
              logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
            }
          }
        } else {
          unhandledNotificationEmitter.fire(message);
        }
      }
      function handleInvalidMessage(message) {
        if (!message) {
          logger.error("Received empty message.");
          return;
        }
        logger.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(message, null, 4)}`);
        const responseMessage = message;
        if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
          const key = responseMessage.id;
          const responseHandler = responsePromises.get(key);
          if (responseHandler) {
            responseHandler.reject(new Error("The received response has neither a result nor an error property."));
          }
        }
      }
      function stringifyTrace(params) {
        if (params === void 0 || params === null) {
          return void 0;
        }
        switch (trace) {
          case Trace.Verbose:
            return JSON.stringify(params, null, 4);
          case Trace.Compact:
            return JSON.stringify(params);
          default:
            return void 0;
        }
      }
      function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
            data = `Params: ${stringifyTrace(message.params)}

`;
          }
          tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
        } else {
          logLSPMessage("send-request", message);
        }
      }
      function traceSendingNotification(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.params) {
              data = `Params: ${stringifyTrace(message.params)}

`;
            } else {
              data = "No parameters provided.\n\n";
            }
          }
          tracer.log(`Sending notification '${message.method}'.`, data);
        } else {
          logLSPMessage("send-notification", message);
        }
      }
      function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.error && message.error.data) {
              data = `Error data: ${stringifyTrace(message.error.data)}

`;
            } else {
              if (message.result) {
                data = `Result: ${stringifyTrace(message.result)}

`;
              } else if (message.error === void 0) {
                data = "No result returned.\n\n";
              }
            }
          }
          tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
        } else {
          logLSPMessage("send-response", message);
        }
      }
      function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
            data = `Params: ${stringifyTrace(message.params)}

`;
          }
          tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
        } else {
          logLSPMessage("receive-request", message);
        }
      }
      function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.params) {
              data = `Params: ${stringifyTrace(message.params)}

`;
            } else {
              data = "No parameters provided.\n\n";
            }
          }
          tracer.log(`Received notification '${message.method}'.`, data);
        } else {
          logLSPMessage("receive-notification", message);
        }
      }
      function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        if (traceFormat === TraceFormat.Text) {
          let data = void 0;
          if (trace === Trace.Verbose || trace === Trace.Compact) {
            if (message.error && message.error.data) {
              data = `Error data: ${stringifyTrace(message.error.data)}

`;
            } else {
              if (message.result) {
                data = `Result: ${stringifyTrace(message.result)}

`;
              } else if (message.error === void 0) {
                data = "No result returned.\n\n";
              }
            }
          }
          if (responsePromise) {
            const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : "";
            tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
          } else {
            tracer.log(`Received response ${message.id} without active response promise.`, data);
          }
        } else {
          logLSPMessage("receive-response", message);
        }
      }
      function logLSPMessage(type, message) {
        if (!tracer || trace === Trace.Off) {
          return;
        }
        const lspMessage = {
          isLSPMessage: true,
          type,
          message,
          timestamp: Date.now()
        };
        tracer.log(lspMessage);
      }
      function throwIfClosedOrDisposed() {
        if (isClosed()) {
          throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
        }
        if (isDisposed()) {
          throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
        }
      }
      function throwIfListening() {
        if (isListening()) {
          throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
        }
      }
      function throwIfNotListening() {
        if (!isListening()) {
          throw new Error("Call listen() first.");
        }
      }
      function undefinedToNull(param) {
        if (param === void 0) {
          return null;
        } else {
          return param;
        }
      }
      function nullToUndefined(param) {
        if (param === null) {
          return void 0;
        } else {
          return param;
        }
      }
      function isNamedParam(param) {
        return param !== void 0 && param !== null && !Array.isArray(param) && typeof param === "object";
      }
      function computeSingleParam(parameterStructures, param) {
        switch (parameterStructures) {
          case messages_1.ParameterStructures.auto:
            if (isNamedParam(param)) {
              return nullToUndefined(param);
            } else {
              return [undefinedToNull(param)];
            }
          case messages_1.ParameterStructures.byName:
            if (!isNamedParam(param)) {
              throw new Error(`Received parameters by name but param is not an object literal.`);
            }
            return nullToUndefined(param);
          case messages_1.ParameterStructures.byPosition:
            return [undefinedToNull(param)];
          default:
            throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
        }
      }
      function computeMessageParams(type, params) {
        let result;
        const numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
          case 0:
            result = void 0;
            break;
          case 1:
            result = computeSingleParam(type.parameterStructures, params[0]);
            break;
          default:
            result = [];
            for (let i = 0; i < params.length && i < numberOfParams; i++) {
              result.push(undefinedToNull(params[i]));
            }
            if (params.length < numberOfParams) {
              for (let i = params.length; i < numberOfParams; i++) {
                result.push(null);
              }
            }
            break;
        }
        return result;
      }
      const connection2 = {
        sendNotification: (type, ...args) => {
          throwIfClosedOrDisposed();
          let method;
          let messageParams;
          if (Is.string(type)) {
            method = type;
            const first = args[0];
            let paramStart = 0;
            let parameterStructures = messages_1.ParameterStructures.auto;
            if (messages_1.ParameterStructures.is(first)) {
              paramStart = 1;
              parameterStructures = first;
            }
            let paramEnd = args.length;
            const numberOfParams = paramEnd - paramStart;
            switch (numberOfParams) {
              case 0:
                messageParams = void 0;
                break;
              case 1:
                messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                break;
              default:
                if (parameterStructures === messages_1.ParameterStructures.byName) {
                  throw new Error(`Received ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                }
                messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                break;
            }
          } else {
            const params = args;
            method = type.method;
            messageParams = computeMessageParams(type, params);
          }
          const notificationMessage = {
            jsonrpc: version,
            method,
            params: messageParams
          };
          traceSendingNotification(notificationMessage);
          return messageWriter.write(notificationMessage).catch((error) => {
            logger.error(`Sending notification failed.`);
            throw error;
          });
        },
        onNotification: (type, handler) => {
          throwIfClosedOrDisposed();
          let method;
          if (Is.func(type)) {
            starNotificationHandler = type;
          } else if (handler) {
            if (Is.string(type)) {
              method = type;
              notificationHandlers.set(type, { type: void 0, handler });
            } else {
              method = type.method;
              notificationHandlers.set(type.method, { type, handler });
            }
          }
          return {
            dispose: () => {
              if (method !== void 0) {
                notificationHandlers.delete(method);
              } else {
                starNotificationHandler = void 0;
              }
            }
          };
        },
        onProgress: (_type, token, handler) => {
          if (progressHandlers.has(token)) {
            throw new Error(`Progress handler for token ${token} already registered`);
          }
          progressHandlers.set(token, handler);
          return {
            dispose: () => {
              progressHandlers.delete(token);
            }
          };
        },
        sendProgress: (_type, token, value) => {
          return connection2.sendNotification(ProgressNotification.type, { token, value });
        },
        onUnhandledProgress: unhandledProgressEmitter.event,
        sendRequest: (type, ...args) => {
          throwIfClosedOrDisposed();
          throwIfNotListening();
          let method;
          let messageParams;
          let token = void 0;
          if (Is.string(type)) {
            method = type;
            const first = args[0];
            const last = args[args.length - 1];
            let paramStart = 0;
            let parameterStructures = messages_1.ParameterStructures.auto;
            if (messages_1.ParameterStructures.is(first)) {
              paramStart = 1;
              parameterStructures = first;
            }
            let paramEnd = args.length;
            if (cancellation_1.CancellationToken.is(last)) {
              paramEnd = paramEnd - 1;
              token = last;
            }
            const numberOfParams = paramEnd - paramStart;
            switch (numberOfParams) {
              case 0:
                messageParams = void 0;
                break;
              case 1:
                messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                break;
              default:
                if (parameterStructures === messages_1.ParameterStructures.byName) {
                  throw new Error(`Received ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                }
                messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                break;
            }
          } else {
            const params = args;
            method = type.method;
            messageParams = computeMessageParams(type, params);
            const numberOfParams = type.numberOfParams;
            token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
          }
          const id = sequenceNumber++;
          let disposable;
          if (token) {
            disposable = token.onCancellationRequested(() => {
              const p = cancellationStrategy.sender.sendCancellation(connection2, id);
              if (p === void 0) {
                logger.log(`Received no promise from cancellation strategy when cancelling id ${id}`);
                return Promise.resolve();
              } else {
                return p.catch(() => {
                  logger.log(`Sending cancellation messages for id ${id} failed`);
                });
              }
            });
          }
          const requestMessage = {
            jsonrpc: version,
            id,
            method,
            params: messageParams
          };
          traceSendingRequest(requestMessage);
          if (typeof cancellationStrategy.sender.enableCancellation === "function") {
            cancellationStrategy.sender.enableCancellation(requestMessage);
          }
          return new Promise(async (resolve, reject) => {
            const resolveWithCleanup = (r) => {
              resolve(r);
              cancellationStrategy.sender.cleanup(id);
              disposable?.dispose();
            };
            const rejectWithCleanup = (r) => {
              reject(r);
              cancellationStrategy.sender.cleanup(id);
              disposable?.dispose();
            };
            const responsePromise = { method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
            try {
              await messageWriter.write(requestMessage);
              responsePromises.set(id, responsePromise);
            } catch (error) {
              logger.error(`Sending request failed.`);
              responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, error.message ? error.message : "Unknown reason"));
              throw error;
            }
          });
        },
        onRequest: (type, handler) => {
          throwIfClosedOrDisposed();
          let method = null;
          if (StarRequestHandler.is(type)) {
            method = void 0;
            starRequestHandler = type;
          } else if (Is.string(type)) {
            method = null;
            if (handler !== void 0) {
              method = type;
              requestHandlers.set(type, { handler, type: void 0 });
            }
          } else {
            if (handler !== void 0) {
              method = type.method;
              requestHandlers.set(type.method, { type, handler });
            }
          }
          return {
            dispose: () => {
              if (method === null) {
                return;
              }
              if (method !== void 0) {
                requestHandlers.delete(method);
              } else {
                starRequestHandler = void 0;
              }
            }
          };
        },
        hasPendingResponse: () => {
          return responsePromises.size > 0;
        },
        trace: async (_value, _tracer, sendNotificationOrTraceOptions) => {
          let _sendNotification = false;
          let _traceFormat = TraceFormat.Text;
          if (sendNotificationOrTraceOptions !== void 0) {
            if (Is.boolean(sendNotificationOrTraceOptions)) {
              _sendNotification = sendNotificationOrTraceOptions;
            } else {
              _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
              _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
            }
          }
          trace = _value;
          traceFormat = _traceFormat;
          if (trace === Trace.Off) {
            tracer = void 0;
          } else {
            tracer = _tracer;
          }
          if (_sendNotification && !isClosed() && !isDisposed()) {
            await connection2.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
          }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        end: () => {
          messageWriter.end();
        },
        dispose: () => {
          if (isDisposed()) {
            return;
          }
          state = ConnectionState.Disposed;
          disposeEmitter.fire(void 0);
          const error = new messages_1.ResponseError(messages_1.ErrorCodes.PendingResponseRejected, "Pending response rejected since connection got disposed");
          for (const promise of responsePromises.values()) {
            promise.reject(error);
          }
          responsePromises = /* @__PURE__ */ new Map();
          requestTokens = /* @__PURE__ */ new Map();
          knownCanceledRequests = /* @__PURE__ */ new Set();
          messageQueue = new linkedMap_1.LinkedMap();
          if (Is.func(messageWriter.dispose)) {
            messageWriter.dispose();
          }
          if (Is.func(messageReader.dispose)) {
            messageReader.dispose();
          }
        },
        listen: () => {
          throwIfClosedOrDisposed();
          throwIfListening();
          state = ConnectionState.Listening;
          messageReader.listen(callback);
        },
        inspect: () => {
          (0, ral_1.default)().console.log("inspect");
        }
      };
      connection2.onNotification(LogTraceNotification.type, (params) => {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        const verbose = trace === Trace.Verbose || trace === Trace.Compact;
        tracer.log(params.message, verbose ? params.verbose : void 0);
      });
      connection2.onNotification(ProgressNotification.type, (params) => {
        const handler = progressHandlers.get(params.token);
        if (handler) {
          handler(params.value);
        } else {
          unhandledProgressEmitter.fire(params);
        }
      });
      return connection2;
    }
    exports2.createMessageConnection = createMessageConnection;
  }
});

// node_modules/vscode-jsonrpc/lib/common/api.js
var require_api = __commonJS({
  "node_modules/vscode-jsonrpc/lib/common/api.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProgressType = exports2.ProgressToken = exports2.createMessageConnection = exports2.NullLogger = exports2.ConnectionOptions = exports2.ConnectionStrategy = exports2.AbstractMessageBuffer = exports2.WriteableStreamMessageWriter = exports2.AbstractMessageWriter = exports2.MessageWriter = exports2.ReadableStreamMessageReader = exports2.AbstractMessageReader = exports2.MessageReader = exports2.SharedArrayReceiverStrategy = exports2.SharedArraySenderStrategy = exports2.CancellationToken = exports2.CancellationTokenSource = exports2.Emitter = exports2.Event = exports2.Disposable = exports2.LRUCache = exports2.Touch = exports2.LinkedMap = exports2.ParameterStructures = exports2.NotificationType9 = exports2.NotificationType8 = exports2.NotificationType7 = exports2.NotificationType6 = exports2.NotificationType5 = exports2.NotificationType4 = exports2.NotificationType3 = exports2.NotificationType2 = exports2.NotificationType1 = exports2.NotificationType0 = exports2.NotificationType = exports2.ErrorCodes = exports2.ResponseError = exports2.RequestType9 = exports2.RequestType8 = exports2.RequestType7 = exports2.RequestType6 = exports2.RequestType5 = exports2.RequestType4 = exports2.RequestType3 = exports2.RequestType2 = exports2.RequestType1 = exports2.RequestType0 = exports2.RequestType = exports2.Message = exports2.RAL = void 0;
    exports2.MessageStrategy = exports2.CancellationStrategy = exports2.CancellationSenderStrategy = exports2.CancellationReceiverStrategy = exports2.ConnectionError = exports2.ConnectionErrors = exports2.LogTraceNotification = exports2.SetTraceNotification = exports2.TraceFormat = exports2.TraceValues = exports2.Trace = void 0;
    var messages_1 = require_messages();
    Object.defineProperty(exports2, "Message", { enumerable: true, get: function() {
      return messages_1.Message;
    } });
    Object.defineProperty(exports2, "RequestType", { enumerable: true, get: function() {
      return messages_1.RequestType;
    } });
    Object.defineProperty(exports2, "RequestType0", { enumerable: true, get: function() {
      return messages_1.RequestType0;
    } });
    Object.defineProperty(exports2, "RequestType1", { enumerable: true, get: function() {
      return messages_1.RequestType1;
    } });
    Object.defineProperty(exports2, "RequestType2", { enumerable: true, get: function() {
      return messages_1.RequestType2;
    } });
    Object.defineProperty(exports2, "RequestType3", { enumerable: true, get: function() {
      return messages_1.RequestType3;
    } });
    Object.defineProperty(exports2, "RequestType4", { enumerable: true, get: function() {
      return messages_1.RequestType4;
    } });
    Object.defineProperty(exports2, "RequestType5", { enumerable: true, get: function() {
      return messages_1.RequestType5;
    } });
    Object.defineProperty(exports2, "RequestType6", { enumerable: true, get: function() {
      return messages_1.RequestType6;
    } });
    Object.defineProperty(exports2, "RequestType7", { enumerable: true, get: function() {
      return messages_1.RequestType7;
    } });
    Object.defineProperty(exports2, "RequestType8", { enumerable: true, get: function() {
      return messages_1.RequestType8;
    } });
    Object.defineProperty(exports2, "RequestType9", { enumerable: true, get: function() {
      return messages_1.RequestType9;
    } });
    Object.defineProperty(exports2, "ResponseError", { enumerable: true, get: function() {
      return messages_1.ResponseError;
    } });
    Object.defineProperty(exports2, "ErrorCodes", { enumerable: true, get: function() {
      return messages_1.ErrorCodes;
    } });
    Object.defineProperty(exports2, "NotificationType", { enumerable: true, get: function() {
      return messages_1.NotificationType;
    } });
    Object.defineProperty(exports2, "NotificationType0", { enumerable: true, get: function() {
      return messages_1.NotificationType0;
    } });
    Object.defineProperty(exports2, "NotificationType1", { enumerable: true, get: function() {
      return messages_1.NotificationType1;
    } });
    Object.defineProperty(exports2, "NotificationType2", { enumerable: true, get: function() {
      return messages_1.NotificationType2;
    } });
    Object.defineProperty(exports2, "NotificationType3", { enumerable: true, get: function() {
      return messages_1.NotificationType3;
    } });
    Object.defineProperty(exports2, "NotificationType4", { enumerable: true, get: function() {
      return messages_1.NotificationType4;
    } });
    Object.defineProperty(exports2, "NotificationType5", { enumerable: true, get: function() {
      return messages_1.NotificationType5;
    } });
    Object.defineProperty(exports2, "NotificationType6", { enumerable: true, get: function() {
      return messages_1.NotificationType6;
    } });
    Object.defineProperty(exports2, "NotificationType7", { enumerable: true, get: function() {
      return messages_1.NotificationType7;
    } });
    Object.defineProperty(exports2, "NotificationType8", { enumerable: true, get: function() {
      return messages_1.NotificationType8;
    } });
    Object.defineProperty(exports2, "NotificationType9", { enumerable: true, get: function() {
      return messages_1.NotificationType9;
    } });
    Object.defineProperty(exports2, "ParameterStructures", { enumerable: true, get: function() {
      return messages_1.ParameterStructures;
    } });
    var linkedMap_1 = require_linkedMap();
    Object.defineProperty(exports2, "LinkedMap", { enumerable: true, get: function() {
      return linkedMap_1.LinkedMap;
    } });
    Object.defineProperty(exports2, "LRUCache", { enumerable: true, get: function() {
      return linkedMap_1.LRUCache;
    } });
    Object.defineProperty(exports2, "Touch", { enumerable: true, get: function() {
      return linkedMap_1.Touch;
    } });
    var disposable_1 = require_disposable();
    Object.defineProperty(exports2, "Disposable", { enumerable: true, get: function() {
      return disposable_1.Disposable;
    } });
    var events_1 = require_events();
    Object.defineProperty(exports2, "Event", { enumerable: true, get: function() {
      return events_1.Event;
    } });
    Object.defineProperty(exports2, "Emitter", { enumerable: true, get: function() {
      return events_1.Emitter;
    } });
    var cancellation_1 = require_cancellation();
    Object.defineProperty(exports2, "CancellationTokenSource", { enumerable: true, get: function() {
      return cancellation_1.CancellationTokenSource;
    } });
    Object.defineProperty(exports2, "CancellationToken", { enumerable: true, get: function() {
      return cancellation_1.CancellationToken;
    } });
    var sharedArrayCancellation_1 = require_sharedArrayCancellation();
    Object.defineProperty(exports2, "SharedArraySenderStrategy", { enumerable: true, get: function() {
      return sharedArrayCancellation_1.SharedArraySenderStrategy;
    } });
    Object.defineProperty(exports2, "SharedArrayReceiverStrategy", { enumerable: true, get: function() {
      return sharedArrayCancellation_1.SharedArrayReceiverStrategy;
    } });
    var messageReader_1 = require_messageReader();
    Object.defineProperty(exports2, "MessageReader", { enumerable: true, get: function() {
      return messageReader_1.MessageReader;
    } });
    Object.defineProperty(exports2, "AbstractMessageReader", { enumerable: true, get: function() {
      return messageReader_1.AbstractMessageReader;
    } });
    Object.defineProperty(exports2, "ReadableStreamMessageReader", { enumerable: true, get: function() {
      return messageReader_1.ReadableStreamMessageReader;
    } });
    var messageWriter_1 = require_messageWriter();
    Object.defineProperty(exports2, "MessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.MessageWriter;
    } });
    Object.defineProperty(exports2, "AbstractMessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.AbstractMessageWriter;
    } });
    Object.defineProperty(exports2, "WriteableStreamMessageWriter", { enumerable: true, get: function() {
      return messageWriter_1.WriteableStreamMessageWriter;
    } });
    var messageBuffer_1 = require_messageBuffer();
    Object.defineProperty(exports2, "AbstractMessageBuffer", { enumerable: true, get: function() {
      return messageBuffer_1.AbstractMessageBuffer;
    } });
    var connection_1 = require_connection();
    Object.defineProperty(exports2, "ConnectionStrategy", { enumerable: true, get: function() {
      return connection_1.ConnectionStrategy;
    } });
    Object.defineProperty(exports2, "ConnectionOptions", { enumerable: true, get: function() {
      return connection_1.ConnectionOptions;
    } });
    Object.defineProperty(exports2, "NullLogger", { enumerable: true, get: function() {
      return connection_1.NullLogger;
    } });
    Object.defineProperty(exports2, "createMessageConnection", { enumerable: true, get: function() {
      return connection_1.createMessageConnection;
    } });
    Object.defineProperty(exports2, "ProgressToken", { enumerable: true, get: function() {
      return connection_1.ProgressToken;
    } });
    Object.defineProperty(exports2, "ProgressType", { enumerable: true, get: function() {
      return connection_1.ProgressType;
    } });
    Object.defineProperty(exports2, "Trace", { enumerable: true, get: function() {
      return connection_1.Trace;
    } });
    Object.defineProperty(exports2, "TraceValues", { enumerable: true, get: function() {
      return connection_1.TraceValues;
    } });
    Object.defineProperty(exports2, "TraceFormat", { enumerable: true, get: function() {
      return connection_1.TraceFormat;
    } });
    Object.defineProperty(exports2, "SetTraceNotification", { enumerable: true, get: function() {
      return connection_1.SetTraceNotification;
    } });
    Object.defineProperty(exports2, "LogTraceNotification", { enumerable: true, get: function() {
      return connection_1.LogTraceNotification;
    } });
    Object.defineProperty(exports2, "ConnectionErrors", { enumerable: true, get: function() {
      return connection_1.ConnectionErrors;
    } });
    Object.defineProperty(exports2, "ConnectionError", { enumerable: true, get: function() {
      return connection_1.ConnectionError;
    } });
    Object.defineProperty(exports2, "CancellationReceiverStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationReceiverStrategy;
    } });
    Object.defineProperty(exports2, "CancellationSenderStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationSenderStrategy;
    } });
    Object.defineProperty(exports2, "CancellationStrategy", { enumerable: true, get: function() {
      return connection_1.CancellationStrategy;
    } });
    Object.defineProperty(exports2, "MessageStrategy", { enumerable: true, get: function() {
      return connection_1.MessageStrategy;
    } });
    var ral_1 = require_ral();
    exports2.RAL = ral_1.default;
  }
});

// node_modules/vscode-jsonrpc/lib/node/ril.js
var require_ril = __commonJS({
  "node_modules/vscode-jsonrpc/lib/node/ril.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var util_1 = require("util");
    var api_1 = require_api();
    var MessageBuffer = class _MessageBuffer extends api_1.AbstractMessageBuffer {
      constructor(encoding = "utf-8") {
        super(encoding);
      }
      emptyBuffer() {
        return _MessageBuffer.emptyBuffer;
      }
      fromString(value, encoding) {
        return Buffer.from(value, encoding);
      }
      toString(value, encoding) {
        if (value instanceof Buffer) {
          return value.toString(encoding);
        } else {
          return new util_1.TextDecoder(encoding).decode(value);
        }
      }
      asNative(buffer, length) {
        if (length === void 0) {
          return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        } else {
          return buffer instanceof Buffer ? buffer.slice(0, length) : Buffer.from(buffer, 0, length);
        }
      }
      allocNative(length) {
        return Buffer.allocUnsafe(length);
      }
    };
    MessageBuffer.emptyBuffer = Buffer.allocUnsafe(0);
    var ReadableStreamWrapper = class {
      constructor(stream) {
        this.stream = stream;
      }
      onClose(listener) {
        this.stream.on("close", listener);
        return api_1.Disposable.create(() => this.stream.off("close", listener));
      }
      onError(listener) {
        this.stream.on("error", listener);
        return api_1.Disposable.create(() => this.stream.off("error", listener));
      }
      onEnd(listener) {
        this.stream.on("end", listener);
        return api_1.Disposable.create(() => this.stream.off("end", listener));
      }
      onData(listener) {
        this.stream.on("data", listener);
        return api_1.Disposable.create(() => this.stream.off("data", listener));
      }
    };
    var WritableStreamWrapper = class {
      constructor(stream) {
        this.stream = stream;
      }
      onClose(listener) {
        this.stream.on("close", listener);
        return api_1.Disposable.create(() => this.stream.off("close", listener));
      }
      onError(listener) {
        this.stream.on("error", listener);
        return api_1.Disposable.create(() => this.stream.off("error", listener));
      }
      onEnd(listener) {
        this.stream.on("end", listener);
        return api_1.Disposable.create(() => this.stream.off("end", listener));
      }
      write(data, encoding) {
        return new Promise((resolve, reject) => {
          const callback = (error) => {
            if (error === void 0 || error === null) {
              resolve();
            } else {
              reject(error);
            }
          };
          if (typeof data === "string") {
            this.stream.write(data, encoding, callback);
          } else {
            this.stream.write(data, callback);
          }
        });
      }
      end() {
        this.stream.end();
      }
    };
    var _ril = Object.freeze({
      messageBuffer: Object.freeze({
        create: (encoding) => new MessageBuffer(encoding)
      }),
      applicationJson: Object.freeze({
        encoder: Object.freeze({
          name: "application/json",
          encode: (msg, options) => {
            try {
              return Promise.resolve(Buffer.from(JSON.stringify(msg, void 0, 0), options.charset));
            } catch (err) {
              return Promise.reject(err);
            }
          }
        }),
        decoder: Object.freeze({
          name: "application/json",
          decode: (buffer, options) => {
            try {
              if (buffer instanceof Buffer) {
                return Promise.resolve(JSON.parse(buffer.toString(options.charset)));
              } else {
                return Promise.resolve(JSON.parse(new util_1.TextDecoder(options.charset).decode(buffer)));
              }
            } catch (err) {
              return Promise.reject(err);
            }
          }
        })
      }),
      stream: Object.freeze({
        asReadableStream: (stream) => new ReadableStreamWrapper(stream),
        asWritableStream: (stream) => new WritableStreamWrapper(stream)
      }),
      console,
      timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
          const handle = setTimeout(callback, ms, ...args);
          return { dispose: () => clearTimeout(handle) };
        },
        setImmediate(callback, ...args) {
          const handle = setImmediate(callback, ...args);
          return { dispose: () => clearImmediate(handle) };
        },
        setInterval(callback, ms, ...args) {
          const handle = setInterval(callback, ms, ...args);
          return { dispose: () => clearInterval(handle) };
        }
      })
    });
    function RIL() {
      return _ril;
    }
    (function(RIL2) {
      function install() {
        api_1.RAL.install(_ril);
      }
      RIL2.install = install;
    })(RIL || (RIL = {}));
    exports2.default = RIL;
  }
});

// node_modules/vscode-jsonrpc/lib/node/main.js
var require_main = __commonJS({
  "node_modules/vscode-jsonrpc/lib/node/main.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createMessageConnection = exports2.createServerSocketTransport = exports2.createClientSocketTransport = exports2.createServerPipeTransport = exports2.createClientPipeTransport = exports2.generateRandomPipeName = exports2.StreamMessageWriter = exports2.StreamMessageReader = exports2.SocketMessageWriter = exports2.SocketMessageReader = exports2.PortMessageWriter = exports2.PortMessageReader = exports2.IPCMessageWriter = exports2.IPCMessageReader = void 0;
    var ril_1 = require_ril();
    ril_1.default.install();
    var path8 = require("path");
    var os2 = require("os");
    var crypto_1 = require("crypto");
    var net_1 = require("net");
    var api_1 = require_api();
    __exportStar(require_api(), exports2);
    var IPCMessageReader = class extends api_1.AbstractMessageReader {
      constructor(process2) {
        super();
        this.process = process2;
        let eventEmitter = this.process;
        eventEmitter.on("error", (error) => this.fireError(error));
        eventEmitter.on("close", () => this.fireClose());
      }
      listen(callback) {
        this.process.on("message", callback);
        return api_1.Disposable.create(() => this.process.off("message", callback));
      }
    };
    exports2.IPCMessageReader = IPCMessageReader;
    var IPCMessageWriter = class extends api_1.AbstractMessageWriter {
      constructor(process2) {
        super();
        this.process = process2;
        this.errorCount = 0;
        const eventEmitter = this.process;
        eventEmitter.on("error", (error) => this.fireError(error));
        eventEmitter.on("close", () => this.fireClose);
      }
      write(msg) {
        try {
          if (typeof this.process.send === "function") {
            this.process.send(msg, void 0, void 0, (error) => {
              if (error) {
                this.errorCount++;
                this.handleError(error, msg);
              } else {
                this.errorCount = 0;
              }
            });
          }
          return Promise.resolve();
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
      }
    };
    exports2.IPCMessageWriter = IPCMessageWriter;
    var PortMessageReader = class extends api_1.AbstractMessageReader {
      constructor(port) {
        super();
        this.onData = new api_1.Emitter();
        port.on("close", () => this.fireClose);
        port.on("error", (error) => this.fireError(error));
        port.on("message", (message) => {
          this.onData.fire(message);
        });
      }
      listen(callback) {
        return this.onData.event(callback);
      }
    };
    exports2.PortMessageReader = PortMessageReader;
    var PortMessageWriter = class extends api_1.AbstractMessageWriter {
      constructor(port) {
        super();
        this.port = port;
        this.errorCount = 0;
        port.on("close", () => this.fireClose());
        port.on("error", (error) => this.fireError(error));
      }
      write(msg) {
        try {
          this.port.postMessage(msg);
          return Promise.resolve();
        } catch (error) {
          this.handleError(error, msg);
          return Promise.reject(error);
        }
      }
      handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
      }
      end() {
      }
    };
    exports2.PortMessageWriter = PortMessageWriter;
    var SocketMessageReader = class extends api_1.ReadableStreamMessageReader {
      constructor(socket, encoding = "utf-8") {
        super((0, ril_1.default)().stream.asReadableStream(socket), encoding);
      }
    };
    exports2.SocketMessageReader = SocketMessageReader;
    var SocketMessageWriter = class extends api_1.WriteableStreamMessageWriter {
      constructor(socket, options) {
        super((0, ril_1.default)().stream.asWritableStream(socket), options);
        this.socket = socket;
      }
      dispose() {
        super.dispose();
        this.socket.destroy();
      }
    };
    exports2.SocketMessageWriter = SocketMessageWriter;
    var StreamMessageReader = class extends api_1.ReadableStreamMessageReader {
      constructor(readable, encoding) {
        super((0, ril_1.default)().stream.asReadableStream(readable), encoding);
      }
    };
    exports2.StreamMessageReader = StreamMessageReader;
    var StreamMessageWriter = class extends api_1.WriteableStreamMessageWriter {
      constructor(writable, options) {
        super((0, ril_1.default)().stream.asWritableStream(writable), options);
      }
    };
    exports2.StreamMessageWriter = StreamMessageWriter;
    var XDG_RUNTIME_DIR = process.env["XDG_RUNTIME_DIR"];
    var safeIpcPathLengths = /* @__PURE__ */ new Map([
      ["linux", 107],
      ["darwin", 103]
    ]);
    function generateRandomPipeName() {
      const randomSuffix = (0, crypto_1.randomBytes)(21).toString("hex");
      if (process.platform === "win32") {
        return `\\\\.\\pipe\\vscode-jsonrpc-${randomSuffix}-sock`;
      }
      let result;
      if (XDG_RUNTIME_DIR) {
        result = path8.join(XDG_RUNTIME_DIR, `vscode-ipc-${randomSuffix}.sock`);
      } else {
        result = path8.join(os2.tmpdir(), `vscode-${randomSuffix}.sock`);
      }
      const limit = safeIpcPathLengths.get(process.platform);
      if (limit !== void 0 && result.length > limit) {
        (0, ril_1.default)().console.warn(`WARNING: IPC handle "${result}" is longer than ${limit} characters.`);
      }
      return result;
    }
    exports2.generateRandomPipeName = generateRandomPipeName;
    function createClientPipeTransport(pipeName, encoding = "utf-8") {
      let connectResolve;
      const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
      });
      return new Promise((resolve, reject) => {
        let server = (0, net_1.createServer)((socket) => {
          server.close();
          connectResolve([
            new SocketMessageReader(socket, encoding),
            new SocketMessageWriter(socket, encoding)
          ]);
        });
        server.on("error", reject);
        server.listen(pipeName, () => {
          server.removeListener("error", reject);
          resolve({
            onConnected: () => {
              return connected;
            }
          });
        });
      });
    }
    exports2.createClientPipeTransport = createClientPipeTransport;
    function createServerPipeTransport(pipeName, encoding = "utf-8") {
      const socket = (0, net_1.createConnection)(pipeName);
      return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
      ];
    }
    exports2.createServerPipeTransport = createServerPipeTransport;
    function createClientSocketTransport(port, encoding = "utf-8") {
      let connectResolve;
      const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
      });
      return new Promise((resolve, reject) => {
        const server = (0, net_1.createServer)((socket) => {
          server.close();
          connectResolve([
            new SocketMessageReader(socket, encoding),
            new SocketMessageWriter(socket, encoding)
          ]);
        });
        server.on("error", reject);
        server.listen(port, "127.0.0.1", () => {
          server.removeListener("error", reject);
          resolve({
            onConnected: () => {
              return connected;
            }
          });
        });
      });
    }
    exports2.createClientSocketTransport = createClientSocketTransport;
    function createServerSocketTransport(port, encoding = "utf-8") {
      const socket = (0, net_1.createConnection)(port, "127.0.0.1");
      return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
      ];
    }
    exports2.createServerSocketTransport = createServerSocketTransport;
    function isReadableStream(value) {
      const candidate = value;
      return candidate.read !== void 0 && candidate.addListener !== void 0;
    }
    function isWritableStream(value) {
      const candidate = value;
      return candidate.write !== void 0 && candidate.addListener !== void 0;
    }
    function createMessageConnection(input, output, logger, options) {
      if (!logger) {
        logger = api_1.NullLogger;
      }
      const reader = isReadableStream(input) ? new StreamMessageReader(input) : input;
      const writer = isWritableStream(output) ? new StreamMessageWriter(output) : output;
      if (api_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
      }
      return (0, api_1.createMessageConnection)(reader, writer, logger, options);
    }
    exports2.createMessageConnection = createMessageConnection;
  }
});

// node_modules/vscode-jsonrpc/node.js
var require_node = __commonJS({
  "node_modules/vscode-jsonrpc/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require_main();
  }
});

// node_modules/vscode-languageserver-types/lib/umd/main.js
var require_main2 = __commonJS({
  "node_modules/vscode-languageserver-types/lib/umd/main.js"(exports2, module2) {
    (function(factory) {
      if (typeof module2 === "object" && typeof module2.exports === "object") {
        var v = factory(require, exports2);
        if (v !== void 0) module2.exports = v;
      } else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
      }
    })(function(require2, exports3) {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      exports3.TextDocument = exports3.EOL = exports3.WorkspaceFolder = exports3.InlineCompletionContext = exports3.SelectedCompletionInfo = exports3.InlineCompletionTriggerKind = exports3.InlineCompletionList = exports3.InlineCompletionItem = exports3.StringValue = exports3.InlayHint = exports3.InlayHintLabelPart = exports3.InlayHintKind = exports3.InlineValueContext = exports3.InlineValueEvaluatableExpression = exports3.InlineValueVariableLookup = exports3.InlineValueText = exports3.SemanticTokens = exports3.SemanticTokenModifiers = exports3.SemanticTokenTypes = exports3.SelectionRange = exports3.DocumentLink = exports3.FormattingOptions = exports3.CodeLens = exports3.CodeAction = exports3.CodeActionContext = exports3.CodeActionTriggerKind = exports3.CodeActionKind = exports3.DocumentSymbol = exports3.WorkspaceSymbol = exports3.SymbolInformation = exports3.SymbolTag = exports3.SymbolKind = exports3.DocumentHighlight = exports3.DocumentHighlightKind = exports3.SignatureInformation = exports3.ParameterInformation = exports3.Hover = exports3.MarkedString = exports3.CompletionList = exports3.CompletionItem = exports3.CompletionItemLabelDetails = exports3.InsertTextMode = exports3.InsertReplaceEdit = exports3.CompletionItemTag = exports3.InsertTextFormat = exports3.CompletionItemKind = exports3.MarkupContent = exports3.MarkupKind = exports3.TextDocumentItem = exports3.OptionalVersionedTextDocumentIdentifier = exports3.VersionedTextDocumentIdentifier = exports3.TextDocumentIdentifier = exports3.WorkspaceChange = exports3.WorkspaceEdit = exports3.DeleteFile = exports3.RenameFile = exports3.CreateFile = exports3.TextDocumentEdit = exports3.AnnotatedTextEdit = exports3.ChangeAnnotationIdentifier = exports3.ChangeAnnotation = exports3.TextEdit = exports3.Command = exports3.Diagnostic = exports3.CodeDescription = exports3.DiagnosticTag = exports3.DiagnosticSeverity = exports3.DiagnosticRelatedInformation = exports3.FoldingRange = exports3.FoldingRangeKind = exports3.ColorPresentation = exports3.ColorInformation = exports3.Color = exports3.LocationLink = exports3.Location = exports3.Range = exports3.Position = exports3.uinteger = exports3.integer = exports3.URI = exports3.DocumentUri = void 0;
      var DocumentUri;
      (function(DocumentUri2) {
        function is(value) {
          return typeof value === "string";
        }
        DocumentUri2.is = is;
      })(DocumentUri || (exports3.DocumentUri = DocumentUri = {}));
      var URI;
      (function(URI2) {
        function is(value) {
          return typeof value === "string";
        }
        URI2.is = is;
      })(URI || (exports3.URI = URI = {}));
      var integer;
      (function(integer2) {
        integer2.MIN_VALUE = -2147483648;
        integer2.MAX_VALUE = 2147483647;
        function is(value) {
          return typeof value === "number" && integer2.MIN_VALUE <= value && value <= integer2.MAX_VALUE;
        }
        integer2.is = is;
      })(integer || (exports3.integer = integer = {}));
      var uinteger;
      (function(uinteger2) {
        uinteger2.MIN_VALUE = 0;
        uinteger2.MAX_VALUE = 2147483647;
        function is(value) {
          return typeof value === "number" && uinteger2.MIN_VALUE <= value && value <= uinteger2.MAX_VALUE;
        }
        uinteger2.is = is;
      })(uinteger || (exports3.uinteger = uinteger = {}));
      var Position5;
      (function(Position6) {
        function create(line, character) {
          if (line === Number.MAX_VALUE) {
            line = uinteger.MAX_VALUE;
          }
          if (character === Number.MAX_VALUE) {
            character = uinteger.MAX_VALUE;
          }
          return { line, character };
        }
        Position6.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
        }
        Position6.is = is;
      })(Position5 || (exports3.Position = Position5 = {}));
      var Range5;
      (function(Range6) {
        function create(one, two, three, four) {
          if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
            return { start: Position5.create(one, two), end: Position5.create(three, four) };
          } else if (Position5.is(one) && Position5.is(two)) {
            return { start: one, end: two };
          } else {
            throw new Error("Range#create called with invalid arguments[".concat(one, ", ").concat(two, ", ").concat(three, ", ").concat(four, "]"));
          }
        }
        Range6.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Position5.is(candidate.start) && Position5.is(candidate.end);
        }
        Range6.is = is;
      })(Range5 || (exports3.Range = Range5 = {}));
      var Location6;
      (function(Location7) {
        function create(uri, range2) {
          return { uri, range: range2 };
        }
        Location7.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range5.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location7.is = is;
      })(Location6 || (exports3.Location = Location6 = {}));
      var LocationLink;
      (function(LocationLink2) {
        function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
          return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
        }
        LocationLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range5.is(candidate.targetRange) && Is.string(candidate.targetUri) && Range5.is(candidate.targetSelectionRange) && (Range5.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
        }
        LocationLink2.is = is;
      })(LocationLink || (exports3.LocationLink = LocationLink = {}));
      var Color;
      (function(Color2) {
        function create(red, green, blue, alpha) {
          return {
            red,
            green,
            blue,
            alpha
          };
        }
        Color2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
        }
        Color2.is = is;
      })(Color || (exports3.Color = Color = {}));
      var ColorInformation;
      (function(ColorInformation2) {
        function create(range2, color) {
          return {
            range: range2,
            color
          };
        }
        ColorInformation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range5.is(candidate.range) && Color.is(candidate.color);
        }
        ColorInformation2.is = is;
      })(ColorInformation || (exports3.ColorInformation = ColorInformation = {}));
      var ColorPresentation;
      (function(ColorPresentation2) {
        function create(label, textEdit, additionalTextEdits) {
          return {
            label,
            textEdit,
            additionalTextEdits
          };
        }
        ColorPresentation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit2.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit2.is));
        }
        ColorPresentation2.is = is;
      })(ColorPresentation || (exports3.ColorPresentation = ColorPresentation = {}));
      var FoldingRangeKind;
      (function(FoldingRangeKind2) {
        FoldingRangeKind2.Comment = "comment";
        FoldingRangeKind2.Imports = "imports";
        FoldingRangeKind2.Region = "region";
      })(FoldingRangeKind || (exports3.FoldingRangeKind = FoldingRangeKind = {}));
      var FoldingRange;
      (function(FoldingRange2) {
        function create(startLine, endLine, startCharacter, endCharacter, kind, collapsedText) {
          var result = {
            startLine,
            endLine
          };
          if (Is.defined(startCharacter)) {
            result.startCharacter = startCharacter;
          }
          if (Is.defined(endCharacter)) {
            result.endCharacter = endCharacter;
          }
          if (Is.defined(kind)) {
            result.kind = kind;
          }
          if (Is.defined(collapsedText)) {
            result.collapsedText = collapsedText;
          }
          return result;
        }
        FoldingRange2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
        }
        FoldingRange2.is = is;
      })(FoldingRange || (exports3.FoldingRange = FoldingRange = {}));
      var DiagnosticRelatedInformation;
      (function(DiagnosticRelatedInformation2) {
        function create(location2, message) {
          return {
            location: location2,
            message
          };
        }
        DiagnosticRelatedInformation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Location6.is(candidate.location) && Is.string(candidate.message);
        }
        DiagnosticRelatedInformation2.is = is;
      })(DiagnosticRelatedInformation || (exports3.DiagnosticRelatedInformation = DiagnosticRelatedInformation = {}));
      var DiagnosticSeverity2;
      (function(DiagnosticSeverity3) {
        DiagnosticSeverity3.Error = 1;
        DiagnosticSeverity3.Warning = 2;
        DiagnosticSeverity3.Information = 3;
        DiagnosticSeverity3.Hint = 4;
      })(DiagnosticSeverity2 || (exports3.DiagnosticSeverity = DiagnosticSeverity2 = {}));
      var DiagnosticTag;
      (function(DiagnosticTag2) {
        DiagnosticTag2.Unnecessary = 1;
        DiagnosticTag2.Deprecated = 2;
      })(DiagnosticTag || (exports3.DiagnosticTag = DiagnosticTag = {}));
      var CodeDescription;
      (function(CodeDescription2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.href);
        }
        CodeDescription2.is = is;
      })(CodeDescription || (exports3.CodeDescription = CodeDescription = {}));
      var Diagnostic3;
      (function(Diagnostic4) {
        function create(range2, message, severity, code, source, relatedInformation) {
          var result = { range: range2, message };
          if (Is.defined(severity)) {
            result.severity = severity;
          }
          if (Is.defined(code)) {
            result.code = code;
          }
          if (Is.defined(source)) {
            result.source = source;
          }
          if (Is.defined(relatedInformation)) {
            result.relatedInformation = relatedInformation;
          }
          return result;
        }
        Diagnostic4.create = create;
        function is(value) {
          var _a;
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
        }
        Diagnostic4.is = is;
      })(Diagnostic3 || (exports3.Diagnostic = Diagnostic3 = {}));
      var Command;
      (function(Command2) {
        function create(title, command) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
          }
          var result = { title, command };
          if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
          }
          return result;
        }
        Command2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
        }
        Command2.is = is;
      })(Command || (exports3.Command = Command = {}));
      var TextEdit2;
      (function(TextEdit3) {
        function replace(range2, newText) {
          return { range: range2, newText };
        }
        TextEdit3.replace = replace;
        function insert(position, newText) {
          return { range: { start: position, end: position }, newText };
        }
        TextEdit3.insert = insert;
        function del(range2) {
          return { range: range2, newText: "" };
        }
        TextEdit3.del = del;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range5.is(candidate.range);
        }
        TextEdit3.is = is;
      })(TextEdit2 || (exports3.TextEdit = TextEdit2 = {}));
      var ChangeAnnotation;
      (function(ChangeAnnotation2) {
        function create(label, needsConfirmation, description) {
          var result = { label };
          if (needsConfirmation !== void 0) {
            result.needsConfirmation = needsConfirmation;
          }
          if (description !== void 0) {
            result.description = description;
          }
          return result;
        }
        ChangeAnnotation2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
        }
        ChangeAnnotation2.is = is;
      })(ChangeAnnotation || (exports3.ChangeAnnotation = ChangeAnnotation = {}));
      var ChangeAnnotationIdentifier;
      (function(ChangeAnnotationIdentifier2) {
        function is(value) {
          var candidate = value;
          return Is.string(candidate);
        }
        ChangeAnnotationIdentifier2.is = is;
      })(ChangeAnnotationIdentifier || (exports3.ChangeAnnotationIdentifier = ChangeAnnotationIdentifier = {}));
      var AnnotatedTextEdit;
      (function(AnnotatedTextEdit2) {
        function replace(range2, newText, annotation) {
          return { range: range2, newText, annotationId: annotation };
        }
        AnnotatedTextEdit2.replace = replace;
        function insert(position, newText, annotation) {
          return { range: { start: position, end: position }, newText, annotationId: annotation };
        }
        AnnotatedTextEdit2.insert = insert;
        function del(range2, annotation) {
          return { range: range2, newText: "", annotationId: annotation };
        }
        AnnotatedTextEdit2.del = del;
        function is(value) {
          var candidate = value;
          return TextEdit2.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        AnnotatedTextEdit2.is = is;
      })(AnnotatedTextEdit || (exports3.AnnotatedTextEdit = AnnotatedTextEdit = {}));
      var TextDocumentEdit2;
      (function(TextDocumentEdit3) {
        function create(textDocument, edits) {
          return { textDocument, edits };
        }
        TextDocumentEdit3.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
        }
        TextDocumentEdit3.is = is;
      })(TextDocumentEdit2 || (exports3.TextDocumentEdit = TextDocumentEdit2 = {}));
      var CreateFile2;
      (function(CreateFile3) {
        function create(uri, options, annotation) {
          var result = {
            kind: "create",
            uri
          };
          if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        CreateFile3.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        CreateFile3.is = is;
      })(CreateFile2 || (exports3.CreateFile = CreateFile2 = {}));
      var RenameFile;
      (function(RenameFile2) {
        function create(oldUri, newUri, options, annotation) {
          var result = {
            kind: "rename",
            oldUri,
            newUri
          };
          if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        RenameFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        RenameFile2.is = is;
      })(RenameFile || (exports3.RenameFile = RenameFile = {}));
      var DeleteFile;
      (function(DeleteFile2) {
        function create(uri, options, annotation) {
          var result = {
            kind: "delete",
            uri
          };
          if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
            result.options = options;
          }
          if (annotation !== void 0) {
            result.annotationId = annotation;
          }
          return result;
        }
        DeleteFile2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
        }
        DeleteFile2.is = is;
      })(DeleteFile || (exports3.DeleteFile = DeleteFile = {}));
      var WorkspaceEdit;
      (function(WorkspaceEdit2) {
        function is(value) {
          var candidate = value;
          return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
            if (Is.string(change.kind)) {
              return CreateFile2.is(change) || RenameFile.is(change) || DeleteFile.is(change);
            } else {
              return TextDocumentEdit2.is(change);
            }
          }));
        }
        WorkspaceEdit2.is = is;
      })(WorkspaceEdit || (exports3.WorkspaceEdit = WorkspaceEdit = {}));
      var TextEditChangeImpl = (
        /** @class */
        (function() {
          function TextEditChangeImpl2(edits, changeAnnotations) {
            this.edits = edits;
            this.changeAnnotations = changeAnnotations;
          }
          TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit2.insert(position, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.insert(position, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.insert(position, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.replace = function(range2, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit2.replace(range2, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.replace(range2, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.replace(range2, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.delete = function(range2, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit2.del(range2);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.del(range2, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.del(range2, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.add = function(edit) {
            this.edits.push(edit);
          };
          TextEditChangeImpl2.prototype.all = function() {
            return this.edits;
          };
          TextEditChangeImpl2.prototype.clear = function() {
            this.edits.splice(0, this.edits.length);
          };
          TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
            if (value === void 0) {
              throw new Error("Text edit change is not configured to manage change annotations.");
            }
          };
          return TextEditChangeImpl2;
        })()
      );
      var ChangeAnnotations = (
        /** @class */
        (function() {
          function ChangeAnnotations2(annotations) {
            this._annotations = annotations === void 0 ? /* @__PURE__ */ Object.create(null) : annotations;
            this._counter = 0;
            this._size = 0;
          }
          ChangeAnnotations2.prototype.all = function() {
            return this._annotations;
          };
          Object.defineProperty(ChangeAnnotations2.prototype, "size", {
            get: function() {
              return this._size;
            },
            enumerable: false,
            configurable: true
          });
          ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
            var id;
            if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
              id = idOrAnnotation;
            } else {
              id = this.nextId();
              annotation = idOrAnnotation;
            }
            if (this._annotations[id] !== void 0) {
              throw new Error("Id ".concat(id, " is already in use."));
            }
            if (annotation === void 0) {
              throw new Error("No annotation provided for id ".concat(id));
            }
            this._annotations[id] = annotation;
            this._size++;
            return id;
          };
          ChangeAnnotations2.prototype.nextId = function() {
            this._counter++;
            return this._counter.toString();
          };
          return ChangeAnnotations2;
        })()
      );
      var WorkspaceChange = (
        /** @class */
        (function() {
          function WorkspaceChange2(workspaceEdit) {
            var _this = this;
            this._textEditChanges = /* @__PURE__ */ Object.create(null);
            if (workspaceEdit !== void 0) {
              this._workspaceEdit = workspaceEdit;
              if (workspaceEdit.documentChanges) {
                this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                workspaceEdit.documentChanges.forEach(function(change) {
                  if (TextDocumentEdit2.is(change)) {
                    var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                    _this._textEditChanges[change.textDocument.uri] = textEditChange;
                  }
                });
              } else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function(key) {
                  var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                  _this._textEditChanges[key] = textEditChange;
                });
              }
            } else {
              this._workspaceEdit = {};
            }
          }
          Object.defineProperty(WorkspaceChange2.prototype, "edit", {
            /**
             * Returns the underlying {@link WorkspaceEdit} literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function() {
              this.initDocumentChanges();
              if (this._changeAnnotations !== void 0) {
                if (this._changeAnnotations.size === 0) {
                  this._workspaceEdit.changeAnnotations = void 0;
                } else {
                  this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                }
              }
              return this._workspaceEdit;
            },
            enumerable: false,
            configurable: true
          });
          WorkspaceChange2.prototype.getTextEditChange = function(key) {
            if (OptionalVersionedTextDocumentIdentifier.is(key)) {
              this.initDocumentChanges();
              if (this._workspaceEdit.documentChanges === void 0) {
                throw new Error("Workspace edit is not configured for document changes.");
              }
              var textDocument = { uri: key.uri, version: key.version };
              var result = this._textEditChanges[textDocument.uri];
              if (!result) {
                var edits = [];
                var textDocumentEdit = {
                  textDocument,
                  edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits, this._changeAnnotations);
                this._textEditChanges[textDocument.uri] = result;
              }
              return result;
            } else {
              this.initChanges();
              if (this._workspaceEdit.changes === void 0) {
                throw new Error("Workspace edit is not configured for normal text edit changes.");
              }
              var result = this._textEditChanges[key];
              if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
              }
              return result;
            }
          };
          WorkspaceChange2.prototype.initDocumentChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._changeAnnotations = new ChangeAnnotations();
              this._workspaceEdit.documentChanges = [];
              this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
            }
          };
          WorkspaceChange2.prototype.initChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null);
            }
          };
          WorkspaceChange2.prototype.createFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = CreateFile2.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = CreateFile2.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange2.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = RenameFile.create(oldUri, newUri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = RenameFile.create(oldUri, newUri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange2.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = DeleteFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = DeleteFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          return WorkspaceChange2;
        })()
      );
      exports3.WorkspaceChange = WorkspaceChange;
      var TextDocumentIdentifier;
      (function(TextDocumentIdentifier2) {
        function create(uri) {
          return { uri };
        }
        TextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier2.is = is;
      })(TextDocumentIdentifier || (exports3.TextDocumentIdentifier = TextDocumentIdentifier = {}));
      var VersionedTextDocumentIdentifier;
      (function(VersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        VersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
        }
        VersionedTextDocumentIdentifier2.is = is;
      })(VersionedTextDocumentIdentifier || (exports3.VersionedTextDocumentIdentifier = VersionedTextDocumentIdentifier = {}));
      var OptionalVersionedTextDocumentIdentifier;
      (function(OptionalVersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        OptionalVersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
        }
        OptionalVersionedTextDocumentIdentifier2.is = is;
      })(OptionalVersionedTextDocumentIdentifier || (exports3.OptionalVersionedTextDocumentIdentifier = OptionalVersionedTextDocumentIdentifier = {}));
      var TextDocumentItem;
      (function(TextDocumentItem2) {
        function create(uri, languageId, version, text) {
          return { uri, languageId, version, text };
        }
        TextDocumentItem2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem2.is = is;
      })(TextDocumentItem || (exports3.TextDocumentItem = TextDocumentItem = {}));
      var MarkupKind2;
      (function(MarkupKind3) {
        MarkupKind3.PlainText = "plaintext";
        MarkupKind3.Markdown = "markdown";
        function is(value) {
          var candidate = value;
          return candidate === MarkupKind3.PlainText || candidate === MarkupKind3.Markdown;
        }
        MarkupKind3.is = is;
      })(MarkupKind2 || (exports3.MarkupKind = MarkupKind2 = {}));
      var MarkupContent;
      (function(MarkupContent2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(value) && MarkupKind2.is(candidate.kind) && Is.string(candidate.value);
        }
        MarkupContent2.is = is;
      })(MarkupContent || (exports3.MarkupContent = MarkupContent = {}));
      var CompletionItemKind2;
      (function(CompletionItemKind3) {
        CompletionItemKind3.Text = 1;
        CompletionItemKind3.Method = 2;
        CompletionItemKind3.Function = 3;
        CompletionItemKind3.Constructor = 4;
        CompletionItemKind3.Field = 5;
        CompletionItemKind3.Variable = 6;
        CompletionItemKind3.Class = 7;
        CompletionItemKind3.Interface = 8;
        CompletionItemKind3.Module = 9;
        CompletionItemKind3.Property = 10;
        CompletionItemKind3.Unit = 11;
        CompletionItemKind3.Value = 12;
        CompletionItemKind3.Enum = 13;
        CompletionItemKind3.Keyword = 14;
        CompletionItemKind3.Snippet = 15;
        CompletionItemKind3.Color = 16;
        CompletionItemKind3.File = 17;
        CompletionItemKind3.Reference = 18;
        CompletionItemKind3.Folder = 19;
        CompletionItemKind3.EnumMember = 20;
        CompletionItemKind3.Constant = 21;
        CompletionItemKind3.Struct = 22;
        CompletionItemKind3.Event = 23;
        CompletionItemKind3.Operator = 24;
        CompletionItemKind3.TypeParameter = 25;
      })(CompletionItemKind2 || (exports3.CompletionItemKind = CompletionItemKind2 = {}));
      var InsertTextFormat2;
      (function(InsertTextFormat3) {
        InsertTextFormat3.PlainText = 1;
        InsertTextFormat3.Snippet = 2;
      })(InsertTextFormat2 || (exports3.InsertTextFormat = InsertTextFormat2 = {}));
      var CompletionItemTag;
      (function(CompletionItemTag2) {
        CompletionItemTag2.Deprecated = 1;
      })(CompletionItemTag || (exports3.CompletionItemTag = CompletionItemTag = {}));
      var InsertReplaceEdit;
      (function(InsertReplaceEdit2) {
        function create(newText, insert, replace) {
          return { newText, insert, replace };
        }
        InsertReplaceEdit2.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.newText) && Range5.is(candidate.insert) && Range5.is(candidate.replace);
        }
        InsertReplaceEdit2.is = is;
      })(InsertReplaceEdit || (exports3.InsertReplaceEdit = InsertReplaceEdit = {}));
      var InsertTextMode;
      (function(InsertTextMode2) {
        InsertTextMode2.asIs = 1;
        InsertTextMode2.adjustIndentation = 2;
      })(InsertTextMode || (exports3.InsertTextMode = InsertTextMode = {}));
      var CompletionItemLabelDetails;
      (function(CompletionItemLabelDetails2) {
        function is(value) {
          var candidate = value;
          return candidate && (Is.string(candidate.detail) || candidate.detail === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
        }
        CompletionItemLabelDetails2.is = is;
      })(CompletionItemLabelDetails || (exports3.CompletionItemLabelDetails = CompletionItemLabelDetails = {}));
      var CompletionItem3;
      (function(CompletionItem4) {
        function create(label) {
          return { label };
        }
        CompletionItem4.create = create;
      })(CompletionItem3 || (exports3.CompletionItem = CompletionItem3 = {}));
      var CompletionList;
      (function(CompletionList2) {
        function create(items, isIncomplete) {
          return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList2.create = create;
      })(CompletionList || (exports3.CompletionList = CompletionList = {}));
      var MarkedString;
      (function(MarkedString2) {
        function fromPlainText(plainText) {
          return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
        }
        MarkedString2.fromPlainText = fromPlainText;
        function is(value) {
          var candidate = value;
          return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
        }
        MarkedString2.is = is;
      })(MarkedString || (exports3.MarkedString = MarkedString = {}));
      var Hover3;
      (function(Hover4) {
        function is(value) {
          var candidate = value;
          return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range5.is(value.range));
        }
        Hover4.is = is;
      })(Hover3 || (exports3.Hover = Hover3 = {}));
      var ParameterInformation;
      (function(ParameterInformation2) {
        function create(label, documentation) {
          return documentation ? { label, documentation } : { label };
        }
        ParameterInformation2.create = create;
      })(ParameterInformation || (exports3.ParameterInformation = ParameterInformation = {}));
      var SignatureInformation;
      (function(SignatureInformation2) {
        function create(label, documentation) {
          var parameters = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
          }
          var result = { label };
          if (Is.defined(documentation)) {
            result.documentation = documentation;
          }
          if (Is.defined(parameters)) {
            result.parameters = parameters;
          } else {
            result.parameters = [];
          }
          return result;
        }
        SignatureInformation2.create = create;
      })(SignatureInformation || (exports3.SignatureInformation = SignatureInformation = {}));
      var DocumentHighlightKind;
      (function(DocumentHighlightKind2) {
        DocumentHighlightKind2.Text = 1;
        DocumentHighlightKind2.Read = 2;
        DocumentHighlightKind2.Write = 3;
      })(DocumentHighlightKind || (exports3.DocumentHighlightKind = DocumentHighlightKind = {}));
      var DocumentHighlight;
      (function(DocumentHighlight2) {
        function create(range2, kind) {
          var result = { range: range2 };
          if (Is.number(kind)) {
            result.kind = kind;
          }
          return result;
        }
        DocumentHighlight2.create = create;
      })(DocumentHighlight || (exports3.DocumentHighlight = DocumentHighlight = {}));
      var SymbolKind2;
      (function(SymbolKind3) {
        SymbolKind3.File = 1;
        SymbolKind3.Module = 2;
        SymbolKind3.Namespace = 3;
        SymbolKind3.Package = 4;
        SymbolKind3.Class = 5;
        SymbolKind3.Method = 6;
        SymbolKind3.Property = 7;
        SymbolKind3.Field = 8;
        SymbolKind3.Constructor = 9;
        SymbolKind3.Enum = 10;
        SymbolKind3.Interface = 11;
        SymbolKind3.Function = 12;
        SymbolKind3.Variable = 13;
        SymbolKind3.Constant = 14;
        SymbolKind3.String = 15;
        SymbolKind3.Number = 16;
        SymbolKind3.Boolean = 17;
        SymbolKind3.Array = 18;
        SymbolKind3.Object = 19;
        SymbolKind3.Key = 20;
        SymbolKind3.Null = 21;
        SymbolKind3.EnumMember = 22;
        SymbolKind3.Struct = 23;
        SymbolKind3.Event = 24;
        SymbolKind3.Operator = 25;
        SymbolKind3.TypeParameter = 26;
      })(SymbolKind2 || (exports3.SymbolKind = SymbolKind2 = {}));
      var SymbolTag;
      (function(SymbolTag2) {
        SymbolTag2.Deprecated = 1;
      })(SymbolTag || (exports3.SymbolTag = SymbolTag = {}));
      var SymbolInformation3;
      (function(SymbolInformation4) {
        function create(name, kind, range2, uri, containerName) {
          var result = {
            name,
            kind,
            location: { uri, range: range2 }
          };
          if (containerName) {
            result.containerName = containerName;
          }
          return result;
        }
        SymbolInformation4.create = create;
      })(SymbolInformation3 || (exports3.SymbolInformation = SymbolInformation3 = {}));
      var WorkspaceSymbol;
      (function(WorkspaceSymbol2) {
        function create(name, kind, uri, range2) {
          return range2 !== void 0 ? { name, kind, location: { uri, range: range2 } } : { name, kind, location: { uri } };
        }
        WorkspaceSymbol2.create = create;
      })(WorkspaceSymbol || (exports3.WorkspaceSymbol = WorkspaceSymbol = {}));
      var DocumentSymbol3;
      (function(DocumentSymbol4) {
        function create(name, detail, kind, range2, selectionRange, children) {
          var result = {
            name,
            detail,
            kind,
            range: range2,
            selectionRange
          };
          if (children !== void 0) {
            result.children = children;
          }
          return result;
        }
        DocumentSymbol4.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range5.is(candidate.range) && Range5.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
        }
        DocumentSymbol4.is = is;
      })(DocumentSymbol3 || (exports3.DocumentSymbol = DocumentSymbol3 = {}));
      var CodeActionKind2;
      (function(CodeActionKind3) {
        CodeActionKind3.Empty = "";
        CodeActionKind3.QuickFix = "quickfix";
        CodeActionKind3.Refactor = "refactor";
        CodeActionKind3.RefactorExtract = "refactor.extract";
        CodeActionKind3.RefactorInline = "refactor.inline";
        CodeActionKind3.RefactorRewrite = "refactor.rewrite";
        CodeActionKind3.Source = "source";
        CodeActionKind3.SourceOrganizeImports = "source.organizeImports";
        CodeActionKind3.SourceFixAll = "source.fixAll";
      })(CodeActionKind2 || (exports3.CodeActionKind = CodeActionKind2 = {}));
      var CodeActionTriggerKind;
      (function(CodeActionTriggerKind2) {
        CodeActionTriggerKind2.Invoked = 1;
        CodeActionTriggerKind2.Automatic = 2;
      })(CodeActionTriggerKind || (exports3.CodeActionTriggerKind = CodeActionTriggerKind = {}));
      var CodeActionContext;
      (function(CodeActionContext2) {
        function create(diagnostics, only, triggerKind) {
          var result = { diagnostics };
          if (only !== void 0 && only !== null) {
            result.only = only;
          }
          if (triggerKind !== void 0 && triggerKind !== null) {
            result.triggerKind = triggerKind;
          }
          return result;
        }
        CodeActionContext2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic3.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string)) && (candidate.triggerKind === void 0 || candidate.triggerKind === CodeActionTriggerKind.Invoked || candidate.triggerKind === CodeActionTriggerKind.Automatic);
        }
        CodeActionContext2.is = is;
      })(CodeActionContext || (exports3.CodeActionContext = CodeActionContext = {}));
      var CodeAction3;
      (function(CodeAction4) {
        function create(title, kindOrCommandOrEdit, kind) {
          var result = { title };
          var checkKind = true;
          if (typeof kindOrCommandOrEdit === "string") {
            checkKind = false;
            result.kind = kindOrCommandOrEdit;
          } else if (Command.is(kindOrCommandOrEdit)) {
            result.command = kindOrCommandOrEdit;
          } else {
            result.edit = kindOrCommandOrEdit;
          }
          if (checkKind && kind !== void 0) {
            result.kind = kind;
          }
          return result;
        }
        CodeAction4.create = create;
        function is(value) {
          var candidate = value;
          return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic3.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
        }
        CodeAction4.is = is;
      })(CodeAction3 || (exports3.CodeAction = CodeAction3 = {}));
      var CodeLens3;
      (function(CodeLens4) {
        function create(range2, data) {
          var result = { range: range2 };
          if (Is.defined(data)) {
            result.data = data;
          }
          return result;
        }
        CodeLens4.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens4.is = is;
      })(CodeLens3 || (exports3.CodeLens = CodeLens3 = {}));
      var FormattingOptions;
      (function(FormattingOptions2) {
        function create(tabSize, insertSpaces) {
          return { tabSize, insertSpaces };
        }
        FormattingOptions2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions2.is = is;
      })(FormattingOptions || (exports3.FormattingOptions = FormattingOptions = {}));
      var DocumentLink;
      (function(DocumentLink2) {
        function create(range2, target, data) {
          return { range: range2, target, data };
        }
        DocumentLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink2.is = is;
      })(DocumentLink || (exports3.DocumentLink = DocumentLink = {}));
      var SelectionRange;
      (function(SelectionRange2) {
        function create(range2, parent) {
          return { range: range2, parent };
        }
        SelectionRange2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Range5.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
        }
        SelectionRange2.is = is;
      })(SelectionRange || (exports3.SelectionRange = SelectionRange = {}));
      var SemanticTokenTypes;
      (function(SemanticTokenTypes2) {
        SemanticTokenTypes2["namespace"] = "namespace";
        SemanticTokenTypes2["type"] = "type";
        SemanticTokenTypes2["class"] = "class";
        SemanticTokenTypes2["enum"] = "enum";
        SemanticTokenTypes2["interface"] = "interface";
        SemanticTokenTypes2["struct"] = "struct";
        SemanticTokenTypes2["typeParameter"] = "typeParameter";
        SemanticTokenTypes2["parameter"] = "parameter";
        SemanticTokenTypes2["variable"] = "variable";
        SemanticTokenTypes2["property"] = "property";
        SemanticTokenTypes2["enumMember"] = "enumMember";
        SemanticTokenTypes2["event"] = "event";
        SemanticTokenTypes2["function"] = "function";
        SemanticTokenTypes2["method"] = "method";
        SemanticTokenTypes2["macro"] = "macro";
        SemanticTokenTypes2["keyword"] = "keyword";
        SemanticTokenTypes2["modifier"] = "modifier";
        SemanticTokenTypes2["comment"] = "comment";
        SemanticTokenTypes2["string"] = "string";
        SemanticTokenTypes2["number"] = "number";
        SemanticTokenTypes2["regexp"] = "regexp";
        SemanticTokenTypes2["operator"] = "operator";
        SemanticTokenTypes2["decorator"] = "decorator";
      })(SemanticTokenTypes || (exports3.SemanticTokenTypes = SemanticTokenTypes = {}));
      var SemanticTokenModifiers;
      (function(SemanticTokenModifiers2) {
        SemanticTokenModifiers2["declaration"] = "declaration";
        SemanticTokenModifiers2["definition"] = "definition";
        SemanticTokenModifiers2["readonly"] = "readonly";
        SemanticTokenModifiers2["static"] = "static";
        SemanticTokenModifiers2["deprecated"] = "deprecated";
        SemanticTokenModifiers2["abstract"] = "abstract";
        SemanticTokenModifiers2["async"] = "async";
        SemanticTokenModifiers2["modification"] = "modification";
        SemanticTokenModifiers2["documentation"] = "documentation";
        SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
      })(SemanticTokenModifiers || (exports3.SemanticTokenModifiers = SemanticTokenModifiers = {}));
      var SemanticTokens;
      (function(SemanticTokens2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
        }
        SemanticTokens2.is = is;
      })(SemanticTokens || (exports3.SemanticTokens = SemanticTokens = {}));
      var InlineValueText;
      (function(InlineValueText2) {
        function create(range2, text) {
          return { range: range2, text };
        }
        InlineValueText2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Range5.is(candidate.range) && Is.string(candidate.text);
        }
        InlineValueText2.is = is;
      })(InlineValueText || (exports3.InlineValueText = InlineValueText = {}));
      var InlineValueVariableLookup;
      (function(InlineValueVariableLookup2) {
        function create(range2, variableName, caseSensitiveLookup) {
          return { range: range2, variableName, caseSensitiveLookup };
        }
        InlineValueVariableLookup2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Range5.is(candidate.range) && Is.boolean(candidate.caseSensitiveLookup) && (Is.string(candidate.variableName) || candidate.variableName === void 0);
        }
        InlineValueVariableLookup2.is = is;
      })(InlineValueVariableLookup || (exports3.InlineValueVariableLookup = InlineValueVariableLookup = {}));
      var InlineValueEvaluatableExpression;
      (function(InlineValueEvaluatableExpression2) {
        function create(range2, expression) {
          return { range: range2, expression };
        }
        InlineValueEvaluatableExpression2.create = create;
        function is(value) {
          var candidate = value;
          return candidate !== void 0 && candidate !== null && Range5.is(candidate.range) && (Is.string(candidate.expression) || candidate.expression === void 0);
        }
        InlineValueEvaluatableExpression2.is = is;
      })(InlineValueEvaluatableExpression || (exports3.InlineValueEvaluatableExpression = InlineValueEvaluatableExpression = {}));
      var InlineValueContext;
      (function(InlineValueContext2) {
        function create(frameId, stoppedLocation) {
          return { frameId, stoppedLocation };
        }
        InlineValueContext2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range5.is(value.stoppedLocation);
        }
        InlineValueContext2.is = is;
      })(InlineValueContext || (exports3.InlineValueContext = InlineValueContext = {}));
      var InlayHintKind;
      (function(InlayHintKind2) {
        InlayHintKind2.Type = 1;
        InlayHintKind2.Parameter = 2;
        function is(value) {
          return value === 1 || value === 2;
        }
        InlayHintKind2.is = is;
      })(InlayHintKind || (exports3.InlayHintKind = InlayHintKind = {}));
      var InlayHintLabelPart;
      (function(InlayHintLabelPart2) {
        function create(value) {
          return { value };
        }
        InlayHintLabelPart2.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.location === void 0 || Location6.is(candidate.location)) && (candidate.command === void 0 || Command.is(candidate.command));
        }
        InlayHintLabelPart2.is = is;
      })(InlayHintLabelPart || (exports3.InlayHintLabelPart = InlayHintLabelPart = {}));
      var InlayHint2;
      (function(InlayHint3) {
        function create(position, label, kind) {
          var result = { position, label };
          if (kind !== void 0) {
            result.kind = kind;
          }
          return result;
        }
        InlayHint3.create = create;
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && Position5.is(candidate.position) && (Is.string(candidate.label) || Is.typedArray(candidate.label, InlayHintLabelPart.is)) && (candidate.kind === void 0 || InlayHintKind.is(candidate.kind)) && candidate.textEdits === void 0 || Is.typedArray(candidate.textEdits, TextEdit2.is) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.paddingLeft === void 0 || Is.boolean(candidate.paddingLeft)) && (candidate.paddingRight === void 0 || Is.boolean(candidate.paddingRight));
        }
        InlayHint3.is = is;
      })(InlayHint2 || (exports3.InlayHint = InlayHint2 = {}));
      var StringValue;
      (function(StringValue2) {
        function createSnippet(value) {
          return { kind: "snippet", value };
        }
        StringValue2.createSnippet = createSnippet;
      })(StringValue || (exports3.StringValue = StringValue = {}));
      var InlineCompletionItem;
      (function(InlineCompletionItem2) {
        function create(insertText, filterText, range2, command) {
          return { insertText, filterText, range: range2, command };
        }
        InlineCompletionItem2.create = create;
      })(InlineCompletionItem || (exports3.InlineCompletionItem = InlineCompletionItem = {}));
      var InlineCompletionList;
      (function(InlineCompletionList2) {
        function create(items) {
          return { items };
        }
        InlineCompletionList2.create = create;
      })(InlineCompletionList || (exports3.InlineCompletionList = InlineCompletionList = {}));
      var InlineCompletionTriggerKind;
      (function(InlineCompletionTriggerKind2) {
        InlineCompletionTriggerKind2.Invoked = 0;
        InlineCompletionTriggerKind2.Automatic = 1;
      })(InlineCompletionTriggerKind || (exports3.InlineCompletionTriggerKind = InlineCompletionTriggerKind = {}));
      var SelectedCompletionInfo;
      (function(SelectedCompletionInfo2) {
        function create(range2, text) {
          return { range: range2, text };
        }
        SelectedCompletionInfo2.create = create;
      })(SelectedCompletionInfo || (exports3.SelectedCompletionInfo = SelectedCompletionInfo = {}));
      var InlineCompletionContext;
      (function(InlineCompletionContext2) {
        function create(triggerKind, selectedCompletionInfo) {
          return { triggerKind, selectedCompletionInfo };
        }
        InlineCompletionContext2.create = create;
      })(InlineCompletionContext || (exports3.InlineCompletionContext = InlineCompletionContext = {}));
      var WorkspaceFolder;
      (function(WorkspaceFolder2) {
        function is(value) {
          var candidate = value;
          return Is.objectLiteral(candidate) && URI.is(candidate.uri) && Is.string(candidate.name);
        }
        WorkspaceFolder2.is = is;
      })(WorkspaceFolder || (exports3.WorkspaceFolder = WorkspaceFolder = {}));
      exports3.EOL = ["\n", "\r\n", "\r"];
      var TextDocument2;
      (function(TextDocument3) {
        function create(uri, languageId, version, content) {
          return new FullTextDocument2(uri, languageId, version, content);
        }
        TextDocument3.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument3.is = is;
        function applyEdits(document, edits) {
          var text = document.getText();
          var sortedEdits = mergeSort2(edits, function(a, b) {
            var diff = a.range.start.line - b.range.start.line;
            if (diff === 0) {
              return a.range.start.character - b.range.start.character;
            }
            return diff;
          });
          var lastModifiedOffset = text.length;
          for (var i = sortedEdits.length - 1; i >= 0; i--) {
            var e = sortedEdits[i];
            var startOffset = document.offsetAt(e.range.start);
            var endOffset = document.offsetAt(e.range.end);
            if (endOffset <= lastModifiedOffset) {
              text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
            } else {
              throw new Error("Overlapping edit");
            }
            lastModifiedOffset = startOffset;
          }
          return text;
        }
        TextDocument3.applyEdits = applyEdits;
        function mergeSort2(data, compare) {
          if (data.length <= 1) {
            return data;
          }
          var p = data.length / 2 | 0;
          var left = data.slice(0, p);
          var right = data.slice(p);
          mergeSort2(left, compare);
          mergeSort2(right, compare);
          var leftIdx = 0;
          var rightIdx = 0;
          var i = 0;
          while (leftIdx < left.length && rightIdx < right.length) {
            var ret = compare(left[leftIdx], right[rightIdx]);
            if (ret <= 0) {
              data[i++] = left[leftIdx++];
            } else {
              data[i++] = right[rightIdx++];
            }
          }
          while (leftIdx < left.length) {
            data[i++] = left[leftIdx++];
          }
          while (rightIdx < right.length) {
            data[i++] = right[rightIdx++];
          }
          return data;
        }
      })(TextDocument2 || (exports3.TextDocument = TextDocument2 = {}));
      var FullTextDocument2 = (
        /** @class */
        (function() {
          function FullTextDocument3(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = void 0;
          }
          Object.defineProperty(FullTextDocument3.prototype, "uri", {
            get: function() {
              return this._uri;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument3.prototype, "languageId", {
            get: function() {
              return this._languageId;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument3.prototype, "version", {
            get: function() {
              return this._version;
            },
            enumerable: false,
            configurable: true
          });
          FullTextDocument3.prototype.getText = function(range2) {
            if (range2) {
              var start = this.offsetAt(range2.start);
              var end = this.offsetAt(range2.end);
              return this._content.substring(start, end);
            }
            return this._content;
          };
          FullTextDocument3.prototype.update = function(event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = void 0;
          };
          FullTextDocument3.prototype.getLineOffsets = function() {
            if (this._lineOffsets === void 0) {
              var lineOffsets = [];
              var text = this._content;
              var isLineStart = true;
              for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                  lineOffsets.push(i);
                  isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = ch === "\r" || ch === "\n";
                if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
                  i++;
                }
              }
              if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
              }
              this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
          };
          FullTextDocument3.prototype.positionAt = function(offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
              return Position5.create(0, offset);
            }
            while (low < high) {
              var mid = Math.floor((low + high) / 2);
              if (lineOffsets[mid] > offset) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }
            var line = low - 1;
            return Position5.create(line, offset - lineOffsets[line]);
          };
          FullTextDocument3.prototype.offsetAt = function(position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
              return this._content.length;
            } else if (position.line < 0) {
              return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
          };
          Object.defineProperty(FullTextDocument3.prototype, "lineCount", {
            get: function() {
              return this.getLineOffsets().length;
            },
            enumerable: false,
            configurable: true
          });
          return FullTextDocument3;
        })()
      );
      var Is;
      (function(Is2) {
        var toString = Object.prototype.toString;
        function defined(value) {
          return typeof value !== "undefined";
        }
        Is2.defined = defined;
        function undefined2(value) {
          return typeof value === "undefined";
        }
        Is2.undefined = undefined2;
        function boolean(value) {
          return value === true || value === false;
        }
        Is2.boolean = boolean;
        function string(value) {
          return toString.call(value) === "[object String]";
        }
        Is2.string = string;
        function number(value) {
          return toString.call(value) === "[object Number]";
        }
        Is2.number = number;
        function numberRange(value, min, max) {
          return toString.call(value) === "[object Number]" && min <= value && value <= max;
        }
        Is2.numberRange = numberRange;
        function integer2(value) {
          return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
        }
        Is2.integer = integer2;
        function uinteger2(value) {
          return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
        }
        Is2.uinteger = uinteger2;
        function func(value) {
          return toString.call(value) === "[object Function]";
        }
        Is2.func = func;
        function objectLiteral(value) {
          return value !== null && typeof value === "object";
        }
        Is2.objectLiteral = objectLiteral;
        function typedArray(value, check) {
          return Array.isArray(value) && value.every(check);
        }
        Is2.typedArray = typedArray;
      })(Is || (Is = {}));
    });
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/messages.js
var require_messages2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/messages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProtocolNotificationType = exports2.ProtocolNotificationType0 = exports2.ProtocolRequestType = exports2.ProtocolRequestType0 = exports2.RegistrationType = exports2.MessageDirection = void 0;
    var vscode_jsonrpc_1 = require_main();
    var MessageDirection;
    (function(MessageDirection2) {
      MessageDirection2["clientToServer"] = "clientToServer";
      MessageDirection2["serverToClient"] = "serverToClient";
      MessageDirection2["both"] = "both";
    })(MessageDirection || (exports2.MessageDirection = MessageDirection = {}));
    var RegistrationType = class {
      constructor(method) {
        this.method = method;
      }
    };
    exports2.RegistrationType = RegistrationType;
    var ProtocolRequestType0 = class extends vscode_jsonrpc_1.RequestType0 {
      constructor(method) {
        super(method);
      }
    };
    exports2.ProtocolRequestType0 = ProtocolRequestType0;
    var ProtocolRequestType = class extends vscode_jsonrpc_1.RequestType {
      constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
      }
    };
    exports2.ProtocolRequestType = ProtocolRequestType;
    var ProtocolNotificationType0 = class extends vscode_jsonrpc_1.NotificationType0 {
      constructor(method) {
        super(method);
      }
    };
    exports2.ProtocolNotificationType0 = ProtocolNotificationType0;
    var ProtocolNotificationType = class extends vscode_jsonrpc_1.NotificationType {
      constructor(method) {
        super(method, vscode_jsonrpc_1.ParameterStructures.byName);
      }
    };
    exports2.ProtocolNotificationType = ProtocolNotificationType;
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/utils/is.js
var require_is3 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/utils/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.objectLiteral = exports2.typedArray = exports2.stringArray = exports2.array = exports2.func = exports2.error = exports2.number = exports2.string = exports2.boolean = void 0;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return typeof value === "string" || value instanceof String;
    }
    exports2.string = string;
    function number(value) {
      return typeof value === "number" || value instanceof Number;
    }
    exports2.number = number;
    function error(value) {
      return value instanceof Error;
    }
    exports2.error = error;
    function func(value) {
      return typeof value === "function";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports2.typedArray = typedArray;
    function objectLiteral(value) {
      return value !== null && typeof value === "object";
    }
    exports2.objectLiteral = objectLiteral;
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js
var require_protocol_implementation = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ImplementationRequest = void 0;
    var messages_1 = require_messages2();
    var ImplementationRequest;
    (function(ImplementationRequest2) {
      ImplementationRequest2.method = "textDocument/implementation";
      ImplementationRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ImplementationRequest2.type = new messages_1.ProtocolRequestType(ImplementationRequest2.method);
    })(ImplementationRequest || (exports2.ImplementationRequest = ImplementationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js
var require_protocol_typeDefinition = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TypeDefinitionRequest = void 0;
    var messages_1 = require_messages2();
    var TypeDefinitionRequest;
    (function(TypeDefinitionRequest2) {
      TypeDefinitionRequest2.method = "textDocument/typeDefinition";
      TypeDefinitionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeDefinitionRequest2.type = new messages_1.ProtocolRequestType(TypeDefinitionRequest2.method);
    })(TypeDefinitionRequest || (exports2.TypeDefinitionRequest = TypeDefinitionRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolder.js
var require_protocol_workspaceFolder = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DidChangeWorkspaceFoldersNotification = exports2.WorkspaceFoldersRequest = void 0;
    var messages_1 = require_messages2();
    var WorkspaceFoldersRequest;
    (function(WorkspaceFoldersRequest2) {
      WorkspaceFoldersRequest2.method = "workspace/workspaceFolders";
      WorkspaceFoldersRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      WorkspaceFoldersRequest2.type = new messages_1.ProtocolRequestType0(WorkspaceFoldersRequest2.method);
    })(WorkspaceFoldersRequest || (exports2.WorkspaceFoldersRequest = WorkspaceFoldersRequest = {}));
    var DidChangeWorkspaceFoldersNotification;
    (function(DidChangeWorkspaceFoldersNotification2) {
      DidChangeWorkspaceFoldersNotification2.method = "workspace/didChangeWorkspaceFolders";
      DidChangeWorkspaceFoldersNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeWorkspaceFoldersNotification2.type = new messages_1.ProtocolNotificationType(DidChangeWorkspaceFoldersNotification2.method);
    })(DidChangeWorkspaceFoldersNotification || (exports2.DidChangeWorkspaceFoldersNotification = DidChangeWorkspaceFoldersNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js
var require_protocol_configuration = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigurationRequest = void 0;
    var messages_1 = require_messages2();
    var ConfigurationRequest;
    (function(ConfigurationRequest2) {
      ConfigurationRequest2.method = "workspace/configuration";
      ConfigurationRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ConfigurationRequest2.type = new messages_1.ProtocolRequestType(ConfigurationRequest2.method);
    })(ConfigurationRequest || (exports2.ConfigurationRequest = ConfigurationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js
var require_protocol_colorProvider = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ColorPresentationRequest = exports2.DocumentColorRequest = void 0;
    var messages_1 = require_messages2();
    var DocumentColorRequest;
    (function(DocumentColorRequest2) {
      DocumentColorRequest2.method = "textDocument/documentColor";
      DocumentColorRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentColorRequest2.type = new messages_1.ProtocolRequestType(DocumentColorRequest2.method);
    })(DocumentColorRequest || (exports2.DocumentColorRequest = DocumentColorRequest = {}));
    var ColorPresentationRequest;
    (function(ColorPresentationRequest2) {
      ColorPresentationRequest2.method = "textDocument/colorPresentation";
      ColorPresentationRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ColorPresentationRequest2.type = new messages_1.ProtocolRequestType(ColorPresentationRequest2.method);
    })(ColorPresentationRequest || (exports2.ColorPresentationRequest = ColorPresentationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js
var require_protocol_foldingRange = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FoldingRangeRefreshRequest = exports2.FoldingRangeRequest = void 0;
    var messages_1 = require_messages2();
    var FoldingRangeRequest;
    (function(FoldingRangeRequest2) {
      FoldingRangeRequest2.method = "textDocument/foldingRange";
      FoldingRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      FoldingRangeRequest2.type = new messages_1.ProtocolRequestType(FoldingRangeRequest2.method);
    })(FoldingRangeRequest || (exports2.FoldingRangeRequest = FoldingRangeRequest = {}));
    var FoldingRangeRefreshRequest;
    (function(FoldingRangeRefreshRequest2) {
      FoldingRangeRefreshRequest2.method = `workspace/foldingRange/refresh`;
      FoldingRangeRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      FoldingRangeRefreshRequest2.type = new messages_1.ProtocolRequestType0(FoldingRangeRefreshRequest2.method);
    })(FoldingRangeRefreshRequest || (exports2.FoldingRangeRefreshRequest = FoldingRangeRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js
var require_protocol_declaration = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DeclarationRequest = void 0;
    var messages_1 = require_messages2();
    var DeclarationRequest;
    (function(DeclarationRequest2) {
      DeclarationRequest2.method = "textDocument/declaration";
      DeclarationRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DeclarationRequest2.type = new messages_1.ProtocolRequestType(DeclarationRequest2.method);
    })(DeclarationRequest || (exports2.DeclarationRequest = DeclarationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js
var require_protocol_selectionRange = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SelectionRangeRequest = void 0;
    var messages_1 = require_messages2();
    var SelectionRangeRequest;
    (function(SelectionRangeRequest2) {
      SelectionRangeRequest2.method = "textDocument/selectionRange";
      SelectionRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SelectionRangeRequest2.type = new messages_1.ProtocolRequestType(SelectionRangeRequest2.method);
    })(SelectionRangeRequest || (exports2.SelectionRangeRequest = SelectionRangeRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js
var require_protocol_progress = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkDoneProgressCancelNotification = exports2.WorkDoneProgressCreateRequest = exports2.WorkDoneProgress = void 0;
    var vscode_jsonrpc_1 = require_main();
    var messages_1 = require_messages2();
    var WorkDoneProgress;
    (function(WorkDoneProgress2) {
      WorkDoneProgress2.type = new vscode_jsonrpc_1.ProgressType();
      function is(value) {
        return value === WorkDoneProgress2.type;
      }
      WorkDoneProgress2.is = is;
    })(WorkDoneProgress || (exports2.WorkDoneProgress = WorkDoneProgress = {}));
    var WorkDoneProgressCreateRequest;
    (function(WorkDoneProgressCreateRequest2) {
      WorkDoneProgressCreateRequest2.method = "window/workDoneProgress/create";
      WorkDoneProgressCreateRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      WorkDoneProgressCreateRequest2.type = new messages_1.ProtocolRequestType(WorkDoneProgressCreateRequest2.method);
    })(WorkDoneProgressCreateRequest || (exports2.WorkDoneProgressCreateRequest = WorkDoneProgressCreateRequest = {}));
    var WorkDoneProgressCancelNotification;
    (function(WorkDoneProgressCancelNotification2) {
      WorkDoneProgressCancelNotification2.method = "window/workDoneProgress/cancel";
      WorkDoneProgressCancelNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkDoneProgressCancelNotification2.type = new messages_1.ProtocolNotificationType(WorkDoneProgressCancelNotification2.method);
    })(WorkDoneProgressCancelNotification || (exports2.WorkDoneProgressCancelNotification = WorkDoneProgressCancelNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js
var require_protocol_callHierarchy = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CallHierarchyOutgoingCallsRequest = exports2.CallHierarchyIncomingCallsRequest = exports2.CallHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    var CallHierarchyPrepareRequest;
    (function(CallHierarchyPrepareRequest2) {
      CallHierarchyPrepareRequest2.method = "textDocument/prepareCallHierarchy";
      CallHierarchyPrepareRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CallHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyPrepareRequest2.method);
    })(CallHierarchyPrepareRequest || (exports2.CallHierarchyPrepareRequest = CallHierarchyPrepareRequest = {}));
    var CallHierarchyIncomingCallsRequest;
    (function(CallHierarchyIncomingCallsRequest2) {
      CallHierarchyIncomingCallsRequest2.method = "callHierarchy/incomingCalls";
      CallHierarchyIncomingCallsRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CallHierarchyIncomingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyIncomingCallsRequest2.method);
    })(CallHierarchyIncomingCallsRequest || (exports2.CallHierarchyIncomingCallsRequest = CallHierarchyIncomingCallsRequest = {}));
    var CallHierarchyOutgoingCallsRequest;
    (function(CallHierarchyOutgoingCallsRequest2) {
      CallHierarchyOutgoingCallsRequest2.method = "callHierarchy/outgoingCalls";
      CallHierarchyOutgoingCallsRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CallHierarchyOutgoingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyOutgoingCallsRequest2.method);
    })(CallHierarchyOutgoingCallsRequest || (exports2.CallHierarchyOutgoingCallsRequest = CallHierarchyOutgoingCallsRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js
var require_protocol_semanticTokens = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SemanticTokensRefreshRequest = exports2.SemanticTokensRangeRequest = exports2.SemanticTokensDeltaRequest = exports2.SemanticTokensRequest = exports2.SemanticTokensRegistrationType = exports2.TokenFormat = void 0;
    var messages_1 = require_messages2();
    var TokenFormat;
    (function(TokenFormat2) {
      TokenFormat2.Relative = "relative";
    })(TokenFormat || (exports2.TokenFormat = TokenFormat = {}));
    var SemanticTokensRegistrationType;
    (function(SemanticTokensRegistrationType2) {
      SemanticTokensRegistrationType2.method = "textDocument/semanticTokens";
      SemanticTokensRegistrationType2.type = new messages_1.RegistrationType(SemanticTokensRegistrationType2.method);
    })(SemanticTokensRegistrationType || (exports2.SemanticTokensRegistrationType = SemanticTokensRegistrationType = {}));
    var SemanticTokensRequest;
    (function(SemanticTokensRequest2) {
      SemanticTokensRequest2.method = "textDocument/semanticTokens/full";
      SemanticTokensRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SemanticTokensRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRequest2.method);
      SemanticTokensRequest2.registrationMethod = SemanticTokensRegistrationType.method;
    })(SemanticTokensRequest || (exports2.SemanticTokensRequest = SemanticTokensRequest = {}));
    var SemanticTokensDeltaRequest;
    (function(SemanticTokensDeltaRequest2) {
      SemanticTokensDeltaRequest2.method = "textDocument/semanticTokens/full/delta";
      SemanticTokensDeltaRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SemanticTokensDeltaRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensDeltaRequest2.method);
      SemanticTokensDeltaRequest2.registrationMethod = SemanticTokensRegistrationType.method;
    })(SemanticTokensDeltaRequest || (exports2.SemanticTokensDeltaRequest = SemanticTokensDeltaRequest = {}));
    var SemanticTokensRangeRequest;
    (function(SemanticTokensRangeRequest2) {
      SemanticTokensRangeRequest2.method = "textDocument/semanticTokens/range";
      SemanticTokensRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SemanticTokensRangeRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRangeRequest2.method);
      SemanticTokensRangeRequest2.registrationMethod = SemanticTokensRegistrationType.method;
    })(SemanticTokensRangeRequest || (exports2.SemanticTokensRangeRequest = SemanticTokensRangeRequest = {}));
    var SemanticTokensRefreshRequest;
    (function(SemanticTokensRefreshRequest2) {
      SemanticTokensRefreshRequest2.method = `workspace/semanticTokens/refresh`;
      SemanticTokensRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      SemanticTokensRefreshRequest2.type = new messages_1.ProtocolRequestType0(SemanticTokensRefreshRequest2.method);
    })(SemanticTokensRefreshRequest || (exports2.SemanticTokensRefreshRequest = SemanticTokensRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js
var require_protocol_showDocument = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ShowDocumentRequest = void 0;
    var messages_1 = require_messages2();
    var ShowDocumentRequest;
    (function(ShowDocumentRequest2) {
      ShowDocumentRequest2.method = "window/showDocument";
      ShowDocumentRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ShowDocumentRequest2.type = new messages_1.ProtocolRequestType(ShowDocumentRequest2.method);
    })(ShowDocumentRequest || (exports2.ShowDocumentRequest = ShowDocumentRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js
var require_protocol_linkedEditingRange = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LinkedEditingRangeRequest = void 0;
    var messages_1 = require_messages2();
    var LinkedEditingRangeRequest;
    (function(LinkedEditingRangeRequest2) {
      LinkedEditingRangeRequest2.method = "textDocument/linkedEditingRange";
      LinkedEditingRangeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      LinkedEditingRangeRequest2.type = new messages_1.ProtocolRequestType(LinkedEditingRangeRequest2.method);
    })(LinkedEditingRangeRequest || (exports2.LinkedEditingRangeRequest = LinkedEditingRangeRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js
var require_protocol_fileOperations = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WillDeleteFilesRequest = exports2.DidDeleteFilesNotification = exports2.DidRenameFilesNotification = exports2.WillRenameFilesRequest = exports2.DidCreateFilesNotification = exports2.WillCreateFilesRequest = exports2.FileOperationPatternKind = void 0;
    var messages_1 = require_messages2();
    var FileOperationPatternKind;
    (function(FileOperationPatternKind2) {
      FileOperationPatternKind2.file = "file";
      FileOperationPatternKind2.folder = "folder";
    })(FileOperationPatternKind || (exports2.FileOperationPatternKind = FileOperationPatternKind = {}));
    var WillCreateFilesRequest;
    (function(WillCreateFilesRequest2) {
      WillCreateFilesRequest2.method = "workspace/willCreateFiles";
      WillCreateFilesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillCreateFilesRequest2.type = new messages_1.ProtocolRequestType(WillCreateFilesRequest2.method);
    })(WillCreateFilesRequest || (exports2.WillCreateFilesRequest = WillCreateFilesRequest = {}));
    var DidCreateFilesNotification;
    (function(DidCreateFilesNotification2) {
      DidCreateFilesNotification2.method = "workspace/didCreateFiles";
      DidCreateFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidCreateFilesNotification2.type = new messages_1.ProtocolNotificationType(DidCreateFilesNotification2.method);
    })(DidCreateFilesNotification || (exports2.DidCreateFilesNotification = DidCreateFilesNotification = {}));
    var WillRenameFilesRequest;
    (function(WillRenameFilesRequest2) {
      WillRenameFilesRequest2.method = "workspace/willRenameFiles";
      WillRenameFilesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillRenameFilesRequest2.type = new messages_1.ProtocolRequestType(WillRenameFilesRequest2.method);
    })(WillRenameFilesRequest || (exports2.WillRenameFilesRequest = WillRenameFilesRequest = {}));
    var DidRenameFilesNotification;
    (function(DidRenameFilesNotification2) {
      DidRenameFilesNotification2.method = "workspace/didRenameFiles";
      DidRenameFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidRenameFilesNotification2.type = new messages_1.ProtocolNotificationType(DidRenameFilesNotification2.method);
    })(DidRenameFilesNotification || (exports2.DidRenameFilesNotification = DidRenameFilesNotification = {}));
    var DidDeleteFilesNotification;
    (function(DidDeleteFilesNotification2) {
      DidDeleteFilesNotification2.method = "workspace/didDeleteFiles";
      DidDeleteFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidDeleteFilesNotification2.type = new messages_1.ProtocolNotificationType(DidDeleteFilesNotification2.method);
    })(DidDeleteFilesNotification || (exports2.DidDeleteFilesNotification = DidDeleteFilesNotification = {}));
    var WillDeleteFilesRequest;
    (function(WillDeleteFilesRequest2) {
      WillDeleteFilesRequest2.method = "workspace/willDeleteFiles";
      WillDeleteFilesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillDeleteFilesRequest2.type = new messages_1.ProtocolRequestType(WillDeleteFilesRequest2.method);
    })(WillDeleteFilesRequest || (exports2.WillDeleteFilesRequest = WillDeleteFilesRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js
var require_protocol_moniker = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MonikerRequest = exports2.MonikerKind = exports2.UniquenessLevel = void 0;
    var messages_1 = require_messages2();
    var UniquenessLevel;
    (function(UniquenessLevel2) {
      UniquenessLevel2.document = "document";
      UniquenessLevel2.project = "project";
      UniquenessLevel2.group = "group";
      UniquenessLevel2.scheme = "scheme";
      UniquenessLevel2.global = "global";
    })(UniquenessLevel || (exports2.UniquenessLevel = UniquenessLevel = {}));
    var MonikerKind;
    (function(MonikerKind2) {
      MonikerKind2.$import = "import";
      MonikerKind2.$export = "export";
      MonikerKind2.local = "local";
    })(MonikerKind || (exports2.MonikerKind = MonikerKind = {}));
    var MonikerRequest;
    (function(MonikerRequest2) {
      MonikerRequest2.method = "textDocument/moniker";
      MonikerRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      MonikerRequest2.type = new messages_1.ProtocolRequestType(MonikerRequest2.method);
    })(MonikerRequest || (exports2.MonikerRequest = MonikerRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.typeHierarchy.js
var require_protocol_typeHierarchy = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.typeHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TypeHierarchySubtypesRequest = exports2.TypeHierarchySupertypesRequest = exports2.TypeHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    var TypeHierarchyPrepareRequest;
    (function(TypeHierarchyPrepareRequest2) {
      TypeHierarchyPrepareRequest2.method = "textDocument/prepareTypeHierarchy";
      TypeHierarchyPrepareRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchyPrepareRequest2.method);
    })(TypeHierarchyPrepareRequest || (exports2.TypeHierarchyPrepareRequest = TypeHierarchyPrepareRequest = {}));
    var TypeHierarchySupertypesRequest;
    (function(TypeHierarchySupertypesRequest2) {
      TypeHierarchySupertypesRequest2.method = "typeHierarchy/supertypes";
      TypeHierarchySupertypesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeHierarchySupertypesRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchySupertypesRequest2.method);
    })(TypeHierarchySupertypesRequest || (exports2.TypeHierarchySupertypesRequest = TypeHierarchySupertypesRequest = {}));
    var TypeHierarchySubtypesRequest;
    (function(TypeHierarchySubtypesRequest2) {
      TypeHierarchySubtypesRequest2.method = "typeHierarchy/subtypes";
      TypeHierarchySubtypesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      TypeHierarchySubtypesRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchySubtypesRequest2.method);
    })(TypeHierarchySubtypesRequest || (exports2.TypeHierarchySubtypesRequest = TypeHierarchySubtypesRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineValue.js
var require_protocol_inlineValue = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineValueRefreshRequest = exports2.InlineValueRequest = void 0;
    var messages_1 = require_messages2();
    var InlineValueRequest;
    (function(InlineValueRequest2) {
      InlineValueRequest2.method = "textDocument/inlineValue";
      InlineValueRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlineValueRequest2.type = new messages_1.ProtocolRequestType(InlineValueRequest2.method);
    })(InlineValueRequest || (exports2.InlineValueRequest = InlineValueRequest = {}));
    var InlineValueRefreshRequest;
    (function(InlineValueRefreshRequest2) {
      InlineValueRefreshRequest2.method = `workspace/inlineValue/refresh`;
      InlineValueRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      InlineValueRefreshRequest2.type = new messages_1.ProtocolRequestType0(InlineValueRefreshRequest2.method);
    })(InlineValueRefreshRequest || (exports2.InlineValueRefreshRequest = InlineValueRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.js
var require_protocol_inlayHint = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlayHintRefreshRequest = exports2.InlayHintResolveRequest = exports2.InlayHintRequest = void 0;
    var messages_1 = require_messages2();
    var InlayHintRequest;
    (function(InlayHintRequest2) {
      InlayHintRequest2.method = "textDocument/inlayHint";
      InlayHintRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlayHintRequest2.type = new messages_1.ProtocolRequestType(InlayHintRequest2.method);
    })(InlayHintRequest || (exports2.InlayHintRequest = InlayHintRequest = {}));
    var InlayHintResolveRequest;
    (function(InlayHintResolveRequest2) {
      InlayHintResolveRequest2.method = "inlayHint/resolve";
      InlayHintResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlayHintResolveRequest2.type = new messages_1.ProtocolRequestType(InlayHintResolveRequest2.method);
    })(InlayHintResolveRequest || (exports2.InlayHintResolveRequest = InlayHintResolveRequest = {}));
    var InlayHintRefreshRequest;
    (function(InlayHintRefreshRequest2) {
      InlayHintRefreshRequest2.method = `workspace/inlayHint/refresh`;
      InlayHintRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      InlayHintRefreshRequest2.type = new messages_1.ProtocolRequestType0(InlayHintRefreshRequest2.method);
    })(InlayHintRefreshRequest || (exports2.InlayHintRefreshRequest = InlayHintRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.js
var require_protocol_diagnostic = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DiagnosticRefreshRequest = exports2.WorkspaceDiagnosticRequest = exports2.DocumentDiagnosticRequest = exports2.DocumentDiagnosticReportKind = exports2.DiagnosticServerCancellationData = void 0;
    var vscode_jsonrpc_1 = require_main();
    var Is = require_is3();
    var messages_1 = require_messages2();
    var DiagnosticServerCancellationData;
    (function(DiagnosticServerCancellationData2) {
      function is(value) {
        const candidate = value;
        return candidate && Is.boolean(candidate.retriggerRequest);
      }
      DiagnosticServerCancellationData2.is = is;
    })(DiagnosticServerCancellationData || (exports2.DiagnosticServerCancellationData = DiagnosticServerCancellationData = {}));
    var DocumentDiagnosticReportKind;
    (function(DocumentDiagnosticReportKind2) {
      DocumentDiagnosticReportKind2.Full = "full";
      DocumentDiagnosticReportKind2.Unchanged = "unchanged";
    })(DocumentDiagnosticReportKind || (exports2.DocumentDiagnosticReportKind = DocumentDiagnosticReportKind = {}));
    var DocumentDiagnosticRequest;
    (function(DocumentDiagnosticRequest2) {
      DocumentDiagnosticRequest2.method = "textDocument/diagnostic";
      DocumentDiagnosticRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentDiagnosticRequest2.type = new messages_1.ProtocolRequestType(DocumentDiagnosticRequest2.method);
      DocumentDiagnosticRequest2.partialResult = new vscode_jsonrpc_1.ProgressType();
    })(DocumentDiagnosticRequest || (exports2.DocumentDiagnosticRequest = DocumentDiagnosticRequest = {}));
    var WorkspaceDiagnosticRequest;
    (function(WorkspaceDiagnosticRequest2) {
      WorkspaceDiagnosticRequest2.method = "workspace/diagnostic";
      WorkspaceDiagnosticRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkspaceDiagnosticRequest2.type = new messages_1.ProtocolRequestType(WorkspaceDiagnosticRequest2.method);
      WorkspaceDiagnosticRequest2.partialResult = new vscode_jsonrpc_1.ProgressType();
    })(WorkspaceDiagnosticRequest || (exports2.WorkspaceDiagnosticRequest = WorkspaceDiagnosticRequest = {}));
    var DiagnosticRefreshRequest;
    (function(DiagnosticRefreshRequest2) {
      DiagnosticRefreshRequest2.method = `workspace/diagnostic/refresh`;
      DiagnosticRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      DiagnosticRefreshRequest2.type = new messages_1.ProtocolRequestType0(DiagnosticRefreshRequest2.method);
    })(DiagnosticRefreshRequest || (exports2.DiagnosticRefreshRequest = DiagnosticRefreshRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.js
var require_protocol_notebook = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DidCloseNotebookDocumentNotification = exports2.DidSaveNotebookDocumentNotification = exports2.DidChangeNotebookDocumentNotification = exports2.NotebookCellArrayChange = exports2.DidOpenNotebookDocumentNotification = exports2.NotebookDocumentSyncRegistrationType = exports2.NotebookDocument = exports2.NotebookCell = exports2.ExecutionSummary = exports2.NotebookCellKind = void 0;
    var vscode_languageserver_types_1 = require_main2();
    var Is = require_is3();
    var messages_1 = require_messages2();
    var NotebookCellKind;
    (function(NotebookCellKind2) {
      NotebookCellKind2.Markup = 1;
      NotebookCellKind2.Code = 2;
      function is(value) {
        return value === 1 || value === 2;
      }
      NotebookCellKind2.is = is;
    })(NotebookCellKind || (exports2.NotebookCellKind = NotebookCellKind = {}));
    var ExecutionSummary;
    (function(ExecutionSummary2) {
      function create(executionOrder, success) {
        const result = { executionOrder };
        if (success === true || success === false) {
          result.success = success;
        }
        return result;
      }
      ExecutionSummary2.create = create;
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && vscode_languageserver_types_1.uinteger.is(candidate.executionOrder) && (candidate.success === void 0 || Is.boolean(candidate.success));
      }
      ExecutionSummary2.is = is;
      function equals(one, other) {
        if (one === other) {
          return true;
        }
        if (one === null || one === void 0 || other === null || other === void 0) {
          return false;
        }
        return one.executionOrder === other.executionOrder && one.success === other.success;
      }
      ExecutionSummary2.equals = equals;
    })(ExecutionSummary || (exports2.ExecutionSummary = ExecutionSummary = {}));
    var NotebookCell;
    (function(NotebookCell2) {
      function create(kind, document) {
        return { kind, document };
      }
      NotebookCell2.create = create;
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && NotebookCellKind.is(candidate.kind) && vscode_languageserver_types_1.DocumentUri.is(candidate.document) && (candidate.metadata === void 0 || Is.objectLiteral(candidate.metadata));
      }
      NotebookCell2.is = is;
      function diff(one, two) {
        const result = /* @__PURE__ */ new Set();
        if (one.document !== two.document) {
          result.add("document");
        }
        if (one.kind !== two.kind) {
          result.add("kind");
        }
        if (one.executionSummary !== two.executionSummary) {
          result.add("executionSummary");
        }
        if ((one.metadata !== void 0 || two.metadata !== void 0) && !equalsMetadata(one.metadata, two.metadata)) {
          result.add("metadata");
        }
        if ((one.executionSummary !== void 0 || two.executionSummary !== void 0) && !ExecutionSummary.equals(one.executionSummary, two.executionSummary)) {
          result.add("executionSummary");
        }
        return result;
      }
      NotebookCell2.diff = diff;
      function equalsMetadata(one, other) {
        if (one === other) {
          return true;
        }
        if (one === null || one === void 0 || other === null || other === void 0) {
          return false;
        }
        if (typeof one !== typeof other) {
          return false;
        }
        if (typeof one !== "object") {
          return false;
        }
        const oneArray = Array.isArray(one);
        const otherArray = Array.isArray(other);
        if (oneArray !== otherArray) {
          return false;
        }
        if (oneArray && otherArray) {
          if (one.length !== other.length) {
            return false;
          }
          for (let i = 0; i < one.length; i++) {
            if (!equalsMetadata(one[i], other[i])) {
              return false;
            }
          }
        }
        if (Is.objectLiteral(one) && Is.objectLiteral(other)) {
          const oneKeys = Object.keys(one);
          const otherKeys = Object.keys(other);
          if (oneKeys.length !== otherKeys.length) {
            return false;
          }
          oneKeys.sort();
          otherKeys.sort();
          if (!equalsMetadata(oneKeys, otherKeys)) {
            return false;
          }
          for (let i = 0; i < oneKeys.length; i++) {
            const prop = oneKeys[i];
            if (!equalsMetadata(one[prop], other[prop])) {
              return false;
            }
          }
        }
        return true;
      }
    })(NotebookCell || (exports2.NotebookCell = NotebookCell = {}));
    var NotebookDocument;
    (function(NotebookDocument2) {
      function create(uri, notebookType, version, cells) {
        return { uri, notebookType, version, cells };
      }
      NotebookDocument2.create = create;
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && Is.string(candidate.uri) && vscode_languageserver_types_1.integer.is(candidate.version) && Is.typedArray(candidate.cells, NotebookCell.is);
      }
      NotebookDocument2.is = is;
    })(NotebookDocument || (exports2.NotebookDocument = NotebookDocument = {}));
    var NotebookDocumentSyncRegistrationType;
    (function(NotebookDocumentSyncRegistrationType2) {
      NotebookDocumentSyncRegistrationType2.method = "notebookDocument/sync";
      NotebookDocumentSyncRegistrationType2.messageDirection = messages_1.MessageDirection.clientToServer;
      NotebookDocumentSyncRegistrationType2.type = new messages_1.RegistrationType(NotebookDocumentSyncRegistrationType2.method);
    })(NotebookDocumentSyncRegistrationType || (exports2.NotebookDocumentSyncRegistrationType = NotebookDocumentSyncRegistrationType = {}));
    var DidOpenNotebookDocumentNotification;
    (function(DidOpenNotebookDocumentNotification2) {
      DidOpenNotebookDocumentNotification2.method = "notebookDocument/didOpen";
      DidOpenNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidOpenNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenNotebookDocumentNotification2.method);
      DidOpenNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidOpenNotebookDocumentNotification || (exports2.DidOpenNotebookDocumentNotification = DidOpenNotebookDocumentNotification = {}));
    var NotebookCellArrayChange;
    (function(NotebookCellArrayChange2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && vscode_languageserver_types_1.uinteger.is(candidate.start) && vscode_languageserver_types_1.uinteger.is(candidate.deleteCount) && (candidate.cells === void 0 || Is.typedArray(candidate.cells, NotebookCell.is));
      }
      NotebookCellArrayChange2.is = is;
      function create(start, deleteCount, cells) {
        const result = { start, deleteCount };
        if (cells !== void 0) {
          result.cells = cells;
        }
        return result;
      }
      NotebookCellArrayChange2.create = create;
    })(NotebookCellArrayChange || (exports2.NotebookCellArrayChange = NotebookCellArrayChange = {}));
    var DidChangeNotebookDocumentNotification;
    (function(DidChangeNotebookDocumentNotification2) {
      DidChangeNotebookDocumentNotification2.method = "notebookDocument/didChange";
      DidChangeNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeNotebookDocumentNotification2.method);
      DidChangeNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidChangeNotebookDocumentNotification || (exports2.DidChangeNotebookDocumentNotification = DidChangeNotebookDocumentNotification = {}));
    var DidSaveNotebookDocumentNotification;
    (function(DidSaveNotebookDocumentNotification2) {
      DidSaveNotebookDocumentNotification2.method = "notebookDocument/didSave";
      DidSaveNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidSaveNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveNotebookDocumentNotification2.method);
      DidSaveNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidSaveNotebookDocumentNotification || (exports2.DidSaveNotebookDocumentNotification = DidSaveNotebookDocumentNotification = {}));
    var DidCloseNotebookDocumentNotification;
    (function(DidCloseNotebookDocumentNotification2) {
      DidCloseNotebookDocumentNotification2.method = "notebookDocument/didClose";
      DidCloseNotebookDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidCloseNotebookDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseNotebookDocumentNotification2.method);
      DidCloseNotebookDocumentNotification2.registrationMethod = NotebookDocumentSyncRegistrationType.method;
    })(DidCloseNotebookDocumentNotification || (exports2.DidCloseNotebookDocumentNotification = DidCloseNotebookDocumentNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineCompletion.js
var require_protocol_inlineCompletion = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.inlineCompletion.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineCompletionRequest = void 0;
    var messages_1 = require_messages2();
    var InlineCompletionRequest;
    (function(InlineCompletionRequest2) {
      InlineCompletionRequest2.method = "textDocument/inlineCompletion";
      InlineCompletionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InlineCompletionRequest2.type = new messages_1.ProtocolRequestType(InlineCompletionRequest2.method);
    })(InlineCompletionRequest || (exports2.InlineCompletionRequest = InlineCompletionRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/protocol.js
var require_protocol = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/protocol.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkspaceSymbolRequest = exports2.CodeActionResolveRequest = exports2.CodeActionRequest = exports2.DocumentSymbolRequest = exports2.DocumentHighlightRequest = exports2.ReferencesRequest = exports2.DefinitionRequest = exports2.SignatureHelpRequest = exports2.SignatureHelpTriggerKind = exports2.HoverRequest = exports2.CompletionResolveRequest = exports2.CompletionRequest = exports2.CompletionTriggerKind = exports2.PublishDiagnosticsNotification = exports2.WatchKind = exports2.RelativePattern = exports2.FileChangeType = exports2.DidChangeWatchedFilesNotification = exports2.WillSaveTextDocumentWaitUntilRequest = exports2.WillSaveTextDocumentNotification = exports2.TextDocumentSaveReason = exports2.DidSaveTextDocumentNotification = exports2.DidCloseTextDocumentNotification = exports2.DidChangeTextDocumentNotification = exports2.TextDocumentContentChangeEvent = exports2.DidOpenTextDocumentNotification = exports2.TextDocumentSyncKind = exports2.TelemetryEventNotification = exports2.LogMessageNotification = exports2.ShowMessageRequest = exports2.ShowMessageNotification = exports2.MessageType = exports2.DidChangeConfigurationNotification = exports2.ExitNotification = exports2.ShutdownRequest = exports2.InitializedNotification = exports2.InitializeErrorCodes = exports2.InitializeRequest = exports2.WorkDoneProgressOptions = exports2.TextDocumentRegistrationOptions = exports2.StaticRegistrationOptions = exports2.PositionEncodingKind = exports2.FailureHandlingKind = exports2.ResourceOperationKind = exports2.UnregistrationRequest = exports2.RegistrationRequest = exports2.DocumentSelector = exports2.NotebookCellTextDocumentFilter = exports2.NotebookDocumentFilter = exports2.TextDocumentFilter = void 0;
    exports2.MonikerRequest = exports2.MonikerKind = exports2.UniquenessLevel = exports2.WillDeleteFilesRequest = exports2.DidDeleteFilesNotification = exports2.WillRenameFilesRequest = exports2.DidRenameFilesNotification = exports2.WillCreateFilesRequest = exports2.DidCreateFilesNotification = exports2.FileOperationPatternKind = exports2.LinkedEditingRangeRequest = exports2.ShowDocumentRequest = exports2.SemanticTokensRegistrationType = exports2.SemanticTokensRefreshRequest = exports2.SemanticTokensRangeRequest = exports2.SemanticTokensDeltaRequest = exports2.SemanticTokensRequest = exports2.TokenFormat = exports2.CallHierarchyPrepareRequest = exports2.CallHierarchyOutgoingCallsRequest = exports2.CallHierarchyIncomingCallsRequest = exports2.WorkDoneProgressCancelNotification = exports2.WorkDoneProgressCreateRequest = exports2.WorkDoneProgress = exports2.SelectionRangeRequest = exports2.DeclarationRequest = exports2.FoldingRangeRefreshRequest = exports2.FoldingRangeRequest = exports2.ColorPresentationRequest = exports2.DocumentColorRequest = exports2.ConfigurationRequest = exports2.DidChangeWorkspaceFoldersNotification = exports2.WorkspaceFoldersRequest = exports2.TypeDefinitionRequest = exports2.ImplementationRequest = exports2.ApplyWorkspaceEditRequest = exports2.ExecuteCommandRequest = exports2.PrepareRenameRequest = exports2.RenameRequest = exports2.PrepareSupportDefaultBehavior = exports2.DocumentOnTypeFormattingRequest = exports2.DocumentRangesFormattingRequest = exports2.DocumentRangeFormattingRequest = exports2.DocumentFormattingRequest = exports2.DocumentLinkResolveRequest = exports2.DocumentLinkRequest = exports2.CodeLensRefreshRequest = exports2.CodeLensResolveRequest = exports2.CodeLensRequest = exports2.WorkspaceSymbolResolveRequest = void 0;
    exports2.InlineCompletionRequest = exports2.DidCloseNotebookDocumentNotification = exports2.DidSaveNotebookDocumentNotification = exports2.DidChangeNotebookDocumentNotification = exports2.NotebookCellArrayChange = exports2.DidOpenNotebookDocumentNotification = exports2.NotebookDocumentSyncRegistrationType = exports2.NotebookDocument = exports2.NotebookCell = exports2.ExecutionSummary = exports2.NotebookCellKind = exports2.DiagnosticRefreshRequest = exports2.WorkspaceDiagnosticRequest = exports2.DocumentDiagnosticRequest = exports2.DocumentDiagnosticReportKind = exports2.DiagnosticServerCancellationData = exports2.InlayHintRefreshRequest = exports2.InlayHintResolveRequest = exports2.InlayHintRequest = exports2.InlineValueRefreshRequest = exports2.InlineValueRequest = exports2.TypeHierarchySupertypesRequest = exports2.TypeHierarchySubtypesRequest = exports2.TypeHierarchyPrepareRequest = void 0;
    var messages_1 = require_messages2();
    var vscode_languageserver_types_1 = require_main2();
    var Is = require_is3();
    var protocol_implementation_1 = require_protocol_implementation();
    Object.defineProperty(exports2, "ImplementationRequest", { enumerable: true, get: function() {
      return protocol_implementation_1.ImplementationRequest;
    } });
    var protocol_typeDefinition_1 = require_protocol_typeDefinition();
    Object.defineProperty(exports2, "TypeDefinitionRequest", { enumerable: true, get: function() {
      return protocol_typeDefinition_1.TypeDefinitionRequest;
    } });
    var protocol_workspaceFolder_1 = require_protocol_workspaceFolder();
    Object.defineProperty(exports2, "WorkspaceFoldersRequest", { enumerable: true, get: function() {
      return protocol_workspaceFolder_1.WorkspaceFoldersRequest;
    } });
    Object.defineProperty(exports2, "DidChangeWorkspaceFoldersNotification", { enumerable: true, get: function() {
      return protocol_workspaceFolder_1.DidChangeWorkspaceFoldersNotification;
    } });
    var protocol_configuration_1 = require_protocol_configuration();
    Object.defineProperty(exports2, "ConfigurationRequest", { enumerable: true, get: function() {
      return protocol_configuration_1.ConfigurationRequest;
    } });
    var protocol_colorProvider_1 = require_protocol_colorProvider();
    Object.defineProperty(exports2, "DocumentColorRequest", { enumerable: true, get: function() {
      return protocol_colorProvider_1.DocumentColorRequest;
    } });
    Object.defineProperty(exports2, "ColorPresentationRequest", { enumerable: true, get: function() {
      return protocol_colorProvider_1.ColorPresentationRequest;
    } });
    var protocol_foldingRange_1 = require_protocol_foldingRange();
    Object.defineProperty(exports2, "FoldingRangeRequest", { enumerable: true, get: function() {
      return protocol_foldingRange_1.FoldingRangeRequest;
    } });
    Object.defineProperty(exports2, "FoldingRangeRefreshRequest", { enumerable: true, get: function() {
      return protocol_foldingRange_1.FoldingRangeRefreshRequest;
    } });
    var protocol_declaration_1 = require_protocol_declaration();
    Object.defineProperty(exports2, "DeclarationRequest", { enumerable: true, get: function() {
      return protocol_declaration_1.DeclarationRequest;
    } });
    var protocol_selectionRange_1 = require_protocol_selectionRange();
    Object.defineProperty(exports2, "SelectionRangeRequest", { enumerable: true, get: function() {
      return protocol_selectionRange_1.SelectionRangeRequest;
    } });
    var protocol_progress_1 = require_protocol_progress();
    Object.defineProperty(exports2, "WorkDoneProgress", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgress;
    } });
    Object.defineProperty(exports2, "WorkDoneProgressCreateRequest", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgressCreateRequest;
    } });
    Object.defineProperty(exports2, "WorkDoneProgressCancelNotification", { enumerable: true, get: function() {
      return protocol_progress_1.WorkDoneProgressCancelNotification;
    } });
    var protocol_callHierarchy_1 = require_protocol_callHierarchy();
    Object.defineProperty(exports2, "CallHierarchyIncomingCallsRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyIncomingCallsRequest;
    } });
    Object.defineProperty(exports2, "CallHierarchyOutgoingCallsRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyOutgoingCallsRequest;
    } });
    Object.defineProperty(exports2, "CallHierarchyPrepareRequest", { enumerable: true, get: function() {
      return protocol_callHierarchy_1.CallHierarchyPrepareRequest;
    } });
    var protocol_semanticTokens_1 = require_protocol_semanticTokens();
    Object.defineProperty(exports2, "TokenFormat", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.TokenFormat;
    } });
    Object.defineProperty(exports2, "SemanticTokensRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensDeltaRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensDeltaRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensRangeRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRangeRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensRefreshRequest", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRefreshRequest;
    } });
    Object.defineProperty(exports2, "SemanticTokensRegistrationType", { enumerable: true, get: function() {
      return protocol_semanticTokens_1.SemanticTokensRegistrationType;
    } });
    var protocol_showDocument_1 = require_protocol_showDocument();
    Object.defineProperty(exports2, "ShowDocumentRequest", { enumerable: true, get: function() {
      return protocol_showDocument_1.ShowDocumentRequest;
    } });
    var protocol_linkedEditingRange_1 = require_protocol_linkedEditingRange();
    Object.defineProperty(exports2, "LinkedEditingRangeRequest", { enumerable: true, get: function() {
      return protocol_linkedEditingRange_1.LinkedEditingRangeRequest;
    } });
    var protocol_fileOperations_1 = require_protocol_fileOperations();
    Object.defineProperty(exports2, "FileOperationPatternKind", { enumerable: true, get: function() {
      return protocol_fileOperations_1.FileOperationPatternKind;
    } });
    Object.defineProperty(exports2, "DidCreateFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidCreateFilesNotification;
    } });
    Object.defineProperty(exports2, "WillCreateFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillCreateFilesRequest;
    } });
    Object.defineProperty(exports2, "DidRenameFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidRenameFilesNotification;
    } });
    Object.defineProperty(exports2, "WillRenameFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillRenameFilesRequest;
    } });
    Object.defineProperty(exports2, "DidDeleteFilesNotification", { enumerable: true, get: function() {
      return protocol_fileOperations_1.DidDeleteFilesNotification;
    } });
    Object.defineProperty(exports2, "WillDeleteFilesRequest", { enumerable: true, get: function() {
      return protocol_fileOperations_1.WillDeleteFilesRequest;
    } });
    var protocol_moniker_1 = require_protocol_moniker();
    Object.defineProperty(exports2, "UniquenessLevel", { enumerable: true, get: function() {
      return protocol_moniker_1.UniquenessLevel;
    } });
    Object.defineProperty(exports2, "MonikerKind", { enumerable: true, get: function() {
      return protocol_moniker_1.MonikerKind;
    } });
    Object.defineProperty(exports2, "MonikerRequest", { enumerable: true, get: function() {
      return protocol_moniker_1.MonikerRequest;
    } });
    var protocol_typeHierarchy_1 = require_protocol_typeHierarchy();
    Object.defineProperty(exports2, "TypeHierarchyPrepareRequest", { enumerable: true, get: function() {
      return protocol_typeHierarchy_1.TypeHierarchyPrepareRequest;
    } });
    Object.defineProperty(exports2, "TypeHierarchySubtypesRequest", { enumerable: true, get: function() {
      return protocol_typeHierarchy_1.TypeHierarchySubtypesRequest;
    } });
    Object.defineProperty(exports2, "TypeHierarchySupertypesRequest", { enumerable: true, get: function() {
      return protocol_typeHierarchy_1.TypeHierarchySupertypesRequest;
    } });
    var protocol_inlineValue_1 = require_protocol_inlineValue();
    Object.defineProperty(exports2, "InlineValueRequest", { enumerable: true, get: function() {
      return protocol_inlineValue_1.InlineValueRequest;
    } });
    Object.defineProperty(exports2, "InlineValueRefreshRequest", { enumerable: true, get: function() {
      return protocol_inlineValue_1.InlineValueRefreshRequest;
    } });
    var protocol_inlayHint_1 = require_protocol_inlayHint();
    Object.defineProperty(exports2, "InlayHintRequest", { enumerable: true, get: function() {
      return protocol_inlayHint_1.InlayHintRequest;
    } });
    Object.defineProperty(exports2, "InlayHintResolveRequest", { enumerable: true, get: function() {
      return protocol_inlayHint_1.InlayHintResolveRequest;
    } });
    Object.defineProperty(exports2, "InlayHintRefreshRequest", { enumerable: true, get: function() {
      return protocol_inlayHint_1.InlayHintRefreshRequest;
    } });
    var protocol_diagnostic_1 = require_protocol_diagnostic();
    Object.defineProperty(exports2, "DiagnosticServerCancellationData", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DiagnosticServerCancellationData;
    } });
    Object.defineProperty(exports2, "DocumentDiagnosticReportKind", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DocumentDiagnosticReportKind;
    } });
    Object.defineProperty(exports2, "DocumentDiagnosticRequest", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DocumentDiagnosticRequest;
    } });
    Object.defineProperty(exports2, "WorkspaceDiagnosticRequest", { enumerable: true, get: function() {
      return protocol_diagnostic_1.WorkspaceDiagnosticRequest;
    } });
    Object.defineProperty(exports2, "DiagnosticRefreshRequest", { enumerable: true, get: function() {
      return protocol_diagnostic_1.DiagnosticRefreshRequest;
    } });
    var protocol_notebook_1 = require_protocol_notebook();
    Object.defineProperty(exports2, "NotebookCellKind", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookCellKind;
    } });
    Object.defineProperty(exports2, "ExecutionSummary", { enumerable: true, get: function() {
      return protocol_notebook_1.ExecutionSummary;
    } });
    Object.defineProperty(exports2, "NotebookCell", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookCell;
    } });
    Object.defineProperty(exports2, "NotebookDocument", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookDocument;
    } });
    Object.defineProperty(exports2, "NotebookDocumentSyncRegistrationType", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookDocumentSyncRegistrationType;
    } });
    Object.defineProperty(exports2, "DidOpenNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidOpenNotebookDocumentNotification;
    } });
    Object.defineProperty(exports2, "NotebookCellArrayChange", { enumerable: true, get: function() {
      return protocol_notebook_1.NotebookCellArrayChange;
    } });
    Object.defineProperty(exports2, "DidChangeNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidChangeNotebookDocumentNotification;
    } });
    Object.defineProperty(exports2, "DidSaveNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidSaveNotebookDocumentNotification;
    } });
    Object.defineProperty(exports2, "DidCloseNotebookDocumentNotification", { enumerable: true, get: function() {
      return protocol_notebook_1.DidCloseNotebookDocumentNotification;
    } });
    var protocol_inlineCompletion_1 = require_protocol_inlineCompletion();
    Object.defineProperty(exports2, "InlineCompletionRequest", { enumerable: true, get: function() {
      return protocol_inlineCompletion_1.InlineCompletionRequest;
    } });
    var TextDocumentFilter;
    (function(TextDocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.string(candidate) || (Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern));
      }
      TextDocumentFilter2.is = is;
    })(TextDocumentFilter || (exports2.TextDocumentFilter = TextDocumentFilter = {}));
    var NotebookDocumentFilter;
    (function(NotebookDocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (Is.string(candidate.notebookType) || Is.string(candidate.scheme) || Is.string(candidate.pattern));
      }
      NotebookDocumentFilter2.is = is;
    })(NotebookDocumentFilter || (exports2.NotebookDocumentFilter = NotebookDocumentFilter = {}));
    var NotebookCellTextDocumentFilter;
    (function(NotebookCellTextDocumentFilter2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (Is.string(candidate.notebook) || NotebookDocumentFilter.is(candidate.notebook)) && (candidate.language === void 0 || Is.string(candidate.language));
      }
      NotebookCellTextDocumentFilter2.is = is;
    })(NotebookCellTextDocumentFilter || (exports2.NotebookCellTextDocumentFilter = NotebookCellTextDocumentFilter = {}));
    var DocumentSelector;
    (function(DocumentSelector2) {
      function is(value) {
        if (!Array.isArray(value)) {
          return false;
        }
        for (let elem of value) {
          if (!Is.string(elem) && !TextDocumentFilter.is(elem) && !NotebookCellTextDocumentFilter.is(elem)) {
            return false;
          }
        }
        return true;
      }
      DocumentSelector2.is = is;
    })(DocumentSelector || (exports2.DocumentSelector = DocumentSelector = {}));
    var RegistrationRequest;
    (function(RegistrationRequest2) {
      RegistrationRequest2.method = "client/registerCapability";
      RegistrationRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      RegistrationRequest2.type = new messages_1.ProtocolRequestType(RegistrationRequest2.method);
    })(RegistrationRequest || (exports2.RegistrationRequest = RegistrationRequest = {}));
    var UnregistrationRequest;
    (function(UnregistrationRequest2) {
      UnregistrationRequest2.method = "client/unregisterCapability";
      UnregistrationRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      UnregistrationRequest2.type = new messages_1.ProtocolRequestType(UnregistrationRequest2.method);
    })(UnregistrationRequest || (exports2.UnregistrationRequest = UnregistrationRequest = {}));
    var ResourceOperationKind;
    (function(ResourceOperationKind2) {
      ResourceOperationKind2.Create = "create";
      ResourceOperationKind2.Rename = "rename";
      ResourceOperationKind2.Delete = "delete";
    })(ResourceOperationKind || (exports2.ResourceOperationKind = ResourceOperationKind = {}));
    var FailureHandlingKind;
    (function(FailureHandlingKind2) {
      FailureHandlingKind2.Abort = "abort";
      FailureHandlingKind2.Transactional = "transactional";
      FailureHandlingKind2.TextOnlyTransactional = "textOnlyTransactional";
      FailureHandlingKind2.Undo = "undo";
    })(FailureHandlingKind || (exports2.FailureHandlingKind = FailureHandlingKind = {}));
    var PositionEncodingKind;
    (function(PositionEncodingKind2) {
      PositionEncodingKind2.UTF8 = "utf-8";
      PositionEncodingKind2.UTF16 = "utf-16";
      PositionEncodingKind2.UTF32 = "utf-32";
    })(PositionEncodingKind || (exports2.PositionEncodingKind = PositionEncodingKind = {}));
    var StaticRegistrationOptions;
    (function(StaticRegistrationOptions2) {
      function hasId(value) {
        const candidate = value;
        return candidate && Is.string(candidate.id) && candidate.id.length > 0;
      }
      StaticRegistrationOptions2.hasId = hasId;
    })(StaticRegistrationOptions || (exports2.StaticRegistrationOptions = StaticRegistrationOptions = {}));
    var TextDocumentRegistrationOptions;
    (function(TextDocumentRegistrationOptions2) {
      function is(value) {
        const candidate = value;
        return candidate && (candidate.documentSelector === null || DocumentSelector.is(candidate.documentSelector));
      }
      TextDocumentRegistrationOptions2.is = is;
    })(TextDocumentRegistrationOptions || (exports2.TextDocumentRegistrationOptions = TextDocumentRegistrationOptions = {}));
    var WorkDoneProgressOptions;
    (function(WorkDoneProgressOptions2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (candidate.workDoneProgress === void 0 || Is.boolean(candidate.workDoneProgress));
      }
      WorkDoneProgressOptions2.is = is;
      function hasWorkDoneProgress(value) {
        const candidate = value;
        return candidate && Is.boolean(candidate.workDoneProgress);
      }
      WorkDoneProgressOptions2.hasWorkDoneProgress = hasWorkDoneProgress;
    })(WorkDoneProgressOptions || (exports2.WorkDoneProgressOptions = WorkDoneProgressOptions = {}));
    var InitializeRequest;
    (function(InitializeRequest2) {
      InitializeRequest2.method = "initialize";
      InitializeRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      InitializeRequest2.type = new messages_1.ProtocolRequestType(InitializeRequest2.method);
    })(InitializeRequest || (exports2.InitializeRequest = InitializeRequest = {}));
    var InitializeErrorCodes;
    (function(InitializeErrorCodes2) {
      InitializeErrorCodes2.unknownProtocolVersion = 1;
    })(InitializeErrorCodes || (exports2.InitializeErrorCodes = InitializeErrorCodes = {}));
    var InitializedNotification;
    (function(InitializedNotification2) {
      InitializedNotification2.method = "initialized";
      InitializedNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      InitializedNotification2.type = new messages_1.ProtocolNotificationType(InitializedNotification2.method);
    })(InitializedNotification || (exports2.InitializedNotification = InitializedNotification = {}));
    var ShutdownRequest;
    (function(ShutdownRequest2) {
      ShutdownRequest2.method = "shutdown";
      ShutdownRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ShutdownRequest2.type = new messages_1.ProtocolRequestType0(ShutdownRequest2.method);
    })(ShutdownRequest || (exports2.ShutdownRequest = ShutdownRequest = {}));
    var ExitNotification;
    (function(ExitNotification2) {
      ExitNotification2.method = "exit";
      ExitNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      ExitNotification2.type = new messages_1.ProtocolNotificationType0(ExitNotification2.method);
    })(ExitNotification || (exports2.ExitNotification = ExitNotification = {}));
    var DidChangeConfigurationNotification;
    (function(DidChangeConfigurationNotification2) {
      DidChangeConfigurationNotification2.method = "workspace/didChangeConfiguration";
      DidChangeConfigurationNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeConfigurationNotification2.type = new messages_1.ProtocolNotificationType(DidChangeConfigurationNotification2.method);
    })(DidChangeConfigurationNotification || (exports2.DidChangeConfigurationNotification = DidChangeConfigurationNotification = {}));
    var MessageType;
    (function(MessageType2) {
      MessageType2.Error = 1;
      MessageType2.Warning = 2;
      MessageType2.Info = 3;
      MessageType2.Log = 4;
      MessageType2.Debug = 5;
    })(MessageType || (exports2.MessageType = MessageType = {}));
    var ShowMessageNotification;
    (function(ShowMessageNotification2) {
      ShowMessageNotification2.method = "window/showMessage";
      ShowMessageNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      ShowMessageNotification2.type = new messages_1.ProtocolNotificationType(ShowMessageNotification2.method);
    })(ShowMessageNotification || (exports2.ShowMessageNotification = ShowMessageNotification = {}));
    var ShowMessageRequest;
    (function(ShowMessageRequest2) {
      ShowMessageRequest2.method = "window/showMessageRequest";
      ShowMessageRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ShowMessageRequest2.type = new messages_1.ProtocolRequestType(ShowMessageRequest2.method);
    })(ShowMessageRequest || (exports2.ShowMessageRequest = ShowMessageRequest = {}));
    var LogMessageNotification;
    (function(LogMessageNotification2) {
      LogMessageNotification2.method = "window/logMessage";
      LogMessageNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      LogMessageNotification2.type = new messages_1.ProtocolNotificationType(LogMessageNotification2.method);
    })(LogMessageNotification || (exports2.LogMessageNotification = LogMessageNotification = {}));
    var TelemetryEventNotification;
    (function(TelemetryEventNotification2) {
      TelemetryEventNotification2.method = "telemetry/event";
      TelemetryEventNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      TelemetryEventNotification2.type = new messages_1.ProtocolNotificationType(TelemetryEventNotification2.method);
    })(TelemetryEventNotification || (exports2.TelemetryEventNotification = TelemetryEventNotification = {}));
    var TextDocumentSyncKind2;
    (function(TextDocumentSyncKind3) {
      TextDocumentSyncKind3.None = 0;
      TextDocumentSyncKind3.Full = 1;
      TextDocumentSyncKind3.Incremental = 2;
    })(TextDocumentSyncKind2 || (exports2.TextDocumentSyncKind = TextDocumentSyncKind2 = {}));
    var DidOpenTextDocumentNotification;
    (function(DidOpenTextDocumentNotification2) {
      DidOpenTextDocumentNotification2.method = "textDocument/didOpen";
      DidOpenTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidOpenTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenTextDocumentNotification2.method);
    })(DidOpenTextDocumentNotification || (exports2.DidOpenTextDocumentNotification = DidOpenTextDocumentNotification = {}));
    var TextDocumentContentChangeEvent;
    (function(TextDocumentContentChangeEvent2) {
      function isIncremental(event) {
        let candidate = event;
        return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
      }
      TextDocumentContentChangeEvent2.isIncremental = isIncremental;
      function isFull(event) {
        let candidate = event;
        return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
      }
      TextDocumentContentChangeEvent2.isFull = isFull;
    })(TextDocumentContentChangeEvent || (exports2.TextDocumentContentChangeEvent = TextDocumentContentChangeEvent = {}));
    var DidChangeTextDocumentNotification;
    (function(DidChangeTextDocumentNotification2) {
      DidChangeTextDocumentNotification2.method = "textDocument/didChange";
      DidChangeTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeTextDocumentNotification2.method);
    })(DidChangeTextDocumentNotification || (exports2.DidChangeTextDocumentNotification = DidChangeTextDocumentNotification = {}));
    var DidCloseTextDocumentNotification;
    (function(DidCloseTextDocumentNotification2) {
      DidCloseTextDocumentNotification2.method = "textDocument/didClose";
      DidCloseTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidCloseTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseTextDocumentNotification2.method);
    })(DidCloseTextDocumentNotification || (exports2.DidCloseTextDocumentNotification = DidCloseTextDocumentNotification = {}));
    var DidSaveTextDocumentNotification;
    (function(DidSaveTextDocumentNotification2) {
      DidSaveTextDocumentNotification2.method = "textDocument/didSave";
      DidSaveTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveTextDocumentNotification2.method);
    })(DidSaveTextDocumentNotification || (exports2.DidSaveTextDocumentNotification = DidSaveTextDocumentNotification = {}));
    var TextDocumentSaveReason;
    (function(TextDocumentSaveReason2) {
      TextDocumentSaveReason2.Manual = 1;
      TextDocumentSaveReason2.AfterDelay = 2;
      TextDocumentSaveReason2.FocusOut = 3;
    })(TextDocumentSaveReason || (exports2.TextDocumentSaveReason = TextDocumentSaveReason = {}));
    var WillSaveTextDocumentNotification;
    (function(WillSaveTextDocumentNotification2) {
      WillSaveTextDocumentNotification2.method = "textDocument/willSave";
      WillSaveTextDocumentNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(WillSaveTextDocumentNotification2.method);
    })(WillSaveTextDocumentNotification || (exports2.WillSaveTextDocumentNotification = WillSaveTextDocumentNotification = {}));
    var WillSaveTextDocumentWaitUntilRequest;
    (function(WillSaveTextDocumentWaitUntilRequest2) {
      WillSaveTextDocumentWaitUntilRequest2.method = "textDocument/willSaveWaitUntil";
      WillSaveTextDocumentWaitUntilRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WillSaveTextDocumentWaitUntilRequest2.type = new messages_1.ProtocolRequestType(WillSaveTextDocumentWaitUntilRequest2.method);
    })(WillSaveTextDocumentWaitUntilRequest || (exports2.WillSaveTextDocumentWaitUntilRequest = WillSaveTextDocumentWaitUntilRequest = {}));
    var DidChangeWatchedFilesNotification;
    (function(DidChangeWatchedFilesNotification2) {
      DidChangeWatchedFilesNotification2.method = "workspace/didChangeWatchedFiles";
      DidChangeWatchedFilesNotification2.messageDirection = messages_1.MessageDirection.clientToServer;
      DidChangeWatchedFilesNotification2.type = new messages_1.ProtocolNotificationType(DidChangeWatchedFilesNotification2.method);
    })(DidChangeWatchedFilesNotification || (exports2.DidChangeWatchedFilesNotification = DidChangeWatchedFilesNotification = {}));
    var FileChangeType;
    (function(FileChangeType2) {
      FileChangeType2.Created = 1;
      FileChangeType2.Changed = 2;
      FileChangeType2.Deleted = 3;
    })(FileChangeType || (exports2.FileChangeType = FileChangeType = {}));
    var RelativePattern;
    (function(RelativePattern2) {
      function is(value) {
        const candidate = value;
        return Is.objectLiteral(candidate) && (vscode_languageserver_types_1.URI.is(candidate.baseUri) || vscode_languageserver_types_1.WorkspaceFolder.is(candidate.baseUri)) && Is.string(candidate.pattern);
      }
      RelativePattern2.is = is;
    })(RelativePattern || (exports2.RelativePattern = RelativePattern = {}));
    var WatchKind;
    (function(WatchKind2) {
      WatchKind2.Create = 1;
      WatchKind2.Change = 2;
      WatchKind2.Delete = 4;
    })(WatchKind || (exports2.WatchKind = WatchKind = {}));
    var PublishDiagnosticsNotification;
    (function(PublishDiagnosticsNotification2) {
      PublishDiagnosticsNotification2.method = "textDocument/publishDiagnostics";
      PublishDiagnosticsNotification2.messageDirection = messages_1.MessageDirection.serverToClient;
      PublishDiagnosticsNotification2.type = new messages_1.ProtocolNotificationType(PublishDiagnosticsNotification2.method);
    })(PublishDiagnosticsNotification || (exports2.PublishDiagnosticsNotification = PublishDiagnosticsNotification = {}));
    var CompletionTriggerKind;
    (function(CompletionTriggerKind2) {
      CompletionTriggerKind2.Invoked = 1;
      CompletionTriggerKind2.TriggerCharacter = 2;
      CompletionTriggerKind2.TriggerForIncompleteCompletions = 3;
    })(CompletionTriggerKind || (exports2.CompletionTriggerKind = CompletionTriggerKind = {}));
    var CompletionRequest;
    (function(CompletionRequest2) {
      CompletionRequest2.method = "textDocument/completion";
      CompletionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CompletionRequest2.type = new messages_1.ProtocolRequestType(CompletionRequest2.method);
    })(CompletionRequest || (exports2.CompletionRequest = CompletionRequest = {}));
    var CompletionResolveRequest;
    (function(CompletionResolveRequest2) {
      CompletionResolveRequest2.method = "completionItem/resolve";
      CompletionResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CompletionResolveRequest2.type = new messages_1.ProtocolRequestType(CompletionResolveRequest2.method);
    })(CompletionResolveRequest || (exports2.CompletionResolveRequest = CompletionResolveRequest = {}));
    var HoverRequest;
    (function(HoverRequest2) {
      HoverRequest2.method = "textDocument/hover";
      HoverRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      HoverRequest2.type = new messages_1.ProtocolRequestType(HoverRequest2.method);
    })(HoverRequest || (exports2.HoverRequest = HoverRequest = {}));
    var SignatureHelpTriggerKind;
    (function(SignatureHelpTriggerKind2) {
      SignatureHelpTriggerKind2.Invoked = 1;
      SignatureHelpTriggerKind2.TriggerCharacter = 2;
      SignatureHelpTriggerKind2.ContentChange = 3;
    })(SignatureHelpTriggerKind || (exports2.SignatureHelpTriggerKind = SignatureHelpTriggerKind = {}));
    var SignatureHelpRequest;
    (function(SignatureHelpRequest2) {
      SignatureHelpRequest2.method = "textDocument/signatureHelp";
      SignatureHelpRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      SignatureHelpRequest2.type = new messages_1.ProtocolRequestType(SignatureHelpRequest2.method);
    })(SignatureHelpRequest || (exports2.SignatureHelpRequest = SignatureHelpRequest = {}));
    var DefinitionRequest;
    (function(DefinitionRequest2) {
      DefinitionRequest2.method = "textDocument/definition";
      DefinitionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DefinitionRequest2.type = new messages_1.ProtocolRequestType(DefinitionRequest2.method);
    })(DefinitionRequest || (exports2.DefinitionRequest = DefinitionRequest = {}));
    var ReferencesRequest;
    (function(ReferencesRequest2) {
      ReferencesRequest2.method = "textDocument/references";
      ReferencesRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ReferencesRequest2.type = new messages_1.ProtocolRequestType(ReferencesRequest2.method);
    })(ReferencesRequest || (exports2.ReferencesRequest = ReferencesRequest = {}));
    var DocumentHighlightRequest;
    (function(DocumentHighlightRequest2) {
      DocumentHighlightRequest2.method = "textDocument/documentHighlight";
      DocumentHighlightRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentHighlightRequest2.type = new messages_1.ProtocolRequestType(DocumentHighlightRequest2.method);
    })(DocumentHighlightRequest || (exports2.DocumentHighlightRequest = DocumentHighlightRequest = {}));
    var DocumentSymbolRequest;
    (function(DocumentSymbolRequest2) {
      DocumentSymbolRequest2.method = "textDocument/documentSymbol";
      DocumentSymbolRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentSymbolRequest2.type = new messages_1.ProtocolRequestType(DocumentSymbolRequest2.method);
    })(DocumentSymbolRequest || (exports2.DocumentSymbolRequest = DocumentSymbolRequest = {}));
    var CodeActionRequest;
    (function(CodeActionRequest2) {
      CodeActionRequest2.method = "textDocument/codeAction";
      CodeActionRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeActionRequest2.type = new messages_1.ProtocolRequestType(CodeActionRequest2.method);
    })(CodeActionRequest || (exports2.CodeActionRequest = CodeActionRequest = {}));
    var CodeActionResolveRequest;
    (function(CodeActionResolveRequest2) {
      CodeActionResolveRequest2.method = "codeAction/resolve";
      CodeActionResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeActionResolveRequest2.type = new messages_1.ProtocolRequestType(CodeActionResolveRequest2.method);
    })(CodeActionResolveRequest || (exports2.CodeActionResolveRequest = CodeActionResolveRequest = {}));
    var WorkspaceSymbolRequest;
    (function(WorkspaceSymbolRequest2) {
      WorkspaceSymbolRequest2.method = "workspace/symbol";
      WorkspaceSymbolRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkspaceSymbolRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolRequest2.method);
    })(WorkspaceSymbolRequest || (exports2.WorkspaceSymbolRequest = WorkspaceSymbolRequest = {}));
    var WorkspaceSymbolResolveRequest;
    (function(WorkspaceSymbolResolveRequest2) {
      WorkspaceSymbolResolveRequest2.method = "workspaceSymbol/resolve";
      WorkspaceSymbolResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      WorkspaceSymbolResolveRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolResolveRequest2.method);
    })(WorkspaceSymbolResolveRequest || (exports2.WorkspaceSymbolResolveRequest = WorkspaceSymbolResolveRequest = {}));
    var CodeLensRequest;
    (function(CodeLensRequest2) {
      CodeLensRequest2.method = "textDocument/codeLens";
      CodeLensRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeLensRequest2.type = new messages_1.ProtocolRequestType(CodeLensRequest2.method);
    })(CodeLensRequest || (exports2.CodeLensRequest = CodeLensRequest = {}));
    var CodeLensResolveRequest;
    (function(CodeLensResolveRequest2) {
      CodeLensResolveRequest2.method = "codeLens/resolve";
      CodeLensResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      CodeLensResolveRequest2.type = new messages_1.ProtocolRequestType(CodeLensResolveRequest2.method);
    })(CodeLensResolveRequest || (exports2.CodeLensResolveRequest = CodeLensResolveRequest = {}));
    var CodeLensRefreshRequest;
    (function(CodeLensRefreshRequest2) {
      CodeLensRefreshRequest2.method = `workspace/codeLens/refresh`;
      CodeLensRefreshRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      CodeLensRefreshRequest2.type = new messages_1.ProtocolRequestType0(CodeLensRefreshRequest2.method);
    })(CodeLensRefreshRequest || (exports2.CodeLensRefreshRequest = CodeLensRefreshRequest = {}));
    var DocumentLinkRequest;
    (function(DocumentLinkRequest2) {
      DocumentLinkRequest2.method = "textDocument/documentLink";
      DocumentLinkRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentLinkRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkRequest2.method);
    })(DocumentLinkRequest || (exports2.DocumentLinkRequest = DocumentLinkRequest = {}));
    var DocumentLinkResolveRequest;
    (function(DocumentLinkResolveRequest2) {
      DocumentLinkResolveRequest2.method = "documentLink/resolve";
      DocumentLinkResolveRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentLinkResolveRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkResolveRequest2.method);
    })(DocumentLinkResolveRequest || (exports2.DocumentLinkResolveRequest = DocumentLinkResolveRequest = {}));
    var DocumentFormattingRequest;
    (function(DocumentFormattingRequest2) {
      DocumentFormattingRequest2.method = "textDocument/formatting";
      DocumentFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentFormattingRequest2.method);
    })(DocumentFormattingRequest || (exports2.DocumentFormattingRequest = DocumentFormattingRequest = {}));
    var DocumentRangeFormattingRequest;
    (function(DocumentRangeFormattingRequest2) {
      DocumentRangeFormattingRequest2.method = "textDocument/rangeFormatting";
      DocumentRangeFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentRangeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangeFormattingRequest2.method);
    })(DocumentRangeFormattingRequest || (exports2.DocumentRangeFormattingRequest = DocumentRangeFormattingRequest = {}));
    var DocumentRangesFormattingRequest;
    (function(DocumentRangesFormattingRequest2) {
      DocumentRangesFormattingRequest2.method = "textDocument/rangesFormatting";
      DocumentRangesFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentRangesFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangesFormattingRequest2.method);
    })(DocumentRangesFormattingRequest || (exports2.DocumentRangesFormattingRequest = DocumentRangesFormattingRequest = {}));
    var DocumentOnTypeFormattingRequest;
    (function(DocumentOnTypeFormattingRequest2) {
      DocumentOnTypeFormattingRequest2.method = "textDocument/onTypeFormatting";
      DocumentOnTypeFormattingRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      DocumentOnTypeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentOnTypeFormattingRequest2.method);
    })(DocumentOnTypeFormattingRequest || (exports2.DocumentOnTypeFormattingRequest = DocumentOnTypeFormattingRequest = {}));
    var PrepareSupportDefaultBehavior;
    (function(PrepareSupportDefaultBehavior2) {
      PrepareSupportDefaultBehavior2.Identifier = 1;
    })(PrepareSupportDefaultBehavior || (exports2.PrepareSupportDefaultBehavior = PrepareSupportDefaultBehavior = {}));
    var RenameRequest;
    (function(RenameRequest2) {
      RenameRequest2.method = "textDocument/rename";
      RenameRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      RenameRequest2.type = new messages_1.ProtocolRequestType(RenameRequest2.method);
    })(RenameRequest || (exports2.RenameRequest = RenameRequest = {}));
    var PrepareRenameRequest;
    (function(PrepareRenameRequest2) {
      PrepareRenameRequest2.method = "textDocument/prepareRename";
      PrepareRenameRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      PrepareRenameRequest2.type = new messages_1.ProtocolRequestType(PrepareRenameRequest2.method);
    })(PrepareRenameRequest || (exports2.PrepareRenameRequest = PrepareRenameRequest = {}));
    var ExecuteCommandRequest;
    (function(ExecuteCommandRequest2) {
      ExecuteCommandRequest2.method = "workspace/executeCommand";
      ExecuteCommandRequest2.messageDirection = messages_1.MessageDirection.clientToServer;
      ExecuteCommandRequest2.type = new messages_1.ProtocolRequestType(ExecuteCommandRequest2.method);
    })(ExecuteCommandRequest || (exports2.ExecuteCommandRequest = ExecuteCommandRequest = {}));
    var ApplyWorkspaceEditRequest;
    (function(ApplyWorkspaceEditRequest2) {
      ApplyWorkspaceEditRequest2.method = "workspace/applyEdit";
      ApplyWorkspaceEditRequest2.messageDirection = messages_1.MessageDirection.serverToClient;
      ApplyWorkspaceEditRequest2.type = new messages_1.ProtocolRequestType("workspace/applyEdit");
    })(ApplyWorkspaceEditRequest || (exports2.ApplyWorkspaceEditRequest = ApplyWorkspaceEditRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/connection.js
var require_connection2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/connection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createProtocolConnection = void 0;
    var vscode_jsonrpc_1 = require_main();
    function createProtocolConnection(input, output, logger, options) {
      if (vscode_jsonrpc_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
      }
      return (0, vscode_jsonrpc_1.createMessageConnection)(input, output, logger, options);
    }
    exports2.createProtocolConnection = createProtocolConnection;
  }
});

// node_modules/vscode-languageserver-protocol/lib/common/api.js
var require_api2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/common/api.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LSPErrorCodes = exports2.createProtocolConnection = void 0;
    __exportStar(require_main(), exports2);
    __exportStar(require_main2(), exports2);
    __exportStar(require_messages2(), exports2);
    __exportStar(require_protocol(), exports2);
    var connection_1 = require_connection2();
    Object.defineProperty(exports2, "createProtocolConnection", { enumerable: true, get: function() {
      return connection_1.createProtocolConnection;
    } });
    var LSPErrorCodes;
    (function(LSPErrorCodes2) {
      LSPErrorCodes2.lspReservedErrorRangeStart = -32899;
      LSPErrorCodes2.RequestFailed = -32803;
      LSPErrorCodes2.ServerCancelled = -32802;
      LSPErrorCodes2.ContentModified = -32801;
      LSPErrorCodes2.RequestCancelled = -32800;
      LSPErrorCodes2.lspReservedErrorRangeEnd = -32800;
    })(LSPErrorCodes || (exports2.LSPErrorCodes = LSPErrorCodes = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/node/main.js
var require_main3 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/node/main.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createProtocolConnection = void 0;
    var node_1 = require_node();
    __exportStar(require_node(), exports2);
    __exportStar(require_api2(), exports2);
    function createProtocolConnection(input, output, logger, options) {
      return (0, node_1.createMessageConnection)(input, output, logger, options);
    }
    exports2.createProtocolConnection = createProtocolConnection;
  }
});

// node_modules/vscode-languageserver/lib/common/utils/uuid.js
var require_uuid = __commonJS({
  "node_modules/vscode-languageserver/lib/common/utils/uuid.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.generateUuid = exports2.parse = exports2.isUUID = exports2.v4 = exports2.empty = void 0;
    var ValueUUID = class {
      constructor(_value) {
        this._value = _value;
      }
      asHex() {
        return this._value;
      }
      equals(other) {
        return this.asHex() === other.asHex();
      }
    };
    var V4UUID = class _V4UUID extends ValueUUID {
      static _oneOf(array) {
        return array[Math.floor(array.length * Math.random())];
      }
      static _randomHex() {
        return _V4UUID._oneOf(_V4UUID._chars);
      }
      constructor() {
        super([
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          "4",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._oneOf(_V4UUID._timeHighBits),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex()
        ].join(""));
      }
    };
    V4UUID._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    V4UUID._timeHighBits = ["8", "9", "a", "b"];
    exports2.empty = new ValueUUID("00000000-0000-0000-0000-000000000000");
    function v4() {
      return new V4UUID();
    }
    exports2.v4 = v4;
    var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function isUUID(value) {
      return _UUIDPattern.test(value);
    }
    exports2.isUUID = isUUID;
    function parse(value) {
      if (!isUUID(value)) {
        throw new Error("invalid uuid");
      }
      return new ValueUUID(value);
    }
    exports2.parse = parse;
    function generateUuid() {
      return v4().asHex();
    }
    exports2.generateUuid = generateUuid;
  }
});

// node_modules/vscode-languageserver/lib/common/progress.js
var require_progress = __commonJS({
  "node_modules/vscode-languageserver/lib/common/progress.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.attachPartialResult = exports2.ProgressFeature = exports2.attachWorkDone = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var uuid_1 = require_uuid();
    var WorkDoneProgressReporterImpl = class _WorkDoneProgressReporterImpl {
      constructor(_connection, _token) {
        this._connection = _connection;
        this._token = _token;
        _WorkDoneProgressReporterImpl.Instances.set(this._token, this);
      }
      begin(title, percentage, message, cancellable) {
        let param = {
          kind: "begin",
          title,
          percentage,
          message,
          cancellable
        };
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
      }
      report(arg0, arg1) {
        let param = {
          kind: "report"
        };
        if (typeof arg0 === "number") {
          param.percentage = arg0;
          if (arg1 !== void 0) {
            param.message = arg1;
          }
        } else {
          param.message = arg0;
        }
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
      }
      done() {
        _WorkDoneProgressReporterImpl.Instances.delete(this._token);
        this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, { kind: "end" });
      }
    };
    WorkDoneProgressReporterImpl.Instances = /* @__PURE__ */ new Map();
    var WorkDoneProgressServerReporterImpl = class extends WorkDoneProgressReporterImpl {
      constructor(connection2, token) {
        super(connection2, token);
        this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
        super.done();
      }
      cancel() {
        this._source.cancel();
      }
    };
    var NullProgressReporter = class {
      constructor() {
      }
      begin() {
      }
      report() {
      }
      done() {
      }
    };
    var NullProgressServerReporter = class extends NullProgressReporter {
      constructor() {
        super();
        this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
      }
      get token() {
        return this._source.token;
      }
      done() {
        this._source.dispose();
      }
      cancel() {
        this._source.cancel();
      }
    };
    function attachWorkDone(connection2, params) {
      if (params === void 0 || params.workDoneToken === void 0) {
        return new NullProgressReporter();
      }
      const token = params.workDoneToken;
      delete params.workDoneToken;
      return new WorkDoneProgressReporterImpl(connection2, token);
    }
    exports2.attachWorkDone = attachWorkDone;
    var ProgressFeature = (Base) => {
      return class extends Base {
        constructor() {
          super();
          this._progressSupported = false;
        }
        initialize(capabilities) {
          super.initialize(capabilities);
          if (capabilities?.window?.workDoneProgress === true) {
            this._progressSupported = true;
            this.connection.onNotification(vscode_languageserver_protocol_1.WorkDoneProgressCancelNotification.type, (params) => {
              let progress = WorkDoneProgressReporterImpl.Instances.get(params.token);
              if (progress instanceof WorkDoneProgressServerReporterImpl || progress instanceof NullProgressServerReporter) {
                progress.cancel();
              }
            });
          }
        }
        attachWorkDoneProgress(token) {
          if (token === void 0) {
            return new NullProgressReporter();
          } else {
            return new WorkDoneProgressReporterImpl(this.connection, token);
          }
        }
        createWorkDoneProgress() {
          if (this._progressSupported) {
            const token = (0, uuid_1.generateUuid)();
            return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkDoneProgressCreateRequest.type, { token }).then(() => {
              const result = new WorkDoneProgressServerReporterImpl(this.connection, token);
              return result;
            });
          } else {
            return Promise.resolve(new NullProgressServerReporter());
          }
        }
      };
    };
    exports2.ProgressFeature = ProgressFeature;
    var ResultProgress;
    (function(ResultProgress2) {
      ResultProgress2.type = new vscode_languageserver_protocol_1.ProgressType();
    })(ResultProgress || (ResultProgress = {}));
    var ResultProgressReporterImpl = class {
      constructor(_connection, _token) {
        this._connection = _connection;
        this._token = _token;
      }
      report(data) {
        this._connection.sendProgress(ResultProgress.type, this._token, data);
      }
    };
    function attachPartialResult(connection2, params) {
      if (params === void 0 || params.partialResultToken === void 0) {
        return void 0;
      }
      const token = params.partialResultToken;
      delete params.partialResultToken;
      return new ResultProgressReporterImpl(connection2, token);
    }
    exports2.attachPartialResult = attachPartialResult;
  }
});

// node_modules/vscode-languageserver/lib/common/configuration.js
var require_configuration = __commonJS({
  "node_modules/vscode-languageserver/lib/common/configuration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConfigurationFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is();
    var ConfigurationFeature = (Base) => {
      return class extends Base {
        getConfiguration(arg) {
          if (!arg) {
            return this._getConfiguration({});
          } else if (Is.string(arg)) {
            return this._getConfiguration({ section: arg });
          } else {
            return this._getConfiguration(arg);
          }
        }
        _getConfiguration(arg) {
          let params = {
            items: Array.isArray(arg) ? arg : [arg]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ConfigurationRequest.type, params).then((result) => {
            if (Array.isArray(result)) {
              return Array.isArray(arg) ? result : result[0];
            } else {
              return Array.isArray(arg) ? [] : null;
            }
          });
        }
      };
    };
    exports2.ConfigurationFeature = ConfigurationFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/workspaceFolder.js
var require_workspaceFolder = __commonJS({
  "node_modules/vscode-languageserver/lib/common/workspaceFolder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkspaceFoldersFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var WorkspaceFoldersFeature = (Base) => {
      return class extends Base {
        constructor() {
          super();
          this._notificationIsAutoRegistered = false;
        }
        initialize(capabilities) {
          super.initialize(capabilities);
          let workspaceCapabilities = capabilities.workspace;
          if (workspaceCapabilities && workspaceCapabilities.workspaceFolders) {
            this._onDidChangeWorkspaceFolders = new vscode_languageserver_protocol_1.Emitter();
            this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type, (params) => {
              this._onDidChangeWorkspaceFolders.fire(params.event);
            });
          }
        }
        fillServerCapabilities(capabilities) {
          super.fillServerCapabilities(capabilities);
          const changeNotifications = capabilities.workspace?.workspaceFolders?.changeNotifications;
          this._notificationIsAutoRegistered = changeNotifications === true || typeof changeNotifications === "string";
        }
        getWorkspaceFolders() {
          return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkspaceFoldersRequest.type);
        }
        get onDidChangeWorkspaceFolders() {
          if (!this._onDidChangeWorkspaceFolders) {
            throw new Error("Client doesn't support sending workspace folder change events.");
          }
          if (!this._notificationIsAutoRegistered && !this._unregistration) {
            this._unregistration = this.connection.client.register(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type);
          }
          return this._onDidChangeWorkspaceFolders.event;
        }
      };
    };
    exports2.WorkspaceFoldersFeature = WorkspaceFoldersFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/callHierarchy.js
var require_callHierarchy = __commonJS({
  "node_modules/vscode-languageserver/lib/common/callHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CallHierarchyFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var CallHierarchyFeature = (Base) => {
      return class extends Base {
        get callHierarchy() {
          return {
            onPrepare: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.CallHierarchyPrepareRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
              });
            },
            onIncomingCalls: (handler) => {
              const type = vscode_languageserver_protocol_1.CallHierarchyIncomingCallsRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onOutgoingCalls: (handler) => {
              const type = vscode_languageserver_protocol_1.CallHierarchyOutgoingCallsRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.CallHierarchyFeature = CallHierarchyFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/semanticTokens.js
var require_semanticTokens = __commonJS({
  "node_modules/vscode-languageserver/lib/common/semanticTokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SemanticTokensBuilder = exports2.SemanticTokensDiff = exports2.SemanticTokensFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var SemanticTokensFeature = (Base) => {
      return class extends Base {
        get semanticTokens() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.SemanticTokensRefreshRequest.type);
            },
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onDelta: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensDeltaRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onRange: (handler) => {
              const type = vscode_languageserver_protocol_1.SemanticTokensRangeRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.SemanticTokensFeature = SemanticTokensFeature;
    var SemanticTokensDiff = class {
      constructor(originalSequence, modifiedSequence) {
        this.originalSequence = originalSequence;
        this.modifiedSequence = modifiedSequence;
      }
      computeDiff() {
        const originalLength = this.originalSequence.length;
        const modifiedLength = this.modifiedSequence.length;
        let startIndex = 0;
        while (startIndex < modifiedLength && startIndex < originalLength && this.originalSequence[startIndex] === this.modifiedSequence[startIndex]) {
          startIndex++;
        }
        if (startIndex < modifiedLength && startIndex < originalLength) {
          let originalEndIndex = originalLength - 1;
          let modifiedEndIndex = modifiedLength - 1;
          while (originalEndIndex >= startIndex && modifiedEndIndex >= startIndex && this.originalSequence[originalEndIndex] === this.modifiedSequence[modifiedEndIndex]) {
            originalEndIndex--;
            modifiedEndIndex--;
          }
          if (originalEndIndex < startIndex || modifiedEndIndex < startIndex) {
            originalEndIndex++;
            modifiedEndIndex++;
          }
          const deleteCount = originalEndIndex - startIndex + 1;
          const newData = this.modifiedSequence.slice(startIndex, modifiedEndIndex + 1);
          if (newData.length === 1 && newData[0] === this.originalSequence[originalEndIndex]) {
            return [
              { start: startIndex, deleteCount: deleteCount - 1 }
            ];
          } else {
            return [
              { start: startIndex, deleteCount, data: newData }
            ];
          }
        } else if (startIndex < modifiedLength) {
          return [
            { start: startIndex, deleteCount: 0, data: this.modifiedSequence.slice(startIndex) }
          ];
        } else if (startIndex < originalLength) {
          return [
            { start: startIndex, deleteCount: originalLength - startIndex }
          ];
        } else {
          return [];
        }
      }
    };
    exports2.SemanticTokensDiff = SemanticTokensDiff;
    var SemanticTokensBuilder = class {
      constructor() {
        this._prevData = void 0;
        this.initialize();
      }
      initialize() {
        this._id = Date.now();
        this._prevLine = 0;
        this._prevChar = 0;
        this._data = [];
        this._dataLen = 0;
      }
      push(line, char, length, tokenType, tokenModifiers) {
        let pushLine = line;
        let pushChar = char;
        if (this._dataLen > 0) {
          pushLine -= this._prevLine;
          if (pushLine === 0) {
            pushChar -= this._prevChar;
          }
        }
        this._data[this._dataLen++] = pushLine;
        this._data[this._dataLen++] = pushChar;
        this._data[this._dataLen++] = length;
        this._data[this._dataLen++] = tokenType;
        this._data[this._dataLen++] = tokenModifiers;
        this._prevLine = line;
        this._prevChar = char;
      }
      get id() {
        return this._id.toString();
      }
      previousResult(id) {
        if (this.id === id) {
          this._prevData = this._data;
        }
        this.initialize();
      }
      build() {
        this._prevData = void 0;
        return {
          resultId: this.id,
          data: this._data
        };
      }
      canBuildEdits() {
        return this._prevData !== void 0;
      }
      buildEdits() {
        if (this._prevData !== void 0) {
          return {
            resultId: this.id,
            edits: new SemanticTokensDiff(this._prevData, this._data).computeDiff()
          };
        } else {
          return this.build();
        }
      }
    };
    exports2.SemanticTokensBuilder = SemanticTokensBuilder;
  }
});

// node_modules/vscode-languageserver/lib/common/showDocument.js
var require_showDocument = __commonJS({
  "node_modules/vscode-languageserver/lib/common/showDocument.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ShowDocumentFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var ShowDocumentFeature = (Base) => {
      return class extends Base {
        showDocument(params) {
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowDocumentRequest.type, params);
        }
      };
    };
    exports2.ShowDocumentFeature = ShowDocumentFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/fileOperations.js
var require_fileOperations = __commonJS({
  "node_modules/vscode-languageserver/lib/common/fileOperations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FileOperationsFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var FileOperationsFeature = (Base) => {
      return class extends Base {
        onDidCreateFiles(handler) {
          return this.connection.onNotification(vscode_languageserver_protocol_1.DidCreateFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onDidRenameFiles(handler) {
          return this.connection.onNotification(vscode_languageserver_protocol_1.DidRenameFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onDidDeleteFiles(handler) {
          return this.connection.onNotification(vscode_languageserver_protocol_1.DidDeleteFilesNotification.type, (params) => {
            handler(params);
          });
        }
        onWillCreateFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillCreateFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
        onWillRenameFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillRenameFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
        onWillDeleteFiles(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.WillDeleteFilesRequest.type, (params, cancel) => {
            return handler(params, cancel);
          });
        }
      };
    };
    exports2.FileOperationsFeature = FileOperationsFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/linkedEditingRange.js
var require_linkedEditingRange = __commonJS({
  "node_modules/vscode-languageserver/lib/common/linkedEditingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LinkedEditingRangeFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var LinkedEditingRangeFeature = (Base) => {
      return class extends Base {
        onLinkedEditingRange(handler) {
          return this.connection.onRequest(vscode_languageserver_protocol_1.LinkedEditingRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
          });
        }
      };
    };
    exports2.LinkedEditingRangeFeature = LinkedEditingRangeFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/typeHierarchy.js
var require_typeHierarchy = __commonJS({
  "node_modules/vscode-languageserver/lib/common/typeHierarchy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TypeHierarchyFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var TypeHierarchyFeature = (Base) => {
      return class extends Base {
        get typeHierarchy() {
          return {
            onPrepare: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.TypeHierarchyPrepareRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
              });
            },
            onSupertypes: (handler) => {
              const type = vscode_languageserver_protocol_1.TypeHierarchySupertypesRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            },
            onSubtypes: (handler) => {
              const type = vscode_languageserver_protocol_1.TypeHierarchySubtypesRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.TypeHierarchyFeature = TypeHierarchyFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/inlineValue.js
var require_inlineValue = __commonJS({
  "node_modules/vscode-languageserver/lib/common/inlineValue.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineValueFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var InlineValueFeature = (Base) => {
      return class extends Base {
        get inlineValue() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.InlineValueRefreshRequest.type);
            },
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlineValueRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params));
              });
            }
          };
        }
      };
    };
    exports2.InlineValueFeature = InlineValueFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/foldingRange.js
var require_foldingRange = __commonJS({
  "node_modules/vscode-languageserver/lib/common/foldingRange.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FoldingRangeFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var FoldingRangeFeature = (Base) => {
      return class extends Base {
        get foldingRange() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.FoldingRangeRefreshRequest.type);
            },
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.FoldingRangeRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.FoldingRangeFeature = FoldingRangeFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/inlayHint.js
var require_inlayHint = __commonJS({
  "node_modules/vscode-languageserver/lib/common/inlayHint.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlayHintFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var InlayHintFeature = (Base) => {
      return class extends Base {
        get inlayHint() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.InlayHintRefreshRequest.type);
            },
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlayHintRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params));
              });
            },
            resolve: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlayHintResolveRequest.type, (params, cancel) => {
                return handler(params, cancel);
              });
            }
          };
        }
      };
    };
    exports2.InlayHintFeature = InlayHintFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/diagnostic.js
var require_diagnostic = __commonJS({
  "node_modules/vscode-languageserver/lib/common/diagnostic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DiagnosticFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var DiagnosticFeature = (Base) => {
      return class extends Base {
        get diagnostics() {
          return {
            refresh: () => {
              return this.connection.sendRequest(vscode_languageserver_protocol_1.DiagnosticRefreshRequest.type);
            },
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.DocumentDiagnosticRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(vscode_languageserver_protocol_1.DocumentDiagnosticRequest.partialResult, params));
              });
            },
            onWorkspace: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.WorkspaceDiagnosticRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(vscode_languageserver_protocol_1.WorkspaceDiagnosticRequest.partialResult, params));
              });
            }
          };
        }
      };
    };
    exports2.DiagnosticFeature = DiagnosticFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/textDocuments.js
var require_textDocuments = __commonJS({
  "node_modules/vscode-languageserver/lib/common/textDocuments.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TextDocuments = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var TextDocuments2 = class {
      /**
       * Create a new text document manager.
       */
      constructor(configuration) {
        this._configuration = configuration;
        this._syncedDocuments = /* @__PURE__ */ new Map();
        this._onDidChangeContent = new vscode_languageserver_protocol_1.Emitter();
        this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
        this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
        this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
        this._onWillSave = new vscode_languageserver_protocol_1.Emitter();
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been opened.
       */
      get onDidOpen() {
        return this._onDidOpen.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been opened or the content changes.
       */
      get onDidChangeContent() {
        return this._onDidChangeContent.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * will be saved.
       */
      get onWillSave() {
        return this._onWillSave.event;
      }
      /**
       * Sets a handler that will be called if a participant wants to provide
       * edits during a text document save.
       */
      onWillSaveWaitUntil(handler) {
        this._willSaveWaitUntil = handler;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been saved.
       */
      get onDidSave() {
        return this._onDidSave.event;
      }
      /**
       * An event that fires when a text document managed by this manager
       * has been closed.
       */
      get onDidClose() {
        return this._onDidClose.event;
      }
      /**
       * Returns the document for the given URI. Returns undefined if
       * the document is not managed by this instance.
       *
       * @param uri The text document's URI to retrieve.
       * @return the text document or `undefined`.
       */
      get(uri) {
        return this._syncedDocuments.get(uri);
      }
      /**
       * Returns all text documents managed by this instance.
       *
       * @return all text documents.
       */
      all() {
        return Array.from(this._syncedDocuments.values());
      }
      /**
       * Returns the URIs of all text documents managed by this instance.
       *
       * @return the URI's of all text documents.
       */
      keys() {
        return Array.from(this._syncedDocuments.keys());
      }
      /**
       * Listens for `low level` notification on the given connection to
       * update the text documents managed by this instance.
       *
       * Please note that the connection only provides handlers not an event model. Therefore
       * listening on a connection will overwrite the following handlers on a connection:
       * `onDidOpenTextDocument`, `onDidChangeTextDocument`, `onDidCloseTextDocument`,
       * `onWillSaveTextDocument`, `onWillSaveTextDocumentWaitUntil` and `onDidSaveTextDocument`.
       *
       * Use the corresponding events on the TextDocuments instance instead.
       *
       * @param connection The connection to listen on.
       */
      listen(connection2) {
        connection2.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental;
        const disposables = [];
        disposables.push(connection2.onDidOpenTextDocument((event) => {
          const td = event.textDocument;
          const document = this._configuration.create(td.uri, td.languageId, td.version, td.text);
          this._syncedDocuments.set(td.uri, document);
          const toFire = Object.freeze({ document });
          this._onDidOpen.fire(toFire);
          this._onDidChangeContent.fire(toFire);
        }));
        disposables.push(connection2.onDidChangeTextDocument((event) => {
          const td = event.textDocument;
          const changes = event.contentChanges;
          if (changes.length === 0) {
            return;
          }
          const { version } = td;
          if (version === null || version === void 0) {
            throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
          }
          let syncedDocument = this._syncedDocuments.get(td.uri);
          if (syncedDocument !== void 0) {
            syncedDocument = this._configuration.update(syncedDocument, changes, version);
            this._syncedDocuments.set(td.uri, syncedDocument);
            this._onDidChangeContent.fire(Object.freeze({ document: syncedDocument }));
          }
        }));
        disposables.push(connection2.onDidCloseTextDocument((event) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0) {
            this._syncedDocuments.delete(event.textDocument.uri);
            this._onDidClose.fire(Object.freeze({ document: syncedDocument }));
          }
        }));
        disposables.push(connection2.onWillSaveTextDocument((event) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0) {
            this._onWillSave.fire(Object.freeze({ document: syncedDocument, reason: event.reason }));
          }
        }));
        disposables.push(connection2.onWillSaveTextDocumentWaitUntil((event, token) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0 && this._willSaveWaitUntil) {
            return this._willSaveWaitUntil(Object.freeze({ document: syncedDocument, reason: event.reason }), token);
          } else {
            return [];
          }
        }));
        disposables.push(connection2.onDidSaveTextDocument((event) => {
          let syncedDocument = this._syncedDocuments.get(event.textDocument.uri);
          if (syncedDocument !== void 0) {
            this._onDidSave.fire(Object.freeze({ document: syncedDocument }));
          }
        }));
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          disposables.forEach((disposable) => disposable.dispose());
        });
      }
    };
    exports2.TextDocuments = TextDocuments2;
  }
});

// node_modules/vscode-languageserver/lib/common/notebook.js
var require_notebook = __commonJS({
  "node_modules/vscode-languageserver/lib/common/notebook.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NotebookDocuments = exports2.NotebookSyncFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var textDocuments_1 = require_textDocuments();
    var NotebookSyncFeature = (Base) => {
      return class extends Base {
        get synchronization() {
          return {
            onDidOpenNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidOpenNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            },
            onDidChangeNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            },
            onDidSaveNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidSaveNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            },
            onDidCloseNotebookDocument: (handler) => {
              return this.connection.onNotification(vscode_languageserver_protocol_1.DidCloseNotebookDocumentNotification.type, (params) => {
                handler(params);
              });
            }
          };
        }
      };
    };
    exports2.NotebookSyncFeature = NotebookSyncFeature;
    var CellTextDocumentConnection = class _CellTextDocumentConnection {
      onDidOpenTextDocument(handler) {
        this.openHandler = handler;
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          this.openHandler = void 0;
        });
      }
      openTextDocument(params) {
        this.openHandler && this.openHandler(params);
      }
      onDidChangeTextDocument(handler) {
        this.changeHandler = handler;
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          this.changeHandler = handler;
        });
      }
      changeTextDocument(params) {
        this.changeHandler && this.changeHandler(params);
      }
      onDidCloseTextDocument(handler) {
        this.closeHandler = handler;
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          this.closeHandler = void 0;
        });
      }
      closeTextDocument(params) {
        this.closeHandler && this.closeHandler(params);
      }
      onWillSaveTextDocument() {
        return _CellTextDocumentConnection.NULL_DISPOSE;
      }
      onWillSaveTextDocumentWaitUntil() {
        return _CellTextDocumentConnection.NULL_DISPOSE;
      }
      onDidSaveTextDocument() {
        return _CellTextDocumentConnection.NULL_DISPOSE;
      }
    };
    CellTextDocumentConnection.NULL_DISPOSE = Object.freeze({ dispose: () => {
    } });
    var NotebookDocuments = class {
      constructor(configurationOrTextDocuments) {
        if (configurationOrTextDocuments instanceof textDocuments_1.TextDocuments) {
          this._cellTextDocuments = configurationOrTextDocuments;
        } else {
          this._cellTextDocuments = new textDocuments_1.TextDocuments(configurationOrTextDocuments);
        }
        this.notebookDocuments = /* @__PURE__ */ new Map();
        this.notebookCellMap = /* @__PURE__ */ new Map();
        this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
        this._onDidChange = new vscode_languageserver_protocol_1.Emitter();
        this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
        this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
      }
      get cellTextDocuments() {
        return this._cellTextDocuments;
      }
      getCellTextDocument(cell) {
        return this._cellTextDocuments.get(cell.document);
      }
      getNotebookDocument(uri) {
        return this.notebookDocuments.get(uri);
      }
      getNotebookCell(uri) {
        const value = this.notebookCellMap.get(uri);
        return value && value[0];
      }
      findNotebookDocumentForCell(cell) {
        const key = typeof cell === "string" ? cell : cell.document;
        const value = this.notebookCellMap.get(key);
        return value && value[1];
      }
      get onDidOpen() {
        return this._onDidOpen.event;
      }
      get onDidSave() {
        return this._onDidSave.event;
      }
      get onDidChange() {
        return this._onDidChange.event;
      }
      get onDidClose() {
        return this._onDidClose.event;
      }
      /**
       * Listens for `low level` notification on the given connection to
       * update the notebook documents managed by this instance.
       *
       * Please note that the connection only provides handlers not an event model. Therefore
       * listening on a connection will overwrite the following handlers on a connection:
       * `onDidOpenNotebookDocument`, `onDidChangeNotebookDocument`, `onDidSaveNotebookDocument`,
       *  and `onDidCloseNotebookDocument`.
       *
       * @param connection The connection to listen on.
       */
      listen(connection2) {
        const cellTextDocumentConnection = new CellTextDocumentConnection();
        const disposables = [];
        disposables.push(this.cellTextDocuments.listen(cellTextDocumentConnection));
        disposables.push(connection2.notebooks.synchronization.onDidOpenNotebookDocument((params) => {
          this.notebookDocuments.set(params.notebookDocument.uri, params.notebookDocument);
          for (const cellTextDocument of params.cellTextDocuments) {
            cellTextDocumentConnection.openTextDocument({ textDocument: cellTextDocument });
          }
          this.updateCellMap(params.notebookDocument);
          this._onDidOpen.fire(params.notebookDocument);
        }));
        disposables.push(connection2.notebooks.synchronization.onDidChangeNotebookDocument((params) => {
          const notebookDocument = this.notebookDocuments.get(params.notebookDocument.uri);
          if (notebookDocument === void 0) {
            return;
          }
          notebookDocument.version = params.notebookDocument.version;
          const oldMetadata = notebookDocument.metadata;
          let metadataChanged = false;
          const change = params.change;
          if (change.metadata !== void 0) {
            metadataChanged = true;
            notebookDocument.metadata = change.metadata;
          }
          const opened = [];
          const closed = [];
          const data = [];
          const text = [];
          if (change.cells !== void 0) {
            const changedCells = change.cells;
            if (changedCells.structure !== void 0) {
              const array = changedCells.structure.array;
              notebookDocument.cells.splice(array.start, array.deleteCount, ...array.cells !== void 0 ? array.cells : []);
              if (changedCells.structure.didOpen !== void 0) {
                for (const open of changedCells.structure.didOpen) {
                  cellTextDocumentConnection.openTextDocument({ textDocument: open });
                  opened.push(open.uri);
                }
              }
              if (changedCells.structure.didClose) {
                for (const close of changedCells.structure.didClose) {
                  cellTextDocumentConnection.closeTextDocument({ textDocument: close });
                  closed.push(close.uri);
                }
              }
            }
            if (changedCells.data !== void 0) {
              const cellUpdates = new Map(changedCells.data.map((cell) => [cell.document, cell]));
              for (let i = 0; i <= notebookDocument.cells.length; i++) {
                const change2 = cellUpdates.get(notebookDocument.cells[i].document);
                if (change2 !== void 0) {
                  const old = notebookDocument.cells.splice(i, 1, change2);
                  data.push({ old: old[0], new: change2 });
                  cellUpdates.delete(change2.document);
                  if (cellUpdates.size === 0) {
                    break;
                  }
                }
              }
            }
            if (changedCells.textContent !== void 0) {
              for (const cellTextDocument of changedCells.textContent) {
                cellTextDocumentConnection.changeTextDocument({ textDocument: cellTextDocument.document, contentChanges: cellTextDocument.changes });
                text.push(cellTextDocument.document.uri);
              }
            }
          }
          this.updateCellMap(notebookDocument);
          const changeEvent = { notebookDocument };
          if (metadataChanged) {
            changeEvent.metadata = { old: oldMetadata, new: notebookDocument.metadata };
          }
          const added = [];
          for (const open of opened) {
            added.push(this.getNotebookCell(open));
          }
          const removed = [];
          for (const close of closed) {
            removed.push(this.getNotebookCell(close));
          }
          const textContent = [];
          for (const change2 of text) {
            textContent.push(this.getNotebookCell(change2));
          }
          if (added.length > 0 || removed.length > 0 || data.length > 0 || textContent.length > 0) {
            changeEvent.cells = { added, removed, changed: { data, textContent } };
          }
          if (changeEvent.metadata !== void 0 || changeEvent.cells !== void 0) {
            this._onDidChange.fire(changeEvent);
          }
        }));
        disposables.push(connection2.notebooks.synchronization.onDidSaveNotebookDocument((params) => {
          const notebookDocument = this.notebookDocuments.get(params.notebookDocument.uri);
          if (notebookDocument === void 0) {
            return;
          }
          this._onDidSave.fire(notebookDocument);
        }));
        disposables.push(connection2.notebooks.synchronization.onDidCloseNotebookDocument((params) => {
          const notebookDocument = this.notebookDocuments.get(params.notebookDocument.uri);
          if (notebookDocument === void 0) {
            return;
          }
          this._onDidClose.fire(notebookDocument);
          for (const cellTextDocument of params.cellTextDocuments) {
            cellTextDocumentConnection.closeTextDocument({ textDocument: cellTextDocument });
          }
          this.notebookDocuments.delete(params.notebookDocument.uri);
          for (const cell of notebookDocument.cells) {
            this.notebookCellMap.delete(cell.document);
          }
        }));
        return vscode_languageserver_protocol_1.Disposable.create(() => {
          disposables.forEach((disposable) => disposable.dispose());
        });
      }
      updateCellMap(notebookDocument) {
        for (const cell of notebookDocument.cells) {
          this.notebookCellMap.set(cell.document, [cell, notebookDocument]);
        }
      }
    };
    exports2.NotebookDocuments = NotebookDocuments;
  }
});

// node_modules/vscode-languageserver/lib/common/moniker.js
var require_moniker = __commonJS({
  "node_modules/vscode-languageserver/lib/common/moniker.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MonikerFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var MonikerFeature = (Base) => {
      return class extends Base {
        get moniker() {
          return {
            on: (handler) => {
              const type = vscode_languageserver_protocol_1.MonikerRequest.type;
              return this.connection.onRequest(type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
              });
            }
          };
        }
      };
    };
    exports2.MonikerFeature = MonikerFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/server.js
var require_server = __commonJS({
  "node_modules/vscode-languageserver/lib/common/server.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConnection = exports2.combineFeatures = exports2.combineNotebooksFeatures = exports2.combineLanguagesFeatures = exports2.combineWorkspaceFeatures = exports2.combineWindowFeatures = exports2.combineClientFeatures = exports2.combineTracerFeatures = exports2.combineTelemetryFeatures = exports2.combineConsoleFeatures = exports2._NotebooksImpl = exports2._LanguagesImpl = exports2.BulkUnregistration = exports2.BulkRegistration = exports2.ErrorMessageTracker = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is();
    var UUID = require_uuid();
    var progress_1 = require_progress();
    var configuration_1 = require_configuration();
    var workspaceFolder_1 = require_workspaceFolder();
    var callHierarchy_1 = require_callHierarchy();
    var semanticTokens_1 = require_semanticTokens();
    var showDocument_1 = require_showDocument();
    var fileOperations_1 = require_fileOperations();
    var linkedEditingRange_1 = require_linkedEditingRange();
    var typeHierarchy_1 = require_typeHierarchy();
    var inlineValue_1 = require_inlineValue();
    var foldingRange_1 = require_foldingRange();
    var inlayHint_1 = require_inlayHint();
    var diagnostic_1 = require_diagnostic();
    var notebook_1 = require_notebook();
    var moniker_1 = require_moniker();
    function null2Undefined(value) {
      if (value === null) {
        return void 0;
      }
      return value;
    }
    var ErrorMessageTracker = class {
      constructor() {
        this._messages = /* @__PURE__ */ Object.create(null);
      }
      /**
       * Add a message to the tracker.
       *
       * @param message The message to add.
       */
      add(message) {
        let count = this._messages[message];
        if (!count) {
          count = 0;
        }
        count++;
        this._messages[message] = count;
      }
      /**
       * Send all tracked messages to the connection's window.
       *
       * @param connection The connection established between client and server.
       */
      sendErrors(connection2) {
        Object.keys(this._messages).forEach((message) => {
          connection2.window.showErrorMessage(message);
        });
      }
    };
    exports2.ErrorMessageTracker = ErrorMessageTracker;
    var RemoteConsoleImpl = class {
      constructor() {
      }
      rawAttach(connection2) {
        this._rawConnection = connection2;
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      fillServerCapabilities(_capabilities) {
      }
      initialize(_capabilities) {
      }
      error(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Error, message);
      }
      warn(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Warning, message);
      }
      info(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Info, message);
      }
      log(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Log, message);
      }
      debug(message) {
        this.send(vscode_languageserver_protocol_1.MessageType.Debug, message);
      }
      send(type, message) {
        if (this._rawConnection) {
          this._rawConnection.sendNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, { type, message }).catch(() => {
            (0, vscode_languageserver_protocol_1.RAL)().console.error(`Sending log message failed`);
          });
        }
      }
    };
    var _RemoteWindowImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      showErrorMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Error, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
      showWarningMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Warning, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
      showInformationMessage(message, ...actions) {
        let params = { type: vscode_languageserver_protocol_1.MessageType.Info, message, actions };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
      }
    };
    var RemoteWindowImpl = (0, showDocument_1.ShowDocumentFeature)((0, progress_1.ProgressFeature)(_RemoteWindowImpl));
    var BulkRegistration;
    (function(BulkRegistration2) {
      function create() {
        return new BulkRegistrationImpl();
      }
      BulkRegistration2.create = create;
    })(BulkRegistration || (exports2.BulkRegistration = BulkRegistration = {}));
    var BulkRegistrationImpl = class {
      constructor() {
        this._registrations = [];
        this._registered = /* @__PURE__ */ new Set();
      }
      add(type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        if (this._registered.has(method)) {
          throw new Error(`${method} is already added to this registration`);
        }
        const id = UUID.generateUuid();
        this._registrations.push({
          id,
          method,
          registerOptions: registerOptions || {}
        });
        this._registered.add(method);
      }
      asRegistrationParams() {
        return {
          registrations: this._registrations
        };
      }
    };
    var BulkUnregistration;
    (function(BulkUnregistration2) {
      function create() {
        return new BulkUnregistrationImpl(void 0, []);
      }
      BulkUnregistration2.create = create;
    })(BulkUnregistration || (exports2.BulkUnregistration = BulkUnregistration = {}));
    var BulkUnregistrationImpl = class {
      constructor(_connection, unregistrations) {
        this._connection = _connection;
        this._unregistrations = /* @__PURE__ */ new Map();
        unregistrations.forEach((unregistration) => {
          this._unregistrations.set(unregistration.method, unregistration);
        });
      }
      get isAttached() {
        return !!this._connection;
      }
      attach(connection2) {
        this._connection = connection2;
      }
      add(unregistration) {
        this._unregistrations.set(unregistration.method, unregistration);
      }
      dispose() {
        let unregistrations = [];
        for (let unregistration of this._unregistrations.values()) {
          unregistrations.push(unregistration);
        }
        let params = {
          unregisterations: unregistrations
        };
        this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).catch(() => {
          this._connection.console.info(`Bulk unregistration failed.`);
        });
      }
      disposeSingle(arg) {
        const method = Is.string(arg) ? arg : arg.method;
        const unregistration = this._unregistrations.get(method);
        if (!unregistration) {
          return false;
        }
        let params = {
          unregisterations: [unregistration]
        };
        this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(() => {
          this._unregistrations.delete(method);
        }, (_error) => {
          this._connection.console.info(`Un-registering request handler for ${unregistration.id} failed.`);
        });
        return true;
      }
    };
    var RemoteClientImpl = class {
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      register(typeOrRegistrations, registerOptionsOrType, registerOptions) {
        if (typeOrRegistrations instanceof BulkRegistrationImpl) {
          return this.registerMany(typeOrRegistrations);
        } else if (typeOrRegistrations instanceof BulkUnregistrationImpl) {
          return this.registerSingle1(typeOrRegistrations, registerOptionsOrType, registerOptions);
        } else {
          return this.registerSingle2(typeOrRegistrations, registerOptionsOrType);
        }
      }
      registerSingle1(unregistration, type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        const id = UUID.generateUuid();
        let params = {
          registrations: [{ id, method, registerOptions: registerOptions || {} }]
        };
        if (!unregistration.isAttached) {
          unregistration.attach(this.connection);
        }
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
          unregistration.add({ id, method });
          return unregistration;
        }, (_error) => {
          this.connection.console.info(`Registering request handler for ${method} failed.`);
          return Promise.reject(_error);
        });
      }
      registerSingle2(type, registerOptions) {
        const method = Is.string(type) ? type : type.method;
        const id = UUID.generateUuid();
        let params = {
          registrations: [{ id, method, registerOptions: registerOptions || {} }]
        };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
          return vscode_languageserver_protocol_1.Disposable.create(() => {
            this.unregisterSingle(id, method).catch(() => {
              this.connection.console.info(`Un-registering capability with id ${id} failed.`);
            });
          });
        }, (_error) => {
          this.connection.console.info(`Registering request handler for ${method} failed.`);
          return Promise.reject(_error);
        });
      }
      unregisterSingle(id, method) {
        let params = {
          unregisterations: [{ id, method }]
        };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).catch(() => {
          this.connection.console.info(`Un-registering request handler for ${id} failed.`);
        });
      }
      registerMany(registrations) {
        let params = registrations.asRegistrationParams();
        return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then(() => {
          return new BulkUnregistrationImpl(this._connection, params.registrations.map((registration) => {
            return { id: registration.id, method: registration.method };
          }));
        }, (_error) => {
          this.connection.console.info(`Bulk registration failed.`);
          return Promise.reject(_error);
        });
      }
    };
    var _RemoteWorkspaceImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      applyEdit(paramOrEdit) {
        function isApplyWorkspaceEditParams(value) {
          return value && !!value.edit;
        }
        let params = isApplyWorkspaceEditParams(paramOrEdit) ? paramOrEdit : { edit: paramOrEdit };
        return this.connection.sendRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, params);
      }
    };
    var RemoteWorkspaceImpl = (0, fileOperations_1.FileOperationsFeature)((0, workspaceFolder_1.WorkspaceFoldersFeature)((0, configuration_1.ConfigurationFeature)(_RemoteWorkspaceImpl)));
    var TracerImpl = class {
      constructor() {
        this._trace = vscode_languageserver_protocol_1.Trace.Off;
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      set trace(value) {
        this._trace = value;
      }
      log(message, verbose) {
        if (this._trace === vscode_languageserver_protocol_1.Trace.Off) {
          return;
        }
        this.connection.sendNotification(vscode_languageserver_protocol_1.LogTraceNotification.type, {
          message,
          verbose: this._trace === vscode_languageserver_protocol_1.Trace.Verbose ? verbose : void 0
        }).catch(() => {
        });
      }
    };
    var TelemetryImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      logEvent(data) {
        this.connection.sendNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, data).catch(() => {
          this.connection.console.log(`Sending TelemetryEventNotification failed`);
        });
      }
    };
    var _LanguagesImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      attachWorkDoneProgress(params) {
        return (0, progress_1.attachWorkDone)(this.connection, params);
      }
      attachPartialResultProgress(_type, params) {
        return (0, progress_1.attachPartialResult)(this.connection, params);
      }
    };
    exports2._LanguagesImpl = _LanguagesImpl;
    var LanguagesImpl = (0, foldingRange_1.FoldingRangeFeature)((0, moniker_1.MonikerFeature)((0, diagnostic_1.DiagnosticFeature)((0, inlayHint_1.InlayHintFeature)((0, inlineValue_1.InlineValueFeature)((0, typeHierarchy_1.TypeHierarchyFeature)((0, linkedEditingRange_1.LinkedEditingRangeFeature)((0, semanticTokens_1.SemanticTokensFeature)((0, callHierarchy_1.CallHierarchyFeature)(_LanguagesImpl)))))))));
    var _NotebooksImpl = class {
      constructor() {
      }
      attach(connection2) {
        this._connection = connection2;
      }
      get connection() {
        if (!this._connection) {
          throw new Error("Remote is not attached to a connection yet.");
        }
        return this._connection;
      }
      initialize(_capabilities) {
      }
      fillServerCapabilities(_capabilities) {
      }
      attachWorkDoneProgress(params) {
        return (0, progress_1.attachWorkDone)(this.connection, params);
      }
      attachPartialResultProgress(_type, params) {
        return (0, progress_1.attachPartialResult)(this.connection, params);
      }
    };
    exports2._NotebooksImpl = _NotebooksImpl;
    var NotebooksImpl = (0, notebook_1.NotebookSyncFeature)(_NotebooksImpl);
    function combineConsoleFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineConsoleFeatures = combineConsoleFeatures;
    function combineTelemetryFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineTelemetryFeatures = combineTelemetryFeatures;
    function combineTracerFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineTracerFeatures = combineTracerFeatures;
    function combineClientFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineClientFeatures = combineClientFeatures;
    function combineWindowFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineWindowFeatures = combineWindowFeatures;
    function combineWorkspaceFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineWorkspaceFeatures = combineWorkspaceFeatures;
    function combineLanguagesFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineLanguagesFeatures = combineLanguagesFeatures;
    function combineNotebooksFeatures(one, two) {
      return function(Base) {
        return two(one(Base));
      };
    }
    exports2.combineNotebooksFeatures = combineNotebooksFeatures;
    function combineFeatures(one, two) {
      function combine(one2, two2, func) {
        if (one2 && two2) {
          return func(one2, two2);
        } else if (one2) {
          return one2;
        } else {
          return two2;
        }
      }
      let result = {
        __brand: "features",
        console: combine(one.console, two.console, combineConsoleFeatures),
        tracer: combine(one.tracer, two.tracer, combineTracerFeatures),
        telemetry: combine(one.telemetry, two.telemetry, combineTelemetryFeatures),
        client: combine(one.client, two.client, combineClientFeatures),
        window: combine(one.window, two.window, combineWindowFeatures),
        workspace: combine(one.workspace, two.workspace, combineWorkspaceFeatures),
        languages: combine(one.languages, two.languages, combineLanguagesFeatures),
        notebooks: combine(one.notebooks, two.notebooks, combineNotebooksFeatures)
      };
      return result;
    }
    exports2.combineFeatures = combineFeatures;
    function createConnection2(connectionFactory, watchDog, factories) {
      const logger = factories && factories.console ? new (factories.console(RemoteConsoleImpl))() : new RemoteConsoleImpl();
      const connection2 = connectionFactory(logger);
      logger.rawAttach(connection2);
      const tracer = factories && factories.tracer ? new (factories.tracer(TracerImpl))() : new TracerImpl();
      const telemetry = factories && factories.telemetry ? new (factories.telemetry(TelemetryImpl))() : new TelemetryImpl();
      const client = factories && factories.client ? new (factories.client(RemoteClientImpl))() : new RemoteClientImpl();
      const remoteWindow = factories && factories.window ? new (factories.window(RemoteWindowImpl))() : new RemoteWindowImpl();
      const workspace = factories && factories.workspace ? new (factories.workspace(RemoteWorkspaceImpl))() : new RemoteWorkspaceImpl();
      const languages = factories && factories.languages ? new (factories.languages(LanguagesImpl))() : new LanguagesImpl();
      const notebooks = factories && factories.notebooks ? new (factories.notebooks(NotebooksImpl))() : new NotebooksImpl();
      const allRemotes = [logger, tracer, telemetry, client, remoteWindow, workspace, languages, notebooks];
      function asPromise(value) {
        if (value instanceof Promise) {
          return value;
        } else if (Is.thenable(value)) {
          return new Promise((resolve, reject) => {
            value.then((resolved) => resolve(resolved), (error) => reject(error));
          });
        } else {
          return Promise.resolve(value);
        }
      }
      let shutdownHandler = void 0;
      let initializeHandler = void 0;
      let exitHandler = void 0;
      let protocolConnection = {
        listen: () => connection2.listen(),
        sendRequest: (type, ...params) => connection2.sendRequest(Is.string(type) ? type : type.method, ...params),
        onRequest: (type, handler) => connection2.onRequest(type, handler),
        sendNotification: (type, param) => {
          const method = Is.string(type) ? type : type.method;
          return connection2.sendNotification(method, param);
        },
        onNotification: (type, handler) => connection2.onNotification(type, handler),
        onProgress: connection2.onProgress,
        sendProgress: connection2.sendProgress,
        onInitialize: (handler) => {
          initializeHandler = handler;
          return {
            dispose: () => {
              initializeHandler = void 0;
            }
          };
        },
        onInitialized: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.InitializedNotification.type, handler),
        onShutdown: (handler) => {
          shutdownHandler = handler;
          return {
            dispose: () => {
              shutdownHandler = void 0;
            }
          };
        },
        onExit: (handler) => {
          exitHandler = handler;
          return {
            dispose: () => {
              exitHandler = void 0;
            }
          };
        },
        get console() {
          return logger;
        },
        get telemetry() {
          return telemetry;
        },
        get tracer() {
          return tracer;
        },
        get client() {
          return client;
        },
        get window() {
          return remoteWindow;
        },
        get workspace() {
          return workspace;
        },
        get languages() {
          return languages;
        },
        get notebooks() {
          return notebooks;
        },
        onDidChangeConfiguration: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, handler),
        onDidChangeWatchedFiles: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, handler),
        __textDocumentSync: void 0,
        onDidOpenTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, handler),
        onDidChangeTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, handler),
        onDidCloseTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, handler),
        onWillSaveTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, handler),
        onWillSaveTextDocumentWaitUntil: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, handler),
        onDidSaveTextDocument: (handler) => connection2.onNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, handler),
        sendDiagnostics: (params) => connection2.sendNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, params),
        onHover: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.HoverRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onCompletion: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CompletionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onCompletionResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, handler),
        onSignatureHelp: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onDeclaration: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DeclarationRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDefinition: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onTypeDefinition: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onImplementation: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onReferences: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDocumentHighlight: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDocumentSymbol: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onWorkspaceSymbol: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onWorkspaceSymbolResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolResolveRequest.type, handler),
        onCodeAction: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onCodeActionResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeActionResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onCodeLens: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onCodeLensResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentFormatting: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onDocumentRangeFormatting: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onDocumentOnTypeFormatting: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onRenameRequest: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.RenameRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        onPrepareRename: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.PrepareRenameRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentLinks: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onDocumentLinkResolve: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, (params, cancel) => {
          return handler(params, cancel);
        }),
        onDocumentColor: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.DocumentColorRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onColorPresentation: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onFoldingRanges: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.FoldingRangeRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onSelectionRanges: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.SelectionRangeRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), (0, progress_1.attachPartialResult)(connection2, params));
        }),
        onExecuteCommand: (handler) => connection2.onRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, (params, cancel) => {
          return handler(params, cancel, (0, progress_1.attachWorkDone)(connection2, params), void 0);
        }),
        dispose: () => connection2.dispose()
      };
      for (let remote of allRemotes) {
        remote.attach(protocolConnection);
      }
      connection2.onRequest(vscode_languageserver_protocol_1.InitializeRequest.type, (params) => {
        watchDog.initialize(params);
        if (Is.string(params.trace)) {
          tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.trace);
        }
        for (let remote of allRemotes) {
          remote.initialize(params.capabilities);
        }
        if (initializeHandler) {
          let result = initializeHandler(params, new vscode_languageserver_protocol_1.CancellationTokenSource().token, (0, progress_1.attachWorkDone)(connection2, params), void 0);
          return asPromise(result).then((value) => {
            if (value instanceof vscode_languageserver_protocol_1.ResponseError) {
              return value;
            }
            let result2 = value;
            if (!result2) {
              result2 = { capabilities: {} };
            }
            let capabilities = result2.capabilities;
            if (!capabilities) {
              capabilities = {};
              result2.capabilities = capabilities;
            }
            if (capabilities.textDocumentSync === void 0 || capabilities.textDocumentSync === null) {
              capabilities.textDocumentSync = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
            } else if (!Is.number(capabilities.textDocumentSync) && !Is.number(capabilities.textDocumentSync.change)) {
              capabilities.textDocumentSync.change = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
            }
            for (let remote of allRemotes) {
              remote.fillServerCapabilities(capabilities);
            }
            return result2;
          });
        } else {
          let result = { capabilities: { textDocumentSync: vscode_languageserver_protocol_1.TextDocumentSyncKind.None } };
          for (let remote of allRemotes) {
            remote.fillServerCapabilities(result.capabilities);
          }
          return result;
        }
      });
      connection2.onRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, () => {
        watchDog.shutdownReceived = true;
        if (shutdownHandler) {
          return shutdownHandler(new vscode_languageserver_protocol_1.CancellationTokenSource().token);
        } else {
          return void 0;
        }
      });
      connection2.onNotification(vscode_languageserver_protocol_1.ExitNotification.type, () => {
        try {
          if (exitHandler) {
            exitHandler();
          }
        } finally {
          if (watchDog.shutdownReceived) {
            watchDog.exit(0);
          } else {
            watchDog.exit(1);
          }
        }
      });
      connection2.onNotification(vscode_languageserver_protocol_1.SetTraceNotification.type, (params) => {
        tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.value);
      });
      return protocolConnection;
    }
    exports2.createConnection = createConnection2;
  }
});

// node_modules/vscode-languageserver/lib/node/files.js
var require_files = __commonJS({
  "node_modules/vscode-languageserver/lib/node/files.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveModulePath = exports2.FileSystem = exports2.resolveGlobalYarnPath = exports2.resolveGlobalNodePath = exports2.resolve = exports2.uriToFilePath = void 0;
    var url = require("url");
    var path8 = require("path");
    var fs = require("fs");
    var child_process_1 = require("child_process");
    function uriToFilePath(uri) {
      let parsed = url.parse(uri);
      if (parsed.protocol !== "file:" || !parsed.path) {
        return void 0;
      }
      let segments = parsed.path.split("/");
      for (var i = 0, len = segments.length; i < len; i++) {
        segments[i] = decodeURIComponent(segments[i]);
      }
      if (process.platform === "win32" && segments.length > 1) {
        let first = segments[0];
        let second = segments[1];
        if (first.length === 0 && second.length > 1 && second[1] === ":") {
          segments.shift();
        }
      }
      return path8.normalize(segments.join("/"));
    }
    exports2.uriToFilePath = uriToFilePath;
    function isWindows() {
      return process.platform === "win32";
    }
    function resolve(moduleName, nodePath, cwd, tracer) {
      const nodePathKey = "NODE_PATH";
      const app = [
        "var p = process;",
        "p.on('message',function(m){",
        "if(m.c==='e'){",
        "p.exit(0);",
        "}",
        "else if(m.c==='rs'){",
        "try{",
        "var r=require.resolve(m.a);",
        "p.send({c:'r',s:true,r:r});",
        "}",
        "catch(err){",
        "p.send({c:'r',s:false});",
        "}",
        "}",
        "});"
      ].join("");
      return new Promise((resolve2, reject) => {
        let env = process.env;
        let newEnv = /* @__PURE__ */ Object.create(null);
        Object.keys(env).forEach((key) => newEnv[key] = env[key]);
        if (nodePath && fs.existsSync(nodePath)) {
          if (newEnv[nodePathKey]) {
            newEnv[nodePathKey] = nodePath + path8.delimiter + newEnv[nodePathKey];
          } else {
            newEnv[nodePathKey] = nodePath;
          }
          if (tracer) {
            tracer(`NODE_PATH value is: ${newEnv[nodePathKey]}`);
          }
        }
        newEnv["ELECTRON_RUN_AS_NODE"] = "1";
        try {
          let cp = (0, child_process_1.fork)("", [], {
            cwd,
            env: newEnv,
            execArgv: ["-e", app]
          });
          if (cp.pid === void 0) {
            reject(new Error(`Starting process to resolve node module  ${moduleName} failed`));
            return;
          }
          cp.on("error", (error) => {
            reject(error);
          });
          cp.on("message", (message2) => {
            if (message2.c === "r") {
              cp.send({ c: "e" });
              if (message2.s) {
                resolve2(message2.r);
              } else {
                reject(new Error(`Failed to resolve module: ${moduleName}`));
              }
            }
          });
          let message = {
            c: "rs",
            a: moduleName
          };
          cp.send(message);
        } catch (error) {
          reject(error);
        }
      });
    }
    exports2.resolve = resolve;
    function resolveGlobalNodePath(tracer) {
      let npmCommand = "npm";
      const env = /* @__PURE__ */ Object.create(null);
      Object.keys(process.env).forEach((key) => env[key] = process.env[key]);
      env["NO_UPDATE_NOTIFIER"] = "true";
      const options = {
        encoding: "utf8",
        env
      };
      if (isWindows()) {
        npmCommand = "npm.cmd";
        options.shell = true;
      }
      let handler = () => {
      };
      try {
        process.on("SIGPIPE", handler);
        let stdout = (0, child_process_1.spawnSync)(npmCommand, ["config", "get", "prefix"], options).stdout;
        if (!stdout) {
          if (tracer) {
            tracer(`'npm config get prefix' didn't return a value.`);
          }
          return void 0;
        }
        let prefix = stdout.trim();
        if (tracer) {
          tracer(`'npm config get prefix' value is: ${prefix}`);
        }
        if (prefix.length > 0) {
          if (isWindows()) {
            return path8.join(prefix, "node_modules");
          } else {
            return path8.join(prefix, "lib", "node_modules");
          }
        }
        return void 0;
      } catch (err) {
        return void 0;
      } finally {
        process.removeListener("SIGPIPE", handler);
      }
    }
    exports2.resolveGlobalNodePath = resolveGlobalNodePath;
    function resolveGlobalYarnPath(tracer) {
      let yarnCommand = "yarn";
      let options = {
        encoding: "utf8"
      };
      if (isWindows()) {
        yarnCommand = "yarn.cmd";
        options.shell = true;
      }
      let handler = () => {
      };
      try {
        process.on("SIGPIPE", handler);
        let results = (0, child_process_1.spawnSync)(yarnCommand, ["global", "dir", "--json"], options);
        let stdout = results.stdout;
        if (!stdout) {
          if (tracer) {
            tracer(`'yarn global dir' didn't return a value.`);
            if (results.stderr) {
              tracer(results.stderr);
            }
          }
          return void 0;
        }
        let lines = stdout.trim().split(/\r?\n/);
        for (let line of lines) {
          try {
            let yarn = JSON.parse(line);
            if (yarn.type === "log") {
              return path8.join(yarn.data, "node_modules");
            }
          } catch (e) {
          }
        }
        return void 0;
      } catch (err) {
        return void 0;
      } finally {
        process.removeListener("SIGPIPE", handler);
      }
    }
    exports2.resolveGlobalYarnPath = resolveGlobalYarnPath;
    var FileSystem;
    (function(FileSystem2) {
      let _isCaseSensitive = void 0;
      function isCaseSensitive() {
        if (_isCaseSensitive !== void 0) {
          return _isCaseSensitive;
        }
        if (process.platform === "win32") {
          _isCaseSensitive = false;
        } else {
          _isCaseSensitive = !fs.existsSync(__filename.toUpperCase()) || !fs.existsSync(__filename.toLowerCase());
        }
        return _isCaseSensitive;
      }
      FileSystem2.isCaseSensitive = isCaseSensitive;
      function isParent(parent, child) {
        if (isCaseSensitive()) {
          return path8.normalize(child).indexOf(path8.normalize(parent)) === 0;
        } else {
          return path8.normalize(child).toLowerCase().indexOf(path8.normalize(parent).toLowerCase()) === 0;
        }
      }
      FileSystem2.isParent = isParent;
    })(FileSystem || (exports2.FileSystem = FileSystem = {}));
    function resolveModulePath(workspaceRoot2, moduleName, nodePath, tracer) {
      if (nodePath) {
        if (!path8.isAbsolute(nodePath)) {
          nodePath = path8.join(workspaceRoot2, nodePath);
        }
        return resolve(moduleName, nodePath, nodePath, tracer).then((value) => {
          if (FileSystem.isParent(nodePath, value)) {
            return value;
          } else {
            return Promise.reject(new Error(`Failed to load ${moduleName} from node path location.`));
          }
        }).then(void 0, (_error) => {
          return resolve(moduleName, resolveGlobalNodePath(tracer), workspaceRoot2, tracer);
        });
      } else {
        return resolve(moduleName, resolveGlobalNodePath(tracer), workspaceRoot2, tracer);
      }
    }
    exports2.resolveModulePath = resolveModulePath;
  }
});

// node_modules/vscode-languageserver-protocol/node.js
var require_node2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require_main3();
  }
});

// node_modules/vscode-languageserver/lib/common/inlineCompletion.proposed.js
var require_inlineCompletion_proposed = __commonJS({
  "node_modules/vscode-languageserver/lib/common/inlineCompletion.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InlineCompletionFeature = void 0;
    var vscode_languageserver_protocol_1 = require_main3();
    var InlineCompletionFeature = (Base) => {
      return class extends Base {
        get inlineCompletion() {
          return {
            on: (handler) => {
              return this.connection.onRequest(vscode_languageserver_protocol_1.InlineCompletionRequest.type, (params, cancel) => {
                return handler(params, cancel, this.attachWorkDoneProgress(params));
              });
            }
          };
        }
      };
    };
    exports2.InlineCompletionFeature = InlineCompletionFeature;
  }
});

// node_modules/vscode-languageserver/lib/common/api.js
var require_api3 = __commonJS({
  "node_modules/vscode-languageserver/lib/common/api.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProposedFeatures = exports2.NotebookDocuments = exports2.TextDocuments = exports2.SemanticTokensBuilder = void 0;
    var semanticTokens_1 = require_semanticTokens();
    Object.defineProperty(exports2, "SemanticTokensBuilder", { enumerable: true, get: function() {
      return semanticTokens_1.SemanticTokensBuilder;
    } });
    var ic = require_inlineCompletion_proposed();
    __exportStar(require_main3(), exports2);
    var textDocuments_1 = require_textDocuments();
    Object.defineProperty(exports2, "TextDocuments", { enumerable: true, get: function() {
      return textDocuments_1.TextDocuments;
    } });
    var notebook_1 = require_notebook();
    Object.defineProperty(exports2, "NotebookDocuments", { enumerable: true, get: function() {
      return notebook_1.NotebookDocuments;
    } });
    __exportStar(require_server(), exports2);
    var ProposedFeatures2;
    (function(ProposedFeatures3) {
      ProposedFeatures3.all = {
        __brand: "features",
        languages: ic.InlineCompletionFeature
      };
    })(ProposedFeatures2 || (exports2.ProposedFeatures = ProposedFeatures2 = {}));
  }
});

// node_modules/vscode-languageserver/lib/node/main.js
var require_main4 = __commonJS({
  "node_modules/vscode-languageserver/lib/node/main.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createConnection = exports2.Files = void 0;
    var node_util_1 = require("node:util");
    var Is = require_is();
    var server_1 = require_server();
    var fm = require_files();
    var node_1 = require_node2();
    __exportStar(require_node2(), exports2);
    __exportStar(require_api3(), exports2);
    var Files;
    (function(Files2) {
      Files2.uriToFilePath = fm.uriToFilePath;
      Files2.resolveGlobalNodePath = fm.resolveGlobalNodePath;
      Files2.resolveGlobalYarnPath = fm.resolveGlobalYarnPath;
      Files2.resolve = fm.resolve;
      Files2.resolveModulePath = fm.resolveModulePath;
    })(Files || (exports2.Files = Files = {}));
    var _protocolConnection;
    function endProtocolConnection() {
      if (_protocolConnection === void 0) {
        return;
      }
      try {
        _protocolConnection.end();
      } catch (_err) {
      }
    }
    var _shutdownReceived = false;
    var exitTimer = void 0;
    function setupExitTimer() {
      const argName = "--clientProcessId";
      function runTimer(value) {
        try {
          let processId = parseInt(value);
          if (!isNaN(processId)) {
            exitTimer = setInterval(() => {
              try {
                process.kill(processId, 0);
              } catch (ex) {
                endProtocolConnection();
                process.exit(_shutdownReceived ? 0 : 1);
              }
            }, 3e3);
          }
        } catch (e) {
        }
      }
      for (let i = 2; i < process.argv.length; i++) {
        let arg = process.argv[i];
        if (arg === argName && i + 1 < process.argv.length) {
          runTimer(process.argv[i + 1]);
          return;
        } else {
          let args = arg.split("=");
          if (args[0] === argName) {
            runTimer(args[1]);
          }
        }
      }
    }
    setupExitTimer();
    var watchDog = {
      initialize: (params) => {
        const processId = params.processId;
        if (Is.number(processId) && exitTimer === void 0) {
          setInterval(() => {
            try {
              process.kill(processId, 0);
            } catch (ex) {
              process.exit(_shutdownReceived ? 0 : 1);
            }
          }, 3e3);
        }
      },
      get shutdownReceived() {
        return _shutdownReceived;
      },
      set shutdownReceived(value) {
        _shutdownReceived = value;
      },
      exit: (code) => {
        endProtocolConnection();
        process.exit(code);
      }
    };
    function createConnection2(arg1, arg2, arg3, arg4) {
      let factories;
      let input;
      let output;
      let options;
      if (arg1 !== void 0 && arg1.__brand === "features") {
        factories = arg1;
        arg1 = arg2;
        arg2 = arg3;
        arg3 = arg4;
      }
      if (node_1.ConnectionStrategy.is(arg1) || node_1.ConnectionOptions.is(arg1)) {
        options = arg1;
      } else {
        input = arg1;
        output = arg2;
        options = arg3;
      }
      return _createConnection(input, output, options, factories);
    }
    exports2.createConnection = createConnection2;
    function _createConnection(input, output, options, factories) {
      let stdio = false;
      if (!input && !output && process.argv.length > 2) {
        let port = void 0;
        let pipeName = void 0;
        let argv = process.argv.slice(2);
        for (let i = 0; i < argv.length; i++) {
          let arg = argv[i];
          if (arg === "--node-ipc") {
            input = new node_1.IPCMessageReader(process);
            output = new node_1.IPCMessageWriter(process);
            break;
          } else if (arg === "--stdio") {
            stdio = true;
            input = process.stdin;
            output = process.stdout;
            break;
          } else if (arg === "--socket") {
            port = parseInt(argv[i + 1]);
            break;
          } else if (arg === "--pipe") {
            pipeName = argv[i + 1];
            break;
          } else {
            var args = arg.split("=");
            if (args[0] === "--socket") {
              port = parseInt(args[1]);
              break;
            } else if (args[0] === "--pipe") {
              pipeName = args[1];
              break;
            }
          }
        }
        if (port) {
          let transport = (0, node_1.createServerSocketTransport)(port);
          input = transport[0];
          output = transport[1];
        } else if (pipeName) {
          let transport = (0, node_1.createServerPipeTransport)(pipeName);
          input = transport[0];
          output = transport[1];
        }
      }
      var commandLineMessage = "Use arguments of createConnection or set command line parameters: '--node-ipc', '--stdio' or '--socket={number}'";
      if (!input) {
        throw new Error("Connection input stream is not set. " + commandLineMessage);
      }
      if (!output) {
        throw new Error("Connection output stream is not set. " + commandLineMessage);
      }
      if (Is.func(input.read) && Is.func(input.on)) {
        let inputStream = input;
        inputStream.on("end", () => {
          endProtocolConnection();
          process.exit(_shutdownReceived ? 0 : 1);
        });
        inputStream.on("close", () => {
          endProtocolConnection();
          process.exit(_shutdownReceived ? 0 : 1);
        });
      }
      const connectionFactory = (logger) => {
        const result = (0, node_1.createProtocolConnection)(input, output, logger, options);
        if (stdio) {
          patchConsole(logger);
        }
        return result;
      };
      return (0, server_1.createConnection)(connectionFactory, watchDog, factories);
    }
    function patchConsole(logger) {
      function serialize(args) {
        return args.map((arg) => typeof arg === "string" ? arg : (0, node_util_1.inspect)(arg)).join(" ");
      }
      const counters = /* @__PURE__ */ new Map();
      console.assert = function assert(assertion, ...args) {
        if (assertion) {
          return;
        }
        if (args.length === 0) {
          logger.error("Assertion failed");
        } else {
          const [message, ...rest] = args;
          logger.error(`Assertion failed: ${message} ${serialize(rest)}`);
        }
      };
      console.count = function count(label = "default") {
        const message = String(label);
        let counter = counters.get(message) ?? 0;
        counter += 1;
        counters.set(message, counter);
        logger.log(`${message}: ${message}`);
      };
      console.countReset = function countReset(label) {
        if (label === void 0) {
          counters.clear();
        } else {
          counters.delete(String(label));
        }
      };
      console.debug = function debug(...args) {
        logger.log(serialize(args));
      };
      console.dir = function dir(arg, options) {
        logger.log((0, node_util_1.inspect)(arg, options));
      };
      console.log = function log(...args) {
        logger.log(serialize(args));
      };
      console.error = function error(...args) {
        logger.error(serialize(args));
      };
      console.trace = function trace(...args) {
        const stack = new Error().stack.replace(/(.+\n){2}/, "");
        let message = "Trace";
        if (args.length !== 0) {
          message += `: ${serialize(args)}`;
        }
        logger.log(`${message}
${stack}`);
      };
      console.warn = function warn(...args) {
        logger.warn(serialize(args));
      };
    }
  }
});

// node_modules/vscode-languageserver/node.js
var require_node3 = __commonJS({
  "node_modules/vscode-languageserver/node.js"(exports2, module2) {
    "use strict";
    module2.exports = require_main4();
  }
});

// src/index.ts
var import_node10 = __toESM(require_node3(), 1);

// node_modules/vscode-languageserver-textdocument/lib/esm/main.js
var FullTextDocument = class _FullTextDocument {
  constructor(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(range2) {
    if (range2) {
      const start = this.offsetAt(range2.start);
      const end = this.offsetAt(range2.end);
      return this._content.substring(start, end);
    }
    return this._content;
  }
  update(changes, version) {
    for (const change of changes) {
      if (_FullTextDocument.isIncremental(change)) {
        const range2 = getWellformedRange(change.range);
        const startOffset = this.offsetAt(range2.start);
        const endOffset = this.offsetAt(range2.end);
        this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
        const startLine = Math.max(range2.start.line, 0);
        const endLine = Math.max(range2.end.line, 0);
        let lineOffsets = this._lineOffsets;
        const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
        if (endLine - startLine === addedLineOffsets.length) {
          for (let i = 0, len = addedLineOffsets.length; i < len; i++) {
            lineOffsets[i + startLine + 1] = addedLineOffsets[i];
          }
        } else {
          if (addedLineOffsets.length < 1e4) {
            lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
          } else {
            this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
          }
        }
        const diff = change.text.length - (endOffset - startOffset);
        if (diff !== 0) {
          for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
            lineOffsets[i] = lineOffsets[i] + diff;
          }
        }
      } else if (_FullTextDocument.isFull(change)) {
        this._content = change.text;
        this._lineOffsets = void 0;
      } else {
        throw new Error("Unknown change event received");
      }
    }
    this._version = version;
  }
  getLineOffsets() {
    if (this._lineOffsets === void 0) {
      this._lineOffsets = computeLineOffsets(this._content, true);
    }
    return this._lineOffsets;
  }
  positionAt(offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    const lineOffsets = this.getLineOffsets();
    let low = 0, high = lineOffsets.length;
    if (high === 0) {
      return { line: 0, character: offset };
    }
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    const line = low - 1;
    offset = this.ensureBeforeEOL(offset, lineOffsets[line]);
    return { line, character: offset - lineOffsets[line] };
  }
  offsetAt(position) {
    const lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }
    const lineOffset = lineOffsets[position.line];
    if (position.character <= 0) {
      return lineOffset;
    }
    const nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    const offset = Math.min(lineOffset + position.character, nextLineOffset);
    return this.ensureBeforeEOL(offset, lineOffset);
  }
  ensureBeforeEOL(offset, lineOffset) {
    while (offset > lineOffset && isEOL(this._content.charCodeAt(offset - 1))) {
      offset--;
    }
    return offset;
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(event) {
    const candidate = event;
    return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
  }
  static isFull(event) {
    const candidate = event;
    return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
  }
};
var TextDocument;
(function(TextDocument2) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument(uri, languageId, version, content);
  }
  TextDocument2.create = create;
  function update(document, changes, version) {
    if (document instanceof FullTextDocument) {
      document.update(changes, version);
      return document;
    } else {
      throw new Error("TextDocument.update: document must be created by TextDocument.create");
    }
  }
  TextDocument2.update = update;
  function applyEdits(document, edits) {
    const text = document.getText();
    const sortedEdits = mergeSort(edits.map(getWellformedEdit), (a, b) => {
      const diff = a.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a.range.start.character - b.range.start.character;
      }
      return diff;
    });
    let lastModifiedOffset = 0;
    const spans = [];
    for (const e of sortedEdits) {
      const startOffset = document.offsetAt(e.range.start);
      if (startOffset < lastModifiedOffset) {
        throw new Error("Overlapping edit");
      } else if (startOffset > lastModifiedOffset) {
        spans.push(text.substring(lastModifiedOffset, startOffset));
      }
      if (e.newText.length) {
        spans.push(e.newText);
      }
      lastModifiedOffset = document.offsetAt(e.range.end);
    }
    spans.push(text.substr(lastModifiedOffset));
    return spans.join("");
  }
  TextDocument2.applyEdits = applyEdits;
})(TextDocument || (TextDocument = {}));
function mergeSort(data, compare) {
  if (data.length <= 1) {
    return data;
  }
  const p = data.length / 2 | 0;
  const left = data.slice(0, p);
  const right = data.slice(p);
  mergeSort(left, compare);
  mergeSort(right, compare);
  let leftIdx = 0;
  let rightIdx = 0;
  let i = 0;
  while (leftIdx < left.length && rightIdx < right.length) {
    const ret = compare(left[leftIdx], right[rightIdx]);
    if (ret <= 0) {
      data[i++] = left[leftIdx++];
    } else {
      data[i++] = right[rightIdx++];
    }
  }
  while (leftIdx < left.length) {
    data[i++] = left[leftIdx++];
  }
  while (rightIdx < right.length) {
    data[i++] = right[rightIdx++];
  }
  return data;
}
function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
  const result = isAtLineStart ? [textOffset] : [];
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (isEOL(ch)) {
      if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
        i++;
      }
      result.push(textOffset + i + 1);
    }
  }
  return result;
}
function isEOL(char) {
  return char === 13 || char === 10;
}
function getWellformedRange(range2) {
  const start = range2.start;
  const end = range2.end;
  if (start.line > end.line || start.line === end.line && start.character > end.character) {
    return { start: end, end: start };
  }
  return range2;
}
function getWellformedEdit(textEdit) {
  const range2 = getWellformedRange(textEdit.range);
  if (range2 !== textEdit.range) {
    return { newText: textEdit.newText, range: range2 };
  }
  return textEdit;
}

// src/index.ts
var import_node_url11 = require("node:url");
var import_node11 = __toESM(require_node3(), 1);

// src/cacheStore.ts
var import_promises2 = require("node:fs/promises");
var import_node_crypto = require("node:crypto");
var import_node_os = __toESM(require("node:os"), 1);
var import_node_path2 = __toESM(require("node:path"), 1);

// src/projectIndex.ts
var import_promises = require("node:fs/promises");
var import_node_path = __toESM(require("node:path"), 1);

// src/phpResolver.ts
function resolvePhpClassReference(source, classReference) {
  const normalized = classReference.replace(/^\\/, "");
  if (classReference.startsWith("\\")) {
    return normalized;
  }
  const imports = phpImports(source);
  const namespace = /\bnamespace\s+([^;{\s]+)/.exec(source)?.[1];
  if (normalized.includes("\\")) {
    const [head, ...tail] = normalized.split("\\");
    if (head.toLowerCase() === "namespace") {
      return namespace ? [namespace, ...tail].join("\\") : tail.join("\\");
    }
    const importedHead = imports.get(head);
    if (importedHead && tail.length > 0) {
      return `${importedHead}\\${tail.join("\\")}`;
    }
    return namespace ? `${namespace}\\${normalized}` : normalized;
  }
  const imported = imports.get(normalized);
  if (imported) {
    return imported;
  }
  return namespace ? `${namespace}\\${normalized}` : normalized;
}
function phpImports(source) {
  const imports = /* @__PURE__ */ new Map();
  for (const match of source.matchAll(/\buse\s+([^;]+);/g)) {
    const statement = match[1].trim();
    if (/^function\s|^const\s/i.test(statement)) {
      continue;
    }
    const groupMatch = /^([A-Za-z_\\][A-Za-z0-9_\\]*)\\\s*\{([\s\S]+)\}$/.exec(statement);
    if (groupMatch) {
      for (const item of groupMatch[2].split(",")) {
        addPhpImport(imports, `${groupMatch[1]}\\${item.trim()}`);
      }
      continue;
    }
    for (const item of statement.split(",")) {
      addPhpImport(imports, item.trim());
    }
  }
  return imports;
}
function addPhpImport(imports, statement) {
  const aliasMatch = /^([A-Za-z_\\][A-Za-z0-9_\\]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/i.exec(statement);
  const className = aliasMatch ? aliasMatch[1] : statement;
  if (!/^[A-Za-z_\\][A-Za-z0-9_\\]*$/.test(className)) {
    return;
  }
  const alias = aliasMatch?.[2] ?? className.split("\\").at(-1);
  if (alias) {
    imports.set(alias, className);
  }
}

// src/projectIndex.ts
var LARAVEL_INDEX_CACHE_VERSION = 41;
var defaultLaravelFacadeAliases = /* @__PURE__ */ new Map([
  ["App", "Illuminate\\Support\\Facades\\App"],
  ["Arr", "Illuminate\\Support\\Arr"],
  ["Artisan", "Illuminate\\Support\\Facades\\Artisan"],
  ["Auth", "Illuminate\\Support\\Facades\\Auth"],
  ["Blade", "Illuminate\\Support\\Facades\\Blade"],
  ["Broadcast", "Illuminate\\Support\\Facades\\Broadcast"],
  ["Bus", "Illuminate\\Support\\Facades\\Bus"],
  ["Cache", "Illuminate\\Support\\Facades\\Cache"],
  ["Config", "Illuminate\\Support\\Facades\\Config"],
  ["Context", "Illuminate\\Support\\Facades\\Context"],
  ["Cookie", "Illuminate\\Support\\Facades\\Cookie"],
  ["Crypt", "Illuminate\\Support\\Facades\\Crypt"],
  ["Date", "Illuminate\\Support\\Facades\\Date"],
  ["DB", "Illuminate\\Support\\Facades\\DB"],
  ["Eloquent", "Illuminate\\Database\\Eloquent\\Model"],
  ["Event", "Illuminate\\Support\\Facades\\Event"],
  ["File", "Illuminate\\Support\\Facades\\File"],
  ["Gate", "Illuminate\\Support\\Facades\\Gate"],
  ["Hash", "Illuminate\\Support\\Facades\\Hash"],
  ["Http", "Illuminate\\Support\\Facades\\Http"],
  ["Lang", "Illuminate\\Support\\Facades\\Lang"],
  ["Log", "Illuminate\\Support\\Facades\\Log"],
  ["Mail", "Illuminate\\Support\\Facades\\Mail"],
  ["Notification", "Illuminate\\Support\\Facades\\Notification"],
  ["Password", "Illuminate\\Support\\Facades\\Password"],
  ["Process", "Illuminate\\Support\\Facades\\Process"],
  ["Queue", "Illuminate\\Support\\Facades\\Queue"],
  ["RateLimiter", "Illuminate\\Support\\Facades\\RateLimiter"],
  ["Redirect", "Illuminate\\Support\\Facades\\Redirect"],
  ["Request", "Illuminate\\Support\\Facades\\Request"],
  ["Response", "Illuminate\\Support\\Facades\\Response"],
  ["Route", "Illuminate\\Support\\Facades\\Route"],
  ["Schedule", "Illuminate\\Support\\Facades\\Schedule"],
  ["Schema", "Illuminate\\Support\\Facades\\Schema"],
  ["Session", "Illuminate\\Support\\Facades\\Session"],
  ["Storage", "Illuminate\\Support\\Facades\\Storage"],
  ["Str", "Illuminate\\Support\\Str"],
  ["URL", "Illuminate\\Support\\Facades\\URL"],
  ["Validator", "Illuminate\\Support\\Facades\\Validator"],
  ["View", "Illuminate\\Support\\Facades\\View"],
  ["Vite", "Illuminate\\Support\\Facades\\Vite"]
]);
var defaultFacadeAccessors = /* @__PURE__ */ new Map([
  ["App", "app"],
  ["Artisan", "artisan"],
  ["Auth", "auth"],
  ["Blade", "blade.compiler"],
  ["Cache", "cache"],
  ["Config", "config"],
  ["Cookie", "cookie"],
  ["Crypt", "encrypter"],
  ["DB", "db"],
  ["Event", "events"],
  ["File", "files"],
  ["Gate", "gate"],
  ["Hash", "hash"],
  ["Lang", "translator"],
  ["Log", "log"],
  ["Mail", "mailer"],
  ["Queue", "queue"],
  ["Redirect", "redirect"],
  ["Request", "request"],
  ["Response", "ResponseFactory"],
  ["Route", "router"],
  ["Schema", "db.schema"],
  ["Session", "session"],
  ["Storage", "filesystem"],
  ["URL", "url"],
  ["Validator", "validator"],
  ["View", "view"]
]);
function emptyIndex() {
  return {
    authUserModel: null,
    authorization: [],
    artifacts: [],
    bladeComponents: [],
    bladeViews: [],
    commands: [],
    configEntries: [],
    configKeys: [],
    containerBindings: [],
    controllers: [],
    envEntries: [],
    envKeys: [],
    factories: [],
    facades: [],
    inertiaPages: [],
    livewireComponents: [],
    macros: [],
    middleware: [],
    models: [],
    phpClasses: [],
    providers: [],
    routes: [],
    schemaTables: [],
    seeders: [],
    translationKeys: [],
    validationRules: [],
    views: []
  };
}
function emptyIndexCache(rootPath) {
  return {
    files: {},
    rootPath,
    version: LARAVEL_INDEX_CACHE_VERSION
  };
}
async function buildLaravelIndex(rootPath, previousCache = null, options = {}) {
  const cache = previousCache?.rootPath === rootPath && previousCache.version === LARAVEL_INDEX_CACHE_VERSION ? previousCache : emptyIndexCache(rootPath);
  const partialRefresh = Boolean(options.changedFilePaths?.length && cache === previousCache);
  const candidates = partialRefresh ? collectChangedIndexFileCandidates(rootPath, options.changedFilePaths ?? []) : await collectIndexFileCandidates(rootPath);
  const nextFiles = partialRefresh ? { ...cache.files } : {};
  const stats = {
    discoveredFiles: candidates.length,
    indexedFiles: 0,
    removedFiles: 0,
    reusedFiles: 0
  };
  for (const candidate of candidates) {
    const cacheKey = indexFileCacheKey(candidate);
    const signature = await fileSignature(candidate.filePath);
    if (!signature) {
      if (nextFiles[cacheKey]) {
        delete nextFiles[cacheKey];
        stats.removedFiles += 1;
      }
      continue;
    }
    const cached = cache.files[cacheKey];
    if (cached && cached.kind === candidate.kind && cached.signature.mtimeMs === signature.mtimeMs && cached.signature.size === signature.size) {
      nextFiles[cacheKey] = cached;
      stats.reusedFiles += 1;
      continue;
    }
    nextFiles[cacheKey] = {
      entries: await indexFile(rootPath, candidate.filePath, candidate.kind),
      filePath: candidate.filePath,
      kind: candidate.kind,
      signature
    };
    stats.indexedFiles += 1;
  }
  if (!partialRefresh) {
    stats.removedFiles = Object.keys(cache.files).filter((filePath) => !nextFiles[filePath]).length;
  }
  const nextCache = {
    files: nextFiles,
    rootPath,
    version: LARAVEL_INDEX_CACHE_VERSION
  };
  return {
    cache: nextCache,
    index: indexFromCache(nextCache),
    stats
  };
}
function indexFromCache(cache) {
  const authorization = [];
  const artifacts = [];
  const routes = [];
  const bladeComponents = [];
  const bladeViews = [];
  const commands = [];
  const configEntries = [];
  const containerBindings = [];
  const controllers = [];
  const envEntries = [];
  const factories = [];
  const facades = [];
  const inertiaPages = [];
  const livewireComponents = [];
  const macros = [];
  const middleware = [];
  const models = [];
  const phpClasses = [];
  const providers = [];
  const schemaTables = [];
  const seeders = [];
  const translationKeys = [];
  const validationRules = [];
  for (const file of Object.values(cache.files)) {
    switch (file.kind) {
      case "authorization":
        authorization.push(...file.entries);
        break;
      case "artifact":
        artifacts.push(...file.entries);
        break;
      case "bladeComponent":
        bladeComponents.push(...file.entries);
        break;
      case "command":
        commands.push(...file.entries);
        break;
      case "container":
        containerBindings.push(...file.entries);
        break;
      case "controller":
        controllers.push(...file.entries);
        break;
      case "route":
        routes.push(...file.entries);
        break;
      case "view":
        bladeViews.push(...file.entries);
        break;
      case "config":
        configEntries.push(...normalizeConfigEntries(file.filePath, file.entries));
        break;
      case "env":
        envEntries.push(...normalizeEnvEntries(file.filePath, file.entries));
        break;
      case "factory":
        factories.push(...file.entries);
        break;
      case "facade":
        facades.push(...file.entries);
        break;
      case "inertiaPage":
        inertiaPages.push(...file.entries);
        break;
      case "livewireComponent":
        livewireComponents.push(...file.entries);
        break;
      case "macro":
        macros.push(...file.entries);
        break;
      case "middleware":
        middleware.push(...file.entries);
        break;
      case "model":
        models.push(...file.entries);
        break;
      case "phpClass":
        phpClasses.push(...file.entries);
        break;
      case "provider":
        providers.push(...file.entries);
        break;
      case "schema":
        schemaTables.push(...file.entries);
        break;
      case "seeder":
        seeders.push(...file.entries);
        break;
      case "translation":
        translationKeys.push(...file.entries);
        break;
      case "validation":
        validationRules.push(...file.entries);
        break;
    }
  }
  const uniqueBindings = sortBy(uniqueContainerBindings(containerBindings), (binding) => binding.abstract);
  return {
    authUserModel: configEntries.find((entry) => entry.key === "auth.providers.users.model")?.value ?? null,
    authorization: sortBy(uniqueAuthorization(authorization), (auth) => auth.ability),
    artifacts: sortBy(uniqueArtifacts(artifacts), (artifact) => `${artifact.kind}:${artifact.className}`),
    bladeComponents: mergeBladeComponents([...bladeComponentsFromViews(bladeViews), ...bladeComponents]),
    bladeViews: sortBy(bladeViews, (view) => view.name),
    commands: sortBy(uniqueCommands(commands), (command) => command.name),
    containerBindings: uniqueBindings,
    controllers: sortBy(uniqueControllers(controllers), (controller) => controller.className),
    routes: sortBy(routes, (route) => route.name ?? route.uri ?? ""),
    views: uniqueSorted(bladeViews.map((view) => view.name)),
    configEntries: sortBy(uniqueConfigEntries(configEntries), (entry) => entry.key),
    configKeys: uniqueSorted(configEntries.map((entry) => entry.key)),
    envEntries: sortBy(uniqueEnvEntries(envEntries), (entry) => entry.key),
    envKeys: uniqueSorted(envEntries.map((entry) => entry.key)),
    factories: sortBy(uniqueFactories(factories), (factory) => factory.className),
    facades: sortBy(
      resolveFacadeBindings(uniqueFacades([...builtInLaravelFacadeAliases(cache.rootPath), ...facades]), uniqueBindings),
      (facade) => facade.className
    ),
    inertiaPages: sortBy(inertiaPages, (page) => page.name),
    livewireComponents: sortBy(livewireComponents, (component) => component.name),
    macros: sortBy(uniqueMacros(macros), (macro) => `${macro.className}:${macro.method}`),
    middleware: sortBy(uniqueMiddleware(middleware), (entry) => entry.alias),
    models: sortBy(resolveCustomModelBuilders(applyModelTraits(models)), (model) => model.className),
    phpClasses: sortBy(phpClasses, (phpClass) => `${phpClass.fqcn}:${phpClass.filePath}`),
    providers: sortBy(resolveServiceProviderClasses(providers), (provider) => provider.className),
    schemaTables: mergeSchemaTables(schemaTables),
    seeders: sortBy(uniqueSeeders(seeders), (seeder) => seeder.className),
    translationKeys: sortBy(uniqueTranslationKeys(translationKeys), (key) => key.key),
    validationRules: sortBy(validationRules, (rule) => `${rule.filePath}:${rule.className ?? ""}`)
  };
}
function extractRouteInfo(filePath, source, baseContext = {}) {
  const routes = [];
  const groupStack = [];
  const initialContext = {
    ...emptyRouteContext,
    ...baseContext
  };
  let braceDepth = 0;
  let offset = 0;
  for (const line of source.split(/\r?\n/)) {
    const inheritedContext = combineRouteContexts([initialContext, ...groupStack.map((group) => group.context)]);
    const groupContext = parseRouteGroupContext(line);
    const nextBraceDepth = braceDepth + braceDelta(line);
    if (groupContext) {
      groupStack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        context: groupContext
      });
    }
    routes.push(...extractRoutesFromLine(filePath, source, line, offset, inheritedContext));
    braceDepth = nextBraceDepth;
    while (groupStack.length > 0 && braceDepth < groupStack[groupStack.length - 1].closeDepth) {
      groupStack.pop();
    }
    offset += line.length + 1;
  }
  return sortBy(routes, (route) => route.name ?? route.uri ?? "");
}
function extractBladeViewInfo(rootPath, filePath, source) {
  return {
    components: extractBladeComponents(source),
    extends: firstBladeDirectiveString(source, "extends"),
    filePath,
    includes: extractBladeDirectiveStrings(source, [
      "each",
      "include",
      "includeFirst",
      "includeIf",
      "includeUnless",
      "includeWhen"
    ]),
    name: bladeViewName(rootPath, filePath),
    props: extractBladeProps(source),
    pushes: extractBladeDirectiveStrings(source, ["prepend", "push"]),
    sections: extractBladeDirectiveStrings(source, ["section"]),
    stacks: extractBladeDirectiveStrings(source, ["stack"]),
    yields: extractBladeDirectiveStrings(source, ["yield"])
  };
}
function extractBladeClassComponentInfo(rootPath, filePath, source) {
  const className = phpClassName(source);
  if (!className || !isBladeClassComponentPath(rootPath, filePath)) {
    return [];
  }
  return [
    {
      filePath,
      name: bladeClassComponentName(rootPath, filePath),
      props: extractBladeClassProps(source),
      source: "class",
      viewName: componentViewNameFromRender(source) ?? `components.${bladeClassComponentName(rootPath, filePath)}`
    }
  ];
}
function isBladeClassComponentPath(rootPath, filePath) {
  return import_node_path.default.relative(rootPath, filePath).startsWith(import_node_path.default.join("app", "View", "Components") + import_node_path.default.sep);
}
function bladeClassComponentName(rootPath, filePath) {
  return import_node_path.default.relative(import_node_path.default.join(rootPath, "app", "View", "Components"), filePath).replace(/\.php$/, "").split(import_node_path.default.sep).map((part) => kebabCase(part)).join(".");
}
function componentViewNameFromRender(source) {
  const renderMethod = /function\s+render\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\n\s*\}/.exec(source);
  if (!renderMethod) {
    return null;
  }
  return /view\(\s*['"]([^'"]+)['"]/.exec(renderMethod[1])?.[1] ?? null;
}
function extractConstructorProps(source) {
  const constructor = /function\s+__construct\s*\(([\s\S]*?)\)\s*(?::\s*[^{]+)?\{/.exec(source);
  if (!constructor) {
    return [];
  }
  return uniqueSorted(
    [...constructor[1].matchAll(/\$([A-Za-z_][A-Za-z0-9_]*)/g)].map((match) => kebabCase(match[1])).filter((prop) => !["attributes", "slot"].includes(prop))
  );
}
function extractBladeClassProps(source) {
  return uniqueSorted([...extractConstructorProps(source), ...extractPublicProperties(source)]);
}
function extractPublicProperties(source) {
  return uniqueSorted(
    [...source.matchAll(/\bpublic\s+(?:readonly\s+)?(?:static\s+)?(?:[?\\A-Za-z_][\\A-Za-z0-9_|?<>[\]\s]*\s+)?\$([A-Za-z_][A-Za-z0-9_]*)/g)].map((match) => kebabCase(match[1])).filter((prop) => !["attributes", "component-name", "except", "slot"].includes(prop))
  );
}
function bladeViewName(rootPath, filePath) {
  return import_node_path.default.relative(import_node_path.default.join(rootPath, "resources", "views"), filePath).replace(/\.blade\.php$/, "").split(import_node_path.default.sep).join(".");
}
function firstBladeDirectiveString(source, directive) {
  return extractBladeDirectiveStrings(source, [directive])[0] ?? null;
}
function extractBladeDirectiveStrings(source, directives) {
  const directivePattern = directives.map(escapeRegExp).join("|");
  const matches = [
    ...source.matchAll(new RegExp(`@(?:${directivePattern})\\s*\\(\\s*['"]([^'"]+)['"]`, "g"))
  ];
  return uniqueSorted(matches.map((match) => match[1]));
}
function extractBladeComponents(source) {
  const components = /* @__PURE__ */ new Set();
  for (const match of source.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const name = match[1];
    if (!name.startsWith("slot")) {
      components.add(name.replace(/:/g, "."));
    }
  }
  for (const component of extractBladeDirectiveStrings(source, ["component"])) {
    components.add(component.replace(/^components\./, ""));
  }
  return uniqueSorted([...components]);
}
function extractBladeProps(source) {
  return uniqueSorted([...extractBladeArrayDirectiveEntries(source, "props"), ...extractBladeArrayDirectiveEntries(source, "aware")]);
}
function extractBladeArrayDirectiveEntries(source, directive) {
  const propsMatch = new RegExp(`@${directive}\\s*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)`).exec(source);
  if (!propsMatch) {
    return [];
  }
  const props = [];
  for (const propEntry of splitTopLevelArgs(propsMatch[1])) {
    const keyMatch = /^\s*['"]([^'"]+)['"]\s*=>/.exec(propEntry);
    const valueMatch = /^\s*['"]([^'"]+)['"]\s*$/.exec(propEntry);
    if (keyMatch) {
      props.push(keyMatch[1]);
    } else if (valueMatch) {
      props.push(valueMatch[1]);
    }
  }
  return props;
}
var emptyRouteContext = {
  controller: null,
  domain: null,
  middleware: [],
  namePrefix: "",
  uriPrefix: ""
};
function extractRoutesFromLine(filePath, source, line, lineOffset, context) {
  const routes = [];
  const routeRegex = /Route::(get|post|put|patch|delete|options|any|match|resource|apiResource)\s*\(([^)]*)\)([^;]*)/g;
  for (const match of line.matchAll(routeRegex)) {
    const method = match[1];
    const args = splitTopLevelArgs(match[2]);
    const chain = match[3] ?? "";
    const range2 = sourceRangeForOffset(source, lineOffset + (match.index ?? 0), match[0].length);
    if (method === "resource" || method === "apiResource") {
      routes.push(...resourceRoutes(filePath, args, chain, context, range2, method === "apiResource"));
      continue;
    }
    routes.push(routeFromCall(filePath, method, args, chain, context, range2));
  }
  return routes;
}
function routeFromCall(filePath, method, args, chain, context, range2) {
  const chainContext = parseRouteChainContext(chain);
  const combinedContext = combineRouteContexts([context, chainContext]);
  const routeName = stringArgForChainCall(chain, "name");
  const uri = method === "match" ? stringLiteral(args[1]) : stringLiteral(args[0]);
  const methodNames = method === "match" ? stringsInSource(args[0]).map((value) => value.toUpperCase()) : routeMethods(method);
  const actionArg = method === "match" ? args[2]?.trim() ?? null : args[1]?.trim() ?? null;
  const controllerAction = actionArg ? stringLiteral(actionArg) : null;
  return {
    action: combinedContext.controller && controllerAction ? `${combinedContext.controller}@${controllerAction}` : actionArg,
    domain: combinedContext.domain,
    filePath,
    methods: methodNames,
    middleware: uniqueSorted(combinedContext.middleware),
    name: routeName ? `${context.namePrefix}${routeName}` : null,
    namePrefix: context.namePrefix,
    range: range2,
    uri: combineUri(context.uriPrefix, uri),
    uriPrefix: context.uriPrefix
  };
}
function resourceRoutes(filePath, args, chain, context, range2, apiOnly) {
  const resourceName = stringLiteral(args[0]);
  if (!resourceName) {
    return [];
  }
  const controller = args[1]?.trim() ?? null;
  const chainContext = parseRouteChainContext(chain);
  const combinedContext = combineRouteContexts([context, chainContext]);
  const only = listArgForChainCall(chain, "only");
  const except = new Set(listArgForChainCall(chain, "except"));
  const allActions = apiOnly ? ["index", "store", "show", "update", "destroy"] : ["index", "create", "store", "show", "edit", "update", "destroy"];
  const allowedActions = only.length > 0 ? only : allActions;
  return allActions.filter((action) => allowedActions.includes(action)).filter((action) => !except.has(action)).map((action) => ({
    action: controller ? `${controller}@${action}` : null,
    domain: combinedContext.domain,
    filePath,
    methods: resourceMethods(action),
    middleware: uniqueSorted(combinedContext.middleware),
    name: `${combinedContext.namePrefix}${resourceName}.${action}`,
    namePrefix: combinedContext.namePrefix,
    range: range2,
    uri: combineUri(combinedContext.uriPrefix, resourceUri(resourceName, action)),
    uriPrefix: combinedContext.uriPrefix
  }));
}
function parseRouteGroupContext(line) {
  if (!/Route::/.test(line) || !/->group\s*\(/.test(line)) {
    return null;
  }
  const groupChain = line.slice(0, line.indexOf("->group"));
  return parseRouteChainContext(groupChain);
}
function parseRouteChainContext(chain) {
  return {
    controller: serviceReference(firstArgForChainCall(chain, "controller")),
    domain: stringArgForChainCall(chain, "domain"),
    middleware: listArgForChainCall(chain, "middleware"),
    namePrefix: stringArgForChainCall(chain, "name") ?? "",
    uriPrefix: stringArgForChainCall(chain, "prefix") ?? ""
  };
}
function combineRouteContexts(contexts) {
  return contexts.reduce(
    (combined, context) => ({
      controller: context.controller ?? combined.controller,
      domain: context.domain ?? combined.domain,
      middleware: [...combined.middleware, ...context.middleware],
      namePrefix: `${combined.namePrefix}${context.namePrefix}`,
      uriPrefix: combineUri(combined.uriPrefix, context.uriPrefix) ?? ""
    }),
    emptyRouteContext
  );
}
function stringArgForChainCall(source, callName) {
  return stringLiteral(firstArgForChainCall(source, callName));
}
function firstArgForChainCall(source, callName) {
  const match = new RegExp(`(?:->|Route::)${callName}\\s*\\(([^)]*)\\)`).exec(source);
  return match ? splitTopLevelArgs(match[1])[0] : void 0;
}
function listArgForChainCall(source, callName) {
  const match = new RegExp(`(?:->|Route::)${callName}\\s*\\(([^)]*)\\)`).exec(source);
  if (!match) {
    return [];
  }
  return stringsInSource(match[1]);
}
function splitTopLevelArgs(source) {
  const args = [];
  let current = "";
  let depth = 0;
  let quote = null;
  for (let index2 = 0; index2 < source.length; index2 += 1) {
    const char = source[index2];
    const previousChar = source[index2 - 1];
    if (quote) {
      current += char;
      if (char === quote && previousChar !== "\\") {
        quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }
    if (char === "[" || char === "(") {
      depth += 1;
    } else if (char === "]" || char === ")") {
      depth = Math.max(0, depth - 1);
    }
    if (char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    args.push(current.trim());
  }
  return args;
}
function stringLiteral(source) {
  if (!source) {
    return null;
  }
  return stringsInSource(source)[0] ?? null;
}
function stringsInSource(source) {
  return [...source.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]);
}
function routeMethods(method) {
  if (method === "any") {
    return ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
  }
  return [method.toUpperCase()];
}
function resourceMethods(action) {
  switch (action) {
    case "index":
    case "create":
    case "show":
    case "edit":
      return ["GET"];
    case "store":
      return ["POST"];
    case "update":
      return ["PUT", "PATCH"];
    case "destroy":
      return ["DELETE"];
  }
}
function resourceUri(resourceName, action) {
  const parameter = resourceName.split(".").at(-1)?.replace(/s$/, "") ?? resourceName;
  switch (action) {
    case "index":
    case "store":
      return resourceName;
    case "create":
      return `${resourceName}/create`;
    case "show":
    case "update":
    case "destroy":
      return `${resourceName}/{${parameter}}`;
    case "edit":
      return `${resourceName}/{${parameter}}/edit`;
  }
}
function combineUri(prefix, uri) {
  const parts = [prefix, uri].filter((part) => Boolean(part)).map((part) => part.replace(/^\/+|\/+$/g, ""));
  const nonEmptyParts = parts.filter((part) => part.length > 0);
  if (nonEmptyParts.length === 0) {
    return uri;
  }
  return nonEmptyParts.join("/");
}
function sourceRangeForOffset(source, startOffset, length) {
  return {
    end: sourcePositionForOffset(source, startOffset + length),
    start: sourcePositionForOffset(source, startOffset)
  };
}
function sourcePositionForOffset(source, offset) {
  const beforeOffset = source.slice(0, offset);
  const lines = beforeOffset.split(/\r?\n/);
  return {
    character: lines[lines.length - 1].length,
    line: lines.length - 1
  };
}
function braceDelta(source) {
  let delta = 0;
  let quote = null;
  for (let index2 = 0; index2 < source.length; index2 += 1) {
    const char = source[index2];
    const previousChar = source[index2 - 1];
    if (quote) {
      if (char === quote && previousChar !== "\\") {
        quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === "{") {
      delta += 1;
    } else if (char === "}") {
      delta -= 1;
    }
  }
  return delta;
}
function extractConfigKeyInfo(fileName, source) {
  const baseName = import_node_path.default.basename(fileName, ".php");
  const entries = [];
  const arrayStart = configRootArrayStart(source);
  if (arrayStart >= 0) {
    collectConfigArrayKeys(source, arrayStart + 1, [baseName], entries, fileName);
  }
  return sortBy(uniqueConfigEntries(entries), (entry) => entry.key).map(
    (entry) => entry.value ? { ...entry, value: resolvePhpClassReference(source, entry.value) } : entry
  );
}
function configRootArrayStart(source) {
  const returnMatch = /\breturn\b/.exec(source);
  if (returnMatch) {
    const arrayStart = skipConfigInsignificant(source, returnMatch.index + returnMatch[0].length);
    if (source[arrayStart] === "[") {
      return arrayStart;
    }
  }
  return source.indexOf("[");
}
function collectConfigArrayKeys(source, startIndex, prefix, entries, filePath) {
  let index2 = startIndex;
  while (index2 < source.length) {
    index2 = skipConfigInsignificant(source, index2);
    if (source[index2] === "]") {
      return index2 + 1;
    }
    if (source[index2] === ",") {
      index2 += 1;
      continue;
    }
    const parsedKey = parseConfigString(source, index2);
    if (!parsedKey) {
      index2 = skipConfigValue(source, index2);
      continue;
    }
    index2 = skipConfigInsignificant(source, parsedKey.end);
    if (!source.startsWith("=>", index2)) {
      index2 = parsedKey.end;
      continue;
    }
    index2 = skipConfigInsignificant(source, index2 + 2);
    const nextPrefix = [...prefix, parsedKey.value];
    const entry = {
      filePath,
      key: nextPrefix.join("."),
      range: sourceRangeForOffset(source, parsedKey.end - parsedKey.value.length - 1, parsedKey.value.length)
    };
    entries.push(entry);
    if (source[index2] === "[") {
      index2 = collectConfigArrayKeys(source, index2 + 1, nextPrefix, entries, filePath);
      continue;
    }
    const valueEnd = skipConfigValue(source, index2);
    const classValue = /\\?([A-Za-z_][A-Za-z0-9_\\]*)::class/.exec(source.slice(index2, valueEnd))?.[1];
    if (classValue) {
      entry.value = classValue;
    }
    index2 = valueEnd;
  }
  return index2;
}
function parseConfigString(source, startIndex) {
  const quote = source[startIndex];
  if (quote !== "'" && quote !== '"') {
    return null;
  }
  let value = "";
  for (let index2 = startIndex + 1; index2 < source.length; index2 += 1) {
    const char = source[index2];
    if (char === "\\") {
      value += source[index2 + 1] ?? "";
      index2 += 1;
      continue;
    }
    if (char === quote) {
      return { end: index2 + 1, value };
    }
    value += char;
  }
  return null;
}
function skipConfigInsignificant(source, startIndex) {
  let index2 = startIndex;
  while (index2 < source.length) {
    const char = source[index2];
    if (/\s/.test(char)) {
      index2 += 1;
      continue;
    }
    if (char === "/" && source[index2 + 1] === "*") {
      const commentEnd = source.indexOf("*/", index2 + 2);
      index2 = commentEnd === -1 ? source.length : commentEnd + 2;
      continue;
    }
    if (char === "/" && source[index2 + 1] === "/" || char === "#") {
      const lineEnd = source.indexOf("\n", index2);
      index2 = lineEnd === -1 ? source.length : lineEnd + 1;
      continue;
    }
    return index2;
  }
  return index2;
}
function skipConfigValue(source, startIndex) {
  let index2 = startIndex;
  let bracketDepth = 0;
  let parenDepth = 0;
  while (index2 < source.length) {
    const insignificantEnd = skipConfigInsignificant(source, index2);
    if (insignificantEnd !== index2) {
      index2 = insignificantEnd;
      continue;
    }
    const parsedString = parseConfigString(source, index2);
    if (parsedString) {
      index2 = parsedString.end;
      continue;
    }
    const char = source[index2];
    if (char === "[") {
      bracketDepth += 1;
    } else if (char === "]") {
      if (bracketDepth === 0) {
        return index2;
      }
      bracketDepth -= 1;
    } else if (char === "(") {
      parenDepth += 1;
    } else if (char === ")") {
      parenDepth = Math.max(0, parenDepth - 1);
    } else if (char === "," && bracketDepth === 0 && parenDepth === 0) {
      return index2 + 1;
    }
    index2 += 1;
  }
  return index2;
}
function extractEnvKeyInfo(filePath, source) {
  const entries = [];
  let offset = 0;
  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      offset += line.length + 1;
      continue;
    }
    const match = /^([A-Z0-9_]+)\s*=/.exec(trimmed);
    if (match) {
      const indentation = line.indexOf(trimmed);
      entries.push({
        filePath,
        key: match[1],
        range: sourceRangeForOffset(source, offset + indentation, match[1].length)
      });
    }
    offset += line.length + 1;
  }
  return sortBy(uniqueEnvEntries(entries), (entry) => entry.key);
}
function extractModelInfo(filePath, source) {
  const className = phpClassName(source);
  if (!className) {
    return extractTraitInfo(filePath, source);
  }
  const relations = extractModelRelations(source);
  const customBuilderClass = extractCustomBuilderClass(source);
  const builderMethods = extractModelBuilderMethods(source);
  const staticMethods = extractStaticMethods(source);
  const usedTraits = extractClassBodyTraits(source);
  const methodDetails = extractMethodDetails(source);
  const accessorDetails = extractModelAccessors(source);
  const castDetails = extractModelCasts(source);
  const appends = extractStringArrayProperty(source, "appends");
  return {
    ...accessorDetails.length > 0 ? { accessors: accessorDetails.map((accessor) => accessor.name), accessorDetails } : {},
    ...appends.length > 0 ? { appends } : {},
    ...builderMethods.length > 0 ? { builderMethods } : {},
    ...castDetails.length > 0 ? { castDetails } : {},
    casts: castDetails.map((cast) => cast.name),
    className,
    ...customBuilderClass ? {
      customBuilder: {
        className: customBuilderClass.split("\\").at(-1) ?? customBuilderClass,
        filePath: null,
        methods: [],
        namespace: namespaceFromClassReference(customBuilderClass)
      }
    } : {},
    namespace: phpNamespace(source),
    filePath,
    fillable: extractStringArrayProperty(source, "fillable"),
    guarded: extractStringArrayProperty(source, "guarded"),
    ...methodDetails.length > 0 ? { methodDetails } : {},
    relations,
    relationships: relations.map((relation) => relation.name),
    scopes: extractModelScopes(source),
    ...staticMethods.length > 0 ? { staticMethods } : {},
    tableName: extractModelTableName(className, source),
    ...usedTraits.length > 0 ? { usedTraits } : {},
    ...modelUsesSoftDeletes(source) ? { usesSoftDeletes: true } : {}
  };
}
function extractTraitInfo(filePath, source) {
  const traitName = /\btrait\s+([A-Za-z_][A-Za-z0-9_]*)\b/.exec(source)?.[1] ?? null;
  if (!traitName) {
    return null;
  }
  const scopes = extractModelScopes(source);
  const staticMethods = extractStaticMethods(source);
  const usedTraits = extractClassBodyTraits(source);
  if (scopes.length === 0 && staticMethods.length === 0 && usedTraits.length === 0) {
    return null;
  }
  const methodDetails = extractMethodDetails(source);
  return {
    casts: [],
    className: traitName,
    filePath,
    fillable: [],
    guarded: [],
    isTrait: true,
    ...methodDetails.length > 0 ? { methodDetails } : {},
    namespace: phpNamespace(source),
    relations: [],
    relationships: [],
    scopes,
    ...staticMethods.length > 0 ? { staticMethods } : {},
    tableName: "",
    ...usedTraits.length > 0 ? { usedTraits } : {}
  };
}
function extractModelAccessors(source) {
  const accessors = /* @__PURE__ */ new Map();
  const docProperties = modelDocPropertyTypes(source);
  for (const match of source.matchAll(/(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(?:public|protected|private)\s+)?function\s+get([A-Z][A-Za-z0-9]*)Attribute\s*\([^)]*\)\s*(?::\s*([?\\A-Za-z_][\\A-Za-z0-9_]*))?/g)) {
    const name = attributeNameFromStudly(match[2]);
    const methodName = `get${match[2]}Attribute`;
    const nameOffset = (match.index ?? 0) + match[0].lastIndexOf(methodName);
    accessors.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, methodName.length),
      returnType: normalizePhpType(match[3] ?? phpDocReturnType(match[1]) ?? docProperties.get(name)),
      source: "classic"
    });
  }
  for (const match of source.matchAll(
    /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(?:public|protected|private)\s+)?function\s+([a-z][A-Za-z0-9_]*)\s*\(\s*\)\s*:\s*\\?(?:Illuminate\\Database\\Eloquent\\Casts\\)?Attribute\b/g
  )) {
    const name = attributeNameFromStudly(match[2]);
    const nameOffset = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    accessors.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, match[2].length),
      returnType: normalizePhpType(phpDocReturnType(match[1]) ?? docProperties.get(name)),
      source: "attribute"
    });
  }
  return sortBy([...accessors.values()], (accessor) => accessor.name);
}
function attributeNameFromStudly(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}
function extractModelCasts(source) {
  const casts = /* @__PURE__ */ new Map();
  const blocks = [
    ...stringMapPropertyBlocks(source, "casts"),
    ...methodReturnArrayBlocks(source, "casts")
  ];
  for (const block of blocks) {
    for (const entry of stringMapEntries(block)) {
      casts.set(entry.key, { name: entry.key, type: entry.value });
    }
    for (const entry of classConstMapEntries(block)) {
      const fqcn = resolvePhpClassReference(source, entry.value);
      casts.set(entry.key, { classFqcn: fqcn, name: entry.key, type: fqcn });
    }
    for (const entry of classFactoryMapEntries(block)) {
      const fqcn = resolvePhpClassReference(source, entry.value);
      casts.set(entry.key, {
        classFqcn: fqcn,
        name: entry.key,
        type: `${fqcn}::${entry.method}()`
      });
    }
  }
  return sortBy([...casts.values()], (cast) => cast.name);
}
function stringMapPropertyBlocks(source, propertyName) {
  const propertyMatch = new RegExp(`\\bprotected\\s+\\$${propertyName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*;`).exec(
    source
  );
  return propertyMatch ? [propertyMatch[1]] : [];
}
function methodReturnArrayBlocks(source, methodName) {
  const blocks = [];
  const regex = new RegExp(`function\\s+${methodName}\\s*\\([^)]*\\)\\s*(?::\\s*array)?\\s*\\{([\\s\\S]*?)\\}`, "g");
  for (const match of source.matchAll(regex)) {
    const returnMatch = /return\s*\[([\s\S]*?)\]\s*;/.exec(match[1]);
    if (returnMatch) {
      blocks.push(returnMatch[1]);
    }
  }
  return blocks;
}
function stringMapEntries(source) {
  return [...source.matchAll(/['"]([^'"]+)['"]\s*=>\s*['"]([^'"]+)['"]/g)].map((match) => ({ key: match[1], value: match[2] }));
}
function classConstMapEntries(source) {
  return [...source.matchAll(/['"]([^'"]+)['"]\s*=>\s*(\\?[A-Za-z_][A-Za-z0-9_\\]*)::class/g)].map((match) => ({ key: match[1], value: match[2] }));
}
function classFactoryMapEntries(source) {
  return [...source.matchAll(/['"]([^'"]+)['"]\s*=>\s*(\\?[A-Za-z_][A-Za-z0-9_\\]*)::([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((match) => ({ key: match[1], method: match[3], value: match[2] }));
}
function phpDocReturnType(docblock) {
  return docblock ? /@return\s+([^\s*]+)/.exec(docblock)?.[1] ?? null : null;
}
function modelDocPropertyTypes(source) {
  const properties = /* @__PURE__ */ new Map();
  const classDocblock = /\/\*\*([\s\S]*?)\*\/\s*(?:(?:abstract|final)\s+)?class\s+[A-Za-z_][A-Za-z0-9_]*/.exec(source)?.[1];
  if (!classDocblock) {
    return properties;
  }
  for (const match of classDocblock.matchAll(/@property(?:-read|-write)?\s+([^\s*]+)\s+\$([A-Za-z_][A-Za-z0-9_]*)/g)) {
    properties.set(match[2], match[1]);
  }
  return properties;
}
function normalizePhpType(type) {
  return type?.replace(/^\?/, "").replace(/^\\/, "") ?? null;
}
function modelUsesSoftDeletes(source) {
  return /\buse\s+[^;(]*\bSoftDeletes\b/.test(source);
}
function extractCustomBuilderClass(source) {
  const methodMatch = /function\s+newEloquentBuilder\s*\([^)]*\)\s*(?::\s*([?\\A-Za-z_][\\A-Za-z0-9_]*))?\s*\{([\s\S]*?)\}/.exec(
    source
  );
  if (!methodMatch) {
    return null;
  }
  const returnType = methodMatch[1]?.replace(/^\?/, "");
  if (returnType) {
    return resolveClassReference(source, returnType);
  }
  const bodyClass = /return\s+new\s+([\\A-Za-z_][\\A-Za-z0-9_]*)\s*\(/.exec(methodMatch[2])?.[1];
  return bodyClass ? resolveClassReference(source, bodyClass) : null;
}
function extractModelBuilderMethods(source) {
  if (!/\bextends\s+(?:Builder|\\?Illuminate\\Database\\Eloquent\\Builder)\b/.test(source)) {
    return [];
  }
  const methods = [];
  for (const match of source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*([^{\n]+))?\s*\{/g)) {
    const name = match[1];
    if (name.startsWith("__")) {
      continue;
    }
    methods.push({
      name,
      returnType: match[2]?.trim() ?? null
    });
  }
  return sortBy(uniqueModelBuilderMethods(methods), (method) => method.name);
}
function extractModelRelations(source) {
  const relations = [];
  const methodRegex = /public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\n\s*\}/g;
  for (const methodMatch of source.matchAll(methodRegex)) {
    const relationMatch = /\$this->(hasOne|hasMany|hasOneThrough|hasManyThrough|belongsTo|belongsToMany|morphOne|morphMany|morphTo|morphToMany|morphedByMany)\s*\(([^)]*)\)/.exec(
      methodMatch[2]
    );
    if (!relationMatch) {
      continue;
    }
    relations.push({
      name: methodMatch[1],
      relatedModel: relationClassFromArguments(relationMatch[2]),
      type: relationMatch[1]
    });
  }
  return sortBy(uniqueModelRelations(relations), (relation) => relation.name);
}
function relationClassFromArguments(argumentsSource) {
  return /([A-Za-z_\\][A-Za-z0-9_\\]*)::class/.exec(argumentsSource)?.[1] ?? null;
}
function extractModelScopes(source) {
  const scopes = /* @__PURE__ */ new Set();
  for (const match of source.matchAll(/\bfunction\s+scope([A-Z][A-Za-z0-9_]*)\s*\(/g)) {
    scopes.add(uncapitalize(match[1]));
  }
  const attributeScopeRegex = /#\[\s*(?:\\?Illuminate\\Database\\Eloquent\\Attributes\\)?Scope\s*\]\s*(?:public|protected)\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  for (const match of source.matchAll(attributeScopeRegex)) {
    scopes.add(match[1]);
  }
  return uniqueSorted([...scopes]);
}
function extractStaticMethods(source) {
  const methods = /* @__PURE__ */ new Set();
  for (const match of source.matchAll(/((?:\b(?:abstract|final|private|protected|public|static)\s+)+)function\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    if (/\bstatic\b/.test(match[1]) && !match[2].startsWith("__")) {
      methods.add(match[2]);
    }
  }
  return uniqueSorted([...methods]);
}
function extractMethodDetails(source) {
  const methods = /* @__PURE__ */ new Map();
  for (const match of source.matchAll(/\bfunction\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const name = match[1];
    if (name.startsWith("__") || methods.has(name)) {
      continue;
    }
    const nameOffset = (match.index ?? 0) + match[0].lastIndexOf(name);
    methods.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, name.length)
    });
  }
  return sortBy([...methods.values()], (method) => method.name);
}
function extractClassBodyTraits(source) {
  const declaration = /\b(?:class|trait)\s+[A-Za-z_][A-Za-z0-9_]*[^{]*\{/.exec(source);
  if (!declaration) {
    return [];
  }
  const header = source.slice(0, declaration.index);
  const body = source.slice(declaration.index + declaration[0].length);
  const traits = /* @__PURE__ */ new Set();
  for (const match of body.matchAll(/(?:^|[;{}\n])\s*use\s+([A-Za-z_\\][A-Za-z0-9_\\]*(?:\s*,\s*[A-Za-z_\\][A-Za-z0-9_\\]*)*)\s*(?:;|\{)/g)) {
    for (const name of match[1].split(",")) {
      traits.add(resolvePhpClassReference(header, name.trim()));
    }
  }
  return uniqueSorted([...traits]);
}
function phpClassName(source) {
  return /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/.exec(source)?.[1] ?? null;
}
function phpNamespace(source) {
  return /\bnamespace\s+([^;]+);/.exec(source)?.[1].trim() ?? null;
}
function extractPhpClasses(filePath, source) {
  const namespace = phpNamespace(source);
  const classes = [];
  const declarationPattern = /\b((?:(?:abstract|final|readonly)\s+)*)(class|interface|trait|enum)\s+([A-Za-z_][A-Za-z0-9_]*)\b([^{;]*)/g;
  for (const match of source.matchAll(declarationPattern)) {
    const modifiers = match[1] ?? "";
    const kind = match[2];
    const name = match[3];
    const clause = match[4] ?? "";
    if (name === "extends" || name === "implements") {
      continue;
    }
    const matchStart = match.index ?? 0;
    const searchFrom = modifiers.length + kind.length;
    const nameOffset = match[0].indexOf(name, searchFrom);
    const nameStart = matchStart + (nameOffset >= 0 ? nameOffset : match[0].indexOf(name));
    const { extendsNames, implementsNames } = parseInheritanceClause(clause);
    const resolve = (reference) => resolvePhpClassReference(source, reference);
    classes.push({
      extends: uniqueSorted(extendsNames.map(resolve)),
      filePath,
      fqcn: namespace ? `${namespace}\\${name}` : name,
      implements: uniqueSorted(implementsNames.map(resolve)),
      isAbstract: /\babstract\b/.test(modifiers),
      isFinal: /\bfinal\b/.test(modifiers),
      kind,
      methods: extractPhpClassMethodDetails(source, matchStart, kind),
      name,
      nameRange: sourceRangeForOffset(source, nameStart, name.length),
      namespace
    });
  }
  return classes;
}
function extractPhpClassMethodDetails(source, declarationOffset, kind) {
  const bodyStart = source.indexOf("{", declarationOffset);
  if (bodyStart < 0) {
    return [];
  }
  const bodyEnd = matchingBraceIndex(source, bodyStart) ?? source.length;
  const body = source.slice(bodyStart + 1, bodyEnd);
  const methods = /* @__PURE__ */ new Map();
  const methodPattern = kind === "interface" ? /\b((?:public\s+)?)function\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g : /\b((?:(?:abstract|final|static|public|protected|private)\s+)+)function\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  for (const match of body.matchAll(methodPattern)) {
    const name = match[2];
    if (name.startsWith("__") || methods.has(name)) {
      continue;
    }
    const absoluteOffset = bodyStart + 1 + (match.index ?? 0);
    const nameOffset = absoluteOffset + match[0].lastIndexOf(name);
    methods.set(name, {
      name,
      range: sourceRangeForOffset(source, nameOffset, name.length),
      visibility: methodVisibilityFromModifiers(match[1] ?? "")
    });
  }
  return sortBy([...methods.values()], (method) => method.name);
}
function methodVisibilityFromModifiers(modifiers) {
  if (/\bprivate\b/.test(modifiers)) {
    return "private";
  }
  if (/\bprotected\b/.test(modifiers)) {
    return "protected";
  }
  return "public";
}
function matchingBraceIndex(source, openIndex) {
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let index2 = openIndex; index2 < source.length; index2 += 1) {
    const char = source[index2];
    const next = source[index2 + 1];
    const previous = source[index2 - 1];
    if (lineComment) {
      if (char === "\n" || char === "\r") {
        lineComment = false;
      }
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index2 += 1;
      }
      continue;
    }
    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }
    if (char === "/" && next === "/" || char === "#") {
      lineComment = true;
      index2 += char === "/" ? 1 : 0;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index2 += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index2;
      }
    }
  }
  return null;
}
function parseInheritanceClause(clause) {
  const implementsIndex = clause.search(/\bimplements\b/);
  const extendsSource = implementsIndex >= 0 ? clause.slice(0, implementsIndex) : clause;
  const implementsSource = implementsIndex >= 0 ? clause.slice(implementsIndex).replace(/^\s*implements\b/, "") : "";
  const extendsMatch = /\bextends\b([\s\S]*)/.exec(extendsSource);
  return {
    extendsNames: extendsMatch ? splitClassNames(extendsMatch[1]) : [],
    implementsNames: splitClassNames(implementsSource)
  };
}
function splitClassNames(source) {
  return source.split(",").map((part) => part.trim()).filter((part) => /^\\?[A-Za-z_][A-Za-z0-9_\\]*$/.test(part));
}
function phpImports2(source) {
  const imports = /* @__PURE__ */ new Map();
  for (const match of source.matchAll(/\buse\s+([^;]+);/g)) {
    const statement = match[1].trim();
    if (statement.includes("{") || /^function\s|^const\s/.test(statement)) {
      continue;
    }
    const aliasMatch = /^([A-Za-z_\\][A-Za-z0-9_\\]*)\s+as\s+([A-Za-z_][A-Za-z0-9_]*)$/i.exec(statement);
    const className = aliasMatch ? aliasMatch[1] : statement;
    const alias = aliasMatch?.[2] ?? className.split("\\").at(-1);
    if (alias) {
      imports.set(alias, className);
    }
  }
  return imports;
}
function resolveClassReference(source, classReference) {
  const normalized = classReference.replace(/^\\/, "");
  if (normalized.includes("\\")) {
    return normalized;
  }
  return phpImports2(source).get(normalized) ?? normalized;
}
function namespaceFromClassReference(classReference) {
  const normalized = classReference.replace(/^\\/, "");
  const segments = normalized.split("\\");
  if (segments.length <= 1) {
    return null;
  }
  return segments.slice(0, -1).join("\\");
}
function applyModelTraits(models) {
  const classModels = models.filter((model) => !model.isTrait);
  const traitByName = /* @__PURE__ */ new Map();
  for (const trait of models) {
    if (!trait.isTrait) {
      continue;
    }
    traitByName.set(trait.className, trait);
    if (trait.namespace) {
      traitByName.set(`${trait.namespace}\\${trait.className}`, trait);
    }
  }
  if (traitByName.size === 0) {
    return classModels;
  }
  return classModels.map((model) => {
    const members = collectTraitMembers(model.usedTraits, traitByName);
    if (members.scopes.length === 0 && members.staticMethods.length === 0) {
      return model;
    }
    const scopeDetails = members.scopes.filter((scope) => !model.scopes.includes(scope.name));
    const staticMethods = uniqueSorted([...model.staticMethods ?? [], ...members.staticMethods]);
    return {
      ...model,
      ...scopeDetails.length > 0 ? { scopeDetails } : {},
      scopes: uniqueSorted([...model.scopes, ...members.scopes.map((scope) => scope.name)]),
      ...staticMethods.length > 0 ? { staticMethods } : {}
    };
  });
}
function collectTraitMembers(usedTraits, traitByName, visited = /* @__PURE__ */ new Set()) {
  const scopes = [];
  const staticMethods = [];
  for (const reference of usedTraits ?? []) {
    const trait = traitByName.get(reference) ?? traitByName.get(reference.split("\\").at(-1) ?? reference);
    if (!trait || visited.has(trait.filePath)) {
      continue;
    }
    visited.add(trait.filePath);
    scopes.push(...trait.scopes.map((name) => ({ filePath: trait.filePath, name })));
    staticMethods.push(...trait.staticMethods ?? []);
    const nested = collectTraitMembers(trait.usedTraits, traitByName, visited);
    scopes.push(...nested.scopes);
    staticMethods.push(...nested.staticMethods);
  }
  return { scopes, staticMethods };
}
function resolveCustomModelBuilders(models) {
  const builderByName = /* @__PURE__ */ new Map();
  for (const model of models) {
    if (!model.builderMethods?.length) {
      continue;
    }
    builderByName.set(model.className, model);
    if (model.namespace) {
      builderByName.set(`${model.namespace}\\${model.className}`, model);
    }
  }
  return models.map((model) => {
    if (!model.customBuilder) {
      return model;
    }
    const fullBuilderName = model.customBuilder.namespace ? `${model.customBuilder.namespace}\\${model.customBuilder.className}` : model.customBuilder.className;
    const builder = builderByName.get(fullBuilderName) ?? builderByName.get(model.customBuilder.className);
    return {
      ...model,
      customBuilder: {
        ...model.customBuilder,
        filePath: builder?.filePath ?? model.customBuilder.filePath,
        methods: builder?.builderMethods ?? model.customBuilder.methods,
        namespace: builder?.namespace ?? model.customBuilder.namespace
      }
    };
  });
}
function resolveServiceProviderClasses(providers) {
  const classProviders = /* @__PURE__ */ new Map();
  for (const provider of providers) {
    if (provider.source !== "class" || !provider.classFilePath) {
      continue;
    }
    classProviders.set(provider.className, provider);
    if (provider.namespace) {
      classProviders.set(`${provider.namespace}\\${provider.className}`, provider);
    }
  }
  return uniqueServiceProviders(
    providers.map((provider) => {
      const fullClassName = provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className;
      const classProvider = classProviders.get(fullClassName) ?? classProviders.get(provider.className);
      return {
        ...provider,
        classFilePath: provider.classFilePath ?? classProvider?.classFilePath ?? null
      };
    })
  );
}
function extractValidationRules(filePath, source) {
  const className = phpClassName(source);
  const namespace = phpNamespace(source);
  const rules = [];
  if (/extends\s+FormRequest\b/.test(source)) {
    const formRequestFields = extractFormRequestRuleFields(source);
    if (formRequestFields.length > 0) {
      rules.push({
        className,
        fields: formRequestFields,
        filePath,
        namespace,
        source: "formRequest"
      });
    }
  }
  for (const fields of extractInlineValidationRuleFields(source)) {
    if (fields.length > 0) {
      rules.push({
        className,
        fields,
        filePath,
        namespace,
        source: "inline"
      });
    }
  }
  return rules;
}
function extractTranslationKeys(rootPath, filePath, source) {
  const context = translationFileContext(rootPath, filePath);
  if (!context) {
    return [];
  }
  if (filePath.endsWith(".json")) {
    return extractJsonTranslationKeys(filePath, source, context.locale);
  }
  return extractPhpTranslationKeys(filePath, source, context.locale, context.group);
}
function extractContainerBindings(filePath, source) {
  const bindings = [];
  const bindingRegex = /(?:\$this->app|app\(\)|App::getFacadeRoot\(\))->(bind|singleton|scoped|instance)\(\s*([^,\)]+)(?:,\s*([^\)]+))?\)/g;
  const closureBindingRegex = /(?:\$this->app|app\(\)|App::getFacadeRoot\(\))->(bind|singleton|scoped|instance)\(\s*([^,\)]+)\s*,\s*function\s*\([^)]*\)\s*(?::\s*[A-Za-z_\\][A-Za-z0-9_\\]*)?\s*\{([\s\S]*?)\}\s*\)/g;
  for (const match of source.matchAll(bindingRegex)) {
    const abstract = resolvedServiceReference(source, match[2]);
    if (!abstract) {
      continue;
    }
    bindings.push({
      abstract,
      concrete: resolvedServiceReference(source, match[3]),
      filePath,
      lifetime: match[1]
    });
  }
  for (const match of source.matchAll(closureBindingRegex)) {
    const abstract = resolvedServiceReference(source, match[2]);
    if (!abstract) {
      continue;
    }
    bindings.push({
      abstract,
      concrete: resolvedClassLikeReference(source, newInstanceReference(match[3])),
      filePath,
      lifetime: match[1]
    });
  }
  return sortBy(uniqueContainerBindings(bindings), (binding) => binding.abstract);
}
function extractControllerInfo(filePath, source) {
  const className = phpClassName(source);
  if (!className) {
    return [];
  }
  const actionDetails = extractControllerActions(source);
  return [
    {
      actionDetails,
      actions: actionDetails.map((action) => action.name),
      className,
      filePath,
      namespace: phpNamespace(source)
    }
  ];
}
function extractControllerActions(source) {
  const ignored = /* @__PURE__ */ new Set(["__construct", "authorize", "middleware", "validate", "validateWithBag"]);
  return sortBy(
    [...source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((match) => {
      const name = match[1];
      const matchStart = match.index ?? 0;
      const nameStart = matchStart + match[0].lastIndexOf(name);
      return {
        name,
        range: sourceRangeForOffset(source, nameStart, name.length)
      };
    }).filter((action) => !ignored.has(action.name)),
    (action) => action.name
  );
}
function extractAuthorizationInfo(filePath, source) {
  const entries = [];
  for (const match of source.matchAll(/Gate::define\(\s*['"]([^'"]+)['"]/g)) {
    entries.push({
      ability: match[1],
      filePath,
      model: null,
      policy: null,
      source: "gate"
    });
  }
  for (const match of source.matchAll(/Gate::policy\(\s*([^,]+),\s*([^\)]+)\)/g)) {
    entries.push({
      ability: policyAbilityName(serviceReference(match[2]) ?? match[2].trim()),
      filePath,
      model: serviceReference(match[1]),
      policy: serviceReference(match[2]),
      source: "policyMap"
    });
  }
  for (const match of source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*=>\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    entries.push({
      ability: policyAbilityName(match[2]),
      filePath,
      model: match[1],
      policy: match[2],
      source: "policyMap"
    });
  }
  const className = phpClassName(source);
  if (className?.endsWith("Policy")) {
    for (const method of extractPolicyMethods(source)) {
      entries.push({
        ability: method,
        filePath,
        model: null,
        policy: className,
        source: "policy"
      });
    }
  }
  return sortBy(entries, (entry) => entry.ability);
}
function extractFacadeInfo(filePath, source) {
  if (filePath.endsWith(import_node_path.default.join("config", "app.php"))) {
    return extractFacadeAliasInfo(filePath, source);
  }
  const className = phpClassName(source);
  if (!className || !/extends\s+Facade\b/.test(source)) {
    return [];
  }
  return [
    {
      accessor: extractFacadeAccessor(source),
      binding: null,
      className,
      filePath,
      namespace: phpNamespace(source)
    }
  ];
}
function extractFacadeAliasInfo(filePath, source) {
  const facades = [];
  for (const block of facadeAliasBlocks(source)) {
    for (const match of block.matchAll(/['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*=>\s*([^,\]\n]+)/g)) {
      const target = serviceReference(match[2]) ?? match[2].trim();
      if (!/^[A-Za-z_\\][A-Za-z0-9_\\]*$/.test(target)) {
        continue;
      }
      facades.push({
        accessor: defaultFacadeAccessors.get(match[1]) ?? null,
        binding: null,
        className: match[1],
        filePath,
        namespace: null,
        source: "alias",
        target
      });
    }
  }
  return sortBy(facades, (facade) => facade.className);
}
function facadeAliasBlocks(source) {
  return [...source.matchAll(/['"]aliases['"]\s*=>\s*(?:[^[]*?\(\s*)?\[([\s\S]*?)\]/g)].map(
    (match) => match[1]
  );
}
function builtInLaravelFacadeAliases(rootPath) {
  return [...defaultLaravelFacadeAliases.entries()].map(([className, target]) => ({
    accessor: defaultFacadeAccessors.get(className) ?? null,
    binding: null,
    className,
    filePath: facadeTargetFilePath(rootPath, target),
    namespace: null,
    source: "builtIn",
    target
  }));
}
function facadeTargetFilePath(rootPath, target) {
  if (target.startsWith("Illuminate\\")) {
    return import_node_path.default.join(rootPath, "vendor", "laravel", "framework", "src", `${target.replace(/\\/g, import_node_path.default.sep)}.php`);
  }
  return import_node_path.default.join(rootPath, `${target.replace(/\\/g, import_node_path.default.sep)}.php`);
}
function extractMacroInfo(filePath, source) {
  const macros = [];
  for (const match of source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::macro\(\s*['"]([^'"]+)['"]/g)) {
    macros.push({
      className: match[1],
      filePath,
      method: match[2]
    });
  }
  return sortBy(macros, (macro) => `${macro.className}:${macro.method}`);
}
function extractMiddlewareInfo(filePath, source) {
  const entries = [];
  const sourceKind = filePath.endsWith(import_node_path.default.join("bootstrap", "app.php")) ? "bootstrap" : "kernel";
  for (const block of middlewareAliasBlocks(source)) {
    for (const match of block.content.matchAll(/['"]([^'"]+)['"]\s*=>\s*([^,\]\n]+)/g)) {
      entries.push({
        alias: match[1],
        className: serviceReference(match[2]) ?? match[2].trim(),
        filePath,
        range: sourceRangeForOffset(source, block.offset + (match.index ?? 0) + 1, match[1].length),
        source: sourceKind
      });
    }
  }
  for (const group of middlewareGroupEntries(source)) {
    entries.push({
      alias: group.name,
      className: null,
      filePath,
      range: sourceRangeForOffset(source, group.offset, group.name.length),
      source: sourceKind
    });
  }
  return sortBy(uniqueMiddleware(entries), (entry) => entry.alias);
}
function extractServiceProviderInfo(filePath, source) {
  if (filePath.endsWith("composer.json")) {
    return extractComposerServiceProviders(filePath, source);
  }
  const providers = [];
  const className = phpClassName(source);
  if (className && /\bextends\s+(?:ServiceProvider|\\?Illuminate\\Support\\ServiceProvider)\b/.test(source)) {
    providers.push({
      classFilePath: filePath,
      className,
      filePath,
      namespace: phpNamespace(source),
      source: "class"
    });
  }
  const sourceKind = serviceProviderRegistrationSource(filePath);
  if (sourceKind) {
    const registrationSource = sourceKind === "config" ? configProvidersSource(source) : source;
    for (const classReference of classConstantsInSource(registrationSource)) {
      providers.push({
        classFilePath: null,
        className: classReference.split("\\").at(-1) ?? classReference,
        filePath,
        namespace: namespaceFromClassReference(classReference),
        source: sourceKind
      });
    }
  }
  return sortBy(uniqueServiceProviders(providers), (provider) => `${provider.source}:${provider.className}`);
}
function extractComposerServiceProviders(filePath, source) {
  try {
    const composer = JSON.parse(source);
    const providers = composer.extra?.laravel?.providers;
    if (!Array.isArray(providers)) {
      return [];
    }
    return providers.filter((provider) => typeof provider === "string").map((provider) => ({
      classFilePath: null,
      className: provider.split("\\").at(-1) ?? provider,
      filePath,
      namespace: namespaceFromClassReference(provider),
      source: "composer"
    }));
  } catch {
    return [];
  }
}
function serviceProviderRegistrationSource(filePath) {
  if (filePath.endsWith(import_node_path.default.join("bootstrap", "providers.php"))) {
    return "bootstrap";
  }
  if (filePath.endsWith(import_node_path.default.join("config", "app.php"))) {
    return "config";
  }
  return null;
}
function configProvidersSource(source) {
  return /\b['"]providers['"]\s*=>\s*\[([\s\S]*?)\]\s*,?/m.exec(source)?.[1] ?? "";
}
function classConstantsInSource(source) {
  return uniqueSorted([...source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)].map((match) => match[1]));
}
function middlewareAliasBlocks(source) {
  const blocks = [];
  for (const match of source.matchAll(/->alias\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    blocks.push({ content: match[1], offset: (match.index ?? 0) + match[0].indexOf(match[1]) });
  }
  for (const match of source.matchAll(/\$(?:middlewareAliases|routeMiddleware)\s*=\s*\[([\s\S]*?)\]\s*;/g)) {
    blocks.push({ content: match[1], offset: (match.index ?? 0) + match[0].indexOf(match[1]) });
  }
  return blocks;
}
function middlewareGroupEntries(source) {
  const groups = [];
  for (const block of source.matchAll(/\$middlewareGroups\s*=\s*\[([\s\S]*?)\]\s*;/g)) {
    const content = block[1];
    const contentOffset = (block.index ?? 0) + block[0].indexOf(content);
    for (const match of content.matchAll(/['"]([^'"]+)['"]\s*=>\s*\[/g)) {
      groups.push({ name: match[1], offset: contentOffset + (match.index ?? 0) + 1 });
    }
  }
  for (const match of source.matchAll(/\$middleware\s*->\s*(?:group|appendToGroup|prependToGroup)\(\s*['"]([^'"]+)['"]/g)) {
    groups.push({ name: match[1], offset: (match.index ?? 0) + match[0].lastIndexOf(match[1]) });
  }
  return groups;
}
function extractFactoryInfo(filePath, source) {
  const className = phpClassName(source);
  if (!className || !/extends\s+Factory\b/.test(source)) {
    return [];
  }
  return [
    {
      className,
      definitionFields: extractFactoryDefinitionFields(source),
      filePath,
      model: extractFactoryModel(source),
      namespace: phpNamespace(source),
      states: extractFactoryStates(source)
    }
  ];
}
function extractSeederInfo(filePath, source) {
  const className = phpClassName(source);
  if (!className || !/extends\s+Seeder\b/.test(source)) {
    return [];
  }
  return [
    {
      calls: extractSeederCalls(source),
      className,
      filePath,
      namespace: phpNamespace(source)
    }
  ];
}
function extractCommandInfo(filePath, source) {
  const commands = [];
  const className = phpClassName(source);
  const namespace = phpNamespace(source);
  const signature = classCommandSignature(source);
  if (signature) {
    commands.push({
      className,
      description: classCommandDescription(source),
      filePath,
      name: commandNameFromSignature(signature),
      namespace,
      signature,
      source: "class"
    });
  }
  for (const match of source.matchAll(/(?:Artisan|Schedule)::command\(\s*['"]([^'"]+)['"]/g)) {
    const closureSignature = match[1].trim();
    commands.push({
      className: null,
      description: null,
      filePath,
      name: commandNameFromSignature(closureSignature),
      namespace: null,
      signature: closureSignature,
      source: "closure"
    });
  }
  return sortBy(uniqueCommands(commands), (command) => command.name);
}
function classCommandSignature(source) {
  return /\bprotected\s+\$signature\s*=\s*['"]([^'"]+)['"]\s*;/.exec(source)?.[1].trim() ?? null;
}
function classCommandDescription(source) {
  return /\bprotected\s+\$description\s*=\s*['"]([^'"]+)['"]\s*;/.exec(source)?.[1].trim() ?? null;
}
function commandNameFromSignature(signature) {
  return signature.split(/\s+/)[0] ?? signature;
}
function extractLaravelArtifacts(rootPath, filePath, source) {
  const className = phpClassName(source);
  const kind = artifactKindForPath(rootPath, filePath, source);
  if (!className || !kind) {
    return [];
  }
  const constructorSignature = extractConstructorSignature(source);
  return [
    {
      className,
      ...constructorSignature ? { constructorSignature } : {},
      filePath,
      kind,
      namespace: phpNamespace(source),
      related: extractArtifactRelatedClasses(source)
    }
  ];
}
function extractConstructorSignature(source) {
  const match = /\bfunction\s+__construct\s*\(([\s\S]*?)\)/.exec(source);
  if (!match) {
    return null;
  }
  return match[1].replace(/\s+/g, " ").trim();
}
function artifactKindForPath(rootPath, filePath, source) {
  const relativePath = import_node_path.default.relative(rootPath, filePath);
  if (relativePath.startsWith(import_node_path.default.join("app", "Http", "Resources") + import_node_path.default.sep)) {
    return "resource";
  }
  if (relativePath.startsWith(import_node_path.default.join("app", "Events") + import_node_path.default.sep)) {
    return "event";
  }
  if (relativePath.startsWith(import_node_path.default.join("app", "Listeners") + import_node_path.default.sep)) {
    return "listener";
  }
  if (relativePath.startsWith(import_node_path.default.join("app", "Jobs") + import_node_path.default.sep)) {
    return "job";
  }
  if (relativePath.startsWith(import_node_path.default.join("app", "Mail") + import_node_path.default.sep)) {
    return "mailable";
  }
  if (relativePath.startsWith(import_node_path.default.join("app", "Notifications") + import_node_path.default.sep)) {
    return "notification";
  }
  if (/extends\s+JsonResource\b|extends\s+ResourceCollection\b/.test(source)) {
    return "resource";
  }
  if (/extends\s+Mailable\b/.test(source)) {
    return "mailable";
  }
  if (/extends\s+Notification\b/.test(source)) {
    return "notification";
  }
  if (/implements\s+ShouldQueue\b/.test(source)) {
    return "job";
  }
  return null;
}
function extractArtifactRelatedClasses(source) {
  const related = /* @__PURE__ */ new Set();
  for (const match of source.matchAll(/function\s+handle\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)\s+\$/g)) {
    related.add(match[1]);
  }
  for (const match of source.matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::dispatch\(/g)) {
    related.add(match[1]);
  }
  for (const match of source.matchAll(/new\s+([A-Za-z_\\][A-Za-z0-9_\\]*)\s*\(/g)) {
    related.add(match[1]);
  }
  return uniqueSorted([...related]);
}
function extractFactoryModel(source) {
  const modelProperty = /\bprotected\s+\$model\s*=\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*;/.exec(
    source
  );
  if (modelProperty) {
    return modelProperty[1];
  }
  const generic = /@extends\s+Factory<([A-Za-z_\\][A-Za-z0-9_\\]*)>/.exec(source);
  return generic?.[1] ?? null;
}
function extractFactoryDefinitionFields(source) {
  const definitionMethod = /function\s+definition\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\n\s*\}/.exec(source);
  if (!definitionMethod) {
    return [];
  }
  const returnArray = /return\s*\[([\s\S]*?)\]\s*;/.exec(definitionMethod[1]);
  return returnArray ? extractArrayKeys(returnArray[1]) : [];
}
function extractFactoryStates(source) {
  const ignored = /* @__PURE__ */ new Set(["configure", "definition"]);
  return uniqueSorted(
    [...source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^)]*\)\s*(?::\s*[^{]+)?\{/g)].map((match) => match[1]).filter((method) => !ignored.has(method))
  );
}
function extractSeederCalls(source) {
  const calls = /* @__PURE__ */ new Set();
  for (const match of source.matchAll(/->call\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)/g)) {
    calls.add(match[1]);
  }
  for (const match of source.matchAll(/->call\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    for (const classMatch of match[1].matchAll(/([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
      calls.add(classMatch[1]);
    }
  }
  return uniqueSorted([...calls]);
}
function extractFacadeAccessor(source) {
  const methodMatch = /function\s+getFacadeAccessor\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\}/.exec(
    source
  );
  if (!methodMatch) {
    return null;
  }
  const returnMatch = /return\s+([^;]+);/.exec(methodMatch[1]);
  return returnMatch ? serviceReference(returnMatch[1]) : null;
}
function extractPolicyMethods(source) {
  const ignored = /* @__PURE__ */ new Set(["before", "after"]);
  return uniqueSorted(
    [...source.matchAll(/public\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((match) => match[1]).filter((method) => !ignored.has(method))
  );
}
function policyAbilityName(policy) {
  return policy.split("\\").at(-1)?.replace(/Policy$/, "").replace(/^([A-Z])/, (match) => match.toLowerCase()) ?? policy;
}
function serviceReference(source) {
  if (!source) {
    return null;
  }
  const classMatch = /([A-Za-z_\\][A-Za-z0-9_\\]*)::class/.exec(source);
  if (classMatch) {
    return classMatch[1];
  }
  return stringLiteral(source);
}
function resolvedServiceReference(documentSource, referenceSource) {
  const reference = serviceReference(referenceSource);
  return resolvedClassLikeReference(documentSource, reference);
}
function resolvedClassLikeReference(documentSource, reference) {
  if (!reference || !isClassLikeReference(reference)) {
    return reference;
  }
  return resolvePhpClassReference(documentSource, reference);
}
function isClassLikeReference(value) {
  return /^[A-Z_\\][A-Za-z0-9_\\]*$/.test(value);
}
function newInstanceReference(source) {
  if (!source) {
    return null;
  }
  return /\breturn\s+new\s+([A-Za-z_\\][A-Za-z0-9_\\]*)\b/.exec(source)?.[1] ?? null;
}
function extractJsonTranslationKeys(filePath, source, locale) {
  try {
    const parsed = JSON.parse(source);
    return Object.keys(parsed).map((key) => ({
      filePath,
      key,
      locale,
      namespace: null,
      source: "json"
    }));
  } catch {
    return [];
  }
}
function extractPhpTranslationKeys(filePath, source, locale, group) {
  if (!group) {
    return [];
  }
  return extractPhpArrayKeys(source).map((key) => ({
    filePath,
    key: `${group}.${key}`,
    locale,
    namespace: null,
    source: "php"
  }));
}
function extractPhpArrayKeys(source) {
  const keys = [];
  const stack = [];
  const keyRegex = /(['"])([^'"]+)\1\s*=>\s*(\[|array\s*\(|[^,\]\n]+)/g;
  let previousOffset = 0;
  for (const match of source.matchAll(keyRegex)) {
    const matchOffset = match.index ?? 0;
    const betweenMatches = source.slice(previousOffset, matchOffset);
    const closeCount = (betweenMatches.match(/\]/g) ?? []).length + (betweenMatches.match(/\)/g) ?? []).length;
    for (let index2 = 0; index2 < closeCount && stack.length > 0; index2 += 1) {
      stack.pop();
    }
    const key = match[2];
    const valueStart = match[3].trim();
    const pathParts = [...stack, key];
    if (valueStart === "[" || valueStart.startsWith("array")) {
      stack.push(key);
    } else {
      keys.push(pathParts.join("."));
    }
    previousOffset = matchOffset + match[0].length;
  }
  return uniqueSorted(keys);
}
function translationFileContext(rootPath, filePath) {
  for (const basePath of [import_node_path.default.join(rootPath, "lang"), import_node_path.default.join(rootPath, "resources", "lang")]) {
    const relativePath = import_node_path.default.relative(basePath, filePath);
    if (relativePath.startsWith("..") || import_node_path.default.isAbsolute(relativePath)) {
      continue;
    }
    if (filePath.endsWith(".json")) {
      return {
        group: null,
        locale: import_node_path.default.basename(filePath, ".json")
      };
    }
    const segments = relativePath.split(import_node_path.default.sep);
    if (segments.length < 2) {
      return null;
    }
    return {
      group: segments.slice(1).join(".").replace(/\.php$/, ""),
      locale: segments[0]
    };
  }
  return null;
}
function extractFormRequestRuleFields(source) {
  const rulesMethod = /function\s+rules\s*\([^)]*\)\s*(?::\s*[^{]+)?\{([\s\S]*?)\}/.exec(
    source
  );
  if (!rulesMethod) {
    return [];
  }
  const returnArray = /return\s*\[([\s\S]*?)\]\s*;/.exec(rulesMethod[1]);
  return returnArray ? extractValidationFieldsFromArray(returnArray[1]) : [];
}
function extractInlineValidationRuleFields(source) {
  const fieldSets = [];
  for (const match of source.matchAll(/\$request->validate\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    fieldSets.push(extractValidationFieldsFromArray(match[1]));
  }
  for (const match of source.matchAll(/Validator::make\([^,]+,\s*\[([\s\S]*?)\]\s*\)/g)) {
    fieldSets.push(extractValidationFieldsFromArray(match[1]));
  }
  return fieldSets;
}
function extractValidationFieldsFromArray(source) {
  const fields = [];
  const fieldRegex = /['"]([^'"]+)['"]\s*=>\s*(\[[\s\S]*?\]|['"][^'"]*['"])/g;
  for (const match of source.matchAll(fieldRegex)) {
    fields.push({
      field: match[1],
      rules: validationRulesFromValue(match[2])
    });
  }
  return sortBy(fields, (field) => field.field);
}
function validationRulesFromValue(source) {
  const trimmed = source.trim();
  if (trimmed.startsWith("[")) {
    return uniqueSorted(stringsInSource(trimmed).flatMap((rule) => rule.split("|")));
  }
  return uniqueSorted(stringsInSource(trimmed).flatMap((rule) => rule.split("|")));
}
function extractSchemaTables(filePath, source) {
  const tables = [];
  const schemaRegex = /Schema::(?:create|table)\(\s*['"]([^'"]+)['"]\s*,\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}\s*\);/g;
  for (const match of source.matchAll(schemaRegex)) {
    const tableName = match[1];
    tables.push({
      columns: extractSchemaColumns(filePath, tableName, match[2]),
      filePath,
      name: tableName
    });
  }
  return tables;
}
function extractSchemaColumns(filePath, tableName, source) {
  const columns = [];
  const columnRegex = /\$table->([A-Za-z_][A-Za-z0-9_]*)\(([^)]*)\)((?:->[A-Za-z_][A-Za-z0-9_]*\([^)]*\))*)\s*;/g;
  for (const match of source.matchAll(columnRegex)) {
    const type = match[1];
    const columnNames = schemaColumnNames(type, match[2]);
    if (columnNames.length === 0) {
      continue;
    }
    const modifiers = [...match[3].matchAll(/->([A-Za-z_][A-Za-z0-9_]*)\(/g)].map(
      (modifier) => modifier[1]
    );
    for (const columnName of columnNames) {
      columns.push({
        filePath,
        modifiers,
        name: columnName,
        tableName,
        type
      });
    }
  }
  return columns;
}
function schemaColumnNames(type, argsSource) {
  switch (type) {
    case "id":
      return [stringLiteral(argsSource) ?? "id"];
    case "timestamps":
      return ["created_at", "updated_at"];
    case "softDeletes":
      return ["deleted_at"];
    case "rememberToken":
      return ["remember_token"];
    default:
      return stringLiteral(argsSource) ? [stringLiteral(argsSource) ?? ""] : [];
  }
}
function extractModelTableName(className, source) {
  const explicitTable = /\bprotected\s+\$table\s*=\s*['"]([^'"]+)['"]\s*;/.exec(source);
  return explicitTable?.[1] ?? pluralize(snakeCase(className));
}
function extractStringArrayProperty(source, propertyName) {
  const propertyMatch = new RegExp(`\\bprotected\\s+\\$${propertyName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*;`).exec(
    source
  );
  return propertyMatch ? uniqueSorted(stringsInSource(propertyMatch[1])) : [];
}
function extractArrayKeys(source) {
  return uniqueSorted([...source.matchAll(/['"]([^'"]+)['"]\s*=>/g)].map((match) => match[1]));
}
function indexFileCacheKey(candidate) {
  return `${candidate.kind}:${candidate.filePath}`;
}
async function collectIndexFileCandidates(rootPath) {
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  const moduleRoots = await moduleDirectoryRoots(rootPath);
  const addFiles = async (kind, startPath, include) => {
    for (const filePath of await walk(startPath, include)) {
      const seenKey = `${kind}:${filePath}`;
      if (!seen.has(seenKey)) {
        seen.add(seenKey);
        candidates.push({ filePath, kind });
      }
    }
  };
  await Promise.all([
    addFiles(
      "authorization",
      import_node_path.default.join(rootPath, "app", "Providers"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "authorization",
      import_node_path.default.join(rootPath, "app", "Policies"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "artifact",
      import_node_path.default.join(rootPath, "app", "Events"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "artifact",
      import_node_path.default.join(rootPath, "app", "Http", "Resources"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "artifact",
      import_node_path.default.join(rootPath, "app", "Jobs"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "artifact",
      import_node_path.default.join(rootPath, "app", "Listeners"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "artifact",
      import_node_path.default.join(rootPath, "app", "Mail"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "artifact",
      import_node_path.default.join(rootPath, "app", "Notifications"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "bladeComponent",
      import_node_path.default.join(rootPath, "app", "View", "Components"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "command",
      import_node_path.default.join(rootPath, "app", "Console", "Commands"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "command",
      import_node_path.default.join(rootPath, "routes"),
      (filePath) => filePath.endsWith(".php") && import_node_path.default.basename(filePath) === "console.php"
    ),
    addFiles(
      "container",
      import_node_path.default.join(rootPath, "app", "Providers"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "container",
      import_node_path.default.join(rootPath, "app"),
      (filePath) => filePath.endsWith("ServiceProvider.php")
    ),
    addFiles(
      "controller",
      import_node_path.default.join(rootPath, "app", "Http", "Controllers"),
      (filePath) => filePath.endsWith(".php")
    ),
    ...moduleRoots.map(
      (moduleRoot) => addFiles("controller", moduleRoot, (filePath) => filePath.endsWith("Controller.php"))
    ),
    addFiles(
      "facade",
      import_node_path.default.join(rootPath, "app", "Facades"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "facade",
      import_node_path.default.join(rootPath, "config"),
      (filePath) => import_node_path.default.basename(filePath) === "app.php"
    ),
    addFiles(
      "factory",
      import_node_path.default.join(rootPath, "database", "factories"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles("macro", import_node_path.default.join(rootPath, "app"), (filePath) => filePath.endsWith(".php")),
    addFiles(
      "middleware",
      import_node_path.default.join(rootPath, "app", "Http"),
      (filePath) => filePath.endsWith("Kernel.php")
    ),
    addFiles(
      "middleware",
      import_node_path.default.join(rootPath, "bootstrap"),
      (filePath) => import_node_path.default.basename(filePath) === "app.php"
    ),
    addFiles(
      "provider",
      import_node_path.default.join(rootPath, "app", "Providers"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "provider",
      import_node_path.default.join(rootPath, "app"),
      (filePath) => filePath.endsWith("ServiceProvider.php")
    ),
    addFiles("route", import_node_path.default.join(rootPath, "routes"), (filePath) => filePath.endsWith(".php")),
    addFiles("route", rootPath, (filePath) => import_node_path.default.basename(filePath) === "router.php"),
    addFiles(
      "view",
      import_node_path.default.join(rootPath, "resources", "views"),
      (filePath) => filePath.endsWith(".blade.php")
    ),
    ...(await inertiaPageDirectoryRoots(rootPath)).map(
      (pagesRoot) => addFiles("inertiaPage", pagesRoot, isInertiaPageFile)
    ),
    addFiles(
      "livewireComponent",
      import_node_path.default.join(rootPath, "app", "Livewire"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "livewireComponent",
      import_node_path.default.join(rootPath, "app", "Http", "Livewire"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles("config", import_node_path.default.join(rootPath, "config"), (filePath) => filePath.endsWith(".php")),
    addFiles(
      "model",
      import_node_path.default.join(rootPath, "app", "Models"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles("model", import_node_path.default.join(rootPath, "app"), (filePath) => filePath.endsWith(".php")),
    addFiles("phpClass", import_node_path.default.join(rootPath, "app"), (filePath) => filePath.endsWith(".php")),
    ...moduleRoots.map(
      (moduleRoot) => addFiles("phpClass", moduleRoot, (filePath) => filePath.endsWith(".php"))
    ),
    addFiles(
      "schema",
      import_node_path.default.join(rootPath, "database", "migrations"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "seeder",
      import_node_path.default.join(rootPath, "database", "seeders"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles("translation", import_node_path.default.join(rootPath, "lang"), isTranslationFile),
    addFiles("translation", import_node_path.default.join(rootPath, "resources", "lang"), isTranslationFile),
    addFiles(
      "validation",
      import_node_path.default.join(rootPath, "app", "Http", "Requests"),
      (filePath) => filePath.endsWith(".php")
    ),
    addFiles(
      "validation",
      import_node_path.default.join(rootPath, "app", "Http", "Controllers"),
      (filePath) => filePath.endsWith(".php")
    )
  ]);
  for (const fileName of [".env", ".env.example"]) {
    const filePath = import_node_path.default.join(rootPath, fileName);
    const seenKey = `env:${filePath}`;
    if (!seen.has(seenKey) && await fileSignature(filePath)) {
      seen.add(seenKey);
      candidates.push({ filePath, kind: "env" });
    }
  }
  for (const providerFilePath of [
    import_node_path.default.join(rootPath, "bootstrap", "providers.php"),
    import_node_path.default.join(rootPath, "config", "app.php"),
    import_node_path.default.join(rootPath, "composer.json")
  ]) {
    const seenKey = `provider:${providerFilePath}`;
    if (!seen.has(seenKey) && await fileSignature(providerFilePath)) {
      seen.add(seenKey);
      candidates.push({ filePath: providerFilePath, kind: "provider" });
    }
  }
  return sortBy(candidates, (candidate) => `${candidate.kind}:${candidate.filePath}`);
}
function collectChangedIndexFileCandidates(rootPath, changedFilePaths) {
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  for (const changedFilePath of changedFilePaths) {
    const filePath = import_node_path.default.resolve(changedFilePath);
    for (const kind of indexFileKindsForPath(rootPath, filePath)) {
      const seenKey = `${kind}:${filePath}`;
      if (!seen.has(seenKey)) {
        seen.add(seenKey);
        candidates.push({ filePath, kind });
      }
    }
  }
  return sortBy(candidates, (candidate) => `${candidate.kind}:${candidate.filePath}`);
}
function indexFileKindsForPath(rootPath, filePath) {
  const relativePath = import_node_path.default.relative(rootPath, filePath);
  if (relativePath === ".env" || relativePath === ".env.example") {
    return ["env"];
  }
  if (relativePath === "composer.json") {
    return ["provider"];
  }
  if (relativePath.startsWith(`routes${import_node_path.default.sep}`) && filePath.endsWith(".php")) {
    if (import_node_path.default.basename(filePath) === "console.php") {
      return ["route", "command"];
    }
    return ["route"];
  }
  if (relativePath.startsWith(import_node_path.default.join("resources", "views") + import_node_path.default.sep) && filePath.endsWith(".blade.php")) {
    return ["view"];
  }
  if (new RegExp(`^resources\\${import_node_path.default.sep}js\\${import_node_path.default.sep}[Pp]ages\\${import_node_path.default.sep}`).test(relativePath) && isInertiaPageFile(filePath)) {
    return ["inertiaPage"];
  }
  if (relativePath.startsWith(`config${import_node_path.default.sep}`) && filePath.endsWith(".php")) {
    if (relativePath === import_node_path.default.join("config", "app.php")) {
      return ["config", "facade", "provider"];
    }
    return ["config"];
  }
  if (relativePath === import_node_path.default.join("bootstrap", "providers.php")) {
    return ["provider"];
  }
  if (relativePath === import_node_path.default.join("bootstrap", "app.php")) {
    return ["middleware"];
  }
  if (relativePath.startsWith(import_node_path.default.join("database", "migrations") + import_node_path.default.sep) && filePath.endsWith(".php")) {
    return ["schema"];
  }
  if (relativePath.startsWith(import_node_path.default.join("database", "factories") + import_node_path.default.sep) && filePath.endsWith(".php")) {
    return ["factory"];
  }
  if (relativePath.startsWith(import_node_path.default.join("database", "seeders") + import_node_path.default.sep) && filePath.endsWith(".php")) {
    return ["seeder"];
  }
  if ((relativePath.startsWith(`lang${import_node_path.default.sep}`) || relativePath.startsWith(import_node_path.default.join("resources", "lang") + import_node_path.default.sep)) && isTranslationFile(filePath)) {
    return ["translation"];
  }
  if (import_node_path.default.basename(filePath) === "router.php") {
    return ["route"];
  }
  if (/^modules$/i.test(relativePath.split(import_node_path.default.sep)[0] ?? "") && filePath.endsWith(".php")) {
    const kinds = ["phpClass"];
    if (filePath.endsWith("Controller.php")) {
      kinds.push("controller");
    }
    return kinds;
  }
  if (relativePath.startsWith(`app${import_node_path.default.sep}`) && filePath.endsWith(".php")) {
    const kinds = ["model", "macro", "phpClass"];
    if (relativePath.startsWith(import_node_path.default.join("app", "Facades") + import_node_path.default.sep)) {
      kinds.push("facade");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "View", "Components") + import_node_path.default.sep)) {
      kinds.push("bladeComponent");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Livewire") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Http", "Livewire") + import_node_path.default.sep)) {
      kinds.push("livewireComponent");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Console", "Commands") + import_node_path.default.sep)) {
      kinds.push("command");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Providers") + import_node_path.default.sep)) {
      kinds.push("authorization", "container", "provider");
    }
    if (filePath.endsWith("ServiceProvider.php")) {
      kinds.push("container", "provider");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Policies") + import_node_path.default.sep)) {
      kinds.push("authorization");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Http", "Requests") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Http", "Controllers") + import_node_path.default.sep)) {
      kinds.push("validation");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Http", "Controllers") + import_node_path.default.sep)) {
      kinds.push("controller");
    }
    if (relativePath === import_node_path.default.join("app", "Http", "Kernel.php")) {
      kinds.push("middleware");
    }
    if (relativePath.startsWith(import_node_path.default.join("app", "Events") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Http", "Resources") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Jobs") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Listeners") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Mail") + import_node_path.default.sep) || relativePath.startsWith(import_node_path.default.join("app", "Notifications") + import_node_path.default.sep)) {
      kinds.push("artifact");
    }
    return kinds;
  }
  return [];
}
async function indexFile(rootPath, filePath, kind) {
  switch (kind) {
    case "authorization":
      return extractAuthorizationInfo(filePath, await safeRead(filePath));
    case "artifact":
      return extractLaravelArtifacts(rootPath, filePath, await safeRead(filePath));
    case "bladeComponent":
      return extractBladeClassComponentInfo(rootPath, filePath, await safeRead(filePath));
    case "command":
      return extractCommandInfo(filePath, await safeRead(filePath));
    case "container":
      return extractContainerBindings(filePath, await safeRead(filePath));
    case "controller":
      return extractControllerInfo(filePath, await safeRead(filePath));
    case "route":
      return extractRouteInfo(filePath, await safeRead(filePath), await routeBaseContextForFile(rootPath, filePath));
    case "view":
      return [extractBladeViewInfo(rootPath, filePath, await safeRead(filePath))];
    case "config":
      return extractConfigKeyInfo(filePath, await safeRead(filePath));
    case "env":
      return extractEnvKeyInfo(filePath, await safeRead(filePath));
    case "factory":
      return extractFactoryInfo(filePath, await safeRead(filePath));
    case "facade":
      return extractFacadeInfo(filePath, await safeRead(filePath));
    case "inertiaPage":
      return [extractInertiaPageInfo(rootPath, filePath)];
    case "livewireComponent": {
      const component = extractLivewireComponentInfo(rootPath, filePath, await safeRead(filePath));
      return component ? [component] : [];
    }
    case "macro":
      return extractMacroInfo(filePath, await safeRead(filePath));
    case "middleware":
      return extractMiddlewareInfo(filePath, await safeRead(filePath));
    case "model": {
      const info = extractModelInfo(filePath, await safeRead(filePath));
      return info ? [info] : [];
    }
    case "phpClass":
      return extractPhpClasses(filePath, await safeRead(filePath));
    case "provider":
      return extractServiceProviderInfo(filePath, await safeRead(filePath));
    case "schema":
      return extractSchemaTables(filePath, await safeRead(filePath));
    case "seeder":
      return extractSeederInfo(filePath, await safeRead(filePath));
    case "translation":
      return extractTranslationKeys(rootPath, filePath, await safeRead(filePath));
    case "validation":
      return extractValidationRules(filePath, await safeRead(filePath));
  }
}
async function routeBaseContextForFile(rootPath, filePath) {
  const providerSource = await safeRead(import_node_path.default.join(rootPath, "app", "Providers", "RouteServiceProvider.php"));
  const relativePath = import_node_path.default.relative(rootPath, filePath).split(import_node_path.default.sep).join("/");
  const mountedContext = routeMountContext(providerSource, relativePath);
  if (mountedContext) {
    return mountedContext;
  }
  return {};
}
function routeMountContext(source, relativePath) {
  const normalizedRelativePath = relativePath.replace(/^\/+/, "");
  for (const match of source.matchAll(/Route::([\s\S]*?)->group\s*\(\s*base_path\(\s*['"]([^'"]+)['"]\s*\)\s*\)/g)) {
    if (match[2].replace(/^\/+/, "") !== normalizedRelativePath) {
      continue;
    }
    return parseRouteChainContext(`Route::${match[1]}`);
  }
  return null;
}
function isTranslationFile(filePath) {
  return filePath.endsWith(".php") || filePath.endsWith(".json");
}
var INERTIA_PAGE_EXTENSIONS = [".vue", ".jsx", ".tsx", ".svelte", ".js", ".ts"];
function isInertiaPageFile(filePath) {
  return !filePath.endsWith(".d.ts") && INERTIA_PAGE_EXTENSIONS.some((extension) => filePath.endsWith(extension));
}
async function inertiaPageDirectoryRoots(rootPath) {
  try {
    const jsRoot = import_node_path.default.join(rootPath, "resources", "js");
    const entries = await (0, import_promises.readdir)(jsRoot, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory() && /^pages$/i.test(entry.name)).map((entry) => import_node_path.default.join(jsRoot, entry.name));
  } catch {
    return [];
  }
}
var LIVEWIRE_LIFECYCLE_METHODS = /* @__PURE__ */ new Set([
  "boot",
  "booted",
  "dehydrate",
  "exception",
  "hydrate",
  "messages",
  "mount",
  "render",
  "rendered",
  "rendering",
  "rules",
  "validationAttributes"
]);
function extractLivewireComponentInfo(rootPath, filePath, source) {
  const classMatch = /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\s+extends\s+([A-Za-z_\\][A-Za-z0-9_\\]*)/.exec(source);
  if (!classMatch || !livewireParentClass(classMatch[2], source)) {
    return null;
  }
  const properties = [];
  for (const property of source.matchAll(/\bpublic\s+(?!static\b)(?:\??[A-Za-z_\\][A-Za-z0-9_\\|]*\s+)?\$([A-Za-z_][A-Za-z0-9_]*)/g)) {
    properties.push(property[1]);
  }
  const methods = [];
  for (const method of source.matchAll(/\bpublic\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const name = method[1];
    if (LIVEWIRE_LIFECYCLE_METHODS.has(name) || name.startsWith("__") || /^(?:updating|updated)[A-Z]?/.test(name)) {
      continue;
    }
    methods.push(name);
  }
  return {
    className: classMatch[1],
    filePath,
    methods: uniqueSorted(methods),
    name: livewireComponentName(rootPath, filePath),
    namespace: /namespace\s+([^;]+);/.exec(source)?.[1].trim() ?? null,
    properties: uniqueSorted(properties)
  };
}
function livewireParentClass(parent, source) {
  if (/^\\?Livewire\\Component$/.test(parent)) {
    return true;
  }
  return parent === "Component" && /\buse\s+Livewire\\Component\s*;/.test(source);
}
function livewireComponentName(rootPath, filePath) {
  const livewireRoots = [
    import_node_path.default.join(rootPath, "app", "Http", "Livewire"),
    import_node_path.default.join(rootPath, "app", "Livewire")
  ];
  const livewireRoot = livewireRoots.find((candidate) => filePath.startsWith(candidate + import_node_path.default.sep));
  const relativePath = livewireRoot ? import_node_path.default.relative(livewireRoot, filePath) : import_node_path.default.basename(filePath);
  return relativePath.replace(/\.php$/, "").split(import_node_path.default.sep).map((segment) => segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()).join(".");
}
function extractInertiaPageInfo(rootPath, filePath) {
  const relativePath = import_node_path.default.relative(import_node_path.default.join(rootPath, "resources", "js"), filePath);
  const segments = relativePath.split(import_node_path.default.sep);
  const withoutPagesRoot = /^pages$/i.test(segments[0] ?? "") ? segments.slice(1) : segments;
  return {
    filePath,
    name: withoutPagesRoot.join("/").replace(/\.[A-Za-z]+$/, "")
  };
}
async function moduleDirectoryRoots(rootPath) {
  try {
    const entries = await (0, import_promises.readdir)(rootPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory() && /^modules$/i.test(entry.name)).map((entry) => import_node_path.default.join(rootPath, entry.name));
  } catch {
    return [];
  }
}
async function walk(startPath, include) {
  const results = [];
  try {
    const entries = await (0, import_promises.readdir)(startPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = import_node_path.default.join(startPath, entry.name);
      if (entry.isDirectory()) {
        if (!["vendor", "node_modules", "storage", "bootstrap/cache"].includes(entry.name)) {
          results.push(...await walk(entryPath, include));
        }
      } else if (entry.isFile() && include(entryPath)) {
        results.push(entryPath);
      }
    }
  } catch {
    return results;
  }
  return results;
}
async function fileSignature(filePath) {
  try {
    const fileStat = await (0, import_promises.stat)(filePath);
    if (!fileStat.isFile()) {
      return null;
    }
    return {
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size
    };
  } catch {
    return null;
  }
}
async function safeRead(filePath) {
  try {
    return await (0, import_promises.readFile)(filePath, "utf8");
  } catch {
    return "";
  }
}
function uniqueSorted(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function mergeSchemaTables(tables) {
  const byName = /* @__PURE__ */ new Map();
  for (const table of sortBy(tables, (candidate) => candidate.filePath)) {
    const existing = byName.get(table.name);
    if (!existing) {
      byName.set(table.name, {
        columns: uniqueColumns(table.columns),
        filePath: table.filePath,
        name: table.name
      });
      continue;
    }
    byName.set(table.name, {
      columns: uniqueColumns([...existing.columns, ...table.columns]),
      filePath: existing.filePath,
      name: table.name
    });
  }
  return sortBy([...byName.values()], (table) => table.name);
}
function bladeComponentsFromViews(views) {
  return sortBy(
    views.filter((view) => view.name.startsWith("components.")).map((view) => ({
      filePath: view.filePath,
      name: view.name.replace(/^components\./, ""),
      props: view.props,
      source: "anonymous",
      viewName: view.name
    })),
    (component) => component.name
  );
}
function mergeBladeComponents(components) {
  const byName = /* @__PURE__ */ new Map();
  for (const component of components) {
    const existing = byName.get(component.name);
    byName.set(component.name, {
      filePath: existing?.filePath ?? component.filePath,
      name: component.name,
      props: uniqueSorted([...existing?.props ?? [], ...component.props]),
      source: existing?.source === "class" ? "class" : component.source,
      viewName: existing?.viewName ?? component.viewName
    });
  }
  return sortBy([...byName.values()], (component) => component.name);
}
function uniqueTranslationKeys(keys) {
  const byKey = /* @__PURE__ */ new Map();
  for (const key of keys) {
    if (!byKey.has(key.key)) {
      byKey.set(key.key, key);
    }
  }
  return [...byKey.values()];
}
function normalizeConfigEntries(filePath, entries) {
  return entries.map(
    (entry) => typeof entry === "string" ? { filePath, key: entry, range: emptySourceRange() } : entry
  );
}
function normalizeEnvEntries(filePath, entries) {
  return entries.map(
    (entry) => typeof entry === "string" ? { filePath, key: entry, range: emptySourceRange() } : entry
  );
}
function uniqueConfigEntries(entries) {
  const byKey = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!byKey.has(entry.key)) {
      byKey.set(entry.key, entry);
    }
  }
  return [...byKey.values()];
}
function uniqueEnvEntries(entries) {
  const byKey = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!byKey.has(entry.key)) {
      byKey.set(entry.key, entry);
    }
  }
  return [...byKey.values()];
}
function emptySourceRange() {
  return {
    end: { character: 0, line: 0 },
    start: { character: 0, line: 0 }
  };
}
function uniqueAuthorization(entries) {
  const byAbility = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    if (!byAbility.has(entry.ability)) {
      byAbility.set(entry.ability, entry);
    }
  }
  return [...byAbility.values()];
}
function uniqueArtifacts(artifacts) {
  const byArtifact = /* @__PURE__ */ new Map();
  for (const artifact of artifacts) {
    byArtifact.set(`${artifact.kind}:${artifact.className}:${artifact.filePath}`, artifact);
  }
  return [...byArtifact.values()];
}
function uniqueContainerBindings(bindings) {
  const byAbstract = /* @__PURE__ */ new Map();
  for (const binding of bindings) {
    byAbstract.set(binding.abstract, binding);
  }
  return [...byAbstract.values()];
}
function uniqueCommands(commands) {
  const byName = /* @__PURE__ */ new Map();
  for (const command of commands) {
    byName.set(command.name, command);
  }
  return [...byName.values()];
}
function uniqueControllers(controllers) {
  const byClass = /* @__PURE__ */ new Map();
  for (const controller of controllers) {
    const key = controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className;
    byClass.set(key, controller);
  }
  return [...byClass.values()];
}
function uniqueFacades(facades) {
  const byClass = /* @__PURE__ */ new Map();
  for (const facade of facades) {
    byClass.set(facade.namespace ? `${facade.namespace}\\${facade.className}` : facade.className, facade);
  }
  return [...byClass.values()];
}
function resolveFacadeBindings(facades, bindings) {
  const bindingsByAbstract = new Map(bindings.map((binding) => [binding.abstract, binding]));
  return facades.map((facade) => ({
    ...facade,
    binding: facade.accessor ? bindingsByAbstract.get(facade.accessor) ?? null : null
  }));
}
function uniqueFactories(factories) {
  const byClass = /* @__PURE__ */ new Map();
  for (const factory of factories) {
    byClass.set(factory.className, factory);
  }
  return [...byClass.values()];
}
function uniqueMacros(macros) {
  const byMacro = /* @__PURE__ */ new Map();
  for (const macro of macros) {
    byMacro.set(`${macro.className}:${macro.method}`, macro);
  }
  return [...byMacro.values()];
}
function uniqueModelRelations(relations) {
  const byName = /* @__PURE__ */ new Map();
  for (const relation of relations) {
    byName.set(relation.name, relation);
  }
  return [...byName.values()];
}
function uniqueModelBuilderMethods(methods) {
  const byName = /* @__PURE__ */ new Map();
  for (const method of methods) {
    byName.set(method.name, method);
  }
  return [...byName.values()];
}
function uniqueMiddleware(entries) {
  const byAlias = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    byAlias.set(entry.alias, entry);
  }
  return [...byAlias.values()];
}
function uniqueServiceProviders(providers) {
  const byProvider = /* @__PURE__ */ new Map();
  for (const provider of providers) {
    const fullClassName = provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className;
    byProvider.set(`${provider.source}:${provider.filePath}:${fullClassName}`, provider);
  }
  return [...byProvider.values()];
}
function uniqueSeeders(seeders) {
  const byClass = /* @__PURE__ */ new Map();
  for (const seeder of seeders) {
    byClass.set(seeder.className, seeder);
  }
  return [...byClass.values()];
}
function uniqueColumns(columns) {
  const byName = /* @__PURE__ */ new Map();
  for (const column of columns) {
    byName.set(column.name, column);
  }
  return sortBy([...byName.values()], (column) => column.name);
}
function uncapitalize(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}
function snakeCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z])([A-Z][a-z])/g, "$1_$2").toLowerCase();
}
function kebabCase(value) {
  return snakeCase(value).replace(/_/g, "-");
}
function pluralize(value) {
  if (value.endsWith("y") && !/[aeiou]y$/.test(value)) {
    return `${value.slice(0, -1)}ies`;
  }
  if (value.endsWith("s")) {
    return `${value}es`;
  }
  return `${value}s`;
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function sortBy(values, select) {
  return [...values].sort((left, right) => select(left).localeCompare(select(right)));
}

// src/cacheStore.ts
var CACHE_FILE_NAME = "index.json";
function cacheFilePathForWorkspace(rootPath) {
  return import_node_path2.default.join(cacheDirectoryForWorkspace(rootPath), CACHE_FILE_NAME);
}
async function loadLaravelIndexCache(rootPath) {
  const cachePath = cacheFilePathForWorkspace(rootPath);
  try {
    const cache = JSON.parse(await (0, import_promises2.readFile)(cachePath, "utf8"));
    if (cache.version === LARAVEL_INDEX_CACHE_VERSION && cache.rootPath === rootPath && cache.files && typeof cache.files === "object") {
      return cache;
    }
  } catch {
  }
  return emptyIndexCache(rootPath);
}
async function saveLaravelIndexCache(cache) {
  const cachePath = cacheFilePathForWorkspace(cache.rootPath);
  const cacheDir = import_node_path2.default.dirname(cachePath);
  const tempPath = `${cachePath}.${process.pid}.tmp`;
  await (0, import_promises2.mkdir)(cacheDir, { recursive: true });
  await (0, import_promises2.writeFile)(tempPath, `${JSON.stringify(cache)}
`, "utf8");
  await (0, import_promises2.rename)(tempPath, cachePath);
}
function cacheDirectoryForWorkspace(rootPath) {
  const rootHash = (0, import_node_crypto.createHash)("sha1").update(rootPath).digest("hex");
  const baseDirectory = process.env.XDG_CACHE_HOME ?? import_node_path2.default.join(import_node_os.default.homedir(), ".cache");
  return import_node_path2.default.join(baseDirectory, "laravel-assist", rootHash);
}

// src/codeActions.ts
var import_node = __toESM(require_node3(), 1);
var import_node_path3 = __toESM(require("node:path"), 1);
var import_node_url = require("node:url");
var MAX_QUICK_FIXES_PER_DIAGNOSTIC = 5;
var EMPTY_BLADE_FILE = "";
var OPEN_CONCRETE_BINDING_COMMAND = "laravelAssist.openConcreteBinding";
function codeActionsForDiagnostics(params, index2, workspaceRoot2 = null, document) {
  const actions = [];
  const concreteBindingAction = document ? openConcreteBindingAction(params, index2, document) : null;
  if (concreteBindingAction) {
    actions.push(concreteBindingAction);
  }
  for (const diagnostic of params.context.diagnostics) {
    const authUserAction = authUserTypeNarrowingAction(params, diagnostic, document);
    if (authUserAction) {
      actions.push(authUserAction);
    }
    const data = laravelDiagnosticData(diagnostic);
    if (!data) {
      continue;
    }
    const namedArgumentOrderAction = sortNamedArgumentsAction(params, diagnostic, data);
    if (namedArgumentOrderAction) {
      actions.push(namedArgumentOrderAction);
    }
    for (const replacement of replacementCandidates(data, index2).slice(0, MAX_QUICK_FIXES_PER_DIAGNOSTIC)) {
      actions.push({
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [params.textDocument.uri]: [import_node.TextEdit.replace(diagnostic.range, replacement)]
          }
        },
        kind: import_node.CodeActionKind.QuickFix,
        title: `Replace with '${replacement}'`
      });
    }
    const createAction = createMissingArtifactAction(data, diagnostic, workspaceRoot2);
    if (createAction) {
      actions.push(createAction);
    }
  }
  actions.push(...modelGenerationActions(params, index2, workspaceRoot2));
  return actions;
}
function sortNamedArgumentsAction(params, diagnostic, data) {
  if (data.kind !== "namedArgumentOrder" || !data.replacement || !data.replacementRange) {
    return null;
  }
  return {
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [params.textDocument.uri]: [import_node.TextEdit.replace(data.replacementRange, data.replacement)]
      }
    },
    kind: import_node.CodeActionKind.QuickFix,
    title: "Sort arguments"
  };
}
function openConcreteBindingAction(params, index2, document) {
  const target = concreteBindingTargetAtRange(document, params.range, index2);
  if (!target) {
    return null;
  }
  const concreteName = target.className.split("\\").at(-1) ?? target.className;
  return {
    command: {
      arguments: [
        {
          selection: {
            end: { character: 0, line: 0 },
            start: { character: 0, line: 0 }
          },
          uri: (0, import_node_url.pathToFileURL)(target.filePath).toString()
        }
      ],
      command: OPEN_CONCRETE_BINDING_COMMAND,
      title: `Open Laravel concrete binding: ${concreteName}`
    },
    kind: import_node.CodeActionKind.Refactor,
    title: `Open Laravel concrete binding: ${concreteName}`
  };
}
function concreteBindingTargetAtRange(document, range2, index2) {
  const line = document.getText({
    start: { character: 0, line: range2.start.line },
    end: { character: Number.MAX_SAFE_INTEGER, line: range2.start.line }
  });
  const reference = classReferenceAtRange(line, range2.start.character, range2.end.character);
  if (!reference || !isPhpParameterTypeHint(line, reference)) {
    return null;
  }
  const resolvedReference = resolvePhpClassReference(document.getText(), reference.value);
  const binding = index2.containerBindings.find(
    (candidate) => classReferenceMatches(candidate.abstract, resolvedReference)
  );
  if (!binding?.concrete) {
    return null;
  }
  const target = indexedClassTarget(binding.concrete, index2);
  return target ? { className: target.className, filePath: target.filePath } : null;
}
function authUserTypeNarrowingAction(params, diagnostic, document) {
  if (!document || diagnostic.source !== "intelephense" || String(diagnostic.code ?? "") !== "P1006") {
    return null;
  }
  const expectedType = /Expected type '([^']+)'/.exec(diagnostic.message)?.[1];
  if (!expectedType || !/Found 'Illuminate\\Contracts\\Auth\\Authenticatable\|null'/.test(diagnostic.message)) {
    return null;
  }
  const line = document.getText({
    start: { character: 0, line: diagnostic.range.start.line },
    end: { character: Number.MAX_SAFE_INTEGER, line: diagnostic.range.start.line }
  });
  const authCall = authUserCallRange(line, diagnostic.range.start.character);
  if (!authCall) {
    return null;
  }
  const indent = /^\s*/.exec(line)?.[0] ?? "";
  const variable = "$authenticatedUser";
  const type = expectedType.startsWith("\\") ? expectedType : `\\${expectedType}`;
  return {
    diagnostics: [diagnostic],
    edit: {
      changes: {
        [params.textDocument.uri]: [
          import_node.TextEdit.insert(
            { character: 0, line: diagnostic.range.start.line },
            `${indent}/** @var ${type} ${variable} */
${indent}${variable} = Auth::user();
`
          ),
          import_node.TextEdit.replace(
            {
              end: { character: authCall.end, line: diagnostic.range.start.line },
              start: { character: authCall.start, line: diagnostic.range.start.line }
            },
            variable
          )
        ]
      }
    },
    kind: import_node.CodeActionKind.QuickFix,
    title: `Type-narrow Auth::user() as ${expectedType}`
  };
}
function authUserCallRange(line, preferredCharacter) {
  const ranges = [...line.matchAll(/\bAuth::user\(\)/g)].map((match) => ({
    end: (match.index ?? 0) + match[0].length,
    start: match.index ?? 0
  }));
  if (ranges.length === 0) {
    return null;
  }
  return ranges.find((range2) => preferredCharacter >= range2.start && preferredCharacter <= range2.end) ?? ranges[0];
}
function laravelDiagnosticData(diagnostic) {
  const data = diagnostic.data;
  if (data && typeof data.value === "string" && (data.kind === "route" || data.kind === "view" || data.kind === "component" || data.kind === "componentProp" || data.kind === "bladeSection" || data.kind === "bladeStack" || data.kind === "config" || data.kind === "env" || data.kind === "factoryState" || data.kind === "translation" || data.kind === "authorization" || data.kind === "container" || data.kind === "controller" || data.kind === "controllerAction" || data.kind === "command" || data.kind === "middleware" || data.kind === "relation" || data.kind === "seeder" || data.kind === "serviceProvider" || data.kind === "scope" || data.kind === "schemaColumn" || data.kind === "schemaTable" || data.kind === "routeParameter" || data.kind === "validationField" || data.kind === "modelAttribute" || data.kind === "namedArgumentOrder")) {
    return {
      kind: data.kind,
      model: typeof data.model === "string" ? data.model : void 0,
      replacement: typeof data.replacement === "string" ? data.replacement : void 0,
      replacementRange: isRangeLike(data.replacementRange) ? data.replacementRange : void 0,
      tableName: typeof data.tableName === "string" ? data.tableName : void 0,
      value: data.value
    };
  }
  return null;
}
function isRangeLike(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return Boolean(
    candidate && typeof candidate.start?.line === "number" && typeof candidate.start.character === "number" && typeof candidate.end?.line === "number" && typeof candidate.end.character === "number"
  );
}
function replacementCandidates(data, index2) {
  const candidates = allCandidates(data, index2);
  if (data.kind === "routeParameter") {
    return candidates;
  }
  const normalizedValue = data.value.toLowerCase();
  return candidates.map((candidate) => ({
    candidate,
    score: candidateScore(candidate.toLowerCase(), normalizedValue)
  })).filter((entry) => entry.score > 0).sort((left, right) => right.score - left.score || left.candidate.localeCompare(right.candidate)).map((entry) => entry.candidate);
}
function allCandidates(data, index2) {
  switch (data.kind) {
    case "authorization":
      return index2.authorization.map((entry) => entry.ability);
    case "command":
      return index2.commands.map((command) => command.name);
    case "component":
      return index2.bladeComponents.map((component) => component.name);
    case "componentProp":
      return data.model ? index2.bladeComponents.find((component) => component.name === data.model)?.props ?? [] : [];
    case "bladeSection":
      return data.model ? index2.bladeViews.find((view) => view.name === data.model)?.yields ?? [] : [];
    case "bladeStack":
      return data.model ? index2.bladeViews.find((view) => view.name === data.model)?.stacks ?? [] : [];
    case "config":
      return index2.configKeys;
    case "container":
      return index2.containerBindings.map((binding) => binding.abstract);
    case "controller":
      return index2.controllers.map(
        (controller) => controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className
      );
    case "controllerAction":
      return data.model ? findController(index2, data.model)?.actions ?? [] : [];
    case "env":
      return index2.envKeys;
    case "factoryState":
      return data.model ? index2.factories.filter((factory) => factory.model === data.model || factory.model?.split("\\").at(-1) === data.model).flatMap((factory) => factory.states) : [];
    case "inertiaPage":
      return index2.inertiaPages.map((page) => page.name);
    case "livewireComponent":
      return index2.livewireComponents.map((component) => component.name);
    case "middleware":
      return index2.middleware.map((middleware) => middleware.alias);
    case "modelAttribute":
      return data.tableName ? index2.schemaTables.find((table) => table.name === data.tableName)?.columns.map((column) => column.name) ?? [] : [];
    case "relation":
      return data.model ? findModel(index2, data.model)?.relations.map((relation) => relation.name) ?? [] : [];
    case "route":
      return index2.routes.map((route) => route.name).filter((name) => Boolean(name));
    case "routeParameter":
      return routeParameters(index2.routes.find((route) => route.name === data.model));
    case "schemaColumn":
      return data.tableName ? index2.schemaTables.find((table) => table.name === data.tableName)?.columns.map((column) => column.name) ?? [] : [];
    case "schemaTable":
      return index2.schemaTables.map((table) => table.name);
    case "seeder":
      return index2.seeders.map((seeder) => seeder.className);
    case "serviceProvider":
      return index2.providers.filter((provider) => provider.source === "class").map((provider) => provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className);
    case "scope": {
      const model = data.model ? findModel(index2, data.model) : null;
      return model ? uniqueSorted2([...model.scopes, ...model.staticMethods ?? []]) : [];
    }
    case "translation":
      return index2.translationKeys.map((translation) => translation.key);
    case "validationField":
      return uniqueSorted2(index2.validationRules.flatMap((ruleSet) => ruleSet.fields.map((field) => field.field)));
    case "view":
      return index2.bladeViews.map((view) => view.name);
    case "namedArgumentOrder":
    case "policyConvention":
    case "requestConvention":
    case "resourceConvention":
      return [];
  }
}
function findModel(index2, modelName) {
  return index2.models.find(
    (model) => model.className === modelName || `${model.namespace}\\${model.className}` === modelName
  ) ?? null;
}
function findController(index2, controllerName2) {
  return index2.controllers.find(
    (controller) => controller.className === controllerName2 || `${controller.namespace}\\${controller.className}` === controllerName2
  ) ?? null;
}
function routeParameters(route) {
  if (!route?.uri) {
    return [];
  }
  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}
function createMissingArtifactAction(data, diagnostic, workspaceRoot2) {
  if (!workspaceRoot2 || data.kind !== "view" && data.kind !== "component") {
    return null;
  }
  const filePath = data.kind === "view" ? bladeViewFilePath(workspaceRoot2, data.value) : bladeComponentFilePath(workspaceRoot2, data.value);
  if (!filePath) {
    return null;
  }
  const uri = (0, import_node_url.pathToFileURL)(filePath).toString();
  return {
    diagnostics: [diagnostic],
    edit: {
      documentChanges: [
        import_node.CreateFile.create(uri, { ignoreIfExists: true }),
        import_node.TextDocumentEdit.create(
          {
            uri,
            version: null
          },
          [import_node.TextEdit.insert({ character: 0, line: 0 }, EMPTY_BLADE_FILE)]
        )
      ]
    },
    kind: import_node.CodeActionKind.QuickFix,
    title: data.kind === "view" ? `Create Blade view '${data.value}'` : `Create Blade component '${data.value}'`
  };
}
function bladeViewFilePath(workspaceRoot2, viewName) {
  const segments = safeLaravelNameSegments(viewName);
  if (!segments) {
    return null;
  }
  return import_node_path3.default.join(workspaceRoot2, "resources", "views", `${import_node_path3.default.join(...segments)}.blade.php`);
}
function bladeComponentFilePath(workspaceRoot2, componentName) {
  const segments = safeLaravelNameSegments(componentName.replace(/:/g, "."));
  if (!segments) {
    return null;
  }
  return import_node_path3.default.join(workspaceRoot2, "resources", "views", "components", `${import_node_path3.default.join(...segments)}.blade.php`);
}
function safeLaravelNameSegments(name) {
  const segments = name.split(".").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  return segments.every((segment) => /^[A-Za-z0-9_-]+$/.test(segment)) ? segments : null;
}
function modelGenerationActions(params, index2, workspaceRoot2) {
  if (!workspaceRoot2) {
    return [];
  }
  const filePath = pathFromUri(params.textDocument.uri);
  const model = index2.models.find((candidate) => candidate.filePath === filePath);
  if (!model) {
    return [];
  }
  const actions = [];
  if (!hasFactory(model, index2)) {
    const filePath2 = import_node_path3.default.join(workspaceRoot2, "database", "factories", `${model.className}Factory.php`);
    actions.push(createFileAction(
      `Create factory for ${model.className}`,
      filePath2,
      factoryStub(model, index2)
    ));
  }
  if (!hasJsonResource(model, index2)) {
    const filePath2 = import_node_path3.default.join(workspaceRoot2, "app", "Http", "Resources", `${model.className}Resource.php`);
    actions.push(createFileAction(
      `Create JSON resource for ${model.className}`,
      filePath2,
      resourceStub(model, index2)
    ));
  }
  if (!hasPolicy(model, index2)) {
    const filePath2 = import_node_path3.default.join(workspaceRoot2, "app", "Policies", `${model.className}Policy.php`);
    actions.push(createFileAction(
      `Create policy for ${model.className}`,
      filePath2,
      policyStub(model)
    ));
  }
  if (!hasSeeder(model, index2)) {
    const filePath2 = import_node_path3.default.join(workspaceRoot2, "database", "seeders", `${model.className}Seeder.php`);
    actions.push(createFileAction(
      `Create seeder for ${model.className}`,
      filePath2,
      seederStub(model)
    ));
  }
  if (!hasFormRequest(model, index2, "Store")) {
    const filePath2 = import_node_path3.default.join(workspaceRoot2, "app", "Http", "Requests", `Store${model.className}Request.php`);
    actions.push(createFileAction(
      `Create store request for ${model.className}`,
      filePath2,
      formRequestStub(model, index2, "Store")
    ));
  }
  if (!hasFormRequest(model, index2, "Update")) {
    const filePath2 = import_node_path3.default.join(workspaceRoot2, "app", "Http", "Requests", `Update${model.className}Request.php`);
    actions.push(createFileAction(
      `Create update request for ${model.className}`,
      filePath2,
      formRequestStub(model, index2, "Update")
    ));
  }
  return actions;
}
function createFileAction(title, filePath, contents) {
  const uri = (0, import_node_url.pathToFileURL)(filePath).toString();
  return {
    edit: {
      documentChanges: [
        import_node.CreateFile.create(uri, { ignoreIfExists: true }),
        import_node.TextDocumentEdit.create(
          {
            uri,
            version: null
          },
          [import_node.TextEdit.insert({ character: 0, line: 0 }, contents)]
        )
      ]
    },
    kind: import_node.CodeActionKind.Refactor,
    title
  };
}
function hasFactory(model, index2) {
  return index2.factories.some(
    (factory) => factory.className === `${model.className}Factory` || factory.model === model.className || factory.model === `${model.namespace}\\${model.className}` || factory.model?.split("\\").at(-1) === model.className
  );
}
function hasJsonResource(model, index2) {
  return index2.artifacts.some(
    (artifact) => artifact.kind === "resource" && artifact.className === `${model.className}Resource`
  );
}
function hasPolicy(model, index2) {
  return index2.authorization.some(
    (entry) => entry.policy === `${model.className}Policy` || entry.policy === `${model.namespace}\\Policies\\${model.className}Policy` || entry.policy?.split("\\").at(-1) === `${model.className}Policy` || entry.model === model.className || entry.model === `${model.namespace}\\${model.className}` || entry.model?.split("\\").at(-1) === model.className
  );
}
function hasSeeder(model, index2) {
  return index2.seeders.some((seeder) => seeder.className === `${model.className}Seeder`);
}
function hasFormRequest(model, index2, action) {
  return index2.validationRules.some(
    (ruleSet) => ruleSet.source === "formRequest" && (ruleSet.className === `${action}${model.className}Request` || ruleSet.className === `${model.className}${action}Request`)
  );
}
function factoryStub(model, index2) {
  const namespace = model.namespace ?? "App\\Models";
  const fields = modelFieldNames(model, index2);
  const fieldLines = fields.length > 0 ? fields.map((field) => `            '${field}' => ${fakeValueForField(field)},`).join("\n") : "            //";
  return `<?php

namespace Database\\Factories;

use ${namespace}\\${model.className};
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

/**
 * @extends Factory<${model.className}>
 */
class ${model.className}Factory extends Factory
{
    protected $model = ${model.className}::class;

    public function definition(): array
    {
        return [
${fieldLines}
        ];
    }
}
`;
}
function resourceStub(model, index2) {
  const fields = modelFieldNames(model, index2);
  const fieldLines = fields.length > 0 ? fields.map((field) => `            '${field}' => $this->${field},`).join("\n") : "            //";
  return `<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class ${model.className}Resource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
${fieldLines}
        ];
    }
}
`;
}
function policyStub(model) {
  const namespace = model.namespace ?? "App\\Models";
  const useLines = uniqueSorted2([`${namespace}\\${model.className}`, "App\\Models\\User"]).map((className) => `use ${className};`).join("\n");
  const subjectVariable = model.className === "User" ? "model" : lowerFirst(model.className);
  return `<?php

namespace App\\Policies;

${useLines}

class ${model.className}Policy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function delete(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function restore(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }

    public function forceDelete(User $user, ${model.className} $${subjectVariable}): bool
    {
        return false;
    }
}
`;
}
function seederStub(model) {
  const namespace = model.namespace ?? "App\\Models";
  return `<?php

namespace Database\\Seeders;

use ${namespace}\\${model.className};
use Illuminate\\Database\\Seeder;

class ${model.className}Seeder extends Seeder
{
    public function run(): void
    {
        ${model.className}::factory()->count(10)->create();
    }
}
`;
}
function formRequestStub(model, index2, action) {
  const rules = validationRuleLines(model, index2, action);
  return `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ${action}${model.className}Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
${rules}
        ];
    }
}
`;
}
function validationRuleLines(model, index2, action) {
  const schemaColumns = schemaColumnsForModel(model, index2);
  const fields = modelFieldNames(model, index2);
  if (fields.length === 0) {
    return "            //";
  }
  return fields.map((field) => {
    const column = schemaColumns.find((candidate) => candidate.name === field);
    return `            '${field}' => ['${validationRulesForField(field, column, action).join("', '")}'],`;
  }).join("\n");
}
function validationRulesForField(field, column, action) {
  const rules = action === "Update" ? ["sometimes"] : [];
  rules.push(column?.modifiers.includes("nullable") ? "nullable" : "required");
  if (field === "email" || field.endsWith("_email")) {
    rules.push("email");
  }
  switch (column?.type) {
    case "boolean":
      rules.push("boolean");
      break;
    case "date":
    case "dateTime":
    case "timestamp":
    case "timestamps":
      rules.push("date");
      break;
    case "decimal":
    case "double":
    case "float":
      rules.push("numeric");
      break;
    case "foreignId":
    case "id":
    case "integer":
    case "tinyInteger":
    case "smallInteger":
    case "mediumInteger":
    case "bigInteger":
    case "unsignedInteger":
    case "unsignedBigInteger":
      rules.push("integer");
      break;
    case "json":
      rules.push("array");
      break;
    case "string":
    case "char":
      rules.push("string", "max:255");
      break;
    case "text":
    case "longText":
    case "mediumText":
      rules.push("string");
      break;
    default:
      rules.push("string");
      break;
  }
  if (column?.modifiers.includes("unique")) {
    rules.push(`unique:${column.tableName},${column.name}`);
  }
  return rules;
}
function modelFieldNames(model, index2) {
  const explicitFields = [...model.fillable, ...model.casts].filter((field) => field !== "password");
  if (explicitFields.length > 0) {
    return uniqueSorted2(explicitFields);
  }
  const skipped = /* @__PURE__ */ new Set(["created_at", "deleted_at", "email_verified_at", "id", "password", "remember_token", "updated_at"]);
  return index2.schemaTables.find((table) => table.name === model.tableName)?.columns.map((column) => column.name).filter((field) => !skipped.has(field)) ?? [];
}
function schemaColumnsForModel(model, index2) {
  return index2.schemaTables.find((table) => table.name === model.tableName)?.columns ?? [];
}
function fakeValueForField(field) {
  if (field === "email" || field.endsWith("_email")) {
    return "fake()->safeEmail()";
  }
  if (field === "name" || field.endsWith("_name")) {
    return "fake()->name()";
  }
  if (field === "title") {
    return "fake()->sentence()";
  }
  if (field === "body" || field === "description" || field === "content") {
    return "fake()->paragraph()";
  }
  if (field.endsWith("_at") || field.endsWith("_date")) {
    return "fake()->dateTime()";
  }
  if (field.startsWith("is_") || field.startsWith("has_")) {
    return "fake()->boolean()";
  }
  if (field.endsWith("_id")) {
    return "1";
  }
  return "fake()->word()";
}
function uniqueSorted2(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function lowerFirst(value) {
  return value.replace(/^./, (match) => match.toLowerCase());
}
function pathFromUri(uri) {
  try {
    return (0, import_node_url.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function classReferenceAtRange(line, startCharacter, endCharacter) {
  const effectiveEnd = Math.max(startCharacter, endCharacter);
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)\b/g)) {
    const start = match.index ?? 0;
    const end = start + match[1].length;
    const cursorInsideToken = startCharacter >= start && startCharacter <= end;
    const rangeOverlapsToken = startCharacter <= end && effectiveEnd >= start;
    if (cursorInsideToken || rangeOverlapsToken) {
      return { start, value: match[1] };
    }
  }
  return null;
}
function isPhpParameterTypeHint(line, reference) {
  const prefix = line.slice(0, reference.start);
  const suffix = line.slice(reference.start + reference.value.length);
  return /(?:^|[(,|&])\s*(?:(?:public|protected|private|readonly|static)\s+)*\??\s*$/.test(prefix) && /^\s+\$[A-Za-z_][A-Za-z0-9_]*/.test(suffix);
}
function indexedClassTarget(classReference, index2) {
  const candidates = [
    ...index2.models,
    ...index2.controllers,
    ...index2.artifacts,
    ...index2.livewireComponents
  ];
  return candidates.find(
    (candidate) => classReferenceMatches(indexedClassReference(candidate), classReference)
  ) ?? null;
}
function indexedClassReference(candidate) {
  return candidate.namespace ? `${candidate.namespace}\\${candidate.className}` : candidate.className;
}
function classReferenceMatches(indexedReference, value) {
  const indexed = normalizeClassReference(indexedReference);
  const compared = normalizeClassReference(value);
  return indexed === compared || indexed.split("\\").at(-1) === compared || compared.split("\\").at(-1) === indexed;
}
function normalizeClassReference(value) {
  return value.replace(/\\\\/g, "\\").replace(/^\\+/, "");
}
function candidateScore(candidate, value) {
  if (candidate === value) {
    return 100;
  }
  if (candidate.includes(value) || value.includes(candidate)) {
    return 80;
  }
  const distance = levenshteinDistance(candidate, value);
  if (distance <= 3) {
    return 50 - distance;
  }
  const candidateParts = new Set(candidate.split(/[._:-]+/).filter(Boolean));
  const valueParts = value.split(/[._:-]+/).filter(Boolean);
  return valueParts.filter((part) => candidateParts.has(part)).length;
}
function levenshteinDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index2) => index2);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}

// src/codeLens.ts
var import_promises3 = require("node:fs/promises");
var import_node_url2 = require("node:url");
var import_node2 = __toESM(require_node3(), 1);

// src/containerResolution.ts
var CONTAINER_INSTANCE_METHOD_NAMES = "make|makeWith|build|get";
var CONTAINER_CLASS_ARGUMENT_METHOD_NAMES = "make|makeWith|build|get|factory";
var CONTAINER_BINDING_METHOD_NAMES = "make|makeWith|get|factory|bound|has";
var CONTAINER_RECEIVER_SOURCE = "(?:App::|app\\(\\)\\s*(?:\\?->|->)|\\$this\\s*(?:\\?->|->)\\s*app\\s*(?:\\?->|->)|Container::getInstance\\(\\)\\s*(?:\\?->|->))";
var CONTAINER_INSTANCE_ENTRY_SOURCE = `(?:\\b(?:app|resolve)|${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_INSTANCE_METHOD_NAMES}))`;
var CONTAINER_INSTANCE_CALL_SOURCE = `${CONTAINER_INSTANCE_ENTRY_SOURCE}\\s*\\([^;\\n]*\\)`;
var IDENTIFIER_TAIL = "(?:\\\\?[A-Za-z_\\\\][A-Za-z0-9_\\\\]*)?";
function isContainerBindingStringPrefix(linePrefix) {
  return /\b(?:app|resolve)\(\s*['"][^'"]*$/.test(linePrefix) || new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_BINDING_METHOD_NAMES})\\(\\s*['"][^'"]*$`).test(linePrefix);
}
function isContainerClassArgumentPrefix(linePrefix) {
  return new RegExp(`\\b(?:app|resolve)\\(\\s*${IDENTIFIER_TAIL}$`).test(linePrefix) || new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_CLASS_ARGUMENT_METHOD_NAMES})\\(\\s*${IDENTIFIER_TAIL}$`).test(linePrefix);
}
function isContainerBindingStringOpeningPrefix(prefix) {
  return /\b(?:app|resolve)\s*\(\s*$/.test(prefix) || new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_BINDING_METHOD_NAMES})\\s*\\(\\s*$`).test(prefix);
}
function containerBindingReferenceRegExps() {
  return [
    /\b(?:app|resolve)\s*\(\s*(['"])([^'"]+)\1/g,
    new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_BINDING_METHOD_NAMES})\\s*\\(\\s*(['"])([^'"]+)\\1`, "g")
  ];
}
function containerResolvedMemberClass(documentPrefix, linePrefix, index2) {
  const receiverExpression = `(?:\\$[A-Za-z_][A-Za-z0-9_]*|${CONTAINER_INSTANCE_CALL_SOURCE})`;
  const receiver = new RegExp(`(${receiverExpression})\\s*(?:\\?->|->)\\s*[A-Za-z_][A-Za-z0-9_]*$`).exec(linePrefix)?.[1] ?? new RegExp(`(${receiverExpression})\\s*(?:\\?->|->)\\s*$`).exec(linePrefix)?.[1];
  if (!receiver) {
    return null;
  }
  if (receiver.startsWith("$")) {
    return docblockPhpClassForVariable(documentPrefix, receiver) ?? containerResolvedAssignmentClass(documentPrefix, receiver, index2);
  }
  return classReferenceFromContainerExpression(documentPrefix, receiver, index2);
}
function docblockPhpClassForVariable(documentPrefix, variable) {
  const annotation = new RegExp(`@var\\s+([^\\s]+)\\s+${escapeRegex(variable)}\\b`).exec(documentPrefix);
  if (!annotation) {
    return null;
  }
  const classReference = annotation[1].split("|").find((part) => /^\\?[A-Za-z_][A-Za-z0-9_\\]*$/.test(part));
  return classReference ? resolvePhpClassReference(documentPrefix, classReference) : null;
}
function containerResolvedAssignmentClass(documentPrefix, variable, index2) {
  const assignmentPattern = new RegExp(
    `${escapeRegex(variable)}\\s*=\\s*(${CONTAINER_INSTANCE_CALL_SOURCE})`,
    "g"
  );
  let classReference = null;
  for (const match of documentPrefix.matchAll(assignmentPattern)) {
    classReference = classReferenceFromContainerExpression(documentPrefix, match[1], index2);
  }
  return classReference;
}
function classReferenceFromContainerExpression(documentPrefix, expression, index2) {
  const classMatch = new RegExp(`${CONTAINER_INSTANCE_ENTRY_SOURCE}\\s*\\(\\s*(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::class\\b`).exec(expression);
  if (classMatch) {
    return resolvePhpClassReference(documentPrefix, classMatch[1]);
  }
  const stringMatch = new RegExp(`${CONTAINER_INSTANCE_ENTRY_SOURCE}\\s*\\(\\s*['"]([^'"]+)['"]`).exec(expression);
  if (!stringMatch) {
    return null;
  }
  const binding = index2.containerBindings.find((candidate) => candidate.abstract === stringMatch[1]);
  return binding?.concrete ?? (isClassLikeReference2(stringMatch[1]) ? stringMatch[1] : null);
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function isClassLikeReference2(value) {
  return /^\\?[A-Z_\\][A-Za-z0-9_\\]*$/.test(value);
}
function containerResolvedPhpClasses(classReference, index2) {
  const classes = [];
  const addClass = (reference) => {
    if (!reference) {
      return;
    }
    const phpClass = phpClassForReference(reference, index2);
    if (phpClass && !classes.some((candidate) => candidate.fqcn === phpClass.fqcn)) {
      classes.push(phpClass);
    }
  };
  addClass(classReference);
  const binding = index2.containerBindings.find(
    (candidate) => classReferenceMatches2(candidate.abstract, classReference)
  );
  addClass(binding?.concrete);
  return classes;
}
function phpClassForReference(classReference, index2) {
  return index2.phpClasses.find((phpClass) => classReferenceMatches2(phpClass.fqcn, classReference)) ?? null;
}
function classReferenceMatches2(indexedReference, value) {
  const indexed = normalizeClassReference2(indexedReference);
  const compared = normalizeClassReference2(value);
  return indexed === compared || indexed.split("\\").at(-1) === compared || compared.split("\\").at(-1) === indexed;
}
function normalizeClassReference2(value) {
  return value.replace(/\\\\/g, "\\").replace(/^\\+/, "");
}

// src/instanceTypes.ts
var import_node_fs = require("node:fs");
var import_node_path4 = __toESM(require("node:path"), 1);
var AUTH_USER_CALL = "(?:\\\\?Auth::(?:guard\\([^)]*\\)->)?user\\(\\)|auth\\(\\)->(?:guard\\([^)]*\\)->)?user\\(\\)|\\$request->user\\(\\)|request\\(\\)->user\\(\\))";
var CHAIN_INSTANCE_METHODS = /* @__PURE__ */ new Set([
  "create",
  "find",
  "findOrFail",
  "findOrNew",
  "first",
  "firstOr",
  "firstOrCreate",
  "firstOrFail",
  "firstOrNew",
  "firstWhere",
  "forceCreate",
  "fresh",
  "load",
  "loadCount",
  "loadMissing",
  "refresh",
  "replicate",
  "sole",
  "updateOrCreate"
]);
var CHAIN_TERMINAL_METHODS = /* @__PURE__ */ new Set([
  "all",
  "avg",
  "chunk",
  "chunkById",
  "chunkMap",
  "count",
  "cursor",
  "cursorPaginate",
  "delete",
  "doesntExist",
  "each",
  "exists",
  "get",
  "getBindings",
  "implode",
  "insert",
  "insertGetId",
  "lazy",
  "lazyById",
  "lazyByIdDesc",
  "max",
  "min",
  "paginate",
  "pluck",
  "simplePaginate",
  "sum",
  "toArray",
  "toBase",
  "toRawSql",
  "toSql",
  "update",
  "value"
]);
var SINGLE_INSTANCE_RELATION_TYPES = /* @__PURE__ */ new Set(["belongsTo", "hasOne", "hasOneThrough", "morphOne", "morphTo"]);
function instanceModelForPrefix(documentText, prefix, index2) {
  const arrowMatch = /(\?->|->)\s*$/.exec(prefix);
  if (!arrowMatch) {
    return null;
  }
  const receiver = prefix.slice(0, prefix.length - arrowMatch[0].length);
  return modelForReceiver(documentText, receiver, index2);
}
function docblockVariableModel(documentText, variable, index2) {
  const escapedVariable = variable.replace("$", "\\$");
  const annotation = new RegExp(`@var\\s+\\\\?([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)(?:\\|[^\\s]*)?\\s+${escapedVariable}\\b`).exec(
    documentText
  );
  if (!annotation) {
    return null;
  }
  return findIndexedModel(index2, resolvePhpClassReference(documentText, annotation[1]));
}
function authUserModel(index2) {
  if (index2.authUserModel) {
    const configured = findIndexedModel(index2, index2.authUserModel);
    if (configured) {
      return configured;
    }
  }
  const candidates = index2.models.filter((model) => model.className === "User");
  return candidates.find((model) => model.relations.length > 0) ?? candidates[0] ?? null;
}
function findIndexedModel(index2, className) {
  return index2.models.find(
    (model) => model.className === className || `${model.namespace}\\${model.className}` === className
  ) ?? null;
}
function frameworkBuilderMethodTargetForPrefix(documentText, prefix, index2, member) {
  const chain = chainContextForPrefix(documentText, prefix, index2);
  if (!chain) {
    return null;
  }
  return chain.relation ? frameworkMethodTarget(chain.anchor, member, frameworkClassCandidates(chain.relation), chain.relation) : frameworkBuilderMethodTarget(chain.anchor, member);
}
function isKnownEloquentBuilderMethod(method) {
  return frameworkClassCandidates().some((className) => fallbackFrameworkMethods(className).has(method));
}
function instanceMemberTargetForPrefix(documentText, prefix, index2, member) {
  const direct = instanceModelForPrefix(documentText, prefix, index2);
  if (direct) {
    return instanceMemberTarget(direct, member) ?? frameworkBuilderMethodTarget(direct, member);
  }
  const chain = chainContextForPrefix(documentText, prefix, index2);
  if (!chain) {
    return null;
  }
  if (chain.model) {
    const memberTarget = instanceMemberTarget(chain.model, member);
    if (memberTarget) {
      return memberTarget;
    }
    const builderMethod = chain.model.customBuilder?.methods.find((candidate) => candidate.name === member);
    if (builderMethod && chain.model.customBuilder?.filePath) {
      return { filePath: chain.model.customBuilder.filePath, kind: "method", model: chain.model, name: member };
    }
  }
  return chain.relation ? frameworkMethodTarget(chain.anchor, member, frameworkClassCandidates(chain.relation), chain.relation) : frameworkBuilderMethodTarget(chain.anchor, member);
}
function instanceMemberTarget(model, member) {
  const method = model.methodDetails?.find((candidate) => candidate.name === member);
  if (method) {
    return {
      filePath: model.filePath,
      kind: model.relations.some((relation) => relation.name === member) ? "relation" : "method",
      model,
      name: member,
      range: method.range
    };
  }
  const traitScope = model.scopeDetails?.find((candidate) => candidate.name === member);
  if (traitScope) {
    return { filePath: traitScope.filePath, kind: "scope", model, name: member };
  }
  if (model.relations.some((relation) => relation.name === member)) {
    return { filePath: model.filePath, kind: "relation", model, name: member };
  }
  if (model.scopes.includes(member)) {
    return { filePath: model.filePath, kind: "scope", model, name: member };
  }
  return null;
}
function modelForReceiver(documentText, receiver, index2) {
  if (new RegExp(`${AUTH_USER_CALL}\\s*$`).test(receiver)) {
    return authUserModel(index2);
  }
  const variable = /(\$[A-Za-z_][A-Za-z0-9_]*)\s*$/.exec(receiver)?.[1];
  return variable ? modelForVariable(documentText, variable, index2) : null;
}
function modelForVariable(documentText, variable, index2) {
  if (variable === "$this") {
    return enclosingClassModel(documentText, index2);
  }
  const docblockModel = docblockVariableModel(documentText, variable, index2);
  if (docblockModel) {
    return docblockModel;
  }
  const escapedVariable = variable.replace("$", "\\$");
  if (new RegExp(`${escapedVariable}\\s*=\\s*${AUTH_USER_CALL}`).test(documentText)) {
    return authUserModel(index2);
  }
  const typedPatterns = [
    new RegExp(`${escapedVariable}\\s*=\\s*new\\s+(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::[A-Za-z_]`, "g"),
    new RegExp(`(\\\\?[A-Z][A-Za-z0-9_\\\\]*)\\s+${escapedVariable}\\b`, "g")
  ];
  for (const pattern of typedPatterns) {
    for (const match of documentText.matchAll(pattern)) {
      const model = findIndexedModel(index2, resolvePhpClassReference(documentText, match[1]));
      if (model) {
        return model;
      }
    }
  }
  return null;
}
function enclosingClassModel(documentText, index2) {
  const className = /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/.exec(documentText)?.[1];
  if (!className) {
    return null;
  }
  const namespace = /\bnamespace\s+([^;{\s]+)/.exec(documentText)?.[1];
  return findIndexedModel(index2, namespace ? `${namespace}\\${className}` : className);
}
function chainContextForPrefix(documentText, prefix, index2) {
  const scan = scanChainForPrefix(prefix);
  if (!scan) {
    return null;
  }
  const root = chainRootModel(documentText, scan, index2);
  if (!root) {
    return null;
  }
  const walkSegments = [
    ...root.rootMethod ? [{ isCall: true, name: root.rootMethod }] : [],
    ...scan.segments.slice(root.consumedSegments)
  ];
  let model = root.model;
  let relation = null;
  for (const segment of walkSegments) {
    const segmentRelation = model?.relations.find((candidate) => candidate.name === segment.name) ?? null;
    if (segmentRelation && segment.isCall) {
      relation = segmentRelation;
      model = relatedIndexedModel(documentText, segmentRelation, index2);
      continue;
    }
    if (segmentRelation) {
      if (!SINGLE_INSTANCE_RELATION_TYPES.has(segmentRelation.type)) {
        return null;
      }
      relation = null;
      model = relatedIndexedModel(documentText, segmentRelation, index2);
      if (!model) {
        return null;
      }
      continue;
    }
    if (!segment.isCall) {
      return null;
    }
    if (CHAIN_TERMINAL_METHODS.has(segment.name)) {
      return null;
    }
    if (CHAIN_INSTANCE_METHODS.has(segment.name)) {
      relation = null;
      continue;
    }
  }
  return { anchor: root.model, model, relation };
}
function chainRootModel(documentText, scan, index2) {
  const { root, segments } = scan;
  if (root.kind === "variable") {
    if (root.name === "$request" && isCallSegment(segments[0], "user")) {
      const model2 = authUserModel(index2);
      return model2 ? { consumedSegments: 1, model: model2 } : null;
    }
    const model = modelForVariable(documentText, root.name, index2);
    return model ? { consumedSegments: 0, model } : null;
  }
  if (root.kind === "staticCall") {
    if (isAuthFacadeReference(documentText, root.className)) {
      if (root.method === "user") {
        const model2 = authUserModel(index2);
        return model2 ? { consumedSegments: 0, model: model2 } : null;
      }
      if (root.method === "guard" && isCallSegment(segments[0], "user")) {
        const model2 = authUserModel(index2);
        return model2 ? { consumedSegments: 1, model: model2 } : null;
      }
      return null;
    }
    const model = ["self", "static"].includes(root.className) ? enclosingClassModel(documentText, index2) : findIndexedModel(index2, resolvePhpClassReference(documentText, root.className));
    return model ? { consumedSegments: 0, model, ...root.method ? { rootMethod: root.method } : {} } : null;
  }
  if (root.name === "auth") {
    if (isCallSegment(segments[0], "user")) {
      const model = authUserModel(index2);
      return model ? { consumedSegments: 1, model } : null;
    }
    if (isCallSegment(segments[0], "guard") && isCallSegment(segments[1], "user")) {
      const model = authUserModel(index2);
      return model ? { consumedSegments: 2, model } : null;
    }
    return null;
  }
  if (root.name === "request" && isCallSegment(segments[0], "user")) {
    const model = authUserModel(index2);
    return model ? { consumedSegments: 1, model } : null;
  }
  return null;
}
function isCallSegment(segment, name) {
  return segment?.isCall === true && segment.name === name;
}
function isAuthFacadeReference(documentText, className) {
  if (className.replace(/^\\+/, "") === "Auth") {
    return true;
  }
  return resolvePhpClassReference(documentText, className) === "Illuminate\\Support\\Facades\\Auth";
}
function relatedIndexedModel(documentText, relation, index2) {
  if (!relation.relatedModel) {
    return null;
  }
  return findIndexedModel(index2, resolvePhpClassReference(documentText, relation.relatedModel)) ?? findIndexedModel(index2, relation.relatedModel);
}
function resolveRelationPath(documentText, rootModel, segments, index2) {
  let model = rootModel;
  for (const segment of segments) {
    if (!model) {
      return null;
    }
    const relation = model.relations.find((candidate) => candidate.name === segment);
    if (!relation) {
      return null;
    }
    model = relatedIndexedModel(documentText, relation, index2);
  }
  return model;
}
function builderVariableModel(documentText, variable, offset, index2) {
  return modelForVariable(documentText, variable, index2) ?? relationClosureModel(documentText, offset, variable, index2);
}
function builderReceiverModel(documentText, receiverPrefix, offset, index2) {
  const chain = chainContextForPrefix(documentText, receiverPrefix, index2);
  if (chain?.model) {
    return chain.model;
  }
  const bareVariable = /(\$[A-Za-z_][A-Za-z0-9_]*)\s*(?:\?->|->)\s*$/.exec(receiverPrefix)?.[1];
  return bareVariable ? relationClosureModel(documentText, offset, bareVariable, index2) : null;
}
var RELATION_CLOSURE_METHODS = "whereHas|orWhereHas|whereDoesntHave|orWhereDoesntHave|withWhereHas|has|orHas|doesntHave|orDoesntHave";
function relationClosureModel(documentText, offset, variable, index2) {
  return relationClosureModelAtDepth(documentText, offset, variable, index2, 0);
}
function relationClosureModelAtDepth(documentText, offset, variable, index2, depth) {
  if (depth > 16) {
    return null;
  }
  const call = enclosingRelationClosure(documentText, offset, variable);
  if (!call) {
    return null;
  }
  const governing = governingModelForClosureCall(documentText, call, index2, depth);
  return governing ? resolveRelationPath(documentText, governing, call.relationName.split("."), index2) : null;
}
function governingModelForClosureCall(documentText, call, index2, depth) {
  const prefix = documentText.slice(0, call.arrowStart + call.arrowLength);
  const chain = chainContextForPrefix(documentText, prefix, index2);
  if (chain?.model) {
    return chain.model;
  }
  const bareVariable = /(\$[A-Za-z_][A-Za-z0-9_]*)\s*(?:\?->|->)\s*$/.exec(prefix)?.[1];
  return bareVariable ? relationClosureModelAtDepth(documentText, call.arrowStart, bareVariable, index2, depth + 1) : null;
}
function enclosingRelationClosure(documentText, offset, variable) {
  const sanitized = sanitizePhpSource(documentText);
  const pattern = new RegExp(`(->|::)\\s*(?:${RELATION_CLOSURE_METHODS})\\s*\\(`, "g");
  let best = null;
  for (const match of sanitized.matchAll(pattern)) {
    const arrowStart = match.index;
    const openParen = arrowStart + match[0].length - 1;
    if (openParen >= offset) {
      continue;
    }
    const closeParen = matchingCloseParenIndex(sanitized, openParen) ?? sanitized.length;
    if (closeParen < offset) {
      continue;
    }
    const args = parseRelationClosureArguments(documentText, sanitized, openParen, closeParen);
    if (!args || args.paramVariable !== variable) {
      continue;
    }
    if (!best || openParen > best.openParen) {
      best = {
        arrowLength: match[1].length,
        arrowStart,
        closeParen,
        openParen,
        paramVariable: args.paramVariable,
        relationName: args.relationName
      };
    }
  }
  return best;
}
function parseRelationClosureArguments(documentText, sanitized, openParen, closeParen) {
  let cursor = skipLeadingWhitespace(documentText, openParen + 1, closeParen);
  const quote = documentText[cursor];
  if (quote !== "'" && quote !== '"') {
    return null;
  }
  cursor += 1;
  const nameStart = cursor;
  while (cursor < closeParen && documentText[cursor] !== quote) {
    cursor += 1;
  }
  if (cursor >= closeParen) {
    return null;
  }
  const relationName = documentText.slice(nameStart, cursor);
  cursor += 1;
  cursor = skipLeadingWhitespace(documentText, cursor, closeParen);
  if (documentText[cursor] !== ",") {
    return null;
  }
  const closureKeyword = /\b(?:fn|function)\b/.exec(sanitized.slice(cursor, closeParen));
  if (!closureKeyword) {
    return null;
  }
  const paramOpen = sanitized.indexOf("(", cursor + closureKeyword.index);
  if (paramOpen < 0 || paramOpen >= closeParen) {
    return null;
  }
  const paramClose = matchingCloseParenIndex(sanitized, paramOpen);
  if (paramClose === null || paramClose > closeParen) {
    return null;
  }
  const paramVariable = /(\$[A-Za-z_][A-Za-z0-9_]*)/.exec(documentText.slice(paramOpen + 1, paramClose))?.[1] ?? null;
  return paramVariable ? { paramVariable, relationName } : null;
}
function skipLeadingWhitespace(text, start, limit) {
  let cursor = start;
  while (cursor < limit && /\s/.test(text[cursor])) {
    cursor += 1;
  }
  return cursor;
}
function matchingCloseParenIndex(text, openIndex) {
  let depth = 0;
  for (let cursor = openIndex; cursor < text.length; cursor += 1) {
    if (text[cursor] === "(") {
      depth += 1;
    } else if (text[cursor] === ")") {
      depth -= 1;
      if (depth === 0) {
        return cursor;
      }
    }
  }
  return null;
}
function scanChainForPrefix(prefix) {
  const text = sanitizePhpSource(prefix);
  let end = skipTrailingWhitespace(text, text.length);
  if (sliceEndsWith(text, end, "::")) {
    const className = qualifiedClassNameEndingAt(text, end - 2);
    return className ? { root: { className, kind: "staticCall", method: null }, segments: [] } : null;
  }
  if (!sliceEndsWith(text, end, "->")) {
    return null;
  }
  end -= 2;
  if (text[end - 1] === "?") {
    end -= 1;
  }
  const segments = [];
  for (let hops = 0; hops < 64; hops += 1) {
    end = skipTrailingWhitespace(text, end);
    let isCall = false;
    if (text[end - 1] === ")") {
      const openParen = matchingOpenParenIndex(text, end - 1);
      if (openParen === null) {
        return null;
      }
      end = skipTrailingWhitespace(text, openParen);
      isCall = true;
    }
    const name = identifierEndingAt(text, end);
    if (!name) {
      return null;
    }
    const start = skipTrailingWhitespace(text, end - name.length);
    if (text[start - 1] === "$") {
      return isCall ? null : { root: { kind: "variable", name: `$${name}` }, segments };
    }
    if (sliceEndsWith(text, start, "::")) {
      const className = qualifiedClassNameEndingAt(text, start - 2);
      return className && isCall ? { root: { className, kind: "staticCall", method: name }, segments } : null;
    }
    if (sliceEndsWith(text, start, "->")) {
      segments.unshift({ isCall, name });
      end = start - 2;
      if (text[end - 1] === "?") {
        end -= 1;
      }
      continue;
    }
    return isCall ? { root: { kind: "functionCall", name }, segments } : null;
  }
  return null;
}
function sliceEndsWith(text, end, token) {
  return end >= token.length && text.slice(end - token.length, end) === token;
}
function skipTrailingWhitespace(text, end) {
  let cursor = end;
  while (cursor > 0 && /\s/.test(text[cursor - 1])) {
    cursor -= 1;
  }
  return cursor;
}
function matchingOpenParenIndex(text, closeIndex) {
  let depth = 0;
  for (let cursor = closeIndex; cursor >= 0; cursor -= 1) {
    if (text[cursor] === ")") {
      depth += 1;
    } else if (text[cursor] === "(") {
      depth -= 1;
      if (depth === 0) {
        return cursor;
      }
    }
  }
  return null;
}
function identifierEndingAt(text, end) {
  let start = end;
  while (start > 0 && /[A-Za-z0-9_]/.test(text[start - 1])) {
    start -= 1;
  }
  const value = text.slice(start, end);
  return value && !/^[0-9]/.test(value) ? value : null;
}
function qualifiedClassNameEndingAt(text, end) {
  let start = end;
  while (start > 0 && /[A-Za-z0-9_\\]/.test(text[start - 1])) {
    start -= 1;
  }
  const value = text.slice(start, end);
  return /^\\?[A-Za-z_][A-Za-z0-9_\\]*$/.test(value) ? value : null;
}
function sanitizePhpSource(source) {
  const characters = [...source];
  const blank = (index2) => {
    if (characters[index2] !== "\n" && characters[index2] !== "\r") {
      characters[index2] = " ";
    }
  };
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (char === "'" || char === '"') {
      i += 1;
      while (i < source.length && source[i] !== char) {
        blank(i);
        if (source[i] === "\\" && i + 1 < source.length) {
          blank(i + 1);
          i += 1;
        }
        i += 1;
      }
      i += 1;
      continue;
    }
    if (char === "/" && next === "/" || char === "#" && next !== "[") {
      while (i < source.length && source[i] !== "\n") {
        blank(i);
        i += 1;
      }
      continue;
    }
    if (char === "/" && next === "*") {
      blank(i);
      blank(i + 1);
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) {
        blank(i);
        i += 1;
      }
      if (i < source.length) {
        blank(i);
        blank(i + 1);
        i += 2;
      }
      continue;
    }
    if (char === "<" && source.startsWith("<<<", i)) {
      const opener = /^<<<[ \t]*(["']?)([A-Za-z_][A-Za-z0-9_]*)\1[ \t]*\r?\n/.exec(source.slice(i));
      if (opener) {
        const terminator = new RegExp(`^[ \\t]*${opener[2]}\\b`);
        i += opener[0].length;
        while (i < source.length) {
          const lineEnd = source.indexOf("\n", i);
          const lineStop = lineEnd === -1 ? source.length : lineEnd;
          const terminatorMatch = terminator.exec(source.slice(i, lineStop));
          if (terminatorMatch) {
            i += terminatorMatch[0].length;
            break;
          }
          for (let cursor = i; cursor < lineStop; cursor += 1) {
            blank(cursor);
          }
          i = lineStop + 1;
        }
        continue;
      }
    }
    i += 1;
  }
  return characters.join("");
}
function frameworkBuilderMethodTarget(model, member) {
  return frameworkMethodTarget(model, member, frameworkClassCandidates());
}
function frameworkMethodTarget(model, member, classNames, relation) {
  const rootPath = projectRootForModel(model);
  if (!rootPath) {
    return null;
  }
  for (const className of classNames) {
    const filePath = import_node_path4.default.join(rootPath, "vendor", "laravel", "framework", "src", `${className.replace(/\\/g, import_node_path4.default.sep)}.php`);
    const range2 = methodRangeInFile(filePath, member);
    if (range2) {
      return { className, filePath, kind: "framework", model, name: member, ...relation ? { relation } : {}, range: range2 };
    }
    if (!(0, import_node_fs.existsSync)(filePath) && fallbackFrameworkMethods(className).has(member)) {
      return { className, filePath, kind: "framework", model, name: member, ...relation ? { relation } : {} };
    }
  }
  return null;
}
function frameworkClassCandidates(relation) {
  const relationClasses = [];
  if (relation) {
    const relationClass = relation.type === "morphedByMany" ? "MorphToMany" : `${relation.type[0].toUpperCase()}${relation.type.slice(1)}`;
    relationClasses.push(`Illuminate\\Database\\Eloquent\\Relations\\${relationClass}`);
    if (["belongsToMany", "morphToMany", "morphedByMany"].includes(relation.type)) {
      relationClasses.push("Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany");
    }
  }
  return [
    ...new Set(relationClasses),
    "Illuminate\\Database\\Eloquent\\Builder",
    "Illuminate\\Database\\Eloquent\\Relations\\Relation",
    "Illuminate\\Database\\Concerns\\BuildsQueries",
    "Illuminate\\Support\\Traits\\Conditionable",
    "Illuminate\\Database\\Query\\Builder"
  ];
}
function fallbackFrameworkMethods(className) {
  if (className.endsWith("\\Eloquent\\Builder")) {
    return /* @__PURE__ */ new Set([
      "create",
      "doesntHave",
      "find",
      "findMany",
      "findOrFail",
      "findOrNew",
      "first",
      "firstOr",
      "firstOrCreate",
      "firstOrFail",
      "firstOrNew",
      "firstWhere",
      "forceCreate",
      "get",
      "has",
      "orWhere",
      "orWhereDoesntHave",
      "orWhereHas",
      "query",
      "where",
      "whereDoesntHave",
      "whereHas",
      "whereKey",
      "whereKeyNot",
      "with",
      "withAvg",
      "withCount",
      "withExists",
      "withMax",
      "withMin",
      "withOnly",
      "withSum",
      "withWhereHas",
      "without"
    ]);
  }
  if (className.endsWith("\\Query\\Builder")) {
    return /* @__PURE__ */ new Set([
      "addSelect",
      "aggregate",
      "avg",
      "count",
      "dd",
      "delete",
      "distinct",
      "doesntExist",
      "dump",
      "exists",
      "explain",
      "getBindings",
      "getConnection",
      "getGrammar",
      "groupBy",
      "having",
      "inRandomOrder",
      "insert",
      "insertGetId",
      "insertOrIgnore",
      "insertUsing",
      "join",
      "latest",
      "leftJoin",
      "limit",
      "lockForUpdate",
      "max",
      "min",
      "offset",
      "oldest",
      "orWhere",
      "orWhereBetween",
      "orWhereIn",
      "orWhereNotIn",
      "orWhereNotNull",
      "orWhereNull",
      "orderBy",
      "orderByDesc",
      "pluck",
      "raw",
      "select",
      "sharedLock",
      "skip",
      "sum",
      "take",
      "toSql",
      "update",
      "value",
      "where",
      "whereBetween",
      "whereDate",
      "whereIn",
      "whereNot",
      "whereNotIn",
      "whereNotNull",
      "whereNull"
    ]);
  }
  if (className.endsWith("\\BuildsQueries")) {
    return /* @__PURE__ */ new Set([
      "chunk",
      "chunkById",
      "chunkMap",
      "cursor",
      "each",
      "lazy",
      "lazyById",
      "paginate",
      "simplePaginate",
      "sole",
      "tap"
    ]);
  }
  if (className.endsWith("\\Conditionable")) {
    return /* @__PURE__ */ new Set(["unless", "when"]);
  }
  if (className.endsWith("\\BelongsToMany")) {
    return /* @__PURE__ */ new Set([
      "as",
      "attach",
      "detach",
      "first",
      "orderByPivot",
      "orWherePivot",
      "orWherePivotBetween",
      "orWherePivotIn",
      "orWherePivotNotBetween",
      "orWherePivotNotIn",
      "sync",
      "syncWithoutDetaching",
      "toggle",
      "updateExistingPivot",
      "wherePivot",
      "wherePivotBetween",
      "wherePivotIn",
      "wherePivotNotBetween",
      "wherePivotNotIn",
      "withPivot",
      "withTimestamps"
    ]);
  }
  return /* @__PURE__ */ new Set();
}
function projectRootForModel(model) {
  const marker = `${import_node_path4.default.sep}app${import_node_path4.default.sep}`;
  const markerIndex = model.filePath.lastIndexOf(marker);
  if (markerIndex < 0) {
    return null;
  }
  return model.filePath.slice(0, markerIndex) || import_node_path4.default.sep;
}
function methodRangeInFile(filePath, method) {
  if (!(0, import_node_fs.existsSync)(filePath)) {
    return null;
  }
  try {
    const source = (0, import_node_fs.readFileSync)(filePath, "utf8");
    const match = new RegExp(`\\bfunction\\s+&?${escapeRegExp2(method)}\\s*\\(`).exec(source);
    if (!match) {
      return null;
    }
    const nameOffset = match.index + match[0].indexOf(method);
    return sourceRangeForOffset2(source, nameOffset, method.length);
  } catch {
    return null;
  }
}
function sourceRangeForOffset2(source, offset, length) {
  const start = sourcePositionForOffset2(source, offset);
  const end = sourcePositionForOffset2(source, offset + length);
  return { end, start };
}
function sourcePositionForOffset2(source, offset) {
  const lines = source.slice(0, offset).split(/\r?\n/);
  return {
    character: lines.at(-1)?.length ?? 0,
    line: lines.length - 1
  };
}
function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/codeLens.ts
var SHOW_REFERENCES_COMMAND = "editor.action.showReferences";
var PHP_TRIVIA_PATTERN = String.raw`(?:\s|//[^\r\n]*(?:\r?\n|$)|#[^\r\n]*(?:\r?\n|$)|/\*(?:(?!\*/)[\s\S])*\*/)*`;
function codeLensesForDocument(document, index2) {
  const filePath = pathFromUri2(document.uri);
  if (!filePath) {
    return [];
  }
  const lenses = [];
  for (const phpClass of index2.phpClasses.filter((candidate) => candidate.filePath === filePath)) {
    const classRange = toRange(phpClass.nameRange);
    lenses.push({
      data: {
        classFqcn: phpClass.fqcn,
        className: phpClass.name,
        kind: "phpClass",
        range: classRange,
        uri: document.uri
      },
      range: classRange
    });
    for (const method of phpClass.methods ?? []) {
      const methodRange = toRange(method.range);
      lenses.push({
        data: {
          classFqcn: phpClass.fqcn,
          className: phpClass.name,
          kind: "phpMethod",
          methodName: method.name,
          range: methodRange,
          uri: document.uri
        },
        range: methodRange
      });
    }
  }
  return lenses.sort(compareCodeLens);
}
function codeLensDocumentUri(lens) {
  return usageCodeLensData(lens.data)?.uri ?? null;
}
async function resolveUsageCodeLens(lens, document, index2) {
  const data = usageCodeLensData(lens.data);
  if (!data || !document) {
    return lens;
  }
  const locations = data.kind === "phpClass" ? await phpClassUsageLocations(document, data, index2) : await phpMethodUsageLocations(document, data, index2);
  return {
    ...lens,
    command: {
      arguments: [data.uri, data.range.start, locations],
      command: SHOW_REFERENCES_COMMAND,
      title: usageTitle(locations.length)
    }
  };
}
async function phpClassUsageLocations(document, target, index2) {
  const sources = await usageSources(document, index2);
  const locations = sources.flatMap((source) => phpClassUsageLocationsInSource(source, target));
  return sortLocations(uniqueLocations(locations));
}
async function phpMethodUsageLocations(document, target, index2) {
  const sources = await usageSources(document, index2);
  const locations = [
    ...sources.flatMap((source) => phpMethodUsageLocationsInSource(source, target, index2)),
    ...routeActionUsageLocations(target, index2)
  ];
  return sortLocations(uniqueLocations(locations));
}
async function usageSources(document, index2) {
  const documentPath = pathFromUri2(document.uri);
  const filePaths = indexedUsageFilePaths(index2);
  if (documentPath) {
    filePaths.add(documentPath);
  }
  const sources = [];
  for (const filePath of filePaths) {
    if (documentPath && filePath === documentPath) {
      sources.push({ filePath, source: document.getText() });
      continue;
    }
    const source = await readFileSafely(filePath);
    if (source !== null) {
      sources.push({ filePath, source });
    }
  }
  return sources;
}
function indexedUsageFilePaths(index2) {
  const filePaths = /* @__PURE__ */ new Set();
  const add = (filePath) => {
    if (filePath) {
      filePaths.add(filePath);
    }
  };
  index2.artifacts.forEach((artifact) => add(artifact.filePath));
  index2.authorization.forEach((entry) => add(entry.filePath));
  index2.bladeComponents.forEach((component) => add(component.filePath));
  index2.bladeViews.forEach((view) => add(view.filePath));
  index2.commands.forEach((command) => add(command.filePath));
  index2.configEntries.forEach((entry) => add(entry.filePath));
  index2.containerBindings.forEach((binding) => add(binding.filePath));
  index2.controllers.forEach((controller) => add(controller.filePath));
  index2.envEntries.forEach((entry) => add(entry.filePath));
  index2.factories.forEach((factory) => add(factory.filePath));
  index2.facades.forEach((facade) => add(facade.filePath));
  index2.inertiaPages.forEach((page) => add(page.filePath));
  index2.livewireComponents.forEach((component) => add(component.filePath));
  index2.macros.forEach((macro) => add(macro.filePath));
  index2.middleware.forEach((middleware) => add(middleware.filePath));
  index2.models.forEach((model) => {
    add(model.filePath);
    add(model.customBuilder?.filePath);
  });
  index2.phpClasses.forEach((phpClass) => add(phpClass.filePath));
  index2.providers.forEach((provider) => {
    add(provider.filePath);
    add(provider.classFilePath);
  });
  index2.routes.forEach((route) => add(route.filePath));
  index2.schemaTables.forEach((table) => {
    add(table.filePath);
    table.columns.forEach((column) => add(column.filePath));
  });
  index2.seeders.forEach((seeder) => add(seeder.filePath));
  index2.translationKeys.forEach((translation) => add(translation.filePath));
  index2.validationRules.forEach((ruleSet) => add(ruleSet.filePath));
  return filePaths;
}
async function readFileSafely(filePath) {
  try {
    return await (0, import_promises3.readFile)(filePath, "utf8");
  } catch {
    return null;
  }
}
function phpClassUsageLocationsInSource(source, target) {
  const locations = [];
  for (const match of source.source.matchAll(/\\?[A-Za-z_][A-Za-z0-9_\\]*/g)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (isOffsetInIgnoredPhpSource(source.source, start) || !isLikelyClassReference(source.source, start, value)) {
      continue;
    }
    const resolved = resolvePhpClassReference(source.source, value);
    if (sameClassReference(target.classFqcn, resolved)) {
      locations.push(import_node2.Location.create((0, import_node_url2.pathToFileURL)(source.filePath).toString(), sourceRangeForOffset3(source.source, start, value.length)));
    }
  }
  return locations;
}
function phpMethodUsageLocationsInSource(source, target, index2) {
  const locations = [];
  const method = escapeRegExp3(target.methodName);
  for (const match of source.source.matchAll(new RegExp(`\\b(\\$this|self|static|parent|\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::\\s*(${method})\\s*\\(`, "g"))) {
    const receiver = match[1];
    const methodStart = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    if (isOffsetInIgnoredPhpSource(source.source, methodStart)) {
      continue;
    }
    const receiverClass = ["self", "static", "parent"].includes(receiver) ? enclosingPhpClassFqcn(source.source, methodStart) : resolvePhpClassReference(source.source, receiver);
    if (receiverClass && classCanReferenceTarget(receiverClass, target.classFqcn, index2)) {
      locations.push(import_node2.Location.create((0, import_node_url2.pathToFileURL)(source.filePath).toString(), sourceRangeForOffset3(source.source, methodStart, target.methodName.length)));
    }
  }
  for (const match of source.source.matchAll(new RegExp(`(?:\\?->|->)\\s*(${method})\\s*\\(`, "g"))) {
    const methodStart = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
    if (isOffsetInIgnoredPhpSource(source.source, methodStart)) {
      continue;
    }
    const receiverClass = memberReceiverClass(source.source, methodStart, index2);
    if (receiverClass && classCanReferenceTarget(receiverClass, target.classFqcn, index2)) {
      locations.push(import_node2.Location.create((0, import_node_url2.pathToFileURL)(source.filePath).toString(), sourceRangeForOffset3(source.source, methodStart, target.methodName.length)));
    }
  }
  if (relationPropertyModel(target, index2)) {
    locations.push(...relationPropertyUsageLocationsInSource(source, target, index2));
  }
  return locations;
}
function relationPropertyUsageLocationsInSource(source, target, index2) {
  const locations = [];
  const method = escapeRegExp3(target.methodName);
  for (const match of source.source.matchAll(new RegExp(`(\\?->|->)${PHP_TRIVIA_PATTERN}(${method})\\b(?!${PHP_TRIVIA_PATTERN}\\()`, "g"))) {
    const propertyStart = (match.index ?? 0) + match[0].length - match[2].length;
    if (isOffsetInIgnoredPhpSource(source.source, propertyStart)) {
      continue;
    }
    const afterProperty = source.source.slice(propertyStart + target.methodName.length).replace(new RegExp(`^${PHP_TRIVIA_PATTERN}`), "");
    if (/^\s*(?:=(?![=>])|\?\?=)/.test(afterProperty)) {
      continue;
    }
    const operatorEnd = (match.index ?? 0) + match[1].length;
    const receiverPrefix = source.source.slice(0, operatorEnd).replace(new RegExp(`${PHP_TRIVIA_PATTERN}(\\?->|->)$`), "$1");
    const memberTarget = instanceMemberTargetForPrefix(
      source.source,
      receiverPrefix,
      index2,
      target.methodName
    );
    const receiverClass = memberTarget ? memberTarget.model.namespace ? `${memberTarget.model.namespace}\\${memberTarget.model.className}` : memberTarget.model.className : null;
    if (memberTarget?.kind === "relation" && receiverClass && classCanReferenceTarget(receiverClass, target.classFqcn, index2)) {
      locations.push(import_node2.Location.create((0, import_node_url2.pathToFileURL)(source.filePath).toString(), sourceRangeForOffset3(source.source, propertyStart, target.methodName.length)));
    }
  }
  return locations;
}
function relationPropertyModel(target, index2) {
  const model = index2.models.find(
    (candidate) => !candidate.isTrait && sameClassReference(target.classFqcn, candidate.namespace ? `${candidate.namespace}\\${candidate.className}` : candidate.className)
  );
  if (!model || !model.relationships.includes(target.methodName)) {
    return null;
  }
  if ((model.accessors ?? []).includes(target.methodName) || model.casts.includes(target.methodName)) {
    return null;
  }
  const table = index2.schemaTables.find((candidate) => candidate.name === model.tableName);
  if (table?.columns.some((column) => column.name === target.methodName)) {
    return null;
  }
  return model;
}
function routeActionUsageLocations(target, index2) {
  return index2.routes.filter((route) => route.action && routeActionMatches(route.action, target)).map((route) => import_node2.Location.create((0, import_node_url2.pathToFileURL)(route.filePath).toString(), toRange(route.range)));
}
function routeActionMatches(action, target) {
  const actionTargets = [
    ...[...action.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]/g)].map((match) => ({ classReference: match[1], method: match[2] })),
    ...[...action.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class@([A-Za-z_][A-Za-z0-9_]*)\b/g)].map((match) => ({ classReference: match[1], method: match[2] })),
    ...[...action.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)@([A-Za-z_][A-Za-z0-9_]*)\b/g)].map((match) => ({ classReference: match[1], method: match[2] }))
  ];
  return actionTargets.some(
    (candidate) => candidate.method === target.methodName && (sameClassReference(target.classFqcn, candidate.classReference) || target.className === candidate.classReference.split("\\").at(-1))
  );
}
function memberReceiverClass(source, methodStart, index2) {
  const lineStart = source.lastIndexOf("\n", methodStart) + 1;
  const linePrefix = source.slice(lineStart, methodStart + tokenAt(source, methodStart).length);
  const documentPrefix = source.slice(0, methodStart);
  const containerClass = containerResolvedMemberClass(documentPrefix, linePrefix, index2);
  if (containerClass) {
    return containerClass;
  }
  const receiver = receiverBeforeMember(source, methodStart);
  if (!receiver) {
    return null;
  }
  if (receiver.kind === "this") {
    return enclosingPhpClassFqcn(source, methodStart);
  }
  if (receiver.kind === "thisProperty") {
    return phpClassForThisProperty(source, receiver.property);
  }
  return phpClassForVariable(source, receiver.variable, methodStart);
}
function receiverBeforeMember(source, methodStart) {
  const prefix = source.slice(0, methodStart);
  const propertyMatch = /\$this\s*(?:\?->|->)\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?:\?->|->)\s*$/.exec(prefix);
  if (propertyMatch) {
    return { kind: "thisProperty", property: propertyMatch[1] };
  }
  if (/\$this\s*(?:\?->|->)\s*$/.test(prefix)) {
    return { kind: "this" };
  }
  const variableMatch = /(\$[A-Za-z_][A-Za-z0-9_]*)\s*(?:\?->|->)\s*$/.exec(prefix);
  return variableMatch ? { kind: "variable", variable: variableMatch[1] } : null;
}
function phpClassForVariable(source, variable, offset) {
  const prefix = source.slice(0, offset);
  const escapedVariable = escapeRegExp3(variable);
  const matches = [];
  for (const match of prefix.matchAll(new RegExp(`@var\\s+([^\\s]+)\\s+${escapedVariable}\\b`, "g"))) {
    const classReference = firstClassReferenceFromType(match[1]);
    if (classReference) {
      matches.push({ classReference, offset: match.index ?? 0 });
    }
  }
  for (const pattern of [
    new RegExp(`\\??(\\\\?[A-Z][A-Za-z0-9_\\\\]*)(?:\\|[^\\s$]+)?\\s+${escapedVariable}\\b`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*new\\s+(\\\\?[A-Z][A-Za-z0-9_\\\\]*)`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*(?:app|resolve)\\s*\\(\\s*(\\\\?[A-Z][A-Za-z0-9_\\\\]*)::class\\b`, "g"),
    new RegExp(`${escapedVariable}\\s*=\\s*(?:App::|app\\(\\)\\s*(?:\\?->|->)|\\$this\\s*(?:\\?->|->)\\s*app\\s*(?:\\?->|->)|Container::getInstance\\(\\)\\s*(?:\\?->|->))(?:make|makeWith|build|get)\\s*\\(\\s*(\\\\?[A-Z][A-Za-z0-9_\\\\]*)::class\\b`, "g")
  ]) {
    for (const match of prefix.matchAll(pattern)) {
      matches.push({ classReference: match[1], offset: match.index ?? 0 });
    }
  }
  const latest = matches.sort((left, right) => right.offset - left.offset)[0];
  return latest ? resolvePhpClassReference(source, latest.classReference) : null;
}
function phpClassForThisProperty(source, property) {
  const escapedProperty = escapeRegExp3(property);
  const propertyPattern = new RegExp(
    `\\b(?:public|protected|private)\\s+(?:readonly\\s+)?(?:static\\s+)?\\??(\\\\?[A-Z][A-Za-z0-9_\\\\]*)(?:\\|[^\\s$]+)?\\s+\\$${escapedProperty}\\b`,
    "g"
  );
  let classReference = null;
  for (const match of source.matchAll(propertyPattern)) {
    classReference = match[1];
  }
  return classReference ? resolvePhpClassReference(source, classReference) : null;
}
function firstClassReferenceFromType(type) {
  return type.split("|").map((part) => part.trim()).map((part) => part.replace(/^\?/, "")).find((part) => /^\\?[A-Z][A-Za-z0-9_\\]*$/.test(part)) ?? null;
}
function isOffsetInIgnoredPhpSource(source, offset) {
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let index2 = 0; index2 < offset; index2 += 1) {
    const char = source[index2];
    const next = source[index2 + 1];
    const previous = source[index2 - 1];
    if (lineComment) {
      if (char === "\n" || char === "\r") {
        lineComment = false;
      }
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index2 += 1;
      }
      continue;
    }
    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }
    if (char === "/" && next === "/" || char === "#") {
      lineComment = true;
      index2 += char === "/" ? 1 : 0;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index2 += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
    }
  }
  return Boolean(quote || lineComment || blockComment);
}
function enclosingPhpClassFqcn(source, offset) {
  for (const phpClass of phpClassRanges(source)) {
    if (offset >= phpClass.bodyStart && offset <= phpClass.bodyEnd) {
      return resolvePhpClassReference(source, phpClass.name);
    }
  }
  return null;
}
function phpClassRanges(source) {
  const ranges = [];
  const declarationPattern = /\b(?:abstract\s+|final\s+|readonly\s+)*(?:class|interface|trait|enum)\s+([A-Za-z_][A-Za-z0-9_]*)\b[^{;]*/g;
  for (const match of source.matchAll(declarationPattern)) {
    const bodyStart = source.indexOf("{", match.index ?? 0);
    if (bodyStart < 0) {
      continue;
    }
    ranges.push({
      bodyEnd: matchingBraceIndex2(source, bodyStart) ?? source.length,
      bodyStart,
      name: match[1]
    });
  }
  return ranges;
}
function isLikelyClassReference(source, start, value) {
  const bounds = lineBounds(source, start);
  const line = source.slice(bounds.start, bounds.end);
  const before = source.slice(bounds.start, start);
  const after = source.slice(start + value.length, bounds.end);
  if (/^\s*use\s+/.test(line) || /\b(?:class|interface|trait|enum)\s+$/.test(before)) {
    return false;
  }
  return /^\s*::/.test(after) || /\bnew\s+$/.test(before) || /\b(?:extends|implements)\s+(?:\\?[A-Za-z_][A-Za-z0-9_\\]*\s*,\s*)*$/.test(before) || /\binstanceof\s+$/.test(before) || /\bcatch\s*\([^)]*(?:\|\s*)?$/.test(before) || /(?:^|[\s(:,|?])$/.test(before) && /^\s+(?:&\s*)?(?:\.\.\.\s*)?\$[A-Za-z_]/.test(after) || /:\s*\??$/.test(before);
}
function classCanReferenceTarget(candidateFqcn, targetFqcn, index2) {
  const normalizedCandidate = normalizeClassReference3(candidateFqcn);
  const normalizedTarget = normalizeClassReference3(targetFqcn);
  return normalizedCandidate === normalizedTarget || inheritsFrom(normalizedCandidate, normalizedTarget, index2) || inheritsFrom(normalizedTarget, normalizedCandidate, index2);
}
function inheritsFrom(descendantFqcn, ancestorFqcn, index2) {
  const descendant = index2.phpClasses.find((phpClass) => normalizeClassReference3(phpClass.fqcn) === descendantFqcn);
  if (!descendant) {
    return false;
  }
  const visited = /* @__PURE__ */ new Set();
  const queue = [...descendant.extends, ...descendant.implements].map(normalizeClassReference3);
  while (queue.length > 0) {
    const parent = queue.shift();
    if (parent === ancestorFqcn) {
      return true;
    }
    if (visited.has(parent)) {
      continue;
    }
    visited.add(parent);
    const parentClass = index2.phpClasses.find((phpClass) => normalizeClassReference3(phpClass.fqcn) === parent);
    if (parentClass) {
      queue.push(...[...parentClass.extends, ...parentClass.implements].map(normalizeClassReference3));
    }
  }
  return false;
}
function sameClassReference(left, right) {
  return normalizeClassReference3(left) === normalizeClassReference3(right);
}
function normalizeClassReference3(value) {
  return value.replace(/^\\+/, "");
}
function matchingBraceIndex2(source, openIndex) {
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let index2 = openIndex; index2 < source.length; index2 += 1) {
    const char = source[index2];
    const next = source[index2 + 1];
    const previous = source[index2 - 1];
    if (lineComment) {
      if (char === "\n" || char === "\r") {
        lineComment = false;
      }
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index2 += 1;
      }
      continue;
    }
    if (quote) {
      if (char === quote && previous !== "\\") {
        quote = null;
      }
      continue;
    }
    if (char === "/" && next === "/" || char === "#") {
      lineComment = true;
      index2 += char === "/" ? 1 : 0;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index2 += 1;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return index2;
      }
    }
  }
  return null;
}
function lineBounds(source, offset) {
  const start = source.lastIndexOf("\n", offset) + 1;
  const nextNewline = source.indexOf("\n", offset);
  return {
    end: nextNewline >= 0 ? nextNewline : source.length,
    start
  };
}
function sourceRangeForOffset3(source, startOffset, length) {
  return {
    end: sourcePositionForOffset3(source, startOffset + length),
    start: sourcePositionForOffset3(source, startOffset)
  };
}
function sourcePositionForOffset3(source, offset) {
  const beforeOffset = source.slice(0, offset);
  const lines = beforeOffset.split(/\r?\n/);
  return {
    character: lines[lines.length - 1].length,
    line: lines.length - 1
  };
}
function tokenAt(source, offset) {
  return /^[A-Za-z_][A-Za-z0-9_]*/.exec(source.slice(offset))?.[0] ?? "";
}
function toRange(range2) {
  return {
    end: range2.end,
    start: range2.start
  };
}
function pathFromUri2(uri) {
  try {
    return (0, import_node_url2.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function usageTitle(count) {
  return `${count} ${count === 1 ? "usage" : "usages"}`;
}
function usageCodeLensData(value) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = value;
  if (typeof candidate.classFqcn !== "string" || typeof candidate.className !== "string" || typeof candidate.uri !== "string" || !isRange(candidate.range)) {
    return null;
  }
  if (candidate.kind === "phpClass") {
    return candidate;
  }
  if (candidate.kind === "phpMethod" && typeof candidate.methodName === "string") {
    return candidate;
  }
  return null;
}
function isRange(value) {
  const range2 = value;
  return Boolean(
    range2 && typeof range2 === "object" && typeof range2.start?.line === "number" && typeof range2.start.character === "number" && typeof range2.end?.line === "number" && typeof range2.end.character === "number"
  );
}
function uniqueLocations(locations) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const item of locations) {
    const key = [
      item.uri,
      item.range.start.line,
      item.range.start.character,
      item.range.end.line,
      item.range.end.character
    ].join(":");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }
  return unique;
}
function sortLocations(locations) {
  return locations.sort(
    (left, right) => left.uri.localeCompare(right.uri) || left.range.start.line - right.range.start.line || left.range.start.character - right.range.start.character || left.range.end.line - right.range.end.line || left.range.end.character - right.range.end.character
  );
}
function compareCodeLens(left, right) {
  return left.range.start.line - right.range.start.line || left.range.start.character - right.range.start.character || left.range.end.line - right.range.end.line || left.range.end.character - right.range.end.character;
}
function escapeRegExp3(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/completions.ts
var import_node3 = __toESM(require_node3(), 1);
var import_node_url3 = require("node:url");

// src/castTypes.ts
var import_node_fs2 = require("node:fs");
var PRIMITIVE_CAST_TYPES = /* @__PURE__ */ new Map([
  ["array", "array"],
  ["bool", "bool"],
  ["boolean", "bool"],
  ["collection", "\\Illuminate\\Support\\Collection"],
  ["date", "\\Illuminate\\Support\\Carbon"],
  ["datetime", "\\Illuminate\\Support\\Carbon"],
  ["decimal", "string"],
  ["double", "float"],
  ["encrypted", "string"],
  ["float", "float"],
  ["hashed", "string"],
  ["immutable_date", "\\Carbon\\CarbonImmutable"],
  ["immutable_datetime", "\\Carbon\\CarbonImmutable"],
  ["int", "int"],
  ["integer", "int"],
  ["json", "array"],
  ["object", "object"],
  ["real", "float"],
  ["string", "string"],
  ["timestamp", "int"]
]);
var BUILTIN_CAST_CLASS_TYPES = /* @__PURE__ */ new Map([
  ["Illuminate\\Database\\Eloquent\\Casts\\AsArrayObject", "\\Illuminate\\Database\\Eloquent\\Casts\\ArrayObject"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsBinary", "string"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsCollection", "\\Illuminate\\Support\\Collection"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEncryptedArrayObject", "\\Illuminate\\Database\\Eloquent\\Casts\\ArrayObject"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEncryptedCollection", "\\Illuminate\\Support\\Collection"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEnumArrayObject", "\\Illuminate\\Database\\Eloquent\\Casts\\ArrayObject"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsEnumCollection", "\\Illuminate\\Support\\Collection"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsFluent", "\\Illuminate\\Support\\Fluent"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsStringable", "\\Illuminate\\Support\\Stringable"],
  ["Illuminate\\Database\\Eloquent\\Casts\\AsUri", "\\Illuminate\\Support\\Uri"]
]);
var SCALAR_RETURN_TYPES = /* @__PURE__ */ new Set(["array", "bool", "callable", "false", "float", "int", "iterable", "null", "object", "string", "true"]);
var OPAQUE_RETURN_TYPES = /* @__PURE__ */ new Set(["mixed", "never", "void"]);
function resolveCastType(cast, index2) {
  if (cast.classFqcn) {
    return resolveClassCastType(cast.classFqcn, index2);
  }
  const phpType = PRIMITIVE_CAST_TYPES.get(normalizePrimitiveCast(cast.type));
  return phpType ? { kind: "primitive", nullable: false, phpType } : null;
}
function castTypeDisplay(resolved, column) {
  const nullable = resolved.nullable || (column?.modifiers.includes("nullable") ?? false);
  return nullable ? `${resolved.phpType}|null` : resolved.phpType;
}
function normalizePrimitiveCast(castType) {
  const base = castType.trim().toLowerCase();
  const [head, parameter] = base.split(":", 2);
  if (head === "encrypted" && parameter) {
    return parameter;
  }
  return head;
}
function resolveClassCastType(classFqcn, index2) {
  const builtin = BUILTIN_CAST_CLASS_TYPES.get(classFqcn);
  if (builtin) {
    return { kind: "builtinCastClass", nullable: false, phpType: builtin };
  }
  const castClass = index2.phpClasses.find((candidate) => candidate.fqcn === classFqcn);
  if (!castClass) {
    return null;
  }
  if (castClass.kind === "enum") {
    return { castClass, kind: "enum", nullable: false, phpType: `\\${classFqcn}` };
  }
  if (castClass.kind !== "class") {
    return null;
  }
  if (castClass.implements.includes("Illuminate\\Contracts\\Database\\Eloquent\\Castable")) {
    return { castClass, kind: "castable", nullable: false, phpType: `\\${classFqcn}` };
  }
  const returnType = castGetReturnType(castClass);
  return returnType ? { castClass, kind: "customCast", nullable: returnType.nullable, phpType: returnType.phpType } : null;
}
function castGetReturnType(castClass) {
  const source = readCastSource(castClass.filePath);
  if (!source) {
    return null;
  }
  const method = /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(?:public|protected|private)\s+)?function\s+get\s*\(([^)]*)\)\s*(?::\s*([^\{;]+?))?\s*\{/.exec(
    source
  );
  if (!method) {
    return null;
  }
  const declared = method[3] ?? (method[1] ? /@return\s+([^\r\n*]+)/.exec(method[1])?.[1]?.trim() ?? null : null);
  return declared ? normalizeCastReturnType(source, declared, castClass) : null;
}
function normalizeCastReturnType(source, declared, castClass) {
  const normalized = declared.trim();
  let nullable = normalized.startsWith("?");
  const parts = normalized.replace(/^\?/, "").split("|").map((part) => part.trim()).filter((part) => {
    if (part.toLowerCase() === "null") {
      nullable = true;
      return false;
    }
    return true;
  });
  if (parts.length !== 1) {
    return null;
  }
  const bare = parts[0];
  if (/^(?:array|list)<.+>$/i.test(bare) || /^[^\s]+\[\]$/.test(bare)) {
    return { nullable, phpType: "array" };
  }
  const namedType = /^(\\?[A-Za-z_][\\A-Za-z0-9_]*)(?:<.+>)?$/.exec(bare)?.[1];
  if (!namedType) {
    return null;
  }
  if (OPAQUE_RETURN_TYPES.has(namedType.toLowerCase())) {
    return null;
  }
  if (SCALAR_RETURN_TYPES.has(namedType.toLowerCase())) {
    return { nullable, phpType: namedType.toLowerCase() };
  }
  if (["self", "static"].includes(namedType.toLowerCase())) {
    return { nullable, phpType: `\\${castClass.fqcn}` };
  }
  if (namedType.toLowerCase() === "parent") {
    return castClass.extends.length === 1 ? { nullable, phpType: `\\${castClass.extends[0]}` } : null;
  }
  return { nullable, phpType: `\\${resolvePhpClassReference(source, namedType)}` };
}
function readCastSource(filePath) {
  if (!(0, import_node_fs2.existsSync)(filePath)) {
    return null;
  }
  try {
    return (0, import_node_fs2.readFileSync)(filePath, "utf8");
  } catch {
    return null;
  }
}

// src/phpunitMocks.ts
var MOCK_FACTORY_METHOD_NAMES = "createMock|createStub|createPartialMock|createConfiguredMock";
var MOCK_FACTORY_CALL_SOURCE = `(?:\\$this\\s*->\\s*|self::|static::)?(?:${MOCK_FACTORY_METHOD_NAMES})\\s*\\(\\s*(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::class\\b`;
function phpunitMockMethodClassAtOffset(documentText, offset) {
  const statement = currentStatementPrefix(documentText, offset);
  if (!/(?:\?->|->)\s*method\s*\(\s*['"][^'"]*$/.test(statement)) {
    return null;
  }
  const receiver = mockReceiverForStatement(statement);
  if (!receiver) {
    return null;
  }
  if (receiver.startsWith("$")) {
    return assignedMockClass(documentText.slice(0, offset), receiver);
  }
  return mockFactoryClass(documentText, receiver);
}
function phpunitMockMethodTargetsAtOffset(documentText, offset, index2) {
  const classFqcn = phpunitMockMethodClassAtOffset(documentText, offset);
  const phpClass = classFqcn ? phpClassForReference2(classFqcn, index2) : null;
  if (!phpClass) {
    return [];
  }
  return (phpClass.methods ?? []).filter((method) => method.visibility !== "private").map((method) => ({
    classFqcn: phpClass.fqcn,
    filePath: phpClass.filePath,
    kind: phpClass.kind,
    method
  }));
}
function phpunitMockMethodTargetAtOffset(documentText, offset, methodName, index2) {
  return phpunitMockMethodTargetsAtOffset(documentText, offset, index2).find((candidate) => candidate.method.name === methodName) ?? null;
}
function currentStatementPrefix(documentText, offset) {
  const prefix = documentText.slice(0, offset);
  const lastBoundary = Math.max(
    prefix.lastIndexOf(";"),
    prefix.lastIndexOf("{"),
    prefix.lastIndexOf("}")
  );
  return prefix.slice(lastBoundary + 1);
}
function mockReceiverForStatement(statement) {
  const beforeMethod = statement.replace(/\s*(?:\?->|->)\s*method\s*\(\s*['"][^'"]*$/, "");
  const receiverMatch = new RegExp(
    `(${MOCK_FACTORY_CALL_SOURCE}|\\$[A-Za-z_][A-Za-z0-9_]*)(?:\\s*(?:\\?->|->)\\s*[A-Za-z_][A-Za-z0-9_]*\\s*\\([^;]*\\))*\\s*$`
  ).exec(beforeMethod);
  return receiverMatch?.[1] ?? null;
}
function assignedMockClass(documentPrefix, variable) {
  const assignmentPattern = new RegExp(
    `${escapeRegex2(variable)}\\s*=\\s*(${MOCK_FACTORY_CALL_SOURCE})`,
    "g"
  );
  let classReference = null;
  for (const match of documentPrefix.matchAll(assignmentPattern)) {
    classReference = mockFactoryClass(documentPrefix, match[1]);
  }
  return classReference;
}
function mockFactoryClass(documentText, expression) {
  const match = new RegExp(MOCK_FACTORY_CALL_SOURCE).exec(expression);
  return match ? resolvePhpClassReference(documentText, match[1]) : null;
}
function phpClassForReference2(classReference, index2) {
  return index2.phpClasses.find((phpClass) => classReferenceMatches3(phpClass.fqcn, classReference)) ?? null;
}
function classReferenceMatches3(indexedReference, value) {
  const indexed = normalizeClassReference4(indexedReference);
  const compared = normalizeClassReference4(value);
  return indexed === compared || indexed.split("\\").at(-1) === compared || compared.split("\\").at(-1) === indexed;
}
function normalizeClassReference4(value) {
  return value.replace(/\\\\/g, "\\").replace(/^\\+/, "");
}
function escapeRegex2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/completions.ts
function completionsForDocument(document, position, index2) {
  const line = document.getText({
    start: { line: position.line, character: 0 },
    end: position
  });
  const offset = document.offsetAt(position);
  if (isInsideModelAttributeArray(document, position)) {
    return schemaColumnsForDocument(document, index2).map((column) => ({
      label: column.name,
      kind: import_node3.CompletionItemKind.Field,
      detail: schemaColumnDetail(column),
      data: { filePath: column.filePath, tableName: column.tableName }
    }));
  }
  const validationSchemaContext = validationSchemaContextForLine(line) ?? validationRuleStringContext(document, position, line);
  if (validationSchemaContext?.kind === "table") {
    return schemaTableCompletionItems(index2);
  }
  if (validationSchemaContext?.kind === "column") {
    return schemaColumnCompletionItems(index2, validationSchemaContext.tableName);
  }
  if (validationSchemaContext?.kind === "rule") {
    return VALIDATION_RULE_NAMES.map((rule) => ({
      label: rule,
      kind: import_node3.CompletionItemKind.Value,
      detail: "Laravel validation rule"
    }));
  }
  if (isInsideValidationFieldCall(line)) {
    return validationFieldsForDocument(document, index2).map((field) => ({
      label: field.field,
      kind: import_node3.CompletionItemKind.Field,
      detail: validationFieldDetail(field)
    }));
  }
  if (isInsideTranslationKeyString(line)) {
    return index2.translationKeys.map((translation) => ({
      label: translation.key,
      kind: import_node3.CompletionItemKind.Text,
      detail: translationDetail(translation.locale, translation.source),
      data: { filePath: translation.filePath, locale: translation.locale }
    }));
  }
  if (isInsideAuthorizationAbilityString(line)) {
    return index2.authorization.map((entry) => ({
      label: entry.ability,
      kind: import_node3.CompletionItemKind.Value,
      detail: authorizationDetail(entry),
      data: { filePath: entry.filePath, policy: entry.policy }
    }));
  }
  if (isContainerBindingStringPrefix(line)) {
    return index2.containerBindings.map((binding) => ({
      label: binding.abstract,
      kind: import_node3.CompletionItemKind.Interface,
      detail: containerBindingDetail(binding),
      data: { filePath: binding.filePath, concrete: binding.concrete }
    }));
  }
  const mockMethods = phpunitMockMethodTargetsAtOffset(document.getText(), offset, index2);
  if (mockMethods.length > 0) {
    return mockMethods.map((target) => ({
      label: target.method.name,
      kind: import_node3.CompletionItemKind.Method,
      detail: `PHPUnit mock method ${target.classFqcn}`,
      data: { filePath: target.filePath, range: target.method.range }
    }));
  }
  if (isInsideArtisanCommandString(line)) {
    return index2.commands.map((command) => ({
      label: command.name,
      kind: import_node3.CompletionItemKind.Function,
      detail: commandDetail(command),
      data: { filePath: command.filePath, signature: command.signature }
    }));
  }
  if (isInsideStorageDiskString(line)) {
    return storageDiskCompletionItems(index2);
  }
  if (isInsideMiddlewareString(line)) {
    return index2.middleware.map((entry) => ({
      label: entry.alias,
      kind: import_node3.CompletionItemKind.Value,
      detail: middlewareDetail(entry),
      data: { filePath: entry.filePath, className: entry.className }
    }));
  }
  if (isInsideProviderClassArray(document, line)) {
    return index2.providers.filter((provider) => provider.source === "class").map((provider) => ({
      label: provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className,
      kind: import_node3.CompletionItemKind.Class,
      detail: "Laravel service provider",
      data: { filePath: provider.classFilePath ?? provider.filePath, source: provider.source }
    }));
  }
  if (isContainerClassArgumentPrefix(line)) {
    return phpClassCompletionItems(index2);
  }
  const propertyModel = modelPropertyContext(document, line, index2);
  if (propertyModel) {
    return modelPropertyCompletions(propertyModel, index2);
  }
  const resolvedPhpClass = containerResolvedMemberClass(document.getText().slice(0, offset), line, index2);
  if (resolvedPhpClass) {
    return phpClassMethodCompletionItems(resolvedPhpClass, index2);
  }
  const writeArrayModel = modelWriteArrayContext(document, position, offset, index2);
  if (writeArrayModel) {
    return modelWritableColumnCompletions(writeArrayModel, index2);
  }
  const relationModel = eloquentRelationContext(document, line, offset, index2);
  if (relationModel) {
    const relationCompletions = relationModel.relations.map((relation) => ({
      label: relation.name,
      kind: import_node3.CompletionItemKind.Property,
      detail: eloquentRelationDetail(relationModel, relation),
      data: { filePath: relationModel.filePath, model: relationModel.className, relation: relation.name }
    }));
    if (relationCompletions.length > 0) {
      return relationCompletions;
    }
  }
  const macroClass = macroStaticCallClass(line);
  if (macroClass) {
    const macroCompletions = index2.macros.filter((macro) => macro.className.split("\\").at(-1) === macroClass || macro.className === macroClass).map((macro) => ({
      label: macro.method,
      kind: import_node3.CompletionItemKind.Method,
      detail: `Laravel macro ${macro.className}`,
      data: { filePath: macro.filePath, className: macro.className }
    }));
    if (macroCompletions.length > 0) {
      return macroCompletions;
    }
  }
  const factoryModel = factoryStateModel(line);
  if (factoryModel) {
    return index2.factories.filter((factory) => factory.model?.split("\\").at(-1) === factoryModel || factory.model === factoryModel).flatMap(
      (factory) => factory.states.map((state) => ({
        label: state,
        kind: import_node3.CompletionItemKind.Method,
        detail: `Factory state ${factory.className}`,
        data: { filePath: factory.filePath, model: factory.model }
      }))
    );
  }
  const dbTableName = dbColumnContextTable(line);
  if (dbTableName) {
    return schemaColumnCompletionItems(index2, dbTableName);
  }
  if (isInsideDbTableNameString(line)) {
    return schemaTableCompletionItems(index2);
  }
  const columnReceiver = eloquentColumnReceiverPrefix(line);
  if (columnReceiver) {
    const model = builderReceiverModel(document.getText(), columnReceiver, offset, index2);
    const table = model ? index2.schemaTables.find((candidate) => candidate.name === model.tableName) : null;
    if (table) {
      return table.columns.map((column) => ({
        label: column.name,
        kind: import_node3.CompletionItemKind.Field,
        detail: schemaColumnDetail(column),
        data: { filePath: column.filePath, tableName: column.tableName }
      }));
    }
  }
  const scopeModel = eloquentScopeModel(line) ?? eloquentBuilderChainModel(line);
  if (scopeModel) {
    const modelCompletions = index2.models.filter((model) => model.className === scopeModel || `${model.namespace}\\${model.className}` === scopeModel).flatMap((model) => builderChainCompletions(model, index2));
    if (modelCompletions.length > 0) {
      return modelCompletions;
    }
  }
  if (isInsideSeederCallArray(line)) {
    return index2.seeders.map((seeder) => ({
      label: seeder.namespace ? `${seeder.namespace}\\${seeder.className}` : seeder.className,
      kind: import_node3.CompletionItemKind.Class,
      detail: seeder.calls.length > 0 ? `Seeder calls ${seeder.calls.join(", ")}` : "Laravel seeder",
      data: { filePath: seeder.filePath }
    }));
  }
  const controllerActionClass = routeControllerActionClass(line) ?? routeControllerGroupActionClass(document, position.line, line);
  if (controllerActionClass) {
    const resolvedControllerActionClass = resolvePhpClassReference(document.getText(), controllerActionClass);
    return index2.controllers.filter((controller) => controllerMatches(controller, resolvedControllerActionClass)).flatMap(
      (controller) => controller.actions.map((action) => ({
        label: action,
        kind: import_node3.CompletionItemKind.Method,
        detail: `Laravel controller action ${controller.className}`,
        data: { filePath: controller.filePath }
      }))
    );
  }
  if (isInsideRouteControllerClassContext(line)) {
    return index2.controllers.map((controller) => ({
      label: controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className,
      kind: import_node3.CompletionItemKind.Class,
      detail: "Laravel controller",
      data: { filePath: controller.filePath }
    }));
  }
  const artifactKinds = artifactContextKinds(line);
  if (artifactKinds) {
    return index2.artifacts.filter((artifact) => artifactKinds.includes(artifact.kind)).map((artifact) => ({
      label: artifact.namespace ? `${artifact.namespace}\\${artifact.className}` : artifact.className,
      kind: import_node3.CompletionItemKind.Class,
      detail: laravelArtifactDetail(artifact),
      data: { filePath: artifact.filePath, kind: artifact.kind }
    }));
  }
  if (isInsideBladeViewDirectiveString(line)) {
    return index2.bladeViews.map((view) => ({
      label: view.name,
      kind: import_node3.CompletionItemKind.File,
      detail: bladeViewDetail(view),
      data: { filePath: view.filePath }
    }));
  }
  const sectionLayout = bladeSectionLayoutForDocument(document, line, index2);
  if (sectionLayout) {
    return sectionLayout.yields.map((section) => ({
      label: section,
      kind: import_node3.CompletionItemKind.Property,
      detail: `Blade section ${sectionLayout.name}`,
      data: { filePath: sectionLayout.filePath, layout: sectionLayout.name }
    }));
  }
  const stackLayout = bladeStackLayoutForDocument(document, line, index2);
  if (stackLayout) {
    return (stackLayout.stacks ?? []).map((stack) => ({
      label: stack,
      kind: import_node3.CompletionItemKind.Property,
      detail: `Blade stack ${stackLayout.name}`,
      data: { filePath: stackLayout.filePath, layout: stackLayout.name }
    }));
  }
  const componentTag = bladeComponentTagContext(line);
  if (componentTag === "tag") {
    return index2.bladeComponents.map((component) => ({
      label: component.name,
      kind: import_node3.CompletionItemKind.Class,
      detail: bladeComponentDetail(component),
      data: { filePath: component.filePath, viewName: component.viewName }
    }));
  }
  if (componentTag?.kind === "props") {
    const component = index2.bladeComponents.find((candidate) => candidate.name === componentTag.name);
    return component?.props.map((prop) => ({
      label: prop,
      kind: import_node3.CompletionItemKind.Property,
      detail: `Blade ${component.source} component prop ${component.name}`,
      data: { filePath: component.filePath, viewName: component.viewName }
    })) ?? [];
  }
  const livewireTag = livewireComponentTagContext(line);
  if (livewireTag === "tag" || /@livewire\s*\(\s*['"][^'"]*$/.test(line)) {
    return index2.livewireComponents.map((component) => ({
      label: component.name,
      kind: import_node3.CompletionItemKind.Class,
      detail: livewireComponentDetail(component),
      data: { filePath: component.filePath }
    }));
  }
  if (typeof livewireTag === "object" && livewireTag?.kind === "props") {
    const component = index2.livewireComponents.find((candidate) => candidate.name === livewireTag.name);
    return component?.properties.map((property) => ({
      label: livewireKebabCase(property),
      kind: import_node3.CompletionItemKind.Property,
      detail: `Livewire property ${component.className}::$${property}`,
      data: { filePath: component.filePath }
    })) ?? [];
  }
  const wireBinding = livewireWireBindingContext(document, line, index2);
  if (wireBinding?.kind === "properties") {
    return wireBinding.component.properties.map((property) => ({
      label: property,
      kind: import_node3.CompletionItemKind.Property,
      detail: `Livewire property ${wireBinding.component.className}::$${property}`,
      data: { filePath: wireBinding.component.filePath }
    }));
  }
  if (wireBinding?.kind === "methods") {
    return wireBinding.component.methods.map((method) => ({
      label: method,
      kind: import_node3.CompletionItemKind.Method,
      detail: `Livewire action ${wireBinding.component.className}::${method}()`,
      data: { filePath: wireBinding.component.filePath }
    }));
  }
  const routeParameterName = routeParameterCompletionRouteName(line);
  if (routeParameterName) {
    const route = index2.routes.find((candidate) => candidate.name === routeParameterName);
    return routeParameters2(route).map((parameter) => ({
      label: parameter,
      kind: import_node3.CompletionItemKind.Field,
      detail: routeParameterDetail(route),
      data: { filePath: route?.filePath, route: route?.name, uri: route?.uri }
    }));
  }
  if (isInsideRouteNameString(line)) {
    return index2.routes.filter((route) => route.name).map((route) => ({
      label: route.name ?? "",
      kind: import_node3.CompletionItemKind.Value,
      detail: routeDetail(route.methods, route.uri),
      data: { filePath: route.filePath, range: route.range }
    }));
  }
  if (isInsideInertiaPageString(line)) {
    return index2.inertiaPages.map((page) => ({
      label: page.name,
      kind: import_node3.CompletionItemKind.File,
      detail: "Inertia page",
      data: { filePath: page.filePath }
    }));
  }
  if (isInsideStringCall(line, "view")) {
    return index2.bladeViews.map((view) => ({
      label: view.name,
      kind: import_node3.CompletionItemKind.File,
      detail: bladeViewDetail(view),
      data: { filePath: view.filePath }
    }));
  }
  if (isInsideStringCall(line, "config")) {
    return index2.configKeys.map((key) => ({
      label: key,
      kind: import_node3.CompletionItemKind.Property,
      detail: "Laravel config key"
    }));
  }
  if (isInsideStringCall(line, "env")) {
    return index2.envKeys.map((key) => ({
      label: key,
      kind: import_node3.CompletionItemKind.Constant,
      detail: "Environment key"
    }));
  }
  if (/\b(new|extends|implements)\s+[A-Za-z_\\]*$/.test(line)) {
    return [
      ...index2.models.map((model) => ({
        label: model.namespace ? `${model.namespace}\\${model.className}` : model.className,
        kind: import_node3.CompletionItemKind.Class,
        detail: "Eloquent model",
        data: { filePath: model.filePath }
      })),
      ...index2.facades.map((facade) => ({
        label: facade.namespace ? `${facade.namespace}\\${facade.className}` : facade.className,
        kind: import_node3.CompletionItemKind.Class,
        detail: facadeDetail(facade),
        data: { filePath: facade.filePath, accessor: facade.accessor, binding: facade.binding?.abstract }
      })),
      ...index2.controllers.map((controller) => ({
        label: controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className,
        kind: import_node3.CompletionItemKind.Class,
        detail: "Laravel controller",
        data: { filePath: controller.filePath }
      })),
      ...index2.artifacts.map((artifact) => ({
        label: artifact.namespace ? `${artifact.namespace}\\${artifact.className}` : artifact.className,
        kind: import_node3.CompletionItemKind.Class,
        detail: laravelArtifactDetail(artifact),
        data: { filePath: artifact.filePath, kind: artifact.kind }
      })),
      ...index2.providers.filter((provider) => provider.source === "class").map((provider) => ({
        label: provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className,
        kind: import_node3.CompletionItemKind.Class,
        detail: "Laravel service provider",
        data: { filePath: provider.classFilePath ?? provider.filePath, source: provider.source }
      }))
    ];
  }
  return helperCompletions();
}
function routeDetail(methods, uri) {
  return ["Laravel route", methods.join("|"), uri].filter(Boolean).join(" ");
}
function routeParameterDetail(route) {
  return ["Route parameter", route?.name, route?.uri].filter(Boolean).join(" ");
}
function routeParameters2(route) {
  if (!route?.uri) {
    return [];
  }
  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}
function schemaColumnDetail(column) {
  return [column.tableName, column.type, column.modifiers.join(", ")].filter(Boolean).join(" ");
}
function validationFieldDetail(field) {
  return ["Validation field", field.rules.join("|")].filter(Boolean).join(" ");
}
function translationDetail(locale, source) {
  return `Laravel translation ${locale} ${source}`;
}
function authorizationDetail(entry) {
  return ["Laravel ability", entry.source, entry.policy].filter(Boolean).join(" ");
}
function containerBindingDetail(binding) {
  return ["Container binding", binding.lifetime, binding.concrete].filter(Boolean).join(" ");
}
function phpClassCompletionItems(index2) {
  return index2.phpClasses.map((phpClass) => ({
    label: phpClass.fqcn,
    kind: phpClassCompletionKind(phpClass),
    detail: `PHP ${phpClass.kind}`,
    data: { filePath: phpClass.filePath, kind: phpClass.kind }
  }));
}
function phpClassMethodCompletionItems(classReference, index2) {
  const items = /* @__PURE__ */ new Map();
  const classes = containerResolvedPhpClasses(classReference, index2);
  for (const phpClass of classes) {
    for (const method of phpClass.methods ?? []) {
      if (method.visibility !== "public" || items.has(method.name)) {
        continue;
      }
      items.set(method.name, {
        label: method.name,
        kind: import_node3.CompletionItemKind.Method,
        detail: `PHP ${phpClass.kind} ${phpClass.fqcn}`,
        data: { filePath: phpClass.filePath, range: method.range }
      });
    }
  }
  return [...items.values()];
}
function phpClassCompletionKind(phpClass) {
  switch (phpClass.kind) {
    case "interface":
      return import_node3.CompletionItemKind.Interface;
    case "trait":
      return import_node3.CompletionItemKind.Module;
    case "enum":
      return import_node3.CompletionItemKind.Enum;
    case "class":
      return import_node3.CompletionItemKind.Class;
  }
}
function facadeDetail(facade) {
  return [
    "Laravel facade",
    facade.accessor,
    facade.binding ? `${facade.binding.lifetime} binding` : "",
    facade.binding?.concrete,
    facade.target
  ].filter(Boolean).join(" ");
}
function commandDetail(command) {
  return ["Artisan command", command.signature, command.description].filter(Boolean).join(" ");
}
function middlewareDetail(entry) {
  return ["Laravel middleware", entry.source, entry.className].filter(Boolean).join(" ");
}
function bladeViewDetail(view) {
  return ["Laravel view", view.extends ? `extends ${view.extends}` : ""].filter(Boolean).join(" ");
}
function bladeComponentDetail(component) {
  return `Blade ${component.source} component`;
}
function eloquentRelationDetail(model, relation) {
  return [`Eloquent relation ${model.className}`, relation.type, relation.relatedModel].filter(Boolean).join(" ");
}
function laravelArtifactDetail(artifact) {
  return [
    `Laravel ${artifact.kind}`,
    artifact.constructorSignature ? `__construct(${artifact.constructorSignature})` : "",
    artifact.related.length > 0 ? artifact.related.join(", ") : ""
  ].filter(Boolean).join(" ");
}
var ELOQUENT_BUILDER_METHODS = [
  "addSelect",
  "avg",
  "chunk",
  "chunkById",
  "count",
  "create",
  "cursor",
  "dd",
  "delete",
  "distinct",
  "doesntExist",
  "doesntHave",
  "dump",
  "each",
  "exists",
  "find",
  "findMany",
  "findOrFail",
  "findOrNew",
  "first",
  "firstOr",
  "firstOrCreate",
  "firstOrFail",
  "firstOrNew",
  "firstWhere",
  "forceCreate",
  "forceDelete",
  "get",
  "groupBy",
  "has",
  "having",
  "inRandomOrder",
  "join",
  "latest",
  "lazy",
  "lazyById",
  "leftJoin",
  "limit",
  "lockForUpdate",
  "max",
  "min",
  "offset",
  "oldest",
  "orWhere",
  "orWhereHas",
  "orWhereIn",
  "orderBy",
  "orderByDesc",
  "paginate",
  "pluck",
  "select",
  "sharedLock",
  "simplePaginate",
  "skip",
  "sole",
  "sum",
  "take",
  "tap",
  "toSql",
  "unless",
  "update",
  "updateOrCreate",
  "value",
  "when",
  "where",
  "whereBetween",
  "whereDate",
  "whereDoesntHave",
  "whereHas",
  "whereIn",
  "whereKey",
  "whereKeyNot",
  "whereNot",
  "whereNotIn",
  "whereNotNull",
  "whereNull",
  "with",
  "withCount",
  "withSum"
];
var SOFT_DELETE_BUILDER_METHODS = ["onlyTrashed", "restore", "withTrashed", "withoutTrashed"];
var COLUMN_ARGUMENT_METHODS = "(?:where|orWhere|whereIn|orWhereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereDate|whereNot|firstWhere|orderBy|orderByDesc|latest|oldest|value|pluck|select|addSelect|groupBy|min|max|sum|avg)";
function eloquentColumnReceiverPrefix(linePrefix) {
  const match = new RegExp(
    `(?:->|::)\\s*${COLUMN_ARGUMENT_METHODS}\\s*\\(\\s*(?:\\[\\s*)?['"][A-Za-z0-9_]*$`
  ).exec(linePrefix);
  return match ? linePrefix.slice(0, match.index + 2) : null;
}
function isInsideDbTableNameString(linePrefix) {
  return /\bDB::(?:connection\([^)]*\)\s*->\s*)?table\(\s*['"][A-Za-z0-9_]*$/.test(linePrefix);
}
function dbColumnContextTable(linePrefix) {
  return new RegExp(
    `\\bDB::(?:connection\\([^)]*\\)\\s*->\\s*)?table\\(\\s*['"]([A-Za-z0-9_]+)['"]\\s*\\)[^;\\n]*->\\s*${COLUMN_ARGUMENT_METHODS}\\s*\\(\\s*(?:\\[\\s*)?['"][A-Za-z0-9_]*$`
  ).exec(linePrefix)?.[1] ?? null;
}
function eloquentBuilderChainModel(linePrefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[^;\n]*->\s*[A-Za-z0-9_]*$/.exec(linePrefix)?.[1] ?? null;
}
function findModelByReference(document, reference, index2) {
  const resolved = resolvePhpClassReference(document.getText(), reference);
  return index2.models.find(
    (model) => model.className === resolved || `${model.namespace}\\${model.className}` === resolved
  ) ?? null;
}
function builderChainCompletions(model, index2) {
  const items = /* @__PURE__ */ new Map();
  for (const scope of model.scopes) {
    items.set(scope, {
      label: scope,
      kind: import_node3.CompletionItemKind.Method,
      detail: `Eloquent scope ${model.className}`,
      data: { filePath: model.filePath }
    });
  }
  for (const method of model.customBuilder?.methods ?? []) {
    items.set(method.name, {
      label: method.name,
      kind: import_node3.CompletionItemKind.Method,
      detail: `Custom Eloquent builder ${model.customBuilder?.className}`,
      data: { filePath: model.customBuilder?.filePath ?? model.filePath }
    });
  }
  for (const macro of index2.macros) {
    if (/\bBuilder$/.test(macro.className)) {
      items.set(macro.method, {
        label: macro.method,
        kind: import_node3.CompletionItemKind.Method,
        detail: `Macro on ${macro.className}`,
        data: { filePath: macro.filePath }
      });
    }
  }
  if (model.usesSoftDeletes) {
    for (const method of SOFT_DELETE_BUILDER_METHODS) {
      items.set(method, {
        label: method,
        kind: import_node3.CompletionItemKind.Method,
        detail: "SoftDeletes builder method",
        data: { filePath: model.filePath }
      });
    }
  }
  for (const method of ELOQUENT_BUILDER_METHODS) {
    if (!items.has(method)) {
      items.set(method, {
        label: method,
        kind: import_node3.CompletionItemKind.Method,
        detail: "Eloquent builder method"
      });
    }
  }
  return [...items.values()];
}
function modelPropertyContext(document, linePrefix, index2) {
  const access2 = /(\$[A-Za-z_][A-Za-z0-9_]*)->[A-Za-z0-9_]*$/.exec(linePrefix);
  if (!access2) {
    return null;
  }
  if (access2[1] === "$this") {
    const documentPath = documentPathFromUri(document.uri);
    return index2.models.find((model) => model.filePath === documentPath) ?? null;
  }
  const documentText = document.getText();
  const className = modelClassForVariable(documentText, access2[1]);
  if (!className) {
    return null;
  }
  const resolved = resolvePhpClassReference(documentText, className);
  return index2.models.find(
    (model) => model.className === resolved || `${model.namespace}\\${model.className}` === resolved
  ) ?? null;
}
function modelClassForVariable(source, variable) {
  const escapedName = variable.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const assignment = new RegExp(
    `\\$${escapedName}\\s*=\\s*(?:new\\s+)?([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s*(?:::|\\()`
  ).exec(source);
  if (assignment) {
    return assignment[1];
  }
  return new RegExp(`([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s+\\$${escapedName}\\b`).exec(source)?.[1] ?? null;
}
function modelPropertyCompletions(model, index2) {
  const items = /* @__PURE__ */ new Map();
  const table = index2.schemaTables.find((candidate) => candidate.name === model.tableName);
  const casts = new Map((model.castDetails ?? []).map((cast) => [cast.name, cast]));
  const accessors = new Map((model.accessorDetails ?? []).map((accessor) => [accessor.name, accessor]));
  for (const column of table?.columns ?? []) {
    items.set(column.name, {
      label: column.name,
      kind: import_node3.CompletionItemKind.Field,
      detail: modelColumnDetail(column, casts.get(column.name), index2),
      data: { filePath: column.filePath, tableName: column.tableName }
    });
  }
  for (const cast of model.castDetails ?? []) {
    if (!items.has(cast.name)) {
      items.set(cast.name, {
        label: cast.name,
        kind: import_node3.CompletionItemKind.Field,
        detail: modelCastAttributeDetail(model, cast, index2),
        data: { filePath: model.filePath }
      });
    }
  }
  for (const accessor of model.accessors ?? []) {
    const detail = accessors.get(accessor);
    items.set(accessor, {
      label: accessor,
      kind: import_node3.CompletionItemKind.Property,
      detail: modelAccessorDetail(model.className, detail),
      data: { filePath: model.filePath }
    });
  }
  for (const append of model.appends ?? []) {
    if (!items.has(append)) {
      items.set(append, {
        label: append,
        kind: import_node3.CompletionItemKind.Property,
        detail: `Appended Eloquent attribute on ${model.className}`,
        data: { filePath: model.filePath }
      });
    }
  }
  for (const relation of model.relations) {
    if (!items.has(relation.name)) {
      items.set(relation.name, {
        label: relation.name,
        kind: import_node3.CompletionItemKind.Property,
        detail: relation.relatedModel ? `Eloquent ${relation.type} relation to ${relation.relatedModel}` : `Eloquent ${relation.type} relation`,
        data: { filePath: model.filePath }
      });
    }
    if (!items.has(`${relation.name}_count`)) {
      items.set(`${relation.name}_count`, {
        label: `${relation.name}_count`,
        kind: import_node3.CompletionItemKind.Property,
        detail: `Count of ${relation.name} (via withCount)`,
        data: { filePath: model.filePath }
      });
    }
  }
  return [...items.values()];
}
function modelColumnDetail(column, cast, index2) {
  const resolved = cast ? resolveCastType(cast, index2) : null;
  return [
    schemaColumnDetail(column),
    resolved ? `type: ${castTypeDisplay(resolved, column)}` : "",
    cast ? `cast: ${cast.type}` : ""
  ].filter(Boolean).join(" ");
}
function modelCastAttributeDetail(model, cast, index2) {
  const resolved = resolveCastType(cast, index2);
  return [
    `Cast attribute on ${model.className}`,
    resolved ? `type: ${castTypeDisplay(resolved)}` : "",
    `cast: ${cast.type}`
  ].filter(Boolean).join(" ");
}
function modelAccessorDetail(className, accessor) {
  if (!accessor) {
    return `Accessor on ${className}`;
  }
  const source = accessor.source === "attribute" ? "Attribute accessor" : "Accessor";
  return accessor.returnType ? `${source} on ${className}: ${accessor.returnType}` : `${source} on ${className}`;
}
function schemaColumnsForDocument(document, index2) {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath) {
    return [];
  }
  const model = index2.models.find((candidate) => candidate.filePath === documentPath);
  if (!model) {
    return [];
  }
  return index2.schemaTables.find((table) => table.name === model.tableName)?.columns ?? [];
}
function validationFieldsForDocument(document, index2) {
  const documentPath = documentPathFromUri(document.uri);
  const documentText = document.getText();
  const fields = [];
  if (documentPath) {
    for (const ruleSet of index2.validationRules.filter((rule) => rule.filePath === documentPath)) {
      fields.push(...ruleSet.fields);
    }
  }
  const requestClass = formRequestClassForDocument(documentText);
  if (requestClass) {
    for (const ruleSet of index2.validationRules.filter((rule) => rule.className === requestClass)) {
      fields.push(...ruleSet.fields);
    }
  }
  if (fields.length === 0) {
    for (const ruleSet of index2.validationRules) {
      fields.push(...ruleSet.fields);
    }
  }
  return uniqueValidationFields(fields);
}
function formRequestClassForDocument(source) {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}
function uniqueValidationFields(fields) {
  const byName = /* @__PURE__ */ new Map();
  for (const field of fields) {
    const existing = byName.get(field.field);
    byName.set(field.field, {
      field: field.field,
      rules: existing ? uniqueStrings([...existing.rules, ...field.rules]) : field.rules
    });
  }
  return [...byName.values()].sort((left, right) => left.field.localeCompare(right.field));
}
function documentPathFromUri(uri) {
  try {
    return (0, import_node_url3.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function isInsideModelAttributeArray(document, position) {
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position
  });
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[[\s\S]*$/;
  const match = propertyStart.exec(beforeCursor);
  return Boolean(match && !/\]\s*;\s*$/.test(match[0]));
}
function isInsideInertiaPageString(linePrefix) {
  return /\bInertia::render\(\s*['"][^'"]*$/.test(linePrefix) || /(?<!::)\binertia\(\s*['"][^'"]*$/.test(linePrefix) || /\bRoute::inertia\(\s*['"][^'"]*['"]\s*,\s*['"][^'"]*$/.test(linePrefix);
}
function isInsideBladeViewDirectiveString(linePrefix) {
  return /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*['"][^'"]*$/.test(
    linePrefix
  );
}
function bladeSectionLayoutForDocument(document, linePrefix, index2) {
  if (!/@section\s*\(\s*['"][^'"]*$/.test(linePrefix)) {
    return null;
  }
  const view = bladeViewForDocument(document, index2);
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}
function bladeStackLayoutForDocument(document, linePrefix, index2) {
  if (!/@(?:push|prepend)\s*\(\s*['"][^'"]*$/.test(linePrefix)) {
    return null;
  }
  const view = bladeViewForDocument(document, index2);
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}
function bladeViewForDocument(document, index2) {
  const documentPath = documentPathFromUri(document.uri);
  return documentPath ? index2.bladeViews.find((view) => view.filePath === documentPath) ?? null : null;
}
function isInsideValidationFieldCall(linePrefix) {
  return /->(validated|input)\(\s*['"][^'"]*$/.test(linePrefix) || /->safe\(\)->(only|except)\(\s*\[\s*['"][^'"]*$/.test(linePrefix) || /->(only|except)\(\s*\[\s*['"][^'"]*$/.test(linePrefix);
}
function validationSchemaContextForLine(linePrefix) {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]*$/.exec(linePrefix);
  if (columnMatch) {
    return { kind: "column", tableName: columnMatch[1] };
  }
  return /\bRule::(?:exists|unique)\(\s*['"][^'"]*$/.test(linePrefix) ? { kind: "table" } : null;
}
var VALIDATION_RULE_NAMES = [
  "accepted",
  "accepted_if",
  "active_url",
  "after",
  "after_or_equal",
  "alpha",
  "alpha_dash",
  "alpha_num",
  "array",
  "ascii",
  "bail",
  "before",
  "before_or_equal",
  "between",
  "boolean",
  "confirmed",
  "contains",
  "current_password",
  "date",
  "date_equals",
  "date_format",
  "decimal",
  "declined",
  "declined_if",
  "different",
  "digits",
  "digits_between",
  "dimensions",
  "distinct",
  "doesnt_end_with",
  "doesnt_start_with",
  "email",
  "ends_with",
  "exclude",
  "exclude_if",
  "exclude_unless",
  "exclude_with",
  "exclude_without",
  "exists",
  "extensions",
  "file",
  "filled",
  "gt",
  "gte",
  "hex_color",
  "image",
  "in",
  "in_array",
  "integer",
  "ip",
  "ipv4",
  "ipv6",
  "json",
  "list",
  "lowercase",
  "lt",
  "lte",
  "mac_address",
  "max",
  "max_digits",
  "mimes",
  "mimetypes",
  "min",
  "min_digits",
  "missing",
  "missing_if",
  "missing_unless",
  "missing_with",
  "missing_with_all",
  "multiple_of",
  "not_in",
  "not_regex",
  "nullable",
  "numeric",
  "present",
  "present_if",
  "present_unless",
  "present_with",
  "present_with_all",
  "prohibited",
  "prohibited_if",
  "prohibited_unless",
  "prohibits",
  "regex",
  "required",
  "required_array_keys",
  "required_if",
  "required_if_accepted",
  "required_if_declined",
  "required_unless",
  "required_with",
  "required_with_all",
  "required_without",
  "required_without_all",
  "same",
  "size",
  "sometimes",
  "starts_with",
  "string",
  "timezone",
  "ulid",
  "unique",
  "uppercase",
  "url",
  "uuid"
];
function validationRuleStringContext(document, position, linePrefix) {
  const segment = validationRuleSegment(linePrefix);
  if (segment === null || !isInsideValidationRulesContainer(document, position)) {
    return null;
  }
  const schemaMatch = /^(?:exists|unique):([A-Za-z0-9_.]*)(,[A-Za-z0-9_]*)?$/.exec(segment);
  if (schemaMatch) {
    return schemaMatch[2] === void 0 ? { kind: "table" } : { kind: "column", tableName: schemaMatch[1] };
  }
  return { kind: "rule" };
}
function validationRuleSegment(linePrefix) {
  const value = /=>\s*'([^']*)$/.exec(linePrefix)?.[1] ?? /=>\s*"([^"]*)$/.exec(linePrefix)?.[1] ?? /=>\s*\[[^\]]*['"]([^'"]*)$/.exec(linePrefix)?.[1] ?? /^\s*['"]([^'"]*)$/.exec(linePrefix)?.[1] ?? null;
  return value === null ? null : value.split("|").at(-1) ?? "";
}
function isInsideValidationRulesContainer(document, position) {
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position
  });
  const call = lastMatch(/(?:->validate|->validateWithBag|->sometimes|Validator::make)\s*\(/g, beforeCursor);
  if (call && parenDelta(beforeCursor.slice(call.index + call[0].length)) >= 0) {
    return true;
  }
  const rulesMethod = lastMatch(/function\s+rules\s*\([^)]*\)[^{]*\{/g, beforeCursor);
  return Boolean(rulesMethod && braceDelta2(beforeCursor.slice(rulesMethod.index + rulesMethod[0].length)) >= 0);
}
function lastMatch(pattern, text) {
  let match = null;
  for (const candidate of text.matchAll(pattern)) {
    match = candidate;
  }
  return match;
}
function parenDelta(text) {
  return [...text].reduce((delta, char) => delta + (char === "(" ? 1 : char === ")" ? -1 : 0), 0);
}
function schemaTableCompletionItems(index2) {
  return index2.schemaTables.map((table) => ({
    label: table.name,
    kind: import_node3.CompletionItemKind.Struct,
    detail: `Schema table ${table.columns.length} columns`,
    data: { filePath: table.filePath }
  }));
}
function schemaColumnCompletionItems(index2, tableName) {
  return index2.schemaTables.find((table) => table.name === tableName)?.columns.map((column) => ({
    label: column.name,
    kind: import_node3.CompletionItemKind.Field,
    detail: schemaColumnDetail(column),
    data: { filePath: column.filePath, tableName: column.tableName }
  })) ?? [];
}
function isInsideTranslationKeyString(linePrefix) {
  return /(__|trans|trans_choice)\(\s*['"][^'"]*$/.test(linePrefix) || /@(lang|choice)\s*\(\s*['"][^'"]*$/.test(linePrefix);
}
function isInsideAuthorizationAbilityString(linePrefix) {
  return /->(can|cannot|authorize)\(\s*['"][^'"]*$/.test(linePrefix) || /Gate::(allows|denies|authorize|check|any|none)\(\s*['"][^'"]*$/.test(linePrefix) || /@(can|cannot|canany)\s*\(\s*['"][^'"]*$/.test(linePrefix);
}
function isInsideArtisanCommandString(linePrefix) {
  return /\bArtisan::(?:call|queue)\(\s*['"][^'"]*$/.test(linePrefix) || /(?:\$this|static|self)->(?:call|callSilent)\(\s*['"][^'"]*$/.test(linePrefix) || /\bSchedule::command\(\s*['"][^'"]*$/.test(linePrefix) || /->command\(\s*['"][^'"]*$/.test(linePrefix);
}
function isInsideStorageDiskString(linePrefix) {
  return /\bStorage::(?:disk|drive|fake|persistentFake)\(\s*['"][^'"]*$/.test(linePrefix);
}
function storageDiskCompletionItems(index2) {
  const disks = /* @__PURE__ */ new Map();
  for (const entry of index2.configEntries) {
    const match = /^filesystems\.disks\.([A-Za-z0-9_-]+)/.exec(entry.key);
    if (match && !disks.has(match[1])) {
      disks.set(match[1], entry.filePath);
    }
  }
  return [...disks.entries()].map(([name, filePath]) => ({
    label: name,
    kind: import_node3.CompletionItemKind.Value,
    detail: "Laravel filesystem disk",
    data: { filePath }
  }));
}
function isInsideMiddlewareString(linePrefix) {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?['"][^'"]*$/.test(linePrefix);
}
function isInsideProviderClassArray(document, linePrefix) {
  const documentPath = documentPathFromUri(document.uri);
  if (!documentPath || !isProviderRegistrationFile(documentPath)) {
    return false;
  }
  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)[^\]\n]*[A-Za-z_\\]*$/.test(linePrefix) || /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)[^\]\n]*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*[A-Za-z_\\]*$/.test(linePrefix);
}
function isProviderRegistrationFile(filePath) {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}
function routeParameterCompletionRouteName(linePrefix) {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(linePrefix);
  if (!match) {
    return null;
  }
  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (!/['"][^'"]*$/.test(currentEntry) || /=>/.test(currentEntry)) {
    return null;
  }
  return match[2];
}
function routeControllerActionClass(linePrefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*['"][^'"]*$/.exec(
    linePrefix
  )?.[1] ?? null;
}
function routeControllerGroupActionClass(document, lineNumber, linePrefix) {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*['"][^'"]*$/.test(linePrefix)) {
    return null;
  }
  return activeRouteControllerGroupClass(document.getText().split(/\r?\n/).slice(0, lineNumber));
}
function activeRouteControllerGroupClass(lines) {
  const stack = [];
  let braceDepth = 0;
  for (const line of lines) {
    const controller = routeControllerGroupController(line);
    const nextBraceDepth = braceDepth + braceDelta2(line);
    if (controller) {
      stack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        controller
      });
    }
    braceDepth = nextBraceDepth;
    while (stack.length > 0 && braceDepth < stack[stack.length - 1].closeDepth) {
      stack.pop();
    }
  }
  return stack.at(-1)?.controller ?? null;
}
function routeControllerGroupController(line) {
  return /Route::controller\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)[^;]*->group\s*\(/.exec(line)?.[1] ?? null;
}
function braceDelta2(line) {
  return [...line].reduce((delta, char) => delta + (char === "{" ? 1 : char === "}" ? -1 : 0), 0);
}
function isInsideRouteControllerClassContext(linePrefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*[A-Za-z_\\]*$/.test(linePrefix) || /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*[A-Za-z_\\]*$/.test(linePrefix);
}
function controllerMatches(controller, value) {
  return controller.className === value || controller.className === value.split("\\").at(-1) || (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}
var RELATION_CONTEXT_METHODS = "with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax";
function eloquentRelationContext(document, linePrefix, offset, index2) {
  const context = eloquentRelationReceiverContext(linePrefix);
  if (!context) {
    return null;
  }
  const rootModel = builderReceiverModel(document.getText(), context.receiverPrefix, offset, index2);
  if (!rootModel) {
    return null;
  }
  const segments = context.pathPrefix.split(".");
  segments.pop();
  return resolveRelationPath(document.getText(), rootModel, segments, index2);
}
function eloquentRelationReceiverContext(linePrefix) {
  const match = new RegExp(
    `(?:->|::)\\s*(?:${RELATION_CONTEXT_METHODS})\\s*\\(\\s*(?:\\[\\s*)?['"]([^'"]*)$`
  ).exec(linePrefix);
  return match ? { pathPrefix: match[1], receiverPrefix: linePrefix.slice(0, match.index + 2) } : null;
}
var WRITE_ARRAY_METHODS = "create|forceCreate|make|fill|forceFill|update|firstOrCreate|firstOrNew|updateOrCreate";
function modelWriteArrayContext(document, position, offset, index2) {
  const beforeCursor = document.getText({ start: { line: 0, character: 0 }, end: position });
  if (!isArrayKeyStringOpen(beforeCursor)) {
    return null;
  }
  const call = lastMatch(
    new RegExp(
      `(\\$[A-Za-z_][A-Za-z0-9_]*|[A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s*(?:->|::)\\s*(?:${WRITE_ARRAY_METHODS})\\s*\\(\\s*\\[`,
      "g"
    ),
    beforeCursor
  );
  if (!call) {
    return null;
  }
  const arrayBody = beforeCursor.slice(call.index + call[0].length);
  if (bracketDelta(arrayBody) < 0 || parenDelta(arrayBody) < 0) {
    return null;
  }
  const receiver = call[1];
  return receiver.startsWith("$") ? builderVariableModel(document.getText(), receiver, offset, index2) : findModelByReference(document, receiver, index2);
}
function isArrayKeyStringOpen(beforeCursor) {
  const openQuote = /(['"])[^'"]*$/.exec(beforeCursor);
  if (!openQuote) {
    return false;
  }
  let cursor = openQuote.index - 1;
  while (cursor >= 0 && /\s/.test(beforeCursor[cursor])) {
    cursor -= 1;
  }
  const preceding = beforeCursor[cursor];
  return preceding === "[" || preceding === ",";
}
function modelWritableColumnCompletions(model, index2) {
  const items = /* @__PURE__ */ new Map();
  const table = index2.schemaTables.find((candidate) => candidate.name === model.tableName);
  const casts = new Map((model.castDetails ?? []).map((cast) => [cast.name, cast]));
  for (const column of table?.columns ?? []) {
    items.set(column.name, {
      label: column.name,
      kind: import_node3.CompletionItemKind.Field,
      detail: modelColumnDetail(column, casts.get(column.name), index2),
      data: { filePath: column.filePath, tableName: column.tableName }
    });
  }
  for (const fillable of model.fillable) {
    if (!items.has(fillable)) {
      items.set(fillable, {
        label: fillable,
        kind: import_node3.CompletionItemKind.Field,
        detail: `Fillable attribute on ${model.className}`,
        data: { filePath: model.filePath }
      });
    }
  }
  return [...items.values()];
}
function bracketDelta(text) {
  return [...text].reduce((delta, char) => delta + (char === "[" ? 1 : char === "]" ? -1 : 0), 0);
}
function macroStaticCallClass(linePrefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[A-Za-z_][A-Za-z0-9_]*$/.exec(linePrefix)?.[1] ?? null;
}
function factoryStateModel(linePrefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->[A-Za-z_][A-Za-z0-9_]*$/.exec(
    linePrefix
  )?.[1] ?? null;
}
function eloquentScopeModel(linePrefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[A-Za-z_][A-Za-z0-9_]*$/.exec(linePrefix)?.[1] ?? /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[A-Za-z_][A-Za-z0-9_]*\([^)]*\)(?:->[A-Za-z_][A-Za-z0-9_]*\([^)]*\))*->[A-Za-z_][A-Za-z0-9_]*$/.exec(
    linePrefix
  )?.[1] ?? null;
}
function isInsideSeederCallArray(linePrefix) {
  return /->call\(\s*\[\s*[A-Za-z_\\]*$/.test(linePrefix);
}
function artifactContextKinds(linePrefix) {
  if (/\bevent\s*\(\s*new\s+[A-Za-z_\\]*$/.test(linePrefix)) {
    return ["event"];
  }
  if (/\bdispatch\s*\(\s*new\s+[A-Za-z_\\]*$/.test(linePrefix) || /::dispatch\s*\(\s*[A-Za-z_\\]*$/.test(linePrefix)) {
    return ["event", "job"];
  }
  if (/->(?:send|queue|later)\s*\(\s*new\s+[A-Za-z_\\]*$/.test(linePrefix)) {
    return ["mailable", "notification"];
  }
  return null;
}
function bladeComponentTagContext(linePrefix) {
  if (/<x-[A-Za-z0-9_.:-]*$/.test(linePrefix)) {
    return "tag";
  }
  const propsMatch = /<x-([A-Za-z0-9_.:-]+)\s+[^>]*$/.exec(linePrefix);
  return propsMatch ? { kind: "props", name: propsMatch[1].replace(/:/g, ".") } : null;
}
function livewireComponentTagContext(linePrefix) {
  if (/<livewire:[A-Za-z0-9_.-]*$/.test(linePrefix)) {
    return "tag";
  }
  const propsMatch = /<livewire:([A-Za-z0-9_.-]+)\s+[^>]*$/.exec(linePrefix);
  return propsMatch ? { kind: "props", name: propsMatch[1] } : null;
}
function livewireComponentDetail(component) {
  return component.namespace ? `Livewire component ${component.namespace}\\${component.className}` : `Livewire component ${component.className}`;
}
function livewireKebabCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function livewireWireBindingContext(document, linePrefix, index2) {
  const match = /\bwire:([a-zA-Z0-9.-]+)\s*=\s*['"][^'"]*$/.exec(linePrefix);
  if (!match) {
    return null;
  }
  const component = livewireComponentForDocument(document, index2);
  if (!component) {
    return null;
  }
  return { component, kind: match[1].startsWith("model") ? "properties" : "methods" };
}
function livewireComponentForDocument(document, index2) {
  const documentPath = documentPathFromUri(document.uri);
  const match = documentPath ? /[/\\]resources[/\\]views[/\\]livewire[/\\](.+)\.blade\.php$/.exec(documentPath) : null;
  if (!match) {
    return null;
  }
  const name = match[1].split(/[/\\]/).join(".");
  return index2.livewireComponents.find((component) => component.name === name) ?? null;
}
function isInsideStringCall(linePrefix, helper2) {
  return new RegExp(`\\b${helper2}\\(\\s*['"][^'"]*$`).test(linePrefix);
}
function isInsideRouteNameString(linePrefix) {
  return /(?:\b(?:route|to_route)|->route)\(\s*['"][^'"]*$/.test(linePrefix) || /\bRoute::(?:has|is)\(\s*['"][^'"]*$/.test(linePrefix) || /->routeIs\(\s*['"][^'"]*$/.test(linePrefix);
}
function helperCompletions() {
  return [
    helper("route", "route('$1')", "Generate a URL for a named route"),
    helper("view", "view('$1')", "Render a Blade view"),
    helper("config", "config('$1')", "Read a Laravel config value"),
    helper("env", "env('$1')", "Read an environment value"),
    helper("app", "app($1)", "Resolve from the service container"),
    helper("resolve", "resolve($1)", "Resolve a type from the service container")
  ];
}
function helper(label, insertText, detail) {
  return {
    label,
    kind: import_node3.CompletionItemKind.Function,
    detail,
    insertText,
    insertTextFormat: import_node3.InsertTextFormat.Snippet
  };
}
function uniqueStrings(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

// src/diagnostics.ts
var import_node4 = __toESM(require_node3(), 1);
var import_node_fs3 = require("node:fs");
var import_node_path5 = __toESM(require("node:path"), 1);
var import_node_url4 = require("node:url");
function diagnosticsForDocument(document, index2, workspaceRoot2 = null) {
  const diagnostics = [];
  const documentText = document.getText();
  const routeNames = new Set(index2.routes.map((route) => route.name).filter((name) => Boolean(name)));
  const viewNames = new Set(index2.bladeViews.map((view) => view.name));
  const inertiaPageNames = new Set(index2.inertiaPages.map((page) => page.name));
  const livewireComponentNames = new Set(index2.livewireComponents.map((component) => component.name));
  const componentNames = new Set(index2.bladeComponents.map((component) => component.name));
  const configKeys = new Set(index2.configKeys);
  const envKeys = new Set(index2.envKeys);
  const schemaTables = new Set(index2.schemaTables.map((table) => table.name));
  const translationKeys = new Set(index2.translationKeys.map((translation) => translation.key));
  const authorizationAbilities = new Set(index2.authorization.map((entry) => entry.ability));
  const containerBindings = new Set(index2.containerBindings.map((binding) => binding.abstract));
  const controllerNames = new Set(
    index2.controllers.flatMap((controller) => [
      controller.className,
      ...controller.namespace ? [`${controller.namespace}\\${controller.className}`] : []
    ])
  );
  const commandNames = new Set(index2.commands.map((command) => command.name));
  const middlewareAliases = new Set(index2.middleware.map((middleware) => middleware.alias));
  const providerNames = new Set(
    index2.providers.flatMap((provider) => [
      provider.className,
      ...provider.namespace ? [`${provider.namespace}\\${provider.className}`] : []
    ])
  );
  const seederNames = new Set(
    index2.seeders.flatMap((seeder) => [
      seeder.className,
      ...seeder.namespace ? [`${seeder.namespace}\\${seeder.className}`] : []
    ])
  );
  const validationFields = new Set(validationFieldsForDocument2(document, index2).map((field) => field.field));
  const documentPath = documentPathFromUri2(document.uri);
  const attributeTableName = index2.models.find((model) => model.filePath === documentPath)?.tableName ?? null;
  const indexedModelNames = new Set(index2.models.flatMap((model) => [
    model.className,
    ...model.namespace ? [`${model.namespace}\\${model.className}`] : []
  ]));
  const currentRequest = documentPath ? index2.validationRules.find((ruleSet) => ruleSet.filePath === documentPath && ruleSet.source === "formRequest") : null;
  const currentArtifact = documentPath ? index2.artifacts.find((artifact) => artifact.filePath === documentPath) : null;
  const bladeSectionLayout = bladeSectionLayoutForDocument2(document, index2);
  const bladeStackLayout = bladeStackLayoutForDocument2(document, index2);
  let insideModelAttributeArray = false;
  for (const [lineIndex, line] of document.getText().split(/\r?\n/).entries()) {
    for (const convention of classConventionContextsInLine(line)) {
      if (currentRequest?.className === convention.value) {
        const inferredModelName = inferRequestModelName(convention.value);
        if (inferredModelName && indexedModelNames.size > 0 && !hasIndexedModel(indexedModelNames, inferredModelName)) {
          diagnostics.push(
            unresolvedDiagnostic(
              lineIndex,
              { ...convention, kind: "requestConvention", model: inferredModelName },
              `Form request '${convention.value}' does not match an indexed model '${inferredModelName}'.`
            )
          );
        }
      }
      if (currentArtifact?.kind === "resource" && currentArtifact.className === convention.value) {
        const inferredModelName = inferResourceModelName(convention.value);
        if (indexedModelNames.size > 0 && (!inferredModelName || !hasIndexedModel(indexedModelNames, inferredModelName))) {
          diagnostics.push(
            unresolvedDiagnostic(
              lineIndex,
              { ...convention, kind: "resourceConvention", ...inferredModelName ? { model: inferredModelName } : {} },
              inferredModelName ? `JSON resource '${convention.value}' does not match an indexed model '${inferredModelName}'.` : `JSON resource '${convention.value}' should be named '<Model>Resource'.`
            )
          );
        }
      }
      if (documentPath?.includes("/Policies/") && convention.value.endsWith("Policy")) {
        const policyModelName = convention.value.replace(/Policy$/, "");
        if (indexedModelNames.size > 0 && !hasIndexedModel(indexedModelNames, policyModelName)) {
          diagnostics.push(
            unresolvedDiagnostic(
              lineIndex,
              { ...convention, kind: "policyConvention", model: policyModelName },
              `Policy '${convention.value}' does not match an indexed model '${policyModelName}'.`
            )
          );
        }
      }
    }
    for (const policyMap of policyMapConventionContextsInLine(line)) {
      const resolvedModel = resolvePhpClassReference(documentText, policyMap.model ?? "");
      const modelName = resolvedModel.split("\\").at(-1) ?? resolvedModel;
      const policyName = resolvePhpClassReference(documentText, policyMap.value).split("\\").at(-1) ?? policyMap.value;
      const expectedPolicy = `${modelName}Policy`;
      if (hasIndexedModel(indexedModelNames, resolvedModel) && policyName !== expectedPolicy) {
        diagnostics.push(
          unresolvedDiagnostic(
            lineIndex,
            policyMap,
            `Policy '${policyName}' does not follow the expected '${expectedPolicy}' name for model '${modelName}'.`
          )
        );
      }
    }
    if (attributeTableName && /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[/.test(line)) {
      insideModelAttributeArray = true;
    }
    if (attributeTableName && insideModelAttributeArray) {
      for (const attribute of modelAttributeContextsInLine(line, attributeTableName)) {
        const table = index2.schemaTables.find((candidate) => candidate.name === attribute.tableName);
        if (table && !table.columns.some((column) => column.name === attribute.value)) {
          diagnostics.push(
            unresolvedDiagnostic(lineIndex, attribute, `Unknown Eloquent attribute '${attribute.tableName}.${attribute.value}'.`)
          );
        }
      }
    }
    for (const factoryState of factoryStateContextsInLine(line)) {
      if (!factoryState.model) {
        continue;
      }
      const states = factoryStatesForModel(index2, factoryState.model);
      if (states.length > 0 && !states.includes(factoryState.value)) {
        diagnostics.push(
          unresolvedDiagnostic(
            lineIndex,
            factoryState,
            `Unknown factory state '${factoryState.model}.${factoryState.value}'.`
          )
        );
      }
    }
    for (const scope of eloquentScopeContextsInLine(line)) {
      const model = findModel2(index2, scope.model ? resolvePhpClassReference(documentText, scope.model) : void 0);
      if (model && !model.scopes.includes(scope.value) && !model.staticMethods?.includes(scope.value) && !isKnownEloquentBuilderMethod(scope.value) && !model.customBuilder?.methods.some((method) => method.name === scope.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, scope, `Unknown Eloquent scope '${scope.model}.${scope.value}'.`));
      }
    }
    for (const seeder of seederClassContextsInLine(line)) {
      if (!seederNames.has(seeder.value) && !seederNames.has(seeder.value.split("\\").at(-1) ?? seeder.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, seeder, `Unknown seeder '${seeder.value}'.`));
      }
    }
    if (documentPath && isProviderRegistrationFile2(documentPath)) {
      for (const provider of serviceProviderContextsInLine(line)) {
        const resolvedProvider = resolvePhpClassReference(documentText, provider.value);
        if (!providerNames.has(resolvedProvider) && !providerNames.has(resolvedProvider.split("\\").at(-1) ?? resolvedProvider)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, provider, `Unknown service provider '${provider.value}'.`));
        }
      }
    }
    for (const controller of routeControllerClassContextsInLine(line)) {
      const resolvedController = resolvePhpClassReference(documentText, controller.value);
      if (!controllerNames.has(resolvedController) && !controllerNames.has(resolvedController.split("\\").at(-1) ?? resolvedController)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, controller, `Unknown controller '${controller.value}'.`));
      }
    }
    for (const action of routeControllerActionContextsInLine(line, documentText, lineIndex)) {
      const controller = findController2(index2, action.model ? resolvePhpClassReference(documentText, action.model) : void 0);
      if (controller && !controller.actions.includes(action.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, action, `Unknown controller action '${action.model}@${action.value}'.`));
      }
    }
    for (const parameter of routeParameterContextsInLine(line)) {
      const route = index2.routes.find((candidate) => candidate.name === parameter.model);
      const parameters = routeParameters3(route);
      if (route && parameters.length > 0 && !parameters.includes(parameter.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, parameter, `Unknown route parameter '${parameter.model}.${parameter.value}'.`));
      }
    }
    for (const component of componentContextsInLine(line)) {
      if (!componentNames.has(component.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, component, `Unknown Blade component '${component.value}'.`));
      }
    }
    if (livewireComponentNames.size > 0) {
      for (const component of livewireComponentContextsInLine(line)) {
        if (!livewireComponentNames.has(component.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, component, `Unknown Livewire component '${component.value}'.`));
        }
      }
    }
    for (const prop of componentPropContextsInLine(line)) {
      const component = index2.bladeComponents.find((candidate) => candidate.name === prop.model);
      if (component && component.props.length > 0 && !component.props.includes(prop.value) && shouldDiagnoseUnknownComponentProp(prop.value, component.props)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, prop, `Unknown Blade component prop '${prop.model}.${prop.value}'.`));
      }
    }
    if (bladeSectionLayout) {
      for (const section of bladeSectionContextsInLine(line, bladeSectionLayout.name)) {
        if (!bladeSectionLayout.yields.includes(section.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, section, `Unknown Blade section '${bladeSectionLayout.name}.${section.value}'.`));
        }
      }
    }
    if (bladeStackLayout) {
      for (const stack of bladeStackContextsInLine(line, bladeStackLayout.name)) {
        if (!(bladeStackLayout.stacks ?? []).includes(stack.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, stack, `Unknown Blade stack '${bladeStackLayout.name}.${stack.value}'.`));
        }
      }
    }
    for (const context of stringContextsInLine(line)) {
      if (context.kind === "route" && !routeNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Laravel route '${context.value}'.`));
      }
      if (context.kind === "view" && !viewNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Blade view '${context.value}'.`));
      }
      if (context.kind === "inertiaPage" && inertiaPageNames.size > 0 && !inertiaPageNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Inertia page '${context.value}'.`));
      }
      if (context.kind === "livewireComponent" && livewireComponentNames.size > 0 && !livewireComponentNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Livewire component '${context.value}'.`));
      }
      if (context.kind === "config" && !configKeys.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Laravel config key '${context.value}'.`));
      }
      if (context.kind === "env" && !envKeys.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown environment key '${context.value}'.`));
      }
      if (context.kind === "schemaTable" && !schemaTables.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown schema table '${context.value}'.`));
      }
      if (context.kind === "schemaColumn") {
        const table = index2.schemaTables.find((candidate) => candidate.name === context.tableName);
        if (table && !table.columns.some((column) => column.name === context.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown schema column '${context.tableName}.${context.value}'.`));
        }
      }
      if (context.kind === "translation" && !translationKeys.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown translation key '${context.value}'.`));
      }
      if (context.kind === "authorization" && !authorizationAbilities.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown authorization ability '${context.value}'.`));
      }
      if (context.kind === "container" && !containerBindings.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown container binding '${context.value}'.`));
      }
      if (context.kind === "command" && !commandNames.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Artisan command '${context.value}'.`));
      }
      if (context.kind === "middleware" && !middlewareAliases.has(context.value.split(":")[0])) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown middleware alias '${context.value}'.`));
      }
      if (context.kind === "validationField" && validationFields.size > 0 && !validationFields.has(context.value)) {
        diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown validated request field '${context.value}'.`));
      }
      if (context.kind === "relation") {
        const model = findModel2(index2, context.model ? resolvePhpClassReference(documentText, context.model) : void 0);
        if (model && !model.relations.some((relation) => relation.name === context.value)) {
          diagnostics.push(unresolvedDiagnostic(lineIndex, context, `Unknown Eloquent relation '${context.model}.${context.value}'.`));
        }
      }
    }
    if (/\]\s*;/.test(line)) {
      insideModelAttributeArray = false;
    }
  }
  diagnostics.push(...namedArgumentOrderDiagnostics(document, index2, workspaceRoot2));
  return diagnostics;
}
function livewireComponentContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/<livewire:([A-Za-z0-9_.-]+)/g)) {
    const value = match[1];
    const start = (match.index ?? 0) + "<livewire:".length;
    contexts.push({
      end: start + value.length,
      kind: "livewireComponent",
      start,
      value
    });
  }
  return contexts;
}
function componentContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const start = (match.index ?? 0) + 3;
    contexts.push({
      end: start + rawName.length,
      kind: "component",
      start,
      value: rawName.replace(/:/g, ".")
    });
  }
  return contexts;
}
function classConventionContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/\bclass\s+([A-Za-z_][A-Za-z0-9_]*)\b/g)) {
    const start = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
    contexts.push({
      end: start + match[1].length,
      kind: "requestConvention",
      start,
      value: match[1]
    });
  }
  return contexts;
}
function policyMapConventionContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*=>\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const policyStart = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    contexts.push({
      end: policyStart + match[2].length,
      kind: "policyConvention",
      model: match[1],
      start: policyStart,
      value: match[2]
    });
  }
  for (const match of line.matchAll(/Gate::policy\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const policyStart = (match.index ?? 0) + match[0].lastIndexOf(match[2]);
    contexts.push({
      end: policyStart + match[2].length,
      kind: "policyConvention",
      model: match[1],
      start: policyStart,
      value: match[2]
    });
  }
  return contexts;
}
function inferRequestModelName(className) {
  return /^(?:Store|Update)([A-Z][A-Za-z0-9_]*)Request$/.exec(className)?.[1] ?? null;
}
function inferResourceModelName(className) {
  return /^([A-Z][A-Za-z0-9_]*)Resource$/.exec(className)?.[1] ?? null;
}
function hasIndexedModel(indexedModelNames, modelName) {
  const baseName = modelName.split("\\").at(-1) ?? modelName;
  return indexedModelNames.has(modelName) || indexedModelNames.has(baseName);
}
function componentPropContextsInLine(line) {
  const contexts = [];
  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const componentName = rawName.replace(/:/g, ".");
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    const attributes = tag[2];
    for (const attribute of attributes.matchAll(/\s(:?)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const value = attribute[2];
      if (isGenericBladeAttribute(value)) {
        continue;
      }
      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(value);
      contexts.push({
        end: start + value.length,
        kind: "componentProp",
        model: componentName,
        start,
        value
      });
    }
  }
  return contexts;
}
function isGenericBladeAttribute(value) {
  return value === "class" || value === "id" || value === "style" || value === "title" || value.startsWith("aria-") || value.startsWith("data-") || value.startsWith("wire:") || value.startsWith("x-") || value.startsWith("v-") || value.startsWith("on");
}
function shouldDiagnoseUnknownComponentProp(value, candidates) {
  return candidates.some((candidate) => levenshteinDistance2(candidate, value) <= 2);
}
function stringContextsInLine(line) {
  const contexts = [];
  for (const stringRange of quotedStringRanges(line)) {
    const prefix = line.slice(0, stringRange.start - 1);
    const value = line.slice(stringRange.start, stringRange.end);
    const relationModel = eloquentRelationModel(prefix);
    if (relationModel) {
      contexts.push({
        end: stringRange.end,
        kind: "relation",
        model: relationModel,
        start: stringRange.start,
        value
      });
      continue;
    }
    const kind = diagnosticKindForPrefix(prefix);
    const schemaContext = validationSchemaContextForPrefix(prefix, value);
    if (schemaContext) {
      contexts.push({
        ...schemaContext,
        end: stringRange.end,
        start: stringRange.start
      });
      continue;
    }
    if (!kind) {
      continue;
    }
    contexts.push({
      end: stringRange.end,
      kind,
      start: stringRange.start,
      value
    });
  }
  return contexts;
}
function bladeSectionContextsInLine(line, layoutName) {
  const contexts = [];
  for (const match of line.matchAll(/@section\s*\(\s*(['"])([^'"]+)\1/g)) {
    const value = match[2];
    const start = (match.index ?? 0) + match[0].lastIndexOf(value);
    contexts.push({
      end: start + value.length,
      kind: "bladeSection",
      model: layoutName,
      start,
      value
    });
  }
  return contexts;
}
function bladeStackContextsInLine(line, layoutName) {
  const contexts = [];
  for (const match of line.matchAll(/@(push|prepend)\s*\(\s*(['"])([^'"]+)\2/g)) {
    const value = match[3];
    const start = (match.index ?? 0) + match[0].lastIndexOf(value);
    contexts.push({
      end: start + value.length,
      kind: "bladeStack",
      model: layoutName,
      start,
      value
    });
  }
  return contexts;
}
function modelAttributeContextsInLine(line, tableName) {
  const contexts = [];
  for (const stringRange of quotedStringRanges(line)) {
    contexts.push({
      end: stringRange.end,
      kind: "modelAttribute",
      start: stringRange.start,
      tableName,
      value: line.slice(stringRange.start, stringRange.end)
    });
  }
  return contexts;
}
function eloquentScopeContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::(?:query\(\)->)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const method = match[2];
    if ([
      "all",
      "create",
      "doesntHave",
      "factory",
      "find",
      "first",
      "has",
      "load",
      "loadAvg",
      "loadCount",
      "loadMax",
      "loadMin",
      "loadMissing",
      "loadSum",
      "orWhereDoesntHave",
      "orWhereHas",
      "query",
      "where",
      "whereDoesntHave",
      "whereHas",
      "with",
      "withAvg",
      "withCount",
      "withExists",
      "withMax",
      "withMin",
      "withOnly",
      "withSum",
      "withWhereHas",
      "without"
    ].includes(method)) {
      continue;
    }
    const start = (match.index ?? 0) + match[0].lastIndexOf(method);
    contexts.push({
      end: start + method.length,
      kind: "scope",
      model: match[1],
      start,
      value: method
    });
  }
  return contexts;
}
function factoryStateContextsInLine(line) {
  const contexts = [];
  const ignored = /* @__PURE__ */ new Set([
    "afterCreating",
    "afterMaking",
    "count",
    "create",
    "createMany",
    "for",
    "has",
    "make",
    "raw",
    "recycle",
    "sequence",
    "state",
    "trashed"
  ]);
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const state = match[2];
    if (ignored.has(state)) {
      continue;
    }
    const start = (match.index ?? 0) + match[0].lastIndexOf(state);
    contexts.push({
      end: start + state.length,
      kind: "factoryState",
      model: match[1],
      start,
      value: state
    });
  }
  return contexts;
}
function seederClassContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isSeederCallPrefix(line.slice(0, start))) {
      continue;
    }
    contexts.push({
      end: start + value.length,
      kind: "seeder",
      start,
      value
    });
  }
  return contexts;
}
function serviceProviderContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isProviderRegistrationPrefix(line.slice(0, start))) {
      continue;
    }
    contexts.push({
      end: start + value.length,
      kind: "serviceProvider",
      start,
      value
    });
  }
  return contexts;
}
function routeControllerClassContextsInLine(line) {
  const contexts = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isRouteControllerClassPrefix(line.slice(0, start))) {
      continue;
    }
    contexts.push({
      end: start + value.length,
      kind: "controller",
      start,
      value
    });
  }
  return contexts;
}
function routeControllerActionContextsInLine(line, source, lineNumber) {
  const contexts = [];
  for (const stringRange of quotedStringRanges(line)) {
    const prefix = line.slice(0, stringRange.start - 1);
    const controller = routeControllerActionClass2(prefix) ?? routeControllerGroupActionClass2(source, lineNumber, prefix);
    if (!controller) {
      continue;
    }
    contexts.push({
      end: stringRange.end,
      kind: "controllerAction",
      model: controller,
      start: stringRange.start,
      value: line.slice(stringRange.start, stringRange.end)
    });
  }
  return contexts;
}
function routeParameterContextsInLine(line) {
  const contexts = [];
  for (const stringRange of quotedStringRanges(line)) {
    const routeName = routeParameterContextRouteName(line.slice(0, stringRange.start - 1));
    if (!routeName) {
      continue;
    }
    contexts.push({
      end: stringRange.end,
      kind: "routeParameter",
      model: routeName,
      start: stringRange.start,
      value: line.slice(stringRange.start, stringRange.end)
    });
  }
  return contexts;
}
function routeParameterContextRouteName(prefix) {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(prefix);
  if (!match) {
    return null;
  }
  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (/=>/.test(currentEntry)) {
    return null;
  }
  return match[2];
}
function isSeederCallPrefix(prefix) {
  return /(?:\$this|static|self)->(?:call|callSilent|callOnce)\s*\(\s*(?:\[\s*)?(?:[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*)*$/.test(prefix);
}
function isProviderRegistrationPrefix(prefix) {
  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)(?:\s*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,?)*\s*$/.test(prefix);
}
function isRouteControllerClassPrefix(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*$/.test(prefix) || /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*$/.test(prefix);
}
function routeControllerActionClass2(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*$/.exec(prefix)?.[1] ?? null;
}
function routeControllerGroupActionClass2(source, lineNumber, prefix) {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*$/.test(prefix)) {
    return null;
  }
  return activeRouteControllerGroupClass2(source.split(/\r?\n/).slice(0, lineNumber));
}
function activeRouteControllerGroupClass2(lines) {
  const stack = [];
  let braceDepth = 0;
  for (const line of lines) {
    const controller = routeControllerGroupController2(line);
    const nextBraceDepth = braceDepth + braceDelta3(line);
    if (controller) {
      stack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        controller
      });
    }
    braceDepth = nextBraceDepth;
    while (stack.length > 0 && braceDepth < stack[stack.length - 1].closeDepth) {
      stack.pop();
    }
  }
  return stack.at(-1)?.controller ?? null;
}
function routeControllerGroupController2(line) {
  return /Route::controller\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)[^;]*->group\s*\(/.exec(line)?.[1] ?? null;
}
function braceDelta3(line) {
  return [...line].reduce((delta, char) => delta + (char === "{" ? 1 : char === "}" ? -1 : 0), 0);
}
function isProviderRegistrationFile2(filePath) {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}
function routeParameters3(route) {
  if (!route?.uri) {
    return [];
  }
  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}
function diagnosticKindForPrefix(prefix) {
  if (isRouteNamePrefix(prefix)) {
    return "route";
  }
  if (/\bview\s*\(\s*$/.test(prefix) || /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)) {
    return "view";
  }
  if (/\bInertia::render\s*\(\s*$/.test(prefix) || /(?<!::)\binertia\s*\(\s*$/.test(prefix) || /\bRoute::inertia\s*\(\s*['"][^'"]*['"]\s*,\s*$/.test(prefix)) {
    return "inertiaPage";
  }
  if (/@livewire\s*\(\s*$/.test(prefix)) {
    return "livewireComponent";
  }
  if (/\bconfig\s*\(\s*$/.test(prefix)) {
    return "config";
  }
  if (/\benv\s*\(\s*$/.test(prefix)) {
    return "env";
  }
  if (/(__|trans|trans_choice)\s*\(\s*$/.test(prefix) || /@(lang|choice)\s*\(\s*$/.test(prefix)) {
    return "translation";
  }
  if (/->(can|cannot|authorize)\s*\(\s*$/.test(prefix) || /Gate::(allows|denies|authorize|check|any|none)\s*\(\s*$/.test(prefix) || /@(can|cannot|canany)\s*\(\s*$/.test(prefix)) {
    return "authorization";
  }
  if (/\b(app|resolve)\s*\(\s*$/.test(prefix) || /App::(make|bound|has)\s*\(\s*$/.test(prefix)) {
    return "container";
  }
  if (/\bArtisan::(?:call|queue)\s*\(\s*$/.test(prefix) || /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*$/.test(prefix) || /\bSchedule::command\s*\(\s*$/.test(prefix) || /->command\s*\(\s*$/.test(prefix)) {
    return "command";
  }
  if (isMiddlewareStringPrefix(prefix)) {
    return "middleware";
  }
  if (/->(validated|input)\s*\(\s*$/.test(prefix) || /->safe\(\)->(only|except)\s*\(\s*\[\s*$/.test(prefix) || /->(only|except)\s*\(\s*\[\s*$/.test(prefix)) {
    return "validationField";
  }
  return null;
}
function validationSchemaContextForPrefix(prefix, value) {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*$/.exec(prefix);
  if (columnMatch) {
    return { kind: "schemaColumn", tableName: columnMatch[1], value };
  }
  return /\bRule::(?:exists|unique)\(\s*$/.test(prefix) ? { kind: "schemaTable", value } : null;
}
function isRouteNamePrefix(prefix) {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) || /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) || /->routeIs\s*\(\s*$/.test(prefix);
}
function eloquentRelationModel(prefix) {
  const relationMethods = "(with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  return new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? null;
}
function findModel2(index2, modelName) {
  if (!modelName) {
    return null;
  }
  return index2.models.find(
    (model) => model.className === modelName || `${model.namespace}\\${model.className}` === modelName
  ) ?? null;
}
function findController2(index2, controllerName2) {
  if (!controllerName2) {
    return null;
  }
  return index2.controllers.find(
    (controller) => controller.className === controllerName2 || `${controller.namespace}\\${controller.className}` === controllerName2
  ) ?? null;
}
function factoryStatesForModel(index2, modelName) {
  return index2.factories.filter((factory) => factory.model === modelName || factory.model?.split("\\").at(-1) === modelName).flatMap((factory) => factory.states);
}
function documentPathFromUri2(uri) {
  try {
    return (0, import_node_url4.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function bladeSectionLayoutForDocument2(document, index2) {
  const documentPath = documentPathFromUri2(document.uri);
  const view = documentPath ? index2.bladeViews.find((candidate) => candidate.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}
function bladeStackLayoutForDocument2(document, index2) {
  const documentPath = documentPathFromUri2(document.uri);
  const view = documentPath ? index2.bladeViews.find((candidate) => candidate.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}
function validationFieldsForDocument2(document, index2) {
  const documentPath = documentPathFromUri2(document.uri);
  const documentText = document.getText();
  const fields = [];
  if (documentPath) {
    for (const ruleSet of index2.validationRules.filter((rule) => rule.filePath === documentPath)) {
      fields.push(...ruleSet.fields);
    }
  }
  const requestClass = formRequestClassForDocument2(documentText);
  if (requestClass) {
    for (const ruleSet of index2.validationRules.filter((rule) => rule.className === requestClass)) {
      fields.push(...ruleSet.fields);
    }
  }
  return uniqueValidationFields2(fields);
}
function formRequestClassForDocument2(source) {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}
function uniqueValidationFields2(fields) {
  const byName = /* @__PURE__ */ new Map();
  for (const field of fields) {
    const existing = byName.get(field.field);
    byName.set(field.field, {
      field: field.field,
      rules: existing ? uniqueStrings2([...existing.rules, ...field.rules]) : field.rules
    });
  }
  return [...byName.values()].sort((left, right) => left.field.localeCompare(right.field));
}
function uniqueStrings2(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function levenshteinDistance2(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index2) => index2);
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      current[rightIndex + 1] = Math.min(
        current[rightIndex] + 1,
        previous[rightIndex + 1] + 1,
        previous[rightIndex] + (left[leftIndex] === right[rightIndex] ? 0 : 1)
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[right.length];
}
function quotedStringRanges(line) {
  const ranges = [];
  for (let index2 = 0; index2 < line.length; index2 += 1) {
    const quote = line[index2];
    if (quote !== "'" && quote !== '"') {
      continue;
    }
    const start = index2 + 1;
    index2 += 1;
    while (index2 < line.length) {
      if (line[index2] === "\\") {
        index2 += 2;
        continue;
      }
      if (line[index2] === quote) {
        ranges.push({ end: index2, start });
        break;
      }
      index2 += 1;
    }
  }
  return ranges;
}
function unresolvedDiagnostic(line, context, message) {
  return {
    data: {
      kind: context.kind,
      ...context.model ? { model: context.model } : {},
      ...context.tableName ? { tableName: context.tableName } : {},
      value: context.value
    },
    message,
    range: {
      end: { character: context.end, line },
      start: { character: context.start, line }
    },
    severity: import_node4.DiagnosticSeverity.Warning,
    source: "laravel-assist"
  };
}
var composerAutoloadCache = /* @__PURE__ */ new Map();
var phpClassLikeCache = /* @__PURE__ */ new Map();
function namedArgumentOrderDiagnostics(document, index2, workspaceRoot2) {
  if (!/:\s*/.test(document.getText())) {
    return [];
  }
  const source = document.getText();
  const sanitized = maskPhpStringsAndComments(source);
  const diagnostics = [];
  for (const call of constructorCallsInSource(sanitized)) {
    const parameterNames = constructorParameterNames(
      resolvePhpClassReference(source, call.classReference),
      index2,
      workspaceRoot2,
      /* @__PURE__ */ new Set()
    );
    if (!parameterNames || parameterNames.length < 2) {
      continue;
    }
    const parameterOrder = new Map(parameterNames.map((name, order) => [name, order]));
    const args = namedArgumentsInRange(source, sanitized, call.openParen + 1, call.closeParen, parameterOrder);
    if (args.length < 2) {
      continue;
    }
    const sorted = [...args].sort((left, right) => left.order - right.order);
    if (args.every((arg, index3) => arg === sorted[index3])) {
      continue;
    }
    const offending = firstOutOfOrderNamedArgument(args);
    if (!offending) {
      continue;
    }
    diagnostics.push({
      data: {
        kind: "namedArgumentOrder",
        replacement: sortedArgumentListReplacement(source, call.openParen + 1, call.closeParen, args, sorted),
        replacementRange: rangeForOffsets(source, call.openParen + 1, call.closeParen),
        value: offending.name
      },
      message: "Named arguments order does not match parameters order.",
      range: rangeForOffsets(source, offending.nameStart, offending.nameEnd),
      severity: import_node4.DiagnosticSeverity.Warning,
      source: "laravel-assist"
    });
  }
  return diagnostics;
}
function constructorCallsInSource(sanitized) {
  const calls = /* @__PURE__ */ new Map();
  for (const match of sanitized.matchAll(/\bnew\s+(\\?[A-Za-z_][A-Za-z0-9_\\]*)\s*\(/g)) {
    if (match[1] === "class") {
      continue;
    }
    const openParen = (match.index ?? 0) + match[0].length - 1;
    const closeParen = matchingBracket(sanitized, openParen, "(", ")");
    if (closeParen >= 0) {
      calls.set(openParen, { classReference: match[1], closeParen, openParen });
    }
  }
  for (const block of attributeBlockRanges(sanitized)) {
    const attributeSource = sanitized.slice(block.start, block.end);
    for (const match of attributeSource.matchAll(/\b(\\?[A-Za-z_][A-Za-z0-9_\\]*)\s*\(/g)) {
      const openParen = block.start + (match.index ?? 0) + match[0].length - 1;
      if (calls.has(openParen)) {
        continue;
      }
      const closeParen = matchingBracket(sanitized, openParen, "(", ")");
      if (closeParen >= 0 && closeParen <= block.end) {
        calls.set(openParen, { classReference: match[1], closeParen, openParen });
      }
    }
  }
  return [...calls.values()].sort((left, right) => left.openParen - right.openParen);
}
function attributeBlockRanges(sanitized) {
  const ranges = [];
  for (let index2 = 0; index2 < sanitized.length - 1; index2 += 1) {
    if (sanitized[index2] !== "#" || sanitized[index2 + 1] !== "[") {
      continue;
    }
    const end = matchingBracket(sanitized, index2 + 1, "[", "]");
    if (end >= 0) {
      ranges.push({ end, start: index2 + 2 });
      index2 = end;
    }
  }
  return ranges;
}
function namedArgumentsInRange(source, sanitized, start, end, parameterOrder) {
  const args = [];
  let segmentStart = start;
  let depth = 0;
  for (let index2 = start; index2 <= end; index2 += 1) {
    const char = sanitized[index2] ?? ",";
    if (char === "(" || char === "[" || char === "{") {
      depth += 1;
    } else if (char === ")" || char === "]" || char === "}") {
      depth = Math.max(0, depth - 1);
    }
    if (char === "," && depth === 0 || index2 === end) {
      const arg = namedArgumentFromSegment(source, segmentStart, index2, parameterOrder);
      if (arg) {
        args.push(arg);
      }
      segmentStart = index2 + 1;
    }
  }
  return args;
}
function namedArgumentFromSegment(source, start, end, parameterOrder) {
  const segment = source.slice(start, end);
  const match = /^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/.exec(segment);
  if (!match) {
    return null;
  }
  const name = match[2];
  const order = parameterOrder.get(name);
  if (order === void 0) {
    return null;
  }
  const nameStart = start + match[1].length;
  return {
    chunkEnd: end,
    chunkStart: start,
    name,
    nameEnd: nameStart + name.length,
    nameStart,
    order,
    text: segment
  };
}
function firstOutOfOrderNamedArgument(args) {
  for (let index2 = 0; index2 < args.length; index2 += 1) {
    const laterMinimumOrder = Math.min(...args.slice(index2 + 1).map((arg) => arg.order));
    if (Number.isFinite(laterMinimumOrder) && args[index2].order > laterMinimumOrder) {
      return args[index2];
    }
  }
  return args[0] ?? null;
}
function sortedArgumentListReplacement(source, start, end, args, sorted) {
  const original = source.slice(start, end);
  if (!original.includes("\n")) {
    return sorted.map((arg) => arg.text.trim().replace(/,\s*$/, "")).join(", ");
  }
  const firstArgWhitespace = /^\s*/.exec(args[0]?.text ?? "")?.[0] ?? "";
  const firstArgIndent = firstArgWhitespace.split(/\r?\n/).at(-1) ?? firstArgWhitespace;
  const closingIndent = /\n([ \t]*)$/.exec(original)?.[1] ?? "";
  const sortedLines = sorted.map((arg) => `${firstArgIndent}${arg.text.trim().replace(/,\s*$/, "")},`);
  return `
${sortedLines.join("\n")}
${closingIndent}`;
}
function constructorParameterNames(fqcn, index2, workspaceRoot2, visited) {
  if (visited.has(fqcn)) {
    return null;
  }
  visited.add(fqcn);
  const sourceFile = sourceFileForClass(fqcn, index2, workspaceRoot2);
  if (!sourceFile) {
    return null;
  }
  const classInfo = phpClassLikeInfosForFile(sourceFile).find((candidate) => candidate.fqcn === fqcn);
  if (!classInfo) {
    return null;
  }
  const ownConstructor = classInfo.methods.get("__construct");
  if (ownConstructor) {
    return ownConstructor;
  }
  for (const traitName of classInfo.traits) {
    const traitConstructor = constructorParameterNames(traitName, index2, workspaceRoot2, visited);
    if (traitConstructor) {
      return traitConstructor;
    }
  }
  return classInfo.extendsName ? constructorParameterNames(classInfo.extendsName, index2, workspaceRoot2, visited) : null;
}
function sourceFileForClass(fqcn, index2, workspaceRoot2) {
  const indexed = index2.phpClasses.find((phpClass) => phpClass.fqcn === fqcn)?.filePath;
  if (indexed && (0, import_node_fs3.existsSync)(indexed)) {
    return indexed;
  }
  if (!workspaceRoot2) {
    return null;
  }
  return composerAutoloadFileForClass(workspaceRoot2, fqcn);
}
function composerAutoloadFileForClass(workspaceRoot2, fqcn) {
  const autoload = composerAutoloadInfo(workspaceRoot2);
  const classMapPath = autoload.classMap.get(fqcn);
  if (classMapPath && (0, import_node_fs3.existsSync)(classMapPath)) {
    return classMapPath;
  }
  for (const entry of autoload.prefixes) {
    if (!fqcn.startsWith(entry.prefix)) {
      continue;
    }
    const relativeClassPath = `${fqcn.slice(entry.prefix.length).replace(/\\/g, import_node_path5.default.sep)}.php`;
    for (const basePath of entry.paths) {
      const candidate = import_node_path5.default.join(basePath, relativeClassPath);
      if ((0, import_node_fs3.existsSync)(candidate)) {
        return candidate;
      }
    }
  }
  return null;
}
function composerAutoloadInfo(workspaceRoot2) {
  const cached = composerAutoloadCache.get(workspaceRoot2);
  if (cached) {
    return cached;
  }
  const info = { classMap: /* @__PURE__ */ new Map(), prefixes: [] };
  const vendorDir = import_node_path5.default.join(workspaceRoot2, "vendor");
  const baseDir = workspaceRoot2;
  const resolveComposerPath = (baseName, suffix) => {
    const base = baseName === "vendorDir" ? vendorDir : baseDir;
    return import_node_path5.default.normalize(import_node_path5.default.join(base, suffix));
  };
  const psr4Path = import_node_path5.default.join(vendorDir, "composer", "autoload_psr4.php");
  if ((0, import_node_fs3.existsSync)(psr4Path)) {
    const source = (0, import_node_fs3.readFileSync)(psr4Path, "utf8");
    for (const match of source.matchAll(/'((?:\\\\|[^'])*)'\s*=>\s*array\s*\(([\s\S]*?)\),/g)) {
      const prefix = phpSingleQuotedStringValue(match[1]);
      const paths = [...match[2].matchAll(/\$(vendorDir|baseDir)\s*\.\s*'([^']+)'/g)].map(
        (pathMatch) => resolveComposerPath(pathMatch[1], phpSingleQuotedStringValue(pathMatch[2]))
      );
      if (paths.length > 0) {
        info.prefixes.push({ paths, prefix });
      }
    }
  }
  const classMapPath = import_node_path5.default.join(vendorDir, "composer", "autoload_classmap.php");
  if ((0, import_node_fs3.existsSync)(classMapPath)) {
    const source = (0, import_node_fs3.readFileSync)(classMapPath, "utf8");
    for (const match of source.matchAll(/'((?:\\\\|[^'])*)'\s*=>\s*\$(vendorDir|baseDir)\s*\.\s*'([^']+)'/g)) {
      info.classMap.set(
        phpSingleQuotedStringValue(match[1]),
        resolveComposerPath(match[2], phpSingleQuotedStringValue(match[3]))
      );
    }
  }
  info.prefixes.sort((left, right) => right.prefix.length - left.prefix.length);
  composerAutoloadCache.set(workspaceRoot2, info);
  return info;
}
function phpSingleQuotedStringValue(value) {
  return value.replace(/\\\\/g, "\\").replace(/\\'/g, "'");
}
function phpClassLikeInfosForFile(filePath) {
  const cached = phpClassLikeCache.get(filePath);
  if (cached) {
    return cached;
  }
  const source = (0, import_node_fs3.readFileSync)(filePath, "utf8");
  const sanitized = maskPhpStringsAndComments(source);
  const namespace = /\bnamespace\s+([^;{\s]+)/.exec(sanitized)?.[1] ?? null;
  const infos = [];
  const declarationPattern = /\b(?:(?:abstract|final|readonly)\s+)*(class|interface|trait|enum)\s+([A-Za-z_][A-Za-z0-9_]*)\b([^{;]*)/g;
  for (const match of sanitized.matchAll(declarationPattern)) {
    const kind = match[1];
    const name = match[2];
    if (name === "extends" || name === "implements") {
      continue;
    }
    const fqcn = namespace ? `${namespace}\\${name}` : name;
    const openBrace = sanitized.indexOf("{", (match.index ?? 0) + match[0].length);
    const closeBrace = openBrace >= 0 ? matchingBracket(sanitized, openBrace, "{", "}") : -1;
    const bodyStart = openBrace >= 0 ? openBrace + 1 : (match.index ?? 0) + match[0].length;
    const bodyEnd = closeBrace >= 0 ? closeBrace : source.length;
    const body = source.slice(bodyStart, bodyEnd);
    const bodySanitized = sanitized.slice(bodyStart, bodyEnd);
    const header = source.slice(0, match.index ?? 0);
    infos.push({
      extendsName: kind === "trait" ? null : classExtendsName(header, match[3] ?? ""),
      fqcn,
      methods: methodsInClassBody(body, bodySanitized),
      traits: kind === "trait" ? [] : traitsInClassBody(header, bodySanitized)
    });
  }
  phpClassLikeCache.set(filePath, infos);
  return infos;
}
function classExtendsName(source, clause) {
  const match = /\bextends\s+(\\?[A-Za-z_][A-Za-z0-9_\\]*)/.exec(clause);
  return match ? resolvePhpClassReference(source, match[1]) : null;
}
function traitsInClassBody(source, bodySanitized) {
  const traits = /* @__PURE__ */ new Set();
  for (const match of bodySanitized.matchAll(/(?:^|[;{}\n])\s*use\s+([A-Za-z_\\][A-Za-z0-9_\\]*(?:\s*,\s*[A-Za-z_\\][A-Za-z0-9_\\]*)*)\s*(?:;|\{)/g)) {
    for (const name of match[1].split(",")) {
      traits.add(resolvePhpClassReference(source, name.trim()));
    }
  }
  return [...traits];
}
function methodsInClassBody(body, bodySanitized) {
  const methods = /* @__PURE__ */ new Map();
  for (const match of bodySanitized.matchAll(/\bfunction\s+&?([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const openParen = (match.index ?? 0) + match[0].length - 1;
    const closeParen = matchingBracket(bodySanitized, openParen, "(", ")");
    if (closeParen < 0) {
      continue;
    }
    methods.set(match[1], parameterNamesFromSignature(body.slice(openParen + 1, closeParen)));
  }
  return methods;
}
function parameterNamesFromSignature(signature) {
  return splitTopLevelCommaRanges(maskPhpStringsAndComments(signature), 0, signature.length).map(([start, end]) => /\$([A-Za-z_][A-Za-z0-9_]*)/.exec(signature.slice(start, end))?.[1]).filter((name) => Boolean(name));
}
function splitTopLevelCommaRanges(sanitized, start, end) {
  const ranges = [];
  let segmentStart = start;
  let depth = 0;
  for (let index2 = start; index2 <= end; index2 += 1) {
    const char = sanitized[index2] ?? ",";
    if (char === "(" || char === "[" || char === "{") {
      depth += 1;
    } else if (char === ")" || char === "]" || char === "}") {
      depth = Math.max(0, depth - 1);
    }
    if (char === "," && depth === 0 || index2 === end) {
      ranges.push([segmentStart, index2]);
      segmentStart = index2 + 1;
    }
  }
  return ranges;
}
function maskPhpStringsAndComments(source) {
  let result = "";
  let index2 = 0;
  while (index2 < source.length) {
    const char = source[index2];
    const next = source[index2 + 1];
    if (char === "'" || char === '"') {
      const quote = char;
      result += " ";
      index2 += 1;
      while (index2 < source.length) {
        const current = source[index2];
        result += current === "\n" ? "\n" : " ";
        index2 += 1;
        if (current === quote && source[index2 - 2] !== "\\") {
          break;
        }
      }
      continue;
    }
    if (char === "/" && next === "/") {
      result += "  ";
      index2 += 2;
      while (index2 < source.length && source[index2] !== "\n") {
        result += " ";
        index2 += 1;
      }
      continue;
    }
    if (char === "#") {
      if (next === "[") {
        result += char;
        index2 += 1;
        continue;
      }
      result += " ";
      index2 += 1;
      while (index2 < source.length && source[index2] !== "\n") {
        result += " ";
        index2 += 1;
      }
      continue;
    }
    if (char === "/" && next === "*") {
      result += "  ";
      index2 += 2;
      while (index2 < source.length) {
        const current = source[index2];
        const following = source[index2 + 1];
        result += current === "\n" ? "\n" : " ";
        index2 += 1;
        if (current === "*" && following === "/") {
          result += " ";
          index2 += 1;
          break;
        }
      }
      continue;
    }
    result += char;
    index2 += 1;
  }
  return result;
}
function matchingBracket(source, openIndex, open, close) {
  let depth = 0;
  for (let index2 = openIndex; index2 < source.length; index2 += 1) {
    const char = source[index2];
    if (char === open) {
      depth += 1;
    } else if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return index2;
      }
    }
  }
  return -1;
}
function rangeForOffsets(source, start, end) {
  return {
    end: sourcePositionForOffset4(source, end),
    start: sourcePositionForOffset4(source, start)
  };
}
function sourcePositionForOffset4(source, offset) {
  const prefix = source.slice(0, offset);
  const lines = prefix.split(/\r?\n/);
  return {
    character: lines.at(-1)?.length ?? 0,
    line: lines.length - 1
  };
}
function isMiddlewareStringPrefix(prefix) {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}

// src/definitions.ts
var import_node5 = __toESM(require_node3(), 1);
var import_node_fs4 = require("node:fs");
var import_node_path6 = __toESM(require("node:path"), 1);
var import_node_url5 = require("node:url");
function definitionsForDocument(document, position, index2) {
  const includePath = includePathContextAtPosition(document, position);
  if (includePath) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(includePath.filePath).toString(), startRange())];
  }
  const componentProp = componentPropContextAtPosition(document, position);
  if (componentProp) {
    return index2.bladeComponents.filter((candidate) => candidate.name === componentProp.componentName && candidate.props.includes(componentProp.prop)).map((candidate) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(candidate.filePath).toString(), startRange()));
  }
  const component = componentContextAtPosition(document, position);
  if (component) {
    return index2.bladeComponents.filter((candidate) => candidate.name === component.value).map((candidate) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(candidate.filePath).toString(), startRange()));
  }
  const livewireComponent = livewireComponentTagContextAtPosition(document, position);
  if (livewireComponent) {
    return index2.livewireComponents.filter((candidate) => candidate.name === livewireComponent.value).map((candidate) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(candidate.filePath).toString(), startRange()));
  }
  const provider = serviceProviderContextAtPosition(document, position, index2);
  if (provider?.classFilePath) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(provider.classFilePath).toString(), startRange())];
  }
  const controllerStringTargets = routeControllerStringTargetsAtPosition(document, position, index2);
  if (controllerStringTargets) {
    return controllerStringTargets;
  }
  const controllerAction = routeControllerActionContextAtPosition(document, position, index2);
  if (controllerAction) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(controllerAction.controller.filePath).toString(), controllerActionRange(controllerAction.controller, controllerAction.action))];
  }
  const controller = routeControllerClassContextAtPosition(document, position, index2);
  if (controller) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(controller.filePath).toString(), startRange())];
  }
  const facade = facadeStaticCallContextAtPosition(document, position, index2);
  if (facade) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(facade.filePath).toString(), startRange())];
  }
  const containerConcrete = containerConcreteClassContextAtPosition(document, position, index2);
  if (containerConcrete) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(containerConcrete.filePath).toString(), startRange())];
  }
  const artifact = artifactClassContextAtPosition(document, position, index2);
  if (artifact) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(artifact.filePath).toString(), startRange())];
  }
  const macroMethod = macroMethodContextAtPosition(document, position, index2);
  if (macroMethod) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(macroMethod.filePath).toString(), startRange())];
  }
  const seeder = seederClassContextAtPosition(document, position, index2);
  if (seeder) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(seeder.filePath).toString(), startRange())];
  }
  const factoryState = factoryStateContextAtPosition(document, position, index2);
  if (factoryState) {
    return [import_node5.Location.create((0, import_node_url5.pathToFileURL)(factoryState.filePath).toString(), startRange())];
  }
  const phpunitMockMethod = phpunitMockMethodContextAtPosition(document, position, index2);
  if (phpunitMockMethod) {
    return [
      import_node5.Location.create((0, import_node_url5.pathToFileURL)(phpunitMockMethod.filePath).toString(), {
        end: phpunitMockMethod.method.range.end,
        start: phpunitMockMethod.method.range.start
      })
    ];
  }
  const applicationMethod = applicationMethodContextAtPosition(document, position);
  if (applicationMethod) {
    return [
      import_node5.Location.create(
        (0, import_node_url5.pathToFileURL)(applicationMethod.filePath).toString(),
        applicationMethod.range ? { end: applicationMethod.range.end, start: applicationMethod.range.start } : startRange()
      )
    ];
  }
  const containerMember = containerResolvedMemberContextAtPosition(document, position, index2);
  if (containerMember) {
    return [
      import_node5.Location.create(
        (0, import_node_url5.pathToFileURL)(containerMember.filePath).toString(),
        containerMember.range ? { end: containerMember.range.end, start: containerMember.range.start } : startRange()
      )
    ];
  }
  const eloquentMethod = eloquentMethodContextAtPosition(document, position, index2);
  if (eloquentMethod) {
    return [
      import_node5.Location.create(
        (0, import_node_url5.pathToFileURL)(eloquentMethod.filePath).toString(),
        eloquentMethod.range ? { end: eloquentMethod.range.end, start: eloquentMethod.range.start } : startRange()
      )
    ];
  }
  const modelProperty = modelPropertyContextAtPosition(document, position, index2);
  if (modelProperty) {
    return [
      import_node5.Location.create(
        (0, import_node_url5.pathToFileURL)(modelProperty.filePath).toString(),
        modelProperty.range ? { end: modelProperty.range.end, start: modelProperty.range.start } : startRange()
      )
    ];
  }
  const instanceMember = instanceMemberContextAtPosition(document, position, index2);
  if (instanceMember) {
    return [
      import_node5.Location.create(
        (0, import_node_url5.pathToFileURL)(instanceMember.filePath).toString(),
        instanceMember.range ? { end: instanceMember.range.end, start: instanceMember.range.start } : startRange()
      )
    ];
  }
  const context = stringContextAtPosition(document, position, index2);
  if (!context) {
    return [];
  }
  if (context.kind === "route") {
    return index2.routes.filter((route) => route.name === context.value).map(
      (route) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(route.filePath).toString(), {
        end: route.range.end,
        start: route.range.start
      })
    );
  }
  if (context.kind === "routeParameter") {
    return index2.routes.filter((route) => route.name === context.model && routeParameters4(route).includes(context.value)).map(
      (route) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(route.filePath).toString(), {
        end: route.range.end,
        start: route.range.start
      })
    );
  }
  if (context.kind === "view") {
    return index2.bladeViews.filter((view) => view.name === context.value).map((view) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(view.filePath).toString(), startRange()));
  }
  if (context.kind === "inertiaPage") {
    return index2.inertiaPages.filter((page) => page.name === context.value).map((page) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(page.filePath).toString(), startRange()));
  }
  if (context.kind === "livewireComponent") {
    return index2.livewireComponents.filter((component2) => component2.name === context.value).map((component2) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(component2.filePath).toString(), startRange()));
  }
  if (context.kind === "livewireBinding") {
    const component2 = livewireComponentForDocument2(document, index2);
    return component2 && (component2.methods.includes(context.value) || component2.properties.includes(context.value)) ? [import_node5.Location.create((0, import_node_url5.pathToFileURL)(component2.filePath).toString(), startRange())] : [];
  }
  if (context.kind === "bladeSection") {
    return index2.bladeViews.filter((view) => view.name === context.model && view.yields.includes(context.value)).map((view) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(view.filePath).toString(), startRange()));
  }
  if (context.kind === "bladeStack") {
    return index2.bladeViews.filter((view) => view.name === context.model && (view.stacks ?? []).includes(context.value)).map((view) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(view.filePath).toString(), startRange()));
  }
  if (context.kind === "translation") {
    return index2.translationKeys.filter((translation) => translation.key === context.value).map((translation) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(translation.filePath).toString(), startRange()));
  }
  if (context.kind === "config") {
    return index2.configEntries.filter((entry) => entry.key === context.value).map((entry) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(entry.filePath).toString(), {
      end: entry.range.end,
      start: entry.range.start
    }));
  }
  if (context.kind === "env") {
    return index2.envEntries.filter((entry) => entry.key === context.value).map((entry) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(entry.filePath).toString(), {
      end: entry.range.end,
      start: entry.range.start
    }));
  }
  if (context.kind === "authorization") {
    return index2.authorization.filter((entry) => entry.ability === context.value).map((entry) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(entry.filePath).toString(), startRange()));
  }
  if (context.kind === "container") {
    return index2.containerBindings.filter((binding) => binding.abstract === context.value).map((binding) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(binding.filePath).toString(), startRange()));
  }
  if (context.kind === "command") {
    return index2.commands.filter((command) => command.name === context.value).map((command) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(command.filePath).toString(), startRange()));
  }
  if (context.kind === "middleware") {
    const alias = context.value.split(":")[0];
    return index2.middleware.filter((middleware) => middleware.alias === alias).map(
      (middleware) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(middleware.filePath).toString(), {
        end: middleware.range.end,
        start: middleware.range.start
      })
    );
  }
  if (context.kind === "relation") {
    return index2.models.filter((model) => model.className === context.model || `${model.namespace}\\${model.className}` === context.model).filter((model) => model.relations.some((relation) => relation.name === context.value)).map((model) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(model.filePath).toString(), startRange()));
  }
  if (context.kind === "modelAttribute") {
    return modelAttributeLocations(context, index2);
  }
  if (context.kind === "schemaTable") {
    return schemaTableLocations(context.value, index2);
  }
  if (context.kind === "schemaColumn") {
    return schemaColumnLocations(context, index2);
  }
  if (context.kind === "validationField") {
    return validationFieldLocations(document, context.value, index2);
  }
  return [];
}
function componentContextAtPosition(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const start = (match.index ?? 0) + 3;
    const end = start + rawName.length;
    if (position.character >= start && position.character <= end) {
      return { value: rawName.replace(/:/g, ".") };
    }
  }
  return null;
}
function livewireComponentTagContextAtPosition(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const match of line.matchAll(/<livewire:([A-Za-z0-9_.-]+)/g)) {
    const name = match[1];
    const start = (match.index ?? 0) + "<livewire:".length;
    const end = start + name.length;
    if (position.character >= start && position.character <= end) {
      return { value: name };
    }
  }
  return null;
}
function livewireComponentForDocument2(document, index2) {
  const documentPath = documentPathFromUri3(document.uri);
  const match = documentPath ? /[/\\]resources[/\\]views[/\\]livewire[/\\](.+)\.blade\.php$/.exec(documentPath) : null;
  if (!match) {
    return null;
  }
  const name = match[1].split(/[/\\]/).join(".");
  return index2.livewireComponents.find((component) => component.name === name) ?? null;
}
function componentPropContextAtPosition(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const componentName = rawName.replace(/:/g, ".");
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    for (const attribute of tag[2].matchAll(/\s:?(?!:)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const prop = attribute[1];
      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(prop);
      const end = start + prop.length;
      if (position.character >= start && position.character <= end) {
        return { componentName, prop };
      }
    }
  }
  return null;
}
function seederClassContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isSeederCallPrefix2(line.slice(0, reference.start))) {
    return null;
  }
  const seeder = index2.seeders.find((candidate) => seederMatches(candidate, resolvePhpClassReference(document.getText(), reference.value)));
  return seeder ? { filePath: seeder.filePath } : null;
}
function macroMethodContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const className = macroStaticCallClass2(line.slice(0, token.start));
  if (!className) {
    return null;
  }
  const macro = index2.macros.find(
    (candidate) => candidate.method === token.value && classNameMatches(candidate.className, resolvePhpClassReference(document.getText(), className))
  );
  return macro ? { filePath: macro.filePath } : null;
}
function serviceProviderContextAtPosition(document, position, index2) {
  const documentPath = documentPathFromUri3(document.uri);
  if (!documentPath || !isProviderRegistrationFile3(documentPath)) {
    return null;
  }
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isProviderRegistrationPrefix2(line.slice(0, reference.start))) {
    return null;
  }
  return index2.providers.find(
    (provider) => serviceProviderMatches(provider, resolvePhpClassReference(document.getText(), reference.value))
  ) ?? null;
}
function routeControllerClassContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition(line, position.character);
  if (!reference || !isRouteControllerClassPrefix2(line.slice(0, reference.start))) {
    return null;
  }
  return index2.controllers.find(
    (controller) => controllerMatches2(controller, resolvePhpClassReference(document.getText(), reference.value))
  ) ?? null;
}
function routeControllerStringTargetsAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const source = document.getText();
  const quoteOffset = document.offsetAt({ line: position.line, character: token.start - 1 });
  if (!isRouteActionStringAtOffset(source, quoteOffset)) {
    return null;
  }
  const [classReference, action] = token.value.split("@");
  const controllers = index2.controllers.filter(
    (controller) => controllerReferenceMatches(controller, classReference)
  );
  if (controllers.length === 0) {
    return null;
  }
  if (!token.value.includes("@")) {
    return controllers.map(
      (controller) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(controller.filePath).toString(), controllerActionRange(controller, "__invoke"))
    );
  }
  const cursorInAction = Boolean(action) && position.character > token.start + classReference.length;
  if (cursorInAction) {
    const withAction = controllers.filter((controller) => controller.actions.includes(action));
    const targets = withAction.length > 0 ? withAction : controllers;
    return targets.map(
      (controller) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(controller.filePath).toString(), controllerActionRange(controller, action))
    );
  }
  return controllers.map(
    (controller) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(controller.filePath).toString(), startRange())
  );
}
function isRouteActionStringAtOffset(source, quoteOffset) {
  const prefix = source.slice(0, quoteOffset);
  if (/['"](?:uses|controller)['"]\s*=>\s*$/.test(prefix)) {
    return true;
  }
  const structure = maskPhpStringsAndComments2(prefix);
  const calls = [...structure.matchAll(/(?:\bRoute::|\$router->)(get|post|put|patch|delete|options|any|match|fallback)\s*\(/g)];
  for (let index2 = calls.length - 1; index2 >= 0; index2 -= 1) {
    const call = calls[index2];
    const callOffset = call.index ?? 0;
    const openParenOffset = callOffset + call[0].lastIndexOf("(");
    const argument = routeArgumentBeforeString(structure, openParenOffset);
    const expectedArgument = call[1] === "fallback" ? 0 : call[1] === "match" ? 2 : 1;
    if (argument === expectedArgument) {
      return true;
    }
  }
  return false;
}
function routeArgumentBeforeString(structure, openParenOffset) {
  let argument = 0;
  let depth = 0;
  let hasArgumentCode = false;
  for (let index2 = openParenOffset + 1; index2 < structure.length; index2 += 1) {
    const char = structure[index2];
    if (char === "(" || char === "[" || char === "{") {
      depth += 1;
      hasArgumentCode = true;
      continue;
    }
    if (char === ")" || char === "]" || char === "}") {
      if (depth === 0) {
        return null;
      }
      depth -= 1;
      hasArgumentCode = true;
      continue;
    }
    if (char === ";" && depth === 0) {
      return null;
    }
    if (char === "," && depth === 0) {
      argument += 1;
      hasArgumentCode = false;
      continue;
    }
    if (!/\s/.test(char)) {
      hasArgumentCode = true;
    }
  }
  return depth === 0 && !hasArgumentCode ? argument : null;
}
function maskPhpStringsAndComments2(source) {
  return source.replace(
    /'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*"|\/\/[^\r\n]*|#[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/g,
    (match) => match.replace(/[^\r\n]/g, " ")
  );
}
function controllerReferenceMatches(controller, reference) {
  const normalized = reference.replace(/\\\\/g, "\\").replace(/^\\+/, "");
  if (!normalized) {
    return false;
  }
  const fullClassName = controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className;
  return fullClassName === normalized || fullClassName.endsWith(`\\${normalized}`);
}
function routeControllerActionContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = line.slice(0, token.start - 1);
  const controllerName2 = routeControllerActionClass3(prefix) ?? routeControllerGroupActionClass3(document, position.line, prefix);
  const resolvedControllerName = controllerName2 ? resolvePhpClassReference(document.getText(), controllerName2) : null;
  const controller = resolvedControllerName ? index2.controllers.find((candidate) => controllerMatches2(candidate, resolvedControllerName)) : null;
  return controller?.actions.includes(token.value) ? { action: token.value, controller } : null;
}
function artifactClassContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference) {
    return null;
  }
  const kinds = artifactKindsForReference(line, reference);
  if (!kinds) {
    return null;
  }
  const artifact = index2.artifacts.find(
    (candidate) => kinds.includes(candidate.kind) && artifactMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return artifact ? { filePath: artifact.filePath } : null;
}
function facadeStaticCallContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference || !line.slice(reference.start + reference.value.length).startsWith("::")) {
    return null;
  }
  const facade = index2.facades.find(
    (candidate) => facadeMatches(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return facade ? { filePath: facade.filePath } : null;
}
function containerConcreteClassContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition(line, position.character);
  if (!reference || !isPhpParameterTypeHint2(line, reference)) {
    return null;
  }
  const resolvedReference = resolvePhpClassReference(document.getText(), reference.value);
  const binding = index2.containerBindings.find(
    (candidate) => containerAbstractMatchesClass(candidate.abstract, resolvedReference)
  );
  if (!binding?.concrete) {
    return null;
  }
  return indexedClassTarget2(binding.concrete, index2);
}
function includePathContextAtPosition(document, position) {
  const documentPath = documentPathFromUri3(document.uri);
  if (!documentPath) {
    return null;
  }
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const stringRange of quotedStringRanges2(line)) {
    if (position.character < stringRange.start || position.character > stringRange.end) {
      continue;
    }
    const expression = phpIncludeExpressionForString(line, stringRange.start - 1);
    if (!expression) {
      continue;
    }
    const filePath = resolveStaticPhpPathExpression(expression, documentPath);
    if (filePath && (0, import_node_fs4.existsSync)(filePath)) {
      return { filePath };
    }
  }
  return null;
}
function stringContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const stringRange of quotedStringRanges2(line)) {
    if (position.character < stringRange.start || position.character > stringRange.end) {
      continue;
    }
    const prefix = line.slice(0, stringRange.start - 1);
    const value = line.slice(stringRange.start, stringRange.end);
    const relationModel = eloquentRelationModel2(prefix);
    if (relationModel) {
      return { kind: "relation", model: relationModel, value };
    }
    const tableName = modelAttributeTableAtPosition(document, position, index2);
    if (tableName) {
      return { kind: "modelAttribute", tableName, value };
    }
    const validationSchemaContext = validationSchemaContextForPrefix2(prefix, value);
    if (validationSchemaContext) {
      return validationSchemaContext;
    }
    const bladeSectionLayout = bladeSectionLayoutForDocument3(document, prefix, index2);
    if (bladeSectionLayout) {
      return { kind: "bladeSection", model: bladeSectionLayout.name, value };
    }
    const bladeStackLayout = bladeStackLayoutForDocument3(document, prefix, index2);
    if (bladeStackLayout) {
      return { kind: "bladeStack", model: bladeStackLayout.name, value };
    }
    const routeParameterRouteName = routeParameterContextRouteName2(prefix);
    if (routeParameterRouteName) {
      return { kind: "routeParameter", model: routeParameterRouteName, value };
    }
    if (/\bwire:[a-zA-Z0-9.-]+\s*=\s*$/.test(prefix)) {
      return { kind: "livewireBinding", value };
    }
    const kind = definitionKindForPrefix(prefix);
    return kind ? { kind, value } : null;
  }
  return null;
}
function phpunitMockMethodContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  return phpunitMockMethodTargetAtOffset(
    document.getText(),
    document.offsetAt({ line: position.line, character: token.start }),
    token.value,
    index2
  );
}
function eloquentMethodContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  const modelName = eloquentScopeModel2(line.slice(0, token.start));
  if (!modelName) {
    const frameworkMethod2 = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index2, token.value);
    return frameworkMethod2 ? { filePath: frameworkMethod2.filePath, ...frameworkMethod2.range ? { range: frameworkMethod2.range } : {} } : null;
  }
  const resolvedModelName = resolvePhpClassReference(document.getText(), modelName);
  const model = index2.models.find(
    (candidate) => candidate.className === resolvedModelName || `${candidate.namespace}\\${candidate.className}` === resolvedModelName
  );
  if (!model) {
    return null;
  }
  if (model.scopes.includes(token.value)) {
    const traitScope = model.scopeDetails?.find((detail) => detail.name === token.value);
    if (traitScope) {
      return { filePath: traitScope.filePath };
    }
    const scopeMethod = model.methodDetails?.find(
      (method) => method.name === token.value || method.name === `scope${token.value[0].toUpperCase()}${token.value.slice(1)}`
    );
    return { filePath: model.filePath, ...scopeMethod ? { range: scopeMethod.range } : {} };
  }
  if (model.staticMethods?.includes(token.value)) {
    const staticMethod = model.methodDetails?.find((method) => method.name === token.value);
    return { filePath: model.filePath, ...staticMethod ? { range: staticMethod.range } : {} };
  }
  const builderMethod = model.customBuilder?.methods.find((method) => method.name === token.value);
  if (builderMethod && model.customBuilder?.filePath) {
    return { filePath: model.customBuilder.filePath };
  }
  const frameworkMethod = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index2, token.value);
  return frameworkMethod ? { filePath: frameworkMethod.filePath, ...frameworkMethod.range ? { range: frameworkMethod.range } : {} } : null;
}
function applicationMethodContextAtPosition(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  if (!/\bapp\s*\(\s*\)\s*(?:->|\?->)\s*$/.test(line.slice(0, token.start))) {
    return null;
  }
  const documentPath = documentPathFromUri3(document.uri);
  const rootPath = documentPath ? projectRootForDocumentPath(documentPath) : null;
  if (!rootPath) {
    return null;
  }
  const filePath = import_node_path6.default.join(rootPath, "vendor", "laravel", "framework", "src", "Illuminate", "Foundation", "Application.php");
  const range2 = methodRangeInFile2(filePath, token.value);
  if (range2) {
    return { filePath, range: range2 };
  }
  return knownApplicationMethods().has(token.value) ? { filePath } : null;
}
function containerResolvedMemberContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const linePrefix = line.slice(0, token.start + token.value.length);
  const documentPrefix = document.getText().slice(
    0,
    document.offsetAt({ line: position.line, character: token.start })
  );
  const classReference = containerResolvedMemberClass(documentPrefix, linePrefix, index2);
  if (!classReference) {
    return null;
  }
  for (const phpClass of containerResolvedPhpClasses(classReference, index2)) {
    const method = phpClass.methods?.find((candidate) => candidate.name === token.value);
    if (method) {
      return { filePath: phpClass.filePath, range: method.range };
    }
  }
  return null;
}
function instanceMemberContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  return instanceMemberTargetForPrefix(document.getText(), prefix, index2, token.value);
}
function modelPropertyContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const beforeToken = line.slice(0, token.start);
  if (!/(\?->|->)\s*$/.test(beforeToken)) {
    return null;
  }
  const model = modelForPropertyAccess(document, position, token.start, index2);
  return model ? modelPropertyTarget(model, token.value, index2) : null;
}
function modelForPropertyAccess(document, position, tokenStart, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const beforeToken = line.slice(0, tokenStart);
  const chain = propertyAccessChainBeforeToken(beforeToken);
  if (!chain) {
    return null;
  }
  if (chain.root === "$this") {
    const documentPath = documentPathFromUri3(document.uri);
    const model2 = documentPath ? index2.models.find((candidate) => candidate.filePath === documentPath) ?? null : null;
    return model2 ? resolvePropertyChainModel(model2, chain.properties, document.getText(), index2) : null;
  }
  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: tokenStart }));
  const rootPrefix = prefix.slice(0, prefix.lastIndexOf(chain.properties[0] ?? ""));
  const inferredModel = instanceModelForPrefix(document.getText(), rootPrefix, index2);
  if (inferredModel) {
    return resolvePropertyChainModel(inferredModel, chain.properties, document.getText(), index2);
  }
  const className = chain.root.startsWith("$") ? modelClassForVariable2(document.getText(), chain.root) : null;
  const resolved = className ? resolvePhpClassReference(document.getText(), className) : null;
  const model = resolved ? index2.models.find((candidate) => candidate.className === resolved || `${candidate.namespace}\\${candidate.className}` === resolved) ?? null : null;
  return model ? resolvePropertyChainModel(model, chain.properties, document.getText(), index2) : null;
}
function propertyAccessChainBeforeToken(prefix) {
  const match = /(\$this|\$[A-Za-z_][A-Za-z0-9_]*)((?:\s*(?:\?->|->)\s*[A-Za-z_][A-Za-z0-9_]*)*)\s*(?:\?->|->)\s*$/.exec(prefix);
  if (!match) {
    return null;
  }
  const root = match[1];
  const properties = [...match[2].matchAll(/(?:\?->|->)\s*([A-Za-z_][A-Za-z0-9_]*)/g)].map((property) => property[1]);
  return { properties, root };
}
function resolvePropertyChainModel(model, properties, documentText, index2) {
  let current = model;
  for (const property of properties) {
    const relation = current?.relations.find((candidate) => candidate.name === property);
    if (!relation?.relatedModel) {
      return null;
    }
    const resolved = resolvePhpClassReference(documentText, relation.relatedModel);
    current = index2.models.find((candidate) => candidate.className === resolved || `${candidate.namespace}\\${candidate.className}` === resolved) ?? null;
    if (!current) {
      return null;
    }
  }
  return current;
}
function modelPropertyTarget(model, property, index2) {
  const accessor = model.accessorDetails?.find((candidate) => candidate.name === property);
  if (accessor) {
    return { filePath: model.filePath, ...accessor.range ? { range: accessor.range } : {} };
  }
  const cast = model.castDetails?.find((candidate) => candidate.name === property);
  const resolvedCast = cast ? resolveCastType(cast, index2) : null;
  if (resolvedCast?.castClass) {
    return { filePath: resolvedCast.castClass.filePath, range: resolvedCast.castClass.nameRange };
  }
  const table = index2.schemaTables.find((candidate) => candidate.name === model.tableName);
  const column = table?.columns.find((candidate) => candidate.name === property);
  if (column) {
    return { filePath: column.filePath };
  }
  const relation = model.relations.find((candidate) => candidate.name === property || `${candidate.name}_count` === property);
  if (relation) {
    const method = model.methodDetails?.find((candidate) => candidate.name === relation.name);
    return { filePath: model.filePath, ...method ? { range: method.range } : {} };
  }
  if (model.appends?.includes(property)) {
    return { filePath: model.filePath };
  }
  return model.fillable.includes(property) || model.guarded.includes(property) || model.casts.includes(property) ? { filePath: model.filePath } : null;
}
function modelClassForVariable2(source, variable) {
  const escapedName = variable.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const assignment = new RegExp(
    `\\$${escapedName}\\s*=\\s*(?:new\\s+)?([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s*(?:::|\\()`
  ).exec(source);
  if (assignment) {
    return assignment[1];
  }
  return new RegExp(`([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s+\\$${escapedName}\\b`).exec(source)?.[1] ?? null;
}
function factoryStateContextAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  const modelName = factoryStateModel2(line.slice(0, token.start));
  if (!modelName) {
    return null;
  }
  const factory = index2.factories.find(
    (candidate) => candidate.states.includes(token.value) && (candidate.model === modelName || candidate.model?.split("\\").at(-1) === modelName)
  );
  return factory ? { filePath: factory.filePath } : null;
}
function tokenAtPosition(line, character) {
  for (const match of line.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function classConstantContextAtPosition(line, character) {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function classReferenceAtPosition(line, character) {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)\b/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function quotedStringAtPosition(line, character) {
  for (const range2 of quotedStringRanges2(line)) {
    if (character >= range2.start && character <= range2.end) {
      return {
        ...range2,
        value: line.slice(range2.start, range2.end)
      };
    }
  }
  return null;
}
function artifactKindsForReference(line, reference) {
  const before = line.slice(0, reference.start);
  const after = line.slice(reference.start + reference.value.length);
  if (/\bevent\s*\(\s*new\s+$/.test(before)) {
    return ["event"];
  }
  if (/\bdispatch\s*\(\s*new\s+$/.test(before) || /^::dispatch\s*\(/.test(after)) {
    return ["event", "job"];
  }
  if (/->(?:send|queue|later)\s*\(\s*new\s+$/.test(before)) {
    return ["mailable", "notification"];
  }
  if (/\bnew\s+$/.test(before)) {
    return ["event", "job", "listener", "mailable", "notification", "resource"];
  }
  return null;
}
function isSeederCallPrefix2(prefix) {
  return /(?:\$this|static|self)->(?:call|callSilent|callOnce)\s*\(\s*(?:\[\s*)?(?:[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*)*$/.test(prefix);
}
function isProviderRegistrationPrefix2(prefix) {
  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)(?:\s*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,?)*\s*$/.test(prefix);
}
function isRouteControllerClassPrefix2(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*$/.test(prefix) || /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*$/.test(prefix);
}
function routeControllerActionClass3(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*$/.exec(prefix)?.[1] ?? null;
}
function routeControllerGroupActionClass3(document, lineNumber, prefix) {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*$/.test(prefix)) {
    return null;
  }
  return activeRouteControllerGroupClass3(document.getText().split(/\r?\n/).slice(0, lineNumber));
}
function activeRouteControllerGroupClass3(lines) {
  const stack = [];
  let braceDepth = 0;
  for (const line of lines) {
    const controller = routeControllerGroupController3(line);
    const nextBraceDepth = braceDepth + braceDelta4(line);
    if (controller) {
      stack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        controller
      });
    }
    braceDepth = nextBraceDepth;
    while (stack.length > 0 && braceDepth < stack[stack.length - 1].closeDepth) {
      stack.pop();
    }
  }
  return stack.at(-1)?.controller ?? null;
}
function routeControllerGroupController3(line) {
  return /Route::controller\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)[^;]*->group\s*\(/.exec(line)?.[1] ?? null;
}
function braceDelta4(line) {
  return [...line].reduce((delta, char) => delta + (char === "{" ? 1 : char === "}" ? -1 : 0), 0);
}
function isProviderRegistrationFile3(filePath) {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}
function bladeSectionLayoutForDocument3(document, prefix, index2) {
  if (!/@section\s*\(\s*$/.test(prefix)) {
    return null;
  }
  const view = bladeViewForDocument2(document, index2);
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}
function bladeStackLayoutForDocument3(document, prefix, index2) {
  if (!/@(?:push|prepend)\s*\(\s*$/.test(prefix)) {
    return null;
  }
  const view = bladeViewForDocument2(document, index2);
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}
function bladeViewForDocument2(document, index2) {
  const documentPath = documentPathFromUri3(document.uri);
  return documentPath ? index2.bladeViews.find((view) => view.filePath === documentPath) ?? null : null;
}
function routeParameterContextRouteName2(prefix) {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(prefix);
  if (!match) {
    return null;
  }
  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (/=>/.test(currentEntry)) {
    return null;
  }
  return match[2];
}
function routeParameters4(route) {
  if (!route?.uri) {
    return [];
  }
  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}
function seederMatches(seeder, value) {
  return seeder.className === value || seeder.className === value.split("\\").at(-1) || (seeder.namespace ? `${seeder.namespace}\\${seeder.className}` === value : false);
}
function eloquentRelationModel2(prefix) {
  const relationMethods = "(with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  return new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? null;
}
function eloquentScopeModel2(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[^;\n]*->$/.exec(prefix)?.[1] ?? null;
}
function factoryStateModel2(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->$/.exec(prefix)?.[1] ?? null;
}
function macroStaticCallClass2(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? null;
}
function classNameMatches(indexedClassName, value) {
  return indexedClassName === value || indexedClassName.split("\\").at(-1) === value || value.split("\\").at(-1) === indexedClassName;
}
function containerAbstractMatchesClass(abstract, value) {
  if (!isClassLikeReference3(abstract)) {
    return false;
  }
  return classReferenceMatches4(abstract, value);
}
function indexedClassTarget2(classReference, index2) {
  const candidates = [
    ...index2.models,
    ...index2.controllers,
    ...index2.artifacts,
    ...index2.livewireComponents
  ];
  return candidates.find(
    (candidate) => classReferenceMatches4(indexedClassReference2(candidate), classReference)
  ) ?? null;
}
function indexedClassReference2(candidate) {
  return candidate.namespace ? `${candidate.namespace}\\${candidate.className}` : candidate.className;
}
function classReferenceMatches4(indexedReference, value) {
  const indexed = normalizeClassReference5(indexedReference);
  const compared = normalizeClassReference5(value);
  return indexed === compared || indexed.split("\\").at(-1) === compared || compared.split("\\").at(-1) === indexed;
}
function normalizeClassReference5(value) {
  return value.replace(/\\\\/g, "\\").replace(/^\\+/, "");
}
function knownApplicationMethods() {
  return /* @__PURE__ */ new Set(["getFallbackLocale", "getLocale", "setLocale"]);
}
function isClassLikeReference3(value) {
  return /^[A-Z_\\][A-Za-z0-9_\\]*$/.test(value);
}
function isPhpParameterTypeHint2(line, reference) {
  const prefix = line.slice(0, reference.start);
  const suffix = line.slice(reference.start + reference.value.length);
  return /(?:^|[(,|&])\s*(?:(?:public|protected|private|readonly|static)\s+)*\??\s*$/.test(prefix) && /^\s+\$[A-Za-z_][A-Za-z0-9_]*/.test(suffix);
}
function artifactMatches(artifact, value) {
  return artifact.className === value || artifact.className === value.split("\\").at(-1) || (artifact.namespace ? `${artifact.namespace}\\${artifact.className}` === value : false);
}
function facadeMatches(facade, value) {
  return facade.className === value || facade.className === value.split("\\").at(-1) || (facade.namespace ? `${facade.namespace}\\${facade.className}` === value : false);
}
function serviceProviderMatches(provider, value) {
  return provider.className === value || provider.className === value.split("\\").at(-1) || (provider.namespace ? `${provider.namespace}\\${provider.className}` === value : false);
}
function controllerMatches2(controller, value) {
  return controller.className === value || controller.className === value.split("\\").at(-1) || (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}
function controllerActionRange(controller, action) {
  return controller.actionDetails?.find((candidate) => candidate.name === action)?.range ?? startRange();
}
function modelAttributeTableAtPosition(document, position, index2) {
  const documentPath = documentPathFromUri3(document.uri);
  if (!documentPath) {
    return null;
  }
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position
  });
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[[\s\S]*$/;
  const match = propertyStart.exec(beforeCursor);
  if (!match || /\]\s*;\s*$/.test(match[0])) {
    return null;
  }
  return index2.models.find((model) => model.filePath === documentPath)?.tableName ?? null;
}
function modelAttributeLocations(context, index2) {
  const table = index2.schemaTables.find((candidate) => candidate.name === context.tableName);
  const column = table?.columns.find((candidate) => candidate.name === context.value);
  return column ? [import_node5.Location.create((0, import_node_url5.pathToFileURL)(column.filePath).toString(), startRange())] : [];
}
function schemaTableLocations(tableName, index2) {
  const table = index2.schemaTables.find((candidate) => candidate.name === tableName);
  return table ? [import_node5.Location.create((0, import_node_url5.pathToFileURL)(table.filePath).toString(), startRange())] : [];
}
function schemaColumnLocations(context, index2) {
  const table = index2.schemaTables.find((candidate) => candidate.name === context.tableName);
  const column = table?.columns.find((candidate) => candidate.name === context.value);
  return column ? [import_node5.Location.create((0, import_node_url5.pathToFileURL)(column.filePath).toString(), startRange())] : [];
}
function validationFieldLocations(document, field, index2) {
  return validationRuleSetsForDocument(document, index2).filter((ruleSet) => ruleSet.fields.some((candidate) => candidate.field === field)).map((ruleSet) => import_node5.Location.create((0, import_node_url5.pathToFileURL)(ruleSet.filePath).toString(), startRange()));
}
function validationRuleSetsForDocument(document, index2) {
  const documentPath = documentPathFromUri3(document.uri);
  const requestClass = formRequestClassForDocument3(document.getText());
  const ruleSets = index2.validationRules.filter(
    (ruleSet) => documentPath && ruleSet.filePath === documentPath || requestClass && ruleSet.className === requestClass
  );
  const seen = /* @__PURE__ */ new Set();
  return ruleSets.filter((ruleSet) => {
    const key = `${ruleSet.filePath}:${ruleSet.className ?? ""}:${ruleSet.source}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function formRequestClassForDocument3(source) {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}
function documentPathFromUri3(uri) {
  try {
    return (0, import_node_url5.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function projectRootForDocumentPath(filePath) {
  for (const marker of [
    `${import_node_path6.default.sep}app${import_node_path6.default.sep}`,
    `${import_node_path6.default.sep}routes${import_node_path6.default.sep}`,
    `${import_node_path6.default.sep}config${import_node_path6.default.sep}`,
    `${import_node_path6.default.sep}database${import_node_path6.default.sep}`,
    `${import_node_path6.default.sep}resources${import_node_path6.default.sep}`
  ]) {
    const markerIndex = filePath.lastIndexOf(marker);
    if (markerIndex >= 0) {
      return filePath.slice(0, markerIndex) || import_node_path6.default.sep;
    }
  }
  return null;
}
function phpIncludeExpressionForString(line, quoteStart) {
  const prefix = line.slice(0, quoteStart);
  const includePattern = /(?<!@)\b(?:require_once|require|include_once|include)\b/g;
  let includeMatch = null;
  for (const match of prefix.matchAll(includePattern)) {
    includeMatch = match;
  }
  if (!includeMatch || includeMatch.index === void 0) {
    return null;
  }
  const expressionStart = includeMatch.index + includeMatch[0].length;
  if (/[;\n]/.test(prefix.slice(expressionStart))) {
    return null;
  }
  const expressionEnd = line.indexOf(";", quoteStart);
  return line.slice(expressionStart, expressionEnd >= 0 ? expressionEnd : line.length).trim();
}
function resolveStaticPhpPathExpression(expression, documentPath) {
  const documentDir = import_node_path6.default.dirname(documentPath);
  const parts = [];
  let index2 = 0;
  while (index2 < expression.length) {
    const char = expression[index2];
    if (/\s/.test(char) || char === "." || char === "(" || char === ")") {
      index2 += 1;
      continue;
    }
    const stringToken = phpQuotedStringAt(expression, index2);
    if (stringToken) {
      parts.push(stringToken.value);
      index2 = stringToken.end;
      continue;
    }
    if (expression.startsWith("__DIR__", index2)) {
      parts.push(documentDir);
      index2 += "__DIR__".length;
      continue;
    }
    const dirnameCall = dirnameCallAt(expression, index2, documentPath);
    if (dirnameCall) {
      parts.push(dirnameCall.value);
      index2 = dirnameCall.end;
      continue;
    }
    return null;
  }
  if (parts.length === 0) {
    return null;
  }
  const combined = parts.join("");
  return import_node_path6.default.normalize(import_node_path6.default.isAbsolute(combined) ? combined : import_node_path6.default.join(documentDir, combined));
}
function phpQuotedStringAt(source, start) {
  const quote = source[start];
  if (quote !== "'" && quote !== '"') {
    return null;
  }
  let value = "";
  let index2 = start + 1;
  while (index2 < source.length) {
    const char = source[index2];
    if (char === "\\") {
      const next = source[index2 + 1];
      if (next === quote || next === "\\") {
        value += next;
        index2 += 2;
        continue;
      }
    }
    if (char === quote) {
      return { end: index2 + 1, value };
    }
    value += char;
    index2 += 1;
  }
  return null;
}
function dirnameCallAt(source, start, documentPath) {
  const match = /^dirname\s*\(\s*(__DIR__|__FILE__)\s*(?:,\s*([1-9][0-9]*)\s*)?\)/.exec(source.slice(start));
  if (!match) {
    return null;
  }
  let value = match[1] === "__FILE__" ? documentPath : import_node_path6.default.dirname(documentPath);
  const levels = Number(match[2] ?? "1");
  for (let level = 0; level < levels; level += 1) {
    value = import_node_path6.default.dirname(value);
  }
  return { end: start + match[0].length, value };
}
function methodRangeInFile2(filePath, method) {
  if (!(0, import_node_fs4.existsSync)(filePath)) {
    return null;
  }
  try {
    const source = (0, import_node_fs4.readFileSync)(filePath, "utf8");
    const match = new RegExp(`\\bfunction\\s+&?${escapeRegExp4(method)}\\s*\\(`).exec(source);
    if (!match) {
      return null;
    }
    const nameOffset = match.index + match[0].indexOf(method);
    return sourceRangeForOffset4(source, nameOffset, method.length);
  } catch {
    return null;
  }
}
function sourceRangeForOffset4(source, offset, length) {
  const start = sourcePositionForOffset5(source, offset);
  const end = sourcePositionForOffset5(source, offset + length);
  return { end, start };
}
function sourcePositionForOffset5(source, offset) {
  const lines = source.slice(0, offset).split(/\r?\n/);
  return {
    character: lines.at(-1)?.length ?? 0,
    line: lines.length - 1
  };
}
function escapeRegExp4(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function definitionKindForPrefix(prefix) {
  if (isRouteNamePrefix2(prefix)) {
    return "route";
  }
  if (/\bview\s*\(\s*$/.test(prefix) || /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)) {
    return "view";
  }
  if (/\bInertia::render\s*\(\s*$/.test(prefix) || /(?<!::)\binertia\s*\(\s*$/.test(prefix) || /\bRoute::inertia\s*\(\s*['"][^'"]*['"]\s*,\s*$/.test(prefix)) {
    return "inertiaPage";
  }
  if (/@livewire\s*\(\s*$/.test(prefix)) {
    return "livewireComponent";
  }
  if (/(__|trans|trans_choice)\s*\(\s*$/.test(prefix) || /@(lang|choice)\s*\(\s*$/.test(prefix)) {
    return "translation";
  }
  if (/\bconfig\s*\(\s*$/.test(prefix)) {
    return "config";
  }
  if (/\benv\s*\(\s*$/.test(prefix)) {
    return "env";
  }
  if (/->(can|cannot|authorize)\s*\(\s*$/.test(prefix) || /Gate::(allows|denies|authorize|check|any|none)\s*\(\s*$/.test(prefix) || /@(can|cannot|canany)\s*\(\s*$/.test(prefix)) {
    return "authorization";
  }
  if (isContainerBindingStringOpeningPrefix(prefix)) {
    return "container";
  }
  if (/\bArtisan::(?:call|queue)\s*\(\s*$/.test(prefix) || /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*$/.test(prefix) || /\bSchedule::command\s*\(\s*$/.test(prefix) || /->command\s*\(\s*$/.test(prefix)) {
    return "command";
  }
  if (isMiddlewareStringPrefix2(prefix)) {
    return "middleware";
  }
  if (/->(validated|input)\s*\(\s*$/.test(prefix) || /->safe\(\)->(only|except)\s*\(\s*\[\s*$/.test(prefix) || /->(only|except)\s*\(\s*\[\s*$/.test(prefix)) {
    return "validationField";
  }
  return null;
}
var DB_COLUMN_ARGUMENT_METHODS = "(?:where|orWhere|whereIn|orWhereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereDate|whereNot|firstWhere|orderBy|orderByDesc|latest|oldest|value|pluck|select|addSelect|groupBy|min|max|sum|avg)";
function validationSchemaContextForPrefix2(prefix, value) {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*$/.exec(prefix);
  if (columnMatch) {
    return { kind: "schemaColumn", tableName: columnMatch[1], value };
  }
  const dbColumnMatch = new RegExp(
    `\\bDB::(?:connection\\([^)]*\\)\\s*->\\s*)?table\\(\\s*['"]([A-Za-z0-9_]+)['"]\\s*\\)[^;\\n]*->\\s*${DB_COLUMN_ARGUMENT_METHODS}\\s*\\(\\s*(?:\\[\\s*)?$`
  ).exec(prefix);
  if (dbColumnMatch) {
    return { kind: "schemaColumn", tableName: dbColumnMatch[1], value };
  }
  if (/\bRule::(?:exists|unique)\(\s*$/.test(prefix) || /\bDB::(?:connection\([^)]*\)\s*->\s*)?table\(\s*$/.test(prefix)) {
    return { kind: "schemaTable", value };
  }
  return null;
}
function isRouteNamePrefix2(prefix) {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) || /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) || /->routeIs\s*\(\s*$/.test(prefix);
}
function quotedStringRanges2(line) {
  const ranges = [];
  for (let index2 = 0; index2 < line.length; index2 += 1) {
    const quote = line[index2];
    if (quote !== "'" && quote !== '"') {
      continue;
    }
    const start = index2 + 1;
    index2 += 1;
    while (index2 < line.length) {
      if (line[index2] === "\\") {
        index2 += 2;
        continue;
      }
      if (line[index2] === quote) {
        ranges.push({ end: index2, start });
        break;
      }
      index2 += 1;
    }
  }
  return ranges;
}
function startRange() {
  return {
    end: { character: 0, line: 0 },
    start: { character: 0, line: 0 }
  };
}
function isMiddlewareStringPrefix2(prefix) {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}

// src/hovers.ts
var import_node6 = __toESM(require_node3(), 1);
var import_node_url6 = require("node:url");
function hoverForDocument(document, position, index2) {
  const componentPropContext = componentPropContextAtPosition2(document, position);
  if (componentPropContext) {
    const component = index2.bladeComponents.find(
      (candidate) => candidate.name === componentPropContext.componentName && candidate.props.includes(componentPropContext.prop)
    );
    if (!component) {
      return null;
    }
    return markdownHover([
      `**Blade component prop** \`${component.name}.${componentPropContext.prop}\``,
      `- Component: \`${component.name}\``,
      `- File: \`${component.filePath}\``
    ]);
  }
  const componentContext = componentContextAtPosition2(document, position);
  if (componentContext) {
    const component = index2.bladeComponents.find((candidate) => candidate.name === componentContext.value);
    if (!component) {
      return null;
    }
    return markdownHover([
      `**Blade ${component.source} component** \`${component.name}\``,
      component.props.length > 0 ? `- Props: \`${component.props.join(", ")}\`` : "",
      `- View: \`${component.viewName}\``,
      `- File: \`${component.filePath}\``
    ]);
  }
  const livewireContext = livewireComponentTagContextAtPosition2(document, position);
  if (livewireContext) {
    const component = index2.livewireComponents.find((candidate) => candidate.name === livewireContext.value);
    if (!component) {
      return null;
    }
    return markdownHover([
      `**Livewire component** \`${component.name}\``,
      `- Class: \`${component.namespace ? `${component.namespace}\\` : ""}${component.className}\``,
      component.properties.length > 0 ? `- Properties: \`${component.properties.join(", ")}\`` : "",
      component.methods.length > 0 ? `- Actions: \`${component.methods.join(", ")}\`` : "",
      `- File: \`${component.filePath}\``
    ]);
  }
  const providerContext = serviceProviderContextAtPosition2(document, position, index2);
  if (providerContext) {
    return markdownHover([
      `**Laravel service provider** \`${serviceProviderName(providerContext)}\``,
      `- Source: \`${providerContext.source}\``,
      providerContext.classFilePath ? `- Class file: \`${providerContext.classFilePath}\`` : "",
      `- Registered in: \`${providerContext.filePath}\``
    ]);
  }
  const controllerAction = routeControllerActionContextAtPosition2(document, position, index2);
  if (controllerAction) {
    return markdownHover([
      `**Laravel controller action** \`${controllerAction.controller.className}@${controllerAction.action}\``,
      `- File: \`${controllerAction.controller.filePath}\``
    ]);
  }
  const controller = routeControllerClassContextAtPosition2(document, position, index2);
  if (controller) {
    return markdownHover([
      `**Laravel controller** \`${controllerName(controller)}\``,
      controller.actions.length > 0 ? `- Actions: \`${controller.actions.join(", ")}\`` : "",
      `- File: \`${controller.filePath}\``
    ]);
  }
  const facadeContext = facadeStaticCallContextAtPosition2(document, position, index2);
  if (facadeContext) {
    return markdownHover([
      `**Laravel facade** \`${facadeName(facadeContext.facade)}\``,
      facadeContext.facade.source ? `- Source: \`${facadeContext.facade.source}\`` : "",
      facadeContext.facade.target ? `- Target: \`${facadeContext.facade.target}\`` : "",
      facadeContext.facade.accessor ? `- Accessor: \`${facadeContext.facade.accessor}\`` : "",
      facadeContext.facade.binding ? `- Binding: \`${facadeContext.facade.binding.lifetime} ${facadeContext.facade.binding.abstract}\`` : "",
      facadeContext.facade.binding?.concrete ? `- Concrete: \`${facadeContext.facade.binding.concrete}\`` : "",
      facadeContext.facade.binding ? `- Binding file: \`${facadeContext.facade.binding.filePath}\`` : "",
      `- File: \`${facadeContext.facade.filePath}\``
    ]);
  }
  const artifactContext = artifactClassContextAtPosition2(document, position, index2);
  if (artifactContext) {
    return markdownHover([
      `**Laravel ${artifactContext.artifact.kind}** \`${artifactName(artifactContext.artifact)}\``,
      artifactContext.artifact.constructorSignature ? `- Constructor: \`__construct(${artifactContext.artifact.constructorSignature})\`` : "",
      artifactContext.artifact.related.length > 0 ? `- Related: \`${artifactContext.artifact.related.join(", ")}\`` : "",
      `- File: \`${artifactContext.artifact.filePath}\``
    ]);
  }
  const macroMethod = macroMethodContextAtPosition2(document, position, index2);
  if (macroMethod) {
    return markdownHover([
      `**Laravel macro** \`${macroMethod.macro.className}::${macroMethod.macro.method}\``,
      `- File: \`${macroMethod.macro.filePath}\``
    ]);
  }
  const seederContext = seederClassContextAtPosition2(document, position, index2);
  if (seederContext) {
    return markdownHover([
      `**Laravel seeder** \`${seederContext.seeder.className}\``,
      seederContext.seeder.calls.length > 0 ? `- Calls: \`${seederContext.seeder.calls.join(", ")}\`` : "",
      seederContext.seeder.namespace ? `- Namespace: \`${seederContext.seeder.namespace}\`` : "",
      `- File: \`${seederContext.seeder.filePath}\``
    ]);
  }
  const factoryState = factoryStateContextAtPosition2(document, position, index2);
  if (factoryState) {
    return markdownHover([
      `**Factory state** \`${factoryState.model}.${factoryState.state}\``,
      `- Factory: \`${factoryState.factory.className}\``,
      `- File: \`${factoryState.factory.filePath}\``
    ]);
  }
  const phpunitMockMethod = phpunitMockMethodContextAtPosition2(document, position, index2);
  if (phpunitMockMethod) {
    return markdownHover([
      `**PHPUnit mock method** \`${phpunitMockMethod.classFqcn}::${phpunitMockMethod.method.name}\``,
      `- Type: \`${phpunitMockMethod.kind}\``,
      `- File: \`${phpunitMockMethod.filePath}\``
    ]);
  }
  const modelProperty = modelPropertyContextAtPosition2(document, position, index2);
  if (modelProperty) {
    return markdownHover(modelPropertyHoverLines(modelProperty.model, modelProperty.property, index2));
  }
  const eloquentMethod = eloquentMethodContextAtPosition2(document, position, index2);
  if (eloquentMethod?.kind === "scope") {
    const traitScope = eloquentMethod.model.scopeDetails?.find((detail) => detail.name === eloquentMethod.scope);
    return markdownHover([
      `**Eloquent scope** \`${eloquentMethod.model.className}.${eloquentMethod.scope}\``,
      `- Table: \`${eloquentMethod.model.tableName}\``,
      `- File: \`${traitScope?.filePath ?? eloquentMethod.model.filePath}\``
    ]);
  }
  if (eloquentMethod?.kind === "builderMethod") {
    return markdownHover([
      `**Custom Eloquent builder method** \`${eloquentMethod.model.className}.${eloquentMethod.method.name}\``,
      `- Builder: \`${eloquentMethod.builder.className}\``,
      eloquentMethod.method.returnType ? `- Returns: \`${eloquentMethod.method.returnType}\`` : "",
      eloquentMethod.builder.filePath ? `- File: \`${eloquentMethod.builder.filePath}\`` : ""
    ]);
  }
  if (eloquentMethod?.kind === "framework") {
    return markdownHover([
      eloquentMethod.relation ? `**Laravel relation method** \`${eloquentMethod.className.split("\\").at(-1)}.${eloquentMethod.name}\`` : `**Eloquent builder method** \`${eloquentMethod.className.split("\\").at(-1)}.${eloquentMethod.name}\``,
      eloquentMethod.relation ? `- Relation: \`${eloquentMethod.model.className}.${eloquentMethod.relation.name}\`` : `- Model: \`${eloquentMethod.model.className}\``,
      `- File: \`${eloquentMethod.filePath}\``
    ]);
  }
  const instanceMember = instanceMemberHoverAtPosition(document, position, index2);
  if (instanceMember) {
    const relation = instanceMember.model.relations.find((candidate) => candidate.name === instanceMember.name);
    if (relation) {
      return markdownHover([
        `**Eloquent relation** \`${instanceMember.model.className}.${relation.name}\``,
        `- Type: \`${relation.type}\``,
        relation.relatedModel ? `- Related: \`${relation.relatedModel}\`` : "",
        `- File: \`${instanceMember.filePath}\``
      ]);
    }
    return markdownHover([
      instanceMember.kind === "framework" ? `**Laravel relation method** \`${instanceMember.className?.split("\\").at(-1) ?? "Relation"}.${instanceMember.name}\`` : instanceMember.kind === "scope" ? `**Eloquent scope** \`${instanceMember.model.className}.${instanceMember.name}\`` : `**Model method** \`${instanceMember.model.className}.${instanceMember.name}\``,
      instanceMember.relation ? `- Relation: \`${instanceMember.model.className}.${instanceMember.relation.name}\`` : "",
      `- File: \`${instanceMember.filePath}\``
    ]);
  }
  const context = stringContextAtPosition2(document, position, index2);
  if (!context) {
    return null;
  }
  if (context.kind === "route") {
    const route = index2.routes.find((candidate) => candidate.name === context.value);
    if (!route) {
      return null;
    }
    return markdownHover([
      `**Laravel route** \`${route.name}\``,
      route.methods.length > 0 ? `- Methods: \`${route.methods.join("|")}\`` : "",
      route.uri ? `- URI: \`${route.uri}\`` : "",
      route.action ? `- Action: \`${route.action}\`` : "",
      route.middleware.length > 0 ? `- Middleware: \`${route.middleware.join(", ")}\`` : "",
      `- File: \`${route.filePath}\``
    ]);
  }
  if (context.kind === "routeParameter") {
    const route = index2.routes.find((candidate) => candidate.name === context.model);
    if (!route || !routeParameters5(route).includes(context.value)) {
      return null;
    }
    return markdownHover([
      `**Route parameter** \`${context.model}.${context.value}\``,
      route.uri ? `- URI: \`${route.uri}\`` : "",
      `- File: \`${route.filePath}\``
    ]);
  }
  if (context.kind === "view") {
    const view = index2.bladeViews.find((candidate) => candidate.name === context.value);
    if (!view) {
      return null;
    }
    return markdownHover([
      `**Laravel view** \`${view.name}\``,
      view.extends ? `- Extends: \`${view.extends}\`` : "",
      view.sections.length > 0 ? `- Sections: \`${view.sections.join(", ")}\`` : "",
      `- File: \`${view.filePath}\``
    ]);
  }
  if (context.kind === "bladeSection") {
    const layout = index2.bladeViews.find((candidate) => candidate.name === context.model);
    if (!layout || !layout.yields.includes(context.value)) {
      return null;
    }
    return markdownHover([
      `**Blade section** \`${context.value}\``,
      `- Layout: \`${layout.name}\``,
      `- File: \`${layout.filePath}\``
    ]);
  }
  if (context.kind === "bladeStack") {
    const layout = index2.bladeViews.find((candidate) => candidate.name === context.model);
    if (!layout || !(layout.stacks ?? []).includes(context.value)) {
      return null;
    }
    return markdownHover([
      `**Blade stack** \`${context.value}\``,
      `- Layout: \`${layout.name}\``,
      `- File: \`${layout.filePath}\``
    ]);
  }
  if (context.kind === "config") {
    const entry = index2.configEntries.find((candidate) => candidate.key === context.value);
    if (!entry && !index2.configKeys.includes(context.value)) {
      return null;
    }
    return markdownHover([
      `**Laravel config** \`${context.value}\``,
      entry ? `- File: \`${entry.filePath}\`` : ""
    ]);
  }
  if (context.kind === "env") {
    const entry = index2.envEntries.find((candidate) => candidate.key === context.value);
    if (!entry && !index2.envKeys.includes(context.value)) {
      return null;
    }
    return markdownHover([
      `**Environment key** \`${context.value}\``,
      entry ? `- File: \`${entry.filePath}\`` : ""
    ]);
  }
  if (context.kind === "translation") {
    const translation = index2.translationKeys.find((candidate) => candidate.key === context.value);
    if (!translation) {
      return null;
    }
    return markdownHover([
      `**Laravel translation** \`${translation.key}\``,
      `- Locale: \`${translation.locale}\``,
      `- Source: \`${translation.source}\``,
      `- File: \`${translation.filePath}\``
    ]);
  }
  if (context.kind === "authorization") {
    const entry = index2.authorization.find((candidate) => candidate.ability === context.value);
    if (!entry) {
      return null;
    }
    return markdownHover([
      `**Laravel ability** \`${entry.ability}\``,
      `- Source: \`${entry.source}\``,
      entry.policy ? `- Policy: \`${entry.policy}\`` : "",
      entry.model ? `- Model: \`${entry.model}\`` : "",
      `- File: \`${entry.filePath}\``
    ]);
  }
  if (context.kind === "container") {
    const binding = index2.containerBindings.find((candidate) => candidate.abstract === context.value);
    if (!binding) {
      return null;
    }
    return markdownHover([
      `**Container binding** \`${binding.abstract}\``,
      `- Lifetime: \`${binding.lifetime}\``,
      binding.concrete ? `- Concrete: \`${binding.concrete}\`` : "",
      `- File: \`${binding.filePath}\``
    ]);
  }
  if (context.kind === "command") {
    const command = index2.commands.find((candidate) => candidate.name === context.value);
    if (!command) {
      return null;
    }
    return markdownHover([
      `**Artisan command** \`${command.name}\``,
      `- Signature: \`${command.signature}\``,
      command.description ? `- Description: \`${command.description}\`` : "",
      command.className ? `- Class: \`${command.className}\`` : "",
      `- File: \`${command.filePath}\``
    ]);
  }
  if (context.kind === "middleware") {
    const middleware = index2.middleware.find((candidate) => candidate.alias === context.value.split(":")[0]);
    if (!middleware) {
      return null;
    }
    return markdownHover([
      `**Laravel middleware** \`${middleware.alias}\``,
      `- Source: \`${middleware.source}\``,
      middleware.className ? `- Class: \`${middleware.className}\`` : "",
      `- File: \`${middleware.filePath}\``
    ]);
  }
  if (context.kind === "relation") {
    const model = index2.models.find(
      (candidate) => candidate.className === context.model || `${candidate.namespace}\\${candidate.className}` === context.model
    );
    const relation = model?.relations.find((candidate) => candidate.name === context.value);
    if (!model || !relation) {
      return null;
    }
    return markdownHover([
      `**Eloquent relation** \`${model.className}.${relation.name}\``,
      `- Type: \`${relation.type}\``,
      relation.relatedModel ? `- Related: \`${relation.relatedModel}\`` : "",
      `- Table: \`${model.tableName}\``,
      `- File: \`${model.filePath}\``
    ]);
  }
  if (context.kind === "modelAttribute") {
    const table = index2.schemaTables.find((candidate) => candidate.name === context.tableName);
    const column = table?.columns.find((candidate) => candidate.name === context.value);
    if (!column) {
      return null;
    }
    return markdownHover([
      `**Eloquent attribute** \`${context.tableName}.${column.name}\``,
      `- Type: \`${column.type}\``,
      column.modifiers.length > 0 ? `- Modifiers: \`${column.modifiers.join(", ")}\`` : "",
      `- File: \`${column.filePath}\``
    ]);
  }
  if (context.kind === "schemaTable") {
    const table = index2.schemaTables.find((candidate) => candidate.name === context.value);
    if (!table) {
      return null;
    }
    return markdownHover([
      `**Schema table** \`${table.name}\``,
      table.columns.length > 0 ? `- Columns: \`${table.columns.map((column) => column.name).join(", ")}\`` : "",
      `- File: \`${table.filePath}\``
    ]);
  }
  if (context.kind === "schemaColumn") {
    const table = index2.schemaTables.find((candidate) => candidate.name === context.tableName);
    const column = table?.columns.find((candidate) => candidate.name === context.value);
    if (!column) {
      return null;
    }
    return markdownHover([
      `**Schema column** \`${context.tableName}.${column.name}\``,
      `- Type: \`${column.type}\``,
      column.modifiers.length > 0 ? `- Modifiers: \`${column.modifiers.join(", ")}\`` : "",
      `- File: \`${column.filePath}\``
    ]);
  }
  if (context.kind === "validationField") {
    const field = validationFieldForDocument(document, context.value, index2);
    if (!field) {
      return null;
    }
    return markdownHover([
      `**Validated request field** \`${field.field}\``,
      field.rules.length > 0 ? `- Rules: \`${field.rules.join("|")}\`` : "",
      field.filePaths.length > 0 ? `- File: \`${field.filePaths.join(", ")}\`` : ""
    ]);
  }
  return null;
}
function seederClassContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition2(line, position.character);
  if (!reference || !isSeederCallPrefix3(line.slice(0, reference.start))) {
    return null;
  }
  const seeder = index2.seeders.find((candidate) => seederMatches2(candidate, resolvePhpClassReference(document.getText(), reference.value)));
  return seeder ? { seeder } : null;
}
function macroMethodContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition2(line, position.character);
  if (!token) {
    return null;
  }
  const className = macroStaticCallClass3(line.slice(0, token.start));
  if (!className) {
    return null;
  }
  const macro = index2.macros.find(
    (candidate) => candidate.method === token.value && classNameMatches2(candidate.className, resolvePhpClassReference(document.getText(), className))
  );
  return macro ? { macro } : null;
}
function serviceProviderContextAtPosition2(document, position, index2) {
  const documentPath = documentPathFromUri4(document.uri);
  if (!documentPath || !isProviderRegistrationFile4(documentPath)) {
    return null;
  }
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition2(line, position.character);
  if (!reference || !isProviderRegistrationPrefix3(line.slice(0, reference.start))) {
    return null;
  }
  return index2.providers.find(
    (provider) => serviceProviderMatches2(provider, resolvePhpClassReference(document.getText(), reference.value))
  ) ?? null;
}
function routeControllerClassContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition2(line, position.character);
  if (!reference || !isRouteControllerClassPrefix3(line.slice(0, reference.start))) {
    return null;
  }
  return index2.controllers.find(
    (controller) => controllerMatches3(controller, resolvePhpClassReference(document.getText(), reference.value))
  ) ?? null;
}
function routeControllerActionContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition2(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = line.slice(0, token.start - 1);
  const controllerName2 = routeControllerActionClass4(prefix) ?? routeControllerGroupActionClass4(document, position.line, prefix);
  const resolvedControllerName = controllerName2 ? resolvePhpClassReference(document.getText(), controllerName2) : null;
  const controller = resolvedControllerName ? index2.controllers.find((candidate) => controllerMatches3(candidate, resolvedControllerName)) : null;
  return controller?.actions.includes(token.value) ? { action: token.value, controller } : null;
}
function artifactClassContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition2(line, position.character);
  if (!reference) {
    return null;
  }
  const kinds = artifactKindsForReference2(line, reference);
  if (!kinds) {
    return null;
  }
  const artifact = index2.artifacts.find(
    (candidate) => kinds.includes(candidate.kind) && artifactMatches2(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return artifact ? { artifact } : null;
}
function facadeStaticCallContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition2(line, position.character);
  if (!reference || !line.slice(reference.start + reference.value.length).startsWith("::")) {
    return null;
  }
  const facade = index2.facades.find(
    (candidate) => facadeMatches2(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return facade ? { facade } : null;
}
function livewireComponentTagContextAtPosition2(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const match of line.matchAll(/<livewire:([A-Za-z0-9_.-]+)/g)) {
    const name = match[1];
    const start = (match.index ?? 0) + "<livewire:".length;
    const end = start + name.length;
    if (position.character >= start && position.character <= end) {
      return { value: name };
    }
  }
  return null;
}
function componentContextAtPosition2(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const start = (match.index ?? 0) + 3;
    const end = start + rawName.length;
    if (position.character >= start && position.character <= end) {
      return { value: rawName.replace(/:/g, ".") };
    }
  }
  return null;
}
function componentPropContextAtPosition2(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const componentName = rawName.replace(/:/g, ".");
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    for (const attribute of tag[2].matchAll(/\s:?(?!:)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const prop = attribute[1];
      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(prop);
      const end = start + prop.length;
      if (position.character >= start && position.character <= end) {
        return { componentName, prop };
      }
    }
  }
  return null;
}
function stringContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const stringRange of quotedStringRanges3(line)) {
    if (position.character < stringRange.start || position.character > stringRange.end) {
      continue;
    }
    const prefix = line.slice(0, stringRange.start - 1);
    const value = line.slice(stringRange.start, stringRange.end);
    const relationModel = eloquentRelationModel3(prefix);
    if (relationModel) {
      return { kind: "relation", model: relationModel, value };
    }
    const tableName = modelAttributeTableAtPosition2(document, position, index2);
    if (tableName) {
      return { kind: "modelAttribute", tableName, value };
    }
    const validationSchemaContext = validationSchemaContextForPrefix3(prefix, value);
    if (validationSchemaContext) {
      return validationSchemaContext;
    }
    const bladeSectionLayout = bladeSectionLayoutForDocument4(document, prefix, index2);
    if (bladeSectionLayout) {
      return { kind: "bladeSection", model: bladeSectionLayout.name, value };
    }
    const bladeStackLayout = bladeStackLayoutForDocument4(document, prefix, index2);
    if (bladeStackLayout) {
      return { kind: "bladeStack", model: bladeStackLayout.name, value };
    }
    const routeParameterRouteName = routeParameterContextRouteName3(prefix);
    if (routeParameterRouteName) {
      return { kind: "routeParameter", model: routeParameterRouteName, value };
    }
    const kind = hoverKindForPrefix(prefix);
    return kind ? { kind, value } : null;
  }
  return null;
}
function phpunitMockMethodContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition2(line, position.character);
  if (!token) {
    return null;
  }
  return phpunitMockMethodTargetAtOffset(
    document.getText(),
    document.offsetAt({ line: position.line, character: token.start }),
    token.value,
    index2
  );
}
function eloquentMethodContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition2(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  const modelName = eloquentScopeModel3(line.slice(0, token.start));
  if (!modelName) {
    const frameworkMethod2 = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index2, token.value);
    return frameworkMethod2?.className ? {
      className: frameworkMethod2.className,
      filePath: frameworkMethod2.filePath,
      kind: "framework",
      model: frameworkMethod2.model,
      name: frameworkMethod2.name,
      ...frameworkMethod2.relation ? { relation: frameworkMethod2.relation } : {}
    } : null;
  }
  const resolvedModelName = resolvePhpClassReference(document.getText(), modelName);
  const model = index2.models.find(
    (candidate) => candidate.className === resolvedModelName || `${candidate.namespace}\\${candidate.className}` === resolvedModelName
  );
  if (!model) {
    return null;
  }
  if (model.scopes.includes(token.value)) {
    return { kind: "scope", model, scope: token.value };
  }
  const builderMethod = model.customBuilder?.methods.find((method) => method.name === token.value);
  if (builderMethod && model.customBuilder) {
    return { builder: model.customBuilder, kind: "builderMethod", method: builderMethod, model };
  }
  const frameworkMethod = frameworkBuilderMethodTargetForPrefix(document.getText(), prefix, index2, token.value);
  return frameworkMethod?.className ? {
    className: frameworkMethod.className,
    filePath: frameworkMethod.filePath,
    kind: "framework",
    model: frameworkMethod.model,
    name: frameworkMethod.name
  } : null;
}
function instanceMemberHoverAtPosition(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition2(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = document.getText().slice(0, document.offsetAt({ line: position.line, character: token.start }));
  return instanceMemberTargetForPrefix(document.getText(), prefix, index2, token.value);
}
function factoryStateContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition2(line, position.character);
  if (!token) {
    return null;
  }
  const modelName = factoryStateModel3(line.slice(0, token.start));
  if (!modelName) {
    return null;
  }
  const factory = index2.factories.find(
    (candidate) => candidate.states.includes(token.value) && (candidate.model === modelName || candidate.model?.split("\\").at(-1) === modelName)
  );
  return factory ? { factory, model: modelName, state: token.value } : null;
}
function modelPropertyContextAtPosition2(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition2(line, position.character);
  if (!token || !line.slice(0, token.start).endsWith("->")) {
    return null;
  }
  const access2 = /(\$[A-Za-z_][A-Za-z0-9_]*)->$/.exec(line.slice(0, token.start));
  if (!access2) {
    return null;
  }
  let model = null;
  if (access2[1] === "$this") {
    const documentPath = documentPathFromUri4(document.uri);
    model = index2.models.find((candidate) => candidate.filePath === documentPath) ?? null;
  } else {
    const documentText = document.getText();
    const className = modelClassForVariable3(documentText, access2[1]);
    const resolved = className ? resolvePhpClassReference(documentText, className) : null;
    model = resolved ? index2.models.find(
      (candidate) => candidate.className === resolved || `${candidate.namespace}\\${candidate.className}` === resolved
    ) ?? null : null;
  }
  if (!model || !isKnownModelProperty(model, token.value, index2)) {
    return null;
  }
  return { model, property: token.value };
}
function modelClassForVariable3(source, variable) {
  const escapedName = variable.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const assignment = new RegExp(
    `\\$${escapedName}\\s*=\\s*(?:new\\s+)?([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s*(?:::|\\()`
  ).exec(source);
  if (assignment) {
    return assignment[1];
  }
  return new RegExp(`([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)\\s+\\$${escapedName}\\b`).exec(source)?.[1] ?? null;
}
function isKnownModelProperty(model, property, index2) {
  const table = index2.schemaTables.find((candidate) => candidate.name === model.tableName);
  return Boolean(
    table?.columns.some((column) => column.name === property) || model.accessors?.includes(property) || model.appends?.includes(property) || model.casts.includes(property) || model.relations.some((relation) => relation.name === property || `${relation.name}_count` === property)
  );
}
function modelPropertyHoverLines(model, property, index2) {
  if (model.accessors?.includes(property)) {
    const accessor = model.accessorDetails?.find((candidate) => candidate.name === property);
    return [
      `**Model accessor** \`${model.className}.${property}\``,
      accessor ? `- Source: \`${accessor.source === "attribute" ? "Attribute object" : "classic accessor"}\`` : "",
      accessor?.returnType ? `- Returns: \`${accessor.returnType}\`` : "",
      `- File: \`${model.filePath}\``
    ];
  }
  const table = index2.schemaTables.find((candidate) => candidate.name === model.tableName);
  const column = table?.columns.find((candidate) => candidate.name === property);
  const cast = model.castDetails?.find((candidate) => candidate.name === property);
  if (column || cast) {
    const resolvedCast = cast ? resolveCastType(cast, index2) : null;
    return [
      `**Model attribute** \`${model.className}.${property}\``,
      resolvedCast ? `- Type: \`${castTypeDisplay(resolvedCast, column)}\`` : "",
      column?.type ? `- Column type: \`${column.type}\`` : "",
      cast ? `- Cast: \`${cast.type}\`` : "",
      `- Table: \`${model.tableName}\``,
      column ? `- Migration: \`${column.filePath}\`` : `- File: \`${model.filePath}\``
    ];
  }
  const relation = model.relations.find((candidate) => candidate.name === property);
  if (relation) {
    return [
      `**Eloquent relation** \`${model.className}.${property}\``,
      `- Type: \`${relation.type}\``,
      relation.relatedModel ? `- Related: \`${relation.relatedModel}\`` : "",
      `- File: \`${model.filePath}\``
    ];
  }
  const countRelation = model.relations.find((candidate) => `${candidate.name}_count` === property);
  if (countRelation) {
    return [
      `**Relation count** \`${model.className}.${property}\``,
      `- Counts: \`${countRelation.name}\` (available via \`withCount\`)`,
      `- File: \`${model.filePath}\``
    ];
  }
  if (model.appends?.includes(property)) {
    return [
      `**Appended model attribute** \`${model.className}.${property}\``,
      "- Declared in: `$appends`",
      `- File: \`${model.filePath}\``
    ];
  }
  return [];
}
function tokenAtPosition2(line, character) {
  for (const match of line.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function classConstantContextAtPosition2(line, character) {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function classReferenceAtPosition2(line, character) {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)\b/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function quotedStringAtPosition2(line, character) {
  for (const range2 of quotedStringRanges3(line)) {
    if (character >= range2.start && character <= range2.end) {
      return {
        ...range2,
        value: line.slice(range2.start, range2.end)
      };
    }
  }
  return null;
}
function artifactKindsForReference2(line, reference) {
  const before = line.slice(0, reference.start);
  const after = line.slice(reference.start + reference.value.length);
  if (/\bevent\s*\(\s*new\s+$/.test(before)) {
    return ["event"];
  }
  if (/\bdispatch\s*\(\s*new\s+$/.test(before) || /^::dispatch\s*\(/.test(after)) {
    return ["event", "job"];
  }
  if (/->(?:send|queue|later)\s*\(\s*new\s+$/.test(before)) {
    return ["mailable", "notification"];
  }
  if (/\bnew\s+$/.test(before)) {
    return ["event", "job", "listener", "mailable", "notification", "resource"];
  }
  return null;
}
function isSeederCallPrefix3(prefix) {
  return /(?:\$this|static|self)->(?:call|callSilent|callOnce)\s*\(\s*(?:\[\s*)?(?:[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*)*$/.test(prefix);
}
function isProviderRegistrationPrefix3(prefix) {
  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)(?:\s*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,?)*\s*$/.test(prefix);
}
function isRouteControllerClassPrefix3(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*$/.test(prefix) || /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*$/.test(prefix);
}
function routeControllerActionClass4(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*$/.exec(prefix)?.[1] ?? null;
}
function routeControllerGroupActionClass4(document, lineNumber, prefix) {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*$/.test(prefix)) {
    return null;
  }
  return activeRouteControllerGroupClass4(document.getText().split(/\r?\n/).slice(0, lineNumber));
}
function activeRouteControllerGroupClass4(lines) {
  const stack = [];
  let braceDepth = 0;
  for (const line of lines) {
    const controller = routeControllerGroupController4(line);
    const nextBraceDepth = braceDepth + braceDelta5(line);
    if (controller) {
      stack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        controller
      });
    }
    braceDepth = nextBraceDepth;
    while (stack.length > 0 && braceDepth < stack[stack.length - 1].closeDepth) {
      stack.pop();
    }
  }
  return stack.at(-1)?.controller ?? null;
}
function routeControllerGroupController4(line) {
  return /Route::controller\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)[^;]*->group\s*\(/.exec(line)?.[1] ?? null;
}
function braceDelta5(line) {
  return [...line].reduce((delta, char) => delta + (char === "{" ? 1 : char === "}" ? -1 : 0), 0);
}
function isProviderRegistrationFile4(filePath) {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}
function bladeSectionLayoutForDocument4(document, prefix, index2) {
  if (!/@section\s*\(\s*$/.test(prefix)) {
    return null;
  }
  const view = bladeViewForDocument3(document, index2);
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}
function bladeStackLayoutForDocument4(document, prefix, index2) {
  if (!/@(?:push|prepend)\s*\(\s*$/.test(prefix)) {
    return null;
  }
  const view = bladeViewForDocument3(document, index2);
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}
function bladeViewForDocument3(document, index2) {
  const documentPath = documentPathFromUri4(document.uri);
  return documentPath ? index2.bladeViews.find((view) => view.filePath === documentPath) ?? null : null;
}
function routeParameterContextRouteName3(prefix) {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(prefix);
  if (!match) {
    return null;
  }
  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (/=>/.test(currentEntry)) {
    return null;
  }
  return match[2];
}
function routeParameters5(route) {
  if (!route?.uri) {
    return [];
  }
  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}
function seederMatches2(seeder, value) {
  return seeder.className === value || seeder.className === value.split("\\").at(-1) || (seeder.namespace ? `${seeder.namespace}\\${seeder.className}` === value : false);
}
function eloquentRelationModel3(prefix) {
  const relationMethods = "(with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  return new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? null;
}
function eloquentScopeModel3(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[^;\n]*->$/.exec(prefix)?.[1] ?? null;
}
function factoryStateModel3(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->$/.exec(prefix)?.[1] ?? null;
}
function macroStaticCallClass3(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? null;
}
function classNameMatches2(indexedClassName, value) {
  return indexedClassName === value || indexedClassName.split("\\").at(-1) === value || value.split("\\").at(-1) === indexedClassName;
}
function artifactMatches2(artifact, value) {
  return artifact.className === value || artifact.className === value.split("\\").at(-1) || (artifact.namespace ? `${artifact.namespace}\\${artifact.className}` === value : false);
}
function artifactName(artifact) {
  return artifact.namespace ? `${artifact.namespace}\\${artifact.className}` : artifact.className;
}
function facadeMatches2(facade, value) {
  return facade.className === value || facade.className === value.split("\\").at(-1) || (facade.namespace ? `${facade.namespace}\\${facade.className}` === value : false);
}
function facadeName(facade) {
  return facade.namespace ? `${facade.namespace}\\${facade.className}` : facade.className;
}
function serviceProviderMatches2(provider, value) {
  return provider.className === value || provider.className === value.split("\\").at(-1) || (provider.namespace ? `${provider.namespace}\\${provider.className}` === value : false);
}
function serviceProviderName(provider) {
  return provider.namespace ? `${provider.namespace}\\${provider.className}` : provider.className;
}
function controllerMatches3(controller, value) {
  return controller.className === value || controller.className === value.split("\\").at(-1) || (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}
function controllerName(controller) {
  return controller.namespace ? `${controller.namespace}\\${controller.className}` : controller.className;
}
function modelAttributeTableAtPosition2(document, position, index2) {
  const documentPath = documentPathFromUri4(document.uri);
  if (!documentPath) {
    return null;
  }
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position
  });
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[[\s\S]*$/;
  const match = propertyStart.exec(beforeCursor);
  if (!match || /\]\s*;\s*$/.test(match[0])) {
    return null;
  }
  return index2.models.find((model) => model.filePath === documentPath)?.tableName ?? null;
}
function documentPathFromUri4(uri) {
  try {
    return (0, import_node_url6.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function validationFieldForDocument(document, fieldName, index2) {
  const fields = validationRuleSetsForDocument2(document, index2).flatMap(
    (ruleSet) => ruleSet.fields.filter((field) => field.field === fieldName).map((field) => ({ ...field, filePath: ruleSet.filePath }))
  );
  if (fields.length === 0) {
    return null;
  }
  return {
    field: fieldName,
    filePaths: uniqueStrings3(fields.map((field) => field.filePath)),
    rules: uniqueStrings3(fields.flatMap((field) => field.rules))
  };
}
var DB_COLUMN_ARGUMENT_METHODS2 = "(?:where|orWhere|whereIn|orWhereIn|whereNotIn|whereNull|whereNotNull|whereBetween|whereDate|whereNot|firstWhere|orderBy|orderByDesc|latest|oldest|value|pluck|select|addSelect|groupBy|min|max|sum|avg)";
function validationSchemaContextForPrefix3(prefix, value) {
  const columnMatch = /\bRule::(?:exists|unique)\(\s*['"]([^'"]+)['"]\s*,\s*$/.exec(prefix);
  if (columnMatch) {
    return { kind: "schemaColumn", tableName: columnMatch[1], value };
  }
  const dbColumnMatch = new RegExp(
    `\\bDB::(?:connection\\([^)]*\\)\\s*->\\s*)?table\\(\\s*['"]([A-Za-z0-9_]+)['"]\\s*\\)[^;\\n]*->\\s*${DB_COLUMN_ARGUMENT_METHODS2}\\s*\\(\\s*(?:\\[\\s*)?$`
  ).exec(prefix);
  if (dbColumnMatch) {
    return { kind: "schemaColumn", tableName: dbColumnMatch[1], value };
  }
  if (/\bRule::(?:exists|unique)\(\s*$/.test(prefix) || /\bDB::(?:connection\([^)]*\)\s*->\s*)?table\(\s*$/.test(prefix)) {
    return { kind: "schemaTable", value };
  }
  return null;
}
function validationRuleSetsForDocument2(document, index2) {
  const documentPath = documentPathFromUri4(document.uri);
  const requestClass = formRequestClassForDocument4(document.getText());
  const ruleSets = index2.validationRules.filter(
    (ruleSet) => documentPath && ruleSet.filePath === documentPath || requestClass && ruleSet.className === requestClass
  );
  const seen = /* @__PURE__ */ new Set();
  return ruleSets.filter((ruleSet) => {
    const key = `${ruleSet.filePath}:${ruleSet.className ?? ""}:${ruleSet.source}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function formRequestClassForDocument4(source) {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}
function uniqueStrings3(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
function hoverKindForPrefix(prefix) {
  if (isRouteNamePrefix3(prefix)) {
    return "route";
  }
  if (/\bview\s*\(\s*$/.test(prefix) || /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)) {
    return "view";
  }
  if (/\bconfig\s*\(\s*$/.test(prefix)) {
    return "config";
  }
  if (/\benv\s*\(\s*$/.test(prefix)) {
    return "env";
  }
  if (/(__|trans|trans_choice)\s*\(\s*$/.test(prefix) || /@(lang|choice)\s*\(\s*$/.test(prefix)) {
    return "translation";
  }
  if (/->(can|cannot|authorize)\s*\(\s*$/.test(prefix) || /Gate::(allows|denies|authorize|check|any|none)\s*\(\s*$/.test(prefix) || /@(can|cannot|canany)\s*\(\s*$/.test(prefix)) {
    return "authorization";
  }
  if (isContainerBindingStringOpeningPrefix(prefix)) {
    return "container";
  }
  if (/\bArtisan::(?:call|queue)\s*\(\s*$/.test(prefix) || /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*$/.test(prefix) || /\bSchedule::command\s*\(\s*$/.test(prefix) || /->command\s*\(\s*$/.test(prefix)) {
    return "command";
  }
  if (isMiddlewareStringPrefix3(prefix)) {
    return "middleware";
  }
  if (/->(validated|input)\s*\(\s*$/.test(prefix) || /->safe\(\)->(only|except)\s*\(\s*\[\s*$/.test(prefix) || /->(only|except)\s*\(\s*\[\s*$/.test(prefix)) {
    return "validationField";
  }
  return null;
}
function isRouteNamePrefix3(prefix) {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) || /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) || /->routeIs\s*\(\s*$/.test(prefix);
}
function quotedStringRanges3(line) {
  const ranges = [];
  for (let index2 = 0; index2 < line.length; index2 += 1) {
    const quote = line[index2];
    if (quote !== "'" && quote !== '"') {
      continue;
    }
    const start = index2 + 1;
    index2 += 1;
    while (index2 < line.length) {
      if (line[index2] === "\\") {
        index2 += 2;
        continue;
      }
      if (line[index2] === quote) {
        ranges.push({ end: index2, start });
        break;
      }
      index2 += 1;
    }
  }
  return ranges;
}
function markdownHover(lines) {
  return {
    contents: {
      kind: import_node6.MarkupKind.Markdown,
      value: lines.filter(Boolean).join("\n")
    }
  };
}
function isMiddlewareStringPrefix3(prefix) {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}

// src/implementations.ts
var import_node_url7 = require("node:url");
var import_node7 = __toESM(require_node3(), 1);
var childrenCache = /* @__PURE__ */ new WeakMap();
function implementationsForDocument(document, position, index2) {
  const target = classFqcnAtPosition(document, position);
  if (!target) {
    return [];
  }
  const children = childrenByParent(index2.phpClasses);
  const descendants = collectDescendants(target, children);
  if (descendants.length === 0) {
    return [];
  }
  const locations = [];
  const seen = /* @__PURE__ */ new Set();
  for (const descendant of descendants) {
    const key = `${descendant.filePath}:${descendant.nameRange.start.line}:${descendant.nameRange.start.character}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    locations.push(
      import_node7.Location.create((0, import_node_url7.pathToFileURL)(descendant.filePath).toString(), {
        end: descendant.nameRange.end,
        start: descendant.nameRange.start
      })
    );
  }
  return locations.sort(
    (left, right) => left.uri.localeCompare(right.uri) || left.range.start.line - right.range.start.line || left.range.start.character - right.range.start.character
  );
}
function classFqcnAtPosition(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line];
  if (line === void 0) {
    return null;
  }
  const token = classTokenAtPosition(line, position.character);
  if (!token) {
    return null;
  }
  return resolvePhpClassReference(document.getText(), token);
}
function classTokenAtPosition(line, character) {
  for (const match of line.matchAll(/\\?[A-Za-z_][A-Za-z0-9_\\]*/g)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (character >= start && character <= end) {
      return match[0];
    }
  }
  return null;
}
function childrenByParent(classes) {
  const cached = childrenCache.get(classes);
  if (cached) {
    return cached;
  }
  const children = /* @__PURE__ */ new Map();
  for (const phpClass of classes) {
    for (const parent of [...phpClass.extends, ...phpClass.implements]) {
      const bucket = children.get(parent);
      if (bucket) {
        bucket.push(phpClass);
      } else {
        children.set(parent, [phpClass]);
      }
    }
  }
  childrenCache.set(classes, children);
  return children;
}
function collectDescendants(rootFqcn, children) {
  const descendants = [];
  const visitedParents = /* @__PURE__ */ new Set([rootFqcn]);
  const queue = [rootFqcn];
  while (queue.length > 0) {
    const parent = queue.shift();
    for (const child of children.get(parent) ?? []) {
      descendants.push(child);
      if (!visitedParents.has(child.fqcn)) {
        visitedParents.add(child.fqcn);
        queue.push(child.fqcn);
      }
    }
  }
  return descendants;
}

// src/inlayHints.ts
var import_node_url8 = require("node:url");
function inlayHintsForDocument(document, index2) {
  const documentPath = documentPathFromUri5(document.uri);
  if (!documentPath) {
    return [];
  }
  const hints = /* @__PURE__ */ new Map();
  for (const [line, routes] of routesByStartLine(index2, documentPath)) {
    const labels = uniqueStrings4(routes.map(routeHintLabel));
    if (labels.length === 0) {
      continue;
    }
    const character = document.getText({
      start: { character: 0, line },
      end: { character: Number.MAX_SAFE_INTEGER, line }
    }).length;
    hints.set(`${line}:${character}`, {
      label: ` ${labels.join(" \xB7 ")}`,
      paddingLeft: true,
      position: { character, line }
    });
  }
  return [...hints.values()].sort(
    (left, right) => left.position.line - right.position.line || left.position.character - right.position.character
  );
}
function routesByStartLine(index2, documentPath) {
  const byLine = /* @__PURE__ */ new Map();
  for (const route of index2.routes.filter((candidate) => candidate.filePath === documentPath && candidate.uri)) {
    const routes = byLine.get(route.range.start.line) ?? [];
    routes.push(route);
    byLine.set(route.range.start.line, routes);
  }
  return byLine;
}
function routeHintLabel(route) {
  const methods = route.methods.join("|");
  const uri = `/${route.uri?.replace(/^\/+/, "") ?? ""}`;
  const name = route.name ? ` (${route.name})` : "";
  return `${methods} ${uri}${name}`;
}
function documentPathFromUri5(uri) {
  try {
    return (0, import_node_url8.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function uniqueStrings4(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

// src/laravelDetection.ts
var import_promises4 = require("node:fs/promises");
var import_node_path7 = __toESM(require("node:path"), 1);
async function isLaravelProject(rootPath) {
  const artisanPath = import_node_path7.default.join(rootPath, "artisan");
  const composerPath = import_node_path7.default.join(rootPath, "composer.json");
  if (await fileExists(artisanPath)) {
    return true;
  }
  if (!await fileExists(composerPath)) {
    return false;
  }
  try {
    const composer = JSON.parse(await (0, import_promises4.readFile)(composerPath, "utf8"));
    return Boolean(
      composer.require?.["laravel/framework"] ?? composer.require?.["illuminate/support"] ?? composer["require-dev"]?.["orchestra/testbench"]
    );
  } catch {
    return false;
  }
}
async function fileExists(filePath) {
  try {
    await (0, import_promises4.access)(filePath);
    return true;
  } catch {
    return false;
  }
}

// src/references.ts
var import_promises5 = require("node:fs/promises");
var import_node_url9 = require("node:url");
var import_node8 = __toESM(require_node3(), 1);
async function referencesForDocument(document, position, index2) {
  const target = referenceTargetAtPosition(document, position, index2);
  if (!target) {
    return [];
  }
  const sources = await referenceSources(document, index2);
  const references = sources.flatMap((source) => referencesInSource(source, target, index2));
  return uniqueLocations2(references);
}
function referenceTargetAtPosition(document, position, index2) {
  const componentProp = componentPropContextAtPosition3(document, position);
  if (componentProp) {
    const component2 = index2.bladeComponents.find(
      (candidate) => candidate.name === componentProp.componentName && candidate.props.includes(componentProp.prop)
    );
    return component2 ? { kind: "componentProp", model: component2.name, value: componentProp.prop } : null;
  }
  const component = componentContextAtPosition3(document, position);
  if (component) {
    return {
      kind: "component",
      value: component.value
    };
  }
  const provider = serviceProviderContextAtPosition3(document, position, index2);
  if (provider) {
    return provider;
  }
  const controllerAction = routeControllerActionContextAtPosition3(document, position, index2);
  if (controllerAction) {
    return controllerAction;
  }
  const controller = routeControllerClassContextAtPosition3(document, position, index2);
  if (controller) {
    return controller;
  }
  const facade = facadeStaticCallContextAtPosition3(document, position, index2);
  if (facade) {
    return facade;
  }
  const artifact = artifactClassContextAtPosition3(document, position, index2);
  if (artifact) {
    return artifact;
  }
  const macroMethod = macroMethodContextAtPosition3(document, position, index2);
  if (macroMethod) {
    return macroMethod;
  }
  const seeder = seederClassContextAtPosition3(document, position, index2);
  if (seeder) {
    return seeder;
  }
  const factoryState = factoryStateContextAtPosition3(document, position, index2);
  if (factoryState) {
    return factoryState;
  }
  const eloquentMethod = eloquentMethodContextAtPosition3(document, position, index2);
  if (eloquentMethod) {
    return eloquentMethod;
  }
  return stringContextAtPosition3(document, position, index2);
}
function componentContextAtPosition3(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const start = (match.index ?? 0) + 3;
    const end = start + rawName.length;
    if (position.character >= start && position.character <= end) {
      return { value: normalizeComponentName(rawName) };
    }
  }
  return null;
}
function componentPropContextAtPosition3(document, position) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot")) {
      continue;
    }
    const componentName = rawName.replace(/:/g, ".");
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    for (const attribute of tag[2].matchAll(/\s:?(?!:)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const prop = attribute[1];
      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(prop);
      const end = start + prop.length;
      if (position.character >= start && position.character <= end) {
        return { componentName, prop };
      }
    }
  }
  return null;
}
function seederClassContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition3(line, position.character);
  if (!reference || !isSeederCallPrefix4(line.slice(0, reference.start))) {
    return null;
  }
  const seeder = index2.seeders.find((candidate) => seederMatches3(candidate, resolvePhpClassReference(document.getText(), reference.value)));
  return seeder ? {
    className: seeder.className,
    kind: "seeder",
    namespace: seeder.namespace
  } : null;
}
function serviceProviderContextAtPosition3(document, position, index2) {
  const documentPath = pathFromUri3(document.uri);
  if (!documentPath || !isProviderRegistrationFile5(documentPath)) {
    return null;
  }
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition3(line, position.character);
  if (!reference || !isProviderRegistrationPrefix4(line.slice(0, reference.start))) {
    return null;
  }
  const provider = index2.providers.find(
    (candidate) => serviceProviderMatches3(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return provider ? {
    className: provider.className,
    kind: "serviceProvider",
    namespace: provider.namespace
  } : null;
}
function routeControllerClassContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classConstantContextAtPosition3(line, position.character);
  if (!reference || !isRouteControllerClassPrefix4(line.slice(0, reference.start))) {
    return null;
  }
  const controller = index2.controllers.find(
    (candidate) => controllerMatches4(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return controller ? {
    className: controller.className,
    kind: "controller",
    namespace: controller.namespace
  } : null;
}
function routeControllerActionContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = quotedStringAtPosition3(line, position.character);
  if (!token) {
    return null;
  }
  const prefix = line.slice(0, token.start - 1);
  const controllerName2 = routeControllerActionClass5(prefix) ?? routeControllerGroupActionClass5(document.getText(), position.line, prefix);
  const resolvedControllerName = controllerName2 ? resolvePhpClassReference(document.getText(), controllerName2) : null;
  const controller = resolvedControllerName ? index2.controllers.find((candidate) => controllerMatches4(candidate, resolvedControllerName)) : null;
  return controller?.actions.includes(token.value) ? { kind: "controllerAction", model: controller.className, value: token.value } : null;
}
function macroMethodContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition3(line, position.character);
  if (!token) {
    return null;
  }
  const className = macroStaticCallClass4(line.slice(0, token.start));
  if (!className) {
    return null;
  }
  const macro = index2.macros.find(
    (candidate) => candidate.method === token.value && classNameMatches3(candidate.className, resolvePhpClassReference(document.getText(), className))
  );
  return macro ? { className: macro.className, kind: "macroMethod", value: macro.method } : null;
}
function artifactClassContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition3(line, position.character);
  if (!reference) {
    return null;
  }
  const kinds = artifactKindsForReference3(line, reference);
  if (!kinds) {
    return null;
  }
  const artifact = index2.artifacts.find(
    (candidate) => kinds.includes(candidate.kind) && artifactMatches3(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return artifact ? {
    className: artifact.className,
    kind: "artifactClass",
    namespace: artifact.namespace,
    value: artifact.className
  } : null;
}
function facadeStaticCallContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const reference = classReferenceAtPosition3(line, position.character);
  if (!reference || !line.slice(reference.start + reference.value.length).startsWith("::")) {
    return null;
  }
  const facade = index2.facades.find(
    (candidate) => facadeMatches3(candidate, resolvePhpClassReference(document.getText(), reference.value))
  );
  return facade ? {
    className: facade.className,
    kind: "facadeClass",
    namespace: facade.namespace
  } : null;
}
function stringContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  for (const stringRange of quotedStringRanges4(line)) {
    if (position.character < stringRange.start || position.character > stringRange.end) {
      continue;
    }
    const prefix = line.slice(0, stringRange.start - 1);
    const value = line.slice(stringRange.start, stringRange.end);
    const relationModel = eloquentRelationModel4(prefix);
    if (relationModel) {
      return { kind: "relation", model: relationModel, value };
    }
    const attributeTarget = modelAttributeTargetAtPosition(document, position, index2, value);
    if (attributeTarget) {
      return attributeTarget;
    }
    if (isValidationFieldPrefix(prefix)) {
      return validationFieldTargetAtPosition(document, index2, value);
    }
    const bladeSectionLayout = bladeSectionLayoutForDocument5(document, prefix, index2);
    if (bladeSectionLayout) {
      return bladeSectionLayout.yields.includes(value) ? { kind: "bladeSection", model: bladeSectionLayout.name, value } : null;
    }
    const bladeStackLayout = bladeStackLayoutForDocument5(document, prefix, index2);
    if (bladeStackLayout) {
      return (bladeStackLayout.stacks ?? []).includes(value) ? { kind: "bladeStack", model: bladeStackLayout.name, value } : null;
    }
    const routeParameterRouteName = routeParameterContextRouteName4(prefix);
    if (routeParameterRouteName) {
      const route = index2.routes.find((candidate) => candidate.name === routeParameterRouteName);
      return routeParameters6(route).includes(value) ? { kind: "routeParameter", model: routeParameterRouteName, value } : null;
    }
    const kind = referenceKindForPrefix(prefix);
    return kind ? { kind, value } : null;
  }
  return null;
}
function eloquentMethodContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition3(line, position.character);
  if (!token) {
    return null;
  }
  const modelName = eloquentScopeModel4(line.slice(0, token.start));
  const model = modelName ? findModel3(index2, modelName) : null;
  if (!model) {
    return null;
  }
  if (model.scopes.includes(token.value)) {
    return { kind: "scope", model: model.className, value: token.value };
  }
  const builderMethod = model.customBuilder?.methods.find((method) => method.name === token.value);
  return builderMethod && model.customBuilder ? {
    builderClassName: model.customBuilder.className,
    kind: "builderMethod",
    model: model.className,
    value: builderMethod.name
  } : null;
}
function factoryStateContextAtPosition3(document, position, index2) {
  const line = document.getText().split(/\r?\n/)[position.line] ?? "";
  const token = tokenAtPosition3(line, position.character);
  if (!token) {
    return null;
  }
  const modelName = factoryStateModel4(line.slice(0, token.start));
  if (!modelName) {
    return null;
  }
  const factory = index2.factories.find(
    (factory2) => factory2.states.includes(token.value) && (factory2.model === modelName || factory2.model?.split("\\").at(-1) === modelName)
  );
  return factory ? { kind: "factoryState", model: modelName, value: token.value } : null;
}
function referenceKindForPrefix(prefix) {
  if (isRouteNamePrefix4(prefix)) {
    return "route";
  }
  if (/\bview\s*\(\s*$/.test(prefix) || /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*$/.test(prefix)) {
    return "view";
  }
  if (/(__|trans|trans_choice)\s*\(\s*$/.test(prefix) || /@(lang|choice)\s*\(\s*$/.test(prefix)) {
    return "translation";
  }
  if (/\bconfig\s*\(\s*$/.test(prefix)) {
    return "config";
  }
  if (/\benv\s*\(\s*$/.test(prefix)) {
    return "env";
  }
  if (/->(can|cannot|authorize)\s*\(\s*$/.test(prefix) || /Gate::(allows|denies|authorize|check|any|none)\s*\(\s*$/.test(prefix) || /@(can|cannot|canany)\s*\(\s*$/.test(prefix)) {
    return "authorization";
  }
  if (isContainerBindingStringOpeningPrefix(prefix)) {
    return "container";
  }
  if (/\bArtisan::(?:call|queue)\s*\(\s*$/.test(prefix) || /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*$/.test(prefix) || /\bSchedule::command\s*\(\s*$/.test(prefix) || /->command\s*\(\s*$/.test(prefix)) {
    return "command";
  }
  if (isMiddlewareStringPrefix4(prefix)) {
    return "middleware";
  }
  return null;
}
function isRouteNamePrefix4(prefix) {
  return /(?:\b(?:route|to_route)|->route)\s*\(\s*$/.test(prefix) || /\bRoute::(?:has|is)\s*\(\s*$/.test(prefix) || /->routeIs\s*\(\s*$/.test(prefix);
}
function isValidationFieldPrefix(prefix) {
  return /->(validated|input)\s*\(\s*$/.test(prefix) || /->safe\(\)->(only|except)\s*\(\s*\[\s*$/.test(prefix) || /->(only|except)\s*\(\s*\[\s*$/.test(prefix);
}
async function referenceSources(document, index2) {
  const documentPath = pathFromUri3(document.uri);
  const filePaths = /* @__PURE__ */ new Set();
  if (documentPath) {
    filePaths.add(documentPath);
  }
  for (const filePath of indexedFilePaths(index2)) {
    filePaths.add(filePath);
  }
  const sources = [];
  for (const filePath of filePaths) {
    if (documentPath && filePath === documentPath) {
      sources.push({ filePath, source: document.getText() });
      continue;
    }
    const source = await readFileSafely2(filePath);
    if (source !== null) {
      sources.push({ filePath, source });
    }
  }
  return sources;
}
function indexedFilePaths(index2) {
  const filePaths = /* @__PURE__ */ new Set();
  const add = (filePath) => {
    if (filePath) {
      filePaths.add(filePath);
    }
  };
  index2.authorization.forEach((entry) => add(entry.filePath));
  index2.bladeComponents.forEach((component) => add(component.filePath));
  index2.bladeViews.forEach((view) => add(view.filePath));
  index2.commands.forEach((command) => add(command.filePath));
  index2.configEntries.forEach((entry) => add(entry.filePath));
  index2.containerBindings.forEach((binding) => add(binding.filePath));
  index2.controllers.forEach((controller) => add(controller.filePath));
  index2.envEntries.forEach((entry) => add(entry.filePath));
  index2.artifacts.forEach((artifact) => add(artifact.filePath));
  index2.factories.forEach((factory) => add(factory.filePath));
  index2.facades.forEach((facade) => add(facade.filePath));
  index2.macros.forEach((macro) => add(macro.filePath));
  index2.middleware.forEach((middleware) => add(middleware.filePath));
  index2.models.forEach((model) => {
    add(model.filePath);
    add(model.customBuilder?.filePath);
  });
  index2.providers.forEach((provider) => {
    add(provider.filePath);
    add(provider.classFilePath);
  });
  index2.routes.forEach((route) => add(route.filePath));
  index2.schemaTables.forEach((table) => {
    add(table.filePath);
    table.columns.forEach((column) => add(column.filePath));
  });
  index2.seeders.forEach((seeder) => add(seeder.filePath));
  index2.translationKeys.forEach((translation) => add(translation.filePath));
  index2.validationRules.forEach((ruleSet) => add(ruleSet.filePath));
  return filePaths;
}
async function readFileSafely2(filePath) {
  try {
    return await (0, import_promises5.readFile)(filePath, "utf8");
  } catch {
    return null;
  }
}
function referencesInSource(source, target, index2) {
  const references = [];
  const lines = source.source.split(/\r?\n/);
  lines.forEach((line, lineNumber) => {
    if (target.kind === "route") {
      references.push(...routeReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "routeParameter") {
      references.push(...routeParameterReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }
    if (target.kind === "view") {
      references.push(...viewReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "bladeSection") {
      references.push(...bladeSectionReferencesInLine(source.filePath, line, lineNumber, target.model, target.value, index2));
      return;
    }
    if (target.kind === "bladeStack") {
      references.push(...bladeStackReferencesInLine(source.filePath, line, lineNumber, target.model, target.value, index2));
      return;
    }
    if (target.kind === "translation") {
      references.push(...translationReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "config") {
      references.push(...configReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "env") {
      references.push(...envReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "authorization") {
      references.push(...authorizationReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "container") {
      references.push(...containerReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "command") {
      references.push(...commandReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "middleware") {
      references.push(...middlewareReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "validationField") {
      references.push(...validationFieldReferencesInLine(source.filePath, line, lineNumber, target.value));
      return;
    }
    if (target.kind === "facadeClass") {
      references.push(...facadeClassReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }
    if (target.kind === "artifactClass") {
      references.push(...artifactClassReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }
    if (target.kind === "macroMethod") {
      references.push(...macroMethodReferencesInLine(source.filePath, source.source, line, lineNumber, target.className, target.value));
      return;
    }
    if (target.kind === "seeder") {
      references.push(...seederReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }
    if (target.kind === "serviceProvider") {
      references.push(...serviceProviderReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }
    if (target.kind === "controller") {
      references.push(...controllerReferencesInLine(source.filePath, source.source, line, lineNumber, target));
      return;
    }
    if (target.kind === "controllerAction") {
      references.push(...controllerActionReferencesInLine(source.filePath, source.source, line, lineNumber, target.model, target.value));
      return;
    }
    if (target.kind === "factoryState") {
      references.push(...factoryStateReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }
    if (target.kind === "relation") {
      references.push(...relationReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }
    if (target.kind === "scope") {
      references.push(...scopeReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }
    if (target.kind === "builderMethod") {
      references.push(...scopeReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }
    if (target.kind === "modelAttribute") {
      references.push(...modelAttributeReferencesInLine(source.filePath, line, lineNumber, target));
      return;
    }
    if (target.kind === "componentProp") {
      references.push(...componentPropReferencesInLine(source.filePath, line, lineNumber, target.model, target.value));
      return;
    }
    references.push(...componentReferencesInLine(source.filePath, line, lineNumber, target.value));
  });
  return references;
}
function routeReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\b(?:route|to_route)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->route\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bRoute::(?:has|is)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->routeIs\s*\(\s*(['"])([^'"]+)\1/g, 2, value)
  ];
}
function routeParameterReferencesInLine(filePath, line, lineNumber, routeName, value) {
  const references = [];
  for (const stringRange of quotedStringRanges4(line)) {
    const matchedRouteName = routeParameterContextRouteName4(line.slice(0, stringRange.start - 1));
    if (matchedRouteName !== routeName || line.slice(stringRange.start, stringRange.end) !== value) {
      continue;
    }
    references.push(location(filePath, lineNumber, stringRange.start, value.length));
  }
  return references;
}
function viewReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bview\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(
      filePath,
      line,
      lineNumber,
      /@(extends|include|includeIf|includeWhen|includeUnless|includeFirst|each|component)\s*\(\s*(['"])([^'"]+)\2/g,
      3,
      value
    )
  ];
}
function bladeSectionReferencesInLine(filePath, line, lineNumber, layoutName, value, index2) {
  const view = index2.bladeViews.find((view2) => view2.filePath === filePath);
  if (view?.extends !== layoutName) {
    return [];
  }
  return stringCallReferencesInLine(filePath, line, lineNumber, /@section\s*\(\s*(['"])([^'"]+)\1/g, 2, value);
}
function bladeStackReferencesInLine(filePath, line, lineNumber, layoutName, value, index2) {
  const view = index2.bladeViews.find((view2) => view2.filePath === filePath);
  if (view?.extends !== layoutName) {
    return [];
  }
  return stringCallReferencesInLine(filePath, line, lineNumber, /@(push|prepend)\s*\(\s*(['"])([^'"]+)\2/g, 3, value);
}
function translationReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\b(__|trans|trans_choice)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /@(lang|choice)\s*\(\s*(['"])([^'"]+)\2/g, 3, value)
  ];
}
function configReferencesInLine(filePath, line, lineNumber, value) {
  return stringCallReferencesInLine(filePath, line, lineNumber, /\bconfig\s*\(\s*(['"])([^'"]+)\1/g, 2, value);
}
function envReferencesInLine(filePath, line, lineNumber, value) {
  return stringCallReferencesInLine(filePath, line, lineNumber, /\benv\s*\(\s*(['"])([^'"]+)\1/g, 2, value);
}
function authorizationReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->(can|cannot|authorize)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bGate::(allows|denies|authorize|check|any|none)\s*\(\s*(['"])([^'"]+)\2/g, 3, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /@(can|cannot|canany)\s*\(\s*(['"])([^'"]+)\2/g, 3, value)
  ];
}
function containerReferencesInLine(filePath, line, lineNumber, value) {
  return containerBindingReferenceRegExps().flatMap(
    (pattern) => stringCallReferencesInLine(filePath, line, lineNumber, pattern, 2, value)
  );
}
function commandReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bArtisan::(?:call|queue)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /(?:\$this|static|self)->(?:call|callSilent)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /\bSchedule::command\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->command\s*\(\s*(['"])([^'"]+)\1/g, 2, value)
  ];
}
function middlewareReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /(?:Route::)?middleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->middleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /(?:Route::)?withoutMiddleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->withoutMiddleware\s*\(\s*(?:\[\s*)?(['"])([^'"]+)\1/g, 2, value)
  ];
}
function validationFieldReferencesInLine(filePath, line, lineNumber, value) {
  return [
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->(?:validated|input)\s*\(\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->safe\(\)->(?:only|except)\s*\(\s*\[\s*(['"])([^'"]+)\1/g, 2, value),
    ...stringCallReferencesInLine(filePath, line, lineNumber, /->(?:only|except)\s*\(\s*\[\s*(['"])([^'"]+)\1/g, 2, value)
  ];
}
function factoryStateReferencesInLine(filePath, line, lineNumber, model, value) {
  const references = [];
  const escapedModel = escapeRegExp5(model);
  const escapedValue = escapeRegExp5(value);
  for (const pattern of [
    new RegExp(`\\b${escapedModel}::factory\\(\\)->(${escapedValue})\\s*\\(`, "g"),
    new RegExp(`\\b${escapedModel}::factory\\(\\)->[^;\\n]*->(${escapedValue})\\s*\\(`, "g")
  ]) {
    for (const match of line.matchAll(pattern)) {
      const start = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
      references.push(location(filePath, lineNumber, start, match[1].length));
    }
  }
  return references;
}
function seederReferencesInLine(filePath, source, line, lineNumber, target) {
  const references = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isSeederCallPrefix4(line.slice(0, start)) || !seederReferenceMatches(target, resolvePhpClassReference(source, value))) {
      continue;
    }
    references.push(location(filePath, lineNumber, start, value.length));
  }
  return references;
}
function serviceProviderReferencesInLine(filePath, source, line, lineNumber, target) {
  if (!isProviderRegistrationFile5(filePath)) {
    return [];
  }
  const references = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isProviderRegistrationPrefix4(line.slice(0, start)) || !serviceProviderReferenceMatches(target, resolvePhpClassReference(source, value))) {
      continue;
    }
    references.push(location(filePath, lineNumber, start, value.length));
  }
  return references;
}
function controllerReferencesInLine(filePath, source, line, lineNumber, target) {
  const references = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (!isRouteControllerClassPrefix4(line.slice(0, start)) || !controllerReferenceMatches2(target, resolvePhpClassReference(source, value))) {
      continue;
    }
    references.push(location(filePath, lineNumber, start, value.length));
  }
  return references;
}
function controllerActionReferencesInLine(filePath, source, line, lineNumber, model, value) {
  const references = [];
  for (const stringRange of quotedStringRanges4(line)) {
    const prefix = line.slice(0, stringRange.start - 1);
    const controller = routeControllerActionClass5(prefix) ?? routeControllerGroupActionClass5(source, lineNumber, prefix);
    const resolvedController = controller ? resolvePhpClassReference(source, controller) : null;
    if (resolvedController !== model && resolvedController?.split("\\").at(-1) !== model) {
      continue;
    }
    if (line.slice(stringRange.start, stringRange.end) !== value) {
      continue;
    }
    references.push(location(filePath, lineNumber, stringRange.start, value.length));
  }
  return references;
}
function macroMethodReferencesInLine(filePath, source, line, lineNumber, className, value) {
  const references = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const matchedClassName = match[1];
    const method = match[2];
    if (method !== value || !classNameMatches3(className, resolvePhpClassReference(source, matchedClassName))) {
      continue;
    }
    const start = (match.index ?? 0) + match[0].lastIndexOf(method);
    references.push(location(filePath, lineNumber, start, method.length));
  }
  return references;
}
function artifactClassReferencesInLine(filePath, source, line, lineNumber, target) {
  const references = [];
  for (const reference of classReferencesInLine(line)) {
    if (!artifactKindsForReference3(line, reference) || !artifactReferenceMatches(target, resolvePhpClassReference(source, reference.value))) {
      continue;
    }
    references.push(location(filePath, lineNumber, reference.start, reference.value.length));
  }
  return references;
}
function facadeClassReferencesInLine(filePath, source, line, lineNumber, target) {
  const references = [];
  for (const reference of classReferencesInLine(line)) {
    if (!line.slice(reference.start + reference.value.length).startsWith("::") || !facadeReferenceMatches(target, resolvePhpClassReference(source, reference.value))) {
      continue;
    }
    references.push(location(filePath, lineNumber, reference.start, reference.value.length));
  }
  return references;
}
function relationReferencesInLine(filePath, line, lineNumber, model, value) {
  const relationMethods = "(?:with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  const escapedModel = escapeRegExp5(model);
  return [
    ...stringCallReferencesInLine(
      filePath,
      line,
      lineNumber,
      new RegExp(`\\b${escapedModel}::${relationMethods}\\(\\s*(?:\\[\\s*)?(['"])([^'"]+)\\1`, "g"),
      2,
      value
    ),
    ...stringCallReferencesInLine(
      filePath,
      line,
      lineNumber,
      new RegExp(`\\b${escapedModel}::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?(['"])([^'"]+)\\1`, "g"),
      2,
      value
    )
  ];
}
function scopeReferencesInLine(filePath, line, lineNumber, model, value) {
  const references = [];
  const escapedModel = escapeRegExp5(model);
  for (const pattern of [
    new RegExp(`\\b${escapedModel}::(?:query\\(\\)->)?(${escapeRegExp5(value)})\\s*\\(`, "g"),
    new RegExp(`\\b${escapedModel}::[^;\\n]*->(${escapeRegExp5(value)})\\s*\\(`, "g")
  ]) {
    for (const match of line.matchAll(pattern)) {
      const start = (match.index ?? 0) + match[0].lastIndexOf(match[1]);
      references.push(location(filePath, lineNumber, start, match[1].length));
    }
  }
  return references;
}
function modelAttributeReferencesInLine(filePath, line, lineNumber, target) {
  if (!target.modelFilePaths.includes(filePath)) {
    return [];
  }
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[/.test(line);
  if (!propertyStart && !line.includes(target.value)) {
    return [];
  }
  return quotedStringRanges4(line).filter((range2) => line.slice(range2.start, range2.end) === target.value).map((range2) => location(filePath, lineNumber, range2.start, target.value.length));
}
function stringCallReferencesInLine(filePath, line, lineNumber, pattern, valueGroup, value) {
  const references = [];
  for (const match of line.matchAll(pattern)) {
    const matchedValue = match[valueGroup];
    if (matchedValue !== value) {
      continue;
    }
    const start = (match.index ?? 0) + match[0].lastIndexOf(matchedValue);
    references.push(location(filePath, lineNumber, start, matchedValue.length));
  }
  return references;
}
function componentReferencesInLine(filePath, line, lineNumber, value) {
  const references = [];
  for (const match of line.matchAll(/<x-([A-Za-z0-9_.:-]+)/g)) {
    const rawName = match[1];
    if (rawName.startsWith("slot") || normalizeComponentName(rawName) !== value) {
      continue;
    }
    const start = (match.index ?? 0) + 3;
    references.push(location(filePath, lineNumber, start, rawName.length));
  }
  return references;
}
function componentPropReferencesInLine(filePath, line, lineNumber, componentName, value) {
  const references = [];
  for (const tag of line.matchAll(/<x-([A-Za-z0-9_.:-]+)([^>]*)/g)) {
    const rawName = tag[1];
    if (rawName.startsWith("slot") || normalizeComponentName(rawName) !== componentName) {
      continue;
    }
    const tagStart = tag.index ?? 0;
    const attrStart = tagStart + 3 + rawName.length;
    for (const attribute of tag[2].matchAll(/\s:?(?!:)([A-Za-z_][A-Za-z0-9_.:-]*)\b/g)) {
      const prop = attribute[1];
      if (prop !== value) {
        continue;
      }
      const start = attrStart + (attribute.index ?? 0) + attribute[0].lastIndexOf(prop);
      references.push(location(filePath, lineNumber, start, prop.length));
    }
  }
  return references;
}
function quotedStringRanges4(line) {
  const ranges = [];
  for (let index2 = 0; index2 < line.length; index2 += 1) {
    const quote = line[index2];
    if (quote !== "'" && quote !== '"') {
      continue;
    }
    const start = index2 + 1;
    index2 += 1;
    while (index2 < line.length) {
      if (line[index2] === "\\") {
        index2 += 2;
        continue;
      }
      if (line[index2] === quote) {
        ranges.push({ end: index2, start });
        break;
      }
      index2 += 1;
    }
  }
  return ranges;
}
function location(filePath, line, character, length) {
  return import_node8.Location.create((0, import_node_url9.pathToFileURL)(filePath).toString(), range(line, character, length));
}
function range(line, character, length) {
  return {
    end: {
      character: character + length,
      line
    },
    start: {
      character,
      line
    }
  };
}
function normalizeComponentName(name) {
  return name.replace(/:/g, ".");
}
function tokenAtPosition3(line, character) {
  for (const match of line.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    const start = match.index ?? 0;
    const value = match[0];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function classConstantContextAtPosition3(line, character) {
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)::class/g)) {
    const start = match.index ?? 0;
    const value = match[1];
    if (character >= start && character <= start + value.length) {
      return { start, value };
    }
  }
  return null;
}
function classReferenceAtPosition3(line, character) {
  return classReferencesInLine(line).find(
    (reference) => character >= reference.start && character <= reference.start + reference.value.length
  ) ?? null;
}
function quotedStringAtPosition3(line, character) {
  for (const range2 of quotedStringRanges4(line)) {
    if (character >= range2.start && character <= range2.end) {
      return {
        ...range2,
        value: line.slice(range2.start, range2.end)
      };
    }
  }
  return null;
}
function classReferencesInLine(line) {
  const references = [];
  for (const match of line.matchAll(/\b([A-Za-z_\\][A-Za-z0-9_\\]*)\b/g)) {
    references.push({
      start: match.index ?? 0,
      value: match[1]
    });
  }
  return references;
}
function artifactKindsForReference3(line, reference) {
  const before = line.slice(0, reference.start);
  const after = line.slice(reference.start + reference.value.length);
  if (/\bevent\s*\(\s*new\s+$/.test(before)) {
    return ["event"];
  }
  if (/\bdispatch\s*\(\s*new\s+$/.test(before) || /^::dispatch\s*\(/.test(after)) {
    return ["event", "job"];
  }
  if (/->(?:send|queue|later)\s*\(\s*new\s+$/.test(before)) {
    return ["mailable", "notification"];
  }
  if (/\bnew\s+$/.test(before)) {
    return ["event", "job", "listener", "mailable", "notification", "resource"];
  }
  return null;
}
function isSeederCallPrefix4(prefix) {
  return /(?:\$this|static|self)->(?:call|callSilent|callOnce)\s*\(\s*(?:\[\s*)?(?:[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,\s*)*$/.test(prefix);
}
function isProviderRegistrationPrefix4(prefix) {
  return /(?:return\s*\[|['"]providers['"]\s*=>\s*\[)(?:\s*[A-Za-z_\\][A-Za-z0-9_\\]*::class\s*,?)*\s*$/.test(prefix);
}
function isRouteControllerClassPrefix4(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*(?:,\s*)?\[\s*$/.test(prefix) || /Route::(?:resource|apiResource)\s*\([^;\n]*,\s*$/.test(prefix);
}
function routeControllerActionClass5(prefix) {
  return /Route::[A-Za-z]+\s*\([^;\n]*\[\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*,\s*$/.exec(prefix)?.[1] ?? null;
}
function routeControllerGroupActionClass5(source, lineNumber, prefix) {
  if (!/Route::[A-Za-z]+\s*\([^;\n]*,\s*$/.test(prefix)) {
    return null;
  }
  return activeRouteControllerGroupClass5(source.split(/\r?\n/).slice(0, lineNumber));
}
function activeRouteControllerGroupClass5(lines) {
  const stack = [];
  let braceDepth = 0;
  for (const line of lines) {
    const controller = routeControllerGroupController5(line);
    const nextBraceDepth = braceDepth + braceDelta6(line);
    if (controller) {
      stack.push({
        closeDepth: Math.max(nextBraceDepth, braceDepth + 1),
        controller
      });
    }
    braceDepth = nextBraceDepth;
    while (stack.length > 0 && braceDepth < stack[stack.length - 1].closeDepth) {
      stack.pop();
    }
  }
  return stack.at(-1)?.controller ?? null;
}
function routeControllerGroupController5(line) {
  return /Route::controller\s*\(\s*([A-Za-z_\\][A-Za-z0-9_\\]*)::class\s*\)[^;]*->group\s*\(/.exec(line)?.[1] ?? null;
}
function braceDelta6(line) {
  return [...line].reduce((delta, char) => delta + (char === "{" ? 1 : char === "}" ? -1 : 0), 0);
}
function isProviderRegistrationFile5(filePath) {
  return filePath.endsWith("/bootstrap/providers.php") || filePath.endsWith("/config/app.php");
}
function routeParameterContextRouteName4(prefix) {
  const match = /(?:\b(?:route|to_route)|->route)\(\s*(['"])([^'"]+)\1\s*,\s*\[([\s\S]*)$/.exec(prefix);
  if (!match) {
    return null;
  }
  const currentEntry = match[3].split(",").at(-1) ?? "";
  if (/=>/.test(currentEntry)) {
    return null;
  }
  return match[2];
}
function routeParameters6(route) {
  if (!route?.uri) {
    return [];
  }
  return [...route.uri.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?:\?)?\}/g)].map((match) => match[1]);
}
function seederMatches3(seeder, value) {
  return seeder.className === value || seeder.className === value.split("\\").at(-1) || (seeder.namespace ? `${seeder.namespace}\\${seeder.className}` === value : false);
}
function seederReferenceMatches(target, value) {
  return target.className === value || target.className === value.split("\\").at(-1) || (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}
function serviceProviderMatches3(provider, value) {
  return provider.className === value || provider.className === value.split("\\").at(-1) || (provider.namespace ? `${provider.namespace}\\${provider.className}` === value : false);
}
function serviceProviderReferenceMatches(target, value) {
  return target.className === value || target.className === value.split("\\").at(-1) || (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}
function controllerMatches4(controller, value) {
  return controller.className === value || controller.className === value.split("\\").at(-1) || (controller.namespace ? `${controller.namespace}\\${controller.className}` === value : false);
}
function controllerReferenceMatches2(target, value) {
  return target.className === value || target.className === value.split("\\").at(-1) || (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}
function macroStaticCallClass4(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? null;
}
function classNameMatches3(indexedClassName, value) {
  return indexedClassName === value || indexedClassName.split("\\").at(-1) === value || value.split("\\").at(-1) === indexedClassName;
}
function artifactMatches3(artifact, value) {
  return artifact.className === value || artifact.className === value.split("\\").at(-1) || (artifact.namespace ? `${artifact.namespace}\\${artifact.className}` === value : false);
}
function artifactReferenceMatches(target, value) {
  return target.className === value || target.className === value.split("\\").at(-1) || (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}
function facadeMatches3(facade, value) {
  return facade.className === value || facade.className === value.split("\\").at(-1) || (facade.namespace ? `${facade.namespace}\\${facade.className}` === value : false);
}
function facadeReferenceMatches(target, value) {
  return target.className === value || target.className === value.split("\\").at(-1) || (target.namespace ? `${target.namespace}\\${target.className}` === value : false);
}
function eloquentRelationModel4(prefix) {
  const relationMethods = "(with|withOnly|without|withCount|withExists|withSum|withAvg|withMin|withMax|has|doesntHave|whereHas|orWhereHas|withWhereHas|whereDoesntHave|orWhereDoesntHave|load|loadMissing|loadCount|loadSum|loadAvg|loadMin|loadMax)";
  return new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? new RegExp(`\\b([A-Za-z_\\\\][A-Za-z0-9_\\\\]*)::[^;\\n]*->${relationMethods}\\(\\s*(?:\\[\\s*)?$`).exec(prefix)?.[1] ?? null;
}
function eloquentScopeModel4(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::$/.exec(prefix)?.[1] ?? /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::[^;\n]*->$/.exec(prefix)?.[1] ?? null;
}
function factoryStateModel4(prefix) {
  return /\b([A-Za-z_\\][A-Za-z0-9_\\]*)::factory\(\)->$/.exec(prefix)?.[1] ?? null;
}
function modelAttributeTargetAtPosition(document, position, index2, value) {
  const documentPath = pathFromUri3(document.uri);
  const tableName = index2.models.find((model) => model.filePath === documentPath)?.tableName;
  if (!tableName) {
    return null;
  }
  const beforeCursor = document.getText({
    start: { line: 0, character: 0 },
    end: position
  });
  const propertyStart = /\bprotected\s+\$(fillable|guarded|casts)\s*=\s*\[[\s\S]*$/;
  const match = propertyStart.exec(beforeCursor);
  if (!match || /\]\s*;\s*$/.test(match[0])) {
    return null;
  }
  return {
    kind: "modelAttribute",
    modelFilePaths: index2.models.filter((model) => model.tableName === tableName).map((model) => model.filePath),
    tableName,
    value
  };
}
function validationFieldTargetAtPosition(document, index2, value) {
  const ruleSets = validationRuleSetsForDocument3(document, index2);
  if (!ruleSets.some((ruleSet) => ruleSet.fields.some((field) => field.field === value))) {
    return null;
  }
  return {
    kind: "validationField",
    value
  };
}
function bladeSectionLayoutForDocument5(document, prefix, index2) {
  if (!/@section\s*\(\s*$/.test(prefix)) {
    return null;
  }
  const documentPath = pathFromUri3(document.uri);
  const view = documentPath ? index2.bladeViews.find((view2) => view2.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && layout.yields.length > 0 ? layout : null;
}
function bladeStackLayoutForDocument5(document, prefix, index2) {
  if (!/@(?:push|prepend)\s*\(\s*$/.test(prefix)) {
    return null;
  }
  const documentPath = pathFromUri3(document.uri);
  const view = documentPath ? index2.bladeViews.find((view2) => view2.filePath === documentPath) : null;
  if (!view?.extends) {
    return null;
  }
  const layout = index2.bladeViews.find((candidate) => candidate.name === view.extends);
  return layout && (layout.stacks?.length ?? 0) > 0 ? layout : null;
}
function validationRuleSetsForDocument3(document, index2) {
  const documentPath = pathFromUri3(document.uri);
  const requestClass = formRequestClassForDocument5(document.getText());
  const ruleSets = index2.validationRules.filter(
    (ruleSet) => documentPath && ruleSet.filePath === documentPath || requestClass && ruleSet.className === requestClass
  );
  const seen = /* @__PURE__ */ new Set();
  return ruleSets.filter((ruleSet) => {
    const key = `${ruleSet.filePath}:${ruleSet.className ?? ""}:${ruleSet.source}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function formRequestClassForDocument5(source) {
  const parameterMatch = /\b([A-Za-z_][A-Za-z0-9_]*)\s+\$request\b/.exec(source);
  return parameterMatch?.[1] ?? null;
}
function findModel3(index2, modelName) {
  return index2.models.find(
    (model) => model.className === modelName || `${model.namespace}\\${model.className}` === modelName
  ) ?? null;
}
function escapeRegExp5(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function pathFromUri3(uri) {
  try {
    return (0, import_node_url9.fileURLToPath)(uri);
  } catch {
    return null;
  }
}
function uniqueLocations2(locations) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const item of locations) {
    const key = [
      item.uri,
      item.range.start.line,
      item.range.start.character,
      item.range.end.line,
      item.range.end.character
    ].join(":");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }
  return unique;
}
function isMiddlewareStringPrefix4(prefix) {
  return /(?:Route::|->)?\b(?:middleware|withoutMiddleware)\s*\(\s*(?:\[\s*(?:['"][^'"]*['"]\s*,\s*)*)?$/.test(prefix);
}

// src/serverConfig.ts
var defaults = {
  implementationsEnabled: true
};
function readServerConfig(initializationOptions) {
  return {
    implementationsEnabled: readBooleanOption(
      initializationOptions,
      "implementations",
      "enabled",
      defaults.implementationsEnabled
    )
  };
}
function readBooleanOption(initializationOptions, group, key, fallback) {
  if (initializationOptions && typeof initializationOptions === "object") {
    const groupValue = initializationOptions[group];
    if (groupValue && typeof groupValue === "object") {
      const value = groupValue[key];
      if (typeof value === "boolean") {
        return value;
      }
    }
  }
  return fallback;
}

// src/symbols.ts
var import_node_url10 = require("node:url");
var import_node9 = __toESM(require_node3(), 1);
var MAX_WORKSPACE_SYMBOLS = 200;
function documentSymbolsForDocument(document, index2) {
  const filePath = pathFromUri4(document.uri);
  if (!filePath) {
    return [];
  }
  const documentRange = fullDocumentRange(document);
  const symbols = workspaceSymbolCandidates(index2).filter((candidate) => candidate.filePath === filePath).map((candidate) => documentSymbol(candidate, documentRange));
  return sortDocumentSymbols(symbols);
}
function workspaceSymbolsForQuery(query, index2) {
  const normalizedQuery = query.trim().toLowerCase();
  return workspaceSymbolCandidates(index2).filter((candidate) => symbolMatches(candidate, normalizedQuery)).slice(0, MAX_WORKSPACE_SYMBOLS).map(
    (candidate) => import_node9.SymbolInformation.create(
      candidate.name,
      candidate.kind,
      candidateRange(candidate),
      (0, import_node_url10.pathToFileURL)(candidate.filePath).toString(),
      candidate.containerName
    )
  );
}
function workspaceSymbolCandidates(index2) {
  return [
    ...index2.routes.flatMap(
      (route) => route.name || route.uri ? [
        {
          containerName: route.filePath,
          detail: routeDetail2(route.methods, route.uri),
          filePath: route.filePath,
          kind: import_node9.SymbolKind.Function,
          name: route.name ? `route: ${route.name}` : `route: ${route.uri}`,
          range: route.range
        }
      ] : []
    ),
    ...index2.bladeViews.map((view) => ({
      containerName: "Blade view",
      detail: view.extends ? `extends ${view.extends}` : void 0,
      filePath: view.filePath,
      kind: import_node9.SymbolKind.File,
      name: `view: ${view.name}`
    })),
    ...index2.bladeComponents.map((component) => ({
      containerName: "Blade component",
      detail: `${component.source} component, view ${component.viewName}`,
      filePath: component.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `component: ${component.name}`
    })),
    ...index2.models.map((model) => ({
      containerName: model.namespace ?? "Eloquent model",
      detail: `table ${model.tableName}`,
      filePath: model.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `model: ${model.className}`
    })),
    ...index2.models.flatMap(
      (model) => model.relations.map((relation) => ({
        containerName: `model: ${model.className}`,
        detail: [relation.type, relation.relatedModel].filter(Boolean).join(" "),
        filePath: model.filePath,
        kind: import_node9.SymbolKind.Property,
        name: `relation: ${model.className}.${relation.name}`
      }))
    ),
    ...index2.models.flatMap(
      (model) => model.scopes.map((scope) => ({
        containerName: `model: ${model.className}`,
        filePath: model.filePath,
        kind: import_node9.SymbolKind.Method,
        name: `scope: ${model.className}.${scope}`
      }))
    ),
    ...index2.models.flatMap(
      (model) => model.customBuilder?.methods.map((method) => ({
        containerName: `builder: ${model.customBuilder?.className}`,
        detail: method.returnType ?? void 0,
        filePath: model.customBuilder?.filePath ?? model.filePath,
        kind: import_node9.SymbolKind.Method,
        name: `builder: ${model.className}.${method.name}`
      })) ?? []
    ),
    ...index2.schemaTables.map((table) => ({
      containerName: "Database schema",
      detail: `${table.columns.length} columns`,
      filePath: table.filePath,
      kind: import_node9.SymbolKind.Struct,
      name: `table: ${table.name}`
    })),
    ...index2.schemaTables.flatMap(
      (table) => table.columns.map((column) => ({
        containerName: `table: ${table.name}`,
        detail: schemaColumnDetail2(column.type, column.modifiers),
        filePath: column.filePath,
        kind: import_node9.SymbolKind.Field,
        name: `column: ${table.name}.${column.name}`
      }))
    ),
    ...index2.validationRules.map((ruleSet) => ({
      containerName: ruleSet.namespace ?? "Validation",
      detail: `${ruleSet.source}, ${ruleSet.fields.length} fields`,
      filePath: ruleSet.filePath,
      kind: import_node9.SymbolKind.Object,
      name: ruleSet.className ? `request: ${ruleSet.className}` : "validation: inline rules"
    })),
    ...index2.configEntries.map((entry) => ({
      containerName: "Laravel config",
      filePath: entry.filePath,
      kind: import_node9.SymbolKind.Key,
      name: `config: ${entry.key}`,
      range: entry.range
    })),
    ...index2.envEntries.map((entry) => ({
      containerName: "Environment",
      filePath: entry.filePath,
      kind: import_node9.SymbolKind.Key,
      name: `env: ${entry.key}`,
      range: entry.range
    })),
    ...index2.translationKeys.map((translation) => ({
      containerName: `translation ${translation.locale}`,
      detail: translation.source,
      filePath: translation.filePath,
      kind: import_node9.SymbolKind.String,
      name: `translation: ${translation.key}`
    })),
    ...index2.commands.map((command) => ({
      containerName: command.source === "closure" ? "routes/console.php" : command.namespace ?? "Artisan",
      detail: command.description ?? command.signature,
      filePath: command.filePath,
      kind: import_node9.SymbolKind.Function,
      name: `command: ${command.name}`
    })),
    ...index2.controllers.map((controller) => ({
      containerName: controller.namespace ?? "Controller",
      detail: controller.actions.length > 0 ? `${controller.actions.length} actions` : void 0,
      filePath: controller.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `controller: ${controller.className}`
    })),
    ...index2.controllers.flatMap(
      (controller) => controller.actions.map((action) => ({
        containerName: `controller: ${controller.className}`,
        filePath: controller.filePath,
        kind: import_node9.SymbolKind.Method,
        name: `action: ${controller.className}@${action}`,
        range: controllerActionRange2(controller, action)
      }))
    ),
    ...index2.middleware.map((middleware) => ({
      containerName: middleware.source,
      detail: middleware.className ?? void 0,
      filePath: middleware.filePath,
      kind: import_node9.SymbolKind.Key,
      name: `middleware: ${middleware.alias}`
    })),
    ...index2.containerBindings.map((binding) => ({
      containerName: binding.lifetime,
      detail: binding.concrete ?? void 0,
      filePath: binding.filePath,
      kind: import_node9.SymbolKind.Interface,
      name: `binding: ${binding.abstract}`
    })),
    ...index2.authorization.map((entry) => ({
      containerName: entry.source,
      detail: entry.policy ?? entry.model ?? void 0,
      filePath: entry.filePath,
      kind: import_node9.SymbolKind.Function,
      name: `ability: ${entry.ability}`
    })),
    ...index2.facades.map((facade) => ({
      containerName: facade.namespace ?? "Facade",
      detail: facade.binding?.concrete ?? facade.accessor ?? void 0,
      filePath: facade.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `facade: ${facade.className}`
    })),
    ...index2.providers.map((provider) => ({
      containerName: provider.source,
      detail: provider.namespace ?? void 0,
      filePath: provider.classFilePath ?? provider.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `provider: ${provider.className}`
    })),
    ...index2.macros.map((macro) => ({
      containerName: macro.className,
      filePath: macro.filePath,
      kind: import_node9.SymbolKind.Method,
      name: `macro: ${macro.method}`
    })),
    ...index2.factories.map((factory) => ({
      containerName: factory.namespace ?? "Factory",
      detail: factory.model ?? void 0,
      filePath: factory.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `factory: ${factory.className}`
    })),
    ...index2.seeders.map((seeder) => ({
      containerName: seeder.namespace ?? "Seeder",
      detail: seeder.calls.length > 0 ? `calls ${seeder.calls.join(", ")}` : void 0,
      filePath: seeder.filePath,
      kind: import_node9.SymbolKind.Class,
      name: `seeder: ${seeder.className}`
    })),
    ...index2.artifacts.map((artifact) => ({
      containerName: artifact.namespace ?? artifact.kind,
      detail: artifact.related.length > 0 ? artifact.related.join(", ") : void 0,
      filePath: artifact.filePath,
      kind: artifactSymbolKind(artifact.kind),
      name: `${artifact.kind}: ${artifact.className}`
    }))
  ].sort((left, right) => left.name.localeCompare(right.name));
}
function documentSymbol(candidate, documentRange) {
  const range2 = candidateRange(candidate, documentRange);
  return {
    children: [],
    detail: candidate.detail,
    kind: candidate.kind,
    name: candidate.name,
    range: range2,
    selectionRange: range2
  };
}
function candidateRange(candidate, fallbackRange = startRange2()) {
  if (!candidate.range) {
    return fallbackRange;
  }
  return {
    end: candidate.range.end,
    start: candidate.range.start
  };
}
function routeDetail2(methods, uri) {
  if (!uri && methods.length === 0) {
    return void 0;
  }
  return [methods.join("|"), uri].filter(Boolean).join(" ");
}
function controllerActionRange2(controller, action) {
  return controller.actionDetails?.find((candidate) => candidate.name === action)?.range;
}
function schemaColumnDetail2(type, modifiers) {
  return [type, ...modifiers].join(" ");
}
function artifactSymbolKind(kind) {
  if (kind === "event") {
    return import_node9.SymbolKind.Event;
  }
  if (kind === "resource") {
    return import_node9.SymbolKind.Struct;
  }
  return import_node9.SymbolKind.Class;
}
function symbolMatches(candidate, normalizedQuery) {
  if (!normalizedQuery) {
    return true;
  }
  return [
    candidate.name,
    candidate.detail,
    candidate.containerName
  ].filter((value) => Boolean(value)).some((value) => value.toLowerCase().includes(normalizedQuery));
}
function sortDocumentSymbols(symbols) {
  return symbols.sort((left, right) => {
    if (left.range.start.line !== right.range.start.line) {
      return left.range.start.line - right.range.start.line;
    }
    if (left.range.start.character !== right.range.start.character) {
      return left.range.start.character - right.range.start.character;
    }
    return left.name.localeCompare(right.name);
  });
}
function fullDocumentRange(document) {
  const lines = document.getText().split(/\r?\n/);
  const lastLine = Math.max(lines.length - 1, 0);
  return {
    end: {
      character: lines[lastLine]?.length ?? 0,
      line: lastLine
    },
    start: {
      character: 0,
      line: 0
    }
  };
}
function startRange2() {
  return {
    end: { character: 0, line: 0 },
    start: { character: 0, line: 0 }
  };
}
function pathFromUri4(uri) {
  try {
    return (0, import_node_url10.fileURLToPath)(uri);
  } catch {
    return null;
  }
}

// src/index.ts
var connection = (0, import_node10.createConnection)(import_node10.ProposedFeatures.all);
var documents = new import_node11.TextDocuments(TextDocument);
var workspaceRoot = null;
var laravelProject = false;
var implementationsEnabled = true;
var index = emptyIndex();
var indexCache = null;
var indexInFlight = null;
var indexRefreshQueued = false;
var queuedChangedFilePaths = /* @__PURE__ */ new Set();
var queuedFullRefresh = false;
var refreshTimer = null;
connection.onInitialize(async (params) => {
  workspaceRoot = resolveWorkspaceRoot(params);
  implementationsEnabled = readServerConfig(params.initializationOptions).implementationsEnabled;
  if (workspaceRoot) {
    indexCache = await loadLaravelIndexCache(workspaceRoot);
    await refreshIndex(workspaceRoot);
  }
  return {
    capabilities: {
      textDocumentSync: import_node10.TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: ["'", '"', ".", "\\", ">", ":"]
      },
      definitionProvider: true,
      implementationProvider: implementationsEnabled,
      referencesProvider: true,
      hoverProvider: true,
      inlayHintProvider: true,
      codeActionProvider: true,
      codeLensProvider: {
        resolveProvider: true
      },
      executeCommandProvider: {
        commands: [OPEN_CONCRETE_BINDING_COMMAND]
      },
      documentSymbolProvider: true,
      workspaceSymbolProvider: true,
      workspace: {
        workspaceFolders: {
          supported: true
        }
      }
    },
    serverInfo: {
      name: "Laravel Assist",
      version: "0.0.1"
    }
  };
});
connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }
  return completionsForDocument(document, params.position, index);
});
connection.onDefinition((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }
  return definitionsForDocument(document, params.position, index);
});
connection.onReferences(async (params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }
  return referencesForDocument(document, params.position, index);
});
connection.onImplementation((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject || !implementationsEnabled) {
    return [];
  }
  return implementationsForDocument(document, params.position, index);
});
connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return null;
  }
  return hoverForDocument(document, params.position, index);
});
connection.languages.inlayHint.on((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }
  return inlayHintsForDocument(document, index);
});
connection.onCodeAction((params) => {
  if (!laravelProject) {
    return [];
  }
  return codeActionsForDiagnostics(params, index, workspaceRoot, documents.get(params.textDocument.uri));
});
connection.onCodeLens((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }
  return codeLensesForDocument(document, index);
});
connection.onCodeLensResolve(async (lens) => {
  if (!laravelProject) {
    return lens;
  }
  const uri = codeLensDocumentUri(lens);
  return resolveUsageCodeLens(lens, uri ? documents.get(uri) : void 0, index);
});
connection.onExecuteCommand(async (params) => {
  if (params.command !== OPEN_CONCRETE_BINDING_COMMAND) {
    return null;
  }
  const args = params.arguments?.[0];
  if (!args?.uri || !args.selection) {
    return null;
  }
  await connection.window.showDocument({
    selection: args.selection,
    takeFocus: true,
    uri: args.uri
  });
  return null;
});
connection.onDocumentSymbol((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !laravelProject) {
    return [];
  }
  return documentSymbolsForDocument(document, index);
});
connection.onWorkspaceSymbol((params) => {
  if (!laravelProject) {
    return [];
  }
  return workspaceSymbolsForQuery(params.query, index);
});
connection.onDidChangeWatchedFiles(async (params) => {
  if (workspaceRoot) {
    scheduleRefreshIndex(
      workspaceRoot,
      params.changes.map((change) => (0, import_node_url11.fileURLToPath)(change.uri))
    );
  }
});
documents.onDidSave(async (event) => {
  if (workspaceRoot) {
    scheduleRefreshIndex(workspaceRoot, [(0, import_node_url11.fileURLToPath)(event.document.uri)]);
  }
});
documents.onDidOpen((event) => {
  publishDiagnostics(event.document);
});
documents.onDidChangeContent((event) => {
  publishDiagnostics(event.document);
});
documents.onDidClose((event) => {
  connection.sendDiagnostics({ diagnostics: [], uri: event.document.uri });
});
documents.listen(connection);
connection.listen();
function resolveWorkspaceRoot(params) {
  if (params.rootUri) {
    return (0, import_node_url11.fileURLToPath)(params.rootUri);
  }
  return params.rootPath ?? null;
}
async function refreshIndex(rootPath, changedFilePaths) {
  if (indexInFlight) {
    queueRefresh(changedFilePaths);
    indexRefreshQueued = true;
    return indexInFlight;
  }
  indexInFlight = (async () => {
    let nextChangedFilePaths = changedFilePaths;
    do {
      indexRefreshQueued = false;
      laravelProject = await isLaravelProject(rootPath);
      if (!laravelProject) {
        index = emptyIndex();
        indexCache = emptyIndexCache(rootPath);
        connection.console.info(
          "Laravel Assist is idle because this workspace does not look like a Laravel project."
        );
        continue;
      }
      const result = await buildLaravelIndex(rootPath, indexCache, {
        changedFilePaths: nextChangedFilePaths
      });
      index = result.index;
      indexCache = result.cache;
      try {
        await saveLaravelIndexCache(result.cache);
      } catch (error) {
        connection.console.warn(`Laravel Assist could not persist index cache: ${errorMessage(error)}`);
      }
      connection.console.info(
        `Laravel Assist indexed ${index.routes.length} routes, ${index.views.length} views, ${index.bladeComponents.length} Blade components, ${index.configKeys.length} config keys, ${index.envKeys.length} env keys, ${index.translationKeys.length} translation keys, ${index.containerBindings.length} container bindings, ${index.authorization.length} authorization entries, ${index.commands.length} commands, ${index.controllers.length} controllers, ${index.middleware.length} middleware aliases, ${index.facades.length} facades, ${index.providers.length} providers, ${index.macros.length} macros, ${index.factories.length} factories, ${index.seeders.length} seeders, ${index.artifacts.length} artifacts, ${index.models.length} models, ${index.schemaTables.length} schema tables, and ${index.validationRules.length} validation rule sets. Reused ${result.stats.reusedFiles}/${result.stats.discoveredFiles} files, reindexed ${result.stats.indexedFiles}, removed ${result.stats.removedFiles}.`
      );
      publishAllDiagnostics();
      nextChangedFilePaths = takeQueuedChangedFilePaths();
    } while (indexRefreshQueued);
  })().finally(() => {
    indexInFlight = null;
  });
  return indexInFlight;
}
function scheduleRefreshIndex(rootPath, changedFilePaths) {
  queueRefresh(changedFilePaths);
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    void refreshIndex(rootPath, takeQueuedChangedFilePaths());
  }, 250);
}
function queueRefresh(changedFilePaths) {
  if (!changedFilePaths?.length) {
    queuedFullRefresh = true;
    queuedChangedFilePaths.clear();
    return;
  }
  if (queuedFullRefresh) {
    return;
  }
  for (const filePath of changedFilePaths) {
    queuedChangedFilePaths.add(filePath);
  }
}
function takeQueuedChangedFilePaths() {
  if (queuedFullRefresh) {
    queuedFullRefresh = false;
    queuedChangedFilePaths.clear();
    return void 0;
  }
  if (queuedChangedFilePaths.size === 0) {
    return void 0;
  }
  const changedFilePaths = [...queuedChangedFilePaths];
  queuedChangedFilePaths.clear();
  return changedFilePaths;
}
function publishDiagnostics(document) {
  connection.sendDiagnostics({
    diagnostics: laravelProject ? diagnosticsForDocument(document, index, workspaceRoot) : [],
    uri: document.uri
  });
}
function publishAllDiagnostics() {
  for (const document of documents.all()) {
    publishDiagnostics(document);
  }
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
