/// <reference path="../../obj/sancasia_zero.core.d.ts" />

namespace sczCore.demo.helloWorld.part2
{

  class HelloWorldComponent extends Component
  {
    public name: string;
  }

  class HelloWorldEntityFactory
  {
    public static create(id: number, name: string): Entity
    {
      // create the entity
      let entity = new Entity(id);
      // create relevant component
      let component = new HelloWorldComponent();
      // initialise component
      component.name = name;
      // add component to entity
      entity.addComponent(component);

      return entity;
    }
  }

  class HelloWorldSystem extends SystemBase implements System
  {
    public constructor(eventBus: EventBus)
    {
      // the first argument tells the system base class
      // which components entities need to provide
      // if they want to be processed by us.
      super([HelloWorldComponent], eventBus, EngineEvent.Render);
    }

    // the requested components are then passed to this function
    // and we can access and process them with ease.
    public processEntity(deltaTime: number, [component]: [HelloWorldComponent])
    {
      // log "hello world" to the console
      console.log(`Hello ${ component.name }!`)
    }
  }


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
      system.registerEntity(ella);
      system.registerEntity(steve);

      engine.start();
      system.activate();
    }
  }
}
