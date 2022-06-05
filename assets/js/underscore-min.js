var VERSION = "1.13.3",
  root =
    ("object" == typeof self && self.self === self && self) ||
    ("object" == typeof global && global.global === global && global) ||
    Function("return this")() ||
    {},
  ArrayProto = Array.prototype,
  ObjProto = Object.prototype,
  SymbolProto = "undefined" != typeof Symbol ? Symbol.prototype : null,
  push = ArrayProto.push,
  slice = ArrayProto.slice,
  toString = ObjProto.toString,
  hasOwnProperty = ObjProto.hasOwnProperty,
  supportsArrayBuffer = "undefined" != typeof ArrayBuffer,
  supportsDataView = "undefined" != typeof DataView,
  nativeIsArray = Array.isArray,
  nativeKeys = Object.keys,
  nativeCreate = Object.create,
  nativeIsView = supportsArrayBuffer && ArrayBuffer.isView,
  _isNaN = isNaN,
  _isFinite = isFinite,
  hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
  nonEnumerableProps = [
    "valueOf",
    "isPrototypeOf",
    "toString",
    "propertyIsEnumerable",
    "hasOwnProperty",
    "toLocaleString",
  ],
  MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
function restArguments(e, t) {
  return (
    (t = null == t ? e.length - 1 : +t),
    function () {
      for (
        var n = Math.max(arguments.length - t, 0), r = Array(n), i = 0;
        i < n;
        i++
      )
        r[i] = arguments[i + t];
      switch (t) {
        case 0:
          return e.call(this, r);
        case 1:
          return e.call(this, arguments[0], r);
        case 2:
          return e.call(this, arguments[0], arguments[1], r);
      }
      var a = Array(t + 1);
      for (i = 0; i < t; i++) a[i] = arguments[i];
      return (a[t] = r), e.apply(this, a);
    }
  );
}
function isObject(e) {
  var t = typeof e;
  return "function" === t || ("object" === t && !!e);
}
function isNull(e) {
  return null === e;
}
function isUndefined(e) {
  return void 0 === e;
}
function isBoolean(e) {
  return !0 === e || !1 === e || "[object Boolean]" === toString.call(e);
}
function isElement(e) {
  return !(!e || 1 !== e.nodeType);
}
function tagTester(e) {
  var t = "[object " + e + "]";
  return function (e) {
    return toString.call(e) === t;
  };
}
var isString = tagTester("String"),
  isNumber = tagTester("Number"),
  isDate = tagTester("Date"),
  isRegExp = tagTester("RegExp"),
  isError = tagTester("Error"),
  isSymbol = tagTester("Symbol"),
  isArrayBuffer = tagTester("ArrayBuffer"),
  isFunction = tagTester("Function"),
  nodelist = root.document && root.document.childNodes;
"function" != typeof /./ &&
  "object" != typeof Int8Array &&
  "function" != typeof nodelist &&
  (isFunction = function (e) {
    return "function" == typeof e || !1;
  });
var isFunction$1 = isFunction,
  hasObjectTag = tagTester("Object"),
  hasStringTagBug =
    supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8))),
  isIE11 = "undefined" != typeof Map && hasObjectTag(new Map()),
  isDataView = tagTester("DataView");
function ie10IsDataView(e) {
  return null != e && isFunction$1(e.getInt8) && isArrayBuffer(e.buffer);
}
var isDataView$1 = hasStringTagBug ? ie10IsDataView : isDataView,
  isArray = nativeIsArray || tagTester("Array");
function has$1(e, t) {
  return null != e && hasOwnProperty.call(e, t);
}
var isArguments = tagTester("Arguments");
!(function () {
  isArguments(arguments) ||
    (isArguments = function (e) {
      return has$1(e, "callee");
    });
})();
var isArguments$1 = isArguments;
function isFinite$1(e) {
  return !isSymbol(e) && _isFinite(e) && !isNaN(parseFloat(e));
}
function isNaN$1(e) {
  return isNumber(e) && _isNaN(e);
}
function constant(e) {
  return function () {
    return e;
  };
}
function createSizePropertyCheck(e) {
  return function (t) {
    var n = e(t);
    return "number" == typeof n && n >= 0 && n <= MAX_ARRAY_INDEX;
  };
}
function shallowProperty(e) {
  return function (t) {
    return null == t ? void 0 : t[e];
  };
}
var getByteLength = shallowProperty("byteLength"),
  isBufferLike = createSizePropertyCheck(getByteLength),
  typedArrayPattern =
    /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(e) {
  return nativeIsView
    ? nativeIsView(e) && !isDataView$1(e)
    : isBufferLike(e) && typedArrayPattern.test(toString.call(e));
}
var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(!1),
  getLength = shallowProperty("length");
