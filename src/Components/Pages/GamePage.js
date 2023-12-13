/* eslint-disable prefer-destructuring */
import anime from 'animejs/lib/anime.es'
import { getAuthenticatedUser } from '../../utils/auths'
import Navigate from '../Router/Navigate';


const GamePage = async () => {
  if(!getAuthenticatedUser()) {
    Navigate('/login')
    return;
  };

  
  let score = 0;
  const nbClicks = await takeScore();
  if(nbClicks!==0) score = nbClicks;
  let clickValue = await takeCLickValue();
  let proggress = (score*100)/8000000000;

  const main = document.querySelector('main');
  const body = document.querySelector('body');
 
  body.style.overflow = 'hidden';
  
  
  const text = ` 
  <div class="mainContainer">
  <div class="autoUpgradesDiv"></div> 
    <div class="clickerContainer">
      
        <div class="score">
          ${score}
        </div>  
   
      <button class="covidClick"></button>
      <div class="progress" style="width: 100%; margin-top: 10vh">
        <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${proggress}%" aria-valuenow="${proggress}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div class="upgradesDiv"></div> 
  </div>  
  `;

  main.innerHTML = text;


  const covidClick = document.querySelector('.covidClick');
  const scoreCompteur = document.querySelector('.score');
  const progressBar = document.querySelector('.progress-bar');

  covidClick.addEventListener('click', clickOnCovid);
  covidClick.addEventListener('click', popValueAnimation);

  covidClick.addEventListener('click', ()=>{
    score +=clickValue;
    scoreCompteur.innerText=score;
    addUserScore(score); 
    proggress = (score*100)/8000000000;
    progressBar.style.width = `${proggress}%`;
    progressBar.ariaValueNow = proggress;
  });

  function clickOnCovid() {
    anime({
      targets : covidClick,
      scale : 1.2,
      duration : 200,
      easing : 'easeOutQuart',
      complete : animeEnd
    })
  }

  function animeEnd() {
    anime({
      targets : '.covidClick',
      scale : 1.0,
      duration : 100,
      easing : 'easeInOutQuad',
    })
  }

   function popValueAnimation(e) {
    const x = e.clientX;
    const y = e.clientY-28;

    const clickFeedback = document.createElement('div');
    clickFeedback.classList.add('click-feedback');
    clickFeedback.innerHTML = `+${ clickValue}`;
    clickFeedback.style.left = `${x  }px`;
    clickFeedback.style.top = `${y  }px`;
    clickFeedback.style.userSelect = 'none';
    document.body.appendChild(clickFeedback)

    anime.timeline({
      targets: clickFeedback,
      opacity: 0,
      duration: 800,
      translateY: '-100',
      easing: 'easeOutSine'
    }).add({
      complete() {
        clickFeedback.remove();
      }
    })
  }
  
  
// Partie upgrades Teodor
const upgradesTable = document.querySelector('.upgradesDiv')
const autoUpgradesTable = document.querySelector('.autoUpgradesDiv')
renderUpgrades()


async function renderUpgrades(){
try{
  const username = getAuthenticatedUser().username;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      username,
    }),
    headers : {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(`${process.env.API_BASE_URL}/upgrades/readAll`, options);

  if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);

  const upgrades = await response.json();

  renderUpgradesMenu(upgrades)
  const upgradeButtons = document.querySelectorAll('.buttonAnnimation')

  upgradeButtons.forEach((upgrade) => {
    upgrade.addEventListener('click', (event) => {
       onClickEvent(event.target.dataset.id)
    });
    upgrade.addEventListener('mouseenter', () => {
      anime({
        targets: upgrade,
        scale: 1.1,
        duration: 300,
      });
    });
    upgrade.addEventListener('mouseleave', () => {
      anime({
        targets: upgrade,
        scale: 1,
        duration: 300,
      });
    });
  })
 }catch (err){
 console.error('GamePage::error: ', err); 
}
}


    function renderUpgradesMenu(menu){
    
      const tables = getMenuTableAsString(menu);
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

    function getMenuTableAsString(menu){
      const menuTable = getAllTableLines(menu)
      return menuTable;
    }

    function getAllTableLines(menu){
      let upgradesLines= "";
      let autoUpgrades = "";

      menu?.forEach((upgrade) => {
        if(upgrade.operation === 'auto'){
          autoUpgrades += `
          <div>
            <button class="upgradeButtonL buttonAnnimation" data-id=${upgrade.id}>
              ${upgrade.title}
              cost: ${upgrade.cost}
            </button>
          </div>
          `;
        }else{
          upgradesLines += `
 
          <div>
            <button class="upgradeButtonR buttonAnnimation" data-id=${upgrade.id}>
              ${upgrade.title}
              cost: ${upgrade.cost}
            </button>
          </div>
          `;
        }

      });
      return {autoUpgrades, upgradesLines};
    }

    async function onClickEvent(idUpgrade){
    const username = getAuthenticatedUser().username;
      
      const options = {
        method: 'PATCH',
        body: JSON.stringify({
          username,
          idUpgrade,
        }),
         headers : {
          'Content-Type': 'application/json',
         },
      };
      const response = await fetch(`${process.env.API_BASE_URL}/userUpgrades`,options);

      if(!response.ok){
        console.log(response.status);
        throw Error `fetch error`
      };
      const upgradeClick = await response.json();
      console.log(upgradeClick);
    
    clickValue = await takeCLickValue();
    score = await takeScore();
    renderUpgrades();
    scoreCompteur.innerText=score;
    }
    


    async function takeCLickValue () {
      // eslint-disable-next-line prefer-destructuring
      const username = getAuthenticatedUser().username;

      const options = {
        method: 'POST',
        body: JSON.stringify({
          username,
        }),
        headers : {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`${process.env.API_BASE_URL}/clicker/valueClickUser`, options);

      if(!response.ok){throw Error `fetch error`};
      const click = await response.json();
      console.log(click);

      return click;
    }

   // SCORE 

    async function addUserScore (addValue) {
      const username = getAuthenticatedUser().username;
      const nvxPoints = addValue

      const options = {
        method: 'POST',
        body: JSON.stringify({
          username,
          nvxPoints
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const response = await fetch(`${process.env.API_BASE_URL}/clicker/registerScore`, options);

      if(!response.ok){throw Error `fetch error`};
      const scoreUpdate = await response.json();
      console.log(scoreUpdate);

      return scoreUpdate;
    }

    async function takeScore() {
      const username = getAuthenticatedUser().username;
      const options = {
        method: 'POST',
        body: JSON.stringify({
          username
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const response = await fetch(`${process.env.API_BASE_URL}/clicker/scoreUser`, options);
      if(!response.ok){throw Error `fetch error`};
      const scoreUser = await response.json();
      console.log(scoreUser);

      return scoreUser;
    }

  
};

export default GamePage;