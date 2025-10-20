#!/usr/bin/env node

/**
 * Setup Checker Script
 * Verifies that all required environment variables and dependencies are configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description}`, 'red');
    return false;
  }
}

function checkEnvVariable(varName, envContent) {
  const regex = new RegExp(`^${varName}=.+`, 'm');
  const match = envContent.match(regex);
  
  if (match) {
    const value = match[0].split('=')[1];
    if (value && value !== 'your_' + varName.toLowerCase() + '_here' && value !== 'PLACEHOLDER_API_KEY') {
      log(`✓ ${varName} is set`, 'green');
      return true;
    } else {
      log(`✗ ${varName} is not configured (still has placeholder value)`, 'yellow');
      return false;
    }
  } else {
    log(`✗ ${varName} is missing`, 'red');
    return false;
  }
}

async function main() {
  log('\n🔍 Checking MPP Pandeglang Setup...\n', 'cyan');

  let allGood = true;

  // Check .env.local file
  log('📄 Checking environment configuration...', 'blue');
  const cwd = process.cwd();
  const envPath = path.join(cwd, '.env.local');
  
  if (!checkFile(envPath, '.env.local file exists')) {
    log('\n💡 Tip: Copy .env.example to .env.local and fill in your credentials', 'yellow');
    allGood = false;
  } else {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    log('\n🔑 Checking environment variables...', 'blue');
    allGood = checkEnvVariable('GEMINI_API_KEY', envContent) && allGood;
    allGood = checkEnvVariable('SUPABASE_URL', envContent) && allGood;
    allGood = checkEnvVariable('SUPABASE_ANON_KEY', envContent) && allGood;
  }

  // Check node_modules
  log('\n📦 Checking dependencies...', 'blue');
  allGood = checkFile(
    path.join(cwd, 'node_modules'),
    'node_modules directory exists'
  ) && allGood;

  // Check Supabase files
  log('\n🗄️  Checking Supabase files...', 'blue');
  allGood = checkFile(
    path.join(cwd, 'supabase', 'schema.sql'),
    'Database schema file exists'
  ) && allGood;
  allGood = checkFile(
    path.join(cwd, 'supabase', 'seed.sql'),
    'Database seed file exists'
  ) && allGood;

  // Check key source files
  log('\n📝 Checking source files...', 'blue');
  allGood = checkFile(
    path.join(cwd, 'lib', 'supabase.ts'),
    'Supabase client file exists'
  ) && allGood;
  allGood = checkFile(
    path.join(cwd, 'services', 'supabaseService.ts'),
    'Supabase service file exists'
  ) && allGood;

  // Final summary
  log('\n' + '='.repeat(50), 'cyan');
  if (allGood) {
    log('✅ All checks passed! You\'re ready to run the app.', 'green');
    log('\n🚀 Next steps:', 'cyan');
    log('   1. Make sure you\'ve run the SQL scripts in Supabase', 'reset');
    log('   2. Run: npm run dev', 'reset');
    log('   3. Open: http://localhost:3000', 'reset');
  } else {
    log('❌ Some checks failed. Please fix the issues above.', 'red');
    log('\n📖 For detailed setup instructions, see:', 'cyan');
    log('   - SUPABASE_SETUP.md', 'reset');
    log('   - README.md', 'reset');
  }
  log('='.repeat(50) + '\n', 'cyan');

  process.exit(allGood ? 0 : 1);
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
