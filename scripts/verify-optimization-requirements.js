#!/usr/bin/env node

/**
 * Verification Script for Website Optimization Requirements
 * Checks if all requirements are met before running optimization
 */

import fs from 'fs/promises';
import path from 'path';

// Check if ImageMagick is installed
async function checkImageMagick() {
  try {
    const { execSync } = await import('child_process');
    // Try magick first (ImageMagick 7), then convert (ImageMagick 6)
    try {
      execSync('magick -version', { stdio: 'ignore' });
      return { installed: true, command: 'magick' };
    } catch {
      execSync('convert -version', { stdio: 'ignore' });
      return { installed: true, command: 'convert' };
    }
  } catch (error) {
    return { installed: false, command: null };
  }
}

// Check if public directory exists and has images
async function checkPublicDirectory() {
  try {
    const files = await fs.readdir('./public');
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );
    
    return {
      exists: true,
      imageCount: imageFiles.length,
      images: imageFiles
    };
  } catch (error) {
    return {
      exists: false,
      imageCount: 0,
      images: []
    };
  }
}

// Check if required npm scripts exist
async function checkNpmScripts() {
  try {
    const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8'));
    const scripts = packageJson.scripts || {};
    
    return {
      optimizeImages: !!scripts['optimize-images'],
      checkImagemagick: !!scripts['check-imagemagick']
    };
  } catch (error) {
    return {
      optimizeImages: false,
      checkImagemagick: false
    };
  }
}

// Main verification function
async function verifyRequirements() {
  console.log('🔍 Verifying website optimization requirements...\n');
  
  // Check 1: ImageMagick
  console.log('1. Checking ImageMagick installation...');
  const imStatus = await checkImageMagick();
  if (imStatus.installed) {
    console.log(`   ✅ ImageMagick is installed (using: ${imStatus.command})`);
  } else {
    console.log('   ❌ ImageMagick is not installed');
    console.log('   💡 Install with: sudo apt install imagemagick (Ubuntu/Debian)');
    console.log('                   brew install imagemagick (macOS)');
  }
  
  // Check 2: Public directory and images
  console.log('\n2. Checking public directory...');
  const publicStatus = await checkPublicDirectory();
  if (publicStatus.exists) {
    console.log(`   ✅ Public directory exists with ${publicStatus.imageCount} images`);
    if (publicStatus.imageCount > 0) {
      console.log('   📁 Images found:', publicStatus.images.join(', '));
    }
  } else {
    console.log('   ❌ Public directory not found');
  }
  
  // Check 3: NPM scripts
  console.log('\n3. Checking npm scripts...');
  const scriptStatus = await checkNpmScripts();
  if (scriptStatus.optimizeImages) {
    console.log('   ✅ optimize-images script is configured');
  } else {
    console.log('   ❌ optimize-images script is missing from package.json');
  }
  
  if (scriptStatus.checkImagemagick) {
    console.log('   ✅ check-imagemagick script is configured');
  } else {
    console.log('   ❌ check-imagemagick script is missing from package.json');
  }
  
  // Summary
  console.log('\n📋 SUMMARY:');
  const allGood = imStatus.installed && publicStatus.exists && publicStatus.imageCount > 0 && 
                  scriptStatus.optimizeImages && scriptStatus.checkImagemagick;
  
  if (allGood) {
    console.log('   ✅ All requirements met! You can now run: npm run optimize-images');
  } else {
    console.log('   ⚠️  Some requirements are missing. Please address the issues above.');
    
    if (!imStatus.installed) {
      console.log('   🔧 Fix: Install ImageMagick');
    }
    
    if (!publicStatus.exists || publicStatus.imageCount === 0) {
      console.log('   🔧 Fix: Add images to public directory');
    }
    
    if (!scriptStatus.optimizeImages || !scriptStatus.checkImagemagick) {
      console.log('   🔧 Fix: Verify package.json scripts');
    }
  }
}

// Run verification
verifyRequirements().catch(console.error);