function emulatedSet(e) {
  for (var t = {}, n = e.length, r = 0; r < n; ++r) t[e[r]] = !0;
  return {
    contains: function (e) {
      return !0 === t[e];
    },
    push: function (n) {
      return (t[n] = !0), e.push(n);
    },
  };
}
function collectNonEnumProps(e, t) {
  t = emulatedSet(t);
  var n = nonEnumerableProps.length,
    r = e.constructor,
    i = (isFunction$1(r) && r.prototype) || ObjProto,
    a = "constructor";
  for (has$1(e, a) && !t.contains(a) && t.push(a); n--; )
    (a = nonEnumerableProps[n]) in e &&
      e[a] !== i[a] &&
      !t.contains(a) &&
      t.push(a);
}
function keys(e) {
  if (!isObject(e)) return [];
  if (nativeKeys) return nativeKeys(e);
  var t = [];
  for (var n in e) has$1(e, n) && t.push(n);
  return hasEnumBug && collectNonEnumProps(e, t), t;
}
function isEmpty(e) {
  if (null == e) return !0;
  var t = getLength(e);
  return "number" == typeof t && (isArray(e) || isString(e) || isArguments$1(e))
    ? 0 === t
    : 0 === getLength(keys(e));
}
function isMatch(e, t) {
  var n = keys(t),
    r = n.length;
  if (null == e) return !r;
  for (var i = Object(e), a = 0; a < r; a++) {
    var u = n[a];
    if (t[u] !== i[u] || !(u in i)) return !1;
  }
  return !0;
}
function _$1(e) {
  return e instanceof _$1
    ? e
    : this instanceof _$1
    ? void (this._wrapped = e)
    : new _$1(e);
}
function toBufferView(e) {
  return new Uint8Array(e.buffer || e, e.byteOffset || 0, getByteLength(e));
}
(_$1.VERSION = VERSION),
  (_$1.prototype.value = function () {
    return this._wrapped;
  }),
  (_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value),
  (_$1.prototype.toString = function () {
    return String(this._wrapped);
  });
var tagDataView = "[object DataView]";
function eq(e, t, n, r) {
  if (e === t) return 0 !== e || 1 / e == 1 / t;
  if (null == e || null == t) return !1;
  if (e != e) return t != t;
  var i = typeof e;
  return (
    ("function" === i || "object" === i || "object" == typeof t) &&
    deepEq(e, t, n, r)
  );
}
function deepEq(e, t, n, r) {
  e instanceof _$1 && (e = e._wrapped), t instanceof _$1 && (t = t._wrapped);
  var i = toString.call(e);
  if (i !== toString.call(t)) return !1;
  if (hasStringTagBug && "[object Object]" == i && isDataView$1(e)) {
    if (!isDataView$1(t)) return !1;
    i = tagDataView;
  }
  switch (i) {
    case "[object RegExp]":
    case "[object String]":
      return "" + e == "" + t;
    case "[object Number]":
      return +e != +e ? +t != +t : 0 == +e ? 1 / +e == 1 / t : +e == +t;
    case "[object Date]":
    case "[object Boolean]":
      return +e == +t;
    case "[object Symbol]":
      return SymbolProto.valueOf.call(e) === SymbolProto.valueOf.call(t);
    case "[object ArrayBuffer]":
    case tagDataView:
      return deepEq(toBufferView(e), toBufferView(t), n, r);
  }
  var a = "[object Array]" === i;
  if (!a && isTypedArray$1(e)) {
    if (getByteLength(e) !== getByteLength(t)) return !1;
    if (e.buffer === t.buffer && e.byteOffset === t.byteOffset) return !0;
    a = !0;
  }
  if (!a) {
    if ("object" != typeof e || "object" != typeof t) return !1;
    var u = e.constructor,
      o = t.constructor;
    if (
      u !== o &&
      !(
        isFunction$1(u) &&
        u instanceof u &&
        isFunction$1(o) &&
        o instanceof o
      ) &&
      "constructor" in e &&
      "constructor" in t
    )
      return !1;
  }
  r = r || [];
  for (var s = (n = n || []).length; s--; ) if (n[s] === e) return r[s] === t;
  if ((n.push(e), r.push(t), a)) {
    if ((s = e.length) !== t.length) return !1;
    for (; s--; ) if (!eq(e[s], t[s], n, r)) return !1;
  } else {
    var c,
      f = keys(e);
    if (((s = f.length), keys(t).length !== s)) return !1;
    for (; s--; ) if (!has$1(t, (c = f[s])) || !eq(e[c], t[c], n, r)) return !1;
  }
  return n.pop(), r.pop(), !0;
}
function isEqual(e, t) {
  return eq(e, t);
}
function allKeys(e) {
  if (!isObject(e)) return [];
  var t = [];
  for (var n in e) t.push(n);
  return hasEnumBug && collectNonEnumProps(e, t), t;
}
function ie11fingerprint(e) {
  var t = getLength(e);
  return function (n) {
    if (null == n) return !1;
    var r = allKeys(n);
    if (getLength(r)) return !1;
    for (var i = 0; i < t; i++) if (!isFunction$1(n[e[i]])) return !1;
    return e !== weakMapMethods || !isFunction$1(n[forEachName]);
  };
}
var forEachName = "forEach",
  hasName = "has",
  commonInit = ["clear", "delete"],
  mapTail = ["get", hasName, "set"],
  mapMethods = commonInit.concat(forEachName, mapTail),
  weakMapMethods = commonInit.concat(mapTail),
  setMethods = ["add"].concat(commonInit, forEachName, hasName),
  isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map"),
  isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap"),
  isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set"),
  isWeakSet = tagTester("WeakSet");
