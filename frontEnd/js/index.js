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
        : "/frontEnd/img/sem-foto.gif";

    // Se não tiver resumo, mostra um texto padrão
    const resumo = filme.overview || "Sem resumo disponível";

    // Formata a data se existir
    const dataFormatada = filme.release_date ? formatarData(filme.release_date) : "Data não disponível";

    // Formata a nota do filme para 2 casas decimais, ou "N/A" se não tiver nota
    const nota = filme.vote_average?.toFixed(2) || "N/A";

    // Se a nota for maior ou igual a 7, adiciona uma estrela ⭐, senão fica vazio

    let quantidadeDeEstrelas = Math.ceil(filme.vote_average / 2)

    let estrela = '⭐'.repeat(quantidadeDeEstrelas)

    const quantVotos = filme.vote_count.toLocaleString('pt-BR')

    const GENRES = {
        28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia",
        80: "Crime", 99: "Documentário", 18: "Drama", 10751: "Família",
        14: "Fantasia", 36: "História", 27: "Terror", 10402: "Música",
        9648: "Mistério", 10749: "Romance", 878: "Ficção Científica",
        10770: "Cinema TV", 53: "Suspense", 10752: "Guerra", 37: "Faroeste"
    };

    const listaGeneros = filme.genre_ids.map(id => GENRES[id] || "Outro").join(", ");


    // Monta o HTML interno do card
    card.innerHTML = `
    <div class="info">
    <img src="${imagem}" alt="${filme.title}">
    <h3>${filme.title}</h3>
    <span class="nota">${nota} - ${estrela}</span>
    <span>${quantVotos} avaliações.</span>
    <span>Lançamento: ${dataFormatada}</span>
    <span>Popularidade: ${filme.popularity}</span>
    </div>
    <div class="trailer-container">Carregando trailer...</div>
    <div class="info-layer">
    <div class="generos"> 
    <h2>Gêneros </h2>
    <span>${listaGeneros}</span>
    </div>
    <p>${resumo}</p>
    </div>
    `;

    // Chama função que busca o trailer e coloca no card
    carregarTrailer(filme.id, card);

    return card;
}



const feedback = document.getElementById('feedback');

function criarIntroducao() {
    const introducao = document.querySelector(".introducao");

    const url = `https://movies-api-dlx6.onrender.com/api/populares?page=1`;

    carregarFilmesPopularesApi(url).then(dados => {
        const top3Filmes = dados.results.slice(0, 3)
        let htmlImagens = ''
        top3Filmes.forEach(filme => {
            const imagem = filme.poster_path
                ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                : "/frontEnd/img/sem-foto.gif";

            htmlImagens += `
            <img class="imagens_Top3" src="${imagem}" alt="${filme.title}">
            `

            introducao.innerHTML = `   
            <div class="container_gif_introducao shake efeito_vidro">
            <h2>EXPLORE FILMES</h2>
            <p> Faça uma busca ou selecione uma categoria para começar.
            <h2>TOP 3 populares</h2>
            <div class="container_Top3">
            ${htmlImagens}
            </div>
            </div>
            `
        })
    })
        .catch(erro => console.error("Erro ao buscar filmes populares:", erro));

}

function mostrarFeedback(mensagem) {
    limparIntroducao()
    feedback.textContent = mensagem;
    feedback.classList.remove('hidden');
}
function mostrarLoading() {
    limparIntroducao()
    feedback.classList.remove('feedback_error', 'feedback_info');
    feedback.classList.remove('hidden');
    feedback.innerHTML = `
    <div class="container_gif">
    <img class="gif_carregando" src="frontEnd/assets/gifs/loader-9342.gif" alt="Carregando">
    <p>Carregando filmes...</p>
    </div>
    `;
}

function esconderFeedback() {
    feedback.classList.add('hidden');
    feedback.classList.remove('feedback_error', 'feedback_info', 'feedback');
    feedback.textContent = ''
}

function limparContainer() {
    const container = document.querySelector(".card-filmes");
    container.innerHTML = ""
}

function limparIntroducao() {
    const introducao = document.querySelector(".introducao");
    introducao.classList.add('hidden')
    introducao.innerHTML = ""
}

// Função que busca filmes com base na pesquisa do usuário
function buscarFilme() {
    const container = document.querySelector(".card-filmes");
    const query = document.getElementById("inputBusca").value.trim();

    if (!query) {
        mostrarFeedback("🔍 Digite o nome de um filme para ver detalhes e trailers");
        feedback.classList.add('feedback_info')
        limparContainer()
        return;
    }

    esconderFeedback()
    limparContainer()
    mostrarLoading()

    buscarFilmeApi(query).then(dados => {
        esconderFeedback()

        if (!dados.results.length) {
            mostrarFeedback('Nenhum filme encontrado, digite um nome de filme valido.')
            feedback.classList.add('feedback_error')
            limparContainer()
            return;
        }

        // Para cada filme, cria e adiciona um card
        dados.results.forEach(filme => {
            if (filme.vote_average === 0.00) return; // Ignora filmes sem nota
            const card = criarCardFilme(filme);
            container.appendChild(card);
            limparIntroducao()
        });
    })
        .catch(erro => {
            console.error("Erro ao buscar filme:", erro);
        });
}

