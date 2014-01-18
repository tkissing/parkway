# parkway

Convention-based routing for express apps

## Usage

### Folder structure
	- package.json
	- server.js
	- routes
		- index.js
		- foo.js

#### routes/index.js
	module.exports = {
		'get': function(req, res) { /* ... */ },
		'post': function(req, res) { /* ... */ },
		'some/relative/path': {
			'get': function(req, res) { /* ... */ },
		}
	}

## Routes in routes/ map to /

	var app = express();
	// ...
	require('expressway').install(module, app);
	
## Advanced Path mapping

	var app = express();
	var expressway = require('expressway');
	// ...
	expressway.install(module, app, 'routes', '/');
	// above line is equivalent to expressway.install(module, app); 
	expressway.install(module, app, 'some/path/relative/to/module', '/absolute/url/prefix');