function values(e) {
  for (var t = keys(e), n = t.length, r = Array(n), i = 0; i < n; i++)
    r[i] = e[t[i]];
  return r;
}
function pairs(e) {
  for (var t = keys(e), n = t.length, r = Array(n), i = 0; i < n; i++)
    r[i] = [t[i], e[t[i]]];
  return r;
}
function invert(e) {
  for (var t = {}, n = keys(e), r = 0, i = n.length; r < i; r++)
    t[e[n[r]]] = n[r];
  return t;
}
function functions(e) {
  var t = [];
  for (var n in e) isFunction$1(e[n]) && t.push(n);
  return t.sort();
}
function createAssigner(e, t) {
  return function (n) {
    var r = arguments.length;
    if ((t && (n = Object(n)), r < 2 || null == n)) return n;
    for (var i = 1; i < r; i++)
      for (var a = arguments[i], u = e(a), o = u.length, s = 0; s < o; s++) {
        var c = u[s];
        (t && void 0 !== n[c]) || (n[c] = a[c]);
      }
    return n;
  };
}
var extend = createAssigner(allKeys),
  extendOwn = createAssigner(keys),
  defaults = createAssigner(allKeys, !0);
function ctor() {
  return function () {};
}
function baseCreate(e) {
  if (!isObject(e)) return {};
  if (nativeCreate) return nativeCreate(e);
  var t = ctor();
  t.prototype = e;
  var n = new t();
  return (t.prototype = null), n;
}
function create(e, t) {
  var n = baseCreate(e);
  return t && extendOwn(n, t), n;
}
function clone(e) {
  return isObject(e) ? (isArray(e) ? e.slice() : extend({}, e)) : e;
}
function tap(e, t) {
  return t(e), e;
}
function toPath$1(e) {
  return isArray(e) ? e : [e];
}
function toPath(e) {
  return _$1.toPath(e);
}
function deepGet(e, t) {
  for (var n = t.length, r = 0; r < n; r++) {
    if (null == e) return;
    e = e[t[r]];
  }
  return n ? e : void 0;
}
function get(e, t, n) {
  var r = deepGet(e, toPath(t));
  return isUndefined(r) ? n : r;
}
function has(e, t) {
  for (var n = (t = toPath(t)).length, r = 0; r < n; r++) {
    var i = t[r];
    if (!has$1(e, i)) return !1;
    e = e[i];
  }
  return !!n;
}
function identity(e) {
  return e;
}
function matcher(e) {
  return (
    (e = extendOwn({}, e)),
    function (t) {
      return isMatch(t, e);
    }
  );
}
function property(e) {
  return (
    (e = toPath(e)),
    function (t) {
      return deepGet(t, e);
    }
  );
}
function optimizeCb(e, t, n) {
  if (void 0 === t) return e;
  switch (null == n ? 3 : n) {
    case 1:
      return function (n) {
        return e.call(t, n);
      };
    case 3:
      return function (n, r, i) {
        return e.call(t, n, r, i);
      };
    case 4:
      return function (n, r, i, a) {
        return e.call(t, n, r, i, a);
      };
  }
  return function () {
    return e.apply(t, arguments);
  };
}
function baseIteratee(e, t, n) {
  return null == e
    ? identity
    : isFunction$1(e)
    ? optimizeCb(e, t, n)
    : isObject(e) && !isArray(e)
    ? matcher(e)
    : property(e);
}
function iteratee(e, t) {
  return baseIteratee(e, t, 1 / 0);
}
function cb(e, t, n) {
  return _$1.iteratee !== iteratee ? _$1.iteratee(e, t) : baseIteratee(e, t, n);
}
function mapObject(e, t, n) {
  t = cb(t, n);
  for (var r = keys(e), i = r.length, a = {}, u = 0; u < i; u++) {
    var o = r[u];
    a[o] = t(e[o], o, e);
  }
  return a;
}
function noop() {}
function propertyOf(e) {
  return null == e
    ? noop
    : function (t) {
        return get(e, t);
      };
}
function times(e, t, n) {
  var r = Array(Math.max(0, e));
  t = optimizeCb(t, n, 1);
  for (var i = 0; i < e; i++) r[i] = t(i);
  return r;
}
function random(e, t) {
  return (
    null == t && ((t = e), (e = 0)), e + Math.floor(Math.random() * (t - e + 1))
  );
}
(_$1.toPath = toPath$1), (_$1.iteratee = iteratee);
var now =
  Date.now ||
  function () {
    return new Date().getTime();
  };
