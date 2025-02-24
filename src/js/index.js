const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const tbody = document.querySelector("tbody");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function fetchPokemonData(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar a API:", error);
  }
}

function flashHighlight(row) {
  // Salva a cor original do fundo (caso já tenha alguma)
  const originalBg = row.style.backgroundColor;
  // Altera para verde
  row.style.backgroundColor = "green";
  // Após 1 segundo, volta ao fundo original
  setTimeout(() => {
    row.style.backgroundColor = originalBg;
  }, 1000);
}

function displayPokemonData(data) {
  console.log(data);
  const types = data.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ');
  const abilities = data.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ');
  const moves = data.moves.slice(0, 4).map(move => capitalizeFirstLetter(move.move.name)).join(', ');
  
  tbody.innerHTML += `
    <tr data-pokemon-id="${data.id}">
      <td>${data.id}</td>
      <td>${capitalizeFirstLetter(data.name)}</td>
      <td>${types}</td>
      <td>${abilities}</td>
      <td>${moves}</td>
      <td>
        <img src="${data.sprites.front_default}" style="height: 45px;"/>
      </td>
    </tr>
  `;
}

searchBtn.addEventListener("click", async () => {
  const searchValue = searchInput.value.toLowerCase();
  try {
    const data = await fetchPokemonData(searchValue);
    if (!data) return;
    
    // Procura uma linha <tr> que já possua o Pokémon (através do atributo data-pokemon-id)
    const existingRow = tbody.querySelector(`tr[data-pokemon-id="${data.id}"]`);
    if (existingRow) {
      // Se a linha já existe, ela pisca em verde
      flashHighlight(existingRow);
    } else {
      // Caso não exista, adiciona uma nova linha com os dados do Pokémon
      displayPokemonData(data);
    }
  } catch (error) {
    console.error("Erro ao buscar a API:", error);
  }
});
