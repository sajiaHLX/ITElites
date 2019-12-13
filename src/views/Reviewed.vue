<template>
  <div>
    <Nav class="naxbox">
      <span slot="smallTitle">组长审核</span>
    </Nav>
    <div class="container">
      <div class="errMessage" ref="errMessage">{{errMessage}}</div>
      <div class="title">
        {{message}}
      </div>
      <div class="serch">
        <div class="serchGroup">

          <span>Team</span>
          <select class="team userselect" v-model="selected1">
            <option v-for="(item,index) in team" :value="item.name" :key="index">{{item.name}}</option>
          </select>
          <span>学号</span>
          <input ref="sno" class="sno" type="text" placeholder="输入学号具体查询">
          <input type="submit" value="搜索" class="submit1 submit" @click="serch($event)">
          <input type="submit" value="添加" class="submit2 submit" @click="add($event)">
          <input type="submit" value="插入" class="submit3 submit" @click="insert($event)">
        </div>
      </div>
      <table class="serchList">
        <thead>
          <tr>
            <th></th>
            <th>姓名</th>
            <th>学号</th>
            <th>大组</th>
            <th>电话号码</th>
            <th>QQ</th>
            <th>分数</th>
          </tr>
        </thead>
        <tbody id="tab">
          <tr class="userDataTr" v-for="(user,index) in userdata" :key="index">
            <td><input type="checkbox" class="userchoose" :value="JSON.stringify(user)"></td>
            <td v-for="(item,index) in user" :key="index">{{item}}</td>
            <td><input type="text" name="grade" id="grade" class="grade"></td>
          </tr>
          <!--  -->
        </tbody>
      </table>
      <div class="page">
        <ul class="pageUl">
          <li class="pageLi pageButton" @click="pageUp">上一页</li>
          <li v-if="pageN>=10" class="pageLi"><span>{{pageN}} / {{allPage}}</span></li>
          <li v-else class="pageLi"><span>0{{pageN}} / {{allPage}}</span></li>
          <li class="pageLi pageButton" @click="pageDown">下一页</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Nav from '../components/Nav'
  axios.defaults.baseURL='http://106.15.206.229'
  axios.defaults.headers.post['Content-Type'] = 'application/JSON'
  export default {
    name: 'Reviewed',
    components: {
      Nav,
    },
    data() {
      return {
        insertdata:0,
        message: '志愿填报列表',
        selected1: '编程组',
        newStuData: [],
        team: [],
        userdata: {},
        showData:{},
        oldData:[],
        errMessage:'',
        mdata:{},
        insertRow:false,
        pageN:1,
        allPage:0,
      }
    },
    computed: {
      groupIndex() {
        if (this.selected1 == '编程组') {
          return '1'
        } else {
          return '2'
        }
      }
    },
    methods: {
      //搜索功能
      serch(event) {
        var mdataLength = 0;
        this.userdata = {};
        var value = this.$refs.sno.value;

        var team = {};
        team.id = this.groupIndex;
        team.name = this.selected1;
        axios({
          url: '/info/get/applicant',
          method: 'POST',
          data: JSON.stringify(team),
        }).then((data) => {
          this.mdata= data.data.data;
          var a=0,b=1;
          // 数据处理
          for (const key in this.mdata) {
            const element = this.mdata[key];
            delete element.team;
            mdataLength++;

            // 去除每一项的空值
            for (const iterator in element) {
              if (typeof element[iterator] == 'object') {
                delete element[iterator];
              }
            }
            // 处理每页数据
            this.showData[key]=element;
            if(a%15==0 && a!=0){
              this.oldData[b]=this.showData;
              this.showData={};
              b++;
            }
            a++;
          }
          // 最后一页的数据
          this.oldData[b]=this.showData;
          this.showData={};

          // 总页数
          this.allPage=parseInt(mdataLength/15)+1;

          // 判断是否进行学号搜素
          if (value == '') {
            this.userdata = this.oldData[this.pageN];
          } else {
            let b = [];
            let a = 0;
            for (const item in this.mdata) {
              if (this.mdata[item].number == value) {
                b[0] = this.mdata[item];
                a++;
              }
            }
            if(a==0){
              this.toast('IT培优没有这号人');
            }
            // console.log(b);
            this.userdata = b;
          }
        }).catch((err) => {
          this.toast('请求出错，请刷新页面，或者联系管理员');
          console.log(err);
        })
      },

      //添加功能
      add(event) {
        this.newStuData=[];
        var gradeList = document.getElementsByName("grade");
        var grade = [],
          gradeitem = [],
          newdata = [];
        // 对分数进行处理
        for (let item of gradeList) {
          gradeitem.push(item.value);
        }
        grade = gradeitem.filter((item) => {
          return item != '';
        })

        //获取用户选中列表
        var value = document.getElementsByClassName("userchoose")
        var userchoose = []
        for (const key in value) {
          if (value[key].checked) {
            userchoose.push(value[key])
          }
        }

        // 将成绩插入列表中
        for (let item in userchoose) {
          var a, b;
          a = JSON.parse(userchoose[item].value)
          a.grade = grade[item];
          this.newStuData.push(a);
        }
        
        // 用户插入
        if(this.insertdata>0){
          var value1={};
          let tab = document.getElementsByClassName('insertRow1');
          var b=1;
          for (let index = 0; index < tab.length; index++) {
            const element = tab[index];
            if(element.value==''){
              this.toast('存在空数据，添加失败');
              value1={};
              return;
            }
            value1[element.name]=element.value;
            if(b%6==0){
              this.newStuData.push(value1)
              value1={};
              this.insertdata--;
            }
            b++;
          }
          // console.log(this.newStuData);
        }
        
        // console.log(this.newStuData);
        if(this.newStuData.length==0){
          this.toast("尚未选中数据,请选择数据后在添加");
          return;
        }
        for (const key in this.newStuData) {
          if (this.newStuData.hasOwnProperty(key)) {
            const element = this.newStuData[key];
            element.team= element.teamName=='编程组' ? 1 : 2
          }
        }
        console.log(this.newStuData);
        axios({
          url:'/info/add/student',
          method:'POSt',
          data:this.newStuData
        }).then((data)=>{
          if(data.data.code == 200){
            this.toast('添加成功！');
          }else if(data.data.code == 500){
            this.toast(data.data.message);
          }
        }).catch((e)=>{
          console.log(e);
          this.toast('请求错误，请刷新页面，或者联系管理员');
        })
        
      },

      // 弹出框
      toast(mess){
        this.errMessage=mess;
        let toast=this.$refs.errMessage;
        toast.className='errMessage';
        setTimeout(()=>{
          toast.className+=' errMessageToast'
          toast.innerHTML=this.errMessage;
        },5)
      },
  
      //插入 
      insert(){
        this.insertdata++
        var tab=document.getElementById('tab');
        tab.innerHTML+='<tr class="userDataTr" style="text-align:center"><td></td ><td><input style="margin-top: 5px; background:#d9e1e8; border:none; height: 20px;word-wrap: break-word;min-width: 30px;max-width: 110px; padding:5px; text-align:center" class="insertRow insertRow1" name="name" type="text" placeholder="姓名"></td><td><input style ="margin-top: 5px;background:#d9e1e8; border:none; height: 20px;word-wrap: break-word;min-width: 30px;max-width: 110px; padding:5px; text-align:center" class="insertRow insertRow1" name="number" type="text" placeholder="学号"></td><td><input style="margin-top: 5px; background:#d9e1e8;border:none; height: 20px;word-wrap: break-word;min-width: 30px;max-width: 110px; padding:5px; text-align:center" class="insertRow insertRow1" name="teamName" type="text" placeholder="大组"></td><td><input style="margin-top: 5px; background:#d9e1e8;border:none;height: 20px;word-wrap: break-word;min-width: 30px;max-width: 110px; padding:5px; text-align:center" class="insertRow insertRow1" name="phone" type="text" placeholder="电话号码"></td><td><input style="margin-top: 5px; background:#d9e1e8; border:none; height: 20px;word-wrap: break-word;min-width: 30px;max-width: 110px; padding:5px; text-align:center" class="insertRow insertRow1" name="qq" type="text" placeholder="qq"></td><td><input style="margin-top: 5px; background:#d9e1e8; border:none; height: 20px;word-wrap: break-word;min-width: 30px;max-width: 110px; padding:5px; text-align:center" type="text" name="grade" id="grade" class="grade insertRow1" placeholder="分数"></td></tr>' 
      },

      // 上一页
      pageUp(){
        if(this.pageN<=1){
          this.toast('前面没有了！')
          return;
        }
        this.userdata={};
        var table = document.getElementsByClassName('userDataTr');
        // 清空之前的列表
        for (const key in table) {
          if (table.hasOwnProperty(key)) {
            const element = table[key];
            element.innerHTML='';
          }
        }
        this.pageN--;
        this.userdata=this.oldData[this.pageN];
      },

      // 下一页
      pageDown(){
        if(this.pageN>=this.allPage){
          this.toast('这是最后一页啦！')
          return;
        }
        var table = document.getElementsByClassName('userDataTr');
        // 清空之前的列表
        for (const key in table) {
          if (table.hasOwnProperty(key)) {
            const element = table[key];
            element.innerHTML='';
          }
        }
        this.pageN++;
        this.userdata=this.oldData[this.pageN];
      }
    },

    mounted() {
      axios.get('/info/get/team').then((data) => {
        this.team = data.data.data
      }).catch(() => {
        console.log("失败");
      })
    }
  }
