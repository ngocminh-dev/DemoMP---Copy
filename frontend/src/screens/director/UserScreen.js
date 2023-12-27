import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Card from 'react-bootstrap/esm/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import { json, useParams } from 'react-router-dom';
import logger from 'use-reducer-logger';
import styles from './record.module.css';
import useStateRef from 'react-usestateref';
const SERVER = 'https://magicpostbackend.onrender.com',
  apiListManager = '/manager/get-list-manager',
  apiListEmployee = '/employee/get-employee-by-point',
  apiDeleteUser = '/employee/delete',
  apiCreateEmployee = '/user-information/company-member-sign-up',
  apiDeleteManager = '/manager/delete';

const reducerListManager = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_MANAGER':
      return { ...state, loadingListManager: true };
    case 'FETCH_SUCCESS_MANAGER':
      return {
        ...state,
        listManager: action.payload,
        loadingListManager: false,
      };
    case 'FETCH_FAIL_MANAGER':
      return {
        ...state,
        loadingListManager: false,
        errorListManager: action.payload,
      };
    default:
      return state;
  }
};

const reducerListEmployee = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_EMPLOYEE':
      return { ...state, loadingListEmployee: true };
    case 'FETCH_SUCCESS_EMPLOYEE':
      return {
        ...state,
        listEmployee: action.payload,
        loadingListEmployee: false,
      };
    case 'FETCH_FAIL_EMPLOYEE':
      return {
        ...state,
        loadingListEmployee: false,
        errorListEmployee: action.payload,
      };
    default:
      return state;
  }
};

