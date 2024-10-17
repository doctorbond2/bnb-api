import ResponseError from '@/models/classes/responseError';
export const ERROR_badRequest = (error: unknown) => {
  if (error instanceof Error) {
    console.log('Error1');
    return ResponseError.custom.badRequest(error.message);
  }
  console.log('Error2');
  return ResponseError.default.internalServerError();
};
export const ERROR_internalServerError = (error: unknown) => {
  if (error instanceof Error) {
    return ResponseError.custom.internalServerError(error.message);
  }
  return ResponseError.default.internalServerError();
};
