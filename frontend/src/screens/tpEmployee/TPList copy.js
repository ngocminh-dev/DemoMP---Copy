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

const SERVER = 'https://magicpostbackend.onrender.com',
  apiList = '/to-customer-order/get-data',
  apiChangeStatus = '/to-customer-order/verify';

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

function TPList() {
  const [{ loadingList, errorList, packages }, dispatchList] = useReducer(
    logger(reducerList),
    {
      packages: [],
      loadingList: true,
      errorList: '',
    }
  );
  const [state, setState, stateRef] = useState('transporting');
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState(value);
  };
  useEffect(() => {
    const options = {
      body: {
        employeeId: /*JSON.parse(localStorage.user).username*/ 'all',
        pointId: JSON.parse(localStorage.user).pointId,
        status: 'received',
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
      if (
        p._id.toUpperCase().indexOf(searchValue) > -1 ||
        p.sender.toUpperCase().indexOf(searchValue) > -1 ||
        p.receiverName.toUpperCase().indexOf(searchValue) > -1 ||
        p.receiverAddress.toUpperCase().indexOf(searchValue) > -1 ||
        p.receiverPhone.toUpperCase().indexOf(searchValue) > -1
      )
        document.getElementById(p._id).style.display = '';
      else document.getElementById(p._id).style.display = 'none';
    });
  };
  const handlePrint = (evt) => {
    //console.log(evt.target.parentNode.firstChild);

    var printContents = evt.target.parentNode.firstChild.innerHTML;

    var w = window.open();
    w.document.write('<html><head><title>Biên lai giao hàng</title></head>');
    w.document.write(printContents);
    w.print();
    w.close();
  };

  const handleShowForm = (evt) => {
    if (evt.target.parentNode.lastChild.style.display === '') {
      evt.target.parentNode.lastChild.style.display = 'none';
    } else evt.target.parentNode.lastChild.style.display = '';
  };

  const handleChangeStatus = (evt) => {
    const options = {
      body: {
        _id: evt.target.getAttribute('_id'),
        packageId: evt.target.getAttribute('pkgType').toString(),
        transactionPointId: JSON.parse(localStorage.user).pointId,
        responsibleBy: JSON.parse(localStorage.user).username,
        status: stateRef.current,
        createdDate: 0,
        lastUpdatedDate: 0,
      },
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(SERVER + apiChangeStatus, options, {
          headers: {
            'validate-token': localStorage.token,
          },
        });
        console.log('Thay đổi trạng thái đơn hàng thành công!');
        console.log(response);
      } catch (error) {
        // Handle error
        console.log(error);
      }
    };
    fetchData();
    return;
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
      <div className={`${styles.featuresListWrapper} center`}>
        <div className={`${styles.featuresList} center`}>
          {packages.map(
            ({
              _id,
              sender,
              status,
              receiverName,
              receiverAddress,
              receiverPhone,
              packageType,
            }) => {
              return (
                <Card key={_id} id={_id}>
                  <CardBody>
                    <CardTitle>{'Mã đơn hàng: ' + _id}</CardTitle>
                    <CardText>{'Người gửi: ' + sender}</CardText>
                    <CardText>{'Người nhận: ' + receiverName}</CardText>
                    <CardText>
                      {'Địa chỉ người nhận: ' + receiverAddress}
                    </CardText>
                    <CardText>
                      {'Số điện thoại người nhận: ' + receiverPhone}
                    </CardText>

                    <CardText>
                      {'Trạng thái: '}
                      {status === 'transporting' ? (
                        <div style={{ color: 'darkgreen' }}>
                          Đang vận chuyển
                        </div>
                      ) : status === 'received' ? (
                        <div style={{ color: 'darkorange' }}>Đã nhận </div>
                      ) : (
                        <div style={{ color: 'red' }}>Unknown</div>
                      )}
                    </CardText>
                  </CardBody>
                  <button type="button" onClick={handlePrint}>
                    In biên lai
                  </button>
                  <button type="button" onClick={handleShowForm}>
                    Thay đổi trạng thái
                  </button>
                  <form style={{ display: 'none' }}>
                    <select onChange={handleChange}>
                      <option value="" disabled selected>
                        Trạng thái
                      </option>
                      <option value="transporting">Đang vận chuyển</option>
                      <option value="received">Đã nhận</option>
                    </select>
                    <button
                      type="button"
                      _id={_id}
                      pkgType={packageType}
                      onClick={handleChangeStatus}
                    >
                      Lưu trạng thái
                    </button>
                  </form>
                </Card>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
export default TPList;
