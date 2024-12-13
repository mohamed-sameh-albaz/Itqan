import { useState, useEffect } from 'react';
import axios from 'axios';

async function requestAPI(endPoint, method = 'get', { params = {}, body = {} } = {}) {
    let requestResult = null;
    let statusCode = null;

    try {
        const response = await axios.request({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: endPoint,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            },
            params: params,
            data: body,
        });

        requestResult = response.data;
        statusCode = response.status;
        
    } catch (error) {
        console.log('Error requesting api:', error);
        if (error.response) {
            requestResult = error.response.data;
            statusCode = error.response.status;
        }
        //throw error; // Re-throw the error to handle it in the calling function
    }
    
    console.log('Status code:', statusCode);
    return { data: requestResult, status: statusCode };
}

function useAPI(endPoint, method = 'get', { params = {}, body = {} } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.request({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: endPoint,
            method: method,
            content : 'application/json',
            auth: {
                username: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            },
            params: params,
            data: body,
        })
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });

    }, []);
    
    return [data, loading];
}
export { requestAPI, useAPI };