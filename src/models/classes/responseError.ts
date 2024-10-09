import { NextResponse } from 'next/server';
import {
  StatusCodes as Codes,
  StatusMessages as Messages,
} from '@/models/enums/statusCodes';
import { ValidationErrors } from '../types/Auth';
import { ValidationMessages } from '../enums/errorMessages';

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
  return NextResponse.json(
    {
      message: message || Messages[statusCode],
      errors: errors || {},
    },
    {
      status: statusCode,
    }
  );
};
const returnError: GetError = createError;

class ResponseError {
  static default = {
    notFound: () => returnError(Codes.NOT_FOUND),
    badRequest: () => returnError(Codes.BAD_REQUEST),
    unauthorized: () => returnError(Codes.UNAUTHORIZED),
    invalidToken: () =>
      returnError(Codes.UNAUTHORIZED, ValidationMessages.INVALID_TOKEN),
    forbidden: () => returnError(Codes.FORBIDDEN),
    internalServerError: () => returnError(Codes.INTERNAL_SERVER_ERROR),
    badRequest_IdRequired: () =>
      returnError(Codes.BAD_REQUEST, ValidationMessages.ID_REQUIRED),
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
