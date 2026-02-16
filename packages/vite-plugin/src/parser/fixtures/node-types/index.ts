import { PlatformController } from "./platform.controller";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createIpcApp(arg0: { controllers: (typeof PlatformController)[] }) {
  throw new Error("Function not implemented.");
}

createIpcApp({
  controllers: [PlatformController],
});
