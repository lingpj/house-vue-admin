<template>
    <div class='container'>
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="商品名称" prop="productName">
                <el-input style="width:400px" v-model="form.productName"></el-input>
            </el-form-item>
            <el-form-item label="商品简介" prop="productIntro">
                <el-input style="width:400px" v-model="form.productIntro"></el-input>
            </el-form-item>
            <el-form-item label="现价" prop="currentPrice">
                <el-input type="number" style="width:400px" v-model="form.currentPrice"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="originalPrice">
                <el-input type="number" style="width:400px" v-model="form.originalPrice"></el-input>
            </el-form-item>
            <el-form-item label="库存数量" prop="repertory">
                <el-input type="number" style="width:400px" v-model="form.repertory"></el-input>
            </el-form-item>
            <el-form-item label="商品类别" prop="typeId">
                <el-select style="width:400px" v-model="form.typeId" placeholder="请选择商品类别">
                    <el-option v-for="item in productTypeList" :key="Math.random()" :label="item.typeName" :value="item.typeName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上架时间" prop="starttime">
                <el-date-picker v-model="form.starttime" type="datetime" placeholder="选择上架时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="下架时间" prop="endtime">
                <el-date-picker v-model="form.endtime" type="datetime" placeholder="选择下架时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="服务园区" prop="servicePark">
                <el-select style="width:400px" v-model="form.servicePark" placeholder="请选择服务园区">
                    <el-option v-for="item in serviceParkList" :key="Math.random()" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品轮播图">
                <el-upload :auto-upload="true" :file-list="fileList" :on-remove="uplaodRemoveHandle" :on-error="uploadErrorHandle" :on-success="uploadSuccessHandle" list-type="picture-card" :data="{productCode:this.productCode}" ref="imgUpload" :action="action">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="商品描述" prop="productDesc">
                <editor :productCode="productCode" :defaultContent="defaultContent" ref="wangEditor"></editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit('form')">发布</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="提示" :visible.sync="dialogVisible" :before-close="beforeCloseHandle" width="30%">
            <span>商品已生成二维码可供预览，确认无误点击确定上传。</span>
             <div class="QRCodeDialogVisible">
            </div> 
            <span slot="footer" class="dialog-footer">
                <el-button @click="certainUplaod(1)">取 消</el-button>
                <el-button type="primary" @click="certainUplaod(2)">确 定</el-button>
            </span>
        </el-dialog>
        <a id="qrcode" ref="qrcode"></a>

    </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import Editor from './Editor'
