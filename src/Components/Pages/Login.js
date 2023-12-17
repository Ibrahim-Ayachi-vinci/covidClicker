import anime from 'animejs/lib/anime.es';
import button from '../../img/arrowButton.png';
import Navigate from '../Router/Navigate';
import { setAuthenticatedUser } from '../../utils/auths';
// eslint-disable-next-line import/no-duplicates
import Navbar from '../Navbar/Navbar';
// eslint-disable-next-line import/no-duplicates
import changeCursor from '../Navbar/Navbar';
import mouseClick from '../../sound/mouseClick.mp3';
import { killAllIntervals } from './GamePage';

const Login = () => {
  killAllIntervals();
    const main = document.querySelector('main');
    const text = `
      <div class="position-absolute top-50 start-50 translate-middle card bg-transparent border border-dark" style="width: 18rem">
        <form>
        <h1 class="fontRubikBubbles card-header text-center border border-dark buttonAnnimation">Login</h1>
          <div class="card-body">
            <label class="buttonAnnimation">user</label>
            <input type="text" required  class="form-control border border-dark username buttonAnnimation">

            <label class="buttonAnnimation">password</label><br>
            <input type="password" required  class="form-control  border border-dark password buttonAnnimation">
            <p class = "noLogin errorMessage"><p>

            <a class="btn btn-sm register buttonAnnimation changeCursor" id="noAccount">No account?</a><br>

            <input type="image" src="${button}" class="confirmButton changeCursor">
            
          </div>
        </form>
      </div>
      `;
    main.innerHTML = text;

    const register = document.querySelector('.register');
    const cursor = document.querySelector('.cursor');
    const noAccount = document.querySelector('#noAccount');
    const body = document.querySelector('body');
    body.className = 'pageTooShort';

    noAccount.addEventListener('mouseenter', ()=> {
      anime({
        targets: noAccount,
        color: '#89CFF0',
        duration: 1
      })
    })
    noAccount.addEventListener('mouseleave', ()=> {
      anime({
        targets: noAccount,
        color: '#212529',
        duration: 1
      })
    })

    register.addEventListener('click', () => {
      const soundM = new Audio(mouseClick);
      soundM.volume = 0.1;
      soundM.play();
      cursor.className = 'cursor';
      registerPage();
    });

    changeCursor();

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
    
    const response = await fetch(`${process.env.API_BASE_URL}/auths/login`, options);

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