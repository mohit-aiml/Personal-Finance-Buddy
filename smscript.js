const smtoggleElement = document.querySelector('.floatingLogout');
const smtoggleBtn = document.querySelector('.smlogout');

smtoggleBtn.addEventListener('click', () => {
    smtoggleElement.classList.toggle('smhide');
});


// code developed by smalakar github: https://github.com/smalakargh

 const navbarLinks = document.querySelectorAll('.navbar a');

 navbarLinks.forEach(link => {
     link.addEventListener('click', (event) => {
         event.preventDefault();
         const targetId = link.getAttribute('href').substring(1); 
         const targetElement = document.getElementById(targetId);


         window.scrollTo({
             top: targetElement.offsetTop,
             behavior: 'smooth'
         });
     });
 });

 document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault(); 
      const target = document.querySelector(this.getAttribute('href')); 
      const offset = 120; 
      const topPosition = target.getBoundingClientRect().top + window.scrollY - offset;
  
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth' 
      });
    });
  });


//   ----------------

const navItems = document.querySelectorAll('nav ul a li');

// Add event listeners to each navbar item
navItems.forEach(item => {
  item.addEventListener('click', function () {
    // Remove 'active' class from all items
    navItems.forEach(i => i.classList.remove('active'));

    // Add 'active' class to the clicked item
    this.classList.add('active');
  });
});