/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part1
{
  // we can extend from system base
  export class HelloWorldSystem extends SystemBase implements System
  {
    public constructor(eventBus: EventBus)
    {
      // pass the event bus and the event type "Render" to the super constructor.
      // SystemBase will register to the specified event and
      // start the execution at the apporprate time.
      // don't worry about the "[]" yet.
      super([], eventBus, EngineEvent.Render);
    }

    // this function is an indirect callback to the regsitered event.
    // the deltaTime tells us how much time has passed since the last call
    // you can again see "[]".
    public processEntity(_deltaTime: number, []: Array<Component>)
    {
      // log "hello world" to the console
      console.log("Hello World!")
    }
  }
}
