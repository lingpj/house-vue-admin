<template>
    <div class="container">
        <div>当前消息总计
            <span>124</span> 条，未读
            <span>5</span> 条</div>
        <ul>
            <li @click="msgClickHandle">
                <el-row>
                    <el-col :span="6" class="box">
                        <div class="status">●</div>
                        <div class="title">支付成功通知</div>
                    </el-col>
                    <el-col :span="10" class="box">
                        <div class="company">上海园阿萨德啊大时代阿萨 </div>
                        <div class="time">2018年10月25日15:23:05</div>
                    </el-col>
                    <el-col :span="8" class="box">
                        &nbsp;
                        <div class="arrow">></div>
                    </el-col>
                </el-row>
            </li>
        </ul>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <p style="text-indent:2rem;line-height:200%;">上海园阿萨德啊大时代阿萨啊 已于 2018年10月25日16:21:00支付账单，账单编号：
                <span style="color:blue">asd812983j123asd87qwe</span>，点击
                <span @click="detailClickHandle" style="color:blue;cursor:pointer">详情</span>查看账单情况
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
        }
    },
    methods: {
        // 消息点击
        msgClickHandle: function() {
            this.dialogVisible = true
        },
        // 详情查看
        detailClickHandle:function(){
            
        }
    },
    mounted() {

    }
}
</script>
<style lang="scss" scoped>
.container {
    padding: 20px;
    &>div:first-child {
        border: 1px solid lightgray;
        padding: 30px 20px;
        span {
            color: blue;
            font-size: 18px;
        }
    }
    ul {
        margin-top: 30px;
        border: 1px solid lightgray;
        padding: 30px 20px;
        list-style: none;
        min-height: 500px;
        li {
            position: relative;
            border-bottom: 1px solid lightgray;
            padding: 10px;
            .title {
                margin-left: 30px;
            }
            .box {
                div {
                    float: left;
                }
                position: relative;
            }
            .arrow {
                position: absolute;
                top: calc((100% - 18px)/2);
                left: 0;
            }
            &:hover {
                color: #20a0ff;
                cursor: pointer;
                background-color: #eee;
            }
        }
        li:first-child~* {
            margin-top: 20px;
        }
    }
}
</style>


