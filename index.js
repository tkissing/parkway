var _ = require('underscore');
var fs = require('fs');
var path = require('path');

module.exports = (function() {
	var trailingSlash  = function(str) {
		return String(str).replace(/\/+$/, '') + '/';
	};

	var defaultDelegate = function(path, filename){
    	return filename[0] !== '.' && /\.(js|coffee)$/i.test(filename);
  	};

  	// FIXME: support *
  	var methods = ['get', 'post', 'put', 'delete', 'options'];

  	var doMergeRoute = function(existingRoutes, routeModule, routeUrl) {
  		var r = existingRoutes[routeUrl] || {};
  		var s = {};

  		_.each(routeModule, function(value, key) {
  			if (methods.indexOf(key) > -1) {
  				r[key] = value;
  			} else {
  				s[key] = value;
  			}
  		});

  		_.each(s, function(value, key) {
  			doMergeRoute(existingRoutes, value, path.join(routeUrl, key));
  		});

		//console.log('domergeRoute', routeUrl, existingRoutes, r, s);

  		existingRoutes[routeUrl.replace(/\/index$/, '/').toLowerCase()] = r;	
  	}

  	var mergeRoute = function(existingRoutes, routePath, routeUrl) {
		var mod = require(routePath);

  		doMergeRoute(existingRoutes, mod, routeUrl);
  	};

	var getRoutes = function(module, /*optional*/dir, /*optional*/urlPrefix, /*optional*/existingRoutes) {
		var result = existingRoutes || {};
		var files = [];
		var subdirs = [];
		
		dir = trailingSlash(dir || 'routes');
		urlPrefix = trailingSlash(urlPrefix || '');

		var baseDir = path.dirname(module.filename);
		var routeDir = path.join(baseDir, dir);

		// console.log('getRoutes', urlPrefix, dir, routeDir);

		fs.readdirSync(routeDir).forEach(function(filename) {
			var name = filename.substring(0, filename.lastIndexOf('.'))
			var joined = path.join(routeDir, filename);

			//console.log('joined', name, filename, joined);

			if (fs.statSync(joined).isDirectory()) {
				subdirs.push({path: trailingSlash(joined), url: path.join(urlPrefix, filename)});
			} else if (defaultDelegate(joined, filename)) {
				mergeRoute(result, joined, [urlPrefix, name].join(''));
			}
    	});

    	subdirs.forEach(function(folder) {
    		mergeRoute(result, folder.path, folder.url);
    	});

		return result;
	};
	
	var	installRoutes = function(module, app, /*optional*/dir, /*optional*/urlPrefix) {
		var routes = getRoutes(module, dir, urlPrefix);

		_.each(routes, function(value, key) {
			_.each(value, function(handler, method) {
				app[method](key, handler);
			});
		})

		return routes;
	};
	

	return {get: getRoutes, install: installRoutes};
}());