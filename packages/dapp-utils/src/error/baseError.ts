export type BaseErrorType = {
  name: string;
};

export class BaseError extends Error {
  override name = 'BaseError';
  constructor(message: string) {
    super(message);
  }
}
