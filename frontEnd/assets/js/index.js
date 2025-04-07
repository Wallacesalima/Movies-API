function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

function buscarFilme() {
    const query = document.getElementById("inputBusca").value;

    if (!query) {
        alert("Digite o nome de um filme");
        return;
    }

    const urlBusca = `https://movies-api-dlx6.onrender.com/api/buscar?query=${encodeURIComponent(query)}`;



    fetch(urlBusca)
        .then(res => res.json())
        .then(dados => {
            const container = document.querySelector(".card-filmes");
            container.innerHTML = ""; // limpa os cards anteriores

            if (dados.results.length === 0) {
                container.innerHTML = "<p>Nenhum filme encontrado.</p>";
                return;
            }

            dados.results.forEach(filme => {
                const card = document.createElement("div");
                card.classList.add("card");

                const imagem = filme.poster_path
                    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                    : "/assets/img/sem imagem - icon.png";

                const resumo = filme.overview || "Sem resumo disponível";
                const dataFormatada = filme.release_date ? formatarData(filme.release_date) : "Data não disponível";

                card.innerHTML = `
                    <img src="${imagem}" alt="${filme.title}">
                    <h3>${filme.title}</h3>
                    <span>Nota: ${filme.vote_average?.toFixed(2) || "N/A"}</span>
                    <span>Data de lançamento: ${dataFormatada}</span>
                    <p>${resumo}</p>
                    <div class="trailer-container">Carregando trailer...</div>
                `;
                const urlTrailer = `https://movies-api-dlx6.onrender.com/api/trailer/${filme.id}`;


                fetch(urlTrailer)
                    .then(res => res.json())
                    .then(videoData => {
                        const trailer = videoData.results.find(video =>
                            video.type === "Trailer" && video.site === "YouTube"
                        );

                        const trailerContainer = card.querySelector(".trailer-container");

                        if (trailer) {
                            trailerContainer.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${trailer.key}" 
           target="_blank" 
           class="botao-trailer">🎬 Ver Trailer</a>
      `;
                        } else {
                            trailerContainer.innerHTML = `<a>Trailer não disponível.</a>`;
                        }
                    });
                if (filme.vote_average === 0.00) return;
                container.appendChild(card);
            });
        })
        .catch(erro => console.error("Erro ao buscar filme:", erro));
}

// Carregar filmes populares
for (let i = 1; i <= 10; i++) {
    const url = `https://movies-api-dlx6.onrender.com/api/populares?page=${i}`;

    fetch(url)
        .then(resposta => resposta.json())
        .then(dados => {
            const cards = document.querySelector(".card-filmes");
            dados.results.forEach(filme => {
                const card = document.createElement("div");
                card.classList.add("card");

                const imagem = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                const resumo = filme.overview || 'não existe resumo';
                const dataFormatada = filme.release_date ? formatarData(filme.release_date) : "Data não disponível";

                console.log(imagem === null )

                card.innerHTML = `
                    <img src="${imagem}" alt="${filme.title}">
                    <h3>${filme.title}</h3>
                    <span>Nota: ${(filme.vote_average).toFixed(2)}</span>
                    <span>Data de lançamento: ${dataFormatada}</span>
                    <span>Popularidade: ${filme.popularity}</span>
                    <p>${resumo}</p>
                    <div class="trailer-container">Carregando trailer...</div>
                `;

                const urlTrailer = `https://movies-api-dlx6.onrender.com/api/trailer/${filme.id}`;


                fetch(urlTrailer)
                    .then(res => res.json())
                    .then(videoData => {
                        const trailer = videoData.results.find(video =>
                            video.type === "Trailer" && video.site === "YouTube"
                        );

                        const trailerContainer = card.querySelector(".trailer-container");

                        if (trailer) {
                            trailerContainer.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${trailer.key}" 
           target="_blank" 
           class="botao-trailer">🎬 Ver Trailer</a>
      `;
                        } else {
                            trailerContainer.innerHTML = `<a>Trailer não disponível.</a>`;
                        }
                    });

                if (filme.popularity > 200.0) {
                    cards.appendChild(card);
                }

            });
        })
        .catch(erro => console.error("Erro ao buscar filmes:", erro));
}

// Adiciona evento ao botão depois que a página carregar
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("botaoBusca").addEventListener("click", buscarFilme);
});

