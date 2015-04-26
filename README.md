# TapirWiki (ported from CouchApp to Kanso)

This port URL: https://github.com/johnko/tapirwiki

Original source: https://code.google.com/p/tapirwiki

## Deployment

#### 1. Get the dependencies before pushing:

```
kanso install
```

#### 2. Push the app to a couchdb database named tapir:

```
kanso push http://localhost:5984/tapir
```

#### 3. Upload the initial wiki data documents:

```
kanso upload data http://localhost:5984/tapir
```

#### 4. The app will be deployed to:

http://localhost:5984/example/_design/example-app/index.html

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
