import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { Prisma } from "@prisma/client";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2002") {
        statusCode = HttpStatus.CONFLICT;
        message = "A record with this value already exists";
      } else if (exception.code === "P2025") {
        statusCode = HttpStatus.NOT_FOUND;
        message = "Record not found";
      } else {
        message = "Database error";
      }
    } else {
      this.logger.error(exception);
    }

    if (Array.isArray(message)) {
      message = message.join(", ");
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      error: message,
    });
  }
}
