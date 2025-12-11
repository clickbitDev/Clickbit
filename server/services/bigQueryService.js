const { BigQuery } = require('@google-cloud/bigquery');
const { Analytics } = require('../models');
const { logger } = require('../utils/logger');

class BigQueryService {
  constructor() {
    this.client = null;
    this.datasetId = process.env.BIGQUERY_DATASET_ID || 'clickbit_analytics';
    this.tableId = process.env.BIGQUERY_TABLE_ID || 'events';
    
    // Initialize BigQuery client if credentials are provided
    if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_KEY_FILE) {
      try {
        this.client = new BigQuery({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
        });
        logger.info('BigQuery client initialized');
      } catch (error) {
        logger.warn('BigQuery initialization failed:', error.message);
      }
    }
  }

  async isConfigured() {
    return this.client !== null;
  }

  async exportEventsToBigQuery(events = null) {
    if (!this.client) {
      throw new Error('BigQuery not configured. Please set GOOGLE_CLOUD_PROJECT_ID and GOOGLE_CLOUD_KEY_FILE environment variables.');
    }

    try {
      // Get events to export (last 24 hours if not specified)
      if (!events) {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        events = await Analytics.findAll({
          where: {
            created_at: {
              [require('sequelize').Op.gte]: yesterday
            }
          },
          order: [['created_at', 'ASC']]
        });
      }

      if (events.length === 0) {
        logger.info('No events to export to BigQuery');
        return { exported: 0 };
      }

      // Transform events for BigQuery
      const rows = events.map(event => ({
        event_id: event.id,
        event_type: event.event_type,
        event_name: event.event_name,
        user_id: event.user_id?.toString(),
        session_id: event.session_id,
        page_url: event.page_url,
        page_title: event.page_title,
        referrer_url: event.referrer_url,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        device_type: event.device_type,
        browser: event.browser,
        browser_version: event.browser_version,
        operating_system: event.operating_system,
        os_version: event.os_version,
        country: event.country,
        region: event.region,
        city: event.city,
        latitude: event.latitude ? parseFloat(event.latitude) : null,
        longitude: event.longitude ? parseFloat(event.longitude) : null,
        utm_source: event.utm_source,
        utm_medium: event.utm_medium,
        utm_campaign: event.utm_campaign,
        utm_term: event.utm_term,
        utm_content: event.utm_content,
        event_data: JSON.stringify(event.event_data || {}),
        value: event.value ? parseFloat(event.value) : null,
        currency: event.currency,
        duration: event.duration,
        scroll_depth: event.scroll_depth,
        time_on_page: event.time_on_page,
        exit_page: event.exit_page,
        bounce: event.bounce,
        conversion: event.conversion,
        conversion_value: event.conversion_value ? parseFloat(event.conversion_value) : null,
        created_at: event.created_at,
        exported_at: new Date()
      }));

      // Insert into BigQuery
      await this.client
        .dataset(this.datasetId)
        .table(this.tableId)
        .insert(rows);

      logger.info(`Exported ${rows.length} events to BigQuery`);
      return { exported: rows.length };

    } catch (error) {
      logger.error('BigQuery export failed:', error);
      throw error;
    }
  }

  async createBigQueryTable() {
    if (!this.client) {
      throw new Error('BigQuery not configured');
    }

    const schema = [
      { name: 'event_id', type: 'INTEGER', mode: 'REQUIRED' },
      { name: 'event_type', type: 'STRING', mode: 'REQUIRED' },
      { name: 'event_name', type: 'STRING', mode: 'REQUIRED' },
      { name: 'user_id', type: 'STRING', mode: 'NULLABLE' },
      { name: 'session_id', type: 'STRING', mode: 'NULLABLE' },
      { name: 'page_url', type: 'STRING', mode: 'NULLABLE' },
      { name: 'page_title', type: 'STRING', mode: 'NULLABLE' },
      { name: 'referrer_url', type: 'STRING', mode: 'NULLABLE' },
      { name: 'ip_address', type: 'STRING', mode: 'NULLABLE' },
      { name: 'user_agent', type: 'STRING', mode: 'NULLABLE' },
      { name: 'device_type', type: 'STRING', mode: 'NULLABLE' },
      { name: 'browser', type: 'STRING', mode: 'NULLABLE' },
      { name: 'browser_version', type: 'STRING', mode: 'NULLABLE' },
      { name: 'operating_system', type: 'STRING', mode: 'NULLABLE' },
      { name: 'os_version', type: 'STRING', mode: 'NULLABLE' },
      { name: 'country', type: 'STRING', mode: 'NULLABLE' },
      { name: 'region', type: 'STRING', mode: 'NULLABLE' },
      { name: 'city', type: 'STRING', mode: 'NULLABLE' },
      { name: 'latitude', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'longitude', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'utm_source', type: 'STRING', mode: 'NULLABLE' },
      { name: 'utm_medium', type: 'STRING', mode: 'NULLABLE' },
      { name: 'utm_campaign', type: 'STRING', mode: 'NULLABLE' },
      { name: 'utm_term', type: 'STRING', mode: 'NULLABLE' },
      { name: 'utm_content', type: 'STRING', mode: 'NULLABLE' },
      { name: 'event_data', type: 'STRING', mode: 'NULLABLE' },
      { name: 'value', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'currency', type: 'STRING', mode: 'NULLABLE' },
      { name: 'duration', type: 'INTEGER', mode: 'NULLABLE' },
      { name: 'scroll_depth', type: 'INTEGER', mode: 'NULLABLE' },
      { name: 'time_on_page', type: 'INTEGER', mode: 'NULLABLE' },
      { name: 'exit_page', type: 'BOOLEAN', mode: 'NULLABLE' },
      { name: 'bounce', type: 'BOOLEAN', mode: 'NULLABLE' },
      { name: 'conversion', type: 'BOOLEAN', mode: 'NULLABLE' },
      { name: 'conversion_value', type: 'FLOAT', mode: 'NULLABLE' },
      { name: 'created_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
      { name: 'exported_at', type: 'TIMESTAMP', mode: 'REQUIRED' }
    ];

    try {
      const dataset = this.client.dataset(this.datasetId);
      
      // Create dataset if it doesn't exist
      const [datasetExists] = await dataset.exists();
      if (!datasetExists) {
        await this.client.createDataset(this.datasetId, {
          location: 'US',
          description: 'ClickBIT Analytics Data Export'
        });
        logger.info(`Created BigQuery dataset: ${this.datasetId}`);
      }

      // Create table if it doesn't exist
      const table = dataset.table(this.tableId);
      const [tableExists] = await table.exists();
      if (!tableExists) {
        await dataset.createTable(this.tableId, { schema });
        logger.info(`Created BigQuery table: ${this.tableId}`);
      }

      return true;
    } catch (error) {
      logger.error('Failed to create BigQuery table:', error);
      throw error;
    }
  }

  async scheduleExport() {
    if (!this.client) {
      logger.info('BigQuery not configured, skipping export');
      return;
    }

    try {
      // Export events from last 24 hours that haven't been exported yet
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const events = await Analytics.findAll({
        where: {
          created_at: {
            [require('sequelize').Op.gte]: yesterday
          },
          // Add a flag to track if exported (you might want to add this field to the model)
          // exported_to_bigquery: { [require('sequelize').Op.ne]: true }
        },
        order: [['created_at', 'ASC']]
      });

      if (events.length > 0) {
        await this.exportEventsToBigQuery(events);
        
        // Mark events as exported (if you add the field to the model)
        // await Analytics.update(
        //   { exported_to_bigquery: true },
        //   { where: { id: events.map(e => e.id) } }
        // );
      }

    } catch (error) {
      logger.error('Scheduled BigQuery export failed:', error);
    }
  }

  // Generate Data Studio dashboard URL
  getDataStudioDashboardUrl() {
    if (!this.client) {
      return null;
    }
    
    return `https://datastudio.google.com/datasources/create?connectorId=big_query&projectId=${process.env.GOOGLE_CLOUD_PROJECT_ID}&datasetId=${this.datasetId}&tableId=${this.tableId}`;
  }
}

module.exports = new BigQueryService();