function createEscaper(e) {
  var t = function (t) {
      return e[t];
    },
    n = "(?:" + keys(e).join("|") + ")",
    r = RegExp(n),
    i = RegExp(n, "g");
  return function (e) {
    return (e = null == e ? "" : "" + e), r.test(e) ? e.replace(i, t) : e;
  };
}
var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
  },
  _escape = createEscaper(escapeMap),
  unescapeMap = invert(escapeMap),
  _unescape = createEscaper(unescapeMap),
  templateSettings = (_$1.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g,
  }),
  noMatch = /(.)^/,
  escapes = {
    "'": "'",
    "\\": "\\",
    "\r": "r",
    "\n": "n",
    "\u2028": "u2028",
    "\u2029": "u2029",
  },
  escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
function escapeChar(e) {
  return "\\" + escapes[e];
}
var bareIdentifier = /^\s*(\w|\$)+\s*$/;
function template(e, t, n) {
  !t && n && (t = n), (t = defaults({}, t, _$1.templateSettings));
  var r = RegExp(
      [
        (t.escape || noMatch).source,
        (t.interpolate || noMatch).source,
        (t.evaluate || noMatch).source,
      ].join("|") + "|$",
      "g"
    ),
    i = 0,
    a = "__p+='";
  e.replace(r, function (t, n, r, u, o) {
    return (
      (a += e.slice(i, o).replace(escapeRegExp, escapeChar)),
      (i = o + t.length),
      n
        ? (a += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'")
        : r
        ? (a += "'+\n((__t=(" + r + "))==null?'':__t)+\n'")
        : u && (a += "';\n" + u + "\n__p+='"),
      t
    );
  }),
    (a += "';\n");
  var u,
    o = t.variable;
  if (o) {
    if (!bareIdentifier.test(o))
      throw new Error("variable is not a bare identifier: " + o);
  } else (a = "with(obj||{}){\n" + a + "}\n"), (o = "obj");
  a =
    "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    a +
    "return __p;\n";
  try {
    u = new Function(o, "_", a);
  } catch (e) {
    throw ((e.source = a), e);
  }
  var s = function (e) {
    return u.call(this, e, _$1);
  };
  return (s.source = "function(" + o + "){\n" + a + "}"), s;
}
function result(e, t, n) {
  var r = (t = toPath(t)).length;
  if (!r) return isFunction$1(n) ? n.call(e) : n;
  for (var i = 0; i < r; i++) {
    var a = null == e ? void 0 : e[t[i]];
    void 0 === a && ((a = n), (i = r)), (e = isFunction$1(a) ? a.call(e) : a);
  }
  return e;
}
var idCounter = 0;
function uniqueId(e) {
  var t = ++idCounter + "";
  return e ? e + t : t;
}
function chain(e) {
  var t = _$1(e);
  return (t._chain = !0), t;
}
function executeBound(e, t, n, r, i) {
  if (!(r instanceof t)) return e.apply(n, i);
  var a = baseCreate(e.prototype),
    u = e.apply(a, i);
  return isObject(u) ? u : a;
}
var partial = restArguments(function (e, t) {
  var n = partial.placeholder,
    r = function () {
      for (var i = 0, a = t.length, u = Array(a), o = 0; o < a; o++)
        u[o] = t[o] === n ? arguments[i++] : t[o];
      for (; i < arguments.length; ) u.push(arguments[i++]);
      return executeBound(e, r, this, this, u);
    };
  return r;
});
partial.placeholder = _$1;
var bind = restArguments(function (e, t, n) {
    if (!isFunction$1(e))
      throw new TypeError("Bind must be called on a function");
    var r = restArguments(function (i) {
      return executeBound(e, r, t, this, n.concat(i));
    });
    return r;
  }),
  isArrayLike = createSizePropertyCheck(getLength);
function flatten$1(e, t, n, r) {
  if (((r = r || []), t || 0 === t)) {
    if (t <= 0) return r.concat(e);
  } else t = 1 / 0;
  for (var i = r.length, a = 0, u = getLength(e); a < u; a++) {
    var o = e[a];
    if (isArrayLike(o) && (isArray(o) || isArguments$1(o)))
      if (t > 1) flatten$1(o, t - 1, n, r), (i = r.length);
      else for (var s = 0, c = o.length; s < c; ) r[i++] = o[s++];
    else n || (r[i++] = o);
  }
  return r;
}
var bindAll = restArguments(function (e, t) {
  var n = (t = flatten$1(t, !1, !1)).length;
  if (n < 1) throw new Error("bindAll must be passed function names");
  for (; n--; ) {
    var r = t[n];
    e[r] = bind(e[r], e);
  }
  return e;
});
function memoize(e, t) {
  var n = function (r) {
    var i = n.cache,
      a = "" + (t ? t.apply(this, arguments) : r);
    return has$1(i, a) || (i[a] = e.apply(this, arguments)), i[a];
  };
  return (n.cache = {}), n;
}
var delay = restArguments(function (e, t, n) {
    return setTimeout(function () {
      return e.apply(null, n);
    }, t);
  }),
  defer = partial(delay, _$1, 1);
function throttle(e, t, n) {
  var r,
    i,
    a,
    u,
    o = 0;
  n || (n = {});
  var s = function () {
      (o = !1 === n.leading ? 0 : now()),
        (r = null),
        (u = e.apply(i, a)),
        r || (i = a = null);
    },
    c = function () {
      var c = now();
      o || !1 !== n.leading || (o = c);
      var f = t - (c - o);
      return (
        (i = this),
        (a = arguments),
        f <= 0 || f > t
          ? (r && (clearTimeout(r), (r = null)),
            (o = c),
            (u = e.apply(i, a)),
            r || (i = a = null))
          : r || !1 === n.trailing || (r = setTimeout(s, f)),
        u
      );
    };
  return (
    (c.cancel = function () {
      clearTimeout(r), (o = 0), (r = i = a = null);
    }),
    c
  );
}
function debounce(e, t, n) {
  var r,
    i,
    a,
    u,
    o,
    s = function () {
      var c = now() - i;
      t > c
        ? (r = setTimeout(s, t - c))
        : ((r = null), n || (u = e.apply(o, a)), r || (a = o = null));
    },
    c = restArguments(function (c) {
      return (
        (o = this),
        (a = c),
        (i = now()),
        r || ((r = setTimeout(s, t)), n && (u = e.apply(o, a))),
        u
      );
    });
  return (
    (c.cancel = function () {
      clearTimeout(r), (r = a = o = null);
    }),
    c
  );
}
function wrap(e, t) {
  return partial(t, e);
}
function negate(e) {
  return function () {
    return !e.apply(this, arguments);
  };
}
function compose() {
  var e = arguments,
    t = e.length - 1;
  return function () {
    for (var n = t, r = e[t].apply(this, arguments); n--; )
      r = e[n].call(this, r);
    return r;
  };
}
function after(e, t) {
  return function () {
    if (--e < 1) return t.apply(this, arguments);
  };
}
function before(e, t) {
  var n;
  return function () {
    return --e > 0 && (n = t.apply(this, arguments)), e <= 1 && (t = null), n;
  };
}
var once = partial(before, 2);
function findKey(e, t, n) {
  t = cb(t, n);
  for (var r, i = keys(e), a = 0, u = i.length; a < u; a++)
    if (t(e[(r = i[a])], r, e)) return r;
}
function createPredicateIndexFinder(e) {
  return function (t, n, r) {
    n = cb(n, r);
    for (var i = getLength(t), a = e > 0 ? 0 : i - 1; a >= 0 && a < i; a += e)
      if (n(t[a], a, t)) return a;
    return -1;
  };
}
var findIndex = createPredicateIndexFinder(1),
  findLastIndex = createPredicateIndexFinder(-1);
function sortedIndex(e, t, n, r) {
  for (var i = (n = cb(n, r, 1))(t), a = 0, u = getLength(e); a < u; ) {
    var o = Math.floor((a + u) / 2);
    n(e[o]) < i ? (a = o + 1) : (u = o);
  }
  return a;
}
function createIndexFinder(e, t, n) {
  return function (r, i, a) {
    var u = 0,
      o = getLength(r);
    if ("number" == typeof a)
      e > 0
        ? (u = a >= 0 ? a : Math.max(a + o, u))
        : (o = a >= 0 ? Math.min(a + 1, o) : a + o + 1);
    else if (n && a && o) return r[(a = n(r, i))] === i ? a : -1;
    if (i != i) return (a = t(slice.call(r, u, o), isNaN$1)) >= 0 ? a + u : -1;
    for (a = e > 0 ? u : o - 1; a >= 0 && a < o; a += e)
      if (r[a] === i) return a;
    return -1;
  };
}
var indexOf = createIndexFinder(1, findIndex, sortedIndex),
  lastIndexOf = createIndexFinder(-1, findLastIndex);
function find(e, t, n) {
  var r = (isArrayLike(e) ? findIndex : findKey)(e, t, n);
  if (void 0 !== r && -1 !== r) return e[r];
}
function findWhere(e, t) {
  return find(e, matcher(t));
}
function each(e, t, n) {
  var r, i;
  if (((t = optimizeCb(t, n)), isArrayLike(e)))
    for (r = 0, i = e.length; r < i; r++) t(e[r], r, e);
  else {
    var a = keys(e);
    for (r = 0, i = a.length; r < i; r++) t(e[a[r]], a[r], e);
  }
  return e;
}
function map(e, t, n) {
  t = cb(t, n);
  for (
    var r = !isArrayLike(e) && keys(e),
      i = (r || e).length,
      a = Array(i),
      u = 0;
    u < i;
    u++
  ) {
    var o = r ? r[u] : u;
    a[u] = t(e[o], o, e);
  }
  return a;
}
function createReduce(e) {
  var t = function (t, n, r, i) {
    var a = !isArrayLike(t) && keys(t),
      u = (a || t).length,
      o = e > 0 ? 0 : u - 1;
    for (i || ((r = t[a ? a[o] : o]), (o += e)); o >= 0 && o < u; o += e) {
      var s = a ? a[o] : o;
      r = n(r, t[s], s, t);
    }
    return r;
  };
  return function (e, n, r, i) {
    var a = arguments.length >= 3;
    return t(e, optimizeCb(n, i, 4), r, a);
  };
}
var reduce = createReduce(1),
  reduceRight = createReduce(-1);
function filter(e, t, n) {
  var r = [];
  return (
    (t = cb(t, n)),
    each(e, function (e, n, i) {
      t(e, n, i) && r.push(e);
    }),
    r
  );
}
function reject(e, t, n) {
  return filter(e, negate(cb(t)), n);
}
function every(e, t, n) {
  t = cb(t, n);
  for (
    var r = !isArrayLike(e) && keys(e), i = (r || e).length, a = 0;
    a < i;
    a++
  ) {
    var u = r ? r[a] : a;
    if (!t(e[u], u, e)) return !1;
  }
  return !0;
}
function some(e, t, n) {
  t = cb(t, n);
  for (
    var r = !isArrayLike(e) && keys(e), i = (r || e).length, a = 0;
    a < i;
    a++
  ) {
    var u = r ? r[a] : a;
    if (t(e[u], u, e)) return !0;
  }
  return !1;
}
function contains(e, t, n, r) {
  return (
    isArrayLike(e) || (e = values(e)),
    ("number" != typeof n || r) && (n = 0),
    indexOf(e, t, n) >= 0
  );
}
var invoke = restArguments(function (e, t, n) {
  var r, i;
  return (
    isFunction$1(t)
      ? (i = t)
      : ((t = toPath(t)), (r = t.slice(0, -1)), (t = t[t.length - 1])),
    map(e, function (e) {
      var a = i;
      if (!a) {
        if ((r && r.length && (e = deepGet(e, r)), null == e)) return;
        a = e[t];
      }
      return null == a ? a : a.apply(e, n);
    })
  );
});
function pluck(e, t) {
  return map(e, property(t));
}
function where(e, t) {
  return filter(e, matcher(t));
}
function max(e, t, n) {
  var r,
    i,
    a = -1 / 0,
    u = -1 / 0;
  if (
    null == t ||
    ("number" == typeof t && "object" != typeof e[0] && null != e)
  )
    for (var o = 0, s = (e = isArrayLike(e) ? e : values(e)).length; o < s; o++)
      null != (r = e[o]) && r > a && (a = r);
  else
    (t = cb(t, n)),
      each(e, function (e, n, r) {
        ((i = t(e, n, r)) > u || (i === -1 / 0 && a === -1 / 0)) &&
          ((a = e), (u = i));
      });
  return a;
}
function min(e, t, n) {
  var r,
    i,
    a = 1 / 0,
    u = 1 / 0;
  if (
    null == t ||
    ("number" == typeof t && "object" != typeof e[0] && null != e)
  )
    for (var o = 0, s = (e = isArrayLike(e) ? e : values(e)).length; o < s; o++)
      null != (r = e[o]) && r < a && (a = r);
  else
    (t = cb(t, n)),
      each(e, function (e, n, r) {
        ((i = t(e, n, r)) < u || (i === 1 / 0 && a === 1 / 0)) &&
          ((a = e), (u = i));
      });
  return a;
}
var reStrSymbol =
  /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(e) {
  return e
    ? isArray(e)
      ? slice.call(e)
      : isString(e)
      ? e.match(reStrSymbol)
      : isArrayLike(e)
      ? map(e, identity)
      : values(e)
    : [];
}
function sample(e, t, n) {
  if (null == t || n)
    return isArrayLike(e) || (e = values(e)), e[random(e.length - 1)];
  var r = toArray(e),
    i = getLength(r);
  t = Math.max(Math.min(t, i), 0);
  for (var a = i - 1, u = 0; u < t; u++) {
    var o = random(u, a),
      s = r[u];
    (r[u] = r[o]), (r[o] = s);
  }
  return r.slice(0, t);
}
function shuffle(e) {
  return sample(e, 1 / 0);
}
function sortBy(e, t, n) {
  var r = 0;
  return (
    (t = cb(t, n)),
    pluck(
      map(e, function (e, n, i) {
        return { value: e, index: r++, criteria: t(e, n, i) };
      }).sort(function (e, t) {
        var n = e.criteria,
          r = t.criteria;
        if (n !== r) {
          if (n > r || void 0 === n) return 1;
          if (n < r || void 0 === r) return -1;
        }
        return e.index - t.index;
      }),
      "value"
    )
  );
}
function group(e, t) {
  return function (n, r, i) {
    var a = t ? [[], []] : {};
    return (
      (r = cb(r, i)),
      each(n, function (t, i) {
        var u = r(t, i, n);
        e(a, t, u);
      }),
      a
    );
  };
}
var groupBy = group(function (e, t, n) {
    has$1(e, n) ? e[n].push(t) : (e[n] = [t]);
  }),
  indexBy = group(function (e, t, n) {
    e[n] = t;
  }),
  countBy = group(function (e, t, n) {
    has$1(e, n) ? e[n]++ : (e[n] = 1);
  }),
  partition = group(function (e, t, n) {
    e[n ? 0 : 1].push(t);
  }, !0);
function size(e) {
  return null == e ? 0 : isArrayLike(e) ? e.length : keys(e).length;
}
function keyInObj(e, t, n) {
  return t in n;
}
var pick = restArguments(function (e, t) {
    var n = {},
      r = t[0];
    if (null == e) return n;
    isFunction$1(r)
      ? (t.length > 1 && (r = optimizeCb(r, t[1])), (t = allKeys(e)))
      : ((r = keyInObj), (t = flatten$1(t, !1, !1)), (e = Object(e)));
    for (var i = 0, a = t.length; i < a; i++) {
      var u = t[i],
        o = e[u];
      r(o, u, e) && (n[u] = o);
    }
    return n;
  }),
  omit = restArguments(function (e, t) {
    var n,
      r = t[0];
    return (
      isFunction$1(r)
        ? ((r = negate(r)), t.length > 1 && (n = t[1]))
        : ((t = map(flatten$1(t, !1, !1), String)),
          (r = function (e, n) {
            return !contains(t, n);
          })),
      pick(e, r, n)
    );
  });
function initial(e, t, n) {
  return slice.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t)));
}
function first(e, t, n) {
  return null == e || e.length < 1
    ? null == t || n
      ? void 0
      : []
    : null == t || n
    ? e[0]
    : initial(e, e.length - t);
}
function rest(e, t, n) {
  return slice.call(e, null == t || n ? 1 : t);
}
function last(e, t, n) {
  return null == e || e.length < 1
    ? null == t || n
      ? void 0
      : []
    : null == t || n
    ? e[e.length - 1]
    : rest(e, Math.max(0, e.length - t));
}
function compact(e) {
  return filter(e, Boolean);
}
function flatten(e, t) {
  return flatten$1(e, t, !1);
}
var difference = restArguments(function (e, t) {
    return (
      (t = flatten$1(t, !0, !0)),
      filter(e, function (e) {
        return !contains(t, e);
      })
    );
  }),
  without = restArguments(function (e, t) {
    return difference(e, t);
  });
