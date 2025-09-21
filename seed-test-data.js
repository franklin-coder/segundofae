const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding test data...')

  const products = [
    {
      name: 'Elegant Gold Necklace',
      description: 'Beautiful handcrafted gold necklace',
      longDescription: 'A stunning piece crafted with love and attention to detail',
      category: 'necklaces',
      price: 89.99,
      images: ['test-image-1.jpg'],
      featured: true,
      inStock: true,
      materials: ['gold', 'beads'],
      dimensions: '18 inches',
      care_instructions: 'Keep dry and clean with soft cloth'
    },
    {
      name: 'Silver Drop Earrings',
      description: 'Elegant silver drop earrings',
      longDescription: 'Perfect for any occasion, these earrings add elegance to your look',
      category: 'earrings',
      price: 45.99,
      images: ['test-image-2.jpg'],
      featured: false,
      inStock: true,
      materials: ['silver', 'crystals'],
      dimensions: '2 inches',
      care_instructions: 'Store in jewelry box'
    },
    {
      name: 'Bohemian Bracelet',
      description: 'Handwoven bohemian style bracelet',
      longDescription: 'A beautiful bracelet that captures the free spirit of bohemian style',
      category: 'bracelets',
      price: 32.99,
      images: ['test-image-3.jpg'],
      featured: true,
      inStock: true,
      materials: ['cotton', 'beads'],
      dimensions: '7 inches',
      care_instructions: 'Hand wash gently'
    },
    {
      name: 'Delicate Anklet',
      description: 'Delicate chain anklet with charms',
      longDescription: 'Perfect summer accessory for beach days and casual wear',
      category: 'anklets',
      price: 28.99,
      images: ['test-image-4.jpg'],
      featured: false,
      inStock: true,
      materials: ['silver', 'charms'],
      dimensions: '9 inches',
      care_instructions: 'Keep away from water'
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
    console.log(`Created product: ${product.name}`)
  }

  console.log('Test data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
