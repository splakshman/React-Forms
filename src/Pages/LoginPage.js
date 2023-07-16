import React from 'react';
import './LoginPage.css';
import { useState } from 'react'
import { LoginApi } from '../Services/Api';
import { storeUserData } from '../Services/Storage';
import { isAuthenticated } from '../Services/Auth';
import { Link, Navigate } from 'react-router-dom';
import NavBar from '../Component/navBar';

export default function Login() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        custom_error: null
    };
    const [errors, setErrors] = useState(initialStateErrors);

    const [loading, setLoading] = useState(false);


    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = { ...initialStateErrors };
        let hasError = false;

        if (inputs.email === "") {
            errors.email.required = true;
            hasError = true;
        }
        if (inputs.password === "") {
            errors.password.required = true;
            hasError = true;
        }

        if (!hasError) {
            setLoading(true);
            //sending Login API request 
            LoginApi(inputs)
                .then((response) => {
                    console.log(response);
                    storeUserData(response.data.idToken)
                })
                .catch((err) => {
                    if (err.code = "ERR_BAD_REQUEST") {
                        setErrors({ ...errors, custom_error: "Invalid Credentials" });

                    }
                    console.log(err);

                })
                .finally(() => {
                    setLoading(false);

                });



        }

        setErrors({ ...errors });
    }

    const handleInput = (event) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value });
    }



    if (isAuthenticated()) {
        // redirect user to dashboard
        return <Navigate to="/dashboard" />

    }

    return (
        <div>
            <NavBar />
            <div>
                <section className="login-block">
                    <div className="container">
                        <div className="row">
                            <div className="col login-sec">
                                <h2 className="text-center">Login Now</h2>
                                <form onSubmit={handleSubmit} className="login-form" action="">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Email</label>
                                        <input type="email" className="form-control" onChange={handleInput} name="email" id="exampleInputEmail1" placeholder="email" />
                                        {errors.email.required ?
                                            (<span className="text-danger">Email is required.</span>) : null
                                        }
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
                                        <input className="form-control" type="password" onChange={handleInput} name="password" placeholder="password" id="exampleInputPassword1" />
                                        {errors.password.required ?
                                            (<span className="text-danger">
                                                Password is required.
                                            </span>) : null
                                        }
                                    </div>
                                    <div className="form-group">
                                        {loading ?
                                            (<div className="text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>) : null
                                        }
                                        <span className="text-danger">
                                            {errors.custom_error ?
                                                (<p>{errors.custom_error}</p>) : null
                                            }
                                        </span>
                                        <input type="submit" className="btn btn-login float-right" disabled={loading} value="Login" />
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="form-group">
                                        Create a new account? Please <Link to="/register">Register</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
