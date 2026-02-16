import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// Mock createIpcApp
function createIpcApp(options: any) {}

// Mock getIpcControllers similar to user provided snippet
const getIpcControllers = (app: any) => [];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  createIpcApp({ controllers: getIpcControllers(app) });
}

bootstrap();
