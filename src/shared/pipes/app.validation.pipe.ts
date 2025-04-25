import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationPipe, ValidationError } from '@nestjs/common';

@Injectable()
export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const firstError = errors[0];
          const firstErrorMessage = Object.values(firstError.constraints)[0]; // Get the first constraint message

          return new BadRequestException(firstErrorMessage);
        }
        return new BadRequestException('Validation failed');
      },
    },);
  }
}