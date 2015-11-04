import {HelloWorld} from './build/databaseModel'
import {Runtime, basicBuildPlugin} from 'markscript-basic-build'

const COMMON = {
  appName: 'markscript-helloworld',
  ml: {
    host: 'christys-macbook-pro.local',
    port: 8009,
    user: 'admin',
    password: 'passw0rd'
  }
}

export const build: MarkScript.Build = {
  buildConfig: <MarkScript.BuildConfig & MarkScript.BasicBuildConfig>{
    databaseConnection: {
      host: COMMON.ml.host,
      httpPort: COMMON.ml.port,
      adminPort: 8001,
      configPort: 8002,
      user: COMMON.ml.user,
      password: COMMON.ml.password,
    },
    database: {
      modelObject: new HelloWorld(COMMON.appName, COMMON.ml.port, COMMON.ml.host)
    },
    assetBaseDir: './src'
  },
  plugins: [basicBuildPlugin],
  runtime: Runtime,
  tasks: {
    helloWorld: {
      execute: function(buildModel: MarkScript.BuildModel, buildConfig: MarkScript.BuildConfig, runtime: Runtime) {
        return runtime.callGet('hello', { to: 'world' }).then(function(response) {
          console.log(response)
        })
      },
      description: 'Run the "hello" extension, and print the result'
    }
  }
}