function uniq(e, t, n, r) {
  isBoolean(t) || ((r = n), (n = t), (t = !1)), null != n && (n = cb(n, r));
  for (var i = [], a = [], u = 0, o = getLength(e); u < o; u++) {
    var s = e[u],
      c = n ? n(s, u, e) : s;
    t && !n
      ? ((u && a === c) || i.push(s), (a = c))
      : n
      ? contains(a, c) || (a.push(c), i.push(s))
      : contains(i, s) || i.push(s);
  }
  return i;
}
var union = restArguments(function (e) {
  return uniq(flatten$1(e, !0, !0));
});
function intersection(e) {
  for (var t = [], n = arguments.length, r = 0, i = getLength(e); r < i; r++) {
    var a = e[r];
    if (!contains(t, a)) {
      var u;
      for (u = 1; u < n && contains(arguments[u], a); u++);
      u === n && t.push(a);
    }
  }
  return t;
}
function unzip(e) {
  for (
    var t = (e && max(e, getLength).length) || 0, n = Array(t), r = 0;
    r < t;
    r++
  )
    n[r] = pluck(e, r);
  return n;
}
var zip = restArguments(unzip);
function object(e, t) {
  for (var n = {}, r = 0, i = getLength(e); r < i; r++)
    t ? (n[e[r]] = t[r]) : (n[e[r][0]] = e[r][1]);
  return n;
}
function range(e, t, n) {
  null == t && ((t = e || 0), (e = 0)), n || (n = t < e ? -1 : 1);
  for (
    var r = Math.max(Math.ceil((t - e) / n), 0), i = Array(r), a = 0;
    a < r;
    a++, e += n
  )
    i[a] = e;
  return i;
}
function chunk(e, t) {
  if (null == t || t < 1) return [];
  for (var n = [], r = 0, i = e.length; r < i; )
    n.push(slice.call(e, r, (r += t)));
  return n;
}
function chainResult(e, t) {
  return e._chain ? _$1(t).chain() : t;
}
function mixin(e) {
  return (
    each(functions(e), function (t) {
      var n = (_$1[t] = e[t]);
      _$1.prototype[t] = function () {
        var e = [this._wrapped];
        return push.apply(e, arguments), chainResult(this, n.apply(_$1, e));
      };
    }),
    _$1
  );
}
each(
  ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
  function (e) {
    var t = ArrayProto[e];
    _$1.prototype[e] = function () {
      var n = this._wrapped;
      return (
        null != n &&
          (t.apply(n, arguments),
          ("shift" !== e && "splice" !== e) || 0 !== n.length || delete n[0]),
        chainResult(this, n)
      );
    };
  }
),
  each(["concat", "join", "slice"], function (e) {
    var t = ArrayProto[e];
    _$1.prototype[e] = function () {
      var e = this._wrapped;
      return null != e && (e = t.apply(e, arguments)), chainResult(this, e);
    };
  });
