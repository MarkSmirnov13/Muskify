import React, { useEffect } from 'react';

import { maskify } from './utils/maskify';
import elonMusk from './masks/elon_musk.png';
import blueMask from './masks/blue_mask.png';
import UploadButton from './components/UploadButton/uploadButton'
import Spinner from './components/Spinner';
import DownloadButton from './components/DownloadButton';
import Footer from './components/Footer';
import NoFacesFound from './components/NoFacesFound';

import './App.css';

const App = () => {

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
            <NoFacesFound />
            <div className='wrapper'>
                <img src={elonMusk} alt='elon musk' className='elon-musk' />
            </div>
            <div className='buttons'>
                <UploadButton />
                <DownloadButton />
            </div>
            <Footer />
        </div>
    );
};

export default App;
