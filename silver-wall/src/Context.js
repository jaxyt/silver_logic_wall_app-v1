import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';


const Context = React.createContext();

export class Provider extends Component {

    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    };

    constructor() {
        super();
        this.data = new Data();
    }

    render() {
        const { authenticatedUser } = this.state;

        const value = {
            authenticatedUser,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
                allPosts: this.allPosts,
            },
        };

        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }

    signIn = async (username, password) => {
        const user = await this.data.getUser(username, password);
        const currentUser = { ...user, password };
        if (user !== null) {
            this.setState(() => {
                return {
                    authenticatedUser: currentUser,
                };
            });
            Cookies.set('authenticatedUser', JSON.stringify(currentUser), { expires: 1 });
        }
        return user
    }

    signOut = () => {
        this.setState(() => {
            return {
                authenticatedUser: null
            };
        });
        Cookies.remove('authenticatedUser');
    }

    allPosts = async () => {
        const posts = await this.data.getPosts();
        return posts;
    }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        );
    }
}