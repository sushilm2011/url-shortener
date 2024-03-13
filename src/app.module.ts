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
import { CounterCacheModule } from '@modules/counter-cache/counter-cache.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

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
    TerminusModule,
    HttpModule,
    ShorteningModule,
    RedirectionModule,
    QueueModule,
    StatisticsModule,
    CounterCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
