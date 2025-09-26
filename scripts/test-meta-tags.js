#!/usr/bin/env node

/**
 * Meta Tag Testing Script
 * Tests meta tags for social media previews across different URLs
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MetaTagValidator = require('../server/utils/metaTagValidator');
const axios = require('axios');

// Test URLs to validate
const TEST_URLS = [
  'https://clickbit.com.au/',
  'https://clickbit.com.au/about',
  'https://clickbit.com.au/contact',
  'https://clickbit.com.au/portfolio',
  'https://clickbit.com.au/services',
  'https://clickbit.com.au/blog',
  // Add more URLs as needed
];

// Different user agents to test
const USER_AGENTS = {
  facebook: 'facebookexternalhit/1.1',
  twitter: 'Twitterbot/1.0',
  linkedin: 'LinkedInBot/1.0',
  google: 'Googlebot/2.1',
  generic: 'Mozilla/5.0 (compatible; MetaTagTester/1.0)'
};

class MetaTagTester {
  constructor() {
    this.validator = new MetaTagValidator();
    this.results = [];
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🧪 Starting Meta Tag Testing...\n');
    
    // Test with different user agents
    for (const [agentName, userAgent] of Object.entries(USER_AGENTS)) {
      console.log(`\n📱 Testing with ${agentName} user agent...`);
      console.log('=' .repeat(50));
      
      const agentResults = await this.testWithUserAgent(TEST_URLS, userAgent);
      this.results.push(...agentResults);
    }

    // Generate and display report
    this.displayReport();
  }

  /**
   * Test URLs with specific user agent
   */
  async testWithUserAgent(urls, userAgent) {
    const results = [];
    
    for (const url of urls) {
      console.log(`\n🔍 Testing: ${url}`);
      
      try {
        const result = await this.validator.testUrl(url, {
          userAgent,
          timeout: 15000,
          delay: 1000 // 1 second delay between requests
        });

        results.push(result);
        
        if (result.success) {
          const { validation } = result;
          console.log(`✅ Status: ${result.status}`);
          console.log(`📊 Score: ${validation.score}/100`);
          
          if (validation.errors.length > 0) {
            console.log(`❌ Errors: ${validation.errors.length}`);
            validation.errors.forEach(error => console.log(`   - ${error}`));
          }
          
          if (validation.warnings.length > 0) {
            console.log(`⚠️  Warnings: ${validation.warnings.length}`);
            validation.warnings.forEach(warning => console.log(`   - ${warning}`));
          }
          
          if (validation.recommendations.length > 0) {
            console.log(`💡 Recommendations: ${validation.recommendations.length}`);
            validation.recommendations.forEach(rec => console.log(`   - ${rec}`));
          }
        } else {
          console.log(`❌ Failed: ${result.error}`);
        }
        
      } catch (error) {
        console.log(`💥 Error: ${error.message}`);
        results.push({
          url,
          success: false,
          error: error.message,
          userAgent
        });
      }
    }

    return results;
  }

  /**
   * Display comprehensive test report
   */
  displayReport() {
    console.log('\n\n📋 COMPREHENSIVE TEST REPORT');
    console.log('=' .repeat(60));
    
    const report = this.validator.generateReport(this.results);
    
    // Summary
    console.log('\n📊 SUMMARY');
    console.log('-'.repeat(30));
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Successful: ${report.summary.successfulTests}`);
    console.log(`Failed: ${report.summary.failedTests}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
    console.log(`Average Score: ${report.summary.averageScore}/100`);
    
    // Common Issues
    if (report.commonIssues.length > 0) {
      console.log('\n🚨 COMMON ISSUES');
      console.log('-'.repeat(30));
      report.commonIssues.forEach(({ issue, count }) => {
        console.log(`${count}x ${issue}`);
      });
    }
    
    // Global Recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 GLOBAL RECOMMENDATIONS');
      console.log('-'.repeat(30));
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
    // Detailed Results
    console.log('\n📝 DETAILED RESULTS');
    console.log('-'.repeat(30));
    report.details.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.url}`);
      console.log(`   User Agent: ${result.userAgent || 'Default'}`);
      console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
      
      if (result.success && result.validation) {
        console.log(`   Score: ${result.validation.score}/100`);
        console.log(`   Errors: ${result.validation.errors.length}`);
        console.log(`   Warnings: ${result.validation.warnings.length}`);
      } else if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
  }

  /**
   * Test specific URL with all user agents
   */
  async testSpecificUrl(url) {
    console.log(`\n🎯 Testing specific URL: ${url}\n`);
    
    const results = [];
    
    for (const [agentName, userAgent] of Object.entries(USER_AGENTS)) {
      console.log(`Testing with ${agentName}...`);
      
      const result = await this.validator.testUrl(url, { userAgent });
      results.push({ ...result, userAgent: agentName });
      
      if (result.success) {
        console.log(`✅ ${agentName}: Score ${result.validation.score}/100`);
      } else {
        console.log(`❌ ${agentName}: ${result.error}`);
      }
    }
    
    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const tester = new MetaTagTester();
  
  if (args.length > 0) {
    // Test specific URL
    const url = args[0];
    if (!url.startsWith('http')) {
      console.error('❌ Please provide a valid URL starting with http:// or https://');
      process.exit(1);
    }
    
    await tester.testSpecificUrl(url);
  } else {
    // Run all tests
    await tester.runAllTests();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  });
}

module.exports = MetaTagTester;