</script>
<style scoped>
  .header {
    display: inline-block;
    width: 100%;
    /* color: #ffffff; */
    background: #f1f1f1;
    border-bottom: 2px solid #d9e1e8;
    text-align: center;
    font-size: 20px;
    line-height: 58px;
    user-select: none;
    position: relative;
  }
  .span1 {
    color: #2b90d9;
  }

  .span2 {
    font-size: 20px;
  }

  .container {
    position: relative;
    width: 90%;
    height: auto;
    /* background: #2b90d9; */
    margin: 10px auto 20px;
    border: 2px solid #d9e1e8;
  }

  .errMessage{
    /* display: none; */
    width: 25%;
    height: auto;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #555;
    color: #fff;
    text-align: center;
    padding: 10px;
    border-radius: 10px;
    opacity: 0;
    z-index: 10;
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

  .title {
    width: 100%;
    height: 35px;
    font-size: 20px;
    margin: 30px;
  }

  .title a {
    text-decoration: none;
    font-size: 14px;
    color: red;
  }

  .serch {
    width: 90%;
    height: 60px;
    /* background: #dae9f4; */
    margin: 10px auto;
    border: 2px solid #d9e1e8;
    font-size: 15px;
    position: relative;
  }

  .serchGroup {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .serchGroup span {
    font-size: 17px;
    padding: 0 6px 0 60px;
  }

  .sno {
    width: 150px;
  }

  .userselect {
    width: 90px;
  }

  .tags {
    position: relative;
    color: red;
    font-size: 10px;
    margin-left: 10px;
    top: 23px;
    right: -10%;
  }

  .submit1 {
    position: absolute;
    right: 110px;
    margin: 0 50px 0 30px;
    padding: 0 15px;
    width: 100px;
    height: 23px;
    background: #2b90d9;
    border: none;
    border-radius: 2px;
    color: #f1f1f1;
    cursor: pointer;
  }

  .submit2 {
    position: absolute;
    right: 0px;
    margin: 0 50px 0 30px;
    padding: 0 15px;
    width: 100px;
    height: 23px;
    background: #2b90d9;
    border: none;
    border-radius: 2px;
    color: #f1f1f1;
    cursor: pointer;
  }

  .submit3{
    position: absolute;
    right: 220px;
    margin: 0 50px 0 30px;
    padding: 0 15px;
    width: 100px;
    height: 23px;
    background: #2b90d9;
    border: none;
    border-radius: 2px;
    color: #f1f1f1;
    cursor: pointer;
  }

  .submit:active{
    background-color: #337ab7;
  }

  .serchGroup::after {
    display: block;
    content: '添加分数时，请在前面打勾，再添加分数，一一对应';
    width: auto;
    height: 20px;
    font-size: 8px;
    position: absolute;
    color: red;
    /* top: 23px; */
    right: 6%;
  }

  .serchList {
    border-collapse: collapse;
    width: 90%;
    font-size: 16px;
    /* border: 2px solid #000000; */
    margin: 0 auto;
    margin-bottom: 10px;
  }

  .serchList tr {
    text-align: center;
  }

  .serchList td {
    height: 35px;
    word-wrap: break-word;
    min-width: 30px;
    max-width: 110px;
  }

  .serchList thead {
    border-bottom: 2px solid #d9e1e8;
  }

  .insertRow{
    width: 100px;
    padding: 5px;
    text-align: center;
    border: 1px solid #555;
  }

  table tr:nth-child(even) {
    background: #d9e1e8;
  }

  .grade {
    padding: 5px;
    width: 25px;
    text-align: center;
    border: 1px solid #555;
  }
  .page{
    text-align: center;
    margin: 40px 0;
    user-select: none;
  }

  .pageUl{
    list-style: none;
  }
  .pageLi{
    padding: 0 20px;
    display: inline;
  }
  
  .pageButton{
    background: #d9e1e8;
    border-radius: 5px;
    padding: 5px 15px;
    border: 2px solid #d9e1e8;
    cursor: pointer;
  }
  .pageButton:active{
    background-color: #bbc8d3;
  }
  @media screen and (max-width: 950px) {
    #nav {
      width: 1000px;
    }

    .container {
      width: 950px;
    }
  }
</style>