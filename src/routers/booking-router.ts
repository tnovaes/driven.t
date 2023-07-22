import { Router } from 'express';
import { createBooking, getBooking } from '@/controllers/booking-controller';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);
bookingRouter.get('/', getBooking);
bookingRouter.post('/', createBooking);

export { bookingRouter };
