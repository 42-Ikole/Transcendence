import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

// Swagger = automatic API documentation
async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Ping Pong')
    .setDescription('Ping Pong API')
    .setVersion('1.0')
    .addTag('Pong')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupSwagger(app);
  app.enableCors(); // For frontend API connection
  await app.listen(3000);
}
bootstrap();
