import anime from 'animejs/lib/anime.es';
import covidRed from '../../img/virus-rouge.png';
import Navigate from '../Router/Navigate';

const HomePage = () => {
  const main = document.querySelector('main');
  const body = document.querySelector('body');
 
  body.style.overflow = 'hidden';

 
  const text = ` 
  <div class="covidContainer"></div>
  <div class="homePageContainer">
    <h1 class="title fontRubikBubbles" >Covid Clicker</h1>
    <div>
      <button class="play"></button> 
    </div>
  </div>
  `;
  main.innerHTML = text;

  const covidContainer = document.querySelector('.covidContainer');
  const playButton = document.querySelector('.play');
  createCovidIcons();
  playButton.addEventListener('click', gamePage);
  playButton.addEventListener('mouseenter', () => {
    anime({
      targets: playButton,
      scale: 1.2,
      easing: 'easeOutQuart'
    })
  });
  playButton.addEventListener('mouseleave', () => {
    anime({
      targets: playButton,
      scale: 1,
    })
  });

  function gamePage(){
    Navigate('/game');
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
    const hue = Math.floor(Math.random() * 360);
    newImg.style.filter = `hue-rotate(${hue}deg)`;
    newImg.classList.add("covidIcon");
    covidContainer.appendChild(newImg);

    anime({
      targets: newImg,
      translateY: '90vh',
      easing: 'linear',
      loop: true,
      duration: anime.random(1500, 7000),
      scale: anime.random(3, 10),
      opacity: 0
    });


  }
}
export default HomePage;