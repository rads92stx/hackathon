import { AppModule } from '@app/app.module';
import { NestFactory } from '@nestjs/core';
import { AppLoggerService } from '@shared/services/app-logger.service';
import { json as bodyParserJson, urlencoded as bodyParserUrlEncoded } from 'body-parser';
import * as compression from 'compression';
import * as path from 'path';

process.env.HACKHATON_APP_ROOT = path.normalize(`${__dirname}/../`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(AppLoggerService));
  app.use(bodyParserJson({ limit: '50mb' }));
  app.use(bodyParserUrlEncoded({ extended: false }));
  app.enableCors();
  app.use(compression());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
