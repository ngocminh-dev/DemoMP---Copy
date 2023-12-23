import { useState } from 'react';
import SignUpForm from './SignUp';
import SignInForm from './signIn';
import { useLocation } from 'react-router-dom';

function Sign() {
  var p = useLocation().pathname.split('/')[1];
  const [type, setType] = useState(p);
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    'container ' + (type === 'signUp' ? 'right-panel-active' : '');
  return (
    <div className="signForm">
      <h2>Magic Post</h2>
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick('signIn')}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick('signUp')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sign;
