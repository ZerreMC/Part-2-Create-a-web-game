// Asegúrate de que el DOM esté cargado antes de agregar eventos
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona el formulario
  const form = document.getElementById("playerForm");

  // Agrega el evento submit al formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const playerName = document.getElementById("name").value.trim();
    const initialMoney = document.getElementById("money").value.trim();

    if (playerName === "" || initialMoney === "" || Number(initialMoney) <= 0) {
      alert("Please enter a valid name and initial money!");
      return;
    }

    localStorage.setItem("playerName", playerName);
    localStorage.setItem("initialMoney", initialMoney);

    window.location.href = "./game.html";
  });
});
