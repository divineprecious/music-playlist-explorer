document.addEventListener("DOMContentLoaded", () => 
    {
        const playlistCards = document.getElementById("playlist-cards")
        const modal = document.getElementById("playlist-modal")
        const modalClose = document.querySelector('.close');
        const modalImage = document.querySelector(".playlist-content img");
        const playlistName = document.getElementById("playlistName");
        const creatorName = document.getElementById("creatorName");
        const songList = document.querySelector(".song-list");
        let list;


        //Fetch Data
        fetch("data/data.json")
          .then(response => {
            if (!response.ok) {
                throw new Error("Network error: " + response.status)
            }
            return response.json();
          })
          .then(data => {
                //Build playlists
                data.playlists.forEach(createPlaylistCard);

                //Store playlist data in array
                list = data.playlists;
            })
          .catch(err => {
            console.error("Failed to load playlists:", err);
          });
        //Create each playlist card
        function createPlaylistCard(pl){
            const card = document.createElement("div");
            card.className = "playlist-card";
            card.innerHTML = `
                <img src= "${pl.playlist_art}" alt="${pl.playlist_name}">
                <h3>${pl.playlist_name}</h3>
                <p>By ${pl.playlist_author}</p>
                <div class="like-row">
                    <button class="heart-button">♡</button>
                    <span class="like-count">${pl.like_count}</span>
                </div>
            `;

            card.addEventListener("click", (e) => {
                if (!e.target.classList.contains("heart-button")) {
                    document.body.style.overflow = "hidden";
                    openModal(pl);
                }
            })

            const like = card.querySelector(".heart-button");
            const count = card.querySelector(".like-count");

            like.addEventListener("click", (e) => {
                if (like.classList.contains("liked")) {
                    like.classList.remove("liked");
                    like.textContent = "♡"
                    pl.like_count = --pl.like_count;
                    count.textContent = pl.like_count;

                } else {
                    like.classList.toggle("liked");
                    like.textContent = "♥";
                    pl.like_count = ++pl.like_count;
                    count.textContent = pl.like_count;
                }
            });

            playlistCards.appendChild(card)
        }



        function openModal(pl) {
            modalImage.src = pl.playlist_art;
            playlistName.textContent = pl.playlist_name;
            creatorName.textContent = pl.playlist_author;
            songList.innerHTML = "";

            pl.songs.forEach(song => {
                const songDiv = document.createElement("div");
                songDiv.className = "song";
                songDiv.innerHTML = `
                    <img src="${song.cover_art}" alt="${song.title}">
                    <div class="song-info">
                        <h2>${song.title}</h2>
                        <h3>${song.artist}</h3>
                        <h3>${song.album}</h3>
                    </div>
                    <p class="song-duration">${song.duration}</p>
                `;
                songList.append(songDiv);
            })
            modal.style.display = "block";

            const shuffle = document.querySelector(".shuffle-button");
            shuffle.addEventListener("click", () => {
                songList.innerHTML = "";
                let playlist = []
                pl.songs.forEach(song => {
                    playlist.push(song);
                })
                shuffleArray(playlist)
                console.log(playlist);

                for (song of playlist) {
                    const songDiv = document.createElement("div");
                    songDiv.className = "song";
                    songDiv.innerHTML = `
                    <img src="${song.cover_art}" alt="${song.title}">
                    <div class="song-info">
                        <h2>${song.title}</h2>
                        <h3>${song.artist}</h3>
                        <h3>${song.album}</h3>
                    </div>
                    <p class="song-duration">${song.duration}</p>
                `;
                songList.append(songDiv);
                }
            })

        }

        modalClose.addEventListener("click", (e) => {
            modal.style.display = "none";
            document.body.style.overflow = "";
        });

        window.addEventListener("click", (e) => {
            if (e.target === modal)
                {
                    modal.style.display = "none";
                    document.body.style.overflow = "";
                }
        })


        

        //Search Bar Functionality
        clearButton = document.getElementById("clearBtn");
        searchField = document.getElementById("search");
        searchButton = document.getElementById("searchBtn")

        //Clear current search
        clearButton.addEventListener("click", () => {
            searchField.value = "";
            playlistCards.innerHTML = '';
            list.forEach(createPlaylistCard);
        })


        //Search with enter key and filter page
        searchField.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                let res = [];
                let query = searchField.value.toLowerCase();
                for (let i = 0; i < list.length; i++) {
                    let name = list[i].playlist_name.toLowerCase();
                    let creator = list[i].playlist_author.toLowerCase();
                    console.log(name);

                    if (name.includes(query) || creator.includes(query)) {
                        res.push(list[i]);
                    }
                }
                playlistCards.innerHTML = '';
                res.forEach(createPlaylistCard);
            }

            if (e.key === "Backspace" && searchField.value.length == 1){
                playlistCards.innerHTML = '';
                list.forEach(createPlaylistCard);
            }

        })


        //Search for playlist results and filter page
        searchButton.addEventListener("click", () => {  
            let res = [];
            let query = searchField.value.toLowerCase();
            for (let i = 0; i < list.length; i++) {
                let name = list[i].playlist_name.toLowerCase();
                let creator = list[i].playlist_author.toLowerCase();
                console.log(name);

                if (name.includes(query) || creator.includes(query)) {
                    res.push(list[i]);
                }
            }
            playlistCards.innerHTML = '';
            res.forEach(createPlaylistCard);
        })
        
    });


// Fisher-Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}


