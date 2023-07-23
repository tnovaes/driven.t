import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      hotelId: hotelId,
      name: faker.name.findName(),
      capacity: faker.datatype.number({ min: 2 }),
    },
  });
}

export async function createRoomOneCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      hotelId: hotelId,
      name: faker.name.findName(),
      capacity: 1,
    },
  });
}
