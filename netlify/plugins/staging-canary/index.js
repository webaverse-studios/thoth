module.exports = {
  onPreBuild: ({ netlifyConfig, utils: { git } }) => {
    netlifyConfig.build.command = `cd client && yarn add @thothai/thoth-core@canary && cd .. && ${netlifyConfig.build.command}`
  },
}
