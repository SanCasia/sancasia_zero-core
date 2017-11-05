namespace sczCore
{
  export class Entity
  {
    private id: number;
    private components: Map<Function, Component>;
    private cache: Map<any, Array<Component>>;

    public constructor(id: number)
    {
      this.id = id;
      this.components = new Map<Function, Component>();
      this.cache = new Map<any, Array<Component>>();
    }

    public getId(): number
    {
      return this.id;
    }

    public addComponent(component: Component): void
    {
      if(null == component)
      {
        throw new Error("component must not be null");
      }

      let type = component.constructor;
      if(this.hasComponent(type))
      {
        throw new Error("component already present");
      }

      this.components.set(type, component.clone());
    }

    public hasComponent(type: Function): boolean
    {
      return this.components.has(type);
    }

    public getComponent(type: Function): Component
    {
      let component = this.components.get(type);
      return component.clone();
    }

    public updateComponent(component: Component): void{
      if(null == component)
      {
        throw new Error("component must not be null");
      }

      let type = component.constructor;

      if(!this.hasComponent(type))
      {
        throw new Error("component not present");
      }

      let local = this.components.get(type);
      local.assign(component);
    }

    public deleteComponent(type: Function): void
    {
      this.components.delete(type);
    }

    public createCache(key: any, components: Array<Function>): void
    {
      let cache = new Array<Component>();

      for(let component of components)
      {
        cache.push(this.components.get(component));
      }
      this.cache.set(key, cache);
    }

    public hasCache(key: any): boolean
    {
      return this.cache.has(key);
    }

    public getCache(key: any): Array<Component>
    {
      let local = this.cache.get(key);
      let clone = new Array<Component>();
      for(let entry of local)
      {
        clone.push(entry.clone());
      }

      return clone;
    }

    public updateCache(key: any, components: Array<Component>): void
    {
      let cache = this.cache.get(key);
      for(let i in cache)
      {
        cache[i].assign(components[i]);
      }
    }

    public deleteCache(key: any): void
    {
      this.cache.delete(key);
    }
  }
}
