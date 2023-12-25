import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Card from 'react-bootstrap/esm/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import { useParams } from 'react-router-dom';
import logger from 'use-reducer-logger';
import styles from './record.module.css';
const SERVER = 'https://magicpostbackend.onrender.com',
  apiListManager = '/manager/get-list-manager',
  apiListEmployee = '/employee/get-employee-by-point';

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
  const { slug } = params;
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
        type: 'gathering',
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
  console.log(listEmployee);
  return (
    <div>
      <div className={styles.featuresHeading}>
        <p>Quản lí tài khoản trưởng điểm</p>
        <button type="button">Thêm nhân viên</button>
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
                <button type="button" style={{ float: 'right' }}>
                  Cập nhật thông tin
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
                <button type="button" className={styles.delete_button}>
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
