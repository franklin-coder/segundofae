const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testApiLogic() {
  console.log('🔍 Testing API logic for different categories...\n')

  const testCategories = ['necklaces', 'earrings', 'bracelets', 'and-more', 'anklets', 'all']

  for (const category of testCategories) {
    console.log(`\n📋 Testing category: "${category}"`)
    console.log('=' .repeat(50))

    try {
      // Simulate the API logic
      const where = {}

      if (category && category !== 'all') {
        // Handle category mapping for URL-friendly names
        const categoryMap = {
          'and-more': 'anklets', // Map URL-friendly name to database value
          'necklaces': 'necklaces',
          'earrings': 'earrings',
          'bracelets': 'bracelets'
        }
        
        const mappedCategory = categoryMap[category] || category
        where.category = mappedCategory
        console.log(`🔄 Mapped category '${category}' to '${mappedCategory}'`)
      }

      console.log(`🔍 Prisma query where:`, JSON.stringify(where, null, 2))

      // Execute the Prisma query
      const products = await prisma.product.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        }
      })

      console.log(`✅ Found ${products.length} products`)
      
      if (products.length > 0) {
        console.log('📦 Products found:')
        products.forEach(product => {
          console.log(`  - ${product.name} (${product.category})`)
        })
      }

    } catch (error) {
      console.error(`❌ ERROR for category "${category}":`, error.message)
      console.error('Stack trace:', error.stack)
    }
  }

  console.log('\n🔍 Testing database connection...')
  try {
    const allProducts = await prisma.product.findMany()
    console.log(`✅ Database connection OK. Total products in DB: ${allProducts.length}`)
    
    console.log('\n📊 Products by category:')
    const categoryCount = {}
    allProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
    })
    console.log(categoryCount)
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
  }
}

testApiLogic()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
