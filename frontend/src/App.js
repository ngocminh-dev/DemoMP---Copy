import { Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.js';
import Sign from './screens/sign/sign.js';
import { useState } from 'react';
import Navbar from './components/Navbar/Navbar.js';
import NavbarResponsive from './components/NavbarResponsive/NavbarResponsive.js';
import TPCreate from './screens/tpEmployee/TPCreate.js';
import Info from './screens/Info.js';
import Footer from './components/Footer/Footer.js';

import './style.css';
import RecordSend from './screens/tpEmployee/RecordSend.js';
import RecordReceive from './screens/tpEmployee/RecordReceive.js';
import TPList from './screens/tpEmployee/TPList.js';
import TpUser from './screens/tpManager/TpUser.js';
import TpList from './screens/tpManager/TpList.js';
import GpCreate from './screens/gpEmployee/gpStorage.js';
import GpConfirm from './screens/gpEmployee/gpConfirm.js';
import GpUser from './screens/gpManager/GpUser.js';
import GpList from './screens/gpManager/GpList.js';
import DList from './screens/director/DList.js';
import DGp from './screens/director/DGp.js';
import DTp from './screens/director/DTp.js';
import TPStorage from './screens/tpEmployee/TPStorage.js';
import GPStorage from './screens/gpEmployee/gpStorage.js';

export default function App() {
  const [hamActive, setHamActive] = useState(false);
  return (
    <div>
      <header className="headerR">
        <Navbar hamActive={hamActive} setHamActive={setHamActive} />
        <NavbarResponsive hamActive={hamActive} />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signIn" element={<Sign />} />
          <Route path="/signUp" element={<Sign />} />
          <Route path="/info" element={<Info />} />

          {/*Trans employee*/}
          <Route path="/tpEmployee/create" element={<TPCreate />} />
          <Route path="/tpEmployee/recordSend" element={<RecordSend />} />
          <Route path="/tpEmployee/recordReceive" element={<RecordReceive />} />
          <Route path="/tpEmployee/list" element={<TPList />} />
          <Route path="/tpEmployee/storage" element={<TPStorage />} />

          {/*Trans manager*/}
          <Route path="/tpManager/users" element={<TpUser />} />
          <Route path="/tpManager/list" element={<TpList />} />

          {/*Gathering employee */}
          <Route path="/gpEmployee/storage" element={<GPStorage />} />
          <Route path="/gpEmployee/confirm" element={<GpConfirm />} />

          {/*Gathering manager*/}
          <Route path="/gpManager/users" element={<GpUser />} />
          <Route path="/gpManager/list" element={<GpList />} />

          {/*director*/}
          <Route path="/director/list" element={<DList />} />
          <Route path="/director/gp" element={<DGp />} />
          <Route path="/director/tp" element={<DTp />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
