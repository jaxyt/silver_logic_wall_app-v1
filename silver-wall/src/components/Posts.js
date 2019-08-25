import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Posts extends Component {
    state = {
        posts: [],
    }

    componentDidMount() {
        this.display();
    }

    render() {
        const {
            posts,
        } = this.state;

        return (
            <div className="bounds">
                {posts.map(post => (
                    <div className="grid-33" key={post.id}>
                        <Link to={`/posts/${post.id}`}>
                            <h3>{post.User.username}</h3>
                            <div>{post.postContent}</div>
                        </Link>
                    </div>
                ))}
            </div>
        );
    }

    display = () => {
        const { context } = this.props;
        context.actions.allPosts()
            .then(totalPosts => {
                this.setState(() => {
                    return {
                        posts: totalPosts,
                    };
                });
            })
        return;
    }
}