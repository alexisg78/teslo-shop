import { IncomingHttpHeaders } from 'http';
import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

import { GetUser, GetRawHeaders } from './decorators'
// import { GetUser } from './decorators/get-user.decorator';
// import { GetRawHeaders } from './decorators/get-rawHeaders.decorator'; // En teoria deberia ir en los common porque es mas generico

import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';

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

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }

}
