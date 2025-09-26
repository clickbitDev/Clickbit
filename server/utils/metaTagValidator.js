const cheerio = require('cheerio');
const axios = require('axios');

/**
 * Meta Tag Validation and Testing Utilities
 * Provides tools to validate and test meta tags for social media previews
 */

class MetaTagValidator {
  constructor() {
    this.requiredMetaTags = [
      'og:title',
      'og:description', 
      'og:image',
      'og:url',
      'og:type',
      'twitter:card',
      'twitter:title',
      'twitter:description',
      'twitter:image'
    ];
    
    this.optionalMetaTags = [
      'og:image:width',
      'og:image:height',
      'og:image:alt',
      'og:site_name',
      'twitter:image:alt',
      'twitter:site',
      'description',
      'robots',
      'canonical'
    ];
  }

  /**
   * Validate meta tags from HTML content
   * @param {string} html - HTML content to validate
   * @param {string} url - URL being validated
   * @returns {Object} Validation results
   */
  validateMetaTags(html, url) {
    const $ = cheerio.load(html);
    const results = {
      url,
      isValid: true,
      errors: [],
      warnings: [],
      metaTags: {},
      structuredData: null,
      score: 0,
      recommendations: []
    };

    // Extract meta tags
    $('meta').each((i, element) => {
      const $el = $(element);
      const property = $el.attr('property') || $el.attr('name');
      const content = $el.attr('content');
      
      if (property && content) {
        results.metaTags[property] = content;
      }
    });

    // Extract structured data
    $('script[type="application/ld+json"]').each((i, element) => {
      try {
        const jsonData = JSON.parse($(element).html());
        results.structuredData = jsonData;
      } catch (error) {
        results.warnings.push('Invalid JSON-LD structured data');
      }
    });

    // Validate required meta tags
    this.requiredMetaTags.forEach(tag => {
      if (!results.metaTags[tag]) {
        results.errors.push(`Missing required meta tag: ${tag}`);
        results.isValid = false;
      } else {
        results.score += 10; // 10 points per required tag
      }
    });

    // Validate optional meta tags
    this.optionalMetaTags.forEach(tag => {
      if (results.metaTags[tag]) {
        results.score += 5; // 5 points per optional tag
      }
    });

    // Validate specific meta tag content
    this.validateMetaContent(results);

    // Generate recommendations
    this.generateRecommendations(results);

    return results;
  }

  /**
   * Validate meta tag content quality
   * @param {Object} results - Validation results object
   */
  validateMetaContent(results) {
    const { metaTags } = results;

    // Validate title length
    if (metaTags['og:title']) {
      const titleLength = metaTags['og:title'].length;
      if (titleLength < 30) {
        results.warnings.push('Title is too short (recommended: 30-60 characters)');
      } else if (titleLength > 60) {
        results.warnings.push('Title is too long (recommended: 30-60 characters)');
      } else {
        results.score += 5;
      }
    }

    // Validate description length
    if (metaTags['og:description']) {
      const descLength = metaTags['og:description'].length;
      if (descLength < 120) {
        results.warnings.push('Description is too short (recommended: 120-160 characters)');
      } else if (descLength > 160) {
        results.warnings.push('Description is too long (recommended: 120-160 characters)');
      } else {
        results.score += 5;
      }
    }

    // Validate image URL
    if (metaTags['og:image']) {
      if (!metaTags['og:image'].startsWith('http')) {
        results.errors.push('Image URL must be absolute (start with http/https)');
        results.isValid = false;
      } else {
        results.score += 5;
      }
    }

    // Validate URL format
    if (metaTags['og:url']) {
      try {
        new URL(metaTags['og:url']);
        results.score += 5;
      } catch (error) {
        results.errors.push('Invalid URL format in og:url');
        results.isValid = false;
      }
    }

    // Check for duplicate titles
    if (metaTags['og:title'] && metaTags['twitter:title']) {
      if (metaTags['og:title'] !== metaTags['twitter:title']) {
        results.warnings.push('Open Graph and Twitter titles should match');
      }
    }

    // Check for duplicate descriptions
    if (metaTags['og:description'] && metaTags['twitter:description']) {
      if (metaTags['og:description'] !== metaTags['twitter:description']) {
        results.warnings.push('Open Graph and Twitter descriptions should match');
      }
    }
  }

