import { ForbiddenException, Injectable } from '@nestjs/common';
import { Login_DTO, Register_DTO } from './dto';
import { PrismaClient, Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
const prisma = new PrismaClient();
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(loginDTO: Login_DTO) {
    const user = await prisma.user.findUnique({
      where: {
        email: loginDTO.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (!(await argon.verify(user.password, loginDTO.password))) {
      throw new ForbiddenException('Invalid credentials');
    }
    delete user.password;
    const payload = { sub: user.id, username: user.username };
    return {
      user,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerDTO: Register_DTO) {
    try {
      const { username, email, password } = registerDTO;
      const hashedPassword = await argon.hash(password);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      return { message: 'User created' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('User already exists');
        }
      }
    }
  }
}
