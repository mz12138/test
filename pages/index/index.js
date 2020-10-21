//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   item:0,
   tab:0,
   playlist:[{
    id:1,title:'钢琴协调曲', singer:'肖邦',
    src:'http://localhost:3000/2.mp3',coverImgUrl:'/images/cover.jpg'
  },{
    id:2,title:'奏鸣曲', singer:'莫再提',
    src:'http://localhost:3000/2.mp3',coverImgUrl:'/images/cover.jpg'
  },{
    id:3,title:'欢乐颂', singer:'贝多芬',
    src:'http://localhost:3000/2.mp3',coverImgUrl:'/images/cover.jpg'
  },{
    id:4,title:'爱之梦', singer:'李斯特',
    src:'http://localhost:3000/2.mp3',coverImgUrl:'/images/cover.jpg'
  }],
  state:'paused',
  playIndex:0,
  play:{
    currentTime:'00:00',
    duration:'00:00',
    percent:0,
    title:'',
    singer:'',
    coverImgUrl:'/images/cover.jpg', 
  },
  },

  changeItem:function(e){
    this.setData({
      item:e.target.dataset.item
    })
  },
  changeTab:function(e){
    this.setData({
      tab:e.detail.current
    })
  },
 
audioCtx:null,
onReady:function(){
this.audioCtx=wx.createInnerAudioContext()
var that=this
this.audioCtx.onError(function(){
  console.log('播放失败'+that.audioCtx.src)
})
// 播放完成制动下一曲
this.audioCtx.onEnded(function(){
  that.next()
})
// 自动更新播放进度
this.audioCtx.onPlay(function(){})
this.audioCtx.onTimeUpdate(function(){
that.setData({
  'play.duration':formatTime(that.audioCtx.duration),
  'play.currentTime':formatTime(that.audioCtx.currentTime),
  'play.percent':that.audioCtx.currentTime / that.audioCtx.duration * 100
})
})
this.setMusic(0)
function formatTime(time){
  var minute=Math.floor(time/60)%60;
  var second=Math.floor(time)%60
  return(minute<10?'0'+minute:minute)+':'+
  (second<10?'0'+second:second)
}
},
setMusic:function(index){
  var music=this.data.playlist[index]
  this.audioCtx.src=music.src
  this.setData({
playIndex:index,
'play.title':music.title,
'play.singer':music.singer,
'play.coverImgUrl':music.coverImgUrl,
'play.currentTime':'00:00',
'play.duration':'00:00',
'play.percent':0
  })
},
play:function(){
  this.audioCtx.play()
  this.setData({state:'running'})
},
pause:function(){
  this.audioCtx.pause()
  this.setData({state:'paused'})
},
next:function(){
  var index=this.data.playIndex>=this.data.playlist.length - 1 ?
  0:this.data.playIndex + 1
  this.setMusic(index)
  if(this.data.state==='running'){
    this.play()
  }
},
change:function(e){
  this.setMusic(e.currentTarget.dataset.index)
  this.play()
},
sliderChange:function(e){
  var second=e.detail.value*this.audioCtx.duration/100
  this.audioCtx.seek(second)
}

})
