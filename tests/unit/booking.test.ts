import faker from '@faker-js/faker';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomRepository from '@/repositories/room-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import bookingService from '@/services/booking-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('booking-service', () => {
  describe('getBooking', () => {
    it('should reject with a NotFoundError if user does not have a booking', () => {
      const bookingMock = jest.spyOn(bookingRepository, 'getBookingByUserId');
      bookingMock.mockImplementationOnce((): any => {
        return null;
      });

      const userId = faker.datatype.number();
      const promise = bookingService.getBooking(userId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });

  describe('createBooking', () => {
    it('should reject with a NotFoundError if room does not exist', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return null;
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const promise = bookingService.createBooking(userId, roomId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should reject with a ForbiddenError if room capacity is full', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return {
          capacity: 1,
        };
      });

      const bookingMock = jest.spyOn(bookingRepository, 'countBookingByRoomId');
      bookingMock.mockImplementationOnce((): any => {
        return 1;
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const promise = bookingService.createBooking(userId, roomId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Access to the requested resource is forbidden!',
      });
    });

    it('should reject with a ForbiddenError if ticketType is remote', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return {
          capacity: 1,
        };
      });

      const bookingMock = jest.spyOn(bookingRepository, 'countBookingByRoomId');
      bookingMock.mockImplementationOnce((): any => {
        return 1;
      });

      const enrollmentMock = jest.spyOn(enrollmentRepository, 'getEnrollmentByUserId');
      enrollmentMock.mockImplementationOnce((): any => {
        return {
          id: 1,
        };
      });

      const ticketMock = jest.spyOn(ticketsRepository, 'getTicketsByEnrollmentId');
      ticketMock.mockImplementationOnce((): any => {
        return {
          TicketType: {
            isRemote: true,
            includesHotel: false,
          },
          status: 'PAID',
        };
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const promise = bookingService.createBooking(userId, roomId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Access to the requested resource is forbidden!',
      });
    });

    it('should reject with a ForbiddenError if ticketType does not include hotel', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return {
          capacity: 1,
        };
      });

      const bookingMock = jest.spyOn(bookingRepository, 'countBookingByRoomId');
      bookingMock.mockImplementationOnce((): any => {
        return 1;
      });

      const enrollmentMock = jest.spyOn(enrollmentRepository, 'getEnrollmentByUserId');
      enrollmentMock.mockImplementationOnce((): any => {
        return {
          id: 1,
        };
      });

      const ticketMock = jest.spyOn(ticketsRepository, 'getTicketsByEnrollmentId');
      ticketMock.mockImplementationOnce((): any => {
        return {
          TicketType: {
            isRemote: false,
            includesHotel: false,
          },
          status: 'PAID',
        };
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const promise = bookingService.createBooking(userId, roomId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Access to the requested resource is forbidden!',
      });
    });

    it('should reject with a ForbiddenError if ticket status is not PAID', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return {
          capacity: 1,
        };
      });

      const bookingMock = jest.spyOn(bookingRepository, 'countBookingByRoomId');
      bookingMock.mockImplementationOnce((): any => {
        return 1;
      });

      const enrollmentMock = jest.spyOn(enrollmentRepository, 'getEnrollmentByUserId');
      enrollmentMock.mockImplementationOnce((): any => {
        return {
          id: 1,
        };
      });

      const ticketMock = jest.spyOn(ticketsRepository, 'getTicketsByEnrollmentId');
      ticketMock.mockImplementationOnce((): any => {
        return {
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
          status: 'RESERVED',
        };
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const promise = bookingService.createBooking(userId, roomId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Access to the requested resource is forbidden!',
      });
    });
  });

  describe('updateBooking', () => {
    it('should reject with a NotFoundError if room does not exist', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return null;
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const bookingId = faker.datatype.number();
      const promise = bookingService.updateBooking(userId, roomId, bookingId);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should reject with a ForbiddenError if room capacity is full', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return {
          capacity: 1,
        };
      });

      const bookingMock = jest.spyOn(bookingRepository, 'countBookingByRoomId');
      bookingMock.mockImplementationOnce((): any => {
        return 1;
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const bookingId = faker.datatype.number();
      const promise = bookingService.updateBooking(userId, roomId, bookingId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Access to the requested resource is forbidden!',
      });
    });

    it('should reject with a ForbiddenError if user does not have a booking', () => {
      const roomMock = jest.spyOn(roomRepository, 'findRoomById');
      roomMock.mockImplementationOnce((): any => {
        return {
          capacity: 1,
        };
      });

      const bookingMock = jest.spyOn(bookingRepository, 'countBookingByRoomId');
      bookingMock.mockImplementationOnce((): any => {
        return 1;
      });

      const oldBookingMock = jest.spyOn(bookingRepository, 'getBookingByUserId');
      oldBookingMock.mockImplementationOnce((): any => {
        return null;
      });

      const userId = faker.datatype.number();
      const roomId = faker.datatype.number();
      const bookingId = faker.datatype.number();
      const promise = bookingService.updateBooking(userId, roomId, bookingId);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Access to the requested resource is forbidden!',
      });
    });
  });
});
