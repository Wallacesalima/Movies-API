// Função para formatar a data no formato brasileiro: de "2024-04-07" para "07/04/2024"
function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }
  
  // Função que cria e retorna um card (div) com as informações do filme
  function criarCardFilme(filme) {
    const card = document.createElement("div");
    card.classList.add("card");
  
    // Verifica se o filme tem imagem. Se não tiver, usa uma imagem padrão
    const imagem = filme.poster_path
      ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
      : "/frontEnd/assets/img/sem-foto.gif";
  
    // Se não tiver resumo, mostra um texto padrão
    const resumo = filme.overview || "Sem resumo disponível";
  
    // Formata a data se existir
    const dataFormatada = filme.release_date ? formatarData(filme.release_date) : "Data não disponível";
  
    // Monta o HTML interno do card
    card.innerHTML = `
      <img src="${imagem}" alt="${filme.title}">
      <h3>${filme.title}</h3>
      <span>Nota: ${filme.vote_average?.toFixed(2) || "N/A"}</span>
      <span>Data de lançamento: ${dataFormatada}</span>
      <p>${resumo}</p>
      <div class="trailer-container">Carregando trailer...</div>
    `;
  
    // Chama função que busca o trailer e coloca no card
    carregarTrailer(filme.id, card);
  
    return card;
  }
  
  // Função para buscar o trailer do filme e colocar no HTML
  function carregarTrailer(idFilme, card) {
    const urlTrailer = `https://movies-api-dlx6.onrender.com/api/trailer/${idFilme}`;
  
    fetch(urlTrailer)
      .then(res => res.json())
      .then(videoData => {
        const trailer = videoData.results.find(video =>
          video.type === "Trailer" && video.site === "YouTube"
        );
  
        const trailerContainer = card.querySelector(".trailer-container");
  
        if (trailer) {
          // Se encontrar trailer, mostra botão
          trailerContainer.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${trailer.key}" 
               target="_blank" 
               class="botao-trailer">🎬 Ver Trailer</a>`;
        } else {
          // Se não tiver trailer
          trailerContainer.innerHTML = `<a>Trailer não disponível.</a>`;
        }
      });
  }
  
  // Função que busca filmes com base na pesquisa do usuário
  function buscarFilme() {
    const query = document.getElementById("inputBusca").value.trim();
  
    if (!query) {
      alert("Digite o nome de um filme");
      return;
    }
  
    const urlBusca = `https://movies-api-dlx6.onrender.com/api/buscar?query=${encodeURIComponent(query)}`;
    const container = document.querySelector(".card-filmes");
    container.innerHTML = "Carregando...";
  
    fetch(urlBusca)
      .then(res => res.json())
      .then(dados => {
        container.innerHTML = ""; // Limpa os resultados anteriores
  
        if (!dados.results.length) {
          container.innerHTML = "<p>Nenhum filme encontrado.</p>";
          return;
        }
  
        // Para cada filme, cria e adiciona um card
        dados.results.forEach(filme => {
          if (filme.vote_average === 0.00) return; // Ignora filmes sem nota
          const card = criarCardFilme(filme);
          container.appendChild(card);
        });
      })
      .catch(erro => {
        console.error("Erro ao buscar filme:", erro);
        container.innerHTML = "<p>Erro ao buscar filme.</p>";
      });
  }
  
  // Função que carrega os filmes populares automaticamente
  function carregarFilmesPopulares() {
    const container = document.querySelector(".card-filmes");
  
    // Vai buscar em 10 páginas de resultados
    for (let i = 1; i <= 10; i++) {
      const url = `https://movies-api-dlx6.onrender.com/api/populares?page=${i}`;
  
      fetch(url)
        .then(res => res.json())
        .then(dados => {
          dados.results.forEach(filme => {
            // Só mostra se for popular o suficiente
            if (filme.popularity > 200.0) {
              const card = criarCardFilme(filme);
              container.appendChild(card);
            }
          });
        })
        .catch(erro => console.error("Erro ao buscar filmes populares:", erro));
    }
  }
  
  // Quando o site carregar, adiciona o evento de clique no botão de busca
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("botaoBusca").addEventListener("click", buscarFilme);
    carregarFilmesPopulares(); // Carrega os populares automaticamente
  });
  