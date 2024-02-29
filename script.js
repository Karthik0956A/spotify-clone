var audio;
var currentsong=new Audio("songs/Heeriye.mp3");


async function getSongs(){
    let a = await fetch('songs/songs.html');

    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let alink  =  div.getElementsByTagName("a");
    let songs = [];
    for(let i =0;i<alink.length;i++){
        const e = alink[i];
        if(e.href.endsWith(".mp3.preview")){
            let s = e.href.replace(".preview","");
            songs.push(s);
        }
    }
    
    return songs;
}

async function loadsongs(song)
{
    for(let i = 0;i<song.length;i++){
        let div = document.createElement("div");
        
        div.innerHTML = song[i].replace("songs/","");
        div.innerHTML = div.innerHTML.replaceAll("%20"," ");
        let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
        songul.innerHTML= songul.innerHTML +`
        <li>
                            
              <img src="images/music.svg" alt="music" class="invert">
              <div class="info">
              <p>${div.innerHTML}</p>
              <p>Karthik</p>
              </div>
            <div class="flex playnow" style="align-items: center;gap: 2px;">
              <span>Play now</span>
              <img src="images/play.svg" class="invert" alt="">
            </div>
                       
        
        </li>`;
    }
     
}

function secondsToMMSS(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Adding leading zeros if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + Math.floor(remainingSeconds);
}

const playaudio=(track ,info,ind)=>{
    currentsong.src = track;
    currentsong.play();
    play.src="/images/pause.svg"; 
  
    
    document.querySelector(".songinfo").innerHTML = `${info}`;
    document.querySelector(".songtime").innerHTML = `00:00/00:00`;

    currentsong.addEventListener("timeupdate",()=>{
        let ct = `${secondsToMMSS(currentsong.currentTime)}`;
        let duration1 = `${secondsToMMSS(currentsong.duration)}`;
        document.querySelector(".songtime").innerHTML = `${ct}/${duration1}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })
}

async function main(){
    
    var song = await getSongs();
    
    await loadsongs(song);
    //Attach event lister to songlist
    let list = document.querySelector(".songlist").getElementsByTagName("li");
    for(let i = 1;i<list.length;i++){
        list[i].addEventListener("click",()=>{
            let sname = list[i].querySelector(".info").firstElementChild.innerHTML;
            console.log(sname)
            playaudio(song[i-1],sname);
    })
    }

    //to attach eventlistener to play,previous,next
    let play = document.getElementById("play");
    let previous = document.getElementById("previous");
    let next = document.getElementById("next");

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="/images/pause.svg";
        }
        else{
            currentsong.pause();
            play.src="/images/play.svg";
        }
    });

    previous.addEventListener("click", () => {
        for (let i = 1; i < song.length; i++) {
            if (currentsong.src === song[i]) {
                let sname = list[i].querySelector(".info").firstElementChild.innerHTML;
                playaudio(song[i - 1], sname);
                break;
            }
        }
    });
    
    next.addEventListener("click", () => {
        for (let i = 0; i < song.length - 1; i++) {
            if (currentsong.src === song[i]) {
                let sname = list[i + 1].querySelector(".info").firstElementChild.innerHTML;
                playaudio(song[i + 1], sname);
                break;
            }
        }
    });

    //Adjust seekbar

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;
    });

    window.addEventListener("resize", () => {
        if (document.body.clientWidth < 1000) {
            document.getElementById("menu").hidden = false;
            document.getElementById("close").hidden = false;
            
            document.getElementById("menu").addEventListener("click", () => {
                document.querySelector(".left").style.left = "0%";
            });

            document.getElementById("close").addEventListener("click", () => {
                document.querySelector(".left").style.left = "-100%";
            });
        } 
        else {
            document.getElementById("menu").hidden = true;
            document.getElementById("close").hidden =  true;
        }
    });
    
     
    
}
main()

function changevol(){
    let newval = document.getElementById("ranger").value;
    
    console.log("Volume change to",newval)
    currentsong.volume = newval*0.01;
    
}

