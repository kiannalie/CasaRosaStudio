// Contact form.
// If the form has an action URL (e.g. Formspree), it posts there.
// If not, it opens the visitor's email app with the message filled in.
(function () {
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = (data.get("first_name") + " " + data.get("last_name")).trim();
    var action = form.getAttribute("action");

    if (!action) {
      var subject = "Message from " + name;
      var body = data.get("message") + "\n\n" + name + "\n" + data.get("email");
      window.location.href =
        "mailto:" + form.dataset.email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      return;
    }

    note.textContent = "Sending…";
    fetch(action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error();
        form.reset();
        note.textContent = "Thank you — your message has been sent.";
      })
      .catch(function () {
        note.textContent = "Sorry, something went wrong. Please try again.";
      });
  });
})();
