import httpStatus from 'http-status';
import ticketsService from '../tickets-service';
import enrollmentsService from '../enrollments-service';
import paymentRepository from '@/repositories/payment-repository';
import { invalidTicketError, notFoundError, requestError } from '@/errors';
import { PaymentBody } from '@/protocols';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsService.getTicketById(ticketId);
  const enrollment = await enrollmentsService.getEnrollmentByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) throw invalidTicketError();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);
  return payment;
}

async function createPayment(body: PaymentBody, userId: number) {
  const ticket = await ticketsService.getTicketById(body.ticketId);
  const enrollment = await enrollmentsService.getEnrollmentByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) throw invalidTicketError();

  const type = await ticketsService.getTicketTypeById(ticket.ticketTypeId);
  const payment = await paymentRepository.createPayment(body.ticketId, body.cardData, type.price);

  await ticketsRepository.updateTicket(body.ticketId);

  return payment;
}

const paymentService = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentService;
