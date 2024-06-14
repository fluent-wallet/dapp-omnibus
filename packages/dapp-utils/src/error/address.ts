import { BaseError } from './baseError';

export type InvalidAddressErrorType = { name: 'InvalidAddressError' } & InvalidAddressError;

export class InvalidAddressError extends BaseError {
  override name = 'InvalidAddressError';
  constructor(message: string) {
    super(message);
  }
}

export type InvalidNetworkErrorType = { name: 'InvalidNetworkError' } & InvalidNetworkError;
export class InvalidNetworkError extends BaseError {
  override name = 'InvalidNetworkError';
  constructor(message: string) {
    super(message);
  }
}
