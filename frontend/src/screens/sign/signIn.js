import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SERVER = 'https://magicpostbackend.onrender.com';
var apiPathSentInfo = '/user-information/log-in';
var apiPathGetInfo = '/user-information/get-user-info';
var apiForgot = '/password-forgot-request/insert';

function SignInForm() {
  const [text, setText] = useState('Sign in');
  const [state, setState] = React.useState({
    username: '',
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
    const { username, password } = state;
    const optionsPost = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          username: username,
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
  function handleShowForm(id) {
    var ele = document.getElementById(id);
    if (ele.style.display === 'none') {
      ele.style.display = '';
    } else ele.style.display = 'none';
  }

  function handleForgot() {
    const { username, password } = state;
    const options = {
      body: {
        username: username,
      },
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(SERVER + apiForgot, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });

        alert('Đã gửi mật khẩu mới đến email của bạn!');
        window.location.reload();
      } catch (error) {
        // Handle error
        alert(error.response.data.message);
      }
    };

    fetchData();
  }

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>{text}</h1>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={state.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a onClick={() => handleShowForm('form-forgot')}>
          Forgot your password?
        </a>
        <form id="form-forgot" style={{ display: 'none' }}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={state.username}
            onChange={handleChange}
          />
          <button type="button" id="forgot-btn" onClick={() => handleForgot()}>
            Lấy lại mật khẩu
          </button>
        </form>
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
