import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVER = 'https://magicpostbackend.onrender.com';
var apiPathSentInfo = '/user-information/log-in';
var apiPathGetInfo = '/user-information/get-user-info';

function SignInForm() {
  const [text, setText] = useState('Sign in');
  const [state, setState] = React.useState({
    email: '',
    password: '',
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };
  const navigate = useNavigate();

  const handleLogin = () => {
    setText('Sign in');
    navigate('/');
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    setText('Logging...');
    const { email, password } = state;
    const optionsPost = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          username: email,
          password: password,
        },
      }),
    };
    fetch(SERVER + apiPathSentInfo, optionsPost)
      .then((res) => res.text())
      .then((data) => {
        var res = JSON.parse(data);
        if (res.validate_token) {
          const optionsGet = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'validate-token': res.validate_token,
            },
          };

          fetch(SERVER + apiPathGetInfo, optionsGet)
            .then((res) => res.text())
            .then((data) => {
              var res = JSON.parse(data);
              localStorage.setItem('user', JSON.stringify(res));
              handleLogin();
            })
            .catch((rejected) => {
              console.log(rejected);
            });

          localStorage.setItem('token', res.validate_token);
        } else alert(res.message);
      })
      .catch((rejected) => {
        console.log(rejected);
      });

    for (const key in state) {
      setState({
        ...state,
        [key]: '',
      });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>{text}</h1>
        <input
          type="text"
          placeholder="Username"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
