import React, { useState } from 'react';

const SERVER = 'https://magicpostbackend.onrender.com';
var apiPath = '/user-information/customer-sign-up';

function SignUpForm() {
  const [text, setText] = useState('Create Account');

  const [state, setState] = React.useState({
    name: '',
    password1: '',
    password: '',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = (evt) => {
    setText('Checking your information...');
    evt.preventDefault();

    const { name, password1, password } = state;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          username: name,
          password: password,
          role: 'customer',
          email: '',
          familyName: '1',
          lastName: name,
          dateOfBirth: 0,
          createdDate: 0,
          lastUpdatedDate: 0,
        },
      }),
    };
    fetch(SERVER + apiPath, options)
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        setText('Create account');
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
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>{text}</h1>

        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="password1"
          value={state.password1}
          onChange={handleChange}
          placeholder="Re-Password"
        />
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
