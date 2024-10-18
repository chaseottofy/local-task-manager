### local task-manager (work in progress)

#### how to run dev and prod server

1. turn on json-server with one of the following commands (prod commpresses db.json)
**make sure db.json is in root directory.**

```bash
npm run server:dev
```
```bash
npm run server:prod
```
---
2. in another terminal, either build the code and run /dist through custom 'build:server' or run dev server

```bash
npm run dev
```
```bash
npm run build
npm run build:server
```
