import React from 'react';

import sadElonMusk from '../../masks/sad_elon_musk.png';

import './noFacesFound.css';

const NoFacesFound = () => (
    <div className='no-faces-found'>
        <img src={sadElonMusk} alt='no faces found'/>
        <p>No faces found.</p>
    </div>
);

export default NoFacesFound;
