import cloudinary from './cloudinary';

export const uploadHeader = async (encodedImage: string) => {
    const uploadedResponse = await cloudinary.uploader.upload(encodedImage, {
        upload_preset: 'headers',
    });

    if (uploadedResponse) {
        return {
            ok: true,
            uploadedResponse,
        };
    } else
        return {
            ok: false,
        };
};
