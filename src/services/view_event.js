const routerBackViewEvent = () => {
  app.views.main.router.back();
};

const confirmDialog = (idEvent) => {
  const { id } = JSON.parse(localStorage.getItem("@user"));

  app.dialog.confirm(
    "Deseja realmente participar desse evento?",
    async function () {
      const response = await fetch(
        "http://localhost/renovada-api/confirm_presence_event.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: idEvent,
            userId: id,
          }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        app.dialog.alert("Você já confirmou sua presença.");
      } else {
        getEventById(idEvent);
        app.dialog.alert(
          "Evento confirmado com sucesso!",
          "Te aguardamos ansiosamente :)"
        );
      }
    }
  );
};

const getEventById = async (idEvent) => {
  app.dialog.preloader("Aguarde...");

  const { id } = JSON.parse(localStorage.getItem("@user"));

  try {
    const response = await fetch(
      `http://localhost/renovada-api/get_event_individual.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: idEvent, userId: id }),
      }
    );

    if (!response.ok) {
      app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
      return;
    }

    const eventItem = $("#page-content-event");
    eventItem.empty();

    const data = await response.json();

    const formatCurrency = (value) => {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };

    const priceInfo =
      data.event.price === "0"
        ? "GRATUITO"
        : `R$ ${formatCurrency(data.event.price)}`;

    const itemEvent = `
      <div class="navbar-back-header" id="backheaderevent">
        <i class="f7-icons" id="navbar-back-icon" onclick="routerBackViewEvent()">arrow_left</i>
      </div>
      <div class="view-event-media">
        <img
          src=${data.event.media}
          alt="Imagem evento"
        />
      </div>
      <div class="view-event-details">
        <div class="view-event-details-title">
          <h1>${data.event.title}</h1>
          <span>${data.event.description}</span>
        </div>
        <div class="event-details-info">
          <div class="event-details-icon">
            <i class="f7-icons">map</i>
            <span>${data.event.address}</span>
          </div>
          <div class="event-details-icon">
            <i class="f7-icons">calendar</i>
            <span>${data.event.date}</span>
          </div>
          <div class="event-details-icon">
            <i class="f7-icons">money_dollar</i>
            <span>${priceInfo}</span>
          </div>
        </div>
      </div>
      ${
        data.event.isSubscripted && data.event.isParticipant !== 1
          ? `
        <div class="view-event-action">
          <button class="button button-fill col" onclick="confirmDialog(${data.event.id})">PARTICIPAR</button>
        </div>
      `
          : ""
      }
    `;
    eventItem.append(itemEvent);

    if (data.event.isSubscripted && data.event.isParticipant === 1) {
      new QRCode(document.getElementById("qrcodebar"), data.event.qrcode);
    }
  } catch (error) {
    app.dialog.alert("Ocorreu um erro durante a requisição.", "Erro");
    console.error(error);
  } finally {
    app.dialog.close();
  }
};

const teste3 = app.views.main;
const currentRoute = teste3.router.currentRoute;
const teste3id = currentRoute.params.eventId;

getEventById(teste3id);
