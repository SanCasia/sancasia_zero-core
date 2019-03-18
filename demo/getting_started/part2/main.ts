/// <reference path="../../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part2
{
  export class Part2
  {
    public static main()
    {
      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new HelloWorldSystem(eventBus);
      // utilise the factory to create the entities
      let ella = HelloWorldEntityFactory.create(0, "Ella");
      let steve = HelloWorldEntityFactory.create(1, "Steve");
      // register the Entities so they get processed
      system.registerEntity(ella);
      system.registerEntity(steve);

      engine.start();
      system.activate();
    }
  }
}
