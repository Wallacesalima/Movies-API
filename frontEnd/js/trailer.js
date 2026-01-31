// Função para buscar o trailer do filme e colocar no HTML
function carregarTrailer(idFilme, card) {

    carregarTrailerApi(idFilme).then(videoData => {
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
            trailerContainer.innerHTML = `<a class="sem_trailer" >Trailer não disponível.</a>`;
        }
    });
}