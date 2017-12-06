namespace sczCore
{
  export class Game
  {
    protected eventBus: EventBus;
    protected engine: Engine;
    protected entities: Map<number, Entity>;
    protected scenes: Map<number, Scene>;

    public constructor(eventBus?: EventBus)
    {
      if(eventBus == null)
      {
        eventBus = new EventBus();
      }

      this.eventBus = eventBus;
      this.engine = new Engine(this.eventBus);
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

    public addSystem(sceneId: number, system: System): void
    {
      if(!this.hasScene(sceneId))
      {
        throw new Error("there is no system registered with that id");
      }

      if(system == null)
      {
        throw new Error("system cannot be null");
      }

      this.getScene(sceneId).addSystem(system);
    }

    public hasSystem(sceneId: number, systemType: Function): boolean
    {
      let scene = this.getScene(sceneId);
      return scene.hasSystem(systemType);
    }

    public getSystem(sceneId: number, systemType: Function): System
    {
      let scene = this.getScene(sceneId);
      return scene.getSystem(systemType);
    }

    public removeSystem(sceneId: number, systemType: Function): void
    {
        let scene = this.getScene(sceneId);
        scene.removeSystem(systemType);
    }

    public registerEntity(
      sceneId: number, systemType: Function, entityId: number): void
    {
      let entity = this.getEntity(entityId);
      let system = this.getSystem(sceneId, systemType);
      system.registerEntity(entity);
    }

    public deregisterEntity(
      sceneId: number, systemType: Function, entityId: number): void
    {
      let system = this.getSystem(sceneId, systemType);
      system.deregisterEntity(entityId);
    }

    public hasEntityRegistered(
      sceneId: number, systemType: Function, entityId: number): boolean
    {
      let system = this.getSystem(sceneId, systemType);
      return system.hasEntityRegistered(entityId);
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
        this.engine.start();
    }

    public stop(): void
    {
      this.engine.stop();
    }
  }
}
