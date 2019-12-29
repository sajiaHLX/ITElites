<template>
  <div class="login">
    <form action="index.html" class="login-form">
      <h1>Login</h1>
      <span id="tip" style="color:red;"></span>
      <div class="txtb txtbfirst">
        <input type="text" id="nameInput">
        <span data-placeholder="User"></span>
      </div>
      <div class="txtb txtbsecond">
        <input type="text" id="passwordInput">
        <span data-placeholder="passWord"></span> 
      </div>
      <input @click="submitBtn()" type="button" class="submitBtn" value="Login">
    </form>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    data() {
      return {
        isshow:false,
        loginForm:{
          username:null,
        }
      }
    },
    methods: {
      //用户登录验证
      submitBtn() {
        var username = $("#nameInput").val();
        var password = $("#passwordInput").val();
        if (username == '') {
          document.getElementById('tip').innerHTML = "用户名不能为空";
          return false;
        }
        if (password == '') {
          document.getElementById('tip').innerHTML = "密码不能为空";
          return false;
        }
        if (username == "admin" && password == "admin") {
          this.loginForm.username = username;
          this.$store.commit('$_setStorage', {user: this.loginForm.username});
          this.$store.commit('$_setLogin', '1');
          this.$router.push('/backstage');
        } else {
          document.getElementById('tip').innerHTML = "用户名或密码错误";
          return false;
        }
        return false
      },

    },
    mounted () {
      //动态绑定属性
      $(document).ready(function () {
        $(".txtb input").on("focus", function () {
          $(this).addClass("focus");
        });
        $(".txtb input").on("blur", function () {
          if ($(this).val() == "")
            $(this).removeClass("focus");
        });
      })
    }
  }
</script>
<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .login{
    width: 100%;
    /* height: calc(100% - 58px); */
    /* height: calc(100vh - 62px); */
    height: 100vh;
    position: relative;
    background: linear-gradient(120deg, #D4DFE6, #8EC0E4, #CADBE9, #6AAFE6);
  }
  .login-form {
    width: 300px;
    background: #f1f1f1;
    height: 400px;
    padding: 30px 40px;
    border-radius: 10px;
    position: relative; 
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .login-form h1 {
    margin-top: 50px;
    text-align: center;
  }

  .txtb {
    border-bottom: 2px solid #dddddd;
    position: relative;
    margin: 25px 0;
  }

  .txtbfirst {
    margin-top: 50px;
  }
  .txtbsecond {
    margin-top: 40px;
  }
  .txtb input {
    font-size: 16px;
    color: #333333;
    border: none;
    width: 100%;
    outline: none;
    background: none;
    padding: 0 5px;
    height: 35px;
  }

  .txtb span::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 50%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    z-index: -1;
    transition: .5s;
  }

  .txtb span::after {
    content: "";
    position: absolute;
    margin: 0 auto;
    width: 0%;
    height: 2px;
    background: linear-gradient(120deg, #D4DFE6, #8EC0E4, #CADBE9, #6AAFE6);
  }

  .focus+span::before {
    top: -5px;
  }

  .focus+span::after {
    width: 100%;
  }

  .submitBtn {
    display: block;
    width: 70%;
    height: 50px;
    margin: 50px auto 0;
    border: none;
    background: linear-gradient(120deg, #D4DFE6, #8EC0E4, #CADBE9, #6AAFE6);
    background-size: 200%;
    color: #ffffff;
    outline: none;
    cursor: pointer;
    transition: .5s;
  }

  .submitBtn:hover {
    background-position: right;
  }

  #tip {
    position: absolute;
    top: 28%;
    left: 12%;
  }

  @media screen and (max-width: 759px){
    .login-form{
      width: 50%;
      /* height: 45%; */
      height: auto;
    }
    .login-form h1{
      margin-top: 10%;
    }
    #tip{
      left: 18%;
    }
    .submitBtn{
      width: 60%;
      height: 40px;
      margin-top: 25%;
    }
  }
  @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
	/*兼容IE11*/
    .txtb span::after {
      content: "";
      position: absolute;
      left: -300px;
      margin: 0 auto;
      width: 0%;
      height: 2px;
      background: linear-gradient(120deg, #D4DFE6, #8EC0E4, #CADBE9, #6AAFE6);
    }
  }
</style>