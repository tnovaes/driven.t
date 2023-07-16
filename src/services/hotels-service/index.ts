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

async function getHotelRooms(userId: number, hotelId: number) {
  await getHotels(userId);

  const hotel = await hotelsRepository.getHotelWithRooms(hotelId);
  if (!hotel) throw notFoundError();

  const result = {
    id: hotel.id,
    name: hotel.name,
    image: hotel.image,
    createdAt: hotel.createdAt.toISOString(),
    updatedAt: hotel.updatedAt.toISOString(),
    Rooms: hotel.Rooms.map((room) => ({
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      hotelId: room.hotelId,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    })),
  };

  return result;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
