import { Module } from "@nestjs/common";
import { AvailRequestsController } from "./avail-requests.controller";
import { AvailRequestsService } from "./avail-requests.service";

@Module({
  controllers: [AvailRequestsController],
  providers: [AvailRequestsService],
  exports: [AvailRequestsService],
})
export class AvailRequestsModule {}
