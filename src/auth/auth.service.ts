import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt  from 'bcrypt'

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto.js';


@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
   
    try {
      
      const { password, ...userData } = createUserDto
      
      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      } );

      const saveUser= await this.userRepository.save( user ) ;

      const { password:_ , ...restUser } = saveUser

      return restUser;
      // TODO: Retornar JWK de acceso

    } catch (error) {
      this.handleDbErrors( error );
    }

  }

  async login( loginUserDto: LoginUserDto ){

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if ( !user )
      throw new UnauthorizedException('Credentials are not valid (email)')

    if ( !bcrypt.compareSync( password, user.password) )
      throw new UnauthorizedException('Credentials are not valid (password)')

    return user;
    // TODO: retornar el jwt
  }

  private handleDbErrors( error: any ): never {
    if ( error.code === '23505' )
      throw new BadRequestException( error.detail );

    console.log(error);

    throw new InternalServerErrorException('Please check server logs')

  }

}
