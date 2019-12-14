<template>
  <div>
    <Nav class="naxbox">
      <span slot="smallTitle">注册系统</span>
    </Nav>
    <div class="container">
      <div class="errMessage" ref="errMessage"></div>
      <div class="title">
        {{message}}
        <span @click="reviewed()" class="reviewed">组长审核点我</span>
        <div class="piespan">
          <span @click="picshow()">分布图</span>
        </div>
        <div ref="triangle" id="triangle-up"></div>
        <div ref="pie" id="main" style="width: 1000px;height:600px;"></div>
      </div>
      <div class="serch">
        <div class="serchGroup">
          <span>Team</span>
          <select class="team userselect" v-model="selected1">
            <option v-for="(item,index) in team" :value="item.name" :key="index">{{item.name}}</option>
          </select>
          <span>GroupOne</span>
          <select class="group userselect" v-model="groupO">
            <option v-for="(item,index) in groupList" :key="index">{{item.name}}</option>
          </select>
          <span>GroupTwo</span>
          <select class="group userselect" v-model="groupT">
            <option v-for="(item,index) in groupList" :key="index">{{item.name}}</option>
          </select>
          <input type="submit" value="搜索" class="submit" @click="serch()">
        </div>
      </div>
      <table class="serchList">
        <thead>
          <tr>
            <th>姓名</th>
            <th>学号</th>
            <th>分数</th>
            <th>大组</th>
            <th>小组第一志愿</th>
            <th>小组第二志愿</th>
            <th>电话号码</th>
            <th>QQ</th>
            <th>创建时间</th>
            <th>个人描述</th>
          </tr>
        </thead>
        <tbody>
          <tr class="userDataTr" v-for="(user,index) in userdata" :key="index">
            <td v-for="(item,index) in user" :key="index">
              <div v-if="showDesc(index)">{{item}}</div>
              <div class="desc" v-else>{{chuli(item)}}
                <div class="descTips">
                  <p>{{item}}</p>
                </div>
              </div>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import Nav from '../components/Nav'
  import axios from 'axios'
  axios.defaults.baseURL='http://106.15.206.229'
  axios.defaults.headers.post['Content-Type'] = 'application/JSON'

  // axios.defaults.headers.get['Content-Type'] = 'application/JSON'
  export default {
    data() {
      return {
        message: '志愿填报列表',
        selected1: '编程组',
        groupList:{},
        groupO:'ALL',
        groupT:'ALL',
        userChoose: '',
        pieshow: true,
        rteam:{},
        team: [],
        userdata: [],
        groupName:[],
        firstGroup:[],
        secondGroup:[]
      }
    },
    components: {
      Nav,
    },  
    methods: {
      // 弹出框
      toast(mess){
        this.errMessage=mess;
        let toast=this.$refs.errMessage;
        toast.className='errMessage';
        setTimeout(()=>{
          toast.className+=' errMessageToast'
          toast.innerHTML=this.errMessage;
        },500)
      },
      // 判断是否展示描述
      showDesc(index){
        if(index=='desc'){
          return false
        }else{
          return true
        }

      },
      // 对描述进行处理
      chuli(item){
        if(item != null){
          return item.substring(0,5)+"...";
        }
        return '';
      },
      // 格式化日期
      getData(data){
        var date = new Date(data);
        var Y = date.getFullYear() + '-',
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
        D = date.getDate() + ' ',
        h = date.getHours() + ':',
        m = date.getMinutes();
        return Y+M+D+h+m;
      },
      //搜索功能
      serch() {
        // 清空之前的列表
        this.userdata=[];
        var table = document.getElementsByClassName('userDataTr');
        for (const key in table) {
          if (table.hasOwnProperty(key)) {
            const element = table[key];
            element.innerHTML='';
          }
        }

        var idO=0,idT=0;
        for (const key in this.groupList) {
          if (this.groupList.hasOwnProperty(key)) {
            const element = this.groupList[key];
            if(this.groupO==element.name){
              idO = element.id;
            }
            if(this.groupT==element.name){
              idT = element.id;
            }
          }
        }

        axios({
          url:'/manage/group',
          method:'get',
          params:{
            one:idO,
            two:idT
          }
        }).then((data)=>{
          for (const key in data.data.data) {
            if (data.data.data.hasOwnProperty(key)) {
              const element = data.data.data[key];
              delete element.id;
              element.createTime=this.getData(element.createTime)
              if(element.team==1){
                element.team='编程组';
              }else{
                element.team='美工组';
              }
              this.userdata.push(element);
            }
          }
          // console.log(this.userdata);
        }).catch((err)=>{
          this.toast('当前网络状态不佳，请刷新重试');
          // console.log(err);
        })

      },
      //echarts分布图
      drawpie() {
        var myChart = this.$echarts.init(document.getElementById('main'));
        var app = {},
        option = null;
        var posList = [
          'left', 'right', 'top', 'bottom',
          'inside',
          'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
          'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ];
        app.configParameters = {
          rotate: {
            min: -90,
            max: 90
          },
          align: {
            options: {
              left: 'left',
              center: 'center',
              right: 'right'
            }
          },
          verticalAlign: {
            options: {
              top: 'top',
              middle: 'middle',
              bottom: 'bottom'
            }
          },
          position: {
            options: this.$echarts.util.reduce(posList, function (map, pos) {
              map[pos] = pos;
              return map;
            }, {})
          },
          distance: {
            min: 0,
            max: 100
          }
        };
        app.config = {
          rotate: 90,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideBottom',
          distance: 15,
          onChange: function () {
            var labelOption = {
              normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
              }
            };
            myChart.setOption({
              series: [{
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }]
            });
          }
        };
        var labelOption = {
          normal: {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
              name: {
                textBorderColor: '#fff'
              }
            }
          }
        };
        option = {
          color: ['#a5dff9', '#8EC0E4'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['第一志愿', '第二志愿']
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            axisTick: {
              show: true
            },
            data: this.groupName
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
              // zoom: 2,
              name: '第一志愿',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: this.secondGroup
            },
            {
              name: '第二志愿',
              type: 'bar',
              label: labelOption,
              data: this.firstGroup
            }
          ]
        };
        myChart.setOption(option);
      },
      //点击展示
      picshow() {
        var id=0;
        if(this.selected1=="编程组"){
          id=1;
        }else{
          id=2;
        }
        this.rteam.id=id;
        this.rteam.name = this.selected1;
        axios({
          url:'/manage/image',
          data:JSON.stringify(this.rteam),
          method:'POST'
        }).then((data)=>{  
          this.groupName = [];
          this.firstGroup = [];
          this.secondGroup = [];
          var rData = data.data.data;
          var string='';
          for (const key in rData) {
            if (rData.hasOwnProperty(key)) {
              const element = rData[key];
              // string=element.name.substring(0,element.name.length-2);
              this.groupName.push(element.name);
              this.firstGroup.push(element.first);
              this.secondGroup.push(element.second);
            }
          }
          // console.log(JSON.stringify(this.groupName));
          this.drawpie()
        }).catch((err)=>{
          this.toast('当前网络状态不佳，请刷新重试')
          // console.log(err);
        })

        if (this.pieshow) {
          this.$refs.pie.style.display = "block"
          this.$refs.triangle.style.display = "block"
          this.pieshow = !this.pieshow
        } else {
          this.$refs.pie.style.display = "none"
          this.$refs.triangle.style.display = "none"
          this.pieshow = !this.pieshow
        }
      },
      //跳转到审核界面
      reviewed(){
        this.$router.push('/reviewed')
      }
    },
    created() {
      // http://106.15.206.229/info/get/team
      // http://jsonplaceholder.typicode.com

      //页面加载后发送请求
      axios.get('/info/get/team', {
      }).then((data) => {
        this.team = data.data.data
        // console.log(this.team);
      }).catch((err) => {
        this.toast('当前网络状态不佳，请刷新重试');
        // console.log(err);
      })
      var team = {};
      team.name=this.selected1;
      if(this.selected1=='编程组'){
        team.id = 1;
      }else{
        team.id = 2;
      }
      axios({
        method:'post',
        data:team,
        url:'/apply/group'
      }).then((data)=>{
          this.groupList=data.data.data;
          var all={
            id:'',
            name:'ALL',
            teamId:null
          }
          this.groupList.push(all);
          // console.log(this.groupList);
      }).catch((err)=>{
        this.toast('当前网络状态不佳，请刷新重试');
        // console.log(err);
      })
    },
    watch: {
      selected1(newValue, oldValue) {
        var team = {};
        team.name=this.selected1;
        if(this.selected1=='编程组'){
          team.id = 1;
        }else{
          team.id = 2;
        }
        axios({
          method:'post',
          data:team,
          url:'/apply/group'
        }).then((data)=>{
          this.groupList=data.data.data
          // console.log(data);
        }).catch((err)=>{
          // console.log(err);
          this.toast('当前网络状态不佳，请刷新重试');
        })
      }
    }
  }