  /**
   * Generate recommendations for improving meta tags
   * @param {Object} results - Validation results object
   */
  generateRecommendations(results) {
    const { metaTags } = results;

    if (!metaTags['og:image:width'] || !metaTags['og:image:height']) {
      results.recommendations.push('Add og:image:width and og:image:height for better social media display');
    }

    if (!metaTags['og:image:alt']) {
      results.recommendations.push('Add og:image:alt for accessibility');
    }

    if (!metaTags['og:site_name']) {
      results.recommendations.push('Add og:site_name for brand recognition');
    }

    if (!metaTags['twitter:site']) {
      results.recommendations.push('Add twitter:site with your Twitter handle');
    }

    if (!results.structuredData) {
      results.recommendations.push('Add JSON-LD structured data for better SEO');
    }

    if (!metaTags['canonical']) {
      results.recommendations.push('Add canonical URL to prevent duplicate content issues');
    }
  }

  /**
   * Test meta tags by fetching URL and validating
   * @param {string} url - URL to test
   * @param {Object} options - Testing options
   * @returns {Promise<Object>} Test results
   */
  async testUrl(url, options = {}) {
    const {
      userAgent = 'facebookexternalhit/1.1',
      timeout = 10000,
      followRedirects = true
    } = options;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': userAgent
        },
        timeout,
        maxRedirects: followRedirects ? 5 : 0,
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      });

      if (response.status >= 400) {
        return {
          url,
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          metaTags: null
        };
      }

      const validation = this.validateMetaTags(response.data, url);
      
      return {
        url,
        success: true,
        status: response.status,
        validation,
        responseTime: response.headers['x-response-time'] || 'unknown'
      };

    } catch (error) {
      return {
        url,
        success: false,
        error: error.message,
        metaTags: null
      };
    }
  }

  /**
   * Test multiple URLs in batch
   * @param {Array<string>} urls - URLs to test
   * @param {Object} options - Testing options
   * @returns {Promise<Array>} Array of test results
   */
  async testMultipleUrls(urls, options = {}) {
    const results = [];
    
    for (const url of urls) {
      try {
        const result = await this.testUrl(url, options);
        results.push(result);
        
        // Add delay between requests to be respectful
        if (options.delay) {
          await new Promise(resolve => setTimeout(resolve, options.delay));
        }
      } catch (error) {
        results.push({
          url,
          success: false,
          error: error.message,
          metaTags: null
        });
      }
    }

    return results;
  }

  /**
   * Generate a validation report
   * @param {Array} testResults - Array of test results
   * @returns {Object} Validation report
   */
  generateReport(testResults) {
    const totalTests = testResults.length;
    const successfulTests = testResults.filter(result => result.success).length;
    const failedTests = totalTests - successfulTests;
    
    const avgScore = testResults
      .filter(result => result.success && result.validation)
      .reduce((sum, result) => sum + result.validation.score, 0) / successfulTests || 0;

    const commonIssues = this.identifyCommonIssues(testResults);

    return {
      summary: {
        totalTests,
        successfulTests,
        failedTests,
        successRate: (successfulTests / totalTests) * 100,
        averageScore: Math.round(avgScore)
      },
      commonIssues,
      recommendations: this.generateGlobalRecommendations(testResults),
      details: testResults
    };
  }

  /**
   * Identify common issues across test results
   * @param {Array} testResults - Array of test results
   * @returns {Array} Common issues
   */
  identifyCommonIssues(testResults) {
    const issues = {};
    
    testResults.forEach(result => {
      if (result.success && result.validation) {
        result.validation.errors.forEach(error => {
          issues[error] = (issues[error] || 0) + 1;
        });
        result.validation.warnings.forEach(warning => {
          issues[warning] = (issues[warning] || 0) + 1;
        });
      }
    });

    return Object.entries(issues)
      .sort(([,a], [,b]) => b - a)
      .map(([issue, count]) => ({ issue, count }));
  }

  /**
   * Generate global recommendations based on all test results
   * @param {Array} testResults - Array of test results
   * @returns {Array} Global recommendations
   */
  generateGlobalRecommendations(testResults) {
    const recommendations = new Set();
    
    testResults.forEach(result => {
      if (result.success && result.validation) {
        result.validation.recommendations.forEach(rec => recommendations.add(rec));
      }
    });

    return Array.from(recommendations);
  }
}

module.exports = MetaTagValidator;
