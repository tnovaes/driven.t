import { Router } from 'express';
import { getPaymentByTicketId } from '@/controllers/payment-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.use(authenticateToken);
paymentsRouter.get('/', getPaymentByTicketId);

export { paymentsRouter };
