import Card from 'react-bootstrap/esm/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardImg from 'react-bootstrap/esm/CardImg';
import CardText from 'react-bootstrap/esm/CardText';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import styles from './record.module.css';
import { useReducer, useEffect } from 'react';
import logger from 'use-reducer-logger';
import axios from 'axios';
import useState from 'react-usestateref';
import { json } from 'react-router-dom';

const SERVER = 'https://magicpostbackend.onrender.com',
  apiGetList = '/to-storage-order/get-unverified-order',
  apiConfirm = '/to-storage-order/verify-order';

const reducerList = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loadingList: true };
    case 'FETCH_SUCCESS':
      return { ...state, packages: action.payload, loadingList: false };
    case 'FETCH_FAIL':
      return { ...state, loadingList: false, errorList: action.payload };
    default:
      return state;
  }
};

function TPStorage() {
  const [{ loadingList, errorList, packages }, dispatchList] = useReducer(
    logger(reducerList),
    {
      packages: [],
      loadingList: true,
      errorList: '',
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatchList({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(SERVER + apiGetList, {
          params: { storageId: JSON.parse(localStorage.user).pointId },
        });
        dispatchList({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatchList({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);

  const handleSearch = (evt) => {
    var searchValue = evt.target.value.toUpperCase() || '';
    packages.map((p) => {
      if (p.packageId.toUpperCase().indexOf(searchValue) > -1)
        document.getElementById(p._id).style.display = '';
      else document.getElementById(p._id).style.display = 'none';
    });
  };

  function handleConfirm(p, stt) {
    const options = {
      body: {
        _id: p._id,
        fromType: p.fromType,
        toType: p.toType,
        packageId: p.packageId,
        fromPoint: p.fromPoint,
        toPoint: p.toPoint,
        responsibleBy: p.responsibleBy,
        status: stt,
        verifiedBy: JSON.parse(localStorage.user).username,
        verifiedDate: 0,
        createdDate: 0,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        const result = await axios.post(SERVER + apiConfirm, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        alert('Đã xác nhận');
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };
    return fetchData();
  }

  return loadingList ? (
    <p style={{ textAlign: 'center' }}>Loading list ...</p>
  ) : errorList ? (
    <p>{errorList}</p>
  ) : (
    <div>
      <div className={styles.featuresHeading}>
        <p>Danh sách đơn hàng đang tới </p>
      </div>

      <div className={styles.inputLocation}>
        <i class="fa-solid fa-boxes-packing"></i>
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng"
          className={styles.orderInput}
          onKeyUp={handleSearch}
        />
        <i className={`${styles.arrow} fas fa-arrow-right`}></i>
      </div>
      <div className={`${styles.featuresListWrapper} `}>
        <div className={`${styles.featuresList} `}>
          {packages.toReversed().map((p) => {
            return (
              <Card key={p._id} id={p._id}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {'Mã hàng: ' + p.packageId}
                  </CardTitle>
                  <button
                    type="button"
                    onClick={() => handleConfirm(p, 'received')}
                  >
                    Đã nhận được
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirm(p, 'notreceived')}
                    style={{ backgroundColor: 'red' }}
                  >
                    Không nhận được
                  </button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default TPStorage;
