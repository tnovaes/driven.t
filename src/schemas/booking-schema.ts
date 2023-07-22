import Joi from 'joi';
import { BookingBody } from '@/protocols';

export const bookingBodySchema = Joi.object<BookingBody>({
  roomId: Joi.number().required(),
});
