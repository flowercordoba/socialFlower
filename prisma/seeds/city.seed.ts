import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCities() {
  const cities = [
    {
      name: 'Bogotá',
      region: 'Cundinamarca',
      country: 'Colombia',
    },
    {
      name: 'Medellín',
      region: 'Antioquia',
      country: 'Colombia',
    },
    {
      name: 'Cali',
      region: 'Valle del Cauca',
      country: 'Colombia',
    },
    {
      name: 'Barranquilla',
      region: 'Atlántico',
      country: 'Colombia',
    },
    {
      name: 'Cartagena',
      region: 'Bolívar',
      country: 'Colombia',
    },
    // Puedes agregar todas las que necesites...
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city,
    });
  }

  console.log('✅ Cities seeded successfully.');
}

seedCities()
  .catch((error) => {
    console.error('Error seeding cities:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
