import { Router } from 'express';
import { getBooking } from '@/controllers/booking-controller';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken);
bookingRouter.get('/', getBooking);

export { bookingRouter };
