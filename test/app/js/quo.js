/*
Basic Quo Module

@namespace Quo
@class Base

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  var Quo;

  Quo = (function() {
    var $$, CLASS_SELECTOR, ELEMENT_TYPES, EMPTY_ARRAY, HTML_CONTAINERS, ID_SELECTOR, IS_HTML_FRAGMENT, OBJECT_PROTOTYPE, TABLE, TABLE_ROW, TAG_SELECTOR, _compact, _flatten, _fragment, _getDOMObject, _instance, _isOwnProperty;
    EMPTY_ARRAY = [];
    OBJECT_PROTOTYPE = Object.prototype;
    IS_HTML_FRAGMENT = /^\s*<(\w+|!)[^>]*>/;
    ELEMENT_TYPES = [1, 9, 11];
    CLASS_SELECTOR = /^\.([\w-]+)$/;
    ID_SELECTOR = /^#[\w\d-]+$/;
    TAG_SELECTOR = /^[\w-]+$/;
    TABLE = document.createElement('table');
    TABLE_ROW = document.createElement('tr');
    HTML_CONTAINERS = {
      "tr": document.createElement("tbody"),
      "tbody": TABLE,
      "thead": TABLE,
      "tfoot": TABLE,
      "td": TABLE_ROW,
      "th": TABLE_ROW,
      "*": document.createElement("div")
    };
    /*
    Basic Instance of QuoJS
    @method $$
    @param  {string/instance} [OPTIONAL] Selector for handler
    @param  {string} [OPTIONAL] Children in selector
    */

    $$ = function(selector, children) {
      var dom;
      if (!selector) {
        return _instance();
      } else if ($$.toType(selector) === "function") {
        return $$(document).ready(selector);
      } else {
        dom = _getDOMObject(selector, children);
        return _instance(dom, selector);
      }
    };
    /*
    Basic Instance of QuoJS
    @method query
    @param  {string/instance} [OPTIONAL] Selector for handler
    @param  {string} [OPTIONAL] Children in selector
    */

    $$.query = function(domain, selector) {
      var elements;
      if (CLASS_SELECTOR.test(selector)) {
        elements = domain.getElementsByClassName(selector.replace(".", ""));
      } else if (TAG_SELECTOR.test(selector)) {
        elements = domain.getElementsByTagName(selector);
      } else if (ID_SELECTOR.test(selector) && domain === document) {
        elements = domain.getElementById(selector.replace("#", ""));
        if (!elements) {
          elements = [];
        }
      } else {
        elements = domain.querySelectorAll(selector);
      }
      if (elements.nodeType) {
        return [elements];
      } else {
        return Array.prototype.slice.call(elements);
      }
    };
    $$.extend = function(target) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        var key, _results;
        _results = [];
        for (key in source) {
          _results.push(target[key] = source[key]);
        }
        return _results;
      });
      return target;
    };
    $$.toType = function(obj) {
      return OBJECT_PROTOTYPE.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
    $$.each = function(elements, callback) {
      var element, i, key, _i, _len;
      i = void 0;
      key = void 0;
      if ($$.toType(elements) === "array") {
        for (i = _i = 0, _len = elements.length; _i < _len; i = ++_i) {
          element = elements[i];
          if (callback.call(element, i, element) === false) {
            elements;
          }
        }
      } else {
        for (key in elements) {
          if (callback.call(elements[key], key, elements[key]) === false) {
            elements;
          }
        }
      }
      return elements;
    };
    $$.map = function(elements, callback) {
      var i, key, value, values;
      values = [];
      i = void 0;
      key = void 0;
      if ($$.toType(elements) === "array") {
        i = 0;
        while (i < elements.length) {
          value = callback(elements[i], i);
          if (value != null) {
            values.push(value);
          }
          i++;
        }
      } else {
        for (key in elements) {
          value = callback(elements[key], key);
          if (value != null) {
            values.push(value);
          }
        }
      }
      return _flatten(values);
    };
    $$.mix = function() {
      var arg, argument, child, len, prop;
      child = {};
      arg = 0;
      len = arguments.length;
      while (arg < len) {
        argument = arguments[arg];
        for (prop in argument) {
          if (_isOwnProperty(argument, prop) && argument[prop] !== undefined) {
            child[prop] = argument[prop];
          }
        }
        arg++;
      }
      return child;
    };
    _instance = function(dom, selector) {
      if (selector == null) {
        selector = "";
      }
      dom = dom || EMPTY_ARRAY;
      dom.selector = selector;
      dom.__proto__ = _instance.prototype;
      return dom;
    };
    _getDOMObject = function(selector, children) {
      var domain, type;
      domain = null;
      type = $$.toType(selector);
      if (type === "array") {
        domain = _compact(selector);
      } else if (type === "string" && IS_HTML_FRAGMENT.test(selector)) {
        domain = _fragment(selector.trim(), RegExp.$1);
        selector = null;
      } else if (type === "string") {
        domain = $$.query(document, selector);
        if (children) {
          if (domain.length === 1) {
            domain = $$.query(domain[0], children);
          } else {
            domain = $$.map(function() {
              return $$.query(domain, children);
            });
          }
        }
      } else if (ELEMENT_TYPES.indexOf(selector.nodeType) >= 0 || selector === window) {
        domain = [selector];
        selector = null;
      }
      return domain;
    };
    _fragment = function(markup, tag) {
      var container;
      if (tag == null) {
        tag = "*";
      }
      if (!(tag in HTML_CONTAINERS)) {
        tag = "*";
      }
      container = HTML_CONTAINERS[tag];
      container.innerHTML = "" + markup;
      return $$.each(Array.prototype.slice.call(container.childNodes), function() {
        return container.removeChild(this);
      });
    };
    _compact = function(items) {
      return items.filter(function(item) {
        if (item != null) {
          return item;
        }
      });
    };
    _flatten = function(array) {
      if (array.length > 0) {
        return EMPTY_ARRAY.concat.apply(EMPTY_ARRAY, array);
      } else {
        return array;
      }
    };
    _isOwnProperty = function(object, property) {
      return OBJECT_PROTOTYPE.hasOwnProperty.call(object, property);
    };
    _instance.prototype = $$.fn = {};
    $$.fn.each = function(callback) {
      this.forEach(function(element, index) {
        return callback.call(element, index, element);
      });
      return this;
    };
    $$.fn.filter = function(selector) {
      return $$(EMPTY_ARRAY.filter.call(this, function(el) {
        return el.parentNode && $$.query(el.parentNode, selector).indexOf(el) >= 0;
      }));
    };
    $$.fn.forEach = EMPTY_ARRAY.forEach;
    $$.fn.indexOf = EMPTY_ARRAY.indexOf;
    return $$;
  })();

  this.Quo = this.$$ = Quo;

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class Ajax

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    var DEFAULT, JSONP_ID, MIME_TYPES, _isJsonP, _jsonp, _xhrError, _xhrForm, _xhrHeaders, _xhrStatus, _xhrSuccess, _xhrTimeout;
    DEFAULT = {
      TYPE: "GET",
      MIME: "json"
    };
    MIME_TYPES = {
      script: "text/javascript, application/javascript",
      json: "application/json",
      xml: "application/xml, text/xml",
      html: "text/html",
      text: "text/plain"
    };
    JSONP_ID = 0;
    $$.ajaxSettings = {
      type: DEFAULT.TYPE,
      async: true,
      success: {},
      error: {},
      context: null,
      dataType: DEFAULT.MIME,
      headers: {},
      xhr: function() {
        return new window.XMLHttpRequest();
      },
      crossDomain: false,
      timeout: 0
    };
    /*
    Perform an asynchronous HTTP (Ajax) request.
    @method ajax
    @param  {object} A set of key/value pairs that configure the Ajax request
    */

    $$.ajax = function(options) {
      var abortTimeout, error, settings, xhr;
      settings = $$.mix($$.ajaxSettings, options);
      if (settings.type === DEFAULT.TYPE) {
        settings.url += $$.serialize(settings.data, "?");
      } else {
        settings.data = $$.serialize(settings.data);
      }
      if (_isJsonP(settings.url)) {
        return _jsonp(settings);
      }
      xhr = settings.xhr();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          clearTimeout(abortTimeout);
          return _xhrStatus(xhr, settings);
        }
      };
      xhr.open(settings.type, settings.url, settings.async);
      _xhrHeaders(xhr, settings);
      if (settings.timeout > 0) {
        abortTimeout = setTimeout((function() {
          return _xhrTimeout(xhr, settings);
        }), settings.timeout);
      }
      try {
        xhr.send(settings.data);
      } catch (_error) {
        error = _error;
        xhr = error;
        _xhrError("Resource not found", xhr, settings);
      }
      return xhr;
    };
    /*
    Load data from the server using a HTTP GET request.
    @method get
    @param  {string} A string containing the URL to which the request is sent.
    @param  {string} [OPTIONAL] A plain object or string that is sent to the server with the request.
    @param  {string} [OPTIONAL] A callback function that is executed if the request succeeds.
    @param  {string} [OPTIONAL] The type of data expected from the server
    */

    $$.get = function(url, data, success, dataType) {
      return $$.ajax({
        url: url,
        data: data,
        success: success,
        dataType: dataType
      });
    };
    /*
    Load data from the server using a HTTP POST request.
    @method post
    @param  {string} A string containing the URL to which the request is sent.
    @param  {string} [OPTIONAL] A plain object or string that is sent to the server with the request.
    @param  {string} [OPTIONAL] A callback function that is executed if the request succeeds.
    @param  {string} [OPTIONAL] The type of data expected from the server
    */

    $$.post = function(url, data, success, dataType) {
      return _xhrForm("POST", url, data, success, dataType);
    };
    /*
    Load data from the server using a HTTP PPUTOST request.
    @method put
    @param  {string} A string containing the URL to which the request is sent.
    @param  {string} [OPTIONAL] A plain object or string that is sent to the server with the request.
    @param  {string} [OPTIONAL] A callback function that is executed if the request succeeds.
    @param  {string} [OPTIONAL] The type of data expected from the server
    */

    $$.put = function(url, data, success, dataType) {
      return _xhrForm("PUT", url, data, success, dataType);
    };
    /*
    Load data from the server using a HTTP DELETE request.
    @method delete
    @param  {string} A string containing the URL to which the request is sent.
    @param  {string} [OPTIONAL] A plain object or string that is sent to the server with the request.
    @param  {string} [OPTIONAL] A callback function that is executed if the request succeeds.
    @param  {string} [OPTIONAL] The type of data expected from the server
    */

    $$["delete"] = function(url, data, success, dataType) {
      return _xhrForm("DELETE", url, data, success, dataType);
    };
    /*
    Load JSON-encoded data from the server using a GET HTTP request.
    @method json
    @param  {string} A string containing the URL to which the request is sent.
    @param  {string} [OPTIONAL] A plain object or string that is sent to the server with the request.
    @param  {string} [OPTIONAL] A callback function that is executed if the request succeeds.
    */

    $$.json = function(url, data, success) {
      return $$.ajax({
        url: url,
        data: data,
        success: success
      });
    };
    /*
    Encode a set of form elements as a string for submission.
    @method serialize
    @param  {object}
    */

    $$.serialize = function(parameters, character) {
      var parameter, serialize;
      if (character == null) {
        character = "";
      }
      serialize = character;
      for (parameter in parameters) {
        if (parameters.hasOwnProperty(parameter)) {
          if (serialize !== character) {
            serialize += "&";
          }
          serialize += "" + (encodeURIComponent(parameter)) + "=" + (encodeURIComponent(parameters[parameter]));
        }
      }
      if (serialize === character) {
        return "";
      } else {
        return serialize;
      }
    };
    _jsonp = function(settings) {
      var abortTimeout, callbackName, script, xhr;
      if (settings.async) {
        callbackName = "jsonp" + (++JSONP_ID);
        script = document.createElement("script");
        xhr = {
          abort: function() {
            $$(script).remove();
            if (callbackName in window) {
              return window[callbackName] = {};
            }
          }
        };
        abortTimeout = void 0;
        window[callbackName] = function(response) {
          clearTimeout(abortTimeout);
          $$(script).remove();
          delete window[callbackName];
          return _xhrSuccess(response, settings);
        };
        script.src = settings.url.replace(RegExp("=\\?"), "=" + callbackName);
        $$("head").append(script);
        if (settings.timeout > 0) {
          abortTimeout = setTimeout((function() {
            return _xhrTimeout(xhr, settings);
          }), settings.timeout);
        }
        return xhr;
      } else {
        return console.error("QuoJS.ajax: Unable to make jsonp synchronous call.");
      }
    };
    _xhrStatus = function(xhr, settings) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
        if (settings.async) {
          _xhrSuccess(xhr, settings);
        }
      } else {
        _xhrError("QuoJS.ajax: Unsuccesful request", xhr, settings);
      }
    };
    _xhrSuccess = function(xhr, settings) {
      settings.success.call(settings.context, xhr);
    };
    _xhrError = function(type, xhr, settings) {
      settings.error.call(settings.context, type, xhr, settings);
    };
    _xhrHeaders = function(xhr, settings) {
      var header;
      if (settings.contentType) {
        settings.headers["Content-Type"] = settings.contentType;
      }
      if (settings.dataType) {
        settings.headers["Accept"] = MIME_TYPES[settings.dataType];
      }
      for (header in settings.headers) {
        xhr.setRequestHeader(header, settings.headers[header]);
      }
    };
    _xhrTimeout = function(xhr, settings) {
      xhr.onreadystatechange = {};
      xhr.abort();
      _xhrError("QuoJS.ajax: Timeout exceeded", xhr, settings);
    };
    _xhrForm = function(method, url, data, success, dataType) {
      return $$.ajax({
        type: method,
        url: url,
        data: data,
        success: success,
        dataType: dataType,
        contentType: "application/x-www-form-urlencoded"
      });
    };
    return _isJsonP = function(url) {
      return RegExp("=\\?").test(url);
    };
  })(Quo);

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class css

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    var VENDORS, _computedStyle, _ucfirst;
    VENDORS = ["-webkit-", "-moz-", "-ms-", "-o-", ""];
    /*
    Add class to a given instance element
    @method addClass
    @param  {string} Name of stylesheet class
    */

    $$.fn.addClass = function(name) {
      return this.each(function() {
        return this.classList.add(name);
      });
    };
    /*
    Remove stylesheet class to a given instance element
    @method addClass
    @param  {string} Name of stylesheet class
    */

    $$.fn.removeClass = function(name) {
      return this.each(function() {
        return this.classList.remove(name);
      });
    };
    /*
    Toggle stylesheet class to a given instance element
    @method addClass
    @param  {string} Name of stylesheet class
    */

    $$.fn.toggleClass = function(name) {
      return this.each(function() {
        var method;
        method = this.classList.contains(name) ? "remove" : "add";
        return this.classList[method](name);
      });
    };
    /*
    Test if a stylesheet class is in the giben instance element
    @method hasClass
    @param  {string} Name of stylesheet class
    */

    $$.fn.hasClass = function(name) {
      return this.length > 0 && this[0].classList.contains(name);
    };
    /*
    List a object with all classes in a given instance element
    @method listClass
    @param  {string} Name of stylesheet class
    */

    $$.fn.listClass = function() {
      if (this.length > 0) {
        return this[0].classList;
      }
    };
    /*
    Set/Get a stylesheet property in a given instance element
    @method style
    @param  {string} Name of property
    @param  {string} [OPTIONAL] Value for property
    */

    $$.fn.style = $$.fn.css = function(property, value) {
      var el;
      if (value != null) {
        return this.each(function() {
          return this.style[property] = value;
        });
      } else {
        el = this[0];
        return el.style[property] || _computedStyle(el, property);
      }
    };
    /*
    Set/Get a stylesheet vendor-prefix property in a given instance element
    @method vendor
    @param  {string} Name of property
    @param  {string} Value for property
    */

    $$.fn.vendor = function(property, value) {
      var prefix, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = VENDORS.length; _i < _len; _i++) {
        prefix = VENDORS[_i];
        _results.push(this.style("" + prefix + property, value));
      }
      return _results;
    };
    _computedStyle = function(element, property) {
      return document.defaultView.getComputedStyle(element, "")[property];
    };
    return _ucfirst = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  })(Quo);

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class Element

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    /*
    Get/Set attribute to a given instance element
    @method attr
    @param  {string} Name of attribute
    @param  {string} [OPTIONAL] Value of attribute
    */

    $$.fn.attr = function(name, value) {
      if (this.length > 0 && $$.toType(name) === "string") {
        if (value) {
          return this.each(function() {
            return this.setAttribute(name, value);
          });
        } else {
          return this[0].getAttribute(name);
        }
      }
    };
    /*
    Remove attribute to a given instance element
    @method removeAttr
    @param  {string} Name of attribute
    */

    $$.fn.removeAttr = function(name) {
      if (this.length > 0 && $$.toType(name) === "string") {
        return this.each(function() {
          return this.removeAttribute(name);
        });
      }
    };
    /*
    Get/Set data attribute to a given instance element
    @method data
    @param  {string} Name of data attribute
    @param  {string} [OPTIONAL] Value of data atribbute
    */

    $$.fn.data = function(name, value) {
      return this.attr("data-" + name, value);
    };
    /*
    Remove data attribute to a given instance element
    @method removeAttr
    @param  {string} Name of data attribute
    */

    $$.fn.removeData = function(name) {
      return this.removeAttr("data-" + name);
    };
    /*
    Remove data attribute to a given instance element
    @method val
    @param  {string} Name of data attribute
    */

    $$.fn.val = function(value) {
      if (value) {
        return this.each(function() {
          return this.value = value.toString();
        });
      } else {
        if (this.length > 0) {
          return this[0].value;
        } else {
          return null;
        }
      }
    };
    /*
    Shows a given instance element
    @method show
    */

    $$.fn.show = function() {
      return this.style("display", "block");
    };
    /*
    Hides a given instance element
    @method hide
    */

    $$.fn.hide = function() {
      return this.style("display", "none");
    };
    /*
    Get a offset of a given instance element
    @method offset
    */

    return $$.fn.offset = function() {
      var bounding, offset;
      if (this.length > 0) {
        bounding = this[0].getBoundingClientRect();
        offset = {
          left: bounding.left + window.pageXOffset,
          top: bounding.top + window.pageYOffset,
          width: bounding.width,
          height: bounding.height
        };
      }
      return offset;
    };
  })(Quo);

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class Environment

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    var IS_WEBKIT, SUPPORTED_OS, _current, _detectBrowser, _detectOS, _detectScreen;
    _current = null;
    IS_WEBKIT = /WebKit\/([\d.]+)/;
    SUPPORTED_OS = {
      Android: /(Android)\s+([\d.]+)/,
      ipad: /(iPad).*OS\s([\d_]+)/,
      iphone: /(iPhone\sOS)\s([\d_]+)/,
      Blackberry: /(BlackBerry|BB10|Playbook).*Version\/([\d.]+)/,
      FirefoxOS: /(Mozilla).*Mobile[^\/]*\/([\d\.]*)/,
      webOS: /(webOS|hpwOS)[\s\/]([\d.]+)/
    };
    /*
    Remove attribute to a given instance element
    @method isMobile
    @return {boolean} True if it's mobile, False if not.
    */

    $$.isMobile = function() {
      this.environment();
      return _current.isMobile;
    };
    /*
    Remove attribute to a given instance element
    @method environment
    @return {object} Environment attributes
    */

    $$.environment = function() {
      var os, user_agent;
      if (!_current) {
        user_agent = navigator.userAgent;
        os = _detectOS(user_agent);
        _current = {
          browser: _detectBrowser(user_agent),
          isMobile: !!os,
          screen: _detectScreen(),
          os: os
        };
      }
      return _current;
    };
    _detectBrowser = function(user_agent) {
      var webkit;
      webkit = user_agent.match(IS_WEBKIT);
      if (webkit) {
        return webkit[0];
      } else {
        return user_agent;
      }
    };
    _detectOS = function(user_agent) {
      var detected_os, os, supported;
      for (os in SUPPORTED_OS) {
        supported = user_agent.match(SUPPORTED_OS[os]);
        if (supported) {
          detected_os = {
            name: os === "iphone" || os === "ipad" || os === "ipod" ? "ios" : os,
            version: supported[2].replace("_", ".")
          };
          break;
        }
      }
      return detected_os;
    };
    return _detectScreen = function() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
  })(Quo);

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class Events

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    var ELEMENT_ID, EVENTS_DESKTOP, EVENT_METHODS, HANDLERS, READY_EXPRESSION, _createProxy, _createProxyCallback, _environmentEvent, _event, _findHandlers, _getElementId, _subscribe, _unsubscribe;
    ELEMENT_ID = 1;
    HANDLERS = {};
    EVENT_METHODS = {
      preventDefault: "isDefaultPrevented",
      stopImmediatePropagation: "isImmediatePropagationStopped",
      stopPropagation: "isPropagationStopped"
    };
    EVENTS_DESKTOP = {
      touchstart: "mousedown",
      touchmove: "mousemove",
      touchend: "mouseup",
      touch: "click",
      orientationchange: "resize"
    };
    READY_EXPRESSION = /complete|loaded|interactive/;
    /*
    Attach an event handler function for one or more events to a given instance element
    @method on
    @param  {string} One or more space-separated event types
    @param  {string} A selector string to filter the descendants of the selected elements that trigger the event
    @param  {function} A function to execute when the event is triggered
    */

    $$.fn.on = function(event, selector, callback) {
      if ((selector == null) || $$.toType(selector) === "function") {
        return this.bind(event, selector);
      } else {
        return this.delegate(selector, event, callback);
      }
    };
    /*
    Remove an event handler.
    @method off
    @param  {string} One or more space-separated event types
    @param  {string} [OPTIONAL] A selector string to filter the descendants of the selected elements that trigger the event
    @param  {function} [OPTIONAL] A function to execute when the event is triggered
    */

    $$.fn.off = function(event, selector, callback) {
      if ((selector == null) || $$.toType(selector) === "function") {
        return this.unbind(event, selector);
      } else {
        return this.undelegate(selector, event, callback);
      }
    };
    /*
    Specify a function to execute when the DOM is fully loaded.
    @method ready
    @param  {function} A function to execute after the DOM is ready.
    */

    $$.fn.ready = function(callback) {
      if (READY_EXPRESSION.test(document.readyState)) {
        return callback.call(this, $$);
      } else {
        return $$.fn.addEvent(document, "DOMContentLoaded", function() {
          return callback.call(this, $$);
        });
      }
    };
    /*
    Attach a handler to an event for the elements.
    @method bind
    @param  {string} One or more space-separated event types
    @param  {function} A function to execute when the event is triggered
    */

    $$.fn.bind = function(event, callback) {
      return this.each(function() {
        return _subscribe(this, event, callback);
      });
    };
    /*
    Remove a previously-attached event handler from the elements.
    @method unbind
    @param  {string} One or more space-separated event types
    @param  {function} [OPTIONAL] A function to execute when the event is triggered
    */

    $$.fn.unbind = function(event, callback) {
      return this.each(function() {
        return _unsubscribe(this, event, callback);
      });
    };
    /*
    Attach a handler to one or more events for all elements that match the selector
    @method delegate
    */

    $$.fn.delegate = function(selector, event, callback) {
      return this.each(function(i, element) {
        return _subscribe(element, event, callback, selector, function(fn) {
          return function(e) {
            var evt, match;
            match = $$(e.target).closest(selector, element).get(0);
            if (match) {
              evt = $$.extend(_createProxy(e), {
                currentTarget: match,
                liveFired: element
              });
              return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
            }
          };
        });
      });
    };
    /*
    Remove a handler from the event for all elements which match the current selector
    @method undelegate
    */

    $$.fn.undelegate = function(selector, event, callback) {
      return this.each(function() {
        return _unsubscribe(this, event, callback, selector);
      });
    };
    /*
    Execute all handlers and behaviors attached to the matched elements for the given event type.
    @method trigger
    */

    $$.fn.trigger = function(event, touch, originalEvent) {
      if ($$.toType(event) === "string") {
        event = _event(event, touch);
      }
      if (originalEvent != null) {
        event.originalEvent = originalEvent;
      }
      return this.each(function() {
        return this.dispatchEvent(event);
      });
    };
    $$.fn.addEvent = function(element, event_name, callback) {
      if (element.addEventListener) {
        return element.addEventListener(event_name, callback, false);
      } else if (element.attachEvent) {
        return element.attachEvent("on" + event_name, callback);
      } else {
        return element["on" + event_name] = callback;
      }
    };
    $$.fn.removeEvent = function(element, event_name, callback) {
      if (element.removeEventListener) {
        return element.removeEventListener(event_name, callback, false);
      } else if (element.detachEvent) {
        return element.detachEvent("on" + event_name, callback);
      } else {
        return element["on" + event_name] = null;
      }
    };
    _event = function(type, touch) {
      var event;
      event = document.createEvent("Events");
      event.initEvent(type, true, true, null, null, null, null, null, null, null, null, null, null, null, null);
      if (touch) {
        event.quoData = touch;
      }
      return event;
    };
    _subscribe = function(element, event, callback, selector, delegate_callback) {
      var delegate, element_handlers, element_id, handler;
      event = _environmentEvent(event);
      element_id = _getElementId(element);
      element_handlers = HANDLERS[element_id] || (HANDLERS[element_id] = []);
      delegate = delegate_callback && delegate_callback(callback, event);
      handler = {
        event: event,
        callback: callback,
        selector: selector,
        proxy: _createProxyCallback(delegate, callback, element),
        delegate: delegate,
        index: element_handlers.length
      };
      element_handlers.push(handler);
      return $$.fn.addEvent(element, handler.event, handler.proxy);
    };
    _unsubscribe = function(element, event, callback, selector) {
      var element_id;
      event = _environmentEvent(event);
      element_id = _getElementId(element);
      return _findHandlers(element_id, event, callback, selector).forEach(function(handler) {
        delete HANDLERS[element_id][handler.index];
        return $$.fn.removeEvent(element, handler.event, handler.proxy);
      });
    };
    _getElementId = function(element) {
      return element._id || (element._id = ELEMENT_ID++);
    };
    _environmentEvent = function(event) {
      var environment_event;
      environment_event = (typeof $$.isMobile === "function" ? $$.isMobile() : void 0) ? event : EVENTS_DESKTOP[event];
      return environment_event || event;
    };
    _createProxyCallback = function(delegate, callback, element) {
      var proxy;
      callback = delegate || callback;
      proxy = function(event) {
        var result;
        result = callback.apply(element, [event].concat(event.data));
        if (result === false) {
          event.preventDefault();
        }
        return result;
      };
      return proxy;
    };
    _findHandlers = function(element_id, event, fn, selector) {
      return (HANDLERS[element_id] || []).filter(function(handler) {
        return handler && (!event || handler.event === event) && (!fn || handler.callback === fn) && (!selector || handler.selector === selector);
      });
    };
    return _createProxy = function(event) {
      var proxy;
      proxy = $$.extend({
        originalEvent: event
      }, event);
      $$.each(EVENT_METHODS, function(name, method) {
        proxy[name] = function() {
          this[method] = function() {
            return true;
          };
          return event[name].apply(event, arguments);
        };
        return proxy[method] = function() {
          return false;
        };
      });
      return proxy;
    };
  })(Quo);

}).call(this);
/*
Quo Gestures manager

@namespace Quo
@class gesture

@author Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  Quo.Gestures = (function($$) {
    var HANDLERS, STARTED, add, trigger, _addDelegations, _cancel, _data, _end, _getFingersData, _handle, _move, _originalEvent, _start;
    STARTED = false;
    HANDLERS = {};
    _data = null;
    _originalEvent = null;
    $$(document).ready(function() {
      var environment;
      environment = $$(document.body);
      environment.bind("touchstart", _start);
      environment.bind("touchmove", _move);
      environment.bind("touchend", _end);
      return environment.bind("touchcancel", _cancel);
    });
    add = function(gesture) {
      HANDLERS[gesture.name] = gesture.handler;
      return _addDelegations(gesture.events);
    };
    trigger = function(target, eventName, gestureData) {
      return $$(target).trigger(eventName, gestureData, _originalEvent);
    };
    _start = function(ev) {
      STARTED = true;
      _originalEvent = ev || event;
      _data = _getFingersData(ev);
      return _handle("start", ev.target, _data);
    };
    _move = function(ev) {
      if (!STARTED) {
        return;
      }
      _originalEvent = ev || event;
      _data = _getFingersData(ev);
      return _handle("move", ev.target, _data);
    };
    _end = function(ev) {
      if (!STARTED) {
        return;
      }
      _originalEvent = ev || event;
      _handle("end", ev.target, _data);
      return STARTED = false;
    };
    _cancel = function(ev) {
      STARTED = false;
      return _handle("cancel");
    };
    _addDelegations = function(events) {
      events.forEach(function(event_name) {
        return $$.fn[event_name] = function(callback) {
          return $$(document.body).delegate(this.selector, event_name, callback);
        };
      });
      return this;
    };
    _handle = function(eventName, target, data) {
      var handler, name, _results;
      _results = [];
      for (name in HANDLERS) {
        handler = HANDLERS[name];
        if (handler[eventName]) {
          _results.push(handler[eventName].call(handler, target, data));
        }
      }
      return _results;
    };
    _getFingersData = function(event) {
      var t, touches;
      touches = $$.isMobile() ? event.touches : [event];
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = touches.length; _i < _len; _i++) {
          t = touches[_i];
          _results.push({
            x: t.pageX,
            y: t.pageY
          });
        }
        return _results;
      })();
    };
    return {
      add: add,
      trigger: trigger
    };
  })(Quo);

}).call(this);

/*
Quo Basic Gestures: tap, hold, singleTap, doubleTap

@author Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
*/


