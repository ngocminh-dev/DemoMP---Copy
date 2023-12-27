import axios from 'axios';
import { useEffect, useReducer } from 'react';
import logger from 'use-reducer-logger';
import styles from './record.module.css';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import Card from 'react-bootstrap/esm/Card';
import { useNavigate, useParams } from 'react-router-dom';
import useStateRef from 'react-usestateref';
const SERVER = 'https://magicpostbackend.onrender.com',
  apiListGather = '/gathering-point/get-gathering-points',
  apiCreateGather = '/gathering-point/insert',
  apiDeletePointGather = '/gathering-point/delete',
  apiListTrans = '/transaction-point/get-transaction-points',
  apiCreateTrans = '/transaction-point/insert',
  apiDeletePointTrans = '/transaction-point/delete';

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
const reducerListGatherForTrans = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_GFT':
      return { ...state, loadingGFT: true };
    case 'FETCH_SUCCESS_GFT':
      return { ...state, listGFT: action.payload, loadingGFT: false };
    case 'FETCH_FAIL_GFT':
      return { ...state, loadingGFT: false, errorGFT: action.payload };
    default:
      return state;
  }
};

function DP() {
  const params = useParams();
  const { point } = params;
  const [{ loadingList, errorList, list }, dispatchList] = useReducer(
    logger(reducerList),
    {
      list: [],
      loadingList: true,
      errorList: '',
    }
  );
  const [{ loadingGFT, errorGFT, listGFT }, dispatchListGFT] = useReducer(
    logger(reducerListGatherForTrans),
    {
      listGFT: [],
      loadingGFT: true,
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
        var api = point === 'gp' ? apiListGather : apiListTrans;
        const result = await axios.post(SERVER + api, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        dispatchList({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatchList({ type: 'FETCH_FAIL', payload: error.message });
      }
      if (point === 'tp') {
        dispatchListGFT({ type: 'FETCH_REQUEST_GFT' });
        try {
          const result = await axios.post(SERVER + apiListGather, options, {
            headers: {
              'validate-token': localStorage.token,
            },
          });
          dispatchListGFT({ type: 'FETCH_SUCCESS_GFT', payload: result.data });
        } catch (error) {
          dispatchListGFT({ type: 'FETCH_FAIL_GFT', payload: error.message });
        }
      }
    };
    fetchData();
  }, [point]);

  const navigate = useNavigate();

  function handleUser(p) {
    navigate('/director/' + point + '/user/' + p._id);
  }
  function handleProduct(p) {
    navigate('/director/' + point + '/product/' + p._id);
  }

  function handleShowForm(id) {
    var ele = document.getElementById(id);
    if (ele.style.display === 'none') {
      ele.style.display = '';
    } else ele.style.display = 'none';
  }
  const [state, setState, stateRef] = useStateRef({
    name: '',
    code: '',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleAddPoint = () => {
    const { name, code, gathering_point } = state;

    const options = {
      body: {
        belongsTo: gathering_point,
        name: name,
        code: code,
        managedBy: '',
        createdDate: 0,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        var api = point === 'gp' ? apiCreateGather : apiCreateTrans;
        const response = await axios.post(SERVER + api, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });

        alert('Thêm điểm thành công!');
        window.location.reload();
      } catch (error) {
        // Handle error
        alert(error.response.data.message);
      }
    };

    fetchData();
  };

  function handleDeletePoint(p) {
    const options = {
      body: {
        _id: p._id,
      },
    };

    const fetchData = async () => {
      try {
        var api = point === 'gp' ? apiDeletePointGather : apiDeletePointTrans;
        const response = await axios.post(SERVER + api, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });

        alert('Xóa điểm thành công!');
        window.location.reload();
      } catch (error) {
        // Handle error
        alert(error.response.data.message);
      }
    };

    fetchData();
  }

  return loadingList ? (
    <p style={{ textAlign: 'center' }}>Loading list ...</p>
  ) : errorList ? (
    <p>{errorList}</p>
  ) : (
    <div>
      <div className={styles.featuresHeading}>
        <p>Danh sách các điểm {point === 'gp' ? 'tập kết' : 'giao dịch'} </p>
        <button type="button" onClick={() => handleShowForm('form-add')}>
          Thêm điểm {point === 'gp' ? 'tập kết' : 'giao dịch'}
        </button>
        <form id="form-add" style={{ display: 'none' }}>
          <h3 style={{ margin: '1rem' }}>
            Thông tin điểm {point === 'gp' ? 'tập kết' : 'giao dịch'} mới
          </h3>
          <div className={styles.tpList}>
            <label for="name">Tên điểm: </label>
            <input
              style={{ width: '100%' }}
              type="text"
              id="name"
              name="name"
              placeholder={''}
              onChange={handleChange}
            />
            <label for="code">Code: </label>
            <input
              style={{ width: '100%' }}
              type="text"
              id="code"
              name="code"
              placeholder={''}
              onChange={handleChange}
            />
            <label for="gathering_point">Điểm tập kết: </label>
            <select
              id="gathering_point"
              name="gathering_point"
              onChange={handleChange}
            >
              <option value="" selected disabled>
                Chọn điểm tập kết
              </option>
              {point === 'tp'
                ? listGFT.map((p) => {
                    return (
                      <option value={p._id}>
                        {p.code} - {p.name}
                      </option>
                    );
                  })
                : ''}
            </select>
          </div>
          <button type="button" onClick={handleAddPoint}>
            Thêm
          </button>
        </form>
      </div>
      <div className={styles.list_trans}>
        {list.map((p) => {
          return (
            <div>
              <Card className={styles.card}>
                <CardBody>
                  <CardTitle style={{ fontSize: '1.5rem' }}>
                    {p.code} - {p.name}
                  </CardTitle>
                  <button type="button" onClick={() => handleUser(p)}>
                    Quản lí tài khoản
                  </button>
                  <button type="button" onClick={() => handleProduct(p)}>
                    Thống kê đơn hàng{' '}
                  </button>
                  <button
                    type="button"
                    className={styles.delete_button}
                    onClick={() => handleDeletePoint(p)}
                  >
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
export default DP;
