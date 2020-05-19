<template>
    <section>
        <h2>基本设置</h2>
        <div class="inner-box">
            <el-form ref="form" :model="form">
                <el-form-item>
                    <div class="label">姓名</div>
                    <el-input style="width:300px" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="label">性别</div>
                    <el-input style="width:300px" v-model="form.sex"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="label">邮箱</div>
                    <el-input style="width:300px" v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="label">电话</div>
                    <el-input style="width:300px" v-model="form.mobilePhone"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="label">个人简介</div>
                    <el-input type="textarea" style="width:300px" v-model="form.description"></el-input>
                </el-form-item>
                <el-button type="primary">确定</el-button>
            </el-form>
            <div class="avatar">
                <div>头像</div>
                <img src="../../../assets/img/lingdang.png" alt="">
                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </div>
        </div>

    </section>
</template>

<script>
import fetch from '../../../utils/fetch'
import * as api from '../../../api/admin/user'
export default {
    name: 'baseComponent',

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
       
        api.getObj(this.$store.getters.id).then((res) => {
            for (var key in this.form) {
                this.form[key] = res.data[key]
            }
            console.log(this.form)
        }).catch(() => {

        })
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