(function() {
  "use strict";
  Quo.Gestures.add({
    name: "basic",
    events: "tap,hold,singleTap,doubleTap,touch".split(","),
    handler: (function(gm) {
      var ALLOWED_MOVE_PIXELS, DOUBLE_TAP, HOLD, TAP, cancel, end, move, start, _hold_timeout, _last_tap, _simpletap_timeout, _start, _target, _valid;
      ALLOWED_MOVE_PIXELS = 15;
      TAP = 250;
      DOUBLE_TAP = 400;
      HOLD = 400;
      _hold_timeout = null;
      _simpletap_timeout = null;
      _valid = true;
      _target = null;
      _start = null;
      _last_tap = null;
      start = function(target, touches) {
        if (touches.length === 1) {
          _start = {
            time: new Date(),
            x: touches[0].x,
            y: touches[0].y
          };
          _target = target;
          return _hold_timeout = setTimeout(function() {
            return gm.trigger(target, "hold", touches[0]);
          }, HOLD);
        } else {
          return cancel();
        }
      };
      move = function(target, touches) {
        var xDiff, yDiff;
        if (_start !== null) {
          xDiff = touches[0].x - _start.x;
          yDiff = touches[0].y - _start.y;
          if (xDiff > ALLOWED_MOVE_PIXELS || yDiff > ALLOWED_MOVE_PIXELS || touches.length > 1) {
            return cancel();
          }
        }
      };
      end = function(target, touches) {
        var now;
        gm.trigger(target, "touch", touches[0]);
        if (!_start) {
          return;
        }
        clearTimeout(_hold_timeout);
        now = new Date();
        if ((now - _start.time) < TAP) {
          if ((now - _last_tap) < DOUBLE_TAP) {
            clearTimeout(_simpletap_timeout);
            gm.trigger(target, "doubleTap", touches[0]);
            return _last_tap = null;
          } else {
            _last_tap = now;
            gm.trigger(target, "tap", touches[0]);
            return _simpletap_timeout = setTimeout(function() {
              return gm.trigger(target, "singleTap", touches[0]);
            }, DOUBLE_TAP + 5);
          }
        }
      };
      cancel = function() {
        _start = null;
        _valid = false;
        clearTimeout(_hold_timeout);
        return clearTimeout(_simpletap_timeout);
      };
      return {
        start: start,
        move: move,
        end: end,
        cancel: cancel
      };
    })(Quo.Gestures)
  });

}).call(this);

