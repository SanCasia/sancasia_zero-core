namespace sczCore
{
  export abstract class Component
  {
    public clone(): Component
    {
      let clone = Object.create(this);
      Object.assign(clone, this);
      return clone;
    }

    public assign(component: Component)
    {
      return Object.assign(this, component);
    }
  }
}
