/// <reference path="../obj/sancasia_zero_core" />


namespace sczCore.tests
{
  class TestSystem extends SystemBase
  {
    public processEntity(_: number, [])
    {

    }
  }

  export class SceneTests
  {
    public canGetId()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(3.141, eventBus);

      if(scene.getId() != 3.141)
      {
        throw new Error("scene can not store id");
      }
    }

    public canAddSystem()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation);

      scene.addSystem(system);

      if(!scene.hasSystem(TestSystem))
      {
        throw new Error("scene can not add system");
      }
    }

    public canHasSystem()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation);

      scene.addSystem(system);

      if(!scene.hasSystem(TestSystem))
      {
        throw new Error("scene can not has system");
      }
    }

    public canGetSystem()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation);

      scene.addSystem(system);

      if(system != scene.getSystem(TestSystem))
      {
        throw new Error("scene can not get system");
      }
    }

    public canRemoveSystem()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation);

      scene.addSystem(system);
      scene.removeSystem(TestSystem);

      if(scene.hasSystem(TestSystem))
      {
        throw new Error("scene can not remove system");
      }
    }

    public canActivate()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation);
      scene.addSystem(system);

      if(system.isActive)
      {
        throw new Error("scene activated system early");
      }

      scene.activate();

      if(!system.isActive)
      {
        throw new Error("scene did not activate system");
      }
    }

    public canDeactivate()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation);
      scene.addSystem(system);

      if(system.isActive)
      {
        throw new Error("scene activated system early");
      }

      scene.activate();
      scene.deactivate();

      if(system.isActive)
      {
        throw new Error("scene did not deactivate system");
      }
    }

    public canHandleEvents()
    {
      let eventBus = new EventBus();
      let scene = new SceneBase(0, eventBus);
      let system = new TestSystem([], eventBus, EngineEvent.Computation)
      scene.addSystem(system);

      if(system.isActive)
      {
        throw new Error("scene activated system early");
      }

      eventBus.publish(EngineEvent.SceneChange, [0, SceneAction.Activate]);

      if(!system.isActive)
      {
        throw new Error("scene did not activate system");
      }

      eventBus.publish(EngineEvent.SceneChange, [0, SceneAction.Deactivate]);

      if(system.isActive)
      {
        throw new Error("scene did not deactivate system");
      }
    }
  }
}
