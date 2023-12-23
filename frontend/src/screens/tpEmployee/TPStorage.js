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
  apiList = '/storage/get-package-by-pointid',
  apiSendPackageToStorage = '/to-storage-order/transaction-to-gathering',
  apiToStorage = '';

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
    const options = {
      body: {
        pointId: JSON.parse(localStorage.user).pointId,
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
  const handleSearch = (evt) => {
    var searchValue = evt.target.value.toUpperCase() || '';
    packages.map((p) => {
      if (p.packageId.toUpperCase().indexOf(searchValue) > -1)
        document.getElementById(p.packageId).style.display = '';
      else document.getElementById(p.packageId).style.display = 'none';
    });
  };

  const handleSendToStorage = (evt) => {
    var packageId = evt.target.parentNode.parentNode.getAttribute('packageId');
    const options = {
      body: {
        packageId: packageId,
        fromPoint: JSON.parse(localStorage.user).pointId,
        toPoint: '',
        responsibleBy: JSON.parse(localStorage.user).username,
        status: 'transporting',
        verifiedBy: '',
        verifiedDate: 0,
        createdDate: 0,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        const result = await axios.post(
          SERVER + apiSendPackageToStorage,
          options,
          {
            headers: {
              'validate-token': localStorage.token,
            },
          }
        );
        alert('Gửi hàng thành công');
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  };

  return loadingList ? (
    <p style={{ textAlign: 'center' }}>Loading list ...</p>
  ) : errorList ? (
    <p>{errorList}</p>
  ) : (
    <div>
      <div className={styles.featuresHeading}>
        <p>Thống kê đơn hàng tại điểm giao dịch</p>
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
          {packages.map(({ _id, packageId }) => {
            return (
              <Card key={_id} packageId={packageId} id={packageId}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {'Mã hàng: ' + packageId}
                  </CardTitle>
                  <button type="button">Thông tin hàng</button>
                  <button onClick={handleSendToStorage}>
                    Gửi hàng tới điểm tập kết
                  </button>
                  <button type="button">Gửi hàng tới người nhận</button>
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
