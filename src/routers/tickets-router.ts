import { Router } from 'express';
import { getTicketsByUserId, getTicketsType } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.use(authenticateToken);
ticketsRouter.get('/types', getTicketsType);
ticketsRouter.get('/', getTicketsByUserId);

export { ticketsRouter };
