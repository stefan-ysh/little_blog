<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {
      data: "hello"
    };
  },
  created() {
    this.getJsonp();
  },
  methods: {
    getJsonp() {
      this.$jsonp({
        url: "http://wis.qq.com/weather/common",
        data: {
          source: "pc",
          weather_type: "forecast_1h",
          // weather_type: 'forecast_1h|forecast_24h',
          province: "吉林省",
          city: "长春市"
        }
      }).then(res => {
        console.log(res);
      });
    }
  }
}
</script>
