// tsx src/scripts/verifyAdmin.ts

import { prisma } from "../lib/prisma";

async function verifyAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "ishtiaqrobin.me@gmail.com";

    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: {
        accounts: true,
        sessions: true,
      },
    });

    if (!admin) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("\n✅ Admin User Found:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", admin.email);
    console.log("👤 Name:", admin.name);
    console.log("🔑 Role:", admin.role);
    console.log("✉️  Email Verified:", admin.emailVerified);
    console.log("🟢 Active:", admin.isActive);
    console.log("🚫 Banned:", admin.isBanned);
    console.log("📅 Created:", admin.createdAt);
    console.log("\n🔐 Accounts:", admin.accounts.length);
    admin.accounts.forEach((acc, i) => {
      console.log(
        `   ${i + 1}. Provider: ${acc.providerId}, Has Password: ${!!acc.password}`,
      );
    });
    console.log("\n🔓 Active Sessions:", admin.sessions.length);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdmin();
