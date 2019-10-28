import appConf from '../config.json';
import { AppServer } from './AppServer';


const server = new AppServer();
server.start(appConf.serverPort);
