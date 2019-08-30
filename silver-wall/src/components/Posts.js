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
                        <Link className="post--module post--link" to={`/posts/${post.id}`}>
                            <h4 className="post--label">{post.postContent}</h4>
                            <h3 className="post--title">by {post.User.username}</h3>
                        </Link>
                    </div>
                ))}
                <div className="grid-33">
                    <Link className="post--module post--add--module" to="/newpost">
                        <h3 className="post--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                            </svg>New Post
                        </h3>
                    </Link>
                </div>
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