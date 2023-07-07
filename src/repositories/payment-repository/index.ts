import { prisma } from '@/config';
import { CardData } from '@/protocols';

async function getPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function createPayment(ticketId: number, card: CardData, value: number) {
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer: card.issuer,
      cardLastDigits: card.number.toString().slice(-4),
    },
  });
}

const paymentRepository = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentRepository;
