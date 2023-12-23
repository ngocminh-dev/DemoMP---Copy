import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const handlerLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

function DropDownBtn(props) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });
  return (
    <>
      <div className="menu-container" ref={menuRef}>
        <button
          type="button"
          className="menu-trigger"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {props.name}
        </button>

        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
          <ul>
            <DropDownItem text="Thông tin tài khoản" path="/info" />
            <DropDownItem text="Đăng xuất" path="/" />
            <div>-</div>
            {props.ft &&
              props.ft.path.map((p, i) => {
                return (
                  <>
                    <DropDownItem text={props.ft.displayText[i]} path={p} />
                  </>
                );
              })}
          </ul>
        </div>
      </div>
    </>
  );
}

function DropDownItem(props) {
  return (
    <li>
      <i></i>
      <a
        href={props.path}
        onClick={props.text === 'Đăng xuất' ? handlerLogout : null}
      >
        {props.text}
      </a>
    </li>
  );
}

export default DropDownBtn;
