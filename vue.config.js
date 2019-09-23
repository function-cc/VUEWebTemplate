const path = require('path')
const {pathAlias, dropConsole, devApi} = require('./my-config')

function resolve(dir){
  return path.join(__dirname, dir)
}

for(let key in pathAlias){
  pathAlias[key] = resolve(pathAlias[key])
}

module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 2000,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },

    proxy: {
      '/api': {
        target: devApi,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
  },

  configureWebpack: config =>{
    if(isProduction){
      config.plugins.push(
        //生产环境自动删除console
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
                drop_debugger: dropConsole,
                drop_console: dropConsole,
              },
            },
            sourceMap: false,
            parallel: true,
        })
      )
    }
  },

  configureWebpack: {
    resolve: {
      alias: pathAlias
    }
  },

  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/styles/global";
        `
      }
    }
  }
}