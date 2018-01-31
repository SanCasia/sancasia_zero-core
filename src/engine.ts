namespace sczCore
{
  export enum EngineEvent
  {
      SceneChange = "ENGINE_EVENT::SCENE_CHANGE",
      PreComputation = "ENGINE_EVENT::PRE_COMPUTATION",
      Computation = "ENGINE_EVENT::COMPUTATION",
      PostComputation = "ENGINE_EVENT::POST_COMPUTATION",
      Render = "ENGINE_EVENT::RENDER",
      PostRender = "ENGINE_EVENT::POST_RENDER",
  }

  export class Engine
  {
    protected eventBus: EventBus;
    private timeAtLastFrame: number;
    private _isRunning: boolean;

    public constructor(eventBus: EventBus)
    {
      if(eventBus == null)
      {
          throw new Error("event bus must not be null");
      }

      this.eventBus = eventBus;
      this._isRunning = false;
      this.timeAtLastFrame = new Date().getTime();
    }

    public getEventBus()
    {
      return this.eventBus;
    }

    public get isRunning ()
    {
      return this._isRunning;
    }

    public start()
    {
      this._isRunning = true;
      window.requestAnimationFrame(this.engineLoop);
    }

    public stop()
    {
      this._isRunning = false;
    }

    private engineLoop = () =>
    {
      let currentTime = new Date().getTime();
      let deltaTime = currentTime - this.timeAtLastFrame;
      this.timeAtLastFrame = currentTime;

      this.eventBus.publish(EngineEvent.PreComputation, deltaTime);
      this.eventBus.publish(EngineEvent.Computation, deltaTime);
      this.eventBus.publish(EngineEvent.PostComputation, deltaTime);
      this.eventBus.publish(EngineEvent.Render, deltaTime);
      this.eventBus.publish(EngineEvent.PostRender, deltaTime);

      if(this.isRunning)
      {
        window.requestAnimationFrame(this.engineLoop);
      }
    }
  }
}
