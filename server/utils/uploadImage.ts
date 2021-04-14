import cloudinary from './cloudinary';

const headerPreset = 'headers';
const bannerPreset = 'banners';
const profilePreset = 'profiles';

interface headerPresetInterface {
    encodedImage: string;
    preset: typeof headerPreset;
}

interface bannerPresetInterface {
    encodedImage: string;
    preset: typeof bannerPreset;
}

interface profilePresetInterface {
    encodedImage: string;
    preset: typeof profilePreset;
}

type uploadType =
    | headerPresetInterface
    | bannerPresetInterface
    | profilePresetInterface;

export const uploadImage = async ({ encodedImage, preset }: uploadType) => {
    const uploadedResponse = await cloudinary.uploader.upload(encodedImage, {
        upload_preset: preset,
    });

    if (uploadedResponse) {
        return {
            ok: true,
            uploadedResponse,
        };
    } else {
        return {
            ok: false,
        };
    }
};
