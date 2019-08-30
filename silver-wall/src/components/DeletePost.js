import React, { Component } from 'react';

import Form from './Form';

export default class DeletePost extends Component {
    state = {
        postDetail: [],
        postContent: '',
        errors: [],
    }

    componentWillMount() {
        this.display();
    }

    render() {
        const {
            postContent,
            errors,
        } = this.state;

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Update Post</h1>
                    <Form 
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.submit}
                        submitButtonText="Delete Post"
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

    display = () => {
        const { context, match } = this.props;
        context.data.getPost(match.params.id)
            .then(currentPost => {
                const post = [{ ...currentPost }];
                this.setState(() => {
                    return {
                        postDetail: post,
                        postContent: post[0].postContent
                    };
                });
            })
        return;
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
        const { context, match } = this.props;
        const { emailAddress, username, password } = context.authenticatedUser;
        

        context.data.deletePost(match.params.id, emailAddress, password)
            .then( errors => {
                if (errors.length) {
                    this.setState({ errors });
                } else {
                    console.log(`${username}: your post has been successfully deleted`)
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