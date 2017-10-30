<template>
  <div class="con-content-box" @click="selectTalkChat">
    <div class="icon">{{iconName}}</div>
    <div class="con-talk">
      <p class="con-name">{{conversation.conversationTitle || conversation.targetId}}</p>
      <p class="con-text">{{lastMessageContent}}</p>
    </div>
    <p class="delete-btn unread-btn btn btn-warning" >未读数: {{unreadCount}}</p>
    <input v-show="conversation.conversationType==1 && !isInBlack" type="button" value="加黑" class="delete-btn black-btn btn btn-danger" @click="addBlackList">
    <input v-show="conversation.conversationType==1 && isInBlack" type="button" value="去黑" class="delete-btn black-btn btn btn-danger" @click="clearBlackList">
    <input type="button" value="删除" class="delete-btn btn btn-danger" @click="deleteConversation">
  </div>
</template>

<script>
  import LastMessage from '../factory/Message';
  import IMSDK from '../factory/IMSdk';
  export default {
    name: 'Conversation',
    props: ['conversation'],
    data: function () {
      return {
        unreadCount: 0,
        isInBlack: false
      };
    },
    methods: {
      selectTalkChat: function () {
          let id = this.conversation.targetId;
          let type = this.conversation.conversationType;
          this.$router.push({ name: 'Chat', params: { id: id, type: type, content: this.conversation } });
          this.clearUnreadCount();
      },
      deleteConversation: function() {
          var type = this.conversation.conversationType;
          var targetId = this.conversation.targetId;
          IMSDK.removeConversation(type, targetId, function(bool) {
              this.$router.push({ name: 'Main'});
          }.bind(this));
      },
      setupUnreadCount: function() {
        var targetId = this.conversation.targetId;
        var type = this.conversation.conversationType;
        IMSDK.getSelectUnreadCount(targetId, type, function(count) {
          console.log(count);
          this.unreadCount = count;
        }.bind(this));
      },
      clearUnreadCount: function() {
        var targetId = this.conversation.targetId;
        var type = this.conversation.conversationType;
        IMSDK.clearUnreadCount(targetId, type, function() {
          this.setupUnreadCount();
        }.bind(this));
      },
      addBlackList: function() {
        var targetId = this.conversation.targetId;
        IMSDK.addToBlacklist(targetId, function() {
          this.isInBlack = true;
        }.bind(this));
      },
      clearBlackList: function() {
        var targetId = this.conversation.targetId;
        IMSDK.clearBlackList(targetId, function() {
          this.isInBlack = false;
        }.bind(this));
      },
      setupBlackStatus: function() {
        var targetId = this.conversation.targetId;
        IMSDK.getBlacklistStatus(targetId, function(status) {
          this.isInBlack = status;
        }.bind(this))
      }
    },
    watch: {
      'conversation.latestMessage': function(newVal, oldVal) {
        this.setupUnreadCount();
      }
    },
    computed: {
      iconName: function () {
        let name = '私聊';
        switch (this.conversation.conversationType) {
          case 1:
            break;
          case 2:
            name = '讨论组';
            break;
          case 3:
            name = '群聊';
            break;
          case 4:
            name = '聊天室';
            break;
        }
        return name;
      },
      lastMessageContent: function () {
        return LastMessage.lastMessage(this.conversation.latestMessage);
      }
    },
    created: function () {
      this.setupUnreadCount();
      this.setupBlackStatus();
      console.log(this.conversation);
    }
  }

</script>

<style>
  .con-content-box {
      position: relative;
    width: 100%;
    height: 72px;
    border-bottom: 1px solid #e1e9f1;
    cursor: pointer;
  }

  /* .icon {
    float: left;
    width: 55px;
    height: 55px;
    position: relative;
    top: 7.5px;
    margin-left: 20px;
    background-color: rgb(232, 126, 250);
    border-radius: 27.5px;
    line-height: 55px;
    color: white;
    font-size: 1.4em;
    font-weight: 600;
  } */

  .con-name {
    text-align: left;
    font-size: 1.2em;
    font-weight: 600;
    margin: 5px 0 3px 0;
  }

  .con-text {
    text-align: left;
    color: rgb(142, 155, 171);
    font-size: 1.2em;
  }

  .con-talk {
    margin-left: 83px;
    overflow: hidden;
    width: 231px;
    height: 100%;
    position: relative;
  }

  .con-content-box:hover .delete-btn {
      display: inline-block;
  }

  .delete-btn {
      display: none;
      position: absolute;
      right: 5px;
      width: 40px;
      padding: 0;
      height: 30px;
      bottom: 5px;
  }

  .black-btn {
    right: 50px;
  }

  .unread-btn {
    display: inline-block;
    top: 0px;
    height: 27px;
    line-height: 27px;
    background: none;
    padding: 0 10px;
    width: auto;
    border: none;
    color: black;
    cursor: none;
  }


</style>
