import React from 'react';
import { Link } from 'react-router-dom';

export default ({ context }) => {
    const authUser = context.authenticatedUser;
    return (
        <div className="bounds">
            <div className="grid-100">
                <h1>{authUser.emailAddress} is authenticated!</h1>
                <p>Your username is {authUser.username}</p>
                <Link className="button" to="/">Return Home</Link>
            </div>
        </div>
    );
}