const LOGIN__ACTION = (email = "", password = "") => {
  app.preloader.show();
  fetch("http://localhost/renovada-api/auth.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      app.preloader.hide();

      if (data.success) {
        localStorage.setItem("@user", JSON.stringify(data.user));
        app.views.main.router.navigate("/home", {
          reloadCurrent: true,
        });
      } else {
        app.dialog.alert("Senha ou usuário incorreto.", "Erro");
      }
      console.log(data);
    })
    .catch((error) => {
      app.dialog.preloader.hide();
      app.dialog.alert("Ocorreu um erro ao tentar fazer login.", "Erro");
    });
};

$("#login_form").on("submit", function (e) {
  e.preventDefault();

  const formData = $("#login_form :input").serializeArray();

  const email = formData[0].value;
  const password = formData[1].value;

  LOGIN__ACTION(email, password);
});

$(document).ready(function () {
  const user = localStorage.getItem("@user");

  if (user) {
    app.views.main.router.navigate("/home", {
      reloadCurrent: true,
    });
  }
});
