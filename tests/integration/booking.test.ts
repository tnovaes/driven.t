import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoom,
  createRoomOneCapacity,
  createSession,
  createTicket,
  createTicketTypeIncludesHotel,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if user does not have a booking', async () => {
      const token = await generateValidToken();
      await createSession(token);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and with booking information', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(enrollment.userId, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with statuts 404 when roomId does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with statuts 403 when room capacity is full', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomOneCapacity(hotel.id);
      await createBooking(enrollment.userId, room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and with booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const id = faker.datatype.number();

    const response = await server.put(`/booking/${id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();

    const response = await server.put(`/booking/${id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const id = faker.datatype.number();

    const response = await server.put(`/booking/${id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with statuts 404 when roomId does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(enrollment.userId, room.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with statuts 403 when room capacity is full', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const oldRoom = await createRoom(hotel.id);
      const booking = await createBooking(enrollment.userId, oldRoom.id);
      const newRoom = await createRoomOneCapacity(hotel.id);
      await createBooking(enrollment.userId, newRoom.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and with booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const oldRoom = await createRoom(hotel.id);
      const booking = await createBooking(enrollment.userId, oldRoom.id);
      const newRoom = await createRoom(hotel.id);

      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});
