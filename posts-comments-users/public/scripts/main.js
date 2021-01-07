// Add a link in the HTMLso that you can show/hide the post's content
// Add an event listener that listens for clicks on all the links
const links = document.querySelectorAll('.toggler');
links.forEach(l => {
    l.addEventListener('click', (e) => {
        console.log('you clicked!');
        e.preventDefault(); // don't jump; don't go to another page
                
        // When one occurs, then hide the post.
        const target = l.getAttribute('data-target');
        console.log(target);
        const el = document.getElementById(target);
        // if it is hidden, show it
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
        // else, hide it
    });
});
