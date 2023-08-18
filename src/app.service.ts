import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerMessage(): string {
    return 'Thrillers Travels Service is up and running!';
  }
}
