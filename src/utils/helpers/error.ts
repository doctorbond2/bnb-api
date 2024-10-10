import ResponseError from '@/models/classes/responseError';
export const ERROR_badRequest = (error: unknown) => {
  if (error instanceof Error) {
    return ResponseError.custom.badRequest(error.message);
  }
  return ResponseError.default.internalServerError();
};
export const ERROR_internalServerError = (error: unknown) => {
  if (error instanceof Error) {
    return ResponseError.custom.internalServerError(error.message);
  }
  return ResponseError.default.internalServerError();
};
