// tsx src/scripts/seedAdmin.ts

import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

async function seedAdmin() {
  try {
    console.log("🌱 Starting admin seed...");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    const adminName = process.env.ADMIN_NAME || "Admin";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:", adminEmail);

      // Update to admin role if not already
      if (existingAdmin.role !== "ADMIN") {
        await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { role: "ADMIN", emailVerified: true },
        });
        console.log("✅ Updated existing user to ADMIN role");
      }

      console.log("✅ Seed completed");
      return;
    }

    // Use Better Auth's API to create user with email/password
    const response = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
      },
    });

    if (!response || !response.user) {
      throw new Error("Failed to create admin user via Better Auth");
    }

    console.log("✅ Admin user created via Better Auth:", response.user.email);

    // Update user to ADMIN role and verify email
    await prisma.user.update({
      where: { id: response.user.id },
      data: {
        role: "ADMIN",
        emailVerified: true,
      },
    });

    console.log("✅ Admin role and email verification set");
    console.log("\n📧 Admin Credentials:");
    console.log("   Email:", adminEmail);
    console.log("   Password:", adminPassword);
    console.log("   Name:", adminName);
    console.log("\n🎉 Admin seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
