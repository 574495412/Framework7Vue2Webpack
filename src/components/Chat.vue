
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
            <f7-nav-left>
                <f7-link v-show="!goBackState" icon="icon-bars" open-panel="left"></f7-link>
                <a class="link" v-show="goBackState" @click="goBack" style="margin-left:0">
                <i class="icon icon-back"></i>
                <!-- Back link text rendered only for iOS theme -->
                <span>Back</span>
               </a>
            </f7-nav-left>
        <f7-nav-center sliding>{{title}}</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
        <f7-page>
        <f7-messages>  
        <f7-message  v-for="message in messageList"
            :key="message.mid"
            :text="message.content"
            :label="message.label"
            :date="message.date"
            :name="message.name"
            :avatar="message.icon"
            :type="message.type"
            :day="message.day"
            :time="message.time">
              <a v-if="replaceSrc(message.content)"  target="showHere" @click="showIframe(replaceSrc(message.content))" style="text-decoration: underline;cursor: pointer">{{replaceSrc(message.content)}}</a>
                    <img v-if="message.imageUri" :src="message.imageUri" v-on:click="onStandalone(message.imageUri)" />
            </f7-message>
    
        </f7-messages>
        <f7-messagebar :placeholder="$t('message.placeholder')" :send-link="$t('app.send')"v-on:submit="sendTextMessage">
             <div slot="before-textarea" class="icon-only">
            <!-- <input type="file" class="edit-file" id="file" style="display:none"> -->
        <a v-on:click="addPic" style="cursor:pointer;margin-right:5px"><i class="f7-icons">camera</i></a>
        <!-- <f7-icon icon="icon-add"></f7-icon> -->
      </div>
        </f7-messagebar>
        <f7-photo-browser
      ref="pb"
        theme="dark"
      :photos="photos"
    ></f7-photo-browser>
    <iframe v-show="iframeState" id="show-iframe"  name="showHere" frameborder="0" scrolling="auto" style="background-color:transparent;padding-top: 45px; position: absolute; z-index: 999; width: 100%; height: 100%; top: 0;left:0;":src="iframeUrl"></iframe>

        </f7-page>
        </f7-pages>
        </f7-view>
    </f7-views>
  </div>
  </template>
