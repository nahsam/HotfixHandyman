// scripts.js
document.addEventListener("DOMContentLoaded", function() {
    let tabLinks = document.querySelectorAll('.tab-link');
    let tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            let tabId = this.getAttribute('data-tab');

            tabLinks.forEach(function(link) {
                link.classList.remove('current');
            });

            tabContents.forEach(function(content) {
                content.classList.remove('current');
            });

            document.getElementById(tabId).classList.add('current');
            this.classList.add('current');
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const jobRequestForm = document.getElementById('job-request-form');
    jobRequestForm.addEventListener('submit', function(event) {
        if (grecaptcha.getResponse().length() == 0) alert("Please check reCAPTHCA");
        else {
            event.preventDefault();
            const formData = new FormData(jobRequestForm);
            fetch('/QuoteAPI', {
                method: 'POST',
                mode: 'cors',
                body: formData
            })
            .then(response => response.json)
            .then(data => alert('Job request submitted successfully!'))
            .then(ClearForm())
            .catch(error => console.error('Error:', error)
            );
        }
    });
});

function ClearForm() {
    console.log("attempt to clear form");
    document.getElementById('job-request-form').reset();
    console.log("Clear form done");
}

// function onClick(e) {
//     e.preventDefault();
//         grecaptcha.enterprise.ready(async () => {
//           const token = await grecaptcha.enterprise.execute('6LfYgRIqAAAAAOrfBerFkNyyxzntGwMzEep8MWId', {action: 'submit'});
//         });
// }

function addDashes(f){
    alert(f.value)
    if(f.value.length == 10) f.value = f.value.slice(0,3)+"-"+f.value.slice(3,6)+"-"+f.value.slice(6,15);
}

// const form = docuent.querySelector('job-request-form');

// form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const captchaResponse = grecaptcha.response();

//     if(!captchaResponse.length > 0) alert("Please check reCAPTHCA");
// });