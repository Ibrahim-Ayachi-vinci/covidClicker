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
  
  const text = ` 
  <div class="container d-flex justify-content-evenly align-items-center flex-column">
    <div class="alert alert-dark" role="alert ">
      <div class="score">
        ${score}
      </div>  
    </div>
    <div><button class="covidClick"></button></div>
    <div class="progress" style="width: 50%; margin-top: 10vh">
      <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${proggress}%" aria-valuenow="${proggress}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  </div>
  <div class="upgradesDiv"></div>  
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
  const upgradeButtons = document.querySelectorAll('.upgradeButton')

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
      const tableAsString = getMenuTableAsString(menu);
      upgradesTable.innerHTML += tableAsString;
    }

    function getMenuTableAsString(menu){
      const menuTableLines = getAllTableLines(menu)
      const menuTable = addLinesToTable(menuTableLines);
      return menuTable;
    }

    function addLinesToTable(tableLines){
      const menuTable = `
      <div class="position-absolute top-50 end-0 translate-middle">
      <div class="table-responsive pt-5">
      <table class="table custom-table">
        ${tableLines}
      </table>
      </div>
      </div>`;
      return menuTable;  
    }

    function getAllTableLines(menu){
      let upgradesLines='';

      menu?.forEach((upgrade) => {
        upgradesLines += `
        <tr>
          <td class="animate-upgrade">
          <button class="upgradeButton" data-id=${upgrade.id}>
          ${upgrade.title}
          cost: ${upgrade.cost}
          </button>
          </td>
        </tr>`;
      });

      return upgradesLines;
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