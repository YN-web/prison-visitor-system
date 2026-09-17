import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: 'VISITOR',
      description: 'Registered prison visitor',
    },
    {
      name: 'GATE_GUARD',
      description: 'Verifies visitors and manages check-in/check-out',
    },
    {
      name: 'PRISON_OFFICER',
      description: 'Manages prisoners and visit requests',
    },
    {
      name: 'SUPERINTENDENT',
      description: 'Views and manages prison operations',
    },
    {
      name: 'IT_SUPPORT',
      description: 'Manages technical system operations',
    },
    {
      name: 'ADMIN',
      description: 'System administrator',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Roles created successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });