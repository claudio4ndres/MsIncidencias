"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: "1",
    });
    const options = new swagger_1.DocumentBuilder()
        .setTitle("API")
        .setDescription("Microservicio Incidencias")
        .setVersion("1.0")
        .addTag("ms_incidencias")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup("/doc-api", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app
        .useStaticAssets((0, path_1.join)(__dirname, "../public"), {
        prefix: "/api/public/",
        index: false,
        redirect: false,
    })
        .enableCors();
    await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map