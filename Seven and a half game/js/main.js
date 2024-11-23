document.getElementById('playerForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const playerName = document.getElementById('name').value.trim();
    const initialMoney = document.getElementById('money').value.trim();
  
    if (playerName === '' || initialMoney === '' || Number(initialMoney) <= 0) {
      alert('Please enter a valid name and initial money!');
      return;
    }
  
    localStorage.setItem('playerName', playerName);
    localStorage.setItem('initialMoney', initialMoney);
  
    window.location.href = './game.html';
  });
  