const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Simulate the exact API logic from the improved route
async function simulateApiCall(category, featured = null, limit = null) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    console.log(`[API:${requestId}] 🚀 Starting request - category: ${category}, featured: ${featured}, limit: ${limit}`)

    // ✅ Validate database connection first
    try {
      await prisma.$connect()
      console.log(`[API:${requestId}] ✅ Database connection successful`)
    } catch (dbError) {
      console.error(`[API:${requestId}] ❌ Database connection failed:`, dbError)
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown DB error'}`)
    }

    // ✅ Construir el filtro dinámico para Prisma
    const where = {}

    if (category && category !== 'all') {
      // Handle category mapping for URL-friendly names
      const categoryMap = {
        'and-more': 'anklets', // Map URL-friendly name to database value
        'necklaces': 'necklaces',
        'earrings': 'earrings',
        'bracelets': 'bracelets',
        'anklets': 'anklets' // Direct mapping for anklets
      }
      
      const mappedCategory = categoryMap[category] || category
      where.category = mappedCategory
      console.log(`[API:${requestId}] 🔄 Mapped category '${category}' to '${mappedCategory}'`)
      
      // Validate that the mapped category is valid
      const validCategories = ['necklaces', 'earrings', 'bracelets', 'anklets']
      if (!validCategories.includes(mappedCategory)) {
        console.warn(`[API:${requestId}] ⚠️ Invalid category '${mappedCategory}', proceeding anyway`)
      }
    }

    if (featured === 'true') {
      where.featured = true
      console.log(`[API:${requestId}] ⭐ Filtering for featured products`)
    }

    // ✅ Construir opciones de consulta
    const take = limit ? parseInt(limit, 10) : undefined
    if (take && (take < 1 || take > 100)) {
      console.warn(`[API:${requestId}] ⚠️ Invalid limit ${take}, using default`)
    }

    console.log(`[API:${requestId}] 🔍 Prisma query where:`, JSON.stringify(where, null, 2))

    // ✅ Usar Prisma para obtener productos con timeout
    const queryStartTime = Date.now()
    const products = await Promise.race([
      prisma.product.findMany({
        where,
        take: take && take > 0 && take <= 100 ? take : undefined,
        orderBy: {
          created_at: 'desc'
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
      )
    ])

    const queryTime = Date.now() - queryStartTime
    console.log(`[API:${requestId}] ✅ Query completed in ${queryTime}ms - Found ${products.length} products`)

    // ✅ Validate products data
    if (!Array.isArray(products)) {
      throw new Error('Invalid products data returned from database')
    }

    // ✅ Log product details for debugging
    if (products.length > 0) {
      console.log(`[API:${requestId}] 📦 Products found:`)
      products.forEach((product, index) => {
        console.log(`[API:${requestId}]   ${index + 1}. ${product.name} (${product.category})`)
      })
    } else {
      console.log(`[API:${requestId}] 📭 No products found for query`)
    }

    const totalTime = Date.now() - startTime
    console.log(`[API:${requestId}] 🏁 Request completed in ${totalTime}ms`)

    return {
      success: true,
      products,
      total: products.length,
      query: { 
        category, 
        featured, 
        limit, 
        mappedCategory: where.category,
        requestId,
        queryTime: `${queryTime}ms`,
        totalTime: `${totalTime}ms`
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[API:${requestId}] ❌ Error after ${totalTime}ms:`, error)
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error(`[API:${requestId}] Error name:`, error.name)
      console.error(`[API:${requestId}] Error message:`, error.message)
      console.error(`[API:${requestId}] Error stack:`, error.stack)
    }

    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error(`[API:${requestId}] Prisma error code:`, error.code)
      console.error(`[API:${requestId}] Prisma error meta:`, error.meta)
    }

    return {
      success: false,
      error: 'Failed to fetch products',
      products: [],
      total: 0,
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      timestamp: new Date().toISOString(),
      totalTime: `${totalTime}ms`
    }
  }
}

async function testCompleteFlow() {
  console.log('🧪 COMPLETE FLOW TEST - Simulating User Navigation')
  console.log('=' .repeat(70))

  // Test scenarios that simulate user navigation
  const testScenarios = [
    {
      name: 'Initial page load (all products)',
      category: null,
      expectedSuccess: true
    },
    {
      name: 'Navigate to Necklaces',
      category: 'necklaces',
      expectedSuccess: true
    },
    {
      name: 'Navigate to Earrings',
      category: 'earrings',
      expectedSuccess: true
    },
    {
      name: 'Navigate to Bracelets',
      category: 'bracelets',
      expectedSuccess: true
    },
    {
      name: 'Navigate to And More (problematic one)',
      category: 'and-more',
      expectedSuccess: true
    },
    {
      name: 'Navigate to Anklets directly',
      category: 'anklets',
      expectedSuccess: true
    },
    {
      name: 'Navigate back to All',
      category: 'all',
      expectedSuccess: true
    },
    {
      name: 'Invalid category',
      category: 'invalid-category',
      expectedSuccess: true // Should return empty results, not error
    }
  ]

  let passedTests = 0
  let failedTests = 0

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i]
    console.log(`\n${i + 1}️⃣ ${scenario.name}`)
    console.log('-' .repeat(50))

    try {
      const result = await simulateApiCall(scenario.category)
      
      if (result.success === scenario.expectedSuccess) {
        console.log(`✅ PASS: ${scenario.name}`)
        console.log(`   📊 Found ${result.total} products`)
        if (result.query) {
          console.log(`   🔍 Query: ${JSON.stringify(result.query, null, 2)}`)
        }
        passedTests++
      } else {
        console.log(`❌ FAIL: ${scenario.name}`)
        console.log(`   Expected success: ${scenario.expectedSuccess}, Got: ${result.success}`)
        console.log(`   Error: ${result.details || result.error}`)
        failedTests++
      }
      
      // Wait between tests to simulate real user behavior
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.log(`❌ FAIL: ${scenario.name} - Exception thrown`)
      console.log(`   Error: ${error.message}`)
      failedTests++
    }
  }

  console.log('\n📊 TEST SUMMARY')
  console.log('=' .repeat(70))
  console.log(`✅ Passed: ${passedTests}`)
  console.log(`❌ Failed: ${failedTests}`)
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`)

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! The CRUD logic is working correctly.')
    console.log('   If you\'re still experiencing HTTP 500 errors in the browser,')
    console.log('   the issue is likely in the Next.js server configuration,')
    console.log('   environment variables, or build process.')
  } else {
    console.log('\n⚠️ Some tests failed. Check the error details above.')
  }
}

testCompleteFlow()
  .catch((e) => {
    console.error('❌ Test suite failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
