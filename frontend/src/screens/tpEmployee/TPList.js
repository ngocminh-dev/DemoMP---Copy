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
  apiList = '/to-customer-order/get-data';

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
  useEffect(() => {
    const options = {
      body: {
        employeeId: JSON.parse(localStorage.user).username,
        pointId: JSON.parse(localStorage.user).pointId,
        status: 'notreceived',
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
        p.packageId.toUpperCase().indexOf(searchValue) > -1 ||
        p.responsibleBy.toUpperCase().indexOf(searchValue) > -1 /*|| 
        p.status.toUpperCase().indexOf(searchValue) > -1||
        p.receiverAddress.toUpperCase().indexOf(searchValue) > -1 ||
        p.receiverPhone.toUpperCase().indexOf(searchValue) > -1**/
      )
        document.getElementById(p._id).style.display = '';
      else document.getElementById(p._id).style.display = 'none';
    });
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
          {packages.map(({ _id, packageId, responsibleBy, status }) => {
            return (
              <Card key={_id} id={_id}>
                <CardBody>
                  <CardTitle>{'Mã hàng: ' + packageId}</CardTitle>
                  <CardText>
                    {'Nhân viên chịu trách nhiệm: ' + responsibleBy}
                  </CardText>

                  <CardText>
                    {'Trạng thái: '}
                    {status === 'transporting' ? (
                      <div style={{ color: 'darkgreen' }}>Đang vận chuyển</div>
                    ) : status === 'received' ? (
                      <div style={{ color: 'darkorange' }}>Đã nhận </div>
                    ) : status === 'notreceived' ? (
                      <div style={{ color: 'brown' }}>Trả lại </div>
                    ) : (
                      <div style={{ color: 'yellow' }}>Unknown</div>
                    )}
                  </CardText>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default TPList;
