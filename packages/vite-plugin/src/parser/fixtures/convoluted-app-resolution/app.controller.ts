import { Controller } from "@nestjs/common";

@Controller()
export class AppController {
  ping() {
    return "pong";
  }
}
