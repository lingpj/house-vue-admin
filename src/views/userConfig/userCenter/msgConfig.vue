<template>
    <section>
       <h2>消息设置</h2>
       暂无消息
    </section>
</template>

<script>
export default {
    name: 'msgComponent',

    data() {
        return {
        }
    },

    methods: {}
}
</script>

<style lang='scss' scoped>
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
</style>
