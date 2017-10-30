<template>
  <div class="main-box" id="app">
    <left-bar :user-id="userId" class="left"></left-bar>
    <conversation-list :message="message" :user-id="userId" class="main-con"></conversation-list>
    <chat :receiveMessage="message" class="chat"></chat>
  </div>
</template>


<script>
  import leftBar from './LeftBar.vue';
  import conversationList from './ConversationList.vue';
  import chat from './Chat.vue';
  import IMSDK from '../factory/IMSdk'
  export default {
    data: function () {
      return {
        userId: null,
        message: null
      }
    },
    components: { leftBar, conversationList, chat },
    created: function () {
        IMSDK.create(function (message) {
            this.message = message;
        }.bind(this), function (userId) {
            this.userId = userId;
        }.bind(this));
    }
  };
</script>

<style>
  .main-box {
    width: 100%;
    height: 100%;
  }
  .left {
    float: left;
  }
  .main-con {
    float: left;
  }

  .chat {
    margin: 0 0 0 384px;
    width: auto;
  }

</style>
