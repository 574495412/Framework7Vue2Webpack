<template>
  <div class="container login-box">
    <form class="form-signin">
      <h2 class="form-signin-heading">{{ title }}</h2>
      <label for="inputEmail" class="sr-only">AppKey</label>
      <input type="text" id="inputEmail" class="form-control" placeholder="AppKey" required autofocus>
      <label for="inputPassword" class="sr-only">Token</label>
      <input type="text" id="inputPassword" class="form-control" placeholder="Token" required>
      <input type="submit" value="登录" class="btn btn-lg btn-primary btn-block">
    </form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        title: '登录'
      }
    }
  }
</script>

<style>
  .login-box {
    padding-top: 10%;
    padding-bottom: 40px;
    background-color: #eee;
    width: 100%;
    height: 100%;
  }

  .form-signin {
    max-width: 330px;
    padding: 15px;
    margin:0 auto;
  }

  .form-signin .form-signin-heading,
  .form-signin .checkbox {
    margin-bottom: 10px;
  }

  .form-signin .checkbox {
    font-weight: normal;
  }

  .form-signin .form-control {
    position: relative;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
  }
  .form-signin .form-control:focus {
    z-index: 2;
  }
  .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

</style>
