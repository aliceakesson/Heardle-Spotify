var play = false; 
var tempPlay = false; 

const song = 'spotify:track:4Tbuh5q66Ygubei5Xru4jB';

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
        playSong(song);
        printState();
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

    // player.addListener('player_state_changed', ( state => {
    //     if (!state) {
    //         return;
    //     }
    
    //     setTrack(state.track_window.current_track);
    //     setPaused(state.paused);
    
    
    //     player.getCurrentState().then( state => { 
    //         (!state)? setActive(false) : setActive(true) 
    //     });
    // }));
    

    player.connect().then(success => {
        if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
        } else {
            console.log('The Web Playback SDK couldnt connect to Spotify');
        }
    });

    setInterval(run, 10);

    function run() {
        if(play && !tempPlay) {
            // player.togglePlay();
            restart();
            console.log("play");
        } else if(!play && tempPlay) {
            // player.pause();
            console.log("pause");
        }

        if(play != tempPlay) {
            player.togglePlay();
            printState();
        }

        tempPlay = play;
    }

    function printState() {
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
    }

    const playSong = async (uri) => {
        console.log("Changing song");
        let request_answer = await fetch(
          "https://api.spotify.com/v1/me/player/play",
          {
            method: "PUT",
            body: JSON.stringify({
              uris: [uri],
            }),
            headers: new Headers({
              Authorization: "Bearer " + token,
            }),
          }
        ).then((data) => console.log(data));
      };
    
    const restart = async () => {
        fetch('https://api.spotify.com/v1/me/player/seek?position_ms=0', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Failed to restart song');
            }
            console.log('Song restarted successfully');
        })
        .catch(error => {
            console.error(error);
        });
    }
}; 

export default function toggle() {
    play = !play; 
}