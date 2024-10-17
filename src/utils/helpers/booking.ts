import { Booking } from '@prisma/client';
import { ValidationErrors } from '@/models/types/Auth';
import { ValidationMessages } from '@/models/enums/errorMessages';
import { ResponseError } from '../barrels/handler';
export const validateNewBooking = async (
  body: Booking
): Promise<[boolean, Response]> => {
  const ValidationErrors: ValidationErrors = {};
  if (!body) {
    ValidationErrors.body = ValidationMessages.NO_BODY;
  }
  if (!body.customer) {
    ValidationErrors.customer = ValidationMessages.CUSTTOMER_DETAILS_REQUIRED;
  }
  if (!body.startDate || !body.endDate) {
    ValidationErrors.dates = ValidationMessages.DATES_REQUIRED_FOR_BOOKING;
  }
  return [
    Object.keys(ValidationErrors).length > 0,
    ResponseError.custom.badRequest_validationError(ValidationErrors),
  ];
};
// export async function validateNewProperty(
//     body: Property
//   ): Promise<[boolean, Response]> {
//     const ValidationErrors: ValidationErrors = {};
//     if (!body) {
//       ValidationErrors.body = ValidationMessages.NO_BODY;
//     }
//     if (!body.name) {
//       ValidationErrors.name = ValidationMessages.NAME_REQUIRIED;
//     }
//     if (!body.country) {
//       ValidationErrors.country = ValidationMessages.COUNTRY_REQUIRED;
//     }
//     if (!body.city) {
//       ValidationErrors.city = ValidationMessages.CITY_REQUIRED;
//     }
//     if (!body.price_per_night && body.price_per_night !== 0) {
//       ValidationErrors.price_per_night =
//         ValidationMessages.PRICE_PER_NIGHT_REQUIRED;
//     }
//     if (body.price_per_night > 10000) {
//       ValidationErrors.price_per_night =
//         'Too high price per night, limit is: 9999';
//     }
//     return [
//       Object.keys(ValidationErrors).length > 0,
//       ResponseError.custom.badRequest_validationError(ValidationErrors),
//     ];
//   }
