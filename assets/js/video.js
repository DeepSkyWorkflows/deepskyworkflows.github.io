var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
    
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    
    const w = document.getElementById('player').clientWidth * .9;

    const videos = [
        [426, 240]
        ,[640, 360]
        ,[854, 480]
        ,[1280, 720]
        ,[1920, 1080]
        ,[2560, 1440]
        ,[3840, 2160]
    ];

    let idx = videos.length-1;
    const cutoff = w * .9;

    while ((videos[idx])[0] > cutoff && idx > 0) {
        idx--;
    }

    const videoCfg = {
        videoId: video.id,
        width: (videos[idx])[0],
        height: (videos[idx])[1]+30,
        playerVars: {
            'playsinline': 1,
            'enablejsapi': 1,
            'modestbranding': 1,
        }
    };
    
    video.player = new YT.Player('player', videoCfg);
}

setTimeout(() => {
    
    const timers = document.getElementsByTagName("li");
    
    for (let li = 0; li < timers.length; li++) {
    
        const liElem = timers[li];
        const content = liElem.innerText;
    
        if (content.indexOf(':') > 0 && content.indexOf(':') < content.indexOf(' ')) {
    
            const time = content.substring(0, content.indexOf(' '));
            const description = content.substring(content.indexOf(' '));
            const timeParts = time.split(':');
    
            let seconds = 0;
    
            for (let tp = 0; tp < timeParts.length; tp++) {
                seconds *= 60;
                seconds += parseInt(timeParts[tp]);
            }
            
            const button = (function (s) {
                const btn = document.createElement("button");
                btn.classList.add('btn', 'btn-success');
                btn.style.margin = "0.33em";
                btn.innerText = time;
                btn.onclick = () => {
                    video.player.seekTo(s, true);
                    video.player.playVideo();
                };
                return btn;
            })(seconds);
    
            const desc = document.createElement("span");
            desc.innerText = description;
            
            (function(elem, b, d) {
                setTimeout(() => {
                    elem.appendChild(b);
                    elem.appendChild(d);
                });
            })(liElem, button, desc);
            liElem.innerHTML = '';            
        }        
    }
}, 100);