/* eslint-disable prefer-destructuring */
import anime from 'animejs/lib/anime.es';
import { getAuthenticatedUser } from '../../utils/auths';
import Navigate from '../Router/Navigate';
import soundClick from '../../sound/soundClick.mp3';
import soundItemAvailable from '../../sound/itemAvailable.mp3';
import soundBuy from '../../sound/soundBuy.mp3';
import covidCurrency from '../../img/virus-rouge.png'

let autoClickintervalID; 
let saveIntervalID;

function killAllIntervals(){
  clearInterval(autoClickintervalID);
  clearInterval(saveIntervalID);
}
const GamePage = async () => {
  // Verification user is connected
  if (!getAuthenticatedUser()) {
    Navigate('/login');
    return;
  }
  
  killAllIntervals();
  // Getting user's score and user's click value
  let score = 0;
  const nbClicks = await takeScore();
  if (nbClicks !== 0) score = nbClicks;
  let clickValue = await takeCLickValue();
  let autoValue = await takeAutoClickValue();
  // Transforming his score in % for the progress bar
  let progress = (score * 100) / 8000000000;
  

  const main = document.querySelector('main');

  // hide scrollbar
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';
  body.className = 'pageTooShort';

  const text = ` 
  <div class="mainContainer">
  <div class="autoUpgradesDiv"></div> 
    <div class="clickerContainer">
      
        <div >
          <span class="score">${score}</span>
          <img src="${covidCurrency}" width="50" height="50" class="covidCurrencyScore">
        </div>  
   
      <button class="covidClick"></button>
      <div class="progress" style="width: 100%; margin-top: 10vh">
        <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div class="upgradesDiv"></div> 
  </div>  
  `;

  main.innerHTML = text;

  const covidClick = document.querySelector('.covidClick');
  const scoreCompteur = document.querySelector('.score');
  const progressBar = document.querySelector('.progress-bar');
  const cursor = document.querySelector('.cursor');
  

  covidClick.addEventListener('mouseover', () => {
    cursor.classList.remove('cursor');
    cursor.classList.add('cursor-click');
  });
  covidClick.addEventListener('mouseout', () => {
    cursor.classList.remove('cursor-click');
    cursor.classList.add('cursor');
  });
  
  covidClick.addEventListener('click', clickOnCovid);
  covidClick.addEventListener('click', popValueAnimation);

  // soundclick

 // autoclick
startSaveInterval();

function startSaveInterval(){
  saveIntervalID= setInterval(async ()=>{
    addUserScore(score);
  }, 3000);
}
console.log(autoValue);

autoClickTimer();
  function autoClickTimer(){
    autoClickintervalID=setInterval(() => {
        if(window.location.pathname!=="/game"){
          clearInterval(autoClickintervalID);
          return;
        }
        if(autoValue!==0){
          updateProgressBar();
          const newValue = score+autoValue;
          console.log(newValue);
          anime({
            targets: scoreCompteur,
            innerText: [score, newValue],
            round: 1,
            easing: 'easeInOutExpo',
          })
          score=newValue;
          scoreCompteur.innerText = score;
          popAutoValueAnimation();
          upgradesColorChangeByCost();
        }
      }, 1000);
  }


  // increasing score and progress bar
  covidClick.addEventListener('click', () => {
    score += clickValue;
    scoreCompteur.innerText = score;
    updateProgressBar();
  });
  function updateProgressBar(){
    progress = (score * 100) / 8000000000;
    progressBar.style.width = `${progress}%`;
    progressBar.ariaValueNow = progress;
  }
  function clickOnCovid() {
    const soundC = new Audio(soundClick);
      soundC.play();
    anime({
      targets: covidClick,
      scale: 1.2,
      duration: 200,
      easing: 'easeOutQuart',
      complete: animeEnd,
    });
  }

  function animeEnd() {
    anime({
      targets: '.covidClick',
      scale: 1.0,
      duration: 100,
      easing: 'easeInOutQuad',
    });
  }

  // annimation of the number of the click value above the cursor
  function popValueAnimation(e) {
    const x = e.clientX;
    const y = e.clientY - 28;

    const clickFeedback = document.createElement('div');
    clickFeedback.classList.add('click-feedback');
    clickFeedback.innerHTML = `+${clickValue}`;
    clickFeedback.style.left = `${x}px`;
    clickFeedback.style.top = `${y}px`;
    clickFeedback.style.userSelect = 'none';
    document.body.appendChild(clickFeedback);

    anime
      .timeline({
        targets: clickFeedback,
        opacity: 0,
        duration: 800,
        translateY: '-100',
        easing: 'easeOutSine',
      })
      .add({
        complete() {
          clickFeedback.remove();
        },
      });
  }

  function popAutoValueAnimation() {
    const x = covidClick.offsetLeft + covidClick.offsetWidth/2;
    const y = covidClick.offsetTop + covidClick.offsetHeight/8;

    const clickFeedback = document.createElement('div');
    clickFeedback.classList.add('autoClick-feedback');
    clickFeedback.innerHTML = `+${autoValue}`;
    clickFeedback.style.left = `${x}px`;
    clickFeedback.style.top = `${y}px`;
    clickFeedback.style.userSelect = 'none';
    document.body.appendChild(clickFeedback);

    anime
      .timeline({
        targets: clickFeedback,
        opacity: 0,
        duration: 800,
        translateY: '-100',
        easing: 'easeOutSine',
      })
      .add({
        complete() {
          clickFeedback.remove();
        },
      });
  }

  // Partie UPGRADES
  // Getting the table of upgrades
  const upgradesTable = document.querySelector('.upgradesDiv');
  const autoUpgradesTable = document.querySelector('.autoUpgradesDiv');
  // gets upgrades and render them
  renderUpgrades();
  // upgradesColorChangeByCost change the color from green to red if you have enough to buy an upgrade
  covidClick.addEventListener('click', upgradesColorChangeByCost);

  async function renderUpgrades() {
    try {
      const username = getAuthenticatedUser().username;
      const options = {
        method: 'POST',
        body: JSON.stringify({
          username,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(`${process.env.API_BASE_URL}/upgrades/readAll`, options);

      if (!response.ok)
        throw new Error(`fetch error : ${response.status} : ${response.statusText}`);

      const upgrades = await response.json();
      // Calling function that will build the upgrade tables
      renderUpgradesMenu(upgrades);
      upgradesColorChangeByCost()
      
      const upgradeButtons = document.querySelectorAll('.buttonAnnimation');
      upgradeButtons.forEach((upgrade) => {
        // eslint-disable-next-line no-unused-vars
        upgrade.addEventListener('click', (event) => {
          if(event.target.dataset.cost<score){
            const soundB = new Audio(soundBuy);
            soundB.play();
            onClickEvent(event.target.dataset.id)
          }
        });

        upgrade.addEventListener('mouseenter', () => {
          anime({
            targets: upgrade,
            scale: 1.1,
            duration: 300,
          });
          cursor.classList.replace('cursor', 'cursor-click');
        });
        upgrade.addEventListener('mouseleave', () => {
          anime({
            targets: upgrade,
            scale: 1,
            duration: 300,
          });
          cursor.classList.replace('cursor-click', 'cursor');
        });
      });
    } catch (err) {
      console.error('GamePage::error: ', err);
    }
  }

  function renderUpgradesMenu(menu) {
    const tables = getAllTableLines(menu);
    upgradesTable.innerHTML = tables.upgradesLines;
    autoUpgradesTable.innerHTML = tables.autoUpgrades;
    const annimateButtonsR = document.querySelectorAll('.upgradeButtonR');
    const annimateButtonsL = document.querySelectorAll('.upgradeButtonL');
    anime.set(annimateButtonsR, {
      translateX: '500px',
    });
    anime({
      targets: annimateButtonsR,
      translateX: '0px',
      delay: anime.stagger(100),
    });

    anime.set(annimateButtonsL, {
      translateX: '-500px',
    });
    anime({
      targets: annimateButtonsL,
      translateX: '0px',
      delay: anime.stagger(100),
    });
  }

  function getAllTableLines(menu) {
    let upgradesLines = '';
    let autoUpgrades = '';

    menu?.forEach((upgrade) => {
      if (upgrade.operation === 'auto') {
        autoUpgrades += `
          <div>
            <button class="upgradeButtonL buttonAnnimation" data-id=${upgrade.id} data-cost=${upgrade.cost} data-isPlayed=${upgrade.isPlayed}>
              ${upgrade.title}<br>
              ${upgrade.cost} <img src="${covidCurrency}" width="20" height="20" class="covidCurrencyUpgrades">
            </button>
          </div>
          `;
      } else {
        upgradesLines += ` 
           <div>
            <button class="upgradeButtonR buttonAnnimation" data-id=${upgrade.id} data-cost=${upgrade.cost} data-isPlayed=${upgrade.isPlayed}>
              ${upgrade.title}<br>
              ${upgrade.cost}<img src="${covidCurrency}" width="20" height="20" class="covidCurrencyUpgrades">
            </button>
          </div>
          `;
      }
    });
    return { autoUpgrades, upgradesLines };
  }

  const soundItemsAiva = new Audio(soundItemAvailable);
  function playSoundItems() {
    soundItemsAiva.play();
  }
  
  function upgradesColorChangeByCost(){
    const upgradeButtonsToChangeColor = document.querySelectorAll('.buttonAnnimation');
    upgradeButtonsToChangeColor.forEach((upgrade)=>{
      if(upgrade.dataset.cost>score){
        // eslint-disable-next-line no-param-reassign
        upgrade.dataset.isPlayed = "false";
        // eslint-disable-next-line no-param-reassign
        upgrade.style.color="red";
      }else{
        // eslint-disable-next-line no-param-reassign
        upgrade.style.color="green";
        if(upgrade.dataset.isPlayed === "false"){
        playSoundItems();
        // eslint-disable-next-line no-param-reassign
        upgrade.dataset.isPlayed = "true";
        }
      }
    })
  }

  

  async function onClickEvent(idUpgrade) {
    await addUserScore(score);
    const username = getAuthenticatedUser().username;
    console.log(idUpgrade);
    const options = {
      method: 'PATCH',
      body: JSON.stringify({
        username,
        idUpgrade,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(`${process.env.API_BASE_URL}/userUpgrades`, options);

    if (!response.ok) {
      console.log(response.status);
      throw Error`fetch error`;
    }
    const upgradeClick = await response.json();
    console.log(upgradeClick);

    clickValue = await takeCLickValue();
    score = await takeScore();
    addUserScore(score)
    autoValue = await takeAutoClickValue();
    renderUpgrades();
    scoreCompteur.innerText = score;
  }

  async function takeCLickValue() {
    const username = getAuthenticatedUser().username;

    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(`${process.env.API_BASE_URL}/clicker/valueClickUser`, options);
    

    if (!response.ok ) {
      throw Error`fetch error`;
    }
    const click = await response.json();
    console.log(click);

    return click;
  }

  async function takeAutoClickValue(){
    const username = getAuthenticatedUser().username;

    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(`${process.env.API_BASE_URL}/clicker/valueAutoClickUser`, options);
    
    if (!response.ok ) {
      throw Error`fetch error`;
    }
    const autoClick = await response.json();
    console.log(autoClick);

    return autoClick;
  }

  // SCORE

  async function addUserScore(addValue) {
    if(score===0)return false;
    const username = getAuthenticatedUser().username;
    const nvxPoints = addValue;
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        nvxPoints,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(`${process.env.API_BASE_URL}/clicker/registerScore`, options);

    if (!response.ok) {
      throw Error`fetch error`;
    }
    const scoreUpdate = await response.json();
    console.log(scoreUpdate);
    return scoreUpdate;
  }

  async function takeScore() {
    const username = getAuthenticatedUser().username;
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

export default GamePage;

export {killAllIntervals};