<script>
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
  import Message from '../factory/Message';
  import IMSDK from '../factory/IMSdk';
  import server from '../factory/server';
  import {formatDate} from '../factory/filters.js';
  import Upload from '../factory/Upload';
  export default {
    data: function () {
        return {
            userinfo: "",
            title:productName,
            messageList: [],
            photos:[],
            message: null,
            hasMsg: false,
            groupPublicInfo:'',
            groupMaster:"",
            Systemlanguage :null,
            logImg:'https://chumi.co/img/logo.png',
            imghost :'https://dhjjgq45wu4ho.cloudfront.net/',
            newDate:{
            day:(function () {
            /*显示星期*/
            /*time为date格式*/
            var str;
            var d = new Date().getDay();
            switch (d) {
                case 0:
                    str = "星期日";
                    break;
                case 1:
                    str = "星期一";
                    break;
                case 2:
                    str = "星期二";
                    break;
                case 3:
                     str = "星期三";
                    break;
                case 4:
                     str = "星期四";
                    break;
                case 5:
                     str = "星期五";
                    break;
                case 6:
                     str = "星期六";
                    break;
            }
            return str;
            })(),
            time:formatDate(new Date(),'hh:mm')
           },
            userId:getQueryString('uid'),
            groupId:getQueryString('acid'),
            target:{
                icon: "",
                id: getQueryString('uid'),
                name: "",
                date:formatDate(new Date(),'hh:mm')
            }
        };
    },
    mounted(){
        const oIframe = document.getElementById('show-iframe');
        const deviceWidth = document.documentElement.clientWidth;
        const deviceHeight = document.documentElement.clientHeight;
        oIframe.style.width = deviceWidth + 'px';
        oIframe.style.height = deviceHeight + 'px';
    },
    props: ['receiveMessage'],
    // components: {MessageComponent, ChatTitle},
    methods: {
        goBack(){
        this.goBackState = false;
        this.iframeState = false;
        },
        showIframe(url){
        this.goBackState = true;
        this.iframeState = true;
        this.iframeUrl=url
        // window.open(url)
        },
        hideIframe(){
        // this.goBackState = false;
        this.iframeState = false;
        },
        replaceSrc:function (txt){
        var reg = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;
        if(txt==undefined){
            return false
        }
       if(!!txt.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g)){
        var result = txt.replace(reg,function(item){
            if(item.indexOf('https://') <0)
            {
             item='https://'+item
            }
           
            return item;
            });
            return result;
        }else{
            return false
        }
        },
        setupBase: function(route) {
            let conversation = route.params.content || null;
            this.conversation = conversation;
        },
        setupRedirection: function(route) {
            if (!route.params.content) {
           /*     this.$router.push({name: 'Main'});*/
            }
        },
        updateConvList:function(){
            let m = this.getMessages();
            console.log(m.slice().reverse())
            this.userList = m.slice().reverse();
        },
        updateMessageWindow:function(){
            let m = this.getMessages();
            this.messageList=[this.newDate];
            for(let i=0;i<m.length;i++){
                if(m[i].target.id==this.userId){
                     for(let j=0;j<m[i].messages.length;j++){
                        m[i].messages[j].icon= m[i].messages[j].user.icon;
                        m[i].messages[j].name= m[i].messages[j].user.name;
                        m[i].messages[j].date= m[i].messages[j].user.date;
                        this.messageList .push(m[i].messages[j])
                     }
                }else{
                    for(let j=0;j<m[i].messages.length;j++){
                        m[i].messages[j]= m[i].messages[j].content;
                        m[i].messages[j].icon= m[i].messages[j].user.icon;
                        m[i].messages[j].type='received';
                        m[i].messages[j].name= m[i].messages[j].user.name;
                        m[i].messages[j].date= m[i].messages[j].user.date;
                        this.messageList .push(m[i].messages[j])
                     }
                }
            }
        },
        changeUser:function(target){
            this.target = target;
            this.updateMessageWindow();
        },
        setMessages:function(message,t){
            let msgStr = localStorage.getItem(this.groupId+"_msg");
            let msgObj=((!msgStr) ? []:JSON.parse(msgStr));
            let flag=false;
            for(let i=0;i<msgObj.length;i++){
                if(msgObj[i].target.id==t){
                    if(message) {
                         msgObj[i].messages.push(message);
                    }
                    flag=true;
                }
            }
            if(message){
                message=[message];
            }else{
                message=[];
            }
            if(!flag){
                msgObj.push({
                    target:t,
                    messages:message
                })
            }
            localStorage.setItem(this.groupId+"_msg",JSON.stringify(msgObj));
            this.updateConvList();
            this.updateMessageWindow();
        },
        getMessages:function(){
            let msgs = localStorage.getItem(this.groupId+"_msg");
            if(!msgs){
                msgs='[]';
            }
            return JSON.parse(msgs);
        },
        initital: function(route) {
            // this.setupBase(route);
            // this.setupRedirection(route);
            this.updateConvList();
            this.updateMessageWindow();
                     setTimeout(()=>{
         this.messageList.push(this.newDate);
            },100)
        },
        sendTextMessage: function(text,clear) {
            var targetId = this.userId;
            var type = this.groupId;
            var msg = new RongIMLib.TextMessage(
                {content:text,
                user : this.target
                });
            if (text.trim().length === 0) return
            Message.sendMessage(RongIMLib.ConversationType.GROUP, type, msg, function(message) {
                this.setMessages(message.content, this.target);
            }.bind(this),function(errorCode, message) {
                console.log(message);
                console.log(errorCode);
            });
              clear()
        },
        changeTextMessage: function($event) {
            this.textMessage = $event.target.innerHTML;
        },
         sendImageAndFile: function(event) {
            var file = event.target.files[0];
            Upload.getUploadUrl(file, function(data) {
                if (data.fileType === 'image') {
                    this.sendImage(data);
                } else {
                    this.sendFile(data);
                }
            }.bind(this));
        },
         addPic:function(e){
                e.preventDefault();
                $('input[type=file]').trigger('click');
                return false;
        },
        onStandalone: function (imageUri) {
            console.log(imageUri)  
            this.$f7.photoBrowser({
            photos : [{
            url:imageUri,
            }],
            type: 'standalone',
            theme: 'dark',
            zoom:true,
            maxZoom:1
            }).open()
        },
        sendImage: function(data) {
             var type = this.groupId;
            var base64 = data.hash;
            var url = data.downloadUrl;
            var msg = new RongIMLib.ImageMessage({content:base64, imageUri:url, user : this.target});
            Message.sendMessage(RongIMLib.ConversationType.GROUP, type, msg, function(message) {
                console.log(message)
             this.setMessages(message.content, this.target);
            }.bind(this));
        },
        sendFile: function(data) {
            var msg = new RongIMLib.FileMessage({name: data.name, size: data.size, type:data.fileType, fileUrl: data.downloadUrl});
            Message.sendMessage(this.conversation.conversationType, this.conversation.targetId, msg, function(message) {
                this.messageList.push(message);
            }.bind(this));
        },
        getMoreHistory: function() {
            var route = this.$route;
            var targetId = route.params.id;
            var type = route.params.type;
            IMSDK.historyMessages(type, targetId, null, 15, function(list, hasMsg) {
                this.messageList = list.concat(this.messageList);
                this.hasMsg = hasMsg;
            }.bind(this));
        }
    },
    computed: {

    },
    watch: {
        '$route': function (to, from) {
            this.initital(to);
        },
        'receiveMessage': function(newMessage) {
            console.log(newMessage)
            if (newMessage.targetId === this.$route.params.id) {
                this.messageList.push(newMessage);
            }
        }
    },
    created: function () {
        // this.routeName = this.$route.name;
           setTimeout(()=>{
         window.history.back(-1); 
            },80000)
          $("input").on("click", function() {
                var target = this;
                setTimeOut(function() {
                    target.scrollIntoView(true);
                }, 100);
            })
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
        this.$$('body').removeClass('theme-blue').addClass('theme-white');
        server.getUserBasicInfo(this.userId).then(data => {
               localStorage.setItem('rongCloud_token', data.rongCloudToken);
               this.target.name=data.username;
               this.target.icon=this.imghost+data.userPhoto;
               this.Systemlanguage=data.Systemlanguage;
        })
        server.getGroupAllInfo(this.groupId).then(data => {
            this.userinfo=data.userinfo.length;
            this.groupPublicInfo=data.groupPublicInfo;
             this.groupMaster=data.userinfo[0];
             this.groupMaster.userPhoto=this.imghost+this.groupMaster.userPhoto;
            if(this.groupPublicInfo!=""){
                // this.$f7.modalTitle="群公告";
               this.$f7.alert(this.groupPublicInfo,'群公告')
            }
            
        })
          IMSDK.create(function (message) {
              console.log(message)
                this.setMessages(message,message.content.user);  
                }.bind(this), function (userId) {
                    this.userId = userId;
                }.bind(this));
         this.initital(this.$route);
    },
    beforeUpdate: function() {

    }
}

</script>
  <style>
    .navbar, .subnavbar,.toolbar  {
        background-color: #00aeef;
        color: white;
    }
    .navbar-fixed .page-content, .navbar-through .page-content {
        padding-top: 44px;
        padding-bottom: 44px;
    }
   .message-sent .message-text {
    padding-right: 22px;
    background-color: #009BDB;
    }
  </style>