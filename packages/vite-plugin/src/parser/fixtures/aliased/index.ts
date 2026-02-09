import { createIpcApp as setupIpc } from "./stub";
import { CounterController } from "./counter.controller";

setupIpc({
  controllers: [CounterController],
});
