const redirectGroupAdmin = (groupId) => {
  app.views.main.router.navigate(`/group-managment/${groupId}`);
}


const getUserCellules = async () => {
  app.preloader.show();

  const { id: userId } = JSON.parse(localStorage.getItem("@user"));

  try {
    const response = await fetch(
      "http://localhost/renovada-api/groups_list.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      $("#groups-list").html(`
        <div class="profile-container-cellule-wrapper">
          <div class="celule-info">
            <h1>Junte-se a renovada</h1>
            <span>Você não está em nenhuma célula</span>
          </div>
          <i class="f7-icons">person_3_fill</i>
        </div>`);
    } else {
      $("#groups-list").empty();

      data.groups.forEach((group) => {
        const groupName = group.group.name;
        const groupDate = group.group.date;
        const groupId = group.group.id;
        const isLeader = group.isLeader;

        $("#groups-list").append(`
            <div class="profile-container-cellule-wrapper">
                <div class="celule-info">
                    <h1>${groupName}</h1>
                    <span>${groupDate}</span>
                    ${
                      isLeader
                        ? `<div class="celule-admin"><button class="button button-outline button-raised col" onclick="redirectGroupAdmin(${groupId})">Gerenciar</button></div>`
                        : ""
                    }
                </div>
                <i class="f7-icons">person_3_fill</i>
            </div>
        `);
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    app.preloader.hide();
  }
};

const setUserDetails = () => {
  const { name, email } = JSON.parse(localStorage.getItem("@user"));

  $("#name_user").text(name);
  $("#email_user").text(email);
};

setUserDetails();
getUserCellules();
