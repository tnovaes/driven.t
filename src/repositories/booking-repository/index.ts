import { prisma } from '@/config';

async function getBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function countBookingByRoomId(roomId: number) {
  return prisma.booking.count({
    where: { roomId },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({
    data: {
      roomId,
    },
    where: {
      id,
    },
  });
}

const bookingRepository = {
  getBookingByUserId,
  countBookingByRoomId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
