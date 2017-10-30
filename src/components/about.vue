
  <template id="page-chat">
    <f7-page>
      <f7-navbar>
            <f7-nav-left>
                <f7-link icon="icon-bars" open-panel="left"></f7-link>
            </f7-nav-left>
          <f7-nav-center sliding>{{title}}</f7-nav-center>
      </f7-navbar>
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
             <img v-if="message.imageUri" :src="message.imageUri" v-on:click="onStandalone(message.imageUri)" />
        </f7-message>
  
      </f7-messages>
      <f7-messagebar placeholder="Message" send-link="Send" v-on:submit="sendTextMessage">
        <div slot="before-textarea" class="icon-only" @change="sendImageAndFile">
            <input type="file" class="edit-file" id="file" style="display:none">
        <a v-on:click="addPic" style="cursor:pointer;margin-right:5px"><i class="f7-icons">add</i></a>
        <!-- <f7-icon icon="icon-add"></f7-icon> -->
      </div>
      </f7-messagebar>
       <f7-photo-browser
      ref="pb"
        theme="dark"
      :photos="photos"
    ></f7-photo-browser>
    </f7-page>
  </template>
<script>
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
//   import ChatTitle from './Title.vue';
  import Upload from '../factory/Upload';
export default {
    template: '#page-chat',
    data: function () {
        return {
            routeName: null,
            title:productName,
            messageList: [],
            photos:[],
            message: null,
            hasMsg: false,
            groupPublicInfo:'',
            host :'/api',
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
            userId:this.$route.params.userId,
            groupId:this.$route.params.groupId,
            target:{
                icon: localStorage.getItem('icon'),
                id: this.$route.params.userId,
                name: localStorage.getItem('username'),
                date:formatDate(new Date(),'hh:mm')
            }
        };
    },
    props: ['receiveMessage'],
    // components: {MessageComponent, ChatTitle},
    methods: {
        setupBase: function(route) {
            this.routeName = route.name;
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
                        // if( m[i].messages[j].imageUri){
                        //     this.photos.push( {
                        //         url:  m[i].messages[j].imageUri,
                        //         caption: ''
                        //     })
                        // }
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
                console.log(m[i])
            }
        },
        changeUser:function(target){
            this.target = target;
            this.updateMessageWindow();
        },
        setMessages:function(message,t){
            let msgStr = localStorage.getItem(this.userId+"_msg");
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
            localStorage.setItem(this.userId+"_msg",JSON.stringify(msgObj));
            this.updateConvList();
            this.updateMessageWindow();
        },
        getMessages:function(){
            let msgs = localStorage.getItem(this.userId+"_msg");
            if(!msgs){
                msgs='[]';
            }
            return JSON.parse(msgs);
        },
     /*   setupHistoryList: function() {
            var targetId = this.$route.params.userId;
            var type = this.$route.params.groupId;
            console.log(targetId)
            console.log(type)
         IMSDK.historyMessages(targetId,type, 0, 15, function(list, hasMsg) {
                console.log(hasMsg);
                console.log(list);
                var lists=[]
                for (var i=0;i<list.length;i++){
                    lists.push({text:list[i].content.content})
                }
                this.messageList = lists;
                this.hasMsg = hasMsg;
            }.bind(this));
        },*/
        initital: function(route) {
            this.setupBase(route);
            this.setupRedirection(route);
            this.updateConvList();
            this.updateMessageWindow();
               setTimeout(()=>{
         this.messageList.push(this.newDate);
            },100)
         
        },
        sendTextMessage: function(text,clear) {
            var targetId = this.$route.params.userId;
            var type = this.$route.params.groupId;
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
             var type = this.$route.params.groupId;
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
         this.$$('body').removeClass('theme-blue').addClass('theme-white');

        server.getGroupAllInfo(this.groupId).then(data => {
                this.groupPublicInfo=data.groupPublicInfo;
                if(this.groupPublicInfo!=""){
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
    .navbar-fixed .page-content, .navbar-through .page-content {
        padding-top: 44px;
        padding-bottom: 44px;
    }
   .message-sent .message-text {
    padding-right: 22px;
    background-color: #009BDB;
    }
  </style>