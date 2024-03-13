import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('service/health')
  @HealthCheck()
  readiness() {
    const apiDoc = this.configService.get('API_SWAGGER_DOC');
    return this.health.check([
      () =>
        this.http.pingCheck(
          apiDoc,
          `http://localhost:${this.configService.get('API_PORT')}/${apiDoc}`,
        ),
      async () => this.db.pingCheck('database', { timeout: 1500 }),
    ]);
  }
}
