import { Router } from 'express';
import { getHotels } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.use(authenticateToken);
hotelsRouter.get('/', getHotels);

export { hotelsRouter };
