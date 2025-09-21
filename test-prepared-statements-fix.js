#!/usr/bin/env node
// test-prepared-statements-fix.js
// Script para probar la solución del error de prepared statements duplicados

const http = require('http');

console.log('🧪 Testing prepared statements fix...');
console.log('📋 This test simulates the exact scenario that caused the error:');
console.log('   1. First request creates prepared statement "s0"');
console.log('   2. Second request should NOT fail with "prepared statement already exists"');
console.log('');

// Configuración del test
const HOST = 'localhost';
const PORT = 3000;
const API_PATH = '/api/products?category=necklaces';

// Función para hacer request HTTP
function makeRequest(requestNumber) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: API_PATH,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `PreparedStatementsTest/${requestNumber}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: jsonData,
            requestNumber
          });
        } catch (parseError) {
          resolve({
            statusCode: res.statusCode,
            data: { error: 'Failed to parse JSON', raw: data },
            requestNumber
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({ error, requestNumber });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject({ error: new Error('Request timeout'), requestNumber });
    });

    req.end();
  });
}

// Función principal de test
async function runTest() {
  console.log(`🎯 Target: http://${HOST}:${PORT}${API_PATH}`);
  console.log('');

  const results = [];
  const totalRequests = 5;

  for (let i = 1; i <= totalRequests; i++) {
    try {
      console.log(`📤 Request ${i}/${totalRequests}...`);
      const startTime = Date.now();
      
      const result = await makeRequest(i);
      const duration = Date.now() - startTime;
      
      results.push(result);
      
      if (result.statusCode === 200) {
        console.log(`✅ Request ${i}: SUCCESS (${duration}ms) - Found ${result.data.products?.length || 0} products`);
      } else if (result.statusCode === 500) {
        console.log(`❌ Request ${i}: FAILED (${duration}ms) - Status: ${result.statusCode}`);
        console.log(`   Error: ${result.data.error || 'Unknown error'}`);
        console.log(`   Details: ${result.data.details || 'No details'}`);
        
        // Detectar específicamente el error de prepared statements
        if (result.data.details && result.data.details.includes('prepared statement')) {
          console.log(`🚨 CRITICAL: Prepared statement error detected!`);
          console.log(`   This means the fix is NOT working properly.`);
        }
      } else {
        console.log(`⚠️ Request ${i}: Unexpected status ${result.statusCode} (${duration}ms)`);
      }
      
      // Pequeña pausa entre requests para simular navegación real
      if (i < totalRequests) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.log(`💥 Request ${i}: EXCEPTION - ${error.error?.message || error.message || 'Unknown error'}`);
      results.push({ error: error.error || error, requestNumber: i });
    }
  }

  console.log('');
  console.log('📊 TEST RESULTS SUMMARY:');
  console.log('========================');
  
  const successful = results.filter(r => r.statusCode === 200).length;
  const failed = results.filter(r => r.statusCode === 500).length;
  const errors = results.filter(r => r.error).length;
  
  console.log(`✅ Successful requests: ${successful}/${totalRequests}`);
  console.log(`❌ Failed requests: ${failed}/${totalRequests}`);
  console.log(`💥 Exception errors: ${errors}/${totalRequests}`);
  
  if (successful === totalRequests) {
    console.log('');
    console.log('🎉 SUCCESS! All requests completed successfully.');
    console.log('✨ The prepared statements fix is working correctly!');
    console.log('🔧 No "prepared statement already exists" errors detected.');
  } else if (failed > 0) {
    console.log('');
    console.log('⚠️ PARTIAL SUCCESS: Some requests failed.');
    console.log('🔍 Check the error details above to identify remaining issues.');
    
    // Buscar errores específicos de prepared statements
    const preparedStatementErrors = results.filter(r => 
      r.data?.details && r.data.details.includes('prepared statement')
    );
    
    if (preparedStatementErrors.length > 0) {
      console.log('🚨 CRITICAL: Prepared statement errors still occurring!');
      console.log('   The fix needs additional work.');
    } else {
      console.log('✅ Good news: No prepared statement errors detected.');
      console.log('   The failures might be due to other issues.');
    }
  } else {
    console.log('');
    console.log('💥 FAILURE: All requests failed or had exceptions.');
    console.log('🔧 Check that the server is running and accessible.');
  }
  
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. If successful: The fix is working! Deploy with confidence.');
  console.log('   2. If failed: Review the error details and adjust the fix.');
  console.log('   3. Test in production environment to confirm.');
}

// Ejecutar el test
runTest().catch(error => {
  console.error('💥 Test script failed:', error);
  process.exit(1);
});
