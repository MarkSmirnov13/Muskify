import React from 'react';

import './Spinner.css';

const Spinner = () => {
    return (
        <div className='spinner-box'>
            <div className='circle-border'>
                <div className='circle-core' />
            </div>
        </div>
    );
};

export default Spinner;
