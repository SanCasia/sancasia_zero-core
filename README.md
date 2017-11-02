# Scz-Core
SanCasia Version Zero Core: The Core of SanCasia Zero

SanCasia Zero is based on the Entity Component Systems [1] principles.
SCZ is by far not the only game engine which is based upon an ECS and that's okay. In addition it relays on en EventBus for communication, further decoupling dependencies. These two concepts combined allow an interesting degree of independence between components.

SanCasia Zero is a Proof of Concept and performance is none of its concerns.

## Event Bus
An Event Bus is a software component which provides a communication channel. The concept is based on publishers and subscribers. The publisher publishes events through the event bus which will be received by all subscribers currently subscribed to this event type. Since nether publisher nor subscriber need to know each other, decoupled communication is achieved.
