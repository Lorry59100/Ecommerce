import './App.css';
import FormikContainer from './components/FormikContainer';
import ProductList from './components/ProductList';
import LoginForm from './components/forms/LoginForm';
import { Navbar } from './components/main_components/Navbar';
import { RegistrationForm } from './components/forms/RegistrationForm';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <LoginForm/>
    </div>
  );
}

export default App;
