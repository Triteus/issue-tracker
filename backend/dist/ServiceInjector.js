"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_1 = require("./services/ticket.service");
const comment_service_1 = require("./services/comment.service");
/**
 * A container that holds all services needed at runtime.
 * OvernightJS does not seem to have any mechanism for DI.
 */
class ServiceInjector {
    static getService(serviceName) {
        const service = this.services[serviceName];
        if (!service) {
            throw new Error(`Error trying to inject service "${serviceName}" (not found).`);
        }
        return service;
    }
    static setServices(serviceMapping) {
        for (let [key, service] of Object.entries(serviceMapping)) {
            this.setService(key, service);
        }
        console.log('services', this.services);
    }
    static setService(serviceName, service) {
        this.services[serviceName] = service;
    }
}
exports.ServiceInjector = ServiceInjector;
/*
    overnightjs initializes child-controllers in @Child-decorators
    This causes injector to immediately try to inject service before server instance adds deps -> error
    To fix this for now, services for child-controllers already must be added in here by default
*/
ServiceInjector.services = {
    ticketService: new ticket_service_1.TicketService(),
    commentService: new comment_service_1.CommentService()
};
//# sourceMappingURL=ServiceInjector.js.map