(function (Vue, Router, Vuex, CodeMirror) {
  'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  Router = Router && Router.hasOwnProperty('default') ? Router['default'] : Router;
  var Vuex__default = 'default' in Vuex ? Vuex['default'] : Vuex;
  CodeMirror = CodeMirror && CodeMirror.hasOwnProperty('default') ? CodeMirror['default'] : CodeMirror;

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "container-full-width", attrs: { id: "cafeapp" } },
      [
        _c("div", { staticClass: "row", attrs: { id: "main" } }, [
          _c("div", { staticClass: "col-md-6 offset-md-1" }, [
            _c("div", { attrs: { id: "main_col" } }, [_c("router-view")], 1)
          ]),
          _c(
            "div",
            { staticClass: "col-md-4" },
            [_c("search"), _c("history-display")],
            1
          )
        ])
      ]
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-2db1169a_0", { source: "\n#cafeapp {\n    font-family: 'Avenir', Helvetica, Arial, sans-serif;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    color: #2c3e50;\n    margin-top: 5px;\n}\n#sidebar{\n   padding:5px;\n}\n#main{\n    height:100%;\n}\n#graph{\n    width: 100%;\n    height:100vh;\n    border: 1px solid black;\n}\n#query_input{\n    width:100%;\n}\n#main_col{\n}\n\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/App.vue"],"names":[],"mappings":";AAkBA;IACA,mDAAA;IACA,mCAAA;IACA,kCAAA;IACA,cAAA;IACA,eAAA;AACA;AAEA;GACA,WAAA;AACA;AACA;IACA,WAAA;AACA;AAEA;IACA,WAAA;IACA,YAAA;IACA,uBAAA;AACA;AAEA;IACA,UAAA;AACA;AAEA;AACA","file":"App.vue","sourcesContent":["<template>\n    <div id=\"cafeapp\" class=\"container-full-width\">\n\t<div id=\"main\" class=\"row\">\n\t    <div class=\"col-md-6 offset-md-1\">\n\t\t<div id=\"main_col\">\n\t\t    <router-view></router-view>\n\t\t</div>\n\t    </div>\n\t    \n\t    <div class=\"col-md-4\">\n\t\t<search />\n\t\t<history-display />\n\t    </div>\n\t</div>\n    </div>\n</template>\n\n<style>\n #cafeapp {\n     font-family: 'Avenir', Helvetica, Arial, sans-serif;\n     -webkit-font-smoothing: antialiased;\n     -moz-osx-font-smoothing: grayscale;\n     color: #2c3e50;\n     margin-top: 5px;\n }\n\n #sidebar{\n    padding:5px;\n }\n #main{\n     height:100%;\n }\n\n #graph{\n     width: 100%;\n     height:100vh;\n     border: 1px solid black;\n }\n\n #query_input{\n     width:100%;\n }\n\n #main_col{\n }\n\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var App = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      {},
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
   
   var script = {
       name: 'home',
       computed: Vuex.mapState([
  	 'nodes'
       ])
   };

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "home" },
      [_vm._m(0), _c("node-index", { attrs: { nodeset: _vm.nodes } })],
      1
    )
  };
  var __vue_staticRenderFns__$1 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "snippet_header" }, [
        _c("span", { staticClass: "snippet_title" }, [_vm._v("Category")])
      ])
    }
  ];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-46d68b24_0", { source: "\n.snippet_header[data-v-46d68b24]{\n    border-radius: 10px;\n    padding: 5px;\n    width: 100%;\n    margin-bottom: 10px;\n}\n.snippet_title[data-v-46d68b24]{\n    font-size: 20pt;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/views/Home.vue"],"names":[],"mappings":";AAwBA;IACA,mBAAA;IACA,YAAA;IACA,WAAA;IACA,mBAAA;AACA;AAEA;IACA,eAAA;AACA","file":"Home.vue","sourcesContent":["<template>\n  <div class=\"home\">\n      <div class=\"snippet_header\">\n\t  <span class=\"snippet_title\">Category</span>\n\t</div>\n\n    <node-index :nodeset=\"nodes\" />\n  </div>\n</template>\n\n<script>\n// @ is an alias to /src\n import { mapState } from 'vuex'\n \n export default {\n     name: 'home',\n     computed: mapState([\n\t 'nodes'\n     ])\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n .snippet_header{\n     border-radius: 10px;\n     padding: 5px;\n     width: 100%;\n     margin-bottom: 10px;\n }\n\n .snippet_title{\n     font-size: 20pt;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-46d68b24";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var Home = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  //

   var script$1 = {
       name: 'Node',
       data() {
  	 return {
  	     'node': this.$route.params.id,
  	     'data': 'loading...'
  	 }
       },
       created: function() {
  	 console.log('cr');
  	 this.$store.commit('GO',this.node);
  	 this.get_node(this.node, function(){});
       },
       beforeRouteUpdate: function(to, fro, next) {
  	 console.log("ND",this.node_data);
  	 let node_id = to.params.id;
  	 this.$store.dispatch('go',node_id);
  	 if (!this.nodes[node_id]) {
  	     console.log("problem:",node_id,"does not exist");
  	 }
  	 else if (node_id in this.node_data) {
  	     console.log("cached");
  	     this.data = this.node_data[node_id];
  	     console.log(this.data);
  	     this.node = node_id;
  	     this.$nextTick(function(){Vue.run_plugins(this);});
  	     next();
  	 }
  	 else if(this.nodes[node_id].auto == "yes") {
  	     console.log("auto");
  	     this.node = node_id;
  	     this.$store.dispatch('go',this.node);
  	     next();
  	 }
  	 else {
  	     console.log("not cached");
  	     this.get_node(node_id, next);
  	 }
       },
       computed: {
  	 ...Vuex.mapState(['nodes', 'node_data']),
  	 ...Vuex.mapGetters(['neighbours'])
       },
       methods: {
  	 get_node: function(node_id, next) {
  	     var self = this;
  	     console.log("fetching",node_id);
  	     var fetch_headers = new Headers();
  	     fetch_headers.append('pragma', 'no-cache');
  	     fetch_headers.append('cache-control', 'no-cache');
  	     
  	     var fetch_params = {
  		 method: 'GET',
  		 headers: fetch_headers,
  	     };
  	     fetch('/out/'+node_id+'.html', fetch_params).then(function(response){
  		 response.text().then(function(data){
  		     var to_cache = {};
  		     to_cache[node_id] = data;
  		     self.$store.commit('CACHE',to_cache);
  		     self.data = data;
  		     self.node = node_id;
  		     next();
  		     console.log("IH1",self.data,"||",self.$el.innerHTML);
  		     self.$nextTick(function(){
  			 console.log("IH2",self.data,"||",self.$el.innerHTML);
  			 Vue.run_plugins(self);
  			 console.log("IH3",self.data,"||",self.$el.innerHTML);
  		     });
  		 });
  	     });

  	 },
  	 reload_node: function(node, event){
  	     this.get_node(this.node, function(){});
  	 },
  	 edit_node: function(node, event){
  	     var fetch_headers = new Headers();
  	     fetch_headers.append('pragma', 'no-cache');
  	     fetch_headers.append('cache-control', 'no-cache');
  	     
  	     var fetch_params = {
  		 method: 'GET',
  		 headers: fetch_headers,
  	     };
  	     fetch('/edit/'+node, fetch_params).then(function(response){
  		 response.text().then(function(data){
  		     console.log(data);
  		 });
  	     });
  	 },
  	 new_node: function(node, event){
  	     var fetch_headers = new Headers();
  	     fetch_headers.append('pragma', 'no-cache');
  	     fetch_headers.append('cache-control', 'no-cache');
  	     
  	     var fetch_params = {
  		 method: 'GET',
  		 headers: fetch_headers,
  	     };
  	     fetch('/new', fetch_params).then(function(response){
  		 response.text().then(function(data){
  		     console.log(data);
  		 });
  	     });
  	 }
       }
   };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "div",
        { staticClass: "snippet_header" },
        [
          _c("span", { staticClass: "snippet_title" }, [
            _vm._v(
              _vm._s(
                _vm.nodes && _vm.nodes[_vm.node]
                  ? _vm.nodes[_vm.node].name
                  : "loading..."
              )
            )
          ]),
          _c(
            "span",
            {
              staticClass: "close_x",
              on: {
                click: function($event) {
                  return _vm.edit_node(_vm.node)
                }
              }
            },
            [_c("span", { staticClass: "fas fa-edit" })]
          ),
          _c(
            "span",
            {
              staticClass: "close_x",
              on: {
                click: function($event) {
                  return _vm.reload_node(_vm.node)
                }
              }
            },
            [_c("span", { staticClass: "fas fa-sync" })]
          ),
          _c(
            "span",
            {
              staticClass: "close_x",
              on: {
                click: function($event) {
                  return _vm.new_node(_vm.node)
                }
              }
            },
            [_c("span", { staticClass: "fas fa-plus" })]
          ),
          _c("router-link", { staticClass: "close_x", attrs: { to: "/" } }, [
            _c("span", { staticClass: "fas fa-home" })
          ])
        ],
        1
      ),
      _c("div", [
        _vm.nodes && _vm.nodes[_vm.node] && _vm.nodes[_vm.node].auto != "yes"
          ? _c(
              "div",
              [
                _c("div", {
                  staticClass: "expanded_content",
                  domProps: { innerHTML: _vm._s(_vm.data) }
                }),
                _c("edge-display", { attrs: { node: _vm.node } })
              ],
              1
            )
          : _vm._e(),
        _vm.nodes && _vm.nodes[_vm.node] && _vm.nodes[_vm.node].auto == "yes"
          ? _c(
              "div",
              [
                _c("node-index", { attrs: { nodeset: _vm.neighbours(_vm.node) } })
              ],
              1
            )
          : _vm._e(),
        !_vm.nodes || !_vm.nodes[_vm.node]
          ? _c("div", [_vm._v("\n\t\tLoading...\n\t    ")])
          : _vm._e()
      ])
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-965ed268_0", { source: "\n.snippet_content img[data-v-965ed268] {\n    max-width: 100%;\n}\n.expanded_content img[data-v-965ed268] {\n    max-width: 100%;\n}\n.snippet[data-v-965ed268]{\n    border-radius: 3px;\n    border: 1px solid #ccc;\n    margin-bottom: 10px;\n}\n.snippet_content[data-v-965ed268]{\n    padding:5px;\n}\n.snippet_header[data-v-965ed268]{\n    border-radius: 10px;\n    padding: 5px;\n    width: 100%;\n    margin-bottom: 10px;\n}\n.snippet_title[data-v-965ed268]{\n    font-size: 20pt;\n}\n.snippet_content[data-v-965ed268]{\n    max-height: 400px;\n    overflow-y:scroll;\n    overflow-x:scroll;\n    margin-bottom:10px;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/views/Node.vue"],"names":[],"mappings":";AAiJA;IACA,eAAA;AACA;AAEA;IACA,eAAA;AACA;AAEA;IACA,kBAAA;IACA,sBAAA;IACA,mBAAA;AACA;AAEA;IACA,WAAA;AACA;AAEA;IACA,mBAAA;IACA,YAAA;IACA,WAAA;IACA,mBAAA;AACA;AAEA;IACA,eAAA;AACA;AAEA;IACA,iBAAA;IACA,iBAAA;IACA,iBAAA;IACA,kBAAA;AACA","file":"Node.vue","sourcesContent":["<template>\n    <div>\n\t<div class=\"snippet_header\">\n\t    <span class=\"snippet_title\">{{nodes && nodes[node] ? nodes[node].name : 'loading...'}}</span>\n\t    <span v-on:click=\"edit_node(node)\" class=\"close_x\"><span class=\"fas fa-edit\"></span></span>\n\t    <span v-on:click=\"reload_node(node)\" class=\"close_x\"><span class=\"fas fa-sync\"></span></span>\n\t    <span v-on:click=\"new_node(node)\" class=\"close_x\"><span class=\"fas fa-plus\"></span></span>\n\t    <router-link to=\"/\" class=\"close_x\"><span class=\"fas fa-home\"></span></router-link>\n\t</div>\n\t<div>\n\t    <div v-if=\"nodes && nodes[node] && nodes[node].auto != 'yes'\">\n\t\t<div v-html=\"data\" class=\"expanded_content\"></div>\n\t\t<edge-display :node=\"node\"></edge-display>\n\t    </div>\n\t    <div v-if=\"nodes && nodes[node] && nodes[node].auto == 'yes'\">\n\t\t<node-index :nodeset=\"neighbours(node)\" />\n\t    </div>\n\t    <div v-if=\"!nodes || !nodes[node]\">\n\t\tLoading...\n\t    </div>\n\t</div>\n    </div>\n</template>\n\n<script>\n import Vue from 'vue'\n \n import { mapState } from 'vuex'\n import { mapGetters } from 'vuex'\n\n export default {\n     name: 'Node',\n     data() {\n\t return {\n\t     'node': this.$route.params.id,\n\t     'data': 'loading...'\n\t }\n     },\n     created: function() {\n\t console.log('cr');\n\t this.$store.commit('GO',this.node);\n\t this.get_node(this.node, function(){});\n     },\n     beforeRouteUpdate: function(to, fro, next) {\n\t console.log(\"ND\",this.node_data);\n\t let node_id = to.params.id;\n\t this.$store.dispatch('go',node_id);\n\t var self = this;\n\t if (!this.nodes[node_id]) {\n\t     console.log(\"problem:\",node_id,\"does not exist\");\n\t }\n\t else if (node_id in this.node_data) {\n\t     console.log(\"cached\");\n\t     this.data = this.node_data[node_id];\n\t     console.log(this.data);\n\t     this.node = node_id;\n\t     this.$nextTick(function(){Vue.run_plugins(this);});\n\t     next();\n\t }\n\t else if(this.nodes[node_id].auto == \"yes\") {\n\t     console.log(\"auto\");\n\t     this.node = node_id;\n\t     this.$store.dispatch('go',this.node);\n\t     next();\n\t }\n\t else {\n\t     console.log(\"not cached\");\n\t     this.get_node(node_id, next);\n\t }\n     },\n     computed: {\n\t ...mapState(['nodes', 'node_data']),\n\t ...mapGetters(['neighbours'])\n     },\n     methods: {\n\t get_node: function(node_id, next) {\n\t     var self = this;\n\t     console.log(\"fetching\",node_id);\n\t     var fetch_headers = new Headers();\n\t     fetch_headers.append('pragma', 'no-cache');\n\t     fetch_headers.append('cache-control', 'no-cache');\n\t     \n\t     var fetch_params = {\n\t\t method: 'GET',\n\t\t headers: fetch_headers,\n\t     };\n\t     fetch('/out/'+node_id+'.html', fetch_params).then(function(response){\n\t\t response.text().then(function(data){\n\t\t     var to_cache = {};\n\t\t     to_cache[node_id] = data;\n\t\t     self.$store.commit('CACHE',to_cache);\n\t\t     self.data = data;\n\t\t     self.node = node_id;\n\t\t     next();\n\t\t     console.log(\"IH1\",self.data,\"||\",self.$el.innerHTML);\n\t\t     self.$nextTick(function(){\n\t\t\t console.log(\"IH2\",self.data,\"||\",self.$el.innerHTML);\n\t\t\t Vue.run_plugins(self);\n\t\t\t console.log(\"IH3\",self.data,\"||\",self.$el.innerHTML);\n\t\t     });\n\t\t });\n\t     });\n\n\t },\n\t reload_node: function(node, event){\n\t     var self = this;\n\t     this.get_node(this.node, function(){});\n\t },\n\t edit_node: function(node, event){\n\t     var self = this;\n\t     var fetch_headers = new Headers();\n\t     fetch_headers.append('pragma', 'no-cache');\n\t     fetch_headers.append('cache-control', 'no-cache');\n\t     \n\t     var fetch_params = {\n\t\t method: 'GET',\n\t\t headers: fetch_headers,\n\t     };\n\t     fetch('/edit/'+node, fetch_params).then(function(response){\n\t\t response.text().then(function(data){\n\t\t     console.log(data);\n\t\t });\n\t     });\n\t },\n\t new_node: function(node, event){\n\t     var self = this;\n\t     var fetch_headers = new Headers();\n\t     fetch_headers.append('pragma', 'no-cache');\n\t     fetch_headers.append('cache-control', 'no-cache');\n\t     \n\t     var fetch_params = {\n\t\t method: 'GET',\n\t\t headers: fetch_headers,\n\t     };\n\t     fetch('/new', fetch_params).then(function(response){\n\t\t response.text().then(function(data){\n\t\t     console.log(data);\n\t\t });\n\t     });\n\t }\n     }\n }\n</script>\n\n<style scoped>\n .snippet_content img {\n     max-width: 100%;\n }\n\n .expanded_content img {\n     max-width: 100%;\n }\n\n .snippet{\n     border-radius: 3px;\n     border: 1px solid #ccc;\n     margin-bottom: 10px;\n }\n\n .snippet_content{\n     padding:5px;\n }\n\n .snippet_header{\n     border-radius: 10px;\n     padding: 5px;\n     width: 100%;\n     margin-bottom: 10px;\n }\n\n .snippet_title{\n     font-size: 20pt;\n }\n\n .snippet_content{\n     max-height: 400px;\n     overflow-y:scroll;\n     overflow-x:scroll;\n     margin-bottom:10px;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-965ed268";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    

    
    var Node = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$1,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      browser,
      undefined
    );

  Vue.use(Router);

  var router = new Router({
      mode: 'history',
      base: '/',
      routes: [
  	{
  	    path: '/',
  	    name: 'home',
  	    component: Home
  	},
  	{
  	    path: '/node/:id',
  	    name: 'node',
  	    component: Node,
  	    props: true
  	    // route level code-splitting
  	    // this generates a separate chunk (about.[hash].js) for this route
  	    // which is lazy-loaded when the route is visited.
  	    // component: function () { 
  	    //   return import(/* webpackChunkName: "about" */ './views/Node.vue')
  	    // }
  	}
      ]
  });

  Vue.use(Vuex__default);

  var store = new Vuex__default.Store({
      state: {
  	query: 'is category',
  	current: '',
  	nodes: {},
  	recent: [],
  	node_data: {},
  	plugin_data: {}
      },
      getters: {
  	neighbours: state => node_id => {
  	    let node = state.nodes[node_id];
  	    var ans = {};
  	    for(var d in node.edges) {
  		for(var l in node.edges[d]) {
  		    for(var nbr_id of node.edges[d][l]) {
  			ans[nbr_id] = state.nodes[nbr_id];
  		    }
  		}
  	    }
  	    return ans;
  	},
  	sorted: state => nodelist => {
  	    return nodelist.sort(function(a, b){
  		if('index' in state.nodes[a] && 'index' in state.nodes[b]) {
  		    return parseInt(state.nodes[a].index) - parseInt(state.nodes[b].index);
  		}
  		else if('date' in state.nodes[a] && 'date' in state.nodes[b]) {
  		    return state.nodes[a].date.localeCompare(state.nodes[b].date);
  		}
  		else return state.nodes[a].name.localeCompare(state.nodes[b].name);
  	    });
  	},
  	sortedby: state => (nodelist, priorities, ascending) => {
  	    var ans = nodelist.sort(function(a, b){
  		for (var i = 0; i < priorities.length; i++) {
  		    if (priorities[i] in state.nodes[a] && priorities[i] in state.nodes[b]) {
  			console.log("arr by",priorities[i]);
  			if (priorities[i] == 'index') {
  			    var ans = parseInt(state.nodes[a].index) - parseInt(state.nodes[b].index);
  			    return ascending ? ans : -ans;
  			}
  			var ans = state.nodes[a][priorities[i]].localeCompare(state.nodes[b][priorities[i]]);
  			return ascending ? ans : -ans;
  		    }
  		}
  		console.log("arr by name");
  		var ans = state.nodes[a].name.localeCompare(state.nodes[b].name);
  		return ascending ? ans : -ans;
  	    });
  	    console.log(ans);
  	    return ans;
  	}
      }, 
      mutations: {
  	CACHE: (state, nodes) => {
  	    //node_data = plugin_process(state, node_id, node_data);
  	    console.log('caching',nodes);
  	    for(var node_id in nodes){
  		state.node_data[node_id] = nodes[node_id];
  	    }
  	},
  	PLUGIN_DATA_STORE: (state, data) => {
  	    //node_data = plugin_process(state, node_id, node_data);
  	    console.log('storing',data);
  	    for(var plugin_id in data){
  		state.plugin_data[plugin_id] = data[plugin_id];
  	    }
  	},
  	CLEAR_HISTORY: state => {
  	    state.recent = [];
  	},
  	REMOVE_FROM_HISTORY: (state, node_id) => {
  	    var idx = state.recent.indexOf(node_id);
  	    if(idx >= 0) state.recent.splice(idx,1);
  	},
  	GO: (state, node_id) => {
  	    console.log('historicising');
  	    state.current = node_id;
  	    var idx = state.recent.indexOf(node_id);
  	    if(idx >= 0) {
  		state.recent.splice(idx, 1);
  	    }
  	    state.recent.unshift(node_id);
  	},
  	METADATA: (state, nodes) => {
  	    state.nodes = nodes;
  	    state.recent = [];
  	    state.query = "is category";
  	}
      },
      actions: {
  	cache: (context, nodes) => {
  	    context.commit('CACHE',nodes);
  	},
  	clear_history: (context) => {
  	    context.commit('CLEAR_HISTORY');
  	},
  	remove_from_history: (context, node_id) => {
  	    context.commit('REMOVE_FROM_HISTORY', node_id);
  	},
  	go: (context, node_id) => {
  	    context.commit('GO', node_id);
  	},
  	refresh_metadata: (context) => {
  	    var fetch_headers = new Headers();
  	    fetch_headers.append('pragma', 'no-cache');
  	    fetch_headers.append('cache-control', 'no-cache');
  	    
  	    var fetch_params = {
  		method: 'GET',
  		headers: fetch_headers,
  	    };
  	    return new Promise((resolve, reject) => {
  		fetch('/out/metadata.json', fetch_params).then(function(response){
  	    	    response.json().then(function(data){
  	    		context.commit('METADATA', data);
  			resolve();
  	    	    });
  		});
  	    });
  	    // fetch('/out/metadata.json', fetch_params).then(function(response){
  	    // 	console.log("R",response);
  	    // 	response.json().then(function(data){
  	    // 	    context.commit('METADATA', data);
  	    // 	});
  	    // });

  	}
      }
  });

  //
   
   var script$2 = {
       name: 'node-index',
       props: ['nodeset','node'],
       data() {
  	 return {
  	     'current_label': 'blah',
  	     'modes': {},
  	     'sort_methods': {}
  	 }
       },
       computed: {
  	 sort_method: function() {
  	     if (this.current_label in this.sort_methods) {
  		 return this.sort_methods[this.current_label][0];
  	     }
  	     return "name";
  	 },
  	 sort_is_ascending: function() {
  	     if (this.current_label in this.sort_methods) {
  		 return this.sort_methods[this.current_label][1];
  	     }
  	     return true;
  	 },
  	 nodelist: function() {
  	     var ans = [];
  	     for(var n in this.nodeset) {
  		 ans.push(n);
  	     }
  	     return ans;
  	 },
  	 num_nodes: function() {
  	     var ans = 0;
  	     for(var n in this.nodeset) ans++;
  	     return ans;
  	 },
  	 labeldata: function() {
  	     // The result is:
  	     // {
  	     //   disconnected: [],
  	     //   labels: {},
  	     // }

  	     var disconnected_nodes = [];
  	     var modes = {};
  	     var best_label = '';
  	     
  	     // We build the data structure needed to prepare the index.
  	     // For each label, we create an entry like:
  	     // {
  	     //   count: how many nodes does this label cover
  	     //   covered: the set of nodes hit by the eddge
  	     //   has: the list of nodes that "have" this edge
  	     //   is: the list of nodes that "is" this edge
  	     // }
  	     var all_labels = {}; 
  	     for(var n in this.nodeset) {
  		 for(var e in this.nodeset[n].edges.has) {
  		     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
  		     for(var t in this.nodeset[n].edges.has[e]){
  			 t = this.nodeset[n].edges.has[e][t];
  			 if(!(t in this.nodeset)) continue;
  			 if(!all_labels[e].covered[t]){
  			     // We haven't seen this node before
  			     all_labels[e].covered[t] = true;
  			     all_labels[e].count++;
  			 }
  			 if(all_labels[e].has.indexOf(n) == -1)
  			     all_labels[e].has.push(n);
  		     }
  		 }
  		 for(var e in this.nodeset[n].edges.is){
  		     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};
  		     for(var t in this.nodeset[n].edges.is[e]){
  			 t = this.nodeset[n].edges.is[e][t];
  			 if(!(t in this.nodeset)) continue;
  			 if(!all_labels[e].covered[t]){
  			     // We haven't seen this node before
  			     all_labels[e].covered[t] = true;
  			     all_labels[e].count++;
  			 }
  			 if(all_labels[e].is.indexOf(n) == -1)
  			     all_labels[e].is.push(n);
  		     }
  		 }
  	     }
  	     // Place the labels into a sorted list in order of
  	     // most edges to fewest edges (also, take this
  	     // opportunity to select the mode)
  	     var sorted_labels = [];
  	     for(var l in all_labels){
  		 if(all_labels[l].count == 0) continue;
  		 modes[l] = all_labels[l].is.length < all_labels[l].has.length ? 'by' : 'menu';
  		 sorted_labels.push(l);
  	     }
  	     var discriminitivity = function(l){
  		 // Intuitively, we are going to arrange the |count|
  		 // nodes in a rectangle with |has| or |is| columns. This
  		 // is the most "discriminitave" if the rectangle is a
  		 // square, i.e. |has| or |is| is close to sqrt(|count|).
  		     
  		 // However, we also want to normalise for number of
  		 // nodes, to a point, and we want to penalise being too close to the useless values of 

  		 var N = all_labels[l].count;
  		 var tgt = Math.sqrt(N);
  		 var scores = [];
  		 var ns = [all_labels[l].has.length, all_labels[l].is.length];
  		 for(var i = 0; i < 2; i++) {
  		     var n = ns[i];
  		     var tgt_score = 1-(tgt-n)*(tgt-n)/(N*N); // This rewards being close to sqrt(N) -- bigger is better
  		     var avoid_ends_score = Math.min(0, (n-1)*(N/2-n)/(N*N)); // This penalises being too close to 1 or N/2--bigger is better
  		     var nodes_score = Math.log(N+1); // This factors in number of nodes a little (containing more is better than few, but only meaningfully so if an order of magnitude more)
  		     var score = nodes_score*(tgt_score + avoid_ends_score);
  		     
  		     console.log("D",l,i,tgt_score, avoid_ends_score, nodes_score,score);   
  		     scores.push(score);
  		 }
  		 return Math.max(scores[0], scores[1]);
  	     };
  	     console.log("ALAL",all_labels);
  	     sorted_labels.sort(function(a, b){
  		 var da = discriminitivity(a);
  		 var db = discriminitivity(b);
  		 // We want to sort in increa
  		 if(da < db) return 1; // Sort a before b
  		 if(da > db) return -1; // Sort b before a
  		 return 0;
  	     });
  	     // Prep a set of all nodes so we can mark which ones we've finished
  	     var finished_nodes = {};
  	     var nodes_count = 0;
  	     var finished_count = 0;
  	     for(var n in this.nodeset) {
  		 // Only count nodes with actual edges; we'll deal
  		 // with disconnected ones separately
  		 var disconnected = true;
  		 for(var e in this.nodeset[n].edges.has){
  		     for(var i = 0; i < this.nodeset[n].edges.has[e].length; i++){
  			 t = this.nodeset[n].edges.has[e][i];
  			 if(this.nodeset[t]) disconnected = false;
  		     }
  		 }
  		 for(var e in this.nodeset[n].edges.is){
  		     for(var i = 0; i < this.nodeset[n].edges.is[e].length; i++){
  			 t = this.nodeset[n].edges.is[e][i];
  			 if(this.nodeset[t]) disconnected = false;
  		     }
  		 }
  		 if(disconnected){
  		     disconnected_nodes.push(n);
  		 }
  		 else {
  		     finished_nodes[n] = false;
  		     nodes_count++;
  		 }
  	     }

  	     // Now we want to collect the labels we will use for
  	     // indexing as well as figure out what modes to
  	     // display them in
  	     var best_labels = [];
  	     
  	     // Run through the labels
  	     for(var i = 0; i < sorted_labels.length; i++) {
  		 best_labels.push(sorted_labels[i]);
  		 // Mark all nodes covered as finished:
  		 for(var n in sorted_labels[i].covered){
  		     if(!finished_nodes[n]){
  			 finished_count++;
  			 finished_nodes[n] = true;
  		     }
  		 }
  		 // We cut short the use of labels, but only if we have
  		 // exhausted all the connected nodes, each under at
  		 // least one label already _and_ only if we already
  		 // have a lot of labels (> 20)
  		 if(finished_count == nodes_count && best_labels.length > 20) {
  		     break;
  		 }
  	     }

  	     // Now we are done!
  	     if(best_labels.length == 1) best_label = best_labels[0];
  	     else best_label = 'all';
  	     this.current_label = best_label;
  	     this.modes = modes;
  	     return {
  		 'disconnected': disconnected_nodes,
  		 'labels': best_labels
  	     };
  	 },
  	 ...Vuex.mapState(['nodes']),
  	 ...Vuex.mapGetters(['sorted','sortedby'])
       },
       methods: {
  	 sortasc: function(ascending) {
  	     if (!(this.current_label in this.sort_methods)) {
  		 this.sort_methods[this.current_label] = ["name",ascending];
  	     }
  	     else {
  		 this.sort_methods[this.current_label][1] = ascending;
  	     }
  	     this.$forceUpdate();
  	 },
  	 sortby: function(key) {
  	     console.log("sorting",this.current_label," by ",key);
  	     if (!(this.current_label in this.sort_methods)) {
  		 this.sort_methods[this.current_label] = [key,true];
  	     }
  	     else {
  		 this.sort_methods[this.current_label][0] = key;
  	     }
  	     this.$forceUpdate();
  	 },
  	 toggle_display: function(l) {
   	     this.current_label = l;
  	 },
  	 swap_mode: function(l) {
   	     this.modes[l] = (this.modes[l] == 'by' ? 'menu' : 'by');
   	     //this.$forceUpdate();
  	 },

       }
   };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "node-index-container" }, [
      _c(
        "div",
        { staticClass: "node-index-menu" },
        [
          _vm.num_nodes > 0
            ? _c(
                "div",
                {
                  class:
                    "node-index-menu-item " +
                    (_vm.current_label == "all"
                      ? "node-index-menu-selected"
                      : ""),
                  on: {
                    click: function($event) {
                      return _vm.toggle_display("all")
                    }
                  }
                },
                [_vm._v("\n\t\t(all)\n            ")]
              )
            : _vm._e(),
          _vm._l(_vm.labeldata.labels, function(l) {
            return _c(
              "div",
              {
                class:
                  "node-index-menu-item " +
                  (_vm.current_label == l ? "node-index-menu-selected" : ""),
                on: {
                  click: function($event) {
                    return _vm.toggle_display(l)
                  }
                }
              },
              [_vm._v("\n\t\t" + _vm._s(l) + "\n            ")]
            )
          }),
          _vm.labeldata.disconnected &&
          _vm.labeldata.disconnected.length > 0 &&
          _vm.labeldata.disconnected.length < _vm.num_nodes
            ? _c(
                "div",
                {
                  class:
                    "node-index-menu-item " +
                    (_vm.current_label == "unlinked"
                      ? "node-index-menu-selected"
                      : ""),
                  on: {
                    click: function($event) {
                      return _vm.toggle_display("unlinked")
                    }
                  }
                },
                [_vm._v("\n\t\t(unlinked)\n            ")]
              )
            : _vm._e()
        ],
        2
      ),
      _vm.current_label != "all" && _vm.current_label != "unlinked"
        ? _c(
            "div",
            { staticClass: "node-index-list" },
            [
              _c("h3", [
                _vm._v(
                  _vm._s(
                    _vm.modes[_vm.current_label] == "by"
                      ? "By " + _vm.current_label
                      : "Has " + _vm.current_label
                  ) + " "
                ),
                _c(
                  "span",
                  {
                    staticStyle: { cursor: "pointer", "font-size": ".5em" },
                    on: {
                      click: function($event) {
                        return _vm.swap_mode(_vm.current_label)
                      }
                    }
                  },
                  [_c("span", { staticClass: "fas fa-random" })]
                ),
                _c(
                  "span",
                  { staticStyle: { "margin-left": "3em", "font-size": ".5em" } },
                  [_vm._v("Sort by:")]
                ),
                _c(
                  "span",
                  {
                    staticStyle: { cursor: "pointer", "font-size": ".5em" },
                    on: {
                      click: function($event) {
                        return _vm.sortby("date")
                      }
                    }
                  },
                  [_vm._v("date")]
                ),
                _c(
                  "span",
                  {
                    staticStyle: { cursor: "pointer", "font-size": ".5em" },
                    on: {
                      click: function($event) {
                        return _vm.sortby("name")
                      }
                    }
                  },
                  [_vm._v("name")]
                ),
                !_vm.sort_is_ascending
                  ? _c(
                      "span",
                      {
                        staticStyle: { cursor: "pointer", "font-size": ".5em" },
                        on: {
                          click: function($event) {
                            return _vm.sortasc(true)
                          }
                        }
                      },
                      [
                        _vm._v("a"),
                        _c("span", { staticClass: "fas fa-long-arrow-up" })
                      ]
                    )
                  : _vm._e(),
                _vm.sort_is_ascending
                  ? _c(
                      "span",
                      {
                        staticStyle: { cursor: "pointer", "font-size": ".5em" },
                        on: {
                          click: function($event) {
                            return _vm.sortasc(false)
                          }
                        }
                      },
                      [
                        _vm._v("d"),
                        _c("span", { staticClass: "fas fa-long-arrow-down" })
                      ]
                    )
                  : _vm._e()
              ]),
              _c("label-index", {
                attrs: {
                  label: _vm.current_label,
                  mode: _vm.modes[_vm.current_label],
                  nodeset: _vm.nodeset,
                  sortkey: _vm.sort_method,
                  sortascending: _vm.sort_is_ascending
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm.current_label == "all" && _vm.num_nodes > 0
        ? _c("div", { staticClass: "node-index-list" }, [
            _vm.node
              ? _c(
                  "div",
                  [
                    _c("h3", [_vm._v("All edges")]),
                    _c("edge-display", { attrs: { node: _vm.node } })
                  ],
                  1
                )
              : _vm._e(),
            !_vm.node
              ? _c("div", [
                  _c("h3", [
                    _vm._v("All nodes"),
                    _c(
                      "span",
                      {
                        staticStyle: { "margin-left": "3em", "font-size": ".5em" }
                      },
                      [_vm._v("Sort by:")]
                    ),
                    _c(
                      "span",
                      {
                        staticStyle: { cursor: "pointer", "font-size": ".5em" },
                        on: {
                          click: function($event) {
                            return _vm.sortby("date")
                          }
                        }
                      },
                      [_vm._v("date")]
                    ),
                    _c(
                      "span",
                      {
                        staticStyle: { cursor: "pointer", "font-size": ".5em" },
                        on: {
                          click: function($event) {
                            return _vm.sortby("name")
                          }
                        }
                      },
                      [_vm._v("name")]
                    ),
                    !_vm.sort_is_ascending
                      ? _c(
                          "span",
                          {
                            staticStyle: {
                              cursor: "pointer",
                              "font-size": ".5em"
                            },
                            on: {
                              click: function($event) {
                                return _vm.sortasc(true)
                              }
                            }
                          },
                          [
                            _vm._v("a"),
                            _c("span", { staticClass: "fas fa-long-arrow-up" })
                          ]
                        )
                      : _vm._e(),
                    _vm.sort_is_ascending
                      ? _c(
                          "span",
                          {
                            staticStyle: {
                              cursor: "pointer",
                              "font-size": ".5em"
                            },
                            on: {
                              click: function($event) {
                                return _vm.sortasc(false)
                              }
                            }
                          },
                          [
                            _vm._v("d"),
                            _c("span", { staticClass: "fas fa-long-arrow-down" })
                          ]
                        )
                      : _vm._e()
                  ]),
                  _c(
                    "ul",
                    _vm._l(
                      _vm.sortedby(
                        _vm.nodelist,
                        [_vm.sort_method],
                        _vm.sort_is_ascending
                      ),
                      function(n) {
                        return _c(
                          "li",
                          [
                            _c("router-link", { attrs: { to: "/node/" + n } }, [
                              _vm._v(_vm._s(_vm.nodes[n].name))
                            ])
                          ],
                          1
                        )
                      }
                    ),
                    0
                  )
                ])
              : _vm._e()
          ])
        : _vm._e(),
      _vm.current_label == "unlinked"
        ? _c("div", { staticClass: "node-index-list" }, [
            _c("h3", [_vm._v("Unlinked")]),
            _c(
              "ul",
              _vm._l(_vm.sorted(_vm.labeldata.disconnected), function(n) {
                return _c(
                  "li",
                  [
                    _c("router-link", { attrs: { to: "/node/" + n } }, [
                      _vm._v(_vm._s(_vm.nodes[n].name))
                    ])
                  ],
                  1
                )
              }),
              0
            )
          ])
        : _vm._e(),
      _c("div", { staticClass: "spacer", staticStyle: { clear: "both" } })
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = function (inject) {
      if (!inject) return
      inject("data-v-0a092bf5_0", { source: "\n.node-index-menu[data-v-0a092bf5] {\n    width: 24%;\n    float:left;\n}\n.node-index-menu-item[data-v-0a092bf5] {\n    width: 90%;\n    border-radius:8px;\n    padding:5px;\n    margin:2px;\n    cursor:pointer;\n    background-color: #ccf !important;\n}\n.node-index-menu-selected[data-v-0a092bf5] {\n    background-color: #99c !important;\n}\n.node-index-list[data-v-0a092bf5] {\n    width: 72%;\n    float:left;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/nodes.vue"],"names":[],"mappings":";AA2RA;IACA,UAAA;IACA,UAAA;AACA;AAEA;IACA,UAAA;IACA,iBAAA;IACA,WAAA;IACA,UAAA;IACA,cAAA;IACA,iCAAA;AACA;AAGA;IACA,iCAAA;AACA;AAEA;IACA,UAAA;IACA,UAAA;AACA","file":"nodes.vue","sourcesContent":["<template>\n    <div class=\"node-index-container\">\n\t<div class=\"node-index-menu\">\n            <div v-on:click=\"toggle_display('all')\" v-bind:class=\"'node-index-menu-item ' + (current_label == 'all' ? 'node-index-menu-selected' : '')\" v-if=\"num_nodes > 0\">\n\t\t(all)\n            </div>\n            <div v-on:click=\"toggle_display(l)\" v-bind:class=\"'node-index-menu-item ' + (current_label == l ? 'node-index-menu-selected' : '')\" v-for=\"l in labeldata.labels\">\n\t\t{{l}}\n            </div>\n            <div v-on:click=\"toggle_display('unlinked')\" v-bind:class=\"'node-index-menu-item ' + (current_label == 'unlinked' ? 'node-index-menu-selected' : '')\" v-if=\"labeldata.disconnected && labeldata.disconnected.length > 0 && labeldata.disconnected.length < num_nodes\">\n\t\t(unlinked)\n            </div>\n\t</div>\n\t\n\t<!-- List of edges associated with current_label -->\n\t<div class=\"node-index-list\" v-if=\"current_label != 'all' && current_label != 'unlinked'\">\n            <h3>{{modes[current_label] == 'by' ? 'By ' + current_label : 'Has ' + current_label}} <span style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"swap_mode(current_label)\"><span class=\"fas fa-random\"></span></span><span style=\"margin-left:3em;font-size:.5em;\">Sort by:</span><span style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortby('date')\">date</span><span style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortby('name')\">name</span><span v-if=\"!sort_is_ascending\" style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortasc(true)\">a<span class=\"fas fa-long-arrow-up\"></span></span><span v-if=\"sort_is_ascending\" style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortasc(false)\">d<span class=\"fas fa-long-arrow-down\"></span></span></h3>\n            <label-index :label=\"current_label\" :mode=\"modes[current_label]\" :nodeset=\"nodeset\" :sortkey=\"sort_method\" :sortascending=\"sort_is_ascending\" />\n\t</div>\n\t\n\t<!-- List of all edges -->\n\t<div class=\"node-index-list\" v-if=\"current_label == 'all' && num_nodes > 0\">\n            <div v-if=\"node\">\n\t\t<h3>All edges</h3>\n    \t\t<edge-display :node=\"node\"></edge-display>\n            </div>\n            <div v-if=\"!node\">\n\t\t<h3>All nodes<span style=\"margin-left:3em;font-size:.5em;\">Sort by:</span><span style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortby('date')\">date</span><span style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortby('name')\">name</span><span v-if=\"!sort_is_ascending\" style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortasc(true)\">a<span class=\"fas fa-long-arrow-up\"></span></span><span v-if=\"sort_is_ascending\" style=\"cursor:pointer;font-size:.5em;\" v-on:click=\"sortasc(false)\">d<span class=\"fas fa-long-arrow-down\"></span></span></h3>\n    \t\t<ul>\n\t\t    <li v-for=\"n in sortedby(nodelist, [sort_method], sort_is_ascending)\">\n\t\t\t<router-link :to=\"'/node/'+n\">{{nodes[n].name}}</router-link>\n\t\t    </li>\n    \t\t</ul>\n            </div>\n\t</div>\n\t\n\t<!-- List of unlinked nodes -->\n\t<div class=\"node-index-list\" v-if=\"current_label == 'unlinked'\">\n            <h3>Unlinked</h3>\n            <ul>\n    \t\t<li v-for=\"n in sorted(labeldata.disconnected)\">\n    \t\t    <router-link :to=\"'/node/'+n\">{{nodes[n].name}}</router-link>\n    \t\t</li>\n            </ul>\n\t</div>\n\t\n\t<div class=\"spacer\" style=\"clear: both;\"></div>\n    </div>\n</template>\n\n<script>\n import { mapState } from 'vuex'\n import { mapGetters } from 'vuex'\n \n export default {\n     name: 'node-index',\n     props: ['nodeset','node'],\n     data() {\n\t return {\n\t     'current_label': 'blah',\n\t     'modes': {},\n\t     'sort_methods': {}\n\t }\n     },\n     computed: {\n\t sort_method: function() {\n\t     if (this.current_label in this.sort_methods) {\n\t\t return this.sort_methods[this.current_label][0];\n\t     }\n\t     return \"name\";\n\t },\n\t sort_is_ascending: function() {\n\t     if (this.current_label in this.sort_methods) {\n\t\t return this.sort_methods[this.current_label][1];\n\t     }\n\t     return true;\n\t },\n\t nodelist: function() {\n\t     var ans = [];\n\t     for(var n in this.nodeset) {\n\t\t ans.push(n);\n\t     }\n\t     return ans;\n\t },\n\t num_nodes: function() {\n\t     var ans = 0;\n\t     for(var n in this.nodeset) ans++;\n\t     return ans;\n\t },\n\t labeldata: function() {\n\t     // The result is:\n\t     // {\n\t     //   disconnected: [],\n\t     //   labels: {},\n\t     // }\n\n\t     var disconnected_nodes = [];\n\t     var modes = {};\n\t     var best_label = ''\n\t     \n\t     // We build the data structure needed to prepare the index.\n\t     // For each label, we create an entry like:\n\t     // {\n\t     //   count: how many nodes does this label cover\n\t     //   covered: the set of nodes hit by the eddge\n\t     //   has: the list of nodes that \"have\" this edge\n\t     //   is: the list of nodes that \"is\" this edge\n\t     // }\n\t     var all_labels = {}; \n\t     for(var n in this.nodeset) {\n\t\t for(var e in this.nodeset[n].edges.has) {\n\t\t     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};\n\t\t     for(var t in this.nodeset[n].edges.has[e]){\n\t\t\t t = this.nodeset[n].edges.has[e][t];\n\t\t\t if(!(t in this.nodeset)) continue;\n\t\t\t if(!all_labels[e].covered[t]){\n\t\t\t     // We haven't seen this node before\n\t\t\t     all_labels[e].covered[t] = true;\n\t\t\t     all_labels[e].count++;\n\t\t\t }\n\t\t\t if(all_labels[e].has.indexOf(n) == -1)\n\t\t\t     all_labels[e].has.push(n);\n\t\t     }\n\t\t }\n\t\t for(var e in this.nodeset[n].edges.is){\n\t\t     if(!(e in all_labels)) all_labels[e] = {'count':0, 'covered':{},'has':[],'is':[], 'mode':''};\n\t\t     for(var t in this.nodeset[n].edges.is[e]){\n\t\t\t t = this.nodeset[n].edges.is[e][t];\n\t\t\t if(!(t in this.nodeset)) continue;\n\t\t\t if(!all_labels[e].covered[t]){\n\t\t\t     // We haven't seen this node before\n\t\t\t     all_labels[e].covered[t] = true;\n\t\t\t     all_labels[e].count++;\n\t\t\t }\n\t\t\t if(all_labels[e].is.indexOf(n) == -1)\n\t\t\t     all_labels[e].is.push(n);\n\t\t     }\n\t\t }\n\t     }\n\t     // Place the labels into a sorted list in order of\n\t     // most edges to fewest edges (also, take this\n\t     // opportunity to select the mode)\n\t     var sorted_labels = [];\n\t     for(var l in all_labels){\n\t\t if(all_labels[l].count == 0) continue;\n\t\t modes[l] = all_labels[l].is.length < all_labels[l].has.length ? 'by' : 'menu';\n\t\t sorted_labels.push(l);\n\t     }\n\t     var discriminitivity = function(l){\n\t\t // Intuitively, we are going to arrange the |count|\n\t\t // nodes in a rectangle with |has| or |is| columns. This\n\t\t // is the most \"discriminitave\" if the rectangle is a\n\t\t // square, i.e. |has| or |is| is close to sqrt(|count|).\n\t\t     \n\t\t // However, we also want to normalise for number of\n\t\t // nodes, to a point, and we want to penalise being too close to the useless values of \n\n\t\t var N = all_labels[l].count;\n\t\t var tgt = Math.sqrt(N);\n\t\t var scores = [];\n\t\t var ns = [all_labels[l].has.length, all_labels[l].is.length]\n\t\t for(var i = 0; i < 2; i++) {\n\t\t     var n = ns[i];\n\t\t     var tgt_score = 1-(tgt-n)*(tgt-n)/(N*N); // This rewards being close to sqrt(N) -- bigger is better\n\t\t     var avoid_ends_score = Math.min(0, (n-1)*(N/2-n)/(N*N)); // This penalises being too close to 1 or N/2--bigger is better\n\t\t     var nodes_score = Math.log(N+1); // This factors in number of nodes a little (containing more is better than few, but only meaningfully so if an order of magnitude more)\n\t\t     var score = nodes_score*(tgt_score + avoid_ends_score);\n\t\t     \n\t\t     console.log(\"D\",l,i,tgt_score, avoid_ends_score, nodes_score,score)   \n\t\t     scores.push(score);\n\t\t }\n\t\t return Math.max(scores[0], scores[1]);\n\t     }\n\t     console.log(\"ALAL\",all_labels);\n\t     sorted_labels.sort(function(a, b){\n\t\t var da = discriminitivity(a);\n\t\t var db = discriminitivity(b);\n\t\t // We want to sort in increa\n\t\t if(da < db) return 1; // Sort a before b\n\t\t if(da > db) return -1; // Sort b before a\n\t\t return 0;\n\t     });\n\t     // Prep a set of all nodes so we can mark which ones we've finished\n\t     var finished_nodes = {};\n\t     var nodes_count = 0;\n\t     var finished_count = 0;\n\t     for(var n in this.nodeset) {\n\t\t // Only count nodes with actual edges; we'll deal\n\t\t // with disconnected ones separately\n\t\t var disconnected = true;\n\t\t for(var e in this.nodeset[n].edges.has){\n\t\t     for(var i = 0; i < this.nodeset[n].edges.has[e].length; i++){\n\t\t\t t = this.nodeset[n].edges.has[e][i];\n\t\t\t if(this.nodeset[t]) disconnected = false;\n\t\t     }\n\t\t }\n\t\t for(var e in this.nodeset[n].edges.is){\n\t\t     for(var i = 0; i < this.nodeset[n].edges.is[e].length; i++){\n\t\t\t t = this.nodeset[n].edges.is[e][i];\n\t\t\t if(this.nodeset[t]) disconnected = false;\n\t\t     }\n\t\t }\n\t\t if(disconnected){\n\t\t     disconnected_nodes.push(n);\n\t\t }\n\t\t else {\n\t\t     finished_nodes[n] = false;\n\t\t     nodes_count++;\n\t\t }\n\t     }\n\n\t     // Now we want to collect the labels we will use for\n\t     // indexing as well as figure out what modes to\n\t     // display them in\n\t     var best_labels = [];\n\t     \n\t     // Run through the labels\n\t     for(var i = 0; i < sorted_labels.length; i++) {\n\t\t best_labels.push(sorted_labels[i]);\n\t\t // Mark all nodes covered as finished:\n\t\t for(var n in sorted_labels[i].covered){\n\t\t     if(!finished_nodes[n]){\n\t\t\t finished_count++;\n\t\t\t finished_nodes[n] = true;\n\t\t     }\n\t\t }\n\t\t // We cut short the use of labels, but only if we have\n\t\t // exhausted all the connected nodes, each under at\n\t\t // least one label already _and_ only if we already\n\t\t // have a lot of labels (> 20)\n\t\t if(finished_count == nodes_count && best_labels.length > 20) {\n\t\t     break;\n\t\t }\n\t     }\n\n\t     // Now we are done!\n\t     if(best_labels.length == 1) best_label = best_labels[0];\n\t     else best_label = 'all';\n\t     this.current_label = best_label;\n\t     this.modes = modes;\n\t     return {\n\t\t 'disconnected': disconnected_nodes,\n\t\t 'labels': best_labels\n\t     };\n\t },\n\t ...mapState(['nodes']),\n\t ...mapGetters(['sorted','sortedby'])\n     },\n     methods: {\n\t sortasc: function(ascending) {\n\t     if (!(this.current_label in this.sort_methods)) {\n\t\t this.sort_methods[this.current_label] = [\"name\",ascending];\n\t     }\n\t     else {\n\t\t this.sort_methods[this.current_label][1] = ascending;\n\t     }\n\t     this.$forceUpdate();\n\t },\n\t sortby: function(key) {\n\t     console.log(\"sorting\",this.current_label,\" by \",key);\n\t     if (!(this.current_label in this.sort_methods)) {\n\t\t this.sort_methods[this.current_label] = [key,true];\n\t     }\n\t     else {\n\t\t this.sort_methods[this.current_label][0] = key;\n\t     }\n\t     this.$forceUpdate();\n\t },\n\t toggle_display: function(l) {\n \t     this.current_label = l;\n\t },\n\t swap_mode: function(l) {\n \t     this.modes[l] = (this.modes[l] == 'by' ? 'menu' : 'by');\n \t     //this.$forceUpdate();\n\t },\n\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n\n .node-index-menu {\n     width: 24%;\n     float:left;\n }\n\n .node-index-menu-item {\n     width: 90%;\n     border-radius:8px;\n     padding:5px;\n     margin:2px;\n     cursor:pointer;\n     background-color: #ccf !important;\n }\n\n\n .node-index-menu-selected {\n     background-color: #99c !important;\n }\n\n .node-index-list {\n     width: 72%;\n     float:left;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$3 = "data-v-0a092bf5";
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    

    
    var NodeIndex = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$2,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      browser,
      undefined
    );

  //
   
   var script$3 = {
       name: 'label-index',
       props: ['mode','label','nodeset','sortkey','sortascending'],
       data: function() {
  	 return {
  	     sort_key:this.sortkey,
  	     sort_asc:this.sortascending
  	 }
       },
       computed: {
  	 headers: function() {
  	     if(this.mode == 'menu'){
  		 var ans = [];
  		 for(var n in this.nodeset) {
  		     if(this.nodes[n].edges['has'][this.label]){
  			 ans.push(n);
  		     }
  		 }
  		 return ans;
  	     }
  	     else if(this.mode == 'by') {
  		 var ans = [];
  		 for(var n in this.nodeset) {
  		     if(this.nodes[n].edges['is'][this.label]){
  			 ans.push(n);
  		     }
  		 }
  		 return ans;
  	     }
  	 },
  	 ...Vuex.mapState([
  	     'nodes'
  	 ]),
  	 ...Vuex.mapGetters(['sorted','sortedby'])
       },
       methods: {
  	 label_neighbours: function(n, label) {
  	     var ans = [];
  	     console.log("NL",n,label);
  	     var tgts = this.nodes[n].edges[this.mode == 'menu' ? 'has' : 'is'][label];
  	     for(var i = 0; i < tgts.length; i++) {
  		 var m = tgts[i];
  		 console.log(m);
  		 if(m in this.nodeset) ans.push(m);
  	     }
  	     console.log(ans);
  	     return ans;
  	 }
       }
   };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "label_index" }, [
      _vm.mode == "by" || _vm.mode == "menu"
        ? _c(
            "ul",
            _vm._l(
              _vm.sortedby(_vm.headers, [_vm.sort_key], _vm.sort_asc),
              function(n) {
                return _c(
                  "li",
                  [
                    _c(
                      "router-link",
                      { attrs: { to: { name: "node", params: { id: n } } } },
                      [_vm._v(_vm._s(_vm.nodes[n].name))]
                    ),
                    _c(
                      "ul",
                      _vm._l(
                        _vm.sortedby(
                          _vm.label_neighbours(n, _vm.label),
                          [_vm.sort_key],
                          _vm.sort_asc
                        ),
                        function(m) {
                          return _c(
                            "li",
                            [
                              _c(
                                "router-link",
                                {
                                  attrs: {
                                    to: { name: "node", params: { id: m } }
                                  }
                                },
                                [_vm._v(_vm._s(_vm.nodes[m].name))]
                              )
                            ],
                            1
                          )
                        }
                      ),
                      0
                    )
                  ],
                  1
                )
              }
            ),
            0
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-401e637a_0", { source: "\nh3[data-v-401e637a] {\n  margin: 40px 0 0;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/labels.vue"],"names":[],"mappings":";AAyEA;EACA,gBAAA;AACA","file":"labels.vue","sourcesContent":["<template>\n  <div class=\"label_index\">\n      <ul v-if=\"mode == 'by' || mode == 'menu'\">\n\t  <li v-for=\"n in sortedby(headers,[sort_key], sort_asc)\">\n\t      <router-link :to=\"{name:'node', params: {id: n}}\">{{nodes[n].name}}</router-link>\n\t      <ul>\n\t\t  <li v-for=\"m in sortedby(label_neighbours(n, label), [sort_key], sort_asc)\">\n\t\t      <router-link :to=\"{name:'node', params: {id: m}}\">{{nodes[m].name}}</router-link>\n\t\t  </li>\n\t      </ul>\n\t  </li>\n      </ul>\n  </div>\n</template>\n\n<script>\n import { mapState } from 'vuex'\n import { mapGetters } from 'vuex'\n \n export default {\n     name: 'label-index',\n     props: ['mode','label','nodeset','sortkey','sortascending'],\n     data: function() {\n\t return {\n\t     sort_key:this.sortkey,\n\t     sort_asc:this.sortascending\n\t }\n     },\n     computed: {\n\t headers: function() {\n\t     if(this.mode == 'menu'){\n\t\t var ans = []\n\t\t for(var n in this.nodeset) {\n\t\t     if(this.nodes[n].edges['has'][this.label]){\n\t\t\t ans.push(n);\n\t\t     }\n\t\t }\n\t\t return ans;\n\t     }\n\t     else if(this.mode == 'by') {\n\t\t var ans = []\n\t\t for(var n in this.nodeset) {\n\t\t     if(this.nodes[n].edges['is'][this.label]){\n\t\t\t ans.push(n);\n\t\t     }\n\t\t }\n\t\t return ans;\n\t     }\n\t },\n\t ...mapState([\n\t     'nodes'\n\t ]),\n\t ...mapGetters(['sorted','sortedby'])\n     },\n     methods: {\n\t label_neighbours: function(n, label) {\n\t     var ans = [];\n\t     console.log(\"NL\",n,label);\n\t     var tgts = this.nodes[n].edges[this.mode == 'menu' ? 'has' : 'is'][label];\n\t     for(var i = 0; i < tgts.length; i++) {\n\t\t var m = tgts[i];\n\t\t console.log(m);\n\t\t if(m in this.nodeset) ans.push(m);\n\t     }\n\t     console.log(ans);\n\t     return ans;\n\t }\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\nh3 {\n  margin: 40px 0 0;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = "data-v-401e637a";
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    

    
    var LabelIndex = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$3,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      browser,
      undefined
    );

  //
   
   var script$4 = {
       name: 'history-display',
       computed: Vuex.mapState([
  	 'recent', 'nodes'
       ]),
       methods: {
  	 remove_from_history: function(node_id) {
  	     this.$store.dispatch('remove_from_history',node_id);
  	 },
  	 clear_history: function() {
  	     this.$store.dispatch('clear_history');
  	 }
       }
   };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "working_set" } }, [
      _vm.recent.length != 0
        ? _c("h4", [
            _c(
              "span",
              {
                staticStyle: { cursor: "pointer", "margin-right": "5px" },
                on: {
                  click: function($event) {
                    return _vm.clear_history()
                  }
                }
              },
              [_vm._v("[x]")]
            ),
            _vm._v("Recent nodes\n")
          ])
        : _vm._e(),
      _c(
        "ul",
        _vm._l(_vm.recent, function(node) {
          return _c(
            "li",
            [
              _c(
                "span",
                {
                  staticStyle: { cursor: "pointer", "margin-right": "5px" },
                  on: {
                    click: function($event) {
                      return _vm.remove_from_history(node)
                    }
                  }
                },
                [_vm._v("[x]")]
              ),
              _c(
                "router-link",
                { attrs: { to: { name: "node", params: { id: node } } } },
                [
                  _vm._v(
                    _vm._s(
                      _vm.nodes && _vm.nodes[node]
                        ? _vm.nodes[node].name
                        : "loading..."
                    )
                  )
                ]
              )
            ],
            1
          )
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-d4dcb7a4_0", { source: "\n#working_set[data-v-d4dcb7a4]{\n    padding-top:5px;\n    padding-left:5px;\n}\n\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/history.vue"],"names":[],"mappings":";AAuCA;IACA,eAAA;IACA,gBAAA;AACA","file":"history.vue","sourcesContent":["<template>\n    <div id=\"working_set\">\n\t<h4 v-if=\"recent.length != 0\"><span v-on:click=\"clear_history()\" style=\"cursor:pointer;margin-right:5px;\">[x]</span>Recent nodes\n</h4>\n\t<ul>\n\t    <li v-for=\"node in recent\">\n\t\t<span v-on:click=\"remove_from_history(node)\" style=\"cursor:pointer;margin-right:5px;\">[x]</span> <router-link :to=\"{name:'node', params: {id: node}}\">{{nodes && nodes[node] ? nodes[node].name : \"loading...\"}}</router-link>\n\t    </li>\n\t    <!-- <draggable v-model=\"recent\">\n\t\t <li v-for=\"node in recent\">\n\t\t <router-link :to=\"{name:'doc', params: {id: node}}\">{{nodes[node].name}}</router-link>\n\t\t </li>\n\t\t </draggable> -->\n\t</ul>\n    </div>\n</template>\n\n<script>\n import { mapState } from 'vuex'\n \n export default {\n     name: 'history-display',\n     computed: mapState([\n\t 'recent', 'nodes'\n     ]),\n     methods: {\n\t remove_from_history: function(node_id) {\n\t     this.$store.dispatch('remove_from_history',node_id);\n\t },\n\t clear_history: function() {\n\t     this.$store.dispatch('clear_history');\n\t }\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n\n #working_set{\n     padding-top:5px;\n     padding-left:5px;\n }\n\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = "data-v-d4dcb7a4";
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    

    
    var HistoryDisplay = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$4,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      browser,
      undefined
    );

  //

  var script$5 = {
       name: 'edge-display',
       props: ['node'],
       computed: Vuex.mapState([
  	 'nodes'
       ])
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "edge_display" },
      [
        _vm._l(_vm.nodes[_vm.node].edges.has, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto != "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\thas " + _vm._s(edge) + ": \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        }),
        _vm._l(_vm.nodes[_vm.node].edges.is, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto != "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\tis " + _vm._s(edge) + " of: \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        }),
        _c("b", [_vm._v("Auto-generated:")]),
        _vm._l(_vm.nodes[_vm.node].edges.has, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto == "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\thas " + _vm._s(edge) + ": \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        }),
        _vm._l(_vm.nodes[_vm.node].edges.is, function(targets, edge) {
          return _c(
            "div",
            _vm._l(targets, function(target) {
              return _vm.nodes[target].auto == "yes"
                ? _c(
                    "div",
                    [
                      _vm._v("\n\t\tis " + _vm._s(edge) + " of: \n\t\t"),
                      _c("router-link", { attrs: { to: "./" + target } }, [
                        _vm._v(_vm._s(_vm.nodes[target].name))
                      ])
                    ],
                    1
                  )
                : _vm._e()
            }),
            0
          )
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-80d62b3c_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"edges.vue"}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = "data-v-80d62b3c";
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    

    
    var EdgeDisplay = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$5,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      browser,
      undefined
    );

  //

   var script$6 = {
       name: 'search',
       computed: { 
  	 ...Vuex.mapState(['nodes']),
  	 resultset: function() {
  	     var ans = {};
  	     for(var r of this.result) {
  		 ans[r] = this.nodes[r];
  	     }
  	     return ans;
  	 }
       },
       data() {
  	 return {
  	     entered_query: '',
  	     query: '',
  	     errormsg: '',
  	     result: []
  	 }
       },
       methods: {
  	 search: function() {
  	     this.entered_query = this.query;
  	     this.errormsg = "";
  	     if(this.query.trim().length == 0) {
  		 this.result = [];
  		 return;
  	     }
  	     try {
  		 var q = Vue.category_query.parse(this.query);
  	     }
  	     catch(e){
  		 this.errormsg = e.toString();
  		 this.result = [];
  		 return;
  	     }
  	     var query_result = Vue.category_search(q, this.nodes);
  	     if(query_result.length == 1) {
  		 this.$router.push('/node/'+query_result[0]);
  	     }
  	     else {
  		 this.result = query_result;
  		 for(var i = 0; i < this.result.length; i++){
  		     if(this.nodes[this.result[i]].name == this.query.trim()) {
  			 this.$router.push('/node/'+this.result[i]);
  			 break;
  		     }
  		 }
  	     }
  	 }
       },
       mounted: function() {
  	 this.query = '';
  	 this.search();
       }
   };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "searchbar" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.query,
            expression: "query"
          }
        ],
        attrs: { type: "text", id: "query_input" },
        domProps: { value: _vm.query },
        on: {
          keyup: function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null
            }
            return _vm.search($event)
          },
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.query = $event.target.value;
          }
        }
      }),
      _c(
        "ul",
        { staticClass: "category-search-result" },
        [
          _vm.errormsg.length > 0
            ? _c("span", { staticClass: "search-error" }, [
                _vm._v(_vm._s(_vm.errormsg))
              ])
            : _vm._e(),
          _vm.result.length == 0 &&
          _vm.entered_query.trim().length > 0 &&
          _vm.errormsg.length == 0
            ? _c("span", [_vm._v("No results")])
            : _vm._e(),
          _vm.result.length > 0
            ? _c("node-index", { attrs: { nodeset: _vm.resultset } })
            : _vm._e()
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = function (inject) {
      if (!inject) return
      inject("data-v-27c93aa4_0", { source: "\n.search-error[data-v-27c93aa4] {\n    color: #e33;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/components/search/search.vue"],"names":[],"mappings":";AA+EA;IACA,WAAA;AACA","file":"search.vue","sourcesContent":["<template>\n  <div class=\"searchbar\"> \n      <input type=\"text\" id=\"query_input\" v-model=\"query\" v-on:keyup.enter=\"search\" />\n      <ul class=\"category-search-result\">\n\t  <span class=\"search-error\" v-if=\"errormsg.length > 0\">{{errormsg}}</span>\n\t  <span v-if=\"result.length == 0 && entered_query.trim().length > 0 && errormsg.length == 0\">No results</span>\n\t  <node-index :nodeset=\"resultset\" v-if=\"result.length > 0\"></node-index>\n\t  <!-- <li v-for=\"node in result\">\n\t       <router-link :to=\"'./'+node\">{{nodes[node].name}}</router-link>\n\t       </li> -->\n      </ul>\n  </div>\n</template>\n\n<script>\n import Vue from 'vue'\n import { mapState } from 'vuex'\n\n export default {\n     name: 'search',\n     computed: { \n\t ...mapState(['nodes']),\n\t resultset: function() {\n\t     var ans = {};\n\t     for(var r of this.result) {\n\t\t ans[r] = this.nodes[r];\n\t     }\n\t     return ans;\n\t }\n     },\n     data() {\n\t return {\n\t     entered_query: '',\n\t     query: '',\n\t     errormsg: '',\n\t     result: []\n\t }\n     },\n     methods: {\n\t search: function() {\n\t     this.entered_query = this.query;\n\t     this.errormsg = \"\";\n\t     if(this.query.trim().length == 0) {\n\t\t this.result = [];\n\t\t return;\n\t     }\n\t     try {\n\t\t var q = Vue.category_query.parse(this.query);\n\t     }\n\t     catch(e){\n\t\t this.errormsg = e.toString();\n\t\t this.result = [];\n\t\t return;\n\t     }\n\t     var query_result = Vue.category_search(q, this.nodes);\n\t     if(query_result.length == 1) {\n\t\t this.$router.push('/node/'+query_result[0]);\n\t     }\n\t     else {\n\t\t this.result = query_result;\n\t\t for(var i = 0; i < this.result.length; i++){\n\t\t     if(this.nodes[this.result[i]].name == this.query.trim()) {\n\t\t\t this.$router.push('/node/'+this.result[i]);\n\t\t\t break;\n\t\t     }\n\t\t }\n\t     }\n\t }\n     },\n     mounted: function() {\n\t this.query = '';\n\t this.search();\n     }\n }\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n\n .search-error {\n     color: #e33;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$7 = "data-v-27c93aa4";
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject SSR */
    

    
    var SearchDisplay = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$6,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //

   var script$7 = {
       name: 'cat-video',
       props: ['root'],
       data () {
  	 return {
  	     id:'',
  	     index:{},
  	     url:'',
  	     type:'',
  	     player: null
  	 };
       },
       methods: {
  	 goto: function(t){
  	     document.getElementById(this.id).currentTime = t;
  	 }
       },
       mounted: function(){
  	 // Parse the link info
  	 var lines = this.root.innerHTML.split("\n");
  	 var url = lines[0].trim();
  	 var index = [];
  	 for (var i = 1; i < lines.length; i++) {
  	     var time = lines[i].split(" ")[0];
  	     var caption = lines[i].substring(lines[i].indexOf(" ")+1);
  	     var secs = 60*parseInt(time.split(":")[0])+parseInt(time.split(":")[1]);
  	     index.push({'secs':secs, 'caption':caption});
  	 }
  	 var ending = 'video/'+url.substring(url.lastIndexOf(".")+1);
  	 this.id = url.replace(new RegExp("[^0-9a-zA-Z_]","g"),"-");
  	 this.index = index;
  	 this.url = url;
  	 this.type = ending;
       }
   };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c("video", { attrs: { id: _vm.id, controls: "" } }, [
        _c("source", { attrs: { src: _vm.url, type: _vm.type } }),
        _vm._v(
          "\n\tIf you are seing this text, your browser does not support the video tag.\n    "
        )
      ]),
      _vm.index.length > 0
        ? _c(
            "ul",
            _vm._l(_vm.index, function(i) {
              return _c("li", [
                _c(
                  "a",
                  {
                    attrs: { href: "#" },
                    on: {
                      click: function($event) {
                        return _vm.goto(i.secs)
                      }
                    }
                  },
                  [
                    _vm._v(
                      _vm._s(Math.floor(i.secs / 60)) +
                        ":" +
                        _vm._s(new String(i.secs % 60).padStart(2, "0")) +
                        " " +
                        _vm._s(i.caption)
                    )
                  ]
                )
              ])
            }),
            0
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = undefined;
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var VideoPlugin = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$7,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

   var script$8 = {
       name: 'cat-math',
       props: ['root'],
       data () {
  	 return {
  	     id: '',
  	     rendered: '',
  	     player: null
  	 };
       },
       methods: {
  	 get_pos: function() {
  	     var el = document.getElementById("category-math-plugin-expr-"+this.id);
  	     var top = el.getBoundingClientRect().y;
  	     return {'position':'absolute','left':'-25%','top':top+'px','width':'25%'};
  	 }
       },
       created: function(){
  	 console.log("init");
  	 this.$store.dispatch("RESET_PLUGIN_DATA","math");
  	 //Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
       }, 
       mounted: function(){
  	 var index = 0;
  	 var doc_id = node+"-"+index;
  	 var content = this.root.innerHTML.trim();
  	 console.log("R",this.root,content);
  	 //res.container.setAttribute("id","category-math-container-"+doc_id);
  	 //var rendered_content = (new XMLSerializer()).serializeToString(res.container);

  	 
  	 // Put this doc ID in the index for each var and symbol in the document
  	 for(var i = 0; i < this.docs[node][index].length; i++) {
  	     var v = this.docs[node][index][i];
  	     if (!this.index[v]) this.index[v] = [];
  	     if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);
  	 }

  	 // Calculate the snippet that will be associated with this expression when it appears in listings
  	 var snippet = "";
  	 if(this.root.previousSibling){
  	     snippet += this.root.previousSibling.textContent.split(" ").slice(-4).join(" ");
  	 }
  	 snippet += " [formula] ";

  	 if(this.root.nextSibling) {
  	     snippet += this.root.nextSibling.textContent.split(" ").slice(0,4).join(" ");
  	 }
  	 snippet = "..." + snippet + "...";
  	 console.log("parprev",this.root.parentNode.previousSibling);
  	 console.log("parnext",this.root.parentNode.nextSibling);
  	 this.snippets[doc_id] = snippet;

  	 // Finally, set up component attributes
  	 this.syms = this.docs[node][index];
  	 this.rendered = rendered_content;
  	 this.display_syms = false;
  	 this.id = doc_id;
  	 this.query = "";
  	 this.node = node;
       }
   };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$9 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("span", { staticClass: "category-math-plugin" }, [
      _c("a", { attrs: { name: "category-math-plugin-link-" + _vm.id } }),
      _c("div", {
        staticClass: "category-math-plugin-math",
        attrs: { id: "category-math-plugin-expr-" + _vm.id },
        domProps: { innerHTML: _vm._s(_vm.rendered) },
        on: {
          click: function($event) {
            _vm.display_syms = !_vm.display_syms;
          }
        }
      }),
      _vm.display_syms
        ? _c(
            "div",
            {
              staticClass: "category-math-plugin-vars",
              style: _vm.get_pos(_vm.id)
            },
            [
              _c(
                "a",
                {
                  attrs: { href: "#" },
                  on: {
                    click: function($event) {
                      _vm.display_syms = false;
                      _vm.query = "";
                    }
                  }
                },
                [_vm._v("[x]")]
              ),
              _vm._v("\n\t    Vars:\n\t    "),
              _c(
                "ul",
                _vm._l(_vm.syms, function(e) {
                  return _c("li", [
                    _c(
                      "a",
                      {
                        attrs: { href: "#" },
                        on: {
                          click: function($event) {
                            _vm.query = e;
                          }
                        }
                      },
                      [_vm._v(_vm._s(e))]
                    )
                  ])
                }),
                0
              ),
              _vm.display_syms && _vm.query != ""
                ? _c("div", { staticClass: "category-math-plugin-refs" }, [
                    _vm._v("\n\t\tUses:\n\t\t"),
                    _c(
                      "ul",
                      _vm._l(_vm.master.index[_vm.query], function(x) {
                        return _c("li", [
                          _c(
                            "a",
                            {
                              attrs: { href: "#category-math-plugin-link-" + x }
                            },
                            [_vm._v(_vm._s(_vm.master.snippets[x]))]
                          )
                        ])
                      }),
                      0
                    )
                  ])
                : _vm._e()
            ]
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

    /* style */
    const __vue_inject_styles__$9 = function (inject) {
      if (!inject) return
      inject("data-v-368015e5_0", { source: "\n.category-math-plugin-math[data-v-368015e5] {\n    cursor:pointer;\n    display:inline-block;\n}\n.category-math-plugin-vars[data-v-368015e5] {\n    background-color: #dd5;\n    padding:1ex;\n    border: 1px solid black;\n    z-index:1;\n}\n.category-math-plugin-refs[data-v-368015e5] {\n    background-color: #ff5;\n    padding:2ex 1ex;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/plugins/math.vue"],"names":[],"mappings":";AA6FA;IACA,cAAA;IACA,oBAAA;AACA;AAEA;IACA,sBAAA;IACA,WAAA;IACA,uBAAA;IACA,SAAA;AACA;AAEA;IACA,sBAAA;IACA,eAAA;AACA","file":"math.vue","sourcesContent":["<template>\n    <span class=\"category-math-plugin\">\n\t<a v-bind:name=\"'category-math-plugin-link-'+id\"></a>\n\t<div v-bind:id=\"'category-math-plugin-expr-'+id\" class=\"category-math-plugin-math\" v-on:click=\"display_syms = !display_syms\" v-html=\"rendered\"></div>\n\t<div class=\"category-math-plugin-vars\" v-bind:style=\"get_pos(id)\" v-if=\"display_syms\">\n\t    <a href=\"#\" v-on:click=\"display_syms = false; query = ''\">[x]</a>\n\t    Vars:\n\t    <ul>\n\t\t<li v-for=\"e in syms\">\n\t\t    <a href=\"#\" v-on:click=\"query = e\">{{e}}</a>\n\t\t</li>\n\t    </ul>\n\t    <div class=\"category-math-plugin-refs\" v-if=\"display_syms && query != ''\">\n\t\tUses:\n\t\t<ul>\n\t\t    <li v-for=\"x in master.index[query]\">\n\t\t\t<a v-bind:href=\"'#category-math-plugin-link-'+x\">{{master.snippets[x]}}</a>\n\t\t    </li>\n\t\t</ul>\n\t    </div>\n\t</div>\n    </span>\n</template>\n<script>\n export default {\n     name: 'cat-math',\n     props: ['root'],\n     data () {\n\t return {\n\t     id: '',\n\t     rendered: '',\n\t     player: null\n\t };\n     },\n     methods: {\n\t get_pos: function() {\n\t     var el = document.getElementById(\"category-math-plugin-expr-\"+this.id);\n\t     var top = el.getBoundingClientRect().y;\n\t     return {'position':'absolute','left':'-25%','top':top+'px','width':'25%'};\n\t }\n     },\n     created: function(){\n\t console.log(\"init\");\n\t this.$store.dispatch(\"RESET_PLUGIN_DATA\",\"math\");\n\t //Guppy.init({\"path\":\"/node_modules/guppy-js\",\"symbols\":\"/node_modules/guppy-js/sym/symbols.json\"});\n     }, \n     mounted: function(){\n\t var index = 0;\n\t var doc_id = node+\"-\"+index;\n\t var content = this.root.innerHTML.trim()\n\t console.log(\"R\",this.root,content);\n\t //var res = Guppy.Doc.render(content, \"text\");\n\t var res = {doc:content};\n\t var doc_data = {};\n\t //doc_data[index] = res.doc.get_vars().concat(res.doc.get_symbols());\n\t doc_data[index] = [\"x\"];\n\t //res.container.setAttribute(\"id\",\"category-math-container-\"+doc_id);\n\t //var rendered_content = (new XMLSerializer()).serializeToString(res.container);\n\n\t \n\t // Put this doc ID in the index for each var and symbol in the document\n\t for(var i = 0; i < this.docs[node][index].length; i++) {\n\t     var v = this.docs[node][index][i];\n\t     if (!this.index[v]) this.index[v] = [];\n\t     if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);\n\t }\n\n\t // Calculate the snippet that will be associated with this expression when it appears in listings\n\t var snippet = \"\";\n\t if(this.root.previousSibling){\n\t     snippet += this.root.previousSibling.textContent.split(\" \").slice(-4).join(\" \");\n\t }\n\t snippet += \" [formula] \"\n\n\t if(this.root.nextSibling) {\n\t     snippet += this.root.nextSibling.textContent.split(\" \").slice(0,4).join(\" \");\n\t }\n\t snippet = \"...\" + snippet + \"...\";\n\t console.log(\"parprev\",this.root.parentNode.previousSibling);\n\t console.log(\"parnext\",this.root.parentNode.nextSibling);\n\t this.snippets[doc_id] = snippet;\n\n\t // Finally, set up component attributes\n\t this.syms = this.docs[node][index];\n\t this.rendered = rendered_content;\n\t this.display_syms = false;\n\t this.id = doc_id;\n\t this.query = \"\";\n\t this.node = node;\n     }\n }\n</script>\n<style scoped>\n .category-math-plugin-math {\n     cursor:pointer;\n     display:inline-block;\n }\n\n .category-math-plugin-vars {\n     background-color: #dd5;\n     padding:1ex;\n     border: 1px solid black;\n     z-index:1;\n }\n\n .category-math-plugin-refs {\n     background-color: #ff5;\n     padding:2ex 1ex;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$9 = "data-v-368015e5";
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject SSR */
    

    
    normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$8,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      browser,
      undefined
    );

  //
  //
  //

   var script$9 = {
       name: 'cat-link',
       props: ['root'],
       data () {
  	 return {
  	     target: '',
  	     name: ''
  	 };
       },
       mounted: function(){
  	 var doc = this.root.innerHTML.trim();
  	 var idx = doc.indexOf(":");
  	 this.target = doc.substring(0,idx);
  	 this.name = doc.substring(idx+1);
       }
   };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("router-link", { attrs: { to: "./" + _vm.target } }, [
      _vm._v(_vm._s(_vm.name))
    ])
  };
  var __vue_staticRenderFns__$a = [];
  __vue_render__$a._withStripped = true;

    /* style */
    const __vue_inject_styles__$a = undefined;
    /* scoped */
    const __vue_scope_id__$a = undefined;
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var LinkPlugin = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$9,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      undefined,
      undefined
    );

  //
   
   var script$a = {
       name: 'cat-query',
       props: ['root'],
       
       // Need to have access to all the nodes in order to search them
       computed: {
  	 ...Vuex.mapState(['nodes']),
  	 ...Vuex.mapGetters(['sorted'])
       },
       data () {
  	 return {
  	     result: []
  	 };
       },
       mounted: function(){
  	 var query_text = this.root.innerHTML.trim();
  	 var q = Vue.category_query.parse(query_text);
  	 var query_result = Vue.category_search(q, this.nodes);
  	 this.result = this.$store.getters.sorted(query_result);
       }
   };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$b = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "ul",
      { staticClass: "category-query-plugin-result" },
      _vm._l(_vm.result, function(node) {
        return _c(
          "li",
          [
            _c("router-link", { attrs: { to: "./" + node } }, [
              _vm._v(_vm._s(_vm.nodes[node].name))
            ])
          ],
          1
        )
      }),
      0
    )
  };
  var __vue_staticRenderFns__$b = [];
  __vue_render__$b._withStripped = true;

    /* style */
    const __vue_inject_styles__$b = undefined;
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var QueryPlugin = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$a,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

   var script$b = {
       name: 'cat-slideshow',
       props: ['root'],
       data() {
  	 return {
  	     current_index: 0,
  	     lock_index: 0,
  	     init_index: 0,
  	     all: false,
  	     slides: [],
  	 };
       },
       mounted: function() {
  	 var doc = this.root;
  	 var elements = [];

  	 // Iterate through li nodes and extract these as the slides
  	 for(var n = doc.firstChild.firstChild; n != null; n = n.nextSibling){
  	     if(n.nodeName.toLowerCase() == "li") elements.push(n.innerHTML);
  	 }
  	 
  	 this.slides = elements;
       },
       methods: {
  	 tmp_set_index: function(idx){
  	     this.current_index = idx;
  	 },
  	 reset_index: function(){
  	     this.current_index = this.lock_index;
  	 },
  	 set_index: function(idx){
  	     this.all = false;
  	     this.lock_index = idx;
  	     this.current_index = idx;
  	 }
       }
   };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$c = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "category-slideshow" },
      [
        _vm._l(_vm.slides, function(s, index) {
          return _c(
            "span",
            {
              class:
                _vm.current_index == index && !_vm.all
                  ? "category-slideshow-button category-slideshow-button-current"
                  : "category-slideshow-button category-slideshow-button-other",
              on: {
                mouseover: function($event) {
                  return _vm.tmp_set_index(index)
                },
                mouseout: function($event) {
                  return _vm.reset_index()
                },
                click: function($event) {
                  return _vm.set_index(index)
                }
              }
            },
            [_vm._v("\n\t    " + _vm._s(index) + "\n\t")]
          )
        }),
        _c(
          "span",
          {
            class: _vm.all
              ? "category-slideshow-button category-slideshow-button-current"
              : "category-slideshow-button category-slideshow-button-other",
            on: {
              click: function($event) {
                _vm.all = !_vm.all;
              }
            }
          },
          [_vm._v("\n\t    all\n\t")]
        ),
        !_vm.all
          ? _c("div", {
              staticClass: "category-slideshow-slide",
              domProps: { innerHTML: _vm._s(_vm.slides[_vm.current_index]) }
            })
          : _vm._e(),
        _vm._l(_vm.slides, function(s, index) {
          return _vm.all
            ? _c("div", {
                staticClass: "category-slideshow-slide",
                domProps: { innerHTML: _vm._s(s) }
              })
            : _vm._e()
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$c = [];
  __vue_render__$c._withStripped = true;

    /* style */
    const __vue_inject_styles__$c = function (inject) {
      if (!inject) return
      inject("data-v-46ec8c84_0", { source: "\n.category-slideshow[data-v-46ec8c84] {\n    text-align:center;\n    width:100%;\n    overflow-x:scroll;\n}\n.category-slideshow-slide[data-v-46ec8c84] img {\n    max-width: 100% !important;\n}\n.category-slideshow-slide[data-v-46ec8c84] {\n    text-align:center;\n}\n.category-slideshow-caption[data-v-46ec8c84] {\n    text-align:center;\n    margin:auto;\n    width:80%;\n}\n.category-slideshow-button[data-v-46ec8c84] {\n    width:2em;\n    display:inline-block;\n    height:2em;\n    border:2px solid black;\n    text-align:center;\n    cursor:pointer;\n    margin:.5ex 0;\n}\n.category-slideshow-button-other[data-v-46ec8c84] {\n    background-color:#ccc;\n}\n.category-slideshow-button-current[data-v-46ec8c84] {\n    background-color:#8cf;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/plugins/slideshow.vue"],"names":[],"mappings":";AAuDA;IACA,iBAAA;IACA,UAAA;IACA,iBAAA;AACA;AAEA;IACA,0BAAA;AACA;AAEA;IACA,iBAAA;AACA;AAEA;IACA,iBAAA;IACA,WAAA;IACA,SAAA;AACA;AAEA;IACA,SAAA;IACA,oBAAA;IACA,UAAA;IACA,sBAAA;IACA,iBAAA;IACA,cAAA;IACA,aAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,qBAAA;AACA","file":"slideshow.vue","sourcesContent":["<template>\n    <div class=\"category-slideshow\">\n\t<span :class=\"current_index == index && !all ? 'category-slideshow-button category-slideshow-button-current' : 'category-slideshow-button category-slideshow-button-other'\" v-for=\"(s,index) in slides\" v-on:mouseover=\"tmp_set_index(index)\" v-on:mouseout=\"reset_index()\" v-on:click=\"set_index(index)\">\n\t    {{index}}\n\t</span>\n\t<span :class=\"all ? 'category-slideshow-button category-slideshow-button-current' : 'category-slideshow-button category-slideshow-button-other'\" v-on:click=\"all=!all\">\n\t    all\n\t</span>\n\t<div class=\"category-slideshow-slide\" v-html=\"slides[current_index]\" v-if=\"!all\">\n\t</div>\n\t<div class=\"category-slideshow-slide\" v-for=\"(s,index) in slides\" v-if=\"all\" v-html=\"s\">\n\t</div>\n    </div>\n</template>\n<script>\n export default {\n     name: 'cat-slideshow',\n     props: ['root'],\n     data() {\n\t return {\n\t     current_index: 0,\n\t     lock_index: 0,\n\t     init_index: 0,\n\t     all: false,\n\t     slides: [],\n\t };\n     },\n     mounted: function() {\n\t var doc = this.root;\n\t var elements = [];\n\n\t // Iterate through li nodes and extract these as the slides\n\t for(var n = doc.firstChild.firstChild; n != null; n = n.nextSibling){\n\t     if(n.nodeName.toLowerCase() == \"li\") elements.push(n.innerHTML);\n\t }\n\t \n\t this.slides = elements;\n     },\n     methods: {\n\t tmp_set_index: function(idx){\n\t     this.current_index = idx;\n\t },\n\t reset_index: function(){\n\t     this.current_index = this.lock_index;\n\t },\n\t set_index: function(idx){\n\t     this.all = false;\n\t     this.lock_index = idx;\n\t     this.current_index = idx;\n\t }\n     }\n }\n</script>\n\n<style scoped>\n .category-slideshow {\n     text-align:center;\n     width:100%;\n     overflow-x:scroll;\n }\n\n .category-slideshow-slide >>> img {\n     max-width: 100% !important;\n }\n \n .category-slideshow-slide {\n     text-align:center;\n }\n\n .category-slideshow-caption {\n     text-align:center;\n     margin:auto;\n     width:80%;\n }\n\n .category-slideshow-button {\n     width:2em;\n     display:inline-block;\n     height:2em;\n     border:2px solid black;\n     text-align:center;\n     cursor:pointer;\n     margin:.5ex 0;\n }\n\n .category-slideshow-button-other {\n     background-color:#ccc;\n }\n\n .category-slideshow-button-current {\n     background-color:#8cf;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$c = "data-v-46ec8c84";
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject SSR */
    

    
    var SlideshowPlugin = normalizeComponent_1(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$b,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      browser,
      undefined
    );

  //
   var script$c = {
       name: 'cat-jsavr',
       props: ['root','program','text','control','size','lightboard_feature','reset_feature','simid','debug_mode_feature'],
       data () {
  	 return {
  	     id: '',
  	     rendered: '',
  	     debug_log: this.do_nothing,
  	     status: "Ready",
  	     running: false,
  	     outputs: [],
  	     io_state: {'switch_state':["OFF","OFF","OFF","OFF","OFF","OFF","OFF","OFF"]},
  	     steps: {'count':1},
  	     output_type: {"selection":"program"},
  	     symbols: {},
  	     PM_display_mode: "t",
  	     RAM_display_mode: "d",
  	     RF_display_mode: "d",
  	     RAM: [],
  	     PM: [],
  	     RF: [],
  	     
  	     PIND: 0,
  	     PORTD: 0,
  	     DDRD: 0,
  	     SPH: 0,
  	     SPL: 0,
  	     
  	     RAM_size: 65536,
  	     PM_size: 65536,
  	     RF_size: 32,
  	     updated: [],
  	     error_line: 0,
  	     current_ram_data: [],
  	     display_pm_start: 0,
  	     display_ram_start: 0,
  	     display_pm_length: 16,
  	     display_ram_length: 16,
  	     directives: {
  		 "label":{"regex":/^([a-zA-Z_][a-zA-Z0-9_]*):$/,"process":function(args){
  		     return {"symbol":args[1],
  			     "symbol_type":"pm",
  		     };
  		 }},
  		 "word":{"regex":/^\.word ([0-9,]+)$/,"process":function(args){
  		     var rdata = args[1].split(",");
  		     for(var i = 0; i < rdata.length; i++){
  			 rdata[i] = this.truncate(parseInt(rdata[i]),16,false);
  		     }
  		     return {"symbol":args[1],
  			     "symbol_type":"pm",
  			     "pm_data":rdata
  		     };
  		 }},
  		 "byte_ram":{"regex":/^ *\.byte\(([a-zA-Z_][a-zA-Z0-9_]*)\) ([-0-9, ]+) *$/,"process":function(args){
  		     var rdata = args[2].split(",");
  		     for(var i = 0; i < rdata.length; i++){
  			 rdata[i] = this.truncate(parseInt(rdata[i].trim()),8,false);
  		     }
  		     return {"symbol":args[1],
  			     "symbol_type":"ram",
  			     "ram_data":rdata
  		     };
  		 }},
  		 "string_ram":{"regex":/^ *\.string\(([a-zA-Z_][a-zA-Z0-9_]*)\) "((?:[^"\\]|\\.)*)" *$/,"process":function(args){
  		     var str = this.handle_string_escapes(args[2]);
  		     var rdata = [];
  		     for(var i = 0; i < str.length; i++){
  			 rdata.push(this.truncate(str.charCodeAt(i),8,false));
  		     }
  		     rdata.push(0);
  		     return {"symbol":args[1],
  			     "symbol_type":"ram",
  			     "ram_data":rdata
  		     };
  		     
  		 }}
  	     },
  	     formats: {
  		 "4r8i":{
  		     "string":/ *r([0-9]+), *()(-?[a-zA-Z_0-9)(-]+|'..?') *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r + ","+i;},
  		     "binary":"CCCCIIIIRRRRIIII",
  		     "i_bits":8,
  		     "validator":function(c, r, s, i){return 16 <= r && r < 32 && -128 <= i && i < 256;}},
  		 "5r5s":{
  		     "string":/ *r([0-9]+), *r([0-9]+)() *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r + ",r"+s;},
  		     "binary":"CCCCCCSRRRRRSSSS",
  		     "validator":function(c, r, s, i){return 0 <= r && r < 32 && 0 <= s && s < 32;}},
  		 "6s5r":{
  		     "string":/ *r([0-9]+), *([0-9]+)() *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r + ","+s;},
  		     "binary":"CCCCCSSRRRRRSSSS",
  		     "validator":function(c, r, s, i){return 0 <= r && r < 32 && 0 <= s && s < 64;}},
  		 "5r6s":{
  		     "string":/ *([0-9]+), *r([0-9]+)() *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " " + r + ",r"+s;},
  		     "binary":"CCCCCSSRRRRRSSSS",
  		     "validator":function(c, r, s, i){return 0 <= r && r < 64 && 0 <= s && s < 32;}},
  		 "5r":{
  		     "string":/ *r([0-9]+)()() *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " r" + r;},
  		     "binary":"CCCCCCCRRRRRCCCC",
  		     "validator":function(c, r, s, i){return 0 <= r && r < 32;}},
  		 "5rX":{
  		     "string":/ *r([0-9]+)(), *(-[XYZ]|[XYZ]|[XYZ]\+) *$/,
  		     "to_string":function(mnemonic,c,r,s,i,x){return mnemonic + " r" + r + ","+i},
  		     "binary":"CCCXCCCRRRRRXXXX",
  		     "validator":function(c, r, s, i){return 0 <= r && r < 32;}},
  		 "X5r":{
  		     "string":/ *(-[XYZ]|[XYZ]|[XYZ]\+), *r([0-9]+)() *$/,
  		     "to_string":function(mnemonic,c,r,s,i,x){return mnemonic + " " + r + ",r"+s;},
  		     "binary":"CCCXCCCRRRRRXXXX",
  		     "validator":function(c, r, s, i){return 0 <= s && s < 32;}},
  		 "12i":{
  		     "string":/ *()()(-?[a-zA-Z_0-9)(]+) *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " " + i;},
  		     "binary":"CCCCIIIIIIIIIIII",
  		     "i_bits":12,
  		     "validator":function(c, r, s, i){return -2048 <= i && i < 2048;}},
  		 "7i":{
  		     "string":/ *()()(-?[a-zA-Z_0-9)(]+) *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic + " " + i;},
  		     "binary":"CCCCCCIIIIIIICCC",
  		     "i_bits":7,
  		     "validator":function(c, r, s, i){return -64 <= i && i < 64;}},
  		 "n":{
  		     "string":/ *()()() *$/,
  		     "to_string":function(mnemonic,c,r,s,i){return mnemonic;},
  		     "binary":"CCCCCCCCCCCCCCCC",
  		     "validator":function(c, r, s, i){return true;}}
  	     },
  	     instructions: {
  		 "ldi":{"format":"4r8i", "c": 14, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     console.log('T',emu);
  		     emu.RF[r] = emu.truncate(i,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "mov":{"format":"5r5s", "c": 11, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.RF[r] = emu.RF[s];
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "add":{"format":"5r5s", "c": 3, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] + emu.RF[s], true, true, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] + emu.RF[s],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "adc":{"format":"5r5s", "c": 7, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     var oldC = emu.C;
  		     emu.update_sreg(emu.RF[r] + emu.RF[s] + oldC, true, true, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] + emu.RF[s] + oldC,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "sbc":{"format":"5r5s", "c": 2, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     var oldC = emu.C;
  		     emu.update_sreg(emu.RF[r] - emu.RF[s] - oldC, true, true, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] - emu.RF[s] - oldC,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "sub":{"format":"5r5s", "c": 6, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] - emu.RF[s], true, true, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] - emu.RF[s],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "cp":{"format":"5r5s", "c": 5, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] - emu.RF[s], true, true, true);
  		     emu.C = emu.truncate(emu.RF[r],8,true) < emu.truncate(emu.RF[s],8,true) ? 1 : 0; // HACK TO MATCH PRESENTATION
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC", "Z", "C", "N"];}},
  		 "and":{"format":"5r5s", "c": 8, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] & emu.RF[s], true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] & emu.RF[s],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "or":{"format":"5r5s", "c": 10, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] | emu.RF[s], true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] | emu.RF[s],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "eor":{"format":"5r5s", "c": 9, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] ^ emu.RF[s], true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] ^ emu.RF[s],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r, "PC", "Z", "C", "N"];}},
  		 "cpi":{"format":"4r8i", "c": 3, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] - i, true, true, true);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC","Z","C","N"];}},
  		 "subi":{"format":"4r8i", "c": 5, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] - i, true, true, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] - i,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC","Z","C","N"];}},
  		 "andi":{"format":"4r8i", "c": 7, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] & i, true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] & i,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC","Z","C","N"];}},
  		 "ori":{"format":"4r8i", "c": 6, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] | i, true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] | i,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC","Z","C","N"];}},
  		 "dec":{"format":"5r", "c": 1194, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] - 1, true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] - 1,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "inc":{"format":"5r", "c": 1187, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(emu.RF[r] + 1, true, false, true);
  		     emu.RF[r] = emu.truncate(emu.RF[r] + 1,8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "neg":{"format":"5r", "c": 1185, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(-emu.RF[r], true, true, true);
  		     emu.RF[r] = emu.truncate(-emu.RF[r],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "com":{"format":"5r", "c": 1184, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.update_sreg(~(emu.RF[r]), true, false, true);
  		     emu.RF[r] = emu.truncate(~(emu.RF[r]),8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "ld":{"format":"5rX", "c": 32, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     var reg = 0;
  		     if(i == "X" || i == "-X" || i == "X+") reg = 26;
  		     if(i == "Y" || i == "-Y" || i == "Y+") reg = 28;
  		     if(i == "Z" || i == "-Z" || i == "Z+") reg = 30;
  		     if(i[0] == "-"){
  			 emu.updated.push(reg);
  			 emu.dec_ptr(reg);
  		     }
  		     var ptr = emu.truncate(emu.RF[reg],8,false)+256*emu.truncate(emu.RF[reg+1],8,false);
  		     emu.updated = [r,"PC"];
  		     emu.RF[r] = emu.truncate(emu.RAM[ptr],8,false);
  		     if(i[1] == "+"){
  			 emu.updated.push(reg);
  			 emu.inc_ptr(reg);
  		     }
  		     emu.ram_updated = [];
  		     emu.PC++;}},
  		 "st":{"format":"X5r", "c": 33, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     i = r;
  		     r = s;
  		     var reg = 0;
  		     if(i == "X" || i == "-X" || i == "X+") reg = 26;
  		     if(i == "Y" || i == "-Y" || i == "Y+") reg = 28;
  		     if(i == "Z" || i == "-Z" || i == "Z+") reg = 30;
  		     if(i[0] == "-"){
  			 emu.updated.push(reg);
  			 emu.dec_ptr(reg);
  		     }
  		     var ptr = emu.truncate(emu.RF[reg],8,false)+256*emu.truncate(emu.RF[reg+1],8,false);
  		     emu.updated = ["PC"];
  		     emu.ram_updated = [ptr];
  		     emu.RAM[ptr] = emu.RF[r];
  		     emu.PC++;
  		     if(i[1] == "+"){
  			 emu.updated.push(reg);
  			 emu.inc_ptr(reg);
  		     }
  		 }},
  		 "rjmp":{"format":"12i", "c": 12, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC = emu.truncate(emu.PC + i + 1,16,false);
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "breq":{"format":"7i", "c": 481, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC = emu.truncate(emu.PC + 1 + (emu.Z == 1 ? (i <= 64 ? i : i-128) : 0),16,false);
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "brne":{"format":"7i", "c": 489, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC = emu.truncate(emu.PC + 1 + (emu.Z == 0 ? (i <= 64 ? i : i-128) : 0),16,false);
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "brsh":{"format":"7i", "c": 488, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC = emu.truncate(emu.PC + 1 + (emu.C == 0 ? (i <= 64 ? i : i-128) : 0),16,false);
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "brlo":{"format":"7i", "c": 480, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC = emu.truncate(emu.PC + 1 + (emu.C == 1 ? (i <= 64 ? i : i-128) : 0),16,false);
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "in":{"format":"6s5r", "c": 22, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.RF[r] = emu.truncate(emu.read_IO(s),8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "out":{"format":"5r6s", "c": 23, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     i = s;
  		     s = r;
  		     r = i;
  		     emu.write_IO(s,emu.RF[r]);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "asr":{"format":"5r", "c": 1189, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     var C = emu.RF[r]%2 == 0 ? 0 : 1;
  		     emu.RF[r] = emu.truncate(emu.truncate(emu.RF[r],8,true) >> 1,8,false);
  		     emu.update_sreg(emu.RF[r], true, false, true);
  		     emu.C = C;
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = [r,"PC"];}},
  		 "push":{"format":"5r", "c": 1183, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     var SP = emu.SPH * 256 + emu.SPL;
  		     emu.RAM[SP] = emu.RF[r];
  		     emu.decSP();
  		     emu.PC++;
  		     emu.updated = ["PC","SPH","SPL"];
  		     emu.ram_updated = [SP];}},
  		 "pop":{"format":"5r", "c": 1167, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.incSP();
  		     var SP = emu.SPH * 256 + emu.SPL;
  		     emu.RF[r] = emu.truncate(emu.RAM[SP],8,false);
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC","SPH","SPL"];}},
  		 "rcall":{"format":"12i", "c": 13, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC++;
  		     var PCL = emu.PC % 256;
  		     var PCH = Math.floor(emu.PC / 256);
  		     var SP = emu.SPH * 256 + emu.SPL;
  		     emu.RAM[SP] = PCH;
  		     emu.decSP();
  		     var SP = emu.SPH * 256 + emu.SPL;
  		     emu.RAM[SP] = PCL;
  		     emu.decSP();
  		     emu.PC = emu.truncate(emu.PC + i,16,false);
  		     emu.updated = ["PC","SPH","SPL"];
  		     emu.ram_updated = [SP];}},
  		 "ret":{"format":"n", "c": 38152, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.incSP();
  		     var SP = emu.SPH * 256 + emu.SPL;
  		     var PCL = emu.RAM[SP];
  		     emu.incSP();
  		     var SP = emu.SPH * 256 + emu.SPL;
  		     var PCH = emu.RAM[SP];
  		     emu.PC = PCL + 256*PCH;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC","SPH","SPL"];}},
  		 "nop":{"format":"n", "c": 0, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.PC++;
  		     emu.ram_updated = [];
  		     emu.updated = ["PC"];}},
  		 "halt":{"format":"n", "c": 1, "exec":function(c, r, s, i){
  		     var emu = this.parent;
  		     emu.end();}}
  	     }
  	 }
       },
       methods: {
  	 smul: function(str, num) {
  	     var acc = [];
  	     for (var i = 0; (1 << i) <= num; i++) {
  		 if ((1 << i) & num)
  		     acc.push(str);
  		 str += str;
  	     }
  	     return acc.join("");
  	 },
  	 do_nothing: function(a){},
  	 cm_setup: function(){
  	     var sim_textarea = document.getElementById("simavr"+this.simid+"_program_area");
  	     this.debug_log(this.simid,sim_textarea);
  	     if(sim_textarea == null) return;
  	     this.editor = CodeMirror.fromTextArea(sim_textarea, {
  		 lineNumbers: true,
  		 gutters: ["breakpoints", "CodeMirror-linenumbers"]
  	     });
  	     if(this.size){
  		 if(this.size == "auto"){
  		     this.editor.setSize(null, (this.program.split("\n").length + 2)*(this.editor.defaultTextHeight()) + 10);
  		 }
  		 else{
  		     this.editor.setSize(null, this.size);
  		 }
  	     }
  	     else{
  		 this.editor.setSize(null, "70%");
  	     }
  	     this.editor.setOption("extraKeys", {
  		 'Ctrl-Enter': function(cm) {
                       this.program_pm();
                       this.$apply();
  		 }
  	     });
  	     this.editor.setValue(this.program);
  	 },
  	 reset_program: function(){
  	     if(this.running) return;
  	     if(this.text){
  		 this.debug_log("Using text");
  		 this.program = this.text;
  	     }
  	     else if(this.original_program){
  		 this.program = this.original_program;
  	     }
  	     this.change_program(this.program);
  	 },
  	 reset: function(pm_reset){
  	     this.io_state.switch_state = ["OFF","OFF","OFF","OFF","OFF","OFF","OFF","OFF"];
  	     this.output_type.selection = "program";
  	     this.display_pm_start = 0;
  	     this.display_ram_start = 0;
  	     this.steps = {'count':1};
  	     this.PC = 0;
  	     this.Z = 0;
  	     this.C = 0;
  	     this.N = 0;
  	     this.PIND = 0;
  	     this.PORTD = 0;
  	     this.DDRD = 0;
  	     this.SPH = 0;
  	     this.SPL = 0;
  	     this.updated = [];
  	     this.ram_updated = [];
  	     this.outputs = [];
  	     this.mux = new this.output_mux();
  	     for(var i = 0; i < this.RF_size; i++) this.RF[i] = 0;
  	     for(var i = 0; i < this.RAM_size; i++) this.RAM[i] = 0;
  	     for(var i = 0; i < this.IORF_size; i++) this.IORF[i] = 0;
  	     var nop = this.parse("nop",0);
  	     if(pm_reset){ for(var i = 0; i < this.PM_size; i++){ nop.addr = i; this.PM[i] = nop; }}
  	     if(!pm_reset){ for(var i = 0; i < this.current_ram_data.length; i++) this.RAM[i+1024] = this.current_ram_data[i]; }
  	     if(this.editor) this.editor.removeLineClass(this.error_line, "background", "active_line");
  	 },
  	 change_program: function(prog){
  	     this.program = prog;
  	     if(this.editor) this.editor.setValue(prog);
  	 },
  	 display_ram: function(i){
  	     if(this.RAM_display_mode == "d"){
  		 return this.RAM[i];
  	     }
  	     else if(this.RAM_display_mode == "2"){
  		 return this.truncate(this.RAM[i],8,true);
  	     }
  	     else if(this.RAM_display_mode == "c"){
  		 return String.fromCharCode(this.RAM[i])
  	     }
  	 },
  	 display_rf: function(i){
  	     if(this.RF_display_mode == "d"){
  		 return this.truncate(this.RF[i],8,false);
  	     }
  	     if(this.RF_display_mode == "2"){
  		 return this.truncate(this.RF[i],8,true);
  	     }
  	     else if(this.RF_display_mode == "b"){
  		 var s = this.RF[i].toString(2);
  		 return smul("0",8-s.length)+s;
  	     }
  	     else if(this.RF_display_mode == "h"){
  		 var s = this.RF[i].toString(16);
  		 return "0x"+smul("0",2-s.length)+s;
  	     }
  	 },
  	 program_pm: function(){
  	     if(this.running) return;
  	     this.reset(true);
  	     this.running = true;
  	     this.program = this.editor.getValue();
  	     var pm_data = this.preparse(this.program);
  	     if(!pm_data){
  		 this.running = false;
  		 return;
  	     }
  	     var pm_addr = 0;
  	     for(var i = 0; i < pm_data.length; i++){
  		 var datum = pm_data[i];
  		 if(datum.inst){
  		     var inst = this.parse(datum.inst,pm_addr);
  		     if(!inst) continue;
  		     if(inst.error){
  			 this.error_on_line(datum.line, inst.error);
  			 return;
  		     }
  		     this.PM[pm_addr] = inst;
  		     pm_addr++;
  		 }
  		 else if(datum.word){
  		     var inst = this.decode(datum.word,pm_addr);
  		     if(inst.error){
  			 this.error_on_line(datum.line, inst.error);
  			 return;
  		     }
  		     this.PM[pm_addr] = inst;
  		     pm_addr++;
  		 }
  	     }
  	     this.status = "Ready";
  	 },
  	 error_on_line: function(linenum, err_msg){
  	     this.running = false;
  	     this.status = "Error on line " + linenum + ": " + err_msg;
  	     this.error_line = linenum;
  	     if(this.editor) this.editor.addLineClass(linenum, "background", "active_line");
  	 },
  	 preparse: function(){
  	     var lines = this.program.split("\n");
  	     var to_program = [];
  	     var pm_offset = 0;
  	     var ram_offset = 1024;
  	     for(var i = 0; i < lines.length; i++){
  		 var pieces = lines[i].match(/^((?:[^";]|';'|"(?:[^\\"]+|\\(?:\\\\)*[nt\\"])*")*)(;.*)?$/);
  		 this.debug_log("P",pieces);
  		 if(!pieces){
  		     this.error_on_line(i, "Invalid line: "+i);
  		     return;
  		 }
  		 if(!pieces[1]) continue;
  		 lines[i] = pieces[1].trim();
  		 var is_inst = true;
  		 for(var d in this.directives){
  		     var matches = lines[i].match(this.directives[d].regex);
  		     this.debug_log("D",lines[i],d,matches);
  		     if(matches){
  			 // process needs to return:
  			 // - What it inserts to PM (pm_data)
  			 // - What it inserts into RAM (ram_data)
  			 // - What symbol it wants to make (symbol)
  			 // - What kind of symbol it is (symbol_type == "pm" | "ram")
  			 // - Whether there was an error (error)
  			 
  			 var result = this.directives[d].process(matches);

  			 // Handle error
  			 if(result.error){
  			     this.error_on_line(i, result.error);
  			     return;
  			 }

  			 // Update symbol
  			 if(result.symbol && result.symbol_type){
  			     if(result.symbol_type == "pm"){
  				 this.symbols[result.symbol] = pm_offset;
  			     }
  			     else if(result.symbol_type == "ram"){
  				 this.symbols[result.symbol] = ram_offset;
  			     }
  			 }
  			 
  			 // Insert data and update offsets
  			 if(result.pm_data){
  			     for(var j = 0; j < result.pm_data.length; j++){
  				 to_program.push({'word':result.pm_data[j],'line':i});
  			     }
  			     pm_offset += result.pm_data.length;
  			 }
  			 if(result.ram_data){
  			     for(var j = 0; j < result.ram_data.length; j++){
  				 this.RAM[ram_offset + j] = result.ram_data[j];
  			     }
  			     this.current_ram_data = this.current_ram_data.concat(result.ram_data);
  			     ram_offset += result.ram_data.length;
  			 }
  			 is_inst = false;
  			 break;
  		     }
  		 }
  		 if(is_inst && !(/^[ \t]*$/.test(lines[i]))){
  		     to_program.push({'inst':lines[i],'line':i});
  		     pm_offset++;
  		 }
  	     }
  	     return to_program;
  	 },
  	 parse: function(inst,addr){
  	     this.debug_log(inst);
  	     var matches = inst.match(/^[ \t]*([a-zA-Z]+)[ \t]*((?:[^;]|';')*)[ \t]*$/);
  	     if(!matches){
  		 return {"error":"Line does not match any directive or instruction"};
  	     }
  	     var mnemonic = matches[1];
  	     var operand = matches[2];
  	     this.debug_log(mnemonic, "|||", operand);
  	     if(mnemonic in this.instructions){
  		 var format = this.instructions[mnemonic].format;
  		 var execf = this.instructions[mnemonic].exec;
  		 var ops = operand.match(this.formats[format].string);
  		 if(!ops){
  		     return {"error":"Operands to instruction " + inst + " did not parse"};
  		 }
  		 for(var i = 0; i < 3; i++){
  		     if(/^[0-9]+$/.test(ops[i])) ops[i] = parseInt(ops[i]);
  		     //else if(format.sym_valid[i]) ops[i] = symbols[ops[i]];
  		 }
  		 var opcode = this.instructions[mnemonic].c;
  		 this.debug_log(format, execf, ops, opcode);
  		 var data = {"r":ops[1],"s":ops[2],"i":ops[3],"c":opcode};
  		 var new_inst = new this.instruction(mnemonic + " " + operand, mnemonic, data, execf,addr, this);
  		 if(new_inst.error){
  		     return {"error":inst.error};
  		 }
  		 if(new_inst.check_valid()){
  		     return new_inst;
  		 }
  		 else{
  		     return {"error":"Illegal operands to instruction " + inst};
  		 }
  	     }
  	     else{
  		 return {"error":"Invalid instruction " + inst};
  	     }
  	 },
  	 is_updated: function(x){
  	     for(var i = 0; i < this.updated.length; i++){
  		 if(this.updated[i] == x) return true;
  	     }
  	     return false;
  	 },
  	 is_ram_updated: function(x){
  	     for(var i = 0; i < this.updated.length; i++){
  		 if(this.ram_updated[i] == x) return true;
  	     }
  	     return false;
  	 },
  	 handle_string_escapes: function(s){
  	     s = s.replace(/(([^\\]|)(\\\\)*)\\t/g,"$1\t");
  	     s = s.replace(/(([^\\]|)(\\\\)*)\\n/g,"$1\n");
  	     s = s.replace(/(([^\\]|)(\\\\)*)\\"/g,"$1\"");
  	     s = s.replace(/\\\\/g,"\\");
  	     return s;
  	 },

  	 // X,*:  111
  	 // Y,"": 010
  	 // Y,+-" 110
  	 // Z,"": 000
  	 // Z,+-: 100
  	 // "":  00
  	 // "+": 01
  	 // "-": 10
  	 encode_x: function(i){
  	     var x = 0;
  	     var ptr = i[0] == "-" ? i[1] : i[0];
  	     var mod = i[0] == "-" ? "-" : (i[1] == "+" ? "+" : "");
  	     if(ptr == "X") x = 7*4;
  	     if(ptr == "Y") x = 6*4;
  	     if(ptr == "Z") x = 4*4;
  	     if(ptr != "X" && mod == "") x -= 16;
  	     if(mod == "+") x += 1;
  	     if(mod == "-") x += 2;
  	     return x;
  	 },
  	 decode_x: function(x){
  	     var ptr = "";
  	     var mod = "";
  	     this.debug_log("XX",x,x&3,(x>>2)&3);
  	     if(((x >> 2)&3) == 3) ptr = "X";
  	     if(((x >> 2)&3) == 2) ptr = "Y";
  	     if(((x >> 2)&3) == 0) ptr = "Z";
  	     if((x&3) == 1) mod = "+";
  	     if((x&3) == 2) mod = "-";
  	     this.debug_log("X=",mod,ptr);
  	     return mod == "-" ? mod +""+ ptr : ptr +""+ mod;
  	 },
  	 encode: function(format, c, r, s, i){
  	     var fmt = this.formats[format].binary;
  	     var inst = 0;
  	     var x = 0;
  	     if(format == "5r6s"){
  		 i = s;
  		 s = r;
  		 r = i;
  	     }
  	     else if(format == "5rX" || format == "X5r"){
  		 if(format == "X5r"){
  		     i = r;
  		     r = s;
  		 }
  		 this.debug_log("Xe",i);
  		 x = this.encode_x(i);
  		 this.debug_log("Xd",x);
  	     }
  	     for(var j = 15; j >= 0; j--) {
  		 if(fmt[j] == "C"){
  		     inst += (c%2)<<(15-j);
  		     c >>= 1;
  		 }
  		 if(fmt[j] == "R"){
  		     inst += (r%2)<<(15-j);
  		     r >>= 1;
  		 }
  		 if(fmt[j] == "S"){
  		     inst += (s%2)<<(15-j);
  		     s >>= 1;
  		 }
  		 if(fmt[j] == "I"){
  		     inst += (i%2)<<(15-j);
  		     i >>= 1;
  		 }
  		 if(fmt[j] == "X"){
  		     inst += (x%2)<<(15-j);
  		     x >>= 1;
  		 }
  	     }
  	     return inst;
  	 },
  	 decode: function(x,addr){
  	     for(var f in this.formats){
  		 fmt = this.formats[f];
  		 var data = {"c":0,"r":0,"s":0,"i":0,"x":0};
  		 for(var j = 15; j >= 0; j--){
  		     //this.debug_log("J",j,fmt.binary[15-j],(x>>j)%2);
  		     if(fmt.binary[15-j] == "C") data.c = (data.c * 2) + ((x >> j) % 2);
  		     if(fmt.binary[15-j] == "R") data.r = (data.r * 2) + ((x >> j) % 2);
  		     if(fmt.binary[15-j] == "S") data.s = (data.s * 2) + ((x >> j) % 2);
  		     if(fmt.binary[15-j] == "I") data.i = (data.i * 2) + ((x >> j) % 2);
  		     if(fmt.binary[15-j] == "X") data.x = (data.x * 2) + ((x >> j) % 2);
  		 }
  		 if(f == "4r8i") data.r += 16;
  		 if(f == "12i") data.i = this.truncate(data.i,12,true);
  		 if(f == "7i") data.i = this.truncate(data.i,7,true);
  		 if(f == "5rX") data.i = this.decode_x(data.x);
  		 if(f == "X5r"){
  		     data.s = data.r;
  		     data.r = this.decode_x(data.x);
  		 }
  		 if(f == "5r6s"){
  		     var temp = data.r;
  		     data.r = data.s;
  		     data.s = temp;
  		 }
  		 for(var mnemonic in this.instructions){
  		     inst = this.instructions[mnemonic];
  		     if(inst.format == f && inst.c == data.c){
  			 return new this.instruction(x,mnemonic,data,inst.exec,addr,this);
  		     }
  		 }
  	     }
  	     return {"error":"Could not decode instruction: " + x};
  	 },
  	 label: function(name, addr){
  	     this.label = true;
  	     this.name = name;
  	     this.addr = addr;
  	 },
  	 output_mux: function(){
  	     this.SEL_ADDR = 0;
  	     this.SEL_LEN = 255;
  	     this.LCD_OUT = 1;
  	     this.LB_OUT = 2;
  	     this.target = 0;
  	     this.len = 0;
  	     this.state = 0;
  	     this.input = function(val){
  		 if(this.state == this.SEL_ADDR) {
  		     this.target = val;
  		     this.state = this.SEL_LEN;
  		 }
  		 else if(this.state == this.SEL_LEN){
  		     this.len = val;
  		     this.state = this.target;
  		     this.target = 0;
  		 }
  		 else if(this.len > 0){
  		     if(this.state-1 < this.output_devs.length)
  			 this.output_devs.input(val);
  		     this.len--;
  		 }
  		 else{
  		     this.state = this.SEL_ADDR;
  		 }
  	     };
  	 },
  	 lcd: function(){
  	     this.input = function(val){
  		 
  	     };
  	 },
  	 set_PM_display_mode: function(m){
  	     this.PM_display_mode = m;
  	 },
  	 set_RAM_display_mode: function(m){
  	     this.RAM_display_mode = m;
  	 },
  	 set_RF_display_mode: function(m){
  	     this.RF_display_mode = m;
  	 },
  	 instruction: function(text, mnemonic, data, exec, addr, parent){
  	     console.log(this);
  	     this.parent = parent;
  	     this.label = false;
  	     this.addr = addr;
  	     this.text = text;
  	     this.c = data.c;
  	     this.r = data.r;
  	     this.s = data.s;
  	     this.i = data.i;
  	     this.exec = exec;
  	     this.mnemonic = mnemonic;
  	     console.log(this.text, this.c, this.r, this.s, this.i, this.mnemonic);
  	     this.format = this.parent.instructions[this.mnemonic].format;
  	     if(this.i.match){
  		 var matches = this.i.match(/(lo|hi)8\(([a-zA-Z_][a-zA-Z0-9_]*)\)/);
  		 if(matches){
  		     if(matches[2] in this.parent.symbols){
  			 if(matches[1] == "lo") this.i = this.parent.truncate(this.parent.symbols[matches[2]],8,false);
  			 if(matches[1] == "hi") this.i = this.parent.truncate(this.parent.symbols[matches[2]]>>8,8,false);
  		     }
  		     else{
  			 this.error = "Symbol not found " + matches[2];
  		     }
  		 }
  		 else if(this.i in this.parent.symbols){
  		     this.i = this.parent.symbols[this.i];
  		     var fmt = this.parent.formats[this.format];
  		     //this.parent.debug_log(this.parent.symbols,fmt.i_bits);
  		     if(fmt.i_bits){
  			 this.i = this.parent.truncate(this.i - this.addr - 1,fmt.i_bits,true);
  		     }
  		 }
  		 else if(/'[^'\\]'/.test(this.i)){
  		     this.i = this.i.charCodeAt(1);
  		 }
  		 else if(this.i == "'\\''"){
  		     this.i = this.i.charCodeAt(2);
  		 }
  		 else if(this.i == "'\\\\'"){
  		     this.i = this.i.charCodeAt(2);
  		 }
  		 else if(this.i == "'\\n'"){
  		     this.i = 10;
  		 }
  		 else if(this.i == "'\\t'"){
  		     this.i = 9;
  		 }
  		 else if(/^[XYZ]$|^[XYZ]\+$|^-[XYZ]$/.test(this.i)){
  		     this.i = this.i;
  		 }
  		 else this.i = parseInt(this.i);
  	     }
  	     this.encoding = this.parent.encode(this.format, this.c, this.r, this.s, this.i < 0 ? this.parent.truncate(this.i,this.parent.formats[this.format].i_bits,false) : this.i);
  	     //this.debug_log(this.text, this.c, this.r, this.s, this.i, this.mnemonic);
  	     var self = this;
  	     this.display = function(){
  		 if(this.parent.PM_display_mode == "t"){
  		     return this.parent.formats[self.format].to_string(self.mnemonic,self.c,self.r,self.s,self.i);
  		 }
  		 else if(this.parent.PM_display_mode == "d"){
  		     return self.encoding;
  		 }
  		 else if(this.parent.PM_display_mode == "h"){
  		     var s = self.encoding.toString(16);
  		     return "0x"+this.parent.smul("0",4 - s.length)+s;
  		 }
  		 else if(this.parent.PM_display_mode == "b"){
  		     var s = self.encoding.toString(2);
  		     return this.parent.smul("0",16 - s.length) + s;
  		 }
  	     };
  	     this.check_valid = function(){
  		 return this.parent.formats[self.format].validator(self.c, self.r, self.s, self.i);
  	     };
  	     this.run = function(){
  		 self.exec(self.c, self.r, self.s, self.i);
  	     };
  	 },
  	 step: function(){
  	     if(!this.running) return;
  	     this.debug_log(this.steps.count);
  	     for(var k = 0; k < this.steps.count; k++){
  		 var i = this.PM[this.PC];
  		 this.debug_log("i",i);
  		 i.run();
  		 if(this.PC < this.display_pm_start || this.PC >= this.display_pm_start + this.display_pm_length){
  		     this.display_pm_start = Math.max(0, this.PC - this.display_ram_length/2);
  		 }
  		 if(this.ram_updated.length > 0){
  		     this.display_ram_start = Math.max(0, Math.min.apply(Math, this.ram_updated) - this.display_ram_length/2);
  		 }
  	     }
  	 },
  	 raise_error: function(s){
  	     this.status = "Error: " + s;
  	 },
  	 truncate: function(num, bits, twos_complement){
  	     var mod = 1<<bits;
  	     num = ((num % mod)+mod)%mod;
  	     return twos_complement ? (num >= 1<<(bits - 1) ? num - (1<<bits) : num) : num;
  	 },
  	 update_sreg: function(result, z, c, n){
  	     this.debug_log("SREG for",result);
  	     if(z) this.Z = this.truncate(result,8,false) == 0 ? 1 : 0;
  	     if(c) this.C = result >= 256 || result < 0 ? 1 : 0;
  	     if(n) this.N = this.truncate(result,8,true) <0 ? 1 : 0;
  	 },
  	 read_IO: function(s){
  	     if(s == 16) return this.PIND & (~(this.DDRD));
  	     else if(s == 17) return this.DDRD;
  	     else if(s == 61) return this.SPL;
  	     else if(s == 62) return this.SPH;
  	     return 0;
  	 },
  	 write_IO: function(s,val){
  	     if(s == 18){
  		 this.PORTD = this.DDRD & val;
  		 this.output();
  	     }
  	     else if(s == 17) this.DDRD = this.truncate(val,8,false);
  	     else if(s == 61) this.SPL = this.truncate(val,8,false);
  	     else if(s == 62) this.SPH = this.truncate(val,8,false);
  	     if(this.output_type.selection == "simple"){
  		 this.PIND = 0;
  		 for(var i = 0; i < 8; i++)
  		     this.PIND |= (this.io_state.switch_state[i] == "ON" ? 1 << i : 0);
  		 this.PIND &= ~this.DDRD;
  	     }
  	 },
  	 inc_ptr: function(reg){
  	     if(this.RF[reg] == -1 || this.RF[reg] == 255){
  		 this.RF[reg] = 0;
  		 this.RF[reg+1] = this.truncate(this.RF[reg+1]+1,8,false);
  	     }
  	     else this.RF[reg]++;
  	     if(this.RF[reg] == 128){
  		 this.RF[reg] = -128;
  	     }
  	 },
  	 dec_ptr: function(reg){
  	     this.RF[reg]--;
  	     if(this.RF[reg] == -1){
  		 this.RF[reg+1] = this.truncate(this.RF[reg+1]-1,8,false);
  	     }
  	     if(this.RF[reg] < -128){
  		 this.RF[reg] = 127;
  	     }
  	 },
  	 incSP: function(){
  	     this.SPL++;
  	     if(this.SPL == 256){
  		 this.SPL = 0;
  		 this.SPH = this.truncate(this.SPH+1,8,false);
  	     }
  	 },
  	 decSP: function(){
  	     this.SPL--;
  	     if(this.SPL == -1){
  		 this.SPL = 255;
  		 this.SPH = this.truncate(this.SPH-1,8,false);
  	     }
  	 },
  	 io_switch: function(i){
  	     if(this.io_state.switch_state[i] == "ON"){
  		 this.io_state.switch_state[i] = "OFF";
  		 this.PIND &= ~(1<<i);
  	     }
  	     else if(this.io_state.switch_state[i] == "OFF"){
  		 this.io_state.switch_state[i] = "ON";
  		 this.PIND |= 1<<i;
  	     }
  	     this.PIND = this.PIND & ~this.DDRD;
  	 },
  	 output: function(){
  	     var out_val = this.PORTD;
  	     this.outputs.push(out_val);
  	     //this.outputs.push(String.fromCharCode(out_val));
  	 },
  	 initialize: function(){
  	     this.reset_program();
  	     this.cm_setup();
  	 },
  	 end: function(){
  	     if(!this.running) return;
  	     this.running = false;
  	     setTimeout(this.cm_setup, 0);
  	 }

       },
       created: function(){
  	 console.log("init");
  	 this.$store.dispatch("RESET_PLUGIN_DATA","math");
  	 //Guppy.init({"path":"/node_modules/guppy-js","symbols":"/node_modules/guppy-js/sym/symbols.json"});
       }, 
       mounted: function(){
  	 console.log("Hello JSAVR");
  	 console.log(this.instructions);
  	 this.program = this.root.innerHTML.trim();
  	 this.reset(true);
  	 this.original_program = this.program;
  	 this.initialize();

  	 this.debug_log = this.debug_mode_feature == 'yes' ? console.log.bind(console) : this.do_nothing;
  	 if(this.control){
  	     this.control.set_program = function(new_prog){
  		 this.change_program(new_prog);
  	     };
  	     this.control.get_program = function(){
  		 if(this.editor) this.program = this.editor.getValue();
  		 return this.program;
  	     };
  	     this.control.get_PM = function(addr){
  		 return this.PM[addr].encoding;
  	     };
  	     this.control.get_RF = function(){
  		 return this.RF;
  	     };
  	     this.control.get_RAM = function(addr){
  		 return this.RAM[addr];
  	     };
  	     this.control.get_other = function(){
  		 return {
  		     "PC":this.PC,
  		     "Z":this.Z,
  		     "C":this.C,
  		     "N":this.N,
  		     "DDRD":this.DDRD,
  		     "PIND":this.PIND,
  		     "PORTD":this.PORTD,
  		     "SPL":this.SPL,
  		     "SPH":this.SPH
  		 }
  	     };
  	 }
  	 /* 
  	  * 	 
  	  * 	 var index = 0;
  	  * 	 var doc_id = node+"-"+index;
  	  * 	 var content = this.root.innerHTML.trim()
  	  * 	 console.log("R",this.root,content);
  	  * 	 //var res = Guppy.Doc.render(content, "text");
  	  * 	 var res = {doc:content};
  	  * 	 var doc_data = {};
  	  * 	 //doc_data[index] = res.doc.get_vars().concat(res.doc.get_symbols());
  	  * 	 doc_data[index] = ["x"];
  	  * 	 //res.container.setAttribute("id","category-math-container-"+doc_id);
  	  * 	 //var rendered_content = (new XMLSerializer()).serializeToString(res.container);
  	  * 
  	  * 	 
  	  * 	 // Put this doc ID in the index for each var and symbol in the document
  	  * 	 for(var i = 0; i < this.docs[node][index].length; i++) {
  	  * 	     var v = this.docs[node][index][i];
  	  * 	     if (!this.index[v]) this.index[v] = [];
  	  * 	     if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);
  	  * 	 }
  	  * 
  	  * 	 // Calculate the snippet that will be associated with this expression when it appears in listings
  	  * 	 var snippet = "";
  	  * 	 if(this.root.previousSibling){
  	  * 	     snippet += this.root.previousSibling.textContent.split(" ").slice(-4).join(" ");
  	  * 	 }
  	  * 	 snippet += " [formula] "
  	  * 
  	  * 	 if(this.root.nextSibling) {
  	  * 	     snippet += this.root.nextSibling.textContent.split(" ").slice(0,4).join(" ");
  	  * 	 }
  	  * 	 snippet = "..." + snippet + "...";
  	  * 	 console.log("parprev",this.root.parentNode.previousSibling);
  	  * 	 console.log("parnext",this.root.parentNode.nextSibling);
  	  * 	 this.snippets[doc_id] = snippet;
  	  * 
  	  * 	 // Finally, set up component attributes
  	  * 	 this.syms = this.docs[node][index];
  	  * 	 this.rendered = rendered_content;
  	  * 	 this.display_syms = false;
  	  * 	 this.id = doc_id;
  	  * 	 this.query = "";
  	  * 	 this.node = node;*/
       }
   };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$d = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "simavr" }, [
      !_vm.running
        ? _c("div", { staticClass: "simavr_programming" }, [
            _c("div", { staticClass: "simavr_controls" }, [
              _c(
                "div",
                {
                  class:
                    "simavr_button " +
                    (_vm.running == true
                      ? "simavr_disabled_button"
                      : "simavr_enabled_button"),
                  on: {
                    click: function($event) {
                      return _vm.program_pm()
                    }
                  }
                },
                [_vm._v("run")]
              ),
              _vm.reset_feature != "no"
                ? _c(
                    "div",
                    {
                      class:
                        "simavr_button " +
                        (_vm.running == true
                          ? "simavr_disabled_button"
                          : "simavr_enabled_button"),
                      on: {
                        click: function($event) {
                          return _vm.reset_program()
                        }
                      }
                    },
                    [_vm._v("reset")]
                  )
                : _vm._e(),
              _c("div", { staticClass: "simavr_status" }, [
                _vm._v("Status: " + _vm._s(_vm.status))
              ])
            ]),
            _c("br"),
            _c("form", [
              _c("textarea", {
                attrs: { id: "simavr" + _vm.simid + "_program_area" }
              })
            ]),
            _c("br")
          ])
        : _vm._e(),
      _vm.running
        ? _c("div", { staticClass: "simavr_output_container" }, [
            _c("div", { staticClass: "simavr_controls" }, [
              _c(
                "div",
                {
                  class:
                    "simavr_button " +
                    (_vm.running == false
                      ? "simavr_disabled_button"
                      : "simavr_enabled_button"),
                  on: {
                    click: function($event) {
                      return _vm.end()
                    }
                  }
                },
                [_vm._v("end")]
              ),
              _c(
                "div",
                {
                  staticStyle: { "margin-top": "10px", display: "inline-block" }
                },
                [
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.output_type.selection,
                          expression: "output_type.selection"
                        }
                      ],
                      attrs: { name: "output_select" },
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value;
                              return val
                            });
                          _vm.$set(
                            _vm.output_type,
                            "selection",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          );
                        }
                      }
                    },
                    [
                      _c("option", { attrs: { value: "program" } }, [
                        _vm._v("View Program")
                      ]),
                      _c("option", { attrs: { value: "simple" } }, [
                        _vm._v("View Simple I/O")
                      ])
                    ]
                  )
                ]
              )
            ]),
            _vm.output_type.selection == "program"
              ? _c("div", { staticClass: "simavr_output" }, [
                  _c("b", [_vm._v("Program: ")]),
                  _c("pre", [_vm._v(_vm._s(_vm.program))])
                ])
              : _vm._e(),
            _vm.output_type.selection == "simple"
              ? _c(
                  "div",
                  { staticClass: "simavr_output" },
                  [
                    _vm._v("\n\t\tOutput LCD: "),
                    _c("br"),
                    _vm._v("(Connected to pins 0-7 of D)"),
                    _c("br"),
                    _c("div", { staticClass: "simavr_io_num" }, [
                      _vm._v(
                        "\n\t\t    " +
                          _vm._s(_vm.truncate(_vm.PORTD, 8, false)) +
                          "\n\t\t"
                      )
                    ]),
                    _c("br"),
                    _c("br"),
                    _vm._v("\n\n\t\tToggle switches--click to toggle:"),
                    _c("br"),
                    _vm._v("(Connected to pins 0-7 of D): "),
                    _c("br"),
                    _vm._l([0, 1, 2, 3, 4, 5, 6, 7], function(i) {
                      return _c(
                        "div",
                        { staticStyle: { display: "inline-block" } },
                        [
                          _vm._v("\n\t\t    " + _vm._s(i) + ":\n\t\t    "),
                          _c(
                            "div",
                            {
                              class:
                                "simavr_io_switch " +
                                (_vm.io_state.switch_state[i] == "ON"
                                  ? "simavr_io_switch_on"
                                  : "simavr_io_switch_off"),
                              on: {
                                click: function($event) {
                                  return _vm.io_switch(i)
                                }
                              }
                            },
                            [
                              _vm._v(
                                "\n\t\t\t" +
                                  _vm._s(_vm.io_state.switch_state[i]) +
                                  "\n\t\t    "
                              )
                            ]
                          ),
                          _c("br"),
                          _c("br")
                        ]
                      )
                    })
                  ],
                  2
                )
              : _vm._e(),
            _vm.output_type.selection == "complex"
              ? _c("div", { staticClass: "simavr_output" }, [
                  _vm._v("\n\t\tPaceholder for full output panel\n\t    ")
                ])
              : _vm._e()
          ])
        : _vm._e(),
      _vm.running
        ? _c("div", { staticClass: "simavr_simulator" }, [
            _c("div", { staticClass: "simavr_controls" }, [
              _c(
                "div",
                {
                  class:
                    "simavr_button " +
                    (_vm.running == false
                      ? "simavr_disabled_button"
                      : "simavr_enabled_button"),
                  on: {
                    click: function($event) {
                      return _vm.reset(false)
                    }
                  }
                },
                [_vm._v("reset")]
              ),
              _c(
                "div",
                {
                  class:
                    "simavr_button " +
                    (_vm.running == false
                      ? "simavr_disabled_button"
                      : "simavr_enabled_button"),
                  on: {
                    click: function($event) {
                      return _vm.step()
                    }
                  }
                },
                [_vm._v("step")]
              ),
              _vm.running == true
                ? _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.steps.count,
                        expression: "steps.count"
                      }
                    ],
                    staticClass: "simavr_mem_start",
                    attrs: { type: "number" },
                    domProps: { value: _vm.steps.count },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.$set(_vm.steps, "count", $event.target.value);
                      }
                    }
                  })
                : _vm._e()
            ]),
            _c("br"),
            _c(
              "div",
              { attrs: { id: "simavr_pm" } },
              [
                _c("div", { staticClass: "simavr_title" }, [
                  _vm._v("PM at "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.display_pm_start,
                        expression: "display_pm_start"
                      }
                    ],
                    staticClass: "simavr_mem_start",
                    attrs: { type: "number" },
                    domProps: { value: _vm.display_pm_start },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.display_pm_start = $event.target.value;
                      }
                    }
                  })
                ]),
                _c("br"),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_PM_display_mode("t")
                      }
                    }
                  },
                  [_vm._v("[text]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_PM_display_mode("b")
                      }
                    }
                  },
                  [_vm._v("[bin]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_PM_display_mode("d")
                      }
                    }
                  },
                  [_vm._v("[dec]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_PM_display_mode("h")
                      }
                    }
                  },
                  [_vm._v("[hex]")]
                ),
                _vm._l(
                  _vm.PM.slice(
                    _vm.display_pm_start,
                    _vm.display_pm_start + _vm.display_pm_length
                  ),
                  function(i, idx) {
                    return _c("div", [
                      _c(
                        "div",
                        {
                          class:
                            "simavr_pm " +
                            (_vm.display_pm_start + idx == _vm.PC
                              ? "simavr_active"
                              : "simavr_normal")
                        },
                        [
                          _c("span", { staticClass: "simavr_label_long" }, [
                            _vm._v(_vm._s(_vm.display_pm_start + idx) + ": ")
                          ]),
                          _vm._v(
                            _vm._s(_vm.PM[_vm.display_pm_start + idx].display()) +
                              "\n\t\t    "
                          )
                        ]
                      ),
                      _c("br")
                    ])
                  }
                ),
                _c("br")
              ],
              2
            ),
            _c(
              "div",
              { attrs: { id: "simavr_rf" } },
              [
                _c("div", { staticClass: "simavr_title" }, [
                  _vm._v("Register file")
                ]),
                _c("br"),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RF_display_mode("b")
                      }
                    }
                  },
                  [_vm._v("[bin]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RF_display_mode("d")
                      }
                    }
                  },
                  [_vm._v("[dec]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RF_display_mode("2")
                      }
                    }
                  },
                  [_vm._v("[com]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RF_display_mode("h")
                      }
                    }
                  },
                  [_vm._v("[hex]")]
                ),
                _c("br"),
                _vm._l(_vm.RF, function(r, idx) {
                  return _c("span", [
                    _c(
                      "div",
                      {
                        class:
                          "simavr_reg " +
                          (_vm.is_updated(idx)
                            ? "simavr_updated"
                            : "simavr_normal")
                      },
                      [
                        _c("span", { staticClass: "simavr_label" }, [
                          _vm._v(_vm._s(idx) + ": ")
                        ]),
                        _vm._v(_vm._s(_vm.display_rf(idx)))
                      ]
                    ),
                    idx % 2 == 1 ? _c("br") : _vm._e()
                  ])
                }),
                _c("br")
              ],
              2
            ),
            _c(
              "div",
              { attrs: { id: "simavr_ram" } },
              [
                _c("div", { staticClass: "simavr_title" }, [
                  _vm._v("RAM at "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.display_ram_start,
                        expression: "display_ram_start"
                      }
                    ],
                    staticClass: "simavr_mem_start",
                    attrs: { type: "number" },
                    domProps: { value: _vm.display_ram_start },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.display_ram_start = $event.target.value;
                      }
                    }
                  })
                ]),
                _c("br"),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RAM_display_mode("d")
                      }
                    }
                  },
                  [_vm._v("[dec]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RAM_display_mode("2")
                      }
                    }
                  },
                  [_vm._v("[com]")]
                ),
                _c(
                  "div",
                  {
                    staticClass: "simavr_display_button",
                    on: {
                      click: function($event) {
                        return _vm.set_RAM_display_mode("c")
                      }
                    }
                  },
                  [_vm._v("[txt]")]
                ),
                _vm._l(
                  _vm.RAM.slice(
                    _vm.display_ram_start,
                    _vm.display_ram_start + _vm.display_ram_length
                  ),
                  function(i, idx) {
                    return _c("div", [
                      _c(
                        "div",
                        {
                          class:
                            "simavr_ram " +
                            (_vm.is_ram_updated(_vm.display_ram_start + idx)
                              ? "simavr_updated"
                              : "simavr_normal")
                        },
                        [
                          _c("span", { staticClass: "simavr_label_long" }, [
                            _vm._v(_vm._s(_vm.display_ram_start + idx) + ": ")
                          ]),
                          _vm._v(
                            _vm._s(_vm.display_ram(_vm.display_ram_start + idx)) +
                              "\n\t\t    "
                          )
                        ]
                      ),
                      _c("br")
                    ])
                  }
                ),
                _c("br")
              ],
              2
            ),
            _c("div", { attrs: { id: "simavr_other" } }, [
              _c("div", { staticClass: "simavr_title" }, [_vm._v("Other")]),
              _c("br"),
              _c(
                "div",
                {
                  staticClass: "simavr_display_button",
                  on: { click: function($event) {} }
                },
                [_vm._v(" ")]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class: {
                    simavr_reg: true,
                    simavr_updated: _vm.is_updated("PC"),
                    simavr_normal: !_vm.is_updated("PC")
                  }
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("PC: ")]),
                  _vm._v(_vm._s(_vm.PC))
                ]
              ),
              _c("br"),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("Z") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("Z: ")]),
                  _vm._v(_vm._s(_vm.Z))
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("C") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("C: ")]),
                  _vm._v(_vm._s(_vm.C))
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("N") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("N: ")]),
                  _vm._v(_vm._s(_vm.N))
                ]
              ),
              _c("br"),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated(26) || _vm.is_updated(27)
                      ? "simavr_updated"
                      : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("X: ")]),
                  _vm._v(
                    _vm._s(
                      _vm.truncate(_vm.RF[26], 8, false) +
                        256 * _vm.truncate(_vm.RF[27], 8, false)
                    )
                  )
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated(28) || _vm.is_updated(29)
                      ? "simavr_updated"
                      : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("Y: ")]),
                  _vm._v(
                    _vm._s(
                      _vm.truncate(_vm.RF[28], 8, false) +
                        256 * _vm.truncate(_vm.RF[29], 8, false)
                    )
                  )
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated(30) || _vm.is_updated(31)
                      ? "simavr_updated"
                      : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label" }, [_vm._v("Z: ")]),
                  _vm._v(
                    _vm._s(
                      _vm.truncate(_vm.RF[30], 8, false) +
                        256 * _vm.truncate(_vm.RF[31], 8, false)
                    )
                  )
                ]
              ),
              _c("br"),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("PIND") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label_long" }, [
                    _vm._v("PIND: ")
                  ]),
                  _vm._v(_vm._s(_vm.PIND))
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("DDRD") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label_long" }, [
                    _vm._v("DDRD: ")
                  ]),
                  _vm._v(_vm._s(_vm.DDRD))
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("PORTD") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label_long" }, [
                    _vm._v("PORTD: ")
                  ]),
                  _vm._v(_vm._s(_vm.PORTD))
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("SPL") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label_long" }, [
                    _vm._v("SPL: ")
                  ]),
                  _vm._v(_vm._s(_vm.SPL))
                ]
              ),
              _c("br"),
              _c(
                "div",
                {
                  class:
                    "simavr_reg " +
                    (_vm.is_updated("SPH") ? "simavr_updated" : "simavr_normal")
                },
                [
                  _c("span", { staticClass: "simavr_label_long" }, [
                    _vm._v("SPH: ")
                  ]),
                  _vm._v(_vm._s(_vm.SPH))
                ]
              )
            ])
          ])
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$d = [];
  __vue_render__$d._withStripped = true;

    /* style */
    const __vue_inject_styles__$d = function (inject) {
      if (!inject) return
      inject("data-v-01dd48c1_0", { source: "\n.simavr[data-v-01dd48c1]{\n    display:inline-block;\n    width:73em;\n    /* min-height:40em; */\n    font-size:10pt;\n}\n#simavr_rf[data-v-01dd48c1]{\n    float:left;\n    width:16em;\n    border:1px solid #aaa;\n    text-align:center;\n}\n#simavr_pm[data-v-01dd48c1]{\n    float:left;\n    width:13em;\n    border:1px solid #aaa;\n    text-align:center;\n}\n#simavr_ram[data-v-01dd48c1]{\n    float:left;\n    width:10em;\n    border:1px solid #aaa;\n    text-align:center;\n}\n#simavr_other[data-v-01dd48c1]{\n    float:left;\n    width:10em;\n    border:1px solid #aaa;\n    text-align:center;\n}\n.simavr_title[data-v-01dd48c1]{\n    width:100%;\n    text-align:center;\n    display:inline-block;\n    font-size:12pt;\n    margin:auto;\n    padding-bottom:5px;\n    line-height:2.5em;\n}\n.simavr_status[data-v-01dd48c1]{\n    display:inline-block;\n    padding:5px;\n    border-left:1px solid #aaa;\n    /* border-radius:5px; */\n    margin:5px;\n    width:45%;\n    font-size:9pt;\n    float:right;\n}\n.active_line[data-v-01dd48c1]{\n    background-color:#f66;\n}\n.simavr_label[data-v-01dd48c1]{\n    font-size:10pt;\n    color:#333;\n    display:inline-block;\n    width:2em;\n}\n.simavr_label_long[data-v-01dd48c1]{\n    font-size:10pt;\n    color:#333;\n    display:inline-block;\n    margin-right:0.5ex;\n    min-width:2em;\n}\n.simavr_reg[data-v-01dd48c1]{\n    text-align:left;\n    display:inline-block;\n    padding:4px;\n    /*margin:0 2px 2px 0;*/\n    width:7em;\n}\n.simavr_pm[data-v-01dd48c1]{\n    text-align:left;\n    display:inline-block;\n    padding:4px;\n    /*margin:0 2px 2px 0;*/\n    width:12em;\n}\n.simavr_mem_start[data-v-01dd48c1]{\n    padding:4px;\n    width:4em;\n    margin:4px;\n}\n.simavr_ram[data-v-01dd48c1]{\n    text-align:left;\n    display:inline-block;\n    padding:4px;\n    /*margin:0 2px 2px 0;*/\n    width:7em;\n}\n.simavr_controls[data-v-01dd48c1]{\n    display:inline-block;\n    width:90%;\n    height:50px;\n    border: 2px solid #ccc;\n    margin:auto;\n    margin-bottom:5px;\n}\n.simavr_programming[data-v-01dd48c1]{\n    display:inline-block;\n    float:left;\n    width:70%;\n}\n.simavr_output_container[data-v-01dd48c1]{\n    display:inline-block;\n    float:left;\n    width:25%;\n}\n.simavr_simulator[data-v-01dd48c1]{\n    display:inline-block;\n    float:left;\n    width:75%;\n}\n.simavr_output[data-v-01dd48c1]{\n    display:inline-block;\n    padding:5px;\n    width:90%;\n    border:1px solid #aaa;\n    overflow-x:scroll;\n    overflow-y:scroll;\n}\n.simavr_program[data-v-01dd48c1]{\n    width:90%;\n}\n.simavr_normal[data-v-01dd48c1]{\n    background-color:#c66;\n}\n.simavr_updated[data-v-01dd48c1]{\n    background-color:#6c6;\n}\n.simavr_active[data-v-01dd48c1]{\n    background-color:#cc6;\n}\n.simavr_display_button[data-v-01dd48c1]{\n    display:inline-block;\n    padding:2px;\n}\n.simavr_enabled_button[data-v-01dd48c1]{\n    background-color:#66a;\n}\n.simavr_disabled_button[data-v-01dd48c1]{\n    background-color:#aaa;\n}\n.simavr_display_button[data-v-01dd48c1]:hover{\n    display:inline-block;\n    cursor:pointer;\n    color:#f33;\n}\n.simavr_button[data-v-01dd48c1]{\n    display:inline-block;\n    padding:8px;\n    border-radius:5px;\n    height:25px;\n    color:white;\n    margin:5px;\n    cursor:pointer;\n}\n.simavr_button[data-v-01dd48c1]:hover{\n    display:inline-block;\n    cursor:pointer;\n    color:#f33;\n}\n.simavr_io_num[data-v-01dd48c1]{\n    width:3em;\n    border:3px solid black;\n    background-color:#363;\n    color:#ff4;\n    font-size:17pt;\n    padding:5px;\n}\n.simavr_io_switch[data-v-01dd48c1]{\n    display:inline-block;\n    width:3em;\n    border:3px solid black;\n    font-size:17pt;\n    padding:5px;\n    cursor:pointer;\n}\n.simavr_io_switch_on[data-v-01dd48c1]{\n    background-color:#3f3;\n}\n.simavr_io_switch_off[data-v-01dd48c1]{\n    background-color:#f33;\n}\n", map: {"version":3,"sources":["/home/zoom/suit/category/page/src/plugins/jsavr.vue"],"names":[],"mappings":";AA+sCA;IACA,oBAAA;IACA,UAAA;IACA,qBAAA;IACA,cAAA;AACA;AACA;IACA,UAAA;IACA,UAAA;IACA,qBAAA;IACA,iBAAA;AACA;AAEA;IACA,UAAA;IACA,UAAA;IACA,qBAAA;IACA,iBAAA;AACA;AAEA;IACA,UAAA;IACA,UAAA;IACA,qBAAA;IACA,iBAAA;AACA;AAEA;IACA,UAAA;IACA,UAAA;IACA,qBAAA;IACA,iBAAA;AACA;AAEA;IACA,UAAA;IACA,iBAAA;IACA,oBAAA;IACA,cAAA;IACA,WAAA;IACA,kBAAA;IACA,iBAAA;AACA;AAEA;IACA,oBAAA;IACA,WAAA;IACA,0BAAA;IACA,uBAAA;IACA,UAAA;IACA,SAAA;IACA,aAAA;IACA,WAAA;AACA;AAEA;IACA,qBAAA;AACA;AACA;IACA,cAAA;IACA,UAAA;IACA,oBAAA;IACA,SAAA;AACA;AACA;IACA,cAAA;IACA,UAAA;IACA,oBAAA;IACA,kBAAA;IACA,aAAA;AACA;AAEA;IACA,eAAA;IACA,oBAAA;IACA,WAAA;IACA,sBAAA;IACA,SAAA;AACA;AACA;IACA,eAAA;IACA,oBAAA;IACA,WAAA;IACA,sBAAA;IACA,UAAA;AACA;AAEA;IACA,WAAA;IACA,SAAA;IACA,UAAA;AACA;AAEA;IACA,eAAA;IACA,oBAAA;IACA,WAAA;IACA,sBAAA;IACA,SAAA;AACA;AAEA;IACA,oBAAA;IACA,SAAA;IACA,WAAA;IACA,sBAAA;IACA,WAAA;IACA,iBAAA;AACA;AAEA;IACA,oBAAA;IACA,UAAA;IACA,SAAA;AACA;AAEA;IACA,oBAAA;IACA,UAAA;IACA,SAAA;AACA;AAEA;IACA,oBAAA;IACA,UAAA;IACA,SAAA;AACA;AAEA;IACA,oBAAA;IACA,WAAA;IACA,SAAA;IACA,qBAAA;IACA,iBAAA;IACA,iBAAA;AACA;AAEA;IACA,SAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,oBAAA;IACA,WAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,oBAAA;IACA,cAAA;IACA,UAAA;AACA;AACA;IACA,oBAAA;IACA,WAAA;IACA,iBAAA;IACA,WAAA;IACA,WAAA;IACA,UAAA;IACA,cAAA;AACA;AAEA;IACA,oBAAA;IACA,cAAA;IACA,UAAA;AACA;AAEA;IACA,SAAA;IACA,sBAAA;IACA,qBAAA;IACA,UAAA;IACA,cAAA;IACA,WAAA;AACA;AAEA;IACA,oBAAA;IACA,SAAA;IACA,sBAAA;IACA,cAAA;IACA,WAAA;IACA,cAAA;AACA;AAEA;IACA,qBAAA;AACA;AAEA;IACA,qBAAA;AACA","file":"jsavr.vue","sourcesContent":["<template>\n    <div class=\"simavr\">\n\t<div class=\"simavr_programming\" v-if=\"!running\">\n\t    <div class=\"simavr_controls\">\n\t\t<div v-bind:class=\"'simavr_button ' + (running == true ? 'simavr_disabled_button' : 'simavr_enabled_button')\" v-on:click=\"program_pm()\">run</div>\n\t\t<div v-bind:class=\"'simavr_button ' + (running == true ? 'simavr_disabled_button' : 'simavr_enabled_button')\" v-on:click=\"reset_program()\" v-if=\"reset_feature != 'no'\">reset</div>\n\t\t<div class=\"simavr_status\">Status: {{status}}</div>\n\t    </div><br />\n\t    <form><textarea v-bind:id=\"'simavr'+simid+'_program_area'\"></textarea></form>\n\t    <br />\n\t</div>\n\t<div class=\"simavr_output_container\" v-if=\"running\">\n\t    <div class=\"simavr_controls\">\n\t\t<div v-bind:class=\"'simavr_button ' + (running == false ? 'simavr_disabled_button' : 'simavr_enabled_button')\" v-on:click=\"end()\">end</div>\n\t\t<div style=\"margin-top:10px;display:inline-block;\">\n\t\t    <select name=\"output_select\" v-model=\"output_type.selection\">\n\t\t\t<option value=\"program\">View Program</option>\n\t\t\t<option value=\"simple\">View Simple I/O</option>\n\t\t\t<!-- <option value=\"complex\">View Complex I/O</option> -->\n\t\t    </select>\n\t\t</div>\n\t    </div>\n\t    <div class=\"simavr_output\" v-if=\"output_type.selection == 'program'\">\n\t\t<b>Program: </b>\n\t\t<pre>{{program}}</pre>\n\t    </div>\n\t    <div class=\"simavr_output\" v-if=\"output_type.selection == 'simple'\">\n\t\tOutput LCD: <br />(Connected to pins 0-7 of D)<br />\n\t\t<div class=\"simavr_io_num\">\n\t\t    {{truncate(PORTD,8,false)}}\n\t\t</div>\n\n\t\t<br /><br />\n\n\t\tToggle switches--click to toggle:<br />(Connected to pins 0-7 of D): <br />\n\t\t<div style=\"display:inline-block;\" v-for=\"i in [0,1,2,3,4,5,6,7]\">\n\t\t    {{i}}:\n\t\t    <div v-bind:class=\"'simavr_io_switch ' + (io_state.switch_state[i] == 'ON' ? 'simavr_io_switch_on' : 'simavr_io_switch_off')\" v-on:click=\"io_switch(i)\">\n\t\t\t{{io_state.switch_state[i]}}\n\t\t    </div>\n\t\t    <br /><br />\n\t\t</div>\n\t    </div>\n\t    <div class=\"simavr_output\" v-if=\"output_type.selection == 'complex'\">\n\t\tPaceholder for full output panel\n\t    </div>\n\t</div>\n\t<div class=\"simavr_simulator\" v-if=\"running\">\n\t    <div class=\"simavr_controls\">\n\t\t<div v-bind:class=\"'simavr_button ' + (running == false ? 'simavr_disabled_button' : 'simavr_enabled_button')\" v-on:click=\"reset(false)\">reset</div>\n\t\t<div v-bind:class=\"'simavr_button ' + (running == false ? 'simavr_disabled_button' : 'simavr_enabled_button')\" v-on:click=\"step()\">step</div>\n\t\t<input class=\"simavr_mem_start\" type=\"number\" v-model=\"steps.count\" v-if=\"running == true\"></input>\n\t    </div><br />\n\t    <div id=\"simavr_pm\">\n\t\t<div class=\"simavr_title\">PM at <input class=\"simavr_mem_start\" type=\"number\" v-model=\"display_pm_start\"></input></div><br />\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_PM_display_mode('t')\">[text]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_PM_display_mode('b')\">[bin]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_PM_display_mode('d')\">[dec]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_PM_display_mode('h')\">[hex]</div>\n\t\t<div v-for=\"(i,idx) in PM.slice(display_pm_start,display_pm_start+display_pm_length)\">\n\t\t    <div v-bind:class=\"'simavr_pm '+ (display_pm_start+idx == PC ? 'simavr_active' : 'simavr_normal')\">\n\t\t\t<span class=\"simavr_label_long\">{{display_pm_start+idx}}: </span>{{ PM[display_pm_start+idx].display() }}\n\t\t    </div>\n\t\t    <br />\n\t\t</div>\n\t\t<br />\n\t    </div>\n\t    <div id=\"simavr_rf\">\n\t\t<div class=\"simavr_title\">Register file</div><br />\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RF_display_mode('b')\">[bin]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RF_display_mode('d')\">[dec]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RF_display_mode('2')\">[com]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RF_display_mode('h')\">[hex]</div>\n\t\t<br />\n\t\t\n\t\t<span v-for=\"(r,idx) in RF\"><div v-bind:class=\"'simavr_reg '+ (is_updated(idx) ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">{{idx}}: </span>{{display_rf(idx)}}</div><br v-if=\"(idx)%2 == 1\" /></span><br />\n\t    </div>\n\t    <div id=\"simavr_ram\">\n\t\t<div class=\"simavr_title\">RAM at <input class=\"simavr_mem_start\" type=\"number\" v-model=\"display_ram_start\"></input></div><br />\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RAM_display_mode('d')\">[dec]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RAM_display_mode('2')\">[com]</div>\n\t\t<div class=\"simavr_display_button\" v-on:click=\"set_RAM_display_mode('c')\">[txt]</div>\n\t\t<div v-for=\"(i,idx) in RAM.slice(display_ram_start,display_ram_start+display_ram_length)\">\n\t\t    <div v-bind:class=\"'simavr_ram '+ (is_ram_updated(display_ram_start+idx) ? 'simavr_updated' : 'simavr_normal')\">\n\t\t\t<span class=\"simavr_label_long\">{{display_ram_start+idx}}: </span>{{display_ram(display_ram_start+idx)}}\n\t\t    </div>\n\t\t    <br />\n\t\t</div>\n\t\t<br />\n\t    </div>\n\t    <div id=\"simavr_other\">\n\t\t<div class=\"simavr_title\">Other</div><br /><div class=\"simavr_display_button\" v-on:click=\"\">&nbsp;</div><br />\n\t\t<div v-bind:class=\"{simavr_reg:true, simavr_updated:is_updated('PC'), simavr_normal:!is_updated('PC')}\"><span class=\"simavr_label\">PC: </span>{{PC}}</div><br />\n\t\t<br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('Z') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">Z: </span>{{Z}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('C') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">C: </span>{{C}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('N') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">N: </span>{{N}}</div><br />\n\t\t<br />\n\t\t\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated(26)||is_updated(27) ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">X: </span>{{truncate(RF[26],8,false)+256*truncate(RF[27],8,false)}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated(28)||is_updated(29) ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">Y: </span>{{truncate(RF[28],8,false)+256*truncate(RF[29],8,false)}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated(30)||is_updated(31) ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label\">Z: </span>{{truncate(RF[30],8,false)+256*truncate(RF[31],8,false)}}</div><br />\n\t\t<br />\n\t\t\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('PIND') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label_long\">PIND: </span>{{PIND}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('DDRD') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label_long\">DDRD: </span>{{DDRD}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('PORTD') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label_long\">PORTD: </span>{{PORTD}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('SPL') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label_long\">SPL: </span>{{SPL}}</div><br />\n\t\t<div v-bind:class=\"'simavr_reg '+(is_updated('SPH') ? 'simavr_updated' : 'simavr_normal')\"><span class=\"simavr_label_long\">SPH: </span>{{SPH}}</div>\n\t    </div>\n\t</div>\n    </div>\n</template>\n<script>\n import CodeMirror from 'codemirror'\n export default {\n     name: 'cat-jsavr',\n     props: ['root','program','text','control','size','lightboard_feature','reset_feature','simid','debug_mode_feature'],\n     data () {\n\t return {\n\t     id: '',\n\t     rendered: '',\n\t     debug_log: this.do_nothing,\n\t     status: \"Ready\",\n\t     running: false,\n\t     outputs: [],\n\t     io_state: {'switch_state':[\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\"]},\n\t     steps: {'count':1},\n\t     output_type: {\"selection\":\"program\"},\n\t     symbols: {},\n\t     PM_display_mode: \"t\",\n\t     RAM_display_mode: \"d\",\n\t     RF_display_mode: \"d\",\n\t     RAM: [],\n\t     PM: [],\n\t     RF: [],\n\t     \n\t     PIND: 0,\n\t     PORTD: 0,\n\t     DDRD: 0,\n\t     SPH: 0,\n\t     SPL: 0,\n\t     \n\t     RAM_size: 65536,\n\t     PM_size: 65536,\n\t     RF_size: 32,\n\t     updated: [],\n\t     error_line: 0,\n\t     current_ram_data: [],\n\t     display_pm_start: 0,\n\t     display_ram_start: 0,\n\t     display_pm_length: 16,\n\t     display_ram_length: 16,\n\t     directives: {\n\t\t \"label\":{\"regex\":/^([a-zA-Z_][a-zA-Z0-9_]*):$/,\"process\":function(args){\n\t\t     return {\"symbol\":args[1],\n\t\t\t     \"symbol_type\":\"pm\",\n\t\t     };\n\t\t }},\n\t\t \"word\":{\"regex\":/^\\.word ([0-9,]+)$/,\"process\":function(args){\n\t\t     var rdata = args[1].split(\",\");\n\t\t     for(var i = 0; i < rdata.length; i++){\n\t\t\t rdata[i] = this.truncate(parseInt(rdata[i]),16,false);\n\t\t     }\n\t\t     return {\"symbol\":args[1],\n\t\t\t     \"symbol_type\":\"pm\",\n\t\t\t     \"pm_data\":rdata\n\t\t     };\n\t\t }},\n\t\t \"byte_ram\":{\"regex\":/^ *\\.byte\\(([a-zA-Z_][a-zA-Z0-9_]*)\\) ([-0-9, ]+) *$/,\"process\":function(args){\n\t\t     var rdata = args[2].split(\",\");\n\t\t     for(var i = 0; i < rdata.length; i++){\n\t\t\t rdata[i] = this.truncate(parseInt(rdata[i].trim()),8,false);\n\t\t     }\n\t\t     return {\"symbol\":args[1],\n\t\t\t     \"symbol_type\":\"ram\",\n\t\t\t     \"ram_data\":rdata\n\t\t     };\n\t\t }},\n\t\t \"string_ram\":{\"regex\":/^ *\\.string\\(([a-zA-Z_][a-zA-Z0-9_]*)\\) \"((?:[^\"\\\\]|\\\\.)*)\" *$/,\"process\":function(args){\n\t\t     var str = this.handle_string_escapes(args[2]);\n\t\t     var rdata = []\n\t\t     for(var i = 0; i < str.length; i++){\n\t\t\t rdata.push(this.truncate(str.charCodeAt(i),8,false));\n\t\t     }\n\t\t     rdata.push(0);\n\t\t     return {\"symbol\":args[1],\n\t\t\t     \"symbol_type\":\"ram\",\n\t\t\t     \"ram_data\":rdata\n\t\t     };\n\t\t     \n\t\t }}\n\t     },\n\t     formats: {\n\t\t \"4r8i\":{\n\t\t     \"string\":/ *r([0-9]+), *()(-?[a-zA-Z_0-9)(-]+|'..?') *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" r\" + r + \",\"+i;},\n\t\t     \"binary\":\"CCCCIIIIRRRRIIII\",\n\t\t     \"i_bits\":8,\n\t\t     \"validator\":function(c, r, s, i){return 16 <= r && r < 32 && -128 <= i && i < 256;}},\n\t\t \"5r5s\":{\n\t\t     \"string\":/ *r([0-9]+), *r([0-9]+)() *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" r\" + r + \",r\"+s;},\n\t\t     \"binary\":\"CCCCCCSRRRRRSSSS\",\n\t\t     \"validator\":function(c, r, s, i){return 0 <= r && r < 32 && 0 <= s && s < 32;}},\n\t\t \"6s5r\":{\n\t\t     \"string\":/ *r([0-9]+), *([0-9]+)() *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" r\" + r + \",\"+s;},\n\t\t     \"binary\":\"CCCCCSSRRRRRSSSS\",\n\t\t     \"validator\":function(c, r, s, i){return 0 <= r && r < 32 && 0 <= s && s < 64;}},\n\t\t \"5r6s\":{\n\t\t     \"string\":/ *([0-9]+), *r([0-9]+)() *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" \" + r + \",r\"+s;},\n\t\t     \"binary\":\"CCCCCSSRRRRRSSSS\",\n\t\t     \"validator\":function(c, r, s, i){return 0 <= r && r < 64 && 0 <= s && s < 32;}},\n\t\t \"5r\":{\n\t\t     \"string\":/ *r([0-9]+)()() *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" r\" + r;},\n\t\t     \"binary\":\"CCCCCCCRRRRRCCCC\",\n\t\t     \"validator\":function(c, r, s, i){return 0 <= r && r < 32;}},\n\t\t \"5rX\":{\n\t\t     \"string\":/ *r([0-9]+)(), *(-[XYZ]|[XYZ]|[XYZ]\\+) *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i,x){return mnemonic + \" r\" + r + \",\"+i},\n\t\t     \"binary\":\"CCCXCCCRRRRRXXXX\",\n\t\t     \"validator\":function(c, r, s, i){return 0 <= r && r < 32;}},\n\t\t \"X5r\":{\n\t\t     \"string\":/ *(-[XYZ]|[XYZ]|[XYZ]\\+), *r([0-9]+)() *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i,x){return mnemonic + \" \" + r + \",r\"+s;},\n\t\t     \"binary\":\"CCCXCCCRRRRRXXXX\",\n\t\t     \"validator\":function(c, r, s, i){return 0 <= s && s < 32;}},\n\t\t \"12i\":{\n\t\t     \"string\":/ *()()(-?[a-zA-Z_0-9)(]+) *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" \" + i;},\n\t\t     \"binary\":\"CCCCIIIIIIIIIIII\",\n\t\t     \"i_bits\":12,\n\t\t     \"validator\":function(c, r, s, i){return -2048 <= i && i < 2048;}},\n\t\t \"7i\":{\n\t\t     \"string\":/ *()()(-?[a-zA-Z_0-9)(]+) *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic + \" \" + i;},\n\t\t     \"binary\":\"CCCCCCIIIIIIICCC\",\n\t\t     \"i_bits\":7,\n\t\t     \"validator\":function(c, r, s, i){return -64 <= i && i < 64;}},\n\t\t \"n\":{\n\t\t     \"string\":/ *()()() *$/,\n\t\t     \"to_string\":function(mnemonic,c,r,s,i){return mnemonic;},\n\t\t     \"binary\":\"CCCCCCCCCCCCCCCC\",\n\t\t     \"validator\":function(c, r, s, i){return true;}}\n\t     },\n\t     instructions: {\n\t\t \"ldi\":{\"format\":\"4r8i\", \"c\": 14, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     console.log('T',emu);\n\t\t     emu.RF[r] = emu.truncate(i,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"mov\":{\"format\":\"5r5s\", \"c\": 11, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.RF[r] = emu.RF[s];\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"add\":{\"format\":\"5r5s\", \"c\": 3, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] + emu.RF[s], true, true, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] + emu.RF[s],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"adc\":{\"format\":\"5r5s\", \"c\": 7, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     var oldC = emu.C;\n\t\t     emu.update_sreg(emu.RF[r] + emu.RF[s] + oldC, true, true, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] + emu.RF[s] + oldC,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"sbc\":{\"format\":\"5r5s\", \"c\": 2, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     var oldC = emu.C;\n\t\t     emu.update_sreg(emu.RF[r] - emu.RF[s] - oldC, true, true, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] - emu.RF[s] - oldC,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"sub\":{\"format\":\"5r5s\", \"c\": 6, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] - emu.RF[s], true, true, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] - emu.RF[s],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"cp\":{\"format\":\"5r5s\", \"c\": 5, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] - emu.RF[s], true, true, true);\n\t\t     emu.C = emu.truncate(emu.RF[r],8,true) < emu.truncate(emu.RF[s],8,true) ? 1 : 0; // HACK TO MATCH PRESENTATION\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"and\":{\"format\":\"5r5s\", \"c\": 8, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] & emu.RF[s], true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] & emu.RF[s],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"or\":{\"format\":\"5r5s\", \"c\": 10, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] | emu.RF[s], true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] | emu.RF[s],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"eor\":{\"format\":\"5r5s\", \"c\": 9, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] ^ emu.RF[s], true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] ^ emu.RF[s],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r, \"PC\", \"Z\", \"C\", \"N\"];}},\n\t\t \"cpi\":{\"format\":\"4r8i\", \"c\": 3, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] - i, true, true, true);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\",\"Z\",\"C\",\"N\"];}},\n\t\t \"subi\":{\"format\":\"4r8i\", \"c\": 5, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] - i, true, true, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] - i,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\",\"Z\",\"C\",\"N\"];}},\n\t\t \"andi\":{\"format\":\"4r8i\", \"c\": 7, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] & i, true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] & i,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\",\"Z\",\"C\",\"N\"];}},\n\t\t \"ori\":{\"format\":\"4r8i\", \"c\": 6, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] | i, true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] | i,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\",\"Z\",\"C\",\"N\"];}},\n\t\t \"dec\":{\"format\":\"5r\", \"c\": 1194, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] - 1, true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] - 1,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"inc\":{\"format\":\"5r\", \"c\": 1187, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(emu.RF[r] + 1, true, false, true);\n\t\t     emu.RF[r] = emu.truncate(emu.RF[r] + 1,8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"neg\":{\"format\":\"5r\", \"c\": 1185, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(-emu.RF[r], true, true, true);\n\t\t     emu.RF[r] = emu.truncate(-emu.RF[r],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"com\":{\"format\":\"5r\", \"c\": 1184, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.update_sreg(~(emu.RF[r]), true, false, true);\n\t\t     emu.RF[r] = emu.truncate(~(emu.RF[r]),8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"ld\":{\"format\":\"5rX\", \"c\": 32, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     var reg = 0;\n\t\t     if(i == \"X\" || i == \"-X\" || i == \"X+\") reg = 26;\n\t\t     if(i == \"Y\" || i == \"-Y\" || i == \"Y+\") reg = 28;\n\t\t     if(i == \"Z\" || i == \"-Z\" || i == \"Z+\") reg = 30;\n\t\t     if(i[0] == \"-\"){\n\t\t\t emu.updated.push(reg);\n\t\t\t emu.dec_ptr(reg);\n\t\t     }\n\t\t     var ptr = emu.truncate(emu.RF[reg],8,false)+256*emu.truncate(emu.RF[reg+1],8,false);\n\t\t     emu.updated = [r,\"PC\"];\n\t\t     emu.RF[r] = emu.truncate(emu.RAM[ptr],8,false);\n\t\t     if(i[1] == \"+\"){\n\t\t\t emu.updated.push(reg);\n\t\t\t emu.inc_ptr(reg);\n\t\t     }\n\t\t     emu.ram_updated = [];\n\t\t     emu.PC++;}},\n\t\t \"st\":{\"format\":\"X5r\", \"c\": 33, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     i = r;\n\t\t     r = s;\n\t\t     var reg = 0;\n\t\t     if(i == \"X\" || i == \"-X\" || i == \"X+\") reg = 26;\n\t\t     if(i == \"Y\" || i == \"-Y\" || i == \"Y+\") reg = 28;\n\t\t     if(i == \"Z\" || i == \"-Z\" || i == \"Z+\") reg = 30;\n\t\t     if(i[0] == \"-\"){\n\t\t\t emu.updated.push(reg);\n\t\t\t emu.dec_ptr(reg);\n\t\t     }\n\t\t     var ptr = emu.truncate(emu.RF[reg],8,false)+256*emu.truncate(emu.RF[reg+1],8,false);\n\t\t     emu.updated = [\"PC\"];\n\t\t     emu.ram_updated = [ptr];\n\t\t     emu.RAM[ptr] = emu.RF[r];\n\t\t     emu.PC++;\n\t\t     if(i[1] == \"+\"){\n\t\t\t emu.updated.push(reg);\n\t\t\t emu.inc_ptr(reg);\n\t\t     }\n\t\t }},\n\t\t \"rjmp\":{\"format\":\"12i\", \"c\": 12, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC = emu.truncate(emu.PC + i + 1,16,false);\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"breq\":{\"format\":\"7i\", \"c\": 481, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC = emu.truncate(emu.PC + 1 + (emu.Z == 1 ? (i <= 64 ? i : i-128) : 0),16,false);\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"brne\":{\"format\":\"7i\", \"c\": 489, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC = emu.truncate(emu.PC + 1 + (emu.Z == 0 ? (i <= 64 ? i : i-128) : 0),16,false);\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"brsh\":{\"format\":\"7i\", \"c\": 488, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC = emu.truncate(emu.PC + 1 + (emu.C == 0 ? (i <= 64 ? i : i-128) : 0),16,false);\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"brlo\":{\"format\":\"7i\", \"c\": 480, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC = emu.truncate(emu.PC + 1 + (emu.C == 1 ? (i <= 64 ? i : i-128) : 0),16,false);\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"in\":{\"format\":\"6s5r\", \"c\": 22, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.RF[r] = emu.truncate(emu.read_IO(s),8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"out\":{\"format\":\"5r6s\", \"c\": 23, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     i = s;\n\t\t     s = r;\n\t\t     r = i;\n\t\t     emu.write_IO(s,emu.RF[r]);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"asr\":{\"format\":\"5r\", \"c\": 1189, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     var C = emu.RF[r]%2 == 0 ? 0 : 1;\n\t\t     emu.RF[r] = emu.truncate(emu.truncate(emu.RF[r],8,true) >> 1,8,false);\n\t\t     emu.update_sreg(emu.RF[r], true, false, true);\n\t\t     emu.C = C;\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [r,\"PC\"];}},\n\t\t \"push\":{\"format\":\"5r\", \"c\": 1183, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     var SP = emu.SPH * 256 + emu.SPL;\n\t\t     emu.RAM[SP] = emu.RF[r];\n\t\t     emu.decSP();\n\t\t     emu.PC++;\n\t\t     emu.updated = [\"PC\",\"SPH\",\"SPL\"];\n\t\t     emu.ram_updated = [SP];}},\n\t\t \"pop\":{\"format\":\"5r\", \"c\": 1167, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.incSP();\n\t\t     var SP = emu.SPH * 256 + emu.SPL;\n\t\t     emu.RF[r] = emu.truncate(emu.RAM[SP],8,false);\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\",\"SPH\",\"SPL\"];}},\n\t\t \"rcall\":{\"format\":\"12i\", \"c\": 13, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC++;\n\t\t     var PCL = emu.PC % 256;\n\t\t     var PCH = Math.floor(emu.PC / 256);\n\t\t     var SP = emu.SPH * 256 + emu.SPL;\n\t\t     emu.RAM[SP] = PCH;\n\t\t     emu.decSP();\n\t\t     var SP = emu.SPH * 256 + emu.SPL;\n\t\t     emu.RAM[SP] = PCL;\n\t\t     emu.decSP();\n\t\t     emu.PC = emu.truncate(emu.PC + i,16,false);\n\t\t     emu.updated = [\"PC\",\"SPH\",\"SPL\"];\n\t\t     emu.ram_updated = [SP];}},\n\t\t \"ret\":{\"format\":\"n\", \"c\": 38152, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.incSP();\n\t\t     var SP = emu.SPH * 256 + emu.SPL;\n\t\t     var PCL = emu.RAM[SP];\n\t\t     emu.incSP();\n\t\t     var SP = emu.SPH * 256 + emu.SPL;\n\t\t     var PCH = emu.RAM[SP];\n\t\t     emu.PC = PCL + 256*PCH;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\",\"SPH\",\"SPL\"];}},\n\t\t \"nop\":{\"format\":\"n\", \"c\": 0, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.PC++;\n\t\t     emu.ram_updated = [];\n\t\t     emu.updated = [\"PC\"];}},\n\t\t \"halt\":{\"format\":\"n\", \"c\": 1, \"exec\":function(c, r, s, i){\n\t\t     var emu = this.parent;\n\t\t     emu.end();}}\n\t     }\n\t }\n     },\n     methods: {\n\t smul: function(str, num) {\n\t     var acc = [];\n\t     for (var i = 0; (1 << i) <= num; i++) {\n\t\t if ((1 << i) & num)\n\t\t     acc.push(str);\n\t\t str += str;\n\t     }\n\t     return acc.join(\"\");\n\t },\n\t do_nothing: function(a){},\n\t cm_setup: function(){\n\t     var sim_textarea = document.getElementById(\"simavr\"+this.simid+\"_program_area\");\n\t     this.debug_log(this.simid,sim_textarea);\n\t     if(sim_textarea == null) return;\n\t     this.editor = CodeMirror.fromTextArea(sim_textarea, {\n\t\t lineNumbers: true,\n\t\t gutters: [\"breakpoints\", \"CodeMirror-linenumbers\"]\n\t     });\n\t     if(this.size){\n\t\t if(this.size == \"auto\"){\n\t\t     this.editor.setSize(null, (this.program.split(\"\\n\").length + 2)*(this.editor.defaultTextHeight()) + 10);\n\t\t }\n\t\t else{\n\t\t     this.editor.setSize(null, this.size);\n\t\t }\n\t     }\n\t     else{\n\t\t this.editor.setSize(null, \"70%\");\n\t     }\n\t     this.editor.setOption(\"extraKeys\", {\n\t\t 'Ctrl-Enter': function(cm) {\n                     this.program_pm();\n                     this.$apply();\n\t\t }\n\t     });\n\t     this.editor.setValue(this.program);\n\t },\n\t reset_program: function(){\n\t     if(this.running) return;\n\t     if(this.text){\n\t\t this.debug_log(\"Using text\");\n\t\t this.program = this.text;\n\t     }\n\t     else if(this.original_program){\n\t\t this.program = this.original_program;\n\t     }\n\t     this.change_program(this.program);\n\t },\n\t reset: function(pm_reset){\n\t     this.io_state.switch_state = [\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\",\"OFF\"];\n\t     this.output_type.selection = \"program\";\n\t     this.display_pm_start = 0;\n\t     this.display_ram_start = 0;\n\t     this.steps = {'count':1};\n\t     this.PC = 0;\n\t     this.Z = 0;\n\t     this.C = 0;\n\t     this.N = 0;\n\t     this.PIND = 0;\n\t     this.PORTD = 0;\n\t     this.DDRD = 0;\n\t     this.SPH = 0;\n\t     this.SPL = 0;\n\t     this.updated = [];\n\t     this.ram_updated = [];\n\t     this.outputs = [];\n\t     this.mux = new this.output_mux();\n\t     for(var i = 0; i < this.RF_size; i++) this.RF[i] = 0;\n\t     for(var i = 0; i < this.RAM_size; i++) this.RAM[i] = 0;\n\t     for(var i = 0; i < this.IORF_size; i++) this.IORF[i] = 0;\n\t     var nop = this.parse(\"nop\",0);\n\t     if(pm_reset){ for(var i = 0; i < this.PM_size; i++){ nop.addr = i; this.PM[i] = nop; }}\n\t     if(!pm_reset){ for(var i = 0; i < this.current_ram_data.length; i++) this.RAM[i+1024] = this.current_ram_data[i]; }\n\t     if(this.editor) this.editor.removeLineClass(this.error_line, \"background\", \"active_line\");\n\t },\n\t change_program: function(prog){\n\t     this.program = prog;\n\t     if(this.editor) this.editor.setValue(prog);\n\t },\n\t display_ram: function(i){\n\t     if(this.RAM_display_mode == \"d\"){\n\t\t return this.RAM[i];\n\t     }\n\t     else if(this.RAM_display_mode == \"2\"){\n\t\t return this.truncate(this.RAM[i],8,true);\n\t     }\n\t     else if(this.RAM_display_mode == \"c\"){\n\t\t return String.fromCharCode(this.RAM[i])\n\t     }\n\t },\n\t display_rf: function(i){\n\t     if(this.RF_display_mode == \"d\"){\n\t\t return this.truncate(this.RF[i],8,false);\n\t     }\n\t     if(this.RF_display_mode == \"2\"){\n\t\t return this.truncate(this.RF[i],8,true);\n\t     }\n\t     else if(this.RF_display_mode == \"b\"){\n\t\t var s = this.RF[i].toString(2);\n\t\t return smul(\"0\",8-s.length)+s;\n\t     }\n\t     else if(this.RF_display_mode == \"h\"){\n\t\t var s = this.RF[i].toString(16);\n\t\t return \"0x\"+smul(\"0\",2-s.length)+s;\n\t     }\n\t },\n\t program_pm: function(){\n\t     if(this.running) return;\n\t     this.reset(true);\n\t     this.running = true;\n\t     this.program = this.editor.getValue();\n\t     var pm_data = this.preparse(this.program);\n\t     if(!pm_data){\n\t\t this.running = false;\n\t\t return;\n\t     }\n\t     var pm_addr = 0;\n\t     for(var i = 0; i < pm_data.length; i++){\n\t\t var datum = pm_data[i];\n\t\t if(datum.inst){\n\t\t     var inst = this.parse(datum.inst,pm_addr);\n\t\t     if(!inst) continue;\n\t\t     if(inst.error){\n\t\t\t this.error_on_line(datum.line, inst.error);\n\t\t\t return;\n\t\t     }\n\t\t     this.PM[pm_addr] = inst;\n\t\t     pm_addr++;\n\t\t }\n\t\t else if(datum.word){\n\t\t     var inst = this.decode(datum.word,pm_addr);\n\t\t     if(inst.error){\n\t\t\t this.error_on_line(datum.line, inst.error);\n\t\t\t return;\n\t\t     }\n\t\t     this.PM[pm_addr] = inst;\n\t\t     pm_addr++;\n\t\t }\n\t     }\n\t     this.status = \"Ready\";\n\t },\n\t error_on_line: function(linenum, err_msg){\n\t     this.running = false;\n\t     this.status = \"Error on line \" + linenum + \": \" + err_msg;\n\t     this.error_line = linenum;\n\t     if(this.editor) this.editor.addLineClass(linenum, \"background\", \"active_line\");\n\t },\n\t preparse: function(){\n\t     var lines = this.program.split(\"\\n\");\n\t     var to_program = [];\n\t     var pm_offset = 0;\n\t     var ram_offset = 1024;\n\t     for(var i = 0; i < lines.length; i++){\n\t\t var pieces = lines[i].match(/^((?:[^\";]|';'|\"(?:[^\\\\\"]+|\\\\(?:\\\\\\\\)*[nt\\\\\"])*\")*)(;.*)?$/)\n\t\t this.debug_log(\"P\",pieces);\n\t\t if(!pieces){\n\t\t     this.error_on_line(i, \"Invalid line: \"+i);\n\t\t     return;\n\t\t }\n\t\t if(!pieces[1]) continue;\n\t\t lines[i] = pieces[1].trim();\n\t\t var is_inst = true;\n\t\t for(var d in this.directives){\n\t\t     var matches = lines[i].match(this.directives[d].regex)\n\t\t     this.debug_log(\"D\",lines[i],d,matches);\n\t\t     if(matches){\n\t\t\t // process needs to return:\n\t\t\t // - What it inserts to PM (pm_data)\n\t\t\t // - What it inserts into RAM (ram_data)\n\t\t\t // - What symbol it wants to make (symbol)\n\t\t\t // - What kind of symbol it is (symbol_type == \"pm\" | \"ram\")\n\t\t\t // - Whether there was an error (error)\n\t\t\t \n\t\t\t var result = this.directives[d].process(matches);\n\n\t\t\t // Handle error\n\t\t\t if(result.error){\n\t\t\t     this.error_on_line(i, result.error);\n\t\t\t     return;\n\t\t\t }\n\n\t\t\t // Update symbol\n\t\t\t if(result.symbol && result.symbol_type){\n\t\t\t     if(result.symbol_type == \"pm\"){\n\t\t\t\t this.symbols[result.symbol] = pm_offset;\n\t\t\t     }\n\t\t\t     else if(result.symbol_type == \"ram\"){\n\t\t\t\t this.symbols[result.symbol] = ram_offset;\n\t\t\t     }\n\t\t\t }\n\t\t\t \n\t\t\t // Insert data and update offsets\n\t\t\t if(result.pm_data){\n\t\t\t     for(var j = 0; j < result.pm_data.length; j++){\n\t\t\t\t to_program.push({'word':result.pm_data[j],'line':i});\n\t\t\t     }\n\t\t\t     pm_offset += result.pm_data.length;\n\t\t\t }\n\t\t\t if(result.ram_data){\n\t\t\t     for(var j = 0; j < result.ram_data.length; j++){\n\t\t\t\t this.RAM[ram_offset + j] = result.ram_data[j];\n\t\t\t     }\n\t\t\t     this.current_ram_data = this.current_ram_data.concat(result.ram_data);\n\t\t\t     ram_offset += result.ram_data.length;\n\t\t\t }\n\t\t\t is_inst = false;\n\t\t\t break;\n\t\t     }\n\t\t }\n\t\t if(is_inst && !(/^[ \\t]*$/.test(lines[i]))){\n\t\t     to_program.push({'inst':lines[i],'line':i});\n\t\t     pm_offset++;\n\t\t }\n\t     }\n\t     return to_program;\n\t },\n\t parse: function(inst,addr){\n\t     this.debug_log(inst)\n\t     var matches = inst.match(/^[ \\t]*([a-zA-Z]+)[ \\t]*((?:[^;]|';')*)[ \\t]*$/)\n\t     if(!matches){\n\t\t return {\"error\":\"Line does not match any directive or instruction\"};\n\t     }\n\t     var mnemonic = matches[1];\n\t     var operand = matches[2];\n\t     this.debug_log(mnemonic, \"|||\", operand);\n\t     if(mnemonic in this.instructions){\n\t\t var format = this.instructions[mnemonic].format;\n\t\t var execf = this.instructions[mnemonic].exec;\n\t\t var ops = operand.match(this.formats[format].string);\n\t\t if(!ops){\n\t\t     return {\"error\":\"Operands to instruction \" + inst + \" did not parse\"};\n\t\t }\n\t\t for(var i = 0; i < 3; i++){\n\t\t     if(/^[0-9]+$/.test(ops[i])) ops[i] = parseInt(ops[i]);\n\t\t     //else if(format.sym_valid[i]) ops[i] = symbols[ops[i]];\n\t\t }\n\t\t var opcode = this.instructions[mnemonic].c;\n\t\t this.debug_log(format, execf, ops, opcode);\n\t\t var data = {\"r\":ops[1],\"s\":ops[2],\"i\":ops[3],\"c\":opcode};\n\t\t var new_inst = new this.instruction(mnemonic + \" \" + operand, mnemonic, data, execf,addr, this);\n\t\t if(new_inst.error){\n\t\t     return {\"error\":inst.error};\n\t\t }\n\t\t if(new_inst.check_valid()){\n\t\t     return new_inst;\n\t\t }\n\t\t else{\n\t\t     return {\"error\":\"Illegal operands to instruction \" + inst};\n\t\t }\n\t     }\n\t     else{\n\t\t return {\"error\":\"Invalid instruction \" + inst};\n\t     }\n\t     return null;\n\t },\n\t is_updated: function(x){\n\t     for(var i = 0; i < this.updated.length; i++){\n\t\t if(this.updated[i] == x) return true;\n\t     }\n\t     return false;\n\t },\n\t is_ram_updated: function(x){\n\t     for(var i = 0; i < this.updated.length; i++){\n\t\t if(this.ram_updated[i] == x) return true;\n\t     }\n\t     return false;\n\t },\n\t handle_string_escapes: function(s){\n\t     s = s.replace(/(([^\\\\]|)(\\\\\\\\)*)\\\\t/g,\"$1\\t\");\n\t     s = s.replace(/(([^\\\\]|)(\\\\\\\\)*)\\\\n/g,\"$1\\n\");\n\t     s = s.replace(/(([^\\\\]|)(\\\\\\\\)*)\\\\\"/g,\"$1\\\"\");\n\t     s = s.replace(/\\\\\\\\/g,\"\\\\\");\n\t     return s;\n\t },\n\n\t // X,*:  111\n\t // Y,\"\": 010\n\t // Y,+-\" 110\n\t // Z,\"\": 000\n\t // Z,+-: 100\n\t // \"\":  00\n\t // \"+\": 01\n\t // \"-\": 10\n\t encode_x: function(i){\n\t     var x = 0;\n\t     var ptr = i[0] == \"-\" ? i[1] : i[0];\n\t     var mod = i[0] == \"-\" ? \"-\" : (i[1] == \"+\" ? \"+\" : \"\");\n\t     if(ptr == \"X\") x = 7*4\n\t     if(ptr == \"Y\") x = 6*4\n\t     if(ptr == \"Z\") x = 4*4\n\t     if(ptr != \"X\" && mod == \"\") x -= 16;\n\t     if(mod == \"+\") x += 1;\n\t     if(mod == \"-\") x += 2;\n\t     return x;\n\t },\n\t decode_x: function(x){\n\t     var ptr = \"\";\n\t     var mod = \"\";\n\t     this.debug_log(\"XX\",x,x&3,(x>>2)&3)\n\t     if(((x >> 2)&3) == 3) ptr = \"X\";\n\t     if(((x >> 2)&3) == 2) ptr = \"Y\";\n\t     if(((x >> 2)&3) == 0) ptr = \"Z\";\n\t     if((x&3) == 1) mod = \"+\";\n\t     if((x&3) == 2) mod = \"-\";\n\t     this.debug_log(\"X=\",mod,ptr)\n\t     return mod == \"-\" ? mod +\"\"+ ptr : ptr +\"\"+ mod;\n\t },\n\t encode: function(format, c, r, s, i){\n\t     var fmt = this.formats[format].binary;\n\t     var inst = 0;\n\t     var x = 0;\n\t     if(format == \"5r6s\"){\n\t\t i = s;\n\t\t s = r;\n\t\t r = i;\n\t     }\n\t     else if(format == \"5rX\" || format == \"X5r\"){\n\t\t if(format == \"X5r\"){\n\t\t     i = r;\n\t\t     r = s;\n\t\t }\n\t\t this.debug_log(\"Xe\",i);\n\t\t x = this.encode_x(i);\n\t\t this.debug_log(\"Xd\",x);\n\t     }\n\t     for(var j = 15; j >= 0; j--) {\n\t\t if(fmt[j] == \"C\"){\n\t\t     inst += (c%2)<<(15-j);\n\t\t     c >>= 1;\n\t\t }\n\t\t if(fmt[j] == \"R\"){\n\t\t     inst += (r%2)<<(15-j);\n\t\t     r >>= 1;\n\t\t }\n\t\t if(fmt[j] == \"S\"){\n\t\t     inst += (s%2)<<(15-j);\n\t\t     s >>= 1;\n\t\t }\n\t\t if(fmt[j] == \"I\"){\n\t\t     inst += (i%2)<<(15-j);\n\t\t     i >>= 1;\n\t\t }\n\t\t if(fmt[j] == \"X\"){\n\t\t     inst += (x%2)<<(15-j);\n\t\t     x >>= 1;\n\t\t }\n\t     }\n\t     return inst;\n\t },\n\t decode: function(x,addr){\n\t     for(var f in this.formats){\n\t\t fmt = this.formats[f];\n\t\t var data = {\"c\":0,\"r\":0,\"s\":0,\"i\":0,\"x\":0}\n\t\t for(var j = 15; j >= 0; j--){\n\t\t     //this.debug_log(\"J\",j,fmt.binary[15-j],(x>>j)%2);\n\t\t     if(fmt.binary[15-j] == \"C\") data.c = (data.c * 2) + ((x >> j) % 2);\n\t\t     if(fmt.binary[15-j] == \"R\") data.r = (data.r * 2) + ((x >> j) % 2);\n\t\t     if(fmt.binary[15-j] == \"S\") data.s = (data.s * 2) + ((x >> j) % 2);\n\t\t     if(fmt.binary[15-j] == \"I\") data.i = (data.i * 2) + ((x >> j) % 2);\n\t\t     if(fmt.binary[15-j] == \"X\") data.x = (data.x * 2) + ((x >> j) % 2);\n\t\t }\n\t\t if(f == \"4r8i\") data.r += 16;\n\t\t if(f == \"12i\") data.i = this.truncate(data.i,12,true);\n\t\t if(f == \"7i\") data.i = this.truncate(data.i,7,true);\n\t\t if(f == \"5rX\") data.i = this.decode_x(data.x);\n\t\t if(f == \"X5r\"){\n\t\t     data.s = data.r;\n\t\t     data.r = this.decode_x(data.x);\n\t\t }\n\t\t if(f == \"5r6s\"){\n\t\t     var temp = data.r;\n\t\t     data.r = data.s;\n\t\t     data.s = temp;\n\t\t }\n\t\t for(var mnemonic in this.instructions){\n\t\t     inst = this.instructions[mnemonic];\n\t\t     if(inst.format == f && inst.c == data.c){\n\t\t\t return new this.instruction(x,mnemonic,data,inst.exec,addr,this);\n\t\t     }\n\t\t }\n\t     }\n\t     return {\"error\":\"Could not decode instruction: \" + x};\n\t },\n\t label: function(name, addr){\n\t     this.label = true;\n\t     this.name = name;\n\t     this.addr = addr;\n\t },\n\t output_mux: function(){\n\t     this.SEL_ADDR = 0;\n\t     this.SEL_LEN = 255;\n\t     this.LCD_OUT = 1;\n\t     this.LB_OUT = 2;\n\t     this.target = 0;\n\t     this.len = 0;\n\t     this.state = 0;\n\t     this.input = function(val){\n\t\t if(this.state == this.SEL_ADDR) {\n\t\t     this.target = val;\n\t\t     this.state = this.SEL_LEN;\n\t\t }\n\t\t else if(this.state == this.SEL_LEN){\n\t\t     this.len = val;\n\t\t     this.state = this.target;\n\t\t     this.target = 0;\n\t\t }\n\t\t else if(this.len > 0){\n\t\t     if(this.state-1 < this.output_devs.length)\n\t\t\t this.output_devs.input(val);\n\t\t     this.len--;\n\t\t }\n\t\t else{\n\t\t     this.state = this.SEL_ADDR;\n\t\t }\n\t     }\n\t },\n\t lcd: function(){\n\t     this.input = function(val){\n\t\t \n\t     }\n\t },\n\t set_PM_display_mode: function(m){\n\t     this.PM_display_mode = m;\n\t },\n\t set_RAM_display_mode: function(m){\n\t     this.RAM_display_mode = m;\n\t },\n\t set_RF_display_mode: function(m){\n\t     this.RF_display_mode = m;\n\t },\n\t instruction: function(text, mnemonic, data, exec, addr, parent){\n\t     console.log(this);\n\t     this.parent = parent;\n\t     this.label = false;\n\t     this.addr = addr;\n\t     this.text = text;\n\t     this.c = data.c;\n\t     this.r = data.r;\n\t     this.s = data.s;\n\t     this.i = data.i;\n\t     this.exec = exec;\n\t     this.mnemonic = mnemonic;\n\t     console.log(this.text, this.c, this.r, this.s, this.i, this.mnemonic);\n\t     this.format = this.parent.instructions[this.mnemonic].format;\n\t     if(this.i.match){\n\t\t var matches = this.i.match(/(lo|hi)8\\(([a-zA-Z_][a-zA-Z0-9_]*)\\)/);\n\t\t if(matches){\n\t\t     if(matches[2] in this.parent.symbols){\n\t\t\t if(matches[1] == \"lo\") this.i = this.parent.truncate(this.parent.symbols[matches[2]],8,false);\n\t\t\t if(matches[1] == \"hi\") this.i = this.parent.truncate(this.parent.symbols[matches[2]]>>8,8,false);\n\t\t     }\n\t\t     else{\n\t\t\t this.error = \"Symbol not found \" + matches[2];\n\t\t     }\n\t\t }\n\t\t else if(this.i in this.parent.symbols){\n\t\t     this.i = this.parent.symbols[this.i];\n\t\t     var fmt = this.parent.formats[this.format];\n\t\t     //this.parent.debug_log(this.parent.symbols,fmt.i_bits);\n\t\t     if(fmt.i_bits){\n\t\t\t this.i = this.parent.truncate(this.i - this.addr - 1,fmt.i_bits,true);\n\t\t     }\n\t\t }\n\t\t else if(/'[^'\\\\]'/.test(this.i)){\n\t\t     this.i = this.i.charCodeAt(1);\n\t\t }\n\t\t else if(this.i == \"'\\\\''\"){\n\t\t     this.i = this.i.charCodeAt(2);\n\t\t }\n\t\t else if(this.i == \"'\\\\\\\\'\"){\n\t\t     this.i = this.i.charCodeAt(2);\n\t\t }\n\t\t else if(this.i == \"'\\\\n'\"){\n\t\t     this.i = 10;\n\t\t }\n\t\t else if(this.i == \"'\\\\t'\"){\n\t\t     this.i = 9;\n\t\t }\n\t\t else if(/^[XYZ]$|^[XYZ]\\+$|^-[XYZ]$/.test(this.i)){\n\t\t     this.i = this.i;\n\t\t }\n\t\t else this.i = parseInt(this.i);\n\t     }\n\t     this.encoding = this.parent.encode(this.format, this.c, this.r, this.s, this.i < 0 ? this.parent.truncate(this.i,this.parent.formats[this.format].i_bits,false) : this.i);\n\t     //this.debug_log(this.text, this.c, this.r, this.s, this.i, this.mnemonic);\n\t     var self = this;\n\t     this.display = function(){\n\t\t if(this.parent.PM_display_mode == \"t\"){\n\t\t     return this.parent.formats[self.format].to_string(self.mnemonic,self.c,self.r,self.s,self.i);\n\t\t }\n\t\t else if(this.parent.PM_display_mode == \"d\"){\n\t\t     return self.encoding;\n\t\t }\n\t\t else if(this.parent.PM_display_mode == \"h\"){\n\t\t     var s = self.encoding.toString(16);\n\t\t     return \"0x\"+this.parent.smul(\"0\",4 - s.length)+s;\n\t\t }\n\t\t else if(this.parent.PM_display_mode == \"b\"){\n\t\t     var s = self.encoding.toString(2);\n\t\t     return this.parent.smul(\"0\",16 - s.length) + s;\n\t\t }\n\t     }\n\t     this.check_valid = function(){\n\t\t return this.parent.formats[self.format].validator(self.c, self.r, self.s, self.i);\n\t     }\n\t     this.run = function(){\n\t\t self.exec(self.c, self.r, self.s, self.i);\n\t     }\n\t },\n\t step: function(){\n\t     if(!this.running) return;\n\t     this.debug_log(this.steps.count);\n\t     for(var k = 0; k < this.steps.count; k++){\n\t\t var i = this.PM[this.PC];\n\t\t this.debug_log(\"i\",i);\n\t\t i.run();\n\t\t if(this.PC < this.display_pm_start || this.PC >= this.display_pm_start + this.display_pm_length){\n\t\t     this.display_pm_start = Math.max(0, this.PC - this.display_ram_length/2);\n\t\t }\n\t\t if(this.ram_updated.length > 0){\n\t\t     this.display_ram_start = Math.max(0, Math.min.apply(Math, this.ram_updated) - this.display_ram_length/2);\n\t\t }\n\t     }\n\t },\n\t raise_error: function(s){\n\t     this.status = \"Error: \" + s;\n\t },\n\t truncate: function(num, bits, twos_complement){\n\t     var mod = 1<<bits;\n\t     num = ((num % mod)+mod)%mod;\n\t     return twos_complement ? (num >= 1<<(bits - 1) ? num - (1<<bits) : num) : num;\n\t },\n\t update_sreg: function(result, z, c, n){\n\t     this.debug_log(\"SREG for\",result);\n\t     if(z) this.Z = this.truncate(result,8,false) == 0 ? 1 : 0;\n\t     if(c) this.C = result >= 256 || result < 0 ? 1 : 0;\n\t     if(n) this.N = this.truncate(result,8,true) <0 ? 1 : 0;\n\t },\n\t read_IO: function(s){\n\t     if(s == 16) return this.PIND & (~(this.DDRD));\n\t     else if(s == 17) return this.DDRD;\n\t     else if(s == 61) return this.SPL;\n\t     else if(s == 62) return this.SPH;\n\t     return 0;\n\t },\n\t write_IO: function(s,val){\n\t     if(s == 18){\n\t\t this.PORTD = this.DDRD & val;\n\t\t this.output();\n\t     }\n\t     else if(s == 17) this.DDRD = this.truncate(val,8,false);\n\t     else if(s == 61) this.SPL = this.truncate(val,8,false);\n\t     else if(s == 62) this.SPH = this.truncate(val,8,false);\n\t     if(this.output_type.selection == \"simple\"){\n\t\t this.PIND = 0;\n\t\t for(var i = 0; i < 8; i++)\n\t\t     this.PIND |= (this.io_state.switch_state[i] == \"ON\" ? 1 << i : 0)\n\t\t this.PIND &= ~this.DDRD;\n\t     }\n\t },\n\t inc_ptr: function(reg){\n\t     if(this.RF[reg] == -1 || this.RF[reg] == 255){\n\t\t this.RF[reg] = 0\n\t\t this.RF[reg+1] = this.truncate(this.RF[reg+1]+1,8,false);\n\t     }\n\t     else this.RF[reg]++;\n\t     if(this.RF[reg] == 128){\n\t\t this.RF[reg] = -128;\n\t     }\n\t },\n\t dec_ptr: function(reg){\n\t     this.RF[reg]--;\n\t     if(this.RF[reg] == -1){\n\t\t this.RF[reg+1] = this.truncate(this.RF[reg+1]-1,8,false);\n\t     }\n\t     if(this.RF[reg] < -128){\n\t\t this.RF[reg] = 127;\n\t     }\n\t },\n\t incSP: function(){\n\t     this.SPL++;\n\t     if(this.SPL == 256){\n\t\t this.SPL = 0;\n\t\t this.SPH = this.truncate(this.SPH+1,8,false);\n\t     }\n\t },\n\t decSP: function(){\n\t     this.SPL--;\n\t     if(this.SPL == -1){\n\t\t this.SPL = 255;\n\t\t this.SPH = this.truncate(this.SPH-1,8,false);\n\t     }\n\t },\n\t io_switch: function(i){\n\t     if(this.io_state.switch_state[i] == \"ON\"){\n\t\t this.io_state.switch_state[i] = \"OFF\";\n\t\t this.PIND &= ~(1<<i);\n\t     }\n\t     else if(this.io_state.switch_state[i] == \"OFF\"){\n\t\t this.io_state.switch_state[i] = \"ON\";\n\t\t this.PIND |= 1<<i;\n\t     }\n\t     this.PIND = this.PIND & ~this.DDRD;\n\t },\n\t output: function(){\n\t     var out_val = this.PORTD;\n\t     this.outputs.push(out_val);\n\t     //this.outputs.push(String.fromCharCode(out_val));\n\t },\n\t initialize: function(){\n\t     this.reset_program();\n\t     this.cm_setup();\n\t },\n\t end: function(){\n\t     if(!this.running) return;\n\t     this.running = false;\n\t     setTimeout(this.cm_setup, 0);\n\t }\n\n     },\n     created: function(){\n\t console.log(\"init\");\n\t this.$store.dispatch(\"RESET_PLUGIN_DATA\",\"math\");\n\t //Guppy.init({\"path\":\"/node_modules/guppy-js\",\"symbols\":\"/node_modules/guppy-js/sym/symbols.json\"});\n     }, \n     mounted: function(){\n\t console.log(\"Hello JSAVR\");\n\t console.log(this.instructions);\n\t this.program = this.root.innerHTML.trim();\n\t this.reset(true);\n\t this.original_program = this.program;\n\t this.initialize();\n\n\t this.debug_log = this.debug_mode_feature == 'yes' ? console.log.bind(console) : this.do_nothing;\n\t if(this.control){\n\t     this.control.set_program = function(new_prog){\n\t\t this.change_program(new_prog);\n\t     }\n\t     this.control.get_program = function(){\n\t\t if(this.editor) this.program = this.editor.getValue();\n\t\t return this.program;\n\t     }\n\t     this.control.get_PM = function(addr){\n\t\t return this.PM[addr].encoding;\n\t     }\n\t     this.control.get_RF = function(){\n\t\t return this.RF;\n\t     }\n\t     this.control.get_RAM = function(addr){\n\t\t return this.RAM[addr];\n\t     }\n\t     this.control.get_other = function(){\n\t\t return {\n\t\t     \"PC\":this.PC,\n\t\t     \"Z\":this.Z,\n\t\t     \"C\":this.C,\n\t\t     \"N\":this.N,\n\t\t     \"DDRD\":this.DDRD,\n\t\t     \"PIND\":this.PIND,\n\t\t     \"PORTD\":this.PORTD,\n\t\t     \"SPL\":this.SPL,\n\t\t     \"SPH\":this.SPH\n\t\t }\n\t     }\n\t }\n\t /* \n\t  * \t \n\t  * \t var index = 0;\n\t  * \t var doc_id = node+\"-\"+index;\n\t  * \t var content = this.root.innerHTML.trim()\n\t  * \t console.log(\"R\",this.root,content);\n\t  * \t //var res = Guppy.Doc.render(content, \"text\");\n\t  * \t var res = {doc:content};\n\t  * \t var doc_data = {};\n\t  * \t //doc_data[index] = res.doc.get_vars().concat(res.doc.get_symbols());\n\t  * \t doc_data[index] = [\"x\"];\n\t  * \t //res.container.setAttribute(\"id\",\"category-math-container-\"+doc_id);\n\t  * \t //var rendered_content = (new XMLSerializer()).serializeToString(res.container);\n\t  * \n\t  * \t \n\t  * \t // Put this doc ID in the index for each var and symbol in the document\n\t  * \t for(var i = 0; i < this.docs[node][index].length; i++) {\n\t  * \t     var v = this.docs[node][index][i];\n\t  * \t     if (!this.index[v]) this.index[v] = [];\n\t  * \t     if (this.index[v].indexOf(doc_id) < 0) this.index[v].push(doc_id);\n\t  * \t }\n\t  * \n\t  * \t // Calculate the snippet that will be associated with this expression when it appears in listings\n\t  * \t var snippet = \"\";\n\t  * \t if(this.root.previousSibling){\n\t  * \t     snippet += this.root.previousSibling.textContent.split(\" \").slice(-4).join(\" \");\n\t  * \t }\n\t  * \t snippet += \" [formula] \"\n\t  * \n\t  * \t if(this.root.nextSibling) {\n\t  * \t     snippet += this.root.nextSibling.textContent.split(\" \").slice(0,4).join(\" \");\n\t  * \t }\n\t  * \t snippet = \"...\" + snippet + \"...\";\n\t  * \t console.log(\"parprev\",this.root.parentNode.previousSibling);\n\t  * \t console.log(\"parnext\",this.root.parentNode.nextSibling);\n\t  * \t this.snippets[doc_id] = snippet;\n\t  * \n\t  * \t // Finally, set up component attributes\n\t  * \t this.syms = this.docs[node][index];\n\t  * \t this.rendered = rendered_content;\n\t  * \t this.display_syms = false;\n\t  * \t this.id = doc_id;\n\t  * \t this.query = \"\";\n\t  * \t this.node = node;*/\n     }\n }\n</script>\n<style scoped>\n .simavr{\n     display:inline-block;\n     width:73em;\n     /* min-height:40em; */\n     font-size:10pt;\n }\n #simavr_rf{\n     float:left;\n     width:16em;\n     border:1px solid #aaa;\n     text-align:center;\n }\n\n #simavr_pm{\n     float:left;\n     width:13em;\n     border:1px solid #aaa;\n     text-align:center;\n }\n\n #simavr_ram{\n     float:left;\n     width:10em;\n     border:1px solid #aaa;\n     text-align:center;\n }\n\n #simavr_other{\n     float:left;\n     width:10em;\n     border:1px solid #aaa;\n     text-align:center;\n }\n\n .simavr_title{\n     width:100%;\n     text-align:center;\n     display:inline-block;\n     font-size:12pt;\n     margin:auto;\n     padding-bottom:5px;\n     line-height:2.5em;\n }\n\n .simavr_status{\n     display:inline-block;\n     padding:5px;\n     border-left:1px solid #aaa;\n     /* border-radius:5px; */\n     margin:5px;\n     width:45%;\n     font-size:9pt;\n     float:right;    \n }\n\n .active_line{\n     background-color:#f66;\n }\n .simavr_label{\n     font-size:10pt;\n     color:#333;\n     display:inline-block;\n     width:2em;\n }\n .simavr_label_long{\n     font-size:10pt;\n     color:#333;\n     display:inline-block;\n     margin-right:0.5ex;\n     min-width:2em;\n }\n\n .simavr_reg{\n     text-align:left;\n     display:inline-block;\n     padding:4px;\n     /*margin:0 2px 2px 0;*/\n     width:7em;\n }\n .simavr_pm{\n     text-align:left;\n     display:inline-block;\n     padding:4px;\n     /*margin:0 2px 2px 0;*/\n     width:12em;\n }\n\n .simavr_mem_start{\n     padding:4px;\n     width:4em;\n     margin:4px;\n }\n\n .simavr_ram{\n     text-align:left;\n     display:inline-block;\n     padding:4px;\n     /*margin:0 2px 2px 0;*/\n     width:7em;\n }\n\n .simavr_controls{\n     display:inline-block;\n     width:90%;\n     height:50px;\n     border: 2px solid #ccc;\n     margin:auto;\n     margin-bottom:5px;\n }\n\n .simavr_programming{\n     display:inline-block;\n     float:left;\n     width:70%;\n }\n\n .simavr_output_container{\n     display:inline-block;\n     float:left;\n     width:25%;\n }\n\n .simavr_simulator{\n     display:inline-block;\n     float:left;\n     width:75%;\n }\n\n .simavr_output{\n     display:inline-block;\n     padding:5px;\n     width:90%;\n     border:1px solid #aaa;\n     overflow-x:scroll;\n     overflow-y:scroll;\n }\n\n .simavr_program{\n     width:90%;\n }\n\n .simavr_normal{\n     background-color:#c66;\n }\n\n .simavr_updated{\n     background-color:#6c6;\n }\n\n .simavr_active{\n     background-color:#cc6;\n }\n\n .simavr_display_button{\n     display:inline-block;\n     padding:2px;\n }\n\n .simavr_enabled_button{\n     background-color:#66a;\n }\n\n .simavr_disabled_button{\n     background-color:#aaa;\n }\n\n .simavr_display_button:hover{\n     display:inline-block;\n     cursor:pointer;\n     color:#f33;\n }\n .simavr_button{\n     display:inline-block;\n     padding:8px;\n     border-radius:5px;\n     height:25px;\n     color:white;\n     margin:5px;\n     cursor:pointer;\n }\n\n .simavr_button:hover{\n     display:inline-block;\n     cursor:pointer;\n     color:#f33;\n }\n\n .simavr_io_num{\n     width:3em;\n     border:3px solid black;\n     background-color:#363;\n     color:#ff4;\n     font-size:17pt;\n     padding:5px;\n }\n\n .simavr_io_switch{\n     display:inline-block;\n     width:3em;\n     border:3px solid black;\n     font-size:17pt;\n     padding:5px;\n     cursor:pointer;\n }\n\n .simavr_io_switch_on{\n     background-color:#3f3;\n }\n\n .simavr_io_switch_off{\n     background-color:#f33;\n }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$d = "data-v-01dd48c1";
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject SSR */
    

    
    var JSAVRPlugin = normalizeComponent_1(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$c,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      browser,
      undefined
    );

  /* parser generated by jison 0.4.18 */
  /*
    Returns a Parser object of the following structure:

    Parser: {
      yy: {}
    }

    Parser.prototype: {
      yy: {},
      trace: function(),
      symbols_: {associative list: name ==> number},
      terminals_: {associative list: number ==> name},
      productions_: [...],
      performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
      table: [...],
      defaultActions: {...},
      parseError: function(str, hash),
      parse: function(input),

      lexer: {
          EOF: 1,
          parseError: function(str, hash),
          setInput: function(input),
          input: function(),
          unput: function(str),
          more: function(),
          less: function(n),
          pastInput: function(),
          upcomingInput: function(),
          showPosition: function(),
          test_match: function(regex_match_array, rule_index),
          next: function(),
          lex: function(),
          begin: function(condition),
          popState: function(),
          _currentRules: function(),
          topState: function(),
          pushState: function(condition),

          options: {
              ranges: boolean           (optional: true ==> token location info will include a .range[] member)
              flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
              backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
          },

          performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
          rules: [...],
          conditions: {associative list: name ==> set},
      }
    }


    token location info (@$, _$, etc.): {
      first_line: n,
      last_line: n,
      first_column: n,
      last_column: n,
      range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
    }


    the parseError function receives a 'hash' object with these members for lexer and parser errors: {
      text:        (matched text)
      token:       (the produced terminal token, if any)
      line:        (yylineno)
    }
    while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
      loc:         (yylloc)
      expected:    (string describing the set of expected tokens)
      recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
    }
  */
  var query = (function(){
  var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[1,5],$V2=[1,8],$V3=[1,6],$V4=[1,7],$V5=[1,10],$V6=[1,11],$V7=[1,13],$V8=[1,14],$V9=[5,12,15,16],$Va=[5,9,10,12,15,16],$Vb=[5,9,10,12,15,16,19];
  var parser = {trace: function trace () { },
  yy: {},
  symbols_: {"error":2,"query":3,"q":4,"EOF":5,"name":6,"HAS":7,"IS":8,":":9,"OF":10,"(":11,")":12,".":13,"!":14,",":15,"/":16,"words":17,"*":18,"STR":19,"$accept":0,"$end":1},
  terminals_: {2:"error",5:"EOF",7:"HAS",8:"IS",9:":",10:"OF",11:"(",12:")",13:".",14:"!",15:",",16:"/",18:"*",19:"STR"},
  productions_: [0,[3,2],[4,1],[4,2],[4,2],[4,4],[4,4],[4,6],[4,6],[4,4],[4,2],[4,4],[4,3],[4,3],[4,3],[6,1],[6,1],[17,2],[17,1]],
  performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
  /* this == yyval */

  var $0 = $$.length - 1;
  switch (yystate) {
  case 1:
   return $$[$0-1]; 
  case 2:
  this.$ = ["name",$$[$0]];
  break;
  case 3:
  this.$ = ["edge",{"name":$$[$0],"dir":"has"}];
  break;
  case 4:
  this.$ = ["edge",{"name":$$[$0],"dir":"is"}];
  break;
  case 5:
  this.$ = ["edge",{"name":$$[$0-2],"dir":"has","query":["name",$$[$0]]}];
  break;
  case 6:
  this.$ = ["edge",{"name":$$[$0-3],"dir":"is","query":["name",$$[$0]]}];
  break;
  case 7:
  this.$ = ["edge",{"name":$$[$0-4],"dir":"has","query":$$[$0-1]}];
  break;
  case 8:
  this.$ = ["edge",{"name":$$[$0-5],"dir":"is","query":$$[$0-1]}];
  break;
  case 9:
  this.$ = ["prop",[$$[$0-2],$$[$0]]];
  break;
  case 10:
  this.$ = ["not",[["name",$$[$0]]]];
  break;
  case 11:
  this.$ = ["not",[$$[$0-1]]];
  break;
  case 12:
  this.$ = $$[$0-1];
  break;
  case 13:
  this.$ = ["and",[$$[$0-2], $$[$0]]];
  break;
  case 14:
  this.$ = ["or",[$$[$0-2], $$[$0]]];
  break;
  case 15:
  this.$ = $$[$0];
  break;
  case 16:
  this.$ = "*";
  break;
  case 17:
  this.$ = $$[$0-1] +" "+ $$[$0];
  break;
  case 18:
  this.$ = $$[$0];
  break;
  }
  },
  table: [{3:1,4:2,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},{1:[3]},{5:[1,12],15:$V7,16:$V8},o($V9,[2,2],{10:[1,15]}),{6:16,17:9,18:$V5,19:$V6},{6:17,17:9,18:$V5,19:$V6},{6:18,17:9,18:$V5,19:$V6},{6:19,11:[1,20],17:9,18:$V5,19:$V6},{4:21,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},o($Va,[2,15],{19:[1,22]}),o($Va,[2,16]),o($Vb,[2,18]),{1:[2,1]},{4:23,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},{4:24,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},{9:[1,25]},o($V9,[2,3],{9:[1,26]}),o($V9,[2,4]),{9:[1,27]},o($V9,[2,10]),{4:28,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},{12:[1,29],15:$V7,16:$V8},o($Vb,[2,17]),o($V9,[2,13]),o([5,12,16],[2,14],{15:$V7}),{6:30,11:[1,31],17:9,18:$V5,19:$V6},{6:32,11:[1,33],17:9,18:$V5,19:$V6},{6:34,17:9,18:$V5,19:$V6},{12:[1,35],15:$V7,16:$V8},o($V9,[2,12]),o($V9,[2,6]),{4:36,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},o($V9,[2,5]),{4:37,6:3,7:$V0,8:$V1,11:$V2,13:$V3,14:$V4,17:9,18:$V5,19:$V6},o($V9,[2,9]),o($V9,[2,11]),{12:[1,38],15:$V7,16:$V8},{12:[1,39],15:$V7,16:$V8},o($V9,[2,8]),o($V9,[2,7])],
  defaultActions: {12:[2,1]},
  parseError: function parseError (str, hash) {
      if (hash.recoverable) {
          this.trace(str);
      } else {
          var error = new Error(str);
          error.hash = hash;
          throw error;
      }
  },
  parse: function parse(input) {
      var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer = Object.create(this.lexer);
      var sharedState = { yy: {} };
      for (var k in this.yy) {
          if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
              sharedState.yy[k] = this.yy[k];
          }
      }
      lexer.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer;
      sharedState.yy.parser = this;
      if (typeof lexer.yylloc == 'undefined') {
          lexer.yylloc = {};
      }
      var yyloc = lexer.yylloc;
      lstack.push(yyloc);
      var ranges = lexer.options && lexer.options.ranges;
      if (typeof sharedState.yy.parseError === 'function') {
          this.parseError = sharedState.yy.parseError;
      } else {
          this.parseError = Object.getPrototypeOf(this).parseError;
      }
      
          var lex = function () {
              var token;
              token = lexer.lex() || EOF;
              if (typeof token !== 'number') {
                  token = self.symbols_[token] || token;
              }
              return token;
          };
      var symbol, preErrorSymbol, state, action, r, yyval = {}, p, len, newState, expected;
      while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
              action = this.defaultActions[state];
          } else {
              if (symbol === null || typeof symbol == 'undefined') {
                  symbol = lex();
              }
              action = table[state] && table[state][symbol];
          }
                      if (typeof action === 'undefined' || !action.length || !action[0]) {
                  var errStr = '';
                  expected = [];
                  for (p in table[state]) {
                      if (this.terminals_[p] && p > TERROR) {
                          expected.push('\'' + this.terminals_[p] + '\'');
                      }
                  }
                  if (lexer.showPosition) {
                      errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                  } else {
                      errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                  }
                  this.parseError(errStr, {
                      text: lexer.match,
                      token: this.terminals_[symbol] || symbol,
                      line: lexer.yylineno,
                      loc: yyloc,
                      expected: expected
                  });
              }
          if (action[0] instanceof Array && action.length > 1) {
              throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
          }
          switch (action[0]) {
          case 1:
              stack.push(symbol);
              vstack.push(lexer.yytext);
              lstack.push(lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                  yyleng = lexer.yyleng;
                  yytext = lexer.yytext;
                  yylineno = lexer.yylineno;
                  yyloc = lexer.yylloc;
              } else {
                  symbol = preErrorSymbol;
                  preErrorSymbol = null;
              }
              break;
          case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {
                  first_line: lstack[lstack.length - (len || 1)].first_line,
                  last_line: lstack[lstack.length - 1].last_line,
                  first_column: lstack[lstack.length - (len || 1)].first_column,
                  last_column: lstack[lstack.length - 1].last_column
              };
              if (ranges) {
                  yyval._$.range = [
                      lstack[lstack.length - (len || 1)].range[0],
                      lstack[lstack.length - 1].range[1]
                  ];
              }
              r = this.performAction.apply(yyval, [
                  yytext,
                  yyleng,
                  yylineno,
                  sharedState.yy,
                  action[1],
                  vstack,
                  lstack
              ].concat(args));
              if (typeof r !== 'undefined') {
                  return r;
              }
              if (len) {
                  stack = stack.slice(0, -1 * len * 2);
                  vstack = vstack.slice(0, -1 * len);
                  lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
          case 3:
              return true;
          }
      }
      return true;
  }};
  /* generated by jison-lex 0.3.4 */
  var lexer = (function(){
  var lexer = ({

  EOF:1,

  parseError:function parseError(str, hash) {
          if (this.yy.parser) {
              this.yy.parser.parseError(str, hash);
          } else {
              throw new Error(str);
          }
      },

  // resets the lexer, sets new input
  setInput:function (input, yy) {
          this.yy = yy || this.yy || {};
          this._input = input;
          this._more = this._backtrack = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = '';
          this.conditionStack = ['INITIAL'];
          this.yylloc = {
              first_line: 1,
              first_column: 0,
              last_line: 1,
              last_column: 0
          };
          if (this.options.ranges) {
              this.yylloc.range = [0,0];
          }
          this.offset = 0;
          return this;
      },

  // consumes and returns one char from the input
  input:function () {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno++;
              this.yylloc.last_line++;
          } else {
              this.yylloc.last_column++;
          }
          if (this.options.ranges) {
              this.yylloc.range[1]++;
          }

          this._input = this._input.slice(1);
          return ch;
      },

  // unshifts one char (or a string) into the input
  unput:function (ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);

          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length - len);
          //this.yyleng -= len;
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1);
          this.matched = this.matched.substr(0, this.matched.length - 1);

          if (lines.length - 1) {
              this.yylineno -= lines.length - 1;
          }
          var r = this.yylloc.range;

          this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: lines ?
                  (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                   + oldLines[oldLines.length - lines.length].length - lines[0].length :
                this.yylloc.first_column - len
          };

          if (this.options.ranges) {
              this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          this.yyleng = this.yytext.length;
          return this;
      },

  // When called from action, caches matched text and appends it on next action
  more:function () {
          this._more = true;
          return this;
      },

  // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
  reject:function () {
          if (this.options.backtrack_lexer) {
              this._backtrack = true;
          } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                  text: "",
                  token: null,
                  line: this.yylineno
              });

          }
          return this;
      },

  // retain first n characters of the match
  less:function (n) {
          this.unput(this.match.slice(n));
      },

  // displays already matched input, i.e. for error messages
  pastInput:function () {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
      },

  // displays upcoming input, i.e. for error messages
  upcomingInput:function () {
          var next = this.match;
          if (next.length < 20) {
              next += this._input.substr(0, 20-next.length);
          }
          return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
      },

  // displays the character position where the lexing error occurred, i.e. for error messages
  showPosition:function () {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c + "^";
      },

  // test the lexed token: return FALSE when not a match, otherwise return token
  test_match:function(match, indexed_rule) {
          var token,
              lines,
              backup;

          if (this.options.backtrack_lexer) {
              // save context
              backup = {
                  yylineno: this.yylineno,
                  yylloc: {
                      first_line: this.yylloc.first_line,
                      last_line: this.last_line,
                      first_column: this.yylloc.first_column,
                      last_column: this.yylloc.last_column
                  },
                  yytext: this.yytext,
                  match: this.match,
                  matches: this.matches,
                  matched: this.matched,
                  yyleng: this.yyleng,
                  offset: this.offset,
                  _more: this._more,
                  _input: this._input,
                  yy: this.yy,
                  conditionStack: this.conditionStack.slice(0),
                  done: this.done
              };
              if (this.options.ranges) {
                  backup.yylloc.range = this.yylloc.range.slice(0);
              }
          }

          lines = match[0].match(/(?:\r\n?|\n).*/g);
          if (lines) {
              this.yylineno += lines.length;
          }
          this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: lines ?
                           lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                           this.yylloc.last_column + match[0].length
          };
          this.yytext += match[0];
          this.match += match[0];
          this.matches = match;
          this.yyleng = this.yytext.length;
          if (this.options.ranges) {
              this.yylloc.range = [this.offset, this.offset += this.yyleng];
          }
          this._more = false;
          this._backtrack = false;
          this._input = this._input.slice(match[0].length);
          this.matched += match[0];
          token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
          if (this.done && this._input) {
              this.done = false;
          }
          if (token) {
              return token;
          } else if (this._backtrack) {
              // recover context
              for (var k in backup) {
                  this[k] = backup[k];
              }
              return false; // rule action called reject() implying the next rule should be tested instead.
          }
          return false;
      },

  // return next match in input
  next:function () {
          if (this.done) {
              return this.EOF;
          }
          if (!this._input) {
              this.done = true;
          }

          var token,
              match,
              tempMatch,
              index;
          if (!this._more) {
              this.yytext = '';
              this.match = '';
          }
          var rules = this._currentRules();
          for (var i = 0; i < rules.length; i++) {
              tempMatch = this._input.match(this.rules[rules[i]]);
              if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                  match = tempMatch;
                  index = i;
                  if (this.options.backtrack_lexer) {
                      token = this.test_match(tempMatch, rules[i]);
                      if (token !== false) {
                          return token;
                      } else if (this._backtrack) {
                          match = false;
                          continue; // rule action called reject() implying a rule MISmatch.
                      } else {
                          // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                          return false;
                      }
                  } else if (!this.options.flex) {
                      break;
                  }
              }
          }
          if (match) {
              token = this.test_match(match, rules[index]);
              if (token !== false) {
                  return token;
              }
              // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
              return false;
          }
          if (this._input === "") {
              return this.EOF;
          } else {
              return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                  text: "",
                  token: null,
                  line: this.yylineno
              });
          }
      },

  // return next match that has a token
  lex:function lex () {
          var r = this.next();
          if (r) {
              return r;
          } else {
              return this.lex();
          }
      },

  // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
  begin:function begin (condition) {
          this.conditionStack.push(condition);
      },

  // pop the previously active lexer condition state off the condition stack
  popState:function popState () {
          var n = this.conditionStack.length - 1;
          if (n > 0) {
              return this.conditionStack.pop();
          } else {
              return this.conditionStack[0];
          }
      },

  // produce the lexer rule set which is active for the currently active lexer condition state
  _currentRules:function _currentRules () {
          if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
              return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
          } else {
              return this.conditions["INITIAL"].rules;
          }
      },

  // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
  topState:function topState (n) {
          n = this.conditionStack.length - 1 - Math.abs(n || 0);
          if (n >= 0) {
              return this.conditionStack[n];
          } else {
              return "INITIAL";
          }
      },

  // alias for begin(condition)
  pushState:function pushState (condition) {
          this.begin(condition);
      },

  // return the number of states currently on the stack
  stateStackSize:function stateStackSize() {
          return this.conditionStack.length;
      },
  options: {},
  performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
  switch($avoiding_name_collisions) {
  case 0:/* skip whitespace */
  break;
  case 1:return 14
  case 2:return 18
  case 3:return 16
  case 4:return ';'
  case 5:return 9
  case 6:return 15
  case 7:return 13
  case 8:return 11
  case 9:return 12
  case 10:return 7
  case 11:return 8
  case 12:return 10
  case 13:return 'C'
  case 14:return 19
  case 15:return 5
  case 16:return 'INVALID'
  }
  },
  rules: [/^(?:\s+)/,/^(?:!)/,/^(?:\*)/,/^(?:\/)/,/^(?:;)/,/^(?::)/,/^(?:,)/,/^(?:\.)/,/^(?:\()/,/^(?:\))/,/^(?:has\b)/,/^(?:is\b)/,/^(?:of\b)/,/^(?:c\b)/,/^(?:(?!has)(?!of)[^*;\/,:.()! ]+)/,/^(?:$)/,/^(?:.)/],
  conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],"inclusive":true}}
  });
  return lexer;
  })();
  parser.lexer = lexer;
  function Parser () {
    this.yy = {};
  }
  Parser.prototype = parser;parser.Parser = Parser;
  return new Parser;
  })();var query_1 = query;

  var intersect_lists = function(l1,l2){
      var result = [];
      for(var i = 0; i < l1.length; i++){
  	for(var j = 0; j < l2.length; j++){
  	    if(l1[i] == l2[j]) result.push(l1[i]);
  	}
      }
      return result;
  };

  var union_lists = function(l1,l2){
      var result = [].concat(l1);
      for(var i = 0; i < l2.length; i++){
  	var found = false;
  	for(var j = 0; j < l1.length; j++){
  	    if(l2[i] == l1[j]){
  		found = true;
  		break;
  	    }
  	}
  	if(!found) result.push(l2[i]);
      }
      return result;
  };

  // removes everything in l2 from l1
  var remove_all = function(l1,l2){
      var result = [];
      for(var i = 0; i < l1.length; i++){
  	var found = false;
  	for(var j = 0; j < l2.length; j++){
  	    if(l1[i] == l2[j]){
  		found = true;
  		break;
  	    }
  	}
  	if(!found) result.push(l1[i]);
      }
      return result;
  };

  var search = function(q, nodes){
      var result = [];
      if(!q || q.length == 0){
  	for(var n in nodes){
  	    result.push(n);
  	}
      }
      else if(q[0] == "and"){
  	result = search(q[1][0],nodes);
  	for(var i = 1; i < q[1].length; i++){
  	    var res = search(q[1][i],nodes);
  	    result = intersect_lists(result,res);
  	}
      }
      else if(q[0] == "or"){
  	for(var i = 0; i < q[1].length; i++){
  	    var res = search(q[1][i],nodes);
  	    result = union_lists(result,res);
  	}
      }
      else if(q[0] == "not"){
  	result = Object.keys(nodes);
  	for(var i = 0; i < q[1].length; i++){
  	    var res = search(q[1][i],nodes);
  	    result = remove_all(result,res);
  	}
      }
      else if(q[0] == "edge"){
  	var edge = q[1];
  	var res = search(edge.query,nodes);
  	for(var i = 0; i < res.length; i++){
  	    var node_id = res[i];
  	    for(var n in nodes){
  		if(edge.name == "*"){
  		    for(var e in nodes[n].edges[edge.dir]){
  			if(nodes[n].edges[edge.dir][e].indexOf(node_id) >= 0){
  			    result = union_lists(result,[n]);
  			    break;
  			}
  		    }
  		}
  		else if(edge.name in nodes[n].edges[edge.dir] && nodes[n].edges[edge.dir][edge.name].indexOf(node_id) >= 0){
  		    result = union_lists(result,[n]);
  		}
  	    }
  	}
      }
      else if(q[0] == "name"){
  	var name = q[1].toLowerCase();
  	for(var n in nodes){
  	    if(name == "*" || nodes[n].name.toLowerCase().indexOf(name) >= 0){
  		result.push(n);
  	    }
  	}
      }
      else if(q[0] == "prop"){
  	var prop_name = q[1][0].toLowerCase();
  	var prop_val = q[1][1].toLowerCase();
  	for(var n in nodes){
  	    if(nodes[n][prop_name] && nodes[n][prop_name].toLowerCase().indexOf(prop_val) >= 0){
  		result.push(n);
  	    }
  	}
      }
      else {
  	console.log("Unrecognised query type:",q[0]);
      }
      return result;
  };
  var search_1 = search;

  Vue.config.productionTip = true;

  Vue.component('nodeIndex', NodeIndex);
  Vue.component('labelIndex', LabelIndex);
  Vue.component('historyDisplay', HistoryDisplay);
  Vue.component('edgeDisplay', EdgeDisplay);

  Vue.category_plugins = {
      'cat-slideshow': Vue.component('catSlideshow', SlideshowPlugin),
      'cat-video': Vue.component('catVideo', VideoPlugin),
      'cat-query': Vue.component('catQuery', QueryPlugin),
      'cat-link': Vue.component('catLink', LinkPlugin),
      'cat-jsavr': Vue.component('catJsavr', JSAVRPlugin),
  //    'cat-math': Vue.component('catMath', MathPlugin)
  };

  Vue.category_search_plugin = Vue.component('search', SearchDisplay);

  Vue.category_query = new query_1.Parser();
  Vue.category_search = search_1;

  Vue.run_plugins = function(comp){
      for(var p in Vue.category_plugins) {
  	var plugin = Vue.category_plugins[p];
  	var l = comp.$el.getElementsByTagName(p);
  	while(l.length > 0) {
  	    var node = l[0];
  	    console.log("PL",p,node);
  	    new plugin({
  		el: node,
  		propsData: {'root': node},
  		parent: comp
  	    });
  	}
      }
  };
  window.onload = function() {
   
  new Vue({
      router,
      store,
      created: function() {
  	this.$store.dispatch('refresh_metadata');
      },
      render: function (h) { return h(App) }
  }).$mount('#cafeapp');

  };

}(Vue, VueRouter, Vuex, CodeMirror));
