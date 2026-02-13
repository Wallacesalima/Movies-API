const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontEnd')));


const API_KEY = process.env.API_KEY;


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}
    `);
    
  });
  
  // 🔥 Filmes populares
  app.get("/api/populares", async (req, res) => {
    const page = req.query.page || 1;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filmes populares" });
  }
});

// 🔍 Buscar filmes
app.get("/api/buscar", async (req, res) => {
  const query = req.query.query;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filme" });
  }
});

// 🎬 Trailer
app.get("/api/trailer/:id", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${API_KEY}&language=pt-BR`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar trailer" });
  }
});


app.get("/api/melhoresNotas", async (req, res) => {
  const page = req.query.page || 1;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filmes com as melhores notas" });
  }
});

app.get("/api/lancamentos", async (req, res) => {
  const page = req.query.page || 1;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filmes em lançamento" });
  }
});

app.get("/api/nextFilmes", async (req, res) => {
  const page = req.query.page || 1;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filmes que seram lançados" });
  }
});

app.get("/api/generos", async (req, res) => {
  const page = req.query.page || 1;
  
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR&page=${page}`
    );
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar generos de filmes" });
  }
});
