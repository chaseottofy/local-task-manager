const jsonServer = require('json-server')
const compression = require('compression');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const isProduction = process.argv.includes('--production');

if (isProduction) {
  console.log('Running in production mode');
  // gzip
  server.use(compression());

  // production cache policy (1 hour)
  server.use((req, res, next) => {
    res.header('Cache-Control', 'public, max-age=3600');
    next();
  });
} else {
  console.log('Running in development mode');
  // dev cache policy (no cache)
  server.use((req, res, next) => {
    res.header('Cache-Control', 'public, max-age=0');
    next();
  });
}

server.use(middlewares);
// handle POST, PUT, PATCH
server.use(jsonServer.bodyParser);
server.use(router);

const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});