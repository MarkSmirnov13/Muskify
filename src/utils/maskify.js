import * as faceapi from 'face-api.js';

class MaskifyApi {
    constructor(masks) {
        this.masks = masks;
        this.noFacesFound = document.querySelector('.no-faces-found');
        this.downloadButton = document.querySelector('.file-download');
        this.elonMuskImage = document.querySelector('.elon-musk');
        this.spinner = document.querySelector('.spinner-box');
        this.imageUpload = document.querySelector('.file-upload__input');
        this.item = document.querySelector('.wrapper');
    };

    async loadNetwork() {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(process.env.REACT_APP_MODEL_PATH || '/Muskify/models'),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri(process.env.REACT_APP_MODEL_PATH || '/Muskify/models'),
        ]).catch(error => {
            console.error('Error :(', error);
        });
    };

    static getOverlayValues(landmarks) {
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

    async handleImage(newImage, scale) {
        newImage.style.width = '400px';

        const detection = await faceapi
          .detectSingleFace(newImage, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks(true);

        this.spinner.style.display = 'none';

        if (!detection) {
            this.noFacesFound.style.display = 'block';
            this.downloadButton.style.display = 'none';
            return;
        }

        this.downloadButton.style.display = 'inline-block';

        const overlayValues = MaskifyApi.getOverlayValues(detection.landmarks);
        const overlay = document.querySelector('.mask') || document.createElement('img');
        overlay.src = this.masks[0];
        overlay.className = 'mask';
        overlay.alt = 'mask overlay';
        overlay.style.cssText = `
            position: absolute;
            left: ${overlayValues.leftOffset * scale}px;
            top: ${overlayValues.topOffset * scale}px;
            width: ${overlayValues.width * scale}px;
            transform: rotate(${overlayValues.angle}deg);
        `;

        this.item.appendChild(overlay);
        this.item.appendChild(newImage);
    };

    onChangeListener() {
        this.imageUpload.addEventListener('change', async () => {
            this.spinner.style.display = 'flex';
            this.noFacesFound.style.display = 'none';
            if (this.image) this.image.remove();
            if (this.elonMuskImage) this.elonMuskImage.remove();

            this.image = await faceapi.bufferToImage(this.imageUpload.files[0]);
            this.image.className = 'image';
            const scale = 400 / this.image.naturalWidth;
            await this.handleImage(this.image, scale);
        });
    };

    render = () => {
        this.loadNetwork();
        this.onChangeListener();
    };
}

export const maskify = (masks) => new MaskifyApi(masks);