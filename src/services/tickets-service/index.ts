import enrollmentsService from '../enrollments-service';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';

async function getTicketTypes() {
  return await ticketsRepository.getTicketTypes();
}

async function getTicketsByUserId(userId: number) {
  const enrollmentByUserId = await enrollmentsService.getEnrollmentByUserId(userId);
  const tickets = await ticketsRepository.getTicketsByEnrollmentId(enrollmentByUserId.id);
  if (!tickets) throw notFoundError();

  return tickets;
}

async function createTicket(ticketTypeId: number, userId: number) {
  const enrollmentByUserId = await enrollmentsService.getEnrollmentByUserId(userId);
  await ticketsRepository.createTicket(ticketTypeId, enrollmentByUserId.id);

  const ticket = await getTicketsByUserId(userId);
  return ticket;
}

async function getTicketById(id: number) {
  const ticket = await ticketsRepository.getTicketById(id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function getTicketTypeById(id: number) {
  const type = await ticketsRepository.getTicketTypeById(id);
  return type;
}

const ticketsService = {
  getTicketTypes,
  getTicketsByUserId,
  createTicket,
  getTicketById,
  getTicketTypeById,
};

export default ticketsService;
