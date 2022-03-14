import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeORMSession } from './orm/entities/session.entity';
import { getRepository } from 'typeorm';
import { TypeormStore } from 'connect-typeorm';

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

// Session for authorization, staying logged in
async function setupSession(app: INestApplication) {
  const sessionRepository = getRepository(TypeORMSession);
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
      secret: 'secret_random_string', // TODO: should be secret and random
      resave: false,
      saveUninitialized: false, // Only save the session if the user is logged in
      store: new TypeormStore().connect(sessionRepository), // session store
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupSwagger(app);
  await setupSession(app);
  app.enableCors(); // For frontend API connection
  await app.listen(3000);
}
bootstrap();
