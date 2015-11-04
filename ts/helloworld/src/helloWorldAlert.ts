import {mlAlert} from 'markscript-basic'

export class HelloWorldAlert {
  @mlAlert({
    scope: '/sampleDir'
  })
  alert(uri: string, content: DocumentNode<{to:string}>) {
    xdmp.log('Said hello to: ' + JSON.stringify(content.toObject().to))
  }
}
