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
import Authenticated from './components/Authenticated';

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

function App() {
  return (
    <Router>
      <div>
        <HeaderWithContext />

        <Switch>
          <Route exact path="/" component={PostsWithContext} />
          <PrivateRoute path="/authenticated" component={AuthWithContext} />
          <Route path='/signin' component={UserSignInWithContext} />
          <Route path='/signup' component={UserSignUpWithContext} />
          <Route path='/signout' component={UserSignOutWithContext} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;
