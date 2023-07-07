import { prisma } from '@/config';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function getTicketsByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    include: {
      TicketType: true,
    },
    where: { enrollmentId },
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
      status: 'RESERVED',
      updatedAt: new Date(Date.now()),
    },
  });
}

async function getTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: { id },
  });
}

const ticketsRepository = {
  getTicketTypes,
  getTicketsByEnrollmentId,
  createTicket,
  getTicketById,
};

export default ticketsRepository;
