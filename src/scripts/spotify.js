const play = ({
  spotify_uri,
  playerInstance: {
    _options: {
      getOAuthToken,
      id,
    },
  },
}) => {
  getOAuthToken((access_token) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });
  });
};


export default () => {
  const token = 'BQBfc6EDDZeP8A7ZhPG23RDD4J06IyM3TOwCX5f1hZKeNqlXic9-QTg5F4vb7y7k-5gvHtt5zdfG9AP10if5OuJ82ylasUk7vw0Y0Zai8YwFkrDf7aZilGbDWH1hW4NwwP21lp70WrPtnGDulDaLjiyJMaupv7Ysi_Soeg';
  const player = new window.Spotify.Player({
    name: 'Tunespinner',
    getOAuthToken: (cb) => { cb(token); },
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', (state) => { console.log(state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    play({
      playerInstance: player,
      spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
    });
  });

  // Connect to the player!
  player.connect();
}
