namespace sczCore
{

  export abstract class ActionSystem implements System
  {
    protected actionQueue: Array<ActionEvent>;
    protected entities: Map<number, Entity>;
    protected requires: Array<Function>;
    protected eventBus: EventBus;
    protected event: EngineEvent;
    protected events: Array<string>;
    protected _isActive: boolean;

    public get isActive(): boolean
    {
      return this._isActive;
    }

    constructor(
      requiredComponentsInEntities: Array<Function>,
      listensTo: Array<string>,
      eventBus: EventBus)
    {

      this.requires = requiredComponentsInEntities;
      this.events = listensTo;
      this.entities = new Map<number, Entity>();
      this.actionQueue = new Array<ActionEvent>();

      this.eventBus = eventBus;
      this.event = EngineEvent.Computation;
    }

    public activate(): void
    {
      this.eventBus.subscribe(this.event, this.process);

      for(let event of this.events)
      {
        this.eventBus.subscribe(event, this.queueEvent);
      }

      this._isActive = true;
    }

    public deactivate(): void
    {
      this.eventBus.unsubscribe(this.event, this.process);
      for(let event of this.events)
      {
        this.eventBus.unsubscribe(event, this.queueEvent);
      }

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

    private queueEvent = (actionEvent: ActionEvent): void =>
    {
      this.actionQueue.push(actionEvent);
    }

    public process = (deltaTime: number): void =>
    {
      for(let entity of this.entities.values())
      {
        let actionQueue = [...this.actionQueue];
        let cache = entity.getCache(this);
        while(actionQueue.length > 0)
        {
          let event = actionQueue.shift();
          this.processEntity(deltaTime, cache, event);
        }
        entity.updateCache(this, cache);
      }
      this.actionQueue = new Array();
    }

    protected abstract processEntity(
      deltaTime: number,
      components: Array<Component>,
      actionEvent: ActionEvent): void;
  }
}
