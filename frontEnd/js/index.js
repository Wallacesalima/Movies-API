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

    // Formata a nota do filme para 2 casas decimais, ou "N/A" se não tiver nota
    const nota = filme.vote_average?.toFixed(2) || "N/A";

    // Se a nota for maior ou igual a 7, adiciona uma estrela ⭐, senão fica vazio
    const estrela = filme.vote_average >= 7 ? "⭐" : "";


    // Monta o HTML interno do card
    card.innerHTML = `
      <img src="${imagem}" alt="${filme.title}">
      <h3>${filme.title}</h3>
      <span>Nota: ${nota} ${estrela}</span>
      <span>Data de lançamento: ${dataFormatada}</span>
      <span>Popularidade: ${filme.popularity}</span>
      <p>${resumo}</p>
      <div class="trailer-container">Carregando trailer...</div>
    `;

    // Chama função que busca o trailer e coloca no card
    carregarTrailer(filme.id, card);

    return card;
}

const feedback = document.getElementById('feedback');


function mostrarFeedback(mensagem) {
    feedback.classList.remove('feedback_error', 'feedback_info'); 
    feedback.textContent = mensagem;
    feedback.classList.remove('hidden');
}
function mostrarLoading() {
    feedback.classList.remove('hidden');
    feedback.innerHTML = `
      <div class="container_gif">
        <img class="gif_carregando" src="frontEnd/assets/gifs/loader-9342.gif" alt="Carregando">
        <p>Buscando filme...</p>
      </div>
    `;
}

function esconderFeedback() {
    feedback.classList.add('hidden');
    feedback.classList.remove('feedback_error', 'feedback_info');
}


// Função que busca filmes com base na pesquisa do usuário
function buscarFilme() {
    const query = document.getElementById("inputBusca").value.trim();

    if (!query) {
        esconderFeedback()
        mostrarFeedback("🔍 Digite o nome de um filme para ver detalhes e trailers");
        return;
    }

    esconderFeedback()

    const container = document.querySelector(".card-filmes");

    container.innerHTML = ""; // Limpa os resultados anteriores
    mostrarLoading()

    buscarFilmeApi(query).then(dados => {
        esconderFeedback()

        if (!dados.results.length) {
            mostrarFeedback('Nenhum filme encontrado, digite um nome de filme valido.')
            feedback.classList.add('feedback_error')
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
        });
}

// Função que carrega os filmes populares automaticamente
function carregarFilmesPopulares() {
    const container = document.querySelector(".card-filmes");

    // Vai buscar em 5 páginas de resultados
    for (let i = 1; i <= 5; i++) {
        const url = `https://movies-api-dlx6.onrender.com/api/populares?page=${i}`;

        carregarFilmesPopularesApi(url).then(dados => {

            dados.results.forEach(filme => {
                // Só mostra se for popular o suficiente
                if (filme.popularity > 100.0 && filme.vote_average > 6) {

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

    mostrarFeedback('Digite um filme no campo acima e clique na "🔍" para busca-lo.')
    feedback.classList.add('feedback_info')

    document.getElementById("botaoBusca").addEventListener("click", buscarFilme);
    carregarFilmesPopulares(); // Carrega os populares automaticamente

    document.getElementById("inputBusca")
        .addEventListener("keydown", (event) => {
            if (event.key === "Enter") buscarFilme();
        });

    esconderFeedback()
});



