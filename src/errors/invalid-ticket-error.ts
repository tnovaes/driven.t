import { ApplicationError } from '@/protocols';

export function invalidTicketError(): ApplicationError {
  return {
    name: 'InvalidTicketError',
    message: 'This ticket is not associated with this user!',
  };
}