import config from '../config'
import createUniqueString from '../../../utils/createUniqueString.js'
export default {
    name: '',
    components: { Editor },
    data() {
        return {
            productTypeList:[],
            serviceParkList:[],
            form: {
                productName: '',
                currentPrice: '',
                productDesc: '',
                originalPrice: '',
                repertory: '',
                typeId: '',
                
                servicePark: '',
                
                typeName: '',
                starttime: new Date(),
                endtime: new Date(),
                productIntro: '',
            },
            rules: {
                productName: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                ],
                productIntro: [
                    { required: true, message: '请输入商品简介', trigger: 'blur' },
                    { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                currentPrice: [
                    { required: true, message: '请输入现价', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                repertory: [
                    { required: true, message: '请输入库存', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                originalPrice: [
                    { required: true, message: '请输入原价', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                servicePark: [
                    { required: true, message: '请选择园区', trigger: 'change' }
                ],
                typeId: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                ],
                starttime: [
                    { type: 'date', required: true, message: '请选择上架时间', trigger: 'change' }
                ],
                endtime: [
                    { type: 'date', required: true, message: '请选择下架时间', trigger: 'change' }
                ],
            },
            action: process.env.shop_api + '/file/uploadPicture',
            uploadMoreData: {},
            defaultContent: '',      // 编辑器默认值
            arr: ['会议室', '保洁', '送水'],
            filePathArr: [],               // 已上传文件列表
            productCode: '',            // 商品唯一code
            certainUploadProduct: '',
            dialogVisible: false,
            isAddOperation: true,
            fileList: [],
            removeList: [],
        }
    },

    mounted() {
        this.getParkList()
        this.getProductTypeList()
        // productCode 前端生成商品唯一code
        // 每次页面初始化时创建，出现二维码时，重新获取。编辑时：获取已有的。放弃添加，重新获取。
        this.isAddOperation = this.$route.query.productCode ? false : true
        console.log(this.$route.query)
        if (!this.isAddOperation) {
            for (var k in this.form) {
                this.form[k] = this.$route.query[k] + '' || ''
            }
            this.form.starttime = new Date(this.form.starttime)
            this.form.endtime = new Date(this.form.endtime)
            this.form.typeId = this.$route.query.typeName
            this.defaultContent = this.$route.query.productDesc
            this.productCode = this.$route.query.productCode
            this.getEditUploadedImg()
        } else {
            this.productCode = createUniqueString()
        }
    },
    watch: {

    },
    methods: {
        // dialog关闭，刷新商品code
        beforeCloseHandle:function(done){
            this.productCode = createUniqueString()
            done()
        },
        // 商品类别下拉list
        getProductTypeList:function(){
            this.$fetch({
                url: process.env.shop_api + '/shopProductType/all',
                method: 'get',
                params: {}
            }).then((res) => {
                console.log(res)
                this.productTypeList = res
            })
        },
        // 服务园区下拉list
        getParkList:function(){
            this.$fetch({
                url: process.env.shop_api + '/parkInfo/all',
                method: 'get',
                params: {}
            }).then((res) => {

                this.serviceParkList = res
                this.serviceParkList.push({name:'全部'})
            })
        },
        // 二维码预览
        previewQr: function(id) {

            $('#qrcode').empty()
            let qrcode = new QRCode('qrcode', {
                width: 200,  // 二维码宽度 
                height: 200, // 二维码高度
                text: config.previewImageUrl+'/pmall/#/goodsDetail?fakeId=' + id
            })
            this.$nextTick(function(){
                var imgDom = this.$refs.qrcode
                $('.QRCodeDialogVisible').append($(imgDom))
            })
        },
        // 删除已上传图片
        uplaodRemoveHandle: function(file, fileList) {

            // var index = fileList.indexOf(file)
            if (file.status == 'success' && ((typeof file.name) == 'number')) {
                this.removeList.push(file.name)
            }
        },
        // 图片上传成功
        uploadSuccessHandle: function(response, file, fileList) {
            console.log('成功', response, file, fileList)
            this.filePathArr.push(response.file_name)
            this.$message({
                type: 'success',
                message: '图片上传成功'
            });
        },
        // 图片上传失败
        uploadErrorHandle: function(err, file, fileList) {
            console.log('失败', err, file, fileList)
            this.$message({
                type: 'error',
                message: '图片上传失败'
            });
        },
        submit: function(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    // 校验上下架时间
                    if (this.form.starttime.getTime() > this.form.endtime.getTime()) {
                        this.$message({
                            type: 'error',
                            message: '开始时间不能大于结束时间！'
                        });
                        return
                    }
                    // 校验图片数量
                    var arr = this.$refs.imgUpload.uploadFiles
                    if (arr.length < 1) {
                        this.$message({
                            type: 'error',
                            message: '请至少插入一张商品图片！'
                        });
                        return
                    }
                    // 参数
                    this.certainUploadProduct = {}
                    this.$myLoading.show()
                    var fullText = this.$refs.wangEditor.getContent() == '' ? this.defaultContent : this.$refs.wangEditor.getContent()
                    var url = process.env.shop_api + '/shopTranscriptProduct/addshopTranscriptProduct'
                    var method = 'POST'
                    var path = this.$refs.imgUpload.uploadFiles.filter((item) => {
                        if (item.response) {
                            return true
                        }
                        return false
                    }).map(item => item.response.file_name)
                    // 编辑
                    if (this.isAddOperation == false) {
                        url = process.env.shop_api + '/shopProduct/updateShopProduct'
                        method = 'post'

                    }

                    this.$fetch({
                        url: url,
                        method: method,
                        data: {
                            id: (this.$route.query.id + '') || '',
                            token: this.$store.getters.token,
                            productName: this.form.productName,
                            productIntro: this.form.productIntro,
                            originalPrice: this.form.originalPrice + '',
                            repertory: this.form.repertory + '',
                            servicePark: this.form.servicePark+ '',
                            currentPrice: this.form.currentPrice + '',
                            starttime: this.form.starttime.format('yyyy-MM-dd hh:mm:ss'),
                            endtime: this.form.endtime.format('yyyy-MM-dd hh:mm:ss'),
                            typeId: this.arr.indexOf(this.form.typeId) + '',
                            typeName: this.form.typeId + '',
                            productDesc: fullText,
                            path: path,
                            productCode: this.productCode + '',
                            removeList: this.removeList,
                            merchantId: (this.$route.query.merchantId + '') || '',
                            merchantName: this.$route.query.merchantName || '',
                            statusId: (this.$route.query.statusId + '') || '',
                            statusName: this.$route.query.statusName || '',
                        }
                    }).then((res) => {
                        this.$myLoading.hide()
                        if (res.code == 200 || res.status == 200) {
                            if (this.isAddOperation) {
                                this.certainUploadProduct = res.data.entity
                                this.dialogVisible = true
                                // 生成二维码
                                this.previewQr(res.data.entity.id)
                            } else {
                                this.$alert('商品更新成功！', '提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {

                                        this.$router.push('/productManager/searchProduct')
                                    }
                                });
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    }).catch((err) => {
                        this.$myLoading.hide()
                        this.$message({
                            type: 'error',
                            message: err
                        });
                    })
                } else {
                    this.$message({
                            type: 'error',
                            message: '*为必填项，不能为空！'
                    });
                    return false;
                }
            });
        },
        // 确认上传
        certainUplaod: function(n) {
            this.productCode = createUniqueString()
            if (n == 1) {
                this.dialogVisible = false
            } else {
                this.$fetch({
                    url: process.env.shop_api + '/shopProduct/',
                    method: 'Post',
                    data: this.certainUploadProduct
                }).then((res) => {
                    if (res.status == 200) {
                        this.dialogVisible = false
                        this.$alert('商品添加成功！', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                location.reload()
                            }
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                }).catch((err) => {
                    this.dialogVisible = false
                    this.$message({
                        type: 'error',
                        message: err
                    });
                })
            }
        },
        // 获取编辑操作的图片
        getEditUploadedImg: function() {

            this.$fetch({
                url: process.env.shop_api + '/shopProductPicture/listShopProductPicture',
                method: 'get',
                params: {
                    productCode: this.productCode
                }
            }).then((res) => {
                console.log(res)
                res.data.forEach((item) => {
                    this.fileList.push({
                        name: item.id,
                        url: item.prefix + item.path
                    })
                })
            }).catch((err) => {
                this.dialogVisible = false
                this.$message({
                    type: 'error',
                    message: err
                });
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.container {
    background-color: #fff;
    .QRCodeDialogVisible{
        text-align: center;
        margin:10px;
    }
    & /deep/ .w-e-text-container {
        z-index: 1000 !important;
    }
    & /deep/ .w-e-menu {
        z-index: 1000 !important;
    }
    & /deep/ .el-date-editor--datetime {
        width: 400px;
    }
    & /deep/ .el-dialog__wrapper {
        z-index: 10002 !important;
    }

    & /deep/ label {
        font-weight: 500;
    }
    border: 20px solid #eee;
    padding-top: 10px;
}
</style>
