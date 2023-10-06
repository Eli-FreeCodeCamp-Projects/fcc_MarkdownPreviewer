import { configureStore } from '@reduxjs/toolkit';
import mdPreviewerReducer from './features/mdPreviewer/mdPreviewerSlice';

export const store = configureStore({
    reducer: {
        mdPreviewer: mdPreviewerReducer
    }
})