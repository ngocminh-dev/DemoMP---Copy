import DropDownBtn from '../DropDownButton/Drop';

const tpEmployee = {
    path: [
      '/tpEmployee/create',
      '/tpEmployee/list',
      '/tpEmployee/storage',
      '/tpEmployee/confirm-package-to-storage',
      '/tpEmployee/confirm-package-to-user',
    ],
    displayText: [
      'Tạo đơn hàng',
      'Thống kê',
      'Kho',
      'Xác nhận đơn về kho',
      'Xác nhận đơn hàng đến người nhận',
    ],
  },
  tpManager = {
    path: ['/tp/users', '/tp/list'],
    displayText: ['Quản lí nhân viên', 'Thống kê đơn hàng'],
  },
  gpEmployee = {
    path: ['/gpEmployee/storage', '/gpEmployee/confirm'],
    displayText: ['Kho', 'Xác nhận đơn'],
  },
  gpManager = {
    path: ['/gp/users', '/gp/list'],
    displayText: ['Quản lí nhân viên', 'Thống kê đơn hàng'],
  },
  director = {
    path: ['/director/gp', '/director/tp'],
    displayText: ['Điểm tập kết', 'Điểm giao dịch'],
  };

function featureDropDown(info) {
  switch (info.role) {
    case 'customer':
      return <DropDownBtn name={info.familyName + ' ' + info.lastName} />;

    case 'transaction-point-employee':
      return (
        <>
          <DropDownBtn
            name={
              'Hi, ' + info.role + ' ' + info.familyName + ' ' + info.lastName
            }
            role={info.role}
            ft={tpEmployee}
          />
        </>
      );
    case 'transaction-point-manager':
      return (
        <>
          <DropDownBtn
            name={
              'Hi, ' + info.role + ' ' + info.familyName + ' ' + info.lastName
            }
            role={info.role}
            ft={tpManager}
          />
        </>
      );
    case 'gathering-point-employee':
      return (
        <>
          <DropDownBtn
            name={
              'Hi, ' + info.role + ' ' + info.familyName + ' ' + info.lastName
            }
            role={info.role}
            ft={gpEmployee}
          />
        </>
      );
    case 'gathering-point-manager':
      return (
        <>
          <DropDownBtn
            name={
              'Hi, ' + info.role + ' ' + info.familyName + ' ' + info.lastName
            }
            role={info.role}
            ft={gpManager}
          />
        </>
      );
    case 'director':
      return (
        <>
          <DropDownBtn
            name={
              'Hi, ' + info.role + ' ' + info.familyName + ' ' + info.lastName
            }
            role={info.role}
            ft={director}
          />
        </>
      );
    default:
      break;
  }
}

function UserButton(props) {
  return <>{featureDropDown(props.user)}</>;
}

export default UserButton;
