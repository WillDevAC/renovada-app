const getRelatorys = async () => {
  const { id: userId } = JSON.parse(localStorage.getItem("@user"));

  const response = await fetch(
    `http://localhost/renovada-api/get_relatorys.php?user_id=${userId}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  const reports = data.reports;

  $("#groupsrelatorysteste").empty();

  if (reports.length === 0) {
    $("#groupsrelatorysteste").append(`
        <span class="no-reports-message">Nenhum relatório encontrado.</span>
    `);
  } else {
    reports.map((report) => {
      $("#groupsrelatorysteste").append(`
          <div class="group-relatory-item">
            <h1>${report.title}</h1>
          </div>
      `);
    });
  }
};

const deleteParticipant = (participantId, groupId) => {
  const { id: userId } = JSON.parse(localStorage.getItem("@user"));

  if (userId === participantId) {
    app.dialog.alert(`Você não pode excluir você mesmo.`);
    return;
  }

  app.dialog.confirm(
    "Deseja realmente excluir este participante?",
    async function () {
      try {
        const response = await fetch(
          "http://localhost/renovada-api/groups_list.php",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              group_id: groupId,
              participant_id: participantId,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          app.dialog.alert("Participante excluído com sucesso");
          getGroupById(groupId);
        } else {
          app.dialog.alert(`Erro: ${result.message}`);
        }
      } catch (error) {
        app.dialog.alert("Erro na requisição: " + error.message);
      }
    }
  );
};

const getGroupById = async (groupId) => {
  $("#relatory_button").empty();

  $("#relatory_button").append(
    `<a href="/create-report/${groupId}"><button class="button button-fill button-raised col">Novo relatorio</button></a>`
  );

  try {
    const response = await fetch(
      "http://localhost/renovada-api/groups_list.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: groupId,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Erro:", data.message);
    } else {
      const participants = data.participants;

      const translateRole = (role) => {
        switch (role) {
          case "leader":
            return "Líder de célula";
          case "normal":
            return "Normal";
          default:
            return "Desconhecido";
        }
      };

      $("#users_group").empty();

      participants.map((participant) => {
        $("#users_group").append(`
            <div class="user-group-item">
                <div class="user-group-item-details">
                <div class="avatar-profile" id="avatar-profile">
                    <i class="f7-icons">person</i>
                </div>
                <div class="user-group-item-group">
                    <h1>${participant.name}</h1>
                    <div class="badgeslistgroup">
                    <span class="badge color-teal">${participant.email}</span>
                    <span class="badge color-gray">${translateRole(
                      participant.role
                    )}</span>
                    </div>
                </div>
                </div>
            <div class="user-group-item-icon" onclick="deleteParticipant(${
              participant.id
            }, ${groupId})">
             <i class="f7-icons">trash</i>
                </div>
            </div>
        `);
      });
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};

const mainView = app.views.main;
const currentRoute = mainView.router.currentRoute;
const groupId = currentRoute.params.groupId;

getGroupById(groupId);
getRelatorys();
