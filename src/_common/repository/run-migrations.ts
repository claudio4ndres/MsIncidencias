import * as dotenv from "dotenv";
import { AppDataSource } from "./config/typeorm.config";

// Cargar variables de entorno
dotenv.config({ path: ".env.local" });

async function runMigrations() {
  try {
    console.log("🔗 Inicializando conexión a la base de datos...");

    // Inicializar la conexión
    await AppDataSource.initialize();
    console.log("✅ Conexión establecida con éxito");

    // Ejecutar migraciones
    console.log("🚀 Ejecutando migraciones...");
    await AppDataSource.runMigrations();
    console.log("✅ Migraciones ejecutadas correctamente");

    // Mostrar información de las migraciones ejecutadas
    console.log("📊 Obteniendo información de migraciones...");
    const hasPendingMigrations = await AppDataSource.showMigrations();
    
    if (hasPendingMigrations) {
      console.log("📋 Hay migraciones pendientes");
    } else {
      console.log("✅ No hay migraciones pendientes");
    }

    console.log("🎉 Proceso completado exitosamente");
  } catch (error) {
    console.error("❌ Error ejecutando migraciones:", error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Conexión cerrada");
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runMigrations();
}

export { runMigrations };
