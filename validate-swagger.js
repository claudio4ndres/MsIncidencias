const fs = require('fs');
const path = require('path');

const CONTROLLERS_DIR = path.join(__dirname, 'src');

function findControllers(dir) {
  const files = fs.readdirSync(dir);
  let controllers = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      controllers = controllers.concat(findControllers(fullPath));
    } else if (file.endsWith('.controller.ts')) {
      controllers.push(fullPath);
    }
  }

  return controllers;
}

function validateSwaggerAnnotations(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Buscar métodos en el controlador
  const methodRegex =
    /@(Get|Post|Put|Delete|Patch|Options|Head)\(['"`]?.*['"`]?\)\s+[\w\s]*\(/g;
  const methods = content.match(methodRegex);

  if (!methods) {
    console.warn(
      `Advertencia: No se encontraron métodos en el controlador ${filePath}.`,
    );
    return;
  }

  // Validar que cada método tenga las anotaciones de Swagger
  methods.forEach((method) => {
    const methodStartIndex = content.indexOf(method);
    const methodContent = content.slice(
      methodStartIndex,
      content.indexOf(')', methodStartIndex) + 1,
    );

    const hasApiOperation = methodContent.includes('@ApiOperation');
    const hasApiResponse = methodContent.includes('@ApiOkResponse');

    if (!hasApiOperation || !hasApiResponse) {
      console.error(
        `Error: El método "${method.trim()}" en el controlador ${filePath} no tiene documentación Swagger completa.`,
      );
      process.exit(1);
    }
  });
}

function main() {
  const controllers = findControllers(CONTROLLERS_DIR);

  if (controllers.length === 0) {
    console.log('No se encontraron controladores.');
    return;
  }

  controllers.forEach(validateSwaggerAnnotations);
  console.log(
    'Todos los métodos en los controladores están documentados con Swagger.',
  );
}

main();
