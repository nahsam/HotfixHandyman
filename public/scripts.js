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
        event.preventDefault();
        const formData = new FormData(jobRequestForm);
        fetch('/QuoteAPI', {
            method: 'POST',
            mode: 'cors',
            body: formData
        })
        .then(response => response.json)
        .then(ClearForm())
        .then(response => removeSpinner())
        .then(data => {alert('Job request submitted successfully!');})
        .catch(error => console.error('Error:', error)
        );
    });
});

function ClearForm() {
    console.log("attempt to clear form");
    document.getElementById('job-request-form').reset();
    console.log("Clear form done");
}



function addDashes(f){
    if(f.value.length == 10) f.value = f.value.slice(0,3)+"-"+f.value.slice(3,6)+"-"+f.value.slice(6,15);
}

const form = document.querySelector('job-request-form');

function enableBtn(){
   document.getElementById("submitbutton").disabled = false;
}

var loader = document.getElementById("loader");
function showSpinner() {
  loader.style.display = "block";
  loaderbg.style.display = "block";
}
function removeSpinner() {
  loader.style.display = "none";
  loaderbg.style.display = "none";
}
