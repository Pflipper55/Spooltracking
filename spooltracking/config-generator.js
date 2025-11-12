#!/usr/bin/env node
/**
 * Config Generator Script
 * This script generates a config.json file based on environment variables
 * and places it in the dist folder for the Angular app to load
 */

const fs = require('fs');
const path = require('path');

// Get environment variables with defaults
const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || '5000';

// Path to output config file in dist
const configPath = path.join(__dirname, 'dist', 'config.json');

// Create config object
const config = {
  apiHost: API_HOST,
  apiPort: API_PORT
};

try {
  // Write config.json to dist folder
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

  console.log(`✅ Configuration file generated successfully!`);
  console.log(`   Location: ${configPath}`);
  console.log(`   API_HOST: ${API_HOST}`);
  console.log(`   API_PORT: ${API_PORT}`);
} catch (error) {
  console.error('❌ Error generating configuration:', error.message);
  process.exit(1);
}
