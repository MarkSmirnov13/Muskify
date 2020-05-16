import React from 'react';

import './uploadButton.css'

const UploadButton = () => {
    return (
        <div className='file-upload'>
            <label htmlFor='upload' className='file-upload__label'>mask yourself</label>
            <input id='upload' className='file-upload__input' type='file' name='file-upload' />
        </div>
    );
};

export default UploadButton;
