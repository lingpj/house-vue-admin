<template>
    <div class="container">
        <ul class="title">
            <li @click="titleHandle(1)" :class="{active : actived =='1'}">基本设置</li>
            <li @click="titleHandle(2)" :class="{active : actived =='2'}">安全设置</li>
            <li @click="titleHandle(3)" :class="{active : actived =='3'}">新消息通知</li>
        </ul>
        <section>
            <div v-if="actived =='1'">
                 <baseComponent></baseComponent>
            </div>
            <div v-if="actived =='2'" class="safeConfig">
                <safeComponent></safeComponent>
            </div>
            <div v-if="actived =='3'">
                <msgComponent></msgComponent>
            </div>
        </section>
       
    </div>
</template>

<script>

import baseComponent  from './baseConfig'
import msgComponent   from './msgConfig'
import safeComponent  from './safeConfig'
export default {
    name: '',
    components:{baseComponent,msgComponent,safeComponent},
    data() {
        return {
            actived: '1',
            form: {
                name: '',
                email: '',
                description: '',
                sex: '',
                mobilePhone: ''
            },
            dialogFormVisible: false,
            formLabelWidth: '100px'
        }
    },
    mounted() {
        
    },
    methods: {
        titleHandle: function(n) {
            this.actived = n + ''

        }
    }
}
</script>

<style lang='scss' scoped>
@keyframes myAnima {
    from {
        border-right: 2px solid #fff;
    }
    to {
        border-right: 2px solid #20a0ff;
    }
}



.active {
    color: #20a0ff !important;
    border-right: 2px solid #20a0ff;
    background-color: #e6f7ff;
    animation: myAnima 1s;
}

.container {
    background-color: #fff; // padding: 20px;
    border: 20px solid #eee;
    padding: 20px;
    display: flex;
    &>ul {
        list-style: none;
        margin: 0;
        padding: 0;
        border-right: 1px solid #eee;
        li {
            font-size: 14px;
            padding: 10px; // text-align: right: ;ght;
            color: rgba(0, 0, 0, 0.65);
            cursor: pointer;
            &:hover {
                color: #20a0ff;
            }
        }
    }
    .title {
        width: 200px;
    }
    section {
        flex: 1;
        padding-left: 50px; // height: 500px;
        .label {
            color: rgba(0, 0, 0, 0.65);
        }
        h2 {
            margin: 0 0 30px 0;
            font-weight: normal;
            font-size: 20px;
        }
        .inner-box {
            display: flex;
            .avatar {
                flex: 1;
                padding: 10px 0 0 100px;
            }
        }
    }
}
</style>
