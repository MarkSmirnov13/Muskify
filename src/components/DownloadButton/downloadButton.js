import React from 'react';
import html2canvas from 'html2canvas';

import './downloadButton.css'

const DownloadButton = () => {

    function downloadFunction(canvas) {
        canvas.toBlob(function(blob) {
            const img = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'musked-image.png';
            link.href = img;
            link.click();
        }, 'image/png', 1);
    }

    const param = {
        scale: 3,
    };

    const downloadImage = () => {
        html2canvas(document.querySelector(".wrapper"), param).then(downloadFunction)
    };

    return (
        <div className='file-download'>
            <label htmlFor='download' className='file-download__label'>download</label>
            <input id='download' className='file-download__input' type='button' name='file-download' onClick={downloadImage} />
        </div>
    );
};

export default DownloadButton;
