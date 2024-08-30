const getFirstLetter = (name) => {
  if (typeof name === "string" && name.length > 0) {
    return name.charAt(0);
  }
  return "";
};

const getYouTubeVideoID = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

function shareWordBack(videoURL) {
  if (navigator.share) {
    navigator.share({
      title: "Nova palavra - Igreja Renovada",
      text: "Confira essa nova palavra que estou compartilhando.",
      url: videoURL,
    });
  }
}

const routerBackViewWord = () => {
  app.views.main.router.back();
};

const getWordById = async (id) => {
  app.dialog.preloader("Aguarde...");

  try {
    const response = await fetch(
      `http://localhost/renovada-api/get_word.php?id=${id}`
    );

    if (!response.ok) {
      app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
    }

    const data = await response.json();

    const wordItem = $("#page-content");
    wordItem.empty();

    const videoID = getYouTubeVideoID(data.media);
    const firstLetter = getFirstLetter(data.author_name);

    const itemWord = `
        <div class="plyr__video-embed" id="player">
        <iframe
          src="https://www.youtube.com/embed/${videoID}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
          allowfullscreen
          allowtransparency
        ></iframe>
        <div class="navbar-back-header">
          <i class="f7-icons" id="navbar-back-icon" onClick="routerBackViewWord()">arrow_left</i>
        </div>
      </div>
      <div class="word-video-details">
        <div class="word-video-details-top">
          <div class="word-video-details-desc">
            <h1>${data.title}</h1>
            <span>${data.description}</span>
          </div>
          <div class="word-video-details-profile">${firstLetter}</div>
        </div>
        <div class="btn-word" onClick="shareWordBack(${data.media})">
          <button class="button button-outline col">Compartilhar</button>
        </div>
      </div>
    `;

    wordItem.append(itemWord);
  } catch (error) {
    console.error("Error fetching the feed:", error);
  } finally {
    new Plyr("#player");
    app.dialog.close();
  }
};

const mainviewword5 = app.views.main;
const currentRoute = mainviewword5.router.currentRoute;
const wordid23 = currentRoute.params.wordId;

getWordById(wordid23);
