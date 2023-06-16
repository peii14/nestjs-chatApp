import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class PubSubService implements OnModuleInit {

  private pubSubClient: PubSub;
  private subscriptionName = 'prediction_result';

  constructor(private readonly eventBus: EventBus) {
    this.pubSubClient = new PubSub();
  }

  onModuleInit() {
    this.listenForMessages();
  }

  async listenForMessages() {
    const subscription = this.pubSubClient.subscription(this.subscriptionName);

    const messageHandler = (message) => {
      console.log(`Received message: ${message.id}`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);

      this.eventBus.publish({
        type: 'prediction_result_received',
        data: message.data.toString(),
      });

      message.ack();
    };

    subscription.on('message', messageHandler);
  }
}
