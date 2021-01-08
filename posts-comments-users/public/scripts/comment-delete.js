/*
- attach a listener to each button
- when the user clicks, we want to:
    - console.log()
    - send a fetch() request
- handle the response from the server
*/

//const deleteButtons = document.querySelectorAll('.delete-comment');
// pro-tip: use data attributes instead of class names
// so that your CSS person can customize the names without 
// messing up your JavaScript!
const deleteButtons = document.querySelectorAll('[data-comment-target]');
// console.log(deleteButtons);

// sendDelete: function we'll pass to addEventListener()
// It should expect to receive an event Object
// Helper function that receives an Event, sends a fetch() Request
function sendDelete(event) {
    // console.log() the ID of the Comment
    // we'll use that in the fetch Request
    //console.log('you rang?');
    //console.log(event.target);
    const button = event.target;
    const id = button.getAttribute('data-comment-target');
    console.log('id of comment to delete:',id);
    const url = `/comment/${id}`;
    // Promise chain for making request and handling response
    fetch(url, {
        method: 'delete'
    })
    .then(r => r.json()) // take the response, convert to JSON object
    .then(data => {
        console.log('HERE IS THE RESPONSE DATA');
        console.log(data.id);
        const comment = document.querySelector(`[data-comment-id="${data.id}"]`);
        console.log(comment);
        // In DOM programming, to delete an element
        // you have to ask its parent to delete the child.
        comment.parentElement.removeChild(comment);
    }) // take the JSON object, console.log(), delete the DOM element
    .catch(err => {
        // let the user know there was an error
        console.log('You got an error!!!');
        console.log(err);
    });

    // when it comes back, remove the comment
    // from the page
}

//deleteButtons[0].addEventListener('click', sendDelete);
deleteButtons.forEach(button => {
    button.addEventListener('click', sendDelete);
});