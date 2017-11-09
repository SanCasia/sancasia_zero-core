namespace sczCore
{
  export interface System
  {
    activate(): void;
    deactivate(): void;
    readonly isActive: boolean;
    registerEntity(entity: Entity):void;
    deregisterEntity(id: number): void;
    process(deltaTime: number): void;
  }

  export abstract class SystemBase implements System
  {
    protected entities: Map<number, Entity>;
    protected requires: Array<Function>;
    protected eventBus: EventBus;
    protected event: EngineEvent;
    protected _isActive: boolean;

    public get isActive(): boolean
    {
      return this._isActive;
    }

    constructor(
      requires: Array<Function>,
      eventBus: EventBus, event: EngineEvent)
    {

      this.requires = requires;
      this.entities = new Map<number, Entity>();

      this.eventBus = eventBus;
      this.event = event;
    }

    public activate(): void
    {
      this.eventBus.subscribe(this.event, this.process);
      this._isActive = true;
    }

    public deactivate(): void
    {
      this.eventBus.unsubscribe(this.event, this.process);
      this._isActive = false;
    }

    public registerEntity(entity: Entity): void
    {
      entity.createCache(this, this.requires);
      this.entities.set(entity.getId(), entity);
    }

    public deregisterEntity(id: number): void
    {
      let entity = this.entities.get(id);
      entity.deleteCache(this);
      this.entities.delete(id);
    }

    public process = (deltaTime: number): void =>
    {
      for(let entity of this.entities.values())
      {
        let cache = entity.getCache(this);
        this.processEntity(deltaTime, cache);
        entity.updateCache(this, cache);
      };
    }

    protected abstract processEntity(
      deltaTime: number, requires: Array<Component>): void;
  }
}
