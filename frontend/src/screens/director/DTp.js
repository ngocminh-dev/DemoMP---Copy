import axios from 'axios';
import { useEffect, useReducer } from 'react';
import logger from 'use-reducer-logger';
import styles from './record.module.css';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import Card from 'react-bootstrap/esm/Card';

const SERVER = 'https://magicpostbackend.onrender.com',
  apiList = '/transaction-point/get-transaction-points';

const reducerListTrans = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loadingList: true };
    case 'FETCH_SUCCESS':
      return { ...state, listTrans: action.payload, loadingList: false };
    case 'FETCH_FAIL':
      return { ...state, loadingList: false, errorList: action.payload };
    default:
      return state;
  }
};
function DTp() {
  const [{ loadingList, errorList, listTrans }, dispatchList] = useReducer(
    logger(reducerListTrans),
    {
      listTrans: [],
      loadingList: true,
      errorList: '',
    }
  );
  useEffect(() => {
    const options = {
      body: {
        pagesize: 0,
        pageindex: 0,
      },
    };

    const fetchData = async () => {
      dispatchList({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.post(SERVER + apiList, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        dispatchList({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatchList({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);

  return loadingList ? (
    <p style={{ textAlign: 'center' }}>Loading list ...</p>
  ) : errorList ? (
    <p>{errorList}</p>
  ) : (
    <div>
      <div className={styles.featuresHeading}>
        <p>Danh sách các điểm giao dịch</p>
        <button type="button">Thêm điểm giao dịch</button>
      </div>
      <div className={styles.list_trans}>
        {listTrans.map((p) => {
          return (
            <div>
              <Card className={styles.card}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {p.code} - {p.name}
                  </CardTitle>
                  <button type="button">Quản lí tài khoản </button>
                  <button type="button">Thống kê đơn hàng </button>
                  <button type="button" className={styles.delete_button}>
                    Xóa điểm
                  </button>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default DTp;
