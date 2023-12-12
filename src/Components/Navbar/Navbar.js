import anime from 'animejs/lib/anime.es';
import logoNav from '../../img/logoNav.png';
import iconeLogin from '../../img/iconeLogin.png';
import iconeLogout from '../../img/iconLogout.png';
import iconeLogoutRed from '../../img/iconLogoutRed.png';
import iconeLoginBlue from '../../img/iconeLoginBlue.png';
import Navigate from '../Router/Navigate';
import {clearAuthenticatedUser, getAuthenticatedUser } from '../../utils/auths';

const Navbar = () => {

  const anonymousUserNavbar = `
    <div class="navbar">
      <div class="navbar-logo">
        <img src="${logoNav}" alt="Logo" width="70" height="70" class="d-inline-block align-text-top logo-img logoNav" data-uri="/">
      </div>
      <div class="navbar-center">
        <a class="nav-link custom-link large-link animate-on-hover" href="#" data-uri="/login">Game</a>
      </div>
      <div class="navbar-center">
        <a class="nav-link custom-link large-link animate-on-hover" href="#" data-uri="/leaderboard">Leaderboard</a>
      </div>
      <div class="navbar-right animate-on-hover">
        <img src="${iconeLogin}" width="50" height="50" class="login-icon" href="#" data-uri="/login">
      </div>
    </div>
  `;
  const authenticatedUserNavbar = `
    <div class="navbar">
      <div class="navbar-logo">
        <img src="${logoNav}" alt="Logo" width="70" height="70" class="d-inline-block align-text-top logo-img logoNav" data-uri="/">
      </div>
      <div class="navbar-center">
        <a class="nav-link custom-link large-link animate-on-hover" href="#" data-uri="/game">Game</a>
      </div>
      <div class="navbar-center">
        <a class="nav-link custom-link large-link animate-on-hover" href="#" data-uri="/leaderboard">Leaderboard</a>
      </div>
      <div class="navbar-right animate-on-hover">
        <img src="${iconeLogout}" width="50" height="50" id="logout">
      </div>
    </div>
  `;
  const navbar = document.querySelector('#navbarWrapper');

  navbar.innerHTML = getAuthenticatedUser() ? authenticatedUserNavbar : anonymousUserNavbar;

  if (getAuthenticatedUser()) {
    const logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', () => {
      clearAuthenticatedUser();
      Navbar();
      Navigate('/');
    });

    logoutButton.addEventListener('mouseover', () => {
      logoutButton.src = iconeLogoutRed;
    });

    logoutButton.addEventListener('mouseleave', () => {
      logoutButton.src = iconeLogout;
    });
  }
  
  if(!getAuthenticatedUser()){
    const loginButton = document.querySelector('.login-icon');
    loginButton.addEventListener('mouseover', () => {
      loginButton.src = iconeLoginBlue;
   });

    loginButton.addEventListener('mouseleave', () => {
      loginButton.src = iconeLogin;
    });
  }

  const addHoverAnimation = (element) => {
    element.addEventListener('mouseenter', () => {
      anime({
        targets: element,
        scale: 1.3,
        duration: 300,
      });
    });
  
    element.addEventListener('mouseleave', () => {
      anime({
        targets: element,
        scale: 1,
        duration: 300,
      });
    });
  };

  const logo = document.querySelector('.logoNav');
  if (logo) {
    addHoverAnimation(logo);
  }

  const elementsToAnimate = document.querySelectorAll('.animate-on-hover');
  elementsToAnimate.forEach((element) => {
    addHoverAnimation(element);
  });

  const cursor = document.querySelector('.cursor');
  document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", `top: ${e.pageY + 18}px; left: ${e.pageX + 18}px;`);
  });

};

export default Navbar;
