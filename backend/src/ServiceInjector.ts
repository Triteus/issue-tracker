import { TicketService } from "./services/ticket.service";

import { CommentService } from "./services/comment.service";

export interface IService {

}

/**
 * A container that holds all services needed at runtime.
 * OvernightJS does not seem to have any mechanism for DI.
 */

export class ServiceInjector {
    /*  
        overnightjs initializes child-controllers in @Child-decorators
        This causes injector to immediately try to inject service before server instance adds deps -> error
        To fix this for now, services for child-controllers already must be added in here by default
    */
    static services: { [key: string]: IService } = {
        ticketService: new TicketService(),
        commentService: new CommentService()
    };

    static getService<T>(serviceName: string) {
        const service = this.services[serviceName];
        if (!service) {
            throw new Error(`Error trying to inject service "${serviceName}" (not found).`);
        }
        return service as T;
    }

    static setServices(serviceMapping: { [key: string]: IService }) {
        for (let [key, service] of Object.entries(serviceMapping)) {
            this.setService(key, service);
        }
        console.log('services', this.services);
    }

    static setService(serviceName: string, service: IService) {
        this.services[serviceName] = service;
    }
}