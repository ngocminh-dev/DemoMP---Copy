import { Fragment, useEffect, useReducer } from 'react';
import styles from './Features.module.css';
import { features } from '../../constants/features';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import CardText from 'react-bootstrap/esm/CardText';
import CardImg from 'react-bootstrap/esm/CardImg';
import axios from 'axios';
import logger from 'use-reducer-logger';
const SERVER = 'https://magicpostbackend.onrender.com',
  apiGetPackage = '/package-information/get-package-info-for-customer';

const reducerList = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loadingList: true };
    case 'FETCH_SUCCESS':
      return { ...state, list: action.payload, loadingList: false };
    case 'FETCH_FAIL':
      return { ...state, loadingList: false, errorList: action.payload };
    default:
      return state;
  }
};
const Features = () => {
  const [{ loadingList, errorList, list }, dispatchList] = useReducer(
    logger(reducerList),
    {
      list: [],
      loadingList: true,
      errorList: '',
    }
  );
  useEffect(() => {
    const options = {
      body: {
        customerId: localStorage.user
          ? JSON.parse(localStorage.user).username
          : '',
        pagesize: 0,
        pageindex: 0,
      },
    };

    const fetchData = async () => {
      dispatchList({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.post(SERVER + apiGetPackage, options, {
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
  return (
    <div id="cart" className={`${styles.featuresWrapper} center`}>
      {!localStorage.token ? (
        <div className={styles.featuresHeading}>
          <p>Vui lòng đăng nhập để xem trạng thái đơn hàng của bạn</p>
        </div>
      ) : loadingList ? (
        <p style={{ textAlign: 'center' }}>Loading list ...</p>
      ) : errorList ? (
        <p>{'Không tải được đơn hàng'}</p>
      ) : (
        <div>
          <div className={styles.featuresHeading}>
            <p>Đơn hàng</p>
          </div>
          <div className={`${styles.featuresListWrapper} center`}>
            <div className={`${styles.featuresList} center`}>
              {list.map((p) => {
                return (
                  <Card>
                    <CardBody>
                      <CardTitle>Mã đơn hàng: {p._id}</CardTitle>
                      <CardText>Người nhận: {p.receiverName}</CardText>
                      <CardText>Địa chỉ: {p.receiverAddress}</CardText>
                      <CardText>Số điện thoại: {p.receiverPhone}</CardText>
                      <CardText>
                        {'Trạng thái: '}
                        {p.status === 'transporting' ? (
                          <div style={{ color: 'darkgreen' }}>
                            Đang vận chuyển
                          </div>
                        ) : p.status === 'received' ? (
                          <div style={{ color: 'darkorange' }}>Đã nhận </div>
                        ) : p.status === 'notreceived' ? (
                          <div style={{ color: 'brown' }}>Trả lại </div>
                        ) : (
                          <div style={{ color: 'yellow' }}>Unknown</div>
                        )}
                      </CardText>
                      <CardText>{p.message}</CardText>
                    </CardBody>
                  </Card>
                  /*
              <div className={`${styles.featureDiv} center`}>
                <Fragment>
                  <div className={styles.feature}>
                    <p>{feature}</p>
                  </div>
                  <div className={styles.featureDescription}>
                    <p>{description}</p>
                  </div>
                  <div>
                    <img className={styles.featureImg} src={image} alt="img" />
                  </div>
                </Fragment>
              </div>*/
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
