import httpStatus from 'http-status';
import ticketsService from '../tickets-service';
import enrollmentsService from '../enrollments-service';
import paymentRepository from '@/repositories/payment-repository';
import { invalidTicketError, notFoundError, requestError } from '@/errors';

async function getPaymentByTicketId(ticketId: number, userId: number) {
  const ticket = await ticketsService.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await enrollmentsService.getEnrollmentByUserId(userId);

  if (ticket.enrollmentId !== enrollment.id) throw invalidTicketError();

  const payment = await paymentRepository.getPaymentByTicketId(ticketId);
  return payment;
}

const paymentService = {
  getPaymentByTicketId,
};

export default paymentService;
