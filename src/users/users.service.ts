import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor() {}

  async createUser() {
    // ...
  }

  async getByEmail(email: string) {
    // ...
  }

  async getById(userId: number) {
    // ...
  }

  async updateToken(userId: number, token: string | null) {
    // ...
  }
}
