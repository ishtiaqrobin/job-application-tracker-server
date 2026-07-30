import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        role: string;
        isActive: boolean;
        isBanned: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      // console.log("session data:", session);

      // Check if session exists
      if (!session?.user) {
        return res.status(401).json({
          success: false,
          message:
            "Unauthorized! You must be logged in to access this resource",
        });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as string,
        image: session.user.image ?? undefined,
        isActive: session.user.isActive as boolean,
        isBanned: session.user.isBanned as boolean,
        emailVerified: session.user.emailVerified,
      };

      if (!roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resource",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err,
      });
    }
  };
};

export default auth;
