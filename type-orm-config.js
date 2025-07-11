"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var typeorm_1 = require("typeorm");
var config_1 = require("@nestjs/config");
var appDirectory = fs.realpathSync(process.cwd());
var resolveFile = path.resolve(appDirectory, '.env');
var dotenvFiles = ["".concat(resolveFile, ".local"), resolveFile];
dotenvFiles.forEach(function (dotenvFile) {
    if (fs.existsSync(dotenvFile)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('dotenv').config({
            path: dotenvFile
        });
    }
});
var configService = new config_1.ConfigService();
exports["default"] = new typeorm_1.DataSource({
    type: configService.get('DB_SOURCE'),
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    synchronize: false,
    entities: [path.join(__dirname, '../entities/*.entity.{js,ts}')],
    migrations: [path.join(__dirname, '../migrations/*.entity.{js,ts}')],
    logging: true
});
