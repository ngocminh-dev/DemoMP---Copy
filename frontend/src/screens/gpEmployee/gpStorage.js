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
  apiListGather = '/gathering-point/get-gathering-points',
  apiGetList = '/storage/get-package-by-pointid';

const reducerList = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_LIST':
      return { ...state, loadingList: true };
    case 'FETCH_SUCCESS_LIST':
      return { ...state, packages: action.payload, loadingList: false };
    case 'FETCH_FAIL_LIST':
      return { ...state, loadingList: false, errorList: action.payload };
    default:
      return state;
  }
};
const reducerGather = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_GATHER':
      return { ...state, loadingGather: true };
    case 'FETCH_SUCCESS_GATHER':
      return { ...state, listGather: action.payload, loadingGather: false };
    case 'FETCH_FAIL_GATHER':
      return { ...state, loadingGather: false, errorGather: action.payload };
    default:
      return state;
  }
};

function GPStorage() {
  const [{ loadingList, errorList, packages }, dispatchList] = useReducer(
    logger(reducerList),
    {
      packages: [],
      loadingList: true,
      errorList: '',
    }
  );
  const [{ loadingGather, errorGather, listGather }, dispatchGather] =
    useReducer(logger(reducerGather), {
      listGather: [],
      loadingGather: true,
      errorGather: '',
    });
  const options = {
    body: {
      pointId: JSON.parse(localStorage.user).pointId,
      pagesize: 0,
      pageindex: 0,
    },
  };
  const optionsPoint = {
    body: {
      pagesize: 0,
      pageindex: 0,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      dispatchList({ type: 'FETCH_REQUEST_LIST' });
      dispatchGather({ type: 'FETCH_REQUEST_GATHER' });
      try {
        const resultList = await axios.post(SERVER + apiGetList, options, {
          headers: {
            'Content-Type': 'application/',
            'validate-token': localStorage.token,
          },
        });

        dispatchList({ type: 'FETCH_SUCCESS_LIST', payload: resultList.data });
      } catch (error) {
        dispatchList({ type: 'FETCH_FAIL_LIST', payload: error.message });
      }
      try {
        const resultGather = await axios.post(
          SERVER + apiListGather,
          optionsPoint,
          {
            headers: {
              'validate-token': localStorage.token,
            },
          }
        );
        dispatchGather({
          type: 'FETCH_SUCCESS_GATHER',
          payload: resultGather.data,
        });
      } catch (error) {
        dispatchGather({ type: 'FETCH_FAIL_GATHER', payload: error.message });
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
        const result = await axios.post(SERVER + apiGetList, options, {
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

  return loadingList && loadingGather ? (
    <p style={{ textAlign: 'center' }}>Loading list ...</p>
  ) : errorList && errorGather ? (
    <p>{errorList + ',' + errorGather}</p>
  ) : (
    <div>
      <div className={styles.featuresHeading}>
        <p>Danh sách đơn hàng trong Kho </p>
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
          {packages.map((p) => {
            return (
              <Card key={p._id} id={p._id}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {'Mã hàng: ' + p.packageId}
                  </CardTitle>
                  <form>
                    <select value="" className="lastPoint">
                      <option value="">Chọn điểm đến </option>
                      {listGather.map((g) => {
                        return <option value={g._id}>{g.name}</option>;
                      })}
                    </select>
                    <button type="button">Chuyển hàng</button>
                  </form>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default GPStorage;
