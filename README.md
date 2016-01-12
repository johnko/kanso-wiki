# TapirWiki (ported from CouchApp to Kanso)

This port URL: https://github.com/johnko/kanso-wiki

Original source: https://code.google.com/p/tapirwiki

![](https://github.com/johnko/kanso-wiki/raw/master/screenshot.png)

## Deployment

```
sh deploy.sh
```

The app will be deployed to:

http://localhost:5984/wiki/_design/wiki/_rewrite/

```
You need to add the role "wikieditor" to the users that will be editors.
```

## Development

1. Install CouchDB http://couchdb.apache.org/
2. Install Node.js http://nodejs.org/
3. Install Kanso command-line
```
sudo npm install -g kanso
```

## LICENSE

MIT License

Copyright (c) 2010 Joshua.e.Knight

Copyright (c) 2015 John Ko
