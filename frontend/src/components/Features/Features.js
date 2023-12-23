import { Fragment } from 'react';
import styles from './Features.module.css';
import { features } from '../../constants/features';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import CardText from 'react-bootstrap/esm/CardText';
import CardImg from 'react-bootstrap/esm/CardImg';

const Features = () => {
  return (
    <div className={`${styles.featuresWrapper} center`}>
      {!localStorage.token ? (
        <div className={styles.featuresHeading}>
          <p>Vui lòng đăng nhập để xem trạng thái đơn hàng của bạn</p>
        </div>
      ) : (
        <div>
          <div className={styles.featuresHeading}>
            <p>Đơn hàng</p>
          </div>
          <div className={`${styles.featuresListWrapper} center`}>
            <div className={`${styles.featuresList} center`}>
              {features.map(({ feature, description, image }) => {
                return (
                  <Card>
                    <CardBody>
                      <CardTitle>{feature}</CardTitle>
                      <CardText>{description}</CardText>
                      <CardImg src={image} />
                    </CardBody>
                  </Card>
                  /*
              <div className={`${styles.featureDiv} center`}>
                <Fragment>
                  <div className={styles.feature}>
                    <p>{feature}</p>
                  </div>
                  <div className={styles.featureDescription}>
                    <p>{description}</p>
                  </div>
                  <div>
                    <img className={styles.featureImg} src={image} alt="img" />
                  </div>
                </Fragment>
              </div>*/
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Features;
