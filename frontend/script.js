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
const spinner = document.getElementById("spinner");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Contact form handler (demo)
document.getElementById("contact-form").addEventListener("submit", async function(e){
  e.preventDefault(); //event handler to stop the browser’s default action for that event.
  display.style.display = "none" // changing one style 
  spinner.style.display = "block" // show spinner
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

   const submitted = "Data is submitted successfully"
    if(data.Msg === submitted ){
      this.reset();
       alert(`Thanks "${userFirstName[0]}" for your interest! I’ll contact you soon.`)
       // changing more than one style at once in Js
       Object.assign(display.style, {
         color: "#2196f3",
         display: "block"
       });
      display.innerHTML = data.Msg;  
    } else {
      Object.assign(display.style, {
         color: "red",
         display: "block"
       });
       display.innerHTML = `${data.Msg}`;  
    }

  }catch(err){
    console.error(err);
     Object.assign(display.style, {
         color: "red",
         display: "block"
       });
    display.innerHTML = "No internate or URL/API not found";
  }finally{
   spinner.style.display = "none" // hidden spinner
  }

});