import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EnvService } from './infra/env/env.service';
import { parseUrls } from './utils/parse-url';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const configService = app.get(EnvService);
  const FRONTEND_URLS = configService.get('FRONTEND_URLS');
  const PORT = configService.get('PORT');
  const SERVICE = configService.get('SERVICE');
  const VERSION = configService.get('VERSION');

  app.enableCors({
    origin: parseUrls(FRONTEND_URLS),
    // origin: '*',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    // allowedHeaders: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const config = new DocumentBuilder()
    .setTitle('Workout Tracker - Backend')
    .setDescription('Workout Tracker API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/docs', app, document, {
    jsonDocumentUrl: '/swagger/docs/swagger.json',
  });

  await app.listen(PORT, () => {
    console.log(`${SERVICE} - ${VERSION} - Listening on port ${PORT} 🚀`);
  });
}
bootstrap();
