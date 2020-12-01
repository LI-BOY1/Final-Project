// Handlebars.registerHelper('if_eq', function(v1, v2, opts){
//     if(v1 == v2)
//     return opts.fn(this);
//     else
//     return opts.inverse(this);
// });
//to check the form is valid
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')
  
    // Loop over them and prevent submission
    Array.from(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()