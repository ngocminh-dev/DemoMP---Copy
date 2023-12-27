import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Card from 'react-bootstrap/esm/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import { useParams } from 'react-router-dom';
import logger from 'use-reducer-logger';
import styles from './record.module.css';
import CardText from 'react-bootstrap/esm/CardText';
const SERVER = 'https://magicpostbackend.onrender.com',
  apiListProduct = '/storage/get-data-by-pointid';

const reducerListProduct = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_PRODUCT':
      return { ...state, loadingListProduct: true };
    case 'FETCH_SUCCESS_PRODUCT':
      return {
        ...state,
        listProduct: action.payload,
        loadingListProduct: false,
      };
    case 'FETCH_FAIL_PRODUCT':
      return {
        ...state,
        loadingListProduct: false,
        errorListProduct: action.payload,
      };
    default:
      return state;
  }
};
const reducerListProduct2 = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_PRODUCT2':
      return { ...state, loadingListProduct2: true };
    case 'FETCH_SUCCESS_PRODUCT2':
      return {
        ...state,
        listProduct2: action.payload,
        loadingListProduct2: false,
      };
    case 'FETCH_FAIL_PRODUCT2':
      return {
        ...state,
        loadingListProduct2: false,
        errorListProduct2: action.payload,
      };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { point, slug } = params;
  const [
    { loadingListProduct, errorListProduct, listProduct },
    dispatchListProduct,
  ] = useReducer(logger(reducerListProduct), {
    listProduct: [],
    loadingListProduct: true,
    errorListProduct: '',
  });
  const [
    { loadingListProduct2, errorListProduct2, listProduct2 },
    dispatchListProduct2,
  ] = useReducer(logger(reducerListProduct2), {
    listProduct2: [],
    loadingListProduct2: true,
    errorListProduct2: '',
  });

  useEffect(() => {
    const options1 = {
      body: {
        pointId: slug,
        type: 'received',
        pagesize: 0,
        pageindex: 0,
      },
    };
    const options2 = {
      body: {
        pointId: slug,
        type: 'send',
        pagesize: 0,
        pageindex: 0,
      },
    };

    const fetchData = async () => {
      dispatchListProduct({ type: 'FETCH_REQUEST_PRODUCT' });
      try {
        const result = await axios.post(SERVER + apiListProduct, options1, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        dispatchListProduct({
          type: 'FETCH_SUCCESS_PRODUCT',
          payload: result.data,
        });
      } catch (error) {
        dispatchListProduct({
          type: 'FETCH_FAIL_PRODUCT',
          payload: error.message,
        });
      }
      dispatchListProduct2({ type: 'FETCH_REQUEST_PRODUCT2' });
      try {
        const result = await axios.post(SERVER + apiListProduct, options2, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        dispatchListProduct2({
          type: 'FETCH_SUCCESS_PRODUCT2',
          payload: result.data,
        });
      } catch (error) {
        dispatchListProduct2({
          type: 'FETCH_FAIL_PRODUCT2',
          payload: error.message,
        });
      }
    };
    fetchData();
  }, [slug]);
  var list = listProduct2.concat(listProduct);
  console.log(listProduct2);
  return (
    <div>
      <div className={styles.featuresHeading}>
        <p>
          Danh sách đơn hàng tại điểm {point === 'gp' ? 'tập kết' : 'giao dịch'}
        </p>
        <p>Tổng số đơn hàng là: {Object.keys(list).length}</p>
      </div>
      <div className={styles.showProduct}>
        <div className={styles.showProductPanel}>
          <h3>Hàng đã nhận</h3>
          {listProduct.map((p) => {
            return (
              <div>
                <Card>
                  <CardBody>
                    <CardTitle>{'Mã đơn hàng: ' + p._id}</CardTitle>
                    <CardText>
                      {'Nhân viên chịu trách nhiệm: ' + p.responsibleBy}
                    </CardText>

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
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
        <div className={styles.showProductPanel}>
          <h3>Hàng đã gửi</h3>
          {listProduct2.map((p) => {
            return (
              <div>
                <Card>
                  <CardBody>
                    <CardTitle>{'Mã đơn hàng: ' + p._id}</CardTitle>
                    <CardText>
                      {'Nhân viên chịu trách nhiệm: ' + p.responsibleBy}
                    </CardText>

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
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default ProductScreen;
