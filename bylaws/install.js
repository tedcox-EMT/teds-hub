(function () {
  var wrap = document.getElementById("install");
  var btn = document.getElementById("install-btn");
  var help = document.getElementById("install-help");
  var status = document.getElementById("install-status");
  if (!wrap || !btn) return;

  var deferred = null;
  var ua = navigator.userAgent || "";
  var ios = /iPhone|iPad|iPod/i.test(ua);
  var android = /Android/i.test(ua);
  var standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  function iosHelp() {
    return "<ol><li>Open this page in Safari.</li><li>Tap the Share button.</li><li>Choose Add to Home Screen, then Add.</li></ol>";
  }
  function androidHelp() {
    return "<ol><li>Tap the three dots in the browser menu.</li><li>Tap Add to Home screen or Install app.</li><li>Tap Add.</li></ol>";
  }
  function genericHelp() {
    return "<ol><li>iPhone: Safari → Share → Add to Home Screen.</li><li>Android: menu → Add to Home screen.</li></ol>";
  }

  if (standalone) {
    wrap.innerHTML = '<div class="install-pill">Saved on this device</div>';
    return;
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferred = event;
    btn.textContent = "Add to Home Screen";
  });

  btn.addEventListener("click", function () {
    if (deferred && deferred.prompt) {
      deferred.prompt();
      deferred.userChoice.then(function (choice) {
        if (choice && choice.outcome === "accepted") {
          status.hidden = false;
          status.textContent = "Added to your Home Screen.";
          help.hidden = true;
        } else {
          help.hidden = false;
          help.innerHTML = android ? androidHelp() : genericHelp();
        }
      });
      return;
    }
    help.hidden = !help.hidden;
    help.innerHTML = ios ? iosHelp() : android ? androidHelp() : genericHelp();
  });
})();
