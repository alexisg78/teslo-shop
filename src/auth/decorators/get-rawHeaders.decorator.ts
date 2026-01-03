import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const GetRawHeaders = createParamDecorator(
  
  ( data, ctx: ExecutionContext ) => {

    const req = ctx.switchToHttp().getRequest()

    if (!data)
      throw new InternalServerErrorException('Data not found (request)');

    return req[data];

  }

)

// Nota: Este es un decorador de propiedades personalizado.
// Nest ya tiene un decorador especial para obtener los header: @Headers()