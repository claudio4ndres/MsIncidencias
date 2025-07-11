"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const dotenv = __importStar(require("dotenv"));
const typeorm_config_1 = require("./config/typeorm.config");
dotenv.config({ path: ".env.local" });
async function runMigrations() {
    try {
        console.log("🔗 Inicializando conexión a la base de datos...");
        await typeorm_config_1.AppDataSource.initialize();
        console.log("✅ Conexión establecida con éxito");
        console.log("🚀 Ejecutando migraciones...");
        await typeorm_config_1.AppDataSource.runMigrations();
        console.log("✅ Migraciones ejecutadas correctamente");
        console.log("📊 Obteniendo información de migraciones...");
        const hasPendingMigrations = await typeorm_config_1.AppDataSource.showMigrations();
        if (hasPendingMigrations) {
            console.log("📋 Hay migraciones pendientes");
        }
        else {
            console.log("✅ No hay migraciones pendientes");
        }
        console.log("🎉 Proceso completado exitosamente");
    }
    catch (error) {
        console.error("❌ Error ejecutando migraciones:", error);
        process.exit(1);
    }
    finally {
        if (typeorm_config_1.AppDataSource.isInitialized) {
            await typeorm_config_1.AppDataSource.destroy();
            console.log("🔌 Conexión cerrada");
        }
    }
}
exports.runMigrations = runMigrations;
if (require.main === module) {
    runMigrations();
}
//# sourceMappingURL=run-migrations.js.map