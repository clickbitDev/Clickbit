const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration for your setup
const sequelize = new Sequelize(
  'clickbitdb',  // database name
  'root',        // username
  'root',        // password
  {
    host: 'localhost',
    port: 8889,  // your MySQL port
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Define Service model inline
const Service = sequelize.define('Service', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  headerImage: {
    type: Sequelize.STRING,
    allowNull: true,
    field: 'header_image',
  },
  features: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  pricing: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  sections: {
    type: Sequelize.JSON,
    allowNull: true,
  },
  isPopular: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    field: 'is_popular',
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'services',
  timestamps: true,
});

// Define Product model inline
const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  slug: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  short_description: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  compare_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  cost_price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sku: {
    type: Sequelize.STRING(100),
    allowNull: true,
    unique: true
  },
  barcode: {
    type: Sequelize.STRING(100),
    allowNull: true
  },
  weight: {
    type: Sequelize.DECIMAL(8, 3),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  dimensions: {
    type: Sequelize.JSON,
    allowNull: true,
    comment: '{"length": 10, "width": 5, "height": 2}'
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  images: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of image URLs'
  },
  featured_image: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  stock_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  low_stock_threshold: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 5,
    validate: {
      min: 0
    }
  },
  track_inventory: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  allow_backorders: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: Sequelize.ENUM('active', 'inactive', 'draft', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  },
  featured: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  sort_order: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  meta_title: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  meta_keywords: {
    type: Sequelize.STRING(500),
    allowNull: true
  },
  seo_data: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: {}
  },
  attributes: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Product attributes like color, size, etc.'
  },
  variants: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Product variants with different prices/attributes'
  },
  tags: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of tag strings'
  },
  rating: {
    type: Sequelize.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  review_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  view_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sales_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

async function createProductsFromServices() {
  try {
    console.log('🔧 Converting Services to Products...\n');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Get all active services
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    
    console.log(`📋 Found ${services.length} active services\n`);
    
    const productsToCreate = [];
    const serviceToProductMapping = {};
    
    // Process each service
    for (const service of services) {
      const serviceData = service.toJSON();
      const pricing = typeof serviceData.pricing === 'string' 
        ? JSON.parse(serviceData.pricing) 
        : serviceData.pricing;
      
      if (!pricing || !pricing.tiers) {
        console.log(`⚠️  No pricing tiers found for service: ${serviceData.name}`);
        continue;
      }
      
      console.log(`\n🔍 Processing: ${serviceData.name} (${serviceData.slug})`);
      
      // Process each pricing tier
      pricing.tiers.forEach((tier, index) => {
        // Extract numeric price
        const priceStr = tier.price.replace(/[$,]/g, '').replace(/from\s+/i, '');
        const price = parseFloat(priceStr);
        
        // Check if it's cart-eligible (≤ $1,500 and not custom)
        const isCustom = tier.price.toLowerCase().includes('custom') || 
                        tier.price.toLowerCase().includes('quote');
        
        if (!isCustom && price && price <= 1500) {
          const productSlug = `${serviceData.slug}-${tier.name.toLowerCase().replace(/\s+/g, '-')}`;
          const productName = `${serviceData.name} - ${tier.name}`;
          
          console.log(`  ✅ Creating product: ${productName} ($${price})`);
          
          const product = {
            name: productName,
            slug: productSlug,
            description: tier.subtitle || serviceData.description || '',
            short_description: tier.subtitle || '',
            price: price,
            compare_price: null,
            cost_price: price * 0.6, // 40% margin assumption
            sku: `SVC-${serviceData.slug.toUpperCase()}-${tier.name.toUpperCase().replace(/\s+/g, '-')}`,
            barcode: null,
            weight: 0,
            dimensions: null,
            category_id: null, // Will be set based on service category
            images: [],
            featured_image: serviceData.headerImage || null,
            stock_quantity: 999, // High stock for services
            low_stock_threshold: 10,
            track_inventory: false, // Services don't need inventory tracking
            allow_backorders: true,
            status: 'active',
            featured: serviceData.isPopular || false,
            sort_order: 0,
            meta_title: `${productName} - ClickBit`,
            meta_description: tier.subtitle || serviceData.description || '',
            meta_keywords: `${serviceData.category}, ${tier.name}, ${serviceData.name}`,
            seo_data: {},
            attributes: {
              service_category: serviceData.category,
              service_slug: serviceData.slug,
              tier_name: tier.name,
              features: tier.features || []
            },
            variants: [],
            tags: [serviceData.category, tier.name, 'service'],
            rating: null,
            review_count: 0,
            view_count: 0,
            sales_count: 0
          };
          
          productsToCreate.push(product);
          
          // Store mapping for cart system update
          if (!serviceToProductMapping[serviceData.slug]) {
            serviceToProductMapping[serviceData.slug] = {};
          }
          serviceToProductMapping[serviceData.slug][tier.name] = {
            productSlug,
            productName,
            price
          };
        } else {
          console.log(`  ⏭️  Skipping: ${tier.name} ($${tier.price}) - ${isCustom ? 'Custom pricing' : 'Over $1,500'}`);
        }
      });
    }
    
    console.log(`\n📦 Creating ${productsToCreate.length} products...`);
    
    // Create products in database
    const createdProducts = [];
    for (const productData of productsToCreate) {
      try {
        const product = await Product.create(productData);
        createdProducts.push(product);
        console.log(`  ✅ Created: ${product.name} (ID: ${product.id})`);
      } catch (error) {
        console.error(`  ❌ Failed to create product ${productData.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdProducts.length} products!`);
    
    // Generate mapping file for frontend
    const mappingData = {
      generatedAt: new Date().toISOString(),
      totalProducts: createdProducts.length,
      serviceToProductMapping,
      products: createdProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        serviceSlug: p.attributes.service_slug,
        tierName: p.attributes.tier_name
      }))
    };
    
    // Save mapping to file
    const fs = require('fs');
    fs.writeFileSync('service-product-mapping.json', JSON.stringify(mappingData, null, 2));
    console.log('\n📄 Service-to-Product mapping saved to: service-product-mapping.json');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Total services processed: ${services.length}`);
    console.log(`- Products created: ${createdProducts.length}`);
    console.log(`- Services with cart-eligible tiers: ${Object.keys(serviceToProductMapping).length}`);
    
    return { createdProducts, serviceToProductMapping };
    
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the script
if (require.main === module) {
  createProductsFromServices()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createProductsFromServices }; 