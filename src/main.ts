import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const corsOptions = {
    origin: ['http://localhost:3000'],
  };
  
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  await app.listen(3001);
}
bootstrap();
