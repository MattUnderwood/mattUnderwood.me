// Close hamburger dropdown menu when a menu link is clicked
var nav_menu = document.getElementById('nav-menu');
    var toggle = document.getElementById("toggle");

    nav_menu.addEventListener('click', handleMenuClick);

    function handleMenuClick(event) {
      if (event.target instanceof HTMLAnchorElement) {
        toggle.checked = false;
      }
    }
