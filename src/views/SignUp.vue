<template>
  <div>
    <!-- <div class="errMessage" ref="errMessage">{{errMessage}}</div> -->
    <Nav class="naxbox">
      <span slot="smallTitle">注册系统</span>
    </Nav>
    <div class="container">
      <div class="title">{{message}}</div>
      <div class="signUp">
        <!-- 表单部分 -->
        <div class="signForm">
          <div class="errMessage" ref="errMessage"></div>
            <form action="index.html" class="login-form">
              <div class="form-group">
                <label class="formlabel" for="snoInput">请先输入你的学号<br>
                  <span>（输入学号后请等一等...）</span>
                </label>
                <input v-model="sno" class="fromControl" type="text" name="snoInput" id="snoInput" placeholder="请输入你的学号">
              </div>
              <div class="form-group">
                <label for="UserFirstNeed" class="groupfirst formlabel">你最想进哪个组吖?</label>
                <div class="seGroup">
                  <select v-model="UserFirstNeed" name="UserFirstNeed" id="UserFirstNeed" class="fromControl" data-max-width="400">
                    <option v-for="(item,index) in group" :value="item" :key="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="UserSecondNeed" class="groupsecond formlabel">其次想进哪个组吖?</label>
                <div class="seGroup">
                  <select v-model="UserSecondNeed" name="UserSecondNeed" id="UserSecondNeed" class="fromControl">
                    <option v-for="(item,index) in group" :value="item" :key="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="userSay" class="formlabel">有没有什么想说的?</label>
                <textarea v-model="userSay" name="userSay" id="userSay" cols="30" rows="10" class="fromControl" placeholder="说说你的个人想法，随意发挥，不做要求">
                </textarea>
                <div id="wordNum">
                  <span>{{wordNum}}/50</span>
                </div>
              </div>
            </form>
          <div class="submitBtn1">
            <input type="button" class="submitBtn" @click="stuSubmit();" value="我确定啦">
          </div>
        </div>
        
        <div class="adminlogin" @click="adminlogin()">管理员登录</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Nav from '../components/Nav'
  import axios from 'axios'
  axios.defaults.baseURL='http://106.15.206.229'
  axios.defaults.headers.post['Content-Type'] = 'application/JSON'
  export default {
    name: 'signUp',
    components: {
      Nav
    },
    data() {
      return {
        stu:{},
        sno:'',
        errMessage:'',
        timer:null,
        message:'欢迎加入IT培优',
        team: ['编程组', '美工组'],
        selected: '编程组',
        UserFirstNeed:'',
        UserSecondNeed:'',
        userSay:'',
        userteam:'',
        group:[],
        code: ["Swift小组","嵌入式小组","信息安全小组","Web前端小组","Java小组","Python小组","ACM小组","C#小组"],
        artwork: ["平面组","视频编辑小组"],
        wordNum:0,
      }
    },
    methods: {
      adminlogin(){
        this.$router.push('/login')
      },

      //对输入的学号进行判断
      isSno(str) {
        var reg = /^[2][0-9]{9}$/;
        return reg.test(str);
      },

      // 提交信息
      stuSubmit(){
        if(!this.isSno(this.sno)){
          this.toast('请输入正确的学号');
          return false;
        }
        this.stu.number = this.sno
        if(this.UserFirstNeed!=''){
          this.stu.groupOne = this.UserFirstNeed
        }else{
          this.toast('请选择第一志愿');
          return false;
        }
        if(this.UserSecondNeed!=''){
          this.stu.groupTwo = this.UserSecondNeed
        }else{
          this.toast('请选择第二志愿');
          return false;
        }
        if(this.userSay!=''){
          this.stu.desc = this.userSay
        }else{
          this.toast('你对IT培优没有想法？');
          return false;
        }
        axios({
          method:'post',
          url:'/apply/add',
          data:this.stu,
        }).then((data)=>{
          if(data.data.code);
          this.toast('欢迎加入IT培优，希望你在IT培优中能够继续努力学习！');
        }).catch(()=>{
          this.toast('当前网络状态不佳，请稍后再试！');
          console.log("失败");
        })
        return false;
      },

      // 弹出框
      toast(mess){
        this.errMessage=mess;
        let toast=this.$refs.errMessage;
        toast.className='errMessage';
        setTimeout(()=>{
          toast.className+=' errMessageToast'
          toast.innerHTML=this.errMessage;
        },500)
      }
    },
    // 对学号输入进行监听
    watch: {
      sno:{
        handler(newVal,oldval){
          if(this.timer){
            clearTimeout(this.timer)
          }
          if(this.isSno(this.sno)){
            this.timer=setTimeout(()=>{

              var url='http://106.15.206.229/apply/search/'+this.sno;
              axios.get(url,{
              }).then((data)=>{
                console.log(data);
                if(data.data.code==200){
                  this.toast("接下来的选择请慎重哦！");
                  this.userteam=data.data.data.team;
                  if (this.userteam==1) {
                    this.group=this.code
                  } else if (this.userteam == 2) {
                    this.group=this.artwork
                  }
                }else{
                  this.group=null;
                  this.toast(data.data.message);
                }
              })
            },1000)
          }
        }
      },
      userSay:{
        handler(newVal,oldval){
          this.wordNum=this.userSay.length;
          if(this.wordNum>=50){
            this.userSay=this.userSay.slice(0,50);
            // console.log(this.userSay.slice(0,50));
          }
        }
      }
    }
  }
