import { prisma } from "../../lib/prisma";
import { UpdateUserInput } from "./user.interface";

// Get user profile
const getUserProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Update user profile
const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      updatedAt: true,
    },
  });

  return result;
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
};
