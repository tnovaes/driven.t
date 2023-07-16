import { Router } from 'express';
import { getHotels, getRooms } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.use(authenticateToken);
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getRooms);

export { hotelsRouter };
