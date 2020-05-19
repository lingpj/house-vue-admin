<template>
    <el-badge class="badge" :value="count" :max="100">
        <!-- <el-button size="small" @click="notifyHandle">通知</el-button> -->
        <el-popover placement="bottom" width="400" trigger="click">
            <el-tabs class="myTabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户管理(5)" name="first">
                    <section>
                        <img src="../../assets/img/lingdang.png" alt="">
                        <div>
                            <p>今天放假</p>
                            <address>2018年10月29日10:14:27</address>
                        </div>
                    </section>
                    <div class="clearBtn">清空通知</div>
                </el-tab-pane>
                <el-tab-pane label="配置管理(2)" name="second">
                    <section>
                        <img src="../../assets/img/lingdang.png" alt="">
                        <div>
                            <p>今天放假</p>
                            <address>2018年10月29日10:14:27</address>
                        </div>
                    </section>
                    <div class="clearBtn">清空通知</div>
                </el-tab-pane>
                <el-tab-pane label="角色管理(3)" name="third">
                    <section>
                        <img src="../../assets/img/lingdang.png" alt="">
                        <div>
                            <p>今天放假</p>
                            <address>2018年10月29日10:14:27</address>
                        </div>
                    </section>
                    <div class="clearBtn">清空通知</div>
                </el-tab-pane>
            </el-tabs>
            <!-- <el-button slot="reference"> -->
            <img slot="reference" class="img" src="../../assets/img/lingdang.png" alt="">
            <!-- </el-button> -->
        </el-popover>
    </el-badge>
</template>
<script>
export default {
    data() {
        return {
            count: 10,
            activeName: 'second',
            stretch: true
        }
    },
    mounted() {

    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        notifyHandle: function() {
            this.$router.push({
                path: '/notification'
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes myfirst {
    from {
        background: #fff;
    }
    to {
        background: #eee;
    }
    
}

.img {
    width: 20px;
    cursor: pointer;
    position: relative;
    top: -8px;
}

.myTabs /deep/ {
    .el-tab-pane {
        section {
            overflow: hidden;
            border-bottom: 1px solid lightgrey;
            padding-bottom: 15px;
            &:hover {
                animation:myfirst 1s;
            }
            img {
                float: left;
                width: 30px;
                margin-top: 20px;
                margin-left: 30px;
            }
            div {
                float: left;
                margin-left: 30px;
            }
        }
        .clearBtn {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            text-align: center;
            cursor: pointer;
        }
    }
}

.myTabs /deep/ .el-tabs__nav {
    width: 100%;

    &>div:first-child~* {
        width: 33.3333%;
        text-align: center;
    }
}

.badge {
    // float: right;
    position: absolute;
    right: 110px;
    top: 15px;
    & /deep/ .el-badge__content {
        // top: 5px !important;
        // right: 15px !important;
    }
}
</style>
    