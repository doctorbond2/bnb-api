import ResponseError from '@/models/classes/responseError';
export const ERROR_badRequest = (error: unknown) => {
  if (error instanceof Error) {
    return ResponseError.custom.badRequest(error.message);
  }
  return ResponseError.default.internalServerError();
};
