const pokeForm = document.forms['PokeForm'];
const pokemonDisplay = document.getElementById('PokemonDisplay');


pokeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (pokeForm['searchPokemon'].value) {
        loading();


        fetch(`https://tyradex.app/api/v1/pokemon/${pokeForm['searchPokemon'].value}`)
        .then(response => {
            if (!response.ok) {
                console.error(response);
                throw new Error(`le pokémon ${pokeForm['searchPokemon'].value} n'a pas été trouvé`)
            }
            return response.json();
        })
        .then(data => {
            if (data.status) {
                throw new Error(data.message ? data.message: 'pokémon non trouvé...');
            }

            // simulation de l'attente du serveur
            new Promise(resolve => {
                setTimeout(() => resolve(),1000);
            })
            .then(() => {

                changeContent(data)
            });
        })
        .catch(error => {
            changeContent({error});
        })
        .finally(
            pokemonDisplay.classList.remove('loading')
        )

        pokeForm.reset();
    }
    
})

function changeContent(data = null) {
    while(pokemonDisplay.lastChild){
        pokemonDisplay.removeChild(pokemonDisplay.lastChild);
    }

    if (data) {
        if(data.error) {
            const p = document.createElement('p');
            p.classList.add('erreur');
            p.textContent = data.error;

            pokemonDisplay.appendChild(p);
        }
        else {
            if (data.name) {
                const h2 = document.createElement('h2');
                h2.textContent = data.name.fr;

                pokemonDisplay.appendChild(h2);
            }

            if (data.sprites) {
                const img = document.createElement('img');
                img.src = data.sprites.regular;

                pokemonDisplay.appendChild(img);
            }
        }

    }
}

function loading() {
    let currentPokemonDisplay = document.createElement('div');
    while (pokemonDisplay.firstChild) {
        currentPokemonDisplay.appendChild(pokemonDisplay.firstChild);
    }
    currentPokemonDisplay.classList.add('loading');
    pokemonDisplay.appendChild(currentPokemonDisplay);

    let waitingMessage = document.createElement('p');
    waitingMessage.textContent = "Pokémon en cours de capture ..."
    pokemonDisplay.appendChild(waitingMessage);
}