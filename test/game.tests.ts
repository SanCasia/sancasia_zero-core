/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  class TestSystem extends SystemBase
  {
    public constructor(eventBus: EventBus)
    {
      super([], eventBus, EngineEvent.Computation);
    }

    protected processEntity(_: number, __: Component[]): void {
      throw new Error("Method not implemented.");
    }

  }

  export class GameTests
  {
    public canCreate()
    {
      new Game();
    }

    public canGetEventBus()
    {
      let game = new Game();
      let eventBus = game.getEventBus();

      if(eventBus == null)
      {
        throw new Error("cannot get event bus");
      }
    }

    public canEntity()
    {
      let game = new Game();
      game.addEntity(new Entity(0));
      if(!game.hasEntity(0))
      {
        throw new Error("entity not visible");
      }
      game.removeEntity(0);
      if(game.hasEntity(0))
      {
        throw new Error("entity not delted");
      }
    }

    public canAddRemoveScene()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      if(!game.hasScene(0))
      {
        throw new Error("scene not visible");
      }
      game.removeScene(0);
      if(game.hasScene(0))
      {
        throw new Error("scene not delted");
      }
    }

    public canActivateScene()
    {
      let game = new Game();
      let scene = new SceneBase(0, game.getEventBus());
      game.addScene(scene);

      if(scene.isActive)
      {
        throw new Error("scene activated");
      }

      game.activateScene(0);

      if(!scene.isActive)
      {
        throw new Error("scene not activated");
      }

      game.deactivateScene(0);

      if(scene.isActive)
      {
        throw new Error("scene still activated");
      }

    }

    public canAddSystem()
    {
      let game = new Game();
      let scene = new SceneBase(0, game.getEventBus());
      let system = new TestSystem(game.getEventBus());

      game.addScene(scene);
      game.addSystem(0, system);

      if(!scene.hasSystem(TestSystem))
      {
          throw new Error("system not added");
      }
    }

    public canAddEntity()
    {
      let game = new Game();
      let scene = new SceneBase(0, game.getEventBus());
      let system = new TestSystem(game.getEventBus());
      let entity = new Entity(0);

      game.addEntity(entity);
      game.addScene(scene);
      game.addSystem(0, system);
      game.registerEntity(0, TestSystem, 0);
    }

    public canStartStop()
    {
      let game = new Game();

      if(game.engine.isRunning)
      {
        throw new Error("engine started to early");
      }

      game.start();
      if(!game.engine.isRunning)
      {
        throw new Error("engine did not start");
      }

      game.stop();
      if(game.engine.isRunning)
      {
        throw new Error("engine did not stop");
      }
    }
  }
}
