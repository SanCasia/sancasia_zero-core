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
    public static canCreate()
    {
      new Game();
    }

    public static canGetEventBus()
    {
      let game = new Game();
      let eventBus = game.getEventBus();

      if(eventBus == null)
      {
        throw new Error("cannot get event bus");
      }
    }

    public static canStartStop()
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


    // entities
    public static canAddEntities()
    {
      let game = new Game();
      game.addEntity(new Entity(0));
      if(!game.hasEntity(0))
      {
        throw new Error("entity not visible");
      }

      let exeptionThrown = false;
      try
      {
        game.addEntity(new Entity(0));
      }
      catch(Error)
      {
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("entity double registration not detected");
      }
    }

    public static canHasEntities()
    {
      let game = new Game();
      game.addEntity(new Entity(0));
      if(!game.hasEntity(0))
      {
        throw new Error("entity [0] not visible");
      }

      game.addEntity(new Entity(1));
      if(!game.hasEntity(1))
      {
        throw new Error("entity [1] not visible");
      }

      game.removeEntity(0);
      if(game.hasEntity(0))
      {
        throw new Error("entity [0] not delted");
      }

      game.removeEntity(1);
      if(game.hasEntity(1))
      {
        throw new Error("entity [1] not delted");
      }
    }

    public static canGetEntities()
    {
      let game = new Game();
      game.addEntity(new Entity(0));
      game.addEntity(new Entity(1));
      if(game.getEntity(0).getId() != 0)
      {
        throw new Error("could not get entity");
      }

      if(game.getEntity(1).getId() != 1)
      {
        throw new Error("could not get entity");
      }
    }

    public static canRemoveEntities()
    {
      let game = new Game();
      game.addEntity(new Entity(0));
      game.addEntity(new Entity(1));

      game.removeEntity(0);
      if(game.hasEntity(0))
      {
        throw new Error("entity [0] not delted");
      }

      game.removeEntity(1);
      if(game.hasEntity(1))
      {
        throw new Error("entity [1] not delted");
      }

      let exeptionThrown = false;
      try
      {
        game.removeEntity(0);
      }
      catch(Error)
      {
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("entity double registration not detected");
      }
    }


    // scenes
    public static canAddScene()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      if(!game.hasScene(0))
      {
        throw new Error("scene [0] not visible");
      }

      game.addScene(new SceneBase(1, game.getEventBus()));
      if(!game.hasScene(1))
      {
        throw new Error("scene [1] not visible");
      }

      let exeptionThrown = false;
      try
      {
        game.addScene(new SceneBase(0, game.getEventBus()));
      }
      catch(Error)
      {
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("scene double registration not detected");
      }
    }

    public static canHasScene()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      if(!game.hasScene(0))
      {
        throw new Error("scene [0] not visible");
      }

      game.addScene(new SceneBase(1, game.getEventBus()));
      if(!game.hasScene(1))
      {
        throw new Error("scene [1] not visible");
      }

      game.removeScene(0);
      if(game.hasScene(0))
      {
        throw new Error("scene [0] not delted");
      }

      game.removeScene(1);
      if(game.hasScene(1))
      {
        throw new Error("scene [1] not delted");
      }
    }

    public static canGetScene()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addScene(new SceneBase(1, game.getEventBus()));
      if(game.getScene(0).getId() != 0)
      {
        throw new Error("could not get scene");
      }

      if(game.getScene(1).getId() != 1)
      {
        throw new Error("could not get scene");
      }

      let exeptionThrown = false;
      try
      {
        game.getScene(2);
      }
      catch(Error)
      {
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("unexpected behavior");
      }
    }

    public static canRemoveScene()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addScene(new SceneBase(1, game.getEventBus()));

      game.removeScene(0);
      if(game.hasScene(0))
      {
        throw new Error("scene [0] not delted");
      }

      game.removeScene(1);
      if(game.hasScene(1))
      {
        throw new Error("scene [1] not delted");
      }

      let exeptionThrown = false;
      try
      {
        game.removeScene(0);
      }
      catch(Error)
      {
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("scene double removal not detected");
      }
    }

    public static canActivateScene()
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


    // systems
    public static canAddSystem()
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

      let exeptionThrown = false;
      try
      {
        game.addSystem(0, system);
      }
      catch(Error)
      {
        // expected
        exeptionThrown = true;
      }

      if(!exeptionThrown)
      {
        throw new Error("doublicate system registration not detected");
      }
    }

    public static canHasSystem()
    {
      let game = new Game();

      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addSystem(0, new TestSystem(game.getEventBus()));

      if(!game.hasSystem(0, TestSystem))
      {
        throw new Error("system not visible");
      }

      game.addScene(new SceneBase(1, game.getEventBus()));
      game.addSystem(1, new TestSystem(game.getEventBus()));

      if(!game.hasSystem(1, TestSystem))
      {
        throw new Error("system not visible");
      }

      game.removeSystem(0, TestSystem);

      if(game.hasSystem(0, TestSystem))
      {
        throw new Error("system still visible");
      }

      game.removeSystem(1, TestSystem);

      if(game.hasSystem(1, TestSystem))
      {
        throw new Error("system still visible");
      }
    }

    public static canGetSystem()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addSystem(0, new TestSystem(game.getEventBus()));
      game.addScene(new SceneBase(1, game.getEventBus()));
      game.addSystem(1, new TestSystem(game.getEventBus()));

      if(game.getSystem(0, TestSystem) == null)
      {
        throw new Error("could not get system");
      }

      if(game.getSystem(1, TestSystem) == null)
      {
        throw new Error("could not get system");
      }

      game.removeSystem(0, TestSystem);
      let exeptionThrown = false;
      try
      {
        game.getSystem(0, TestSystem);
      }
      catch(Error)
      {
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("unexpected behavior");
      }
    }

    public static canRemoveSystem()
    {
      let game = new Game();
      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addSystem(0, new TestSystem(game.getEventBus()));

      game.addScene(new SceneBase(1, game.getEventBus()));
      game.addSystem(1, new TestSystem(game.getEventBus()));


      game.removeSystem(0, TestSystem);
      if(game.hasSystem(0, TestSystem))
      {
        throw new Error("system not delted");
      }

      game.removeSystem(1, TestSystem);
      if(game.hasSystem(1, TestSystem))
      {
        throw new Error("system not delted");
      }

      let exeptionThrown = false;
      try
      {
        game.removeSystem(0, TestSystem);
      }
      catch(Error)
      {
        // expected
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("system double removal not detected");
      }
    }


    // systems & entities
    public static canRegisterEntity()
    {
      let game = new Game();
      let scene = new SceneBase(0, game.getEventBus());
      let system = new TestSystem(game.getEventBus());
      let entity = new Entity(0);

      game.addEntity(entity);
      game.addScene(scene);
      game.addSystem(0, system);

      game.registerEntity(0, TestSystem, 0);

      let exeptionsThrown = false;
      try
      {
        game.registerEntity(0, TestSystem, 0);
      }
      catch(Error)
      {
        try
        {
          game.registerEntity(0, TestSystem, 1);
        }
        catch(Error)
        {
          try
          {
            game.registerEntity(0, TestSystem, 0);
          }
          catch(Error)
          {
            exeptionsThrown = true;
          }
        }
      }
      if(!exeptionsThrown)
      {
        throw new Error("system double removal not detected");
      }
    }

    public static canHasEntityRegistered()
    {
      let game = new Game();

      game.addEntity(new Entity(0));
      game.addEntity(new Entity(1));
      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addSystem(0, new TestSystem(game.getEventBus()));
      game.registerEntity(0, TestSystem, 0);

      if(!game.hasEntityRegistered(0, TestSystem, 0))
      {
        throw new Error("entity not visible");
      }

      game.registerEntity(0, TestSystem, 1);

      if(!game.hasEntityRegistered(0, TestSystem, 1))
      {
        throw new Error("entity not visible");
      }

      game.deregisterEntity(0, TestSystem, 0);

      if(game.hasEntityRegistered(0, TestSystem,0))
      {
        throw new Error("entity still visible");
      }

      game.deregisterEntity(0, TestSystem, 1);

      if(game.hasEntityRegistered(0, TestSystem, 0))
      {
        throw new Error("entity still visible");
      }
    }

    public static canDeregisterEntity()
    {
      let game = new Game();
      game.addEntity(new Entity(0));
      game.addEntity(new Entity(1));
      game.addScene(new SceneBase(0, game.getEventBus()));
      game.addSystem(0, new TestSystem(game.getEventBus()));
      game.registerEntity(0, TestSystem, 0);
      game.registerEntity(0, TestSystem, 1);
      game.deregisterEntity(0, TestSystem, 0);

      if(game.hasEntityRegistered(0, TestSystem,0))
      {
        throw new Error("entity still visible");
      }

      game.deregisterEntity(0, TestSystem, 1);

      if(game.hasEntityRegistered(0, TestSystem, 0))
      {
        throw new Error("entity still visible");
      }

      let exeptionThrown = false;
      try
      {
        game.deregisterEntity(0, TestSystem, 0);
      }
      catch(Error)
      {
        // expected
        exeptionThrown = true;
      }
      if(!exeptionThrown)
      {
        throw new Error("entity double removal not detected");
      }
    }
  }
}
