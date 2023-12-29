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
import PrintPage from './PrintPage';

const SERVER = 'https://magicpostbackend.onrender.com',
  apiList = '/storage/get-package-by-pointid',
  apiSendPackageToStorage = '/to-storage-order/transaction-to-gathering',
  apiSendPackageToUser = '/to-customer-order/insert',
  apiGetInfo = '/package-information/get-information';

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
        document.getElementById(p._id).style.display = '';
      else document.getElementById(p._id).style.display = 'none';
    });
  };

  function handleSendToStorage(p) {
    const options = {
      body: {
        packageId: p.packageId,
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
  }
  function handleSendToUser(p) {
    const options = {
      body: {
        packageId: p.packageId,
        transactionPointId: JSON.parse(localStorage.user).pointId,
        responsibleBy: JSON.parse(localStorage.user).username,
        status: 'transporting',
        createdDate: 0,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        const result = await axios.post(
          SERVER + apiSendPackageToUser,
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
        alert('Đơn hàng đang không ở đúng điểm giao dịch đích');
        console.log(error);
      }
    };
    fetchData();
  }
  function handlePrint(p, ele) {
    ele.target.disabled = true;
    ele.target.innerHTML = 'Loading...';
    const fetchData = async () => {
      try {
        const result = await axios.get(
          SERVER + apiGetInfo,

          {
            params: { packageId: p.packageId },
          }
        );
        PrintPage(result.data);
        ele.target.disabled = false;
        ele.target.innerHTML = 'Thông tin hàng';
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    return;
  }
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
          {packages.toReversed().map((p) => {
            return (
              <Card key={p._id} id={p._id}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {'Mã hàng: ' + p.packageId}
                  </CardTitle>
                  <button onClick={(evt) => handlePrint(p, evt)}>
                    Thông tin hàng
                  </button>
                  <button onClick={() => handleSendToStorage(p)}>
                    Gửi hàng tới điểm tập kết
                  </button>
                  <button type="button" onClick={() => handleSendToUser(p)}>
                    Gửi hàng tới người nhận
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
