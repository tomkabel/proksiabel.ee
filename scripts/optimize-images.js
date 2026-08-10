#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts JPG/PNG images to WebP format with optimization
 */

import fs from 'node:fs/promises';
import path from 'node:path';

// Check if ImageMagick is installed
async function checkImageMagick() {
  try {
    const { execSync } = await import('node:child_process');
    // Try magick first (ImageMagick 7), then convert (ImageMagick 6)
    try {
      execSync('magick -version', { stdio: 'ignore' });
      return 'magick';
    } catch {
      execSync('convert -version', { stdio: 'ignore' });
      return 'convert';
    }
  } catch {
    return false;
  }
}

// Optimize a single image
async function optimizeImage(inputPath, outputDir) {
  const { execSync } = await import('node:child_process');

  // Check which ImageMagick command to use
  const imCommand = await checkImageMagick();
  if (!imCommand) {
    throw new Error('ImageMagick is not installed');
  }

  const basename = path.basename(inputPath, path.extname(inputPath));
  const outputWebP = path.join(outputDir, `${basename}.webp`);

  try {
    // Convert to WebP with optimization
    execSync(
      `${imCommand} "${inputPath}" -quality 80 -resize 1920x1080^ -gravity center -extent 1920x1080 "${outputWebP}"`,
      {
        stdio: 'inherit',
      },
    );

    console.log(`✅ Optimized: ${inputPath} -> ${outputWebP}`);

    // Get file sizes
    const originalStats = await fs.stat(inputPath);
    const webpStats = await fs.stat(outputWebP);

    console.log(`   Original: ${(originalStats.size / 1024).toFixed(1)}KB`);
    console.log(`   WebP: ${(webpStats.size / 1024).toFixed(1)}KB`);
    console.log(
      `   Savings: ${((originalStats.size - webpStats.size) / 1024).toFixed(1)}KB (${((1 - webpStats.size / originalStats.size) * 100).toFixed(1)}%)`,
    );

    return outputWebP;
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

// Create responsive variants
async function createResponsiveVariants(inputPath, outputDir) {
  const { execSync } = await import('node:child_process');

  // Check which ImageMagick command to use
  const imCommand = await checkImageMagick();
  if (!imCommand) {
    throw new Error('ImageMagick is not installed');
  }

  const basename = path.basename(inputPath, path.extname(inputPath));
  const variants = [
    { name: `${basename}-large.webp`, width: 1920, height: 1080 },
    { name: `${basename}-medium.webp`, width: 1200, height: 675 },
    { name: `${basename}-small.webp`, width: 800, height: 450 },
    { name: `${basename}-thumb.webp`, width: 400, height: 225 },
  ];

  const results = [];

  for (const variant of variants) {
    const outputPath = path.join(outputDir, variant.name);
    try {
      execSync(
        `${imCommand} "${inputPath}" -quality 80 -resize ${variant.width}x${variant.height}^ -gravity center -extent ${variant.width}x${variant.height} "${outputPath}"`,
        {
          stdio: 'inherit',
        },
      );

      const stats = await fs.stat(outputPath);
      console.log(`✅ Created ${variant.name}: ${(stats.size / 1024).toFixed(1)}KB`);
      results.push(outputPath);
    } catch (error) {
      console.error(`❌ Error creating ${variant.name}:`, error.message);
    }
  }

  return results;
}

// Main optimization function
async function optimizeImages() {
  console.log('🚀 Starting image optimization...\n');

  // Check for ImageMagick
  const imCommand = await checkImageMagick();
  if (!imCommand) {
    console.error('❌ ImageMagick is not installed. Please install it first:');
    console.error('   Ubuntu/Debian: sudo apt install imagemagick');
    console.error('   macOS: brew install imagemagick');
    console.error('   Windows: Download from https://imagemagick.org/script/download.php');
    process.exit(1);
  }

  console.log(`✅ Using ImageMagick command: ${imCommand}\n`);

  const inputDir = './public';
  const outputDir = './public';

  try {
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(
      (file) =>
        file.toLowerCase().endsWith('.jpg') ||
        file.toLowerCase().endsWith('.jpeg') ||
        file.toLowerCase().endsWith('.png'),
    );

    if (imageFiles.length === 0) {
      console.log('ℹ️  No JPEG/PNG images found in public directory');
      return;
    }

    console.log(`📁 Found ${imageFiles.length} images to optimize:\n`);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      console.log(`🔄 Processing ${file}...`);

      // Optimize to WebP
      await optimizeImage(inputPath, outputDir);

      // Create responsive variants for hero images
      if (file.includes('expert')) {
        console.log(`📱 Creating responsive variants for ${file}...`);
        await createResponsiveVariants(inputPath, outputDir);
      }

      console.log('');
    }

    console.log('✅ Image optimization complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update image references in src/config/images.ts');
    console.log('2. Update Hero.tsx to use responsive images');
    console.log('3. Test the optimized images');
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
}

// Run the optimization
optimizeImages();
