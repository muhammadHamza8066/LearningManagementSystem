import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const instructorPassword = await bcrypt.hash("instructor123", 12);
  const studentPassword = await bcrypt.hash("student123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@learnforge.dev" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@learnforge.dev",
      password: adminPassword,
      role: "ADMIN",
      isApproved: true,
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@learnforge.dev" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "instructor@learnforge.dev",
      password: instructorPassword,
      role: "INSTRUCTOR",
      isApproved: true,
      bio: "Full-stack developer with 8 years of experience. Passionate about teaching web development.",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@learnforge.dev" },
    update: {},
    create: {
      name: "Alex Chen",
      email: "student@learnforge.dev",
      password: studentPassword,
      role: "STUDENT",
      isApproved: true,
    },
  });

  const categories = [
    { name: "Web Development", slug: "web-development" },
    { name: "Mobile Development", slug: "mobile-development" },
    { name: "Data Science", slug: "data-science" },
    { name: "Game Development", slug: "game-development" },
    { name: "DevOps", slug: "devops" },
    { name: "Design", slug: "design" },
    { name: "Business", slug: "business" },
    { name: "Cybersecurity", slug: "cybersecurity" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Seed complete:");
  console.log(`  Admin: ${admin.email} / admin123`);
  console.log(`  Instructor: ${instructor.email} / instructor123`);
  console.log(`  Student: ${student.email} / student123`);
  console.log(`  Categories: ${categories.length} created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