var allExports = {
    __proto__: null,
    VERSION: VERSION,
    restArguments: restArguments,
    isObject: isObject,
    isNull: isNull,
    isUndefined: isUndefined,
    isBoolean: isBoolean,
    isElement: isElement,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isArrayBuffer: isArrayBuffer,
    isDataView: isDataView$1,
    isArray: isArray,
    isFunction: isFunction$1,
    isArguments: isArguments$1,
    isFinite: isFinite$1,
    isNaN: isNaN$1,
    isTypedArray: isTypedArray$1,
    isEmpty: isEmpty,
    isMatch: isMatch,
    isEqual: isEqual,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    keys: keys,
    allKeys: allKeys,
    values: values,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    get: get,
    has: has,
    mapObject: mapObject,
    identity: identity,
    constant: constant,
    noop: noop,
    toPath: toPath$1,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: _escape,
    unescape: _unescape,
    templateSettings: templateSettings,
    template: template,
    result: result,
    uniqueId: uniqueId,
    chain: chain,
    iteratee: iteratee,
    partial: partial,
    bind: bind,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    findKey: findKey,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    find: find,
    detect: find,
    findWhere: findWhere,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    partition: partition,
    toArray: toArray,
    size: size,
    pick: pick,
    omit: omit,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    transpose: unzip,
    zip: zip,
    object: object,
    range: range,
    chunk: chunk,
    mixin: mixin,
    default: _$1,
  },
  _ = mixin(allExports);
