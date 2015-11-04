import {Extension, Context, Parameters, mlExtension} from 'markscript-basic'
import * as helloWorldModule from './helloWorldModule'

@mlExtension({name:'hello'})
export class HelloWorldExtension implements Extension {
  get(context: Context, params: Parameters) {
    return helloWorldModule.sayHello(<string>params['to'])
  }
}
