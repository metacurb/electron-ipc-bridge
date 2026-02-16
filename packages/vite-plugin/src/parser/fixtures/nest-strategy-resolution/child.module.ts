import { ChildController } from "./child.controller";

function Module(_opts: { controllers: (typeof ChildController)[] }): (target: typeof ChildModule) => void {
  return () => undefined;
}

@Module({
  controllers: [ChildController],
})
export class ChildModule {}
