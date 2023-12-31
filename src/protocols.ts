export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type CEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type TicketTypeId = {
  ticketTypeId: number;
};

export type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export type PaymentBody = {
  ticketId: number;
  cardData: CardData;
};

export type BookingBody = {
  roomId: number;
};
