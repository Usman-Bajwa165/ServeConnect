import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ServicesModule } from "./services/services.module";
import { AvailRequestsModule } from "./avail-requests/avail-requests.module";
import { ApplicationsModule } from "./applications/applications.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { AiModule } from "./ai/ai.module";
import { AdminModule } from "./admin/admin.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    AvailRequestsModule,
    ApplicationsModule,
    ReviewsModule,
    AiModule,
    AdminModule,
    NotificationsModule,
  ],
})
export class AppModule {}
