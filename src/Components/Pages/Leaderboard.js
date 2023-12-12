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
  const main = document.querySelector('main');
  const users = await getUsers();
  console.log(users);

  const text = `
  <div class="table-container">
  <table class="table">
   <thead>
     <tr>
       <th scope="col">#</th>
       <th scope="col">Pseudo</th>
       <th scope="col">score</th>
     </tr>
   </thead>
   <tbody>
   ${getAllTableLines()}
   </tbody>
  </table>
  </div>
  `;
  main.innerHTML = text;

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
};

export default Leaderboard;
