export interface CardUserQueue {
  id: number;
  cardCode: string,
  cardStatus: string,
  expiration: string,
  user: {
    id: number,
    fullName: string,
    email: string,
    userCode: string
  }
}