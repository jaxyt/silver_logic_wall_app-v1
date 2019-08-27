import React, { Component } from 'react';

import Form from './Form';

export default class NewPost extends Component {
    
    state = {
        postContent: '',
        errors: [],
    }

    render() {
        const {
            postContent,
            errors,
        } = this.state;

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Create Post</h1>
                    <Form 
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.submit}
                        submitButtonText="Create Post"
                        elements={() => (
                            <React.Fragment>
                                <textarea
                                    id="description"
                                    name="postContent"
                                    type="textArea"
                                    value={postContent}
                                    onChange={this.change}
                                    placeholder="Post Content" />
                            </React.Fragment>
                        )} />

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
        const { emailAddress, username, password } = context.authenticatedUser;

        const {
            postContent,
        } = this.state;

        // New post payload
        const post = {
            postContent,
        };

        context.data.createPost(post, emailAddress, password)
            .then( errors => {
                if (errors.length) {
                    this.setState({ errors });
                } else {
                    console.log(`${username}: your new post has been successfully created`)
                    this.props.history.push('/');
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