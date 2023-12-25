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
  apiGetList = '/storage/get-package-by-pointid',
  apiToGathering = '/to-storage-order/gathering-to-gathering',
  apiToTransaction = '/to-storage-order/gathering-to-transaction',
  apiGetTransaction = '/gathering-point/get-gathering-belongings';
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

const reducerTransaction = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_TRANSACTION':
      return { ...state, loadingTransaction: true };
    case 'FETCH_SUCCESS_TRANSACTION':
      return {
        ...state,
        listTransaction: action.payload,
        loadingTransaction: false,
      };
    case 'FETCH_FAIL_TRANSACTION':
      return {
        ...state,
        loadingTransaction: false,
        errorTransaction: action.payload,
      };
    default:
      return state;
  }
};

function GPStorage() {
  //fetch all data first
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
  const [
    { loadingTransaction, errorTransaction, listTransaction },
    dispatchTransaction,
  ] = useReducer(logger(reducerTransaction), {
    listTransaction: [],
    loadingTransaction: true,
    errorTransaction: '',
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

  const optionsTransition = {
    body: {
      gatheringPointId: JSON.parse(localStorage.user).pointId,
      pagesize: 0,
      pageindex: 0,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      dispatchList({ type: 'FETCH_REQUEST_LIST' });
      dispatchGather({ type: 'FETCH_REQUEST_GATHER' });
      dispatchTransaction({ type: 'FETCH_REQUEST_TRANSACTION' });
      //Get list package
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

      //get list gather
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

      //get list transaction
      try {
        const resultTransition = await axios.post(
          SERVER + apiGetTransaction,
          optionsTransition,
          {
            headers: {
              'validate-token': localStorage.token,
            },
          }
        );
        dispatchTransaction({
          type: 'FETCH_SUCCESS_TRANSACTION',
          payload: resultTransition.data,
        });
      } catch (error) {
        dispatchTransaction({
          type: 'FETCH_FAIL_TRANSACTION',
          payload: error.message,
        });
      }
    };
    fetchData();
  }, []);

  //handle change on data
  const [state, setState, stateRef] = useState({
    point: '',
    transactionPoint: '',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleSearch = (evt) => {
    var searchValue = evt.target.value.toUpperCase() || '';
    packages.map((p) => {
      if (p.packageId.toUpperCase().indexOf(searchValue) > -1)
        document.getElementById(p._id).style.display = '';
      else document.getElementById(p._id).style.display = 'none';
    });
  };

  function handleSendGathering(p) {
    const { point, transactionPoint } = state;
    const options = {
      body: {
        packageId: p.packageId,
        fromPoint: JSON.parse(localStorage.user).pointId,
        toPoint: point,
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
        const result = await axios.post(SERVER + apiToGathering, options, {
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
  function handleSendTransaction(p) {
    const { point, transactionPoint } = state;
    const options = {
      body: {
        packageId: p.packageId,
        fromPoint: JSON.parse(localStorage.user).pointId,
        toPoint: transactionPoint,
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
        const result = await axios.post(SERVER + apiToTransaction, options, {
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
          {packages.toReversed().map((p) => {
            return (
              <Card key={p._id} id={p._id}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {'Mã hàng: ' + p.packageId}
                  </CardTitle>
                  <div>
                    <select
                      id="point"
                      name="point"
                      className="lastPoint"
                      onChange={handleChange}
                    >
                      <option value="" disabled selected>
                        Chọn điểm tập kết đến
                      </option>
                      {listGather.map((g) => {
                        return <option value={g._id}>{g.name}</option>;
                      })}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleSendGathering(p)}
                    >
                      Chuyển hàng đến điểm tập kết đích
                    </button>
                  </div>
                  <div>
                    <select
                      id="transactionPoint"
                      name="transactionPoint"
                      className="lastPoint"
                      onChange={handleChange}
                    >
                      <option value="" disabled selected>
                        Chọn điểm giao dịch đến
                      </option>
                      {listTransaction.map((g) => {
                        return <option value={g._id}>{g.name}</option>;
                      })}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleSendTransaction(p)}
                    >
                      Chuyển hàng đến điểm giao dịch
                    </button>
                  </div>
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
