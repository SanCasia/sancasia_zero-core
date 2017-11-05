/// <reference path="../obj/sancasia_zero_core" />


namespace sczCore.tests
{
  class TestComponent extends Component
  {
    public testValue: string;
  }

  export class ComponentTests
  {
    public canClone()
    {
      let original = new TestComponent();
      original.testValue = "3.141";

      let clone = <TestComponent> original.clone();

      if(clone == original || clone == null
        ||clone.testValue != original.testValue)
      {
        throw new Error("cloning failed");
      }
    }

    public canAssign()
    {
      let original = new TestComponent();
      original.testValue = "3.141";
      let update = new TestComponent();
      update.testValue = "pi";

      original.assign(update);

      if(update == original || update == null
        ||update.testValue != original.testValue)
      {
        throw new Error("assigning failed");
      }
    }
  }
}
