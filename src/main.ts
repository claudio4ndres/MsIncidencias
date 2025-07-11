import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // TODO: condicionar el Swagger para qa y dev unicamente
  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("Microservicio Incidencias")
    .setVersion("1.0")
    .addTag("ms_incidencias")
    .addBearerAuth() // Simple configuration
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("/doc-api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app
    .useStaticAssets(join(__dirname, "../public"), {
      prefix: "/api/public/",
      index: false,
      redirect: false,
    })
    .enableCors();

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap();
