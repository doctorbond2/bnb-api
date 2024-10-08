import { NextResponse } from 'next/server';
import {
  StatusCodes as Codes,
  StatusMessages as Messages,
} from '@/models/enums/statusCodes';
import { ValidationErrors } from '../types/Auth';

type GetError = (
  statusCode: Codes,
  message?: string,
  errors?: ValidationErrors
) => Response;
const createError = (
  statusCode: Codes,
  message?: string,
  errors?: ValidationErrors
): Response => {
  return NextResponse.json({
    message: message || Messages[statusCode],
    status: statusCode,
    errors: errors || {},
  });
};
const returnError: GetError = createError;

class ResponseError {
  static default = {
    notFound: () => returnError(Codes.NOT_FOUND),
    badRequest: () => returnError(Codes.BAD_REQUEST),
    unauthorized: () => returnError(Codes.UNAUTHORIZED),
    invalidToken: () => returnError(Codes.UNAUTHORIZED, 'Invalid token'),
    forbidden: () => returnError(Codes.FORBIDDEN),
    internalServerError: () => returnError(Codes.INTERNAL_SERVER_ERROR),
  };
  static custom = {
    notFound: (message: string) => returnError(Codes.NOT_FOUND, message),
    badRequest: (message: string) => returnError(Codes.BAD_REQUEST, message),
    unauthorized: (message: string) => returnError(Codes.UNAUTHORIZED, message),
    forbidden: (message: string) => returnError(Codes.FORBIDDEN, message),
    internalServerError: (message: string) =>
      returnError(Codes.INTERNAL_SERVER_ERROR, message),
    badRequest_validationError: (errors: ValidationErrors) =>
      returnError(Codes.BAD_REQUEST, undefined, errors),
  };
}

export default ResponseError;
