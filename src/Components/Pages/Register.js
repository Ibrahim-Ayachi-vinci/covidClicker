/* eslint-disable consistent-return */
import button from '../../img/arrowButton.png';
import Navigate from '../Router/Navigate';

const Register = () => {
    const main = document.querySelector('main');
    const text = `
  <div class="position-absolute top-50 start-50 translate-middle card bg-transparent border border-dark" style="width: 18rem">
    <form>
    <h1 class="fontRubikBubbles card-header text-center border border-dark">Register</h1>
      <div class="card-body">
        <label>user</label>
        <input type="text" class="form-control border border-dark userName">
        <p class="userNameError" style="color: red"></p>

        <label>password</label><br>
        <input type="password" class="form-control  border border-dark password">
        <p class="weakPassword" style="color: red"></p>

        <label>confirm password</label><br>
        <input type="password" class="form-control  border border-dark confirmPassword">
        <p class="passwordNoMatch" style="color: red"></p>

        <input type="image" src="${button}" class="confirmButton">
      </div>
    </form>
  </div>
    `;
    main.innerHTML = text;

    const form = document.querySelector('form');
    form.addEventListener('submit', register);
  
    async function register(e){

      e.preventDefault();

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
          const userPresent = document.querySelector('.userNameError');
          userPresent.innerText = "nom d'utilisateur déjà pris";
        }else if (messageError.weakPassword){
          const weakPassword = document.querySelector('.weakPassword');
          weakPassword.innerText = "mot de passe trop faible";
        }else if (messageError.passwordNoMatch){
          const passwordNoMatch = document.querySelector('.passwordNoMatch');
          passwordNoMatch.innerText = "les mots de passe ne correspondent pas";
        }
      }else{
        return Navigate('/')
      }
    }
  };
  
  export default Register;