// let's select all requird tags or element

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song_details .name"),
musicArtist = wrapper.querySelector(".song_details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

// load random music on page refresh
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load",()=>{
    loadMusic(musicIndex);  //calling load music function oonce window loaded
    playingNow();
})

// load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;


}

// play music function
function PlayMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// prev music function
function prevMusic(){
    // decrement index by 1
    musicIndex--;
    // if musicindex less than array length then musicindex will be 1 so the first music is play
    musicIndex < 1 ? musicIndex = allMusic.length:musicIndex=musicIndex;
    loadMusic(musicIndex); 
    PlayMusic();
    playingNow();

}

// next music function
function nextMusic(){
    // increment index by 1
    musicIndex++;
    // if  musicIndex is grater than array length then musicindex will be 1 so the first music is play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex ;
    loadMusic(musicIndex); 
    PlayMusic();
    playingNow();
}

// Play and music Event button
playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    // if musicpaused is true then call pausemusic else call playmusic
    isMusicPaused ? pauseMusic() : PlayMusic();
     playingNow();
});

// next music btn event
nextBtn.addEventListener("click",()=>{
    nextMusic(); //calling next music function
});

// prev music btn event
prevBtn.addEventListener("click",()=>{
    prevMusic(); //calling prev music function
});

mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progresswidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progresswidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{
        // update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10){
            totalSec =`0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

         
    });
    // update playing song current time
        let currentlMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){
            currentSec =`0${currentSec}`;
        }
        musicCurrentTime.innerText = `${currentlMin}:${currentSec}`;
});

// lets update playing song current time according to the progress bar width
progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetx = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffSetx / progressWidthval)* songDuration;
    PlayMusic();
});

// let work on repeat, shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    // first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting inner of icon
    // do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat_one then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one": //if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title","Playback shuffle");
            break;
        case "shuffle": //if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
    }
});

// above we just change the icon, now lets work what to do
// after the song ended 

mainAudio.addEventListener("ended",()=>{
    // 
    // 

    let getText = repeatBtn.innerText; //getting inner text of icon
    // do different changes on different icon click using switch
    switch(getText){
        case "repeat": //if this icon is repeat_one then simply we call the nextMusic function so the next song will play
           nextMusic();
            break;
        case "repeat_one": //if icon is repeat_one then change the current time to 0 so song will play from beginning
           mainAudio.currentTime = 0;
           loadMusic(musicIndex);
           PlayMusic();
            break;
        case "shuffle": //if icon is repeat_one then change it to repeat
        // generating random index betweeen the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex; //yhis loop run until next random number wonts to be 
            loadMusic(musicIndex); //passing randomindex to musicIndex
            PlayMusic(); //calling play music function
             playingNow();
            break;
    }
});

showMoreBtn. addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn. addEventListener("click",()=>{
   showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
   
    let liTag = `<li li-index="${i +1}">
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
            </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10){
            totalSec =`0${totalSec}`;
        }
       liAudioDuration.innerText = `${totalMin}:${totalSec}`;
    //    add t-duration tag which add below
       liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    });
}

// lets add onclick attribute in all li tag
const allLiTags = ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // let remove playing class frim all other li expext the last one which is click
        if(allLiTags[j].classList.contains ("playing")){
            allLiTags[j].classList.remove("playing");
            //let get that audio duration value and pass to .audio-duration innertext
            let addDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = addDuration; //passing t-duration value to audio duration innerText
        }

    // if there is an li tag which li-index equal to music Index
    // then this music i playing now and we'll style it
    if(allLiTags[j].getAttribute("li-index")== musicIndex){
        allLiTags[j].classList.add("playing");
        audioTag.innerText = "playing";
    }
    // adding onclik attribute in all li tag
    allLiTags[j].setAttribute("onclick","clicked(this)");
    
}
}

// lets play ssong on li click
function clicked(element){
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
     musicIndex = getLiIndex;
     loadMusic(musicIndex);
     PlayMusic();
     playingNow();
     

}