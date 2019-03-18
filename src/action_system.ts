/// <reference path="./system.ts" />

namespace sczCore
{

  export abstract class ActionSystem extends SystemBase
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
      super(
        requiredComponentsInEntities,
        eventBus,
        EngineEvent.Computation);

      this.events = listensTo;
      this.actionQueue = new Array<ActionEvent>();
    }

    public activate(): void
    {
      super.activate();

      for(let event of this.events)
      {
        this.eventBus.subscribe(event, this.queueEvent);
      }

      this._isActive = true;
    }

    public deactivate(): void
    {
      super.deactivate();

      for(let event of this.events)
      {
        this.eventBus.unsubscribe(event, this.queueEvent);
      }

      this._isActive = false;
    }

    protected queueEvent = (actionEvent: ActionEvent): void =>
    {
      this.actionQueue.push(actionEvent);
    }

    public process(deltaTime: number): void
    {
      super.process(deltaTime);
      this.actionQueue = new Array();
    }

    protected processEntity(
      deltaTime: number,
      components: Array<Component>)
    {
      let actionQueue = [...this.actionQueue];
      while(actionQueue.length > 0)
      {
        let event = actionQueue.shift();
        this.processEvent(deltaTime, components, event);
      }
    }

    protected abstract processEvent(
      deltaTime: number,
      components: Array<Component>,
      actionEvent: ActionEvent): void;
  }
}
