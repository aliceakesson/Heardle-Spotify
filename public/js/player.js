var play = false; 
var tempPlay = false; 

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = accessToken;
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    })

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });
    
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    player.connect().then(success => {
        if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
        } else {
            console.log('The Web Playback SDK couldnt connect to Spotify');
        }
    });

    setInterval(run, 10);

    function run() {
        if(play != tempPlay) {
            player.togglePlay();
            console.log("toggle");
        }

        tempPlay = play;
    }

    player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
      
        var current_track = state.track_window.current_track;
        var next_track = state.track_window.next_tracks[0];
      
        console.log('Currently Playing', current_track);
        console.log('Playing Next', next_track);
    });

    
    
}; 

export default function toggle() {
    play = !play; 
}