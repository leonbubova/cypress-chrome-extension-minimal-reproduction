console.log('Loaded chrome extension')

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    const element = document.getElementById('test-id')
    element.innerHTML = 'Now I have been modified!'
  }
}