import { AppServer } from './AppServer';
import config from 'config';

const server = new AppServer();
server.start(config.get('serverPort'));
