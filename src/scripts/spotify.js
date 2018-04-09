export default () => {
  const token = 'BQA5S1f8MpjQIDCF4Ezc33hnIb-EmvtPJ7HjxCytvf2k4FTtLq9IrpxujTFrNxTJ4n6DmXkzW9DsIk-RzFOFClU1f03H1f-ciXjW5ldzBNr7YVXTYhZNEf9tormxE0iZZuxZOZfUAodxGqbvUGhDpQ5JbF3MJ67XIbzpnw';
  const player = new Spotify.Player({
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
    console.log('Ready with Device ID', device_id);
  });

  // Connect to the player!
  player.connect();
}
