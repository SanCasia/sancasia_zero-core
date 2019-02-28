namespace sczCore
{
  export interface Prop
  {
    activate(): void;
    deactivate(): void;
    readonly isActive: boolean;
  }
}
