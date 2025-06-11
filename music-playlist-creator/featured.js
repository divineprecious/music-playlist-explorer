document.addEventListener("DOMContentLoaded", () => {

    const playlistName = document.getElementById("featured-name");
    const playlistCreator = document.getElementById("featured-creator");
    const playlistImage = document.getElementById("featured-image")
    const songlist = document.getElementById("featured-list")

        //Fetch Data
        fetch("data/data.json")
          .then(response => {
            if (!response.ok) {
                throw new Error("Network error: " + response.status)
            }
            return response.json();
          })
          .then(data => {
                buildFeaturedplaylist(data.playlists);
            })
          .catch(err => {
            console.error("Failed to load playlists:", err);
          });
    
    function buildFeaturedplaylist(playlists){
        shuffleArray(playlists);
        featured = playlists[0];
        console.log(featured)
        playlistName.textContent = featured.playlist_name;
        playlistCreator.textContent = featured.playlist_author;
        playlistImage.src = featured.playlist_art;

        featured.songs.forEach(song => {
            const songDiv = document.createElement("div");
            songDiv.className = "featured-song";
            songDiv.innerHTML = `
            <img src=${song.cover_art}>
            <div class="feat-info">
                <h2>${song.title}</p>
                <h3>${song.artist}</p>
                <h3>${song.album}</p>
                <p>${song.duration}</p>
            </div>
            `
            songlist.appendChild(songDiv);

        })    
}
})


function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}