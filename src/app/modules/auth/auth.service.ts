import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  IRegisterUserPayload,
  ILoginUserPayload,
  IChangedPasswordPayload,
} from "./auth.interface";
import { UserStatus } from "../../../generated/prisma";

const registerUser = async (payload: IRegisterUserPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register user");
  }

  return data;
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: { email, password },
  });

  if (data.user.isBanned) {
    throw new AppError(status.FORBIDDEN, "Your account has been banned");
  }

  return data;
};

const changePassword = async (
  payload: IChangedPasswordPayload,
  headers: Headers,
) => {
  const { currentPassword, newPassword, revokeOtherSessions } = payload;
  try {
    const result = await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions },
      headers,
    });

    // update needPasswordChange to false
    if (result.user.needPasswordChange) {
      await prisma.user.update({
        where: {
          id: result.user.id,
        },
        data: {
          needPasswordChange: false,
        },
      });
    }

    return result;
  } catch (error: any) {
    console.error("Change Password API Error details:", error.body || error);
    throw new AppError(
      status.BAD_REQUEST,
      error.body?.message || "Failed to change password",
    );
  }
};

const logoutUser = async (headers: Headers) => {
  try {
    const result = await auth.api.signOut({
      headers,
    });
    return result;
  } catch (error: any) {
    console.error("SignOut API Error details:", error.body || error);
    throw new AppError(
      status.BAD_REQUEST,
      error.body?.message || "Failed to logout",
    );
  }
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: { email, otp },
  });

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

const forgetPassword = async (email: string) => {
  const isUserExits = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExits) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!isUserExits.emailVerified) {
    throw new AppError(status.FORBIDDEN, "Email not verified");
  }

  if (isUserExits.isBanned) {
    throw new AppError(status.FORBIDDEN, "Your account has been banned");
  }

  await auth.api.forgetPasswordEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExits = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!isUserExits) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!isUserExits.emailVerified) {
    throw new AppError(status.FORBIDDEN, "Email not verified");
  }

  if (isUserExits.isDeleted || isUserExits.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  if (isUserExits.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExits.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }

  await prisma.session.deleteMany({
    where: {
      userId: isUserExits.id,
    },
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
};
