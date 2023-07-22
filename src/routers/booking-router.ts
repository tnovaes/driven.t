import { Router } from 'express';
import { createBooking, getBooking, updateBooking } from '@/controllers/booking-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingBodySchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);
bookingRouter.get('/', getBooking);
bookingRouter.post('/', validateBody(bookingBodySchema), createBooking);
bookingRouter.put('/:bookingId', validateBody(bookingBodySchema), updateBooking);

export { bookingRouter };
