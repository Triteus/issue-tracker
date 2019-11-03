import { TicketValidators, basicValidators } from "./ticket.validate";
import { validateBody, checkResponse, validateBodyAndParams } from "../../validators/test-util";
import { ticketSchema, TicketStatus } from "../../models/Ticket";

describe('Ticket validators', () => {
    
    const ticketMock = {
        title: 'Something does not work',
        description: 'A sample ticket',
        priority: 0,
        criticality: 0
    }


    describe('basic validators', () => {

        const validators = basicValidators;

        it('throws (invalid title)', async () => {
            const errors = await validateBody({...ticketMock, title: 't'}, validators);
            checkResponse(errors, 'title', 'Invalid value');
        })
        it('throws (invalid priority)', async () => {
            const errors = await validateBody({...ticketMock, priority: 100000}, validators);
            checkResponse(errors, 'priority', 'Invalid value');
        })
        it('throws (invalid systems)', async () => {
            const errors = await validateBody({...ticketMock, systems: 'noArr'}, validators);
            checkResponse(errors, 'systems', 'Invalid value');
        })
        
    })

    describe('POST /api/ticket', () => {
        
        const validators = TicketValidators.createTicket;


        it('throws (invalid status/only status "open" allowed)', async () => {
            const errors = await validateBody({...ticketMock, status: 'invalidStatus'}, validators);
            checkResponse(errors, 'status', 'Invalid value');
        })

        it('passes (necessary body props)', async () => {
            const errors = await validateBody({...ticketMock}, validators);
            expect(errors.length).toBe(0);
        })

        it('passes (all body props)', async () => {
            const errors = await validateBody({...ticketMock}, validators);
            expect(errors.length).toBe(0);
        })

    })

    describe('PUT /api/ticket/:id', () => {

        const validTicketMock = {
            ...ticketMock,
            status: TicketStatus.ACTIVE
        }

        const validators = TicketValidators.putTicket;
        
        it('throws (invalid status)', async () => {
            const errors = await validateBody({...validTicketMock, status: 'invalidStatus'}, validators);
            checkResponse(errors, 'status', 'Invalid value');
        }) 

        it('passes (all body props)', async () => {
            
        })
    })

    describe('DELETE /api/ticket/:id', () => {

    })

    describe('GET /api/ticket/:id', () => {

    })

    describe('GET /api/ticket', () => {

    })

})