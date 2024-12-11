import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAPI(endPoint, method = 'get', { params = {}, body = {} } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.request({
            baseURL: process.env.REACT_APP_API_BASE_URL,
            url: endPoint,
            method: method,
            content : 'application/json',
            auth: {
                username: "test@test.com",
                password: "123456"
            },
            params: params,
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