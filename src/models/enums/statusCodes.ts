export enum StatusCodes {
  SUCCESS = 200,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NO_CONTENT = 204,
}
export const StatusMessages = {
  200: 'Success',
  201: 'Created',
  204: 'No content',
  404: 'Not found',
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  500: 'Internal server error',
};
