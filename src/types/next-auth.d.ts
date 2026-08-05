import type { AdminRole } from "@/generated/prisma/enums";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: AdminRole;
  }

  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AdminRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: AdminRole;
  }
}
