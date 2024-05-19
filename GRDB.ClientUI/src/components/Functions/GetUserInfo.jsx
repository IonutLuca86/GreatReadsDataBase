import { useState,useEffect } from 'react';

export default async function getUserInfo () {
        try {
        const storedUserInfo = sessionStorage.getItem('userData');
        const info = JSON.parse(storedUserInfo);
        // console.log(info.user);
        return info.user;
    } catch (error) {
        console.log("Error parsing user info:", error);
        return null; 
    }
};