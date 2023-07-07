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
    },
  });
}

async function getTicketById(id: number) {
  return prisma.ticket.findUnique({
    where: { id },
  });
}

async function getTicketTypeById(id: number) {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}

async function updateTicket(id: number) {
  return prisma.ticket.update({
    data: {
      status: 'PAID',
    },
    where: { id },
  });
}

const ticketsRepository = {
  getTicketTypes,
  getTicketsByEnrollmentId,
  createTicket,
  getTicketById,
  getTicketTypeById,
  updateTicket,
};

export default ticketsRepository;
