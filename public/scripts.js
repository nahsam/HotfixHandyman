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
        .then(data => alert('Job request submitted successfully!'))
        .then(ClearForm())
        .catch(error => console.error('Error:', error)
        );
    });
});

function ClearForm() {
    console.log("attempt to clear form");
    document.getElementById('job-request-form').reset();
    console.log("Clear form done");
}


