// vue.config.js
const UniappDevtoolLauncherWebpackPlugin = require("uniapp-devtool-launcher-webpack-plugin");

module.exports = {
    transpileDependencies: ['uview-ui'],
    configureWebpack: {
        plugins: [
            new UniappDevtoolLauncherWebpackPlugin()
        ]
    }
}
