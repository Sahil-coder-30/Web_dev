import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './features/counterSlice'
export const Store = configureStore({
    reducer:{
        counter : counterReducer
    }
});