/*
Quo Drag Gestures: drag, dragging

@author Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
*/


(function() {
  "use strict";
  Quo.Gestures.add({
    name: "drag",
    events: "drag,dragging".split(","),
    handler: (function(gm) {
      var MIN_PX, end, move, start, _average, _calcDelta, _check, _last, _num_fingers, _start, _target;
      MIN_PX = 20;
      _target = null;
      _num_fingers = null;
      _start = null;
      _last = null;
      start = function(target, data) {
        if (data.length >= 2) {
          _target = target;
          _num_fingers = data.length;
          return _start = _average(data);
        }
      };
      move = function(target, data) {
        var delta;
        if (data.length === _num_fingers) {
          delta = _calcDelta(data);
          _last = {
            touches: data,
            delta: delta
          };
          return _check(true);
        }
      };
      end = function(target, data) {
        if (_start && _last) {
          _check(false);
          _num_fingers = null;
          _start = null;
          return _last = null;
        }
      };
      _calcDelta = function(touches) {
        var average;
        average = _average(touches);
        return {
          x: average.x - _start.x,
          y: average.y - _start.y
        };
      };
      _average = function(touches) {
        var touch, x, y, _i, _len;
        x = 0;
        y = 0;
        for (_i = 0, _len = touches.length; _i < _len; _i++) {
          touch = touches[_i];
          x += parseInt(touch.x);
          y += parseInt(touch.y);
        }
        return {
          x: x / touches.length,
          y: y / touches.length
        };
      };
      _check = function(is_moving) {
        if (is_moving) {
          return gm.trigger(_target, "dragging", _last);
        } else if (Math.abs(_last.delta.x) > MIN_PX || Math.abs(_last.delta.y) > MIN_PX) {
          return gm.trigger(_target, "drag", _last);
        }
      };
      return {
        start: start,
        move: move,
        end: end
      };
    })(Quo.Gestures)
  });

}).call(this);

