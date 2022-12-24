import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { throws } from 'assert';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtSertice: JwtService
  ) {

  }
  async create(createUserDto: CreateUserDto)  {
    try {
      const {password, ...userData} = createUserDto
      const user = this.userRepository.create({...userData, password: bcrypt.hashSync(password, 10)} )
      await this.userRepository.save(user)
      delete user.password
      return {
        ...user,
        token: this.getJwtToken({email: user.email})
      }

      // TODO: retornar el jwt de acceso
    } catch (error) {
      this.handleDbErrors(error)
      
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const {password, email} = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email: email},
      select: {email: true, password: true}
    })

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)')
    }
    return {
      ...user,
      token: this.getJwtToken({email: user.email})
    }
    // TODO: retornar el jwt
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    } 

    console.log(error);

    throw new InternalServerErrorException("Please check server logs");
    
    
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtSertice.sign(payload)
    return token
  }


}
