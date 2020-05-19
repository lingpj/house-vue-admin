<template>
  <section class="safeConfig">
    <h2>安全设置</h2>
    <ul>
      <li>
        <div>
          <div>账户密码</div>
          <address>当前密码强度：强</address>
        </div>
        <div class="upadteBtn">
          <span @click="dialogFormVisible = true">修改</span>
        </div>
      </li>
      <li>
        <div>
          <div>密保手机</div>
          <address>已绑定手机1503892123</address>
        </div>
        <div class="upadteBtn">
          <span>修改</span>
        </div>
      </li>
    </ul>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" style="width:300px"  ></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" style="width:300px"  ></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" style="width:300px"  ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'safeComponent',

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

  methods: {}
}
</script>

<style lang='scss' scoped>
.safeConfig {
  h2 {
    margin: 0 0 30px 0;
    font-weight: normal;
    font-size: 20px;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      padding-top: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      &>div:first-child {
        flex: 1;
        color: rgba(0, 0, 0, 0.8);
        div {
          margin-bottom: 10px;
        }
      }
      address {
        font-style: normal;
        margin-bottom: 15px;
        color: rgba(0, 0, 0, 0.4);
      }
      .upadteBtn {
        padding-right: 20px;
        color: #20a0ff;
        cursor: pointer;
        span {
          position: relative;
          top: calc((100% - 18px) /2);
        }
      }
    }
  }
}
</style>
