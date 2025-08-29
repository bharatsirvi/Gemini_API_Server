import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    console.log('📁 File received:', file);
    
    const isImageMimeType = file.mimetype.startsWith('image/');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.heic', '.heif'];
    const hasImageExtension = imageExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );

    if (isImageMimeType || hasImageExtension) {
    
      if (!isImageMimeType && hasImageExtension) {
        const ext = file.originalname.toLowerCase().match(/\.[^.]+$/)?.[0];
        const mimeTypeMap = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.bmp': 'image/bmp',
          '.tiff': 'image/tiff',
          '.heic': 'image/heic',
          '.heif': 'image/heif'
        };
        
        if (ext && mimeTypeMap[ext]) {
          console.log(`🔧 Correcting MIME type from '${file.mimetype}' to '${mimeTypeMap[ext]}'`);
          file.mimetype = mimeTypeMap[ext];
        }
      }
      
      console.log('✅ Image file accepted with MIME type:', file.mimetype);
      cb(null, true);
    } else {
      console.log('❌ File rejected - not an image');
      cb(new Error('Only image files allowed'), false);
    }
  }
});

export default upload;
