const socket = io('/');
const videogrid = document.getElementById('video-grid')


var peer = new Peer( undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030',
});


 //video streams
let myVideoStream;
const myvideo = document.createElement('video');
myvideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myvideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    
    socket.on('user-connected', userId => {
        // user is joining`
      setTimeout(() => {
          // user joined
          connectToNewUser(userId, stream)
        }, 1000)
      })

})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })


// sockets
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    console.log(call)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        
    })

    peers[userId] = call
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=> {
        video.play()
    })
    videogrid.append(video);
}



let msg = $('input');

$('html').keydown((e) => {
    if(e.which == 13 && msg.val().length !== 0){
        socket.emit('message', msg.val());
        msg.val('');
    }
})
socket.on('createMessage', message => {
    console.log("create message",message)
    $('ul').append(`<li class="message"><b>user</b><br>${message}</li>`)
    scrollToBottom()
})


const scrollToBottom = () =>{
    var d =  $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


//Mute Function
const muteToggle = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
        
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html;
}


//stop video
const videoToggle = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setVideoButton();
    }
    else{
        setStopVideoButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
        
    }
}

const setStopVideoButton = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}

const setVideoButton = () => {
    const html = `
    <i class="stopvideo fas fa-video-slash"></i>
    <span>Show Video</span>
    `
    document.querySelector('.main_video_button').innerHTML = html;
}

const chatToggle = () => {
    var x = document.getElementById('chat');
    var y = document.getElementById('chatelse');
    if(x.style.display === "none"){
        x.style.display = "flex";
        y.style.flex = 0.8;
        x.style.flex = 0.2;
        setunshowchatButton();
    }
    else{
        x.style.display = "none";
        y.style.flex = 1;
        x.style.flex = 0;
        setshowchatButton();
    }
}

const setunshowchatButton = () => {
    const html = `
    <i class="fas fa-comment"></i>
    <span>Close Chat</span>
    `
    document.querySelector('.main_chat_button').innerHTML = html;
}

const setshowchatButton = () => {
    const html = `
    <i class="stopchat fas fa-comment-slash"></i>
    <span>Show Chat</span>
    `
    document.querySelector('.main_chat_button').innerHTML = html;
}


// const leavemeeting = () => {
//     socket.leave(ROOM_ID)
// }