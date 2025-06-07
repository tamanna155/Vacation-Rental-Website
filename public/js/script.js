(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})

let expandBtn=document.getElementById("nav-target");
    let navbar=document.getElementById("navbarNavAltMarkup");
    let searchBar=document.getElementById("search-box");
    expandBtn.addEventListener('click',()=>{
      if(expandBtn.getAttribute('aria-expanded')!= false){
        navbar.style.backgroundColor= '#adb5bd';
        searchBar.style.display= 'none';
      };
});