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
    public deregisterEntity(_: number): void {
      throw new Error("Method not implemented.");
    }
    public process(_: number): void {
      throw new Error("Method not implemented.");
    }


  }

  export class EngineTests
  {
    public canStart()
    {

      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new TestSystem(eventBus);

      engine.start();
      if(!engine.isRunning)
      {
        throw new Error("engine not running after start");
      }

      setTimeout(1000, () => {
        system.value = 3.141;

        setTimeout(1000, () => {
          if(system.value == 3.141)
          {
            throw new Error("engine event not called after stop");
          }
        });
      });

      engine.stop();
    }

    public canTellIfRunning()
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

    public canStop()
    {

      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new TestSystem(eventBus);

      if(!engine.isRunning)
      {
        throw new Error();
      }

      engine.start();

      engine.stop();

      if(engine.isRunning)
      {
        throw new Error("engine did not stop");
      }

      setTimeout(1000, () => {
        system.value = 3.141;
        setTimeout(1000, () => {
          if(system.value != 3.141)
          {
            throw new Error("engine event called after stop");
          }
        });

      });
    }

    public canRun()
    {
      let eventBus = new EventBus();
      let engine = new Engine(eventBus);
      let system = new TestSystem(eventBus);

      engine.start();
      setTimeout(1000, () => {
        engine.stop();
        if(system.value != 1)
        {
          throw new Error("engine events not called in correct oreder");
        }
      });
    }
  }
}
