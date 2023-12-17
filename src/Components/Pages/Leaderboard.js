import anime from 'animejs/lib/anime.es';
import covidRed from '../../img/virus-rouge.png';
import podium from '../../img/podium.png';
import { getAuthenticatedUser } from '../../utils/auths'
import { killAllIntervals } from './GamePage';

/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

const getUsers = async () => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/leaderBoard`);
    console.log('reponse');
    console.log(response);
    if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
    const users = await response.json();

    return users;
  } catch (err) {
    console.error('LeaderBoard::error : ', err);
  }
};

const Leaderboard = async () => {
  killAllIntervals();
  
  const main = document.querySelector('main');
  const body = document.querySelector('body');
 
  body.style.overflow = 'hidden';
  const users = await getUsers();
  body.classList.remove('pageTooShort');
  const text = `
  <div class="covidContainerLeaderboard"></div>
  <div class="leaderboardPageContainer">
    <div class="podiumAndTableContainer">
    <img class="podiumContainer" src="${podium}"></img>
      <div class="table-container">
        <table class="table-header">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Pseudo</th>
                <th scope="col">score</th>
              </tr>
            </thead>
        </table>
        <div class="table-content">
          <table class="table">
            <tbody>
              ${getAllTableLines()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="userCardContainer"></div>
  </div>
 
  `;
  main.innerHTML = text;
  const covidContainer = document.querySelector('.covidContainerLeaderboard');
  createCovidIcons();

  function getAllTableLines() {
    let line = '';
    users.forEach((element) => {
      
       line += `
        <tr>
          <td>${users.indexOf(element)+1}</td>
          <td>${element.username}</td>
          <td>${element.nbClick}</td>
        </tr>`;
      
    });

    return line;
  }

  function createCovidIcons() {
    let totalImg = 35;
    do{ 
      createOneCovid();
      totalImg += 35;
    }while(totalImg < main.offsetWidth)
  }

  function createOneCovid(){
    const newImg = document.createElement("img");
    newImg.setAttribute('src', covidRed);
    newImg.setAttribute('style', 'width: 15px');
    newImg.style.userSelect = 'none';

    const positionX = Math.random() * (main.offsetWidth - 15);
    const positionY = Math.random() * (main.offsetHeight - 15);
    newImg.style.position = 'absolute';
    newImg.style.zIndex = -1;
    newImg.style.left = `${positionX}px`;
    newImg.style.top = `${positionY}px`;

    const hue = Math.floor(Math.random() * 360);
    newImg.style.filter = `hue-rotate(${hue}deg)`;
    newImg.classList.add("covidIcon");
    covidContainer.appendChild(newImg); 

    anime({
      targets: newImg,
      easing: 'linear',
      loop: true,
      duration: anime.random(1500, 7000),
      scale: anime.random(0, 8),
      opacity: 0
    });


  }

  const userCard = document.querySelector('.userCardContainer');

  renderUserCard()

  async function renderUserCard() {
    if (!getAuthenticatedUser()) {
      return
    }
    const userScore = await getUserScore();
    console.log('dans render')
    console.log(userScore)
    const card=`
    <div class="userCard fontRubikBubbles">
    Your personal score is :
    ${userScore}
    </div>
    `
    userCard.innerHTML=card;

    userCard.addEventListener('mouseenter',() => {
      anime({
        targets: userCard,
        scale: 1.1,
        duration: 300,
      });
    });

    userCard.addEventListener('mouseleave',() => {
      anime({
        targets: userCard,
        scale: 1.,
        duration: 300,
      });
    })
  }

  
  

  async function getUserScore() {
    const {username} = getAuthenticatedUser();
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(`${process.env.API_BASE_URL}/clicker/scoreUser`, options);
    if (!response.ok) {
      throw Error`fetch error`;
    }
    const scoreUser = await response.json();
    console.log(scoreUser);

    return scoreUser;
  }
  
};

export default Leaderboard;
