// Smooth scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

// Mobile nav toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const display = document.getElementById("dataCheck");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Contact form handler (demo)
document.getElementById("contact-form").addEventListener("submit", async function(e){
  e.preventDefault(); //event handler to stop the browser’s default action for that event.
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const comment = document.getElementById("comment").value; 

  try {
    // collecting data from html input element
    const sendData = { name, email, comment }; // using ES6 shorthand object syntax.
    /*const url = "http://localhost:2000/sidejob"; // this url is for local database managment */
    const url = "https://portifolio-fullstack-with-mongodb-atlas.onrender.com/sidejob"; // this url is for cloud database managment
    const endpointObject = {
      method: "POST", 
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify(sendData) // making the data sitring
    };

    const res = await fetch(url, endpointObject);
    const data = await res.json(); //chaning data into Json format
    const userFirstName = sendData.name.match(/^[^\s]+/)

  alert(`Thanks "${userFirstName[0]}" for your interest! I’ll contact you soon.`);
  this.reset();
  display.style.color = "green";
  display.innerHTML = "Data is submitted succesfully";

  }catch(err){
    console.log(err);
    display.style.color = "red";
    display.innerHTML = "The data is not sent";
  }

});