// Função que carrega os filmes populares automaticamente
function carregarFilmesPopulares() {
    const container = document.querySelector(".card-filmes");
    mostrarLoading()
    container.textContent = ''

    // Vai buscar em 5 páginas de resultados
    for (let i = 1; i <= 5; i++) {
        const url = `https://movies-api-dlx6.onrender.com/api/populares?page=${i}`;

        carregarFilmesPopularesApi(url).then(dados => {

            dados.results.forEach(filme => {
                // Só mostra se for popular o suficiente
                if (filme.popularity > 200.0) {
                    esconderFeedback()
                    const card = criarCardFilme(filme);
                    container.appendChild(card);
                }
            });
        })
            .catch(erro => console.error("Erro ao buscar filmes populares:", erro));
    }
}

function carregarFilmesMelhoresNotas() {
    const container = document.querySelector(".card-filmes");
    mostrarLoading()
    container.textContent = ''

    // Vai buscar em 5 páginas de resultados
    for (let i = 1; i <= 5; i++) {
        const url = `https://movies-api-dlx6.onrender.com/api/melhoresNotas?page=${i}`;


        carregarMelhoresNotasApi(url).then(dados => {

            dados.results.forEach(filme => {
                // Só mostra filmes com nota maior ou igual 8

                if (filme.vote_average >= 8.450 && filme.vote_count > 10000) {
                    esconderFeedback()
                    const card = criarCardFilme(filme);
                    container.appendChild(card);
                }
            });
        })
            .catch(erro => console.error("Erro ao buscar filmes populares:", erro));
    }
}

function carregarLancamentos() {
    const container = document.querySelector(".card-filmes");
    container.textContent = '';

    mostrarLoading();

    for (let i = 1; i <= 1; i++) {

        const url = `https://movies-api-dlx6.onrender.com/api/lancamentos?page=${i}`;


        carregarLancamentosApi(url).then(dados => {
            dados.results.forEach(filme => {
                const card = criarCardFilme(filme)
                container.appendChild(card)
                esconderFeedback()
            });
        })
            .catch(() => {
                mostrarFeedback("Erro ao carregar lançamentos");
                feedback.classList.add("feedback_error");
            });
    }
}
function carregarProximosFilmes() {
    const container = document.querySelector(".card-filmes");
    container.textContent = '';
    mostrarLoading();

    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é 0-11
    const ano = data.getFullYear();

    const dataAtual = `${ano}-${mes}-${dia}`;

    for (let i = 1; i <= 5; i++) {
        const url = `https://movies-api-dlx6.onrender.com/api/nextFilmes?page=${i}`;

        carregarProximosApi(url).then(dados => {
            dados.results.forEach(filme => {
                if (filme.release_date >= dataAtual && filme.popularity >= 10.0) {
                    const card = criarCardFilme(filme)
                    container.appendChild(card)
                }
                esconderFeedback()
            });
        })
            .catch(() => {
                mostrarFeedback("Erro ao carregar lançamentos futuros");
            });
    }
}
function removerAtivos() {
    document.querySelectorAll('.btns_nav_style').forEach(btn => {
        btn.classList.remove('btns_nav_style_active')
    })
}


criarIntroducao()
// Quando o site carregar, adiciona o evento de clique no botão de busca
document.addEventListener("DOMContentLoaded", () => {
    esconderFeedback()

    document.getElementById("botaoBusca").addEventListener("click", function () {
        buscarFilme()
        document.querySelector('.btns_nav_style_active').classList.remove('btns_nav_style_active')
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter")
            buscarFilme();
    });

    document.getElementById("populares").addEventListener('click', function () {
        limparIntroducao()
        removerAtivos()
        this.classList.add('btns_nav_style_active')
        carregarFilmesPopulares()
    })

    document.getElementById("melhores_notas").addEventListener('click', function () {
        limparIntroducao()
        removerAtivos()
        this.classList.add('btns_nav_style_active')

        carregarFilmesMelhoresNotas()
    })

    document.getElementById("lancamento").addEventListener('click', function () {
        removerAtivos()
        this.classList.add('btns_nav_style_active')
        carregarLancamentos()
    })

    document.getElementById("lancamento-futuros").addEventListener('click', function () {
        limparIntroducao()
        removerAtivos()
        this.classList.add('btns_nav_style_active')
        carregarProximosFilmes()
    })

});



