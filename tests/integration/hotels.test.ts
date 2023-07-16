import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createTicket,
  createTicketTypeIncludesHotel,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when hotels doesnt exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket status is not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and with hotels data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          }),
        ]),
      );
    });
  });
});
