export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IChangedPasswordPayload {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions: boolean;
}

export interface ISession {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    isDeleted: boolean;
    role: string;
    status: string;
    needPasswordChange: boolean;
    deletedAt?: Date | null | undefined;
  };
}
