import { AppController } from "./app.controller";
import { ChildModule } from "./child.module";

function Module(_opts: {
  controllers: (typeof AppController)[];
  imports: (typeof ChildModule)[];
}): (target: typeof AppModule) => void {
  return () => undefined;
}

@Module({
  controllers: [AppController],
  imports: [ChildModule],
})
export class AppModule {}
