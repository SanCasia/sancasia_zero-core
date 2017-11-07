namespace sczCore
{
  export interface Scene
  {
    addSystem(system: System): void;
    activate(): void;
    deactivate(): void;
    readonly isActive: boolean;
  }

  export enum SceneAction
  {
    Activate,
    Deactivate
  }

  export class SceneBase implements Scene
  {
    protected readonly id: number;
    protected systems: Map<Function, System>;
    protected eventBus: EventBus;
    public static event = "event_scene_change";
    protected _isActive: boolean;

    constructor(id: number, eventBus: EventBus)
    {
      this.id = id;
      this.eventBus = eventBus;
      this.eventBus.subscribe(SceneBase.event, this.sceneChangeListener);
      this.systems = new Map<Function, System>();
    }

    public getId()
    {
      return this.id;
    }

    public get isActive()
    {
      return this._isActive;
    }

    public addSystem(system: System): void
    {
      this.systems.set(system.constructor, system);
    }

    public hasSystem(system: Function)
    {
      return this.systems.has(system);
    }

    public removeSystem(system: Function)
    {
      this.systems.delete(system);
    }

    public activate(): void
    {
      for(let system of this.systems.values())
      {
        if(!system.isActive)
        {
          system.activate();
        }
      }
      this._isActive = true;
    }

    public deactivate(): void
    {
      for(let system of this.systems.values())
      {
        if(system.isActive)
        {
          system.deactivate();
        }
      }
      this._isActive = false;
    }

    protected sceneChangeListener =
      ([id, action]: [number, SceneAction]): void =>
    {
      if(this.id != id)
      {
        return;
      }

      if(action == SceneAction.Activate)
      {
        this.activate();
      }
      else
      {
        this.deactivate();
      }
    }
  }
}
