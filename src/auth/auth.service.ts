import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(authCrendentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCrendentialsDto);
  }
}
