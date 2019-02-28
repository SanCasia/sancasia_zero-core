namespace sczCore
{
  export interface Scene
  {
    getId(): number;
    addProp(prop: Prop): void;
    hasProp(propType: Function): boolean;
    getProp(propType: Function): Prop;
    removeProp(propType: Function): void;
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
    protected props: Map<Function, Prop>;
    protected eventBus: EventBus;
    protected _isActive: boolean;

    constructor(id: number, eventBus: EventBus)
    {
      this.id = id;
      this.eventBus = eventBus;
      this.eventBus.subscribe(
        EngineEvent.SceneChange,
        this.sceneChangeListener);
      this.props = new Map<Function, Prop>();
    }

    public getId()
    {
      return this.id;
    }

    public get isActive()
    {
      return this._isActive;
    }

    public addProp(prop: Prop): void
    {
      if(this.hasProp(prop.constructor))
      {
        throw new Error(
          `scene already has this type of prop: ${prop.constructor}`);
      }

      this.props.set(prop.constructor, prop);
    }

    public hasProp(propType: Function)
    {
      return this.props.has(propType);
    }


    public getProp(propType: Function): Prop
    {
      if(!this.hasProp(propType))
      {
        throw new Error(`scene has no such prop: ${propType}`);
      }

      return this.props.get(propType);
    }

    public removeProp(propType: Function)
    {
      if(!this.hasProp(propType))
      {
        throw new Error(`scene has no such prop: ${propType}`);
      }

      this.props.delete(propType);
    }

    public activate(): void
    {
      for(let system of this.props.values())
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
      for(let system of this.props.values())
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
