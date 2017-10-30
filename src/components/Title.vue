<template lang="html">
<div class="title">
    <div class="discusstion-title" v-show="conversation ? conversation.conversationType==2 : false">
        <input class="title-btn" type="button" value="退出" @click="quitChatRoom" ><input class="title-btn title-join" type="button" value="添加" @click="showAddNumber=!showAddNumber"><input class="title-btn title-detail" type="button" value="详情" @click="showDiscussDetail">
        <div class="showAddContent show-add-number" v-show="showAddNumber">
            <label for="disNumber">成员：</label><input type="text" id="disNumber" class="form-control number" v-model="addNumber" >
            <input class="form-control btn btn-danger" type="button" value="创建" @click="joinDiscussNumber">
        </div>
    </div>
    <span class="title-name">{{title}}</span>
</div>
</template>

<script>

import Message from '../factory/Message';
import IMSDK from '../factory/IMSdk'
export default {
    name: 'Title',
    data: function() {
        return {
            showAddNumber:false,
            addNumber: null
        };
    },
    methods: {
        quitChatRoom: function() {
            var discussionId = this.$route.params.id;
            IMSDK.discusstionQuit(discussionId, function() {
                this.$router.push('Main');
            }.bind(this));
        },
        showDiscussDetail: function() {
            var discussionId = this.$route.params.id;
            IMSDK.discusstionDetail(discussionId, function(discusstion) {
                alert('讨论组名称：' + discusstion.name + '\n讨论组成员：' + discusstion.memberIdList.toString() + '\n讨论组人员总数：' + discusstion.memberIdList.length);
            })
        },
        joinDiscussNumber: function() {
            var userIds = this.addNumber.split(',');
            var discussionId = this.$route.params.id;
            IMSDK.discusstionAdd(discussionId, userIds, function() {
                this.showAddNumber = false;
            })
        }
    },
    props: ['conversation'],
    computed: {
        title: function() {
            var conversation = this.conversation;
            console.log(conversation);
            return conversation ? Message.chatTitle(conversation.conversationType, conversation.conversationTitle || conversation.targetId) : null;
        }
    }
}
</script>

<style lang="css">
.title-btn {
    position: absolute;
    left: 10px;
    width: 45px;
    height: 45px;
    border-radius: 22.5px;
    text-align: center;
    cursor: pointer;
    top: 4px;
    border: solid rgb(240, 240, 240);
    text-decoration: none;
    line-height: 43px;
    color: white;
    padding:0;
}
.title-join {
    left: 60px;
}

.title-detail {
    left: 110px;
}
.show-add-number {
    width: 250px;
    background-color: white;
    z-index: 999;
    position: absolute;
    top: 50px;
    left: 80px;
    border-radius: 30px;
}

.number {
    display: inline-block;
    width: auto;
}
.discusstion-title {

}

</style>
