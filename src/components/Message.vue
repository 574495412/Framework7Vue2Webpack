<template>
    <div class="chat-talk">
        <div class="talk-head">
            {{message.senderUserId}}
        </div>
        <div class="talk-content">
            <p class="talk-title">{{message.senderUserId}}</p>
            <p class="talk-text" v-if="message.messageType=='TextMessage'">
                {{message.content.content}}
            </p>
            <div class="talk-text" v-if="message.messageType=='VoiceMessage'">
                <div class="voice-talk" @click="playVoice(message)">
                    点击播放声音
                </div>
            </div>
            <div class="talk-text" v-if="message.messageType=='ImageMessage'">
                <img class="image-text" :src="message.content.imageUri" >
            </div>
            <div class="talk-text" v-if="message.messageType=='FileMessage'">
                <a :href="message.content.fileUrl" :download="message.content.name">{{message.content.name}}</a>
            </div>
            <p class="talk-text" v-if="message.messageType=='DiscussionNotificationMessage'">
                {{getDiscussionNotificationMessage}}
            </p>

        </div>
    </div>

</template>

<script>

import IMSDK from '../factory/IMSdk';

export default {
    name: 'Message',
    data: function() {
        return {

        }
    },
    props: ['message'],
    methods: {
        playVoice: function(message) {
            var audioFile = message.content.content;
            var duration = message.content.duration;
            IMSDK.playVoice(audioFile, duration);
        }
    },
    created: function() {
        
    },
    computed: {
        getDiscussionNotificationMessage: function() {
            var prompt = '一条讨论组消息';
            switch (this.message.content.type) {
                case 1:
                    prompt = '新加入成员：' + this.message.content.extension;
                    break;
            };
            return prompt;
        }
    }
}
</script>

<style lang="css">
.chat-talk {
    width: 100%;
    min-height: 48px;
    margin: 25px 0;
    text-align: left;
}
.image-text {
    max-width: 120px;
    max-height: 120px;
}

</style>
