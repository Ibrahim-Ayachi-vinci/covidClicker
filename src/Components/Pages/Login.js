import button from '../../img/arrowButton.png';
import Navigate from '../Router/Navigate';
import { setAuthenticatedUser } from '../../utils/auths';
import Navbar from '../Navbar/Navbar';

const Login = () => {
    const main = document.querySelector('main');
    const text = `
      <div class="position-absolute top-50 start-50 translate-middle card bg-transparent border border-dark" style="width: 18rem">
        <form>
        <h1 class="fontRubikBubbles card-header text-center border border-dark">Login</h1>
          <div class="card-body">
            <label>user</label>
            <input type="text" class="form-control border border-dark username">

            <label>password</label><br>
            <input type="password" class="form-control  border border-dark password">
            <p class = "noLogin" style="color: red"></p>

            <a class="btn btn-sm register">No account?</a><br>

            <input type="image" src="${button}" class="confirmButton">
            
          </div>
        </form>
      </div>
      `;
    main.innerHTML = text;

    const register = document.querySelector('.register');

    register.addEventListener('click', registerPage);

    function registerPage(){
      Navigate('/register');
    };

    const form = document.querySelector('form');
    form.addEventListener('submit', login);
  };

  async function login (e) {
    e.preventDefault();

    const username = document.querySelector('.username').value;
    const password = document.querySelector('.password').value;

    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers : {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch('/api/auths/login', options);

    if(!response.ok) {
      const erreur = document.querySelector('.noLogin');
      erreur.innerText = "Nom d'utilisateur ou mot de passe incorrect";
    }else{
      const authenticatedUser = await response.json();
      setAuthenticatedUser(authenticatedUser);
      Navbar();
      Navigate('/game');
    };

    return null;
    
  };
  
  export default Login;