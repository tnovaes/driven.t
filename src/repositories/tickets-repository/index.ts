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

const ticketsRepository = {
  getTicketTypes,
  getTicketsByEnrollmentId,
};

export default ticketsRepository;
