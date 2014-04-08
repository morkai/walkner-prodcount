# Production Line Counters

__Postponed work in progress.__

## Requirements

### node.js

Node.js is a server side software system designed for writing scalable
Internet applications in JavaScript.

  * __Version__: 0.8.x
  * __Website__: http://nodejs.org/
  * __Download__: http://nodejs.org/download/
  * __Installation guide__: https://github.com/joyent/node/wiki/Installation

### MongoDB

MongoDB is a scalable, high-performance, open source NoSQL database.

  * __Version__: 2.x.x
  * __Website__: http://mongodb.org/
  * __Download__: http://www.mongodb.org/downloads
  * __Installation guide__: http://www.mongodb.org/display/DOCS/Quickstart

## Installation

Clone the repository:

```
git clone git://github.com/morkai/walkner-prodcount.git
```

or [download](https://github.com/morkai/walkner-prodcount/zipball/master)
and extract it.

Go to the project's directory and install the dependencies:

```
cd walkner-prodcount/
npm install
```

Give write permissions to `var/` directory and all of its subdirectories:

```
chmod -R 0777 var/
```

## Configuration

TODO

## Starting

If not yet running, start the MongoDB server.

Start the application server in a `development` or `production` environment:

  * under *nix:

    ```
    NODE_ENV=development node walkner-prodcount/backend/server.js
    ```

  * under Windows:

    ```
    SET NODE_ENV=development
    node walkner-prodcount/backend/server.js
    ```

Application should be available on a port defined in the `modules/httpServer.js`
file (`3000` by default). Point the Internet browser to http://127.0.0.1:3000/.

## License

walkner-prodcount is released under the [CC BY-NC-SA 4.0 License](https://github.com/morkai/walkner-prodcount/blob/master/license.md).

Copyright (c) 2014, Łukasz Walukiewicz (lukasz@walukiewicz.eu). Some Rights Reserved.
