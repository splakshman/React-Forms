import React, { useState } from 'react';
import './Register.css';
import { RegisterApi } from '../Services/Api';
import { storeUserData } from '../Services/Storage';
import { isAuthenticated } from '../Services/Auth';
import { Link, Navigate } from 'react-router-dom'
import NavBar from '../Component/navBar';



export default function RegisterPage() {
    const initialStateErrors = {
        email: { required: false },
        password: { required: false },
        name: { required: false },
        custom_error: null
    };
    const [errors, setErrors] = useState(initialStateErrors);

    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = { ...initialStateErrors };
        let hasError = false;

        if (inputs.name === "") {
            errors.name.required = true;
            hasError = true;
        }
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
            //sending request to API
            RegisterApi(inputs)
                .then((response) => {
                    console.log(response);
                    storeUserData(response.data.idToken)
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response.data.error.message == "EMAIL_EXISTS") {
                        setErrors({ ...errors, custom_error: "Already this email has been registered" })
                    } else if (String(err.response.data.error.message).includes("WEAK_PASSWORD")) {
                        setErrors({ ...errors, custom_error: "password must be atleast six characters" })
                    }

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
            <section className="register-block">
                <div className="container">
                    <div className="row">
                        <div className="col register-sec">
                            <h2 className="text-center">Register Now</h2>
                            <form onSubmit={handleSubmit} className="register-form" action="">
                                <div className="form-group">
                                    <label htmlFor="name" className="text-uppercase">Name</label>
                                    <input type="text" className="form-control" onChange={handleInput} name="name" id="name" />
                                    {errors.name.required ?
                                        (<span className="text-danger">Name is required.</span>) : null
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="text-uppercase">Email</label>
                                    <input type="text" className="form-control" onChange={handleInput} name="email" id="email" />
                                    {errors.email.required ?
                                        (<span className="text-danger">Email is required.</span>) : null
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="text-uppercase">Password</label>
                                    <input className="form-control" type="password" onChange={handleInput} name="password" id="password" />
                                    {errors.password.required ?
                                        (<span className="text-danger">Password is required.</span>) : null
                                    }
                                </div>
                                <div className="form-group">
                                    <span className="text-danger">
                                        {errors.custom_error ?
                                            (<p>{errors.custom_error}</p>) : null
                                        }
                                    </span>
                                    {loading ?
                                        (<div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>) : null
                                    }
                                    <input type="submit" className="btn btn-login float-right" disabled={loading} value="Register" />
                                </div>
                                <div className="clearfix"></div>
                                <div className="form-group">
                                    Already have an account? Please <Link to="/login">Login</Link>.
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </section >
        </div>
    );
}
