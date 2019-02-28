/// <reference path="../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part1
{
  // we can extend from system base
  class HelloWorldSystem extends SystemBase implements System
  {
    public constructor(eventBus: EventBus)
    {
      // pass the event bus and the event type "Render" to the super constructor.
      // the super constructor will automatically register on the specified event.
      // don't worry about the "[]" yet.
      super([], eventBus, EngineEvent.Render);
    }

    // this function will get called by the game engine.
    // you can again see "[]".
    // the deltaTime tells us how much time has passed since the last call
    public processEntity(_deltaTime: number, []: Array<Component>)
    {
      // log "hello world" to the console
      console.log("Hello World!")
    }
  }

  export class Part1
  {
    public static main()
    {
      // create a new event bus
      // the event bus is used for communication between the objects
      let eventBus = new EventBus();
      // create a new engine
      let engine = new Engine(eventBus);
      let system = new HelloWorldSystem(eventBus);
      // we need to add at least one entity for the system to compute
      system.registerEntity(new Entity(0));

      // lets start the engine!
      engine.start();
      // ... and activate the system!
      system.activate();
    }
  }
}
