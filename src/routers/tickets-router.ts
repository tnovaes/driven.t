import { Router } from 'express';
import { createTicket, getTicketsByUserId, getTicketsType } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketTypeIdSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.use(authenticateToken);
ticketsRouter.get('/types', getTicketsType);
ticketsRouter.get('/', getTicketsByUserId);
ticketsRouter.post('/', validateBody(ticketTypeIdSchema), createTicket);

export { ticketsRouter };
