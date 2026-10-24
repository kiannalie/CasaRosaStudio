// Contact form: tell FormSubmit to send visitors to our thank-you page
// after their message goes through (works on any domain the site is on).
(function () {
  var next = document.getElementById("form-next");
  if (next) next.value = new URL("thank-you.html", window.location.href).href;
})();