/*
Quo Pinch Gestures: pinch, pinching, pinchIn, pinchOut

@author Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
*/


(function() {
  "use strict";
  Quo.Gestures.add({
    name: "pinch",
    events: "pinch,pinching,pinchIn,pinchOut".split(","),
    handler: (function(gm) {
      var TRIGGER_PIXELS, end, move, start, _check, _distance, _last, _start, _target;
      TRIGGER_PIXELS = 20;
      _target = null;
      _start = null;
      _last = null;
      start = function(target, data) {
        if (data.length === 2) {
          _target = target;
          return _start = _distance(data[0], data[1]);
        }
      };
      move = function(target, data) {
        var distance;
        if (_start && data.length === 2) {
          distance = _distance(data[0], data[1]);
          _last = {
            touches: data,
            delta: distance - _start
          };
          return _check(true);
        }
      };
      end = function(target, data) {
        if (_start && _last) {
          _check(false);
          _start = null;
          return _last = null;
        }
      };
      _distance = function(A, B) {
        return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
      };
      _check = function(is_moving) {
        var ev;
        if (is_moving) {
          return gm.trigger(_target, "pinching", _last);
        } else if (Math.abs(_last.delta) > TRIGGER_PIXELS) {
          gm.trigger(_target, "pinch", _last);
          ev = _last.delta > 0 ? "pinchOut" : "pinchIn";
          return gm.trigger(_target, ev, _last);
        }
      };
      return {
        start: start,
        move: move,
        end: end
      };
    })(Quo.Gestures)
  });

}).call(this);

