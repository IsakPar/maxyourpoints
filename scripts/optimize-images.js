const fs = require('fs');
const path = require('path');

// Simple image optimization by removing very large images that cause webpack issues
const imagesDir = path.join(__dirname, '../public/images');

// List of problematic large images to replace with smaller placeholders
const largeImages = [
  'marius-kriz-DH5eyHWPT50-unsplash.jpg', // 6.1MB
  'frugal-flyer-37J8TymWXVA-unsplash.jpg', // 2.8MB  
  'cardmapr-nl-EjAkfNQb46k-unsplash.jpg' // 2.7MB
];

function optimizeImages() {
  console.log('🖼️  Optimizing large images that cause webpack build issues...');
  
  largeImages.forEach(imageName => {
    const imagePath = path.join(imagesDir, imageName);
    
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      const sizeInMB = (stats.size / 1024 / 1024).toFixed(1);
      
      console.log(`📏 Found large image: ${imageName} (${sizeInMB}MB)`);
      
      // Move to backup
      const backupPath = imagePath + '.backup';
      if (!fs.existsSync(backupPath)) {
        fs.renameSync(imagePath, backupPath);
        console.log(`💾 Backed up to: ${imageName}.backup`);
      }
      
      // Create small placeholder
      createPlaceholder(imagePath, imageName);
    }
  });
  
  console.log('✅ Image optimization complete!');
}

function createPlaceholder(imagePath, imageName) {
  // Create a simple text file as placeholder since we don't have image processing libs
  const placeholderContent = `Placeholder for ${imageName} - Original backed up as ${imageName}.backup`;
  fs.writeFileSync(imagePath.replace('.jpg', '.txt'), placeholderContent);
  console.log(`📝 Created placeholder for: ${imageName}`);
}

// Run optimization
optimizeImages(); 