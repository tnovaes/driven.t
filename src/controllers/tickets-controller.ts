import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { TicketTypeId } from '@/protocols';

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getTicketTypes();
  res.status(httpStatus.OK).send(tickets);
}

export async function getTicketsByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const tickets = await ticketsService.getTicketsByUserId(userId);
  res.status(httpStatus.OK).send(tickets);
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body as TicketTypeId;

  const ticket = await ticketsService.createTicket(ticketTypeId, userId);
  res.status(httpStatus.CREATED).send(ticket);
}
