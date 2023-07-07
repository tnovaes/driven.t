import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payment-service';
import { PaymentBody } from '@/protocols';

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = req.query.ticketId as unknown as number;

  if (!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const payment = await paymentService.getPaymentByTicketId(Number(ticketId), userId);
  res.status(httpStatus.OK).send(payment);
}

export async function createPayment(req: AuthenticatedRequest, res: Response) {
  const body: PaymentBody = req.body as PaymentBody;
  const { userId } = req;

  const payment = await paymentService.createPayment(body, userId);
  res.status(httpStatus.OK).send(payment);
}
