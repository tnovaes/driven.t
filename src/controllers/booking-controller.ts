import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { BookingBody } from '@/protocols';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.getBooking(userId);
  res.status(httpStatus.OK).send(booking);
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as BookingBody;

  const bookingId = await bookingService.createBooking(userId, roomId);
  res.status(httpStatus.OK).send(bookingId);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as BookingBody;
  const bookingId = Number(req.params.bookingId);

  const updatedBookingId = await bookingService.updateBooking(userId, roomId, bookingId);
  res.status(httpStatus.OK).send(updatedBookingId);
}
