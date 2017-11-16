namespace test
{
  export class TestRunner
  {
    protected suites: Map<Function, Array<Function>>;

    public constructor(namespace: any)
    {
      this.suites = new Map<Function, Array<Function>>();

      for(let suite_name in namespace)
      {
        let suite = namespace[suite_name];
        this.suites.set(suite, new Array<Function>());

        for(let test_name of Object.getOwnPropertyNames(suite))
        {
          /*
          console.log("suite_name: " + suite_name);
          console.log("suite: " + suite);
          console.log("suite props: "+ Object.getOwnPropertyNames(suite));
          console.log("test_name: " + test_name);
          console.log("test: " + suite[test_name]);
          */

          if(
            test_name === "prototype"
            || test_name === "length"
            || test_name === "name")
          {
            continue;
          }


          this.suites.get(suite).push(suite[test_name]);
        }
      }
    }

    public run(
      started: (suite: Function, test: Function) => void,
      finished: (suite: Function, test: Function, error ?: Error) => void)
    {
      this.suites.forEach((tests: Array<Function>, suite: Function) =>
      {
        tests.forEach((test: Function) =>
        {
          started(suite, test);

          try
          {
            test();
          }
          catch(error)
          {
            finished(suite, test, error);
            return;
          }
          finished(suite, test);
        });
      });
    }
  }
}