_._ = _;
export default _;
// export {
  VERSION,
  after,
  every as all,
  allKeys,
  some as any,
  extendOwn as assign,
  before,
  bind,
  bindAll,
  chain,
  chunk,
  clone,
  map as collect,
  compact,
  compose,
  constant,
  contains,
  countBy,
  create,
  debounce,
  defaults,
  defer,
  delay,
  find as detect,
  difference,
  rest as drop,
  each,
  _escape as escape,
  every,
  extend,
  extendOwn,
  filter,
  find,
  findIndex,
  findKey,
  findLastIndex,
  findWhere,
  first,
  flatten,
  reduce as foldl,
  reduceRight as foldr,
  each as forEach,
  functions,
  get,
  groupBy,
  has,
  first as head,
  identity,
  contains as include,
  contains as includes,
  indexBy,
  indexOf,
  initial,
  reduce as inject,
  intersection,
  invert,
  invoke,
  isArguments$1 as isArguments,
  isArray,
  isArrayBuffer,
  isBoolean,
  isDataView$1 as isDataView,
  isDate,
  isElement,
  isEmpty,
  isEqual,
  isError,
  isFinite$1 as isFinite,
  isFunction$1 as isFunction,
  isMap,
  isMatch,
  isNaN$1 as isNaN,
  isNull,
  isNumber,
  isObject,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isTypedArray$1 as isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  iteratee,
  keys,
  last,
  lastIndexOf,
  map,
  mapObject,
  matcher,
  matcher as matches,
  max,
  memoize,
  functions as methods,
  min,
  mixin,
  negate,
  noop,
  now,
  object,
  omit,
  once,
  pairs,
  partial,
  partition,
  pick,
  pluck,
  property,
  propertyOf,
  random,
  range,
  reduce,
  reduceRight,
  reject,
  rest,
  restArguments,
  result,
  sample,
  filter as select,
  shuffle,
  size,
  some,
  sortBy,
  sortedIndex,
  rest as tail,
  first as take,
  tap,
  template,
  templateSettings,
  throttle,
  times,
  toArray,
  toPath$1 as toPath,
  unzip as transpose,
  _unescape as unescape,
  union,
  uniq,
  uniq as unique,
  uniqueId,
  unzip,
  values,
  where,
  without,
  wrap,
  zip,
};