</script>
<style scoped>
  body{
    width: 100%;
  }
  .container{
    position: relative;
    width: 90%;
    height: auto;
    /* background: #2b90d9; */
    margin: 10px 20px;
    border: 2px solid #d9e1e8;
    padding-bottom: 50px;
  }
  .title{
    width: 100%;
    height: 35px;
    font-size: 20px;
    margin: 30px;
  }
  .reviewed{
    /* position: relative; */
    font-size: 14px;
    color: red;
    cursor: pointer;
  }
  .piespan{
    user-select: none;
    position: absolute;
    cursor: pointer;
    right: 10%;
    top: 28px;
    font-size: 16px;
    color: #2b90d9;
  }

  #main{
    position: absolute;
    display: none;
    z-index: 1;
    right: 10%;
    background: #fff;
    border: 2px solid  #d9e1e8;
    /* width: 600px;
    height: 400px; */
    /* background: #2b90d9; */
  }
  #main::before{
    content: "";
    width: 0px;
    height: 0px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid #d9e1e8;
    position: absolute;
    z-index: 1;
    top: -10px;
    right: 10px;
  }
  .serch{
    width: 90%;
    height: 60px;
    /* background: #dae9f4; */
    margin: 10px auto;
    border: 2px solid #d9e1e8;
    font-size: 15px;
    position: relative;
  }
  .serchGroup{
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .serchGroup span{
    font-size: 17px;
    padding: 0 6px 0 30px;
  }
  .userselect{
    width: 90px;
  }
  .submit{
    position: absolute;
    right: 60px;
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
  .serchList{
    border-collapse: collapse;
    width: 90%;
    font-size: 16px;
    /* border: 2px solid #000000; */
    margin: 0 auto;
    margin-bottom: 10px;
  }
  .serchList tr{
    text-align: center; 
  }
  .serchList td{
    height: 35px;
    word-wrap: break-word;
    /* min-width: 30px; */
    max-width: 120px;
  }
  .serchList thead{
    border-bottom: 2px solid  #d9e1e8;
  }
  .desc{
    position: relative;
    /* width: 100px; */
  }
  .desc:hover .descTips{
    display: block;
  }
  .descTips{
    display: none;
    background: #ffffff;
    border: 1px solid #000 ;
    border-radius: 10px;
    padding: 5px;
    position: absolute;
    width: 350px;
    right: 110px; 
    top: -50%;
    /* left: 0%; */
  }
  /* .descTips::after{
    content: '';
    border: 3px solid #000;
    width: 0;
    height: 0;
    position: relative;
    left: 52%;
    bottom: 10px;
    border-top:5px solid transparent;
    border-bottom:5px solid transparent;
    border-left:5px solid #000;
  } */
  .descTips p{
    margin: 5px;
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
  table tr:nth-child(even){
    background: #d9e1e8;
  }
  @media screen and (max-width: 950px){
    #nav{
      width: 1000px;
    }
    .container{
      width: 950px;
    }
  }
</style>