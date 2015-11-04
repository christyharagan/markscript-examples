import {mlService, mlEvent, mlMethod, AbstractMLService, Doc, resolve} from 'markscript-uservices'
import {Counter} from 'markscript-basic'

@mlService('results')
export class ResultsService extends AbstractMLService implements Logic.ResultsService {
  @mlEvent({
    scope: '/guesses/'
  })
  updateResults(): Observable<Logic.ResultUpdates> {
    return this.observableFactory().map(function(value: Doc<Counter>) {
      return [parseInt(value.uri.substring('/guesses/'.length)), value.content.root.count]
    })
  }

  @mlMethod()
  getResults(): Promise<Logic.Results> {
    let docs = <ValueIterator<DocumentNode<Counter>>>xdmp.directory('/guesses/')
    let results: Logic.Results = {}
    while (true) {
      var item = docs.next()
      if (item.done) {
        break
      }
      results[parseInt(item.value.baseURI.substring('/guesses/'.length))] = item.value.root.count
    }

    return resolve(results)
  }
}
