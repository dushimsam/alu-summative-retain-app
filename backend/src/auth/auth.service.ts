import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.users.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.users.save(
      this.users.create({ name: dto.name, email: dto.email, password }),
    );
    return this.buildResponse(user);
  }

  async signin(dto: SigninDto) {
    const user = await this.users.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.buildResponse(user);
  }

  async me(id: number) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.publicUser(user);
  }

  private buildResponse(user: User) {
    const token = this.jwt.sign({ sub: user.id, role: user.role });
    return { user: this.publicUser(user), token };
  }

  private publicUser(user: User) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
