import { TicketStatus } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return { id: booking.id, Room: booking.Room };
}

async function createBooking(userId: number, roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const bookedRooms = await bookingRepository.countBookingByRoomId(roomId);
  if (room.capacity <= bookedRooms) throw forbiddenError();

  const enrollment = await enrollmentRepository.getEnrollmentByUserId(userId);
  const ticket = await ticketsRepository.getTicketsByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== TicketStatus.PAID)
    throw forbiddenError();

  const booking = await bookingRepository.createBooking(userId, roomId);

  return { bookingId: booking.id };
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const room = await roomRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const bookedRooms = await bookingRepository.countBookingByRoomId(roomId);
  if (room.capacity <= bookedRooms) throw forbiddenError();

  const oldBooking = await bookingRepository.getBookingByUserId(userId);
  if (!oldBooking) throw forbiddenError();

  const newBooking = await bookingRepository.updateBooking(bookingId, roomId);

  return { bookingId: newBooking.id };
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};

export default bookingService;
