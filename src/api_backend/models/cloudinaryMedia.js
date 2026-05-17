const cloudinary = require('../factory/cloudinary');
const {Readable} = require('stream');

class CloudinaryMedia {

    async salvarMedia(fileBuffer, tipo) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: `feed/${tipo}`,
                        resource_type: 'auto',
                       
                    },
                    (error, result) => {
                        if (error){ 
                            console.error('Erro no Cloudinary:', error);
                            return reject(error);
                        };
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            type: result.resource_type,
                        });
                    }
                );
    
                const readableStream = new Readable();
                readableStream.push(fileBuffer);
                readableStream.push(null);
                readableStream.pipe(uploadStream);
            });
        }
}

module.exports = new CloudinaryMedia();