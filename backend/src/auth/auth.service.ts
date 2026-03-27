import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { SignupDto, LoginDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  private async issueToken(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<string> {
    const jti = uuidv4();
    const payload = { sub: user.id, email: user.email, role: user.role, jti };
    return this.jwtService.sign(payload);
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role,
        city: dto.city,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        city: true,
        isBanned: true,
        createdAt: true,
      },
    });

    const access_token = await this.issueToken(user);
    return { user, access_token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.isBanned) {
      throw new UnauthorizedException("Your account has been banned");
    }

    const { password: _password, ...safeUser } = user;
    const access_token = await this.issueToken(safeUser);
    return { user: safeUser, access_token };
  }

  async logout(user: any, token: string) {
    try {
      const decoded = this.jwtService.decode(token) as any;
      if (decoded?.jti && decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await this.redis.set(`blacklist:${decoded.jti}`, "1", ttl);
        }
      }
    } catch {
      // Ignore decode errors
    }
    return { message: "Logged out successfully" };
  }
}
