/// <reference path="../obj/sancasia_zero.core.d.ts" />


namespace sczCore.tests
{
  class TestAComponent extends Component
  {
    public testValue: string;
  }
  class TestBComponent extends Component
    {
      public testValue: string;
    }

  export class EntityTests
  {
    public static canGetId()
    {
      let entity = new Entity(3.141);
      if(entity.getId() != 3.141)
      {
        throw new Error("entity id failed");
      }
    }

    public static canAddComponent()
    {
      let entity = new Entity(0);
      let componentA = new TestAComponent();
      let componentB = new TestBComponent();

      let rA1 = entity.hasComponent(TestAComponent);
      let rB1 = entity.hasComponent(TestBComponent);

      entity.addComponent(componentA);

      let rA2 = entity.hasComponent(TestAComponent);
      let rB2 = entity.hasComponent(TestBComponent);

      entity.addComponent(componentB);

      let rA3 = entity.hasComponent(TestAComponent);
      let rB3 = entity.hasComponent(TestBComponent);

      if(rA1 || rB1 || !rA2 || rB2 || !rA3 || !rB3)
      {
        throw new Error(`function add component failed:
          ${ rA1 } ${ rB1 } ${ rA2 } ${ rB2 } ${ rA3 } ${ rB3 }`);
      }
    }

    public static canHasComponent()
    {
      let entity = new Entity(0);
      let componentA = new TestAComponent();
      let componentB = new TestBComponent();

      let rA1 = entity.hasComponent(TestAComponent);
      let rB1 = entity.hasComponent(TestBComponent);

      entity.addComponent(componentA);

      let rA2 = entity.hasComponent(TestAComponent);
      let rB2 = entity.hasComponent(TestBComponent);

      entity.addComponent(componentB);

      let rA3 = entity.hasComponent(TestAComponent);
      let rB3 = entity.hasComponent(TestBComponent);

      if(rA1 || rB1 || !rA2 || rB2 || !rA3 || !rB3)
      {
        throw new Error(`function has component failed:
          ${ rA1 } ${ rB1 } ${ rA2 } ${ rB2 } ${ rA3 } ${ rB3 }`);
      }
    }

    public static canGetComponent()
    {
      let entity = new Entity(0);
      let componentA = new TestAComponent();
      componentA.testValue = "3.141";
      let componentB = new TestBComponent();
      componentB.testValue = "pi";

      entity.addComponent(componentA);
      entity.addComponent(componentB);

      let cA = <TestAComponent> entity.getComponent(TestAComponent);
      let valueA = cA.testValue;
      let cB = <TestBComponent> entity.getComponent(TestBComponent);
      let valueB = cB.testValue;

      if(componentA.testValue != valueA || componentB.testValue != valueB)
      {
        throw new Error("function get component failed");
      }
    }

    public static canUpdateComponent()
    {
      let entity = new Entity(0);
      let component = new TestAComponent();
      component.testValue = "3.141";

      entity.addComponent(component);

      component.testValue = "pi";

      let cBefore = <TestAComponent> entity.getComponent(TestAComponent);
      let valueBefore = cBefore.testValue;

      if(component.testValue == valueBefore)
      {
        throw new Error("entity hands out direct reference");
      }

      entity.updateComponent(component);

      let cAfter = <TestAComponent> entity.getComponent(TestAComponent);
      let valueAfter = cAfter.testValue;

      if(component.testValue != valueAfter)
      {
        throw new Error(`updateing component failed:
          ${component.testValue} != ${valueAfter}`);
      }
    }

    public static canDeleteComponent()
    {
      let entity = new Entity(0);
      let componentA = new TestAComponent();
      let componentB = new TestBComponent();

      entity.addComponent(componentA);
      entity.addComponent(componentB);

      entity.deleteComponent(TestAComponent);

      let rA1 = entity.hasComponent(TestAComponent);
      let rB1 = entity.hasComponent(TestBComponent);

      entity.deleteComponent(TestBComponent);

      let rA2 = entity.hasComponent(TestAComponent);
      let rB2 = entity.hasComponent(TestBComponent);

      if(rA1 || !rB1 || rA2 || rB2)
      {
        throw new Error(`function delete component failed:
          ${ rA1 } ${ rB1 } ${ rA2 } ${ rB2 }`);
      }
    }

    public static canAddCache()
    {
      let entity = new Entity(0);
      let cacheId = 3.141;
      let component = new TestAComponent();
      entity.addComponent(component);

      let r1 = entity.hasCache(cacheId);

      entity.createCache(cacheId, [TestAComponent]);

      let r2 = entity.hasCache(cacheId);

      if(r1 || !r2)
      {
        throw new Error(`function add component failed:
          ${ r1 } ${ r2 }`);
      }
    }

    public static canHasCache()
    {
      let entity = new Entity(0);
      let cacheId = 3.141;
      let component = new TestAComponent();
      entity.addComponent(component);

      let r1 = entity.hasCache(cacheId);

      entity.createCache(cacheId, [TestAComponent]);

      let r2 = entity.hasCache(cacheId);

      if(r1 || !r2)
      {
        throw new Error(`function add component failed:
          ${ r1 } ${ r2 }`);
      }
    }

    public static canGetCache()
    {
      let entity = new Entity(0);
      let cacheId = 3.141;
      let component = new TestAComponent();
      component.testValue = "3.141";
      entity.addComponent(component);

      entity.createCache(cacheId, [TestAComponent]);

      let [c] = <[TestAComponent]> entity.getCache(cacheId);
      let value = c.testValue;

      if(component.testValue != value)
      {
        throw new Error("function get component failed");
      }
    }

    public static canUpdateCache()
    {
      let entity = new Entity(0);
      let cacheId = 3.141;
      let component = new TestAComponent();
      component.testValue = "3.141";
      entity.addComponent(component);
      entity.createCache(cacheId, [TestAComponent])

      component.testValue = "pi";

      let cBefore = <TestAComponent> entity.getComponent(TestAComponent);
      let valueBefore = cBefore.testValue;

      if(component.testValue == valueBefore)
      {
        throw new Error("component is direct reference");
      }

      entity.updateCache(cacheId, [component]);

      let cAfter = <TestAComponent> entity.getComponent(TestAComponent);
      let valueAfter = cAfter.testValue;

      if(component.testValue != valueAfter)
      {
        throw new Error("updateing cache value failed");
      }
    }

    public static canDeleteCache()
    {
      let entity = new Entity(0);
      let cacheId = 3.141;
      let component = new TestAComponent();
      entity.addComponent(component);

      entity.createCache(cacheId, [TestAComponent])

      entity.deleteCache(cacheId);

      let r1 = entity.hasCache(TestAComponent);

      if(r1)
      {
        throw new Error("function delete cache failed");
      }
    }
  }
}
