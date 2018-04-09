const play = ({
  spotify_uri,
  playerInstance: {
    _options: {
      getOAuthToken, // gets value from passed in playerInstance._options.getOAuthToken
      id, // gets value from passed in playerInstance._options.id
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
  const token = 'BQCfwSlB5LOf0oQjKOrgyKkKyscFaAMyvitI6t9k1xbuJkXN17HnHOWoYqZ9jPDd4g-VX-9qucBvsPUNncePsoooJGNa2yD3bA4PWHe5Ov7BLZJZ41cimaP0xFJ0Bgd0DyBTk7cf-gpBUBRbEcG_Fb_UUiSIirz0yiHstA';
  const player = new window.Spotify.Player({
    name: 'Tunespinner',
    getOAuthToken: (cb) => {
      cb(token)
    },
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', (state) => { console.log('STATE CHANGE', state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    // play({
    //   playerInstance: player,
    //   spotify_uri: 'spotify:track:7xGfFoTpQ2E7fRF5lN10tr',
    // });
    // player.pause()
    window.player = player
  });

  // Connect to the player!
  player.connect();
}
