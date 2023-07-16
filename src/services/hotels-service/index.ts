import { TicketStatus } from '@prisma/client';
import enrollmentsService from '../enrollments-service';
import { notFoundError, paymentRequiredError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsRepository from '@/repositories/hotels-repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentsService.getEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicketsByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === TicketStatus.RESERVED || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw paymentRequiredError();

  const hotels = await hotelsRepository.getHotels();
  if (!hotels || !hotels.length) throw notFoundError();

  return hotels;
}

const hotelsService = {
  getHotels,
};

export default hotelsService;
