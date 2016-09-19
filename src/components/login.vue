<template>
    <div class="body-login">
        <div class="header">
            <img src="../assets/images/logo_l.png" alt="" class="logo">
        </div>
        <div class="main">
            <img src="../assets/images/bg_l.png" alt="" class="l-bg">
            <div class="l-title">
                <h2>中国东方航空</h2>
                <h1>候补值机系统</h1>
            </div>
            <div class="login">
                <div class="l-header">登 录</div>
                <form action="" method="post" id="loginForm">
                    <div class="form-group l-user" :class="{'has-error': usernameError}">
                        <input type="text" v-model="username"  @focus="handleFocus" @keyup.enter="loginCheck" name="userName" placeholder="用户名" class="form-control">
                        <div class="form-error">{{usernameErrorText}}</div>
                    </div>
                    <div class="form-group l-password" :class="{'has-error': passwordError}">
                        <input type="password" v-model="password" @focus="handleFocus" @keyup.enter="loginCheck" name="passWord" placeholder="密 码" class="form-control">
                        <div class="form-error">{{passwordErrorText}}</div>
                    </div>
                    <div class="form-group l-btn">
                        <button type="button" class="btn bg-deep-blue text-center btn-block" @click="loginCheck">登录</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="footer">
        <p>Copyright 2016 China Eastern Airline.All right reserved</p>
    </div>
    </div>
</template>

<script>
   import Vue from "vue";
   import servers from "../servers.js";
   import cookie from "../assets/commonjs/cookie";
   import popover from "../assets/commonjs/popover.js";

    export default{
        data:function(){
            return {
                username:'',               // 用户名
                usernameError: false,     // 用户名错误标记
                usernameErrorText:'*',     // 用户名错误提示信息
                password:'',            // 密码
                passwordError: false,   // 密码错误标记
                passwordErrorText:'*'   // 密码错误提示信息
            }
        },
        methods: {
            /**
             * 登录信息验证
             * @returns {boolean}
             */
            loginCheck: function () {
                var self = this;
                if(this.username === "") {
                    this.usernameError = true;
                    this.usernameErrorText = "请输入用户名";
                    return false;
                } else if(this.password === "") {
                    this.passwordError = true;
                    this.passwordErrorText = "请输入密码";
                    return false;
                } else {
                    var params = {
                        "userName": this.username,
                        "passWord": this.password
                    };
                    this.$nextTick(function () {

                        servers.doLogin(params, function (data) {
                            if(data.resultCode == 1) {
                                sessionStorage.setItem("userName", 'zhangjiapeng');
                                sessionStorage.setItem("access_token", data.resultDescription);
                                self.$route.router.go({name:"workbench"});

                            } else {
                                self.passwordError = true;
                                self.passwordErrorText = "用户名和密码不匹配";
                            }
                        });
                    });
                }

            },
            /**
             * 输入框获取焦点事件
             * @param event
             */
            handleFocus: function (event) {
                let targetName = event.target.name;
                if(targetName === "userName") {
                    this.usernameError = false;
                } else if(targetName === "passWord") {
                    this.passwordError = false;
                }
            }
        },
        watch: {
            'username': function (val, oldVal) {
                this.usernameError = false;
            },
            'password': function (val, oldVal) {
                this.passwordError = false;
            }
        },
        ready: function () {

        }
    }
</script>
<style scoped>
    .body-login {
        width: 100%;
        height: 100%;
        padding-top: 100px;
        padding-bottom: 60px;
    }
    .header,.footer{
        width: 100%;
        position: absolute;
    }
    .header{
        height: 100px;
        background: #fff;
        line-height: 100px;
        top: 0;
    }
    .header .logo{
        vertical-align: middle;
        border-right:1px solid #e7e8ea;
        padding-right:15px;
        margin-left: 45px;
    }
    .footer{
        height: 60px;
        line-height: 60px;
        background: #424348;
        bottom:0;
        color: #fff;
    }

    .main{
        height: 100%;
        position: relative;
    }
    .main .l-bg{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .footer p{
        margin-left: 100px;
    }
    .l-title,.login{
        position: absolute;
        z-index: 7;
    }
    .l-title{
        color: #fff;
        left: 190px;
        top: 90px;
    }
    .l-title h2{
        font-size: 34px;
    }
    .l-title h1{
        font-size: 50px;
        margin-top:35px;
        margin-bottom:50px;
    }
    .l-title:after{
        content: "";
        display: block;
        width: 67px;
        height: 3px;
        background: #fff;
    }
    .login{
        width: 280px;
        background: #fff;
        -webkit-border-radius:4px;
        -moz-border-radius:4px;
        border-radius:4px;
        top: 75px;
        right:100px;
        overflow: hidden;
    }
    .l-header{
        line-height: 60px;
        text-indent: 2em;
        background: #eeeff4;
        font-size: 16px;
    }
    .login form{
        width: 80%;
        margin: 50px auto;
    }
    .login .form-group{
        margin-bottom:25px;
    }
    .login .form-control {
        padding-right: 33px;
    }
    .login .btn{
        margin-top:20px;
    }
    .l-user,.l-password{
        position: relative;
    }
    .l-user:after,.l-password:after{
        content: "";
        display: block;
        position: absolute;
        width: 32px;
        height: 32px;
        right:1px;
        top:1px;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #eeeff4;
    }
    .l-user:after{
        background-image: url("../assets/images/user.png");
    }
    .l-password:after{
        background-image: url("../assets/images/password.png");
    }
    .form-error {
        color: #a94442;
        visibility: hidden;
    }
    .has-error .form-error {
        visibility: visible;
    }
</style>
