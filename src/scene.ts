namespace sczCore
{
  export interface Scene
  {
    getId(): number;
    addSystem(system: System): void;
    hasSystem(systemType: Function): boolean;
    getSystem(systemType: Function): System;
    removeSystem(systemType: Function): void;
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
    protected _isActive: boolean;

    constructor(id: number, eventBus: EventBus)
    {
      this.id = id;
      this.eventBus = eventBus;
      this.eventBus.subscribe(
        EngineEvent.SceneChange,
        this.sceneChangeListener);
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
      if(this.hasSystem(system.constructor))
      {
        throw new Error(
          `scene already has this type of system: ${system.constructor}`);
      }

      this.systems.set(system.constructor, system);
    }

    public hasSystem(systemType: Function)
    {
      return this.systems.has(systemType);
    }

    public getSystem(systemType: Function): System
    {
      if(!this.hasSystem(systemType))
      {
        throw new Error(`scene has no such system: ${systemType}`);
      }
      
      return this.systems.get(systemType);
    }

    public removeSystem(systemType: Function)
    {
      if(!this.hasSystem(systemType))
      {
        throw new Error(`scene has no such system: ${systemType}`);
      }

      this.systems.delete(systemType);
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
