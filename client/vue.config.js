const { defineConfig } = require('@vue/cli-service');
const server = 'http://localhost:3000';

const path = require('path');
const Components = require('unplugin-vue-components/webpack').default;
const { PrimeVueResolver } = require('@primevue/auto-import-resolver');
const webpack = require('webpack');

module.exports = {
  outputDir: path.resolve("../server/public"),
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // 경고 해결
      }),
      Components({
        resolvers: [PrimeVueResolver()]
      })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
  },
  chainWebpack: config => {
  },
  // 개발용 임시 서버
  devServer : {
    // Vue.js 실행 시 적용 PORT 변경
    port : 8099,
     // CORS(Cross Origin Resource Sharing) => proxy setting
    proxy : {
      // 해당 문자열로 시작하는 통신에 적용하는 설정
      '^/api' : {
        // 변경할 Origin
        target : server,
        // Origin 변경 : http://localhost:8099 -> http://localhost:3000
        changeOrigin : true,
        // URL 중 일부분을 다시 작성 : /api/books -> /books 
        // pathRewrite : { '^/api' : '/'},
        // websocket 설정 비활성화
        ws : false
      }
    }
  },
};