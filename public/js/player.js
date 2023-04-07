var play = false; 
var tempPlay = false; 

const timezone = 'spotify:track:4Tbuh5q66Ygubei5Xru4jB';
const beggin = 'spotify:track:3Wrjm47oTz2sjIgck11l5e';
const token = accessToken;

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    })

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        changeSong(beggin);
        nextSong();
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

function toggle(on) {
    play = on; 
}

const changeSong = async (uri) => {
    console.log("Changing song to " + uri);
    fetch(`https://api.spotify.com/v1/me/player/play?uris=${uri}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`
    }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to change song');
        }
        console.log('Song changed successfully');
    })
    .catch(error => {
        console.error(error);
    });
};

const nextSong = async () => {
    fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to skip to next song');
        }
        console.log('Skipped to next song');
    })
    .catch(error => {
        console.error(error);
    });
}

export { toggle, changeSong, nextSong };