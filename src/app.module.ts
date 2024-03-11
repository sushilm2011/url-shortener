import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ShorteningModule } from './core/shortening/shortening.module';

@Module({
  imports: [ConfigModule.forRoot(), ShorteningModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
