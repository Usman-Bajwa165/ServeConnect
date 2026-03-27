import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "fallback-secret",
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const { sub, jti } = payload;

    // Check blacklist
    if (jti) {
      const isBlacklisted = await this.redis.exists(`blacklist:${jti}`);
      if (isBlacklisted) {
        throw new UnauthorizedException("Token has been invalidated");
      }
    }

    // Check user exists and is not banned
    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        city: true,
        isBanned: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (user.isBanned) {
      throw new ForbiddenException("Your account has been banned");
    }

    return { ...user, jti };
  }
}
