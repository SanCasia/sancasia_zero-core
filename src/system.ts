namespace sczCore
{
  export interface System extends Prop
  {
    activate(): void;
    deactivate(): void;
    readonly isActive: boolean;
    registerEntity(entity: Entity):void;
    hasEntityRegistered(entityId: number): boolean;
    deregisterEntity(entityId: number): void;
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
      this.eventBus.subscribe(this.event, this._process);
      this._isActive = true;
    }

    public deactivate(): void
    {
      this.eventBus.unsubscribe(this.event, this._process);
      this._isActive = false;
    }

    public registerEntity(entity: Entity): void
    {
      if(this.hasEntityRegistered(entity.getId()))
      {
        throw new Error(`entity [${entity.getId()}] already registered`);
      }
      entity.createCache(this, this.requires);
      this.entities.set(entity.getId(), entity);
    }

    public hasEntityRegistered(entityId: number): boolean
    {
      return this.entities.has(entityId);
    }

    public deregisterEntity(entityId: number): void
    {
      let entity = this.entities.get(entityId);
      entity.deleteCache(this);
      this.entities.delete(entityId);
    }

    // workaround for "fat arrow is member function"
    protected _process = (deltaTime: number) => {this.process(deltaTime);}

    public process(deltaTime: number): void
    {
      for(let entity of this.entities.values())
      {
        let cache = entity.getCache(this);
        this.processEntity(deltaTime, cache);
        entity.updateCache(this, cache);
      };
    }

    protected abstract processEntity(
      deltaTime: number, components: Array<Component>): void;
  }
}
