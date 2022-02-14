module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: 'backend:420',
          changeOrigin: true
        },
      }
    }
  }