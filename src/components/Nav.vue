<template>
  <div id="nav">
    <header class="header">
      <span class="span1"><slot name="bigTitle">四川师范大学IT培优</slot></span>
      <span class="span2"><slot name="smallTitle">后台管理系统</slot></span>
    </header>
  </div>
</template>

<script>
export default {
  name:'Nav',
  data () {
    return {
    }
  }
}

</script>
<style scoped>
  .header{
    display: inline-block;
    width: 100%;
    /* color: #ffffff; */
    background:#f1f1f1;
    border-bottom: 2px solid #d9e1e8;
    text-align: center;
    /* font-size: 20px; */
    line-height: 58px;
    user-select: none;
    position: relative;
  }
  .span1{
    font-size: 22px;
    color: #2b90d9;
  }
  .span2{
    font-size: 16px;
  }
  /* @media screen and (max-width: 950px){
    #nav{
      width: 950px;
    }
  } */
</style>
