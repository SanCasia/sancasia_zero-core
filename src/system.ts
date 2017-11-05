namespace sczCore
{
  export interface System
  {
    registerEntity(entity: Entity):void;
    deregisterEntity(id: number): void;
    process(deltaTime: number): void;
  }

  export abstract class SystemBase implements System
  {
    protected entities: Map<number, Entity>;
    protected components: Array<Function>;
    protected eventBus: EventBus;
    protected event: string;

    constructor(components: Array<Function>, eventBus: EventBus, event: string)
    {
      this.components = components;
      this.entities = new Map<number, Entity>();

      this.eventBus = eventBus;
      this.event = event;
    }

    public activate(): void
    {
      this.eventBus.subscribe(this.event, this.process);
    }

    public deactivate(): void
    {
      this.eventBus.unsubscribe(this.event, this.process);
    }

    public registerEntity(entity: Entity): void
    {
      entity.createCache(this, this.components);
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
      deltaTime: number, components: Array<Component>): void;
  }
}