/*
Quo Rotation Gestures: rotate, rotating, rotateLeft, rotateRight

@author Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
*/


(function() {
  "use strict";
  Quo.Gestures.add({
    name: "rotation",
    events: "rotate,rotating,rotateLeft,rotateRight".split(","),
    handler: (function(gm) {
      var IMPOSIBLE_ROTATION_FACTOR, TRIGGER_ANGLE, end, move, start, _check, _last, _num_rotations, _rotation, _sign, _start, _target;
      TRIGGER_ANGLE = 5;
      IMPOSIBLE_ROTATION_FACTOR = 20;
      _target = null;
      _num_rotations = 0;
      _start = null;
      _last = null;
      start = function(target, data) {
        if (data.length === 2) {
          _target = target;
          _num_rotations = 0;
          return _start = _rotation(data[0], data[1]);
        }
      };
      move = function(target, data) {
        var delta;
        if (_start && data.length === 2) {
          delta = _rotation(data[0], data[1]) - _start;
          if (_last && Math.abs(_last.delta - delta) > IMPOSIBLE_ROTATION_FACTOR) {
            delta += 360 * _sign(_last.delta);
          }
          if (Math.abs(delta) > 360) {
            _num_rotations++;
            delta -= 360 * _sign(_last.delta);
          }
          _last = {
            touches: data,
            delta: delta,
            rotationsCount: _num_rotations
          };
          return _check(true);
        }
      };
      end = function(target, data) {
        if (_start && _last) {
          _check(false);
          _target = null;
          _num_rotations = 0;
          _start = null;
          _last = null;
          return _start = null;
        }
      };
      _sign = function(num) {
        if (num < 0) {
          return -1;
        } else {
          return 1;
        }
      };
      _rotation = function(A, B) {
        var theta;
        theta = Math.atan2(A.y - B.y, A.x - B.x);
        return (theta < 0 ? theta + 2 * Math.PI : theta) * 180 / Math.PI;
      };
      _check = function(is_moving) {
        var ev;
        if (is_moving) {
          return gm.trigger(_target, "rotating", _last);
        } else if (Math.abs(_last.delta) > TRIGGER_ANGLE) {
          gm.trigger(_target, "rotate", _last);
          ev = _last.delta > 0 ? "rotateRight" : "rotateLeft";
          return gm.trigger(_target, ev, _last);
        }
      };
      return {
        start: start,
        move: move,
        end: end
      };
    })(Quo.Gestures)
  });

}).call(this);

