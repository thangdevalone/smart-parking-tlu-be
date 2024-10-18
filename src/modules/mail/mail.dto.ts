export class EmailDto {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}