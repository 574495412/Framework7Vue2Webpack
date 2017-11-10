<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>
 <!-- <f7-preloader></f7-preloader> -->

    <!-- left Panel -->
    <f7-panel left reveal layout="dark">
      <f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
        <f7-navbar v-if="$theme.ios">
              <f7-nav-center sliding>群公告</f7-nav-center>
            <f7-nav-right>
             <f7-link icon="icon icon-forward" close-panel></f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-pages>
          <f7-page>
            <f7-navbar v-if="$theme.material">
            <f7-nav-center sliding>群公告</f7-nav-center>
            <f7-nav-right>
             <f7-link icon="icon-forward" close-panel></f7-link>
            </f7-nav-right>
            </f7-navbar>
             <f7-block>
              <p>
                 群主：{{groupMaster.username}}
              </p>
               <p>
                 头像：<img class="userPhoto" :src="groupMaster.userPhoto">
              </p>
              <p>
                 介绍：{{groupMaster.description}}
              </p>
            </f7-block>
            <f7-block>
              <p style="display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;"  v-on:click=" $f7.alert(groupPublicInfo)">
                群公告：{{groupPublicInfo}}
              </p>
            </f7-block>
             <f7-block>
              <p>
             群聊人数：{{userinfo}}  <a class="button button-round" style="    display: inline-flex;margin-left: 6px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=co.chumi.cq.www">下载App</a>
              </p>
            </f7-block>
             <f7-toolbar v-if="$theme.ios">
             <f7-block>
              <p style="font-size: 13px;text-aline:center">
                  <img :src="logImg" style="width: 60px; height: 24px; vertical-align: middle;">
                  power by chumi 
              </p>
             </f7-block>
            </f7-toolbar>   
            <!-- <f7-list>
              <f7-list-item
                title="Right panel page 2"
                link="/sidePanels/panelRight2/"
              ></f7-list-item>
              <f7-list-item
                title="Right panel page 3"
                link="/sidePanels/panelRight3/"
              ></f7-list-item>
            </f7-list> -->
             <!-- IOS Theme Toolbar -->
          </f7-page>
        </f7-pages>    
      </f7-view>
    </f7-panel>
    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>

        <!-- Navbar -->
        <f7-navbar sliding>
          <f7-nav-center sliding>Chumi App</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page>
              
                   <div v-if="cover"  :style="{'background-image': 'url(' + cover + ')',
                       'height': '82px','background-size':'cover','background-position-y':'center'}"></div>
            <!-- <f7-block-title>Login</f7-block-title> -->
            <f7-list>
                <f7-list-item>
                    <f7-label>E-mail</f7-label>
                    <f7-input @keyup.enter="enterChat" type="email" pattern="[a-z0-9A-Z._%+-]+@[a-z0-9A-Z.-]+\.[a-zA-Z]{2,3}$"  placeholder="E-mail" v-model="Email" />
                </f7-list-item>
              <f7-list-item>
                    <f7-label>Name</f7-label>
              <f7-input @keyup.enter="enterChat" type="text" placeholder="Your name" v-model="username" />
              </f7-list-item>
              <f7-list-button v-on:click="enterChat">Enter chat</f7-list-button>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
  </div>
</template>

