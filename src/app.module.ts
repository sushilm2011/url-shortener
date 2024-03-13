import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShorteningModule } from './modules/shortening/shortening.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { defaultConnection } from './config/typeorm.config';
import { DataSource } from 'typeorm';
import { RedirectionModule } from './modules/redirection/redirection.module';
import { QueueModule } from './modules/queue/queue.module';
import { StatisticsModule } from '@modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: defaultConnection,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
      inject: [ConfigService],
    }),
    ShorteningModule,
    RedirectionModule,
    QueueModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
