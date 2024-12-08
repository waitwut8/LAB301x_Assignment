// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/scripts.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/*!
 * Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

var getToken = function getToken() {
  return localStorage.getItem("access_token");
};
function loadHome() {
  return _loadHome.apply(this, arguments);
}
function _loadHome() {
  _loadHome = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var productsContainer, list_of_items;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          productsContainer = document.querySelector(".row");
          productsContainer.innerHTML = "";
          _context2.next = 4;
          return fetch("http://127.0.0.1:8000/product_noLogin/6", {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          });
        case 4:
          list_of_items = _context2.sent;
          _context2.next = 7;
          return list_of_items.json();
        case 7:
          list_of_items = _context2.sent;
          addCards(list_of_items, productsContainer);
        case 9:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _loadHome.apply(this, arguments);
}
function addCards(list_of_items, productsContainer) {
  var _iterator = _createForOfIteratorHelper(list_of_items),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var product = _step.value;
      var discounted = product.price * (1 - 1 / product.discountPercentage);
      discounted = +discounted.toFixed(2);
      var images = product.images;
      images = images[0];
      var productCard = "\n                    <div class=\"col-2 col mb-5\">\n                        <div class=\"card h-100\">\n                            <img class=\"card-img-top img-fluid img-thumbnail\" src=\"".concat(product.thumbnail, "\" alt=\"").concat(product.title, "\" />\n                            <div class=\"card-body p-4\">\n                                <div class=\"text-center\">\n                                    <h5 class=\"fw-bolder\">").concat(product.title, "</h5>\n                                    <span class=\"text-muted text-decoration-line-through\">$").concat(product.price, "</span> $<span>").concat(discounted, "</span>\n                                </div>\n                            </div>\n                            <div class=\"card-footer p-4 pt-0 border-top-0 bg-transparent\">\n                                <div class=\"text-center\"><a class=\"btn btn-outline-dark mt-auto\" href=\"#\">See More Information</a></div>\n                            </div>\n                        </div>\n                    </div>\n                ");
      productsContainer.insertAdjacentHTML("beforeend", productCard);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function logout() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  alert("Logged out");
}
function cartLoad(_x) {
  return _cartLoad.apply(this, arguments);
}
function _cartLoad() {
  _cartLoad = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(token) {
    var data, cart, productsContainer, sumTotal, sumDiscountedTotal, sumTotalProducts, sumTotalQuantity;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return fetch("http://127.0.0.1:8000/cart", {
            method: "GET",
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          });
        case 2:
          response = _context3.sent;
          _context3.next = 5;
          return response.json();
        case 5:
          data = _context3.sent;
          console.log(data);
          localStorage.setItem("cart", JSON.stringify(data));
          cart = JSON.parse(localStorage.getItem("cart")) || {};
          console.log(cart);
          console.log(cart);
          productsContainer = document.querySelector(".card.mt-4 .card-body");
          productsContainer.innerHTML = ""; // Clear existing products
          sumTotal = 0, sumDiscountedTotal = 0, sumTotalProducts = 0, sumTotalQuantity = 0;
          cart["products"].forEach(function (product) {
            sumTotalProducts += 1;
            var productRow = document.createElement("div");
            productRow.classList.add("row", "mb-3");
            var productName = document.createElement("div");
            productName.classList.add("col-md-8");
            productName.innerHTML = "<h5>".concat(product.title, "</h5> ");
            var productPrice = document.createElement("div");
            productPrice.classList.add("col-md-2");
            productPrice.innerHTML = "<p>$".concat(product.price.toFixed(2), "</p>  <img src=\"").concat(product.thumbnail, "\" class=\"img-fluid float-left mr-3\" alt=\"").concat(product.title, "\" color = \"white\"/>");
            var productQuantity = document.createElement("div");
            productQuantity.classList.add("col-md-2");
            productQuantity.innerHTML = "<p>Quantity: ".concat(product.quantity, "</p>");
            sumTotalQuantity += product.quantity;
            productRow.appendChild(productName);
            productRow.appendChild(productPrice);
            productRow.appendChild(productQuantity);
            productsContainer.appendChild(productRow);
            var totalRow = document.createElement("div");
            totalRow.classList.add("row");
            var totalPrice = document.createElement("div");
            totalPrice.classList.add("col-md-8");
            totalPrice.innerHTML = "<p><strong>Total:</strong> $".concat(product.total.toFixed(2), "</p>");
            sumTotal += product.total;
            var discountedTotalPrice = document.createElement("div");
            discountedTotalPrice.classList.add("col-md-4");
            discountedTotalPrice.innerHTML = "<p><strong>Discounted Total:</strong> $".concat(product.discountedTotal.toFixed(2), "</p>");
            sumDiscountedTotal += product.discountedTotal;
            totalRow.appendChild(totalPrice);
            totalRow.appendChild(discountedTotalPrice);
            totalRow.appendChild(document.createElement("hr"));
            productsContainer.appendChild(totalRow);
            document.querySelector(".card-body p:nth-child(1)").innerText = "Total: $".concat(sumTotal.toFixed(2));
            document.querySelector(".card-body p:nth-child(2)").innerText = "Discounted Total: $".concat(sumDiscountedTotal.toFixed(2));
            document.querySelector(".card-body p:nth-child(3)").innerText = "Total Products: ".concat(sumTotalProducts);
            document.querySelector(".card-body p:nth-child(4)").innerText = "Total Quantity: ".concat(sumTotalQuantity);
          });
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _cartLoad.apply(this, arguments);
}
function loadPost(_x2) {
  return _loadPost.apply(this, arguments);
}
function _loadPost() {
  _loadPost = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(postId) {
    var response, data, documentPostTitle, documentPostBody, postTitle, postBody;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          response = fetch("127.0.0.1:8000/posts/".concat(postId));
          if (!(response.status !== 200)) {
            _context4.next = 5;
            break;
          }
          console.log("Error fetching post data");
          alert("Error fetching post data");
          return _context4.abrupt("return");
        case 5:
          _context4.next = 7;
          return response.json();
        case 7:
          data = _context4.sent;
          documentPostTitle = document.getElementsByClassName("card-title")[0], documentPostBody = document.getElementsByClassName("cart-text"), postTitle = data["title"], postBody = data["body"];
          if (postTitle && postBody) {
            documentPostTitle.textContent = postTitle;
            documentPostBody.textContent = postBody;
          } else {
            alert("Content not loaded, redirecting to login page");
            window.location.href = "login.html";
          }
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _loadPost.apply(this, arguments);
}
function addToCart(_x3) {
  return _addToCart.apply(this, arguments);
}
function _addToCart() {
  _addToCart = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id) {
    var token, response;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          token = document.cookie.split("=")[1]; // console.log(id);
          _context5.next = 3;
          return fetch("http://127.0.0.1:8000/cart", {
            method: "POST",
            headers: {
              Authorization: "Bearer ".concat(token),
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              quantity: 1,
              product_name: id
            })
          });
        case 3:
          response = _context5.sent;
          if (response.status === 200) {
            alert("Product added to cart");
          } else {
            alert("Failed to add product to cart");
          }
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _addToCart.apply(this, arguments);
}
function searchProducts() {
  return _searchProducts.apply(this, arguments);
}
function _searchProducts() {
  _searchProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var keyword, response, results, resultsContainer;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          token = document.cookie.split("=")[1];
          keyword = document.getElementById("search-input").value;
          _context6.next = 4;
          return fetch("http://127.0.0.1:8000/search/".concat(keyword), {
            method: "POST",
            headers: {
              Authorization: "Bearer ".concat(token) // Add your token here
            }
          });
        case 4:
          response = _context6.sent;
          _context6.next = 7;
          return response.json();
        case 7:
          results = _context6.sent;
          resultsContainer = document.getElementById("search-results");
          resultsContainer.innerHTML = "";
          if (!(response.status === 200)) {
            _context6.next = 17;
            break;
          }
          if (!(results.length === 0)) {
            _context6.next = 14;
            break;
          }
          resultsContainer.innerHTML = "<p>No products found</p>";
          return _context6.abrupt("return");
        case 14:
          results.forEach(function (product) {
            var productDiv = document.createElement("div");
            productDiv.className = "product card mb-3";
            productDiv.innerHTML = "\n                <div class=\"card-body\">\n<h4 class=\"card-title\">".concat(product.title, "</h5>\n<img src=\"").concat(product.thumbnail, "\" class=\"img-fluid float-left mr-3\" alt=\"").concat(product.title, "\" color = \"white\"/>\n<p class=\"card-text\">").concat(product.description, "</p>\n<button onclick = \"addToCart('").concat(product.title, "')\" class=\"btn btn-primary\">Add to Cart</button>\n</div>\n            ");
            resultsContainer.appendChild(productDiv);
          });
          _context6.next = 18;
          break;
        case 17:
          resultsContainer.innerHTML = "<p class=\"text-danger\">try <a href = 'login.html'>logging in</a>.</p>";
        case 18:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _searchProducts.apply(this, arguments);
}
function login(form) {
  form.addEventListener("submit", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      var r, x, response, s, _token;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            r = JSON.stringify({
              username: form.username.value,
              password: form.password.value
            });
            console.log(r);
            e.preventDefault();
            x = localStorage.getItem("access_token");
            if (!(x != null)) {
              _context.next = 16;
              break;
            }
            _context.next = 7;
            return fetch("http://127.0.0.1:8000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: r
            });
          case 7:
            response = _context.sent;
            _context.next = 10;
            return response.json();
          case 10:
            s = _context.sent;
            console.log(s);
            _token = s["access_token"];
            localStorage.setItem("access_token", _token);
            _context.next = 17;
            break;
          case 16:
            window.location.href = "index.html";
          case 17:
            if (response.status == 200) {
              window.location.href = "index.html";
            } else {
              document.getElementById("products").innerHTML = "Please try logging in again";
            }
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x4) {
      return _ref.apply(this, arguments);
    };
  }());
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61708" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/scripts.js"], null)
//# sourceMappingURL=/scripts.cd665a19.js.map