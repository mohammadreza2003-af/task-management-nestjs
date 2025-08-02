import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(authCrendentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCrendentialsDto);
  }
  async signIn(authCrendentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCrendentialsDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login crendetials');
    }
  }
}