</script>
<style scoped>
  .container{
    position: relative;
    width: 90%;
    height: auto;
    /* background: #2b90d9; */
    margin: 10px auto 10px;
    border: 2px solid #d9e1e8;
  }
  .title{
    width: 100%;
    height: 50px;
    font-size: 20px;
    /* margin: 30px; */
    line-height: 50px;
    text-align: center;
    color: #337ab7;
    background: #d9e1e8;
    /* padding:0 30px; */
  }
  .signUp{
    width: 100%;
  }
  .signForm{
    /* width: 200px; */
    padding: 15px 10%;
  }
  .errMessage{
    /* display: none; */
    width: 25%;
    height: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #555;
    color: #fff;
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    opacity: 0;
    
  }
  .errMessageToast{
    animation: myfirst 3s;
  }
  @keyframes myfirst
  {
    0% {opacity: 0;}
    25% {opacity: 1; z-index: 9999}
    50% {opacity: 1; z-index: 9999}
    75% {opacity: 1; z-index: 9999}
    100% {opacity: 0; z-index: 0}
  }
  .form-group{
    width: 70%;
    margin: 0 auto 25px;
  }
  .form-group span{
    font-size: 8px;
  }
  .formlabel{
    max-width: 200px;
    position: relative;
    float: left;
    width: 50%;
    text-align: center;
    margin-top: 5px;
    margin-right: 15px;
  }
  .fromControl{
    max-width: 550px;
    box-sizing: border-box;
    /* position: relative; */
    display: block;
    width: 90%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    color: #555;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    /* float: right; */
  }
  .submitBtn{
    display: block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    background: #337ab7;
    /* width: 80px; */
    display: inline-block;
    padding: 6px 15px;
    font-size: 14px;
    font-weight: 400;
    line-height: 32px;
    text-align: center;
    white-space: nowrap;
    /* vertical-align: middle; */
    cursor: pointer;
    touch-action: manipulation;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
  }
  .submitBtn:hover{
    background: #204d74;
  }
  #userSay{
    height: 80px;
    resize:none;
  }
  #wordNum{
    position: relative;
    /* left: 50%; */
    width: 30px;
    font-size: 8px;
    /* right: 30%; */
    left: 75%;
    /* margin-top: -12px ; */
    /* margin-left: 600px; */
    /* margin-left: 70%; */
  }
  .adminlogin{
    width: 80px;
    font-size: 10px;
    user-select: none;
    cursor: pointer;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    margin-top: -5px;
    margin-bottom: 5px;
  }

  @media screen and (max-width: 759px) {
    .container{
    margin: 10px auto 30px;
    }
    .errMessage{
      width: 50%;
    }
    .fromControl{
      width: 100%;
      padding: 6px 12px;
      font-size: 15px;
      color: #555;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      float: none;
    }
    .form-group{
      width: 100%;
    }
    .formlabel{
      width: 70%;
      margin-top: 0px;
      /* float: left; */
      text-align: left;
      margin-bottom: 10px;
    }
    #userSay{
      height: 100px;
    }
    #wordNum{
      /* margin-left: 93%; */
      left: 90%;
    }
    .submitBtn{
      position: relative;
      left: 50%;
      top: 20px;
      transform: translate(-50%,-50%);
    }
    .adminlogin{
      position: relative;
      font-size: 10px;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      /* margin: 0 auto; */
    }
  }
</style>