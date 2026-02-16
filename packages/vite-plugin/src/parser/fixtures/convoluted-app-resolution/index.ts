import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// Mock createIpcApp
function createIpcApp(options: any) {}

// Mock getIpcControllers
const getIpcControllers = (app: any) => [];

async function bootstrap() {
  // Convoluted: Extra arguments, and variable aliasing
  const appInstance = await NestFactory.create(AppModule, { logger: ["error"] });

  // Variable aliasing
  const myApp = appInstance;

  const options = {
    controllers: getIpcControllers(myApp),
  };

  createIpcApp(options);
}

bootstrap();
