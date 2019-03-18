/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  class TestSystem implements System
  {
    public value: number;
    constructor(eventBus: EventBus)
    {
      this.value = 0;
      eventBus.subscribe(EngineEvent.PreComputation, () => {
        this.value = 5;
      });
      eventBus.subscribe(EngineEvent.Computation, () => {
        this.value *= 10;
      });
      eventBus.subscribe(EngineEvent.PostComputation, () => {
        this.value += 50;
      });
      eventBus.subscribe(EngineEvent.Render, () => {
        this.value /= 25;
      });
      eventBus.subscribe(EngineEvent.PostRender, () => {
        this.value -= 3;
      });
    }

    // ignore
    isActive: boolean;
    public activate(): void {
      throw new Error("Method not implemented.");
    }
    public deactivate(): void {
      throw new Error("Method not implemented.");
    }
    public registerEntity(_: Entity): void {
      throw new Error("Method not implemented.");
    }
    hasEntityRegistered(_: number): boolean {
      throw new Error("Method not implemented.");
    }
    public deregisterEntity(_: number): void {
      throw new Error("Method not implemented.");
    }
    public process(_: number): void {
      throw new Error("Method not implemented.");
    }
  }

  export class EngineTests
  {
    public static canStart()
    {

      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new TestSystem(eventBus);

      engine.start();
      if(!engine.isRunning)
      {
        throw new Error("engine not running after start");
      }

      system.value = 3.141;

      setTimeout(() => {
        if(system.value == 3.141)
        {
          throw new Error("engine event not called after start");
        }
      }, 1000);
    }

    public static canTellIfRunning()
    {

      let eventBus = new EventBus();
      let engine = new Engine(eventBus);

      if(engine.isRunning)
      {
        throw new Error("engine running before start");
      }

      engine.start();

      if(!engine.isRunning)
      {
        throw new Error("engine not running after start");
      }

      engine.stop();

      if(engine.isRunning)
      {
        throw new Error("engine not stopped after stop");
      }
    }

    public static canStop()
    {

      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new TestSystem(eventBus);

      if(engine.isRunning)
      {
        throw new Error("engine running before start");
      }

      engine.start();

      engine.stop();

      if(engine.isRunning)
      {
        throw new Error("engine did not stop");
      }

      system.value = 3.141;
      setTimeout(() => {
        if(system.value != 3.141)
        {
          throw new Error("engine event called after stop");
        }
      }, 1000);
    }

    public static canRun()
    {
      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new TestSystem(eventBus);

      engine.start();
      setTimeout(() => {
        engine.stop();
        if(system.value != 1)
        {
          throw new Error("engine events not called in correct oreder");
        }
      }, 1000);
    }

    public static canCalculateDeltaTime()
    {
      let eventBus = new EventBus();
      let engine = new Engine(eventBus);

      eventBus.subscribe(EngineEvent.Computation, (deltaTime: number) => {
        if(deltaTime <= 0)
        {
          throw new Error(`engine cannot calculate delta time. value is ${deltaTime}`);
        }
        engine.stop();
      })

      engine.start();
    }
  }
}
