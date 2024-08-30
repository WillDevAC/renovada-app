const getReportDetails = async (reportId) => {
  try {
    const response = await fetch(
      "http://localhost/renovada-api/groups_list.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: reportId,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Erro:", data.message);
    } else {
      const participants = data.participants;

      $("#ultima").empty();

      participants.map((participant) => {
        $("#ultima").append(`
            <li>
              <div class="participant-card">
                <div class="avatar-profile" id="avatar-profile">
                  <i class="f7-icons">person</i>
                </div>
                <div class="participant-info">
                  <span class="participant-name">${participant.name}</span>
                  <span class="participant-email">${participant.email}</span>
                </div>
                <label class="checkbox-item">
                  <input type="checkbox" name="${participant.name}" value="${participant.id}" />
                </label>
              </div>
            </li>
          `);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do relatório:", error);
  }
};

const setReports = async (datauser) => {
  try {
    const response = await fetch(
      "http://localhost/renovada-api/set_relatory.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datauser),
      }
    );

    const data = await response.json();

    if (data.success) {
      app.dialog.alert("Relatório cadastrado com sucesso", "Sucesso");
      window.location.replace("http://169.254.182.11:5173/");
    }
  } catch (error) {
    app.dialog.alert("Falha ao cadastrar relatório", "Erro");
  }
};

const teste = app.views.main;
const rota_atual = teste.router.currentRoute;
const reportId = rota_atual.params.reportId;

getReportDetails(reportId);

$(document).on("click", "#cadastrar-btn", function () {
  const selectedParticipants = [];

  $('input[type="checkbox"]:checked').each(function () {
    selectedParticipants.push($(this).val());
  });

  const totalOfertas = $("#totalofertas").val();

  if (selectedParticipants.length === 0) {
    app.dialog.alert("Selecione pelo menos um participante", "Erro");
  } else if (totalOfertas === "") {
    app.dialog.alert("Preencha o total de ofertas", "Erro");
  } else {
    const { id } = JSON.parse(localStorage.getItem("@user"));

    const teste2 = app.views.main;
    const rota_atual2 = teste2.router.currentRoute;
    const reportId2 = rota_atual2.params.reportId;

    const dataToSend = {
      id_user: id,
      id_group: reportId2,
      participants: selectedParticipants,
      totalOfertas: totalOfertas,
    };
    setReports(dataToSend);
  }
});
