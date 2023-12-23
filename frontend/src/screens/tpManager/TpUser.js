import Card from 'react-bootstrap/esm/Card';
import CardBody from 'react-bootstrap/esm/CardBody';
import CardImg from 'react-bootstrap/esm/CardImg';
import CardText from 'react-bootstrap/esm/CardText';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import styles from './record.module.css';
import { features } from './features';

function TpUser() {
  return (
    <div>
      <div className={styles.featuresHeading}>
        <p>Danh sách nhân viên điểm giao dịch</p>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default TpUser;
