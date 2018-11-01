<template>
  <div class="outer">
    <div class="middle">
      <div class="inner">
        <el-form>
          <el-form-item prop="username">
            <el-input placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button type="primary" class="submit_btn">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style>
.outer {
  display: table;
  position: absolute;
  height: 100%;
  width: 100%;
  /*
   * code below generate the background image
   * https://stackoverflow.com/questions/3540194/how-to-make-a-grid-like-graph-paper-grid-with-just-css
   * http://codepen.io/anon/pen/VvPWvv
   */
  background-size: 40px 40px;
  background-image: linear-gradient(to right, grey 1px, transparent 1px),
    linear-gradient(to bottom, grey 1px, transparent 1px);
}

.middle {
  display: table-cell;
  vertical-align: middle;
}

.inner {
  margin-left: auto;
  margin-right: auto;
  width: 20%;
}
</style>
