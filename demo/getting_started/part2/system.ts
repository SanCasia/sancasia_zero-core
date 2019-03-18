/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part2
{
  export class HelloWorldSystem extends SystemBase implements System
  {
    public constructor(eventBus: EventBus)
    {
      // the first argument tells the system base class
      // which components entities need to provide
      // if they want to be processable by the System.
      super([HelloWorldComponent], eventBus, EngineEvent.Render);
    }

    // the requested components are then passed to this function
    // and we can access and manipulate them.
    public processEntity(
      _deltaTime: number,
      [component]: [HelloWorldComponent])
    {
      // log "hello" + the name of the Entity to the console
      console.log(`Hello ${ component.name }!`)
    }
  }
}
