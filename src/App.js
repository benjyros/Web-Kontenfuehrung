import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Login from './Login';
import Registration from './Registration';
import {auth} from './config';

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Home");
      } else {
        setEmail("");
        setPassword("");
      }
      return unsubscribe;
    });
  }, []);

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} exact />
        <Route path='/registration' element={<Registration />} />
      </Routes>
    </div>

  );
}

export default App;
