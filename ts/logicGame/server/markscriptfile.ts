import {LogicGameDatabase} from './build/databaseModel'
import {basicBuildPlugin} from 'markscript-basic-build'
import {uServicesPlugin} from 'markscript-uservices-build';
import {Runtime} from 'markscript-koa'
import {test} from './test/test'

const COMMON = {
  appName: 'markscript-ts-logic',
  ml: {
    host: 'christys-macbook-pro.local',
    port: 8010,
    user: 'admin',
    password: 'passw0rd'
  },
  koa: {
    host: 'localhost',
    port: 8081
  }
}

export const build: MarkScript.Build = {
  buildConfig: <MarkScript.BuildConfig & MarkScript.UServicesBuildConfig & MarkScript.BasicBuildConfig & MarkScript.KoaBuildConfig>{
    databaseConnection: {
      host: COMMON.ml.host,
      httpPort: COMMON.ml.port,
      adminPort: 8001,
      configPort: 8002,
      user: COMMON.ml.user,
      password: COMMON.ml.password,
    },
    database: {
      modelObject: new LogicGameDatabase(COMMON.appName, COMMON.ml.port, COMMON.ml.host)
    },
    middle: {
      host: COMMON.koa.host,
      port: COMMON.koa.port
    },
    fileServerPath: '../client',
    assetBaseDir: './src'
  },
  plugins: [basicBuildPlugin, uServicesPlugin],
  runtime: Runtime,
  tasks: {
    clear: {
      execute: function(buildModel: MarkScript.BuildModel, buildConfig: MarkScript.BuildConfig, runtime: Runtime) {
        let preperationService = <Logic.PreperationService>runtime.getService('preperation')
        return preperationService.clear()
      },
      description: 'Clear player data before starting a new demo'
    },
    test: {
      execute: function(buildModel: MarkScript.BuildModel, buildConfig: MarkScript.BuildConfig, runtime: Runtime) {
        return test(runtime)
      },
      description: 'Server test to ensure everything works as expected'
    },
    run: {
      execute: function(buildModel: MarkScript.BuildModel, buildConfig: MarkScript.BuildConfig, server: Runtime) {
        return new Promise(function(resolve, reject){})
      },
      description: 'Run an instance of the server for integration testing'
    }
  }
}
