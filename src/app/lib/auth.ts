import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { betterAuth } from "better-auth";
import { UserStatus } from "../../generated/prisma";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    env.FRONTEND_URL,
    env.BETTER_AUTH_URL,
    "http://localhost:3000",
    "http://localhost:5000",
  ],

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      isBanned: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isReviewed: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      reviewId: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      // Redirect URI must point to the FRONTEND proxy so that:
      // 1. The "state" cookie (set via frontend rewrite) is on the frontend domain
      // 2. The callback also arrives at the frontend domain
      // → same domain = state matches = no state_mismatch error
      redirectURI: `${env.FRONTEND_URL}/api/auth/callback/google`,
      mapProfileToUser: () => {
        return {
          role: "USER",
          isActive: true,
          isBanned: false,
          emailVerified: true,
        };
      },
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email - Ishtiaq Robin",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            await sendEmail({
              to: email,
              subject: "Reset your password - Ishtiaq Robin",
              templateName: "reset-otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 5 * 60, // 5 minutes
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: false,
    },
  },

  advanced: {
    // Since the frontend proxies /api/auth/* via Next.js rewrites,
    // auth requests arrive as same-origin from the frontend domain.
    // SameSite=Lax is sufficient and avoids the cross-site cookie warning.
    // SameSite=None is only needed for true cross-origin direct requests.

    // Disable CSRF check because the frontend is proxying the requests
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
      state: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
      idToken: {
        attributes: {
          sameSite: "lax",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
});
