"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppServer_1 = require("./AppServer");
const server = new AppServer_1.AppServer();
server.start(parseInt(process.env.PORT) || 3000);
//# sourceMappingURL=app.js.map