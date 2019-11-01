<template>
  <div class="container">

    <div class="trackcontainer">
      <div v-for="track in tracks" class="track" :key="track">
        <div :style="[track.activate[n-1] ? {backgroundColor:`hsl(${track.hue},100%,50%)`}:{backgroundColor:'#DDD'}]" v-touch:tap="toggleActivate(track, n)" :ref="n" :class="{playsound:track.activate[n-1], block:true, active: n==current }" :key="n" v-for="n in parseInt(notevalue)">&#160;</div>
      </div>   
      <div v-for="n in parseInt(notevalue)" :key="n" :class="{ticker:true, active: n==current}"></div>
    </div>

    
    <div class="buttoncontainer">
      <div v-touch:tap="setMeasure(4)" :class="{note:true, quarter:true, activenote: notevalue == 4}"></div>
      <div v-touch:tap="setMeasure(8)" :class="{note:true, eight:true, activenote: notevalue == 8}"></div>
      <div v-touch:tap="setMeasure(16)" :class="{note:true, sixteenth:true, activenote: notevalue == 16}"></div>
      <span class="startstop" v-touch:tap="startSound">
        <img v-show="!playing" src="@/assets/img/play.svg" width="50" height="50" />
        <img v-show="playing" src="@/assets/img/pause.svg" width="50" height="50" />
      </span> 
    </div>
    
    <div class="credits">coded by thooyork with <img src="@/assets/img/Vue.png"/> and <img src="@/assets/img/heart.png"/></div>
    <!-- <div v-if="loading" class="loader">Loading sounds ...</div> -->
    <div class="slidecontainer">
      <span class="bpm">{{bpm}} bpm</span><br/>
      <input type="range" min="20" max="400" v-model="bpm" class="slider" id="bpm"/>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import * as Tone from 'tone'

export default {
  data(){
    return {
        loading:true,
        current:0,
        notevalue:8,
        playing:false,  
        bpm:120,
        tracks:[
          {"instrument":"E0","activate":[],"hue":190},
          {"instrument":"A1","activate":[],"hue":210},
          {"instrument":"D1","activate":[],"hue":260},
          {"instrument":"G1","activate":[],"hue":150},
          {"instrument":"B2","activate":[],"hue":310},
          {"instrument":"E1","activate":[],"hue":290}
        ]
    }
  },
  mounted(){
    this.init();
  },
  watch:{
    bpm: {
        handler: function(val, oldVal) {
          Tone.Transport.bpm.value = this.bpm;
        }
    },
    notevalue: {
        handler: function(val, oldVal) {    
            Tone.Transport.stop();
            Tone.Transport.cancel();
            Tone.Loop.interval = this.notevalue + 'n';
            this.playing = false;
            // this.$forceUpdate();
        }
    },
  },
  methods:{
    toggleActivate:function(track, n){
      return () =>  {
        track.activate[n-1] = !track.activate[n-1];
        this.$forceUpdate();
      }
    },
    setMeasure:function(measure){
      return () =>  {
        this.notevalue = measure;
        // this.$forceUpdate();
      }
    },
    startSound:function(){
      if(!this.playing){  
          
          this.loop = new Tone.Loop((time) => {
              Tone.Draw.schedule(() => {
                  this.current++;
                  if(this.current > this.notevalue) this.current=1;
                  for(let j=0; j<this.tracks.length; j++){
                    if(this.$refs[this.current][j].className.indexOf('playsound') > -1){
                      let synth = new Tone.MembraneSynth().toMaster();
                        synth.triggerAttackRelease(this.tracks[j].instrument, 0.8);
                    }
                  }
			        }, time);
          }, this.notevalue+"n").start(0);
          Tone.Transport.bpm.value = this.bpm;
          Tone.Transport.start();
      }
      else{
        Tone.Transport.stop();
        Tone.Transport.cancel();
      }
      this.playing = !this.playing;
    },
    init: function() {

      // for(let j=0; j<this.tracks.length; j++){
      //    for(let i=0; i<this.notevalue; i++){
      //      this.tracks[j].activate[i] = false;
      //    }
      // }

    }
  }
}
</script>

<style scoped lang="scss">
  .trackcontainer{
      z-index:6;
      color:#FFF;
      text-align:center;
      font-size:12px;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      margin:30px 0 0 0;
      // opacity:.9;
      
      .block{
        display: inline-block;
        width:50px;
        height:50px;
        padding:0px;
        margin:5px;
        border-radius:2px;
        // text-align:center;
        @media (max-width: 1000px) { 
            width:30px;
            height:30px;
            margin:3px;
         }
         @media (max-width: 600px) { 
            width:16px;
            height:16px;
            margin:3px;
         }
      }
      .ticker{
        border-radius:2px;
        display: inline-block;
        width:50px;
        height:4px;
        padding:0px;
        margin:0px 5px;
        text-align:center;
        background-color:#DDD;
        @media (max-width: 1000px) { 
            width:30px;
            margin:0px 3px;
         }
         @media (max-width: 600px) { 
            width:16px;
            margin:0px 3px;
         }
        &.active{
          background-color:hsl(280,100%,50%);
        }
      }
  }
  .active{
    &.playsound{
      opacity:.85;
    }
  }
  .playsound{
    background: radial-gradient(ellipse at center,rgba(255,255,255,.6) 0%,transparent 100%);
  }
  .container{
      position:absolute;
      width: 100%;
      height: 100%;
      z-index:3;
      overflow:hidden;
      // background-color:#111 ;
      background-size: cover;
    //  background: linear-gradient(to left, #111, #333 70%);
      background-image: url('~@/assets/img/grunge.jpg');
  }
  .slidecontainer{
     position:absolute;
      width: 100%;
      text-align: center;
      z-index:3;
      margin:30px 0px 0px 0px;

      .bpm {
        color:#FFF;
        text-align:center;
        font-size:10px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
      }

  }

  .buttoncontainer{
    position: absolute;
    z-index:4;
    bottom:60px;
    width:100%;
    text-align:center;
  
    .note{
      display:inline-block;
      width:34px;
      height:34px;
      padding:5px;
      margin:0 8px;
      background-size:70%;
      background-color:#FFF;
      border:3px solid #FFF;
      opacity:.75;
      background-repeat: no-repeat;
      background-position: center;
      border-radius:50%;

      &.activenote{
        border:3px dashed hsl(290,100%,50%);
      }
    }
    .quarter{
      background-image: url('~@/assets/img/quarternote.png');
    }
    .eight{
      background-image: url('~@/assets/img/eightnote.png');
    }
    .sixteenth{
      background-image: url('~@/assets/img/sixteenthnote.png');
    }

    .startstop{
      margin:0 8px;
      display:inline-block;
      color:#FFF;
      bottom:60px;
      font-size:12px;
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }
  }
  .credits{
    position:absolute;
    z-index:4;
    color:#FFF;
    bottom:10px;
    left:50%;
    transform: translateX(-50%);
    font-size:12px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    a{
      color:#FFF;
      font-size:12px;
      text-decoration: none;
      &:hover{
        color:#CC3300;
      }
    }

    img{
      display:inline-block;
      transform:translateY(2px);
      width:12px;
      height:12px;
    }
  }

  .loader{
    position:absolute;
    z-index:4;
    color:#FFF;
    top:50%;
    left:50%;
    transform: translateX(-50%);
    font-size:12px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    background-color:rgba(0,0,0,.7);
    padding:5px;
  }
</style>
