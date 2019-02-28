namespace sczCore
{
  export class Game
  {
    protected eventBus: EventBus;
    protected _engine: Engine;
    protected entities: Map<number, Entity>;
    protected scenes: Map<number, Scene>;

    public constructor(eventBus?: EventBus)
    {
      if(eventBus == null)
      {
        eventBus = new EventBus();
      }

      this.eventBus = eventBus;
      this._engine = new Engine(this.eventBus);
      this.entities = new Map<number, Entity>();
      this.scenes = new Map<number, Scene>();
    }

    public getEventBus(): EventBus
    {
      return this.eventBus;
    }

    public addEntity(entity: Entity): void
    {
      if(entity == null)
      {
        throw new Error("entity cannot be null");
      }

      if(this.hasEntity(entity.getId()))
      {
        throw new Error("an entity with this id has already been registered");
      }

      this.entities.set(entity.getId(), entity);
    }

    public hasEntity(entityId: number): boolean
    {
      return this.entities.has(entityId);
    }

    public getEntity(entityId: number): Entity
    {
      if(!this.hasEntity(entityId))
      {
        throw new Error(`entity [${entityId}] not registered`);
      }

      return this.entities.get(entityId);
    }

    public removeEntity(entityId: number): void
    {
      if(!this.hasEntity(entityId))
      {
        throw new Error(`no entity registered with id ${entityId}`);
      }

      this.entities.delete(entityId);
    }

    public addScene(scene: Scene): void
    {
      if(scene == null)
      {
        throw new Error("scene cannot be null");
      }

      if(this.hasScene(scene.getId()))
      {
        throw new Error("a scene with this id has already been registered");
      }

      this.scenes.set(scene.getId(), scene);
    }

    public hasScene(scenesId: number): boolean
    {
      return this.scenes.has(scenesId);
    }

    public getScene(sceneid: number): Scene
    {
      if(!this.hasScene(sceneid))
      {
        throw new Error(`scene [${sceneid}] not registered`);
      }

      return this.scenes.get(sceneid);
    }

    public removeScene(scenesId: number): void
    {
      if(!this.hasScene(scenesId))
      {
        throw new Error(`no scene registered with id ${scenesId}`);
      }

      this.scenes.delete(scenesId);
    }

    public activateScene(sceneId: number): void
    {
      this.eventBus.publish(
        EngineEvent.SceneChange, [sceneId, SceneAction.Activate]);
    }

    public deactivateScene(sceneId: number): void
    {
      this.eventBus.publish(
        EngineEvent.SceneChange, [sceneId, SceneAction.Deactivate]);
    }

    public start(): void
    {
        this._engine.start();
    }

    public stop(): void
    {
      this._engine.stop();
    }

    public get engine(): Engine
    {
      return this._engine;
    }
  }
}
