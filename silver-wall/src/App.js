import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// Global components
import Header from './components/Header';

// Route components
import Posts from './components/Posts';
import NotFound from './components/NotFound';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import NewPost from './components/NewPost';
import PostDetail from './components/PostDetail';
import UpdatePost from './components/UpdatePost';
import DeletePost from './components/DeletePost';
import Authenticated from './components/Authenticated';
import Error from './components/Error';

// New Imports
import withContext from './Context';
import PrivateRoute from './PrivateRoute';

// Contexts
const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const PostsWithContext = withContext(Posts);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const NewPostWithContext = withContext(NewPost);
const PostDetailWithContext = withContext(PostDetail);
const UpdatePostWithContext = withContext(UpdatePost);
const DeletePostWithContext = withContext(DeletePost);

function App() {
  return (
    <Router>
      <div>
        <HeaderWithContext />

        <Switch>
          <Route exact path="/" component={PostsWithContext} />
          <PrivateRoute path="/authenticated" component={AuthWithContext} />
          <PrivateRoute path="/newpost" component={NewPostWithContext} />
          <PrivateRoute path="/posts/update/:id" component={UpdatePostWithContext} />
          <PrivateRoute path="/posts/delete/:id" component={DeletePostWithContext} />
          <Route path="/posts/:id" component={PostDetailWithContext}/>
          <Route path='/signin' component={UserSignInWithContext} />
          <Route path='/signup' component={UserSignUpWithContext} />
          <Route path='/signout' component={UserSignOutWithContext} />
          <Route path="/error" component={Error} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
