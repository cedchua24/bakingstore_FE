import React, { useEffect, useState } from 'react'
import AddProduct from './Product/AddProduct'
import Logout from './User/Logout'
import { BrowserRouter as Router, Redirect, Routes, Route, Link, useNavigate } from "react-router-dom"
import axios from "axios";
import swal from 'sweetalert';

const AdminPrivateRoute = () => {

    const navigate = useNavigate();
    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios.get('api/checkingAuthenticated').then(res => {
            if (res.status === 200) {
                setAuthenticated(true);
            }
            setLoading(false);
        });

        return () => {
            setAuthenticated(false);
        };

    }, []);

    axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        console.log('err.response.status', err.response.status);
        if (err.response.status === 401) {
            swal('Unauthorize', err.response.data.message, "warning");
            navigate('/Page401');
        }
        return Promise.reject(err)
    });

    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response.status === 403) {
            swal('Forbidden', error.response.data.message, "warning");
            navigate('/Page403');
        } else if (error.response.status === 404) {
            swal('404 PAGE NOT FOUND', "Url/Page not found", "warning");
            navigate('/Page404');
        }
        return Promise.reject(error)
    }

    );



    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {
                Authenticated ?
                    <Link to={"/userRegistration"} >
                    </Link> :
                    <Link to={"/login"} >
                    </Link>
            }
        </div>
    )
}

export default AdminPrivateRoute
