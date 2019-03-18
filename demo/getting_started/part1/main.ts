/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part1
{
  export class Part1
  {
    public static main()
    {
      // create a new event bus
      // the event bus is used for communication between
      // the game engine, systems etc
      let eventBus = new EventBus();
      // create a new engine
      let engine = new Engine(eventBus);
      // initialise our System
      let system = new HelloWorldSystem(eventBus);

      // we need to add at least one entity for the system to actually compute
      system.registerEntity(new Entity(0));

      // lets start the engine!
      engine.start();
      // ... and activate the system!
      system.activate();
    }
  }
}
