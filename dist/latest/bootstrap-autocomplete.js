/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* =============================================================
	 * bootstrap-autocomplete.js v0.0.1
	 * https://github.com/xcash/bootstrap-autocomplete
	 * =============================================================
	 * Forked from bootstrap3-typeahead.js v3.1.0
	 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
	 * =============================================================
	 * Original written by @mdo and @fat
	 * =============================================================
	 * Copyright 2016 Paolo Casciello @xcash666 and contributors
	 *
	 * Licensed under the MIT License (the 'License');
	 * you may not use this file except in compliance with the License.
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an 'AS IS' BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ============================================================ */
	var resolvers_1 = __webpack_require__(1);
	var dropdown_1 = __webpack_require__(2);
	var AutoCompleteNS;
	(function (AutoCompleteNS) {
	    var AutoComplete = (function () {
	        function AutoComplete(element, options) {
	            this._settings = {
	                resolver: 'ajax',
	                resolverSettings: {},
	                minLength: 3,
	                formatResult: this.defaultFormatResult,
	                autoSelect: true
	            };
	            this._el = element;
	            this._$el = $(this._el);
	            this._settings = $.extend(true, {}, this._settings, options);
	            // console.log('initializing', this._$el);
	            this.init();
	        }
	        AutoComplete.prototype.getSettings = function () {
	            return this._settings;
	        };
	        AutoComplete.prototype.init = function () {
	            // bind default events
	            this.bindDefaultEventListeners();
	            // RESOLVER
	            if (this._settings.resolver == 'ajax') {
	                // configure default resolver
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect);
	        };
	        AutoComplete.prototype.bindDefaultEventListeners = function () {
	            var _this = this;
	            this._$el.on('keyup', function (evt) {
	                // check key
	                switch (evt.which) {
	                    case 38:
	                        // arrow UP
	                        break;
	                    case 40:
	                        // arrow DOWN
	                        _this._dd.focusItem(0);
	                        break;
	                    case 27:
	                        // ESC
	                        _this._dd.hide();
	                        break;
	                    default:
	                        var newValue = _this._$el.val();
	                        _this._$el.trigger('autocomplete.search.typed', newValue);
	                }
	            });
	            // typed. event launched when field's value changes
	            this._$el.on('autocomplete.search.typed', function (evt, newValue) {
	                _this.defaultEventTyped(newValue);
	            });
	            // search.pre. event launched before actual search
	            this._$el.on('autocomplete.search.pre', function (evt, newValue) {
	                _this.defaultEventPreSearch(newValue);
	            });
	            // search.do. event launched to perform a search, it calls the callback upon search results
	            this._$el.on('autocomplete.search.do', function (evt, newValue, callback) {
	                _this.defaultEventDoSearch(newValue, callback);
	            });
	            // search.post. event launched after the search returns with data, before drawing
	            // receives `results`
	            this._$el.on('autocomplete.search.post', function (evt, results) {
	                _this.defaultEventPostSearch(results);
	            });
	            // selected event
	            this._$el.on('autocomplete.select', function (evt, item) {
	                _this.itemSelectedDefaultHandler(item);
	            });
	        };
	        AutoComplete.prototype.defaultEventTyped = function (newValue) {
	            // field value changed
	            // if value >= minLength, start autocomplete
	            if (newValue.length >= this._settings.minLength) {
	                this._searchText = newValue;
	                this._$el.trigger('autocomplete.search.pre', newValue);
	            }
	            else {
	                this._dd.hide();
	            }
	        };
	        AutoComplete.prototype.defaultEventPreSearch = function (newValue) {
	            var _this = this;
	            // do nothing, start search
	            this._$el.trigger('autocomplete.search.do', [newValue, function (results) {
	                    // to prevent `this` problems
	                    _this.defaultEventPostSearchCallback(results);
	                }]);
	        };
	        AutoComplete.prototype.defaultEventDoSearch = function (newValue, callback) {
	            // search using current resolver
	            if (this.resolver) {
	                this.resolver.search(newValue, callback);
	            }
	            // if no resoler, user overrides the search event
	        };
	        AutoComplete.prototype.defaultEventPostSearchCallback = function (results) {
	            // console.log('callback called', results);
	            this._$el.trigger('autocomplete.search.post', [results]);
	        };
	        AutoComplete.prototype.defaultEventPostSearch = function (results) {
	            this.defaultEventStartShow(results);
	        };
	        AutoComplete.prototype.defaultEventStartShow = function (results) {
	            // console.log("defaultEventStartShow", results);
	            // for every result, draw it
	            this._dd.updateItems(results, this._searchText);
	            this._dd.show();
	        };
	        AutoComplete.prototype.itemSelectedDefaultHandler = function (item) {
	            // console.log('itemSelectedDefaultHandler', item);
	            // default behaviour is set elment's .val()
	            var itemFormatted = this._settings.formatResult(item);
	            this._$el.val(itemFormatted.text);
	            // and hide
	            this._dd.hide();
	        };
	        AutoComplete.prototype.defaultFormatResult = function (item) {
	            if (typeof item === 'string') {
	                return { text: item };
	            }
	            else if (item.text) {
	                return item;
	            }
	            else {
	                // return a toString of the item as last resort
	                // console.error('No default formatter for item', item);
	                return { text: item.toString() };
	            }
	        };
	        AutoComplete.NAME = 'autoComplete';
	        return AutoComplete;
	    }());
	    AutoCompleteNS.AutoComplete = AutoComplete;
	})(AutoCompleteNS || (AutoCompleteNS = {}));
	(function ($, window, document) {
	    $.fn[AutoCompleteNS.AutoComplete.NAME] = function (options) {
	        return this.each(function () {
	            var pluginClass;
	            pluginClass = $(this).data(AutoCompleteNS.AutoComplete.NAME);
	            if (!pluginClass) {
	                pluginClass = new AutoCompleteNS.AutoComplete(this, options);
	                $(this).data(AutoCompleteNS.AutoComplete.NAME, pluginClass);
	            }
	        });
	    };
	})(jQuery, window, document);
	// (function (root, factory) {
	//   'use strict';
	//   factory(jQuery);
	// }(this, function ($) {
	//   'use strict';
	//   // jshint laxcomma: true
	//  /* TYPEAHEAD PUBLIC CLASS DEFINITION
	//   * ================================= */
	//   var Typeahead = function (element, options) {
	//     this.$element = $(element);
	//     this.options = $.extend({}, $.fn.typeahead.defaults, options);
	//     this.matcher = this.options.matcher || this.matcher;
	//     this.sorter = this.options.sorter || this.sorter;
	//     this.select = this.options.select || this.select;
	//     this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
	//     this.highlighter = this.options.highlighter || this.highlighter;
	//     this.render = this.options.render || this.render;
	//     this.updater = this.options.updater || this.updater;
	//     this.displayText = this.options.displayText || this.displayText;
	//     this.selectedText = this.options.selectedText || this.selectedText;
	//     this.source = this.options.source;
	//     this.delay = this.options.delay;
	//     this.$menu = $(this.options.menu);
	//     this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
	//     this.fitToElement = typeof this.options.fitToElement == 'boolean' ? this.options.fitToElement : false;
	//     this.shown = false;
	//     this.listen();
	//     this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' || this.options.showHintOnFocus === "all" ? this.options.showHintOnFocus : false;
	//     this.afterSelect = this.options.afterSelect;
	//     this.addItem = false;
	//     this.value = this.$element.val() || this.$element.text();
	//   };
	//   Typeahead.prototype = {
	//     constructor: Typeahead,
	//     select: function () {
	//       var val = this.$menu.find('.active').data('value');
	//       this.$element.data('active', val);
	//       if (this.autoSelect || val) {
	//         var newVal = this.updater(val);
	//         // Updater can be set to any random functions via "options" parameter in constructor above.
	//         // Add null check for cases when updater returns void or undefined.
	//         if (!newVal) {
	//           newVal = '';
	//         }
	//         var selectedVal = this.selectedText(newVal);
	//         if (selectedVal !== false) {
	//           this.$element
	//             .val(selectedVal)
	//             .text(this.displayText(newVal) || newVal)
	//             .change();
	//         }
	//         this.afterSelect(newVal);
	//       }
	//       return this.hide();
	//     },
	//     updater: function (item) {
	//       return item;
	//     },
	//     setSource: function (source) {
	//       this.source = source;
	//     },
	//     show: function () {
	//       var pos = $.extend({}, this.$element.position(), {
	//         height: this.$element[0].offsetHeight
	//       });
	//       var scrollHeight = typeof this.options.scrollHeight == 'function' ?
	//           this.options.scrollHeight.call() :
	//           this.options.scrollHeight;
	//       var element;
	//       if (this.shown) {
	//         element = this.$menu;
	//       } else if (this.$appendTo) {
	//         element = this.$menu.appendTo(this.$appendTo);
	//         this.hasSameParent = this.$appendTo.is(this.$element.parent());
	//       } else {
	//         element = this.$menu.insertAfter(this.$element);
	//         this.hasSameParent = true;
	//       }      
	//       if (!this.hasSameParent) {
	//           // We cannot rely on the element position, need to position relative to the window
	//           element.css("position", "fixed");
	//           var offset = this.$element.offset();
	//           pos.top =  offset.top;
	//           pos.left = offset.left;
	//       }
	//       // The rules for bootstrap are: 'dropup' in the parent and 'dropdown-menu-right' in the element.
	//       // Note that to get right alignment, you'll need to specify `menu` in the options to be:
	//       // '<ul class="typeahead dropdown-menu" role="listbox"></ul>'
	//       var dropup = $(element).parent().hasClass('dropup');
	//       var newTop = dropup ? 'auto' : (pos.top + pos.height + scrollHeight);
	//       var right = $(element).hasClass('dropdown-menu-right');
	//       var newLeft = right ? 'auto' : pos.left;
	//       // it seems like setting the css is a bad idea (just let Bootstrap do it), but I'll keep the old
	//       // logic in place except for the dropup/right-align cases.
	//       element.css({ top: newTop, left: newLeft }).show();
	//       if (this.options.fitToElement === true) {
	//           element.css("width", this.$element.outerWidth() + "px");
	//       }
	//       this.shown = true;
	//       return this;
	//     },
	//     hide: function () {
	//       this.$menu.hide();
	//       this.shown = false;
	//       return this;
	//     },
	//     lookup: function (query) {
	//       var items;
	//       if (typeof(query) != 'undefined' && query !== null) {
	//         this.query = query;
	//       } else {
	//         this.query = this.$element.val() || this.$element.text() || '';
	//       }
	//       if (this.query.length < this.options.minLength && !this.options.showHintOnFocus) {
	//         return this.shown ? this.hide() : this;
	//       }
	//       var worker = $.proxy(function () {
	//         if ($.isFunction(this.source)) {
	//           this.source(this.query, $.proxy(this.process, this));
	//         } else if (this.source) {
	//           this.process(this.source);
	//         }
	//       }, this);
	//       clearTimeout(this.lookupWorker);
	//       this.lookupWorker = setTimeout(worker, this.delay);
	//     },
	//     process: function (items) {
	//       var that = this;
	//       items = $.grep(items, function (item) {
	//         return that.matcher(item);
	//       });
	//       items = this.sorter(items);
	//       if (!items.length && !this.options.addItem) {
	//         return this.shown ? this.hide() : this;
	//       }
	//       if (items.length > 0) {
	//         this.$element.data('active', items[0]);
	//       } else {
	//         this.$element.data('active', null);
	//       }
	//       // Add item
	//       if (this.options.addItem){
	//         items.push(this.options.addItem);
	//       }
	//       if (this.options.items == 'all') {
	//         return this.render(items).show();
	//       } else {
	//         return this.render(items.slice(0, this.options.items)).show();
	//       }
	//     },
	//     matcher: function (item) {
	//       var it = this.displayText(item);
	//       return ~it.toLowerCase().indexOf(this.query.toLowerCase());
	//     },
	//     sorter: function (items) {
	//       var beginswith = [];
	//       var caseSensitive = [];
	//       var caseInsensitive = [];
	//       var item;
	//       while ((item = items.shift())) {
	//         var it = this.displayText(item);
	//         if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
	//         else if (~it.indexOf(this.query)) caseSensitive.push(item);
	//         else caseInsensitive.push(item);
	//       }
	//       return beginswith.concat(caseSensitive, caseInsensitive);
	//     },
	//     highlighter: function (item) {
	//       var html = $('<div></div>');
	//       var query = this.query;
	//       var i = item.toLowerCase().indexOf(query.toLowerCase());
	//       var len = query.length;
	//       var leftPart;
	//       var middlePart;
	//       var rightPart;
	//       var strong;
	//       if (len === 0) {
	//         return html.text(item).html();
	//       }
	//       while (i > -1) {
	//         leftPart = item.substr(0, i);
	//         middlePart = item.substr(i, len);
	//         rightPart = item.substr(i + len);
	//         strong = $('<strong></strong>').text(middlePart);
	//         html
	//           .append(document.createTextNode(leftPart))
	//           .append(strong);
	//         item = rightPart;
	//         i = item.toLowerCase().indexOf(query.toLowerCase());
	//       }
	//       return html.append(document.createTextNode(item)).html();
	//     },
	//     render: function (items) {
	//       var that = this;
	//       var self = this;
	//       var activeFound = false;
	//       var data = [];
	//       var _category = that.options.separator;
	//       $.each(items, function (key,value) {
	//         // inject separator
	//         if (key > 0 && value[_category] !== items[key - 1][_category]){
	//           data.push({
	//             __type: 'divider'
	//           });
	//         }
	//         // inject category header
	//         if (value[_category] && (key === 0 || value[_category] !== items[key - 1][_category])){
	//           data.push({
	//             __type: 'category',
	//             name: value[_category]
	//           });
	//         }
	//         data.push(value);
	//       });
	//       items = $(data).map(function (i, item) {
	//         if ((item.__type || false) == 'category'){
	//           return $(that.options.headerHtml).text(item.name)[0];
	//         }
	//         if ((item.__type || false) == 'divider'){
	//           return $(that.options.headerDivider)[0];
	//         }
	//         var text = self.displayText(item);
	//         i = $(that.options.item).data('value', item);
	//         i.find('a').html(that.highlighter(text, item));
	//         if (text == self.$element.val()) {
	//           i.addClass('active');
	//           self.$element.data('active', item);
	//           activeFound = true;
	//         }
	//         return i[0];
	//       });
	//       if (this.autoSelect && !activeFound) {
	//         items.filter(':not(.dropdown-header)').first().addClass('active');
	//         this.$element.data('active', items.first().data('value'));
	//       }
	//       this.$menu.html(items);
	//       return this;
	//     },
	//     displayText: function (item) {
	//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
	//     },
	//     selectedText: function(item) {
	//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
	//     },
	//     next: function (event) {
	//       var active = this.$menu.find('.active').removeClass('active');
	//       var next = active.next();
	//       if (!next.length) {
	//         next = $(this.$menu.find('li')[0]);
	//       }
	//       next.addClass('active');
	//     },
	//     prev: function (event) {
	//       var active = this.$menu.find('.active').removeClass('active');
	//       var prev = active.prev();
	//       if (!prev.length) {
	//         prev = this.$menu.find('li').last();
	//       }
	//       prev.addClass('active');
	//     },
	//     listen: function () {
	//       this.$element
	//         .on('focus',    $.proxy(this.focus, this))
	//         .on('blur',     $.proxy(this.blur, this))
	//         .on('keypress', $.proxy(this.keypress, this))
	//         .on('input',    $.proxy(this.input, this))
	//         .on('keyup',    $.proxy(this.keyup, this));
	//       if (this.eventSupported('keydown')) {
	//         this.$element.on('keydown', $.proxy(this.keydown, this));
	//       }
	//       this.$menu
	//         .on('click', $.proxy(this.click, this))
	//         .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
	//         .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
	//         .on('mousedown', $.proxy(this.mousedown,this));
	//     },
	//     destroy : function () {
	//       this.$element.data('typeahead',null);
	//       this.$element.data('active',null);
	//       this.$element
	//         .off('focus')
	//         .off('blur')
	//         .off('keypress')
	//         .off('input')
	//         .off('keyup');
	//       if (this.eventSupported('keydown')) {
	//         this.$element.off('keydown');
	//       }
	//       this.$menu.remove();
	//       this.destroyed = true;
	//     },
	//     eventSupported: function (eventName) {
	//       var isSupported = eventName in this.$element;
	//       if (!isSupported) {
	//         this.$element.setAttribute(eventName, 'return;');
	//         isSupported = typeof this.$element[eventName] === 'function';
	//       }
	//       return isSupported;
	//     },
	//     move: function (e) {
	//       if (!this.shown) return;
	//       switch (e.keyCode) {
	//         case 9: // tab
	//         case 13: // enter
	//         case 27: // escape
	//           e.preventDefault();
	//           break;
	//         case 38: // up arrow
	//           // with the shiftKey (this is actually the left parenthesis)
	//           if (e.shiftKey) return;
	//           e.preventDefault();
	//           this.prev();
	//           break;
	//         case 40: // down arrow
	//           // with the shiftKey (this is actually the right parenthesis)
	//           if (e.shiftKey) return;
	//           e.preventDefault();
	//           this.next();
	//           break;
	//       }
	//     },
	//     keydown: function (e) {
	//       this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
	//       if (!this.shown && e.keyCode == 40) {
	//         this.lookup();
	//       } else {
	//         this.move(e);
	//       }
	//     },
	//     keypress: function (e) {
	//       if (this.suppressKeyPressRepeat) return;
	//       this.move(e);
	//     },
	//     input: function (e) {
	//       // This is a fixed for IE10/11 that fires the input event when a placehoder is changed
	//       // (https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus)
	//       var currentValue = this.$element.val() || this.$element.text();
	//       if (this.value !== currentValue) {
	//         this.value = currentValue;
	//         this.lookup();
	//       }
	//     },
	//     keyup: function (e) {
	//       if (this.destroyed) {
	//         return;
	//       }
	//       switch (e.keyCode) {
	//         case 40: // down arrow
	//         case 38: // up arrow
	//         case 16: // shift
	//         case 17: // ctrl
	//         case 18: // alt
	//           break;
	//         case 9: // tab
	//         case 13: // enter
	//           if (!this.shown) return;
	//           this.select();
	//           break;
	//         case 27: // escape
	//           if (!this.shown) return;
	//           this.hide();
	//           break;
	//       }
	//     },
	//     focus: function (e) {
	//       if (!this.focused) {
	//         this.focused = true;
	//         if (this.options.showHintOnFocus && this.skipShowHintOnFocus !== true) {
	//           if(this.options.showHintOnFocus === "all") {
	//             this.lookup(""); 
	//           } else {
	//             this.lookup();
	//           }
	//         }
	//       }
	//       if (this.skipShowHintOnFocus) {
	//         this.skipShowHintOnFocus = false;
	//       }
	//     },
	//     blur: function (e) {
	//       if (!this.mousedover && !this.mouseddown && this.shown) {
	//         this.hide();
	//         this.focused = false;
	//       } else if (this.mouseddown) {
	//         // This is for IE that blurs the input when user clicks on scroll.
	//         // We set the focus back on the input and prevent the lookup to occur again
	//         this.skipShowHintOnFocus = true;
	//         this.$element.focus();
	//         this.mouseddown = false;
	//       } 
	//     },
	//     click: function (e) {
	//       e.preventDefault();
	//       this.skipShowHintOnFocus = true;
	//       this.select();
	//       this.$element.focus();
	//       this.hide();
	//     },
	//     mouseenter: function (e) {
	//       this.mousedover = true;
	//       this.$menu.find('.active').removeClass('active');
	//       $(e.currentTarget).addClass('active');
	//     },
	//     mouseleave: function (e) {
	//       this.mousedover = false;
	//       if (!this.focused && this.shown) this.hide();
	//     },
	//    /**
	//      * We track the mousedown for IE. When clicking on the menu scrollbar, IE makes the input blur thus hiding the menu.
	//      */
	//     mousedown: function (e) {
	//       this.mouseddown = true;
	//       this.$menu.one("mouseup", function(e){
	//         // IE won't fire this, but FF and Chrome will so we reset our flag for them here
	//         this.mouseddown = false;
	//       }.bind(this));
	//     },
	//   };
	//   /* TYPEAHEAD PLUGIN DEFINITION
	//    * =========================== */
	//   var old = $.fn.typeahead;
	//   $.fn.typeahead = function (option) {
	//     var arg = arguments;
	//     if (typeof option == 'string' && option == 'getActive') {
	//       return this.data('active');
	//     }
	//     return this.each(function () {
	//       var $this = $(this);
	//       var data = $this.data('typeahead');
	//       var options = typeof option == 'object' && option;
	//       if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
	//       if (typeof option == 'string' && data[option]) {
	//         if (arg.length > 1) {
	//           data[option].apply(data, Array.prototype.slice.call(arg, 1));
	//         } else {
	//           data[option]();
	//         }
	//       }
	//     });
	//   };
	//   $.fn.typeahead.defaults = {
	//     source: [],
	//     items: 8,
	//     menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
	//     item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
	//     minLength: 1,
	//     scrollHeight: 0,
	//     autoSelect: true,
	//     afterSelect: $.noop,
	//     addItem: false,
	//     delay: 0,
	//     separator: 'category',
	//     headerHtml: '<li class="dropdown-header"></li>',
	//     headerDivider: '<li class="divider" role="separator"></li>'
	//   };
	//   $.fn.typeahead.Constructor = Typeahead;
	//  /* TYPEAHEAD NO CONFLICT
	//   * =================== */
	//   $.fn.typeahead.noConflict = function () {
	//     $.fn.typeahead = old;
	//     return this;
	//   };
	//  /* TYPEAHEAD DATA-API
	//   * ================== */
	//   $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
	//     var $this = $(this);
	//     if ($this.data('typeahead')) return;
	//     $this.typeahead($this.data());
	//   });
	// }));


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BaseResolver = (function () {
	    function BaseResolver(options) {
	        this._settings = $.extend(true, {}, this.getDefaults(), options);
	    }
	    BaseResolver.prototype.getDefaults = function () {
	        return {};
	    };
	    BaseResolver.prototype.getResults = function (limit, start, end) {
	        return this.results;
	    };
	    BaseResolver.prototype.search = function (q, cbk) {
	        cbk(this.getResults());
	    };
	    return BaseResolver;
	}());
	var AjaxResolver = (function (_super) {
	    __extends(AjaxResolver, _super);
	    function AjaxResolver(options) {
	        _super.call(this, options);
	        // console.log('resolver settings', this._settings);
	    }
	    AjaxResolver.prototype.getDefaults = function () {
	        return {
	            url: '',
	            method: 'get',
	            queryKey: 'q',
	            extraData: {},
	            timeout: undefined,
	        };
	    };
	    AjaxResolver.prototype.search = function (q, cbk) {
	        var _this = this;
	        if (this.jqXHR != null) {
	            this.jqXHR.abort();
	        }
	        var data = {};
	        data[this._settings.queryKey] = q;
	        $.extend(data, this._settings.extraData);
	        this.jqXHR = $.ajax(this._settings.url, {
	            method: this._settings.method,
	            data: data,
	            timeout: this._settings.timeout
	        });
	        this.jqXHR.done(function (result) {
	            cbk(result);
	        });
	        this.jqXHR.fail(function (err) {
	            console.log(err);
	        });
	        this.jqXHR.always(function () {
	            _this.jqXHR = null;
	        });
	    };
	    return AjaxResolver;
	}(BaseResolver));
	exports.AjaxResolver = AjaxResolver;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/*
	 *	Dropdown class. Manages the dropdown drawing
	 */
	var Dropdown = (function () {
	    function Dropdown(e, formatItemCbk, autoSelect) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
	        this.autoSelect = autoSelect;
	        this.init();
	    }
	    Dropdown.prototype.init = function () {
	        var _this = this;
	        // Initialize dropdown
	        var pos = $.extend({}, this._$el.position(), {
	            height: this._$el[0].offsetHeight
	        });
	        // create element
	        this._dd = $('<ul />');
	        // add our class and basic dropdown-menu class
	        this._dd.addClass('bootstrap-autocomplete dropdown-menu');
	        this._dd.insertAfter(this._$el);
	        this._dd.css({ left: pos.left, width: this._$el.outerWidth() });
	        // click event on items
	        this._dd.on('click', 'li', function (evt) {
	            // console.log('clicked', evt.currentTarget);
	            //console.log($(evt.currentTarget));
	            var item = $(evt.currentTarget).data('item');
	            _this.itemSelectedLaunchEvent(item);
	        });
	        this._dd.on('keyup', function (evt) {
	            if (_this.shown) {
	                switch (evt.which) {
	                    case 27:
	                        // ESC
	                        _this.hide();
	                        _this._$el.focus();
	                        break;
	                }
	                return false;
	            }
	        });
	        this._dd.on('focus', 'li a', function (evt) {
	            $(evt.currentTarget).closest('ul').find('li.active').removeClass('active');
	            $(evt.currentTarget).closest('li').addClass('active');
	        });
	        this._dd.on('mouseenter', 'li', function (evt) {
	            $(evt.currentTarget).find('a').focus();
	        });
	        this.initialized = true;
	    };
	    Dropdown.prototype.focusItem = function (index) {
	        // Focus an item in the list
	        if (this.shown && (this.items.length > index))
	            this._dd.find('li').eq(index).find('a').focus();
	    };
	    Dropdown.prototype.show = function () {
	        if (!this.shown) {
	            this._dd.dropdown().show();
	            this.shown = true;
	        }
	    };
	    Dropdown.prototype.isShown = function () {
	        return this.shown;
	    };
	    Dropdown.prototype.hide = function () {
	        if (this.shown) {
	            this._dd.dropdown().hide();
	            this.shown = false;
	        }
	    };
	    Dropdown.prototype.updateItems = function (items, searchText) {
	        // console.log('updateItems', items);
	        this.items = items;
	        this.searchText = searchText;
	        this.refreshItemList();
	    };
	    Dropdown.prototype.showMatchedText = function (text, qry) {
	        var startIndex = text.toLowerCase().indexOf(qry.toLowerCase());
	        if (startIndex > -1) {
	            var endIndex = startIndex + qry.length;
	            return text.slice(0, startIndex) + '<b>'
	                + text.slice(startIndex, endIndex) + '</b>'
	                + text.slice(endIndex);
	        }
	        return text;
	    };
	    Dropdown.prototype.refreshItemList = function () {
	        var _this = this;
	        this._dd.empty();
	        this.items.forEach(function (item) {
	            var itemFormatted = _this.formatItem(item);
	            if (typeof itemFormatted === 'string') {
	                itemFormatted = { text: itemFormatted };
	            }
	            var itemText = itemFormatted.text;
	            itemText = _this.showMatchedText(itemText, _this.searchText);
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').html(itemText))
	                .data('item', item);
	            // TODO optimize 
	            _this._dd.append(li);
	        });
	    };
	    Dropdown.prototype.itemSelectedLaunchEvent = function (item) {
	        // launch selected event
	        // console.log('itemSelectedLaunchEvent', item);
	        this._$el.trigger('autocomplete.select', item);
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGJlYWZiNTE1ZTBiZTZkMWJkODMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQWdLcEI7QUFoS0QsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQWtCRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQVZoQyxjQUFTLEdBQUc7aUJBQ2xCLFFBQVEsRUFBVSxNQUFNO2lCQUN4QixnQkFBZ0IsRUFBTyxFQUFFO2lCQUN6QixTQUFTLEVBQVUsQ0FBQztpQkFDcEIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2NBQzFCO2FBS0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFFN0QsMENBQTBDO2FBRTFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FB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QUN6QztrQkFDQSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBRXBCLGlCQUFpQjthQUNqQixLQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQixDQUFDLENBQUMsQ0FBQztLQUNKLENBQUM7S0FFUywwQ0FBdUIsR0FBakMsVUFBa0MsSUFBUTtTQUN6Qyx3QkFBd0I7U0FDeEIsZ0RBQWdEO1NBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQztLQUMvQyxDQUFDO0tBRUYsZUFBQztBQUFELEVBQUM7QUF6SVksaUJBQVEsV0F5SXBCIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGRiZWFmYjUxNWUwYmU2ZDFiZDgzXG4gKiovIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWF1dG9jb21wbGV0ZS5qcyB2MC4wLjFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS94Y2FzaC9ib290c3RyYXAtYXV0b2NvbXBsZXRlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBGb3JrZWQgZnJvbSBib290c3RyYXAzLXR5cGVhaGVhZC5qcyB2My4xLjBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9iYXNzam9ic2VuL0Jvb3RzdHJhcC0zLVR5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogT3JpZ2luYWwgd3JpdHRlbiBieSBAbWRvIGFuZCBAZmF0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxNiBQYW9sbyBDYXNjaWVsbG8gQHhjYXNoNjY2IGFuZCBjb250cmlidXRvcnNcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKHRoZSAnTGljZW5zZScpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuICdBUyBJUycgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5pbXBvcnQgeyBBamF4UmVzb2x2ZXIgfSBmcm9tICcuL3Jlc29sdmVycyc7XG5pbXBvcnQgeyBEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuXG5tb2R1bGUgQXV0b0NvbXBsZXRlTlMge1xuICBleHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBwdWJsaWMgc3RhdGljIE5BTUU6c3RyaW5nID0gJ2F1dG9Db21wbGV0ZSc7XG5cbiAgICBwcml2YXRlIF9lbDpFbGVtZW50O1xuICAgIHByaXZhdGUgXyRlbDpKUXVlcnk7XG4gICAgcHJpdmF0ZSBfZGQ6RHJvcGRvd247XG4gICAgcHJpdmF0ZSBfc2VhcmNoVGV4dDpzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9zZXR0aW5ncyA9IHtcbiAgICAgIHJlc29sdmVyOjxzdHJpbmc+ICdhamF4JyxcbiAgICAgIHJlc29sdmVyU2V0dGluZ3M6PGFueT4ge30sXG4gICAgICBtaW5MZW5ndGg6PG51bWJlcj4gMyxcbiAgICAgIGZvcm1hdFJlc3VsdDo8RnVuY3Rpb24+IHRoaXMuZGVmYXVsdEZvcm1hdFJlc3VsdCxcbiAgICAgIGF1dG9TZWxlY3Q6PGJvb2xlYW4+IHRydWVcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9uczphbnkpIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fc2V0dGluZ3MsIG9wdGlvbnMpO1xuICAgICAgXG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5pdGlhbGl6aW5nJywgdGhpcy5fJGVsKTtcbiAgICAgIFxuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTZXR0aW5ncygpOnt9IHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncztcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdCgpOnZvaWQge1xuICAgICAgLy8gYmluZCBkZWZhdWx0IGV2ZW50c1xuICAgICAgdGhpcy5iaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAvLyBSRVNPTFZFUlxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyID09ICdhamF4Jykge1xuICAgICAgICAvLyBjb25maWd1cmUgZGVmYXVsdCByZXNvbHZlclxuICAgICAgICB0aGlzLnJlc29sdmVyID0gbmV3IEFqYXhSZXNvbHZlcih0aGlzLl9zZXR0aW5ncy5yZXNvbHZlclNldHRpbmdzKTtcbiAgICAgIH1cbiAgICAgIC8vIERyb3Bkb3duXG4gICAgICB0aGlzLl9kZCA9IG5ldyBEcm9wZG93bih0aGlzLl8kZWwsIHRoaXMuX3NldHRpbmdzLmZvcm1hdFJlc3VsdCwgdGhpcy5fc2V0dGluZ3MuYXV0b1NlbGVjdCk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgYmluZERlZmF1bHRFdmVudExpc3RlbmVycygpOnZvaWQge1xuICAgICAgdGhpcy5fJGVsLm9uKCdrZXl1cCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcbiAgICAgICAgLy8gY2hlY2sga2V5XG5cdFx0XHRcdHN3aXRjaCAoZXZ0LndoaWNoKSB7XG5cdFx0XHRcdFx0Y2FzZSAzODpcblx0XHRcdFx0XHRcdC8vIGFycm93IFVQXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNJdGVtKDApO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAyNzpcblx0XHRcdFx0XHRcdC8vIEVTQ1xuICAgICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuXyRlbC52YWwoKTtcbiAgICAgICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VhcmNoLnR5cGVkJywgbmV3VmFsdWUpO1xuXHRcdFx0XHR9XG5cbiAgICAgIH0pO1xuXG4gICAgICAvLyB0eXBlZC4gZXZlbnQgbGF1bmNoZWQgd2hlbiBmaWVsZCdzIHZhbHVlIGNoYW5nZXNcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlYXJjaC50eXBlZCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIG5ld1ZhbHVlOnN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLmRlZmF1bHRFdmVudFR5cGVkKG5ld1ZhbHVlKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICAgIC8vIHNlYXJjaC5wcmUuIGV2ZW50IGxhdW5jaGVkIGJlZm9yZSBhY3R1YWwgc2VhcmNoXG4gICAgICB0aGlzLl8kZWwub24oJ2F1dG9jb21wbGV0ZS5zZWFyY2gucHJlJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgbmV3VmFsdWU6c3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50UHJlU2VhcmNoKG5ld1ZhbHVlKTtcbiAgICAgIH0pXG4gICAgICBcbiAgICAgIC8vIHNlYXJjaC5kby4gZXZlbnQgbGF1bmNoZWQgdG8gcGVyZm9ybSBhIHNlYXJjaCwgaXQgY2FsbHMgdGhlIGNhbGxiYWNrIHVwb24gc2VhcmNoIHJlc3VsdHNcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlYXJjaC5kbycsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIG5ld1ZhbHVlOnN0cmluZywgY2FsbGJhY2s6RnVuY3Rpb24pID0+IHtcbiAgICAgICAgdGhpcy5kZWZhdWx0RXZlbnREb1NlYXJjaChuZXdWYWx1ZSwgY2FsbGJhY2spO1xuICAgICAgfSlcbiAgICAgIFxuICAgICAgLy8gc2VhcmNoLnBvc3QuIGV2ZW50IGxhdW5jaGVkIGFmdGVyIHRoZSBzZWFyY2ggcmV0dXJucyB3aXRoIGRhdGEsIGJlZm9yZSBkcmF3aW5nXG4gICAgICAvLyByZWNlaXZlcyBgcmVzdWx0c2BcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlYXJjaC5wb3N0JywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCwgcmVzdWx0czphbnkpID0+IHtcbiAgICAgICAgdGhpcy5kZWZhdWx0RXZlbnRQb3N0U2VhcmNoKHJlc3VsdHMpO1xuICAgICAgfSlcblxuICAgICAgLy8gc2VsZWN0ZWQgZXZlbnRcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIGl0ZW06YW55KSA9PiB7XG4gICAgICAgIHRoaXMuaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbSk7XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50VHlwZWQobmV3VmFsdWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgIC8vIGZpZWxkIHZhbHVlIGNoYW5nZWRcbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuXyRlbC50cmlnZ2VyKCdhdXRvY29tcGxldGUuc2VhcmNoLnByZScsIG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudFByZVNlYXJjaChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZG8gbm90aGluZywgc3RhcnQgc2VhcmNoXG4gICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlYXJjaC5kbycsIFtuZXdWYWx1ZSwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgIC8vIHRvIHByZXZlbnQgYHRoaXNgIHByb2JsZW1zXG4gICAgICAgIHRoaXMuZGVmYXVsdEV2ZW50UG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgfV0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEV2ZW50RG9TZWFyY2gobmV3VmFsdWU6c3RyaW5nLCBjYWxsYmFjazpGdW5jdGlvbik6dm9pZCB7XG4gICAgICAvLyBzZWFyY2ggdXNpbmcgY3VycmVudCByZXNvbHZlclxuICAgICAgaWYgKHRoaXMucmVzb2x2ZXIpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlci5zZWFyY2gobmV3VmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIGlmIG5vIHJlc29sZXIsIHVzZXIgb3ZlcnJpZGVzIHRoZSBzZWFyY2ggZXZlbnRcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudFBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzOmFueSk6dm9pZCB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGJhY2sgY2FsbGVkJywgcmVzdWx0cyk7XG4gICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlYXJjaC5wb3N0JywgW3Jlc3VsdHNdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRlZmF1bHRFdmVudFBvc3RTZWFyY2gocmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgdGhpcy5kZWZhdWx0RXZlbnRTdGFydFNob3cocmVzdWx0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0RXZlbnRTdGFydFNob3cocmVzdWx0czphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coXCJkZWZhdWx0RXZlbnRTdGFydFNob3dcIiwgcmVzdWx0cyk7XG4gICAgICAvLyBmb3IgZXZlcnkgcmVzdWx0LCBkcmF3IGl0XG4gICAgICB0aGlzLl9kZC51cGRhdGVJdGVtcyhyZXN1bHRzLCB0aGlzLl9zZWFyY2hUZXh0KTtcbiAgICAgIHRoaXMuX2RkLnNob3coKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbTphbnkpOnZvaWQge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyJywgaXRlbSk7XG4gICAgICAvLyBkZWZhdWx0IGJlaGF2aW91ciBpcyBzZXQgZWxtZW50J3MgLnZhbCgpXG4gICAgICBsZXQgaXRlbUZvcm1hdHRlZDp7IGlkPzpudW1iZXIsIHRleHQ6c3RyaW5nIH0gPSB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQoaXRlbSk7XG4gICAgICB0aGlzLl8kZWwudmFsKGl0ZW1Gb3JtYXR0ZWQudGV4dCk7XG4gICAgICAvLyBhbmQgaGlkZVxuICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVmYXVsdEZvcm1hdFJlc3VsdChpdGVtOmFueSk6e30ge1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbSB9O1xuICAgICAgfSBlbHNlIGlmICggaXRlbS50ZXh0ICkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJldHVybiBhIHRvU3RyaW5nIG9mIHRoZSBpdGVtIGFzIGxhc3QgcmVzb3J0XG4gICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ05vIGRlZmF1bHQgZm9ybWF0dGVyIGZvciBpdGVtJywgaXRlbSk7XG4gICAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0udG9TdHJpbmcoKSB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn1cblxuKGZ1bmN0aW9uKCQ6IEpRdWVyeVN0YXRpYywgd2luZG93OiBhbnksIGRvY3VtZW50OiBhbnkpIHtcbiAgJC5mbltBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRV0gPSBmdW5jdGlvbihvcHRpb25zOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHBsdWdpbkNsYXNzOkF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZTtcblxuICAgICAgcGx1Z2luQ2xhc3MgPSAkKHRoaXMpLmRhdGEoQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlLk5BTUUpO1xuXG4gICAgICBpZiAoIXBsdWdpbkNsYXNzKSB7XG4gICAgICAgIHBsdWdpbkNsYXNzID0gbmV3IEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZSh0aGlzLCBvcHRpb25zKTsgXG4gICAgICAgICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSwgcGx1Z2luQ2xhc3MpO1xuICAgICAgfVxuXG5cbiAgICB9KTtcbiAgfTtcbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG5cbi8vIChmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXG4vLyAgICd1c2Ugc3RyaWN0JztcblxuLy8gICBmYWN0b3J5KGpRdWVyeSk7XG5cbi8vIH0odGhpcywgZnVuY3Rpb24gKCQpIHtcblxuLy8gICAndXNlIHN0cmljdCc7XG4vLyAgIC8vIGpzaGludCBsYXhjb21tYTogdHJ1ZVxuXG5cbi8vICAvKiBUWVBFQUhFQUQgUFVCTElDIENMQVNTIERFRklOSVRJT05cbi8vICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgVHlwZWFoZWFkID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbi8vICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KTtcbi8vICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMsIG9wdGlvbnMpO1xuLy8gICAgIHRoaXMubWF0Y2hlciA9IHRoaXMub3B0aW9ucy5tYXRjaGVyIHx8IHRoaXMubWF0Y2hlcjtcbi8vICAgICB0aGlzLnNvcnRlciA9IHRoaXMub3B0aW9ucy5zb3J0ZXIgfHwgdGhpcy5zb3J0ZXI7XG4vLyAgICAgdGhpcy5zZWxlY3QgPSB0aGlzLm9wdGlvbnMuc2VsZWN0IHx8IHRoaXMuc2VsZWN0O1xuLy8gICAgIHRoaXMuYXV0b1NlbGVjdCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuYXV0b1NlbGVjdCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuYXV0b1NlbGVjdCA6IHRydWU7XG4vLyAgICAgdGhpcy5oaWdobGlnaHRlciA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHRlciB8fCB0aGlzLmhpZ2hsaWdodGVyO1xuLy8gICAgIHRoaXMucmVuZGVyID0gdGhpcy5vcHRpb25zLnJlbmRlciB8fCB0aGlzLnJlbmRlcjtcbi8vICAgICB0aGlzLnVwZGF0ZXIgPSB0aGlzLm9wdGlvbnMudXBkYXRlciB8fCB0aGlzLnVwZGF0ZXI7XG4vLyAgICAgdGhpcy5kaXNwbGF5VGV4dCA9IHRoaXMub3B0aW9ucy5kaXNwbGF5VGV4dCB8fCB0aGlzLmRpc3BsYXlUZXh0O1xuLy8gICAgIHRoaXMuc2VsZWN0ZWRUZXh0ID0gdGhpcy5vcHRpb25zLnNlbGVjdGVkVGV4dCB8fCB0aGlzLnNlbGVjdGVkVGV4dDtcbi8vICAgICB0aGlzLnNvdXJjZSA9IHRoaXMub3B0aW9ucy5zb3VyY2U7XG4vLyAgICAgdGhpcy5kZWxheSA9IHRoaXMub3B0aW9ucy5kZWxheTtcbi8vICAgICB0aGlzLiRtZW51ID0gJCh0aGlzLm9wdGlvbnMubWVudSk7XG4vLyAgICAgdGhpcy4kYXBwZW5kVG8gPSB0aGlzLm9wdGlvbnMuYXBwZW5kVG8gPyAkKHRoaXMub3B0aW9ucy5hcHBlbmRUbykgOiBudWxsO1xuLy8gICAgIHRoaXMuZml0VG9FbGVtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5maXRUb0VsZW1lbnQgPT0gJ2Jvb2xlYW4nID8gdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA6IGZhbHNlO1xuLy8gICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICB0aGlzLmxpc3RlbigpO1xuLy8gICAgIHRoaXMuc2hvd0hpbnRPbkZvY3VzID0gdHlwZW9mIHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT0gJ2Jvb2xlYW4nIHx8IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIgPyB0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzIDogZmFsc2U7XG4vLyAgICAgdGhpcy5hZnRlclNlbGVjdCA9IHRoaXMub3B0aW9ucy5hZnRlclNlbGVjdDtcbi8vICAgICB0aGlzLmFkZEl0ZW0gPSBmYWxzZTtcbi8vICAgICB0aGlzLnZhbHVlID0gdGhpcy4kZWxlbWVudC52YWwoKSB8fCB0aGlzLiRlbGVtZW50LnRleHQoKTtcbi8vICAgfTtcbiAgXG4vLyAgIFR5cGVhaGVhZC5wcm90b3R5cGUgPSB7XG5cbi8vICAgICBjb25zdHJ1Y3RvcjogVHlwZWFoZWFkLFxuXG4vLyAgICAgc2VsZWN0OiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgdmFsID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykuZGF0YSgndmFsdWUnKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgdmFsKTtcbi8vICAgICAgIGlmICh0aGlzLmF1dG9TZWxlY3QgfHwgdmFsKSB7XG4vLyAgICAgICAgIHZhciBuZXdWYWwgPSB0aGlzLnVwZGF0ZXIodmFsKTtcbi8vICAgICAgICAgLy8gVXBkYXRlciBjYW4gYmUgc2V0IHRvIGFueSByYW5kb20gZnVuY3Rpb25zIHZpYSBcIm9wdGlvbnNcIiBwYXJhbWV0ZXIgaW4gY29uc3RydWN0b3IgYWJvdmUuXG4vLyAgICAgICAgIC8vIEFkZCBudWxsIGNoZWNrIGZvciBjYXNlcyB3aGVuIHVwZGF0ZXIgcmV0dXJucyB2b2lkIG9yIHVuZGVmaW5lZC5cbi8vICAgICAgICAgaWYgKCFuZXdWYWwpIHtcbi8vICAgICAgICAgICBuZXdWYWwgPSAnJztcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgc2VsZWN0ZWRWYWwgPSB0aGlzLnNlbGVjdGVkVGV4dChuZXdWYWwpO1xuLy8gICAgICAgICBpZiAoc2VsZWN0ZWRWYWwgIT09IGZhbHNlKSB7XG4vLyAgICAgICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAgICAgLnZhbChzZWxlY3RlZFZhbClcbi8vICAgICAgICAgICAgIC50ZXh0KHRoaXMuZGlzcGxheVRleHQobmV3VmFsKSB8fCBuZXdWYWwpXG4vLyAgICAgICAgICAgICAuY2hhbmdlKCk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdGhpcy5hZnRlclNlbGVjdChuZXdWYWwpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIHNldFNvdXJjZTogZnVuY3Rpb24gKHNvdXJjZSkge1xuLy8gICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4vLyAgICAgfSxcblxuLy8gICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciBwb3MgPSAkLmV4dGVuZCh7fSwgdGhpcy4kZWxlbWVudC5wb3NpdGlvbigpLCB7XG4vLyAgICAgICAgIGhlaWdodDogdGhpcy4kZWxlbWVudFswXS5vZmZzZXRIZWlnaHRcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQgPT0gJ2Z1bmN0aW9uJyA/XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodC5jYWxsKCkgOlxuLy8gICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxIZWlnaHQ7XG5cbi8vICAgICAgIHZhciBlbGVtZW50O1xuLy8gICAgICAgaWYgKHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnU7XG4vLyAgICAgICB9IGVsc2UgaWYgKHRoaXMuJGFwcGVuZFRvKSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51LmFwcGVuZFRvKHRoaXMuJGFwcGVuZFRvKTtcbi8vICAgICAgICAgdGhpcy5oYXNTYW1lUGFyZW50ID0gdGhpcy4kYXBwZW5kVG8uaXModGhpcy4kZWxlbWVudC5wYXJlbnQoKSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudS5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KTtcbi8vICAgICAgICAgdGhpcy5oYXNTYW1lUGFyZW50ID0gdHJ1ZTtcbi8vICAgICAgIH0gICAgICBcbiAgICAgIFxuLy8gICAgICAgaWYgKCF0aGlzLmhhc1NhbWVQYXJlbnQpIHtcbi8vICAgICAgICAgICAvLyBXZSBjYW5ub3QgcmVseSBvbiB0aGUgZWxlbWVudCBwb3NpdGlvbiwgbmVlZCB0byBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgd2luZG93XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJwb3NpdGlvblwiLCBcImZpeGVkXCIpO1xuLy8gICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpO1xuLy8gICAgICAgICAgIHBvcy50b3AgPSAgb2Zmc2V0LnRvcDtcbi8vICAgICAgICAgICBwb3MubGVmdCA9IG9mZnNldC5sZWZ0O1xuLy8gICAgICAgfVxuLy8gICAgICAgLy8gVGhlIHJ1bGVzIGZvciBib290c3RyYXAgYXJlOiAnZHJvcHVwJyBpbiB0aGUgcGFyZW50IGFuZCAnZHJvcGRvd24tbWVudS1yaWdodCcgaW4gdGhlIGVsZW1lbnQuXG4vLyAgICAgICAvLyBOb3RlIHRoYXQgdG8gZ2V0IHJpZ2h0IGFsaWdubWVudCwgeW91J2xsIG5lZWQgdG8gc3BlY2lmeSBgbWVudWAgaW4gdGhlIG9wdGlvbnMgdG8gYmU6XG4vLyAgICAgICAvLyAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+J1xuLy8gICAgICAgdmFyIGRyb3B1cCA9ICQoZWxlbWVudCkucGFyZW50KCkuaGFzQ2xhc3MoJ2Ryb3B1cCcpO1xuLy8gICAgICAgdmFyIG5ld1RvcCA9IGRyb3B1cCA/ICdhdXRvJyA6IChwb3MudG9wICsgcG9zLmhlaWdodCArIHNjcm9sbEhlaWdodCk7XG4vLyAgICAgICB2YXIgcmlnaHQgPSAkKGVsZW1lbnQpLmhhc0NsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4vLyAgICAgICB2YXIgbmV3TGVmdCA9IHJpZ2h0ID8gJ2F1dG8nIDogcG9zLmxlZnQ7XG4vLyAgICAgICAvLyBpdCBzZWVtcyBsaWtlIHNldHRpbmcgdGhlIGNzcyBpcyBhIGJhZCBpZGVhIChqdXN0IGxldCBCb290c3RyYXAgZG8gaXQpLCBidXQgSSdsbCBrZWVwIHRoZSBvbGRcbi8vICAgICAgIC8vIGxvZ2ljIGluIHBsYWNlIGV4Y2VwdCBmb3IgdGhlIGRyb3B1cC9yaWdodC1hbGlnbiBjYXNlcy5cbi8vICAgICAgIGVsZW1lbnQuY3NzKHsgdG9wOiBuZXdUb3AsIGxlZnQ6IG5ld0xlZnQgfSkuc2hvdygpO1xuXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGVsZW1lbnQuY3NzKFwid2lkdGhcIiwgdGhpcy4kZWxlbWVudC5vdXRlcldpZHRoKCkgKyBcInB4XCIpO1xuLy8gICAgICAgfVxuICAgIFxuLy8gICAgICAgdGhpcy5zaG93biA9IHRydWU7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kbWVudS5oaWRlKCk7XG4vLyAgICAgICB0aGlzLnNob3duID0gZmFsc2U7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgbG9va3VwOiBmdW5jdGlvbiAocXVlcnkpIHtcbi8vICAgICAgIHZhciBpdGVtcztcbi8vICAgICAgIGlmICh0eXBlb2YocXVlcnkpICE9ICd1bmRlZmluZWQnICYmIHF1ZXJ5ICE9PSBudWxsKSB7XG4vLyAgICAgICAgIHRoaXMucXVlcnkgPSBxdWVyeTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpIHx8ICcnO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAodGhpcy5xdWVyeS5sZW5ndGggPCB0aGlzLm9wdGlvbnMubWluTGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnNob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB2YXIgd29ya2VyID0gJC5wcm94eShmdW5jdGlvbiAoKSB7XG5cbi8vICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbih0aGlzLnNvdXJjZSkpIHtcbi8vICAgICAgICAgICB0aGlzLnNvdXJjZSh0aGlzLnF1ZXJ5LCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpO1xuLy8gICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc291cmNlKSB7XG4vLyAgICAgICAgICAgdGhpcy5wcm9jZXNzKHRoaXMuc291cmNlKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSwgdGhpcyk7XG5cbi8vICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmxvb2t1cFdvcmtlcik7XG4vLyAgICAgICB0aGlzLmxvb2t1cFdvcmtlciA9IHNldFRpbWVvdXQod29ya2VyLCB0aGlzLmRlbGF5KTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJvY2VzczogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbi8vICAgICAgIGl0ZW1zID0gJC5ncmVwKGl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhhdC5tYXRjaGVyKGl0ZW0pO1xuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIGl0ZW1zID0gdGhpcy5zb3J0ZXIoaXRlbXMpO1xuXG4vLyAgICAgICBpZiAoIWl0ZW1zLmxlbmd0aCAmJiAhdGhpcy5vcHRpb25zLmFkZEl0ZW0pIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbXNbMF0pO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBudWxsKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgLy8gQWRkIGl0ZW1cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkSXRlbSl7XG4vLyAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5vcHRpb25zLmFkZEl0ZW0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAodGhpcy5vcHRpb25zLml0ZW1zID09ICdhbGwnKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlcihpdGVtcykuc2hvdygpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zLnNsaWNlKDAsIHRoaXMub3B0aW9ucy5pdGVtcykpLnNob3coKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBpdCA9IHRoaXMuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICByZXR1cm4gfml0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBzb3J0ZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIGJlZ2luc3dpdGggPSBbXTtcbi8vICAgICAgIHZhciBjYXNlU2Vuc2l0aXZlID0gW107XG4vLyAgICAgICB2YXIgY2FzZUluc2Vuc2l0aXZlID0gW107XG4vLyAgICAgICB2YXIgaXRlbTtcblxuLy8gICAgICAgd2hpbGUgKChpdGVtID0gaXRlbXMuc2hpZnQoKSkpIHtcbi8vICAgICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaWYgKCFpdC50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKSkgYmVnaW5zd2l0aC5wdXNoKGl0ZW0pO1xuLy8gICAgICAgICBlbHNlIGlmICh+aXQuaW5kZXhPZih0aGlzLnF1ZXJ5KSkgY2FzZVNlbnNpdGl2ZS5wdXNoKGl0ZW0pO1xuLy8gICAgICAgICBlbHNlIGNhc2VJbnNlbnNpdGl2ZS5wdXNoKGl0ZW0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gYmVnaW5zd2l0aC5jb25jYXQoY2FzZVNlbnNpdGl2ZSwgY2FzZUluc2Vuc2l0aXZlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaGlnaGxpZ2h0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICB2YXIgaHRtbCA9ICQoJzxkaXY+PC9kaXY+Jyk7XG4vLyAgICAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJ5O1xuLy8gICAgICAgdmFyIGkgPSBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICAgIHZhciBsZW4gPSBxdWVyeS5sZW5ndGg7XG4vLyAgICAgICB2YXIgbGVmdFBhcnQ7XG4vLyAgICAgICB2YXIgbWlkZGxlUGFydDtcbi8vICAgICAgIHZhciByaWdodFBhcnQ7XG4vLyAgICAgICB2YXIgc3Ryb25nO1xuLy8gICAgICAgaWYgKGxlbiA9PT0gMCkge1xuLy8gICAgICAgICByZXR1cm4gaHRtbC50ZXh0KGl0ZW0pLmh0bWwoKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHdoaWxlIChpID4gLTEpIHtcbi8vICAgICAgICAgbGVmdFBhcnQgPSBpdGVtLnN1YnN0cigwLCBpKTtcbi8vICAgICAgICAgbWlkZGxlUGFydCA9IGl0ZW0uc3Vic3RyKGksIGxlbik7XG4vLyAgICAgICAgIHJpZ2h0UGFydCA9IGl0ZW0uc3Vic3RyKGkgKyBsZW4pO1xuLy8gICAgICAgICBzdHJvbmcgPSAkKCc8c3Ryb25nPjwvc3Ryb25nPicpLnRleHQobWlkZGxlUGFydCk7XG4vLyAgICAgICAgIGh0bWxcbi8vICAgICAgICAgICAuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxlZnRQYXJ0KSlcbi8vICAgICAgICAgICAuYXBwZW5kKHN0cm9uZyk7XG4vLyAgICAgICAgIGl0ZW0gPSByaWdodFBhcnQ7XG4vLyAgICAgICAgIGkgPSBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxdWVyeS50b0xvd2VyQ2FzZSgpKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHJldHVybiBodG1sLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpdGVtKSkuaHRtbCgpO1xuLy8gICAgIH0sXG5cbi8vICAgICByZW5kZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuLy8gICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuLy8gICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuLy8gICAgICAgdmFyIGFjdGl2ZUZvdW5kID0gZmFsc2U7XG4vLyAgICAgICB2YXIgZGF0YSA9IFtdO1xuLy8gICAgICAgdmFyIF9jYXRlZ29yeSA9IHRoYXQub3B0aW9ucy5zZXBhcmF0b3I7XG5cbi8vICAgICAgICQuZWFjaChpdGVtcywgZnVuY3Rpb24gKGtleSx2YWx1ZSkge1xuLy8gICAgICAgICAvLyBpbmplY3Qgc2VwYXJhdG9yXG4vLyAgICAgICAgIGlmIChrZXkgPiAwICYmIHZhbHVlW19jYXRlZ29yeV0gIT09IGl0ZW1zW2tleSAtIDFdW19jYXRlZ29yeV0pe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdkaXZpZGVyJ1xuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgLy8gaW5qZWN0IGNhdGVnb3J5IGhlYWRlclxuLy8gICAgICAgICBpZiAodmFsdWVbX2NhdGVnb3J5XSAmJiAoa2V5ID09PSAwIHx8IHZhbHVlW19jYXRlZ29yeV0gIT09IGl0ZW1zW2tleSAtIDFdW19jYXRlZ29yeV0pKXtcbi8vICAgICAgICAgICBkYXRhLnB1c2goe1xuLy8gICAgICAgICAgICAgX190eXBlOiAnY2F0ZWdvcnknLFxuLy8gICAgICAgICAgICAgbmFtZTogdmFsdWVbX2NhdGVnb3J5XVxuLy8gICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGRhdGEucHVzaCh2YWx1ZSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSAkKGRhdGEpLm1hcChmdW5jdGlvbiAoaSwgaXRlbSkge1xuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnY2F0ZWdvcnknKXtcbi8vICAgICAgICAgICByZXR1cm4gJCh0aGF0Lm9wdGlvbnMuaGVhZGVySHRtbCkudGV4dChpdGVtLm5hbWUpWzBdO1xuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgaWYgKChpdGVtLl9fdHlwZSB8fCBmYWxzZSkgPT0gJ2RpdmlkZXInKXtcbi8vICAgICAgICAgICByZXR1cm4gJCh0aGF0Lm9wdGlvbnMuaGVhZGVyRGl2aWRlcilbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICB2YXIgdGV4dCA9IHNlbGYuZGlzcGxheVRleHQoaXRlbSk7XG4vLyAgICAgICAgIGkgPSAkKHRoYXQub3B0aW9ucy5pdGVtKS5kYXRhKCd2YWx1ZScsIGl0ZW0pO1xuLy8gICAgICAgICBpLmZpbmQoJ2EnKS5odG1sKHRoYXQuaGlnaGxpZ2h0ZXIodGV4dCwgaXRlbSkpO1xuLy8gICAgICAgICBpZiAodGV4dCA9PSBzZWxmLiRlbGVtZW50LnZhbCgpKSB7XG4vLyAgICAgICAgICAgaS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAgICAgc2VsZi4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtKTtcbi8vICAgICAgICAgICBhY3RpdmVGb3VuZCA9IHRydWU7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgcmV0dXJuIGlbMF07XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCAmJiAhYWN0aXZlRm91bmQpIHtcbi8vICAgICAgICAgaXRlbXMuZmlsdGVyKCc6bm90KC5kcm9wZG93bi1oZWFkZXIpJykuZmlyc3QoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuZGF0YSgnYWN0aXZlJywgaXRlbXMuZmlyc3QoKS5kYXRhKCd2YWx1ZScpKTtcbi8vICAgICAgIH1cbi8vICAgICAgIHRoaXMuJG1lbnUuaHRtbChpdGVtcyk7XG4vLyAgICAgICByZXR1cm4gdGhpcztcbi8vICAgICB9LFxuXG4vLyAgICAgZGlzcGxheVRleHQ6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIHNlbGVjdGVkVGV4dDogZnVuY3Rpb24oaXRlbSkge1xuLy8gICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgaXRlbS5uYW1lICE9ICd1bmRlZmluZWQnICYmIGl0ZW0ubmFtZSB8fCBpdGVtO1xuLy8gICAgIH0sXG5cbi8vICAgICBuZXh0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbi8vICAgICAgIHZhciBhY3RpdmUgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICB2YXIgbmV4dCA9IGFjdGl2ZS5uZXh0KCk7XG5cbi8vICAgICAgIGlmICghbmV4dC5sZW5ndGgpIHtcbi8vICAgICAgICAgbmV4dCA9ICQodGhpcy4kbWVudS5maW5kKCdsaScpWzBdKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgbmV4dC5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIHByZXY6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBwcmV2ID0gYWN0aXZlLnByZXYoKTtcblxuLy8gICAgICAgaWYgKCFwcmV2Lmxlbmd0aCkge1xuLy8gICAgICAgICBwcmV2ID0gdGhpcy4kbWVudS5maW5kKCdsaScpLmxhc3QoKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcHJldi5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIGxpc3RlbjogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAub24oJ2ZvY3VzJywgICAgJC5wcm94eSh0aGlzLmZvY3VzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdibHVyJywgICAgICQucHJveHkodGhpcy5ibHVyLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdrZXlwcmVzcycsICQucHJveHkodGhpcy5rZXlwcmVzcywgdGhpcykpXG4vLyAgICAgICAgIC5vbignaW5wdXQnLCAgICAkLnByb3h5KHRoaXMuaW5wdXQsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXVwJywgICAgJC5wcm94eSh0aGlzLmtleXVwLCB0aGlzKSk7XG5cbi8vICAgICAgIGlmICh0aGlzLmV2ZW50U3VwcG9ydGVkKCdrZXlkb3duJykpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bicsICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnVcbi8vICAgICAgICAgLm9uKCdjbGljaycsICQucHJveHkodGhpcy5jbGljaywgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2VlbnRlcicsICdsaScsICQucHJveHkodGhpcy5tb3VzZWVudGVyLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlbGVhdmUsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlZG93bicsICQucHJveHkodGhpcy5tb3VzZWRvd24sdGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgICBkZXN0cm95IDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCd0eXBlYWhlYWQnLG51bGwpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLG51bGwpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudFxuLy8gICAgICAgICAub2ZmKCdmb2N1cycpXG4vLyAgICAgICAgIC5vZmYoJ2JsdXInKVxuLy8gICAgICAgICAub2ZmKCdrZXlwcmVzcycpXG4vLyAgICAgICAgIC5vZmYoJ2lucHV0Jylcbi8vICAgICAgICAgLm9mZigna2V5dXAnKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5ZG93bicpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICB0aGlzLiRtZW51LnJlbW92ZSgpO1xuLy8gICAgICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuLy8gICAgIH0sXG5cbi8vICAgICBldmVudFN1cHBvcnRlZDogZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuLy8gICAgICAgdmFyIGlzU3VwcG9ydGVkID0gZXZlbnROYW1lIGluIHRoaXMuJGVsZW1lbnQ7XG4vLyAgICAgICBpZiAoIWlzU3VwcG9ydGVkKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQuc2V0QXR0cmlidXRlKGV2ZW50TmFtZSwgJ3JldHVybjsnKTtcbi8vICAgICAgICAgaXNTdXBwb3J0ZWQgPSB0eXBlb2YgdGhpcy4kZWxlbWVudFtldmVudE5hbWVdID09PSAnZnVuY3Rpb24nO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGlzU3VwcG9ydGVkO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3ZlOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG5cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgOTogLy8gdGFiXG4vLyAgICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXG4vLyAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSBsZWZ0IHBhcmVudGhlc2lzKVxuLy8gICAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSByZXR1cm47XG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIHRoaXMucHJldigpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgICAvLyB3aXRoIHRoZSBzaGlmdEtleSAodGhpcyBpcyBhY3R1YWxseSB0aGUgcmlnaHQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleWRvd246IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQgPSB+JC5pbkFycmF5KGUua2V5Q29kZSwgWzQwLDM4LDksMTMsMjddKTtcbi8vICAgICAgIGlmICghdGhpcy5zaG93biAmJiBlLmtleUNvZGUgPT0gNDApIHtcbi8vICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5cHJlc3M6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAodGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0KSByZXR1cm47XG4vLyAgICAgICB0aGlzLm1vdmUoZSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGlucHV0OiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgLy8gVGhpcyBpcyBhIGZpeGVkIGZvciBJRTEwLzExIHRoYXQgZmlyZXMgdGhlIGlucHV0IGV2ZW50IHdoZW4gYSBwbGFjZWhvZGVyIGlzIGNoYW5nZWRcbi8vICAgICAgIC8vIChodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgxMDUzOC9pZS0xMS1maXJlcy1pbnB1dC1ldmVudC1vbi1mb2N1cylcbi8vICAgICAgIHZhciBjdXJyZW50VmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICAgICAgaWYgKHRoaXMudmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xuLy8gICAgICAgICB0aGlzLnZhbHVlID0gY3VycmVudFZhbHVlO1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXl1cDogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuLy8gICAgICAgICByZXR1cm47XG4vLyAgICAgICB9XG4vLyAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuLy8gICAgICAgICBjYXNlIDQwOiAvLyBkb3duIGFycm93XG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4vLyAgICAgICAgIGNhc2UgMTc6IC8vIGN0cmxcbi8vICAgICAgICAgY2FzZSAxODogLy8gYWx0XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcbi8vICAgICAgICAgICB0aGlzLnNlbGVjdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuLy8gICAgICAgfVxuXG5cbi8vICAgICB9LFxuXG4vLyAgICAgZm9jdXM6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xuLy8gICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuLy8gICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyAmJiB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgIT09IHRydWUpIHtcbi8vICAgICAgICAgICBpZih0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzID09PSBcImFsbFwiKSB7XG4vLyAgICAgICAgICAgICB0aGlzLmxvb2t1cChcIlwiKTsgXG4vLyAgICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgICBpZiAodGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzKSB7XG4vLyAgICAgICAgIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyA9IGZhbHNlO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBibHVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKCF0aGlzLm1vdXNlZG92ZXIgJiYgIXRoaXMubW91c2VkZG93biAmJiB0aGlzLnNob3duKSB7XG4vLyAgICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgICAgICB0aGlzLmZvY3VzZWQgPSBmYWxzZTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb3VzZWRkb3duKSB7XG4vLyAgICAgICAgIC8vIFRoaXMgaXMgZm9yIElFIHRoYXQgYmx1cnMgdGhlIGlucHV0IHdoZW4gdXNlciBjbGlja3Mgb24gc2Nyb2xsLlxuLy8gICAgICAgICAvLyBXZSBzZXQgdGhlIGZvY3VzIGJhY2sgb24gdGhlIGlucHV0IGFuZCBwcmV2ZW50IHRoZSBsb29rdXAgdG8gb2NjdXIgYWdhaW5cbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gdHJ1ZTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5mb2N1cygpO1xuLy8gICAgICAgICB0aGlzLm1vdXNlZGRvd24gPSBmYWxzZTtcbi8vICAgICAgIH0gXG4vLyAgICAgfSxcblxuLy8gICAgIGNsaWNrOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2Vkb3ZlciA9IHRydWU7XG4vLyAgICAgICB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gZmFsc2U7XG4vLyAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCAmJiB0aGlzLnNob3duKSB0aGlzLmhpZGUoKTtcbi8vICAgICB9LFxuXG4vLyAgICAvKipcbi8vICAgICAgKiBXZSB0cmFjayB0aGUgbW91c2Vkb3duIGZvciBJRS4gV2hlbiBjbGlja2luZyBvbiB0aGUgbWVudSBzY3JvbGxiYXIsIElFIG1ha2VzIHRoZSBpbnB1dCBibHVyIHRodXMgaGlkaW5nIHRoZSBtZW51LlxuLy8gICAgICAqL1xuLy8gICAgIG1vdXNlZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMubW91c2VkZG93biA9IHRydWU7XG4vLyAgICAgICB0aGlzLiRtZW51Lm9uZShcIm1vdXNldXBcIiwgZnVuY3Rpb24oZSl7XG4vLyAgICAgICAgIC8vIElFIHdvbid0IGZpcmUgdGhpcywgYnV0IEZGIGFuZCBDaHJvbWUgd2lsbCBzbyB3ZSByZXNldCBvdXIgZmxhZyBmb3IgdGhlbSBoZXJlXG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfS5iaW5kKHRoaXMpKTtcbi8vICAgICB9LFxuXG4vLyAgIH07XG5cblxuLy8gICAvKiBUWVBFQUhFQUQgUExVR0lOIERFRklOSVRJT05cbi8vICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgdmFyIG9sZCA9ICQuZm4udHlwZWFoZWFkO1xuXG4vLyAgICQuZm4udHlwZWFoZWFkID0gZnVuY3Rpb24gKG9wdGlvbikge1xuLy8gICAgIHZhciBhcmcgPSBhcmd1bWVudHM7XG4vLyAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgJiYgb3B0aW9uID09ICdnZXRBY3RpdmUnKSB7XG4vLyAgICAgICByZXR1cm4gdGhpcy5kYXRhKCdhY3RpdmUnKTtcbi8vICAgICB9XG4vLyAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKTtcbi8vICAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb247XG4vLyAgICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcsIChkYXRhID0gbmV3IFR5cGVhaGVhZCh0aGlzLCBvcHRpb25zKSkpO1xuLy8gICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgJiYgZGF0YVtvcHRpb25dKSB7XG4vLyAgICAgICAgIGlmIChhcmcubGVuZ3RoID4gMSkge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXS5hcHBseShkYXRhLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcsIDEpKTtcbi8vICAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICBkYXRhW29wdGlvbl0oKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICB9O1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzID0ge1xuLy8gICAgIHNvdXJjZTogW10sXG4vLyAgICAgaXRlbXM6IDgsXG4vLyAgICAgbWVudTogJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCIgcm9sZT1cImxpc3Rib3hcIj48L3VsPicsXG4vLyAgICAgaXRlbTogJzxsaT48YSBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiBocmVmPVwiI1wiIHJvbGU9XCJvcHRpb25cIj48L2E+PC9saT4nLFxuLy8gICAgIG1pbkxlbmd0aDogMSxcbi8vICAgICBzY3JvbGxIZWlnaHQ6IDAsXG4vLyAgICAgYXV0b1NlbGVjdDogdHJ1ZSxcbi8vICAgICBhZnRlclNlbGVjdDogJC5ub29wLFxuLy8gICAgIGFkZEl0ZW06IGZhbHNlLFxuLy8gICAgIGRlbGF5OiAwLFxuLy8gICAgIHNlcGFyYXRvcjogJ2NhdGVnb3J5Jyxcbi8vICAgICBoZWFkZXJIdG1sOiAnPGxpIGNsYXNzPVwiZHJvcGRvd24taGVhZGVyXCI+PC9saT4nLFxuLy8gICAgIGhlYWRlckRpdmlkZXI6ICc8bGkgY2xhc3M9XCJkaXZpZGVyXCIgcm9sZT1cInNlcGFyYXRvclwiPjwvbGk+J1xuLy8gICB9O1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLkNvbnN0cnVjdG9yID0gVHlwZWFoZWFkO1xuXG4vLyAgLyogVFlQRUFIRUFEIE5PIENPTkZMSUNUXG4vLyAgICogPT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgICQuZm4udHlwZWFoZWFkLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgJC5mbi50eXBlYWhlYWQgPSBvbGQ7XG4vLyAgICAgcmV0dXJuIHRoaXM7XG4vLyAgIH07XG5cblxuLy8gIC8qIFRZUEVBSEVBRCBEQVRBLUFQSVxuLy8gICAqID09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgICQoZG9jdW1lbnQpLm9uKCdmb2N1cy50eXBlYWhlYWQuZGF0YS1hcGknLCAnW2RhdGEtcHJvdmlkZT1cInR5cGVhaGVhZFwiXScsIGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbi8vICAgICBpZiAoJHRoaXMuZGF0YSgndHlwZWFoZWFkJykpIHJldHVybjtcbi8vICAgICAkdGhpcy50eXBlYWhlYWQoJHRoaXMuZGF0YSgpKTtcbi8vICAgfSk7XG5cbi8vIH0pKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL21haW4udHNcbiAqKi8iLCJcbmNsYXNzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCByZXN1bHRzOkFycmF5PE9iamVjdD47XG5cblx0cHJvdGVjdGVkIF9zZXR0aW5nczphbnk7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHR0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7fTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXRSZXN1bHRzKGxpbWl0PzpudW1iZXIsIHN0YXJ0PzpudW1iZXIsIGVuZD86bnVtYmVyKTpBcnJheTxPYmplY3Q+IHtcblx0XHRcblx0XHRyZXR1cm4gdGhpcy5yZXN1bHRzO1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRjYmsodGhpcy5nZXRSZXN1bHRzKCkpO1xuXHR9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEFqYXhSZXNvbHZlciBleHRlbmRzIEJhc2VSZXNvbHZlciB7XG5cdHByb3RlY3RlZCBqcVhIUjpKUXVlcnlYSFI7XG5cblx0Y29uc3RydWN0b3Iob3B0aW9uczphbnkpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdC8vIGNvbnNvbGUubG9nKCdyZXNvbHZlciBzZXR0aW5ncycsIHRoaXMuX3NldHRpbmdzKTtcblx0fVxuXG5cdHByb3RlY3RlZCBnZXREZWZhdWx0cygpOnt9IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnJyxcblx0XHRcdG1ldGhvZDogJ2dldCcsXG5cdFx0XHRxdWVyeUtleTogJ3EnLFxuXHRcdFx0ZXh0cmFEYXRhOiB7fSxcblx0XHRcdHRpbWVvdXQ6IHVuZGVmaW5lZCxcblx0XHR9O1xuXHR9XG5cblx0cHVibGljIHNlYXJjaChxOnN0cmluZywgY2JrOkZ1bmN0aW9uKTp2b2lkIHtcblx0XHRpZiAodGhpcy5qcVhIUiAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLmpxWEhSLmFib3J0KCk7XG5cdFx0fVxuXG5cdFx0bGV0IGRhdGE6T2JqZWN0ID0ge307XG5cdFx0ZGF0YVt0aGlzLl9zZXR0aW5ncy5xdWVyeUtleV0gPSBxO1xuXHRcdCQuZXh0ZW5kKGRhdGEsIHRoaXMuX3NldHRpbmdzLmV4dHJhRGF0YSk7XG5cblx0XHR0aGlzLmpxWEhSID0gJC5hamF4KFxuXHRcdFx0dGhpcy5fc2V0dGluZ3MudXJsLFxuXHRcdFx0e1xuXHRcdFx0XHRtZXRob2Q6IHRoaXMuX3NldHRpbmdzLm1ldGhvZCxcblx0XHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdFx0dGltZW91dDogdGhpcy5fc2V0dGluZ3MudGltZW91dFxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHR0aGlzLmpxWEhSLmRvbmUoKHJlc3VsdCkgPT4ge1xuXHRcdFx0Y2JrKHJlc3VsdCk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5qcVhIUi5mYWlsKChlcnIpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKGVycik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmpxWEhSLmFsd2F5cygoKSA9PiB7XG5cdFx0XHR0aGlzLmpxWEhSID0gbnVsbDtcblx0XHR9KTtcblx0fVxuXG59XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZXNvbHZlcnMudHNcbiAqKi8iLCIvKlxuICpcdERyb3Bkb3duIGNsYXNzLiBNYW5hZ2VzIHRoZSBkcm9wZG93biBkcmF3aW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBEcm9wZG93biB7XG5cdHByb3RlY3RlZCBfJGVsOkpRdWVyeTtcblx0cHJvdGVjdGVkIF9kZDpKUXVlcnk7XG5cdHByb3RlY3RlZCBpbml0aWFsaXplZDpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBzaG93bjpib29sZWFuID0gZmFsc2U7XG5cdHByb3RlY3RlZCBpdGVtczphbnlbXSA9IFtdO1xuXHRwcm90ZWN0ZWQgZm9ybWF0SXRlbTpGdW5jdGlvbjtcblx0cHJvdGVjdGVkIHNlYXJjaFRleHQ6c3RyaW5nO1xuXHRwcm90ZWN0ZWQgYXV0b1NlbGVjdDpib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yKGU6SlF1ZXJ5LCBmb3JtYXRJdGVtQ2JrOkZ1bmN0aW9uLCBhdXRvU2VsZWN0OmJvb2xlYW4pIHtcblx0XHR0aGlzLl8kZWwgPSBlO1xuXHRcdHRoaXMuZm9ybWF0SXRlbSA9IGZvcm1hdEl0ZW1DYms7XG5cdFx0dGhpcy5hdXRvU2VsZWN0ID0gYXV0b1NlbGVjdDtcblx0XHRcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXHRcblx0cHJvdGVjdGVkIGluaXQoKTp2b2lkIHtcblx0XHQvLyBJbml0aWFsaXplIGRyb3Bkb3duXG5cdFx0bGV0IHBvczphbnkgPSAkLmV4dGVuZCh7fSwgdGhpcy5fJGVsLnBvc2l0aW9uKCksIHtcbiAgICAgICAgXHRcdFx0XHRoZWlnaHQ6IHRoaXMuXyRlbFswXS5vZmZzZXRIZWlnaHRcbiAgICBcdFx0XHRcdH0pO1xuXHRcdFxuXHRcdC8vIGNyZWF0ZSBlbGVtZW50XG5cdFx0dGhpcy5fZGQgPSAkKCc8dWwgLz4nKTtcblx0XHQvLyBhZGQgb3VyIGNsYXNzIGFuZCBiYXNpYyBkcm9wZG93bi1tZW51IGNsYXNzXG5cdFx0dGhpcy5fZGQuYWRkQ2xhc3MoJ2Jvb3RzdHJhcC1hdXRvY29tcGxldGUgZHJvcGRvd24tbWVudScpO1xuXG5cdFx0dGhpcy5fZGQuaW5zZXJ0QWZ0ZXIodGhpcy5fJGVsKTtcblx0XHR0aGlzLl9kZC5jc3MoeyBsZWZ0OiBwb3MubGVmdCwgd2lkdGg6IHRoaXMuXyRlbC5vdXRlcldpZHRoKCkgfSk7XG5cdFx0XG5cdFx0Ly8gY2xpY2sgZXZlbnQgb24gaXRlbXNcblx0XHR0aGlzLl9kZC5vbignY2xpY2snLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2xpY2tlZCcsIGV2dC5jdXJyZW50VGFyZ2V0KTtcblx0XHRcdC8vY29uc29sZS5sb2coJChldnQuY3VycmVudFRhcmdldCkpO1xuXHRcdFx0bGV0IGl0ZW06YW55ID0gJChldnQuY3VycmVudFRhcmdldCkuZGF0YSgnaXRlbScpO1xuXHRcdFx0dGhpcy5pdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtKTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLl9kZC5vbigna2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHRpZiAodGhpcy5zaG93bikge1xuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0Ncblx0XHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdFx0XHRcdFx0dGhpcy5fJGVsLmZvY3VzKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignZm9jdXMnLCAnbGkgYScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJ3VsJykuZmluZCgnbGkuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JChldnQuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnbGknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kZC5vbignbW91c2VlbnRlcicsICdsaScsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmZpbmQoJ2EnKS5mb2N1cygpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cdFx0XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNJdGVtKGluZGV4Om51bWJlcikge1xuXHRcdC8vIEZvY3VzIGFuIGl0ZW0gaW4gdGhlIGxpc3Rcblx0XHRpZiAodGhpcy5zaG93biAmJiAodGhpcy5pdGVtcy5sZW5ndGggPiBpbmRleCkpXG5cdFx0XHR0aGlzLl9kZC5maW5kKCdsaScpLmVxKGluZGV4KS5maW5kKCdhJykuZm9jdXMoKTtcblx0fVxuXG5cdHB1YmxpYyBzaG93KCk6dm9pZCB7XG5cdFx0aWYgKCF0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLnNob3coKTtcblx0XHRcdHRoaXMuc2hvd24gPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBpc1Nob3duKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuc2hvd247XG5cdH1cblxuXHRwdWJsaWMgaGlkZSgpOnZvaWQge1xuXHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLmhpZGUoKTtcblx0XHRcdHRoaXMuc2hvd24gPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6YW55W10sIHNlYXJjaFRleHQ6c3RyaW5nKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnNlYXJjaFRleHQgPSBzZWFyY2hUZXh0O1xuXHRcdHRoaXMucmVmcmVzaEl0ZW1MaXN0KCk7XG5cdH1cblxuXHRwcml2YXRlIHNob3dNYXRjaGVkVGV4dCh0ZXh0OnN0cmluZywgcXJ5OnN0cmluZyk6c3RyaW5nIHtcblx0XHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxcnkudG9Mb3dlckNhc2UoKSk7XG5cdFx0aWYgKHN0YXJ0SW5kZXggPiAtMSkge1xuXHRcdFx0bGV0IGVuZEluZGV4Om51bWJlciA9IHN0YXJ0SW5kZXggKyBxcnkubGVuZ3RoO1xuXG5cdFx0XHRyZXR1cm4gdGV4dC5zbGljZSgwLCBzdGFydEluZGV4KSArICc8Yj4nIFxuXHRcdFx0XHQrIHRleHQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpICsgJzwvYj4nXG5cdFx0XHRcdCsgdGV4dC5zbGljZShlbmRJbmRleCk7XG5cdFx0fVxuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcblx0XHRcdGxldCBpdGVtRm9ybWF0dGVkOmFueSA9IHRoaXMuZm9ybWF0SXRlbShpdGVtKTtcblx0XHRcdGlmICh0eXBlb2YgaXRlbUZvcm1hdHRlZCA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0aXRlbUZvcm1hdHRlZCA9IHsgdGV4dDogaXRlbUZvcm1hdHRlZCB9XG5cdFx0XHR9XG5cdFx0XHRsZXQgaXRlbVRleHQgPSBpdGVtRm9ybWF0dGVkLnRleHQ7XG5cdFx0XHRcblx0XHRcdGl0ZW1UZXh0ID0gdGhpcy5zaG93TWF0Y2hlZFRleHQoaXRlbVRleHQsIHRoaXMuc2VhcmNoVGV4dCk7XG5cblx0XHRcdGxldCBsaSA9ICQoJzxsaSA+Jyk7XG5cdFx0XHRsaS5hcHBlbmQoXG5cdFx0XHRcdCQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnIycpLmh0bWwoaXRlbVRleHQpXG5cdFx0XHQpXG5cdFx0XHQuZGF0YSgnaXRlbScsIGl0ZW0pO1xuXHRcdFx0XG5cdFx0XHQvLyBUT0RPIG9wdGltaXplIFxuXHRcdFx0dGhpcy5fZGQuYXBwZW5kKGxpKTtcblx0XHR9KTtcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtOmFueSk6dm9pZCB7XG5cdFx0Ly8gbGF1bmNoIHNlbGVjdGVkIGV2ZW50XG5cdFx0Ly8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZExhdW5jaEV2ZW50JywgaXRlbSk7XG5cdFx0dGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCBpdGVtKVxuXHR9XG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kcm9wZG93bi50c1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=