import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class PostDetail extends Component {
    state = {
        postDetail: [],
    }

    componentDidMount() {
        this.display();
    }

    render() {
        const {
            postDetail,
        } = this.state;

        return (
            <div className="bounds">
                {postDetail.map(post => (
                    <div>
                    <div className="actions--bar">
                      <div className="bounds">
                        <div className="grid-100"><span><Link className="button" to="#">Update Post</Link><Link className="button" to="#">Delete Post</Link></span><Link
                            className="button button-secondary" to="/">Return to List</Link></div>
                      </div>
                    </div>
                    <div className="bounds post--detail">
                      <div className="grid-66">
                        <div className="post--header">
                          <h4 className="post--label">By {post.User.username}</h4>
                        </div>
                        <div className="post--description">
                          {post.postContent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
        );
    }

    display = () => {
        const { context, location, match } = this.props;
        console.log(match.params.id);
        context.data.getPost(match.params.id)
            .then(currentPost => {
                const post = [{ ...currentPost }];
                this.setState(() => {
                    return {
                        postDetail: post,
                    };
                });
            })
        return;
    }

}