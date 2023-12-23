import styles from './record.module.css';
import { useReducer, useEffect } from 'react';
import logger from 'use-reducer-logger';
import axios from 'axios';
import useState from 'react-usestateref';

const SERVER = 'https://magicpostbackend.onrender.com';
var apiPointIDs = '/transaction-point/get';
var apiCreate = '/package-information/insert';

const reducerPointID = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loadingID: true };
    case 'FETCH_SUCCESS':
      return { ...state, pointIDs: action.payload, loadingID: false };
    case 'FETCH_FAIL':
      return { ...state, loadingID: false, errorID: action.payload };
    default:
      return state;
  }
};

function TPCreate() {
  const [textCreate, setTextCreate, setTextCreateRef] = useState('Tạo đơn gửi');

  //GET POINT ID
  const [{ loadingID, errorID, pointIDs }, dispatchID] = useReducer(
    logger(reducerPointID),
    {
      pointIDs: [],
      loadingID: true,
      errorID: '',
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatchID({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(SERVER + apiPointIDs);
        dispatchID({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatchID({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);

  // HANDLE DATA
  const [state, setState, stateRef] = useState({
    username: '',
    toTransactionPoint: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    packageType: '',
    instruction: '',
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  //HANDLE SUBMIT
  const handleOnSubmit = () => {
    setTextCreate('Đang xử lí ...');
    const {
      username,
      toTransactionPoint,
      receiverName,
      receiverAddress,
      receiverPhone,
      packageType,
      instruction,
    } = state;

    const options = {
      body: {
        sender: username,
        responsibleBy: JSON.parse(localStorage.user).username,
        fromTransactionPoint: JSON.parse(localStorage.user).pointId,
        toTransactionPoint: toTransactionPoint,
        receiverName: receiverName,
        receiverAddress: receiverAddress,
        receiverPhone: receiverPhone,
        packageType: packageType,
        instruction: instruction,
        createdDate: 0,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(SERVER + apiCreate, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        setTextCreate('Tạo đơn hàng');
        alert('Tạo đơn hàng thành công! Mã đơn hàng là: ' + response.data._id);
        console.log(response);
      } catch (error) {
        // Handle error
        setTextCreate('Tạo đơn hàng');
        alert(error.response.data.message);
      }
    };

    fetchData();
  };
  return (
    <form>
      <h1 style={{ margin: '0 0 1rem 0' }}>{textCreate}</h1>
      <div className={styles.tpList}>
        <h2>1. Thông tin đơn gửi</h2>

        <label for="username">Tài khoản người gửi </label>
        <input
          style={{ width: '100%' }}
          type="text"
          id="username"
          name="username"
          placeholder={''}
          onChange={handleChange}
        />

        <h2>2. Thông tin người nhận</h2>
        <label for="receiverName">Tên người nhận </label>
        <input
          style={{ width: '100%' }}
          type="text"
          id="receiverName"
          name="receiverName"
          placeholder={''}
          onChange={handleChange}
        />
        <label for="receiverAddress">Địa chỉ người nhận</label>
        <input
          style={{ width: '100%' }}
          type="text"
          id="receiverAddress"
          name="receiverAddress"
          placeholder={''}
          onChange={handleChange}
        />
        <label for="receiverPhone">SĐT người nhận </label>
        <input
          style={{ width: '100%' }}
          type="text"
          id="receiverPhone"
          name="receiverPhone"
          placeholder={''}
          onChange={handleChange}
        />
        <label for="toTransactionPoint">Lựa chọn điểm đến</label>
        <select
          id="toTransactionPoint"
          name="toTransactionPoint"
          onChange={handleChange}
        >
          <option value="" disabled selected>
            Chọn điểm đến
          </option>
          {loadingID ? (
            <option>Loading</option>
          ) : errorID ? (
            <option>{errorID}</option>
          ) : (
            pointIDs.map((pointID) => {
              return <option value={pointID._id}>{pointID.name}</option>;
            })
          )}
        </select>

        <h2>3. Loại hàng gửi</h2>
        <select id="packageType" name="packageType" onChange={handleChange}>
          <option value="" disabled selected>
            Chọn loại hàng
          </option>
          <option value={1}>Tài liệu</option>;
          <option value={2}>Hàng hóa </option>;
        </select>

        <h2>4. Chỉ dẫn của người gửi nếu không giao được hàng</h2>
        <select id="instruction" name="instruction" onChange={handleChange}>
          <option value="" disabled selected>
            Chọn chỉ dẫn
          </option>
          <option value={1}>Chuyển hoàn ngay</option>;
          <option value={2}>Gọi điện cho người gửi</option>;
          <option value={3}>Chuyển hoàn khi hết thời gian lưu trữ</option>;
          <option value={4}>Hủy </option>;
        </select>
      </div>
      <button type="button" onClick={handleOnSubmit}>
        Tạo đơn hàng
      </button>
    </form>
  );
}

export default TPCreate;
