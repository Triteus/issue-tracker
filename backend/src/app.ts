import { AppServer } from './AppServer';

const server = new AppServer();
server.start(parseInt(process.env.PORT) || 3000);
