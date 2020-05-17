import * as faceapi from 'face-api.js';

const getOverlayValues = landmarks => {
    const jawline = landmarks.getJawOutline();
    const jawLeft = jawline[0];
    const jawRight = jawline.splice(-1)[0];
    const adjacent = jawRight.x - jawLeft.x;
    const opposite = jawRight.y - jawLeft.y;
    const jawLength = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
    const angle = Math.atan2(opposite, adjacent) * (180 / Math.PI);
    const width = jawLength * 1.8;

    return {
        width,
        angle,
        leftOffset: jawLeft.x - width * 0.21,
        topOffset: jawline[jawline.length / 4].y - width * 0.53,
    }
};

export async function maskify(masks) {
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(process.env.REACT_APP_MODEL_PATH || '/Muskify/models'),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(process.env.REACT_APP_MODEL_PATH || '/Muskify/models'),
    ]).catch(error => {
        console.error('Error :(', error);
    });

    let image;
    const noFacesFound = document.querySelector('.no-faces-found');
    const downloadButton = document.querySelector('.file-download');
    const elonMuskImage = document.querySelector('.elon-musk');
    const spinner = document.querySelector('.spinner-box');
    const imageUpload = document.querySelector('.file-upload__input');
    const item = document.querySelector('.wrapper');

    const handleImage = async (newImage, scale) => {
        newImage.style.width = '400px';

        const detection = await faceapi
            .detectSingleFace(newImage, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true);

        spinner.style.display = 'none';

        if (!detection) {
            noFacesFound.style.display = 'block';
            downloadButton.style.display = 'none';
            return;
        }

        downloadButton.style.display = 'inline-block';

        const overlayValues = getOverlayValues(detection.landmarks);
        const overlay = document.querySelector('.mask') || document.createElement('img');
        overlay.src = masks[0];
        overlay.className = 'mask';
        overlay.alt = 'mask overlay';
        overlay.style.cssText = `
            position: absolute;
            left: ${overlayValues.leftOffset * scale}px;
            top: ${overlayValues.topOffset * scale}px;
            width: ${overlayValues.width * scale}px;
            transform: rotate(${overlayValues.angle}deg);
        `;

        item.appendChild(overlay);
        item.appendChild(newImage);
    };


    imageUpload.addEventListener('change', async () => {
        spinner.style.display = 'flex';
        noFacesFound.style.display = 'none';
        if (image) image.remove();
        if (elonMuskImage) elonMuskImage.remove();

        image = await faceapi.bufferToImage(imageUpload.files[0]);
        image.className = 'image';
        const scale = 400 / image.naturalWidth;
        await handleImage(image, scale);
    });
}
