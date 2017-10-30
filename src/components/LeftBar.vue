<template>
  <div class="left-bar">
    <a class="head">{{userId}}</a>
    <input type="button" value="黑名单" class="btn btn-default black-button" @click="showBlackList">
    <div class="add-group-box">
        <a class="add-group-btn" @click="showAddContent=!showAddContent">+</a>
    </div>
    <div class="add-content-box" v-show="showAddContent">
        <form class="create-dis" action="index.html" method="post">
            <h5>创建讨论组</h5>
            <label for="disName">名字：</label><input v-model="discussName" class="form-control" type="text" id="disName" >
            <label for="disNumber">成员：</label><input type="text" id="disNumber" class="form-control" v-model="discussNumber" >
            <input class="form-control btn btn-danger" type="button" value="创建" @click="submitDiscuss">
        </form>
        <form class="create-dis" action="index.html" method="post">
            <h5>进入群组</h5>
            <label for="disName">群组ID：</label><input class="form-control" type="text" id="disName" >
            <label for="disName">群组名称：</label><input class="form-control" type="text" id="disName" >
            <input class="form-control btn btn-danger" type="button" value="确定">
        </form>
        <form class="create-dis" action="index.html" method="post">
            <h5>进入聊天室</h5>
            <label for="disName">聊天室ID：</label><input v-model="chatRoomId" class="form-control" type="text" id="disName" >
            <input class="form-control btn btn-danger" type="button" value="确定" @click="submitChatRoom">
        </form>
    </div>
  </div>
</template>


<script>

  import IMSDK from '../factory/IMSdk';


  export default {
    name: 'LeftBar',
    props: [ 'userId' ],
    data () {
        return {
            showAddContent: false,
            discussName: null,
            discussNumber: null,
            chatRoomId: null  
        };
    },
    methods: {
        submitDiscuss: function($event) {
            var userIds = this.discussNumber.split(',');
            IMSDK.discussionCreate(this.discussName ,userIds, function(discussId) {
                IMSDK.discusstionDetail(discussId, function(discusstion) {
                    var content = { conversationType:2, conversationTitle:discusstion.name, targetId: discussId };
                    this.gotoChat(id, 2, content);
                }.bind(this));
            }.bind(this));
        },
        submitChatRoom: function() {
            var id = this.chatRoomId;
            IMSDK.chatRoomJoin(id, 50, function() {
                IMSDK.charRoomDetail(id, 20,  RongIMLib.GetChatRoomType.REVERSE, function(chatRoom) {
                    var content = { conversationType:4, targetId: id };
                    this.gotoChat(id, 4, content);
                }.bind(this));
            }.bind(this));
        },
        gotoChat: function(id, type, content) {
            this.$router.push({ name: 'Chat', params: { id: id, type: type, content: content } });
            this.showAddContent = false;
        },
        showBlackList: function() {
          IMSDK.showBlackList(function(list) {
            console.log(list);
            alert('黑名单成员一共有' + list.length + '个\n分别是：\n' + list.toString());
          })
        }
    }
  }
</script>

<style>
  div.left-bar {
    width: 70px;
    height: 100%;
    position: relative;
    background-color: rgb(0, 163, 255);
  }
  /* .head {
    display: inline-block;
    width: 40px;
    height: 40px;
    background-color: rgb(232, 126, 250);
    color: white;
    line-height: 40px;
    text-align: center;
    margin-top: 10px;
    border-radius: 20px;
    font-size: 1.4em;
    font-weight: 500;
  } */

  .head:hover {
      color: white;
      background-color: rgb(252, 136, 255);
      text-decoration: none;
      cursor: pointer;
  }

  .add-group-box {
      width: 100%;
      height: 70px;
      position: absolute;
      bottom: 10px;
      cursor: pointer;
  }

.add-group-box:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

  .add-group-btn {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      color: white;
      font-size: 3em;
  }

.add-group-btn:hover {
    text-decoration: none;
    color: white;
}

.add-content-box {
    padding: 20px 20px;
    position: absolute;
    width: 250px;
    text-align: left;
    bottom: 70px;
    left: 35px;
    background-color: white;
    z-index: 999;
    border-radius: 22px;
}

.black-button {
  margin-top: 20px;
}

</style>
