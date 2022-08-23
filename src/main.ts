import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // setup public directory
  app.useStaticAssets(join(__dirname, "../public"))
  // setup swagger
  const config = new DocumentBuilder()
    .setTitle("API Google Keep Clone | DOT Indonesia TEST")
    .setDescription("Ini adalah API Cloning dari Google Keep untuk mengerjakan Test di DOT Indonesia")
    .setVersion("1.0")
    .addTag("Auth")
    .addTag("Users")
    .addTag("Notes")
    .addTag("Label")
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/v1/docs", app, document);
  // setup versioning
  app.enableVersioning({
    type: VersioningType.URI
  });
  // setup validation pipeline
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
