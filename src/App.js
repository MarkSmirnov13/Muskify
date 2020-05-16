import React, { useEffect } from 'react';

import { maskify } from './utils/maskify';
import elonMusk from './masks/elon_musk.png';
import blueMask from './masks/blue_mask.png';
import UploadButton from './components/UploadButton/uploadButton'
import './App.css';
import Spinner from "./components/Spinner";

function App() {

    useEffect(() => {
        maskify([
            blueMask,
        ]).catch(error => {
            console.error('Error', error);
        });
    }, []);

    return (
        <div className='App'>
            <div className='title'>MUSKIFY</div>
            <Spinner />
            <div className='wrapper'>
                <img src={elonMusk} alt='elon musk' className='elon-musk' />
            </div>
            <UploadButton />
        </div>
    );
}

export default App;
