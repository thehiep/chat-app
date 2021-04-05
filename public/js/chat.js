const socket = io();
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
socket.on('message', message => {
  console.log(message)
})
$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // disable
  $messageFormButton.setAttribute('disabled', 'disabled')
  const message = e.target.elements.message.value
  socket.emit('sendMessage', message, (error) => {
    // enable
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus();
    if (error) {
      return console.log(error)
    }
    console.log('The message was delivered')
  })
})

$locationButton.addEventListener('click', (e) => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }
  $locationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude
    }, () => {
      $locationButton.removeAttribute('disabled')
      console.log('Location shared')
    })
  })
})