<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // initHeight: undefined,
      // flag: false
    };
  },
  mounted () {
    // this.clearCache();
    // 监控手机软键盘是否弹出
    window.addEventListener('resize', function () {
      if (
        document.activeElement.tagName.toUpperCase() === 'INPUT' ||
          document.activeElement.tagName.toUpperCase() === 'TEXTAREA'
      ) {
        window.setTimeout(function () {
          document.activeElement.scrollIntoView({
            block: 'center'
          });
        }, 50);
      }
    });
  },
  methods: {
    clearCache () {
      var serviceWorker = navigator.serviceWorker;
      serviceWorker.getRegistrations ? serviceWorker.getRegistrations().then(function (sws) {
        // console.log('缓存服务', sws);
        sws.forEach(function (sw) {
          sw.unregister();
        });
      }) : serviceWorker.getRegistration && serviceWorker.getRegistration().then(function (sw) {
        // console.log('缓存服务', sw);
        sw && sw.unregister();
      });
      let currentVersion = '2.0.7';
      let oldVersion = localStorage.getItem('versions') || '';
      if (currentVersion !== oldVersion) {
        localStorage.setItem('versions', currentVersion);
        window.location.reload(true);
      }
    }
  }
};
</script>
<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
  background-color: #eeeeee;
}

</style>
