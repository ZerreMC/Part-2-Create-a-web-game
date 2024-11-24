document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-button");
  
    playButton.addEventListener("click", () => {
      window.location.href = "./main.html";
    });
  });