/*
Quo Swipe Gestures: swipe, swiping, swipeLeft, swipeRight, swipeUp, swipeDown
New gestures added: swipingHorizontal, swipingVertical

@author Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
*/


(function() {
  "use strict";
  Quo.Gestures.add({
    name: "swipe",
    events: "swipe,swiping,swipeLeft,swipeRight,swipeUp,swipeDown,swipingHorizontal,swipingVertical".split(","),
    handler: (function(gm) {
      var TRIGGER_PIXELS, end, move, start, _check, _getInitialAxis, _last, _start, _start_axis, _target;
      TRIGGER_PIXELS = 20;
      _target = null;
      _start = null;
      _start_axis = null;
      _last = null;
      start = function(target, data) {
        if (data.length === 1) {
          _target = target;
          _start = data[0];
          return _last = null;
        }
      };
      move = function(target, data) {
        var delta, is_first;
        if (data.length === 1) {
          delta = {
            x: data[0].x - _start.x,
            y: data[0].y - _start.y
          };
          is_first = _last === null;
          _last = {
            x: data[0].x,
            y: data[0].y,
            delta: delta
          };
          return _check(true, is_first);
        } else {
          return _last = null;
        }
      };
      end = function(target, data) {
        if (_last) {
          _check(false);
          return _last = null;
        }
      };
      _check = function(is_moving, first_move) {
        var direction, directions, _i, _len, _results;
        if (first_move == null) {
          first_move = false;
        }
        if (is_moving) {
          if (first_move) {
            _start_axis = _getInitialAxis(_last.delta.x, _last.delta.y);
          }
          if (_start_axis !== null) {
            gm.trigger(_target, "swiping" + _start_axis, _last);
          }
          return gm.trigger(_target, "swiping", _last);
        } else {
          directions = [];
          if (Math.abs(_last.delta.y) > TRIGGER_PIXELS) {
            directions.push(_last.delta.y < 0 ? "Up" : "Down");
          }
          if (Math.abs(_last.delta.x) > TRIGGER_PIXELS) {
            directions.push(_last.delta.x < 0 ? "Left" : "Right");
          }
          if (directions.length) {
            gm.trigger(_target, "swipe", _last);
            _results = [];
            for (_i = 0, _len = directions.length; _i < _len; _i++) {
              direction = directions[_i];
              _results.push(gm.trigger(_target, "swipe" + direction, _last));
            }
            return _results;
          }
        }
      };
      _getInitialAxis = function(x, y) {
        var axis;
        axis = null;
        if (Math.round(Math.abs(x / y)) >= 2) {
          axis = "Horizontal";
        } else if (Math.round(Math.abs(y / x)) >= 2) {
          axis = "Vertical";
        }
        return axis;
      };
      return {
        start: start,
        move: move,
        end: end
      };
    })(Quo.Gestures)
  });

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class Output

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    /*
    Get/Set text to a given instance element
    @method text
    @param  {string} [OPTIONAL] Value of text
    */

    $$.fn.text = function(value) {
      if (value != null) {
        return this.each(function() {
          return this.textContent = value;
        });
      } else {
        if (this.length > 0) {
          return this[0].textContent;
        } else {
          return "";
        }
      }
    };
    /*
    Get/Set html to a given instance element
    @method html
    @param  {variable} [OPTIONAL] Value of html
    */

    $$.fn.html = function(value) {
      var type;
      if (value != null) {
        type = $$.toType(value);
        return this.each(function() {
          var _this = this;
          if (type === "string") {
            return this.innerHTML = value;
          } else if (type === "array") {
            return value.forEach(function(slice) {
              return $$(_this).html(slice);
            });
          } else {
            return this.innerHTML += $$(value).html();
          }
        });
      } else {
        if (this.length > 0) {
          return this[0].innerHTML;
        } else {
          return "";
        }
      }
    };
    /*
    Remove the set of matched elements to a given instance element
    @method remove
    */

    $$.fn.remove = function() {
      return this.each(function() {
        if (this.parentNode != null) {
          return this.parentNode.removeChild(this);
        }
      });
    };
    /*
    Remove all child nodes of the set of matched elements to a given instance element
    @method remove
    */

    $$.fn.empty = function() {
      return this.each(function() {
        return this.innerHTML = null;
      });
    };
    /*
    Append a html to a given instance element
    @method append
    @param  {html} Value of html
    */

    $$.fn.append = function(value) {
      var type;
      type = $$.toType(value);
      return this.each(function() {
        var _this = this;
        if (type === "string") {
          return this.insertAdjacentHTML("beforeend", value);
        } else if (type === "array") {
          return value.forEach(function(slice) {
            return $$(_this).append(slice);
          });
        } else {
          return this.appendChild(value);
        }
      });
    };
    /*
    Prepend a html to a given instance element
    @method prepend
    @param  {html} Value of html
    */

    $$.fn.prepend = function(value) {
      var type;
      type = $$.toType(value);
      return this.each(function() {
        var _this = this;
        if (type === "string") {
          return this.insertAdjacentHTML("afterbegin", value);
        } else if (type === "array") {
          return value.each(function(index, value) {
            return _this.insertBefore(value, _this.firstChild);
          });
        } else {
          return this.insertBefore(value, this.firstChild);
        }
      });
    };
    /*
    Replace each element in the set of matched elements with the provided new
    content and return the set of elements that was removed.
    @method prepend
    @param  {html} The content to insert (HTML string, DOMelement, array of DOMelements)
    */

    return $$.fn.replaceWith = function(value) {
      var type;
      type = $$.toType(value);
      this.each(function() {
        var _this = this;
        if (this.parentNode) {
          if (type === "string") {
            return this.insertAdjacentHTML("beforeBegin", value);
          } else if (type === "array") {
            return value.each(function(index, value) {
              return _this.parentNode.insertBefore(value, _this);
            });
          } else {
            return this.parentNode.insertBefore(value, this);
          }
        }
      });
      return this.remove();
    };
  })(Quo);

}).call(this);
/*
Basic Quo Module

@namespace Quo
@class Query

@author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {
  "use strict";
  (function($$) {
    var PARENT_NODE, _filtered, _findAncestors, _getSibling;
    PARENT_NODE = "parentNode";
    /*
    Get the descendants of each element in the current instance
    @method find
    @param  {string} A string containing a selector expression to match elements against.
    */

    $$.fn.find = function(selector) {
      var result;
      if (this.length === 1) {
        result = Quo.query(this[0], selector);
      } else {
        result = this.map(function() {
          return Quo.query(this, selector);
        });
      }
      return $$(result);
    };
    /*
    Get the parent of each element in the current instance
    @method parent
    @param  {string} A string containing a selector expression to match elements against.
    */

    $$.fn.parent = function(selector) {
      var ancestors;
      ancestors = selector ? _findAncestors(this) : this.instance(PARENT_NODE);
      return _filtered(ancestors, selector);
    };
    /*
    Get the children of each element in the current instance
    @method children
    @param  {string} A string containing a selector expression to match elements against.
    */

    $$.fn.children = function(selector) {
      var elements;
      elements = this.map(function() {
        return Array.prototype.slice.call(this.children);
      });
      return _filtered(elements, selector);
    };
    /*
    Get the siblings of each element in the current instance
    @method siblings
    @param  {string} A string containing a selector expression to match elements against.
    */

    $$.fn.siblings = function(selector) {
      var elements;
      elements = this.map(function(index, element) {
        return Array.prototype.slice.call(element.parentNode.children).filter(function(child) {
          return child !== element;
        });
      });
      return _filtered(elements, selector);
    };
    /*
    Retrieve the DOM elements matched by the QuoJS object.
    @method get
    @param  {number} [OPTIONAL] A zero-based integer indicating which element to retrieve
    */

    $$.fn.get = function(index) {
      return this[index] || null;
    };
    /*
    Reduce the set of matched elements to the first in the set.
    @method first
    */

    $$.fn.first = function() {
      return $$(this[0]);
    };
    /*
    Reduce the set of matched elements to the final one in the set.
    @method last
    */

    $$.fn.last = function() {
      return $$(this[this.length - 1]);
    };
    /*
    Reduce the set of matched elements to the final one in the set.
    @method closest
    @param  {string} A string containing a selector expression to match elements against.
    @param  {instance} [OPTIONAL] A DOM element within which a matching element may be found.
    */

    $$.fn.closest = function(selector, context) {
      var candidates, node;
      node = this[0];
      candidates = $$(selector);
      if (!candidates.length) {
        node = null;
      }
      while (node && candidates.indexOf(node) < 0) {
        node = node !== context && node !== document && node.parentNode;
      }
      return $$(node);
    };
    /*
    Get the immediately following sibling of each element in the instance.
    @method next
    */

    $$.fn.next = function() {
      return _getSibling.call(this, "nextSibling");
    };
    /*
    Get the immediately preceding sibling of each element in the instance.
    @method prev
    */

    $$.fn.prev = function() {
      return _getSibling.call(this, "previousSibling");
    };
    $$.fn.instance = function(property) {
      return this.map(function() {
        return this[property];
      });
    };
    $$.fn.map = function(callback) {
      return $$.map(this, function(el, i) {
        return callback.call(el, i, el);
      });
    };
    _findAncestors = function(nodes) {
      var ancestors;
      ancestors = [];
      while (nodes.length > 0) {
        nodes = $$.map(nodes, function(node) {
          node = node.parentNode;
          if (node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        });
      }
      return ancestors;
    };
    _filtered = function(nodes, selector) {
      if (selector != null) {
        return $$(nodes).filter(selector);
      } else {
        return $$(nodes);
      }
    };
    return _getSibling = function(command) {
      var element;
      element = this[0][command];
      while (element && element.nodeType !== 1) {
        element = element[command];
      }
      return $$(element);
    };
  })(Quo);

}).call(this);
