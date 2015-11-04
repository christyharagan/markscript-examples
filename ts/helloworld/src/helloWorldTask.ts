import {mlTask} from 'markscript-basic'

export class HelloWorldTask {
  @mlTask({
    type: MarkScript.FrequencyType.MINUTES,
    frequency: 1,
    user: 'admin'
  })
  task() {
    xdmp.log('Hello world')
  }
}
