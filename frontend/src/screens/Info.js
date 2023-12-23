import React from 'react';
import useState from 'react-usestateref';

const SERVER = 'https://magicpostbackend.onrender.com';
var apiPath = '/user-information/customer-sign-up';

function Info() {
  var info = JSON.parse(localStorage.getItem('user')) || {
    id: '',
    username: '',
    password: '',
    role: '',
    email: '',
    familyName: '',
    lastName: '',
    dateOfBirth: 0,
    createdDate: 0,
    lastUpdatedDate: 0,
  };
  //const [text, setText] = useState('Create Account');
  const [isDisable, setIsDisable, isDisableRef] = useState(true);
  const [passwordMessenger, setPasswordMessenger, isPasswordMessengerRef] =
    useState('');
  const [state, setState, stateRef] = useState({
    email: '',
    password1: '',
    password: '',
    familyName: '',
    lastName: '',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
    handleChangeButton();
    if (evt.target.name === 'password1') {
      if (stateRef.current.password !== value) {
        setPasswordMessenger('Passwords do not match');
      } else setPasswordMessenger('OK!');
    }
    if (evt.target.name === 'password' && value === '')
      setPasswordMessenger('');
  };

  function handleChangeButton() {
    const { familyName, lastName, email, password, password1 } =
      stateRef.current;
    if (
      familyName !== '' ||
      lastName !== '' ||
      email !== '' ||
      (password === password1 && password !== '')
    )
      setIsDisable(false);
    else setIsDisable(true);
  }

  const handleOnSubmit = (evt) => {
    //setText('Checking your information...');
    evt.preventDefault();

    const { familyName, lastName, email, password, rePassword } =
      stateRef.current;

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: {
          //username: name,
          password: password,
          //role: 'customer',
          email: '',
          familyName: familyName,
          lastName: lastName,
          //dateOfBirth: 0,
          //createdDate: 0,
          //lastUpdatedDate: 0,
        },
      }),
    };
    fetch(SERVER + apiPath, options)
      .then((res) => res.text())
      .then((data) => {
        alert(data.message);
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
    <form onSubmit={handleOnSubmit}>
      <h1 style={{ margin: '0 0 1rem 0' }}>Thông tin cá nhân</h1>
      <div className="infoItems">
        <label for="username">Tên đăng nhập </label>
        <input
          type="text"
          name="username"
          disabled
          placeholder={info.username}
        />
      </div>
      <div className="infoItems">
        <label for="familyName">Họ </label>
        <input
          type="text"
          name="familyName"
          value={state.familyName}
          onChange={handleChange}
          placeholder={info.familyName}
        />
      </div>
      <div className="infoItems">
        <label for="lastName">Tên </label>
        <input
          type="text"
          name="lastName"
          value={state.lastName}
          onChange={handleChange}
          placeholder={info.lastName}
        />
      </div>
      <div className="infoItems">
        <label for="email">Email </label>
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder={'Email' || info.email}
        />
      </div>

      <div className="infoItems">
        <label for="password">Mật khẩu mới </label>
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
      </div>

      <div className="infoItems">
        <label for="password1">Xác nhận mật khẩu mới </label>

        <input
          type="password"
          name="password1"
          value={state.password1}
          onChange={handleChange}
          placeholder="Re-Password"
        />
      </div>
      <span style={{ margin: '0.5rem' }}>{isPasswordMessengerRef.current}</span>
      <button disabled={isDisableRef.current}>Save</button>
    </form>
  );
}

export default Info;
