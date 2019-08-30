import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Error extends Component {
    render() {
        return (
            <div className="bounds">
                <h1>Error</h1>
                <p>Sorry! We just encountered an unexpected error.</p>
                <Link className="button" to="/">Return Home</Link>
            </div>
        );
    }
}