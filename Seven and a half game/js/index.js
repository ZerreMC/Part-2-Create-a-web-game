document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-button");
  
    playButton.addEventListener("click", () => {
      window.location.href = "./main.html";
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("rules-button");
  playButton.addEventListener("click", () => {
    window.location.href = "./rules.html";
  });
});