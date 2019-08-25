import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Form from './Form';

export default class UserSignUp extends Component {
    state = {
        username: '',
        emailAddress: '',
        password: '',
        errors: [],
    }

    render() {
        const {
            username,
            emailAddress,
            password,
            errors,
        } = this.state;

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <Form 
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.submit}
                        submitButtonText="Sign Up"
                        elements={() => (
                            <React.Fragment>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={this.change}
                                    placeholder="Username" />
                                <input
                                    id="emailAddress"
                                    name="emailAddress"
                                    type="text"
                                    value={emailAddress}
                                    onChange={this.change}
                                    placeholder="Email Address" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={this.change}
                                    placeholder="Password" />
                            </React.Fragment>
                        )} />
                    <p>
                        Already have a user account? <Link to="/signin">Click here</Link> to sign in!
                    </p>
                </div>
            </div>
        );
    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    submit = () => {
        const { context } = this.props;

        const {
            username,
            emailAddress,
            password,
        } = this.state;

        // New user payload
        const user = {
            username,
            emailAddress,
            password,
        };

        context.data.createUser(user)
            .then( errors => {
                if (errors.length) {
                    this.setState({ errors });
                } else {
                    console.log(`${emailAddress} is successfully signed up and authenticated`)
                    context.actions.signIn(emailAddress, password)
                        .then(() => {
                            this.props.history.push('/authenticated');
                        });
                }
            })
            .catch( err => {
                console.log(err);
                this.props.history.push('/error');
            })
    }

    cancel = () => {
        this.props.history.push('/');
    }
}