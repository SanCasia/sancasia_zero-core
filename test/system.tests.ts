/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  class TestComponent extends Component
  {
    public testValue: string;
  }

  class TestSystem extends SystemBase
  {
    public static readonly event = EngineEvent.Computation;
    
    constructor(eventBus: EventBus)
    {
      super([TestComponent], eventBus, TestSystem.event);
    }

    processEntity(deltaTime: number, [testComponent]: [TestComponent])
    {
      testComponent.testValue = deltaTime.toString();
    }
  }

  class TestEntityFactory
  {
    static createTestEntity(id: number, systems: Array<System>): Entity
    {
      let entity = new Entity(id);
      let component = new TestComponent();
      entity.addComponent(component);

      for(let system of systems)
      {
        system.registerEntity(entity);
      }

      return entity;
    }
  }

  export class SystemTests
  {
    public canRegisterEntity()
    {
      let system = new TestSystem(new EventBus());
      let entity = new Entity(0);
      let component = new TestComponent();
      entity.addComponent(component);

      system.registerEntity(entity);

      // @ts-ignore: Property 'subscribers' is private and only accessible within class 'EventBus'.
      if(!system.entities.has(0)
        || system.entities.get(entity.getId()) != entity)
      {
        throw new Error("entity not registered correctly")
      }

      try
      {
        entity.getCache(system);
      }
      catch(Error)
      {
        throw new Error("cache not created correctly");
      }
    }

    public canDeregisterEntity()
    {
      let system = new TestSystem(new EventBus());
      let entity = new Entity(0);
      let component = new TestComponent();
      entity.addComponent(component);

      system.registerEntity(entity);
      system.deregisterEntity(entity.getId());

      // @ts-ignore: Property 'subscribers' is private and only accessible within class 'EventBus'.
      if(system.entities.has(entity.getId()))
      {
        throw new Error("entity not deregistered correctly")
      }

      let cache = null;
      try
      {
        cache = entity.getCache(system);
      }
      catch(Error)
      {
        // expected
      }

      if(cache != null)
      {
        throw new Error("cache not deleted correctly");
      }
    }

    public canProcessEntity()
    {
      let system = new TestSystem(new EventBus());
      let compoent = new TestComponent();
      system.processEntity(3.141, [compoent]);

      if(compoent.testValue != "3.141")
      {
        throw new Error("component value not modified");
      }
    }

    public canProcess()
    {
      let system = new TestSystem(new EventBus());
      let entity = TestEntityFactory.createTestEntity(0, [system]);
      system.process(3.141);

      let result = <TestComponent>entity.getComponent(TestComponent);
      if(result.testValue != "3.141")
      {
        throw new Error("component value not modified");
      }
    }

    public canHandleEvents()
    {
      let eventBus = new EventBus();
      let system = new TestSystem(eventBus);
      let entity = TestEntityFactory.createTestEntity(0, [system]);
      system.activate();
      eventBus.publish(TestSystem.event, 3.141);

      let result = <TestComponent>entity.getComponent(TestComponent);
      if(result.testValue != "3.141")
      {
        throw new Error("component value not modified");
      }
    }

    public canBeDeactivated()
    {
      let eventBus = new EventBus();
      let system = new TestSystem(eventBus);
      let entity = TestEntityFactory.createTestEntity(0, [system]);
      system.activate();
      system.deactivate();
      eventBus.publish(TestSystem.event, 3.141);

      let result = <TestComponent>entity.getComponent(TestComponent);
      if(result.testValue == "3.141")
      {
        throw new Error("component value not modified");
      }
    }
  }
}
