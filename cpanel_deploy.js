#!/usr/bin/env node

/**
 * This script automates the deployment process to cPanel
 * It builds the app and uploads it to the cPanel server
 * 
 * Prerequisites:
 * - Node.js 14+
 * - npm install -g node-ftp
 * - Configure the .env file with your cPanel credentials
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const FtpClient = require('ftp');
const readline = require('readline');

// Configuration - Update these or use .env file
const config = {
  host: process.env.CPANEL_HOST || '',
  user: process.env.CPANEL_USER || '',
  password: process.env.CPANEL_PASSWORD || '',
  remotePath: process.env.CPANEL_REMOTE_PATH || '/public_html/',
  localBuildDir: './dist'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if configuration is complete
function checkConfig() {
  const missingConfig = [];
  
  if (!config.host) missingConfig.push('CPANEL_HOST');
  if (!config.user) missingConfig.push('CPANEL_USER');
  if (!config.password) missingConfig.push('CPANEL_PASSWORD');
  
  if (missingConfig.length > 0) {
    console.log('\x1b[33m%s\x1b[0m', '⚠️  Missing configuration:');
    missingConfig.forEach(key => {
      console.log(`  - ${key}`);
    });
    
    promptForConfig(missingConfig);
    return false;
  }
  
  return true;
}

// Prompt for missing configuration
function promptForConfig(missingConfig) {
  let index = 0;
  
  function promptNext() {
    if (index >= missingConfig.length) {
      deploy();
      return;
    }
    
    const key = missingConfig[index];
    const prompt = key === 'CPANEL_PASSWORD' ? 
      'Enter your cPanel password: ' : 
      `Enter your ${key.replace('CPANEL_', '').toLowerCase()}: `;
    
    rl.question(prompt, (answer) => {
      if (key === 'CPANEL_HOST') config.host = answer;
      if (key === 'CPANEL_USER') config.user = answer;
      if (key === 'CPANEL_PASSWORD') config.password = answer;
      if (key === 'CPANEL_REMOTE_PATH' && answer) config.remotePath = answer;
      
      index++;
      promptNext();
    });
  }
  
  promptNext();
}

// Build the app
function buildApp() {
  return new Promise((resolve, reject) => {
    console.log('\x1b[36m%s\x1b[0m', '🔨 Building the application...');
    
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Build failed:');
        console.error(error);
        reject(error);
        return;
      }
      
      console.log('\x1b[32m%s\x1b[0m', '✅ Build completed successfully!');
      resolve();
    });
  });
}

// Upload files to cPanel
function uploadFiles() {
  return new Promise((resolve, reject) => {
    console.log('\x1b[36m%s\x1b[0m', '📤 Uploading files to cPanel...');
    
    const ftp = new FtpClient();
    const files = [];
    const directories = [];
    
    ftp.on('ready', () => {
      // Create a function to recursively scan directories
      function scanDirectory(localPath, remotePath) {
        const entries = fs.readdirSync(localPath, { withFileTypes: true });
        
        entries.forEach(entry => {
          const localEntryPath = path.join(localPath, entry.name);
          const remoteEntryPath = path.join(remotePath, entry.name).replace(/\\/g, '/');
          
          if (entry.isDirectory()) {
            directories.push({ localPath: localEntryPath, remotePath: remoteEntryPath });
            scanDirectory(localEntryPath, remoteEntryPath);
          } else {
            files.push({ localPath: localEntryPath, remotePath: remoteEntryPath });
          }
        });
      }
      
      // Start scanning from build directory
      scanDirectory(config.localBuildDir, config.remotePath);
      
      // Create directories first
      let dirIndex = 0;
      
      function createNextDir() {
        if (dirIndex >= directories.length) {
          uploadNextFile(0);
          return;
        }
        
        const dir = directories[dirIndex];
        console.log(`Creating directory: ${dir.remotePath}`);
        
        ftp.mkdir(dir.remotePath, true, (err) => {
          if (err && err.code !== 550) { // Ignore "File exists" error
            console.error(`Error creating directory ${dir.remotePath}:`, err);
          }
          
          dirIndex++;
          createNextDir();
        });
      }
      
      // Upload files
      function uploadNextFile(index) {
        if (index >= files.length) {
          ftp.end();
          console.log('\x1b[32m%s\x1b[0m', `✅ Upload completed! ${files.length} files uploaded.`);
          resolve();
          return;
        }
        
        const file = files[index];
        process.stdout.write(`Uploading file ${index + 1}/${files.length}: ${file.remotePath}\r`);
        
        ftp.put(file.localPath, file.remotePath, (err) => {
          if (err) {
            console.error(`\nError uploading ${file.localPath}:`, err);
          }
          
          uploadNextFile(index + 1);
        });
      }
      
      // Start the process
      createNextDir();
    });
    
    ftp.on('error', (err) => {
      console.error('\x1b[31m%s\x1b[0m', '❌ FTP connection error:');
      console.error(err);
      reject(err);
    });
    
    ftp.connect({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: true, // Use FTPS
      secureOptions: { rejectUnauthorized: false } // Accept self-signed certificates
    });
  });
}

// Main deploy function
async function deploy() {
  try {
    // Step 1: Build the app
    await buildApp();
    
    // Step 2: Upload files to cPanel
    await uploadFiles();
    
    console.log('\x1b[32m%s\x1b[0m', '🚀 Deployment completed successfully!');
    console.log('\x1b[36m%s\x1b[0m', `Your app should now be accessible at: http://${config.host}`);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Deployment failed.');
  } finally {
    rl.close();
  }
}

// Start the deployment process
if (checkConfig()) {
  deploy();
}