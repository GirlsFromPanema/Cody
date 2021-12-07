$(document).ready(function () {
  var array = ['greatest', 'prime', 'top', 'finest'], // Landing Page changing Text (highlighted)
    s = 0
  setInterval(function () {
    $('h1 span').fadeOut(function () {
      $('h1 span').html(array[s]),
        $('h1 span').fadeIn(),
        ++s >= array.length && (s = 0)
    })
  }, 5000)

  $(document).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault(),
      $('html, body').animate(
        { scrollTop: $($.attr(this, 'href')).offset().top },
        500
      )
  })
})
