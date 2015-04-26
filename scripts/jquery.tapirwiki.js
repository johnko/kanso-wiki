(function($) {
    // functions for handling the path
    // thanks sammy.js
    // var PATH_REPLACER = "([^\/]+)",
    //      PATH_NAME_MATCHER = /:([\w\d]+)/g,
    //      QUERY_STRING_MATCHER = /\?([^#]*)$/,
    //      SPLAT_MATCHER = /(\*)/,
    //      SPLAT_REPLACER = "(.+)",
    var _currentPath,
        _lastPath,
        _pathInterval;

    function hashChanged() {
        _currentPath = getPath();
        // if path is actually changed from what we thought it was, then react
        if (_lastPath != _currentPath) {
            // return triggerOnPath(_currentPath);
            wiki.open(_currentPath);
        }
    }

    $.tapirWiki = {
        //    changeFuns : [],
        //    paths : [],
        //    begin : function(defaultPath) {
        // this should trigger the defaultPath if there's not a path in the URL
        // otherwise it should trigger the URL's path
        //      $(function() {
        //        var loadPath = getPath();
        //        if (loadPath) {
        //          triggerOnPath(loadPath);
        //        } else {
        //          goPath(defaultPath);
        //          triggerOnPath(defaultPath);
        //        }
        //      })
        //    },
        //    go : function(path) {
        //      goPath(path);
        //      triggerOnPath(path);
        //    },
        //    onChange : function (fun) {
        //      $.pathbinder.changeFuns.push(fun);
        //    },
        pageChangeReset: function(page) {
            _lastPath = _currentPath = page;
        }
    };

    function pollPath(every) {
        function hashCheck() {
            _currentPath = getPath();
            // path changed if _currentPath != _lastPath
            if (_lastPath != _currentPath) {
                setTimeout(function() {
                    $(window).trigger('hashchange');
                }, 1);
            }
        }

        hashCheck();
        _pathInterval = setInterval(hashCheck, every);
        $(window).bind('unload', function() {
            clearInterval(_pathInterval);
        });
    }

    //function triggerOnPath(path) {
    //  $.pathbinder.changeFuns.forEach(function(fun) {fun(path)});
    //  var pathSpec, path_params, params = {}, param_name, param;
    //  for (var i=0; i < $.pathbinder.paths.length; i++) {
    //    pathSpec = $.pathbinder.paths[i];
    //$.log("pathSpec", pathSpec);
    //    if ((path_params = pathSpec.matcher.exec(path)) !== null) {
    //$.log("path_params", path_params);
    //      path_params.shift();
    //      for (var j=0; j < path_params.length; j++) {
    //        param_name = pathSpec.param_names[j];
    //        param = decodeURIComponent(path_params[j]);
    //        if (param_name) {
    //          params[param_name] = param;
    //        } else {
    //          if (!params.splat) params.splat = [];
    //          params.splat.push(param);
    //        }
    //      };
    // $.log("path trigger for "+path);
    //      wiki.open(params.id);
    // return true; // removed this to allow for multi match
    //      }
    //    };
    //  };

    // bind the event
    $(function() {
        if ('onhashchange' in window) {
            // we have a native event
        } else {
            pollPath(100);
        }
        // setTimeout(hashChanged,50);
        $(window).bind('hashchange', hashChanged);
    });

    //  function registerPath(pathSpec) {
    //    $.pathbinder.paths.push(pathSpec);
    //  };

    //  function setPath(pathSpec, params) {
    //var newPath = $.mustache(pathSpec.template, params);
    //    var newPath = params
    //    goPath(newPath);
    //  };

    function goPath(newPath) {
        window.location = 'wiki.html#' + newPath;
        _lastPath = getPath();
    }

    function getPath() {
        var matches = window.location.toString().match(/^[^#]*#(.+)$/);
        return matches ? matches[1] : '';
    }

    //  function makePathSpec(path, callback) {
    //    var param_names = [];
    //    var template = "";

    //    PATH_NAME_MATCHER.lastIndex = 0;

    //    while ((path_match = PATH_NAME_MATCHER.exec(path)) !== null) {
    //      param_names.push(path_match[1]);
    //    }

    //    return {
    //      param_names : param_names,
    //      matcher : new RegExp(path.replace(
    //        PATH_NAME_MATCHER, PATH_REPLACER).replace(
    //        SPLAT_MATCHER, SPLAT_REPLACER) + "$"),
    //      template : path.replace(PATH_NAME_MATCHER, function(a, b) {
    //        return '{{'+b+'}}';
    //      }).replace(SPLAT_MATCHER, '{{splat}}'),
    //      callback : callback
    //    };
    //  };

    //  $.fn.pathbinder = function(func, path) {
    // var self = $(this);
    //    var pathSpec = makePathSpec(path, func);
    //    self.bind(name, function(ev, params) {
    // set the path when triggered
    // $.log("set path", name, pathSpec)
    //      setPath(pathSpec, params);
    //    });
    // trigger when the path matches
    //    registerPath(pathSpec);
    //  };
})(jQuery);
