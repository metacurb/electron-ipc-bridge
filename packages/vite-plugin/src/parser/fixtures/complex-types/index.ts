import { TypesController } from "./types.controller";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createIpcApp(arg0: { controllers: (typeof TypesController)[] }) {
  throw new Error("Function not implemented.");
}

createIpcApp({
  controllers: [TypesController],
});
