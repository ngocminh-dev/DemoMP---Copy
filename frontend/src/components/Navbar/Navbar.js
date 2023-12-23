import React from 'react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import UserButton from '../User/UserButton';

const Navbar = ({ hamActive, setHamActive }) => {
  const logo = '/brand.png';
  //'https://d2guulkeunn7d8.cloudfront.net/assets/beetstrap/brand/instacart-logo-color-4db9d81ca0b7638befdc4bd331f64a2633df790c0b55ef627c99b1ba77af72b7.svg';
  const handleClick = () => {
    setHamActive(!hamActive);
  };

  const navigate = useNavigate();

  const navigateSignUp = () => {
    navigate('/signUp');
  };

  const navigateSignIn = () => {
    navigate('/signIn');
  };
  const navigateHome = () => {
    navigate('/');
  };
  return (
    <nav className={`${styles.navbarWrapper} center`}>
      <div className={`${styles.navbarInner} center`}>
        <button
          className={`${styles.hamburger} ${hamActive && styles.active}`}
          onClick={handleClick}
        >
          <span className={styles.hamburgerLines}></span>
        </button>
        <div className={`${styles.navLeft}`}>
          <img
            src={logo}
            alt="logo"
            className={styles.brand}
            onClick={navigateHome}
          />
        </div>
        <div className={`${styles.navRight} center`}>
          <div className={styles.navLinksWrapper}>
            <div className={styles.verticalLine}> </div>

            <a href="/" className={`${styles.nav} center`}>
              NavItem1
            </a>
            <a href="/" className={`${styles.nav} center`}>
              NavItem2
            </a>
            <a href="/" className={`${styles.nav} center`}>
              Help
            </a>
          </div>
          {!localStorage.token ? (
            <>
              <div className={`${styles.signBtn}`}>
                <button className={styles.login} onClick={navigateSignIn}>
                  Sign in
                </button>
                <button className={styles.signup} onClick={navigateSignUp}>
                  Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              <UserButton user={JSON.parse(localStorage.user)} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
