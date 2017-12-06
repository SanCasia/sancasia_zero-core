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
    public static canRegisterEntity()
    {
      let system = new TestSystem(new EventBus());
      let entity = new Entity(0);
      entity.addComponent(new TestComponent());
      system.registerEntity(entity);

      if(!system.hasEntityRegistered(0))
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

    public static canHasEntity()
    {
      let system = new TestSystem(new EventBus());
      let entity = new Entity(0);
      entity.addComponent(new TestComponent());
      system.registerEntity(entity);
      if(!system.hasEntityRegistered(0))
      {
        throw new Error("entity [0] not visible");
      }

      let entity_one = new Entity(1);
      entity_one.addComponent(new TestComponent());
      system.registerEntity(entity_one);
      if(!system.hasEntityRegistered(1))
      {
        throw new Error("entity [1] not visible");
      }

      system.deregisterEntity(0);
      if(system.hasEntityRegistered(0))
      {
        throw new Error("entity [0] not delted");
      }

      system.deregisterEntity(1);
      if(system.hasEntityRegistered(1))
      {
        throw new Error("entity [1] not delted");
      }
    }

    public static canDeregisterEntity()
    {
      let system = new TestSystem(new EventBus());
      let entity = new Entity(0);
      let component = new TestComponent();
      entity.addComponent(component);

      system.registerEntity(entity);
      system.deregisterEntity(entity.getId());

      if(system.hasEntityRegistered(entity.getId()))
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

    public static canProcessEntity()
    {
      let system = new TestSystem(new EventBus());
      let compoent = new TestComponent();
      system.processEntity(3.141, [compoent]);

      if(compoent.testValue != "3.141")
      {
        throw new Error("component value not modified");
      }
    }

    public static canProcess()
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

    public static canHandleEvents()
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

    public static canBeDeactivated()
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