function UserScreen() {
  const params = useParams();
  const { point, slug } = params;
  const [
    { loadingListManager, errorListManager, listManager },
    dispatchListManager,
  ] = useReducer(logger(reducerListManager), {
    listManager: [],
    loadingListManager: true,
    errorListManager: '',
  });
  const [
    { loadingListEmployee, errorListEmployee, listEmployee },
    dispatchListEmployee,
  ] = useReducer(logger(reducerListEmployee), {
    listEmployee: [],
    loadingListEmployee: true,
    errorListEmployee: '',
  });
  useEffect(() => {
    const options = {
      body: {
        type: point === 'tp' ? 'transaction' : 'gathering',
        pointId: slug,
        pagesize: 0,
        pageindex: 0,
      },
    };

    const fetchData = async () => {
      dispatchListManager({ type: 'FETCH_REQUEST_MANAGER' });
      dispatchListEmployee({ type: 'FETCH_REQUEST_EMPLOYEE' });
      try {
        const result = await axios.post(SERVER + apiListManager, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        dispatchListManager({
          type: 'FETCH_SUCCESS_MANAGER',
          payload: result.data,
        });
      } catch (error) {
        dispatchListManager({
          type: 'FETCH_FAIL_MANAGER',
          payload: error.message,
        });
      }
      try {
        const result = await axios.post(SERVER + apiListEmployee, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        dispatchListEmployee({
          type: 'FETCH_SUCCESS_EMPLOYEE',
          payload: result.data,
        });
      } catch (error) {
        dispatchListEmployee({
          type: 'FETCH_FAIL_EMPLOYEE',
          payload: error.message,
        });
      }
    };
    fetchData();
  }, [slug]);

  function handleDeleteUser(username, evt) {
    evt.target.disabled = true;
    evt.target.innerHTML = 'Loading...';
    const options = {
      body: {
        username: username,
      },
    };
    const fetchData = async () => {
      try {
        const result = await axios.post(SERVER + apiDeleteUser, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        alert('Đã xóa nhân viên: ' + result.data.deleted);
        evt.target.disabled = false;
        evt.target.innerHTML = 'Xóa';
        window.location.reload();
      } catch (error) {
        console.log(error);
        evt.target.disabled = false;
        evt.target.innerHTML = 'Xóa';
      }
    };
    fetchData();
    return;
  }

  function handleDeleteManager(username, evt) {
    evt.target.disabled = true;
    evt.target.innerHTML = 'Loading...';
    const options = {
      body: {
        username: username,
      },
    };
    const fetchData = async () => {
      try {
        const result = await axios.post(SERVER + apiDeleteManager, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        alert('Đã xóa quản lí: ' + result.data.deleted);
        evt.target.disabled = false;
        evt.target.innerHTML = 'Xóa';
        window.location.reload();
      } catch (error) {
        console.log(error);
        evt.target.disabled = false;
        evt.target.innerHTML = 'Xóa';
      }
    };
    fetchData();
    return;
  }

  function handleDisplayForm(id) {
    var ele = document.getElementById(id);
    if (ele.style.display === 'none') {
      ele.style.display = '';
    } else ele.style.display = 'none';
  }

  const [state, setState, stateRef] = useStateRef({
    username: '',
    password: '',
    familyName: '',
    lastName: '',
    email: '',
    role: '*',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = () => {
    const { username, password, familyName, lastName, email, role } = state;

    const options = {
      body: {
        username: username,
        password: password,
        role:
          role === '*'
            ? point === 'tp'
              ? 'transaction-point-employee'
              : 'gathering-point-employee'
            : role,
        email: email,
        familyName: familyName,
        lastName: lastName,
        dateOfBirth: 0,
        managedBy: listManager[0] ? listManager[0].username : '',
        /*JSON.parse(localStorage.user).username*/ createdDate: 0,
        pointManaged: slug,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(SERVER + apiCreateEmployee, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });

        alert('Thêm nhân viên thành công!');
        window.location.reload();
      } catch (error) {
        // Handle error
        alert(error.response.data.message);
      }
    };

    fetchData();
  };
  return (
    <div>
      <div className={styles.featuresHeading}>
        <p>Quản lí tài khoản điểm {point === 'tp' ? 'giao dịch' : 'tập kết'}</p>
        <button
          type="button"
          onClick={() => handleDisplayForm('form-add-employee')}
        >
          Thêm nhân viên
        </button>
        <form id="form-add-employee" style={{ display: 'none' }}>
          <h3 style={{ margin: '1rem' }}>Thông tin nhân viên</h3>
          <div className={styles.tpList}>
            <select name="role" id="role" onChange={handleChange}>
              <option value="" selected disabled>
                Chọn chức vụ
              </option>
              <option
                value={
                  point === 'tp'
                    ? 'transaction-point-manager'
                    : 'gathering-point-manager'
                }
              >
                Quản lí
              </option>
              <option
                value={
                  point === 'tp'
                    ? 'transaction-point-employee'
                    : 'gathering-point-employee'
                }
              >
                Nhân viên
              </option>
            </select>
            <label for="username">Tên tài khoản: </label>
            <input
              style={{ width: '100%' }}
              type="text"
              id="username"
              name="username"
              placeholder={''}
              onChange={handleChange}
            />
            <label for="password">Mật khẩu: </label>
            <input
              style={{ width: '100%' }}
              type="password"
              id="password"
              name="password"
              placeholder={''}
              onChange={handleChange}
            />
            <label for="email">Email: </label>
            <input
              style={{ width: '100%' }}
              type="email"
              id="email"
              name="email"
              placeholder={''}
              onChange={handleChange}
            />
            <label for="familyName">Họ: </label>
            <input
              style={{ width: '100%' }}
              type="text"
              id="familyName"
              name="familyName"
              placeholder={''}
              onChange={handleChange}
            />
            <label for="lastName">Tên: </label>
            <input
              style={{ width: '100%' }}
              type="text"
              id="lastName"
              name="lastName"
              placeholder={''}
              onChange={handleChange}
            />
          </div>
          <button type="button" onClick={handleOnSubmit}>
            Thêm
          </button>
        </form>
      </div>
      <p style={{ fontSize: '1.5rem' }}>Trưởng điểm: </p>
      {listManager.map((p) => {
        return (
          <div>
            <Card className={styles.card}>
              <CardBody>
                <CardTitle style={{ fontSize: '1.5rem' }}>
                  {p.username}
                </CardTitle>
                <button
                  type="button"
                  className={styles.delete_button}
                  onClick={(evt) => handleDeleteManager(p.username, evt)}
                >
                  Xóa
                </button>
              </CardBody>
            </Card>
          </div>
        );
      })}
      <p style={{ fontSize: '1.5rem' }}>Nhân viên: </p>
      {listEmployee.map((p) => {
        return (
          <div>
            <Card className={styles.card}>
              <CardBody>
                <CardTitle style={{ fontSize: '1.5rem' }}>
                  {p.username}
                </CardTitle>
                <button
                  type="button"
                  className={styles.delete_button}
                  onClick={(evt) => handleDeleteUser(p.username, evt)}
                >
                  Xóa
                </button>
              </CardBody>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
export default UserScreen;
