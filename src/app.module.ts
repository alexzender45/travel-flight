import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs';
import { SearchModule } from './search';
import { BaseModule } from './base';

@Module({
  imports: [
    SearchModule,
    ConfigsModule,
    BaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
