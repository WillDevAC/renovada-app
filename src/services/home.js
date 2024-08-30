let selectedScheduleId = null;

const GetParticipateUser = async () => {
  try {
    const { id } = JSON.parse(localStorage.getItem("@user"));

    if (selectedScheduleId) {
      const response = await fetch(
        "http://localhost/renovada-api/confirm_presence_schedule.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ScheduleId: selectedScheduleId,
            UserId: id,
          }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        app.dialog.alert("Você já confirmou sua presença.");
      } else {
        getAllFeed();
        app.dialog.alert(
          "Presença confirmada.",
          "Te aguardamos ansiosamente :)"
        );
      }
    }
  } catch (error) {
    console.error("Error confirming participation:", error);
    app.dialog.alert("Ocorreu um erro ao confirmar a presença.", "Erro");
  }
};

const viewWordAction = (id = 1) => {
  app.views.main.router.navigate(`/view-word/${id}`);
};

const eventDetails = (id = 1) => {
  app.views.main.router.navigate(`/view-event/${id}`);
};

const extractYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length == 11 ? match[2] : null;
};

let actions1;

const openDemo1 = (id) => {
  selectedScheduleId = id;
  actions1.open();
};

const buttons1 = [
  {
    text: "PARTICIPAR",
    strong: true,
    onClick: () => {
      GetParticipateUser();
    },
  },
  {
    text: "Fechar",
    color: "red",
  },
];

actions1 = app.actions.create({ buttons: buttons1 });

const getAllFeed = async () => {
  app.dialog.preloader("Aguarde...");
  try {
    const response = await fetch("http://localhost/renovada-api/feed.php");
    if (!response.ok) {
      throw new Error("Erro na resposta da API");
    }
    const data = await response.json();

    if (!data.words || !data.schedule) {
      throw new Error("Dados incompletos recebidos");
    }

    const wordsList = $("#words-list");
    wordsList.empty();

    data.words.forEach((word) => {
      let thumbUrl = "images/thumb.webp";

      if (word.media) {
        const youtubeId = extractYouTubeID(word.media);
        thumbUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      }
      const listItem = `
        <article class="words-card" onClick="viewWordAction(${word.id})">
            <div class="words-card-thumb">
                <img src=${thumbUrl} alt="Video Thumb" />
            </div>
            <div class="words-card-details">
                <h1>${word.title}</h1>
                <span>${word.author_name}</span>
            </div>
        </article>
      `;

      wordsList.append(listItem);
    });

    const scheduleList = $("#schedule-list");
    scheduleList.empty();

    data.schedule.forEach((scheduleItem) => {
      const [day, dayOfWeek] = scheduleItem.date_formated.split(" ");

      const listSchedules = `
        <div>
          <div class="schedule-list-item">
            <div class="schedule-list-item-date">
              <h1>${day}</h1>
              <span>${dayOfWeek}</span>
            </div>
            <div class="schedule-list-item-info">
              <h1>${scheduleItem.title}</h1>
              <span>${scheduleItem.date_complete}</span>
              <div class="avatars">
                <div class="avatar" style="background-image: url('images/gravatar.png')"></div>
                <div class="avatar" style="background-image: url('images/gravatar.png')"></div>
                <div class="avatar" style="background-image: url('images/gravatar.png')"></div>

                <div class="avatar more">+${scheduleItem.participants}</div>
              </div>
              <div class="btn-action-schedule" onClick="openDemo1(${scheduleItem.id})">
                <i class="f7-icons">ellipsis_vertical</i>
              </div>
            </div>
          </div>
        </div>
      `;

      scheduleList.append(listSchedules);
    });

    const eventsList = $("#events-list");
    eventsList.empty();

    data.events.forEach((eventItem) => {
      const listEvents = `
        <div class="event-list-card">
          <div class="event-list-profile">
            <div class="event-list-author">
              <i class="f7-icons">ticket</i>
            </div>
            <h1>Igreja Renovada</h1>
          </div>
          <div class="event-address">
            <span
              >${eventItem.address}</span
            >
          </div>
          <div class="event-card-title">
            <h1>${eventItem.title}</h1>
          </div>
          <div class="event-card-actions" onClick="eventDetails(${eventItem.id})">
            <button class="button button-round button-fill col">
              DETALHES
            </button>
          </div>
        </div>
      `;
      eventsList.append(listEvents);
    });
  } catch (error) {
    console.error("Error fetching the feed:", error);
    app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
  } finally {
    app.dialog.close();
  }
};

getAllFeed();
