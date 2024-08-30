const viewWordActionHighlited = (id = 1) => {
  app.views.main.router.navigate(`/view-word/${id}`);
};

const getResultsWordsByCategorie = async (id) => {
  app.dialog.preloader("Aguarde...");
  try {
    const response = await fetch(
      "http://localhost/renovada-api/get_word_individual.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );
    if (!response.ok) {
      app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
      return;
    }

    const data = await response.json();

    const SearchResults = $("#search-results-itens-words");
    SearchResults.empty();

    data.words.forEach((response) => {
      let thumbUrl = "images/thumb.webp";

      if (response.media) {
        const youtubeId = extractYouTubeID(response.media);
        thumbUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      }

      const listItem = `
          <li onClick="viewWordActionHighlited(${response.id})" >
                <a class="item-link">
                  <div class="item-content">
                    <div class="item-media">
                      <img
                        style="border-radius: 8px"
                        src=${thumbUrl}
                        width="70"
                      />
                    </div>
                    <div class="item-inner">
                      <div class="item-title-row">
                        <div class="item-title">${response.title}</div>
                      </div>
                      <div class="item-subtitle">${response.description}</div>
                      <div class="item-text">Dayse Costa</div>
                    </div>
                  </div>
                </a>
              </li>
        `;
      SearchResults.append(listItem);
    });
  } catch (error) {
    app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
  } finally {
    app.dialog.close();
  }
};

const getWordsCategories = async () => {
  app.dialog.preloader("Aguarde...");
  try {
    const response = await fetch(
      "http://localhost/renovada-api/get_word_categories.php"
    );
    if (!response.ok) {
      app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
      return;
    }

    const data = await response.json();

    const wordsCategories = $("#list-categories-words");
    wordsCategories.empty();

    wordsCategories.append(
      `<div class="word-categorie" onClick="getResultsWordsByCategorie('all')"><h1>Todos</h1></div>`
    );

    data.categories.forEach((categorie) => {
      const listItem = `
          <div class="word-categorie" onClick="getResultsWordsByCategorie(${categorie.id})">
              <h1>${categorie.name}</h1>
            </div>
        `;
      wordsCategories.append(listItem);
    });
  } catch (error) {
    app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
  } finally {
    app.dialog.close();
  }
};

const getHighlitedWords = async () => {
  app.dialog.preloader("Aguarde...");
  try {
    const response = await fetch(
      "http://localhost/renovada-api/get_word_highlited.php"
    );
    if (!response.ok) {
      app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
      return;
    }

    const data = await response.json();

    const wordsHighlited = $("#words-highlited-list");
    wordsHighlited.empty();

    data.words.forEach((word) => {
      let thumbUrl = "images/thumb.webp";

      if (word.media) {
        const youtubeId = extractYouTubeID(word.media);
        thumbUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      }
      const listItem = `
          <article class="words-highlited-card" onClick="viewWordActionHighlited(${word.id})">
              <div class="words-highlited-thumb">
                <img src=${thumbUrl} alt="Video Thumb" />
              </div>
              <div class="words-highlited-details">
                <h1>${word.title}</h1>
                  <span>${word.author_name}</span>
              </div>
            </article>
        `;
      wordsHighlited.append(listItem);
    });
  } catch (error) {
    app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
  } finally {
    app.dialog.close();
  }
};

const initialize = async () => {
  app.dialog.preloader("Aguarde...");
  try {
    await Promise.all([getHighlitedWords(), getWordsCategories()]);
    await getResultsWordsByCategorie("all");
  } catch (error) {
    app.dialog.alert("Parece que algo não ocorreu como esperado.", "Erro");
  } finally {
    app.dialog.close();
  }
};

initialize();
