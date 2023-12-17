/* eslint-disable consistent-return */
import button from '../../img/arrowButton.png';
import Navigate from '../Router/Navigate';
import changeCursor from '../Navbar/Navbar';
import { killAllIntervals } from './GamePage';
import { setAuthenticatedUser } from '../../utils/auths';

const Register = () => {
  killAllIntervals();
    const main = document.querySelector('main');
    const text = `
  <div class="position-absolute top-50 start-50 translate-middle card bg-transparent border border-dark" style="width: 20rem">
    <form>
    <h1 class="fontRubikBubbles card-header text-center border border-dark">Register</h1>
      <div class="card-body">
        <label class="buttonAnnimation">user</label>
        <input type="text" required class="form-control border border-dark userName buttonAnnimation">
        <p class="userNameError errorMessage"></p>

        <label class="buttonAnnimation">password</label><br>
        <input type="password" required class="form-control  border border-dark password buttonAnnimation">
        <p class="weakPassword errorMessage" ></p>

        <label class="buttonAnnimation">confirm password</label><br>
        <input type="password" required class="form-control  border border-dark confirmPassword buttonAnnimation">
        <p class="passwordNoMatch errorMessage" ></p>
        <div>
        <input type="checkbox" name="check" class="changeCursor buttonAnnimation" value="confirmPolicy"required />
        <label for="confirmPolicy" class="buttonAnnimation">I aggree to your <a href="#" data-uri="/privacyPolicy" target="_blank" class="link-underline-primary changeCursor buttonAnnimation">privacy policy</a></label>
        </div>

        <input type="image" src="${button}" class="confirmButton changeCursor">
      </div>
    </form>
  </div>
    `;
    main.innerHTML = text;

    const form = document.querySelector('form');
    form.addEventListener('submit', register);
    const userPresent = document.querySelector('.userNameError');
    const weakPassword = document.querySelector('.weakPassword');
    const passwordNoMatch = document.querySelector('.passwordNoMatch');
    const body = document.querySelector('body');
    body.className = 'pageTooShort';
    
    changeCursor();
    
    async function register(e){

      e.preventDefault();
      clearErrorMessages();

      const username = document.querySelector('.userName').value;
      const password = document.querySelector('.password').value;
      const confirmPassword = document.querySelector('.confirmPassword').value;

      
      const options = {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(`${process.env.API_BASE_URL}/auths/register`, options);
      if(!response.ok){
        const messageError = await response.json();
        if (messageError.userPresent){
          userPresent.innerText = "nom d'utilisateur déjà pris";
        }else if (messageError.weakPassword){
          weakPassword.innerText = "mot de passe trop faible";
        }else if (messageError.passwordNoMatch){
          passwordNoMatch.innerText = "les mots de passe ne correspondent pas";
        }
      }else{
        const authenticatedUser = await response.json();
        setAuthenticatedUser(authenticatedUser);
        return Navigate('/')
      }
    }

    function clearErrorMessages(){
      userPresent.innerText = '';
      passwordNoMatch.innerText = '';
      weakPassword.innerText = '';
    }
  };
  
  export default Register;