import { IncomingHttpHeaders } from 'http';
import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

import { GetUser, RoleProtected, Auth, GetRawHeaders } from './decorators'
// import { GetUser } from './decorators/get-user.decorator';
// import { GetRawHeaders } from './decorators/get-rawHeaders.decorator'; // En teoria deberia ir en los common porque es mas generico

import { User } from './entities/user.entity';

import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus( 
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus( user )
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute( 
    // @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    // @GetRawHeaders('rawHeaders') rawHeaders: string[], // Decorador personalizado.
    @Headers() headers: IncomingHttpHeaders
  ){
    
    // console.log( request )
    return {
      ok: true,
      message: 'Hola mundo Private',
      user,
      userEmail,
      headers
      // rawHeaders
    }
  }

  // test de diferentes formas de usar guards y decoradores personalizados: setmetadata, roleprotected etc

  @Get('private1')
  @SetMetadata('roles', ['admin', 'super-user'])     // Esta linea se puede mejorar para no cometer errores al pasar los argumentos de la metadata
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute1(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }

  
  // Custom Decorator - RoleProtected
  @Get('private2')
  @RoleProtected( ValidRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }

  // FORMA EFICIENTE de utilizar la validacion con un decorador personalizado @Auth

  @Get('private3')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  privateRoute3(
    @GetUser() user: User
  ){
    
    return {
      ok: true,
      user
    }
  }  

}
