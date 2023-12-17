import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Leaderboard from '../Pages/Leaderboard'
import PrivacyPolicy from '../Pages/PrivacyPolicy'

const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/leaderboard': Leaderboard,
  '/login': Login,
  '/register': Register,
  '/privayPolicy': PrivacyPolicy
};

export default routes;
