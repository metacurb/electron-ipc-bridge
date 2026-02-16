import { AppModule } from "./app.module";

// Stub NestFactory with createApplicationContext
const NestFactory = {
  createApplicationContext: (_module: typeof AppModule) => Promise.resolve({}),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createIpcApp(arg0: { controllers: unknown[] }) {
  throw new Error("Function not implemented.");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIpcControllers = (_app: unknown) => [];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  createIpcApp({ controllers: getIpcControllers(app) });
}

bootstrap();
