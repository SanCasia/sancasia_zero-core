/// <reference path="./prop.ts" />


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

  export abstract class SystemBase extends PropBase implements System
  {
    protected entities: Map<number, Entity>;
    protected requires: Array<Function>;
    
    constructor(
      requires: Array<Function>,
      eventbus: EventBus, event: EngineEvent)
    {
      super(eventbus, event);
      this.requires = requires;
      this.entities = new Map<number, Entity>();
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
