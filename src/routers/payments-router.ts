import { Router } from 'express';
import { createPayment, getPaymentByTicketId } from '@/controllers/payment-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentBodySchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.use(authenticateToken);
paymentsRouter.get('/', getPaymentByTicketId);
paymentsRouter.post('/process', validateBody(paymentBodySchema), createPayment);

export { paymentsRouter };
