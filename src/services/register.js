const REGISTER__ACTION = (name = "", email = "", password = "") => {
  if (name.length < 6) {
    app.dialog.alert("O nome deve ter pelo menos 6 caracteres.", "Erro");
    return;
  }

  if (password.length < 8) {
    app.dialog.alert("A senha deve ter pelo menos 8 caracteres.", "Erro");
    return;
  }

  app.preloader.show();
  fetch("http://localhost/renovada-api/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      app.preloader.hide();
      if (data.success) {
        localStorage.setItem("@user", JSON.stringify(data.user))
        app.views.main.router.navigate("/home", {
          reloadCurrent: true,
        });
      } else {
        app.dialog.alert(data.message, "Erro");
      }
    })
    .catch((error) => {
      app.preloader.hide();
      app.dialog.alert("Ocorreu um erro ao tentar registrar.", "Erro");
    });
};

$("#register_form").on("submit", function (e) {
  e.preventDefault();

  const formData = $("#register_form :input").serializeArray();

  const name = formData[0].value;
  const email = formData[1].value;
  const password = formData[2].value;

  REGISTER__ACTION(name, email, password);
});

$(document).ready(function () {
  const user = localStorage.getItem("@user");

  if (user) {
    app.views.main.router.navigate("/home", {
      reloadCurrent: true,
    });
  }
});
