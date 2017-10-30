<template>
  <div class="conversation-box">
    <div class="top">
        {{userId}}
        <input type="button" name="" value="清空" class="clear btn btn-danger" @click="clearConversation">
    </div>
    <div v-for="content in list">
      <conversation :conversation="content"></conversation>
    </div>

  </div>
</template>

<script>
  import conversation from './Conversation.vue';
  import IMSDK from '../factory/IMSdk';

  function getConversationList(userId, callback) {
    if (userId) {
      IMSDK.conversationList(callback);
    }
  }

  export default {
      name: 'ConversationList',
    data () {
      return {
        list: null
      }
    },
    computed: {
    },
    methods: {
        setupConversationList: function() {
            getConversationList(this.userId, function(list) {
              console.log(list);
                this.list = list;
            }.bind(this));
        },
        clearConversation: function() {
            IMSDK.clearConversations(function() {
                alert('清除成功');
                this.setupConversationList();
            });
        }
    },
    props: ['userId', 'message'],
    components: { conversation },
    created: function () {
      this.setupConversationList();
    },
    updated: function () {
      this.setupConversationList();
    },
    watch: {
      '$route': function (to, from) {
        console.log('重新获取');
          this.setupConversationList();
      }
    }
  }



</script>

<style>
  .conversation-box {
    width: 314px;
    overflow-y: scroll;
    height: 100%;
    background-color: rgb(244, 248, 252);
  }

  .top {
    border-bottom:1px solid #e1e9f1;
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: relative;
  }

  .clear {
      position: absolute;
      right: 0;
  }

</style>