<script>
// import leftBar from '/components/LeftBar.vue';
//   import conversationList from '/components/ConversationList.vue';
/*  import about from '/components/about.vue';*/
    import IMSDK from './factory/IMSdk';
    import server from './factory/server';
    function getQueryString(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);  
        if (r != null) return unescape(r[2]);  
        return null;  
    } 
    function getUrlVars(){ 
    var vars = [], hash; 
    var hashes = window.location.href.slice(window.location.href.indexOf('?')+1).split('&'); 
    for(var i = 0; i < hashes.length; i++) { 
    hash = hashes[i].split('='); 
    vars.push(hash[0]); 
    vars[hash[0]] = hash[1]; 
    } 
    return vars; 
    } 
    var params = getUrlVars(); 
    //获得此中分类的id 
    var parentId = params[params[0]]; 
    //获得分类的名称 
    var productName = decodeURI(params[params[1]]); 
    export default {
        name: 'app',
        data: function () {
            console.log(productName)
            return {
                Email: "",
                username: '',
                groupPublicInfo:"",
                userinfo:"",
                userId:"",
                host :'/api',
                rongTokenStr:"",
                groupId:getQueryString('acid'),
                share:getQueryString('share'),
                title:productName,
                errMsg:null,
                cover:null,
                groupMaster:'',
                logImg:'https://chumi.co/img/logo.png',
                imghost :'https://dhjjgq45wu4ho.cloudfront.net/'
            }
        },
        methods: {
            getBasicInfo:function(){
                var url =this.host+'/uploadUserBasicInfo/ulevel';
                this.$http.get(url).then(response=>{
                    console.log(response);
                    return response
                }).catch(err => {
                    console.log(err)
                })
            },
            getUserInfo(){
                this.getBasicInfo().subscribe(
                    data => {
                        if(data.length==1){
                            GlobalService.data.isSigned = false;
                        }else {
                            if (data.email) {
                                GlobalService.data.isSigned = true;
                                GlobalService.data.userImg = this.http.imghost + data.userPhoto;
                                GlobalService.data.username = data.username;
                                GlobalService.data.email = data.email;
                                GlobalService.data.isVip = data.certificate;
                                GlobalService.data.noticeNumber = data.notifi_numberLeft;
                                // GlobalService.data.tags = data.tags;
                                GlobalService.data.language = data.Systemlanguage;

                                //
                            } else {
                                GlobalService.data.isSigned = false;
                            }
                            this.dataChange.next(GlobalService.data);
                        }
                    },
                    error => {
                        console.log(error);
                    }
                );
            }, 
            enterChat: function () {
            if(this.Email.trim().length==0){
                this.$f7.modalTitle="提示";
                this.$f7.alert('Please enter your Email')
                return false;
            }
            if (this.username.trim().length === 0) {
                this.$f7.modalTitle="提示";
                this.$f7.alert('Please enter your Name')
                return false;
            }
            if(this.errMsg){
                this.$f7.alert(this.$t(this.errMsg));
                return false
            }
             this.$f7.showPreloader(this.$t('加入群聊中…'))
         
            var RegisterInfo={
                stripeEmail:this.Email,
                title:this.title,
                acWebId:this.groupId,
                username:this.username,
            };
            server.getRegisterInfo(RegisterInfo).then(data => {
                    localStorage.setItem('rongCloud_token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('groupId', this.groupId);
                    this.userId=localStorage.getItem('userId');
                    server.getUserInfo(this.userId).then(data => {
                        localStorage.setItem('username',data.username);
                        localStorage.setItem('icon',this.imghost + data.thumb);
                        this.$f7.hidePreloader()
                        this.$f7.mainView.router.load({url: '/Chat/'+this.userId+'/'+this.groupId});
                    },
                    error => {
                        console.error('Error on geting username an photo for chat'+ error);
                    });
                },
                error => {
                    console.error('Error on rongCloud_token'+ error);
                });
                // this.getEventInfo("5855aec84d19bcf6636a6127");
                // this.getBasicInfo()
            }
        },created:function () {
                function isWeiXin() {
                var ua = window.navigator.userAgent.toLowerCase();
                console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
                } else {
                return false;
                }
                }
                if(isWeiXin()){
                console.log(" 是来自微信内置浏览器");
                confirm('建议用浏览器打开,方便保存登录信息')
                }
                server.getEventInfo(this.groupId).then(data => {
                    this.userId=localStorage.getItem('userId');
                      this.cover=this.imghost+data.cover;
                      let self=this;
                    if(data.price!=0){
                        this.errMsg="你不能通过登录进入群聊"
                    }else if(this.userId==data.link){
                        setTimeout(()=>{
                        //   window.location.href= '/Chat/'+this.userId+'/'+this.groupId;
                        self.$f7.mainView.router.load({url: '/Chat/'+this.userId+'/'+this.groupId})
                        },0)
                    }
                });
                server.getGroupAllInfo(this.groupId).then(data => {
                    this.groupPublicInfo=data.groupPublicInfo;
                    this.userinfo=data.userinfo.length;
                    this.groupMaster=data.userinfo[0];
                    this.groupMaster.userPhoto=this.imghost+this.groupMaster.userPhoto;
                });
                this.$$('body').removeClass('theme-blue').addClass('theme-white')
        }, mounted () {
            
       },
        beforeUpdate: function() {
                 console.log(1)
        }
    }
    </script>
<style>
.navbar, .subnavbar,.toolbar  {
    background-color: #00aeef;
    color: white;
}
.list-block .list-button{
    color: #007aff!important;
}
.content-block-title{
    margin-top: 16px
}
.userPhoto{
    width: 44px;
    height: 44px;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 5px;
}
.list-block {
    margin-top: 0;
}
/*6*/
@media (min-device-width : 375px) and (max-device-width : 667px) and (-webkit-min-device-pixel-ratio : 2){
        .list-block .item-input {
    width: 61%;}
 }

/*6+*/
@media (min-device-width : 414px) and (max-device-width : 736px) and (-webkit-min-device-pixel-ratio : 3){ 
      .list-block .item-input {
    width: 60%;}
}

</style>