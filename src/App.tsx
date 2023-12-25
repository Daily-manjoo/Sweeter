import { useState, useEffect } from 'react';
import Router from 'components/Router';
import { Layout } from 'components/Layout';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { app } from 'firebaseApp';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/loader/Loader';

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth?.currentUser);

  useEffect(()=> {
    onAuthStateChanged(auth, (user)=> {
      if(user){
        setIsAuthenticated(true);
      } else{
        setIsAuthenticated(false);
      }
      setInit(true); ///onAuthStateChanged이 실행되면 true로
    })
  }, [auth])
  return(
    <Layout>
      <ToastContainer />
      <Loader />
      { init ? <Router isAuthenticated={isAuthenticated} /> : <Loader /> } {/*상태값 변경이 됐으면 라우터 보여주고 or loading */}
    </Layout>
  )
}

export default App;
