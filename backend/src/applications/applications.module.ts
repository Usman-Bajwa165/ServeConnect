import { Module, forwardRef } from "@nestjs/common";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [forwardRef(() => NotificationsModule)],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
