const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

/**
 * seedAdmin — Automatically creates the admin account on server start
 * if it doesn't already exist. Credentials are read from .env:
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Admin";

    if (!adminEmail || !adminPassword) {
      console.log("⚠️  Admin credentials not set in .env. Skipping admin seed.".yellow);
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Ensure isAdmin flag is set (handles case where user was registered manually)
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log(`✅ Admin flag set for existing user: ${adminEmail}`.cyan);
      } else {
        console.log(`✅ Admin account already exists: ${adminEmail}`.cyan);
      }
      return;
    }

    // Create fresh admin account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      isDoctor: false,
    });

    await adminUser.save();
    console.log(
      `\n  👑 Admin account created!`.green.bold +
      `\n     Email   : ${adminEmail}`.green +
      `\n     Password: ${adminPassword}`.green +
      `\n`
    );
  } catch (error) {
    console.error("❌ Admin seed error:".red, error.message);
  }
};

module.exports = seedAdmin;
